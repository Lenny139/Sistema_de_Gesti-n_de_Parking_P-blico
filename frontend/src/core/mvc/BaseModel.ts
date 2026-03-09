type Listener = (data?: unknown) => void

export default abstract class BaseModel {
  private listeners: Map<string, Function[]>

  constructor() {
    this.listeners = new Map<string, Function[]>()
  }

  on(event: string, callback: Function): void {
    const current = this.listeners.get(event) ?? []
    current.push(callback)
    this.listeners.set(event, current)
  }

  emit(event: string, data?: unknown): void {
    const current = this.listeners.get(event) ?? []
    current.forEach((callback) => {
      ;(callback as Listener)(data)
    })
  }

  off(event: string, callback: Function): void {
    const current = this.listeners.get(event) ?? []
    this.listeners.set(
      event,
      current.filter((listener) => listener !== callback),
    )
  }
}
