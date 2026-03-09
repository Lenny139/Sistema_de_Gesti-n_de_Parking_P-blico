export default class Loader {
    show(container) {
        container.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-warning" role="status"></div></div>';
    }
    hide(container) {
        container.innerHTML = '';
    }
}
