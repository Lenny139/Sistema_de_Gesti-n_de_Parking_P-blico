import EEstadoTicket from '../../../domain/model/EEstadoTicket.js'
import Ticket from '../../../domain/model/Ticket.js'
import ITicketRepositoryPort from '../../../domain/port/driven/repository/ITicketRepositoryPort.js'

export default class TicketRepositoryInMemory implements ITicketRepositoryPort {
  private readonly tickets: Map<string, Ticket>

  constructor() {
    const now = new Date()
    const hour = 1000 * 60 * 60
    const minute = 1000 * 60

    const ticket1 = new Ticket({
      id: 'ticket-1',
      matricula: 'ABC123',
      horaEntrada: new Date(now.getTime() - 2 * hour),
      horaSalida: new Date(now.getTime() - 30 * minute),
      monto: 4500,
      estado: EEstadoTicket.PAGADO,
      operadorEntradaId: '2',
      operadorSalidaId: '2',
      puntoAccesoEntrada: 'Cabina Principal',
      puntoAccesoSalida: 'Cabina Principal',
      ticketPerdido: false,
    })

    const ticket2 = new Ticket({
      id: 'ticket-2',
      matricula: 'XYZ789',
      horaEntrada: new Date(now.getTime() - 5 * hour),
      horaSalida: new Date(now.getTime() - 1 * hour),
      monto: 12000,
      estado: EEstadoTicket.PAGADO,
      operadorEntradaId: '2',
      operadorSalidaId: '2',
      puntoAccesoEntrada: 'Cabina Principal',
      puntoAccesoSalida: 'Cabina Principal',
      ticketPerdido: false,
    })

    const ticket3 = new Ticket({
      id: 'ticket-3',
      matricula: 'LMN345',
      horaEntrada: new Date(now.getTime() - 8 * hour),
      horaSalida: new Date(now.getTime() - 6 * hour),
      monto: 6000,
      estado: EEstadoTicket.PAGADO,
      operadorEntradaId: '3',
      operadorSalidaId: '3',
      puntoAccesoEntrada: 'Cabina Secundaria',
      puntoAccesoSalida: 'Cabina Secundaria',
      ticketPerdido: false,
    })

    const ticket4 = new Ticket({
      id: 'ticket-4',
      matricula: 'DEF456',
      horaEntrada: new Date(now.getTime() - 1 * hour),
      horaSalida: null,
      monto: null,
      estado: EEstadoTicket.ACTIVO,
      operadorEntradaId: '3',
      operadorSalidaId: null,
      puntoAccesoEntrada: 'Cabina Secundaria',
      puntoAccesoSalida: null,
      ticketPerdido: false,
    })

    const ticket5 = new Ticket({
      id: 'ticket-5',
      matricula: 'GHI012',
      horaEntrada: new Date(now.getTime() - 3 * hour),
      horaSalida: null,
      monto: null,
      estado: EEstadoTicket.ACTIVO,
      operadorEntradaId: '2',
      operadorSalidaId: null,
      puntoAccesoEntrada: 'Cabina Principal',
      puntoAccesoSalida: null,
      ticketPerdido: false,
    })

    this.tickets = new Map(
      [ticket1, ticket2, ticket3, ticket4, ticket5].map((ticket) => [
        ticket.getId(),
        ticket,
      ]),
    )
  }

  readonly findById = async (id: string): Promise<Ticket | null> => {
    return this.tickets.get(id) ?? null
  }

  readonly findAll = async (): Promise<Ticket[]> => {
    return [...this.tickets.values()]
  }

  readonly save = async (item: Ticket): Promise<Ticket> => {
    this.tickets.set(item.getId(), item)
    return item
  }

  readonly update = async (id: string, item: Partial<Ticket>): Promise<Ticket | null> => {
    const current = this.tickets.get(id)
    if (!current) {
      return null
    }

    const updated = item instanceof Ticket ? item : current
    this.tickets.set(id, updated)
    return updated
  }

  readonly delete = async (id: string): Promise<boolean> => {
    return this.tickets.delete(id)
  }

  readonly findByMatricula = async (matricula: string): Promise<Ticket | null> => {
    const normalized = matricula.trim().toUpperCase()
    const matches = [...this.tickets.values()].filter(
      (ticket) => ticket.getMatricula() === normalized,
    )

    if (matches.length === 0) {
      return null
    }

    const active = matches.find((ticket) => ticket.getEstado() === EEstadoTicket.ACTIVO)
    if (active) {
      return active
    }

    return matches.sort(
      (a, b) => b.getHoraEntrada().getTime() - a.getHoraEntrada().getTime(),
    )[0] ?? null
  }

  readonly findActivos = async (): Promise<Ticket[]> => {
    return [...this.tickets.values()].filter(
      (ticket) => ticket.getEstado() === EEstadoTicket.ACTIVO,
    )
  }

  readonly findByFecha = async (inicio: Date, fin: Date): Promise<Ticket[]> => {
    const start = inicio.getTime()
    const end = fin.getTime()

    return [...this.tickets.values()].filter((ticket) => {
      const entrada = ticket.getHoraEntrada().getTime()
      return entrada >= start && entrada <= end
    })
  }

  readonly countActivos = async (): Promise<number> => {
    const activos = await this.findActivos()
    return activos.length
  }
}
