import ApiClient from '../../core/api/ApiClient.js';
import ApiEndpoints from '../../core/api/ApiEndpoints.js';
export default class ParkingFacade {
    constructor() {
        this.apiClient = new ApiClient();
        this.ocupacion = null;
    }
    static getInstance() {
        if (!ParkingFacade.instance) {
            ParkingFacade.instance = new ParkingFacade();
        }
        return ParkingFacade.instance;
    }
    async registrarEntrada(matricula) {
        const placa = this.normalizarMatricula(matricula);
        const ticket = await this.apiClient.post(ApiEndpoints.parking.entrada, {
            matricula: placa,
        });
        await this.actualizarOcupacionInterna();
        return {
            ticket,
            mensaje: 'Entrada registrada',
        };
    }
    async registrarSalida(matricula, perdido = false) {
        const placa = this.normalizarMatricula(matricula);
        const response = await this.apiClient.post(ApiEndpoints.parking.salida, {
            matricula: placa,
            ticketPerdido: perdido,
        });
        await this.actualizarOcupacionInterna();
        return {
            ticket: response.ticket,
            monto: response.monto,
            montoFormateado: new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0,
            }).format(response.monto),
            mensaje: response.mensaje,
        };
    }
    async buscarVehiculo(matricula) {
        const placa = this.normalizarMatricula(matricula);
        try {
            const ticket = await this.apiClient.get(`${ApiEndpoints.parking.buscar}/${encodeURIComponent(placa)}`);
            const diffMinutes = Math.max(0, Math.floor((Date.now() - new Date(ticket.horaEntrada).getTime()) / 60000));
            const tiempoTranscurrido = this.formatMinutes(diffMinutes);
            const tarifa = await this.apiClient.get(ApiEndpoints.tarifas.activa);
            const horas = Math.max(1, Math.ceil(diffMinutes / 60));
            const costoEstimado = horas * (tarifa.precioPorHora ?? 0);
            return {
                ticket,
                tiempoTranscurrido,
                costoEstimado,
            };
        }
        catch (error) {
            if (error instanceof Error && error.message.toLowerCase().includes('404')) {
                return null;
            }
            if (error instanceof Error && error.message.toLowerCase().includes('no hay ticket activo')) {
                return null;
            }
            throw error;
        }
    }
    async getOcupacion() {
        if (this.ocupacion) {
            return this.ocupacion;
        }
        const data = await this.apiClient.get(ApiEndpoints.parking.ocupacion);
        this.ocupacion = data;
        return data;
    }
    async getUltimosMovimientos(limit = 10) {
        const activos = await this.apiClient.get(ApiEndpoints.parking.activos);
        return activos
            .slice()
            .sort((a, b) => new Date(b.horaEntrada).getTime() - new Date(a.horaEntrada).getTime())
            .slice(0, limit)
            .map((ticket) => ({
            hora: ticket.horaEntrada,
            matricula: ticket.matricula,
            tipo: 'ENTRADA',
            monto: ticket.monto,
        }));
    }
    async actualizarOcupacionInterna() {
        const data = await this.apiClient.get(ApiEndpoints.parking.ocupacion);
        this.ocupacion = data;
        window.dispatchEvent(new CustomEvent('ocupacionActualizada', {
            detail: data,
        }));
    }
    normalizarMatricula(value) {
        return value.trim().replace(/\s+/g, '').toUpperCase();
    }
    formatMinutes(total) {
        const h = Math.floor(total / 60);
        const m = total % 60;
        return `${h}h ${m}m`;
    }
}
