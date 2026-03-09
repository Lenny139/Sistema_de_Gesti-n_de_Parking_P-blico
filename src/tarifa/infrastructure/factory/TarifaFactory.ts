import ApiRouter from '../../../api/domain/model/ApiRouter.js'
import ITarifaUsecasePort from '../../domain/port/driver/usecase/ITarifaUsecasePort.js'
import TarifaController from '../adapter/api/TarifaController.js'
import TarifaRouter from '../adapter/api/TarifaRouter.js'

export default class TarifaFactory {
  static create(tarifaUsecase: ITarifaUsecasePort): ApiRouter {
    const controller = new TarifaController(tarifaUsecase)

    return new TarifaRouter(controller)
  }
}
