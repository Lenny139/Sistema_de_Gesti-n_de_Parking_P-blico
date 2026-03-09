import { type Request, type Response } from 'express'
import ApiRouter from '../../../../api/domain/model/ApiRouter.js'

export default class ErrorRouter extends ApiRouter {
  constructor() {
    super()
    this.routes()
  }

  override routes(): void {
    this.router.all('/{*any}', (_req: Request, res: Response) => {
      res.status(404).json({ message: 'Route not found' })
    })
  }
}
