import { authService } from './authService'

const url = `${import.meta.env.VITE_API_URL}/comentarios`

async function request(endpoint, { method = 'GET', dados, jwt, fallbackError } = {}) {
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

export async function putComentario(id, dados, jwt) {
  return request(`/${id}`, {
    method: 'PUT',
    dados,
    jwt,
    fallbackError: 'Erro ao atualizar o comentário!'
  })
}

export async function deleteComentario(id, jwt) {
  return request(`/${id}`, {
    method: 'DELETE',
    jwt,
    fallbackError: 'Erro ao deletar o comentário!'
  })
}