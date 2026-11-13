import { authService } from './authService'

const BASE_URL = import.meta.env.VITE_API_URL

async function request(endpoint, { method = 'GET', dados, jwt, fallbackError } = {}) {
  const token = jwt || authService.getToken()
  const headers = {}

  if (dados !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (dados !== undefined) options.body = JSON.stringify(dados)

  const response = await fetch(`${BASE_URL}${endpoint}`, options)
  const data = await response.json().catch(() => null)

  if (!response.ok || (data && data.status === false)) {
    throw new Error(data?.message || fallbackError)
  }

  return data
}

export async function getListarCategorias() {
  return request('/categorias', {
    fallbackError: 'Erro ao listar as categorias!'
  })
}

export async function getListarTags(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/tags${query ? `?${query}` : ''}`, {
    fallbackError: 'Erro ao listar as tags!'
  })
}

export async function postTag(dados, jwt) {
  return request('/tags', {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao cadastrar a tag!'
  })
}

export async function getListarCategoriasComunidades() {
  return request('/categorias-comunidades', {
    fallbackError: 'Erro ao listar as categorias de comunidades!'
  })
}

export async function postCategoriaComunidade(dados, jwt) {
  return request('/categorias-comunidades', {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao cadastrar a categoria de comunidade!'
  })
}