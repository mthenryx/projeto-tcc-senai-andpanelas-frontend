import { http } from './http.js'

/** GET /usuarios — lista paginada. Retorna { dados }.
 *  @param {{ pagina?: number, limite?: number, busca?: string }} [filtros] */
export const listar = (filtros = {}, options) =>
  http.get('/usuarios', { query: filtros, ...options })

/** GET /usuarios/busca/username?username= — busca por username semelhante (ótimo p/ o modal de busca).
 *  options pode levar { signal } de um AbortController. */
export const buscarPorUsername = (username, options) =>
  http.get('/usuarios/busca/username', { query: { username }, ...options })

/** GET /usuarios/{id} — perfil público (inclui qtd_seguidores, qtd_seguindo, qtd_receitas). */
export const obter = (id) => http.get(`/usuarios/${id}`)

/** GET /usuarios/me — dados do usuário logado. */
export const meuPerfil = () => http.get('/usuarios/me', { auth: true })

/**
 * PUT /usuarios/me — atualiza o perfil. Envie só o que mudou.
 * @param {{ nome?: string, username?: string, descricao?: string,
 *           banner_url?: string, foto_perfil?: string }} dados
 */
export const atualizarMeuPerfil = (dados) => http.put('/usuarios/me', dados, { auth: true })

/** POST /usuarios/me/alterar-email — envia código ao e-mail. Conclua com confirmarAlteracao(). */
export const alterarEmail = (novo_email) =>
  http.post('/usuarios/me/alterar-email', { novo_email }, { auth: true })

/** POST /usuarios/me/alterar-senha — inicia a troca de senha (envia código ao e-mail). */
export const alterarSenha = (senha_atual) =>
  http.post('/usuarios/me/alterar-senha', { senha_atual }, { auth: true })

/** POST /usuarios/me/confirmar-alteracao — valida o código de 6 dígitos (e-mail, senha...). */
export const confirmarAlteracao = (codigo) =>
  http.post('/usuarios/me/confirmar-alteracao', { codigo }, { auth: true })
