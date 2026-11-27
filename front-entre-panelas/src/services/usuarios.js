import { authService } from '@/services/authService'
import { fetchComTimeout } from '@/services/apiFetch'
import { postRedefinirSenha } from '@/services/auth'

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

  const response = await fetchComTimeout(`${url}${endpoint}`, options)
  const data = await response.json().catch(() => null)

  if (!response.ok || (data && data.status === false)) {
    const detalhe = data?.field ? ` Campo: ${data.field}.` : ''
    const erro = new Error(`${data?.message || fallbackError}${detalhe}`)
    erro.status = response.status
    erro.resposta = data
    throw erro
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

// A API atual valida a troca de senha pelo fluxo de código de recuperação.
// Reutiliza o endpoint real em vez de chamar /usuarios/me/alterar-senha,
// que não existe no backend.
export async function postAlterarSenha(dados) {
  return postRedefinirSenha(dados)
}

export async function postSeguirUsuario(id, jwt) {
  return request(`/seguir/${encodeURIComponent(id)}`, {
    method: 'POST',
    jwt,
    fallbackError: `Erro ao seguir o usuário: ${id}`
  })
}

export async function postDeixarSeguirUsuario(id, jwt) {
  return request(`/deixar-seguir/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    jwt,
    fallbackError: `Erro ao deixar de seguir o usuário: ${id}`
  })
}

export async function getSeguidoresUsuario(id, params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/seguidores/${id}${query ? `?${query}` : ''}`, {
    fallbackError: `Erro ao listar os seguidores do usuário: ${id}`
  })
}

export async function getSeguindoUsuario(id, params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/seguindos/${id}${query ? `?${query}` : ''}`, {
    fallbackError: `Erro ao listar os usuários seguidos pelo usuário: ${id}`
  })
}

export async function getReceitasUsuario(idUsuario, params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/${idUsuario}/receitas${query ? `?${query}` : ''}`, {
    fallbackError: `Erro ao listar as receitas do usuário: ${idUsuario}`
  })
}

export async function getReceitasSalvasUsuario(idUsuario, params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/receitas/salvas/${idUsuario}${query ? `?${query}` : ''}`, {
    fallbackError: `Erro ao listar as receitas salvas do usuário: ${idUsuario}`
  })
}

export async function getComunidadesUsuario(idUsuario) {
  return request(`/comunidades/${idUsuario}`, {
    fallbackError: `Erro ao listar as comunidades do usuário: ${idUsuario}`
  })
}

export async function getMinhasComunidades(jwt) {
  return request('/comunidades/me', {
    jwt,
    fallbackError: 'Erro ao listar as comunidades das quais você participa!'
  })
}

export async function postSolicitarAlteracaoEmail(dados, jwt) {
  return request('/me/alterar-email', {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao solicitar a alteração do e-mail!'
  })
}

export async function postConfirmarAlteracaoEmail(dados, jwt) {
  return request('/me/confirmar-alteracao-email', {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao confirmar a alteração do e-mail!'
  })
}
