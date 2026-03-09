import Tarifa from '../Tarifa.js'

export default interface ITarifaStrategy {
  calcular(entrada: Date, salida: Date, tarifa: Tarifa): number
}
