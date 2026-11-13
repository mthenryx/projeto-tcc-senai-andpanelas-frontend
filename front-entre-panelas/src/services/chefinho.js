const url = "http://localhost:8080/v1/chefinho/conversas"

export async function getListarConversasChefinho(params = {}, jwt) {
    const query = new URLSearchParams(params).toString()
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}${query ? `?${query}` : ""}`, options)
    if(!response.ok) throw new Error("Erro ao listar as conversas do Chefinho!")
    return response.json()
}

export async function postCriarConversasChefinho(id, dados, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}`, options)
    if(!response.ok) throw new Error("Erro ao enviar a mensagem para o Chefinho!")
    return response.json()
}

export async function getBuscarConversaChefinho(id, jwt) {
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/${id}`, options)
    if(!response.ok) throw new Error(`Erro ao buscar a conversa do Chefinho: ${id}`)
    return response.json()
}

export async function deleteConversaChefinho(id, jwt) {
    const options = {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/${id}`, options)
    if(!response.ok) throw new Error(`Erro ao deletar a conversa do Chefinho: ${id}`)
    return true
}

export async function postMensagemChefinho(id, dados, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/${id}/mensagens`, options)
    if(!response.ok) throw new Error("Erro ao enviar a mensagem para o Chefinho!")
    return response.json()
}
