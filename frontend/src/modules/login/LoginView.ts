import I18n from '../../core/i18n/I18n.js'
import BaseView from '../../core/mvc/BaseView.js'

export default class LoginView extends BaseView {
  private readonly i18n = I18n.getInstance()

  render(): void {
    this.container.innerHTML = `
      <div class="login-bg d-flex align-items-center justify-content-center min-vh-100">
        <div class="w-100" style="max-width: 420px; padding: 1.5rem;">
          <div class="text-center mb-4 fade-in">
            <div class="login-logo mb-3">P</div>
            <h1 class="title-oswald fw-bold text-white mb-1" style="font-size: 1.6rem; letter-spacing: 0.04em;">
              SISTEMA DE PARKING
            </h1>
            <p class="text-warning mb-0" style="font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase;">
              Gestión Pública · UPB 2026
            </p>
          </div>

          <div class="login-card p-4 fade-in fade-in-delay-1">
            <h2 class="title-oswald text-white mb-3" style="font-size: 1.1rem; letter-spacing: 0.06em;">
              ${this.i18n.t('login')}
            </h2>

            <div id="login-error"></div>

            <div id="login-form">
              <div class="mb-3">
                <label class="form-label text-white-50 small fw-bold" style="font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;">
                  ${this.i18n.t('username')}
                </label>
                <input
                  id="username"
                  name="username"
                  class="form-control"
                  type="text"
                  autocomplete="username"
                  required
                  style="background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.12); color: #fff;"
                />
              </div>
              <div class="mb-4">
                <label class="form-label text-white-50 small fw-bold" style="font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;">
                  ${this.i18n.t('password')}
                </label>
                <input
                  id="password"
                  name="password"
                  class="form-control"
                  type="password"
                  autocomplete="current-password"
                  required
                  style="background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.12); color: #fff;"
                />
              </div>
              <button
                id="login-submit"
                class="btn btn-warning w-100 fw-bold py-2 title-oswald"
                style="font-size: 1rem; letter-spacing: 0.06em;"
              >
                ${this.i18n.t('entrar')}
              </button>
            </div>

            <hr style="border-color: rgba(255, 255, 255, 0.08); margin: 1.5rem 0;" />

            <div class="d-flex align-items-center justify-content-between gap-2">
              <div class="d-flex align-items-center gap-2">
                <span style="font-size: 0.72rem; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 0.06em;">
                  ${this.i18n.t('idioma')}
                </span>
                <select
                  id="lang-select"
                  class="form-select form-select-sm"
                  style="width: auto; background: rgba(255, 255, 255, 0.07); border-color: rgba(255, 255, 255, 0.15); color: #fff; font-size: 0.8rem;"
                >
                  <option value="es" style="color: #000;" ${this.i18n.getLocale() === 'es' ? 'selected' : ''}>
                    Español
                  </option>
                  <option value="en" style="color: #000;" ${this.i18n.getLocale() === 'en' ? 'selected' : ''}>
                    English
                  </option>
                </select>
              </div>
              <div class="form-check form-switch mb-0">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="theme-toggle"
                  ${document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'checked' : ''}
                />
                <label class="form-check-label small" for="theme-toggle" style="color: rgba(255, 255, 255, 0.5);">
                  ${
                    document.documentElement.getAttribute('data-bs-theme') === 'dark'
                      ? this.i18n.t('dark_mode')
                      : this.i18n.t('light_mode')
                  }
                </label>
              </div>
            </div>
          </div>

          <div class="text-center mt-3 fade-in fade-in-delay-2">
            <p style="font-size: 0.7rem; color: rgba(255, 255, 255, 0.2); letter-spacing: 0.04em;">
              Desarrollo de Aplicaciones Web · UPB 2026-10
            </p>
          </div>
        </div>
      </div>
    `
  }

  showError(msg: string): void {
    const host = this.container.querySelector('#login-error') as HTMLElement | null
    if (!host) {
      return
    }

    host.innerHTML = `<div class="alert alert-danger py-2">${msg}</div>`
  }

  showLoading(value: boolean): void {
    const button = this.container.querySelector('#login-submit') as HTMLButtonElement | null
    if (!button) {
      return
    }

    button.disabled = value
    button.textContent = value ? '...' : this.i18n.t('entrar')
  }
}
