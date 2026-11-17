import { authService } from './authService'

const BASE_URL = import.meta.env.VITE_API_URL
const url = `${BASE_URL}/comunidades`

async function request(endpoint = '', { method = 'GET', dados, jwt, fallbackError, baseUrl = url } = {}) {
  const token = jwt || authService.getToken()
  const headers = {}

  if (dados !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (dados !== undefined) options.body = JSON.stringify(dados)

  const response = await fetch(`${baseUrl}${endpoint}`, options)
  const data = await response.json().catch(() => null)

  if (!response.ok || (data && data.status === false)) {
    throw new Error(data?.message || fallbackError)
  }

  return data ?? true
}

export async function obterIdUsuarioLogado() {
  const usuarioLocal = authService.getUsuario?.()
  if (usuarioLocal?.id) return Number(usuarioLocal.id)

  try {
    for (const chave of ['usuario', 'user', 'userData']) {
      const salvo = localStorage.getItem(chave)
      if (salvo) {
        const parsed = JSON.parse(salvo)
        if (parsed?.id) return Number(parsed.id)
      }
    }
  } catch {
    // ignora erro de parse
  }

  const token = authService.getToken?.()
  if (token) {
    try {
      const payloadBase64 = token.split('.')[1]
      if (payloadBase64) {
        const decoded = JSON.parse(atob(payloadBase64))
        const idToken = decoded?.id || decoded?.id_usuario || decoded?.sub
        if (idToken && !isNaN(Number(idToken))) {
          return Number(idToken)
        }
      }
    } catch {
      // ignora caso o payload não seja decodificável
    }

    try {
      const response = await fetch(`${BASE_URL}/usuarios/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json().catch(() => null)
      const dadosUsuario = data?.response?.dados || data?.response || data?.dados
      if (dadosUsuario?.id) return Number(dadosUsuario.id)
    } catch {
      // fallback silencioso
    }
  }

  return null
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

export async function getListarCategoriasComunidade(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`${query ? `?${query}` : ''}`, {
    baseUrl: `${BASE_URL}/categoria-comunidades`,
    fallbackError: 'Erro ao listar as categorias de comunidade!'
  })
}

export async function postCategoriaComunidade(dados, jwt) {
  return request('', {
    method: 'POST',
    dados,
    jwt,
    baseUrl: `${BASE_URL}/categoria-comunidades`,
    fallbackError: 'Erro ao cadastrar a categoria da comunidade!'
  })
}