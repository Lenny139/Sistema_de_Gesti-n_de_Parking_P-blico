import ApiClient from '../../core/api/ApiClient.js'
import ApiEndpoints from '../../core/api/ApiEndpoints.js'
import BaseModel from '../../core/mvc/BaseModel.js'

export type PeriodoReporteUI = 'HOY' | 'SEMANA' | 'MES'

export interface EstadisticasGenerales {
  ticketsHoy: number
  ingresosHoy: number
  ocupacionActual: number
  promedioEstadia: number
}

export interface ReporteIngreso {
  periodo: 'DIA' | 'SEMANA' | 'MES'
  fechaInicio: string
  fechaFin: string
  totalIngresos: number
  totalMovimientos: number
  promedioTicket: number
  ingresosPorDia: Array<{
    fecha: string
    ingresos: number
    movimientos: number
  }>
}

export interface TarifaData {
  id: string
  nombre: string
  tipo: string
  precioPorHora: number
  precioDiaCompleto: number
  tarifaNocturna: number
  tarifaTicketPerdido: number
  horaInicioNocturna: number
  horaFinNocturna: number
  activa: boolean
  actualizadaEn: string
}

export interface TarifaUpdateData {
  precioPorHora: number
  precioDiaCompleto: number
  tarifaNocturna: number
  tarifaTicketPerdido: number
}

export interface HistorialFiltros {
  fechaInicio?: string
  fechaFin?: string
  tipo?: 'ENTRADA' | 'SALIDA' | 'TICKET_PERDIDO'
}

export interface HistorialItem {
  id: string
  hora: string
  matricula: string
  tipo: string
  operadorId: string
  puntoAcceso: string
  monto: number | null
}

type AdminState = {
  tarifaActiva: TarifaData | null
  reporteActual: ReporteIngreso | null
  estadisticas: EstadisticasGenerales | null
  operadores: Array<{
    operadorId: string
    nombreOperador: string
    totalOperaciones: number
    entradasRegistradas: number
    salidasRegistradas: number
    ingresosTotales: number
  }>
}

export default class AdminModel extends BaseModel {
  readonly state: AdminState = {
    tarifaActiva: null,
    reporteActual: null,
    estadisticas: null,
    operadores: [],
  }

  private readonly api = new ApiClient()

  async loadEstadisticasGenerales(): Promise<EstadisticasGenerales> {
    const data = await this.api.get<EstadisticasGenerales>(ApiEndpoints.reportes.estadisticas)
    this.state.estadisticas = data
    this.emit('estadisticasChanged', data)
    return data
  }

  async loadReporteIngresos(periodo: PeriodoReporteUI): Promise<ReporteIngreso> {
    const periodoApi =
      periodo === 'HOY' ? 'DIA' : periodo === 'SEMANA' ? 'SEMANA' : 'MES'

    const path = `${ApiEndpoints.reportes.ingresos}?periodo=${periodoApi}`
    const data = await this.api.get<ReporteIngreso>(path)
    this.state.reporteActual = data
    this.emit('reporteChanged', data)
    return data
  }

  async loadTarifas(): Promise<TarifaData[]> {
    const data = await this.api.get<TarifaData[]>(ApiEndpoints.tarifas.list)
    const activa = data.find((item) => item.activa) ?? null
    this.state.tarifaActiva = activa
    this.emit('tarifasChanged', data)
    return data
  }

  async updateTarifa(id: string, data: TarifaUpdateData): Promise<TarifaData> {
    const path = `${ApiEndpoints.tarifas.byId}/${encodeURIComponent(id)}`
    const updated = await this.api.put<TarifaData>(path, data)
    this.state.tarifaActiva = updated.activa ? updated : this.state.tarifaActiva
    this.emit('tarifaActivaChanged', this.state.tarifaActiva)
    return updated
  }

  async createTarifa(data: Omit<TarifaData, 'id' | 'actualizadaEn'>): Promise<TarifaData> {
    const created = await this.api.post<TarifaData>(ApiEndpoints.tarifas.list, data)
    if (created.activa) {
      this.state.tarifaActiva = created
      this.emit('tarifaActivaChanged', created)
    }
    return created
  }

  async loadHistorial(filtros: HistorialFiltros): Promise<HistorialItem[]> {
    const params = new URLSearchParams()

    if (filtros.fechaInicio) {
      params.set('fechaInicio', filtros.fechaInicio)
    }
    if (filtros.fechaFin) {
      params.set('fechaFin', filtros.fechaFin)
    }
    if (filtros.tipo) {
      params.set('tipo', filtros.tipo)
    }

    const query = params.toString()
    const path = query
      ? `${ApiEndpoints.parking.historial}?${query}`
      : ApiEndpoints.parking.historial

    const data = await this.api.get<HistorialItem[]>(path)
    this.emit('historialChanged', data)
    return data
  }
}
