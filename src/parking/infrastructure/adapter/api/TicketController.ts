import { type Request, type Response } from 'express'
import ApiController from '../../../../api/domain/model/ApiController.js'
import ETipoMovimiento from '../../../domain/model/ETipoMovimiento.js'
import HistorialFiltros from '../../../domain/model/HistorialFiltros.js'
import RegistrarEntradaDTO from '../../../domain/model/RegistrarEntradaDTO.js'
import RegistrarSalidaDTO from '../../../domain/model/RegistrarSalidaDTO.js'
import ITicketUsecasePort from '../../../domain/port/driver/usecase/ITicketUsecasePort.js'

export default class TicketController extends ApiController {
  constructor(private readonly usecase: ITicketUsecasePort) {
    super()
  }

  readonly registrarEntrada = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body as { matricula?: string; puntoAcceso?: string }
      const matricula = this.normalizarMatricula(body.matricula)

      if (!matricula) {
        res.status(this.STATUS.BAD_REQUEST).json({ message: 'La matrícula es requerida' })
        return
      }

      const operadorId = req.user?.userId
      if (!operadorId) {
        res.status(this.STATUS.UNAUTHORIZED).json({ message: 'Usuario no autenticado' })
        return
      }

      const operadorUsername = req.user?.username
      if (!operadorUsername) {
        res.status(this.STATUS.UNAUTHORIZED).json({ message: 'Usuario no autenticado' })
        return
      }

      const puntoAcceso = body.puntoAcceso?.trim() || operadorUsername

      const dto: RegistrarEntradaDTO = {
        matricula,
        puntoAcceso,
        operadorId,
      }

      const ticket = await this.usecase.registrarEntrada(dto)
      res.status(this.STATUS.CREATED).json(ticket.toJSON())
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado'

      if (message.includes('Vehículo ya registrado')) {
        res.status(this.STATUS.CONFLICT).json({ message })
        return
      }

      res.status(this.STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Error interno al registrar entrada',
      })
    }
  }

  readonly registrarSalida = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body as {
        matricula?: string
        puntoAcceso?: string
        ticketPerdido?: boolean
      }

      const matricula = this.normalizarMatricula(body.matricula)
      if (!matricula) {
        res.status(this.STATUS.BAD_REQUEST).json({ message: 'La matrícula es requerida' })
        return
      }

      const operadorId = req.user?.userId
      if (!operadorId) {
        res.status(this.STATUS.UNAUTHORIZED).json({ message: 'Usuario no autenticado' })
        return
      }

      const operadorUsername = req.user?.username
      if (!operadorUsername) {
        res.status(this.STATUS.UNAUTHORIZED).json({ message: 'Usuario no autenticado' })
        return
      }

      const puntoAcceso = body.puntoAcceso?.trim() || operadorUsername

      const dto: RegistrarSalidaDTO = {
        matricula,
        puntoAcceso,
        operadorId,
      }

      if (body.ticketPerdido !== undefined) {
        dto.ticketPerdido = body.ticketPerdido
      }

      const result = await this.usecase.registrarSalida(dto)
      res.status(this.STATUS.OK).json({
        ticket: result.ticket.toJSON(),
        monto: result.monto,
        mensaje: `Cobro registrado: $${result.monto}`,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado'

      if (message.includes('No se encontró ticket activo')) {
        res.status(this.STATUS.NOT_FOUND).json({ message })
        return
      }

      res.status(this.STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Error interno al registrar salida',
      })
    }
  }

  readonly buscarVehiculo = async (req: Request, res: Response): Promise<void> => {
    try {
      const matricula = this.normalizarMatricula(req.params['matricula'])
      if (!matricula) {
        res.status(this.STATUS.BAD_REQUEST).json({ message: 'La matrícula es requerida' })
        return
      }

      const ticket = await this.usecase.buscarPorMatricula(matricula)
      if (!ticket || ticket.getEstado() !== 'ACTIVO') {
        res.status(this.STATUS.NOT_FOUND).json({ message: 'No hay ticket activo para esa matrícula' })
        return
      }

      res.status(this.STATUS.OK).json(ticket.toJSON())
    } catch {
      res.status(this.STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Error interno al buscar vehículo',
      })
    }
  }

  readonly getOcupacion = async (_req: Request, res: Response): Promise<void> => {
    try {
      const ocupacion = await this.usecase.getOcupacion()
      res.status(this.STATUS.OK).json(ocupacion)
    } catch {
      res.status(this.STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Error interno al obtener ocupación',
      })
    }
  }

  readonly getTicketsActivos = async (_req: Request, res: Response): Promise<void> => {
    try {
      const tickets = await this.usecase.getTicketsActivos()
      res.status(this.STATUS.OK).json(tickets.map((ticket) => ticket.toJSON()))
    } catch {
      res.status(this.STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Error interno al obtener tickets activos',
      })
    }
  }

  readonly getHistorial = async (req: Request, res: Response): Promise<void> => {
    try {
      const filtros = this.parseFiltros(req)
      const historial = await this.usecase.getHistorial(filtros)
      res.status(this.STATUS.OK).json(historial.map((movimiento) => movimiento.toJSON()))
    } catch (error) {
      const message = error instanceof Error ? error.message : ''

      if (message.includes('tipo de movimiento')) {
        res.status(this.STATUS.BAD_REQUEST).json({ message })
        return
      }

      res.status(this.STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Error interno al obtener historial',
      })
    }
  }

  readonly getTicketById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = this.cleanString(req.params['id'])
      if (!id) {
        res.status(this.STATUS.BAD_REQUEST).json({ message: 'El id es requerido' })
        return
      }

      const ticket = await this.usecase.getTicketById(id)
      if (!ticket) {
        res.status(this.STATUS.NOT_FOUND).json({ message: 'Ticket no encontrado' })
        return
      }

      res.status(this.STATUS.OK).json(ticket.toJSON())
    } catch {
      res.status(this.STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Error interno al obtener ticket',
      })
    }
  }

  private readonly parseFiltros = (req: Request): HistorialFiltros | undefined => {
    const fechaInicioRaw = this.cleanString(req.query['fechaInicio'])
    const fechaFinRaw = this.cleanString(req.query['fechaFin'])
    const operadorId = this.cleanString(req.query['operadorId'])
    const matricula = this.normalizarMatricula(req.query['matricula'])
    const tipoRaw = this.cleanString(req.query['tipo'])

    let tipo: ETipoMovimiento | undefined
    if (tipoRaw) {
      if (!Object.values(ETipoMovimiento).includes(tipoRaw as ETipoMovimiento)) {
        throw new Error('El tipo de movimiento no es válido')
      }
      tipo = tipoRaw as ETipoMovimiento
    }

    const filtros: HistorialFiltros = {}

    if (fechaInicioRaw) {
      filtros.fechaInicio = new Date(fechaInicioRaw)
    }
    if (fechaFinRaw) {
      filtros.fechaFin = new Date(fechaFinRaw)
    }
    if (operadorId) {
      filtros.operadorId = operadorId
    }
    if (matricula) {
      filtros.matricula = matricula
    }
    if (tipo) {
      filtros.tipo = tipo
    }

    if (Object.keys(filtros).length === 0) {
      return undefined
    }

    return filtros
  }

  private readonly normalizarMatricula = (value: unknown): string => {
    if (typeof value !== 'string') {
      return ''
    }

    return value.replaceAll(/\s+/g, '').toUpperCase().trim()
  }

  private readonly cleanString = (value: unknown): string => {
    if (Array.isArray(value)) {
      return typeof value[0] === 'string' ? value[0].trim() : ''
    }

    return typeof value === 'string' ? value.trim() : ''
  }
}
