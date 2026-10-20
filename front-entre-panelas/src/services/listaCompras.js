import { http } from './http.js'

/** GET /usuarios/me/lista-compras/receitas — receitas que estão na lista. Retorna { dados }. */
export const receitas = () => http.get('/usuarios/me/lista-compras/receitas', { auth: true })

/**
 * GET /usuarios/me/lista-compras/receita/{id} — itens de uma receita na lista.
 * @param {'Todos'|'Pendentes'|'Comprados'} [status='Todos']  (veja FILTRO_LISTA)
 */
export const itens = (idReceita, status = 'Todos') =>
  http.get(`/usuarios/me/lista-compras/receita/${idReceita}`, { query: { status }, auth: true })

/** POST /usuarios/me/lista-compras/receita/{id} — adiciona TODOS os ingredientes da receita
 *  (status inicial: pendente). Se já estiver na lista, a API responde 409. */
export const adicionarReceita = (idReceita) =>
  http.post(`/usuarios/me/lista-compras/receita/${idReceita}`, undefined, { auth: true })

/** PUT /usuarios/me/lista-compras/{id} — id do ITEM. id_status: 1 = comprado, 2 = pendente
 *  (veja STATUS_ITEM_LISTA). */
export const atualizarStatus = (idItem, id_status) =>
  http.put(`/usuarios/me/lista-compras/${idItem}`, { id_status }, { auth: true })

/** DELETE /usuarios/me/lista-compras/{id} — remove um item. */
export const remover = (idItem) =>
  http.delete(`/usuarios/me/lista-compras/${idItem}`, { auth: true })
