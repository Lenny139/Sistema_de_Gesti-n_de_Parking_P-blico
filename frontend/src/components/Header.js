import I18n from '../core/i18n/I18n.js';
export default class Header {
    constructor(props) {
        this.i18n = I18n.getInstance();
        this.props = props;
    }
    render(container) {
        const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        const roleLabel = this.props.role === 'ADMINISTRADOR' ? this.i18n.t('admin_panel') : 'Operador';
        container.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-parking px-3">
        <div class="d-flex align-items-center gap-2">
          <span class="navbar-brand fw-bold title-oswald mb-0">🅿️ ${this.i18n.t('titulo')}</span>
          <span class="badge bg-dark">${this.props.title ?? roleLabel}</span>
        </div>
        <div class="ms-auto d-flex align-items-center gap-2">
          <span class="small">${this.props.nombre} · ${this.props.puntoAcceso}</span>
          <select id="header-lang" class="form-select form-select-sm" aria-label="${this.i18n.t('idioma')}">
            <option value="es" ${this.i18n.getLocale() === 'es' ? 'selected' : ''}>🇪🇸 ES</option>
            <option value="en" ${this.i18n.getLocale() === 'en' ? 'selected' : ''}>🇺🇸 EN</option>
          </select>
          <button id="header-theme" class="btn btn-sm btn-dark">${isDark ? this.i18n.t('light_mode') : this.i18n.t('dark_mode')}</button>
          <button id="header-logout" class="btn btn-sm btn-outline-dark">${this.i18n.t('cerrar_sesion')}</button>
        </div>
      </nav>
    `;
        const lang = container.querySelector('#header-lang');
        const theme = container.querySelector('#header-theme');
        const logout = container.querySelector('#header-logout');
        lang?.addEventListener('change', () => {
            const locale = lang.value === 'en' ? 'en' : 'es';
            this.i18n.setLocale(locale);
        });
        theme?.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-bs-theme');
            document.documentElement.setAttribute('data-bs-theme', current === 'dark' ? 'light' : 'dark');
        });
        logout?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('logout'));
        });
    }
}
