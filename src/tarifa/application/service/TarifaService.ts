import { randomUUID } from 'crypto'
import CreateTarifaDTO from '../../domain/model/CreateTarifaDTO.js'
import NullTarifa from '../../domain/model/NullTarifa.js'
import Tarifa from '../../domain/model/Tarifa.js'
import TarifaContext from '../../domain/model/TarifaContext.js'
import ITarifaRepositoryPort from '../../domain/port/driven/repository/ITarifaRepositoryPort.js'
import ITarifaServicePort from '../../domain/port/driver/service/ITarifaServicePort.js'

export default class TarifaService implements ITarifaServicePort {
  constructor(private readonly repository: ITarifaRepositoryPort) {}

  readonly getActiva = async (): Promise<Tarifa> => {
    const tarifa = await this.repository.findActiva()
    return tarifa ?? new NullTarifa()
  }

  readonly getAll = async (): Promise<Tarifa[]> => {
    return this.repository.findAll()
  }

  readonly create = async (data: CreateTarifaDTO): Promise<Tarifa> => {
    if (data.activa) {
      const activa = await this.repository.findActiva()
      if (activa) {
        throw new Error('Ya existe una tarifa activa registrada')
      }
    }

    const tarifa = new Tarifa({
      id: randomUUID(),
      nombre: data.nombre,
      tipo: data.tipo,
      precioPorHora: data.precioPorHora,
      precioDiaCompleto: data.precioDiaCompleto,
      tarifaNocturna: data.tarifaNocturna,
      tarifaTicketPerdido: data.tarifaTicketPerdido,
      horaInicioNocturna: data.horaInicioNocturna,
      horaFinNocturna: data.horaFinNocturna,
      activa: data.activa,
      actualizadaEn: new Date(),
    })

    return this.repository.save(tarifa)
  }

  readonly update = async (
    id: string,
    data: Partial<CreateTarifaDTO>,
  ): Promise<Tarifa | null> => {
    if (data.activa === true) {
      const activa = await this.repository.findActiva()
      if (activa && activa.getId() !== id) {
        throw new Error('Ya existe otra tarifa activa registrada')
      }
    }

    const current = await this.repository.findById(id)
    if (!current) {
      return null
    }

    const next = new Tarifa({
      id: current.getId(),
      nombre: data.nombre ?? current.getNombre(),
      tipo: data.tipo ?? current.getTipo(),
      precioPorHora: data.precioPorHora ?? current.getPrecioPorHora(),
      precioDiaCompleto: data.precioDiaCompleto ?? current.getPrecioDiaCompleto(),
      tarifaNocturna: data.tarifaNocturna ?? current.getTarifaNocturna(),
      tarifaTicketPerdido:
        data.tarifaTicketPerdido ?? current.getTarifaTicketPerdido(),
      horaInicioNocturna:
        data.horaInicioNocturna ?? current.getHoraInicioNocturna(),
      horaFinNocturna: data.horaFinNocturna ?? current.getHoraFinNocturna(),
      activa: data.activa ?? current.getActiva(),
      actualizadaEn: new Date(),
    })

    return this.repository.update(id, next)
  }

  readonly delete = async (id: string): Promise<boolean> => {
    return this.repository.delete(id)
  }

  readonly calcularCosto = async (
    entrada: Date,
    salida: Date,
    ticketPerdido = false,
  ): Promise<number> => {
    if (Number.isNaN(entrada.getTime()) || Number.isNaN(salida.getTime())) {
      throw new Error('Fechas de entrada o salida inválidas')
    }

    if (salida.getTime() <= entrada.getTime()) {
      throw new Error('La fecha de salida debe ser posterior a la fecha de entrada')
    }

    const tarifaActiva = await this.getActiva()
    const context = new TarifaContext(tarifaActiva)
    return context.calcular(entrada, salida, ticketPerdido)
  }
}
