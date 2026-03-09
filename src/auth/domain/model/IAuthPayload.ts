import ERole from './ERole.js'

export default interface IAuthPayload {
  userId: string
  username: string
  role: ERole
}
