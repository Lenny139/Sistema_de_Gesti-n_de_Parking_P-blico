import AbstractUser from './AbstractUser.js'
import ERole from './ERole.js'

export default class NullUser extends AbstractUser {
  constructor() {
    super({
      id: '',
      username: '',
      passwordHash: '',
      role: ERole.OPERADOR,
      nombre: '',
      puntoAcceso: '',
      activo: false,
      creadoEn: new Date(0),
    })
  }

  readonly isNull = (): true => true
}
