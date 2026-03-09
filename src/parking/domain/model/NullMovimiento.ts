import AbstractMovimiento from './AbstractMovimiento.js'
import ETipoMovimiento from './ETipoMovimiento.js'

export default class NullMovimiento extends AbstractMovimiento {
  constructor() {
    super({
      id: '',
      ticketId: '',
      matricula: '',
      tipo: ETipoMovimiento.ENTRADA,
      hora: new Date(0),
      monto: null,
      operadorId: '',
      puntoAcceso: '',
    })
  }
}
