import { type Request, type Response } from 'express'
import ApiController from '../../../../api/domain/model/ApiController.js'
import RegisterDTO from '../../../domain/model/RegisterDTO.js'
import IAuthUsecasePort from '../../../domain/port/driver/usecase/IAuthUsecasePort.js'

export default class AuthController extends ApiController {
  constructor(private readonly usecase: IAuthUsecasePort) {
    super()
  }

  readonly login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body as {
        username?: string
        password?: string
      }

      if (!username?.trim() || !password?.trim()) {
        res.status(this.STATUS.BAD_REQUEST).json({
          message: 'username y password son obligatorios',
        })
        return
      }

      const result = await this.usecase.login(username, password)
      res.status(this.STATUS.OK).json(result)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error interno al iniciar sesión'

      res.status(this.STATUS.UNAUTHORIZED).json({ message })
    }
  }

  readonly register = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body as Partial<RegisterDTO>

      if (!body.username?.trim() || !body.password?.trim()) {
        res.status(this.STATUS.BAD_REQUEST).json({
          message: 'username y password son obligatorios',
        })
        return
      }

      if (!body.nombre?.trim() || !body.puntoAcceso?.trim() || !body.role) {
        res.status(this.STATUS.BAD_REQUEST).json({
          message: 'nombre, role y puntoAcceso son obligatorios',
        })
        return
      }

      const user = await this.usecase.register({
        username: body.username,
        password: body.password,
        nombre: body.nombre,
        role: body.role,
        puntoAcceso: body.puntoAcceso,
      })

      res.status(this.STATUS.CREATED).json(user.toJSON())
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error interno al registrar usuario'

      res.status(this.STATUS.BAD_REQUEST).json({ message })
    }
  }

  readonly getProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(this.STATUS.UNAUTHORIZED).json({ message: 'Token no proporcionado' })
      return
    }

    res.status(this.STATUS.OK).json(req.user)
  }
}
