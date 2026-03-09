import { type NextFunction, type Request, type Response } from 'express'
import ERole from '../../auth/domain/model/ERole.js'

const requireRole =
  (...roles: ERole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const role = req.user?.role

    if (!role || !roles.includes(role)) {
      res.status(403).json({ message: 'Acceso denegado: rol insuficiente' })
      return
    }

    next()
  }

export default requireRole
