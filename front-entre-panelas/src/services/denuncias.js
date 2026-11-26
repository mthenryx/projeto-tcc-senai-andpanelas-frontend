import { authService } from './authService'
import { fetchComTimeout } from './apiFetch'

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const url = `${API_URL}/denuncia`

async function request(endpoint, { dados, jwt, fallbackError } = {}) {
  const token = jwt || authService.getToken()
  const headers = { 'Content-Type': 'application/json' }

  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetchComTimeout(`${url}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(dados ?? {})
  }, 65000)

  const data = await response.json().catch(() => null)

  if (!response.ok || (data && data.status === false)) {
    const error = new Error(data?.message || fallbackError || 'Não foi possível enviar a denúncia.')
    error.status = response.status
    error.resposta = data
    throw error
  }

  return data
}

function validarIdAlvo(id) {
  const idNumerico = Number(id)
  if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
    throw new Error('Não foi possível identificar o conteúdo que será denunciado.')
  }
  return idNumerico
}

export async function postDenunciaUsuario(idUsuarioDenunciado, dados, jwt) {
  const id = validarIdAlvo(idUsuarioDenunciado)
  return request(`/usuario/${id}`, {
    dados,
    jwt,
    fallbackError: 'Erro ao criar a denúncia do usuário!'
  })
}

export async function postDenunciaComunidade(idComunidade, dados, jwt) {
  const id = validarIdAlvo(idComunidade)
  return request(`/comunidade/${id}`, {
    dados,
    jwt,
    fallbackError: 'Erro ao criar a denúncia da comunidade!'
  })
}

export async function postDenunciaReceita(idReceita, dados, jwt) {
  const id = validarIdAlvo(idReceita)
  return request(`/receita/${id}`, {
    dados,
    jwt,
    fallbackError: 'Erro ao criar a denúncia da receita!'
  })
}
