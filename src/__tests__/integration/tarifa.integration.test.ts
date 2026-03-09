import request from 'supertest'
import { type Application } from 'express'
import { createIntegrationApp } from './testApp.js'

describe('TARIFA Integration Tests', () => {
  let app: Application
  let adminToken: string
  let operadorToken: string
  let createdTarifaId: string

  beforeAll(async () => {
    app = createIntegrationApp()

    const adminLogin = await request(app).post('/api/1.0/auth/login').send({
      username: 'admin',
      password: 'admin123',
    })

    const operadorLogin = await request(app).post('/api/1.0/auth/login').send({
      username: 'operador1',
      password: 'op123',
    })

    adminToken = adminLogin.body.token as string
    operadorToken = operadorLogin.body.token as string
    createdTarifaId = ''
  })

  afterAll(async () => {
    adminToken = ''
    operadorToken = ''
    createdTarifaId = ''
  })

  it('GET /api/1.0/tarifas/activa → 200 + tarifa activa', async () => {
    const response = await request(app)
      .get('/api/1.0/tarifas/activa')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      activa: true,
      precioPorHora: expect.any(Number),
      precioDiaCompleto: expect.any(Number),
    })
  })

  it('POST /api/1.0/tarifas con token admin → 201 + nueva tarifa', async () => {
    const response = await request(app)
      .post('/api/1.0/tarifas')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Tarifa Promo Integración',
        tipo: 'POR_HORA',
        precioPorHora: 3200,
        precioDiaCompleto: 26000,
        tarifaNocturna: 5200,
        tarifaTicketPerdido: 17000,
        horaInicioNocturna: 21,
        horaFinNocturna: 6,
        activa: false,
      })

    expect(response.status).toBe(201)
    expect(response.body.id).toEqual(expect.any(String))
    createdTarifaId = response.body.id as string
  })

  it('POST /api/1.0/tarifas con token operador → 403', async () => {
    const response = await request(app)
      .post('/api/1.0/tarifas')
      .set('Authorization', `Bearer ${operadorToken}`)
      .send({
        nombre: 'Tarifa No Permitida',
        tipo: 'POR_HORA',
        precioPorHora: 3000,
        precioDiaCompleto: 25000,
        tarifaNocturna: 5000,
        tarifaTicketPerdido: 15000,
        horaInicioNocturna: 20,
        horaFinNocturna: 6,
        activa: false,
      })

    expect(response.status).toBe(403)
  })

  it('PUT /api/1.0/tarifas/:id con admin → 200 + tarifa actualizada', async () => {
    expect(createdTarifaId).toBeTruthy()

    const response = await request(app)
      .put(`/api/1.0/tarifas/${createdTarifaId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        precioPorHora: 4000,
        precioDiaCompleto: 28000,
      })

    expect(response.status).toBe(200)
    expect(response.body.precioPorHora).toBe(4000)
    expect(response.body.precioDiaCompleto).toBe(28000)
  })

  it('POST /api/1.0/tarifas/calcular → 200 + monto calculado', async () => {
    const entrada = new Date()
    const salida = new Date(entrada.getTime() + 2 * 60 * 60 * 1000)

    const response = await request(app)
      .post('/api/1.0/tarifas/calcular')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        entrada: entrada.toISOString(),
        salida: salida.toISOString(),
        ticketPerdido: false,
      })

    expect(response.status).toBe(200)
    expect(response.body.total).toEqual(expect.any(Number))
    expect(response.body.total).toBeGreaterThan(0)
  })
})
