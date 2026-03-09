import OperatorController from './OperatorController.js'
import OperatorModel from './OperatorModel.js'
import OperatorView from './OperatorView.js'

export default class OperatorModule {
  mount(container: HTMLElement): void {
    const model = new OperatorModel()
    const view = new OperatorView(container)
    const controller = new OperatorController(model, view)

    controller.init()
  }
}
