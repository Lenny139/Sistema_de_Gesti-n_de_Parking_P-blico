import AuthStore from '../../core/auth/AuthStore.js'
import I18n from '../../core/i18n/I18n.js'
import BaseController from '../../core/mvc/BaseController.js'
import Toast from '../../components/Toast.js'
import OperatorModel from './OperatorModel.js'
import OperatorView from './OperatorView.js'
import { MovimientoResult, OcupacionResult, TicketResult } from './ParkingFacade.js'

export default class OperatorController extends BaseController<OperatorModel, OperatorView> {
  private readonly i18n = I18n.getInstance()
  private pollId: number | null = null
  private initialized = false
  private readonly onOcupacionActualizada = (event: Event): void => {
    const custom = event as CustomEvent<OcupacionResult>
    if (custom.detail) {
      this.view.renderOcupacion(custom.detail)
    }
  }

  init(): void {
    this.view.render()
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

    btnLogout?.addEventListener('click', () => {
      if (this.pollId) {
        window.clearInterval(this.pollId)
      }
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
        this.view.clearResult()
        this.clearInput()
      } catch (error) {
        Toast.error(error instanceof Error ? error.message : 'Error')
      }
    })

    confirmPerdido?.addEventListener('click', async () => {
      const ok = window.confirm('¿Confirmar ticket perdido?')
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
}
