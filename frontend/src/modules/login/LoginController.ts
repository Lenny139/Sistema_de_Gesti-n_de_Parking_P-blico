import BaseController from '../../core/mvc/BaseController.js'
import I18n from '../../core/i18n/I18n.js'
import LoginModel from './LoginModel.js'
import LoginView from './LoginView.js'

export default class LoginController extends BaseController<LoginModel, LoginView> {
  private readonly i18n = I18n.getInstance()

  init(): void {
    this.view.render()
    this.bindForm()
    this.bindLocale()
    this.bindTheme()

    this.model.on('loginSuccess', () => {
      window.dispatchEvent(new CustomEvent('navigate'))
    })

    this.model.on('loginError', (message?: unknown) => {
      this.view.showLoading(false)
      this.view.showError(String(message ?? 'Error al iniciar sesión'))
    })
  }

  private bindForm(): void {
    const submitButton = document.getElementById('login-submit') as HTMLButtonElement | null
    const passwordInput = document.getElementById('password') as HTMLInputElement | null

    if (!submitButton || !passwordInput) {
      return
    }

    const triggerLogin = async (): Promise<void> => {
      this.view.showLoading(true)

      const username = (document.getElementById('username') as HTMLInputElement | null)?.value ?? ''
      const password = (document.getElementById('password') as HTMLInputElement | null)?.value ?? ''

      await this.model.login(username.trim(), password)
    }

    submitButton.addEventListener('click', () => {
      void triggerLogin()
    })

    passwordInput.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') {
        return
      }

      event.preventDefault()
      void triggerLogin()
    })
  }

  private bindLocale(): void {
    const select = document.getElementById('lang-select') as HTMLSelectElement | null
    if (!select) {
      return
    }

    select.addEventListener('change', () => {
      this.i18n.setLocale(select.value === 'en' ? 'en' : 'es')
      this.init()
    })
  }

  private bindTheme(): void {
    const toggle = document.getElementById('theme-toggle') as HTMLInputElement | null
    if (!toggle) {
      return
    }

    toggle.addEventListener('change', () => {
      document.documentElement.setAttribute(
        'data-bs-theme',
        toggle.checked ? 'dark' : 'light',
      )
      this.init()
    })
  }
}
