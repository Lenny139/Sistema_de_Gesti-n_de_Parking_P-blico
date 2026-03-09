import AuthStore from '../../core/auth/AuthStore.js';
import I18n from '../../core/i18n/I18n.js';
import BaseView from '../../core/mvc/BaseView.js';
export default class OperatorView extends BaseView {
    constructor() {
        super(...arguments);
        this.i18n = I18n.getInstance();
        this.auth = AuthStore.getInstance();
    }
    render() {
        const user = this.auth.getUser();
        const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
        this.container.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-parking px-3">
        <span class="navbar-brand fw-bold title-oswald">🅿️ Parking System</span>
        <span class="badge bg-dark ms-2" id="ocupacion-badge">0%</span>
        <div class="ms-auto d-flex align-items-center gap-2">
          <span class="small">${user?.username ?? 'Operador'} · ${user?.username ?? 'Cabina'}</span>
          <select id="operator-lang" class="form-select form-select-sm">
            <option value="es" ${this.i18n.getLocale() === 'es' ? 'selected' : ''}>ES</option>
            <option value="en" ${this.i18n.getLocale() === 'en' ? 'selected' : ''}>EN</option>
          </select>
          <button id="theme-toggle" class="btn btn-sm btn-dark">${isDark ? this.i18n.t('light_mode') : this.i18n.t('dark_mode')}</button>
          <button id="logout-btn" class="btn btn-sm btn-outline-dark">${this.i18n.t('cerrar_sesion')}</button>
        </div>
      </nav>

      <div class="container-fluid py-3">
        <div class="row g-3">
          <div class="col-md-6">
            <div class="card card-ticket surface mb-3">
              <div class="card-body">
                <h5 class="card-title title-oswald">${this.i18n.t('registrar_entrada')} / ${this.i18n.t('registrar_salida')}</h5>
                <input id="matricula-input" class="form-control form-control-lg mb-3" placeholder="ej: ABC123" />
                <div class="d-flex gap-2 flex-wrap">
                  <button id="btn-entrada" class="btn btn-warning fw-bold">${this.i18n.t('registrar_entrada')}</button>
                  <button id="btn-salida" class="btn btn-dark">${this.i18n.t('registrar_salida')}</button>
                  <button id="btn-buscar" class="btn btn-outline-secondary">${this.i18n.t('buscar')} / ${this.i18n.t('ticket_perdido')}</button>
                </div>
              </div>
            </div>

            <div class="card card-ticket surface">
              <div class="card-body">
                <h5 class="card-title title-oswald">Resultado</h5>
                <div id="resultado-busqueda" class="small text-muted">Sin resultados</div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card card-ticket surface mb-3">
              <div class="card-body">
                <h5 class="card-title title-oswald">${this.i18n.t('ocupacion')} en Tiempo Real</h5>
                <div class="ocupacion-bar mb-2"><div id="ocupacion-fill" class="fill" style="width: 0%"></div></div>
                <div id="ocupacion-main" class="fs-4 fw-bold">0 / 100 plazas</div>
                <div id="ocupacion-sub" class="text-muted">0 libres · 0 ocupadas</div>
              </div>
            </div>

            <div class="card card-ticket surface">
              <div class="card-body">
                <h5 class="card-title title-oswald">${this.i18n.t('ultimos_movimientos')}</h5>
                <div class="table-responsive">
                  <table class="table table-sm align-middle">
                    <thead>
                      <tr>
                        <th>Hora</th>
                        <th>${this.i18n.t('matricula')}</th>
                        <th>${this.i18n.t('tipo')}</th>
                        <th>${this.i18n.t('monto')}</th>
                      </tr>
                    </thead>
                    <tbody id="movimientos-body"></tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    renderOcupacion(data) {
        const badge = this.container.querySelector('#ocupacion-badge');
        const fill = this.container.querySelector('#ocupacion-fill');
        const main = this.container.querySelector('#ocupacion-main');
        const sub = this.container.querySelector('#ocupacion-sub');
        const pct = Math.round(data.porcentajeOcupacion);
        if (badge) {
            badge.textContent = `${pct}%`;
        }
        if (fill) {
            fill.style.width = `${pct}%`;
            fill.style.background =
                pct < 50
                    ? 'var(--bs-success)'
                    : pct < 80
                        ? 'var(--bs-warning)'
                        : 'var(--bs-danger)';
        }
        if (main) {
            main.textContent = `${data.plazasOcupadas} / ${data.totalPlazas} plazas`;
        }
        if (sub) {
            sub.textContent = `${data.plazasLibres} libres · ${data.plazasOcupadas} ocupadas`;
        }
    }
    renderResultadoBusqueda(data) {
        const host = this.container.querySelector('#resultado-busqueda');
        if (!host) {
            return;
        }
        if (!data) {
            host.innerHTML = '<span class="text-muted">Sin resultados</span>';
            return;
        }
        host.innerHTML = `
      <div><strong>${this.i18n.t('matricula')}:</strong> ${data.ticket.matricula}</div>
      <div><strong>${this.i18n.t('hora_entrada')}:</strong> ${new Date(data.ticket.horaEntrada).toLocaleString()}</div>
      <div><strong>${this.i18n.t('tiempo')}:</strong> ${data.tiempoTranscurrido ?? '-'}</div>
      <div><strong>Costo estimado:</strong> ${typeof data.costoEstimado === 'number' ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(data.costoEstimado) : '-'}</div>
      <div class="mt-3 d-flex gap-2">
        <button id="btn-confirmar-salida" class="btn btn-dark btn-sm">${this.i18n.t('confirmar')} ${this.i18n.t('registrar_salida')}</button>
        <button id="btn-confirmar-perdido" class="btn btn-outline-danger btn-sm">${this.i18n.t('ticket_perdido')}</button>
      </div>
    `;
    }
    renderMovimientos(data) {
        const body = this.container.querySelector('#movimientos-body');
        if (!body) {
            return;
        }
        body.innerHTML = data
            .map((row) => {
            const monto = row.monto === null
                ? '-'
                : new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    maximumFractionDigits: 0,
                }).format(row.monto);
            return `
          <tr>
            <td>${new Date(row.hora).toLocaleTimeString()}</td>
            <td>${row.matricula}</td>
            <td><span class="badge bg-secondary">${row.tipo}</span></td>
            <td>${monto}</td>
          </tr>
        `;
        })
            .join('');
    }
    showConfirmacionSalida(ticket) {
        this.renderResultadoBusqueda(ticket);
    }
    clearResult() {
        this.renderResultadoBusqueda(null);
    }
}
