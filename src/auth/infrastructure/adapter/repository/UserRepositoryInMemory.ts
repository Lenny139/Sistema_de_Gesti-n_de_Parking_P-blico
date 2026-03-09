import bcrypt from 'bcryptjs'
import ERole from '../../../domain/model/ERole.js'
import User from '../../../domain/model/User.js'
import IUserRepositoryPort from '../../../domain/port/driven/repository/IUserRepositoryPort.js'

export default class UserRepositoryInMemory implements IUserRepositoryPort {
  private readonly users: Map<string, User>

  constructor() {
    const now = new Date()

    const seedUsers: User[] = [
      new User({
        id: '1',
        username: 'admin',
        passwordHash: bcrypt.hashSync('admin123', 10),
        nombre: 'Admin Principal',
        role: ERole.ADMINISTRADOR,
        puntoAcceso: 'Oficina',
        activo: true,
        creadoEn: now,
      }),
      new User({
        id: '2',
        username: 'operador1',
        passwordHash: bcrypt.hashSync('op123', 10),
        nombre: 'Carlos López',
        role: ERole.OPERADOR,
        puntoAcceso: 'Cabina Principal',
        activo: true,
        creadoEn: now,
      }),
      new User({
        id: '3',
        username: 'operador2',
        passwordHash: bcrypt.hashSync('op456', 10),
        nombre: 'María García',
        role: ERole.OPERADOR,
        puntoAcceso: 'Cabina Secundaria',
        activo: true,
        creadoEn: now,
      }),
    ]

    this.users = new Map(seedUsers.map((user) => [user.getId(), user]))
  }

  readonly findById = async (id: string): Promise<User | null> => {
    return this.users.get(id) ?? null
  }

  readonly findAll = async (): Promise<User[]> => {
    return [...this.users.values()]
  }

  readonly save = async (item: User): Promise<User> => {
    this.users.set(item.getId(), item)
    return item
  }

  readonly update = async (id: string, item: Partial<User>): Promise<User | null> => {
    const current = this.users.get(id)
    if (!current) {
      return null
    }

    const updated = new User({
      id: current.getId(),
      username: item.getUsername?.() ?? current.getUsername(),
      passwordHash: item.getPasswordHash?.() ?? current.getPasswordHash(),
      role: item.getRole?.() ?? current.getRole(),
      nombre: item.getNombre?.() ?? current.getNombre(),
      puntoAcceso: item.getPuntoAcceso?.() ?? current.getPuntoAcceso(),
      activo: item.getActivo?.() ?? current.getActivo(),
      creadoEn: item.getCreadoEn?.() ?? current.getCreadoEn(),
    })

    this.users.set(id, updated)
    return updated
  }

  readonly delete = async (id: string): Promise<boolean> => {
    return this.users.delete(id)
  }

  readonly findByUsername = async (username: string): Promise<User | null> => {
    for (const user of this.users.values()) {
      if (user.getUsername() === username) {
        return user
      }
    }

    return null
  }

  readonly findByRole = async (role: ERole): Promise<User[]> => {
    return [...this.users.values()].filter((user) => user.getRole() === role)
  }
}
