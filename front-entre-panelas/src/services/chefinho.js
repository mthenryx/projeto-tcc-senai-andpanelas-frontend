import { authService } from './authService'
import { fetchComTimeout } from './apiFetch'

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const API_ROOT = API_URL.replace(/\/v1\/entrepanelas\/?$/, '')
const url = `${API_ROOT}/v1/chefinho/conversas`
const urlStatus = '/v1/chefinho/status'
const urlSugestao = `${API_URL}/receitas/busca/sugestao`

function adicionarUsuarioNaQuery(params = {}) {
  const query = { ...params }
  const idUsuario = authService.getUserId?.()
  if (idUsuario && !query.id_usuario) query.id_usuario = idUsuario
  return new URLSearchParams(query).toString()
}

async function request(endpoint = '', { method = 'GET', dados, jwt, fallbackError, baseUrl = url, timeoutMs } = {}) {
  const token = jwt || authService.getToken()
  const headers = {}

  if (dados !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (dados !== undefined) options.body = JSON.stringify(dados)

  const response = timeoutMs
    ? await fetchComTimeout(`${baseUrl}${endpoint}`, options, timeoutMs)
    : await fetch(`${baseUrl}${endpoint}`, options)
  const data = await response.json().catch(() => null)

  if (!response.ok || (data && (data.status === false || data.success === false))) {
    const error = new Error(data?.message || fallbackError)
    error.status = response.status
    throw error
  }

  return data ?? true
}

export async function getStatusChefinho() {
  const response = await fetch(urlStatus)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error('Não foi possível verificar o status do Chefinho.')
  }

  return data
}

export async function getListarConversasChefinho(params = {}, jwt) {
  const query = adicionarUsuarioNaQuery(params)
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
  const query = adicionarUsuarioNaQuery()
  return request(`/${id}${query ? `?${query}` : ''}`, {
    jwt,
    fallbackError: `Erro ao buscar a conversa do Chefinho: ${id}`
  })
}

export async function deleteConversaChefinho(id, jwt) {
  const query = adicionarUsuarioNaQuery()
  return request(`/${id}${query ? `?${query}` : ''}`, {
    method: 'DELETE',
    jwt,
    fallbackError: `Erro ao deletar a conversa do Chefinho: ${id}`
  })
}

export async function postMensagemChefinho(id, dados, jwt) {
  const query = adicionarUsuarioNaQuery()
  return request(`/${id}/mensagens${query ? `?${query}` : ''}`, {
    method: 'POST',
    dados: { mensagem: dados?.mensagem ?? dados?.pergunta_atual ?? '' },
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
    fallbackError: 'Erro ao buscar sugestão de receita com o Chefinho!',
    timeoutMs: 65000
  })
}
