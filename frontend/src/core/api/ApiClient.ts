import ApiEndpoints from './ApiEndpoints.js'
import AuthStore from '../auth/AuthStore.js'

export default class ApiClient {
  private readonly authStore = AuthStore.getInstance()

  async get<T>(path: string): Promise<T> {
    return this.request<T>('GET', path)
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('POST', path, body)
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>('PUT', path, body)
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>('DELETE', path)
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const token = this.authStore.getToken()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${ApiEndpoints.baseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    if (response.status === 204) {
      return undefined as T
    }

    const data = (await response.json().catch(() => null)) as
      | { message?: string }
      | null

    if (response.status >= 400) {
      throw new Error(data?.message ?? `HTTP ${response.status}`)
    }

    return data as T
  }
}
