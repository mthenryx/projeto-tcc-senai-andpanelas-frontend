/**
 * Núcleo das chamadas à API do Entre Panelas.
 * Todos os arquivos de src/services passam por aqui. Se algo mudar
 * (URL base, chave do token, formato de erro), o ajuste é só neste arquivo.
 */

// Defina VITE_API_URL no .env (ex.: https://meu-backend.com).
// Sem ela, as chamadas usam caminho relativo (/v1/entrepanelas/...).
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')
export const BASE_URL = `${API_URL}/v1/entrepanelas`

const TOKEN_KEY = 'ep_token'
const USUARIO_KEY = 'ep_usuario'

/** Guarda e lê o token JWT e os dados básicos do usuário logado. */
export const sessao = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUsuario() {
    try {
      return JSON.parse(localStorage.getItem(USUARIO_KEY))
    } catch {
      return null
    }
  },
  estaLogado: () => !!localStorage.getItem(TOKEN_KEY),
  salvar({ token, usuario }) {
    localStorage.setItem(TOKEN_KEY, token)
    if (usuario) localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario))
  },
  limpar() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USUARIO_KEY)
  },
}

// Função chamada quando o token é recusado (401) numa rota autenticada.
// Registre no main.js para mandar o usuário de volta ao login.
let aoExpirarSessao = null
export function definirAoExpirarSessao(fn) {
  aoExpirarSessao = fn
}
function expirarSessao() {
  sessao.limpar()
  if (aoExpirarSessao) aoExpirarSessao()
}

const MENSAGENS_PADRAO = {
  0: 'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.',
  400: 'Dados inválidos. Revise as informações e tente novamente.',
  401: 'Sua sessão expirou. Faça login novamente.',
  404: 'Não encontramos o que você procurava.',
  409: 'Essa ação já foi realizada.',
  415: 'Formato de dados não suportado.',
  500: 'Erro interno do servidor. Tente novamente em instantes.',
  502: 'Serviço temporariamente indisponível. Tente novamente em instantes.',
}

/**
 * Erro lançado em toda falha da API.
 *  - message: texto pronto para mostrar ao usuário
 *  - status:  código HTTP (0 = sem conexão)
 *  - corpo:   resposta original do servidor, se houver
 * Para erros 5xx a mensagem é amigável; a mensagem técnica fica em corpo.message.
 */
export class ApiError extends Error {
  constructor(status, corpo = null) {
    const daApi = corpo && corpo.message
    const padrao = MENSAGENS_PADRAO[status] || 'Ocorreu um erro inesperado.'
    super(status >= 500 || !daApi ? padrao : daApi)
    this.name = 'ApiError'
    this.status = status
    this.corpo = corpo
  }
}

function montarQuery(params = {}) {
  const sp = new URLSearchParams()
  Object.entries(params).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') sp.append(chave, valor)
  })
  const texto = sp.toString()
  return texto ? `?${texto}` : ''
}

/**
 * @param {string} method
 * @param {string} path  caminho a partir de /v1/entrepanelas
 * @param {object} opcoes
 * @param {object} [opcoes.query]
 * @param {any}    [opcoes.body]
 * @param {boolean|'opcional'} [opcoes.auth] true = exige login; 'opcional' = envia o token se existir
 * @param {AbortSignal} [opcoes.signal] para cancelar (ex.: busca digitando)
 */
async function request(method, path, { query, body, auth = false, signal } = {}) {
  const token = sessao.getToken()

  if (auth === true && !token) {
    expirarSessao()
    throw new ApiError(401)
  }

  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${BASE_URL}${path}${montarQuery(query)}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (err) {
    if (err && err.name === 'AbortError') throw err
    throw new ApiError(0)
  }

  const texto = await res.text()
  let dados = null
  if (texto) {
    try {
      dados = JSON.parse(texto)
    } catch {
      dados = null
    }
  }

  if (!res.ok || (dados && dados.status === false)) {
    // Token vencido numa rota pública com token opcional: tenta de novo sem ele.
    if (res.status === 401 && auth === 'opcional' && token) {
      sessao.limpar()
      return request(method, path, { query, body, auth: false, signal })
    }
    if (res.status === 401 && auth === true) expirarSessao()
    throw new ApiError(res.status, dados)
  }

  // A API embrulha tudo em { status, status_code, response }. Devolvemos só o "response".
  return dados && dados.response !== undefined ? dados.response : dados
}

export const http = {
  get: (path, opcoes) => request('GET', path, opcoes),
  post: (path, body, opcoes) => request('POST', path, { ...opcoes, body }),
  put: (path, body, opcoes) => request('PUT', path, { ...opcoes, body }),
  delete: (path, opcoes) => request('DELETE', path, opcoes),
}
