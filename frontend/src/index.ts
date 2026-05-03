import AuthStore, { ERole } from './core/auth/AuthStore.js'
import LoginModule from './modules/login/LoginModule.js'
import OperatorModule from './modules/operator/OperatorModule.js'
import AdminModule from './modules/admin/AdminModule.js'

const savedTheme = localStorage.getItem('frontend.theme') ?? 'light'
document.documentElement.setAttribute('data-bs-theme', savedTheme)

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

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement | null
  const btn = target?.closest('#theme-toggle, #header-theme')
  if (!btn) {
    return
  }

  const current = document.documentElement.getAttribute('data-bs-theme')
  const next = current === 'dark' ? 'light' : 'dark'
  localStorage.setItem('frontend.theme', next)
})
