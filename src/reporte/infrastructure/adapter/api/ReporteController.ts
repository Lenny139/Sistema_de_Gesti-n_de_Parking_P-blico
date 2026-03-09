import { type Request, type Response } from 'express'
import ApiController from '../../../../api/domain/model/ApiController.js'
import { PeriodoReporte } from '../../../domain/model/ReporteIngresosDTO.js'
import IReporteServicePort from '../../../domain/port/driver/IReporteServicePort.js'

export default class ReporteController extends ApiController {
  constructor(private readonly service: IReporteServicePort) {
    super()
  }

  readonly getReporteIngresos = async (req: Request, res: Response): Promise<void> => {
    try {
      const periodoRaw = this.cleanString(req.query['periodo']) as PeriodoReporte

      if (!periodoRaw || !['DIA', 'SEMANA', 'MES'].includes(periodoRaw)) {
        res.status(this.STATUS.BAD_REQUEST).json({
          message: 'El parámetro periodo es obligatorio y debe ser DIA, SEMANA o MES',
        })
        return
      }

      const fechaRaw = this.cleanString(req.query['fecha'])
      const fecha = fechaRaw ? new Date(fechaRaw) : new Date()

      if (Number.isNaN(fecha.getTime())) {
        res.status(this.STATUS.BAD_REQUEST).json({
          message: 'La fecha enviada no es válida',
        })
        return
      }

      const reporte = await this.service.getReporteIngresos(periodoRaw, fecha)
      res.status(this.STATUS.OK).json(reporte)
    } catch {
      res.status(this.STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Error interno al generar reporte de ingresos',
      })
    }
  }

  readonly getResumenOperadores = async (req: Request, res: Response): Promise<void> => {
    try {
      const fechaInicioRaw = this.cleanString(req.query['fechaInicio'])
      const fechaFinRaw = this.cleanString(req.query['fechaFin'])

      const fechaInicio = fechaInicioRaw ? new Date(fechaInicioRaw) : undefined
      const fechaFin = fechaFinRaw ? new Date(fechaFinRaw) : undefined

      if (fechaInicio && Number.isNaN(fechaInicio.getTime())) {
        res.status(this.STATUS.BAD_REQUEST).json({ message: 'fechaInicio no es válida' })
        return
      }

      if (fechaFin && Number.isNaN(fechaFin.getTime())) {
        res.status(this.STATUS.BAD_REQUEST).json({ message: 'fechaFin no es válida' })
        return
      }

      const resumen = await this.service.getResumenOperadores(fechaInicio, fechaFin)
      res.status(this.STATUS.OK).json(resumen)
    } catch {
      res.status(this.STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Error interno al generar resumen de operadores',
      })
    }
  }

  readonly getEstadisticasGenerales = async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.service.getEstadisticasGenerales()
      res.status(this.STATUS.OK).json(stats)
    } catch {
      res.status(this.STATUS.INTERNAL_SERVER_ERROR).json({
        message: 'Error interno al obtener estadísticas generales',
      })
    }
  }

  private readonly cleanString = (value: unknown): string => {
    if (Array.isArray(value)) {
      return typeof value[0] === 'string' ? value[0].trim() : ''
    }

    return typeof value === 'string' ? value.trim() : ''
  }
}
