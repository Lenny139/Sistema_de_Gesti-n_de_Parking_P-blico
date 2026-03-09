const ApiEndpoints = {
  baseUrl: 'http://localhost:3000',
  auth: {
    login: '/api/1.0/auth/login',
    me: '/api/1.0/auth/me',
  },
  parking: {
    entrada: '/api/1.0/parking/entrada',
    salida: '/api/1.0/parking/salida',
    ocupacion: '/api/1.0/parking/ocupacion',
    buscar: '/api/1.0/parking/buscar',
    activos: '/api/1.0/parking/activos',
    historial: '/api/1.0/parking/historial',
  },
  tarifas: {
    list: '/api/1.0/tarifas',
    activa: '/api/1.0/tarifas/activa',
    byId: '/api/1.0/tarifas',
  },
  reportes: {
    ingresos: '/api/1.0/reportes/ingresos',
    estadisticas: '/api/1.0/reportes/estadisticas',
    operadores: '/api/1.0/reportes/operadores',
  },
} as const

export default ApiEndpoints
