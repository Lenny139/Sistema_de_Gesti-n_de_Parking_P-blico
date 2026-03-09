import ERole from '../../../model/ERole.js'
import User from '../../../model/User.js'
import Repository from '../../../../../shared/domain/Repository.js'

export default interface IUserRepositoryPort extends Repository<string, User> {
  findByUsername(username: string): Promise<User | null>
  findByRole(role: ERole): Promise<User[]>
}
