const TEMPO_LIMITE_PADRAO_MS = 15000

/**
 * Impede que chamadas à API permaneçam pendentes indefinidamente.
 * O signal é criado por requisição, evitando compartilhar cancelamentos entre telas.
 */
export async function fetchComTimeout(url, options = {}, timeoutMs = TEMPO_LIMITE_PADRAO_MS) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } catch (error) {
    if (controller.signal.aborted) {
      const timeoutError = new Error(`A API não respondeu em ${Math.round(timeoutMs / 1000)} segundos.`)
      timeoutError.name = 'TimeoutError'
      throw timeoutError
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}
