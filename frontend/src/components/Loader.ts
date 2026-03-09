export default class Loader {
  show(container: HTMLElement): void {
    container.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-warning" role="status"></div></div>'
  }

  hide(container: HTMLElement): void {
    container.innerHTML = ''
  }
}
