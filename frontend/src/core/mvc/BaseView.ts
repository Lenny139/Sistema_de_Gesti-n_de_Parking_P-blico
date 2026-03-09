export default abstract class BaseView {
  protected container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
  }

  abstract render(): void

  show(): void {
    this.container.classList.remove('d-none')
  }

  hide(): void {
    this.container.classList.add('d-none')
  }

  protected createElement(
    tag: string,
    classes?: string,
    text?: string,
  ): HTMLElement {
    const element = document.createElement(tag)

    if (classes) {
      element.className = classes
    }

    if (text !== undefined) {
      element.textContent = text
    }

    return element
  }
}
