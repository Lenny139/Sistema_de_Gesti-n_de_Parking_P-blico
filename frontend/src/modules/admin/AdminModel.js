import ApiClient from '../../core/api/ApiClient.js';
import ApiEndpoints from '../../core/api/ApiEndpoints.js';
import BaseModel from '../../core/mvc/BaseModel.js';
export default class AdminModel extends BaseModel {
    constructor() {
        super(...arguments);
        this.state = {
            tarifaActiva: null,
            reporteActual: null,
            estadisticas: null,
            operadores: [],
        };
        this.api = new ApiClient();
    }
    async loadEstadisticasGenerales() {
        const data = await this.api.get(ApiEndpoints.reportes.estadisticas);
        this.state.estadisticas = data;
        this.emit('estadisticasChanged', data);
        return data;
    }
    async loadReporteIngresos(periodo) {
        const periodoApi = periodo === 'HOY' ? 'DIA' : periodo === 'SEMANA' ? 'SEMANA' : 'MES';
        const path = `${ApiEndpoints.reportes.ingresos}?periodo=${periodoApi}`;
        const data = await this.api.get(path);
        this.state.reporteActual = data;
        this.emit('reporteChanged', data);
        return data;
    }
    async loadTarifas() {
        const data = await this.api.get(ApiEndpoints.tarifas.list);
        const activa = data.find((item) => item.activa) ?? null;
        this.state.tarifaActiva = activa;
        this.emit('tarifasChanged', data);
        return data;
    }
    async updateTarifa(id, data) {
        const path = `${ApiEndpoints.tarifas.byId}/${encodeURIComponent(id)}`;
        const updated = await this.api.put(path, data);
        this.state.tarifaActiva = updated.activa ? updated : this.state.tarifaActiva;
        this.emit('tarifaActivaChanged', this.state.tarifaActiva);
        return updated;
    }
    async createTarifa(data) {
        const created = await this.api.post(ApiEndpoints.tarifas.list, data);
        if (created.activa) {
            this.state.tarifaActiva = created;
            this.emit('tarifaActivaChanged', created);
        }
        return created;
    }
    async loadHistorial(filtros) {
        const params = new URLSearchParams();
        if (filtros.fechaInicio) {
            params.set('fechaInicio', filtros.fechaInicio);
        }
        if (filtros.fechaFin) {
            params.set('fechaFin', filtros.fechaFin);
        }
        if (filtros.tipo) {
            params.set('tipo', filtros.tipo);
        }
        const query = params.toString();
        const path = query
            ? `${ApiEndpoints.parking.historial}?${query}`
            : ApiEndpoints.parking.historial;
        const data = await this.api.get(path);
        this.emit('historialChanged', data);
        return data;
    }
}
