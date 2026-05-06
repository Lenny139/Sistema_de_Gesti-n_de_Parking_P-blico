import AuthStore from '../../core/auth/AuthStore.js'
import I18n from '../../core/i18n/I18n.js'
import BaseView from '../../core/mvc/BaseView.js'
import { MovimientoResult, OcupacionResult, TicketResult } from './ParkingFacade.js'

export default class OperatorView extends BaseView {
  private readonly i18n = I18n.getInstance()
  private readonly auth = AuthStore.getInstance()

  render(): void {
    const user = this.auth.getUser()
    const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark'
    const themeIcon = isDark ? this.i18n.t('light_mode') : this.i18n.t('dark_mode')
    const locale = this.i18n.getLocale()

    this.container.innerHTML = `
      <nav class="navbar navbar-parking px-3">
        <div class="d-flex align-items-center gap-2">
          <span class="navbar-brand fw-bold title-oswald">Sistema de parking</span>
          <span class="badge-ocupacion" id="ocupacion-badge">0%</span>
          <span class="badge bg-secondary" style="font-size: 0.7rem; font-weight: 400;" id="poll-indicator"></span>
        </div>
        <div class="ms-auto d-flex align-items-center gap-2">
          <select id="operator-lang" class="form-select form-select-sm" style="width: auto; font-size: 0.8rem;">
            <option value="es" ${locale === 'es' ? 'selected' : ''}>ES</option>
            <option value="en" ${locale === 'en' ? 'selected' : ''}>EN</option>
          </select>
          <button id="theme-toggle" class="btn btn-sm btn-dark btn-nav">
            ${themeIcon}
          </button>
          <button id="logout-btn" class="btn btn-sm btn-outline-dark fw-bold btn-nav">
            ${this.i18n.t('cerrar_sesion')}
          </button>
        </div>
      </nav>

      <div class="container-fluid py-3 px-3 px-md-4">
        <div class="row g-3">
          <div class="col-lg-5">
            <div class="card-ticket surface mb-3 fade-in">
              <div class="card-body">
                <h5 class="card-title">${this.i18n.t('matricula')}</h5>
                <input
                  id="matricula-input"
                  class="form-control input-matricula mb-3"
                  placeholder="ej: ABC-123"
                  maxlength="10"
                  autocomplete="off"
                />
                <div class="d-flex gap-2">
                  <button id="btn-entrada" class="btn btn-warning fw-bold flex-fill">
                    ${this.i18n.t('registrar_entrada')}
                  </button>
                  <button id="btn-salida" class="btn btn-dark fw-bold flex-fill">
                    ${this.i18n.t('registrar_salida')}
                  </button>
                </div>
                <div class="mt-2">
                  <button id="btn-buscar" class="btn btn-outline-secondary btn-sm w-100">
                    ${this.i18n.t('buscar')} / ${this.i18n.t('ticket_perdido')}
                  </button>
                </div>
                <div class="mt-2">
                  <small class="text-muted">Enter confirma · ↑↓ selecciona acción</small>
                </div>
              </div>
            </div>

            <div class="card-ticket surface fade-in fade-in-delay-1">
              <div class="card-body">
                <h5 class="card-title">Resultado</h5>
                <div id="resultado-busqueda">
                  <div class="empty-state">
                    <div class="empty-icon">i</div>
                    <p>Ingresa una matrícula para buscar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-7">
            <div class="card-ticket surface mb-3 fade-in fade-in-delay-1">
              <div class="card-body">
                <h5 class="card-title">${this.i18n.t('ocupacion')} en Tiempo Real</h5>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span id="ocupacion-main" class="fs-3 fw-bold title-oswald">0 / 100</span>
                  <div class="text-end">
                    <div id="ocupacion-pct" class="fs-4 fw-bold text-warning title-oswald">0%</div>
                    <small class="text-muted" id="ocupacion-sub">100 libres</small>
                  </div>
                </div>
                <div class="ocupacion-bar" id="ocupacion-bar-wrapper">
                  <div id="ocupacion-fill" class="fill" style="width: 0%;"></div>
                </div>
                <div class="d-flex justify-content-between mt-1">
                  <small class="text-muted" id="ocupacion-ocupadas">0 ocupadas</small>
                  <small class="text-muted" id="ultima-actualizacion">—</small>
                </div>
              </div>
            </div>

            <div class="card-ticket surface fade-in fade-in-delay-2">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h5 class="card-title mb-0">${this.i18n.t('ultimos_movimientos')}</h5>
                  <button id="btn-refresh" class="btn btn-sm btn-outline-secondary" title="Actualizar">Actualizar</button>
                </div>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Hora</th>
                        <th>${this.i18n.t('matricula')}</th>
                        <th>${this.i18n.t('tipo')}</th>
                        <th>${this.i18n.t('monto')}</th>
                      </tr>
                    </thead>
                    <tbody id="movimientos-body">
                      <tr>
                        <td colspan="4">
                          <div class="empty-state py-2">
                            <div class="empty-icon" style="font-size: 1.5rem;">i</div>
                            <p>Sin movimientos recientes</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  }

  renderOcupacion(data: OcupacionResult): void {
    const badge = this.container.querySelector('#ocupacion-badge') as HTMLElement | null
    const pctEl = this.container.querySelector('#ocupacion-pct') as HTMLElement | null
    const fill = this.container.querySelector('#ocupacion-fill') as HTMLElement | null
    const wrapper = this.container.querySelector('#ocupacion-bar-wrapper') as HTMLElement | null
    const main = this.container.querySelector('#ocupacion-main') as HTMLElement | null
    const sub = this.container.querySelector('#ocupacion-sub') as HTMLElement | null
    const ocupadas = this.container.querySelector('#ocupacion-ocupadas') as HTMLElement | null
    const lastUpdate = this.container.querySelector('#ultima-actualizacion') as HTMLElement | null
    const poll = this.container.querySelector('#poll-indicator') as HTMLElement | null

    const pct = Math.round(data.porcentajeOcupacion)
    if (badge) {
      badge.textContent = `${pct}%`
    }
    if (pctEl) {
      pctEl.textContent = `${pct}%`
    }
    if (fill) {
      fill.style.width = `${pct}%`
    }
    if (wrapper) {
      wrapper.classList.remove('fill-danger', 'fill-warning', 'fill-success')
      if (pct >= 85) {
        wrapper.classList.add('fill-danger')
      } else if (pct >= 60) {
        wrapper.classList.add('fill-warning')
      } else {
        wrapper.classList.add('fill-success')
      }
    }
    if (main) {
      main.textContent = `${data.plazasOcupadas} / ${data.totalPlazas}`
    }
    if (sub) {
      sub.textContent = `${data.plazasLibres} libres`
    }
    if (ocupadas) {
      ocupadas.textContent = `${data.plazasOcupadas} ocupadas`
    }
    if (lastUpdate) {
      lastUpdate.textContent = new Date().toLocaleTimeString()
    }
    if (poll) {
      poll.textContent = '● Live'
      poll.style.color = '#198754'
      poll.style.opacity = '0.5'
      setTimeout(() => {
        poll.style.opacity = '1'
      }, 300)
    }
  }

  renderResultadoBusqueda(data: TicketResult | null): void {
    const host = this.container.querySelector('#resultado-busqueda') as HTMLElement | null
    if (!host) {
      return
    }

    if (!data) {
      host.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">i</div>
          <p>Ingresa una matrícula para buscar</p>
        </div>
      `
      return
    }

    const costoEstimado =
      typeof data.costoEstimado === 'number'
        ? new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
          }).format(data.costoEstimado)
        : '-'

    host.innerHTML = `
      <div class="ticket-result-card">
        <div class="plate mb-2">${data.ticket.matricula}</div>
        <div class="info-row">
          <span class="info-label">${this.i18n.t('hora_entrada')}</span>
          <span class="info-value">${new Date(data.ticket.horaEntrada).toLocaleString()}</span>
        </div>
        <div class="info-row">
          <span class="info-label">${this.i18n.t('tiempo')}</span>
          <span class="info-value">${data.tiempoTranscurrido ?? '-'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Costo estimado</span>
          <span class="info-value costo-estimado">${costoEstimado}</span>
        </div>
        <div class="mt-3 d-flex gap-2">
          <button id="btn-confirmar-salida" class="btn btn-dark btn-sm">${this.i18n.t('confirmar')} ${this.i18n.t('registrar_salida')}</button>
          <button id="btn-confirmar-perdido" class="btn btn-outline-danger btn-sm">${this.i18n.t('ticket_perdido')}</button>
        </div>
      </div>
    `
  }

  renderMovimientos(data: MovimientoResult[]): void {
    const body = this.container.querySelector('#movimientos-body') as HTMLElement | null
    if (!body) {
      return
    }

    if (data.length === 0) {
      body.innerHTML = `
        <tr>
          <td colspan="4">
            <div class="empty-state py-2">
              <div class="empty-icon" style="font-size: 1.5rem;">i</div>
              <p>Sin movimientos recientes</p>
            </div>
          </td>
        </tr>
      `
      return
    }

    body.innerHTML = data
      .map((row) => {
        const tipo = row.tipo?.toLowerCase?.() ?? ''
        const badgeClass = tipo.includes('entrada')
          ? 'badge-entrada'
          : tipo.includes('salida')
            ? 'badge-salida'
            : 'bg-secondary'
        const monto =
          row.monto === null
            ? '-'
            : new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0,
              }).format(row.monto)

        return `
          <tr>
            <td>${new Date(row.hora).toLocaleTimeString()}</td>
            <td>${row.matricula}</td>
            <td><span class="badge ${badgeClass}">${row.tipo}</span></td>
            <td>${monto}</td>
          </tr>
        `
      })
      .join('')
  }

  showConfirmacionSalida(ticket: TicketResult): void {
    this.renderResultadoBusqueda(ticket)
  }

  clearResult(): void {
    this.renderResultadoBusqueda(null)
  }
}
