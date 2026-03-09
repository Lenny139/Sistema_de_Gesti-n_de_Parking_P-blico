import ApiRouter from '../../../../api/domain/model/ApiRouter.js'
import JwtMiddleware from '../../../../api/middleware/JwtMiddleware.js'
import requireRole from '../../../../api/middleware/RbacMiddleware.js'
import ERole from '../../../../auth/domain/model/ERole.js'
import TicketController from './TicketController.js'

export default class TicketRouter extends ApiRouter {
  constructor(private readonly controller: TicketController) {
    super()
    this.routes()
  }

  override routes(): void {
    /**
     * @swagger
     * /api/1.0/parking/entrada:
     *   post:
     *     tags: [Parking]
     *     summary: Registrar entrada de vehículo
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [matricula]
     *             properties:
     *               matricula:
     *                 type: string
     *     responses:
     *       201:
     *         description: Ticket creado
     */
    this.router.post('/api/1.0/parking/entrada', JwtMiddleware, this.controller.registrarEntrada)
    /**
     * @swagger
     * /api/1.0/parking/salida:
     *   post:
     *     tags: [Parking]
     *     summary: Registrar salida de vehículo
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [matricula]
     *             properties:
     *               matricula:
     *                 type: string
     *               ticketPerdido:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Ticket actualizado y monto calculado
     */
    this.router.post('/api/1.0/parking/salida', JwtMiddleware, this.controller.registrarSalida)
    /**
     * @swagger
     * /api/1.0/parking/buscar/{matricula}:
     *   get:
     *     tags: [Parking]
     *     summary: Buscar ticket activo por matrícula
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: matricula
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Ticket activo encontrado
     *       404:
     *         description: No hay ticket activo para esa matrícula
     */
    this.router.get('/api/1.0/parking/buscar/:matricula', JwtMiddleware, this.controller.buscarVehiculo)
    /**
     * @swagger
     * /api/1.0/parking/ocupacion:
     *   get:
     *     tags: [Parking]
     *     summary: Obtener ocupación actual
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Ocupación del parking
     */
    this.router.get('/api/1.0/parking/ocupacion', JwtMiddleware, this.controller.getOcupacion)
    /**
     * @swagger
     * /api/1.0/parking/activos:
     *   get:
     *     tags: [Parking]
     *     summary: Obtener tickets activos
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de tickets activos
     */
    this.router.get('/api/1.0/parking/activos', JwtMiddleware, this.controller.getTicketsActivos)
    /**
     * @swagger
     * /api/1.0/parking/historial:
     *   get:
     *     tags: [Parking]
     *     summary: Obtener historial de movimientos (solo administrador)
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: fechaInicio
     *         required: false
     *         schema:
     *           type: string
     *           format: date-time
     *       - in: query
     *         name: fechaFin
     *         required: false
     *         schema:
     *           type: string
     *           format: date-time
     *       - in: query
     *         name: operadorId
     *         required: false
     *         schema:
     *           type: string
     *       - in: query
     *         name: matricula
     *         required: false
     *         schema:
     *           type: string
     *       - in: query
     *         name: tipo
     *         required: false
     *         schema:
     *           type: string
     *           enum: [ENTRADA, SALIDA, TICKET_PERDIDO]
     *     responses:
     *       200:
     *         description: Historial de movimientos
     *       403:
     *         description: Acceso denegado por rol insuficiente
     */
    this.router.get(
      '/api/1.0/parking/historial',
      JwtMiddleware,
      requireRole(ERole.ADMINISTRADOR),
      this.controller.getHistorial,
    )
    /**
     * @swagger
     * /api/1.0/parking/ticket/{id}:
     *   get:
     *     tags: [Parking]
     *     summary: Obtener ticket por id
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Ticket encontrado
     *       404:
     *         description: Ticket no encontrado
     */
    this.router.get('/api/1.0/parking/ticket/:id', JwtMiddleware, this.controller.getTicketById)
  }
}
