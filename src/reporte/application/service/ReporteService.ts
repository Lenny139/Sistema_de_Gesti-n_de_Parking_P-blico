import EnvironmentProvider from '../../../api/infrastructure/provider/EnvironmentProvider.js'
import ETipoMovimiento from '../../../parking/domain/model/ETipoMovimiento.js'
import EEstadoTicket from '../../../parking/domain/model/EEstadoTicket.js'
import IMovimientoRepositoryPort from '../../../parking/domain/port/driven/repository/IMovimientoRepositoryPort.js'
import ITicketRepositoryPort from '../../../parking/domain/port/driven/repository/ITicketRepositoryPort.js'
import IUserRepositoryPort from '../../../auth/domain/port/driven/repository/IUserRepositoryPort.js'
import ReporteIngresosDTO, {
  PeriodoReporte,
} from '../../domain/model/ReporteIngresosDTO.js'
import ResumenOperadorDTO from '../../domain/model/ResumenOperadorDTO.js'
import IReporteServicePort from '../../domain/port/driver/IReporteServicePort.js'

export default class ReporteService implements IReporteServicePort {
  private readonly env = EnvironmentProvider.getInstance()

  constructor(
    private readonly movimientoRepository: IMovimientoRepositoryPort,
    private readonly ticketRepository: ITicketRepositoryPort,
    private readonly userRepository: IUserRepositoryPort,
  ) {}

  readonly getReporteIngresos = async (
    periodo: PeriodoReporte,
    fecha = new Date(),
  ): Promise<ReporteIngresosDTO> => {
    const { fechaInicio, fechaFin } = this.getRango(periodo, fecha)

    const movimientos = await this.movimientoRepository.findByFecha(
      fechaInicio,
      fechaFin,
    )

    const movimientosCobro = movimientos.filter(
      (movimiento) =>
        movimiento.getTipo() === ETipoMovimiento.SALIDA ||
        movimiento.getTipo() === ETipoMovimiento.TICKET_PERDIDO,
    )

    const totalIngresos = await this.movimientoRepository.calcularIngresosEnPeriodo(
      fechaInicio,
      fechaFin,
    )

    const totalMovimientos = movimientosCobro.length
    const promedioTicket = totalMovimientos > 0 ? totalIngresos / totalMovimientos : 0

    const ingresosPorDiaMap = new Map<
      string,
      { ingresos: number; movimientos: number }
    >()

    movimientosCobro.forEach((movimiento) => {
      const fechaKey = movimiento.getHora().toISOString().slice(0, 10)
      const prev = ingresosPorDiaMap.get(fechaKey) ?? { ingresos: 0, movimientos: 0 }

      ingresosPorDiaMap.set(fechaKey, {
        ingresos: prev.ingresos + (movimiento.getMonto() ?? 0),
        movimientos: prev.movimientos + 1,
      })
    })

    const ingresosPorDia = [...ingresosPorDiaMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([fechaDia, values]) => ({
        fecha: fechaDia,
        ingresos: values.ingresos,
        movimientos: values.movimientos,
      }))

    return {
      periodo,
      fechaInicio,
      fechaFin,
      totalIngresos,
      totalMovimientos,
      promedioTicket,
      ingresosPorDia,
    }
  }

  readonly getResumenOperadores = async (
    fechaInicio?: Date,
    fechaFin?: Date,
  ): Promise<ResumenOperadorDTO[]> => {
    const movimientos =
      fechaInicio && fechaFin
        ? await this.movimientoRepository.findByFecha(fechaInicio, fechaFin)
        : await this.movimientoRepository.findAll()

    const resumenMap = new Map<
      string,
      {
        totalOperaciones: number
        entradasRegistradas: number
        salidasRegistradas: number
        ingresosTotales: number
      }
    >()

    movimientos.forEach((movimiento) => {
      const operadorId = movimiento.getOperadorId()
      const prev = resumenMap.get(operadorId) ?? {
        totalOperaciones: 0,
        entradasRegistradas: 0,
        salidasRegistradas: 0,
        ingresosTotales: 0,
      }

      const isEntrada = movimiento.getTipo() === ETipoMovimiento.ENTRADA
      const isSalida =
        movimiento.getTipo() === ETipoMovimiento.SALIDA ||
        movimiento.getTipo() === ETipoMovimiento.TICKET_PERDIDO

      resumenMap.set(operadorId, {
        totalOperaciones: prev.totalOperaciones + 1,
        entradasRegistradas: prev.entradasRegistradas + (isEntrada ? 1 : 0),
        salidasRegistradas: prev.salidasRegistradas + (isSalida ? 1 : 0),
        ingresosTotales: prev.ingresosTotales + (isSalida ? (movimiento.getMonto() ?? 0) : 0),
      })
    })

    const result: ResumenOperadorDTO[] = []

    for (const [operadorId, data] of resumenMap.entries()) {
      const user = await this.userRepository.findById(operadorId)

      result.push({
        operadorId,
        nombreOperador: user?.getNombre() ?? 'Operador no identificado',
        totalOperaciones: data.totalOperaciones,
        entradasRegistradas: data.entradasRegistradas,
        salidasRegistradas: data.salidasRegistradas,
        ingresosTotales: data.ingresosTotales,
      })
    }

    return result.sort((a, b) => b.totalOperaciones - a.totalOperaciones)
  }

  readonly getEstadisticasGenerales = async (): Promise<{
    ticketsHoy: number
    ingresosHoy: number
    ocupacionActual: number
    promedioEstadia: number
  }> => {
    const { fechaInicio, fechaFin } = this.getRango('DIA', new Date())

    const ticketsHoyList = await this.ticketRepository.findByFecha(fechaInicio, fechaFin)
    const ticketsHoy = ticketsHoyList.length

    const ingresosHoy = await this.movimientoRepository.calcularIngresosEnPeriodo(
      fechaInicio,
      fechaFin,
    )

    const activos = await this.ticketRepository.countActivos()
    const totalPlazas = this.env.getTotalSpaces()
    const ocupacionActual =
      totalPlazas > 0 ? (activos / totalPlazas) * 100 : 0

    const pagadosHoy = ticketsHoyList.filter(
      (ticket) => ticket.getEstado() === EEstadoTicket.PAGADO,
    )
    const totalDuracion = pagadosHoy.reduce(
      (sum, ticket) => sum + (ticket.getDuracionMinutos() ?? 0),
      0,
    )

    const promedioEstadia =
      pagadosHoy.length > 0 ? totalDuracion / pagadosHoy.length : 0

    return {
      ticketsHoy,
      ingresosHoy,
      ocupacionActual,
      promedioEstadia,
    }
  }

  private readonly getRango = (
    periodo: PeriodoReporte,
    fecha: Date,
  ): { fechaInicio: Date; fechaFin: Date } => {
    const base = new Date(fecha)

    if (periodo === 'DIA') {
      const fechaInicio = new Date(base)
      fechaInicio.setHours(0, 0, 0, 0)

      const fechaFin = new Date(base)
      fechaFin.setHours(23, 59, 59, 999)

      return { fechaInicio, fechaFin }
    }

    if (periodo === 'SEMANA') {
      const fechaInicio = new Date(base)
      const day = fechaInicio.getDay()
      const diffToMonday = day === 0 ? -6 : 1 - day
      fechaInicio.setDate(fechaInicio.getDate() + diffToMonday)
      fechaInicio.setHours(0, 0, 0, 0)

      const fechaFin = new Date(fechaInicio)
      fechaFin.setDate(fechaInicio.getDate() + 6)
      fechaFin.setHours(23, 59, 59, 999)

      return { fechaInicio, fechaFin }
    }

    const fechaInicio = new Date(base.getFullYear(), base.getMonth(), 1, 0, 0, 0, 0)
    const fechaFin = new Date(
      base.getFullYear(),
      base.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    )

    return { fechaInicio, fechaFin }
  }
}
