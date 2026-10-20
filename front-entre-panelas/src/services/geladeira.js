import { http } from './http.js'

/** GET /usuarios/me/geladeira — ingredientes na geladeira. Retorna { dados }. */
export const listar = ({ pagina, limite } = {}) =>
  http.get('/usuarios/me/geladeira', { query: { pagina, limite }, auth: true })

/**
 * POST /usuarios/me/geladeira — adiciona um ingrediente.
 * @param {{ nome_ingrediente: string, quantidade: number, id_unidade_medida: number }} dados
 *        Atenção: aqui "quantidade" é NÚMERO (nas receitas é texto).
 */
export const adicionar = (dados) => http.post('/usuarios/me/geladeira', dados, { auth: true })

/** PUT /usuarios/me/geladeira/{id} — atualiza a quantidade (número). */
export const atualizar = (id, quantidade) =>
  http.put(`/usuarios/me/geladeira/${id}`, { quantidade }, { auth: true })

/** DELETE /usuarios/me/geladeira/{id} */
export const remover = (id) => http.delete(`/usuarios/me/geladeira/${id}`, { auth: true })

/**
 * POST /receitas/compatibilidade — receitas compatíveis com os ingredientes enviados.
 * Retorna { dados }.
 * @param {{nome: string, quantidade: string, id_unidade_medida: number}[]} ingredientes
 */
export const receitasCompativeis = (ingredientes) =>
  http.post('/receitas/compatibilidade', { ingredientes }, { auth: true })
