import express, { type Application, type Request, type Response, type NextFunction } from 'express'
import { existsSync } from 'fs'
import path from 'path'
import EnvironmentProviderInterface from '../../../domain/config/EnvironmentProviderInterface.js'
import ApiRouter from '../../../domain/model/ApiRouter.js'
import SwaggerRouter from '../swagger/SwaggerRouter.js'

export default class Server {
  private readonly app: Application

  constructor(
    private readonly env: EnvironmentProviderInterface,
    private readonly routers: ApiRouter[],
  ) {
    this.app = express()
    this.configure()
    this.routes()
  }

  private configure(): void {
    const frontendDist = path.join(process.cwd(), 'frontend', 'dist')

    if (existsSync(frontendDist)) {
      this.app.use(express.static(frontendDist))
    }

    this.app.use(express.json())

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')

      if (req.method === 'OPTIONS') {
        res.status(204).send()
        return
      }

      next()
    })
  }

  private routes(): void {
    const frontendDist = path.join(process.cwd(), 'frontend', 'dist')
    const allRouters: ApiRouter[] = [new SwaggerRouter(), ...this.routers]

    allRouters.forEach((router) => {
      this.app.use('/', router.router)
    })

    this.app.use((req: Request, res: Response) => {
      if (req.method !== 'GET') {
        res.status(404).json({ message: 'Not found' })
        return
      }

      if (!req.path.startsWith('/api') && !req.path.startsWith('/api-docs')) {
        const indexHtml = path.join(frontendDist, 'index.html')
        if (existsSync(indexHtml)) {
          res.sendFile(indexHtml)
          return
        }
      }

      res.status(404).json({ message: 'Not found' })
    })
  }

  start(): void {
    this.app.listen(this.env.getPort(), () => {
      console.log(`Server: http://${this.env.getHost()}:${this.env.getPort()}`)
    })
  }
}
