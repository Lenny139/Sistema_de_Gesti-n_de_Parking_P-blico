import AbstractUser, { UserInterface } from './AbstractUser.js'

export default class User extends AbstractUser {
  constructor(user: UserInterface) {
    super(user)
  }
}
