import HistorialFiltros from '../../domain/model/HistorialFiltros.js'
import Movimiento from '../../domain/model/Movimiento.js'
import OcupacionDTO from '../../domain/model/OcupacionDTO.js'
import RegistrarEntradaDTO from '../../domain/model/RegistrarEntradaDTO.js'
import RegistrarSalidaDTO from '../../domain/model/RegistrarSalidaDTO.js'
import Ticket from '../../domain/model/Ticket.js'
import ITicketServicePort from '../../domain/port/driver/service/ITicketServicePort.js'
import ITicketUsecasePort from '../../domain/port/driver/usecase/ITicketUsecasePort.js'

export default class TicketUsecase implements ITicketUsecasePort {
  constructor(private readonly service: ITicketServicePort) {}

  readonly registrarEntrada = async (dto: RegistrarEntradaDTO): Promise<Ticket> => {
    try {
      return await this.service.registrarEntrada(dto)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al registrar entrada'
      throw new Error(`No se pudo registrar la entrada: ${message}`)
    }
  }

  readonly registrarSalida = async (
    dto: RegistrarSalidaDTO,
  ): Promise<{ ticket: Ticket; monto: number }> => {
    try {
      return await this.service.registrarSalida(dto)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al registrar salida'
      throw new Error(`No se pudo registrar la salida: ${message}`)
    }
  }

  readonly buscarPorMatricula = async (
    matricula: string,
  ): Promise<Ticket | null> => {
    try {
      return await this.service.buscarPorMatricula(matricula)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al buscar por matrícula'
      throw new Error(`No se pudo buscar el ticket: ${message}`)
    }
  }

  readonly getTicketsActivos = async (): Promise<Ticket[]> => {
    try {
      return await this.service.getTicketsActivos()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al obtener tickets activos'
      throw new Error(`No se pudieron obtener los tickets activos: ${message}`)
    }
  }

  readonly getOcupacion = async (): Promise<OcupacionDTO> => {
    try {
      return await this.service.getOcupacion()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al calcular ocupación'
      throw new Error(`No se pudo obtener la ocupación: ${message}`)
    }
  }

  readonly getHistorial = async (
    filtros?: HistorialFiltros,
  ): Promise<Movimiento[]> => {
    try {
      return await this.service.getHistorial(filtros)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al obtener historial'
      throw new Error(`No se pudo obtener el historial: ${message}`)
    }
  }

  readonly getTicketById = async (id: string): Promise<Ticket | null> => {
    try {
      return await this.service.getTicketById(id)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al buscar ticket por ID'
      throw new Error(`No se pudo obtener el ticket: ${message}`)
    }
  }
}
