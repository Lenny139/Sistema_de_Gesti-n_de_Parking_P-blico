import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import EnvironmentProvider from '../infrastructure/provider/EnvironmentProvider.js'
import IAuthPayload from '../../auth/domain/model/IAuthPayload.js'
import ERole from '../../auth/domain/model/ERole.js'

declare global {
  namespace Express {
    interface Request {
      user?: IAuthPayload
    }
  }
}

const JwtMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.header('Authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token no proporcionado' })
    return
  }

  const token = authorization.slice(7).trim()
  if (!token) {
    res.status(401).json({ message: 'Token no proporcionado' })
    return
  }

  try {
    const env = EnvironmentProvider.getInstance()
    const decoded = jwt.verify(token, env.getJwtSecret())

    if (typeof decoded === 'string') {
      res.status(401).json({ message: 'Token inválido o expirado' })
      return
    }

    const userId = decoded['userId']
    const username = decoded['username']
    const role = decoded['role']

    if (
      typeof userId !== 'string' ||
      typeof username !== 'string' ||
      (role !== ERole.OPERADOR && role !== ERole.ADMINISTRADOR)
    ) {
      res.status(401).json({ message: 'Token inválido o expirado' })
      return
    }

    req.user = {
      userId,
      username,
      role,
    }

    next()
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

export default JwtMiddleware
