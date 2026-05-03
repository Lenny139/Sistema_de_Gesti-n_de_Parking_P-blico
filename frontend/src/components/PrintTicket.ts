import { TicketData } from '../modules/operator/ParkingFacade.js'

export default class PrintTicket {
  static print(ticket: TicketData, monto?: number): void {
    const montoStr =
      monto !== undefined
        ? new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
          }).format(monto)
        : 'Por pagar'

    const duracion = ticket.horaSalida
      ? this.calcDuracion(ticket.horaEntrada, ticket.horaSalida)
      : 'En curso'

    let printArea = document.getElementById('print-area')
    if (!printArea) {
      printArea = document.createElement('div')
      printArea.id = 'print-area'
      document.body.appendChild(printArea)
    }

    printArea.innerHTML = `
      <div style="font-family:'Courier New',monospace; width:80mm; padding:8px; font-size:12px;">
        <div style="text-align:center; margin-bottom:8px;">
          <div style="font-size:20px; font-weight:bold; letter-spacing:2px;">PARKING</div>
          <div style="font-size:9px; color:#666;">Sistema de Gestión de Parking Público</div>
          <div style="border-top:1px dashed #999; margin:6px 0;"></div>
        </div>

        <div style="margin-bottom:4px;">
          <span style="font-size:9px; color:#666;">TICKET ID</span><br/>
          <span style="font-size:10px; font-weight:bold;">${ticket.id.slice(0, 12).toUpperCase()}</span>
        </div>

        <div style="text-align:center; margin:8px 0; background:#f0f0f0; padding:6px; border-radius:4px;">
          <div style="font-size:9px; color:#666;">MATRÍCULA</div>
          <div style="font-size:22px; font-weight:bold; letter-spacing:4px;">${ticket.matricula}</div>
        </div>

        <div style="border-top:1px dashed #999; margin:6px 0;"></div>

        <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
          <span style="font-size:10px; color:#666;">Entrada:</span>
          <span style="font-size:10px; font-weight:bold;">${new Date(ticket.horaEntrada).toLocaleString('es-CO')}</span>
        </div>

        ${
          ticket.horaSalida
            ? `
        <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
          <span style="font-size:10px; color:#666;">Salida:</span>
          <span style="font-size:10px; font-weight:bold;">${new Date(ticket.horaSalida).toLocaleString('es-CO')}</span>
        </div>
        `
            : ''
        }

        <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
          <span style="font-size:10px; color:#666;">Duración:</span>
          <span style="font-size:10px; font-weight:bold;">${duracion}</span>
        </div>

        <div style="border-top:1px dashed #999; margin:6px 0;"></div>

        <div style="text-align:center; margin:6px 0;">
          <div style="font-size:9px; color:#666;">TOTAL A PAGAR</div>
          <div style="font-size:20px; font-weight:bold;">${montoStr}</div>
        </div>

        ${
          ticket.ticketPerdido
            ? `
        <div style="text-align:center; background:#fee; padding:4px; border-radius:4px; margin:4px 0;">
          <span style="font-size:10px; color:#c00; font-weight:bold;">TICKET PERDIDO - PENALIDAD APLICADA</span>
        </div>
        `
            : ''
        }

        <div style="border-top:1px dashed #999; margin:6px 0;"></div>
        <div style="text-align:center; font-size:9px; color:#666;">
          Gracias por usar nuestro servicio<br/>
          ${new Date().toLocaleString('es-CO')}
        </div>
      </div>
    `

    window.print()
  }

  private static calcDuracion(entrada: string, salida: string): string {
    const diffMs = new Date(salida).getTime() - new Date(entrada).getTime()
    const totalMin = Math.floor(diffMs / 60000)
    const h = Math.floor(totalMin / 60)
    const m = totalMin % 60
    return `${h}h ${m}min`
  }
}
