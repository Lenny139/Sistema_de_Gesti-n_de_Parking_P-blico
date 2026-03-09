import LoginController from './LoginController.js';
import LoginModel from './LoginModel.js';
import LoginView from './LoginView.js';
export default class LoginModule {
    mount(container) {
        const model = new LoginModel();
        const view = new LoginView(container);
        const controller = new LoginController(model, view);
        controller.init();
    }
}
