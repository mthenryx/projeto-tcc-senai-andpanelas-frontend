// Ponto único de importação:
//   import { receitas, auth, ApiError } from '@/services'

export { http, sessao, ApiError, BASE_URL, definirAoExpirarSessao } from './http.js'
export * from './constantes.js'

export * as auth from './auth.js'
export * as usuarios from './usuarios.js'
export * as seguidores from './seguidores.js'
export * as receitas from './receitas.js'
export * as interacoes from './interacoes.js'
export * as geladeira from './geladeira.js'
export * as listaCompras from './listaCompras.js'
export * as comunidades from './comunidades.js'
export * as chefinho from './chefinho.js'
export * as denuncias from './denuncias.js'
