import JwtMiddleware from '../../../../api/middleware/JwtMiddleware.js'
import requireRole from '../../../../api/middleware/RbacMiddleware.js'
import ApiRouter from '../../../../api/domain/model/ApiRouter.js'
import ERole from '../../../domain/model/ERole.js'
import AuthController from './AuthController.js'

export default class AuthRouter extends ApiRouter {
  constructor(private readonly controller: AuthController) {
    super()
    this.routes()
  }

  override routes(): void {
    /**
     * @swagger
     * /api/1.0/auth/login:
     *   post:
     *     tags: [Auth]
     *     summary: Iniciar sesión
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [username, password]
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Token y datos del usuario
     */
    this.router.post('/api/1.0/auth/login', this.controller.login)
    /**
     * @swagger
     * /api/1.0/auth/register:
     *   post:
     *     tags: [Auth]
     *     summary: Registrar usuario (solo administrador)
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [username, password, nombre, role, puntoAcceso]
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *               nombre:
     *                 type: string
     *               role:
     *                 type: string
     *                 enum: [OPERADOR, ADMINISTRADOR]
     *               puntoAcceso:
     *                 type: string
     *     responses:
     *       201:
     *         description: Usuario registrado correctamente
     *       400:
     *         description: Datos inválidos
     *       401:
     *         description: Token no proporcionado o inválido
     *       403:
     *         description: Acceso denegado por rol insuficiente
     */
    this.router.post(
      '/api/1.0/auth/register',
      JwtMiddleware,
      requireRole(ERole.ADMINISTRADOR),
      this.controller.register,
    )
    /**
     * @swagger
     * /api/1.0/auth/me:
     *   get:
     *     tags: [Auth]
     *     summary: Perfil del usuario autenticado
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Datos del usuario autenticado
     */
    this.router.get('/api/1.0/auth/me', JwtMiddleware, this.controller.getProfile)
  }
}
