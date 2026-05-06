const root = document.getElementById('ux-root')

const render = (): void => {
  if (!root) {
    return
  }

  root.innerHTML = `
    <section class="ux-shell">
      <header class="ux-topbar">
        <div class="ux-brand">
          <span class="ux-badge">Diseno UX</span>
          <h1>Parking Publico - Interfaz Operativa</h1>
        </div>
        <div class="ux-top-actions">
          <button class="ux-btn" type="button">Exportar PDF (mock)</button>
          <div class="ux-meta">
            <span>Version: 1.0</span>
            <span>Revision: Mayo 2026</span>
            <span>Estado: Diseno estatico</span>
          </div>
        </div>
      </header>

      <nav class="ux-nav">
        <a href="/ux/login.html">Login</a>
        <a href="#operador">Operador</a>
        <a href="#admin-dashboard">Admin / Dashboard</a>
        <a href="#admin-reportes">Admin / Reportes</a>
        <a href="#admin-tarifas">Admin / Tarifas</a>
        <a href="#admin-historial">Admin / Historial</a>
      </nav>

      <section id="operador" class="ux-section">
        <div class="ux-section-head">
          <h2>Operador - Panel Principal</h2>
          <span class="ux-chip">Vista operativa</span>
        </div>
        <div class="ux-grid-two">
          <div class="ux-stack">
            <div class="ux-card">
              <h3>Registro rapido</h3>
              <label>Matricula</label>
              <input type="text" placeholder="ABC-123" />
              <div class="ux-row-inline">
                <button class="ux-btn ux-btn-primary" type="button">Registrar entrada</button>
                <button class="ux-btn" type="button">Registrar salida</button>
              </div>
              <button class="ux-btn ux-btn-ghost" type="button">Buscar / Ticket perdido</button>
            </div>
            <div class="ux-card">
              <h3>Resultado</h3>
              <div class="ux-ticket">
                <div class="ux-ticket-plate">ABC-123</div>
                <div class="ux-ticket-row">
                  <span>Hora entrada</span>
                  <span>08:12</span>
                </div>
                <div class="ux-ticket-row">
                  <span>Tiempo</span>
                  <span>1h 14m</span>
                </div>
                <div class="ux-ticket-row">
                  <span>Costo estimado</span>
                  <span>$7.000</span>
                </div>
              </div>
            </div>
          </div>

          <div class="ux-stack">
            <div class="ux-card">
              <div class="ux-row-inline">
                <div>
                  <h3>Ocupacion en tiempo real</h3>
                  <div class="ux-muted">78 / 120 plazas</div>
                </div>
                <span class="ux-badge">65%</span>
              </div>
              <div class="ux-bar">
                <div class="ux-bar-fill" style="width: 65%"></div>
              </div>
              <div class="ux-row-inline ux-muted">
                <span>42 libres</span>
                <span>Ultima act: 10:42</span>
              </div>
            </div>
            <div class="ux-card">
              <div class="ux-row-inline">
                <h3>Ultimos movimientos</h3>
                <span class="ux-chip">Hoy</span>
              </div>
              <table class="ux-table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Matricula</th>
                    <th>Tipo</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>10:28</td>
                    <td>JKL-992</td>
                    <td>Salida</td>
                    <td>$5.000</td>
                  </tr>
                  <tr>
                    <td>10:02</td>
                    <td>QWE-872</td>
                    <td>Entrada</td>
                    <td>--</td>
                  </tr>
                  <tr>
                    <td>09:44</td>
                    <td>ABC-123</td>
                    <td>Salida</td>
                    <td>$7.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="admin-dashboard" class="ux-section">
        <div class="ux-section-head">
          <h2>Admin - Dashboard</h2>
          <span class="ux-chip">Resumen</span>
        </div>
        <div class="ux-tabs">
          <span class="ux-tab active">Dashboard</span>
          <span class="ux-tab">Reportes</span>
          <span class="ux-tab">Tarifas</span>
          <span class="ux-tab">Historial</span>
        </div>
        <div class="ux-stat-grid">
          <div class="ux-stat">
            <span>Tickets hoy</span>
            <strong>164</strong>
          </div>
          <div class="ux-stat">
            <span>Ingresos hoy</span>
            <strong>$2.340.000</strong>
          </div>
          <div class="ux-stat">
            <span>Ocupacion actual</span>
            <strong>65%</strong>
          </div>
          <div class="ux-stat">
            <span>Promedio estadia</span>
            <strong>2h 18m</strong>
          </div>
        </div>
        <div class="ux-card">
          <h3>Ingresos del dia por hora</h3>
          <div class="ux-bars">
            <div class="ux-bar-row"><span>08:00</span><div class="ux-bar"><div class="ux-bar-fill" style="width: 35%"></div></div><strong>$180k</strong></div>
            <div class="ux-bar-row"><span>09:00</span><div class="ux-bar"><div class="ux-bar-fill" style="width: 60%"></div></div><strong>$320k</strong></div>
            <div class="ux-bar-row"><span>10:00</span><div class="ux-bar"><div class="ux-bar-fill" style="width: 80%"></div></div><strong>$420k</strong></div>
            <div class="ux-bar-row"><span>11:00</span><div class="ux-bar"><div class="ux-bar-fill" style="width: 50%"></div></div><strong>$260k</strong></div>
          </div>
        </div>
      </section>

      <section id="admin-reportes" class="ux-section">
        <div class="ux-section-head">
          <h2>Admin - Reportes</h2>
          <span class="ux-chip">Tabla estatica</span>
        </div>
        <div class="ux-card">
          <div class="ux-row-inline">
            <div>
              <label>Periodo</label>
              <select>
                <option>Hoy</option>
                <option>Semana</option>
                <option>Mes</option>
              </select>
            </div>
            <div class="ux-total">Total ingresos: $3.120.000</div>
          </div>
        </div>
        <div class="ux-card">
          <table class="ux-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Ingresos</th>
                <th>Movimientos</th>
                <th>Promedio</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>06/05</td>
                <td>$3.120.000</td>
                <td>164</td>
                <td>$19.000</td>
              </tr>
              <tr>
                <td>05/05</td>
                <td>$2.980.000</td>
                <td>152</td>
                <td>$19.600</td>
              </tr>
              <tr>
                <td>04/05</td>
                <td>$2.750.000</td>
                <td>141</td>
                <td>$19.500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="admin-tarifas" class="ux-section">
        <div class="ux-section-head">
          <h2>Admin - Tarifas</h2>
          <span class="ux-chip">Gestion</span>
        </div>
        <div class="ux-grid-two">
          <div class="ux-card">
            <h3>Tarifa activa</h3>
            <div class="ux-list-box">
              <div><strong>Precio / hora</strong><span>$5.000</span></div>
              <div><strong>Dia completo</strong><span>$40.000</span></div>
              <div><strong>Nocturna</strong><span>$3.000</span></div>
              <div><strong>Ticket perdido</strong><span>$50.000</span></div>
            </div>
          </div>
          <div class="ux-card">
            <h3>Editar tarifas</h3>
            <div class="ux-form">
              <label>Precio / hora</label>
              <input type="text" value="5000" />
              <label>Dia completo</label>
              <input type="text" value="40000" />
              <label>Nocturna</label>
              <input type="text" value="3000" />
              <label>Ticket perdido</label>
              <input type="text" value="50000" />
              <button class="ux-btn ux-btn-primary" type="button">Guardar cambios</button>
            </div>
          </div>
        </div>
      </section>

      <section id="admin-historial" class="ux-section">
        <div class="ux-section-head">
          <h2>Admin - Historial</h2>
          <span class="ux-chip">Seguimiento</span>
        </div>
        <div class="ux-card">
          <div class="ux-row-inline">
            <div>
              <label>Fecha inicio</label>
              <input type="date" value="2026-05-01" />
            </div>
            <div>
              <label>Fecha fin</label>
              <input type="date" value="2026-05-06" />
            </div>
            <div>
              <label>Tipo</label>
              <select>
                <option>Todos</option>
                <option>Entrada</option>
                <option>Salida</option>
                <option>Ticket perdido</option>
              </select>
            </div>
            <button class="ux-btn" type="button">Aplicar filtros</button>
          </div>
        </div>
        <div class="ux-card">
          <table class="ux-table">
            <thead>
              <tr>
                <th>Fecha/Hora</th>
                <th>Matricula</th>
                <th>Tipo</th>
                <th>Operador</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>06/05 10:28</td>
                <td>JKL-992</td>
                <td>Salida</td>
                <td>op-01</td>
                <td>$5.000</td>
              </tr>
              <tr>
                <td>06/05 09:44</td>
                <td>ABC-123</td>
                <td>Salida</td>
                <td>op-02</td>
                <td>$7.000</td>
              </tr>
              <tr>
                <td>06/05 09:12</td>
                <td>QWE-872</td>
                <td>Entrada</td>
                <td>op-01</td>
                <td>--</td>
              </tr>
            </tbody>
          </table>
          <div class="ux-row-inline ux-footer">
            <span>Total: $12.000</span>
            <div class="ux-pagination">
              <button class="ux-btn ux-btn-ghost" type="button">Anterior</button>
              <span>1 / 1</span>
              <button class="ux-btn ux-btn-ghost" type="button">Siguiente</button>
            </div>
          </div>
        </div>
      </section>
    </section>
  `
}

render()

export {}
