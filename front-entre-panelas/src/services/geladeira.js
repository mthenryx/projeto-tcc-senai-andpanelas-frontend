import { authService } from './authService'

const BASE_URL = import.meta.env.VITE_API_URL
const url = `${BASE_URL}/geladeira/me/usuario`

function obterIdUsuario(jwt) {
  const idUsuario = authService.getUserId?.()
  if (idUsuario) return Number(idUsuario)

  throw new Error('Não foi possível identificar o usuário logado. Faça login novamente.')
}

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

export async function getListarGeladeira(params = {}, jwt) {
  obterIdUsuario(jwt)
  const query = new URLSearchParams(params).toString()
  return request(`${query ? `?${query}` : ''}`, {
    jwt,
    fallbackError: 'Erro ao listar os ingredientes da geladeira!'
  })
}

export async function postIngredienteGeladeira(dados, jwt) {
  const idUsuario = Number(dados?.id_usuario || obterIdUsuario(jwt))
  return request('', {
    method: 'POST',
    dados: { ...dados, id_usuario: idUsuario },
    jwt,
    fallbackError: 'Erro ao adicionar o ingrediente à geladeira!'
  })
}

export async function putIngredienteGeladeira(id, dados, jwt) {
  return request(`/${id}`, {
    method: 'PUT',
    dados,
    jwt,
    fallbackError: 'A API ainda não disponibiliza a edição direta de ingredientes da geladeira.'
  })
}

export async function deleteIngredienteGeladeira(id, jwt) {
  return request(`/${id}`, {
    method: 'DELETE',
    jwt,
    fallbackError: 'Erro ao deletar o ingrediente da geladeira!'
  })
}

export async function getCompatibilidadeGeladeira(jwt) {
  obterIdUsuario(jwt)
  return request('/receitas/compatibilidade', {
    jwt,
    fallbackError: 'Erro ao buscar receitas compatíveis com a geladeira!'
  })
}

// Compatibilidade mantida para chamadas antigas: a API realiza a busca pelos itens salvos do usuário.
export const postCompatibilidadeGeladeira = getCompatibilidadeGeladeira
