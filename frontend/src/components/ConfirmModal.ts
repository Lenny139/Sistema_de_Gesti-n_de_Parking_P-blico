export interface ConfirmModalOptions {
  title: string
  body: string
  confirmLabel?: string
  cancelLabel?: string
  confirmClass?: string
}

export default class ConfirmModal {
  private static modalEl: HTMLElement | null = null
  private static bsModal: { show: () => void; hide: () => void } | null = null

  static async show(options: ConfirmModalOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.ensureModal()

      const modal = document.getElementById('confirm-modal')
      if (!modal) {
        resolve(false)
        return
      }

      const titleEl = modal.querySelector('#confirm-modal-title') as HTMLElement | null
      const bodyEl = modal.querySelector('#confirm-modal-body') as HTMLElement | null
      const btnOk = modal.querySelector('#confirm-modal-ok') as HTMLButtonElement | null
      const btnCancel = modal.querySelector('#confirm-modal-cancel') as HTMLButtonElement | null

      if (titleEl) {
        titleEl.textContent = options.title
      }
      if (bodyEl) {
        bodyEl.innerHTML = options.body
      }
      if (btnOk) {
        btnOk.textContent = options.confirmLabel ?? 'Confirmar'
        btnOk.className = `btn ${options.confirmClass ?? 'btn-warning'} fw-bold`
      }
      if (btnCancel) {
        btnCancel.textContent = options.cancelLabel ?? 'Cancelar'
      }

      const cleanup = (result: boolean): void => {
        btnOk?.removeEventListener('click', onOk)
        btnCancel?.removeEventListener('click', onCancel)
        modal.removeEventListener('hidden.bs.modal', onHidden)
        this.bsModal?.hide()
        resolve(result)
      }

      const onOk = (): void => cleanup(true)
      const onCancel = (): void => cleanup(false)
      const onHidden = (): void => cleanup(false)

      btnOk?.addEventListener('click', onOk, { once: true })
      btnCancel?.addEventListener('click', onCancel, { once: true })
      modal.addEventListener('hidden.bs.modal', onHidden, { once: true })

      this.bsModal?.show()
    })
  }

  private static ensureModal(): void {
    if (document.getElementById('confirm-modal')) {
      return
    }

    const html = `
      <div class="modal fade" id="confirm-modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content surface">
            <div class="modal-header">
              <h5 class="modal-title title-oswald" id="confirm-modal-title">Confirmar</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" id="confirm-modal-body"></div>
            <div class="modal-footer">
              <button id="confirm-modal-cancel" class="btn btn-outline-secondary">Cancelar</button>
              <button id="confirm-modal-ok" class="btn btn-warning fw-bold">Confirmar</button>
            </div>
          </div>
        </div>
      </div>
    `

    document.body.insertAdjacentHTML('beforeend', html)

    const el = document.getElementById('confirm-modal')
    if (el && window.bootstrap?.Modal) {
      this.modalEl = el
      this.bsModal = new window.bootstrap.Modal(el)
    }
  }
}

declare global {
  interface Window {
    bootstrap?: {
      Modal?: new (el: HTMLElement) => { show: () => void; hide: () => void }
      Toast?: new (el: HTMLElement, opts?: { delay?: number }) => { show: () => void }
    }
  }
}
