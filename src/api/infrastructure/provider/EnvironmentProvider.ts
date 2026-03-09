import envJson from '../../../../env/env.json'
import EVariable from '../../domain/config/EVariable.js'
import EnvironmentProviderInterface from '../../domain/config/EnvironmentProviderInterface.js'

export default class EnvironmentProvider implements EnvironmentProviderInterface {
  private static instance: EnvironmentProvider
  private readonly env: EVariable

  private constructor() {
    const rawEnv = envJson as EVariable

    if (!rawEnv) {
      this.env = {
        PORT: 3000,
        HOST: 'localhost',
        JWT_SECRET: 'parking_secret_2026',
        JWT_EXPIRES_IN: '8h',
        TOTAL_SPACES: 100,
      }
      return
    }

    this.env = rawEnv
  }

  getPort(): number {
    return this.env.PORT
  }

  getHost(): string {
    return this.env.HOST
  }

  getJwtSecret(): string {
    return this.env.JWT_SECRET
  }

  getJwtExpiresIn(): string {
    return this.env.JWT_EXPIRES_IN
  }

  getTotalSpaces(): number {
    return this.env.TOTAL_SPACES
  }

  static getInstance(): EnvironmentProvider {
    if (!EnvironmentProvider.instance) {
      EnvironmentProvider.instance = new EnvironmentProvider()
    }

    return EnvironmentProvider.instance
  }
}
