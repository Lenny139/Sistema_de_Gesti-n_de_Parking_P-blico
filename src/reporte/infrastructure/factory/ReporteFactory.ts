import ApiRouter from '../../../api/domain/model/ApiRouter.js'
import IReporteServicePort from '../../domain/port/driver/IReporteServicePort.js'
import ReporteController from '../adapter/api/ReporteController.js'
import ReporteRouter from '../adapter/api/ReporteRouter.js'

export default class ReporteFactory {
  static create(reporteService: IReporteServicePort): ApiRouter {
    const controller = new ReporteController(reporteService)

    return new ReporteRouter(controller)
  }
}
