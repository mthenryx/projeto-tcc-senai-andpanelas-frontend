const BASE_URL = "http://localhost:8080/v1/entrepanelas"
const url = `${BASE_URL}/usuarios`

export async function getListarUsuarios(params = {}) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${url}${query ? `?${query}` : ""}`)
    if(!response.ok) throw new Error("Erro ao listar os usuários!")
    return response.json()
}

export async function getBuscarUsuarioPorUsername(params = {}) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${url}/busca/username${query ? `?${query}` : ""}`)
    if(!response.ok) throw new Error("Erro ao buscar o usuário pelo username!")
    return response.json()
}

export async function getBuscarUsuario(id) {
    const response = await fetch(`${url}/${id}`)
    if(!response.ok) throw new Error(`Erro ao buscar o usuário: ${id}`)
    return response.json()
}

export async function getUsuarioLogado(jwt) {
    const options = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/me`, options)
    if(!response.ok) throw new Error("Erro ao buscar o perfil do usuário logado!")
    return response.json()
}

export async function putUsuarioLogado(dados, jwt) {
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/me`, options)
    if(!response.ok) throw new Error("Erro ao atualizar o perfil!")
    return response.json()
}

export async function postAlterarEmail(dados, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/me/alterar-email`, options)
    if(!response.ok) throw new Error("Erro ao solicitar a alteração de e-mail!")
    return response.json()
}

export async function postConfirmarAlteracaoEmail(dados, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/me/confirmar-alteracao`, options)
    if(!response.ok) throw new Error("Erro ao confirmar a alteração de e-mail!")
    return response.json()
}

export async function postAlterarSenha(dados, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify(dados)
    }
    const response = await fetch(`${url}/me/alterar-senha`, options)
    if(!response.ok) throw new Error("Erro ao alterar a senha!")
    return response.json()
}

export async function postSeguirUsuario(id, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/${id}/seguir`, options)
    if(!response.ok) throw new Error(`Erro ao seguir o usuário: ${id}`)
    return response.json()
}

export async function postDeixarSeguirUsuario(id, jwt) {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    }
    const response = await fetch(`${url}/${id}/deixar-seguir`, options)
    if(!response.ok) throw new Error(`Erro ao deixar de seguir o usuário: ${id}`)
    return response.json()
}

export async function getSeguidoresUsuario(id, params = {}) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${url}/${id}/seguidores${query ? `?${query}` : ""}`)
    if(!response.ok) throw new Error(`Erro ao listar os seguidores do usuário: ${id}`)
    return response.json()
}

export async function getSeguindoUsuario(id, params = {}) {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${url}/${id}/seguindo${query ? `?${query}` : ""}`)
    if(!response.ok) throw new Error(`Erro ao listar os usuários seguidos pelo usuário: ${id}`)
    return response.json()
}
