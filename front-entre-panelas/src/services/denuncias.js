import { authService } from './authService'

const url = `${import.meta.env.VITE_API_URL}/denuncias`

async function request(endpoint, { dados, jwt, fallbackError } = {}) {
  const token = jwt || authService.getToken()
  const headers = {
    'Content-Type': 'application/json'
  }

  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = {
    method: 'POST',
    headers
  }

  if (dados !== undefined) {
    options.body = JSON.stringify(dados)
  }

  const response = await fetch(`${url}${endpoint}`, options)
  const data = await response.json().catch(() => null)

  if (!response.ok || (data && data.status === false)) {
    throw new Error(data?.message || fallbackError)
  }

  return data
}

export async function postDenunciaUsuario(dados, jwt) {
  return request('/usuario', {
    dados,
    jwt,
    fallbackError: 'Erro ao criar a denúncia do usuário!'
  })
}

export async function postDenunciaComunidade(dados, jwt) {
  return request('/comunidade', {
    dados,
    jwt,
    fallbackError: 'Erro ao criar a denúncia da comunidade!'
  })
}

export async function postDenunciaReceita(dados, jwt) {
  return request('/receita', {
    dados,
    jwt,
    fallbackError: 'Erro ao criar a denúncia da receita!'
  })
}