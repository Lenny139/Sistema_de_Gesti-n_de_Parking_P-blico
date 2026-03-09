import ApiRouter from '../../../../api/domain/model/ApiRouter.js'
import JwtMiddleware from '../../../../api/middleware/JwtMiddleware.js'
import requireRole from '../../../../api/middleware/RbacMiddleware.js'
import ERole from '../../../../auth/domain/model/ERole.js'
import ReporteController from './ReporteController.js'

export default class ReporteRouter extends ApiRouter {
  constructor(private readonly controller: ReporteController) {
    super()
    this.routes()
  }

  override routes(): void {
    /**
     * @swagger
     * /api/1.0/reportes/ingresos:
     *   get:
     *     tags: [Reportes]
     *     summary: Reporte de ingresos por período
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: periodo
     *         required: true
     *         schema:
     *           type: string
     *           enum: [DIA, SEMANA, MES]
     *     responses:
     *       200:
     *         description: Reporte de ingresos
     */
    this.router.get(
      '/api/1.0/reportes/ingresos',
      JwtMiddleware,
      requireRole(ERole.ADMINISTRADOR),
      this.controller.getReporteIngresos,
    )

    this.router.get(
      '/api/1.0/reportes/operadores',
      JwtMiddleware,
      requireRole(ERole.ADMINISTRADOR),
      this.controller.getResumenOperadores,
    )

    /**
     * @swagger
     * /api/1.0/reportes/operadores:
     *   get:
     *     tags: [Reportes]
     *     summary: Resumen de operaciones por operador
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
     *     responses:
     *       200:
     *         description: Resumen de operadores
     *       400:
     *         description: Fechas inválidas
     *       403:
     *         description: Acceso denegado por rol insuficiente
     */
    this.router.get(
      '/api/1.0/reportes/estadisticas',
      JwtMiddleware,
      requireRole(ERole.ADMINISTRADOR),
      this.controller.getEstadisticasGenerales,
    )

    /**
     * @swagger
     * /api/1.0/reportes/estadisticas:
     *   get:
     *     tags: [Reportes]
     *     summary: Estadísticas generales del sistema
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Estadísticas generales
     *       403:
     *         description: Acceso denegado por rol insuficiente
     */
  }
}
