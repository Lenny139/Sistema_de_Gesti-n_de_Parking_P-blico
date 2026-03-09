import { randomUUID } from 'crypto'
import ETipoMovimiento from './ETipoMovimiento.js'

export default abstract class AbstractMovimiento {
  private readonly id: string
  private readonly ticketId: string
  private readonly matricula: string
  private readonly tipo: ETipoMovimiento
  private readonly hora: Date
  private readonly monto: number | null
  private readonly operadorId: string
  private readonly puntoAcceso: string

  constructor(movimiento: MovimientoInterface) {
    this.id = movimiento.id ?? randomUUID()
    this.ticketId = movimiento.ticketId
    this.matricula = movimiento.matricula.trim().toUpperCase()
    this.tipo = movimiento.tipo
    this.hora = movimiento.hora
    this.monto = movimiento.monto
    this.operadorId = movimiento.operadorId
    this.puntoAcceso = movimiento.puntoAcceso
  }

  readonly getId = (): string => this.id

  readonly getTicketId = (): string => this.ticketId

  readonly getMatricula = (): string => this.matricula

  readonly getTipo = (): ETipoMovimiento => this.tipo

  readonly getHora = (): Date => this.hora

  readonly getMonto = (): number | null => this.monto

  readonly getOperadorId = (): string => this.operadorId

  readonly getPuntoAcceso = (): string => this.puntoAcceso

  readonly toJSON = (): object => {
    return {
      id: this.id,
      ticketId: this.ticketId,
      matricula: this.matricula,
      tipo: this.tipo,
      hora: this.hora,
      monto: this.monto,
      operadorId: this.operadorId,
      puntoAcceso: this.puntoAcceso,
    }
  }
}

export interface MovimientoInterface {
  id?: string
  ticketId: string
  matricula: string
  tipo: ETipoMovimiento
  hora: Date
  monto: number | null
  operadorId: string
  puntoAcceso: string
}
