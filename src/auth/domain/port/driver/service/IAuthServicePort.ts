import IAuthPayload from '../../../model/IAuthPayload.js'
import RegisterDTO from '../../../model/RegisterDTO.js'
import User from '../../../model/User.js'

export default interface IAuthServicePort {
  login(username: string, password: string): Promise<{ token: string; user: object }>
  register(data: RegisterDTO): Promise<User>
  validateToken(token: string): Promise<IAuthPayload>
}
