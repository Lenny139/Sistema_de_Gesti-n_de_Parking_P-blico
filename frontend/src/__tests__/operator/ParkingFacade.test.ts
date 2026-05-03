import { describe, it, expect, beforeEach, vi } from 'vitest'
import ParkingFacade from '../../modules/operator/ParkingFacade.js'

vi.mock('../../core/api/ApiClient.js', () => ({
  default: class {
    get = vi.fn()
    post = vi.fn()
    put = vi.fn()
    delete = vi.fn()
  },
}))

describe('ParkingFacade', () => {
  let facade: ParkingFacade

  beforeEach(() => {
    localStorage.clear()
    // @ts-expect-error - reset singleton
    ;(ParkingFacade as any).instance = undefined
    facade = ParkingFacade.getInstance()
  })

  it('debe ser un Singleton', () => {
    const a = ParkingFacade.getInstance()
    const b = ParkingFacade.getInstance()
    expect(a).toBe(b)
  })

  it('normalizarMatricula: convierte a mayúsculas y elimina espacios', async () => {
    const apiMock = (facade as any).apiClient
    apiMock.post.mockResolvedValue({
      id: '1',
      matricula: 'ABC123',
      horaEntrada: new Date().toISOString(),
      horaSalida: null,
      monto: null,
      estado: 'ACTIVO',
      operadorEntradaId: 'op1',
      operadorSalidaId: null,
      puntoAccesoEntrada: 'C1',
      puntoAccesoSalida: null,
      ticketPerdido: false,
    })
    apiMock.get.mockResolvedValue({
      totalPlazas: 100,
      plazasOcupadas: 1,
      plazasLibres: 99,
      porcentajeOcupacion: 1,
      ticketsActivos: 1,
      ultimaActualizacion: new Date().toISOString(),
    })

    const result = await facade.registrarEntrada('  abc 123  ')
    expect(result.ticket.matricula).toBe('ABC123')
    expect(apiMock.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ matricula: 'ABC123' }),
    )
  })

  it('buscarVehiculo: retorna null si el backend devuelve 404', async () => {
    const apiMock = (facade as any).apiClient
    apiMock.get.mockRejectedValue(new Error('no hay ticket activo'))

    const result = await facade.buscarVehiculo('XYZ999')
    expect(result).toBeNull()
  })

  it('getOcupacion: usa caché en segunda llamada', async () => {
    const apiMock = (facade as any).apiClient
    const mockData = {
      totalPlazas: 100,
      plazasOcupadas: 30,
      plazasLibres: 70,
      porcentajeOcupacion: 30,
      ticketsActivos: 30,
      ultimaActualizacion: new Date().toISOString(),
    }
    apiMock.get.mockResolvedValue(mockData)

    await facade.getOcupacion()
    await facade.getOcupacion()

    expect(apiMock.get).toHaveBeenCalledTimes(1)
  })
})
