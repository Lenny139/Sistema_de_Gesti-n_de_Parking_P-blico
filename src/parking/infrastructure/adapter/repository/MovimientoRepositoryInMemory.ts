import { randomUUID } from 'crypto'
import ETipoMovimiento from '../../../domain/model/ETipoMovimiento.js'
import Movimiento from '../../../domain/model/Movimiento.js'
import IMovimientoRepositoryPort from '../../../domain/port/driven/repository/IMovimientoRepositoryPort.js'

export default class MovimientoRepositoryInMemory
  implements IMovimientoRepositoryPort
{
  private readonly movimientos: Map<string, Movimiento>

  constructor() {
    const now = new Date()
    const hour = 1000 * 60 * 60
    const minute = 1000 * 60

    const seed: Movimiento[] = [
      new Movimiento({
        id: randomUUID(),
        ticketId: 'ticket-1',
        matricula: 'ABC123',
        tipo: ETipoMovimiento.ENTRADA,
        hora: new Date(now.getTime() - 2 * hour),
        monto: null,
        operadorId: '2',
        puntoAcceso: 'Cabina Principal',
      }),
      new Movimiento({
        id: randomUUID(),
        ticketId: 'ticket-1',
        matricula: 'ABC123',
        tipo: ETipoMovimiento.SALIDA,
        hora: new Date(now.getTime() - 30 * minute),
        monto: 4500,
        operadorId: '2',
        puntoAcceso: 'Cabina Principal',
      }),
      new Movimiento({
        id: randomUUID(),
        ticketId: 'ticket-2',
        matricula: 'XYZ789',
        tipo: ETipoMovimiento.ENTRADA,
        hora: new Date(now.getTime() - 5 * hour),
        monto: null,
        operadorId: '2',
        puntoAcceso: 'Cabina Principal',
      }),
      new Movimiento({
        id: randomUUID(),
        ticketId: 'ticket-2',
        matricula: 'XYZ789',
        tipo: ETipoMovimiento.SALIDA,
        hora: new Date(now.getTime() - 1 * hour),
        monto: 12000,
        operadorId: '2',
        puntoAcceso: 'Cabina Principal',
      }),
      new Movimiento({
        id: randomUUID(),
        ticketId: 'ticket-3',
        matricula: 'LMN345',
        tipo: ETipoMovimiento.ENTRADA,
        hora: new Date(now.getTime() - 8 * hour),
        monto: null,
        operadorId: '3',
        puntoAcceso: 'Cabina Secundaria',
      }),
      new Movimiento({
        id: randomUUID(),
        ticketId: 'ticket-3',
        matricula: 'LMN345',
        tipo: ETipoMovimiento.SALIDA,
        hora: new Date(now.getTime() - 6 * hour),
        monto: 6000,
        operadorId: '3',
        puntoAcceso: 'Cabina Secundaria',
      }),
      new Movimiento({
        id: randomUUID(),
        ticketId: 'ticket-4',
        matricula: 'DEF456',
        tipo: ETipoMovimiento.ENTRADA,
        hora: new Date(now.getTime() - 1 * hour),
        monto: null,
        operadorId: '3',
        puntoAcceso: 'Cabina Secundaria',
      }),
      new Movimiento({
        id: randomUUID(),
        ticketId: 'ticket-5',
        matricula: 'GHI012',
        tipo: ETipoMovimiento.ENTRADA,
        hora: new Date(now.getTime() - 3 * hour),
        monto: null,
        operadorId: '2',
        puntoAcceso: 'Cabina Principal',
      }),
    ]

    this.movimientos = new Map(seed.map((movimiento) => [movimiento.getId(), movimiento]))
  }

  readonly findById = async (id: string): Promise<Movimiento | null> => {
    return this.movimientos.get(id) ?? null
  }

  readonly findAll = async (): Promise<Movimiento[]> => {
    return [...this.movimientos.values()]
  }

  readonly save = async (item: Movimiento): Promise<Movimiento> => {
    this.movimientos.set(item.getId(), item)
    return item
  }

  readonly update = async (
    id: string,
    item: Partial<Movimiento>,
  ): Promise<Movimiento | null> => {
    const current = this.movimientos.get(id)
    if (!current) {
      return null
    }

    const updated = item instanceof Movimiento ? item : current
    this.movimientos.set(id, updated)
    return updated
  }

  readonly delete = async (id: string): Promise<boolean> => {
    return this.movimientos.delete(id)
  }

  readonly findByFecha = async (inicio: Date, fin: Date): Promise<Movimiento[]> => {
    const start = inicio.getTime()
    const end = fin.getTime()

    return [...this.movimientos.values()].filter((movimiento) => {
      const time = movimiento.getHora().getTime()
      return time >= start && time <= end
    })
  }

  readonly findByOperador = async (operadorId: string): Promise<Movimiento[]> => {
    return [...this.movimientos.values()].filter(
      (movimiento) => movimiento.getOperadorId() === operadorId,
    )
  }

  readonly findByMatricula = async (matricula: string): Promise<Movimiento[]> => {
    const normalized = matricula.trim().toUpperCase()

    return [...this.movimientos.values()].filter(
      (movimiento) => movimiento.getMatricula() === normalized,
    )
  }

  readonly calcularIngresosEnPeriodo = async (
    inicio: Date,
    fin: Date,
  ): Promise<number> => {
    const movimientosPeriodo = await this.findByFecha(inicio, fin)

    return movimientosPeriodo
      .filter(
        (movimiento) =>
          movimiento.getTipo() === ETipoMovimiento.SALIDA ||
          movimiento.getTipo() === ETipoMovimiento.TICKET_PERDIDO,
      )
      .reduce((sum, movimiento) => sum + (movimiento.getMonto() ?? 0), 0)
  }
}
