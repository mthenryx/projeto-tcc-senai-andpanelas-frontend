const BASE_URL = "http://localhost:8080/v1/entrepanelas"
const url = `${BASE_URL}/denuncias`

// POST /denuncias/usuario
export async function postDenunciaUsuario(dados, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/usuario`, options)
    if(!response.ok) throw new Error("Erro ao criar a denúncia do usuário!")
    return response.json()
}

// POST /denuncias/comunidade
export async function postDenunciaComunidade(dados, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/comunidade`, options)
    if(!response.ok) throw new Error("Erro ao criar a denúncia da comunidade!")
    return response.json()
}

// POST /denuncias/receita
export async function postDenunciaReceita(dados, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/receita`, options)
    if(!response.ok) throw new Error("Erro ao criar a denúncia da receita!")
    return response.json()
}
