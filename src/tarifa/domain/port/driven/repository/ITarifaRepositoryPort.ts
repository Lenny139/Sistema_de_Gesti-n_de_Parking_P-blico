import Tarifa from '../../../model/Tarifa.js'
import Repository from '../../../../../shared/domain/Repository.js'

export default interface ITarifaRepositoryPort extends Repository<string, Tarifa> {
  findActiva(): Promise<Tarifa | null>
}
