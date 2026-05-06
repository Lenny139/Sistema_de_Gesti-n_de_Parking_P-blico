const root = document.getElementById('ux-root')

const render = (): void => {
  if (!root) {
    return
  }

  root.innerHTML = `
    <section class="ux-lab">
      <div class="ux-hero">
        <div class="ux-hero-inner">
          <div class="ux-hero-copy ux-stagger">
            <span class="ux-kicker">Maqueta UX</span>
            <h1>Parking Publico 360</h1>
            <p class="ux-lead">
              Propuesta estatica para visualizar el flujo completo del usuario,
              los puntos de contacto y las decisiones clave del sistema.
            </p>
            <div class="ux-cta">
              <a class="btn btn-dark" href="/">Volver al sistema</a>
              <button class="btn btn-warning" type="button">Exportar PDF (mock)</button>
            </div>
            <div class="ux-meta">
              <span>Version: 0.9</span>
              <span>Ultima revision: Mayo 2026</span>
              <span>Estado: Concepto validado</span>
            </div>
          </div>
          <div class="ux-hero-panel ux-stagger">
            <div class="ux-pill">Operativo</div>
            <div class="ux-meter">
              <div>
                <div class="ux-meter-label">Ocupacion actual</div>
                <div class="ux-meter-value">78 / 120</div>
              </div>
              <div class="ux-meter-ring">
                <span>65%</span>
              </div>
            </div>
            <div class="ux-hero-grid">
              <div class="ux-hero-card">
                <div class="ux-hero-title">Tiempo medio</div>
                <div class="ux-hero-value">2h 18m</div>
              </div>
              <div class="ux-hero-card">
                <div class="ux-hero-title">Tickets hoy</div>
                <div class="ux-hero-value">164</div>
              </div>
              <div class="ux-hero-card">
                <div class="ux-hero-title">Ingresos</div>
                <div class="ux-hero-value">$2.34M</div>
              </div>
              <div class="ux-hero-card">
                <div class="ux-hero-title">Alertas</div>
                <div class="ux-hero-value">3 activas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="ux-content container-fluid">
        <div class="ux-grid">
          <div class="ux-card ux-flow">
            <div class="ux-card-header">
              <h2>Mapa de experiencia</h2>
              <span class="ux-chip">Flujo critico</span>
            </div>
            <ol class="ux-steps">
              <li>
                <div class="ux-step-title">Ingreso y validacion</div>
                <p>Lectura de placa, confirmacion visual y registro instantaneo.</p>
                <div class="ux-tags">
                  <span>0-30s</span>
                  <span>Sensor + operador</span>
                </div>
              </li>
              <li>
                <div class="ux-step-title">Pago y salida</div>
                <p>Calculo de tarifa automatico, opcion de pago rapido o manual.</p>
                <div class="ux-tags">
                  <span>1-3 min</span>
                  <span>Tarifa dinamica</span>
                </div>
              </li>
              <li>
                <div class="ux-step-title">Post-servicio</div>
                <p>Ticket digital, resumen de visita y encuesta de 1 toque.</p>
                <div class="ux-tags">
                  <span>Auto</span>
                  <span>Feedback</span>
                </div>
              </li>
            </ol>
          </div>

          <div class="ux-card ux-screens">
            <div class="ux-card-header">
              <h2>Pantallas clave</h2>
              <span class="ux-chip">Alta fidelidad</span>
            </div>
            <div class="ux-screen-grid">
              <article class="ux-screen">
                <div class="ux-screen-top">
                  <span class="ux-screen-badge">Operador</span>
                  <span class="ux-screen-status">En vivo</span>
                </div>
                <h3>Panel de entrada</h3>
                <p>Vista concentrada en matricula, estado y acciones rapidas.</p>
                <div class="ux-screen-footer">
                  <span>KPIs + acciones</span>
                  <span>Actualiza cada 30s</span>
                </div>
              </article>
              <article class="ux-screen">
                <div class="ux-screen-top">
                  <span class="ux-screen-badge">Admin</span>
                  <span class="ux-screen-status">Reporte</span>
                </div>
                <h3>Analitica diaria</h3>
                <p>Resumen visual con comparativo y alertas de ocupacion.</p>
                <div class="ux-screen-footer">
                  <span>Exportable</span>
                  <span>Filtros inteligentes</span>
                </div>
              </article>
              <article class="ux-screen">
                <div class="ux-screen-top">
                  <span class="ux-screen-badge">Caja</span>
                  <span class="ux-screen-status">Pago</span>
                </div>
                <h3>Cobro express</h3>
                <p>Tarifa sugerida, metodos favoritos y recibo inmediato.</p>
                <div class="ux-screen-footer">
                  <span>2 pasos</span>
                  <span>Atajos de teclado</span>
                </div>
              </article>
            </div>
          </div>

          <div class="ux-card ux-kpis">
            <div class="ux-card-header">
              <h2>Indicadores UX</h2>
              <span class="ux-chip">Meta 2026</span>
            </div>
            <div class="ux-kpi-grid">
              <div>
                <div class="ux-kpi-label">Tiempo de atencion</div>
                <div class="ux-kpi-value">-38%</div>
              </div>
              <div>
                <div class="ux-kpi-label">Errores manuales</div>
                <div class="ux-kpi-value">1.2%</div>
              </div>
              <div>
                <div class="ux-kpi-label">Uso autogestion</div>
                <div class="ux-kpi-value">54%</div>
              </div>
              <div>
                <div class="ux-kpi-label">Satisfaccion</div>
                <div class="ux-kpi-value">4.7/5</div>
              </div>
            </div>
            <div class="ux-divider"></div>
            <div class="ux-note">
              Insight principal: se reduce el tiempo de salida al priorizar
              acciones en una sola columna y botones de alto contraste.
            </div>
          </div>

          <div class="ux-card ux-table">
            <div class="ux-card-header">
              <h2>Backlog inicial</h2>
              <span class="ux-chip">Estatica</span>
            </div>
            <div class="ux-table-wrap">
              <div class="ux-row">
                <span>Registro rapido de placas</span>
                <span>Alta</span>
                <span>Semana 1</span>
              </div>
              <div class="ux-row">
                <span>Panel ocupacion en vivo</span>
                <span>Alta</span>
                <span>Semana 1</span>
              </div>
              <div class="ux-row">
                <span>Alertas de sobrecupo</span>
                <span>Media</span>
                <span>Semana 2</span>
              </div>
              <div class="ux-row">
                <span>Encuesta 1 toque</span>
                <span>Media</span>
                <span>Semana 3</span>
              </div>
              <div class="ux-row">
                <span>Resumen financiero diario</span>
                <span>Alta</span>
                <span>Semana 2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
}

render()
