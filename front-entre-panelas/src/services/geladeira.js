import { authService } from './authService'

const url = `${import.meta.env.VITE_API_URL}/usuarios/me/geladeira`

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

export async function getListarGeladeira(params = {}, jwt) {
  const query = new URLSearchParams(params).toString()
  return request(`${query ? `?${query}` : ''}`, {
    jwt,
    fallbackError: 'Erro ao listar os ingredientes da geladeira!'
  })
}

export async function postIngredienteGeladeira(dados, jwt) {
  return request('', {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao adicionar o ingrediente à geladeira!'
  })
}

export async function putIngredienteGeladeira(id, dados, jwt) {
  return request(`/${id}`, {
    method: 'PUT',
    dados,
    jwt,
    fallbackError: 'Erro ao atualizar o ingrediente da geladeira!'
  })
}

export async function deleteIngredienteGeladeira(id, jwt) {
  return request(`/${id}`, {
    method: 'DELETE',
    jwt,
    fallbackError: 'Erro ao deletar o ingrediente da geladeira!'
  })
}