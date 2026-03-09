import CreateTarifaDTO from '../../domain/model/CreateTarifaDTO.js'
import Tarifa from '../../domain/model/Tarifa.js'
import ITarifaServicePort from '../../domain/port/driver/service/ITarifaServicePort.js'
import ITarifaUsecasePort from '../../domain/port/driver/usecase/ITarifaUsecasePort.js'

export default class TarifaUsecase implements ITarifaUsecasePort {
  constructor(private readonly service: ITarifaServicePort) {}

  readonly getActiva = async (): Promise<Tarifa> => {
    return this.service.getActiva()
  }

  readonly getAll = async (): Promise<Tarifa[]> => {
    return this.service.getAll()
  }

  readonly create = async (data: CreateTarifaDTO): Promise<Tarifa> => {
    return this.service.create(data)
  }

  readonly update = async (
    id: string,
    data: Partial<CreateTarifaDTO>,
  ): Promise<Tarifa | null> => {
    return this.service.update(id, data)
  }

  readonly delete = async (id: string): Promise<boolean> => {
    return this.service.delete(id)
  }

  readonly calcularCosto = async (
    entrada: Date,
    salida: Date,
    ticketPerdido = false,
  ): Promise<number> => {
    return this.service.calcularCosto(entrada, salida, ticketPerdido)
  }
}
