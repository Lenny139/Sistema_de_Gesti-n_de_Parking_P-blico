import request from 'supertest'
import { type Application } from 'express'
import { createIntegrationApp } from './testApp.js'

describe('PARKING Integration Tests', () => {
  let app: Application
  let operadorToken: string
  let adminToken: string

  beforeAll(async () => {
    app = createIntegrationApp()

    const operadorLogin = await request(app).post('/api/1.0/auth/login').send({
      username: 'operador1',
      password: 'op123',
    })

    const adminLogin = await request(app).post('/api/1.0/auth/login').send({
      username: 'admin',
      password: 'admin123',
    })

    operadorToken = operadorLogin.body.token as string
    adminToken = adminLogin.body.token as string
  })

  afterAll(async () => {
    operadorToken = ''
    adminToken = ''
  })

  it('POST /api/1.0/parking/entrada con token operador → 201 + ticket', async () => {
    const response = await request(app)
      .post('/api/1.0/parking/entrada')
      .set('Authorization', `Bearer ${operadorToken}`)
      .send({ matricula: 'INT111', puntoAcceso: 'Cabina Test' })

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({ matricula: 'INT111', estado: 'ACTIVO' })
  })

  it('POST /api/1.0/parking/entrada sin token → 401', async () => {
    const response = await request(app)
      .post('/api/1.0/parking/entrada')
      .send({ matricula: 'INT222' })

    expect(response.status).toBe(401)
  })

  it('POST /api/1.0/parking/entrada matrícula duplicada → 409', async () => {
    const first = await request(app)
      .post('/api/1.0/parking/entrada')
      .set('Authorization', `Bearer ${operadorToken}`)
      .send({ matricula: 'INT333', puntoAcceso: 'Cabina Test' })

    expect(first.status).toBe(201)

    const duplicate = await request(app)
      .post('/api/1.0/parking/entrada')
      .set('Authorization', `Bearer ${operadorToken}`)
      .send({ matricula: 'INT333', puntoAcceso: 'Cabina Test' })

    expect(duplicate.status).toBe(409)
  })

  it('POST /api/1.0/parking/salida después de entrada → 200 + monto positivo', async () => {
    const entrada = await request(app)
      .post('/api/1.0/parking/entrada')
      .set('Authorization', `Bearer ${operadorToken}`)
      .send({ matricula: 'INT444', puntoAcceso: 'Cabina Test' })

    expect(entrada.status).toBe(201)

    const salida = await request(app)
      .post('/api/1.0/parking/salida')
      .set('Authorization', `Bearer ${operadorToken}`)
      .send({ matricula: 'INT444', puntoAcceso: 'Cabina Test' })

    expect(salida.status).toBe(200)
    expect(salida.body.monto).toBeGreaterThan(0)
  })

  it('POST /api/1.0/parking/salida sin ticket activo → 404', async () => {
    const response = await request(app)
      .post('/api/1.0/parking/salida')
      .set('Authorization', `Bearer ${operadorToken}`)
      .send({ matricula: 'NOEXISTE999', puntoAcceso: 'Cabina Test' })

    expect(response.status).toBe(404)
  })

  it('GET /api/1.0/parking/ocupacion → 200 + OcupacionDTO válido', async () => {
    const response = await request(app)
      .get('/api/1.0/parking/ocupacion')
      .set('Authorization', `Bearer ${operadorToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        totalPlazas: expect.any(Number),
        plazasOcupadas: expect.any(Number),
        plazasLibres: expect.any(Number),
        porcentajeOcupacion: expect.any(Number),
        ticketsActivos: expect.any(Number),
      }),
    )
  })

  it('GET /api/1.0/parking/historial con token operador → 403', async () => {
    const response = await request(app)
      .get('/api/1.0/parking/historial')
      .set('Authorization', `Bearer ${operadorToken}`)

    expect(response.status).toBe(403)
  })

  it('GET /api/1.0/parking/historial con token admin → 200 + array', async () => {
    const response = await request(app)
      .get('/api/1.0/parking/historial')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })
})
