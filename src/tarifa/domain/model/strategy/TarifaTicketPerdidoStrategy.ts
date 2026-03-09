import Tarifa from '../Tarifa.js'
import ITarifaStrategy from './ITarifaStrategy.js'

export default class TarifaTicketPerdidoStrategy implements ITarifaStrategy {
  calcular(_entrada: Date, _salida: Date, tarifa: Tarifa): number {
    return tarifa.getTarifaTicketPerdido()
  }
}
