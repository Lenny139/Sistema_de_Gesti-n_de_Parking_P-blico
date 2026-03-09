import AbstractTarifa from './AbstractTarifa.js'
import ETipoTarifa from './ETipoTarifa.js'

export default class NullTarifa extends AbstractTarifa {
  constructor() {
    super({
      id: '',
      nombre: '',
      tipo: ETipoTarifa.POR_HORA,
      precioPorHora: 0,
      precioDiaCompleto: 0,
      tarifaNocturna: 0,
      tarifaTicketPerdido: 0,
      horaInicioNocturna: 20,
      horaFinNocturna: 6,
      activa: false,
      actualizadaEn: new Date(0),
    })
  }
}
