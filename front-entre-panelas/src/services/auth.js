const url = `${import.meta.env.VITE_API_URL}/auth`

async function request(endpoint, dados, fallbackError) {
  const response = await fetch(`${url}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  })

  const data = await response.json().catch(() => null)

  if (!response.ok || (data && data.status === false)) {
    throw new Error(data?.message || fallbackError)
  }

  return data
}

export async function postRegistro(dados) {
  return request('/registro', dados, 'Erro ao realizar o registro!')
}

export async function postVerificarEmail(dados) {
  return request('/verificar-email', dados, 'Erro ao verificar o e-mail!')
}

export async function postLogin(dados) {
  return request('/login', dados, 'Erro ao realizar o login!')
}

export async function postRecuperarSenha(dados) {
  return request('/recuperar-senha', dados, 'Erro ao solicitar a recuperação de senha!')
}

export async function postVerificarCodigoReset(dados) {
  return request('/verificar-codigo-reset', dados, 'Erro ao verificar o código de redefinição!')
}

export async function postRedefinirSenha(dados) {
  return request('/redefinir-senha', dados, 'Erro ao redefinir a senha!')
}