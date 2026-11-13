import { postLogin } from './auth'
import { getUsuarioLogado } from './usuarios'

const TOKEN_KEY = 'jwt_token'
const USER_KEY = 'auth_user'
const USER_ID_KEY = 'id_usuario'

function extrairIdDoToken(token) {
  try {
    if (!token) return null
    const payloadBase64 = token.split('.')[1]
    if (!payloadBase64) return null

    const base64Normalizado = payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64Normalizado))
    const id = payload?.id ?? payload?.id_usuario ?? payload?.sub ?? null

    return id !== null && id !== undefined ? Number(id) : null
  } catch {
    return null
  }
}

export const authService = {
  async login(email, senha) {
    if (!email || !senha) {
      throw new Error('Preencha todos os campos!')
    }

    const resultado = await postLogin({ email, senha })
    const { token, usuario } = resultado?.response || {}

    if (!token) {
      throw new Error('Token de autenticação não retornado pelo servidor.')
    }

    this.setToken(token)

    let dadosUsuario = usuario ? { ...usuario } : null

    if (!dadosUsuario?.id) {
      try {
        const perfilRes = await getUsuarioLogado(token)
        const perfil = perfilRes?.response?.dados || perfilRes?.dados || null
        if (perfil) {
          dadosUsuario = { ...(dadosUsuario || {}), ...perfil }
        }
      } catch {
        // Fallback para extração via payload do JWT caso /usuarios/me falhe
      }
    }

    if (!dadosUsuario?.id) {
      const idToken = extrairIdDoToken(token)
      if (idToken) {
        dadosUsuario = { ...(dadosUsuario || {}), id: idToken }
      }
    }

    if (dadosUsuario) {
      this.setUser(dadosUsuario)
    }

    return dadosUsuario
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(USER_ID_KEY)
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    }
  },

  getUser() {
    const rawUser = localStorage.getItem(USER_KEY)
    if (!rawUser || rawUser === 'undefined' || rawUser === 'null') return null

    try {
      return JSON.parse(rawUser)
    } catch {
      return null
    }
  },

  setUser(usuario) {
    if (!usuario) return
    localStorage.setItem(USER_KEY, JSON.stringify(usuario))

    if (usuario.id !== undefined && usuario.id !== null) {
      localStorage.setItem(USER_ID_KEY, String(usuario.id))
    }
  },

  getUserId() {
    const usuario = this.getUser()
    if (usuario?.id !== undefined && usuario?.id !== null) {
      return Number(usuario.id)
    }

    const idSalvo = localStorage.getItem(USER_ID_KEY)
    if (idSalvo && idSalvo !== 'undefined' && idSalvo !== 'null') {
      return Number(idSalvo)
    }

    const idToken = extrairIdDoToken(this.getToken())
    if (idToken) {
      localStorage.setItem(USER_ID_KEY, String(idToken))
      return idToken
    }

    return null
  },

  isAuthenticated() {
    const token = this.getToken()
    return Boolean(token && token !== 'undefined' && token !== 'null')
  }
}

export default authService