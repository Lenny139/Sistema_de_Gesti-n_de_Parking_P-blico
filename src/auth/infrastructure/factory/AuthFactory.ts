import ApiRouter from '../../../api/domain/model/ApiRouter.js'
import IUserRepositoryPort from '../../domain/port/driven/repository/IUserRepositoryPort.js'
import AuthService from '../../application/service/AuthService.js'
import AuthUsecase from '../../application/usecase/AuthUsecase.js'
import AuthController from '../adapter/api/AuthController.js'
import AuthRouter from '../adapter/api/AuthRouter.js'

export default class AuthFactory {
  static create(userRepo: IUserRepositoryPort): ApiRouter {
    const service = new AuthService(userRepo)
    const usecase = new AuthUsecase(service)
    const controller = new AuthController(usecase)

    return new AuthRouter(controller)
  }
}
