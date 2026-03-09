import BaseController from '../../core/mvc/BaseController.js';
import I18n from '../../core/i18n/I18n.js';
export default class LoginController extends BaseController {
    constructor() {
        super(...arguments);
        this.i18n = I18n.getInstance();
    }
    init() {
        this.view.render();
        this.bindForm();
        this.bindLocale();
        this.bindTheme();
        this.model.on('loginSuccess', () => {
            window.dispatchEvent(new CustomEvent('navigate'));
        });
        this.model.on('loginError', (message) => {
            this.view.showLoading(false);
            this.view.showError(String(message ?? 'Error al iniciar sesión'));
        });
    }
    bindForm() {
        const form = document.getElementById('login-form');
        if (!form) {
            return;
        }
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            this.view.showLoading(true);
            const username = document.getElementById('username')?.value ?? '';
            const password = document.getElementById('password')?.value ?? '';
            await this.model.login(username.trim(), password);
        });
    }
    bindLocale() {
        const select = document.getElementById('lang-select');
        if (!select) {
            return;
        }
        select.addEventListener('change', () => {
            this.i18n.setLocale(select.value === 'en' ? 'en' : 'es');
            this.init();
        });
    }
    bindTheme() {
        const toggle = document.getElementById('theme-toggle');
        if (!toggle) {
            return;
        }
        toggle.addEventListener('change', () => {
            document.documentElement.setAttribute('data-bs-theme', toggle.checked ? 'dark' : 'light');
            this.init();
        });
    }
}
