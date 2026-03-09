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
      <div class="container-fluid py-3">
        <ul class="nav nav-tabs mb-3" id="admin-tabs">
          <li class="nav-item"><button class="nav-link active" data-admin-tab="dashboard">Dashboard</button></li>
          <li class="nav-item"><button class="nav-link" data-admin-tab="reportes">${this.i18n.t('reporte_ingresos')}</button></li>
          <li class="nav-item"><button class="nav-link" data-admin-tab="tarifas">${this.i18n.t('gestion_tarifas')}</button></li>
          <li class="nav-item"><button class="nav-link" data-admin-tab="historial">Historial</button></li>
        </ul>

        <section class="admin-tab" data-tab-panel="dashboard">
          <div class="row g-3 mb-3">
            <div class="col-md-3"><div class="card card-ticket surface"><div class="card-body"><div class="text-warning fw-bold">🅿 Tickets Hoy</div><div class="fs-4 fw-bold" id="stat-tickets">0</div></div></div></div>
            <div class="col-md-3"><div class="card card-ticket surface"><div class="card-body"><div class="text-success fw-bold">$ Ingresos Hoy</div><div class="fs-4 fw-bold" id="stat-ingresos">$0</div></div></div></div>
            <div class="col-md-3"><div class="card card-ticket surface"><div class="card-body"><div class="text-primary fw-bold">% ${this.i18n.t('ocupacion')}</div><div class="fs-4 fw-bold" id="stat-ocupacion">0%</div></div></div></div>
            <div class="col-md-3"><div class="card card-ticket surface"><div class="card-body"><div class="text-warning fw-bold">⏱ Promedio Estadía</div><div class="fs-4 fw-bold" id="stat-estadia">0 min</div></div></div></div>
          </div>
          <div class="card card-ticket surface">
            <div class="card-body">
              <h5 class="title-oswald mb-3">Ingresos por hora</h5>
              <div id="dashboard-bars" class="d-flex flex-column gap-2"></div>
            </div>
          </div>
        </section>

        <section class="admin-tab d-none" data-tab-panel="reportes">
          <div class="card card-ticket surface mb-3">
            <div class="card-body d-flex align-items-center gap-2 flex-wrap">
              <label for="reporte-periodo" class="fw-semibold mb-0">Periodo</label>
              <select id="reporte-periodo" class="form-select" style="max-width: 240px">
                <option value="HOY">${this.i18n.t('hoy')}</option>
                <option value="SEMANA">${this.i18n.t('esta_semana')}</option>
                <option value="MES">${this.i18n.t('este_mes')}</option>
              </select>
            </div>
          </div>
          <div class="card card-ticket surface">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead><tr><th>Fecha</th><th>Ingresos</th><th>Movimientos</th><th>Promedio</th></tr></thead>
                  <tbody id="reporte-body"></tbody>
                </table>
              </div>
              <div class="alert alert-warning mb-0 mt-2 fw-bold" id="reporte-total">${this.i18n.t('total_ingresos')}: $0</div>
            </div>
          </div>
        </section>

        <section class="admin-tab d-none" data-tab-panel="tarifas">
          <div id="tarifa-card" class="card card-ticket surface mb-3">
            <div class="card-body">
              <h5 class="title-oswald">Tarifa activa</h5>
              <div id="tarifa-activa-detalle" class="small text-muted">Sin datos</div>
            </div>
          </div>

          <div class="card card-ticket surface">
            <div class="card-body">
              <form id="tarifa-form" class="row g-2 align-items-end">
                <input id="tarifa-id" type="hidden" />
                <div class="col-md-3"><label class="form-label">Precio/Hora</label><input id="tarifa-precioHora" type="number" min="0" class="form-control" required /></div>
                <div class="col-md-3"><label class="form-label">Día completo</label><input id="tarifa-diaCompleto" type="number" min="0" class="form-control" required /></div>
                <div class="col-md-3"><label class="form-label">Nocturna</label><input id="tarifa-nocturna" type="number" min="0" class="form-control" required /></div>
                <div class="col-md-3"><label class="form-label">Ticket perdido</label><input id="tarifa-perdido" type="number" min="0" class="form-control" required /></div>
                <div class="col-12">
                  <button class="btn btn-warning fw-bold" type="submit">Guardar cambios</button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section class="admin-tab d-none" data-tab-panel="historial">
          <div class="card card-ticket surface mb-3">
            <div class="card-body">
              <div class="row g-2 align-items-end">
                <div class="col-md-3"><label class="form-label">Fecha inicio</label><input id="hist-fechaInicio" type="date" class="form-control" /></div>
                <div class="col-md-3"><label class="form-label">Fecha fin</label><input id="hist-fechaFin" type="date" class="form-control" /></div>
                <div class="col-md-3"><label class="form-label">Tipo operación</label><select id="hist-tipo" class="form-select"><option value="">Todos</option><option value="ENTRADA">ENTRADA</option><option value="SALIDA">SALIDA</option><option value="TICKET_PERDIDO">TICKET_PERDIDO</option></select></div>
                <div class="col-md-3"><button id="hist-aplicar" class="btn btn-dark w-100">Aplicar filtros</button></div>
              </div>
            </div>
          </div>

          <div class="card card-ticket surface">
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead><tr><th>Hora</th><th>${this.i18n.t('matricula')}</th><th>${this.i18n.t('tipo')}</th><th>Operador</th><th>${this.i18n.t('monto')}</th></tr></thead>
                  <tbody id="historial-body"></tbody>
                </table>
              </div>
              <div class="d-flex justify-content-between align-items-center mt-2">
                <div id="historial-total" class="fw-bold">Total: $0</div>
                <div class="d-flex align-items-center gap-2">
                  <button id="hist-prev" class="btn btn-outline-secondary btn-sm">Anterior</button>
                  <span id="hist-page" class="small">1/1</span>
                  <button id="hist-next" class="btn btn-outline-secondary btn-sm">Siguiente</button>
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
        <div><strong>${activa.nombre}</strong> (${activa.tipo})</div>
        <div>${new Date(activa.actualizadaEn).toLocaleString()}</div>
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
