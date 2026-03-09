import TicketService from '../../parking/application/service/TicketService.js'
import EEstadoTicket from '../../parking/domain/model/EEstadoTicket.js'
import ETipoMovimiento from '../../parking/domain/model/ETipoMovimiento.js'
import Ticket from '../../parking/domain/model/Ticket.js'
import ITicketRepositoryPort from '../../parking/domain/port/driven/repository/ITicketRepositoryPort.js'
import IMovimientoRepositoryPort from '../../parking/domain/port/driven/repository/IMovimientoRepositoryPort.js'
import ITarifaServicePort from '../../tarifa/domain/port/driver/service/ITarifaServicePort.js'

describe('TicketService', () => {
  let mockTicketRepo: jest.Mocked<ITicketRepositoryPort>
  let mockMovimientoRepo: jest.Mocked<IMovimientoRepositoryPort>
  let mockTarifaService: jest.Mocked<ITarifaServicePort>
  let service: TicketService

  beforeEach(() => {
    mockTicketRepo = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByMatricula: jest.fn(),
      findActivos: jest.fn(),
      findByFecha: jest.fn(),
      countActivos: jest.fn(),
    }

    mockMovimientoRepo = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByFecha: jest.fn(),
      findByOperador: jest.fn(),
      findByMatricula: jest.fn(),
      calcularIngresosEnPeriodo: jest.fn(),
    }

    mockTarifaService = {
      getActiva: jest.fn(),
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      calcularCosto: jest.fn(),
    }

    service = new TicketService(mockTicketRepo, mockMovimientoRepo, mockTarifaService)
  })

  const buildActivo = (matricula = 'ABC123'): Ticket => {
    return new Ticket({
      id: 'ticket-1',
      matricula,
      horaEntrada: new Date('2026-03-09T10:00:00.000Z'),
      horaSalida: null,
      monto: null,
      estado: EEstadoTicket.ACTIVO,
      operadorEntradaId: 'op-1',
      operadorSalidaId: null,
      puntoAccesoEntrada: 'Cabina Norte',
      puntoAccesoSalida: null,
      ticketPerdido: false,
    })
  }

  it('registrarEntrada: debe crear ticket con estado ACTIVO', async () => {
    mockTicketRepo.findByMatricula.mockResolvedValue(null)
    mockTicketRepo.save.mockImplementation(async (ticket) => ticket)
    mockMovimientoRepo.save.mockImplementation(async (mov) => mov)

    const result = await service.registrarEntrada({
      matricula: 'abc123',
      operadorId: 'op-1',
      puntoAcceso: 'Cabina Norte',
    })

    expect(result.getEstado()).toBe(EEstadoTicket.ACTIVO)
    expect(mockTicketRepo.save).toHaveBeenCalledTimes(1)
    expect(mockMovimientoRepo.save).toHaveBeenCalledTimes(1)
  })

  it('registrarEntrada: debe fallar si ya hay un ticket activo para esa matrícula', async () => {
    mockTicketRepo.findByMatricula.mockResolvedValue(buildActivo('ABC123'))

    await expect(
      service.registrarEntrada({
        matricula: 'ABC123',
        operadorId: 'op-1',
        puntoAcceso: 'Cabina Norte',
      }),
    ).rejects.toThrow('Vehículo ya registrado')
  })

  it('registrarEntrada: debe guardar la matrícula en mayúsculas', async () => {
    mockTicketRepo.findByMatricula.mockResolvedValue(null)
    mockTicketRepo.save.mockImplementation(async (ticket) => ticket)
    mockMovimientoRepo.save.mockImplementation(async (mov) => mov)

    const result = await service.registrarEntrada({
      matricula: 'abC123',
      operadorId: 'op-1',
      puntoAcceso: 'Cabina Norte',
    })

    expect(result.getMatricula()).toBe('ABC123')
  })

  it('registrarSalida: debe calcular el monto correctamente', async () => {
    const ticketActivo = buildActivo('ABC123')

    mockTicketRepo.findByMatricula.mockResolvedValue(ticketActivo)
    mockTarifaService.calcularCosto.mockResolvedValue(15000)
    mockTicketRepo.update.mockImplementation(async (_id, ticket) => ticket as Ticket)
    mockMovimientoRepo.save.mockImplementation(async (mov) => mov)

    const result = await service.registrarSalida({
      matricula: 'abc123',
      operadorId: 'op-2',
      puntoAcceso: 'Cabina Sur',
    })

    expect(mockTarifaService.calcularCosto).toHaveBeenCalledWith(
      ticketActivo.getHoraEntrada(),
      expect.any(Date),
      false,
    )
    expect(result.monto).toBe(15000)
    expect(result.ticket.getEstado()).toBe(EEstadoTicket.PAGADO)
  })

  it('registrarSalida: debe fallar si no hay ticket activo para esa matrícula', async () => {
    mockTicketRepo.findByMatricula.mockResolvedValue(null)

    await expect(
      service.registrarSalida({
        matricula: 'XYZ999',
        operadorId: 'op-2',
        puntoAcceso: 'Cabina Sur',
      }),
    ).rejects.toThrow('No se encontró ticket activo')
  })

  it('registrarSalida: debe marcar como PERDIDO si ticketPerdido=true', async () => {
    const ticketActivo = buildActivo('ABC123')

    mockTicketRepo.findByMatricula.mockResolvedValue(ticketActivo)
    mockTarifaService.calcularCosto.mockResolvedValue(45000)
    mockTicketRepo.update.mockImplementation(async (_id, ticket) => ticket as Ticket)
    mockMovimientoRepo.save.mockImplementation(async (mov) => mov)

    const result = await service.registrarSalida({
      matricula: 'ABC123',
      operadorId: 'op-2',
      puntoAcceso: 'Cabina Sur',
      ticketPerdido: true,
    })

    expect(result.ticket.getEstado()).toBe(EEstadoTicket.PERDIDO)
    expect(result.ticket.getTicketPerdido()).toBe(true)

    const movimiento = mockMovimientoRepo.save.mock.calls[0]?.[0]
    expect(movimiento?.getTipo()).toBe(ETipoMovimiento.TICKET_PERDIDO)
  })

  it('getOcupacion: debe calcular porcentaje correctamente', async () => {
    mockTicketRepo.countActivos.mockResolvedValue(25)

    const result = await service.getOcupacion()

    expect(result.totalPlazas).toBeGreaterThan(0)
    expect(result.plazasOcupadas).toBe(25)
    expect(result.porcentajeOcupacion).toBe(25)
  })

  it('getOcupacion: debe retornar 0% cuando no hay tickets activos', async () => {
    mockTicketRepo.countActivos.mockResolvedValue(0)

    const result = await service.getOcupacion()

    expect(result.plazasOcupadas).toBe(0)
    expect(result.porcentajeOcupacion).toBe(0)
  })
})
