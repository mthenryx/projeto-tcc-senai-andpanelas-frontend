import { http } from './http.js'

/** POST /usuarios/{id}/seguir */
export const seguir = (id) => http.post(`/usuarios/${id}/seguir`, undefined, { auth: true })

/** POST /usuarios/{id}/deixar-seguir */
export const deixarDeSeguir = (id) =>
  http.post(`/usuarios/${id}/deixar-seguir`, undefined, { auth: true })

/** GET /usuarios/{id}/seguidores — quem segue esse usuário. Retorna { dados }. */
export const listarSeguidores = (id, { pagina, limite } = {}) =>
  http.get(`/usuarios/${id}/seguidores`, { query: { pagina, limite } })

/** GET /usuarios/{id}/seguindo — quem esse usuário segue. Retorna { dados }. */
export const listarSeguindo = (id, { pagina, limite } = {}) =>
  http.get(`/usuarios/${id}/seguindo`, { query: { pagina, limite } })
