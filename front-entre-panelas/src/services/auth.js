const BASE_URL = "http://localhost:8080/v1/entrepanelas"
const url = `${BASE_URL}/auth`

export async function postRegistro(dados) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/registro`, options)
    if(!response.ok) throw new Error("Erro ao realizar o registro!")
    return response.json()
}

// POST /auth/verificar-email
export async function postVerificarEmail(dados) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/verificar-email`, options)
    if(!response.ok) throw new Error("Erro ao verificar o e-mail!")
    return response.json()
}

// POST /auth/login
export async function postLogin(dados) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/login`, options)
    if(!response.ok) throw new Error("Erro ao realizar o login!")
    return response.json()
}

// POST /auth/recuperar-senha
export async function postRecuperarSenha(dados) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/recuperar-senha`, options)
    if(!response.ok) throw new Error("Erro ao solicitar a recuperação de senha!")
    return response.json()
}

// POST /auth/verificar-codigo-reset
export async function postVerificarCodigoReset(dados) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/verificar-codigo-reset`, options)
    if(!response.ok) throw new Error("Erro ao verificar o código de redefinição!")
    return response.json()
}

// POST /auth/redefinir-senha
export async function postRedefinirSenha(dados) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/redefinir-senha`, options)
    if(!response.ok) throw new Error("Erro ao redefinir a senha!")
    return response.json()
}
