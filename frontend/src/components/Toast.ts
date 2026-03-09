type ToastLevel = 'success' | 'danger' | 'warning'

type BootstrapToastInstance = {
  show: () => void
}

type BootstrapToastCtor = new (
  element: HTMLElement,
  options?: { delay?: number },
) => BootstrapToastInstance

declare global {
  interface Window {
    bootstrap?: {
      Toast?: BootstrapToastCtor
    }
  }
}

export default class Toast {
  static success(message: string): void {
    this.show(message, 'success')
  }

  static error(message: string): void {
    this.show(message, 'danger')
  }

  static warning(message: string): void {
    this.show(message, 'warning')
  }

  private static show(message: string, type: ToastLevel): void {
    const container = document.getElementById('toast-container')
    if (!container) {
      return
    }

    const toast = document.createElement('div')
    toast.className = `toast align-items-center text-bg-${type} border-0 mb-2`
    toast.setAttribute('role', 'alert')
    toast.setAttribute('aria-live', 'assertive')
    toast.setAttribute('aria-atomic', 'true')

    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `

    container.appendChild(toast)

    const ToastCtor = window.bootstrap?.Toast
    if (ToastCtor) {
      const instance = new ToastCtor(toast, { delay: 3000 })
      instance.show()
      toast.addEventListener('hidden.bs.toast', () => toast.remove(), {
        once: true,
      })
      return
    }

    setTimeout(() => toast.remove(), 3000)
  }
}
