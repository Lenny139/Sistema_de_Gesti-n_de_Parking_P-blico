import RegisterDTO from '../../domain/model/RegisterDTO.js'
import User from '../../domain/model/User.js'
import IAuthServicePort from '../../domain/port/driver/service/IAuthServicePort.js'
import IAuthUsecasePort from '../../domain/port/driver/usecase/IAuthUsecasePort.js'

export default class AuthUsecase implements IAuthUsecasePort {
  constructor(private readonly authService: IAuthServicePort) {}

  readonly login = async (
    username: string,
    password: string,
  ): Promise<{ token: string; user: object }> => {
    try {
      return await this.authService.login(username, password)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión'
      throw new Error(`Error de autenticación: ${message}`)
    }
  }

  readonly register = async (data: RegisterDTO): Promise<User> => {
    try {
      return await this.authService.register(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrar usuario'
      throw new Error(`Error de registro: ${message}`)
    }
  }
}
