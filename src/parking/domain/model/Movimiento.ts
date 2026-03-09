import AbstractMovimiento, { MovimientoInterface } from './AbstractMovimiento.js'

export default class Movimiento extends AbstractMovimiento {
  constructor(movimiento: MovimientoInterface) {
    super(movimiento)
  }
}
