import AbstractTarifa, { TarifaInterface } from './AbstractTarifa.js'

export default class Tarifa extends AbstractTarifa {
  constructor(tarifa: TarifaInterface) {
    super(tarifa)
  }
}
