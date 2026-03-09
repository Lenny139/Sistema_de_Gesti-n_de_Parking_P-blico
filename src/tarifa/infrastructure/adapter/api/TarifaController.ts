import { type Request, type Response } from 'express'
import ApiController from '../../../../api/domain/model/ApiController.js'
import CreateTarifaDTO from '../../../domain/model/CreateTarifaDTO.js'
import ITarifaUsecasePort from '../../../domain/port/driver/usecase/ITarifaUsecasePort.js'

export default class TarifaController extends ApiController {
  constructor(private readonly usecase: ITarifaUsecasePort) {
    super()
  }

  readonly getAll = async (_req: Request, res: Response): Promise<void> => {
    const tarifas = await this.usecase.getAll()
    res.status(this.STATUS.OK).json(tarifas.map((tarifa) => tarifa.toJSON()))
  }

  readonly getActiva = async (_req: Request, res: Response): Promise<void> => {
    const tarifa = await this.usecase.getActiva()
    res.status(this.STATUS.OK).json(tarifa.toJSON())
  }

  readonly create = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = (req.body ?? {}) as Partial<CreateTarifaDTO>
      const created = await this.usecase.create(this.parseCreateBody(body))
      res.status(this.STATUS.CREATED).json(created.toJSON())
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear tarifa'
      res.status(this.STATUS.BAD_REQUEST).json({ message })
    }
  }

  readonly update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = this.cleanParam(req.params['id'])
      if (!id) {
        res.status(this.STATUS.BAD_REQUEST).json({ message: 'El id es obligatorio' })
        return
      }

      const body = (req.body ?? {}) as Partial<CreateTarifaDTO>
      const updated = await this.usecase.update(id, body)

      if (!updated) {
        res.status(this.STATUS.NOT_FOUND).json({ message: 'Tarifa no encontrada' })
        return
      }

      res.status(this.STATUS.OK).json(updated.toJSON())
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al actualizar tarifa'
      res.status(this.STATUS.BAD_REQUEST).json({ message })
    }
  }

  readonly delete = async (req: Request, res: Response): Promise<void> => {
    const id = this.cleanParam(req.params['id'])
    if (!id) {
      res.status(this.STATUS.BAD_REQUEST).json({ message: 'El id es obligatorio' })
      return
    }

    const deleted = await this.usecase.delete(id)
    if (!deleted) {
      res.status(this.STATUS.NOT_FOUND).json({ message: 'Tarifa no encontrada' })
      return
    }

    res.status(this.STATUS.NO_CONTENT).send()
  }

  readonly calcularCosto = async (req: Request, res: Response): Promise<void> => {
    try {
      const { entrada, salida, ticketPerdido } = req.body as {
        entrada?: string
        salida?: string
        ticketPerdido?: boolean
      }

      if (!entrada || !salida) {
        res.status(this.STATUS.BAD_REQUEST).json({
          message: 'entrada y salida son obligatorias en formato ISO',
        })
        return
      }

      const entradaDate = new Date(entrada)
      const salidaDate = new Date(salida)

      if (Number.isNaN(entradaDate.getTime()) || Number.isNaN(salidaDate.getTime())) {
        res.status(this.STATUS.BAD_REQUEST).json({
          message: 'entrada o salida no tienen un formato de fecha válido',
        })
        return
      }

      const total = await this.usecase.calcularCosto(
        entradaDate,
        salidaDate,
        ticketPerdido ?? false,
      )

      res.status(this.STATUS.OK).json({ total })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al calcular costo'
      res.status(this.STATUS.BAD_REQUEST).json({ message })
    }
  }

  private readonly parseCreateBody = (body: Partial<CreateTarifaDTO> | undefined): CreateTarifaDTO => {
    if (
      !body ||
      !body.nombre ||
      body.tipo === undefined ||
      body.precioPorHora === undefined ||
      body.precioDiaCompleto === undefined ||
      body.tarifaNocturna === undefined ||
      body.tarifaTicketPerdido === undefined ||
      body.horaInicioNocturna === undefined ||
      body.horaFinNocturna === undefined ||
      body.activa === undefined
    ) {
      throw new Error('Faltan campos obligatorios para crear la tarifa')
    }

    return {
      nombre: body.nombre,
      tipo: body.tipo,
      precioPorHora: body.precioPorHora,
      precioDiaCompleto: body.precioDiaCompleto,
      tarifaNocturna: body.tarifaNocturna,
      tarifaTicketPerdido: body.tarifaTicketPerdido,
      horaInicioNocturna: body.horaInicioNocturna,
      horaFinNocturna: body.horaFinNocturna,
      activa: body.activa,
    }
  }

  private readonly cleanParam = (value: string | string[] | undefined): string => {
    if (Array.isArray(value)) {
      return value[0]?.trim() ?? ''
    }

    return value?.trim() ?? ''
  }
}
