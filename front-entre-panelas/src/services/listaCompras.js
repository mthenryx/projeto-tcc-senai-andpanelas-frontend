const BASE_URL = "http://localhost:8080/v1/entrepanelas"
const url = `${BASE_URL}/usuarios/me/lista-compras`

export async function getListaComprasReceitas(jwt) {
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/receitas`, options)
    if(!response.ok) throw new Error("Erro ao listar as receitas da lista de compras!")
    return response.json()
}

export async function getListaComprasDaReceita(id_receita, params = {}, jwt) {
    const query = new URLSearchParams(params).toString()
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/receita/${id_receita}${query ? `?${query}` : ""}`, options)
    if(!response.ok) throw new Error(`Erro ao listar a lista de compras da receita: ${id_receita}`)
    return response.json()
}

export async function postAdicionarReceitaListaCompras(id_receita, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/receita/${id_receita}`, options)
    if(!response.ok) throw new Error(`Erro ao adicionar a receita à lista de compras: ${id_receita}`)
    return response.json()
}

export async function putItemListaCompras(id, dados, jwt) {
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/${id}`, options)
    if(!response.ok) throw new Error("Erro ao atualizar o item da lista de compras!")
    return response.json()
}

export async function deleteItemListaCompras(id, jwt) {
    const options = {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/${id}`, options)
    if(!response.ok) throw new Error("Erro ao deletar o item da lista de compras!")
    return true
}
