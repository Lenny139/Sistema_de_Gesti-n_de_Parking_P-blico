import HTTPStatusCode from '../status/HTTPStatusCode.js'

export default abstract class ApiController {
  protected readonly STATUS = HTTPStatusCode
}
