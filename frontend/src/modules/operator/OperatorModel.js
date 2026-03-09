import BaseModel from '../../core/mvc/BaseModel.js';
import ParkingFacade from './ParkingFacade.js';
export default class OperatorModel extends BaseModel {
    constructor() {
        super(...arguments);
        this.state = {
            ocupacion: null,
            ticketsActivos: [],
            ultimaBusqueda: null,
        };
        this.facade = ParkingFacade.getInstance();
    }
    async cargarInicial() {
        const [ocupacion, movimientos] = await Promise.all([
            this.facade.getOcupacion(),
            this.facade.getUltimosMovimientos(10),
        ]);
        this.state.ocupacion = ocupacion;
        this.state.ticketsActivos = movimientos;
        this.emit('ocupacionChanged', ocupacion);
        this.emit('movimientosChanged', movimientos);
    }
    async registrarEntrada(matricula) {
        const result = await this.facade.registrarEntrada(matricula);
        await this.refrescarDashboard();
        return result;
    }
    async registrarSalida(matricula, perdido = false) {
        const result = await this.facade.registrarSalida(matricula, perdido);
        this.state.ultimaBusqueda = null;
        this.emit('busquedaChanged', null);
        await this.refrescarDashboard();
        return result;
    }
    async buscarVehiculo(matricula) {
        const result = await this.facade.buscarVehiculo(matricula);
        this.state.ultimaBusqueda = result;
        this.emit('busquedaChanged', result);
        return result;
    }
    clearResult() {
        this.state.ultimaBusqueda = null;
        this.emit('busquedaChanged', null);
    }
    async refrescarDashboard() {
        const [ocupacion, movimientos] = await Promise.all([
            this.facade.getOcupacion(),
            this.facade.getUltimosMovimientos(10),
        ]);
        this.state.ocupacion = ocupacion;
        this.state.ticketsActivos = movimientos;
        this.emit('ocupacionChanged', ocupacion);
        this.emit('movimientosChanged', movimientos);
    }
}
