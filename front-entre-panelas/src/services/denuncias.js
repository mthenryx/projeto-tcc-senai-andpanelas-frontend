import 'dotenv/config'
const url = `${process.env.VITE_API_URL}/denuncias`

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
