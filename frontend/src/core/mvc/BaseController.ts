import BaseModel from './BaseModel.js'
import BaseView from './BaseView.js'

export default abstract class BaseController<M extends BaseModel, V extends BaseView> {
  protected model: M
  protected view: V

  constructor(model: M, view: V) {
    this.model = model
    this.view = view
  }

  abstract init(): void
}
