export default interface EnvironmentProviderInterface {
  getPort(): number
  getHost(): string
  getJwtSecret(): string
  getJwtExpiresIn(): string
  getTotalSpaces(): number
}
