import { vi } from 'vitest'

class LocalStorageMock {
  private store: Record<string, string> = {}

  clear(): void {
    this.store = {}
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null
  }

  setItem(key: string, value: string): void {
    this.store[key] = value
  }

  removeItem(key: string): void {
    delete this.store[key]
  }
}

Object.defineProperty(window, 'localStorage', { value: new LocalStorageMock() })

globalThis.fetch = vi.fn()
