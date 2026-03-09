import ERole from './ERole.js'

export default interface RegisterDTO {
  username: string
  password: string
  nombre: string
  role: ERole
  puntoAcceso: string
}
