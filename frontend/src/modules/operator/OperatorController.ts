import AuthStore from '../../core/auth/AuthStore.js'
import I18n from '../../core/i18n/I18n.js'
import BaseController from '../../core/mvc/BaseController.js'
import Toast from '../../components/Toast.js'
import ConfirmModal from '../../components/ConfirmModal.js'
import PrintTicket from '../../components/PrintTicket.js'
import OperatorModel from './OperatorModel.js'
import OperatorView from './OperatorView.js'
import { MovimientoResult, OcupacionResult, TicketResult } from './ParkingFacade.js'

export default class OperatorController extends BaseController<OperatorModel, OperatorView> {
  private readonly i18n = I18n.getInstance()
  private pollId: number | null = null
  private initialized = false
  private readonly onKeydown = this.handleKeydown.bind(this)
  private readonly onOcupacionActualizada = (event: Event): void => {
    const custom = event as CustomEvent<OcupacionResult>
    if (custom.detail) {
      this.view.renderOcupacion(custom.detail)
    }
  }

  init(): void {
    this.view.render()
    const user = AuthStore.getInstance().getUser()
    const nombreEl = document.getElementById('operador-nombre')
    if (nombreEl && user) {
      nombreEl.textContent = `${user.username} · Cabina Principal`
    }

    const input = document.getElementById('matricula-input') as HTMLInputElement | null
    if (input) {
      input.title = 'F1: Foco · F2: Entrada · F3: Salida · F5: Refrescar'
      input.oninput = () => {
        const pos = input.selectionStart ?? 0
        input.value = input.value.toUpperCase().replace(/[^A-Z0-9\-]/g, '')
        input.setSelectionRange(pos, pos)
      }
    }
    this.bindEvents()

    if (!this.initialized) {
      this.bindModelEvents()
      window.addEventListener('ocupacionActualizada', this.onOcupacionActualizada)
      this.model
        .cargarInicial()
        .catch((error) => Toast.error(error instanceof Error ? error.message : 'Error'))
      this.startPolling()
      this.initialized = true
    } else {
      if (this.model.state.ocupacion) {
        this.view.renderOcupacion(this.model.state.ocupacion)
      }
      this.view.renderMovimientos(this.model.state.ticketsActivos)
      this.view.renderResultadoBusqueda(this.model.state.ultimaBusqueda)
    }
  }

  private bindEvents(): void {
    const btnEntrada = document.getElementById('btn-entrada') as HTMLButtonElement | null
    const btnSalida = document.getElementById('btn-salida') as HTMLButtonElement | null
    const btnBuscar = document.getElementById('btn-buscar') as HTMLButtonElement | null
    const btnRefresh = document.getElementById('btn-refresh') as HTMLButtonElement | null
    const btnLogout = document.getElementById('logout-btn') as HTMLButtonElement | null
    const lang = document.getElementById('operator-lang') as HTMLSelectElement | null
    const themeToggle = document.getElementById('theme-toggle') as HTMLButtonElement | null

    btnEntrada?.addEventListener('click', async () => {
      const matricula = this.getMatriculaInput()
      if (!matricula) {
        Toast.warning(this.i18n.t('error_matricula_requerida'))
        return
      }

      try {
        await this.model.registrarEntrada(matricula)
        this.model.clearResult()
        Toast.success(this.i18n.t('entrada_registrada'))
        this.clearInput()
      } catch (error) {
        Toast.error(error instanceof Error ? error.message : 'Error')
      }
    })

    btnSalida?.addEventListener('click', async () => {
      const matricula = this.getMatriculaInput()
      if (!matricula) {
        Toast.warning(this.i18n.t('error_matricula_requerida'))
        return
      }

      try {
        const data = await this.model.buscarVehiculo(matricula)
        if (!data) {
          Toast.warning(this.i18n.t('vehiculo_no_encontrado'))
          return
        }

        this.view.showConfirmacionSalida(data)
        this.bindConfirmButtons(matricula)
      } catch (error) {
        Toast.error(error instanceof Error ? error.message : 'Error')
      }
    })

    btnBuscar?.addEventListener('click', async () => {
      const matricula = this.getMatriculaInput()
      if (!matricula) {
        Toast.warning(this.i18n.t('error_matricula_requerida'))
        return
      }

      try {
        const data = await this.model.buscarVehiculo(matricula)
        this.view.renderResultadoBusqueda(data)

        if (!data) {
          Toast.warning(this.i18n.t('vehiculo_no_encontrado'))
          return
        }

        this.bindConfirmButtons(matricula)
      } catch (error) {
        Toast.error(error instanceof Error ? error.message : 'Error')
      }
    })

    btnRefresh?.addEventListener('click', async () => {
      btnRefresh.disabled = true
      btnRefresh.textContent = '...'
      try {
        await this.model.refrescarDashboard()
        Toast.success('Dashboard actualizado')
      } catch (error) {
        Toast.error(error instanceof Error ? error.message : 'Error al refrescar')
      } finally {
        btnRefresh.disabled = false
        btnRefresh.textContent = 'Actualizar'
      }
    })

    btnLogout?.addEventListener('click', () => {
      if (this.pollId) {
        window.clearInterval(this.pollId)
      }
      document.removeEventListener('keydown', this.onKeydown)
      window.dispatchEvent(new CustomEvent('logout'))
    })

    lang?.addEventListener('change', () => {
      this.i18n.setLocale(lang.value === 'en' ? 'en' : 'es')
      this.init()
    })

    themeToggle?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-bs-theme')
      document.documentElement.setAttribute(
        'data-bs-theme',
        current === 'dark' ? 'light' : 'dark',
      )
      this.init()
    })

    document.removeEventListener('keydown', this.onKeydown)
    document.addEventListener('keydown', this.onKeydown)
  }

  private bindModelEvents(): void {
    this.model.on('ocupacionChanged', (data: unknown) => {
      if (data) {
        this.view.renderOcupacion(data as OcupacionResult)
      }
    })

    this.model.on('movimientosChanged', (data: unknown) => {
      this.view.renderMovimientos((data as MovimientoResult[]) ?? [])
    })

    this.model.on('busquedaChanged', (data: unknown) => {
      this.view.renderResultadoBusqueda((data as TicketResult) ?? null)
    })
  }

  private bindConfirmButtons(matricula: string): void {
    const confirmSalida = document.getElementById('btn-confirmar-salida') as HTMLButtonElement | null
    const confirmPerdido = document.getElementById('btn-confirmar-perdido') as HTMLButtonElement | null

    confirmSalida?.addEventListener('click', async () => {
      try {
        const result = await this.model.registrarSalida(matricula, false)
        Toast.success(`${this.i18n.t('cobro_exitoso')}: ${result.montoFormateado}`)
        const imprimir = await ConfirmModal.show({
          title: 'Cobro registrado',
          body: `<p>El cobro fue registrado exitosamente.</p>
              <p class="text-warning fw-bold fs-5">${result.montoFormateado}</p>
              <p>¿Desea imprimir el ticket de salida?</p>`,
          confirmLabel: 'Imprimir ticket',
          cancelLabel: 'No, gracias',
          confirmClass: 'btn-dark',
        })
        if (imprimir) {
          PrintTicket.print(result.ticket, result.monto)
        }
        this.view.clearResult()
        this.clearInput()
      } catch (error) {
        Toast.error(error instanceof Error ? error.message : 'Error')
      }
    })

    confirmPerdido?.addEventListener('click', async () => {
      const ok = await ConfirmModal.show({
        title: 'Ticket Perdido',
        body: `<p>¿Confirmar cobro de <strong>ticket perdido</strong> para la matrícula
              <span class="text-warning fw-bold">${matricula}</span>?</p>
              <p class="text-muted small mb-0">Se aplicará la tarifa especial de ticket perdido.</p>`,
        confirmLabel: 'Sí, cobrar penalidad',
        cancelLabel: 'Cancelar',
        confirmClass: 'btn-danger',
      })
      if (!ok) {
        return
      }

      try {
        const result = await this.model.registrarSalida(matricula, true)
        Toast.warning(`${this.i18n.t('cobro_exitoso')}: ${result.montoFormateado}`)
        this.view.clearResult()
        this.clearInput()
      } catch (error) {
        Toast.error(error instanceof Error ? error.message : 'Error')
      }
    })
  }

  private startPolling(): void {
    if (this.pollId) {
      window.clearInterval(this.pollId)
    }

    this.pollId = window.setInterval(() => {
      this.model
        .refrescarDashboard()
        .catch((error) => Toast.error(error instanceof Error ? error.message : 'Error'))
    }, 30000)
  }

  private getMatriculaInput(): string {
    const input = document.getElementById('matricula-input') as HTMLInputElement | null
    return input?.value.trim().toUpperCase() ?? ''
  }

  private clearInput(): void {
    const input = document.getElementById('matricula-input') as HTMLInputElement | null
    if (input) {
      input.value = ''
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    const input = document.getElementById('matricula-input') as HTMLInputElement | null
    if (!input) {
      return
    }

    if (event.key === 'Enter' && document.activeElement === input) {
      event.preventDefault()
      document.getElementById('btn-buscar')?.click()
      return
    }

    if (event.key === 'F1') {
      event.preventDefault()
      input.focus()
      input.select()
      return
    }

    if (event.key === 'F2') {
      event.preventDefault()
      document.getElementById('btn-entrada')?.click()
      return
    }

    if (event.key === 'F3') {
      event.preventDefault()
      document.getElementById('btn-salida')?.click()
      return
    }

    if (event.key === 'F5') {
      event.preventDefault()
      this.model.refrescarDashboard().catch(() => null)
    }
  }
}
