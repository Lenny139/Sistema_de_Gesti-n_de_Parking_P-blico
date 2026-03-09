import BaseModel from '../../core/mvc/BaseModel.js'
import ParkingFacade, {
  MovimientoResult,
  OcupacionResult,
  SalidaResult,
  TicketResult,
} from './ParkingFacade.js'

type OperatorState = {
  ocupacion: OcupacionResult | null
  ticketsActivos: MovimientoResult[]
  ultimaBusqueda: TicketResult | null
}

export default class OperatorModel extends BaseModel {
  readonly state: OperatorState = {
    ocupacion: null,
    ticketsActivos: [],
    ultimaBusqueda: null,
  }

  private readonly facade = ParkingFacade.getInstance()

  async cargarInicial(): Promise<void> {
    const [ocupacion, movimientos] = await Promise.all([
      this.facade.getOcupacion(),
      this.facade.getUltimosMovimientos(10),
    ])

    this.state.ocupacion = ocupacion
    this.state.ticketsActivos = movimientos

    this.emit('ocupacionChanged', ocupacion)
    this.emit('movimientosChanged', movimientos)
  }

  async registrarEntrada(matricula: string): Promise<TicketResult> {
    const result = await this.facade.registrarEntrada(matricula)
    await this.refrescarDashboard()
    return result
  }

  async registrarSalida(matricula: string, perdido = false): Promise<SalidaResult> {
    const result = await this.facade.registrarSalida(matricula, perdido)
    this.state.ultimaBusqueda = null
    this.emit('busquedaChanged', null)
    await this.refrescarDashboard()
    return result
  }

  async buscarVehiculo(matricula: string): Promise<TicketResult | null> {
    const result = await this.facade.buscarVehiculo(matricula)
    this.state.ultimaBusqueda = result
    this.emit('busquedaChanged', result)
    return result
  }

  clearResult(): void {
    this.state.ultimaBusqueda = null
    this.emit('busquedaChanged', null)
  }

  async refrescarDashboard(): Promise<void> {
    const [ocupacion, movimientos] = await Promise.all([
      this.facade.getOcupacion(),
      this.facade.getUltimosMovimientos(10),
    ])

    this.state.ocupacion = ocupacion
    this.state.ticketsActivos = movimientos

    this.emit('ocupacionChanged', ocupacion)
    this.emit('movimientosChanged', movimientos)
  }
}
