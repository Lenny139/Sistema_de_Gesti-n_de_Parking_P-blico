import Tarifa from '../Tarifa.js'
import ITarifaStrategy from './ITarifaStrategy.js'

export default class TarifaPorHoraStrategy implements ITarifaStrategy {
  calcular(entrada: Date, salida: Date, tarifa: Tarifa): number {
    const ms = salida.getTime() - entrada.getTime()
    const horas = Math.max(1, Math.ceil(ms / (1000 * 60 * 60)))
    return horas * tarifa.getPrecioPorHora()
  }
}
