const BASE_URL = "http://localhost:8080/v1/entrepanelas"
const url = `${BASE_URL}/comunidades`

export async function getListarComunidades(params = {}) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${url}${query ? `?${query}` : ""}`)
    if(!response.ok) throw new Error("Erro ao listar as comunidades!")
    return response.json()
}

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

export async function getBuscarComunidade(id) {
    const response = await fetch(`${url}/${id}`)
    if(!response.ok) throw new Error(`Erro ao buscar a comunidade: ${id}`)
    return response.json()
}

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

export async function getReceitasDaComunidade(id, params = {}) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${url}/${id}/receitas${query ? `?${query}` : ""}`)
    if(!response.ok) throw new Error(`Erro ao listar as receitas da comunidade: ${id}`)
    return response.json()
}
