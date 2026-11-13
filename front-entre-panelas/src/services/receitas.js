import { authService } from './authService'

const BASE_URL = import.meta.env.VITE_API_URL
const url = `${BASE_URL}/receitas`

async function request(fullUrl, { method = 'GET', dados, jwt, fallbackError } = {}) {
  const token = jwt || authService.getToken()
  const headers = {}

  if (dados !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (dados !== undefined) options.body = JSON.stringify(dados)

  const response = await fetch(fullUrl, options)
  const data = await response.json().catch(() => null)

  if (!response.ok || (data && data.status === false)) {
    throw new Error(data?.message || fallbackError)
  }

  return data ?? true
}

export async function getListarReceitas(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`${url}${query ? `?${query}` : ''}`, {
    fallbackError: 'Erro ao listar as receitas!'
  })
}

export async function postReceita(dados, jwt) {
  return request(url, {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao criar uma nova receita!'
  })
}

export async function getReceitasDaSemana() {
  return request(`${url}/semana`, {
    fallbackError: 'Erro ao listar as receitas da semana!'
  })
}

export async function getBuscarReceitasPorCategoria(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`${url}/busca/categoria${query ? `?${query}` : ''}`, {
    fallbackError: 'Erro ao buscar receitas por categoria!'
  })
}

export async function getBuscarReceitasPorNome(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`${url}/busca/nome${query ? `?${query}` : ''}`, {
    fallbackError: 'Erro ao buscar receitas pelo nome!'
  })
}

export async function postBuscarReceitasPorIngredientes(dados) {
  return request(`${url}/busca/ingredientes`, {
    method: 'POST',
    dados,
    fallbackError: 'Erro ao buscar receitas pelos ingredientes!'
  })
}

export async function getBuscarReceita(id) {
  return request(`${url}/${id}`, {
    fallbackError: `Erro ao buscar a receita: ${id}`
  })
}

export async function putReceita(id, dados, jwt) {
  return request(`${url}/${id}`, {
    method: 'PUT',
    dados,
    jwt,
    fallbackError: 'Erro ao atualizar a receita!'
  })
}

export async function deleteReceita(id, jwt) {
  return request(`${url}/${id}`, {
    method: 'DELETE',
    jwt,
    fallbackError: 'Erro ao deletar a receita!'
  })
}

export async function postCurtirReceita(id, jwt) {
  return request(`${url}/${id}/curtir`, {
    method: 'POST',
    jwt,
    fallbackError: 'Erro ao curtir a receita!'
  })
}

export async function deleteCurtirReceita(id, jwt) {
  return request(`${url}/${id}/curtir`, {
    method: 'DELETE',
    jwt,
    fallbackError: 'Erro ao remover a curtida da receita!'
  })
}

export async function postSalvarReceita(id, jwt) {
  return request(`${url}/${id}/salvar`, {
    method: 'POST',
    jwt,
    fallbackError: 'Erro ao salvar a receita!'
  })
}

export async function deleteSalvarReceita(id, jwt) {
  return request(`${url}/${id}/salvar`, {
    method: 'DELETE',
    jwt,
    fallbackError: 'Erro ao remover a receita salva!'
  })
}

export async function getComentariosReceita(id, params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`${url}/${id}/comentarios${query ? `?${query}` : ''}`, {
    fallbackError: 'Erro ao listar os comentários da receita!'
  })
}

export async function postComentarioReceita(id, dados, jwt) {
  return request(`${url}/${id}/comentarios`, {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao criar o comentário!'
  })
}

export async function postCompatibilidadeReceitas(dados, jwt) {
  return request(`${url}/compatibilidade`, {
    method: 'POST',
    dados,
    jwt,
    fallbackError: 'Erro ao verificar a compatibilidade das receitas!'
  })
}

export async function getBuscasEmAlta() {
  return request(`${BASE_URL}/em-alta`, {
    fallbackError: 'Erro ao obter as buscas em alta!'
  })
}