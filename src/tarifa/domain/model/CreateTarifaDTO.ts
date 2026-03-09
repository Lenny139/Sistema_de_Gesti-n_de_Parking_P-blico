import ETipoTarifa from './ETipoTarifa.js'

export default interface CreateTarifaDTO {
  nombre: string
  tipo: ETipoTarifa
  precioPorHora: number
  precioDiaCompleto: number
  tarifaNocturna: number
  tarifaTicketPerdido: number
  horaInicioNocturna: number
  horaFinNocturna: number
  activa: boolean
}
