import ReporteIngresosDTO, { PeriodoReporte } from '../../model/ReporteIngresosDTO.js'
import ResumenOperadorDTO from '../../model/ResumenOperadorDTO.js'

export default interface IReporteServicePort {
  getReporteIngresos(
    periodo: PeriodoReporte,
    fecha?: Date,
  ): Promise<ReporteIngresosDTO>
  getResumenOperadores(
    fechaInicio?: Date,
    fechaFin?: Date,
  ): Promise<ResumenOperadorDTO[]>
  getEstadisticasGenerales(): Promise<{
    ticketsHoy: number
    ingresosHoy: number
    ocupacionActual: number
    promedioEstadia: number
  }>
}
