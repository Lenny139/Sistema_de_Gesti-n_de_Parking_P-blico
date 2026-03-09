import ApiRouter from '../../../api/domain/model/ApiRouter.js'
import ITicketUsecasePort from '../../domain/port/driver/usecase/ITicketUsecasePort.js'
import TicketController from '../adapter/api/TicketController.js'
import TicketRouter from '../adapter/api/TicketRouter.js'

export default class ParkingFactory {
  static create(ticketUsecase: ITicketUsecasePort): ApiRouter {
    const controller = new TicketController(ticketUsecase)

    return new TicketRouter(controller)
  }
}
