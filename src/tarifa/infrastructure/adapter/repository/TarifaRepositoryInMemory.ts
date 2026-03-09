import { randomUUID } from 'crypto'
import ETipoTarifa from '../../../domain/model/ETipoTarifa.js'
import Tarifa from '../../../domain/model/Tarifa.js'
import ITarifaRepositoryPort from '../../../domain/port/driven/repository/ITarifaRepositoryPort.js'

export default class TarifaRepositoryInMemory implements ITarifaRepositoryPort {
  private readonly tarifas: Map<string, Tarifa>

  constructor() {
    const tarifaEjemplo = new Tarifa({
      id: randomUUID(),
      nombre: 'Tarifa Estándar 2026',
      tipo: ETipoTarifa.POR_HORA,
      precioPorHora: 3000,
      precioDiaCompleto: 25000,
      tarifaNocturna: 5000,
      tarifaTicketPerdido: 15000,
      horaInicioNocturna: 20,
      horaFinNocturna: 6,
      activa: true,
      actualizadaEn: new Date(),
    })

    this.tarifas = new Map([[tarifaEjemplo.getId(), tarifaEjemplo]])
  }

  readonly findById = async (id: string): Promise<Tarifa | null> => {
    return this.tarifas.get(id) ?? null
  }

  readonly findAll = async (): Promise<Tarifa[]> => {
    return [...this.tarifas.values()]
  }

  readonly save = async (item: Tarifa): Promise<Tarifa> => {
    this.tarifas.set(item.getId(), item)
    return item
  }

  readonly update = async (id: string, item: Partial<Tarifa>): Promise<Tarifa | null> => {
    const current = this.tarifas.get(id)
    if (!current) {
      return null
    }

    const updated = item instanceof Tarifa ? item : current
    this.tarifas.set(id, updated)
    return updated
  }

  readonly delete = async (id: string): Promise<boolean> => {
    return this.tarifas.delete(id)
  }

  readonly findActiva = async (): Promise<Tarifa | null> => {
    for (const tarifa of this.tarifas.values()) {
      if (tarifa.getActiva()) {
        return tarifa
      }
    }

    return null
  }
}
