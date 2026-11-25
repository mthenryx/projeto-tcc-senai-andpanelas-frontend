const API_BASE = import.meta.env.VITE_API_URL || ''
const CHEFINHO_BASE = import.meta.env.VITE_CHEFINHO_URL || ''

export function instalarLogDaApi() {
  if (!import.meta.env.DEV) return

  const fetchOriginal = window.fetch.bind(window)

  window.fetch = async (entrada, opcoes = {}) => {
    const url = typeof entrada === 'string' ? entrada : entrada.url
    const resposta = await fetchOriginal(entrada, opcoes)

    const ehApi = (API_BASE && url.startsWith(API_BASE)) || (CHEFINHO_BASE && url.startsWith(CHEFINHO_BASE))
    if (!ehApi) return resposta

    const corpo = await resposta.clone().json().catch(() => null)
    const metodo = opcoes.method || 'GET'
    const registrar = resposta.ok ? console.log : console.warn
    registrar(`[API] ${metodo} ${url} -> ${resposta.status}`, corpo)

    return resposta
  }
}
