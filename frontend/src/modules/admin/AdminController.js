import Toast from '../../components/Toast.js';
import I18n from '../../core/i18n/I18n.js';
import BaseController from '../../core/mvc/BaseController.js';
export default class AdminController extends BaseController {
    constructor() {
        super(...arguments);
        this.i18n = I18n.getInstance();
        this.historial = [];
        this.paginaHistorial = 1;
        this.localeListenerBound = false;
    }
    init() {
        this.view.render();
        this.bindEvents();
        this.cargarDashboardInicial().catch((error) => {
            Toast.error(error instanceof Error ? error.message : 'Error al cargar dashboard');
        });
    }
    bindEvents() {
        const tabButtons = document.querySelectorAll('[data-admin-tab]');
        tabButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const tab = button.getAttribute('data-admin-tab');
                if (tab === 'dashboard' || tab === 'reportes' || tab === 'tarifas' || tab === 'historial') {
                    this.handleTab(tab);
                }
            });
        });
        const tarifaForm = document.getElementById('tarifa-form');
        tarifaForm?.addEventListener('submit', (event) => {
            event.preventDefault();
            this.submitTarifa().catch((error) => {
                Toast.error(error instanceof Error ? error.message : 'Error al guardar tarifa');
            });
        });
        const periodo = document.getElementById('reporte-periodo');
        periodo?.addEventListener('change', () => {
            const selected = (periodo.value || 'HOY');
            this.model
                .loadReporteIngresos(selected)
                .then((data) => this.view.renderReporte(data))
                .catch((error) => Toast.error(error instanceof Error ? error.message : 'Error al cargar reporte'));
        });
        const aplicar = document.getElementById('hist-aplicar');
        aplicar?.addEventListener('click', () => {
            this.paginaHistorial = 1;
            this.aplicarFiltrosHistorial().catch((error) => {
                Toast.error(error instanceof Error ? error.message : 'Error al cargar historial');
            });
        });
        const prev = document.getElementById('hist-prev');
        const next = document.getElementById('hist-next');
        prev?.addEventListener('click', () => {
            this.paginaHistorial = Math.max(1, this.paginaHistorial - 1);
            this.view.renderHistorial(this.historial, this.paginaHistorial);
        });
        next?.addEventListener('click', () => {
            const totalPages = Math.max(1, Math.ceil(this.historial.length / 10));
            this.paginaHistorial = Math.min(totalPages, this.paginaHistorial + 1);
            this.view.renderHistorial(this.historial, this.paginaHistorial);
        });
        if (!this.localeListenerBound) {
            window.addEventListener('localeChanged', () => {
                this.init();
            });
            this.localeListenerBound = true;
        }
    }
    async cargarDashboardInicial() {
        this.view.setTab('dashboard');
        const [estadisticas, historial] = await Promise.all([
            this.model.loadEstadisticasGenerales(),
            this.model.loadHistorial(this.filtrosHoy()),
        ]);
        this.historial = historial;
        const ingresosPorHoraMap = new Map();
        for (let hour = 0; hour < 24; hour += 1) {
            ingresosPorHoraMap.set(`${hour.toString().padStart(2, '0')}:00`, 0);
        }
        historial.forEach((item) => {
            const date = new Date(item.hora);
            const hour = `${date.getHours().toString().padStart(2, '0')}:00`;
            const prev = ingresosPorHoraMap.get(hour) ?? 0;
            ingresosPorHoraMap.set(hour, prev + (item.monto ?? 0));
        });
        const ingresosPorHora = [...ingresosPorHoraMap.entries()].map(([hora, ingresos]) => ({
            hora,
            ingresos,
        }));
        this.view.renderDashboard({ estadisticas, ingresosPorHora });
    }
    async handleTab(tab) {
        this.view.setTab(tab);
        if (tab === 'dashboard') {
            await this.cargarDashboardInicial();
            return;
        }
        if (tab === 'reportes') {
            const data = await this.model.loadReporteIngresos('HOY');
            this.view.renderReporte(data);
            return;
        }
        if (tab === 'tarifas') {
            const data = await this.model.loadTarifas();
            this.view.renderTarifas(data);
            return;
        }
        const historial = await this.model.loadHistorial({});
        this.historial = historial;
        this.paginaHistorial = 1;
        this.view.renderHistorial(historial, this.paginaHistorial);
    }
    async submitTarifa() {
        const idInput = document.getElementById('tarifa-id');
        const precioHora = document.getElementById('tarifa-precioHora');
        const diaCompleto = document.getElementById('tarifa-diaCompleto');
        const nocturna = document.getElementById('tarifa-nocturna');
        const perdido = document.getElementById('tarifa-perdido');
        const id = idInput?.value.trim() ?? '';
        if (!id) {
            Toast.warning('No hay tarifa activa para actualizar');
            return;
        }
        const payload = {
            precioPorHora: Number(precioHora?.value ?? 0),
            precioDiaCompleto: Number(diaCompleto?.value ?? 0),
            tarifaNocturna: Number(nocturna?.value ?? 0),
            tarifaTicketPerdido: Number(perdido?.value ?? 0),
        };
        const values = Object.values(payload);
        if (values.some((value) => !Number.isFinite(value) || value < 0)) {
            Toast.warning('Todos los valores deben ser positivos');
            return;
        }
        const confirmed = window.confirm('¿Guardar cambios de tarifa?');
        if (!confirmed) {
            return;
        }
        await this.model.updateTarifa(id, payload);
        const tarifas = await this.model.loadTarifas();
        this.view.renderTarifas(tarifas);
        Toast.success('Tarifa actualizada correctamente');
    }
    async aplicarFiltrosHistorial() {
        const fechaInicio = document.getElementById('hist-fechaInicio');
        const fechaFin = document.getElementById('hist-fechaFin');
        const tipo = document.getElementById('hist-tipo');
        const filtros = {};
        if (fechaInicio?.value) {
            filtros.fechaInicio = new Date(`${fechaInicio.value}T00:00:00.000Z`).toISOString();
        }
        if (fechaFin?.value) {
            filtros.fechaFin = new Date(`${fechaFin.value}T23:59:59.999Z`).toISOString();
        }
        if (tipo?.value) {
            filtros.tipo = tipo.value;
        }
        const historial = await this.model.loadHistorial(filtros);
        this.historial = historial;
        this.view.renderHistorial(historial, this.paginaHistorial);
    }
    filtrosHoy() {
        const now = new Date();
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        const end = new Date(now);
        end.setHours(23, 59, 59, 999);
        return {
            fechaInicio: start.toISOString(),
            fechaFin: end.toISOString(),
        };
    }
}
