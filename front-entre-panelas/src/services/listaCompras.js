import { authService } from './authService'

const url = `${import.meta.env.VITE_API_URL}/lista-compras/me/usuario`

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
    const error = new Error(data?.message || fallbackError)
    error.status = response.status
    throw error
  }

  return data ?? true
}

export async function getListaComprasReceitas(jwt) {
  return request('/receitas', {
    jwt,
    fallbackError: 'Erro ao listar as receitas da lista de compras!'
  })
}

export async function getListaComprasDaReceita(id_receita, params = {}, jwt) {
  const query = new URLSearchParams(params).toString()
  return request(`/receitas/${id_receita}${query ? `?${query}` : ''}`, {
    jwt,
    fallbackError: `Erro ao listar a lista de compras da receita: ${id_receita}`
  })
}

export async function postAdicionarReceitaListaCompras(id_receita, jwt) {
  return request(`/receita/${id_receita}`, {
    method: 'POST',
    jwt,
    fallbackError: `Erro ao adicionar a receita à lista de compras: ${id_receita}`
  })
}

export async function putItemListaCompras(id, dados, jwt) {
  return request(`/${id}/${dados?.id_status}`, {
    method: 'PUT',
    dados,
    jwt,
    fallbackError: 'Erro ao atualizar o item da lista de compras!'
  })
}

export async function deleteItemListaCompras() {
  throw new Error('A API ainda não disponibiliza a exclusão de itens individuais da lista de compras.')
}