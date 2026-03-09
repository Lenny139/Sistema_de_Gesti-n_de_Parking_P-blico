import HistorialFiltros from '../../../model/HistorialFiltros.js'
import Movimiento from '../../../model/Movimiento.js'
import OcupacionDTO from '../../../model/OcupacionDTO.js'
import RegistrarEntradaDTO from '../../../model/RegistrarEntradaDTO.js'
import RegistrarSalidaDTO from '../../../model/RegistrarSalidaDTO.js'
import Ticket from '../../../model/Ticket.js'

export default interface ITicketUsecasePort {
  registrarEntrada(dto: RegistrarEntradaDTO): Promise<Ticket>
  registrarSalida(dto: RegistrarSalidaDTO): Promise<{ ticket: Ticket; monto: number }>
  buscarPorMatricula(matricula: string): Promise<Ticket | null>
  getTicketsActivos(): Promise<Ticket[]>
  getOcupacion(): Promise<OcupacionDTO>
  getHistorial(filtros?: HistorialFiltros): Promise<Movimiento[]>
  getTicketById(id: string): Promise<Ticket | null>
}
