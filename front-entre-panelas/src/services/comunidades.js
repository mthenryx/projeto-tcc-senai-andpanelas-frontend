import { http } from './http.js'

/**
 * GET /comunidades — lista paginada. Retorna { dados }.
 * @param {{ pagina?: number, limite?: number, busca?: string, id_categoria_principal?: number }} [filtros]
 */
export const listar = (filtros = {}, options) =>
  http.get('/comunidades', { query: filtros, ...options })

/**
 * POST /comunidades — cria uma comunidade.
 * @param {{ nome: string, descricao: string, foto_url: string, banner_url: string,
 *           id_categoria_principal: number }} dados
 */
export const criar = (dados) => http.post('/comunidades', dados, { auth: true })

/** GET /comunidades/{id} — Retorna { dados }. */
export const obter = (id) => http.get(`/comunidades/${id}`)

/** PUT /comunidades/{id} — envie só o que mudou. */
export const atualizar = (id, dados) => http.put(`/comunidades/${id}`, dados, { auth: true })

/** DELETE /comunidades/{id} */
export const deletar = (id) => http.delete(`/comunidades/${id}`, { auth: true })

/** POST /comunidades/{id}/entrar */
export const entrar = (id) => http.post(`/comunidades/${id}/entrar`, undefined, { auth: true })

/** DELETE /comunidades/{id}/sair */
export const sair = (id) => http.delete(`/comunidades/${id}/sair`, { auth: true })

/** GET /comunidades/{id}/receitas — Retorna { dados }. */
export const receitas = (id, { pagina, limite } = {}) =>
  http.get(`/comunidades/${id}/receitas`, { query: { pagina, limite } })

/** GET /categorias-comunidades — categorias principais. Retorna { dados }. */
export const categorias = () => http.get('/categorias-comunidades')

/** POST /categorias-comunidades — cria a categoria se não existir (máx. 50 caracteres). */
export const criarCategoria = (categoria_principal) =>
  http.post('/categorias-comunidades', { categoria_principal }, { auth: true })
