import { http, sessao } from './http.js'

// Todas as denúncias exigem "id_usuario" (quem denuncia). Se você não enviar,
// usamos o id do usuário logado automaticamente.
const quemDenuncia = () => {
  const usuario = sessao.getUsuario()
  return usuario ? usuario.id : undefined
}

/**
 * POST /denuncias/usuario
 * @param {{ id_usuario_denunciado: number, motivo: string, detalhe: string, id_usuario?: number }} dados
 *        motivo: um dos valores de MOTIVOS_DENUNCIA
 */
export const usuario = (dados) =>
  http.post('/denuncias/usuario', { id_usuario: quemDenuncia(), ...dados }, { auth: true })

/**
 * POST /denuncias/comunidade
 * @param {{ id_comunidade: number, motivo: string, detalhe: string, id_usuario?: number }} dados
 */
export const comunidade = (dados) =>
  http.post('/denuncias/comunidade', { id_usuario: quemDenuncia(), ...dados }, { auth: true })

/**
 * POST /denuncias/receita
 * @param {{ id_receita: number, motivo: string, detalhe: string, id_usuario?: number }} dados
 */
export const receita = (dados) =>
  http.post('/denuncias/receita', { id_usuario: quemDenuncia(), ...dados }, { auth: true })
