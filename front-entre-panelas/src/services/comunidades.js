const BASE_URL = "http://localhost:8080/v1/entrepanelas"
const url = `${BASE_URL}/comunidades`

// GET /comunidades
// query: pagina, limite, busca, id_categoria_principal
export async function getListarComunidades(params = {}) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${url}${query ? `?${query}` : ""}`)
    if(!response.ok) throw new Error("Erro ao listar as comunidades!")
    return response.json()
}

// POST /comunidades
export async function postComunidade(dados, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(url, options)
    if(!response.ok) throw new Error("Erro ao criar uma nova comunidade!")
    return response.json()
}

// GET /comunidades/{id}
export async function getBuscarComunidade(id) {
    const response = await fetch(`${url}/${id}`)
    if(!response.ok) throw new Error(`Erro ao buscar a comunidade: ${id}`)
    return response.json()
}

// PUT /comunidades/{id}
export async function putComunidade(id, dados, jwt) {
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/${id}`, options)
    if(!response.ok) throw new Error("Erro ao atualizar a comunidade!")
    return response.json()
}

// DELETE /comunidades/{id}
export async function deleteComunidade(id, jwt) {
    const options = {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/${id}`, options)
    if(!response.ok) throw new Error("Erro ao deletar a comunidade!")
    return true
}

// POST /comunidades/{id}/entrar
export async function postEntrarComunidade(id, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/${id}/entrar`, options)
    if(!response.ok) throw new Error("Erro ao entrar na comunidade!")
    return response.json()
}

// DELETE /comunidades/{id}/sair
export async function deleteSairComunidade(id, jwt) {
    const options = {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/${id}/sair`, options)
    if(!response.ok) throw new Error("Erro ao sair da comunidade!")
    return true
}

// GET /comunidades/{id}/receitas
// query: pagina, limite
export async function getReceitasDaComunidade(id, params = {}) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${url}/${id}/receitas${query ? `?${query}` : ""}`)
    if(!response.ok) throw new Error(`Erro ao listar as receitas da comunidade: ${id}`)
    return response.json()
}
