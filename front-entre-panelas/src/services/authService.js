import { postLogin } from './auth'

const TOKEN_KEY = 'jwt_token'
const USER_KEY = 'auth_user'

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

    localStorage.setItem(TOKEN_KEY, token)
    if (usuario) {
      localStorage.setItem(USER_KEY, JSON.stringify(usuario))
    }

    return usuario
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  getUser() {
    const rawUser = localStorage.getItem(USER_KEY)
    if (!rawUser || rawUser === 'undefined') return null

    try {
      return JSON.parse(rawUser)
    } catch {
      return null
    }
  },

  isAuthenticated() {
    const token = this.getToken()
    return Boolean(token && token !== 'undefined' && token !== 'null')
  }
}