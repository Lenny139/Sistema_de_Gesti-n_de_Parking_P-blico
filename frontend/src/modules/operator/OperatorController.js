import I18n from '../../core/i18n/I18n.js';
import BaseController from '../../core/mvc/BaseController.js';
import Toast from '../../components/Toast.js';
export default class OperatorController extends BaseController {
    constructor() {
        super(...arguments);
        this.i18n = I18n.getInstance();
        this.pollId = null;
        this.initialized = false;
        this.onOcupacionActualizada = (event) => {
            const custom = event;
            if (custom.detail) {
                this.view.renderOcupacion(custom.detail);
            }
        };
    }
    init() {
        this.view.render();
        this.bindEvents();
        if (!this.initialized) {
            this.bindModelEvents();
            window.addEventListener('ocupacionActualizada', this.onOcupacionActualizada);
            this.model
                .cargarInicial()
                .catch((error) => Toast.error(error instanceof Error ? error.message : 'Error'));
            this.startPolling();
            this.initialized = true;
        }
        else {
            if (this.model.state.ocupacion) {
                this.view.renderOcupacion(this.model.state.ocupacion);
            }
            this.view.renderMovimientos(this.model.state.ticketsActivos);
            this.view.renderResultadoBusqueda(this.model.state.ultimaBusqueda);
        }
    }
    bindEvents() {
        const btnEntrada = document.getElementById('btn-entrada');
        const btnSalida = document.getElementById('btn-salida');
        const btnBuscar = document.getElementById('btn-buscar');
        const btnLogout = document.getElementById('logout-btn');
        const lang = document.getElementById('operator-lang');
        const themeToggle = document.getElementById('theme-toggle');
        btnEntrada?.addEventListener('click', async () => {
            const matricula = this.getMatriculaInput();
            if (!matricula) {
                Toast.warning(this.i18n.t('error_matricula_requerida'));
                return;
            }
            try {
                await this.model.registrarEntrada(matricula);
                this.model.clearResult();
                Toast.success(this.i18n.t('entrada_registrada'));
                this.clearInput();
            }
            catch (error) {
                Toast.error(error instanceof Error ? error.message : 'Error');
            }
        });
        btnSalida?.addEventListener('click', async () => {
            const matricula = this.getMatriculaInput();
            if (!matricula) {
                Toast.warning(this.i18n.t('error_matricula_requerida'));
                return;
            }
            try {
                const data = await this.model.buscarVehiculo(matricula);
                if (!data) {
                    Toast.warning(this.i18n.t('vehiculo_no_encontrado'));
                    return;
                }
                this.view.showConfirmacionSalida(data);
                this.bindConfirmButtons(matricula);
            }
            catch (error) {
                Toast.error(error instanceof Error ? error.message : 'Error');
            }
        });
        btnBuscar?.addEventListener('click', async () => {
            const matricula = this.getMatriculaInput();
            if (!matricula) {
                Toast.warning(this.i18n.t('error_matricula_requerida'));
                return;
            }
            try {
                const data = await this.model.buscarVehiculo(matricula);
                this.view.renderResultadoBusqueda(data);
                if (!data) {
                    Toast.warning(this.i18n.t('vehiculo_no_encontrado'));
                    return;
                }
                this.bindConfirmButtons(matricula);
            }
            catch (error) {
                Toast.error(error instanceof Error ? error.message : 'Error');
            }
        });
        btnLogout?.addEventListener('click', () => {
            if (this.pollId) {
                window.clearInterval(this.pollId);
            }
            window.dispatchEvent(new CustomEvent('logout'));
        });
        lang?.addEventListener('change', () => {
            this.i18n.setLocale(lang.value === 'en' ? 'en' : 'es');
            this.init();
        });
        themeToggle?.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-bs-theme');
            document.documentElement.setAttribute('data-bs-theme', current === 'dark' ? 'light' : 'dark');
            this.init();
        });
    }
    bindModelEvents() {
        this.model.on('ocupacionChanged', (data) => {
            if (data) {
                this.view.renderOcupacion(data);
            }
        });
        this.model.on('movimientosChanged', (data) => {
            this.view.renderMovimientos(data ?? []);
        });
        this.model.on('busquedaChanged', (data) => {
            this.view.renderResultadoBusqueda(data ?? null);
        });
    }
    bindConfirmButtons(matricula) {
        const confirmSalida = document.getElementById('btn-confirmar-salida');
        const confirmPerdido = document.getElementById('btn-confirmar-perdido');
        confirmSalida?.addEventListener('click', async () => {
            try {
                const result = await this.model.registrarSalida(matricula, false);
                Toast.success(`${this.i18n.t('cobro_exitoso')}: ${result.montoFormateado}`);
                this.view.clearResult();
                this.clearInput();
            }
            catch (error) {
                Toast.error(error instanceof Error ? error.message : 'Error');
            }
        });
        confirmPerdido?.addEventListener('click', async () => {
            const ok = window.confirm('¿Confirmar ticket perdido?');
            if (!ok) {
                return;
            }
            try {
                const result = await this.model.registrarSalida(matricula, true);
                Toast.warning(`${this.i18n.t('cobro_exitoso')}: ${result.montoFormateado}`);
                this.view.clearResult();
                this.clearInput();
            }
            catch (error) {
                Toast.error(error instanceof Error ? error.message : 'Error');
            }
        });
    }
    startPolling() {
        if (this.pollId) {
            window.clearInterval(this.pollId);
        }
        this.pollId = window.setInterval(() => {
            this.model
                .refrescarDashboard()
                .catch((error) => Toast.error(error instanceof Error ? error.message : 'Error'));
        }, 30000);
    }
    getMatriculaInput() {
        const input = document.getElementById('matricula-input');
        return input?.value.trim().toUpperCase() ?? '';
    }
    clearInput() {
        const input = document.getElementById('matricula-input');
        if (input) {
            input.value = '';
        }
    }
}
