import Tarifa from '../Tarifa.js'
import ITarifaStrategy from './ITarifaStrategy.js'

export default class TarifaDiaCompletoStrategy implements ITarifaStrategy {
  calcular(entrada: Date, salida: Date, tarifa: Tarifa): number {
    const ms = salida.getTime() - entrada.getTime()
    const horas = Math.max(0, ms / (1000 * 60 * 60))

    if (horas <= 12) {
      const horasRedondeadas = Math.max(1, Math.ceil(horas))
      return horasRedondeadas * tarifa.getPrecioPorHora()
    }

    const dias = Math.ceil(horas / 24)
    return dias * tarifa.getPrecioDiaCompleto()
  }
}
