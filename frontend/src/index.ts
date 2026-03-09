import AuthStore, { ERole } from './core/auth/AuthStore.js'
import LoginModule from './modules/login/LoginModule.js'
import OperatorModule from './modules/operator/OperatorModule.js'
import AdminModule from './modules/admin/AdminModule.js'

const authStore = AuthStore.getInstance()

const app = document.getElementById('app')

const renderCurrentModule = (): void => {
  if (!app) {
    return
  }

  if (!authStore.isAuthenticated()) {
    new LoginModule().mount(app)
    return
  }

  const role = authStore.getRole()
  if (role === ERole.ADMINISTRADOR) {
    new AdminModule().mount(app)
    return
  }

  new OperatorModule().mount(app)
}

window.addEventListener('DOMContentLoaded', () => {
  renderCurrentModule()
})

window.addEventListener('navigate', () => {
  renderCurrentModule()
})

window.addEventListener('logout', () => {
  authStore.clear()
  renderCurrentModule()
})
