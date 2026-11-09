const BASE_URL = "http://localhost:8080/v1/entrepanelas"
const url = `${BASE_URL}/comentarios`

export async function putComentario(id, dados, jwt) {
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/${id}`, options)
    if(!response.ok) throw new Error("Erro ao atualizar o comentário!")
    return response.json()
}

export async function deleteComentario(id, jwt) {
    const options = {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/${id}`, options)
    if(!response.ok) throw new Error("Erro ao deletar o comentário!")
    return true
}
