import Movimiento from '../../../model/Movimiento.js'
import Repository from '../../../../../shared/domain/Repository.js'

export default interface IMovimientoRepositoryPort
  extends Repository<string, Movimiento> {
  findByFecha(inicio: Date, fin: Date): Promise<Movimiento[]>
  findByOperador(operadorId: string): Promise<Movimiento[]>
  findByMatricula(matricula: string): Promise<Movimiento[]>
  calcularIngresosEnPeriodo(inicio: Date, fin: Date): Promise<number>
}
