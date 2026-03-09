import bcrypt from 'bcryptjs'
import AuthService from '../../auth/application/service/AuthService.js'
import ERole from '../../auth/domain/model/ERole.js'
import User from '../../auth/domain/model/User.js'
import IUserRepositoryPort from '../../auth/domain/port/driven/repository/IUserRepositoryPort.js'

describe('AuthService', () => {
  let mockUserRepo: jest.Mocked<IUserRepositoryPort>
  let service: AuthService

  beforeEach(() => {
    mockUserRepo = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByUsername: jest.fn(),
      findByRole: jest.fn(),
    }

    service = new AuthService(mockUserRepo)
  })

  const createUser = async (password = 'Secret123*'): Promise<User> => {
    const passwordHash = await bcrypt.hash(password, 10)

    return new User({
      id: 'user-1',
      username: 'admin',
      passwordHash,
      role: ERole.ADMINISTRADOR,
      nombre: 'Admin User',
      puntoAcceso: 'Control Central',
      activo: true,
      creadoEn: new Date('2026-01-01T00:00:00.000Z'),
    })
  }

  it('login: debe retornar token válido con credenciales correctas', async () => {
    const user = await createUser('Password123')
    mockUserRepo.findByUsername.mockResolvedValue(user)

    const result = await service.login('admin', 'Password123')

    expect(result.token).toEqual(expect.any(String))
    expect(result.token.length).toBeGreaterThan(20)
    expect(result.user).toMatchObject({ username: 'admin', role: ERole.ADMINISTRADOR })
  })

  it('login: debe fallar con contraseña incorrecta', async () => {
    const user = await createUser('Password123')
    mockUserRepo.findByUsername.mockResolvedValue(user)

    await expect(service.login('admin', 'BadPassword')).rejects.toThrow(
      'Usuario o contraseña incorrectos',
    )
  })

  it('login: debe fallar si el usuario no existe', async () => {
    mockUserRepo.findByUsername.mockResolvedValue(null)

    await expect(service.login('admin', 'Password123')).rejects.toThrow(
      'Usuario o contraseña incorrectos',
    )
  })

  it('register: debe hashear la contraseña antes de guardar', async () => {
    mockUserRepo.findByUsername.mockResolvedValue(null)
    mockUserRepo.save.mockImplementation(async (user) => user)

    const saved = await service.register({
      username: 'operator1',
      password: 'MySecurePass',
      nombre: 'Operador 1',
      role: ERole.OPERADOR,
      puntoAcceso: 'Cabina Norte',
    })

    expect(saved.getPasswordHash()).not.toBe('MySecurePass')
    await expect(bcrypt.compare('MySecurePass', saved.getPasswordHash())).resolves.toBe(true)
  })

  it('validateToken: debe retornar payload si el token es válido', async () => {
    const user = await createUser('Password123')
    mockUserRepo.findByUsername.mockResolvedValue(user)

    const login = await service.login('admin', 'Password123')
    const payload = await service.validateToken(login.token)

    expect(payload).toMatchObject({
      userId: 'user-1',
      username: 'admin',
      role: ERole.ADMINISTRADOR,
    })
  })

  it('validateToken: debe lanzar error si el token es inválido', async () => {
    await expect(service.validateToken('token_invalido')).rejects.toThrow(
      'Token inválido o expirado',
    )
  })
})
