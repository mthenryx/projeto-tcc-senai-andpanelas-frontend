const BASE_URL = "http://localhost:8080/v1/entrepanelas"
const url = `${BASE_URL}/receitas`

// GET /receitas
// query: pagina, limite, busca, id_categoria, id_dificuldade, id_custo, tempo_max, id_comunidade, ordenar_por
export async function getListarReceitas(params = {}) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${url}${query ? `?${query}` : ""}`)
    if(!response.ok) throw new Error("Erro ao listar as receitas!")
    return response.json()
}

// POST /receitas
export async function postReceita(dados, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(url, options)
    if(!response.ok) throw new Error("Erro ao criar uma nova receita!")
    return response.json()
}

// GET /receitas/semana
export async function getReceitasDaSemana() {
    const response = await fetch(`${url}/semana`)
    if(!response.ok) throw new Error("Erro ao listar as receitas da semana!")
    return response.json()
}

// GET /receitas/busca/categoria
// query: id_categoria, pagina, limite
export async function getBuscarReceitasPorCategoria(params = {}) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${url}/busca/categoria${query ? `?${query}` : ""}`)
    if(!response.ok) throw new Error("Erro ao buscar receitas por categoria!")
    return response.json()
}

// GET /receitas/busca/nome
// query: nome, pagina, limite
export async function getBuscarReceitasPorNome(params = {}) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${url}/busca/nome${query ? `?${query}` : ""}`)
    if(!response.ok) throw new Error("Erro ao buscar receitas pelo nome!")
    return response.json()
}

// POST /receitas/busca/ingredientes
export async function postBuscarReceitasPorIngredientes(dados) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/busca/ingredientes`, options)
    if(!response.ok) throw new Error("Erro ao buscar receitas pelos ingredientes!")
    return response.json()
}

// GET /receitas/{id}
export async function getBuscarReceita(id) {
    const response = await fetch(`${url}/${id}`)
    if(!response.ok) throw new Error(`Erro ao buscar a receita: ${id}`)
    return response.json()
}

// PUT /receitas/{id}
export async function putReceita(id, dados, jwt) {
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/${id}`, options)
    if(!response.ok) throw new Error("Erro ao atualizar a receita!")
    return response.json()
}

// DELETE /receitas/{id}
export async function deleteReceita(id, jwt) {
    const options = {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/${id}`, options)
    if(!response.ok) throw new Error("Erro ao deletar a receita!")
    return true
}

// POST /receitas/{id}/curtir
export async function postCurtirReceita(id, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/${id}/curtir`, options)
    if(!response.ok) throw new Error("Erro ao curtir a receita!")
    return response.json()
}

// DELETE /receitas/{id}/curtir
export async function deleteCurtirReceita(id, jwt) {
    const options = {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/${id}/curtir`, options)
    if(!response.ok) throw new Error("Erro ao remover a curtida da receita!")
    return true
}

// POST /receitas/{id}/salvar
export async function postSalvarReceita(id, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/${id}/salvar`, options)
    if(!response.ok) throw new Error("Erro ao salvar a receita!")
    return response.json()
}

// DELETE /receitas/{id}/salvar
export async function deleteSalvarReceita(id, jwt) {
    const options = {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/${id}/salvar`, options)
    if(!response.ok) throw new Error("Erro ao remover a receita salva!")
    return true
}

// GET /receitas/{id}/comentarios
// query: pagina, limite
export async function getComentariosReceita(id, params = {}) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${url}/${id}/comentarios${query ? `?${query}` : ""}`)
    if(!response.ok) throw new Error("Erro ao listar os comentários da receita!")
    return response.json()
}

// POST /receitas/{id}/comentarios
export async function postComentarioReceita(id, dados, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/${id}/comentarios`, options)
    if(!response.ok) throw new Error("Erro ao criar o comentário!")
    return response.json()
}

// POST /receitas/compatibilidade
export async function postCompatibilidadeReceitas(dados, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/compatibilidade`, options)
    if(!response.ok) throw new Error("Erro ao verificar a compatibilidade das receitas!")
    return response.json()
}

// GET /em-alta
export async function getBuscasEmAlta() {
    const response = await fetch(`${BASE_URL}/em-alta`)
    if(!response.ok) throw new Error("Erro ao obter as buscas em alta!")
    return response.json()
}
