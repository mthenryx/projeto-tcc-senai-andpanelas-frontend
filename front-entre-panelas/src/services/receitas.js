import { authService } from './authService'
import { fetchComTimeout } from './apiFetch'

const BASE_URL = import.meta.env.VITE_API_URL
const url = `${BASE_URL}/receitas`

async function request(fullUrl, { method = 'GET', dados, jwt, fallbackError } = {}) {
  const token = jwt || authService.getToken()
  const headers = {}

  if (dados !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers, ...(method === 'GET' ? { cache: 'no-store' } : {}) }
  if (dados !== undefined) options.body = JSON.stringify(dados)

  const response = await fetchComTimeout(fullUrl, options)
  const data = await response.json().catch(() => null)

  if (!response.ok || (data && data.status === false)) {
    const detalhe = data?.field ? ` Campo: ${data.field}.` : ''
    const mensagem = data?.message || fallbackError || 'Não foi possível concluir a requisição.'
    const erro = new Error(`${mensagem}${detalhe}`)
    erro.status = response.status
    erro.resposta = data
    throw erro
  }

  return data ?? true
}

export async function getListarReceitas(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`${url}${query ? `?${query}` : ''}`, {
    fallbackError: 'Erro ao listar as receitas!'
  })
}

export async function postReceita(dados, jwt) {
  return request(url, {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao criar uma nova receita!'
  })
}

const extrairCatalogo = (resposta, chave) => {
  const dados = resposta?.response?.[chave]
  return Array.isArray(dados) ? dados : []
}

const normalizarTextoCatalogo = (valor) => String(valor ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR')
  .trim()

const escolherItemCatalogo = (lista, valores, campoNome) => {
  const candidatos = (Array.isArray(valores) ? valores : [valores])
    .map(valor => {
      if (valor && typeof valor === 'object') {
        return valor[campoNome] ?? valor.nome ?? valor.nome_tag ?? valor.unidade ?? valor.numero_porcao
      }
      return valor
    })
    .filter(valor => valor !== undefined && valor !== null && String(valor).trim())
    .map(normalizarTextoCatalogo)

  const valoresOriginais = Array.isArray(valores) ? valores : [valores]
  const porId = lista.find(item => valoresOriginais.some(valor => {
    const id = valor && typeof valor === 'object' ? valor.id : valor
    return id !== undefined && id !== null && /^\d+$/.test(String(id).trim()) && Number(item.id) === Number(id)
  }))
  if (porId) return porId

  const encontrado = lista.find(item => candidatos.includes(normalizarTextoCatalogo(item[campoNome])))
  return encontrado || lista[0] || null
}

const extrairQuantidadePorcao = (valor) => {
  const valores = Array.isArray(valor) ? valor : [valor]
  for (const item of valores) {
    const conteudo = item && typeof item === 'object'
      ? item.numero_porcao ?? item.porcao ?? item.quantidade ?? item.nome
      : item
    const correspondencia = String(conteudo ?? '').match(/\d+(?:[.,]\d+)?/)
    if (correspondencia) return Number(correspondencia[0].replace(',', '.'))
  }
  return null
}

const normalizarTempoReceita = (valor) => {
  const texto = String(valor ?? '').trim().toLocaleLowerCase('pt-BR')
  const formatoHora = texto.match(/^(\d{1,3}):(\d{2})(?::(\d{2}))?$/)

  if (formatoHora) {
    const horas = Number(formatoHora[1])
    const minutos = Number(formatoHora[2])
    const segundos = Number(formatoHora[3] || 0)
    if (minutos < 60 && segundos < 60) {
      return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`
    }
  }

  const horas = Number(texto.match(/(\d+)\s*(?:h|hora|horas)/)?.[1] || 0)
  const minutos = Number(texto.match(/(\d+)\s*(?:m|min|minuto|minutos)/)?.[1] || 0)
  const apenasNumero = texto.match(/^\d+$/)
  const totalMinutos = horas * 60 + minutos + (apenasNumero ? Number(apenasNumero[0]) : 0)

  if (totalMinutos > 0) {
    const horasConvertidas = Math.floor(totalMinutos / 60)
    const minutosConvertidos = totalMinutos % 60
    return `${String(horasConvertidas).padStart(2, '0')}:${String(minutosConvertidos).padStart(2, '0')}:00`
  }

  return '00:30:00'
}

const resolverUnidadeSugestao = (ingrediente, unidades) => {
  const valorRecebido = ingrediente?.unidade_medida ?? ingrediente?.unidade ?? ingrediente?.id_unidade_medida
  const idRecebido = Number(valorRecebido && typeof valorRecebido === 'object' ? valorRecebido.id : valorRecebido)
  if (Number.isInteger(idRecebido) && idRecebido > 0) {
    const porId = unidades.find(unidade => Number(unidade.id) === idRecebido)
    if (porId) return porId
  }

  const textoRecebido = normalizarTextoCatalogo(
    valorRecebido && typeof valorRecebido === 'object'
      ? valorRecebido.unidade ?? valorRecebido.nome
      : valorRecebido
  )
  const porNome = unidades.find(unidade => normalizarTextoCatalogo(unidade.unidade) === textoRecebido)
  if (porNome) return porNome

  const quantidade = String(ingrediente?.quantidade ?? '').trim().toLocaleLowerCase('pt-BR')
  const unidadeInferida = [...unidades]
    .sort((a, b) => String(b.unidade ?? '').length - String(a.unidade ?? '').length)
    .find(unidade => {
      const nomeUnidade = String(unidade.unidade ?? '').trim()
      if (!nomeUnidade) return false
      const sufixo = new RegExp(`${String(nomeUnidade).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i')
      return sufixo.test(quantidade)
    })
  if (unidadeInferida) return unidadeInferida

  return unidades.find(unidade => normalizarTextoCatalogo(unidade.unidade) === 'un') || unidades[0] || null
}

export async function postSalvarSugestaoChefinho(receita, jwt) {
  if (!receita || typeof receita !== 'object') {
    throw new Error('A sugestão do Chefinho não está disponível.')
  }

  const [categoriasRes, dificuldadesRes, custosRes, porcoesRes, unidadesRes] = await Promise.all([
    request(`${BASE_URL}/categoria`, { jwt, fallbackError: 'Não foi possível consultar as categorias.' }),
    request(`${BASE_URL}/dificuldade`, { jwt, fallbackError: 'Não foi possível consultar as dificuldades.' }),
    request(`${BASE_URL}/custo`, { jwt, fallbackError: 'Não foi possível consultar os custos.' }),
    request(`${BASE_URL}/porcao`, { jwt, fallbackError: 'Não foi possível consultar as porções.' }),
    request(`${BASE_URL}/unidade_medida`, { jwt, fallbackError: 'Não foi possível consultar as unidades de medida.' })
  ])

  const categorias = extrairCatalogo(categoriasRes, 'categoria')
  const dificuldades = extrairCatalogo(dificuldadesRes, 'dificuldade')
  const custos = extrairCatalogo(custosRes, 'custo')
  const porcoes = extrairCatalogo(porcoesRes, 'porcao')
  const unidades = extrairCatalogo(unidadesRes, 'unidade_medida')

  if (!categorias.length || !dificuldades.length || !custos.length || !porcoes.length || !unidades.length) {
    throw new Error('Não foi possível validar os dados relacionais da sugestão nos catálogos da aplicação.')
  }

  const categoriaRecebida = receita.categorias ?? receita.categoria
  const categoriasRecebidas = Array.isArray(categoriaRecebida) ? categoriaRecebida : [categoriaRecebida]
  const categoriasSelecionadas = categoriasRecebidas
    .map(valor => escolherItemCatalogo(categorias, valor, 'categoria'))
    .filter((item, indice, lista) => item && lista.findIndex(outro => Number(outro.id) === Number(item.id)) === indice)
  if (!categoriasSelecionadas.length && categorias[0]) categoriasSelecionadas.push(categorias[0])
  const dificuldade = escolherItemCatalogo(dificuldades, receita.dificuldade, 'dificuldade')
  const custo = escolherItemCatalogo(custos, receita.custo, 'tipo_custo')
  const porcaoIdRecebida = receita.porcao && typeof receita.porcao === 'object' ? Number(receita.porcao.id) : 0
  const porcaoPorId = porcoes.find(item => porcaoIdRecebida > 0 && Number(item.id) === porcaoIdRecebida)
  const porcaoRecebida = extrairQuantidadePorcao(receita.porcao)
  const porcao = porcaoPorId || porcoes.reduce((melhor, item) => {
    if (!melhor) return item
    const atualDistancia = Math.abs(Number(item.numero_porcao) - (porcaoRecebida || 1))
    const melhorDistancia = Math.abs(Number(melhor.numero_porcao) - (porcaoRecebida || 1))
    return atualDistancia < melhorDistancia ? item : melhor
  }, null)

  const ingredientesRecebidos = Array.isArray(receita.ingredientes) ? receita.ingredientes : []
  const ingredientes = ingredientesRecebidos.map(item => {
    const unidade = resolverUnidadeSugestao(item, unidades)
    let quantidade = String(item?.quantidade ?? '').trim()
    if (unidade?.unidade) {
      const sufixo = new RegExp(`\\s*${String(unidade.unidade).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i')
      quantidade = quantidade.replace(sufixo, '').trim()
    }
    return {
      nome: String(item?.nome ?? '').trim().slice(0, 35),
      quantidade: (quantidade || '1').slice(0, 10),
      id_unidade_medida: Number(unidade?.id)
    }
  }).filter(item => item.nome && Number.isInteger(item.id_unidade_medida) && item.id_unidade_medida > 0)

  const etapasRecebidas = Array.isArray(receita.modo_preparo) ? receita.modo_preparo : []
  const modoPreparo = etapasRecebidas.map((etapa, index) => ({
    metodo_preparo: String(typeof etapa === 'string' ? etapa : etapa?.metodo_preparo ?? '').trim(),
    ordem_preparo: Number(etapa?.ordem_preparo) || index + 1
  })).filter(etapa => etapa.metodo_preparo)

  if (!ingredientes.length || !modoPreparo.length) {
    throw new Error('A sugestão precisa conter ingredientes e etapas de preparo válidos para ser publicada.')
  }

  const idUsuario = Number(authService.getUserId?.())
  if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
    throw new Error('Não foi possível identificar o usuário logado para publicar a receita.')
  }

  const payload = {
    titulo: String(receita.titulo ?? '').trim().slice(0, 50),
    descricao: String(receita.descricao ?? 'Receita sugerida pelo Chefinho.').trim().slice(0, 200) || 'Receita sugerida pelo Chefinho.',
    tempo: normalizarTempoReceita(receita.tempo),
    foto: /^https?:\/\//i.test(String(receita.foto ?? ''))
      ? String(receita.foto).trim()
      : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    id_porcao: Number(porcao.id),
    id_dificuldade: Number(dificuldade.id),
    id_custo: Number(custo.id),
    id_usuario: idUsuario,
    ingredientes,
    modo_preparo: modoPreparo,
    categoria: categoriasSelecionadas.map(item => ({ id: Number(item.id) }))
  }

  if (!payload.titulo) throw new Error('A sugestão não possui um título válido.')

  return postReceita(payload, jwt)
}

export async function getReceitasDaSemana() {
  return request(`${url}/populares/semana`, {
    fallbackError: 'Erro ao listar as receitas da semana!'
  })
}

export async function getBuscarReceitasPorCategoria(params = {}) {
  const parametros = { ...params }
  const idCategoria = parametros.id_categoria ?? parametros.idCategoria
  delete parametros.id_categoria
  delete parametros.idCategoria

  if (!idCategoria) {
    throw new Error('Informe a categoria para buscar receitas.')
  }

  const query = new URLSearchParams(parametros).toString()
  return request(`${url}/busca/categoria/${encodeURIComponent(idCategoria)}${query ? `?${query}` : ''}`, {
    fallbackError: 'Erro ao buscar receitas por categoria!'
  })
}

export async function getBuscarReceitasPorNome(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`${url}/busca/nome${query ? `?${query}` : ''}`, {
    fallbackError: 'Erro ao buscar receitas pelo nome!'
  })
}

export async function postBuscarReceitasPorIngredientes(dados) {
  const params = new URLSearchParams()
  const ingredientes = dados?.ingredientes || []
  ingredientes.forEach((item) => params.append('ingredientes', typeof item === 'string' ? item : item.nome))

  return request(`${url}/ingrediente/buscar?${params.toString()}`, {
    fallbackError: 'Erro ao buscar receitas pelos ingredientes!'
  })
}

export async function getBuscarReceita(id) {
  return request(`${url}/${id}`, {
    fallbackError: `Erro ao buscar a receita: ${id}`
  })
}

export async function putReceita(id, dados, jwt) {
  return request(`${url}/${id}`, {
    method: 'PUT',
    dados,
    jwt,
    fallbackError: 'Erro ao atualizar a receita!'
  })
}

export async function deleteReceita(id, jwt) {
  return request(`${url}/${id}`, {
    method: 'DELETE',
    jwt,
    fallbackError: 'Erro ao deletar a receita!'
  })
}

export async function postCurtirReceita(id, jwt) {
  return request(`${url}/${id}/curtir`, {
    method: 'POST',
    jwt,
    fallbackError: 'Erro ao curtir a receita!'
  })
}

export async function deleteCurtirReceita(id, jwt) {
  return request(`${url}/${id}/curtir`, {
    method: 'DELETE',
    jwt,
    fallbackError: 'Erro ao remover a curtida da receita!'
  })
}

export async function postSalvarReceita(id, jwt) {
  return request(`${url}/${id}/salvar`, {
    method: 'POST',
    jwt,
    fallbackError: 'Erro ao salvar a receita!'
  })
}

export async function deleteSalvarReceita(id, jwt) {
  return request(`${url}/${id}/salvar`, {
    method: 'DELETE',
    jwt,
    fallbackError: 'Erro ao remover a receita salva!'
  })
}

export async function getComentariosReceita(id, params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`${url}/${id}/comentarios${query ? `?${query}` : ''}`, {
    fallbackError: 'Erro ao listar os comentários da receita!'
  })
}

export async function postComentarioReceita(id, dados, jwt) {
  return request(`${url}/${id}/comentarios`, {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao criar o comentário!'
  })
}

export async function postCompatibilidadeReceitas(dados, jwt) {
  return request(`${url}/compatibilidade`, {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao verificar a compatibilidade das receitas!'
  })
}

export async function getBuscasEmAlta() {
  return request(`${BASE_URL}/em_alta`, {
    fallbackError: 'Erro ao obter as buscas em alta!'
  })
}