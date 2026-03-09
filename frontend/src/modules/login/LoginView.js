import I18n from '../../core/i18n/I18n.js';
import BaseView from '../../core/mvc/BaseView.js';
export default class LoginView extends BaseView {
    constructor() {
        super(...arguments);
        this.i18n = I18n.getInstance();
    }
    render() {
        const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        this.container.innerHTML = `
      <div class="container d-flex align-items-center justify-content-center min-vh-100">
        <div class="row w-100 justify-content-center">
          <div class="col-12 col-md-6 col-lg-4">
            <div class="text-center mb-3">
              <div class="display-4 fw-bold text-warning title-oswald">P</div>
              <h1 class="h3 title-oswald">Sistema de Parking</h1>
            </div>
            <div class="card shadow-sm surface">
              <div class="card-body">
                <h2 class="h5 mb-3 title-oswald">${this.i18n.t('login')}</h2>
                <div id="login-error"></div>
                <form id="login-form" novalidate>
                  <div class="mb-3">
                    <label class="form-label" for="username">${this.i18n.t('username')}</label>
                    <input id="username" name="username" class="form-control" type="text" required />
                  </div>
                  <div class="mb-3">
                    <label class="form-label" for="password">${this.i18n.t('password')}</label>
                    <input id="password" name="password" class="form-control" type="password" required />
                  </div>
                  <button id="login-submit" type="submit" class="btn btn-warning w-100 fw-bold">${this.i18n.t('entrar')}</button>
                </form>
                <hr />
                <div class="d-flex gap-2 align-items-center justify-content-between">
                  <div>
                    <label for="lang-select" class="form-label mb-1">${this.i18n.t('idioma')}</label>
                    <select id="lang-select" class="form-select form-select-sm">
                      <option value="es" ${this.i18n.getLocale() === 'es' ? 'selected' : ''}>ES</option>
                      <option value="en" ${this.i18n.getLocale() === 'en' ? 'selected' : ''}>EN</option>
                    </select>
                  </div>
                  <div class="form-check form-switch mt-4">
                    <input class="form-check-input" type="checkbox" id="theme-toggle" ${isDark ? 'checked' : ''} />
                    <label class="form-check-label" for="theme-toggle">${isDark ? this.i18n.t('light_mode') : this.i18n.t('dark_mode')}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    showError(msg) {
        const host = this.container.querySelector('#login-error');
        if (!host) {
            return;
        }
        host.innerHTML = `<div class="alert alert-danger py-2">${msg}</div>`;
    }
    showLoading(value) {
        const button = this.container.querySelector('#login-submit');
        if (!button) {
            return;
        }
        button.disabled = value;
        button.textContent = value ? '...' : this.i18n.t('entrar');
    }
}
