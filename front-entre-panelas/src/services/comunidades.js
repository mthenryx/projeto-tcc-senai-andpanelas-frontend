import { authService } from './authService'

const url = `${import.meta.env.VITE_API_URL}/comunidades`

async function request(endpoint = '', { method = 'GET', dados, jwt, fallbackError } = {}) {
  const token = jwt || authService.getToken()
  const headers = {}

  if (dados !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (dados !== undefined) options.body = JSON.stringify(dados)

  const response = await fetch(`${url}${endpoint}`, options)
  const data = await response.json().catch(() => null)

  if (!response.ok || (data && data.status === false)) {
    throw new Error(data?.message || fallbackError)
  }

  return data ?? true
}

export async function getListarComunidades(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`${query ? `?${query}` : ''}`, {
    fallbackError: 'Erro ao listar as comunidades!'
  })
}

export async function postComunidade(dados, jwt) {
  return request('', {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao criar uma nova comunidade!'
  })
}

export async function getBuscarComunidade(id) {
  return request(`/${id}`, {
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
  return request(`/${id}/entrar`, {
    method: 'POST',
    jwt,
    fallbackError: 'Erro ao entrar na comunidade!'
  })
}

export async function deleteSairComunidade(id, jwt) {
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