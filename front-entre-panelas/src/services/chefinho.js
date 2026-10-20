import { http } from './http.js'

// Aceita mensagens no formato da API ({ tipo_remetente, conteudo }) ou já no formato
// do envio ({ papel, mensagem }) e devolve só as 10 últimas, em ordem cronológica.
const paraHistorico = (mensagens = []) =>
  mensagens.slice(-10).map((m) => ({
    papel: m.papel ?? (m.tipo_remetente === 'usuario' ? 'user' : 'agente'),
    mensagem: m.mensagem ?? m.conteudo,
  }))

/** GET /chefinho/conversas — conversas do usuário. Retorna { dados: [{ id, titulo, data_hora }] }. */
export const listarConversas = ({ pagina, limite } = {}) =>
  http.get('/chefinho/conversas', { query: { pagina, limite }, auth: true })

/** GET /chefinho/conversas/{id} — conversa com as mensagens. */
export const obterConversa = (id) => http.get(`/chefinho/conversas/${id}`, { auth: true })

/** DELETE /chefinho/conversas/{id} */
export const deletarConversa = (id) => http.delete(`/chefinho/conversas/${id}`, { auth: true })

/**
 * POST /chefinho/conversas/{id}/mensagens — envia a pergunta e recebe a resposta.
 * Retorna { mensagem_usuario, resposta_chefinho }.
 * @param {number} idConversa
 * @param {string} pergunta   a mensagem atual do usuário
 * @param {Array}  [historico] mensagens ANTERIORES (sem a pergunta atual). Pode ser o array
 *                             vindo de obterConversa(); só as 10 últimas são enviadas.
 */
export const enviarMensagem = (idConversa, pergunta, historico = []) =>
  http.post(
    `/chefinho/conversas/${idConversa}/mensagens`,
    { historico_conversa: paraHistorico(historico), pergunta_atual: pergunta },
    { auth: true },
  )
