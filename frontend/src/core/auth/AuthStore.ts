export enum ERole {
  OPERADOR = 'OPERADOR',
  ADMINISTRADOR = 'ADMINISTRADOR',
}

export interface IAuthPayload {
  userId: string
  username: string
  role: ERole
}

export default class AuthStore {
  private static instance: AuthStore
  private readonly tokenKey = 'frontend.auth.token'
  private readonly userKey = 'frontend.auth.user'

  private constructor() {}

  static getInstance(): AuthStore {
    if (!AuthStore.instance) {
      AuthStore.instance = new AuthStore()
    }

    return AuthStore.instance
  }

  setToken(token: string, user: object): void {
    localStorage.setItem(this.tokenKey, token)
    localStorage.setItem(this.userKey, JSON.stringify(user))
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  getUser(): IAuthPayload | null {
    const raw = localStorage.getItem(this.userKey)
    if (!raw) {
      return null
    }

    try {
      return JSON.parse(raw) as IAuthPayload
    } catch {
      return null
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  isAdmin(): boolean {
    return this.getRole() === ERole.ADMINISTRADOR
  }

  clear(): void {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
  }

  getRole(): ERole | null {
    return this.getUser()?.role ?? null
  }
}
