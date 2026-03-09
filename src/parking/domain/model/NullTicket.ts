import AbstractTicket from './AbstractTicket.js'
import EEstadoTicket from './EEstadoTicket.js'

export default class NullTicket extends AbstractTicket {
  constructor() {
    super({
      id: '',
      matricula: '',
      horaEntrada: new Date(0),
      horaSalida: null,
      monto: null,
      estado: EEstadoTicket.ACTIVO,
      operadorEntradaId: '',
      operadorSalidaId: null,
      puntoAccesoEntrada: '',
      puntoAccesoSalida: null,
      ticketPerdido: false,
    })
  }

  readonly isNull = (): true => true
}
