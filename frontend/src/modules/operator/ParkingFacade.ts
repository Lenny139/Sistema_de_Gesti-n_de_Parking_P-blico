import ApiClient from '../../core/api/ApiClient.js'
import ApiEndpoints from '../../core/api/ApiEndpoints.js'

export interface TicketData {
  id: string
  matricula: string
  horaEntrada: string
  horaSalida: string | null
  monto: number | null
  estado: string
  operadorEntradaId: string
  operadorSalidaId: string | null
  puntoAccesoEntrada: string
  puntoAccesoSalida: string | null
  ticketPerdido: boolean
}

export interface TicketResult {
  ticket: TicketData
  mensaje?: string
  tiempoTranscurrido?: string
  costoEstimado?: number
}

export interface SalidaResult {
  ticket: TicketData
  monto: number
  montoFormateado: string
  mensaje: string
}

export interface OcupacionResult {
  totalPlazas: number
  plazasOcupadas: number
  plazasLibres: number
  porcentajeOcupacion: number
  ticketsActivos: number
  ultimaActualizacion: string
}

export interface MovimientoResult {
  hora: string
  matricula: string
  tipo: string
  monto: number | null
}

export default class ParkingFacade {
  private static instance: ParkingFacade
  private readonly apiClient = new ApiClient()
  private ocupacion: OcupacionResult | null = null

  private constructor() {}

  static getInstance(): ParkingFacade {
    if (!ParkingFacade.instance) {
      ParkingFacade.instance = new ParkingFacade()
    }

    return ParkingFacade.instance
  }

  async registrarEntrada(matricula: string): Promise<TicketResult> {
    const placa = this.normalizarMatricula(matricula)

    const ticket = await this.apiClient.post<TicketData>(ApiEndpoints.parking.entrada, {
      matricula: placa,
    })

    await this.actualizarOcupacionInterna()

    return {
      ticket,
      mensaje: 'Entrada registrada',
    }
  }

  async registrarSalida(matricula: string, perdido = false): Promise<SalidaResult> {
    const placa = this.normalizarMatricula(matricula)

    const response = await this.apiClient.post<{
      ticket: TicketData
      monto: number
      mensaje: string
    }>(ApiEndpoints.parking.salida, {
      matricula: placa,
      ticketPerdido: perdido,
    })

    await this.actualizarOcupacionInterna()

    return {
      ticket: response.ticket,
      monto: response.monto,
      montoFormateado: new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(response.monto),
      mensaje: response.mensaje,
    }
  }

  async buscarVehiculo(matricula: string): Promise<TicketResult | null> {
    const placa = this.normalizarMatricula(matricula)

    try {
      const ticket = await this.apiClient.get<TicketData>(
        `${ApiEndpoints.parking.buscar}/${encodeURIComponent(placa)}`,
      )

      const diffMinutes = Math.max(
        0,
        Math.floor((Date.now() - new Date(ticket.horaEntrada).getTime()) / 60000),
      )
      const tiempoTranscurrido = this.formatMinutes(diffMinutes)

      const tarifa = await this.apiClient.get<{
        precioPorHora: number
      }>(ApiEndpoints.tarifas.activa)

      const horas = Math.max(1, Math.ceil(diffMinutes / 60))
      const costoEstimado = horas * (tarifa.precioPorHora ?? 0)

      return {
        ticket,
        tiempoTranscurrido,
        costoEstimado,
      }
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes('404')) {
        return null
      }

      if (error instanceof Error && error.message.toLowerCase().includes('no hay ticket activo')) {
        return null
      }

      throw error
    }
  }

  async getOcupacion(): Promise<OcupacionResult> {
    if (this.ocupacion) {
      return this.ocupacion
    }

    const data = await this.apiClient.get<OcupacionResult>(ApiEndpoints.parking.ocupacion)
    this.ocupacion = data
    return data
  }

  async getUltimosMovimientos(limit = 10): Promise<MovimientoResult[]> {
    const activos = await this.apiClient.get<TicketData[]>(ApiEndpoints.parking.activos)

    return activos
      .slice()
      .sort(
        (a, b) =>
          new Date(b.horaEntrada).getTime() - new Date(a.horaEntrada).getTime(),
      )
      .slice(0, limit)
      .map((ticket) => ({
        hora: ticket.horaEntrada,
        matricula: ticket.matricula,
        tipo: 'ENTRADA',
        monto: ticket.monto,
      }))
  }

  private async actualizarOcupacionInterna(): Promise<void> {
    const data = await this.apiClient.get<OcupacionResult>(ApiEndpoints.parking.ocupacion)
    this.ocupacion = data

    window.dispatchEvent(
      new CustomEvent('ocupacionActualizada', {
        detail: data,
      }),
    )
  }

  private normalizarMatricula(value: string): string {
    return value.trim().replace(/\s+/g, '').toUpperCase()
  }

  private formatMinutes(total: number): string {
    const h = Math.floor(total / 60)
    const m = total % 60
    return `${h}h ${m}m`
  }
}
