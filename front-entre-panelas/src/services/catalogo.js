const BASE_URL = "http://localhost:8080/v1/entrepanelas"

// GET /categorias
export async function getListarCategorias() {
    const response = await fetch(`${BASE_URL}/categorias`)
    if(!response.ok) throw new Error("Erro ao listar as categorias!")
    return response.json()
}

// GET /tags
// query: pagina, limite
export async function getListarTags(params = {}) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${BASE_URL}/tags${query ? `?${query}` : ""}`)
    if(!response.ok) throw new Error("Erro ao listar as tags!")
    return response.json()
}

// POST /tags
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

// GET /categorias-comunidades
export async function getListarCategoriasComunidades() {
    const response = await fetch(`${BASE_URL}/categorias-comunidades`)
    if(!response.ok) throw new Error("Erro ao listar as categorias de comunidades!")
    return response.json()
}

// POST /categorias-comunidades
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
