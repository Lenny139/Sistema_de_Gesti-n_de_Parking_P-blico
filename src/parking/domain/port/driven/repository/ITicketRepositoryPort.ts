import Ticket from '../../../model/Ticket.js'
import Repository from '../../../../../shared/domain/Repository.js'

export default interface ITicketRepositoryPort extends Repository<string, Ticket> {
  findByMatricula(matricula: string): Promise<Ticket | null>
  findActivos(): Promise<Ticket[]>
  findByFecha(inicio: Date, fin: Date): Promise<Ticket[]>
  countActivos(): Promise<number>
}
