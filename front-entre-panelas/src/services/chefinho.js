import { authService } from './authService'

const url = `${import.meta.env.VITE_API_URL}/conversas`
const urlSugestao = `${import.meta.env.VITE_API_URL}/receita/busca/sugestao`

async function request(endpoint = '', { method = 'GET', dados, jwt, fallbackError, baseUrl = url } = {}) {
  const token = jwt || authService.getToken()
  const headers = {}

  if (dados !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (dados !== undefined) options.body = JSON.stringify(dados)

  const response = await fetch(`${baseUrl}${endpoint}`, options)
  const data = await response.json().catch(() => null)

  if (!response.ok || (data && (data.status === false || data.success === false))) {
    const error = new Error(data?.message || fallbackError)
    error.status = response.status
    throw error
  }

  return data ?? true
}

export async function getListarConversasChefinho(params = {}, jwt) {
  const query = new URLSearchParams(params).toString()
  return request(`${query ? `?${query}` : ''}`, {
    jwt,
    fallbackError: 'Erro ao listar as conversas do Chefinho!'
  })
}

export async function postCriarConversaChefinho(dados, jwt) {
  return request('', {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao criar a conversa com o Chefinho!'
  })
}

export async function getBuscarConversaChefinho(id, jwt) {
  return request(`/${id}`, {
    jwt,
    fallbackError: `Erro ao buscar a conversa do Chefinho: ${id}`
  })
}

export async function deleteConversaChefinho(id, jwt) {
  return request(`/${id}`, {
    method: 'DELETE',
    jwt,
    fallbackError: `Erro ao deletar a conversa do Chefinho: ${id}`
  })
}

export async function postMensagemChefinho(id, dados, jwt) {
  return request(`/${id}/mensagens`, {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao enviar a mensagem para o Chefinho!'
  })
}

export async function postSugestaoBuscaReceita(dados, jwt) {
  const payload = {
    pesquisa_usuario: dados?.pesquisa_usuario ?? '',
    encontrados_db: Array.isArray(dados?.encontrados_db)
      ? dados.encontrados_db.slice(0, 50)
      : []
  }

  return request('', {
    method: 'POST',
    dados: payload,
    jwt,
    baseUrl: urlSugestao,
    fallbackError: 'Erro ao buscar sugestão de receita com o Chefinho!'
  })
}