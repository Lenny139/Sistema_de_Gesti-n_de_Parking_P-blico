import { type Request, type Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import ApiRouter from '../../../domain/model/ApiRouter.js'
import swaggerSpec from './SwaggerConfig.js'

export default class SwaggerRouter extends ApiRouter {
  constructor() {
    super()
    this.routes()
  }

  override routes(): void {
    this.router.use('/api-docs', swaggerUi.serve)
    this.router.get('/api-docs', swaggerUi.setup(swaggerSpec))
    this.router.get('/api-docs.json', (_req: Request, res: Response) => {
      res.status(200).json(swaggerSpec)
    })
  }
}
