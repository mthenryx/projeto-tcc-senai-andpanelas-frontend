const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'auth_user';

export const authService = {
  login(email, password) {
    
    if (!email || !password) {
      throw new Error('Preencha os campos!');
    }

    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkNoZWYgVGVzdGUiLCJpYXQiOjE1MTYyMzkwMjJ9.mock_signature_for_testing';
    const mockUser = { id: 1, name: 'Chef Teste', email: email };

    localStorage.setItem(TOKEN_KEY, fakeToken);
    localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    return true;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};