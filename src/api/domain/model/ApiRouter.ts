import { Router } from 'express'

export default abstract class ApiRouter {
  readonly router: Router

  constructor() {
    this.router = Router()
  }

  abstract routes(): void
}
