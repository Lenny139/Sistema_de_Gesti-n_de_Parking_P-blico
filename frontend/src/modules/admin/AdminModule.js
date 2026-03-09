import AdminController from './AdminController.js';
import AdminModel from './AdminModel.js';
import AdminView from './AdminView.js';
export default class AdminModule {
    mount(container) {
        const model = new AdminModel();
        const view = new AdminView(container);
        const controller = new AdminController(model, view);
        controller.init();
    }
}
