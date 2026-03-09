import Tarifa from '../Tarifa.js'
import ITarifaStrategy from './ITarifaStrategy.js'

export default class TarifaNocturnaStrategy implements ITarifaStrategy {
  calcular(entrada: Date, salida: Date, tarifa: Tarifa): number {
    const horaEntrada = entrada.getHours()
    const inicio = tarifa.getHoraInicioNocturna()
    const fin = tarifa.getHoraFinNocturna()

    if (horaEntrada >= inicio || horaEntrada < fin) {
      return tarifa.getTarifaNocturna()
    }

    const horasNocturnas = this.calcularHorasNocturnas(entrada, salida, inicio, fin)
    if (horasNocturnas > 4) {
      return tarifa.getTarifaNocturna()
    }

    const ms = salida.getTime() - entrada.getTime()
    const horas = Math.max(1, Math.ceil(ms / (1000 * 60 * 60)))
    return horas * tarifa.getPrecioPorHora()
  }

  private calcularHorasNocturnas(
    entrada: Date,
    salida: Date,
    inicioNocturna: number,
    finNocturna: number,
  ): number {
    if (salida.getTime() <= entrada.getTime()) {
      return 0
    }

    const hourInMs = 1000 * 60 * 60
    let nocturnas = 0

    for (let t = entrada.getTime(); t < salida.getTime(); t += hourInMs) {
      const hour = new Date(t).getHours()
      if (hour >= inicioNocturna || hour < finNocturna) {
        nocturnas += 1
      }
    }

    return nocturnas
  }
}
