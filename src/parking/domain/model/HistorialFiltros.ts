import ETipoMovimiento from './ETipoMovimiento.js'

export default interface HistorialFiltros {
  fechaInicio?: Date
  fechaFin?: Date
  operadorId?: string
  matricula?: string
  tipo?: ETipoMovimiento
}
