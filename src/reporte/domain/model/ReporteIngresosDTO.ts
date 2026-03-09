export type PeriodoReporte = 'DIA' | 'SEMANA' | 'MES'

export default interface ReporteIngresosDTO {
  periodo: PeriodoReporte
  fechaInicio: Date
  fechaFin: Date
  totalIngresos: number
  totalMovimientos: number
  promedioTicket: number
  ingresosPorDia: Array<{ fecha: string; ingresos: number; movimientos: number }>
}
