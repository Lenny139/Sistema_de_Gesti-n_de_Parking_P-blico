import Header from '../../components/Header.js'
import AuthStore from '../../core/auth/AuthStore.js'
import I18n from '../../core/i18n/I18n.js'
import BaseView from '../../core/mvc/BaseView.js'
import { EstadisticasGenerales, HistorialItem, ReporteIngreso, TarifaData } from './AdminModel.js'

export default class AdminView extends BaseView {
  private readonly i18n = I18n.getInstance()
  private readonly auth = AuthStore.getInstance()
  private historial: HistorialItem[] = []

  render(): void {
    this.container.innerHTML = `
      <div id="admin-header"></div>
      <div class="container-fluid py-3 px-3 px-md-4">
        <ul class="nav nav-tabs mb-4" id="admin-tabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" data-admin-tab="dashboard" role="tab">
              Dashboard
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" data-admin-tab="reportes" role="tab">
              ${this.i18n.t('reporte_ingresos')}
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" data-admin-tab="tarifas" role="tab">
              ${this.i18n.t('gestion_tarifas')}
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" data-admin-tab="historial" role="tab">
              Historial
            </button>
          </li>
        </ul>

        <section class="admin-tab fade-in" data-tab-panel="dashboard">
          <div class="row g-3 mb-4">
            <div class="col-6 col-lg-3">
              <div class="stat-card surface position-relative">
                <div class="stat-label">Tickets hoy</div>
                <div class="stat-value" id="stat-tickets">—</div>
                <div class="stat-icon">T</div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="stat-card surface position-relative" style="border-left-color: #198754;">
                <div class="stat-label">Ingresos hoy</div>
                <div class="stat-value" id="stat-ingresos">—</div>
                <div class="stat-icon">$</div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="stat-card surface position-relative" style="border-left-color: #0d6efd;">
                <div class="stat-label">${this.i18n.t('ocupacion')} actual</div>
                <div class="stat-value" id="stat-ocupacion">—</div>
                <div class="stat-icon">O</div>
              </div>
            </div>
            <div class="col-6 col-lg-3">
              <div class="stat-card surface position-relative" style="border-left-color: #6f42c1;">
                <div class="stat-label">Promedio estadía</div>
                <div class="stat-value" id="stat-estadia">—</div>
                <div class="stat-icon">E</div>
              </div>
            </div>
          </div>

          <div class="card-ticket surface">
            <div class="card-body">
              <h5 class="card-title">Ingresos del día — por hora</h5>
              <div id="dashboard-bars"></div>
            </div>
          </div>
        </section>

        <section class="admin-tab d-none" data-tab-panel="reportes">
          <div class="card-ticket surface mb-3">
            <div class="card-body d-flex align-items-center gap-3 flex-wrap">
              <label class="fw-bold title-oswald mb-0" style="font-size: 0.9rem;">Período:</label>
              <select id="reporte-periodo" class="form-select" style="max-width: 220px;">
                <option value="HOY">${this.i18n.t('hoy')}</option>
                <option value="SEMANA">${this.i18n.t('esta_semana')}</option>
                <option value="MES">${this.i18n.t('este_mes')}</option>
              </select>
              <div class="ms-auto">
                <div class="alert alert-warning mb-0 py-2 px-3 fw-bold d-inline-block" id="reporte-total" style="font-size: 0.95rem;">
                  ${this.i18n.t('total_ingresos')}: $0
                </div>
              </div>
            </div>
          </div>
          <div class="card-ticket surface">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Ingresos</th>
                      <th>Movimientos</th>
                      <th>Promedio/ticket</th>
                    </tr>
                  </thead>
                  <tbody id="reporte-body">
                    <tr>
                      <td colspan="4">
                        <div class="empty-state">
                          <div class="empty-icon">i</div>
                          <p>Selecciona un período</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section class="admin-tab d-none" data-tab-panel="tarifas">
          <div class="card-ticket surface mb-3">
            <div class="card-body">
              <h5 class="card-title">Tarifa Activa</h5>
              <div id="tarifa-activa-detalle">
                <div class="empty-state">
                  <div class="empty-icon">i</div>
                  <p>Cargando...</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card-ticket surface">
            <div class="card-body">
              <h5 class="card-title">Editar tarifas</h5>
              <div id="tarifa-form" class="row g-3">
                <input id="tarifa-id" type="hidden" />
                <div class="col-md-6 col-lg-3">
                  <label class="form-label fw-bold">Precio / Hora</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input id="tarifa-precioHora" type="number" min="0" step="100" class="form-control" placeholder="5000" />
                  </div>
                </div>
                <div class="col-md-6 col-lg-3">
                  <label class="form-label fw-bold">Día completo</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input id="tarifa-diaCompleto" type="number" min="0" step="1000" class="form-control" placeholder="40000" />
                  </div>
                </div>
                <div class="col-md-6 col-lg-3">
                  <label class="form-label fw-bold">Tarifa nocturna</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input id="tarifa-nocturna" type="number" min="0" step="100" class="form-control" placeholder="3000" />
                  </div>
                </div>
                <div class="col-md-6 col-lg-3">
                  <label class="form-label fw-bold">Ticket perdido</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input id="tarifa-perdido" type="number" min="0" step="1000" class="form-control" placeholder="50000" />
                  </div>
                </div>
                <div class="col-12">
                  <button id="tarifa-submit" class="btn btn-warning fw-bold px-4">
                    Guardar cambios de tarifa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="admin-tab d-none" data-tab-panel="historial">
          <div class="card-ticket surface mb-3">
            <div class="card-body">
              <div class="row g-2 align-items-end">
                <div class="col-md-3">
                  <label class="form-label fw-bold">Fecha inicio</label>
                  <input id="hist-fechaInicio" type="date" class="form-control" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-bold">Fecha fin</label>
                  <input id="hist-fechaFin" type="date" class="form-control" />
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-bold">Tipo</label>
                  <select id="hist-tipo" class="form-select">
                    <option value="">Todos</option>
                    <option value="ENTRADA">Entrada</option>
                    <option value="SALIDA">Salida</option>
                    <option value="TICKET_PERDIDO">Ticket perdido</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <button id="hist-aplicar" class="btn btn-dark w-100 fw-bold">
                    Aplicar filtros
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="card-ticket surface">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-sm mb-0">
                  <thead>
                    <tr>
                      <th>Fecha/Hora</th>
                      <th>${this.i18n.t('matricula')}</th>
                      <th>Tipo</th>
                      <th>Operador</th>
                      <th>${this.i18n.t('monto')}</th>
                    </tr>
                  </thead>
                  <tbody id="historial-body">
                    <tr>
                      <td colspan="5">
                        <div class="empty-state">
                          <div class="empty-icon">i</div>
                          <p>Aplica filtros para ver el historial</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="d-flex justify-content-between align-items-center px-3 py-2" style="border-top: 1px solid var(--color-border);">
                <div id="historial-total" class="fw-bold text-warning title-oswald">Total: $0</div>
                <div class="d-flex align-items-center gap-2">
                  <button id="hist-prev" class="btn btn-outline-secondary btn-sm">← Anterior</button>
                  <span id="hist-page" class="small text-muted px-2">1 / 1</span>
                  <button id="hist-next" class="btn btn-outline-secondary btn-sm">Siguiente →</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `

    this.renderHeader()
  }

  renderDashboard(data: { estadisticas: EstadisticasGenerales; ingresosPorHora: Array<{ hora: string; ingresos: number }> }): void {
    const tickets = this.container.querySelector('#stat-tickets') as HTMLElement | null
    const ingresos = this.container.querySelector('#stat-ingresos') as HTMLElement | null
    const ocupacion = this.container.querySelector('#stat-ocupacion') as HTMLElement | null
    const estadia = this.container.querySelector('#stat-estadia') as HTMLElement | null
    const bars = this.container.querySelector('#dashboard-bars') as HTMLElement | null

    if (tickets) {
      tickets.textContent = `${data.estadisticas.ticketsHoy}`
    }
    if (ingresos) {
      ingresos.textContent = this.formatCop(data.estadisticas.ingresosHoy)
    }
    if (ocupacion) {
      ocupacion.textContent = `${Math.round(data.estadisticas.ocupacionActual)}%`
    }
    if (estadia) {
      estadia.textContent = `${Math.round(data.estadisticas.promedioEstadia)} min`
    }

    if (bars) {
      const max = Math.max(1, ...data.ingresosPorHora.map((item) => item.ingresos))
      bars.innerHTML = data.ingresosPorHora
        .map((item) => {
          const width = Math.max(2, Math.round((item.ingresos / max) * 100))
          return `
            <div class="d-flex align-items-center gap-2">
              <span style="width:48px" class="small">${item.hora}</span>
              <div class="flex-grow-1 rounded" style="height:12px;background:var(--bs-secondary-bg)">
                <div class="rounded" style="height:12px;width:${width}%;background:var(--bs-warning)"></div>
              </div>
              <span style="width:110px" class="small text-end">${this.formatCop(item.ingresos)}</span>
            </div>
          `
        })
        .join('')
    }
  }

  renderReporte(data: ReporteIngreso): void {
    const body = this.container.querySelector('#reporte-body') as HTMLElement | null
    const total = this.container.querySelector('#reporte-total') as HTMLElement | null

    if (body) {
      body.innerHTML = data.ingresosPorDia
        .map((row) => {
          const promedio = row.movimientos > 0 ? row.ingresos / row.movimientos : 0
          return `
            <tr>
              <td>${row.fecha}</td>
              <td>${this.formatCop(row.ingresos)}</td>
              <td>${row.movimientos}</td>
              <td>${this.formatCop(promedio)}</td>
            </tr>
          `
        })
        .join('')
    }

    if (total) {
      total.textContent = `${this.i18n.t('total_ingresos')}: ${this.formatCop(data.totalIngresos)}`
    }
  }

  renderTarifas(data: TarifaData[]): void {
    const activa = data.find((item) => item.activa) ?? null

    const detalle = this.container.querySelector('#tarifa-activa-detalle') as HTMLElement | null
    const tarifaId = this.container.querySelector('#tarifa-id') as HTMLInputElement | null
    const precioHora = this.container.querySelector('#tarifa-precioHora') as HTMLInputElement | null
    const diaCompleto = this.container.querySelector('#tarifa-diaCompleto') as HTMLInputElement | null
    const nocturna = this.container.querySelector('#tarifa-nocturna') as HTMLInputElement | null
    const perdido = this.container.querySelector('#tarifa-perdido') as HTMLInputElement | null

    if (!activa) {
      if (detalle) {
        detalle.textContent = 'No hay tarifa activa'
      }
      if (tarifaId) {
        tarifaId.value = ''
      }
      return
    }

    if (detalle) {
      detalle.innerHTML = `
        <div class="row g-2 text-center">
          <div class="col-3">
            <div class="stat-card surface p-2">
              <div class="stat-label">Por hora</div>
              <div class="title-oswald fw-bold text-warning">${this.formatCop(activa.precioPorHora)}</div>
            </div>
          </div>
          <div class="col-3">
            <div class="stat-card surface p-2">
              <div class="stat-label">Día completo</div>
              <div class="title-oswald fw-bold text-warning">${this.formatCop(activa.precioDiaCompleto)}</div>
            </div>
          </div>
          <div class="col-3">
            <div class="stat-card surface p-2">
              <div class="stat-label">Nocturna</div>
              <div class="title-oswald fw-bold text-warning">${this.formatCop(activa.tarifaNocturna)}</div>
            </div>
          </div>
          <div class="col-3">
            <div class="stat-card surface p-2">
              <div class="stat-label">Ticket perdido</div>
              <div class="title-oswald fw-bold text-warning">${this.formatCop(activa.tarifaTicketPerdido)}</div>
            </div>
          </div>
        </div>
        <div class="mt-2 small text-muted">Actualizada: ${new Date(activa.actualizadaEn).toLocaleString()}</div>
      `
    }

    if (tarifaId) {
      tarifaId.value = activa.id
    }
    if (precioHora) {
      precioHora.value = `${activa.precioPorHora}`
    }
    if (diaCompleto) {
      diaCompleto.value = `${activa.precioDiaCompleto}`
    }
    if (nocturna) {
      nocturna.value = `${activa.tarifaNocturna}`
    }
    if (perdido) {
      perdido.value = `${activa.tarifaTicketPerdido}`
    }
  }

  renderHistorial(data: HistorialItem[], pagina: number): void {
    this.historial = data

    const pageSize = 10
    const totalPages = Math.max(1, Math.ceil(data.length / pageSize))
    const current = Math.min(Math.max(1, pagina), totalPages)

    const start = (current - 1) * pageSize
    const rows = data.slice(start, start + pageSize)

    const body = this.container.querySelector('#historial-body') as HTMLElement | null
    const total = this.container.querySelector('#historial-total') as HTMLElement | null
    const page = this.container.querySelector('#hist-page') as HTMLElement | null

    if (body) {
      body.innerHTML = rows
        .map((row) => `
          <tr>
            <td>${new Date(row.hora).toLocaleString()}</td>
            <td>${row.matricula}</td>
            <td>${row.tipo}</td>
            <td>${row.puntoAcceso || row.operadorId}</td>
            <td>${row.monto === null ? '-' : this.formatCop(row.monto)}</td>
          </tr>
        `)
        .join('')
    }

    if (total) {
      const acumulado = data.reduce((sum, item) => sum + (item.monto ?? 0), 0)
      total.textContent = `Total: ${this.formatCop(acumulado)}`
    }

    if (page) {
      page.textContent = `${current}/${totalPages}`
    }
  }

  setTab(tab: 'dashboard' | 'reportes' | 'tarifas' | 'historial'): void {
    const tabs = this.container.querySelectorAll('[data-admin-tab]')
    tabs.forEach((element) => {
      element.classList.toggle('active', element.getAttribute('data-admin-tab') === tab)
    })

    const panels = this.container.querySelectorAll('.admin-tab')
    panels.forEach((panel) => {
      panel.classList.toggle('d-none', panel.getAttribute('data-tab-panel') !== tab)
    })
  }

  getHistorialLength(): number {
    return this.historial.length
  }

  private renderHeader(): void {
    const user = this.auth.getUser()
    const headerHost = this.container.querySelector('#admin-header') as HTMLElement | null

    if (!headerHost) {
      return
    }

    const header = new Header({
      role: 'ADMINISTRADOR',
      nombre: user?.username ?? 'Administrador',
      puntoAcceso: user?.username ?? 'Control',
      title: this.i18n.t('admin_panel'),
    })

    header.render(headerHost)
  }

  private formatCop(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value)
  }
}
