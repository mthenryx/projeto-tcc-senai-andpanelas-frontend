import { authService } from '@/services/authService'

const urlReceitas = `${import.meta.env.VITE_API_URL}/receitas`

async function request(baseUrl, endpoint, { method = 'POST', dados, jwt, fallbackError } = {}) {
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

  const response = await fetch(`${baseUrl}${endpoint}`, options)
  const data = await response.json().catch(() => null)

  if (!response.ok || (data && data.status === false)) {
    throw new Error(data?.message || fallbackError)
  }

  return data ?? true
}

export async function postSalvarReceita(idReceita, jwt) {
  return request(urlReceitas, `/${idReceita}/salvar`, {
    method: 'POST',
    jwt,
    fallbackError: `Erro ao salvar a receita: ${idReceita}`
  })
}

export async function deleteDesalvarReceita(idReceita, jwt) {
  return request(urlReceitas, `/${idReceita}/salvar`, {
    method: 'DELETE',
    jwt,
    fallbackError: `Erro ao remover receita dos salvos: ${idReceita}`
  })
}