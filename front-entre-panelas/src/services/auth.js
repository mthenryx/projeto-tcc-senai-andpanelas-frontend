import { http, sessao } from './http.js'

/**
 * POST /auth/registro — cria a conta e envia um código de 6 dígitos para o e-mail.
 * Depois chame verificarEmail().
 * @param {{ nome: string, username: string, email: string, senha: string,
 *           data_nascimento: string, foto_perfil?: string }} dados  data no formato AAAA-MM-DD
 */
export const registrar = (dados) => http.post('/auth/registro', dados)

/** POST /auth/verificar-email — confirma o código recebido no cadastro. */
export const verificarEmail = ({ email, codigo }) =>
  http.post('/auth/verificar-email', { email, codigo })

/**
 * POST /auth/login — autentica e já guarda o token e o usuário na sessão.
 * Retorna { token, usuario }.
 */
export async function login({ email, senha }) {
  const resposta = await http.post('/auth/login', { email, senha })
  sessao.salvar({ token: resposta.token, usuario: resposta.usuario })
  return resposta
}

/** Encerra a sessão (só limpa o token local; a API não tem rota de logout). */
export const logout = () => sessao.limpar()

/** POST /auth/recuperar-senha — envia código de 6 dígitos para o e-mail. */
export const recuperarSenha = (email) => http.post('/auth/recuperar-senha', { email })

/** POST /auth/verificar-codigo-reset — valida o código de recuperação. */
export const verificarCodigoReset = ({ email, codigo }) =>
  http.post('/auth/verificar-codigo-reset', { email, codigo })

/**
 * POST /auth/redefinir-senha — define a nova senha após validar o código.
 * @param {{ email: string, codigo: string, nova_senha: string, confirmar_senha: string }} dados
 */
export const redefinirSenha = (dados) => http.post('/auth/redefinir-senha', dados)
