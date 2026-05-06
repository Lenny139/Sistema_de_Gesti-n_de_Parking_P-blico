const root = document.getElementById('ux-login-root')

const render = (): void => {
  if (!root) {
    return
  }

  root.innerHTML = `
    <section class="ux-login-shell">
      <header class="ux-login-head">
        <span class="ux-badge">Diseno UX</span>
        <h1>Login</h1>
        <p>Acceso al sistema de parking publico.</p>
      </header>
      <div class="ux-login-card">
        <div class="ux-form">
          <label>Usuario</label>
          <input type="text" placeholder="usuario" />
          <label>Contrasena</label>
          <input type="password" placeholder="••••••••" />
          <div class="ux-row-inline">
            <button class="ux-btn ux-btn-primary" type="button">Entrar</button>
            <button class="ux-btn" type="button">Cambiar tema</button>
          </div>
        </div>
      </div>
      <a class="ux-link" href="/ux/index.html">Volver al Diseno UX</a>
    </section>
  `
}

render()

export {}
