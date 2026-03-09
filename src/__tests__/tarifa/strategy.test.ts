import TarifaContext from '../../tarifa/domain/model/TarifaContext.js'
import Tarifa from '../../tarifa/domain/model/Tarifa.js'
import ETipoTarifa from '../../tarifa/domain/model/ETipoTarifa.js'
import TarifaDiaCompletoStrategy from '../../tarifa/domain/model/strategy/TarifaDiaCompletoStrategy.js'
import TarifaNocturnaStrategy from '../../tarifa/domain/model/strategy/TarifaNocturnaStrategy.js'
import TarifaPorHoraStrategy from '../../tarifa/domain/model/strategy/TarifaPorHoraStrategy.js'
import TarifaTicketPerdidoStrategy from '../../tarifa/domain/model/strategy/TarifaTicketPerdidoStrategy.js'

const dt = (hour: number, minute = 0, day = 9): Date =>
  new Date(2026, 2, day, hour, minute, 0, 0)

const tarifaMock = new Tarifa({
  id: 'tarifa-1',
  nombre: 'Tarifa base',
  tipo: ETipoTarifa.POR_HORA,
  precioPorHora: 3000,
  precioDiaCompleto: 30000,
  tarifaNocturna: 18000,
  tarifaTicketPerdido: 45000,
  horaInicioNocturna: 22,
  horaFinNocturna: 6,
  activa: true,
  actualizadaEn: new Date('2026-01-01T00:00:00.000Z'),
})

describe('TarifaPorHoraStrategy', () => {
  const strategy = new TarifaPorHoraStrategy()

  it('debe cobrar mínimo 1 hora aunque sea menos tiempo', () => {
    const entrada = dt(10, 0)
    const salida = dt(10, 10)

    const total = strategy.calcular(entrada, salida, tarifaMock)

    expect(total).toBe(3000)
  })

  it('debe redondear hacia arriba (55 minutos = 1 hora)', () => {
    const entrada = dt(10, 0)
    const salida = dt(10, 55)

    const total = strategy.calcular(entrada, salida, tarifaMock)

    expect(total).toBe(3000)
  })

  it('debe calcular correctamente 3 horas', () => {
    const entrada = dt(8, 0)
    const salida = dt(11, 0)

    const total = strategy.calcular(entrada, salida, tarifaMock)

    expect(total).toBe(9000)
  })

  it('debe calcular correctamente 90 minutos = 2 horas', () => {
    const entrada = dt(8, 0)
    const salida = dt(9, 30)

    const total = strategy.calcular(entrada, salida, tarifaMock)

    expect(total).toBe(6000)
  })
})

describe('TarifaDiaCompletoStrategy', () => {
  const strategy = new TarifaDiaCompletoStrategy()

  it('debe aplicar tarifa día completo cuando supera 12 horas', () => {
    const entrada = dt(8, 0)
    const salida = dt(21, 0)

    const total = strategy.calcular(entrada, salida, tarifaMock)

    expect(total).toBe(30000)
  })

  it('debe multiplicar por días si son más de 24 horas', () => {
    const entrada = dt(8, 0, 9)
    const salida = dt(9, 0, 11)

    const total = strategy.calcular(entrada, salida, tarifaMock)

    expect(total).toBe(90000)
  })

  it('NO debe aplicar si son exactamente 12 horas (usa por hora)', () => {
    const entrada = dt(8, 0)
    const salida = dt(20, 0)

    const total = strategy.calcular(entrada, salida, tarifaMock)

    expect(total).toBe(36000)
  })
})

describe('TarifaNocturnaStrategy', () => {
  const strategy = new TarifaNocturnaStrategy()

  it('debe aplicar tarifa nocturna si la entrada es a las 22:00', () => {
    const entrada = dt(22, 0)
    const salida = dt(0, 0, 10)

    const total = strategy.calcular(entrada, salida, tarifaMock)

    expect(total).toBe(18000)
  })

  it('debe aplicar tarifa nocturna si la entrada es a las 02:00', () => {
    const entrada = dt(2, 0)
    const salida = dt(4, 0)

    const total = strategy.calcular(entrada, salida, tarifaMock)

    expect(total).toBe(18000)
  })

  it('NO debe aplicar tarifa nocturna a las 14:00', () => {
    const entrada = dt(14, 0)
    const salida = dt(16, 0)

    const total = strategy.calcular(entrada, salida, tarifaMock)

    expect(total).toBe(6000)
  })
})

describe('TarifaContext', () => {
  const context = new TarifaContext(tarifaMock)

  it('debe seleccionar TarifaPorHoraStrategy para horario diurno < 12h', () => {
    const entrada = dt(10, 0)
    const salida = dt(12, 0)

    const strategy = context.seleccionarEstrategia(entrada, salida)

    expect(strategy).toBeInstanceOf(TarifaPorHoraStrategy)
  })

  it('debe seleccionar TarifaNocturnaStrategy para horario nocturno', () => {
    const entrada = dt(23, 0)
    const salida = dt(1, 0, 10)

    const strategy = context.seleccionarEstrategia(entrada, salida)

    expect(strategy).toBeInstanceOf(TarifaNocturnaStrategy)
  })

  it('debe seleccionar TarifaDiaCompletoStrategy para > 12 horas', () => {
    const entrada = dt(8, 0)
    const salida = dt(22, 30)

    const strategy = context.seleccionarEstrategia(entrada, salida)

    expect(strategy).toBeInstanceOf(TarifaDiaCompletoStrategy)
  })

  it('debe seleccionar TarifaTicketPerdidoStrategy cuando ticketPerdido=true', () => {
    const entrada = dt(10, 0)
    const salida = dt(12, 0)

    const strategy = context.seleccionarEstrategia(entrada, salida, true)

    expect(strategy).toBeInstanceOf(TarifaTicketPerdidoStrategy)
  })

  it('debe calcular el monto final correctamente con cada estrategia', () => {
    const diurno = context.calcular(
      dt(10, 0),
      dt(11, 30),
    )

    const nocturno = context.calcular(
      dt(23, 0),
      dt(0, 0, 10),
    )

    const diaCompleto = context.calcular(
      dt(8, 0),
      dt(21, 30),
    )

    const perdido = context.calcular(
      dt(10, 0),
      dt(12, 0),
      true,
    )

    expect(diurno).toBe(6000)
    expect(nocturno).toBe(18000)
    expect(diaCompleto).toBe(30000)
    expect(perdido).toBe(45000)
  })
})
