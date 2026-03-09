import EnvironmentProvider from '../../../api/infrastructure/provider/EnvironmentProvider.js'
import EEstadoTicket from '../../domain/model/EEstadoTicket.js'
import ETipoMovimiento from '../../domain/model/ETipoMovimiento.js'
import HistorialFiltros from '../../domain/model/HistorialFiltros.js'
import Movimiento from '../../domain/model/Movimiento.js'
import OcupacionDTO from '../../domain/model/OcupacionDTO.js'
import RegistrarEntradaDTO from '../../domain/model/RegistrarEntradaDTO.js'
import RegistrarSalidaDTO from '../../domain/model/RegistrarSalidaDTO.js'
import Ticket from '../../domain/model/Ticket.js'
import IMovimientoRepositoryPort from '../../domain/port/driven/repository/IMovimientoRepositoryPort.js'
import ITicketRepositoryPort from '../../domain/port/driven/repository/ITicketRepositoryPort.js'
import ITicketServicePort from '../../domain/port/driver/service/ITicketServicePort.js'
import ITarifaServicePort from '../../../tarifa/domain/port/driver/service/ITarifaServicePort.js'

export default class TicketService implements ITicketServicePort {
  private readonly env = EnvironmentProvider.getInstance()

  constructor(
    private readonly ticketRepository: ITicketRepositoryPort,
    private readonly movimientoRepository: IMovimientoRepositoryPort,
    private readonly tarifaService: ITarifaServicePort,
  ) {}

  readonly registrarEntrada = async (dto: RegistrarEntradaDTO): Promise<Ticket> => {
    const matricula = this.normalizarMatricula(dto.matricula)

    const existente = await this.ticketRepository.findByMatricula(matricula)
    if (existente && existente.getEstado() === EEstadoTicket.ACTIVO) {
      throw new Error('Vehículo ya registrado')
    }

    const ahora = new Date()
    const ticket = new Ticket({
      matricula,
      horaEntrada: ahora,
      horaSalida: null,
      monto: null,
      estado: EEstadoTicket.ACTIVO,
      operadorEntradaId: dto.operadorId,
      operadorSalidaId: null,
      puntoAccesoEntrada: dto.puntoAcceso,
      puntoAccesoSalida: null,
      ticketPerdido: false,
    })

    const guardado = await this.ticketRepository.save(ticket)

    const movimiento = new Movimiento({
      ticketId: guardado.getId(),
      matricula,
      tipo: ETipoMovimiento.ENTRADA,
      hora: ahora,
      monto: null,
      operadorId: dto.operadorId,
      puntoAcceso: dto.puntoAcceso,
    })

    await this.movimientoRepository.save(movimiento)

    return guardado
  }

  readonly registrarSalida = async (
    dto: RegistrarSalidaDTO,
  ): Promise<{ ticket: Ticket; monto: number }> => {
    const matricula = this.normalizarMatricula(dto.matricula)

    const ticketActivo = await this.ticketRepository.findByMatricula(matricula)
    if (!ticketActivo || ticketActivo.getEstado() !== EEstadoTicket.ACTIVO) {
      throw new Error('No se encontró ticket activo')
    }

    const horaSalida = new Date()
    const ticketPerdido = dto.ticketPerdido ?? false
    const monto = await this.tarifaService.calcularCosto(
      ticketActivo.getHoraEntrada(),
      horaSalida,
      ticketPerdido,
    )

    const estado = ticketPerdido ? EEstadoTicket.PERDIDO : EEstadoTicket.PAGADO
    const tipoMovimiento = ticketPerdido
      ? ETipoMovimiento.TICKET_PERDIDO
      : ETipoMovimiento.SALIDA

    const actualizado = new Ticket({
      id: ticketActivo.getId(),
      matricula: ticketActivo.getMatricula(),
      horaEntrada: ticketActivo.getHoraEntrada(),
      horaSalida,
      monto,
      estado,
      operadorEntradaId: ticketActivo.getOperadorEntradaId(),
      operadorSalidaId: dto.operadorId,
      puntoAccesoEntrada: ticketActivo.getPuntoAccesoEntrada(),
      puntoAccesoSalida: dto.puntoAcceso,
      ticketPerdido,
    })

    const ticketActualizado = await this.ticketRepository.update(
      ticketActivo.getId(),
      actualizado,
    )

    if (!ticketActualizado) {
      throw new Error('No se pudo actualizar el ticket de salida')
    }

    const movimientoSalida = new Movimiento({
      ticketId: ticketActualizado.getId(),
      matricula: ticketActualizado.getMatricula(),
      tipo: tipoMovimiento,
      hora: horaSalida,
      monto,
      operadorId: dto.operadorId,
      puntoAcceso: dto.puntoAcceso,
    })

    await this.movimientoRepository.save(movimientoSalida)

    return {
      ticket: ticketActualizado,
      monto,
    }
  }

  readonly buscarPorMatricula = async (matricula: string): Promise<Ticket | null> => {
    return this.ticketRepository.findByMatricula(this.normalizarMatricula(matricula))
  }

  readonly getTicketsActivos = async (): Promise<Ticket[]> => {
    return this.ticketRepository.findActivos()
  }

  readonly getOcupacion = async (): Promise<OcupacionDTO> => {
    const ticketsActivos = await this.ticketRepository.countActivos()
    const totalPlazas = this.env.getTotalSpaces()
    const plazasOcupadas = ticketsActivos
    const plazasLibres = Math.max(totalPlazas - plazasOcupadas, 0)
    const porcentajeOcupacion =
      totalPlazas > 0 ? (plazasOcupadas / totalPlazas) * 100 : 0

    return {
      totalPlazas,
      plazasOcupadas,
      plazasLibres,
      porcentajeOcupacion,
      ticketsActivos,
      ultimaActualizacion: new Date(),
    }
  }

  readonly getHistorial = async (
    filtros?: HistorialFiltros,
  ): Promise<Movimiento[]> => {
    let movimientos: Movimiento[]

    if (filtros?.fechaInicio && filtros.fechaFin) {
      movimientos = await this.movimientoRepository.findByFecha(
        filtros.fechaInicio,
        filtros.fechaFin,
      )
    } else if (filtros?.operadorId) {
      movimientos = await this.movimientoRepository.findByOperador(
        filtros.operadorId,
      )
    } else if (filtros?.matricula) {
      movimientos = await this.movimientoRepository.findByMatricula(
        this.normalizarMatricula(filtros.matricula),
      )
    } else {
      movimientos = await this.movimientoRepository.findAll()
    }

    if (filtros?.tipo) {
      movimientos = movimientos.filter(
        (movimiento) => movimiento.getTipo() === filtros.tipo,
      )
    }

    return movimientos.sort(
      (a, b) => b.getHora().getTime() - a.getHora().getTime(),
    )
  }

  readonly getTicketById = async (id: string): Promise<Ticket | null> => {
    return this.ticketRepository.findById(id)
  }

  private readonly normalizarMatricula = (matricula: string): string => {
    return matricula.trim().toUpperCase()
  }
}
