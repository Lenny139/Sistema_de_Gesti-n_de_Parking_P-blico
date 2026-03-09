import ETipoTarifa from './ETipoTarifa.js'

export default abstract class AbstractTarifa {
  private readonly id: string
  private readonly nombre: string
  private readonly tipo: ETipoTarifa
  private readonly precioPorHora: number
  private readonly precioDiaCompleto: number
  private readonly tarifaNocturna: number
  private readonly tarifaTicketPerdido: number
  private readonly horaInicioNocturna: number
  private readonly horaFinNocturna: number
  private readonly activa: boolean
  private readonly actualizadaEn: Date

  constructor(tarifa: TarifaInterface) {
    this.id = tarifa.id
    this.nombre = tarifa.nombre
    this.tipo = tarifa.tipo
    this.precioPorHora = tarifa.precioPorHora
    this.precioDiaCompleto = tarifa.precioDiaCompleto
    this.tarifaNocturna = tarifa.tarifaNocturna
    this.tarifaTicketPerdido = tarifa.tarifaTicketPerdido
    this.horaInicioNocturna = tarifa.horaInicioNocturna
    this.horaFinNocturna = tarifa.horaFinNocturna
    this.activa = tarifa.activa
    this.actualizadaEn = tarifa.actualizadaEn
  }

  readonly getId = (): string => this.id

  readonly getNombre = (): string => this.nombre

  readonly getTipo = (): ETipoTarifa => this.tipo

  readonly getPrecioPorHora = (): number => this.precioPorHora

  readonly getPrecioDiaCompleto = (): number => this.precioDiaCompleto

  readonly getTarifaNocturna = (): number => this.tarifaNocturna

  readonly getTarifaTicketPerdido = (): number => this.tarifaTicketPerdido

  readonly getHoraInicioNocturna = (): number => this.horaInicioNocturna

  readonly getHoraFinNocturna = (): number => this.horaFinNocturna

  readonly getActiva = (): boolean => this.activa

  readonly getActualizadaEn = (): Date => this.actualizadaEn

  readonly toJSON = (): object => {
    return {
      id: this.id,
      nombre: this.nombre,
      tipo: this.tipo,
      precioPorHora: this.precioPorHora,
      precioDiaCompleto: this.precioDiaCompleto,
      tarifaNocturna: this.tarifaNocturna,
      tarifaTicketPerdido: this.tarifaTicketPerdido,
      horaInicioNocturna: this.horaInicioNocturna,
      horaFinNocturna: this.horaFinNocturna,
      activa: this.activa,
      actualizadaEn: this.actualizadaEn,
    }
  }
}

export interface TarifaInterface {
  id: string
  nombre: string
  tipo: ETipoTarifa
  precioPorHora: number
  precioDiaCompleto: number
  tarifaNocturna: number
  tarifaTicketPerdido: number
  horaInicioNocturna: number
  horaFinNocturna: number
  activa: boolean
  actualizadaEn: Date
}
