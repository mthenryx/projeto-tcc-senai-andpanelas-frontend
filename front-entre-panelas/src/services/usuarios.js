import { authService } from '@/services/authService'

const url = `${import.meta.env.VITE_API_URL}/usuarios`

async function request(endpoint, { method = 'GET', dados, jwt, fallbackError } = {}) {
  const token = jwt || authService.getToken()
  const headers = {}

  if (dados !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const options = { method, headers }
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

export async function getListarUsuarios(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`${query ? `?${query}` : ''}`, {
    fallbackError: 'Erro ao listar os usuários!'
  })
}

export async function getBuscarUsuarioPorUsername(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/busca/username${query ? `?${query}` : ''}`, {
    fallbackError: 'Erro ao buscar o usuário pelo username!'
  })
}

export async function getBuscarUsuario(id) {
  return request(`/${id}`, {
    fallbackError: `Erro ao buscar o usuário: ${id}`
  })
}

export async function getUsuarioLogado(jwt) {
  return request('/me', {
    jwt,
    fallbackError: 'Erro ao buscar o perfil do usuário logado!'
  })
}

export async function putUsuarioLogado(dados, jwt) {
  return request('/me', {
    method: 'PUT',
    dados,
    jwt,
    fallbackError: 'Erro ao atualizar o perfil!'
  })
}

export async function postAlterarEmail(dados, jwt) {
  return request('/me/alterar-email', {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao solicitar a alteração de e-mail!'
  })
}

export async function postConfirmarAlteracao(dados, jwt) {
  return request('/me/confirmar-alteracao', {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao confirmar a alteração!'
  })
}

export const postConfirmarAlteracaoEmail = postConfirmarAlteracao

export async function postAlterarSenha(dados, jwt) {
  return request('/me/alterar-senha', {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao alterar a senha!'
  })
}

export async function postSeguirUsuario(id, jwt) {
  return request(`/${id}/seguir`, {
    method: 'POST',
    jwt,
    fallbackError: `Erro ao seguir o usuário: ${id}`
  })
}

export async function postDeixarSeguirUsuario(id, jwt) {
  return request(`/${id}/deixar-seguir`, {
    method: 'POST',
    jwt,
    fallbackError: `Erro ao deixar de seguir o usuário: ${id}`
  })
}

export async function getSeguidoresUsuario(id, params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/${id}/seguidores${query ? `?${query}` : ''}`, {
    fallbackError: `Erro ao listar os seguidores do usuário: ${id}`
  })
}

export async function getSeguindoUsuario(id, params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/${id}/seguindo${query ? `?${query}` : ''}`, {
    fallbackError: `Erro ao listar os usuários seguidos pelo usuário: ${id}`
  })
}