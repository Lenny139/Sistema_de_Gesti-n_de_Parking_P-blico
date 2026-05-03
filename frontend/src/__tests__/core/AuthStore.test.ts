import { describe, it, expect, beforeEach } from 'vitest'
import AuthStore, { ERole } from '../../core/auth/AuthStore.js'

describe('AuthStore', () => {
  let store: AuthStore

  beforeEach(() => {
    localStorage.clear()
    // @ts-expect-error - reset private instance
    ;(AuthStore as any).instance = undefined
    store = AuthStore.getInstance()
  })

  it('debe ser un Singleton (misma instancia)', () => {
    const a = AuthStore.getInstance()
    const b = AuthStore.getInstance()
    expect(a).toBe(b)
  })

  it('isAuthenticated() retorna false cuando no hay token', () => {
    expect(store.isAuthenticated()).toBe(false)
  })

  it('setToken + getToken funcionan correctamente', () => {
    store.setToken('mi-token-jwt', { userId: '1', username: 'admin', role: ERole.ADMINISTRADOR })
    expect(store.getToken()).toBe('mi-token-jwt')
    expect(store.isAuthenticated()).toBe(true)
  })

  it('getRole() retorna el rol correcto', () => {
    store.setToken('tk', { userId: '1', username: 'op', role: ERole.OPERADOR })
    expect(store.getRole()).toBe(ERole.OPERADOR)
  })

  it('isAdmin() retorna true solo para ADMINISTRADOR', () => {
    store.setToken('tk', { userId: '1', username: 'admin', role: ERole.ADMINISTRADOR })
    expect(store.isAdmin()).toBe(true)

    store.clear()
    store.setToken('tk', { userId: '2', username: 'op', role: ERole.OPERADOR })
    expect(store.isAdmin()).toBe(false)
  })

  it('clear() elimina el token del localStorage', () => {
    store.setToken('tk', { userId: '1', username: 'test', role: ERole.OPERADOR })
    store.clear()
    expect(store.isAuthenticated()).toBe(false)
    expect(store.getToken()).toBeNull()
  })
})
