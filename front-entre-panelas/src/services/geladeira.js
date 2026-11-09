const BASE_URL = "http://localhost:8080/v1/entrepanelas"
const url = `${BASE_URL}/usuarios/me/geladeira`

export async function getListarGeladeira(params = {}, jwt) {
    const query = new URLSearchParams(params).toString()
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}${query ? `?${query}` : ""}`, options)
    if(!response.ok) throw new Error("Erro ao listar os ingredientes da geladeira!")
    return response.json()
}

export async function postIngredienteGeladeira(dados, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(url, options)
    if(!response.ok) throw new Error("Erro ao adicionar o ingrediente à geladeira!")
    return response.json()
}

export async function putIngredienteGeladeira(id, dados, jwt) {
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/${id}`, options)
    if(!response.ok) throw new Error("Erro ao atualizar o ingrediente da geladeira!")
    return response.json()
}

export async function deleteIngredienteGeladeira(id, jwt) {
    const options = {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/${id}`, options)
    if(!response.ok) throw new Error("Erro ao deletar o ingrediente da geladeira!")
    return true
}
