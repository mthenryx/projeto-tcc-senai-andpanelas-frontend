import 'dotenv/config'
const BASE_URL = `${process.env.VITE_API_URL}`

export async function getListarCategorias() {
    const response = await fetch(`${BASE_URL}/categorias`)
    if(!response.ok) throw new Error("Erro ao listar as categorias!")
    return response.json()
}

export async function getListarTags(params = {}) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${BASE_URL}/tags${query ? `?${query}` : ""}`)
    if(!response.ok) throw new Error("Erro ao listar as tags!")
    return response.json()
}

export async function postTag(dados, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${BASE_URL}/tags`, options)
    if(!response.ok) throw new Error("Erro ao cadastrar a tag!")
    return response.json()
}

export async function getListarCategoriasComunidades() {
    const response = await fetch(`${BASE_URL}/categorias-comunidades`)
    if(!response.ok) throw new Error("Erro ao listar as categorias de comunidades!")
    return response.json()
}

export async function postCategoriaComunidade(dados, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${BASE_URL}/categorias-comunidades`, options)
    if(!response.ok) throw new Error("Erro ao cadastrar a categoria de comunidade!")
    return response.json()
}
