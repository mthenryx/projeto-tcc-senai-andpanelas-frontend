import { http } from './http.js'

/** POST /receitas/{id}/curtir */
export const curtir = (idReceita) =>
  http.post(`/receitas/${idReceita}/curtir`, undefined, { auth: true })

/** DELETE /receitas/{id}/curtir */
export const descurtir = (idReceita) =>
  http.delete(`/receitas/${idReceita}/curtir`, { auth: true })

/** POST /receitas/{id}/salvar */
export const salvar = (idReceita) =>
  http.post(`/receitas/${idReceita}/salvar`, undefined, { auth: true })

/** DELETE /receitas/{id}/salvar */
export const removerSalva = (idReceita) =>
  http.delete(`/receitas/${idReceita}/salvar`, { auth: true })

/** GET /receitas/{id}/comentarios — Retorna { dados }. */
export const listarComentarios = (idReceita, { pagina, limite } = {}) =>
  http.get(`/receitas/${idReceita}/comentarios`, { query: { pagina, limite } })

/** POST /receitas/{id}/comentarios */
export const comentar = (idReceita, comentario) =>
  http.post(`/receitas/${idReceita}/comentarios`, { comentario }, { auth: true })

/** PUT /comentarios/{id} — o id aqui é o do COMENTÁRIO, não o da receita. */
export const atualizarComentario = (idComentario, comentario) =>
  http.put(`/comentarios/${idComentario}`, { comentario }, { auth: true })

/** DELETE /comentarios/{id} */
export const deletarComentario = (idComentario) =>
  http.delete(`/comentarios/${idComentario}`, { auth: true })
