import ITarifaStrategy from './strategy/ITarifaStrategy.js'
import TarifaDiaCompletoStrategy from './strategy/TarifaDiaCompletoStrategy.js'
import TarifaNocturnaStrategy from './strategy/TarifaNocturnaStrategy.js'
import TarifaPorHoraStrategy from './strategy/TarifaPorHoraStrategy.js'
import TarifaTicketPerdidoStrategy from './strategy/TarifaTicketPerdidoStrategy.js'
import Tarifa from './Tarifa.js'

export default class TarifaContext {
  constructor(private readonly tarifa: Tarifa) {}

  seleccionarEstrategia(
    entrada: Date,
    salida: Date,
    ticketPerdido = false,
  ): ITarifaStrategy {
    if (ticketPerdido) {
      return new TarifaTicketPerdidoStrategy()
    }

    const horas = Math.max(0, (salida.getTime() - entrada.getTime()) / (1000 * 60 * 60))
    if (horas > 12) {
      return new TarifaDiaCompletoStrategy()
    }

    const horaEntrada = entrada.getHours()
    if (
      horaEntrada >= this.tarifa.getHoraInicioNocturna() ||
      horaEntrada < this.tarifa.getHoraFinNocturna()
    ) {
      return new TarifaNocturnaStrategy()
    }

    return new TarifaPorHoraStrategy()
  }

  calcular(entrada: Date, salida: Date, ticketPerdido = false): number {
    const strategy = this.seleccionarEstrategia(entrada, salida, ticketPerdido)
    return strategy.calcular(entrada, salida, this.tarifa)
  }
}
