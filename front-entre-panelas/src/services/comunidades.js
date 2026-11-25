import { authService } from './authService'

const BASE_URL = import.meta.env.VITE_API_URL
const url = `${BASE_URL}/comunidades`

async function request(endpoint = '', { method = 'GET', dados, jwt, fallbackError, baseUrl = url } = {}) {
  const token = jwt || authService.getToken()
  const headers = {}

  if (dados !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers, ...(method === 'GET' ? { cache: 'no-store' } : {}) }
  if (dados !== undefined) options.body = JSON.stringify(dados)

  const response = await fetch(`${baseUrl}${endpoint}`, options)
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

export async function obterIdUsuarioLogado() {
  const idAutenticado = authService.getUserId?.()
  if (idAutenticado) return Number(idAutenticado)

  const usuarioLocal = authService.getUser?.() || authService.getUsuario?.()
  if (usuarioLocal?.id) return Number(usuarioLocal.id)

  try {
    for (const chave of ['usuario', 'user', 'userData']) {
      const salvo = localStorage.getItem(chave)
      if (salvo) {
        const parsed = JSON.parse(salvo)
        if (parsed?.id) return Number(parsed.id)
      }
    }
  } catch {
    // ignora erro de parse
  }

  const token = authService.getToken?.()
  if (token) {
    try {
      const payloadBase64 = token.split('.')[1]
      if (payloadBase64) {
        const decoded = JSON.parse(atob(payloadBase64))
        const idToken = decoded?.id || decoded?.id_usuario || decoded?.sub
        if (idToken && !isNaN(Number(idToken))) {
          return Number(idToken)
        }
      }
    } catch {
      // ignora caso o payload não seja decodificável
    }

    try {
      const response = await fetch(`${BASE_URL}/usuarios/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json().catch(() => null)
      const dadosUsuario = data?.response?.dados || data?.response || data?.dados
      if (dadosUsuario?.id) return Number(dadosUsuario.id)
    } catch {
      // fallback silencioso
    }
  }

  return null
}

export async function getListarComunidades(params = {}) {
  const parametros = { ...params }
  const idUsuario = authService.getUserId?.()
  if (idUsuario && !parametros.idUser) parametros.idUser = idUsuario
  const query = new URLSearchParams(parametros).toString()
  return request(`${query ? `?${query}` : ''}`, {
    fallbackError: 'Erro ao listar as comunidades!'
  }).catch((erro) => (erro.status === 404 ? { response: { comunidade: [] } } : Promise.reject(erro)))
}

export async function postComunidade(dados, jwt) {
  const idUsuario = Number(dados?.id_usuario || authService.getUserId?.())
  if (!idUsuario) throw new Error('Não foi possível identificar o usuário logado para criar a comunidade.')

  const { id_usuario, ...comunidade } = dados
  return request('', {
    method: 'POST',
    dados: comunidade,
    jwt,
    fallbackError: 'Erro ao criar uma nova comunidade!'
  })
}

export async function getBuscarComunidade(id) {
  const idUsuario = authService.getUserId?.()
  const query = idUsuario ? `?idUser=${encodeURIComponent(idUsuario)}` : ''
  return request(`/${id}${query}`, {
    fallbackError: `Erro ao buscar a comunidade: ${id}`
  })
}

export async function putComunidade(id, dados, jwt) {
  return request(`/${id}`, {
    method: 'PUT',
    dados,
    jwt,
    fallbackError: 'Erro ao atualizar a comunidade!'
  })
}

export async function deleteComunidade(id, jwt) {
  return request(`/${id}`, {
    method: 'DELETE',
    jwt,
    fallbackError: 'Erro ao deletar a comunidade!'
  })
}

export async function postEntrarComunidade(id, jwt) {
  const idUsuario = authService.getUserId?.()
  if (!idUsuario) throw new Error('Não foi possível identificar o usuário logado.')

  return request(`/${id}/entrar`, {
    method: 'POST',
    jwt,
    fallbackError: 'Erro ao entrar na comunidade!'
  })
}

export async function deleteSairComunidade(id, jwt) {
  const idUsuario = authService.getUserId?.()
  if (!idUsuario) throw new Error('Não foi possível identificar o usuário logado.')

  return request(`/${id}/sair`, {
    method: 'DELETE',
    jwt,
    fallbackError: 'Erro ao sair da comunidade!'
  })
}

export async function getReceitasDaComunidade(id, params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/${id}/receitas${query ? `?${query}` : ''}`, {
    fallbackError: `Erro ao listar as receitas da comunidade: ${id}`
  })
}

export async function getListarCategoriasComunidade(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`${query ? `?${query}` : ''}`, {
    baseUrl: `${BASE_URL}/categoria_principal`,
    fallbackError: 'Erro ao listar as categorias de comunidade!'
  })
}

export async function postCategoriaComunidade(dados, jwt) {
  return request('', {
    method: 'POST',
    dados,
    jwt,
    baseUrl: `${BASE_URL}/categoria_principal`,
    fallbackError: 'Erro ao cadastrar a categoria da comunidade!'
  })
}