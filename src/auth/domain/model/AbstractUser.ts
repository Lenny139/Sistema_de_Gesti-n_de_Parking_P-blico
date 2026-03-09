import { randomUUID } from 'crypto'
import ERole from './ERole.js'

export default abstract class AbstractUser {
  private readonly id: string
  private readonly username: string
  private readonly passwordHash: string
  private readonly role: ERole
  private readonly nombre: string
  private readonly puntoAcceso: string
  private readonly activo: boolean
  private readonly creadoEn: Date

  constructor(user: UserInterface) {
    this.id = user.id ?? randomUUID()
    this.username = user.username
    this.passwordHash = user.passwordHash
    this.role = user.role
    this.nombre = user.nombre
    this.puntoAcceso = user.puntoAcceso
    this.activo = user.activo
    this.creadoEn = user.creadoEn
  }

  readonly getId = (): string => this.id

  readonly getUsername = (): string => this.username

  readonly getPasswordHash = (): string => this.passwordHash

  readonly getRole = (): ERole => this.role

  readonly getNombre = (): string => this.nombre

  readonly getPuntoAcceso = (): string => this.puntoAcceso

  readonly getActivo = (): boolean => this.activo

  readonly getCreadoEn = (): Date => this.creadoEn

  readonly toJSON = (): object => {
    return {
      id: this.id,
      username: this.username,
      role: this.role,
      nombre: this.nombre,
      puntoAcceso: this.puntoAcceso,
      activo: this.activo,
      creadoEn: this.creadoEn,
    }
  }
}

export interface UserInterface {
  id?: string
  username: string
  passwordHash: string
  role: ERole
  nombre: string
  puntoAcceso: string
  activo: boolean
  creadoEn: Date
}
