export default class BaseView {
    constructor(container) {
        this.container = container;
    }
    show() {
        this.container.classList.remove('d-none');
    }
    hide() {
        this.container.classList.add('d-none');
    }
    createElement(tag, classes, text) {
        const element = document.createElement(tag);
        if (classes) {
            element.className = classes;
        }
        if (text !== undefined) {
            element.textContent = text;
        }
        return element;
    }
}
