# Sistema de Gestión de Parking Público

**Autor:** Diego Alejandro Moreno

## Descripción
Backend y frontend para administrar un parking público con control de accesos, cobro por tarifas, reportes y seguridad por roles.

El backend está construido con TypeScript + Express bajo Arquitectura Hexagonal.
El frontend está construido con TypeScript puro (MVC), Bootstrap 5 e i18n.

## Instalación
```bash
npm install
```

## Ejecutar en desarrollo
```bash
npm run dev
```

## Compilar
```bash
npm run build
```

## Ejecutar pruebas
```bash
npm test
```

## URLs importantes
- Swagger: http://localhost:3000/api-docs

## Credenciales de prueba
- Admin: `admin / admin123`
- Operador 1: `operador1 / op123`
- Operador 2: `operador2 / op456`

## Arquitectura

### Arquitectura Hexagonal (resumen)
El proyecto separa responsabilidades en capas para desacoplar dominio y tecnología:

- **domain/**: entidades, reglas de negocio y puertos.
- **application/**: servicios y casos de uso.
- **infrastructure/**: controladores HTTP, routers, repositorios in-memory, factories.
- **api/** y **error/**: servidor, middlewares transversales y manejo de rutas.

Módulos principales:
- **auth**: autenticación JWT y RBAC.
- **parking**: entradas/salidas, tickets, ocupación e historial.
- **tarifa**: cálculo de cobro con reglas de tarifa.
- **reporte**: reportes administrativos y estadísticas.

### Patrón Strategy para tarifas
El cálculo de monto se resuelve con estrategias intercambiables en `TarifaContext`.

```text
TarifaContext
  |
  +--> TarifaPorHoraStrategy
  +--> TarifaDiaCompletoStrategy
  +--> TarifaNocturnaStrategy
  +--> TarifaTicketPerdidoStrategy
```

Flujo:
1. Se evalúa duración y horario.
2. `TarifaContext` selecciona la estrategia adecuada.
3. La estrategia calcula el monto final.

Ventaja: cambiar reglas de cobro no afecta controladores ni casos de uso.

### Patrón Facade en frontend
El frontend usa `ParkingFacade` para simplificar llamadas API y lógica de orquestación.

- La UI (Controllers/Views) no conoce detalles HTTP.
- El Facade centraliza endpoints, normalización y eventos (`ocupacionActualizada`).
- Reduce acoplamiento entre módulos de vista y capa de datos.

## Endpoints API

| Método | Endpoint | Auth | Rol | Descripción |
|---|---|---|---|---|
| POST | `/api/1.0/auth/login` | No | Público | Iniciar sesión |
| POST | `/api/1.0/auth/register` | Sí | ADMINISTRADOR | Registrar usuario |
| GET | `/api/1.0/auth/me` | Sí | Cualquiera | Perfil autenticado |
| GET | `/api/1.0/tarifas` | Sí | Cualquiera | Listar tarifas |
| GET | `/api/1.0/tarifas/activa` | Sí | Cualquiera | Obtener tarifa activa |
| POST | `/api/1.0/tarifas` | Sí | ADMINISTRADOR | Crear tarifa |
| PUT | `/api/1.0/tarifas/:id` | Sí | ADMINISTRADOR | Actualizar tarifa |
| DELETE | `/api/1.0/tarifas/:id` | Sí | ADMINISTRADOR | Eliminar tarifa |
| POST | `/api/1.0/tarifas/calcular` | Sí | Cualquiera | Calcular monto según reglas |
| POST | `/api/1.0/parking/entrada` | Sí | Cualquiera | Registrar entrada de vehículo |
| POST | `/api/1.0/parking/salida` | Sí | Cualquiera | Registrar salida y cobro |
| GET | `/api/1.0/parking/buscar/:matricula` | Sí | Cualquiera | Buscar ticket activo por matrícula |
| GET | `/api/1.0/parking/ocupacion` | Sí | Cualquiera | Obtener ocupación actual |
| GET | `/api/1.0/parking/activos` | Sí | Cualquiera | Listar tickets activos |
| GET | `/api/1.0/parking/historial` | Sí | ADMINISTRADOR | Consultar historial de movimientos |
| GET | `/api/1.0/parking/ticket/:id` | Sí | Cualquiera | Obtener ticket por ID |
| GET | `/api/1.0/reportes/ingresos` | Sí | ADMINISTRADOR | Reporte de ingresos por período |
| GET | `/api/1.0/reportes/operadores` | Sí | ADMINISTRADOR | Resumen por operador |
| GET | `/api/1.0/reportes/estadisticas` | Sí | ADMINISTRADOR | KPIs generales |

## Notas
- Variables de entorno definidas en `env/env.json`.
- Las suites de pruebas incluyen unitarias e integración con Supertest.
