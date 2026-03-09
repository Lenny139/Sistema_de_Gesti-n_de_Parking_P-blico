import request from 'supertest'
import { type Application } from 'express'
import { createIntegrationApp } from './testApp.js'

describe('AUTH Integration Tests', () => {
  let app: Application
  let token: string

  beforeAll(async () => {
    app = createIntegrationApp()

    const login = await request(app).post('/api/1.0/auth/login').send({
      username: 'admin',
      password: 'admin123',
    })

    token = login.body.token as string
  })

  afterAll(async () => {
    token = ''
  })

  it('POST /api/1.0/auth/login con credenciales válidas → 200 + token', async () => {
    const response = await request(app).post('/api/1.0/auth/login').send({
      username: 'operador1',
      password: 'op123',
    })

    expect(response.status).toBe(200)
    expect(response.body.token).toEqual(expect.any(String))
    expect(response.body.user).toMatchObject({ username: 'operador1' })
  })

  it('POST /api/1.0/auth/login con password incorrecta → 401', async () => {
    const response = await request(app).post('/api/1.0/auth/login').send({
      username: 'admin',
      password: 'incorrecta',
    })

    expect(response.status).toBe(401)
  })

  it('POST /api/1.0/auth/login sin username → 400', async () => {
    const response = await request(app).post('/api/1.0/auth/login').send({
      password: 'admin123',
    })

    expect(response.status).toBe(400)
  })

  it('GET /api/1.0/auth/me con token válido → 200 + user', async () => {
    const response = await request(app)
      .get('/api/1.0/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({ username: 'admin', role: 'ADMINISTRADOR' })
  })

  it('GET /api/1.0/auth/me sin token → 401', async () => {
    const response = await request(app).get('/api/1.0/auth/me')

    expect(response.status).toBe(401)
  })

  it('GET /api/1.0/auth/me con token inválido → 401', async () => {
    const response = await request(app)
      .get('/api/1.0/auth/me')
      .set('Authorization', 'Bearer token-invalido')

    expect(response.status).toBe(401)
  })
})
