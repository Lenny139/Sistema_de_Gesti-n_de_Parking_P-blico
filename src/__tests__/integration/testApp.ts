import express, { type Application, type NextFunction, type Request, type Response } from 'express'
import ApiRouter from '../../api/domain/model/ApiRouter.js'

import ErrorRouter from '../../error/infrastructure/adapter/api/ErrorRouter.js'

import AuthFactory from '../../auth/infrastructure/factory/AuthFactory.js'
import UserRepositoryInMemory from '../../auth/infrastructure/adapter/repository/UserRepositoryInMemory.js'

import TarifaFactory from '../../tarifa/infrastructure/factory/TarifaFactory.js'
import TarifaRepositoryInMemory from '../../tarifa/infrastructure/adapter/repository/TarifaRepositoryInMemory.js'
import TarifaService from '../../tarifa/application/service/TarifaService.js'
import TarifaUsecase from '../../tarifa/application/usecase/TarifaUsecase.js'

import ParkingFactory from '../../parking/infrastructure/factory/ParkingFactory.js'
import TicketRepositoryInMemory from '../../parking/infrastructure/adapter/repository/TicketRepositoryInMemory.js'
import MovimientoRepositoryInMemory from '../../parking/infrastructure/adapter/repository/MovimientoRepositoryInMemory.js'
import TicketService from '../../parking/application/service/TicketService.js'
import TicketUsecase from '../../parking/application/usecase/TicketUsecase.js'

import ReporteFactory from '../../reporte/infrastructure/factory/ReporteFactory.js'
import ReporteService from '../../reporte/application/service/ReporteService.js'

export const createIntegrationApp = (): Application => {
  const app = express()

  app.use(express.json())
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    )
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')

    if (req.method === 'OPTIONS') {
      res.status(204).send()
      return
    }

    next()
  })

  const userRepo = new UserRepositoryInMemory()
  const ticketRepo = new TicketRepositoryInMemory()
  const movimientoRepo = new MovimientoRepositoryInMemory()
  const tarifaRepo = new TarifaRepositoryInMemory()

  const tarifaService = new TarifaService(tarifaRepo)
  const tarifaUsecase = new TarifaUsecase(tarifaService)
  const ticketService = new TicketService(ticketRepo, movimientoRepo, tarifaService)
  const ticketUsecase = new TicketUsecase(ticketService)
  const reporteService = new ReporteService(movimientoRepo, ticketRepo, userRepo)

  const routers: ApiRouter[] = [
    AuthFactory.create(userRepo),
    TarifaFactory.create(tarifaUsecase),
    ParkingFactory.create(ticketUsecase),
    ReporteFactory.create(reporteService),
    new ErrorRouter(),
  ]

  routers.forEach((router) => {
    app.use('/', router.router)
  })

  return app
}
