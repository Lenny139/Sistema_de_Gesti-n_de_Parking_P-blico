import ApiRouter from '../../../../api/domain/model/ApiRouter.js'
import JwtMiddleware from '../../../../api/middleware/JwtMiddleware.js'
import requireRole from '../../../../api/middleware/RbacMiddleware.js'
import ERole from '../../../../auth/domain/model/ERole.js'
import TarifaController from './TarifaController.js'

export default class TarifaRouter extends ApiRouter {
  constructor(private readonly controller: TarifaController) {
    super()
    this.routes()
  }

  override routes(): void {
    this.router.get('/api/1.0/tarifas', JwtMiddleware, this.controller.getAll)
    /**
     * @swagger
     * /api/1.0/tarifas/activa:
     *   get:
     *     tags: [Tarifas]
     *     summary: Obtener tarifa activa
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Tarifa activa
     */
    this.router.get(
      '/api/1.0/tarifas/activa',
      JwtMiddleware,
      this.controller.getActiva,
    )
    /**
     * @swagger
     * /api/1.0/tarifas:
     *   post:
     *     tags: [Tarifas]
     *     summary: Crear tarifa (solo administrador)
     *     security:
     *       - bearerAuth: []
      *     requestBody:
      *       required: true
      *       content:
      *         application/json:
      *           schema:
      *             type: object
      *             required:
      *               - nombre
      *               - tipo
      *               - precioPorHora
      *               - precioDiaCompleto
      *               - tarifaNocturna
      *               - tarifaTicketPerdido
      *               - horaInicioNocturna
      *               - horaFinNocturna
      *               - activa
      *             properties:
      *               nombre:
      *                 type: string
      *               tipo:
      *                 type: string
      *                 enum: [POR_HORA]
      *               precioPorHora:
      *                 type: number
      *               precioDiaCompleto:
      *                 type: number
      *               tarifaNocturna:
      *                 type: number
      *               tarifaTicketPerdido:
      *                 type: number
      *               horaInicioNocturna:
      *                 type: integer
      *               horaFinNocturna:
      *                 type: integer
      *               activa:
      *                 type: boolean
     *     responses:
     *       201:
     *         description: Tarifa creada
     */
    this.router.post(
      '/api/1.0/tarifas',
      JwtMiddleware,
      requireRole(ERole.ADMINISTRADOR),
      this.controller.create,
    )
    this.router.put(
      '/api/1.0/tarifas/:id',
      JwtMiddleware,
      requireRole(ERole.ADMINISTRADOR),
      this.controller.update,
    )
    this.router.delete(
      '/api/1.0/tarifas/:id',
      JwtMiddleware,
      requireRole(ERole.ADMINISTRADOR),
      this.controller.delete,
    )
    this.router.post(
      '/api/1.0/tarifas/calcular',
      JwtMiddleware,
      this.controller.calcularCosto,
    )

    /**
     * @swagger
     * /api/1.0/tarifas/{id}:
     *   put:
     *     tags: [Tarifas]
     *     summary: Actualizar tarifa (solo administrador)
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               nombre:
     *                 type: string
     *               tipo:
     *                 type: string
     *                 enum: [POR_HORA]
     *               precioPorHora:
     *                 type: number
     *               precioDiaCompleto:
     *                 type: number
     *               tarifaNocturna:
     *                 type: number
     *               tarifaTicketPerdido:
     *                 type: number
     *               horaInicioNocturna:
     *                 type: integer
     *               horaFinNocturna:
     *                 type: integer
     *               activa:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Tarifa actualizada
     *       404:
     *         description: Tarifa no encontrada
     */

    /**
     * @swagger
     * /api/1.0/tarifas/calcular:
     *   post:
     *     tags: [Tarifas]
     *     summary: Calcular costo para una ventana de tiempo
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [entrada, salida]
     *             properties:
     *               entrada:
     *                 type: string
     *                 format: date-time
     *               salida:
     *                 type: string
     *                 format: date-time
     *               ticketPerdido:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Costo calculado
     *       400:
     *         description: Parámetros inválidos
     */
  }
}
