import Server from './api/infrastructure/adapter/express/Server.js'
import EnvironmentProvider from './api/infrastructure/provider/EnvironmentProvider.js'
import ErrorRouter from './error/infrastructure/adapter/api/ErrorRouter.js'

import AuthFactory from './auth/infrastructure/factory/AuthFactory.js'
import UserRepositoryInMemory from './auth/infrastructure/adapter/repository/UserRepositoryInMemory.js'

import TarifaFactory from './tarifa/infrastructure/factory/TarifaFactory.js'
import TarifaRepositoryInMemory from './tarifa/infrastructure/adapter/repository/TarifaRepositoryInMemory.js'
import TarifaService from './tarifa/application/service/TarifaService.js'
import TarifaUsecase from './tarifa/application/usecase/TarifaUsecase.js'

import ParkingFactory from './parking/infrastructure/factory/ParkingFactory.js'
import TicketRepositoryInMemory from './parking/infrastructure/adapter/repository/TicketRepositoryInMemory.js'
import MovimientoRepositoryInMemory from './parking/infrastructure/adapter/repository/MovimientoRepositoryInMemory.js'
import TicketService from './parking/application/service/TicketService.js'
import TicketUsecase from './parking/application/usecase/TicketUsecase.js'

import ReporteFactory from './reporte/infrastructure/factory/ReporteFactory.js'
import ReporteService from './reporte/application/service/ReporteService.js'

try {
  const provider = EnvironmentProvider.getInstance()

  const userRepo = new UserRepositoryInMemory()
  const ticketRepo = new TicketRepositoryInMemory()
  const movimientoRepo = new MovimientoRepositoryInMemory()
  const tarifaRepo = new TarifaRepositoryInMemory()

  const tarifaService = new TarifaService(tarifaRepo)
  const tarifaUsecase = new TarifaUsecase(tarifaService)
  const ticketService = new TicketService(ticketRepo, movimientoRepo, tarifaService)
  const ticketUsecase = new TicketUsecase(ticketService)
  const reporteService = new ReporteService(movimientoRepo, ticketRepo, userRepo)

  const authRouter = AuthFactory.create(userRepo)
  const tarifaRouter = TarifaFactory.create(tarifaUsecase)
  const parkingRouter = ParkingFactory.create(ticketUsecase)
  const reporteRouter = ReporteFactory.create(reporteService)
  const errorRouter = new ErrorRouter()

  const server = new Server(provider, [
    authRouter,
    tarifaRouter,
    parkingRouter,
    reporteRouter,
    errorRouter,
  ])

  server.start()
} catch (error) {
  console.error('Error starting the server:', error)
}
