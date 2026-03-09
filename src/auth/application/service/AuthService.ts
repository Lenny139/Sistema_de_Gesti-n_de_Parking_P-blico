import bcrypt from 'bcryptjs'
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'
import EnvironmentProvider from '../../../api/infrastructure/provider/EnvironmentProvider.js'
import ERole from '../../domain/model/ERole.js'
import IAuthPayload from '../../domain/model/IAuthPayload.js'
import RegisterDTO from '../../domain/model/RegisterDTO.js'
import User from '../../domain/model/User.js'
import IUserRepositoryPort from '../../domain/port/driven/repository/IUserRepositoryPort.js'
import IAuthServicePort from '../../domain/port/driver/service/IAuthServicePort.js'

export default class AuthService implements IAuthServicePort {
  private readonly env = EnvironmentProvider.getInstance()

  constructor(private readonly userRepository: IUserRepositoryPort) {}

  readonly login = async (
    username: string,
    password: string,
  ): Promise<{ token: string; user: object }> => {
    if (!username?.trim() || !password?.trim()) {
      throw new Error('El usuario y la contraseña son obligatorios')
    }

    const user = await this.userRepository.findByUsername(username.trim())
    if (!user) {
      throw new Error('Usuario o contraseña incorrectos')
    }

    if (!user.getActivo()) {
      throw new Error('El usuario se encuentra inactivo')
    }

    const passwordOk = await bcrypt.compare(password, user.getPasswordHash())
    if (!passwordOk) {
      throw new Error('Usuario o contraseña incorrectos')
    }

    const payload: IAuthPayload = {
      userId: user.getId(),
      username: user.getUsername(),
      role: user.getRole(),
    }

    const expiresIn = this.env.getJwtExpiresIn() as NonNullable<
      SignOptions['expiresIn']
    >

    const token = jwt.sign(payload, this.env.getJwtSecret(), {
      expiresIn,
    })

    return {
      token,
      user: user.toJSON(),
    }
  }

  readonly register = async (data: RegisterDTO): Promise<User> => {
    if (!data.username?.trim()) {
      throw new Error('El nombre de usuario es obligatorio')
    }

    if (!data.password?.trim()) {
      throw new Error('La contraseña es obligatoria')
    }

    if (!data.nombre?.trim()) {
      throw new Error('El nombre es obligatorio')
    }

    if (!data.puntoAcceso?.trim()) {
      throw new Error('El punto de acceso es obligatorio')
    }

    const existing = await this.userRepository.findByUsername(data.username.trim())
    if (existing) {
      throw new Error('Ya existe un usuario con ese nombre de usuario')
    }

    const passwordHash = await bcrypt.hash(data.password, 10)

    const user = new User({
      username: data.username.trim(),
      passwordHash,
      role: data.role,
      nombre: data.nombre.trim(),
      puntoAcceso: data.puntoAcceso.trim(),
      activo: true,
      creadoEn: new Date(),
    })

    return this.userRepository.save(user)
  }

  readonly validateToken = async (token: string): Promise<IAuthPayload> => {
    if (!token?.trim()) {
      throw new Error('El token es obligatorio')
    }

    try {
      const decoded = jwt.verify(token, this.env.getJwtSecret())
      if (typeof decoded === 'string') {
        throw new Error('Token inválido')
      }

      const payload = decoded as JwtPayload
      const userId = payload['userId']
      const username = payload['username']
      const role = payload['role']

      if (
        typeof userId !== 'string' ||
        typeof username !== 'string' ||
        (role !== 'OPERADOR' && role !== 'ADMINISTRADOR')
      ) {
        throw new Error('Payload de token inválido')
      }

      return {
        userId,
        username,
        role: role as ERole,
      }
    } catch {
      throw new Error('Token inválido o expirado')
    }
  }
}
