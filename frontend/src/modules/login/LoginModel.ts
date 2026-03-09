import ApiClient from '../../core/api/ApiClient.js'
import ApiEndpoints from '../../core/api/ApiEndpoints.js'
import AuthStore from '../../core/auth/AuthStore.js'
import BaseModel from '../../core/mvc/BaseModel.js'

type LoginResponse = {
  token: string
  user: object
}

export default class LoginModel extends BaseModel {
  private readonly apiClient = new ApiClient()
  private readonly authStore = AuthStore.getInstance()

  async login(username: string, password: string): Promise<void> {
    try {
      const response = await this.apiClient.post<LoginResponse>(ApiEndpoints.auth.login, {
        username,
        password,
      })

      this.authStore.setToken(response.token, response.user)
      this.emit('loginSuccess', response.user)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al iniciar sesión'
      this.emit('loginError', message)
    }
  }
}
