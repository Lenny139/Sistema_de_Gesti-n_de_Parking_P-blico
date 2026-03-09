import { randomUUID } from 'crypto'
import EEstadoTicket from './EEstadoTicket.js'

export default abstract class AbstractTicket {
  private readonly id: string
  private readonly matricula: string
  private readonly horaEntrada: Date
  private readonly horaSalida: Date | null
  private readonly monto: number | null
  private readonly estado: EEstadoTicket
  private readonly operadorEntradaId: string
  private readonly operadorSalidaId: string | null
  private readonly puntoAccesoEntrada: string
  private readonly puntoAccesoSalida: string | null
  private readonly ticketPerdido: boolean

  constructor(ticket: TicketInterface) {
    this.id = ticket.id ?? randomUUID()
    this.matricula = ticket.matricula.trim().toUpperCase()
    this.horaEntrada = ticket.horaEntrada
    this.horaSalida = ticket.horaSalida
    this.monto = ticket.monto
    this.estado = ticket.estado
    this.operadorEntradaId = ticket.operadorEntradaId
    this.operadorSalidaId = ticket.operadorSalidaId
    this.puntoAccesoEntrada = ticket.puntoAccesoEntrada
    this.puntoAccesoSalida = ticket.puntoAccesoSalida
    this.ticketPerdido = ticket.ticketPerdido
  }

  readonly getId = (): string => this.id

  readonly getMatricula = (): string => this.matricula

  readonly getHoraEntrada = (): Date => this.horaEntrada

  readonly getHoraSalida = (): Date | null => this.horaSalida

  readonly getMonto = (): number | null => this.monto

  readonly getEstado = (): EEstadoTicket => this.estado

  readonly getOperadorEntradaId = (): string => this.operadorEntradaId

  readonly getOperadorSalidaId = (): string | null => this.operadorSalidaId

  readonly getPuntoAccesoEntrada = (): string => this.puntoAccesoEntrada

  readonly getPuntoAccesoSalida = (): string | null => this.puntoAccesoSalida

  readonly getTicketPerdido = (): boolean => this.ticketPerdido

  readonly getDuracionMinutos = (): number | null => {
    if (!this.horaSalida) {
      return null
    }

    const diffMs = this.horaSalida.getTime() - this.horaEntrada.getTime()
    if (diffMs < 0) {
      return 0
    }

    return Math.floor(diffMs / (1000 * 60))
  }

  readonly toJSON = (): object => {
    return {
      id: this.id,
      matricula: this.matricula,
      horaEntrada: this.horaEntrada,
      horaSalida: this.horaSalida,
      monto: this.monto,
      estado: this.estado,
      operadorEntradaId: this.operadorEntradaId,
      operadorSalidaId: this.operadorSalidaId,
      puntoAccesoEntrada: this.puntoAccesoEntrada,
      puntoAccesoSalida: this.puntoAccesoSalida,
      ticketPerdido: this.ticketPerdido,
      duracionMinutos: this.getDuracionMinutos(),
    }
  }
}

export interface TicketInterface {
  id?: string
  matricula: string
  horaEntrada: Date
  horaSalida: Date | null
  monto: number | null
  estado: EEstadoTicket
  operadorEntradaId: string
  operadorSalidaId: string | null
  puntoAccesoEntrada: string
  puntoAccesoSalida: string | null
  ticketPerdido: boolean
}
