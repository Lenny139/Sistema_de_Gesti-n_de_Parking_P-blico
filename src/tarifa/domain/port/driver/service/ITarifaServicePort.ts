import CreateTarifaDTO from '../../../model/CreateTarifaDTO.js'
import Tarifa from '../../../model/Tarifa.js'

export default interface ITarifaServicePort {
  getActiva(): Promise<Tarifa>
  getAll(): Promise<Tarifa[]>
  create(data: CreateTarifaDTO): Promise<Tarifa>
  update(id: string, data: Partial<CreateTarifaDTO>): Promise<Tarifa | null>
  delete(id: string): Promise<boolean>
  calcularCosto(entrada: Date, salida: Date, ticketPerdido?: boolean): Promise<number>
}
