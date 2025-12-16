﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿// JS externo para dashboard.html, migrado desde el script inline
// Registra Chart.js UMD si está disponible
if (window.Chart && window.Chart.register && window.Chart.registerables) {
  try { window.Chart.register(...window.Chart.registerables); } catch {}
}

// Traducción global mínima (compatibilidad con main.js)
try { window.tr = (es, en) => ((document.documentElement.getAttribute('lang')||'es')==='en' ? en : es); } catch {}

// Defaults y refresco de Chart.js basados en variables CSS del tema
function getCssVarRoot(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}
function getThemePaletteRoot() {
  const primary = getCssVarRoot('--brand-primary', '#0c2340');
  const secondary = getCssVarRoot('--brand-secondary', '#7e63d4');
  const accent = getCssVarRoot('--brand-accent', '#7c3aed');
  const text = getCssVarRoot('--color-text', '#111827');
  const grid = getCssVarRoot('--color-border', '#cbd5e1');
  return { primary, secondary, accent, text, grid, series: [accent, secondary, primary, '#111827'] };
}
function applyChartDefaults() {
  try {
    const Chart = window.Chart; if (!Chart) return;
    const pal = getThemePaletteRoot();
    const fontFamily = (getComputedStyle(document.body).getPropertyValue('font-family') || getComputedStyle(document.documentElement).getPropertyValue('font-family') || 'Segoe UI, sans-serif').toString().replace(/"/g,'').trim();
    const d = Chart.defaults;
    d.color = pal.text;
    d.borderColor = pal.grid;
    d.font = d.font || {}; d.font.family = fontFamily;
    d.plugins = d.plugins || {};
    d.plugins.legend = d.plugins.legend || {}; d.plugins.legend.labels = d.plugins.legend.labels || {};
    d.plugins.legend.labels.color = pal.text;
    d.plugins.tooltip = d.plugins.tooltip || {};
    d.plugins.tooltip.titleColor = pal.text; d.plugins.tooltip.bodyColor = pal.text;
    d.plugins.tooltip.backgroundColor = getCssVarRoot('--surface', '#ffffff');
  } catch (_) { /* noop */ }
}
function refreshChartsForTheme() {
  try {
    const charts = (typeof window.socyaCharts !== 'undefined') ? window.socyaCharts : null;
    if (!charts || !charts.forEach) return;
    const pal = getThemePaletteRoot();
    charts.forEach(chart => {
      if (!chart) return;
      const opt = chart.options || {};
      if (opt.plugins?.legend?.labels) { opt.plugins.legend.labels.color = pal.text; }
      if (opt.plugins?.tooltip) {
        opt.plugins.tooltip.titleColor = pal.text;
        opt.plugins.tooltip.bodyColor = pal.text;
        opt.plugins.tooltip.backgroundColor = getCssVarRoot('--surface', '#ffffff');
      }
      if (opt.scales) {
        Object.keys(opt.scales).forEach(axis => {
          const sc = opt.scales[axis]; if (!sc) return;
          if (sc.grid) sc.grid.color = pal.grid;
          if (sc.ticks) sc.ticks.color = pal.text;
          if (sc.title && sc.title.color !== undefined) sc.title.color = pal.text;
        });
      }
      try { chart.update(); } catch (_) {}
    });
  } catch (_) { /* noop */ }
}
try { window.applyChartDefaults = applyChartDefaults; window.refreshChartsForTheme = refreshChartsForTheme; } catch {}

// Refresco global de idioma para el dashboard, disponible incluso si aún no se inicializó
// Usa el atributo `documentElement.lang` para determinar el idioma
(function(){
  const tr2 = (es, en) => ((document.documentElement.getAttribute('lang')||'es')==='en' ? en : es);
  const titleFor = (type) => tr2(
    (
      type === 'line' ? 'Gráfica de línea' :
      type === 'area' ? 'Gráfica de área' :
      type === 'bar' ? 'Gráfica de barras' :
      type === 'stackedBar' ? 'Barras apiladas' :
      type === 'barH' ? 'Barras horizontales' :
      type === 'pie' ? 'Gráfica de pastel' :
      type === 'doughnut' ? 'Gráfica de dona' :
      type === 'radar' ? 'Gráfica de radar' :
      type === 'polarArea' ? 'Gráfica polar' :
      type === 'mixed' ? 'Gráfica mixta' : 'Widget'
    ),
    (
      type === 'line' ? 'Line Chart' :
      type === 'area' ? 'Area Chart' :
      type === 'bar' ? 'Bar Chart' :
      type === 'stackedBar' ? 'Stacked Bars' :
      type === 'barH' ? 'Horizontal Bars' :
      type === 'pie' ? 'Pie Chart' :
      type === 'doughnut' ? 'Doughnut Chart' :
      type === 'radar' ? 'Radar Chart' :
      type === 'polarArea' ? 'Polar Area' :
      type === 'mixed' ? 'Mixed Chart' : 'Widget'
    )
  );

  function applyDashboardLanguageGlobal(){
    // Títulos de tarjetas
    document.querySelectorAll('.grid-stack-item').forEach(el => {
      const type = el.dataset.type;
      const titleEl = el.querySelector('.chart-title');
      if (titleEl && type) titleEl.textContent = titleFor(type);
    });
    // Botones FAB
    const setTitle = (id, es, en) => { const el = document.getElementById(id); if (el) el.title = tr2(es, en); };
    setTitle('requestsBtn','Peticiones','Requests');
    setTitle('chatbotBtn','Asistente','Assistant');
    setTitle('fabMain','Opciones','Options');
    setTitle('addLine','Gráfica de línea','Line chart');
    setTitle('addBar','Gráfica de barras','Bar chart');
    setTitle('addPie','Gráfica de pastel','Pie chart');
    setTitle('addDoughnut','Gráfica de dona','Doughnut chart');
    setTitle('addRadar','Gráfica de radar','Radar chart');
    setTitle('addPolar','Gráfica polar','Polar area');
    setTitle('addHBar','Barras horizontales','Horizontal bars');
    setTitle('addArea','Gráfica de área','Area chart');
    setTitle('addStacked','Barras apiladas','Stacked bars');
    setTitle('addMixed','Gráfica mixta','Mixed chart');
    setTitle('clear','Limpiar dashboard','Clear dashboard');

    // Etiquetas de charts existentes si están registrados en window.socyaCharts
    try {
      const charts = (typeof window.socyaCharts !== 'undefined') ? window.socyaCharts : null;
      const L = (document.documentElement.getAttribute('lang')||'es')==='en';
      if (charts && charts.forEach) {
        charts.forEach((chart, id) => {
          const type = document.querySelector(`.grid-stack-item[data-id="${id}"]`)?.dataset.type;
          if (!chart || !type) return;
          if (type === 'pie' || type === 'doughnut') {
            chart.data.labels = L ? ["Open","In progress","Closed"] : ["Abiertos","En progreso","Cerrados"];
          } else if (type === 'polarArea') {
            chart.data.labels = L ? ["North","South","East","West"] : ["Norte","Sur","Este","Oeste"];
          } else if (type === 'radar') {
            chart.data.labels = L ? ["Quality","Speed","Cost","Satisfaction","Coverage"] : ["Calidad","Velocidad","Coste","Satisfacción","Cobertura"];
            if (chart.data.datasets[0]) chart.data.datasets[0].label = tr2('Métricas','Metrics');
          } else if (type === 'stackedBar') {
            const ds = chart.data.datasets || [];
            if (ds[0]) ds[0].label = tr2('Abiertos','Open');
            if (ds[1]) ds[1].label = tr2('Cerrados','Closed');
            if (ds[2]) ds[2].label = tr2('En progreso','In progress');
          } else if (type === 'area') {
            if (chart.data.datasets[0]) chart.data.datasets[0].label = tr2('Área','Area');
          } else if (type === 'mixed') {
            const ds = chart.data.datasets || [];
            if (ds[0]) ds[0].label = tr2('Barras','Bars');
            if (ds[1]) ds[1].label = tr2('Línea','Line');
          } else {
            const ds = chart.data.datasets && chart.data.datasets[0];
            if (ds) ds.label = (type==='line') ? tr2('Tickets abiertos','Open tickets') : tr2('Tickets cerrados','Closed tickets');
          }
          try { chart.update(); } catch(_) {}
        });
      }
    } catch(_) {}
  }

  function migrateWidgetHeaders() {
    document.querySelectorAll('.grid-stack-item').forEach(el => {
      const old = el.querySelector('.card-header');
      const box = el.querySelector('.chart-box');
      if (!old || !box) return;
      old.classList.remove('card-header');
      old.classList.add('chart-box-header');
      const span = old.querySelector('span');
      if (span) span.classList.add('chart-title');
      box.insertBefore(old, box.firstChild);
    });
  }

  try { window.applyDashboardLanguage = applyDashboardLanguageGlobal; } catch {}
})();

function initDashboardInternal() {
  // Verificación de librerías
  if (!window.GridStack) { console.error('GridStack no cargó'); alert('No se pudo cargar GridStack'); return; }
  if (!window.Chart) { console.error('Chart.js no cargó'); alert('No se pudo cargar Chart.js'); return; }
  console.log('Chart.js versión:', window.Chart && window.Chart.version);
  // Asegurar que el contenedor del dashboard existe (SPA)
  if (!document.querySelector('.grid-stack')) { return; }

  // Navegación lateral: estado activo y acciones
  const navLinks = Array.from(document.querySelectorAll('#sidebarNav .nav-link'));
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
    link.addEventListener('click', (e) => {
      if (isExternal) { return; }
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const route = link.dataset.route;
      // Activar la vista de edición cuando se selecciona 'editar', y desactivarla en otras rutas
      if (route === 'editar') { document.body.classList.add('editing'); }
      else { document.body.classList.remove('editing'); }
      const main = document.querySelector('.content');
      if (main) main.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Colapsar/expandir menú y persistencia
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');
  const SIDEBAR_KEY = 'socya:sidebarCollapsed';
  const applySidebarState = (collapsed) => {
    const isCollapsed = !!collapsed;
    if (isCollapsed) {
      // Estado colapsado se representa como barra delgada (thin), no oculto
      sidebar?.classList.remove('collapsed');
      sidebar?.classList.add('thin');
      content?.classList.remove('full');
      content?.classList.add('thin');
    } else {
      // Estado expandido: mostrar completo
      sidebar?.classList.remove('collapsed');
      sidebar?.classList.remove('thin');
      content?.classList.remove('full');
      content?.classList.remove('thin');
    }
  };
  const initial = localStorage.getItem(SIDEBAR_KEY) === '1';
  applySidebarState(initial);

  // Sin ícono hamburguesa: el menú lateral se controla por borde con SocyaMenu
  // En pantallas pequeñas, permanecerá colapsado por defecto; el componente menu.js maneja apertura por borde
  // Ajuste al cambiar el tamaño de la ventana (el menú reusable dispara 'resize')
  window.addEventListener('resize', () => {
    try { adjustGridHeight(); } catch (_) {}
    // Asegurar que los charts recalculen dimensiones cuando cambie el viewport/menú
    try { charts.forEach(ch => { if (ch && typeof ch.resize === 'function') ch.resize(); }); } catch (_) {}
  });

  const STORAGE_KEY = "dashboard-layout:juan";
  let grid;
  const DEFAULT_W = 4;
  const DEFAULT_H = 3;
  const charts = new Map();
  // Exponer el mapa para actualizaciones de idioma desde fuera
  try { window.socyaCharts = charts; } catch {}
  let modalChart = null;
  let lastAddTs = 0;
  let lastWidgetId = null;

  // Idioma actual y helpers simples de traducción
  const appLang = () => (document.documentElement.getAttribute('lang') || 'es');
  const tr = (es, en) => (appLang()==='en' ? en : es);

  function adjustGridHeight() {
    if (!grid) return;
    const nodes = (grid.engine && grid.engine.nodes) ? grid.engine.nodes : [];
    const maxRow = nodes.reduce((m, n) => Math.max(m, (n.y || 0) + (n.h || 0)), 0);
    const margin = Array.isArray(grid.opts.margin) ? (grid.opts.margin[1] || grid.opts.margin[0] || 0) : (grid.opts.margin || 0);
    if (maxRow > 0) {
      const h = (maxRow * grid.opts.cellHeight) + Math.max(0, maxRow - 1) * margin;
      grid.el.style.height = h + 'px';
    } else {
      grid.el.style.removeProperty('height');
    }
  }

  const persist = () => { if (grid) { saveLayout(); adjustGridHeight(); } };

  window.initDashboard = function() {
    if (grid || !document.querySelector('.grid-stack')) return;
    
    grid = GridStack.init({ cellHeight: 220, margin: 5, float: true });

    grid.on('change', persist);
    grid.on('dragstop', persist);
    grid.on('resizestop', (e, el) => {
      persist();
      try {
        const target = (el && el.el) ? el.el : (Array.isArray(el) ? el[0]?.el : null);
        const id = target ? target.dataset.id : null;
        const ch = id ? charts.get(id) : null;
        if (ch && typeof ch.resize === 'function') { ch.resize(); }
      } catch (_) {}
    });
    window.addEventListener('beforeunload', persist);

    // Bind FAB buttons
    const bind = (id, type) => {
       const b = document.getElementById(id);
       if(b) b.addEventListener('click', (e) => { e.preventDefault(); addWidget(type); });
    };
    bind('addLine', 'line');
    bind('addBar', 'bar');
    bind('addPie', 'pie');
    bind('addDoughnut', 'doughnut');
    bind('addRadar', 'radar');
    bind('addPolar', 'polarArea');
    bind('addHBar', 'barH');
    bind('addArea', 'area');
    bind('addStacked', 'stackedBar');
    bind('addMixed', 'mixed');
    
    const clearBtn = document.getElementById('clear');
    if(clearBtn) clearBtn.addEventListener('click', (e) => {
       e.preventDefault();
       if(confirm(tr('¿Limpiar todo?','Clear all?'))) {
          grid.removeAll();
          saveLayout();
       }
    });

    // Toggle FAB menu
    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.querySelector('.fab-menu');
    if (fabMain && fabMenu) {
        fabMain.addEventListener('click', () => {
            const hidden = fabMenu.getAttribute('aria-hidden') === 'true';
            fabMenu.setAttribute('aria-hidden', !hidden);
        });
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { loadLayout(JSON.parse(saved)); } catch(e) { console.warn('Layout inválido, reseteando', e); addWidget('line'); }
    } else {
      addWidget('line');
    }
  };

  function serialize() {
    return grid.engine.nodes.map(n => ({ x: n.x, y: n.y, w: n.w, h: n.h, type: n.el.dataset.type, id: n.el.dataset.id }));
  }
  function saveLayout() { localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize())); }

  function loadLayout(items) {
    grid.removeAll();
    const valid = ['line','area','bar','stackedBar','barH','pie','doughnut','radar','polarArea','mixed','kpi','list'];
    items.forEach(item => {
      const t = valid.includes(item.type) ? item.type : 'line';
      const el = createWidget(t, item.id);
      grid.el.appendChild(el);
      grid.makeWidget(el);
      grid.update(el, { x: item.x, y: item.y, w: item.w, h: item.h });
      // Renderizar iconos una vez que el widget está en el DOM
      if (window.lucide && typeof window.lucide.createIcons === 'function') { try { window.lucide.createIcons(); } catch {} }
      const box = el.querySelector('.chart-box');
      renderWhenVisible(box, () => createChart(item.id, t));
      adjustGridHeight();
    });
    try { migrateWidgetHeaders(); } catch {}
  }

  function createWidget(type, id) {
    const el = document.createElement("div");
    el.classList.add("grid-stack-item");
    el.dataset.id = id || ("widget-" + Date.now());
    el.dataset.type = type;

    const inner = document.createElement("div");
    inner.className = "grid-stack-item-content";

    const header = document.createElement('div');
    header.className = 'chart-box-header';
    const headerTitle = document.createElement('span');
    headerTitle.className = 'chart-title';
    headerTitle.textContent = tr(
      (
        type === 'line' ? 'Gráfica de línea' :
        type === 'area' ? 'Gráfica de área' :
        type === 'bar' ? 'Gráfica de barras' :
        type === 'stackedBar' ? 'Barras apiladas' :
        type === 'barH' ? 'Barras horizontales' :
        type === 'pie' ? 'Gráfica de pastel' :
        type === 'doughnut' ? 'Gráfica de dona' :
        type === 'radar' ? 'Gráfica de radar' :
        type === 'polarArea' ? 'Gráfica polar' :
        type === 'mixed' ? 'Gráfica mixta' : 'Widget'
      ),
      (
        type === 'line' ? 'Line Chart' :
        type === 'area' ? 'Area Chart' :
        type === 'bar' ? 'Bar Chart' :
        type === 'stackedBar' ? 'Stacked Bars' :
        type === 'barH' ? 'Horizontal Bars' :
        type === 'pie' ? 'Pie Chart' :
        type === 'doughnut' ? 'Doughnut Chart' :
        type === 'radar' ? 'Radar Chart' :
        type === 'polarArea' ? 'Polar Area' :
        type === 'mixed' ? 'Mixed Chart' : 'Widget'
      )
    );
    header.appendChild(headerTitle);
    const headerActions = document.createElement('div');
    headerActions.className = 'card-actions';
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'widget-delete-btn';
    deleteBtn.setAttribute('aria-label', 'Eliminar widget');
    // Inserta el ícono de "X" de forma programática para asegurar visibilidad
    try {
  if (window.lucide && typeof window.lucide.createIcon === 'function') {
    const XIcon = window.lucide.createIcon('x');
    const svg = XIcon({ size: 24, color: '#ffffff' });
        deleteBtn.appendChild(svg);
      } else {
        // Fallback si Lucide no está disponible
        deleteBtn.textContent = '×';
      }
    } catch { deleteBtn.textContent = '×'; }
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const overlay = document.createElement('div');
      overlay.className = 'confirm-overlay show';
      const box = document.createElement('div');
      box.className = 'confirm-box';
      box.innerHTML = `
        <h3>${tr('Confirmar eliminación','Confirm deletion')}</h3>
        <p>${tr('¿Está seguro que desea eliminar esta gráfica?','Are you sure you want to delete this chart?')}</p>
        <div class="confirm-actions">
          <button type="button" class="confirm-cancel">${tr('Cancelar','Cancel')}</button>
          <button type="button" class="confirm-danger">${tr('Confirmar','Confirm')}</button>
        </div>
      `;
      overlay.appendChild(box);
      document.body.appendChild(overlay);
      const onClose = () => { overlay.classList.remove('show'); overlay.remove(); };
      box.querySelector('.confirm-cancel').addEventListener('click', (ev) => { ev.preventDefault(); onClose(); });
      box.querySelector('.confirm-danger').addEventListener('click', (ev) => {
        ev.preventDefault();
        grid.removeWidget(el); adjustGridHeight(); saveLayout();
        onClose();
      });
    });
    headerActions.appendChild(deleteBtn);
    header.appendChild(headerActions);

    const box = document.createElement('div');
    box.className = 'chart-box';
    box.appendChild(header);
    const area = document.createElement('div');
    area.className = 'chart-area';
    const canvas = document.createElement("canvas");
    canvas.id = `${el.dataset.id}-chart`;
    area.appendChild(canvas);
    box.appendChild(area);

    inner.appendChild(box);
    // Renderizar ícono Lucide del botón
    if (window.lucide && typeof window.lucide.createIcons === 'function') { try { window.lucide.createIcons(); } catch {} }
    el.appendChild(inner);
    // Registrar el último widget con el que el usuario interactúa
    inner.addEventListener('mouseenter', () => { lastWidgetId = el.dataset.id; });
    inner.addEventListener('click', () => { lastWidgetId = el.dataset.id; });
    return el;
  }

  // Refrescar títulos de widgets y textos de gráficos cuando cambie el idioma
  function titleForType(type) {
    return tr(
      (
        type === 'line' ? 'Gráfica de línea' :
        type === 'area' ? 'Gráfica de área' :
        type === 'bar' ? 'Gráfica de barras' :
        type === 'stackedBar' ? 'Barras apiladas' :
        type === 'barH' ? 'Barras horizontales' :
        type === 'pie' ? 'Gráfica de pastel' :
        type === 'doughnut' ? 'Gráfica de dona' :
        type === 'radar' ? 'Gráfica de radar' :
        type === 'polarArea' ? 'Gráfica polar' :
        type === 'mixed' ? 'Gráfica mixta' : 'Widget'
      ),
      (
        type === 'line' ? 'Line Chart' :
        type === 'area' ? 'Area Chart' :
        type === 'bar' ? 'Bar Chart' :
        type === 'stackedBar' ? 'Stacked Bars' :
        type === 'barH' ? 'Horizontal Bars' :
        type === 'pie' ? 'Pie Chart' :
        type === 'doughnut' ? 'Doughnut Chart' :
        type === 'radar' ? 'Radar Chart' :
        type === 'polarArea' ? 'Polar Area' :
        type === 'mixed' ? 'Mixed Chart' : 'Widget'
      )
    );
  }

  function refreshDashboardLanguage() {
    // Actualizar encabezados de widgets
    document.querySelectorAll('.grid-stack-item').forEach(el => {
      const type = el.dataset.type;
      const titleEl = el.querySelector('.chart-title');
      if (titleEl) { titleEl.textContent = titleForType(type); }
    });
    migrateWidgetHeaders();
    // Actualizar textos de las instancias Chart existentes
    try {
      charts.forEach((chart, id) => {
        const type = document.querySelector(`.grid-stack-item[data-id="${id}"]`)?.dataset.type;
        if (!chart || !type) return;
        const L = appLang()==='en';
        if (type === 'pie' || type === 'doughnut') {
          chart.data.labels = L ? ["Open","In progress","Closed"] : ["Abiertos","En progreso","Cerrados"];
        } else if (type === 'polarArea') {
          chart.data.labels = L ? ["North","South","East","West"] : ["Norte","Sur","Este","Oeste"];
        } else if (type === 'radar') {
          chart.data.labels = L ? ["Quality","Speed","Cost","Satisfaction","Coverage"] : ["Calidad","Velocidad","Coste","Satisfacción","Cobertura"];
          if (chart.data.datasets[0]) chart.data.datasets[0].label = tr('Métricas','Metrics');
        } else if (type === 'stackedBar') {
          const ds = chart.data.datasets || [];
          if (ds[0]) ds[0].label = tr('Abiertos','Open');
          if (ds[1]) ds[1].label = tr('Cerrados','Closed');
          if (ds[2]) ds[2].label = tr('En progreso','In progress');
        } else if (type === 'area') {
          if (chart.data.datasets[0]) chart.data.datasets[0].label = tr('Área','Area');
        } else if (type === 'mixed') {
          const ds = chart.data.datasets || [];
          if (ds[0]) ds[0].label = tr('Barras','Bars');
          if (ds[1]) ds[1].label = tr('Línea','Line');
        } else {
          const ds = chart.data.datasets && chart.data.datasets[0];
          if (ds) ds.label = (type==='line') ? tr('Tickets abiertos','Open tickets') : tr('Tickets cerrados','Closed tickets');
        }
        try { chart.update(); } catch(_) {}
      });
    } catch (_) {}

    // Actualizar títulos (title attribute) de botones FAB si existen
    const setTitle = (id, es, en) => { const el = document.getElementById(id); if (el) el.title = tr(es, en); };
    setTitle('addLine','Gráfica de línea','Line chart');
    setTitle('addBar','Gráfica de barras','Bar chart');
    setTitle('addPie','Gráfica de pastel','Pie chart');
    setTitle('addDoughnut','Gráfica de dona','Doughnut chart');
    setTitle('addRadar','Gráfica de radar','Radar chart');
    setTitle('addPolar','Gráfica polar','Polar area');
    setTitle('addHBar','Barras horizontales','Horizontal bars');
    setTitle('addArea','Gráfica de área','Area chart');
    setTitle('addStacked','Barras apiladas','Stacked bars');
    setTitle('addMixed','Gráfica mixta','Mixed chart');
    setTitle('clear','Limpiar dashboard','Clear dashboard');

    // --- Textos visibles en modales del catálogo de gráficas ---
    const setText = (id, es, en) => { const el = document.getElementById(id); if (el) el.textContent = tr(es, en); };
    setText('catalogTitle','Agregar gráficas','Add charts');
    setText('catalogDetailsBtn','Detalles','Details');
    setText('catalogBackBtn','Volver','Back');
    setText('catalogFilterToggle','Filtrar','Filter');
    setText('catalogFilterApplyBtn','Aplicar','Apply');
    setText('catalogFilterResetBtn','Restablecer','Reset');
    setText('catalogConfirmBtn','Agregar seleccionados','Add selected');
    setText('catalogClearBtn','Limpiar dashboard','Clear dashboard');
    setText('catalogDetailsTitle','Detalles','Details');
    const detailsType = document.getElementById('catalogDetailsType');
    if (detailsType) detailsType.textContent = tr('Tipo de gráfica seleccionado','Selected chart type');
    const catalogGrid = document.getElementById('catalogGrid');
    if (catalogGrid) catalogGrid.setAttribute('aria-label', tr('Catálogo de widgets','Widgets catalog'));
    const catalogClose = document.getElementById('catalogClose');
    if (catalogClose) catalogClose.setAttribute('aria-label', tr('Cerrar','Close'));
    const catalogPrev = document.getElementById('catalogPrev');
    if (catalogPrev) catalogPrev.setAttribute('aria-label', tr('Anterior','Previous'));
    const catalogNext = document.getElementById('catalogNext');
    if (catalogNext) catalogNext.setAttribute('aria-label', tr('Siguiente','Next'));
    // Etiquetas del dropdown de filtro (dos secciones)
    const filterSections = document.querySelectorAll('#catalogModal .filter-section .filter-label');
    if (filterSections[0]) filterSections[0].textContent = tr('Tipo de dato','Data type');
    if (filterSections[1]) filterSections[1].textContent = tr('Tipos de gráfica','Chart types');

    // --- Textos visibles en modal de información de gráfica ---
    setText('modalTitle','Información de la gráfica','Chart information');
    const modalClearBtn = document.getElementById('modalClearBtn');
    if (modalClearBtn) modalClearBtn.textContent = tr('Limpiar dashboard','Clear dashboard');
    const modalPrev = document.getElementById('modalPrev');
    if (modalPrev) modalPrev.setAttribute('aria-label', tr('Anterior','Previous'));
    const modalNext = document.getElementById('modalNext');
    if (modalNext) modalNext.setAttribute('aria-label', tr('Siguiente','Next'));
    const modalClose = document.getElementById('modalClose');
    if (modalClose) modalClose.setAttribute('aria-label', tr('Cerrar','Close'));
    const modalTypeLabel = document.getElementById('modalTypeLabel');
    if (modalTypeLabel) modalTypeLabel.textContent = tr('Tipo de gráfica: —','Chart type: —');
    const modalCategoryLabel = document.querySelector('#chartModal label[for="modalCategory"]');
    if (modalCategoryLabel) modalCategoryLabel.textContent = tr('Tipo:','Type:');

    // --- Textos visibles en modal de Peticiones ---
    setText('requestsTitle','Peticiones','Requests');
    const requestsClose = document.getElementById('requestsClose');
    if (requestsClose) requestsClose.setAttribute('aria-label', tr('Cerrar','Close'));
    const requestsList = document.getElementById('requestsList');
    if (requestsList) requestsList.setAttribute('aria-label', tr('Lista de peticiones','Requests list'));
    setText('requestDetailsTitle','Detalle de petición','Request details');
    const breadcrumb = document.querySelector('#requestsModal .details-breadcrumb');
    if (breadcrumb) breadcrumb.innerHTML = `<span>${tr('Peticiones','Requests')}</span><span class=\"sep\">›</span><span>${tr('Detalle','Details')}</span>`;
    const requestBack = document.getElementById('requestDetailsBack');
    if (requestBack) { requestBack.textContent = tr('Volver','Back'); requestBack.setAttribute('aria-label', tr('Volver a la lista','Back to list')); }

    // --- Textos del cuadro de confirmación ---
    setText('confirmDeleteTitle','Confirmar eliminación','Confirm deletion');
    const confirmDesc = document.getElementById('confirmDeleteDesc');
    if (confirmDesc) confirmDesc.textContent = tr('¿Está seguro que desea eliminar esta gráfica?','Are you sure you want to delete this chart?');
    setText('confirmCancelBtn','Cancelar','Cancel');
    setText('confirmDeleteBtn','Confirmar','Confirm');
  }

  // Exponer función para que main.js pueda invocarla al cambiar idioma
  try { window.applyDashboardLanguage = refreshDashboardLanguage; } catch {}

  function addWidget(type) {
    const now = Date.now();
    if (now - lastAddTs < 300) { return; }
    lastAddTs = now;
    const id = "widget-" + Date.now();
    const el = createWidget(type, id);
    grid.el.appendChild(el);
    grid.makeWidget(el);
    grid.update(el, { w: DEFAULT_W, h: DEFAULT_H });
    // Renderizar iconos una vez que el widget está en el DOM
    if (window.lucide && typeof window.lucide.createIcons === 'function') { try { window.lucide.createIcons(); } catch {} }
    const box = el.querySelector('.chart-box');
    renderWhenVisible(box, () => createChart(id, type));
    adjustGridHeight();
    saveLayout();
  }

  function renderWhenVisible(el, callback) {
    const ready = () => el && el.clientWidth > 0 && el.clientHeight > 0;
    if (ready()) { callback(); return; }
    const ro = new ResizeObserver(() => { if (ready()) { ro.disconnect(); callback(); } });
    ro.observe(el);
    setTimeout(() => { if (ready()) callback(); }, 800);
  }

  // Helpers de paleta y color basados en variables CSS del sitio
  function getCssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  function hexToRgba(hex, alpha) {
    const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex || '#000000');
    if (!m) return `rgba(0,0,0,${alpha||1})`;
    const r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
    return `rgba(${r},${g},${b},${alpha||1})`;
  }
  function colorAlpha(hex, a) { return hexToRgba(hex, a); }
  function mergeOptions(base, extra) {
    const out = { ...base };
    out.animation = { ...(base?.animation || {}), ...(extra?.animation || {}) };
    out.animations = { ...(base?.animations || {}), ...(extra?.animations || {}) };
    return out;
  }
  function getAnimationOptions(type) {
    const common = {
      animation: { duration: 900, easing: 'easeOutQuart' },
      animations: {
        y: { duration: 900, easing: 'easeOutQuart' },
        x: { duration: 700, easing: 'easeOutQuad' },
        tension: { duration: 800, easing: 'easeOutQuad', from: 0, to: 0.35 },
        radius: { duration: 500, easing: 'easeOutQuart', from: 0, to: 4 }
      }
    };
    if (type === 'pie' || type === 'doughnut' || type === 'polarArea') {
      common.animations.radius = { duration: 700, easing: 'easeOutQuart', from: 0 };
    }
    if (type === 'bar' || type === 'barH' || type === 'stackedBar') {
      common.animations.y = { duration: 900, easing: 'easeOutQuart' };
    }
    return common;
  }
  function getThemePalette() {
    // Derivar de variables de marca activas para respetar la paleta seleccionada
    const primary = getCssVar('--brand-primary', '#0c2340');
    const secondary = getCssVar('--brand-secondary', '#7e63d4');
    const accent = getCssVar('--brand-accent', '#7c3aed');
    const text = getCssVar('--color-text', '#111827');
    const grid = getCssVar('--color-border', '#cbd5e1');
    // Series: priorizar acento y secundario; incluir primario como tercera opción
    const series = [accent, secondary, primary, '#111827'];
    return { line: accent, bar: secondary, text, grid, series };
  }

  // Estilo de tooltip claro, acorde con tarjetas blancas del dashboard
  function getFlatTooltip(palette) {
    return {
      backgroundColor: getCssVar('--surface', '#ffffff'),
      titleColor: palette.text,
      bodyColor: palette.text,
      borderColor: '#e5e7eb',
      borderWidth: 1,
      displayColors: false,
      padding: 10
    };
  }

  function createChart(id, type) {
    const canvasEl = document.getElementById(id + "-chart");
    if (!canvasEl) return;

    const palette = getThemePalette();
    const ctx2d = canvasEl.getContext('2d');
    const grad = ctx2d.createLinearGradient(0, 0, 0, canvasEl.clientHeight || 300);
    // Degradado sutil para áreas; líneas normales no usan relleno
    grad.addColorStop(0, colorAlpha(palette.line, 0.25));
    grad.addColorStop(1, colorAlpha(palette.line, 0.06));

    const chartBg = getCssVar('--surface', '#ffffff');
    const bgPlugin = { id: 'chartAreaBg', beforeDraw(chart) {
      const { ctx, chartArea } = chart; ctx.save(); ctx.fillStyle = chartBg;
      ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top); ctx.restore(); }};

    const labels = appLang()==='en' ? ["Jan","Feb","Mar","Apr","May","Jun"] : ["Ene","Feb","Mar","Abr","May","Jun"];
    let data, options, chartType = type;
    if (type === 'pie' || type === 'doughnut') {
      data = { labels: ["Abiertos","En progreso","Cerrados"], datasets: [{ data: [12,8,20], backgroundColor: palette.series.slice(0,3), borderWidth:0 }] };
      options = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ color: palette.text } }, tooltip: getFlatTooltip(palette) } };
    } else if (type === 'polarArea') {
      data = { labels: ["Norte","Sur","Este","Oeste"], datasets: [{ data: [11,16,7,12], backgroundColor: palette.series.slice(0,4), borderWidth:0 }] };
      options = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ color: palette.text } }, tooltip: getFlatTooltip(palette) } };
        } else if (type === 'radar') {
          data = { labels: tr(["Calidad","Velocidad","Coste","Satisfacción","Cobertura"],["Quality","Speed","Cost","Satisfaction","Coverage"]), datasets: [{ label: tr('Métricas','Metrics'), data: [65,59,80,81,56], borderColor: palette.line, backgroundColor: colorAlpha(palette.line, 0.15), pointBackgroundColor: palette.line, borderWidth:2 }] };
          options = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ color: palette.text } }, tooltip: getFlatTooltip(palette) }, scales:{ r:{ angleLines:{ color: palette.grid }, grid:{ color: palette.grid }, ticks:{ color: palette.text } } } };
        } else if (type === 'barH') {
      chartType = 'bar';
      data = { labels, datasets: [{ label: tr('Tickets cerrados','Closed tickets'), data: [12,19,8,15,22,30], backgroundColor: colorAlpha(palette.bar, 0.85), borderRadius: 8, borderSkipped: false }] };
      options = { responsive:true, maintainAspectRatio:false, indexAxis:'y', plugins:{ legend:{ position:'top', labels:{ color: palette.text } }, tooltip: getFlatTooltip(palette) }, scales:{ x:{ grid:{ color: palette.grid }, ticks:{ color: palette.text } }, y:{ grid:{ color: palette.grid }, ticks:{ color: palette.text } } } };
    } else if (type === 'stackedBar') {
      chartType = 'bar';
      data = {
        labels,
        datasets: [
          { label: 'Abiertos', data: [5,8,3,7,9,11], backgroundColor: palette.series[0], borderRadius: 6 },
          { label: 'Cerrados', data: [7,11,5,8,13,19], backgroundColor: palette.series[1], borderRadius: 6 },
          { label: 'En progreso', data: [2,4,2,6,5,7], backgroundColor: palette.series[2], borderRadius: 6 }
      ]
      };
      options = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ color: palette.text } }, tooltip: getFlatTooltip(palette) }, scales:{ x:{ stacked:true, grid:{ color: palette.grid }, ticks:{ color: palette.text } }, y:{ stacked:true, grid:{ color: palette.grid }, ticks:{ color: palette.text } } } };
    } else if (type === 'area') {
      chartType = 'line';
      data = { labels, datasets: [{ label: 'Área', data: [12,19,8,15,22,30], borderColor: palette.line, backgroundColor: grad, fill: true, borderWidth:2, tension:0.25, pointRadius:0, pointHoverRadius:4 }] };
      options = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ color: palette.text } }, tooltip: getFlatTooltip(palette) }, scales:{ x:{ grid:{ color: palette.grid }, ticks:{ color: palette.text } }, y:{ grid:{ color: palette.grid }, ticks:{ color: palette.text } } } };
    
    } else if (type === 'mixed') {
      chartType = 'bar';
      data = {
        labels,
        datasets: [
          { type:'bar', label:'Barras', data:[12,19,8,15,22,30], backgroundColor: colorAlpha(palette.bar, 0.85), borderRadius: 8, borderSkipped: false },
          { type:'line', label:'Línea', data:[10,18,9,14,20,28], borderColor: palette.line, fill:false, tension:0.25, borderWidth:2, pointRadius:0 }
        ]
      };
      options = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ color: palette.text } }, tooltip: getFlatTooltip(palette) }, scales:{ x:{ grid:{ color: palette.grid }, ticks:{ color: palette.text } }, y:{ grid:{ color: palette.grid }, ticks:{ color: palette.text } } } };
    } else {
      const isLine = type === 'line';
      data = { labels, datasets: [ isLine
        ? { label: 'Tickets abiertos', data: [12,19,8,15,22,30], borderColor: palette.line, fill: false, borderWidth:2, tension:0.25, pointRadius:0, pointHoverRadius:4 }
        : { label: 'Tickets cerrados', data: [12,19,8,15,22,30], backgroundColor: colorAlpha(palette.bar, 0.85), borderRadius: 8, borderSkipped: false }
      ] };
      options = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ color: palette.text } }, tooltip: getFlatTooltip(palette) }, scales:{ x:{ grid:{ color: palette.grid }, ticks:{ color: palette.text } }, y:{ grid:{ color: palette.grid }, ticks:{ color: palette.text } } } };
    }

    try {
      options = mergeOptions(options, getAnimationOptions(chartType));
      const chart = new Chart(canvasEl, { type: chartType, data, options, plugins:[bgPlugin] });
      charts.set(id, chart);
      return chart;
    } catch (e) {
      console.error('Error creando Chart', e);
      ctx2d.save(); ctx2d.fillStyle = '#ef4444'; ctx2d.fillRect(10,10,100,50); ctx2d.restore();
    }
  }

  function getWidgetList() {
    const items = Array.from(grid.el.querySelectorAll('.grid-stack-item'));
    return items.map(el => {
      const id = el.dataset.id; const type = el.dataset.type;
      const title = el.querySelector('.chart-title')?.textContent || 'Widget';
      return { id, type, title };
    });
  }

function openChartModal(defaultId, previewType) {
    const modal = document.getElementById('chartModal');
    let select = document.getElementById('modalWidgetSelect');
    let categorySel = document.getElementById('modalCategory');
    const canvas = document.getElementById('modalChartCanvas');
    const statsDiv = document.getElementById('modalStats');
        const table = document.getElementById('modalDataTable');
        const titleEl = document.getElementById('modalTitle');
        const typeBadge = document.getElementById('modalTypeLabel');
        const deleteOverlay = document.getElementById('confirmDeleteOverlay');
    // Orden base más intuitivo: primero series temporales, luego barras,
    // mixtas y finalmente circulares / radiales.
    const baseTypeOrder = ['line','area','bar','barH','stackedBar','mixed','pie','doughnut','radar','polarArea'];
    const typeLabel = (t) => (
      t==='line' ? 'Gráfica de línea' :
      t==='area' ? 'Gráfica de área' :
      t==='bar' ? 'Gráfica de barras' :
      t==='stackedBar' ? 'Barras apiladas' :
      t==='pie' ? 'Gráfica de pastel' :
      t==='doughnut' ? 'Gráfica de dona' :
      t==='radar' ? 'Gráfica de radar' :
      t==='polarArea' ? 'Gráfica polar' :
      t==='barH' ? 'Barras horizontales' :
      t==='mixed' ? 'Gráfica mixta' : 'Widget'
    );

    const categoryMap = {
      tendencias: ['line','area','bar','mixed'],
      kpi: ['doughnut','pie'],
      volumenes: ['bar','stackedBar','barH','line'],
      ranking: ['barH','bar','doughnut','pie'],
      distribucion: ['doughnut','pie','polarArea'],
      multivariables: ['line','radar','mixed'],
      satisfaccion: ['bar','doughnut','radar']
    };
    const getOrderForCategory = (cat) => categoryMap[cat] || baseTypeOrder;

    const resetNode = (id) => {
      const old = document.getElementById(id);
      if (!old) return null;
      const clone = old.cloneNode(true);
      old.parentNode.replaceChild(clone, old);
      return clone;
    };

    const widgets = getWidgetList();
    if (select) {
      select.innerHTML = widgets.length ? widgets.map(w => `<option value="${w.id}">${w.title}</option>`).join('') : '<option value="">(Sin widgets)</option>';
    }
    let chosenId = defaultId || (widgets[widgets.length - 1] && widgets[widgets.length - 1].id) || (widgets[0] && widgets[0].id);
    if (select) { if (chosenId) select.value = chosenId; else select.value = ''; }
    const selectedWidget = widgets.find(w => w.id === ((select && select.value) || chosenId));
    let currentType = previewType || selectedWidget?.type || 'line';
    let typeOrder = getOrderForCategory(categorySel ? categorySel.value : null);
    if (!typeOrder.includes(currentType)) {
      // Ajustar categoría automáticamente para incluir el tipo del widget seleccionado
      const categories = ['tendencias','kpi','volumenes','ranking','distribucion','multivariables','satisfaccion'];
      const cat = categories.find(c => getOrderForCategory(c).includes(currentType));
      if (categorySel && cat) { categorySel.value = cat; }
      typeOrder = getOrderForCategory(categorySel ? categorySel.value : null);
      if (!typeOrder.includes(currentType)) { currentType = typeOrder[0]; }
    }
    let typeIdx = Math.max(0, typeOrder.indexOf(currentType));

  const renderModal = () => {
      titleEl.textContent = `${tr('Información de la gráfica — ','Chart info — ')}${typeLabel(currentType)}`;
      if (typeBadge) { typeBadge.textContent = `${tr('Tipo de gráfica: ','Chart type: ')}${typeLabel(currentType)}`; }
      const id = (select && select.value) || chosenId;
      const chartInst = id ? charts.get(id) : null;
      let labels = tr(["Ene","Feb","Mar","Abr","May","Jun"],["Jan","Feb","Mar","Apr","May","Jun"]);
      let data = [12,19,8,15,22,30];
      if ((currentType==='pie' || currentType==='doughnut')) { labels = tr(["Abiertos","En progreso","Cerrados"],["Open","In progress","Closed"]); data = [12,8,20]; }
      else if (currentType==='polarArea') { labels = tr(["Norte","Sur","Este","Oeste"],["North","South","East","West"]); data = [11,16,7,12]; }
      else if (currentType==='radar') { labels = tr(["Calidad","Velocidad","Coste","Satisfacción","Cobertura"],["Quality","Speed","Cost","Satisfaction","Coverage"]); data = [65,59,80,81,56]; }

      if (chartInst && chartInst.config.type === (currentType==='barH' ? 'bar' : currentType)) {
        const ds = chartInst.data.datasets[0];
        const d = (ds && Array.isArray(ds.data)) ? ds.data.slice() : [];
        const l = chartInst.data.labels ? chartInst.data.labels.slice() : d.map((_, i) => `Dato ${i+1}`);
        if (d.length) { data = d; labels = l; }
      }

      // Destruir cualquier instancia previa ligada al canvas para evitar "Canvas is already in use"
      const existingChart = (window.Chart && typeof window.Chart.getChart === 'function') ? window.Chart.getChart(canvas) : null;
      if (existingChart) { try { existingChart.destroy(); } catch {} }
      if (modalChart) { try { modalChart.destroy(); } catch {} modalChart = null; }
    const palette = getThemePalette();
      const ctx = canvas.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight || 400);
      grad.addColorStop(0, colorAlpha(palette.line, 0.6)); grad.addColorStop(1, colorAlpha(palette.line, 0.15));
      const chartBg = getCssVar('--surface', '#ffffff');
      const bgPlugin = { id:'chartAreaBg', beforeDraw(chart) { const {ctx, chartArea} = chart; ctx.save(); ctx.fillStyle = chartBg; ctx.fillRect(chartArea.left, chartArea.top, chartArea.right-chartArea.left, chartArea.bottom-chartArea.top); ctx.restore(); } };

      // Títulos de ejes por tipo
      const axisTitles = (() => {
        if (currentType === 'barH') return { x: tr('Valor','Value'), y: tr('Categoría','Category') };
        if (currentType === 'radar') return { r: tr('Puntuación','Score') };
        if (currentType === 'pie' || currentType === 'doughnut' || currentType === 'polarArea') return {};
        return { x: tr('Mes','Month'), y: tr('Valor','Value') };
      })();
      let cfg;
      if (currentType === 'pie' || currentType === 'doughnut') {
        cfg = { type: currentType, data: { labels, datasets:[{ data, backgroundColor: palette.series.slice(0, Math.max(3, data.length)), borderWidth:0 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ color: palette.text } }, tooltip: getFlatTooltip(palette) } }, plugins:[bgPlugin] };
      } else if (currentType === 'polarArea') {
        cfg = { type: 'polarArea', data: { labels, datasets:[{ data, backgroundColor: palette.series.slice(0, data.length), borderWidth:0 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ color: palette.text } }, tooltip: getFlatTooltip(palette) } }, plugins:[bgPlugin] };
      } else if (currentType === 'radar') {
        cfg = { type: 'radar', data: { labels, datasets:[{ label: tr('Métricas','Metrics'), data, borderColor: palette.line, backgroundColor: colorAlpha(palette.line, 0.15), pointBackgroundColor: palette.line, borderWidth:2 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ color: palette.text } }, tooltip: getFlatTooltip(palette) }, scales:{ r:{ angleLines:{ color: palette.grid }, grid:{ color: palette.grid }, ticks:{ color: palette.text } } } }, plugins:[bgPlugin] };
      } else if (currentType === 'barH') {
        cfg = { type: 'bar', data: { labels, datasets:[{ label: tr('Barras horizontales','Horizontal bars'), data, backgroundColor: colorAlpha(palette.bar, 0.85), borderRadius: 8, borderSkipped: false }] }, options:{ responsive:true, maintainAspectRatio:false, indexAxis:'y', plugins:{ legend:{ position:'top', labels:{ color: palette.text } }, tooltip: getFlatTooltip(palette) }, scales:{ x:{ grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.x, text: axisTitles.x, color: palette.text } }, y:{ grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.y, text: axisTitles.y, color: palette.text } } } }, plugins:[bgPlugin] };
      } else if (currentType === 'area') {
        cfg = { type: 'line', data: { labels, datasets:[{ label: tr('Área','Area'), data, borderColor: palette.line, backgroundColor: grad, fill: true, borderWidth:2, tension:0.25, pointRadius:0, pointHoverRadius:4 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ color: palette.text } }, tooltip: getFlatTooltip(palette) }, scales:{ x:{ grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.x, text: axisTitles.x, color: palette.text } }, y:{ grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.y, text: axisTitles.y, color: palette.text } } } }, plugins:[bgPlugin] };
      } else if (currentType === 'stackedBar') {
        cfg = { type: 'bar', data: { labels, datasets:[
          { label: tr('Abiertos','Open'), data: [5,8,3,7,9,11], backgroundColor: palette.series[0], borderRadius: 6 },
          { label: tr('Cerrados','Closed'), data: [7,11,5,8,13,19], backgroundColor: palette.series[1], borderRadius: 6 },
          { label: tr('En progreso','In progress'), data: [2,4,2,6,5,7], backgroundColor: palette.series[2], borderRadius: 6 }
        ] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ color: palette.text } }, tooltip: getFlatTooltip(palette) }, scales:{ x:{ stacked:true, grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.x, text: axisTitles.x, color: palette.text } }, y:{ stacked:true, grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.y, text: axisTitles.y, color: palette.text } } } }, plugins:[bgPlugin] };
      
      } else if (currentType === 'mixed') {
        cfg = { type: 'bar', data: { labels, datasets:[
          { type:'bar', label: tr('Barras','Bars'), data:[12,19,8,15,22,30], backgroundColor: colorAlpha(palette.bar, 0.85), borderRadius: 8, borderSkipped: false },
          { type:'line', label: tr('Línea','Line'), data:[10,18,9,14,20,28], borderColor: palette.line, fill:false, tension:0.25, borderWidth:2, pointRadius:0 }
        ] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ color: palette.text } }, tooltip: getFlatTooltip(palette) }, scales:{ x:{ grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.x, text: axisTitles.x, color: palette.text } }, y:{ grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.y, text: axisTitles.y, color: palette.text } } } }, plugins:[bgPlugin] };
      } else {
        const isLine = currentType==='line';
        cfg = { type: currentType, data: { labels, datasets:[ isLine
          ? { label: tr('Línea','Line'), data, borderColor: palette.line, fill:false, borderWidth:2, tension:0.25, pointRadius:0, pointHoverRadius:4 }
          : { label: tr('Barras','Bars'), data, backgroundColor: colorAlpha(palette.bar, 0.85), borderRadius:8, borderSkipped:false }
        ] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'top', labels:{ color: palette.text } }, tooltip: getFlatTooltip(palette) }, scales:{ x:{ grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.x, text: axisTitles.x, color: palette.text } }, y:{ grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.y, text: axisTitles.y, color: palette.text } } } }, plugins:[bgPlugin] };
      }
      try {
        cfg.options = mergeOptions(cfg.options || {}, getAnimationOptions(currentType));
        if (axisTitles && axisTitles.r && cfg.options && cfg.options.scales && cfg.options.scales.r) {
          cfg.options.scales.r.title = { display: true, text: axisTitles.r, color: palette.text };
        }
        modalChart = new Chart(canvas, cfg);
      } catch(e) { console.error('Modal chart error', e); }
      const sum = data.reduce((a,b)=>a+(typeof b==='number'?b:0),0);
      const min = data.reduce((m,v)=> typeof v==='number'?Math.min(m,v):m, Number.POSITIVE_INFINITY);
      const max = data.reduce((m,v)=> typeof v==='number'?Math.max(m,v):m, Number.NEGATIVE_INFINITY);
      const avg = data.length ? (sum/data.length) : 0;
      statsDiv.innerHTML = `
        <div class="metric"><strong>${tr('Total:','Total:')}</strong> ${sum.toFixed(2)}</div>
        <div class="metric"><strong>${tr('Promedio:','Average:')}</strong> ${avg.toFixed(2)}</div>
        <div class="metric"><strong>${tr('Mínimo:','Min:')}</strong> ${isFinite(min)?min.toFixed(2):'-'}</div>
        <div class="metric"><strong>${tr('Máximo:','Max:')}</strong> ${isFinite(max)?max.toFixed(2):'-'}</div>
      `;
      table.innerHTML = `
        <thead><tr><th>${tr('Etiqueta','Label')}</th><th>${tr('Valor','Value')}</th></tr></thead>
        <tbody>${labels.map((l,i)=>`<tr><td>${l}</td><td>${(typeof data[i]==='number'?data[i]:'-')}</td></tr>`).join('')}</tbody>
      `;
    };

    renderModal();
    if (select) { select = resetNode('modalWidgetSelect') || select; }
    if (categorySel) { categorySel = resetNode('modalCategory') || categorySel; }
    const clearBtn = resetNode('modalClearBtn');
    const prevBtn = resetNode('modalPrev');
    const nextBtn = resetNode('modalNext');
        const addBtn = resetNode('modalAddBtn');
        const closeBtn = resetNode('modalClose');
        const deleteBtn = resetNode('modalDelete');
        const confirmBtn = resetNode('confirmDeleteBtn');
        const cancelBtn = resetNode('confirmCancelBtn');
    const backdropEl = document.querySelector('#chartModal .modal-backdrop');
    if (backdropEl) {
      const cloneBackdrop = backdropEl.cloneNode(true);
      backdropEl.parentNode.replaceChild(cloneBackdrop, backdropEl);
    }

    if (select) select.addEventListener('change', () => { chosenId = select.value || chosenId; renderModal(); });
    if (categorySel) categorySel.addEventListener('change', () => { typeOrder = getOrderForCategory(categorySel.value); typeIdx = 0; currentType = typeOrder[typeIdx]; renderModal(); });
    if (clearBtn) clearBtn.addEventListener('click', () => { grid.removeAll(); adjustGridHeight(); localStorage.removeItem(STORAGE_KEY); renderModal(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { typeIdx = (typeIdx - 1 + typeOrder.length) % typeOrder.length; currentType = typeOrder[typeIdx]; renderModal(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { typeIdx = (typeIdx + 1) % typeOrder.length; currentType = typeOrder[typeIdx]; renderModal(); });
        if (addBtn) addBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopImmediatePropagation(); addBtn.disabled = true; addWidget(currentType || 'line'); setTimeout(() => { addBtn.disabled = false; }, 700); });
        if (closeBtn) closeBtn.addEventListener('click', closeChartModal);
        if (deleteBtn) {
          deleteBtn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopImmediatePropagation();
            if (deleteOverlay) { deleteOverlay.removeAttribute('hidden'); deleteOverlay.classList.add('show'); }
          });
        }
        if (cancelBtn) {
          cancelBtn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopImmediatePropagation();
            if (deleteOverlay) { deleteOverlay.classList.remove('show'); deleteOverlay.setAttribute('hidden','true'); }
          });
        }
        if (confirmBtn) {
          confirmBtn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopImmediatePropagation();
            const id = (select && select.value) || chosenId;
            if (id) {
              const el = grid.el.querySelector(`.grid-stack-item[data-id="${id}"]`);
              if (el) { grid.removeWidget(el); adjustGridHeight(); saveLayout(); }
            }
            if (deleteOverlay) { deleteOverlay.classList.remove('show'); deleteOverlay.setAttribute('hidden','true'); }
            const widgetsNow = getWidgetList();
            if (select) {
              select.innerHTML = widgetsNow.length ? widgetsNow.map(w => `<option value="${w.id}">${w.title}</option>`).join('') : '<option value="">(Sin widgets)</option>';
              select.value = widgetsNow.length ? widgetsNow[widgetsNow.length - 1].id : '';
            }
            chosenId = widgetsNow.length ? (select && select.value) || widgetsNow[widgetsNow.length - 1].id : null;
            currentType = widgetsNow.length ? (widgetsNow.find(w => w.id === chosenId)?.type || currentType) : currentType;
            renderModal();
          });
        }
    const newBackdrop = document.querySelector('#chartModal .modal-backdrop');
    if (newBackdrop) newBackdrop.addEventListener('click', closeChartModal);
    modal.classList.add('show'); modal.removeAttribute('hidden');
    // Cerrar con tecla ESC
    const onEscChart = (ev) => { if (ev.key === 'Escape') closeChartModal(); };
    document.addEventListener('keydown', onEscChart, { once: true });
    if (window.lucide && typeof window.lucide.createIcons === 'function') { try { window.lucide.createIcons(); } catch {} }
  }

  function closeChartModal() {
    const modal = document.getElementById('chartModal');
    if (modalChart) { try { modalChart.destroy(); } catch {} modalChart = null; }
    // Animación de salida
    modal.classList.add('closing');
    setTimeout(() => {
      modal.classList.remove('show');
      modal.classList.remove('closing');
      modal.setAttribute('hidden','true');
    }, 180);
  }

  // Nuevo flujo: catálogo de gráficas con selección múltiple
  let catalogSelection = new Set();
  let lastSelectedType = null;
  // Bandera para evitar que el modal de información se abra justo al cerrar el catálogo
  let suppressInfoModalUntil = 0;

  function openCatalogModal() {
    const modal = document.getElementById('catalogModal');
    const gridEl = document.getElementById('catalogGrid');
    const confirmBtn = document.getElementById('catalogConfirmBtn');
    const closeBtn = document.getElementById('catalogClose');
    const clearBtn = document.getElementById('catalogClearBtn');
    const detailsBtn = document.getElementById('catalogDetailsBtn');
    const filterToggle = document.getElementById('catalogFilterToggle');
    const filterDropdown = document.getElementById('catalogFilterDropdown');
    const filterIndicator = document.getElementById('catalogFilterIndicator');
    const filterResetBtn = document.getElementById('catalogFilterResetBtn');
    if (!modal || !gridEl) return;

    // Reset listeners
    const reset = (id) => { const el = document.getElementById(id); if (!el) return null; const c = el.cloneNode(true); el.parentNode.replaceChild(c, el); return c; };
    const _confirm = reset('catalogConfirmBtn') || confirmBtn;
    const _close = reset('catalogClose') || closeBtn;
    const _clear = reset('catalogClearBtn') || clearBtn;
    const _details = reset('catalogDetailsBtn') || detailsBtn;
    const backBtn = reset('catalogBackBtn') || document.getElementById('catalogBackBtn');
    const _filterToggle = reset('catalogFilterToggle') || filterToggle;
    const _filterDropdown = reset('catalogFilterDropdown') || filterDropdown;
    const _filterResetBtn = reset('catalogFilterResetBtn') || filterResetBtn;
    const dataTypeList = reset('catalogDataTypeList') || document.getElementById('catalogDataTypeList');
    const chartTypeList = reset('catalogChartTypeList') || document.getElementById('catalogChartTypeList');

    // Catálogo de tipos
    // Orden visual del catálogo alineado al orden base
    const types = ['line','area','bar','barH','stackedBar','mixed','pie','doughnut','radar','polarArea'];
    const label = (t) => (
      t==='line' ? tr('Línea','Line') : t==='area' ? tr('Área','Area') : t==='bar' ? tr('Barras','Bars') :
      t==='stackedBar' ? tr('Barras apiladas','Stacked bars') : t==='pie' ? tr('Pastel','Pie') :
      t==='doughnut' ? tr('Dona','Doughnut') : t==='radar' ? tr('Radar','Radar') : t==='polarArea' ? tr('Polar','Polar') :
      t==='barH' ? tr('Barras horizontales','Horizontal bars') : tr('Mixta','Mixed')
    );

    // Estado de filtro + persistencia
    // Filtro 1: Tipo de dato (opciones ejemplo)
    const dataTypeOptions = [
      { key:'topUsersMonthly', name: tr('Usuarios con más peticiones en el mes actual','Top users this month') },
      { key:'mostActiveUsers', name: tr('Usuarios más activos (frecuencia)','Most active users (frequency)') },
      { key:'geoDistribution', name: tr('Distribución geográfica de usuarios','Geographic distribution of users') },
      { key:'avgResponseTime', name: tr('Tiempo promedio de respuesta','Average response time') }
    ];
    // Compatibilidad entre tipo de dato y tipos de gráfica
    const dataTypeCompatibility = {
      topUsersMonthly: ['bar','barH','pie','doughnut','mixed'],
      mostActiveUsers: ['bar','barH','line','area','mixed'],
      geoDistribution: ['bar','barH','pie','doughnut','polarArea'],
      avgResponseTime: ['line','area','scatter','mixed']
    };
    const LS_DATA_KEY = 'socya:catalogDataType';
    const LS_CAT_KEY = 'socya:catalogActiveCategory'; // legacy, no usado ahora
    const LS_TYPES_KEY = 'socya:catalogActiveChartTypes';
    if (typeof window.catalogDataType === 'undefined') {
      const savedData = localStorage.getItem(LS_DATA_KEY);
      window.catalogDataType = savedData || 'topUsersMonthly';
    }
    if (typeof window.catalogActiveChartTypes === 'undefined') {
      try {
        const raw = localStorage.getItem(LS_TYPES_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        window.catalogActiveChartTypes = new Set(Array.isArray(arr) ? arr : []);
      } catch { window.catalogActiveChartTypes = new Set(); }
    }

    // Inicializar selects de filtro
    // Construir listas del dropdown
    if (dataTypeList) {
      dataTypeList.innerHTML = dataTypeOptions.map(opt => `
        <li><label><input type="radio" name="dataType" value="${opt.key}" ${ (window.catalogDataType||'topUsersMonthly')===opt.key ? 'checked':'' }> ${opt.name}</label></li>
      `).join('');
    }
    if (chartTypeList) {
      const allowedInit = dataTypeCompatibility[window.catalogDataType || 'topUsersMonthly'] || types;
      chartTypeList.innerHTML = types.map(t => {
        const enabled = allowedInit.includes(t);
        const checked = window.catalogActiveChartTypes.has(t) && enabled;
        const disabledAttr = enabled ? '' : 'disabled';
        const disabledClass = enabled ? '' : ' class="disabled"';
        return `
        <li${disabledClass}><label><input type="checkbox" value="${t}" ${checked ? 'checked':''} ${disabledAttr}> ${label(t)}</label></li>`;
      }).join('');
    }
    // Mostrar la sección de tipos de gráfica solo tras seleccionar tipo de dato
    const chartSection = _filterDropdown ? _filterDropdown.querySelectorAll('.filter-section')[1] : null;
    if (chartSection) {
      const hasSelection = !!window.catalogDataType;
      if (!hasSelection) chartSection.setAttribute('hidden',''); else chartSection.removeAttribute('hidden');
    }
    const updateIndicator = () => {
      if (!filterIndicator) return;
      // Preferir estado desde el DOM para máxima fidelidad
      let catRaw = window.catalogDataType || 'topUsersMonthly';
      try {
        const checkedRadio = dataTypeList ? dataTypeList.querySelector('input[type="radio"]:checked') : null;
        catRaw = (checkedRadio && checkedRadio.value) ? checkedRadio.value : (window.catalogDataType || 'topUsersMonthly');
      } catch {}
      const catLabel = (dataTypeOptions.find(o => o.key===catRaw)?.name) || catRaw;
      let selected = [];
      try {
        selected = chartTypeList ? Array.from(chartTypeList.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value) : Array.from(window.catalogActiveChartTypes || []);
      } catch { selected = Array.from(window.catalogActiveChartTypes || []); }
      const selectedLabels = selected.map(t => label(t));
      const typesText = selectedLabels.length ? ` · ${selectedLabels.join(', ')}` : '';
      filterIndicator.textContent = `${tr('Filtro:','Filter:')} ${catLabel}${typesText}`;
      // También refrescar el texto del botón de Filtrar para mayor claridad
      try {
        const btn = document.getElementById('catalogFilterToggle');
        if (btn) btn.textContent = `${tr('Filtrar','Filter')} · ${catLabel}`.trim();
      } catch {}
    };

    const computeTypesToDisplay = () => {
      let base = types.slice();
      const allowed = dataTypeCompatibility[window.catalogDataType || 'topUsersMonthly'] || types;
      base = base.filter(t => allowed.includes(t));
      if (window.catalogActiveChartTypes && window.catalogActiveChartTypes.size > 0) {
        base = base.filter(t => window.catalogActiveChartTypes.has(t));
      }
      return base;
    };

    const renderGrid = () => {
      gridEl.innerHTML = '';
      const palette = getThemePalette();
      const list = computeTypesToDisplay();
      list.forEach((t) => {
        const card = document.createElement('div'); card.className = 'catalog-card'; card.dataset.type = t;
        if (catalogSelection.has(t)) card.classList.add('selected');
        card.innerHTML = `
          <div class="catalog-card-header">
            <span class="catalog-card-title">${label(t)}</span>
            <label class="catalog-select"><input type="checkbox" ${catalogSelection.has(t)?'checked':''} aria-label="${tr('Seleccionar','Select')} ${label(t)}"> ${tr('Seleccionar','Select')}</label>
          </div>
          <div class="catalog-card-body"><canvas class="catalog-thumb"></canvas></div>`;
        gridEl.appendChild(card);

      // Miniatura Chart
      const canvas = card.querySelector('canvas');
      try {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.clientWidth; canvas.height = 120;
        const grad = ctx.createLinearGradient(0, 0, 0, 120); grad.addColorStop(0, colorAlpha(palette.line, 0.6)); grad.addColorStop(1, colorAlpha(palette.line, 0.15));
        // Datos de ejemplo según tipo de dato
        const k = window.catalogDataType || 'topUsersMonthly';
        const datasets = {
          topUsersMonthly: { labels:['Ana','Luis','Marta','José','Sofía'], values:[24,18,15,12,9] },
          mostActiveUsers: { labels:['Ana','Luis','Marta','José','Sofía'], values:[32,27,22,19,15] },
          geoDistribution: { labels:['Norte','Centro','Sur','Este','Oeste'], values:[40,25,20,10,5] },
          avgResponseTime: { labels:['L','M','X','J','V','S','D'], values:[120,110,140,100,130,150,115] }
        };
        const { labels, values } = datasets[k];
        // Para scatter: pares (x,y)
        const scatterPoints = values.map((v, i) => ({ x: v, y: (values[i+1]||v) * 0.9 + (i*3) }));
        let cfg;
        if (t==='pie' || t==='doughnut') {
          cfg = { type:t, data:{ labels, datasets:[{ data: values.slice(0,Math.min(values.length,6)), backgroundColor: palette.series.slice(0,labels.length), borderWidth:0 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } } } };
        }
        else if (t==='polarArea') {
          cfg = { type:'polarArea', data:{ labels, datasets:[{ data: values.slice(0,5), backgroundColor: palette.series.slice(0,5) }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } } } };
        }
        else if (t==='radar') {
          cfg = { type:'radar', data:{ labels, datasets:[{ data: values.slice(0,labels.length), borderColor: palette.line, backgroundColor: colorAlpha(palette.line,0.25), pointBackgroundColor: palette.line, borderWidth:1 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } } } };
        }
        else if (t==='barH') {
          cfg = { type:'bar', data:{ labels, datasets:[{ data: values, backgroundColor: colorAlpha(palette.bar,0.7), borderColor: palette.bar }] }, options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:{ display:false }, y:{ display:false } } } };
        }
        else if (t==='area') {
          cfg = { type:'line', data:{ labels, datasets:[{ data: values, borderColor: palette.line, backgroundColor: grad, fill:true, tension:0.35, pointRadius:0 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:{ display:false }, y:{ display:false } } } };
        }
        else if (t==='mixed') {
          cfg = { type:'bar', data:{ labels, datasets:[{ type:'bar', data: values, backgroundColor: colorAlpha(palette.bar,0.6) }, { type:'line', data: values.map(v => v*0.9), borderColor: palette.line, tension:0.25, pointRadius:0 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:{ display:false }, y:{ display:false } } } };
        }
        else if (t==='scatter') {
          cfg = { type:'scatter', data:{ datasets:[{ data: scatterPoints, backgroundColor: colorAlpha(palette.bar,0.7) }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:{ display:false }, y:{ display:false } } } };
        }
        else { // bar / line
          cfg = { type: t, data:{ labels, datasets:[{ data: values, backgroundColor: colorAlpha(palette.bar,0.7), borderColor: palette.line, tension:0.3, pointRadius:0 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:{ display:false }, y:{ display:false } } } };
        }
        new Chart(canvas, cfg);
      } catch {}

      const checkbox = card.querySelector('input[type="checkbox"]');
      const toggle = () => { const on = checkbox.checked; if (on) { catalogSelection.add(t); lastSelectedType = t; card.classList.add('selected'); } else { catalogSelection.delete(t); card.classList.remove('selected'); } };
      checkbox.addEventListener('change', toggle);
      card.addEventListener('click', (e) => { if (e.target === checkbox) return; checkbox.checked = !checkbox.checked; toggle(); });
      // Se elimina el botón de detalles por tarjeta; se usa el botón global del encabezado
      });
      updateIndicator();
    };

    renderGrid();

    // Abrir/cerrar dropdown
    if (_filterToggle && _filterDropdown) {
      // Al abrir el dropdown, habilitar cierre por clic fuera cada vez
      _filterToggle.addEventListener('click', () => {
        const isHidden = _filterDropdown.hasAttribute('hidden');
        if (isHidden) {
          _filterDropdown.removeAttribute('hidden');
          const onClickOutside = (ev) => {
            if (!_filterDropdown || _filterDropdown.hasAttribute('hidden')) return;
            const within = _filterDropdown.contains(ev.target) || _filterToggle.contains(ev.target);
            if (!within) {
              _filterDropdown.setAttribute('hidden','');
              document.removeEventListener('click', onClickOutside, true);
            }
          };
          document.addEventListener('click', onClickOutside, true);
        } else {
          _filterDropdown.setAttribute('hidden','');
        }
      });
    }

    // Listeners para cambios inmediatos
    if (dataTypeList) dataTypeList.querySelectorAll('input[type="radio"]').forEach(r => r.addEventListener('change', () => {
      window.catalogDataType = r.value;
      try { localStorage.setItem(LS_DATA_KEY, window.catalogDataType); } catch {}
      if (chartSection) chartSection.removeAttribute('hidden');
      // Habilitar/deshabilitar tipos de gráfica según compatibilidad
      if (chartTypeList) {
        const allowed = dataTypeCompatibility[window.catalogDataType] || types;
        chartTypeList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          const enable = allowed.includes(cb.value);
          cb.disabled = !enable;
          if (!enable && cb.checked) {
            cb.checked = false;
            const set = window.catalogActiveChartTypes || new Set();
            set.delete(cb.value);
            window.catalogActiveChartTypes = set;
            try { localStorage.setItem(LS_TYPES_KEY, JSON.stringify(Array.from(set))); } catch {}
          }
          const li = cb.closest('li'); if (li) { li.classList.toggle('disabled', !enable); }
        });
      }
      renderGrid();
      if (typeof updateIndicator === 'function') updateIndicator();
    }));
    if (chartTypeList) chartTypeList.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.addEventListener('change', () => {
      const set = window.catalogActiveChartTypes || new Set();
      if (cb.checked) set.add(cb.value); else set.delete(cb.value);
      window.catalogActiveChartTypes = set;
      try { localStorage.setItem(LS_TYPES_KEY, JSON.stringify(Array.from(set))); } catch {}
      renderGrid();
      if (typeof updateIndicator === 'function') updateIndicator();
    }));
    if (_filterResetBtn) _filterResetBtn.addEventListener('click', () => {
      window.catalogDataType = 'topUsersMonthly';
      window.catalogActiveChartTypes = new Set();
      try { localStorage.setItem(LS_DATA_KEY, window.catalogDataType); } catch {}
      try { localStorage.setItem(LS_TYPES_KEY, JSON.stringify([])); } catch {}
      if (dataTypeList) dataTypeList.querySelectorAll('input[type="radio"]').forEach(r => { r.checked = (r.value==='topUsersMonthly'); });
      if (chartTypeList) chartTypeList.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
      renderGrid();
      if (typeof updateIndicator === 'function') updateIndicator();
    });

    const applyBtn = document.getElementById('catalogFilterApplyBtn');
    if (applyBtn && _filterDropdown) applyBtn.addEventListener('click', () => { _filterDropdown.setAttribute('hidden',''); updateIndicator(); });
    // Asegurar texto del botón de filtro refleja tipo de dato
    const filterToggleBtn = document.getElementById('catalogFilterToggle');
    const updateFilterToggleText = () => {
      if (!filterToggleBtn) return;
      const dtKey = window.catalogDataType || 'topUsersMonthly';
      const dtLabel = (dataTypeOptions.find(o=>o.key===dtKey)?.name) || 'Tipo de dato';
      filterToggleBtn.textContent = `${tr('Filtrar','Filter')} · ${dtLabel}`;
    };
    updateFilterToggleText();
    document.getElementById('catalogDataTypeList')?.addEventListener('change', updateFilterToggleText);

    // Acciones del modal catálogo
    if (_confirm) _confirm.addEventListener('click', (e) => {
      e.preventDefault(); e.stopImmediatePropagation();
      const typesToAdd = Array.from(catalogSelection);
      // Añadir con pequeño desfase para sortear el antirebote (300ms)
      typesToAdd.forEach((t, idx) => {
        setTimeout(() => {
          try { addWidget(t); } catch (err) { console.error('Error al agregar widget', t, err); }
        }, 350 * idx);
      });
      // Guardar y ajustar tras el último añadido
      const totalDelay = 350 * (typesToAdd.length + 1);
      setTimeout(() => { try { saveLayout(); adjustGridHeight(); } catch {} }, totalDelay);
      closeCatalogModal();
    });
    if (_close) _close.addEventListener('click', () => { suppressInfoModalUntil = Date.now() + 600; closeCatalogModal(); });
    if (_clear) _clear.addEventListener('click', () => { grid.removeAll(); adjustGridHeight(); localStorage.removeItem(STORAGE_KEY); });
    // Botón Detalles siempre disponible; si no hay selección, se mostrará el primer tipo
    if (_details) {
      _details.disabled = false;
      _details.setAttribute('aria-disabled', 'false');
    }
    if (_details) {
      _details.addEventListener('mousedown', () => _details.classList.add('pressed'));
      _details.addEventListener('mouseup', () => _details.classList.remove('pressed'));
      _details.addEventListener('mouseleave', () => _details.classList.remove('pressed'));
      _details.addEventListener('click', (e) => {
        e.preventDefault();
        const t = lastSelectedType || Array.from(catalogSelection)[0] || types[0];
        swapCatalogView('details', t, types);
      });
    }

    // Botón Volver al catálogo
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        swapCatalogView('grid');
      });
    }

    const backdropEl = document.querySelector('#catalogModal .modal-backdrop');
    if (backdropEl) { const clone = backdropEl.cloneNode(true); backdropEl.parentNode.replaceChild(clone, backdropEl); clone.addEventListener('click', () => { suppressInfoModalUntil = Date.now() + 600; closeCatalogModal(); }); }
    // Estado inicial de vistas consistente
    initializeCatalogViews();

    modal.classList.add('show'); modal.removeAttribute('hidden');
    // Cerrar con tecla ESC
    const onEsc = (ev) => { if (ev.key === 'Escape') { suppressInfoModalUntil = Date.now() + 600; closeCatalogModal(); } };
    document.addEventListener('keydown', onEsc, { once: true });
    if (window.lucide && typeof window.lucide.createIcons === 'function') { try { window.lucide.createIcons(); } catch {} }
  }

  function initializeCatalogViews() {
    const gridView = document.getElementById('catalogGrid');
    const detailsView = document.getElementById('catalogDetailsView');
    const confirmBtn = document.getElementById('catalogConfirmBtn');
    if (!gridView || !detailsView) return;
    // Quitar hidden para permitir transición por clases
    detailsView.removeAttribute('hidden');
    gridView.removeAttribute('hidden');
    // Marcar grid activo y detalles inactivo
    gridView.classList.add('active');
    detailsView.classList.remove('active');
    gridView.setAttribute('aria-hidden','false');
    detailsView.setAttribute('aria-hidden','true');
    // Asegurar que el botón Agregar esté visible al iniciar en el catálogo
    if (confirmBtn) confirmBtn.hidden = false;
    // Fallback visual por si las clases no aplican
    gridView.style.opacity = '1';
    detailsView.style.opacity = '0';
  }

  // Transición entre vista de catálogo y detalles dentro del mismo modal
  function swapCatalogView(target, renderType, typeOrder) {
    const gridView = document.getElementById('catalogGrid');
    const detailsView = document.getElementById('catalogDetailsView');
    const backBtn = document.getElementById('catalogBackBtn');
    const confirmBtn = document.getElementById('catalogConfirmBtn');
    const filterToggle = document.getElementById('catalogFilterToggle');
    const filterIndicator = document.getElementById('catalogFilterIndicator');
    const clearBtn = document.getElementById('catalogClearBtn');
    const detailsBtn = document.getElementById('catalogDetailsBtn');
    if (!gridView || !detailsView) return;
    const enterEl = target === 'details' ? detailsView : gridView;
    const exitEl = target === 'details' ? gridView : detailsView;
    // Actualizar accesibilidad
    exitEl.setAttribute('aria-hidden','true');
    enterEl.setAttribute('aria-hidden','false');
    // Animación de intercambio (crossfade)
    requestAnimationFrame(() => {
      exitEl.classList.remove('active');
      enterEl.classList.add('active');
      // Fallback inline
      exitEl.style.opacity = '0';
      enterEl.style.opacity = '1';
    });
    // Mostrar el botón "Agregar seleccionados" solo en la vista de catálogo
    if (confirmBtn) confirmBtn.hidden = (target === 'details');
    // En detalles: solo debe aparecer "Volver"; ocultar filtros y acciones
    const detailsMode = (target === 'details');
    if (filterToggle) filterToggle.hidden = detailsMode;
    if (filterIndicator) filterIndicator.hidden = true; // Se elimina el chip azul duplicado
    if (clearBtn) clearBtn.hidden = detailsMode;
    if (detailsBtn) detailsBtn.hidden = detailsMode;
    if (target === 'details') {
      if (backBtn) backBtn.hidden = false;
      setTimeout(() => {
        try {
          // Actualizar encabezado
          const typeLabelEl = document.getElementById('catalogDetailsType');
          if (typeLabelEl) typeLabelEl.textContent = `Tipo: ${renderType}`;
          const titleEl = document.getElementById('catalogDetailsTitle');
          if (titleEl) titleEl.textContent = 'Detalles de la gráfica';
          renderCatalogDetailsView(renderType, typeOrder);
          enterEl.focus();
        } catch(e) { console.error('Error al renderizar detalles', e); }
      }, 180);
    } else {
      // Volver al grid: destruir chart si existe y ocultar botón volver
      const canvas = document.getElementById('catalogDetailsCanvas');
      const existingChart = (window.Chart && typeof window.Chart.getChart === 'function') ? window.Chart.getChart(canvas) : null;
      if (existingChart) { try { existingChart.destroy(); } catch {} }
      if (backBtn) backBtn.hidden = true;
    }
  }

  // Renderiza la vista de detalles dentro del catálogo
  function renderCatalogDetailsView(type, typeOrder) {
    const canvas = document.getElementById('catalogDetailsCanvas');
    const stats = document.getElementById('catalogDetailsStats');
    const table = document.getElementById('catalogDetailsTable');
    const prevBtn = document.getElementById('catalogPrev');
    const nextBtn = document.getElementById('catalogNext');
    if (!canvas || !stats || !table) return;

    let currentType = type;
    let idx = Math.max(0, typeOrder.indexOf(currentType));

    const render = () => {
      // Destruir instancia previa
      const existingChart = (window.Chart && typeof window.Chart.getChart === 'function') ? window.Chart.getChart(canvas) : null;
      if (existingChart) { try { existingChart.destroy(); } catch {} }
      const palette = getThemePalette();
      const ctx = canvas.getContext('2d');
      // Garantizar tamaño explícito del canvas para evitar render en cero
      canvas.width = canvas.clientWidth || canvas.parentElement?.clientWidth || 600;
      const cssH = parseInt(getComputedStyle(canvas).height, 10);
      canvas.height = (!isNaN(cssH) && cssH > 0) ? cssH : (canvas.clientHeight || 300);
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight || 300);
      grad.addColorStop(0, colorAlpha(palette.line, 0.6)); grad.addColorStop(1, colorAlpha(palette.line, 0.15));
      const labels = (currentType==='pie'||currentType==='doughnut') ? tr(['Abiertos','En progreso','Cerrados'],['Open','In progress','Closed']) : tr(['Ene','Feb','Mar','Abr','May','Jun'],['Jan','Feb','Mar','Apr','May','Jun']);
      let data = (currentType==='pie'||currentType==='doughnut') ? [12,8,20] : [12,19,8,15,22,30];
      if (currentType==='polarArea') { data = [11,16,7,12]; }
      if (currentType==='radar') { data = [65,59,80,81,56]; }
      const bgPlugin = { id:'chartAreaBg', beforeDraw(chart){ const ctx = chart.ctx; const chartArea = chart.chartArea; if (!chartArea) return; ctx.save(); ctx.fillStyle = '#f8fafc'; ctx.fillRect(chartArea.left, chartArea.top, chartArea.right-chartArea.left, chartArea.bottom-chartArea.top); ctx.restore(); } };

      const axisTitles = (() => {
        if (currentType === 'barH') return { x: tr('Valor','Value'), y: tr('Categoría','Category') };
        if (currentType === 'radar') return { r: tr('Puntuación','Score') };
        if (currentType === 'pie' || currentType === 'doughnut' || currentType === 'polarArea') return {};
        return { x: tr('Mes','Month'), y: tr('Valor','Value') };
      })();

      let cfg;
      if (currentType === 'pie' || currentType === 'doughnut') {
        cfg = { type: currentType, data: { labels, datasets:[{ data, backgroundColor: getThemePalette().series.slice(0, Math.max(3, data.length)), borderColor:'#fff', borderWidth:2 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ color: palette.text } } } }, plugins:[bgPlugin] };
      } else if (currentType === 'polarArea') {
        cfg = { type: 'polarArea', data: { labels, datasets:[{ data, backgroundColor: getThemePalette().series.slice(0, data.length) }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ color: palette.text } } } }, plugins:[bgPlugin] };
      } else if (currentType === 'radar') {
        cfg = { type: 'radar', data: { labels, datasets:[{ label: tr('Métricas','Metrics'), data, borderColor: palette.line, backgroundColor: colorAlpha(palette.line, 0.25), pointBackgroundColor: palette.line, borderWidth:2 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ color: palette.text } } }, scales:{ r:{ angleLines:{ color: palette.grid }, grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.r, text: axisTitles.r, color: palette.text } } } }, plugins:[bgPlugin] };
      } else if (currentType === 'barH') {
        cfg = { type: 'bar', data: { labels, datasets:[{ label: tr('Barras horizontales','Horizontal bars'), data, borderColor: palette.bar, backgroundColor: colorAlpha(palette.bar, 0.7) }] }, options:{ responsive:true, maintainAspectRatio:false, indexAxis:'y', plugins:{ legend:{ position:'bottom', labels:{ color: palette.text } } }, scales:{ x:{ grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.x, text: axisTitles.x, color: palette.text } }, y:{ grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.y, text: axisTitles.y, color: palette.text } } } }, plugins:[bgPlugin] };
      } else if (currentType === 'area') {
        cfg = { type: 'line', data: { labels, datasets:[{ label: tr('Área','Area'), data, borderColor: palette.line, backgroundColor: grad, fill:true, tension:0.35 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ color: palette.text } } }, scales:{ x:{ grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.x, text: axisTitles.x, color: palette.text } }, y:{ grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.y, text: axisTitles.y, color: palette.text } } } }, plugins:[bgPlugin] };
      } else if (currentType === 'mixed') {
        cfg = { type: 'bar', data: { labels, datasets:[
          { type:'bar', label: tr('Barras','Bars'), data:[12,19,8,15,22,30], backgroundColor: colorAlpha(palette.bar, 0.7), borderColor: palette.bar },
          { type:'line', label: tr('Línea','Line'), data:[10,18,9,14,20,28], borderColor: palette.line, backgroundColor: grad, fill:false, tension:0.3 }
        ] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ color: palette.text } } }, scales:{ x:{ grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.x, text: axisTitles.x, color: palette.text } }, y:{ grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.y, text: axisTitles.y, color: palette.text } } } }, plugins:[bgPlugin] };
      } else {
        cfg = { type: currentType, data: { labels, datasets:[{ label: currentType==='line'? tr('Línea','Line'):tr('Barras','Bars'), data, borderColor: currentType==='line'? palette.line: palette.bar, backgroundColor: currentType==='line'? grad: colorAlpha(palette.bar, 0.7), fill: currentType==='line' }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ color: palette.text } } }, scales:{ x:{ grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.x, text: axisTitles.x, color: palette.text } }, y:{ grid:{ color: palette.grid }, ticks:{ color: palette.text }, title:{ display: !!axisTitles.y, text: axisTitles.y, color: palette.text } } } }, plugins:[bgPlugin] };
      }
      try {
        cfg.options = mergeOptions(cfg.options || {}, getAnimationOptions(currentType));
        const chart = new Chart(canvas, cfg);
        canvas._chartInstance = chart;
      } catch(e) { console.error('Error detalles catálogo', e); }
      const sum = data.reduce((a,b)=>a+(typeof b==='number'?b:0),0);
      const min = data.reduce((m,v)=> typeof v==='number'?Math.min(m,v):m, Number.POSITIVE_INFINITY);
      const max = data.reduce((m,v)=> typeof v==='number'?Math.max(m,v):m, Number.NEGATIVE_INFINITY);
      const avg = data.length ? (sum/data.length) : 0;
      stats.innerHTML = `
        <div class="metric"><strong>${tr('Total:','Total:')}</strong> ${sum.toFixed(2)}</div>
        <div class="metric"><strong>${tr('Promedio:','Average:')}</strong> ${avg.toFixed(2)}</div>
        <div class="metric"><strong>${tr('Mínimo:','Min:')}</strong> ${isFinite(min)?min.toFixed(2):'-'}</div>
        <div class="metric"><strong>${tr('Máximo:','Max:')}</strong> ${isFinite(max)?max.toFixed(2):'-'}</div>
      `;
      table.innerHTML = `
        <thead><tr><th>${tr('Etiqueta','Label')}</th><th>${tr('Valor','Value')}</th></tr></thead>
        <tbody>${labels.map((l,i)=>`<tr><td>${l}</td><td>${(typeof data[i]==='number'?data[i]:'-')}</td></tr>`).join('')}</tbody>
      `;
    };

    render();
    if (prevBtn) prevBtn.addEventListener('click', () => { idx = (idx - 1 + typeOrder.length) % typeOrder.length; currentType = typeOrder[idx]; render(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { idx = (idx + 1) % typeOrder.length; currentType = typeOrder[idx]; render(); });
  }

  function closeCatalogModal() {
    const modal = document.getElementById('catalogModal');
    if (!modal) return;
    modal.classList.add('closing');
    setTimeout(() => {
      modal.classList.remove('show');
      modal.classList.remove('closing');
      modal.setAttribute('hidden','true');
    }, 180);
  }

  // Modal de Peticiones
  let requestsState = { view: 'my', query: '', all: [], my: [], received: [], lastOption: 'menu', criteria: null, filterMode: null };
  function loadRequests() {
    // Fuente dinámica: si existe window.REQUESTS_DATA se usa, si no, ejemplo
    const demo = [
      { objetivo:'Patrocinios seguros', referencia:'Al menos 5 asociaciones nuevas', equipo:'Equipo de marketing', responsable:'Rafael Urbina', fecha:'10 jun 2030', estado:'Culminado' },
      { objetivo:'Mejora de presencia virtual', referencia:'Aumento del 25 % en la interacción del post', equipo:'Equipo de redes sociales', responsable:'—', fecha:'17 jun 2030', estado:'En curso' },
      { objetivo:'Aumentar la tasa de respuestas', referencia:'Aumento del 40 % en el prerregistro', equipo:'Equipo de marketing', responsable:'—', fecha:'24 jun 2030', estado:'Bloqueado' },
      { objetivo:'Mejorar la interacción de los asistentes', referencia:'80 % en sesiones y encuestas', equipo:'Equipo del evento', responsable:'—', fecha:'25 jun 2030', estado:'Culminado' },
      { objetivo:'Generar clientes potenciales', referencia:'500 nuevos contactos', equipo:'Equipo de marketing', responsable:'—', fecha:'27 jun 2030', estado:'En curso' },
      { objetivo:'Mejorar la satisfacción', referencia:'90 % satisfacción en encuestas', equipo:'Equipo de marketing', responsable:'—', fecha:'29 jun 2030', estado:'Bloqueado' }
    ];
    const extra = [
      { objetivo:'Recursos de marca', referencia:'Anuncios y banners semana 3', equipo:'Equipo de diseño', responsable:'—', fecha:'11 jun 2030', estado:'Culminado' },
      { objetivo:'Propuesta de presupuesto', referencia:'Cálculo final semana 2', equipo:'Equipo de compras', responsable:'—', fecha:'12 jun 2030', estado:'Bajo revisión' },
      { objetivo:'Contratos proveedores', referencia:'5 proveedores confirmados', equipo:'Compras', responsable:'—', fecha:'13 jun 2030', estado:'En curso' }
    ];
    const src = Array.isArray(window.REQUESTS_DATA) ? window.REQUESTS_DATA : demo.concat(extra);
    return src;
  }

  function splitRequests(list) {
    const my = [];
    const received = [];
    const tagOf = (r) => {
      const v = r && (r.view || r.direction || r.dir || r.tipo || r.category || r.origen || r.source);
      return (v || '').toString().toLowerCase();
    };
    for (let i = 0; i < list.length; i++) {
      const r = list[i];
      const tag = tagOf(r);
      const sent = r && (r.sentByMe === true || r.my === true || tag === 'my' || tag === 'mis' || tag === 'sent' || tag === 'enviadas');
      const recv = r && (r.received === true || tag === 'received' || tag === 'recibidas' || tag === 'recibida');
      if (sent) my.push(r);
      else if (recv) received.push(r);
      else (i < Math.ceil(list.length / 2) ? my : received).push(r);
    }
    return { my, received };
  }

  function getTextFields(r) {
    const vals = [r?.objetivo, r?.referencia, r?.equipo, r?.responsable, r?.fecha, r?.estado, r?.remitente, r?.destinatario, r?.autor, r?.de, r?.para, r?.from, r?.to];
    return vals.filter(Boolean).map(v => v.toString().toLowerCase());
  }

  function filterRequests(list, q) {
    const t = (q || '').trim().toLowerCase();
    if (!t) return list;
    const tokens = t.split(/\s+/);
    return list.filter(r => {
      const vals = getTextFields(r);
      return tokens.every(tok => vals.some(v => v.includes(tok)));
    });
  }

  function parseDateText(s) {
    if (!s) return null;
    const d1 = new Date(s);
    if (!isNaN(d1.getTime())) return d1;
    const m = String(s).trim().toLowerCase().match(/^(\d{1,2})\s+([a-zñ\.]+)\s+(\d{4})$/);
    if (m) {
      const months = { 'ene':0,'feb':1,'mar':2,'abr':3,'may':4,'jun':5,'jul':6,'ago':7,'sep':8,'oct':9,'nov':10,'dic':11,'jan':0,'feb':1,'mar':2,'apr':3,'may':4,'jun':5,'jul':6,'aug':7,'sep':8,'oct':9,'nov':10,'dec':11 };
      const dd = Number(m[1]);
      const mm = months[m[2].slice(0,3)] ?? months[m[2]];
      const yyyy = Number(m[3]);
      if (mm !== undefined) return new Date(yyyy, mm, dd);
    }
    const m2 = String(s).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m2) return new Date(Number(m2[1]), Number(m2[2]) - 1, Number(m2[3]));
    return null;
  }

  function filterRequestsAdvanced(list, c) {
    if (!c) return list;
    const reported = String(c.reportedBy||'').trim().toLowerCase();
    const pid = String(c.id||'').trim().toLowerCase();
    const assigned = String(c.assignedTo||'').trim().toLowerCase();
    const category = String(c.category||'').trim().toLowerCase();
    const dept = String(c.department||'').trim().toLowerCase();
    const status = String(c.status||'').trim().toLowerCase();
    const priority = String(c.priority||'').trim().toLowerCase();
    const kw = String(c.keywords||'').trim().toLowerCase();
    const tokens = kw ? kw.split(/\s+/) : [];
    const fields = c.fields||{ title:true, description:true, solution:true };
    const from = c.dateFrom ? new Date(c.dateFrom) : null;
    const to = c.dateTo ? new Date(c.dateTo) : null;
    const fromOk = from && !isNaN(from.getTime()) ? from : null;
    const toOk = to && !isNaN(to.getTime()) ? to : null;
    const res = list.filter(r => {
      if (reported && ![r?.remitente,r?.autor,r?.de,r?.from].filter(Boolean).map(v=>String(v).toLowerCase()).some(v=>v.includes(reported))) return false;
      if (pid && String(r?.id||'').toLowerCase() !== pid) return false;
      if (assigned && !String(r?.responsable||'').toLowerCase().includes(assigned)) return false;
      if (category && ![r?.category,r?.tipo].filter(Boolean).map(v=>String(v).toLowerCase()).some(v=>v.includes(category))) return false;
      if (dept && !String(r?.equipo||'').toLowerCase().includes(dept)) return false;
      if (status && !String(r?.estado||'').toLowerCase().includes(status)) return false;
      if (priority && !String(r?.priority||'').toLowerCase().includes(priority)) return false;
      if (tokens.length) {
        const pool = [];
        if (fields.title) pool.push(String(r?.objetivo||'').toLowerCase());
        if (fields.description) pool.push(String(r?.referencia||'').toLowerCase());
        if (fields.solution) pool.push(String(r?.notas||'').toLowerCase());
        if (!tokens.every(t=>pool.some(v=>v && v.includes(t)))) return false;
      }
      if (fromOk || toOk) {
        const rf = parseDateText(r?.fecha);
        if (!rf) return false;
        if (fromOk && rf < fromOk) return false;
        if (toOk && rf > toOk) return false;
      }
      return true;
    });
    const order = String(c.orderBy||'').trim().toLowerCase();
    if (order) {
      const keyOf = (r) => {
        if (order==='fecha') return parseDateText(r?.fecha)?.getTime()||0;
        if (order==='estado') return String(r?.estado||'').toLowerCase();
        if (order==='responsable') return String(r?.responsable||'').toLowerCase();
        if (order==='equipo') return String(r?.equipo||'').toLowerCase();
        if (order==='objetivo' || order==='titulo' || order==='title') return String(r?.objetivo||'').toLowerCase();
        if (order==='id') return String(r?.id||'');
        return String(r?.objetivo||'').toLowerCase();
      };
      res.sort((a,b)=>{
        const va = keyOf(a); const vb = keyOf(b);
        if (typeof va === 'number' && typeof vb === 'number') return va - vb;
        return String(va).localeCompare(String(vb));
      });
    }
    return res;
  }

  function collectSuggestions(all) {
    const map = new Map();
    const add = (v) => { if (!v) return; const s = v.toString().trim(); if (!s) return; const k = s.toLowerCase(); if (!map.has(k)) map.set(k, s); };
    for (const r of all) {
      add(r?.responsable); add(r?.equipo); add(r?.estado); add(r?.fecha); add(r?.objetivo); add(r?.referencia);
      add(r?.remitente); add(r?.destinatario); add(r?.autor); add(r?.de); add(r?.para); add(r?.from); add(r?.to);
    }
    return Array.from(map.values());
  }

  function updateSuggestionsUI(query) {
    const el = document.getElementById('requestsSearchSuggestions');
    if (!el) return;
    const candidates = collectSuggestions(requestsState.all);
    const t = (query || '').trim().toLowerCase();
    const list = t ? candidates.filter(s => s.toLowerCase().includes(t)).slice(0, 8) : [];
    el.innerHTML = list.map((s, i) => `<li data-index="${i}">${s}</li>`).join('');
    el.hidden = list.length === 0;
  }

  function updateRequestsList() {
    let src = requestsState.view === 'my' ? requestsState.my : requestsState.received;
    if (requestsState.filterMode === 'closed_all') src = requestsState.all;
    else if (requestsState.filterMode === 'closed_my') src = requestsState.my;
    else if (requestsState.filterMode === 'closed_received') src = requestsState.received;
    const base = (requestsState.lastOption === 'search' && requestsState.criteria) ? filterRequestsAdvanced(src, requestsState.criteria) : filterRequests(src, requestsState.query);
    const final = (requestsState.filterMode && requestsState.filterMode.startsWith('closed'))
      ? base.filter(r => String(r?.estado||'').toLowerCase().includes('culminado'))
      : base;
    renderRequests(final);
  }

  function setRequestsView(view) {
    const myBtn = document.getElementById('reqTabMy');
    const recBtn = document.getElementById('reqTabReceived');
    const fMy = document.getElementById('rqFilterMy');
    const fRec = document.getElementById('rqFilterReceived');
    const cAll = document.getElementById('rqFilterClosedAll');
    const cMine = document.getElementById('rqFilterClosedMine');
    const cAssigned = document.getElementById('rqFilterClosedAssigned');
    requestsState.view = view;
    if (myBtn && recBtn) {
      if (view === 'my') {
        myBtn.classList.add('active'); myBtn.setAttribute('aria-selected','true');
        recBtn.classList.remove('active'); recBtn.setAttribute('aria-selected','false');
      } else {
        recBtn.classList.add('active'); recBtn.setAttribute('aria-selected','true');
        myBtn.classList.remove('active'); myBtn.setAttribute('aria-selected','false');
      }
    }
    if (fMy && fRec) {
      if (view === 'my') {
        fMy.classList.add('active');
        fRec.classList.remove('active');
      } else {
        fRec.classList.add('active');
        fMy.classList.remove('active');
      }
    }
    if (cAll || cMine || cAssigned) {
      const set = (el, on) => { if (!el) return; if (on) el.classList.add('active'); else el.classList.remove('active'); };
      if (requestsState.filterMode === 'closed_all') { set(cAll,true); set(cMine,false); set(cAssigned,false); }
      else if (requestsState.filterMode === 'closed_my') { set(cAll,false); set(cMine,true); set(cAssigned,false); }
      else if (requestsState.filterMode === 'closed_received') { set(cAll,false); set(cMine,false); set(cAssigned,true); }
      else { set(cAll,false); set(cMine,false); set(cAssigned,false); }
    }
    updateRequestsList();
  }

  function setClosedActive(which) {
    const cAll = document.getElementById('rqFilterClosedAll');
    const cMine = document.getElementById('rqFilterClosedMine');
    const cAssigned = document.getElementById('rqFilterClosedAssigned');
    const set = (el, on) => { if (!el) return; if (on) el.classList.add('active'); else el.classList.remove('active'); };
    set(cAll, which === 'all');
    set(cMine, which === 'mine');
    set(cAssigned, which === 'assigned');
  }

  function setupRequestsSearch() {
    const input = document.getElementById('requestsSearchInput');
    const sugg = document.getElementById('requestsSearchSuggestions');
    if (!input || !sugg) return;
    if (!input.dataset.inited) {
      input.addEventListener('input', (e) => {
        requestsState.query = e.target.value || '';
        updateSuggestionsUI(requestsState.query);
        updateRequestsList();
      });
      input.addEventListener('keydown', (e) => {
        const items = Array.from(sugg.querySelectorAll('li'));
        if (sugg.hidden || items.length === 0) return;
        let idx = items.findIndex(x => x.classList.contains('active'));
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          idx = Math.min(idx + 1, items.length - 1);
          items.forEach(x => x.classList.remove('active'));
          items[idx].classList.add('active');
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          idx = Math.max(idx - 1, 0);
          items.forEach(x => x.classList.remove('active'));
          items[idx].classList.add('active');
        } else if (e.key === 'Enter') {
          const act = items[idx >= 0 ? idx : 0];
          if (act) {
            requestsState.query = act.textContent || '';
            input.value = requestsState.query;
            sugg.hidden = true;
            updateRequestsList();
          }
        } else if (e.key === 'Escape') {
          sugg.hidden = true;
        }
      });
      input.addEventListener('blur', () => { setTimeout(() => { sugg.hidden = true; }, 100); });
      sugg.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        requestsState.query = li.textContent || '';
        input.value = requestsState.query;
        sugg.hidden = true;
        updateRequestsList();
      });
      input.dataset.inited = 'true';
    }
  }

  function badgeClass(estado) {
    const e = (estado||'').toLowerCase();
    if (e.includes('culmin')) return 'badge-success';
    if (e.includes('curso') || e.includes('revisión')) return 'badge-warning';
    return 'badge-danger';
  }

  // Etiqueta de estado traducida, disponible para lista y detalles
  function statusLabel(s) {
    const sv = (s||'').toLowerCase();
    if (sv.includes('culmin')) return tr('Culminado','Completed');
    if (sv.includes('curso')) return tr('En curso','In progress');
    if (sv.includes('bloque')) return tr('Bloqueado','Blocked');
    if (sv.includes('revisión')) return tr('Bajo revisión','Under review');
    return s || '';
  }

  function renderRequests(list) {
    const el = document.getElementById('requestsList');
    if (!el) return;
    const items = list.map((r, i) => `
      <li class="request-item" role="button" tabindex="0" data-index="${i}" aria-label="${tr('Ver detalles de','View details of')} ${r.objetivo}">
        <div class="request-title">${r.objetivo}</div>
        <div class="request-meta">${r.referencia}</div>
        <div class="request-meta">${r.equipo}</div>
        <div class="request-meta">${r.responsable || '—'}</div>
        <div class="request-meta">${r.fecha}</div>
        <div><span class="request-badge ${badgeClass(r.estado)}">${statusLabel(r.estado)}</span></div>
      </li>
    `).join('');
    el.innerHTML = items;
    if (!el.dataset.inited) {
      el.addEventListener('click', onRequestActivate);
      el.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList.contains('request-item')) {
          e.preventDefault();
          onRequestActivate(e);
        }
      });
      el.dataset.inited = 'true';
    }
  }

  function attachmentIcon(nameOrUrl) {
    const s = (nameOrUrl||'').toLowerCase();
    if (s.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return 'image';
    if (s.match(/\.(xlsx|xls|csv)$/)) return 'file-spreadsheet';
    if (s.match(/\.(mp4|mov|webm|mkv)$/)) return 'video';
    if (s.match(/\.(mp3|wav|ogg)$/)) return 'audio';
    if (s.match(/\.(zip|rar|7z|tar|gz)$/)) return 'file-archive';
    if (s.match(/\.(pdf)$/)) return 'file-text';
    if (s.match(/\.(txt|md)$/)) return 'file-text';
    if (s.match(/\.(js|ts|json|xml|yml|yaml|html|css)$/)) return 'file-code';
    if (s.startsWith('http')) return 'link';
    return 'file';
  }

  function buildDetailsHTML(r) {
    const notas = r.notas ? r.notas : tr('Sin notas','No notes');
    const adjuntos = Array.isArray(r.adjuntos) ? r.adjuntos : [];
    const adjCount = adjuntos.length;
    const adjuntosHTML = adjCount
      ? `<ul class="attachments-list" role="list">${adjuntos.map((a,i)=>{
            const label = a?.nombre || (tr('Archivo','File')+' '+(i+1));
            const url = a?.url || '#';
            const icon = attachmentIcon(a?.nombre || a?.url || '');
            const size = typeof a?.size === 'number' ? bytesToSize(a.size) : '';
            const meta = size ? `<span class="request-meta">${size}</span>` : '';
            return `<li class="attachment-item" role="listitem">
                      <div class="attachment-left">
                        <span class="attachment-icon" aria-hidden="true"><span data-lucide="${icon}"></span></span>
                        <span class="attachment-name">${label}</span>
                        ${meta}
                      </div>
                      <div class="attachment-actions">
                        <a class="attachment-open-btn" href="${url}" target="_blank" rel="noopener" aria-label="${tr('Abrir adjunto','Open attachment')} ${label}">${tr('Abrir','Open')}</a>
                      </div>
                    </li>`;
          }).join('')}</ul>`
      : `<div class="request-meta">${tr('Sin adjuntos','No attachments')}</div>`;
    const cat = r.category || r.objetivo || '—';
    const prio = r.priority || '—';
    const assign = r.responsable || '—';
    const time = (r.timeSpent || r.timeSpent === 0) ? r.timeSpent : '—';
    const dept = r.dept || r.equipo || '—';
    const user = r.user || '—';
    const email = r.email || '—';
    const location = r.location || '—';
    const phone = r.phone || '—';
    return `
      <section class="details-section" aria-labelledby="sec-main">
        <div class="details-grid">
          <div class="details-card" aria-labelledby="sec-contact">
            <div id="sec-contact" class="details-title">${tr('Información de contacto','Contact information')}</div>
            <div><strong>${tr('Usuario:','User:')}</strong> ${user}</div>
            <div><strong>${tr('E‑mail:','E‑mail:')}</strong> ${email}</div>
            <div><strong>${tr('Departamento:','Department:')}</strong> ${dept}</div>
            <div><strong>${tr('Ubicación:','Location:')}</strong> ${location}</div>
            <div><strong>${tr('Teléfono:','Phone:')}</strong> ${phone}</div>
          </div>
          <div class="details-card" aria-labelledby="sec-class">
            <div id="sec-class" class="details-title">${tr('Clasificación','Classification')}</div>
            <div><strong>${tr('Categoría:','Category:')}</strong> ${cat}</div>
            <div><strong>${tr('Estado:','Status:')}</strong> <span class="request-badge ${badgeClass(r.estado)}">${statusLabel(r.estado)}</span></div>
            <div><strong>${tr('Prioridad:','Priority:')}</strong> ${prio}</div>
            <div><strong>${tr('Asignado a:','Assign to:')}</strong> ${assign}</div>
            <div><strong>${tr('Fecha límite:','Due date:')}</strong> ${r.fecha || '—'}</div>
            <div><strong>${tr('Tiempo invertido (minutos):','Time spent (minutes):')}</strong> ${time}</div>
          </div>
          <div class="details-card" aria-labelledby="sec-prob">
            <div id="sec-prob" class="details-title">${tr('Información del problema','Problem information')}</div>
            <div>${notas}</div>
          </div>
          <div class="details-card" aria-labelledby="sec-adjuntos">
            <div id="sec-adjuntos" class="details-title">${tr('Adjuntos','Attachments')} <span class="details-count">(${adjCount})</span></div>
            ${adjuntosHTML}
          </div>
        </div>
      </section>
    `;
  }

  function onRequestActivate(e) {
    const item = e.target.closest('.request-item');
    if (!item) return;
    const idx = Number(item.getAttribute('data-index'));
    const base = requestsState.view === 'my' ? requestsState.my : requestsState.received;
    const current = (requestsState.lastOption === 'search' && requestsState.criteria)
      ? filterRequestsAdvanced(base, requestsState.criteria)
      : filterRequests(base, requestsState.query);
    const r = current[idx];
    if (!r) return;
    const detailsPanel = document.getElementById('requestDetailsPanel');
    const listPanel = document.getElementById('requestsListPanel');
    const content = document.getElementById('requestDetailsContent');
    const backBtn = document.getElementById('requestDetailsBack');
    const container = document.getElementById('requestsContainer');
    if (!detailsPanel || !listPanel || !content || !backBtn) return;
    content.innerHTML = buildDetailsHTML(r);
    if (window.lucide && window.lucide.createIcons) { window.lucide.createIcons(); }
    detailsPanel.hidden = false;
    detailsPanel.setAttribute('aria-hidden','false');
    // Fuerza reflow antes de aplicar la clase para garantizar la animación
    void detailsPanel.offsetWidth;
    detailsPanel.classList.add('show');
    listPanel.classList.add('dimmed');
    if (container) container.classList.add('overlaying');
    backBtn.focus();
    const onBack = () => {
      detailsPanel.classList.remove('show');
      listPanel.classList.remove('dimmed');
      detailsPanel.setAttribute('aria-hidden','true');
      detailsPanel.hidden = true;
      if (container) container.classList.remove('overlaying');
      item.focus();
      backBtn.removeEventListener('click', onBack);
      detailsPanel.removeEventListener('keydown', onKey);
    };
    const onKey = (ev) => { if (ev.key === 'Escape') { ev.preventDefault(); onBack(); } };
    backBtn.addEventListener('click', onBack);
    detailsPanel.addEventListener('keydown', onKey);
  }

  function trapFocus(modal) {
    const focusables = modal.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusables[0]; const last = focusables[focusables.length - 1];
    const onKey = (ev) => {
      if (ev.key === 'Escape') { closeRequestsModal(); }
      if (ev.key === 'Tab') {
        if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
        else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
      }
    };
    modal.addEventListener('keydown', onKey);
    setTimeout(() => { (first || modal).focus(); }, 0);
  }

  function ensureRequestsModal() {
    try { console.debug('Peticiones: ensureRequestsModal()'); } catch (_) {}
    let modal = document.getElementById('requestsModal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'requestsModal';
    modal.className = 'modal';
    modal.setAttribute('hidden','true');
    modal.innerHTML = '<div class="modal-backdrop"></div><div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="requestsTitle"><div class="modal-header"><h2 id="requestsTitle">Peticiones</h2><div class="modal-header-actions"><button type="button" id="requestsClose" class="modal-close" aria-label="Cerrar"><span data-lucide="x"></span></button></div></div><div class="modal-content"><div class="requests-container" id="requestsContainer"><div class="requests-topbar" role="toolbar" aria-label="Navegación de peticiones"><div class="tabs" role="tablist"><button id="reqTabMy" class="tab-btn active" role="tab" aria-selected="true">Mis Peticiones</button><button id="reqTabReceived" class="tab-btn" role="tab" aria-selected="false">Peticiones Recibidas</button></div><div class="search-row" role="search"><div class="search-input-wrap"><input id="requestsSearchInput" type="text" placeholder="Buscar" aria-label="Buscar peticiones" autocomplete="off" /><ul id="requestsSearchSuggestions" class="search-suggestions" hidden aria-label="Sugerencias"></ul></div><button id="requestNewBtn" type="button" class="modal-add-btn" aria-label="Nueva petición">Nueva petición</button></div></div><div id="requestsListPanel" class="requests-panel"><ul id="requestsList" class="requests-list" aria-live="polite" aria-label="Lista de peticiones"></ul></div><div id="requestDetailsPanel" class="requests-panel details" hidden aria-hidden="true" aria-labelledby="requestDetailsTitle" role="region"><div class="details-header"><h3 id="requestDetailsTitle">Detalle de petición</h3><nav class="details-breadcrumb" aria-label="Miga de pan"><span>Peticiones</span><span class="sep">›</span><span>Detalle</span></nav><button type="button" id="requestDetailsBack" class="modal-secondary-btn" aria-label="Volver a la lista">Volver</button></div><div id="requestDetailsContent" class="details-content" aria-live="polite"></div></div><div id="requestNewPanel" class="requests-panel details" hidden aria-hidden="true" aria-labelledby="requestNewTitle" role="region"><div class="details-header"><h3 id="requestNewTitle">Nueva petición</h3><nav class="details-breadcrumb" aria-label="Miga de pan"><span>Peticiones</span><span class="sep">›</span><span>Nueva</span></nav><div class="details-actions"><button type="button" id="requestNewCancel" class="modal-secondary-btn" aria-label="Cancelar">Cancelar</button><button type="button" id="requestNewSave" class="modal-add-btn" aria-label="Guardar">Guardar</button></div></div><div id="requestNewContent" class="details-content" aria-live="polite"><div id="requestNewStatus" class="form-status" aria-live="polite"></div><form id="requestNewForm" class="request-form" aria-label="Formulario de nueva petición"><section class="details-section" aria-labelledby="sec-contact"><div class="details-title" id="sec-contact">Información de contacto</div><div class="form-grid"><div class="field"><label for="reqNewUser">Usuario<span aria-hidden="true">*</span></label><input id="reqNewUser" type="text" aria-required="true" /><div class="error-text" id="errUser"></div></div><div class="field"><label for="reqNewEmail">E‑mail<span aria-hidden="true">*</span></label><input id="reqNewEmail" type="email" placeholder="@socya.org.co" aria-required="true" /><div class="error-text" id="errEmail"></div></div><div class="field"><label for="reqNewDept">Departamento<span aria-hidden="true">*</span></label><select id="reqNewDept" aria-required="true"><option value="">Seleccione</option><option>Marketing</option><option>Compras</option><option>Diseño</option><option>TI</option><option>RRHH</option></select><div class="error-text" id="errDept"></div></div><div class="field"><label for="reqNewLocation">Ubicación</label><input id="reqNewLocation" type="text" /><div class="error-text" id="errLocation"></div></div><div class="field"><label for="reqNewPhone">Teléfono</label><input id="reqNewPhone" type="tel" /><div class="error-text" id="errPhone"></div></div></div></section><section class="details-section" aria-labelledby="sec-class"><div class="details-title" id="sec-class">Clasificación</div><div class="form-grid"><div class="field"><label for="reqNewCategory">Categoría<span aria-hidden="true">*</span></label><select id="reqNewCategory" aria-required="true"><option value="">Seleccione</option><option>General</option><option>Soporte</option><option>Finanzas</option><option>Operaciones</option></select><div class="error-text" id="errCategory"></div></div><div class="field"><label for="reqNewStatus">Estado<span aria-hidden="true">*</span></label><select id="reqNewStatus" aria-required="true"><option value="">Seleccione</option><option>Solicitado</option><option>En curso</option><option>Bloqueado</option><option>Culminado</option><option>Bajo revisión</option></select><div class="error-text" id="errStatus"></div></div><div class="field"><label for="reqNewPriority">Prioridad<span aria-hidden="true">*</span></label><select id="reqNewPriority" aria-required="true"><option value="">Seleccione</option><option>Baja</option><option>Media</option><option>Alta</option><option>Crítica</option></select><div class="error-text" id="errPriority"></div></div><div class="field"><label for="reqNewAssign">Asignar a<span aria-hidden="true">*</span></label><select id="reqNewAssign" aria-required="true"><option value="">Seleccione</option><option>Hernando Antonio</option><option>Rafael Urbina</option><option>Equipo de TI</option></select><div class="error-text" id="errAssign"></div></div><div class="field"><label for="reqNewTime">Tiempo invertido (minutos)</label><input id="reqNewTime" type="number" min="0" step="1" value="0" /><div class="error-text" id="errTime"></div></div></div></section><section class="details-section" aria-labelledby="sec-problem"><div class="details-title" id="sec-problem">Información del problema</div><div class="field"><label for="reqNewDescription">Descripción<span aria-hidden="true">*</span></label><textarea id="reqNewDescription" rows="6" aria-required="true" placeholder="Describe el problema"></textarea><div class="error-text" id="errDescription"></div></div></section><section class="details-section" aria-labelledby="sec-files"><div class="details-title" id="sec-files">Adjuntos</div><div class="field"><input id="reqNewFiles" type="file" multiple /><div class="file-hint">Formatos: .docx, .doc, .odt, .rtf, .xlsx, .xls, .csv, .xlsm, .ods, .pdf, .jpg, .jpeg, .png, .gif, .webp, .tiff, .tif, .svg. Máx por archivo: 10MB, total: 50MB.</div><ul id="reqNewFileList" class="file-list" aria-live="polite"></ul><div class="error-text" id="errFiles"></div></div></section><section class="details-section" aria-label="Confirmación"><div class="field"><label class="checkbox-row"><input id="reqNewConfirm" type="checkbox" /> <span>No enviar correo al usuario</span></label><div class="error-text" id="errConfirm"></div></div></section></form></div></div></div></div></div>';
    document.body.appendChild(modal);
    if (window.lucide && window.lucide.createIcons) { try { window.lucide.createIcons(); } catch {} }
    return modal;
  }

  function openRequestsModal() {
    try { console.debug('Peticiones: openRequestsModal()'); } catch (_) {}
    const modal = ensureRequestsModal();
    const closeBtn = document.getElementById('requestsClose');
    if (!modal) return;
    // Asegurar que todos los textos del dashboard/modales estén en el idioma actual
    try { if (typeof window.applyDashboardLanguage === 'function') window.applyDashboardLanguage(); } catch {}
    const titleEl = document.getElementById('requestsTitle'); if (titleEl) titleEl.textContent = tr('Peticiones','Requests');
    requestsState.all = loadRequests();
    const split = splitRequests(requestsState.all);
    requestsState.my = split.my;
    requestsState.received = split.received;
    if (!requestsState.lastOption || requestsState.lastOption === 'menu') {
      requestsState.view = 'my';
      requestsState.query = '';
    }
    updateSuggestionsUI('');
    const myBtn = document.getElementById('reqTabMy');
    const recBtn = document.getElementById('reqTabReceived');
    if (myBtn && !myBtn.dataset.inited) { myBtn.addEventListener('click', () => setRequestsView('my')); myBtn.dataset.inited = 'true'; }
    if (recBtn && !recBtn.dataset.inited) { recBtn.addEventListener('click', () => setRequestsView('received')); recBtn.dataset.inited = 'true'; }
    const newBtn = document.getElementById('requestNewBtn');
    if (newBtn && !newBtn.dataset.inited) { newBtn.addEventListener('click', () => openNewRequestForm()); newBtn.dataset.inited = 'true'; }
    initNewRequestForm();
    const filtersBarExisting = document.querySelector('#requestsContainer .requests-filters');
    if (!filtersBarExisting && container) {
      const fb = document.createElement('div');
      fb.className = 'requests-filters';
      fb.innerHTML = '<div class="filters-row"><button id="rqFilterMy" class="tab-btn" type="button">Mis Peticiones</button><div class="filters-closed"><button id="rqFilterClosedAll" class="tab-btn" type="button">Todos cerrados</button><button id="rqFilterClosedMine" class="tab-btn" type="button">Mis cerradas</button></div><div class="search-input-wrap"><input id="requestsSearchInput" type="text" placeholder="Buscar" aria-label="Buscar peticiones" autocomplete="off" /><ul id="requestsSearchSuggestions" class="search-suggestions" hidden aria-label="Sugerencias"></ul></div></div>';
      container.insertBefore(fb, listPanel);
    }
    const cancelBtn = document.getElementById('requestNewCancel');
    if (cancelBtn && !cancelBtn.dataset.inited) {
      cancelBtn.addEventListener('click', () => { closeNewRequestForm(); resetNewRequestForm(); });
      cancelBtn.dataset.inited = 'true';
    }
    const saveBtn = document.getElementById('requestNewSave');
    if (saveBtn && !saveBtn.dataset.inited) {
      saveBtn.addEventListener('click', onSaveNewRequest);
      saveBtn.dataset.inited = 'true';
    }
    modal.classList.add('show');
    modal.removeAttribute('hidden');
    const header = modal.querySelector('.modal-header');
    const titleEl2 = document.getElementById('requestsTitle');
    const getBackArrow = () => document.getElementById('requestsBackArrow');
    const removeBackArrow = () => { const b = getBackArrow(); if (b) { try { b.remove(); } catch(_){} } };
    const ensureBackArrow = () => {
      let b = getBackArrow();
      if (!b && header && titleEl2) {
        b = document.createElement('button');
        b.id = 'requestsBackArrow';
        b.type = 'button';
        b.className = 'modal-back-btn';
        b.innerHTML = '<span data-lucide="arrow-left"></span>';
        header.insertBefore(b, titleEl2);
        if (window.lucide && window.lucide.createIcons) { try { window.lucide.createIcons(); } catch {} }
      }
      return b;
    };
    let menuView = document.getElementById('requestsMenuView');
    const content = modal.querySelector('.modal-content');
    const container = document.getElementById('requestsContainer');
    const listPanel = document.getElementById('requestsListPanel');
    let searchView = document.getElementById('requestsSearchView');
    if (!menuView && content) {
      menuView = document.createElement('div');
      menuView.id = 'requestsMenuView';
      menuView.className = 'requests-view show';
      menuView.innerHTML = '<div class="requests-menu"><button id="rqMenuNew" class="menu-item" type="button"><span class="icon" data-lucide="file-plus"></span><span>Nueva solicitud</span></button><button id="rqMenuMy" class="menu-item" type="button"><span class="icon" data-lucide="user"></span><span>Mis solicitudes</span></button><button id="rqMenuProcess" class="menu-item" type="button"><span class="icon" data-lucide="workflow"></span><span>Pendientes del proceso</span></button><button id="rqMenuClosed" class="menu-item" type="button"><span class="icon" data-lucide="lock"></span><span>Cerrados</span></button><button id="rqMenuSearch" class="menu-item" type="button"><span class="icon" data-lucide="search"></span><span>Buscar solicitudes</span></button><button id="rqMenuEdit" class="menu-item" type="button"><span class="icon" data-lucide="pencil"></span><span>Editar información</span></button><button id="rqMenuSys" class="menu-item" type="button"><span class="icon" data-lucide="server"></span><span>Test configuration</span></button></div><div class="menu-section"><div class="menu-title">Buscar en la base de conocimiento</div><div class="menu-actions"><input id="rqKbInput" class="menu-input" type="text" placeholder="ID" /><button id="rqKbBtn" type="button" class="modal-add-btn">Buscar</button></div></div><div class="menu-section"><div class="menu-title">Ver problemas por usuario</div><div class="menu-actions"><select id="rqUserSelect" class="menu-select"><option value="hmanco">hmanco</option></select><button id="rqUserViewBtn" type="button" class="menu-view-btn">Ver</button></div></div>';
      content.appendChild(menuView);
      if (window.lucide && window.lucide.createIcons) { try { window.lucide.createIcons(); } catch {} }
      const showMenu = () => {
        if (menuView) { menuView.classList.add('show'); }
        if (container) { container.hidden = true; }
        if (searchView) { searchView.classList.remove('show'); searchView.hidden = true; }
        const resultsViewEl = document.getElementById('requestsResultsView');
        if (resultsViewEl) { resultsViewEl.classList.remove('show'); resultsViewEl.hidden = true; }
        removeBackArrow();
        requestsState.lastOption = 'menu';
      };
      const ensureSearchView = () => {
        let v = document.getElementById('requestsSearchView');
        if (!v && content) {
          v = document.createElement('div');
          v.id = 'requestsSearchView';
          v.className = 'requests-view';
          v.innerHTML = '<div class="search-view"><form id="requestsSearchForm" class="search-form" aria-label="Buscar solicitudes"><div class="menu-section"><div class="menu-title">Especificaciones</div><div class="search-grid"><label class="field"><span>Reportado por</span><input id="rqSearchReported" type="text" class="menu-input" /></label><label class="field"><span>ID del problema</span><input id="rqSearchId" type="text" class="menu-input" /></label><label class="field"><span>Asignado a</span><select id="rqSearchAssigned" class="menu-select"><option value="">Cualquiera</option></select></label><label class="field"><span>Categoría</span><input id="rqSearchCategory" type="text" class="menu-input" /></label><label class="field"><span>Departamento</span><select id="rqSearchDept" class="menu-select"><option value="">Cualquiera</option></select></label><label class="field"><span>Estado</span><select id="rqSearchStatus" class="menu-select"><option value="">Cualquiera</option><option value="Culminado">Culminado</option><option value="En curso">En curso</option><option value="Bloqueado">Bloqueado</option><option value="Bajo revisión">Bajo revisión</option></select></label><label class="field"><span>Prioridad</span><input id="rqSearchPriority" type="text" class="menu-input" /></label></div></div><div class="menu-section"><div class="menu-title">Contiene</div><div class="search-grid"><label class="field"><span>Palabras clave</span><input id="rqSearchKeywords" type="text" class="menu-input" placeholder="Ej: proveedor junio" /></label><div class="search-checkboxes"><label><input id="rqSFTitle" type="checkbox" checked /> Título</label><label><input id="rqSFDesc" type="checkbox" checked /> Descripción</label><label><input id="rqSFSolution" type="checkbox" checked /> Solución</label></div></div></div><div class="menu-section"><div class="menu-title">Orden y fechas</div><div class="search-grid"><label class="field"><span>Ordenar por</span><select id="rqSearchOrderBy" class="menu-select"><option value="">Predeterminado</option><option value="fecha">Fecha</option><option value="estado">Estado</option><option value="responsable">Responsable</option><option value="equipo">Departamento</option><option value="objetivo">Título</option><option value="id">ID</option></select></label><label class="field"><span>Desde</span><input id="rqSearchFrom" type="date" class="menu-input" /></label><label class="field"><span>Hasta</span><input id="rqSearchTo" type="date" class="menu-input" /></label></div></div></form></div>';
          content.appendChild(v);
        }
        return v;
      };
      const applyOption = (opt) => {
        if (menuView) { menuView.classList.remove('show'); }
        if (container) { container.hidden = false; }
        if (listPanel) { listPanel.classList.remove('dimmed'); }
        requestsState.lastOption = opt;
        if (backBtn) backBtn.hidden = false;
        switch (opt) {
          case 'my': setRequestsView('my'); break;
          case 'received': setRequestsView('received'); break;
          case 'closed': requestsState.query = 'Culminado'; updateSuggestionsUI(requestsState.query); updateRequestsList(); break;
          case 'search': {
            const v = ensureSearchView(); searchView = v;
            if (container) container.hidden = true;
            if (v) { v.hidden = false; void v.offsetWidth; v.classList.add('show'); }
            const svContainer = (searchView && searchView.querySelector('.search-view')) || searchView;
            if (svContainer && !svContainer.querySelector('.requests-topbar')) {
              const tb = document.createElement('div');
              tb.className = 'requests-topbar';
              tb.innerHTML = '<div class="menu-title">Buscar solicitudes</div><div class="menu-actions"><button type="submit" id="rqSearchSubmitTop" class="modal-add-btn" form="requestsSearchForm">Buscar</button></div>';
              svContainer.insertBefore(tb, svContainer.firstChild);
            }
            const names = Array.from(new Set(requestsState.all.map(r => r?.responsable).filter(Boolean)));
            const depts = Array.from(new Set(requestsState.all.map(r => r?.equipo).filter(Boolean)));
            const selA = document.getElementById('rqSearchAssigned');
            const selD = document.getElementById('rqSearchDept');
            if (selA && !selA.dataset.filled) { selA.innerHTML = '<option value="">Cualquiera</option>' + names.map(n=>`<option value="${n}">${n}</option>`).join(''); selA.dataset.filled='true'; }
            if (selD && !selD.dataset.filled) { selD.innerHTML = '<option value="">Cualquiera</option>' + depts.map(n=>`<option value="${n}">${n}</option>`).join(''); selD.dataset.filled='true'; }
            const form = document.getElementById('requestsSearchForm');
            const bottomActions = form && form.querySelector('.form-actions');
            if (bottomActions) { try { bottomActions.remove(); } catch(_){} }
            const bottomBtnExisting = document.getElementById('rqSearchSubmit');
            if (bottomBtnExisting) { try { bottomBtnExisting.remove(); } catch(_){} }
            let resultsWrap = document.getElementById('requestsSearchResults');
            let resultsView = document.getElementById('requestsResultsView');
            if (!resultsWrap) {
              resultsWrap = document.createElement('div');
              resultsWrap.id = 'requestsSearchResults';
              resultsWrap.className = 'search-results';
              resultsWrap.setAttribute('hidden','');
              resultsWrap.innerHTML = '<div class="sr-header">Resultados de búsqueda</div><table class="sr-table" aria-label="Resultados"><thead><tr><th>ID</th><th>Título</th><th>Usuario</th><th>Asignado a</th><th>Fecha</th><th>Estado</th></tr></thead><tbody id="srTbody"></tbody></table><div class="sr-actions"><button type="button" id="rqSearchAgain" class="modal-secondary-btn">Buscar de nuevo</button></div>';
            }
            if (!resultsView && content) {
              resultsView = document.createElement('div');
              resultsView.id = 'requestsResultsView';
              resultsView.className = 'requests-view';
              resultsView.appendChild(resultsWrap);
              resultsView.hidden = true;
              content.appendChild(resultsView);
            }
            const againBtn = document.getElementById('rqSearchAgain');
            const submitBtn = document.getElementById('rqSearchSubmit');
            const submitTop = document.getElementById('rqSearchSubmitTop');
          if (form && !form.dataset.initedV2) {
            form.addEventListener('submit', (e) => {
              e.preventDefault();
              const v = (id) => document.getElementById(id)?.value?.trim() || '';
              const b = (id) => !!document.getElementById(id)?.checked;
              requestsState.criteria = {
                reportedBy: v('rqSearchReported'),
                id: v('rqSearchId'),
                assignedTo: v('rqSearchAssigned'),
                category: v('rqSearchCategory'),
                department: v('rqSearchDept'),
                status: v('rqSearchStatus'),
                priority: v('rqSearchPriority'),
                keywords: v('rqSearchKeywords'),
                fields: { title: b('rqSFTitle'), description: b('rqSFDesc'), solution: b('rqSFSolution') },
                orderBy: v('rqSearchOrderBy'),
                dateFrom: v('rqSearchFrom'),
                dateTo: v('rqSearchTo')
              };
              let resultsWrapLocal = document.getElementById('requestsSearchResults');
              let resultsViewLocal = document.getElementById('requestsResultsView');
              if (!resultsWrapLocal) {
                resultsWrapLocal = document.createElement('div');
                resultsWrapLocal.id = 'requestsSearchResults';
                resultsWrapLocal.className = 'search-results';
                resultsWrapLocal.innerHTML = '<div class="sr-header">Resultados de búsqueda</div><table class="sr-table" aria-label="Resultados"><thead><tr><th>ID</th><th>Título</th><th>Usuario</th><th>Asignado a</th><th>Fecha</th><th>Estado</th></tr></thead><tbody id="srTbody"></tbody></table><div class="sr-actions"><button type="button" id="rqSearchAgain" class="modal-secondary-btn">Buscar de nuevo</button></div>';
              }
              if (!resultsViewLocal && content) {
                resultsViewLocal = document.createElement('div');
                resultsViewLocal.id = 'requestsResultsView';
                resultsViewLocal.className = 'requests-view';
                resultsViewLocal.appendChild(resultsWrapLocal);
                content.appendChild(resultsViewLocal);
              }
              const base = requestsState.all;
              const filtered = filterRequestsAdvanced(base, requestsState.criteria);
              const tbody = document.getElementById('srTbody');
              if (tbody) {
                tbody.innerHTML = (Array.isArray(filtered) && filtered.length)
                  ? filtered.map(r => `<tr><td>${r.id||'—'}</td><td>${r.objetivo||''}</td><td>${r.user||'—'}</td><td>${r.responsable||'—'}</td><td>${r.fecha||''}</td><td>${statusLabel(r.estado)}</td></tr>`).join('')
                  : '<tr><td colspan="6" class="sr-empty">No se encontraron resultados.</td></tr>';
              }
              if (searchView) { searchView.classList.remove('show'); searchView.hidden = true; }
              if (resultsViewLocal) { resultsViewLocal.hidden = false; void resultsViewLocal.offsetWidth; resultsViewLocal.classList.add('show'); }
            });
            form.dataset.initedV2 = 'true';
          }
            if (submitBtn && !submitBtn.dataset.inited) {
              submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (form && typeof form.requestSubmit === 'function') form.requestSubmit();
                else if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
              });
              submitBtn.dataset.inited = 'true';
            }
            if (submitTop && !submitTop.dataset.inited) {
              submitTop.addEventListener('click', (e) => {
                e.preventDefault();
                if (form && typeof form.requestSubmit === 'function') form.requestSubmit();
                else if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
              });
              submitTop.dataset.inited = 'true';
            }
            if (againBtn && !againBtn.dataset.inited) {
              againBtn.addEventListener('click', () => {
                const rv = document.getElementById('requestsResultsView');
                const sv = document.getElementById('requestsSearchView');
                if (rv) rv.classList.remove('show'); if (rv) rv.hidden = true;
                if (sv) { sv.hidden = false; void sv.offsetWidth; sv.classList.add('show'); }
              });
              againBtn.dataset.inited = 'true';
            }
            break;
          }
          case 'new': openNewRequestForm(); break;
          case 'edit': setRequestsView('my'); break;
          case 'kb': setRequestsView('my'); break;
          case 'user': setRequestsView('my'); break;
          default: setRequestsView('my'); break;
        }
      };
      let backBtn = ensureBackArrow();
      if (backBtn && !backBtn.dataset.inited) { backBtn.addEventListener('click', () => { try { closeNewRequestForm(); resetNewRequestForm(); } catch(_){} showMenu(); }); backBtn.dataset.inited = 'true'; }
      const btnNew = document.getElementById('rqMenuNew'); if (btnNew && !btnNew.dataset.inited) { btnNew.addEventListener('click', () => { applyOption('new'); }); btnNew.dataset.inited = 'true'; }
      const btnMy = document.getElementById('rqMenuMy'); if (btnMy && !btnMy.dataset.inited) { btnMy.addEventListener('click', () => { applyOption('my'); }); btnMy.dataset.inited = 'true'; }
      const btnProc = document.getElementById('rqMenuProcess'); if (btnProc && !btnProc.dataset.inited) { btnProc.addEventListener('click', () => { applyOption('received'); }); btnProc.dataset.inited = 'true'; }
      const btnClosed = document.getElementById('rqMenuClosed'); if (btnClosed && !btnClosed.dataset.inited) { btnClosed.addEventListener('click', () => { applyOption('closed'); }); btnClosed.dataset.inited = 'true'; }
      const btnSearch = document.getElementById('rqMenuSearch'); if (btnSearch && !btnSearch.dataset.inited) { btnSearch.addEventListener('click', () => { applyOption('search'); }); btnSearch.dataset.inited = 'true'; }
      const btnEdit = document.getElementById('rqMenuEdit'); if (btnEdit && !btnEdit.dataset.inited) { btnEdit.addEventListener('click', () => { applyOption('edit'); }); btnEdit.dataset.inited = 'true'; }
      const btnSys = document.getElementById('rqMenuSys'); if (btnSys && !btnSys.dataset.inited) { btnSys.addEventListener('click', () => { try { openSysInfoModal(); } catch(_){} }); btnSys.dataset.inited = 'true'; }
      const kbBtn = document.getElementById('rqKbBtn'); if (kbBtn && !kbBtn.dataset.inited) { kbBtn.addEventListener('click', () => { const vEl = document.getElementById('rqKbInput'); const v = vEl && vEl.value ? String(vEl.value).trim() : ''; applyOption('kb'); if (v) { requestsState.query = v; updateSuggestionsUI(requestsState.query); updateRequestsList(); } }); kbBtn.dataset.inited = 'true'; }
      const viewBtn = document.getElementById('rqUserViewBtn'); if (viewBtn && !viewBtn.dataset.inited) { viewBtn.addEventListener('click', () => { const sel = document.getElementById('rqUserSelect'); const val = sel && sel.value ? String(sel.value).trim() : ''; applyOption('user'); if (val) { requestsState.query = val; updateSuggestionsUI(requestsState.query); updateRequestsList(); } }); viewBtn.dataset.inited = 'true'; }
    }
    
    const topbarEl = document.querySelector('#requestsContainer .requests-topbar'); if (topbarEl) { try { topbarEl.remove(); } catch(_){} }
    // Remover elementos redundantes de "Nueva solicitud" según nuevo flujo
    const topNewBtn = document.getElementById('requestNewBtn'); if (topNewBtn) { try { topNewBtn.remove(); } catch(_){} }
    const newBreadcrumb = modal.querySelector('#requestNewPanel .details-breadcrumb'); if (newBreadcrumb) { try { newBreadcrumb.remove(); } catch(_){} }
    const newCancelBtn = document.getElementById('requestNewCancel'); if (newCancelBtn) { try { newCancelBtn.remove(); } catch(_){} }
    const fMy = document.getElementById('rqFilterMy'); if (fMy && !fMy.dataset.inited) { fMy.addEventListener('click', () => { requestsState.filterMode = null; const b = document.getElementById('rqMenuMy'); if (b) b.click(); else setRequestsView('my'); }); fMy.dataset.inited = 'true'; }
    const fClsAll = document.getElementById('rqFilterClosedAll'); if (fClsAll && !fClsAll.dataset.inited) { fClsAll.addEventListener('click', () => { requestsState.filterMode = 'closed_all'; setClosedActive('all'); updateRequestsList(); }); fClsAll.dataset.inited = 'true'; }
    const fClsMine = document.getElementById('rqFilterClosedMine'); if (fClsMine && !fClsMine.dataset.inited) { fClsMine.addEventListener('click', () => { requestsState.filterMode = 'closed_my'; setRequestsView('my'); setClosedActive('mine'); updateRequestsList(); }); fClsMine.dataset.inited = 'true'; }
    setupRequestsSearch();

    if (requestsState.lastOption && requestsState.lastOption !== 'menu') {
      const opt = requestsState.lastOption;
      const input = document.getElementById('requestsSearchInput');
      if (opt === 'closed') { requestsState.query = 'Culminado'; }
      if (menuView) menuView.classList.remove('show');
      if (opt !== 'search' && container) container.hidden = false;
      ensureBackArrow();
      if (opt === 'my') setRequestsView('my');
      else if (opt === 'received') setRequestsView('received');
      else if (opt === 'search') {
        const v = document.getElementById('requestsSearchView') || (content && content.querySelector('#requestsSearchView'));
        let viewEl = v;
        if (!viewEl) {
          viewEl = document.createElement('div');
          viewEl.id = 'requestsSearchView';
          viewEl.className = 'requests-view';
          viewEl.innerHTML = '<div class="search-view"><form id="requestsSearchForm" class="search-form" aria-label="Buscar solicitudes"><div class="menu-section"><div class="menu-title">Especificaciones</div><div class="search-grid"><label class="field"><span>Reportado por</span><input id="rqSearchReported" type="text" class="menu-input" /></label><label class="field"><span>ID del problema</span><input id="rqSearchId" type="text" class="menu-input" /></label><label class="field"><span>Asignado a</span><select id="rqSearchAssigned" class="menu-select"><option value="">Cualquiera</option></select></label><label class="field"><span>Categoría</span><input id="rqSearchCategory" type="text" class="menu-input" /></label><label class="field"><span>Departamento</span><select id="rqSearchDept" class="menu-select"><option value="">Cualquiera</option></select></label><label class="field"><span>Estado</span><select id="rqSearchStatus" class="menu-select"><option value="">Cualquiera</option><option value="Culminado">Culminado</option><option value="En curso">En curso</option><option value="Bloqueado">Bloqueado</option><option value="Bajo revisión">Bajo revisión</option></select></label><label class="field"><span>Prioridad</span><input id="rqSearchPriority" type="text" class="menu-input" /></label></div></div><div class="menu-section"><div class="menu-title">Contiene</div><div class="search-grid"><label class="field"><span>Palabras clave</span><input id="rqSearchKeywords" type="text" class="menu-input" /></label><div class="search-checkboxes"><label><input id="rqSFTitle" type="checkbox" checked /> Título</label><label><input id="rqSFDesc" type="checkbox" checked /> Descripción</label><label><input id="rqSFSolution" type="checkbox" checked /> Solución</label></div></div></div><div class="menu-section"><div class="menu-title">Orden y fechas</div><div class="search-grid"><label class="field"><span>Ordenar por</span><select id="rqSearchOrderBy" class="menu-select"><option value="">Predeterminado</option><option value="fecha">Fecha</option><option value="estado">Estado</option><option value="responsable">Responsable</option><option value="equipo">Departamento</option><option value="objetivo">Título</option><option value="id">ID</option></select></label><label class="field"><span>Desde</span><input id="rqSearchFrom" type="date" class="menu-input" /></label><label class="field"><span>Hasta</span><input id="rqSearchTo" type="date" class="menu-input" /></label></div></div></form></div>';
          if (content) content.appendChild(viewEl);
        }
        const svContainer2 = (viewEl && viewEl.querySelector('.search-view')) || viewEl;
        if (svContainer2 && !svContainer2.querySelector('.requests-topbar')) {
          const tb2 = document.createElement('div');
          tb2.className = 'requests-topbar';
          tb2.innerHTML = '<div class="menu-title">Buscar solicitudes</div><div class="menu-actions"><button type="submit" id="rqSearchSubmitTop" class="modal-add-btn" form="requestsSearchForm">Buscar</button></div>';
          svContainer2.insertBefore(tb2, svContainer2.firstChild);
        }
        const names = Array.from(new Set(requestsState.all.map(r => r?.responsable).filter(Boolean)));
        const depts = Array.from(new Set(requestsState.all.map(r => r?.equipo).filter(Boolean)));
        const selA = document.getElementById('rqSearchAssigned');
        const selD = document.getElementById('rqSearchDept');
        if (selA && !selA.dataset.filled) { selA.innerHTML = '<option value="">Cualquiera</option>' + names.map(n=>`<option value="${n}">${n}</option>`).join(''); selA.dataset.filled='true'; }
        if (selD && !selD.dataset.filled) { selD.innerHTML = '<option value="">Cualquiera</option>' + depts.map(n=>`<option value="${n}">${n}</option>`).join(''); selD.dataset.filled='true'; }
        if (requestsState.criteria) {
          const set = (id,v) => { const el = document.getElementById(id); if (el) el.value = v||''; };
          const setB = (id,v) => { const el = document.getElementById(id); if (el) el.checked = !!v; };
          set('rqSearchReported', requestsState.criteria.reportedBy);
          set('rqSearchId', requestsState.criteria.id);
          set('rqSearchAssigned', requestsState.criteria.assignedTo);
          set('rqSearchCategory', requestsState.criteria.category);
          set('rqSearchDept', requestsState.criteria.department);
          set('rqSearchStatus', requestsState.criteria.status);
          set('rqSearchPriority', requestsState.criteria.priority);
          set('rqSearchKeywords', requestsState.criteria.keywords);
          setB('rqSFTitle', requestsState.criteria.fields?.title);
          setB('rqSFDesc', requestsState.criteria.fields?.description);
          setB('rqSFSolution', requestsState.criteria.fields?.solution);
          set('rqSearchOrderBy', requestsState.criteria.orderBy);
          set('rqSearchFrom', requestsState.criteria.dateFrom);
          set('rqSearchTo', requestsState.criteria.dateTo);
          let resultsWrap2 = document.getElementById('requestsSearchResults');
          let resultsView2 = document.getElementById('requestsResultsView');
          if (!resultsWrap2) {
            resultsWrap2 = document.createElement('div');
            resultsWrap2.id = 'requestsSearchResults';
            resultsWrap2.className = 'search-results';
            resultsWrap2.innerHTML = '<div class="sr-header">Resultados de búsqueda</div><table class="sr-table" aria-label="Resultados"><thead><tr><th>ID</th><th>Título</th><th>Usuario</th><th>Asignado a</th><th>Fecha</th><th>Estado</th></tr></thead><tbody id="srTbody"></tbody></table><div class="sr-actions"><button type="button" id="rqSearchAgain" class="modal-secondary-btn">Buscar de nuevo</button></div>';
          }
          if (!resultsView2 && content) {
            resultsView2 = document.createElement('div');
            resultsView2.id = 'requestsResultsView';
            resultsView2.className = 'requests-view';
            resultsView2.appendChild(resultsWrap2);
            content.appendChild(resultsView2);
          }
          const base = requestsState.all;
          const filtered = filterRequestsAdvanced(base, requestsState.criteria);
          const tbody = document.getElementById('srTbody');
          const submitBtn = document.getElementById('rqSearchSubmit');
          const submitTop = document.getElementById('rqSearchSubmitTop');
          const formEl2 = document.getElementById('requestsSearchForm');
          const bottomActions2 = formEl2 && formEl2.querySelector('.form-actions'); if (bottomActions2) { try { bottomActions2.remove(); } catch(_){} }
          const bottomBtn2 = document.getElementById('rqSearchSubmit'); if (bottomBtn2) { try { bottomBtn2.remove(); } catch(_){} }
          let resultsView = resultsView2;
          if (tbody) {
            tbody.innerHTML = (Array.isArray(filtered) && filtered.length)
              ? filtered.map(r => `<tr><td>${r.id||'—'}</td><td>${r.objetivo||''}</td><td>${r.user||'—'}</td><td>${r.responsable||'—'}</td><td>${r.fecha||''}</td><td>${statusLabel(r.estado)}</td></tr>`).join('')
              : '<tr><td colspan="6" class="sr-empty">No se encontraron resultados.</td></tr>';
          }
          const sv = document.getElementById('requestsSearchView');
          if (sv) { sv.classList.remove('show'); sv.hidden = true; }
          if (resultsView) { resultsView.hidden = false; void resultsView.offsetWidth; resultsView.classList.add('show'); }
          if (submitBtn && !submitBtn.dataset.inited) {
            submitBtn.addEventListener('click', (e) => {
              e.preventDefault();
              const form = document.getElementById('requestsSearchForm');
              if (form && typeof form.requestSubmit === 'function') form.requestSubmit();
              else if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            });
            submitBtn.dataset.inited = 'true';
          }
          if (submitTop && !submitTop.dataset.inited) {
            submitTop.addEventListener('click', (e) => {
              e.preventDefault();
              const form = document.getElementById('requestsSearchForm');
              if (form && typeof form.requestSubmit === 'function') form.requestSubmit();
              else if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            });
            submitTop.dataset.inited = 'true';
          }
          const againBtn = document.getElementById('rqSearchAgain');
          if (againBtn && !againBtn.dataset.inited) {
            againBtn.addEventListener('click', () => {
              const rv = document.getElementById('requestsResultsView');
              const sv = document.getElementById('requestsSearchView');
              if (rv) rv.classList.remove('show'); if (rv) rv.hidden = true;
              if (sv) { sv.hidden = false; void sv.offsetWidth; sv.classList.add('show'); }
            });
            againBtn.dataset.inited = 'true';
          }
        }
        if (!requestsState.criteria) { viewEl.hidden = false; void viewEl.offsetWidth; viewEl.classList.add('show'); } else { viewEl.classList.remove('show'); viewEl.hidden = true; }
      }
      else if (opt === 'new') openNewRequestForm();
      else setRequestsView('my');
      updateSuggestionsUI(requestsState.query);
      updateRequestsList();
    } else {
      if (container) container.hidden = true;
      if (backBtn) backBtn.hidden = true;
      if (menuView) menuView.classList.add('show');
    }
    trapFocus(modal);
    const backdrop = modal.querySelector('.modal-backdrop');
    const close = () => closeRequestsModal();
    if (backdrop) backdrop.addEventListener('click', close, { once: true });
    if (closeBtn) closeBtn.addEventListener('click', close, { once: true });
  }

  function closeRequestsModal() {
    const modal = document.getElementById('requestsModal');
    if (!modal) return;
    modal.classList.add('closing');
    setTimeout(() => {
      modal.classList.remove('show');
      modal.classList.remove('closing');
      modal.setAttribute('hidden','true');
      try { modal.style.display = ''; modal.style.visibility = ''; } catch (_) {}
      const sv = document.getElementById('requestsSearchView');
      const rv = document.getElementById('requestsResultsView');
      if (sv) { sv.classList.remove('show'); sv.hidden = true; }
      if (rv) { rv.classList.remove('show'); rv.hidden = true; }
    }, 180);
  }

  function formatDateEs(value) {
    if (!value) return '';
    const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return String(value);
    const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    const yyyy = Number(m[1]);
    const mm = Number(m[2]);
    const dd = Number(m[3]);
    const mon = months[mm - 1] || '';
    return `${dd} ${mon} ${yyyy}`;
  }

  function openNewRequestForm() {
    const panel = document.getElementById('requestNewPanel');
    const listPanel = document.getElementById('requestsListPanel');
    const container = document.getElementById('requestsContainer');
    const topbar = document.querySelector('#requestsContainer .requests-topbar');
    const filtersBar = document.querySelector('#requestsContainer .requests-filters');
    if (!panel || !listPanel) return;
    panel.hidden = false;
    panel.setAttribute('aria-hidden','false');
    void panel.offsetWidth;
    panel.classList.add('show');
    // Ocultar navegación y búsqueda al crear nueva solicitud
    if (topbar) { topbar.hidden = true; }
    if (filtersBar) { filtersBar.hidden = true; }
    // Ocultar la lista para evitar distracciones durante la creación
    listPanel.hidden = true;
    if (container) container.classList.add('overlaying');
    const first = document.getElementById('reqNewUser');
    if (first) first.focus();
  }

  function closeNewRequestForm() {
    const panel = document.getElementById('requestNewPanel');
    const listPanel = document.getElementById('requestsListPanel');
    const container = document.getElementById('requestsContainer');
    const topbar = document.querySelector('#requestsContainer .requests-topbar');
    const filtersBar = document.querySelector('#requestsContainer .requests-filters');
    if (!panel || !listPanel) return;
    panel.classList.remove('show');
    panel.setAttribute('aria-hidden','true');
    panel.hidden = true;
    // Restaurar navegación y búsqueda
    if (topbar) { topbar.hidden = false; }
    if (filtersBar) { filtersBar.hidden = false; }
    listPanel.hidden = false;
    if (container) container.classList.remove('overlaying');
  }

  function resetNewRequestForm() {
    const ids = ['reqNewUser','reqNewEmail','reqNewDept','reqNewLocation','reqNewPhone','reqNewCategory','reqNewStatus','reqNewPriority','reqNewAssign','reqNewTime','reqNewDescription'];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = el.type === 'number' ? '0' : ''; });
    const files = document.getElementById('reqNewFiles'); if (files) files.value = '';
    const list = document.getElementById('reqNewFileList'); if (list) list.innerHTML = '';
    const confirm = document.getElementById('reqNewConfirm'); if (confirm) confirm.checked = false;
    const status = document.getElementById('requestNewStatus'); if (status) { status.textContent = ''; status.className = 'form-status'; }
    const errs = document.querySelectorAll('#requestNewForm .field'); errs.forEach(f => f.classList.remove('field-error'));
    const errTexts = document.querySelectorAll('#requestNewForm .error-text'); errTexts.forEach(e => e.textContent = '');
  }

  function bytesToSize(bytes) {
    if (!bytes && bytes !== 0) return '';
    const k = 1024; const sizes = ['B','KB','MB','GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const v = (bytes / Math.pow(k, i)).toFixed(i ? 1 : 0);
    return `${v} ${sizes[i]}`;
  }

  function initNewRequestForm() {
    const input = document.getElementById('reqNewFiles');
    const list = document.getElementById('reqNewFileList');
    const accept = '.docx,.doc,.odt,.rtf,.xlsx,.xls,.csv,.xlsm,.ods,.pdf,.jpg,.jpeg,.png,.gif,.webp,.tiff,.tif,.svg';
    const MAX_FILE = 10 * 1024 * 1024;
    const MAX_TOTAL = 50 * 1024 * 1024;
    if (input && !input.dataset.inited) {
      input.setAttribute('accept', accept);
      input.addEventListener('change', () => {
        if (!list) return;
        list.innerHTML = '';
        const files = Array.from(input.files || []);
        let total = 0;
        files.forEach((f, i) => {
          total += f.size || 0;
          const li = document.createElement('li');
          li.className = 'file-item';
          const icon = attachmentIcon(f.name || '');
          li.innerHTML = `<span class="file-icon" aria-hidden="true"><span data-lucide="${icon}"></span></span><span class="file-name">${f.name}</span><span class="file-meta">${bytesToSize(f.size)}</span>`;
          list.appendChild(li);
        });
        const err = document.getElementById('errFiles');
        if (err) {
          if (files.some(f => f.size > MAX_FILE) || total > MAX_TOTAL) {
            err.textContent = 'Los archivos superan el límite de tamaño';
          } else { err.textContent = ''; }
        }
        if (window.lucide && window.lucide.createIcons) { window.lucide.createIcons(); }
      });
      input.dataset.inited = 'true';
    }
  }

  function showFieldError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    const field = el.closest('.field');
    const errId = 'err' + id.replace('reqNew','');
    const err = document.getElementById(errId);
    if (field) field.classList.add('field-error');
    if (err) err.textContent = msg || '';
    el.setAttribute('aria-invalid','true');
  }

  function clearFieldError(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const field = el.closest('.field');
    const errId = 'err' + id.replace('reqNew','');
    const err = document.getElementById(errId);
    if (field) field.classList.remove('field-error');
    if (err) err.textContent = '';
    el.removeAttribute('aria-invalid');
  }

  function validateNewRequestForm() {
    const val = (id) => document.getElementById(id)?.value?.trim() || '';
    const num = (id) => Number(document.getElementById(id)?.value || 0);
    const requiredIds = ['reqNewUser','reqNewEmail','reqNewDept','reqNewCategory','reqNewStatus','reqNewPriority','reqNewAssign','reqNewDescription'];
    let ok = true;
    requiredIds.forEach(id => { clearFieldError(id); if (!val(id)) { showFieldError(id, 'Campo obligatorio'); ok = false; } });
    const email = val('reqNewEmail');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFieldError('reqNewEmail','E‑mail inválido'); ok = false; }
    const time = num('reqNewTime');
    if (time < 0) { showFieldError('reqNewTime','Debe ser 0 o mayor'); ok = false; }
    const filesInput = document.getElementById('reqNewFiles');
    const files = Array.from(filesInput?.files || []);
    const MAX_FILE = 10 * 1024 * 1024;
    const MAX_TOTAL = 50 * 1024 * 1024;
    let total = 0; files.forEach(f => total += f.size || 0);
    const errF = document.getElementById('errFiles');
    if (errF) errF.textContent = '';
    if (files.some(f => f.size > MAX_FILE) || total > MAX_TOTAL) { if (errF) errF.textContent = 'Los archivos superan el límite de tamaño'; ok = false; }
    const confirm = document.getElementById('reqNewConfirm');
    const errC = document.getElementById('errConfirm');
    if (errC) errC.textContent = '';
    if (!confirm || !confirm.checked) { if (errC) errC.textContent = 'Debes confirmar antes de enviar'; ok = false; }
    return ok;
  }

  function onSaveNewRequest() {
    const status = document.getElementById('requestNewStatus');
    if (status) { status.textContent = ''; status.className = 'form-status'; }
    if (!validateNewRequestForm()) { if (status) { status.textContent = 'Corrige los errores del formulario'; status.classList.add('status-error'); } return; }
    const v = (id) => document.getElementById(id)?.value?.trim() || '';
    const n = (id) => Number(document.getElementById(id)?.value || 0);
    const user = v('reqNewUser');
    const email = v('reqNewEmail');
    const dept = v('reqNewDept');
    const location = v('reqNewLocation');
    const phone = v('reqNewPhone');
    const category = v('reqNewCategory');
    const statusVal = v('reqNewStatus');
    const priority = v('reqNewPriority');
    const assign = v('reqNewAssign');
    const timeSpent = n('reqNewTime');
    const description = v('reqNewDescription');
    const filesInput = document.getElementById('reqNewFiles');
    const files = Array.from(filesInput?.files || []);
    const attachments = files.map(f => ({ nombre: f.name, url: (typeof URL!=='undefined' && URL.createObjectURL ? URL.createObjectURL(f) : '#'), size: f.size }));
    const today = new Date();
    const yyyy = today.getFullYear(); const mm = String(today.getMonth()+1).padStart(2,'0'); const dd = String(today.getDate()).padStart(2,'0');
    const fecha = formatDateEs(`${yyyy}-${mm}-${dd}`);
    const r = {
      objetivo: category || 'Nueva petición',
      referencia: description ? description.slice(0, 80) : '',
      equipo: dept,
      responsable: assign,
      fecha,
      estado: statusVal,
      notas: description,
      adjuntos: attachments,
      sentByMe: true,
      user,
      email,
      location,
      phone,
      priority,
      timeSpent
    };
    requestsState.all = [r, ...requestsState.all];
    requestsState.my = [r, ...requestsState.my];
    updateSuggestionsUI('');
    updateRequestsList();
    if (status) { status.textContent = 'Petición enviada correctamente'; status.classList.add('status-success'); }
    setTimeout(() => { closeNewRequestForm(); resetNewRequestForm(); }, 600);
  }

  const fab = document.getElementById('fabContainer');
  const fabMain = document.getElementById('fabMain');
  const requestsBtn = document.getElementById('requestsBtn');
  const chatbotBtn = document.getElementById('chatbotBtn');
  if (fabMain) {
    // Activación únicamente por clic (mouse/táctil)
    fabMain.addEventListener('click', (e) => {
      e.preventDefault();
      openCatalogModal();
    });
    // Accesibilidad: permitir Enter/Espacio cuando está enfocado
    fabMain.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCatalogModal();
      }
    });
  }

  if (requestsBtn) {
    requestsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openRequestsModal();
    });
  }

  if (chatbotBtn) {
    chatbotBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openChatbotModal();
    });
  }

  // (Revertido) Toolbar visible del dashboard: eliminada para mantener el flujo original

  function onFabAction(btnId, handler) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', () => {
      handler();
      btn.classList.add('checked');
      btn.disabled = true;
      setTimeout(() => { btn.classList.remove('checked'); btn.disabled = false; }, 800);
      fab.classList.remove('open');
    });
  }

  onFabAction("addLine", () => addWidget("line"));
  onFabAction("addBar", () => addWidget("bar"));
  onFabAction("addPie", () => addWidget("pie"));
  onFabAction("addDoughnut", () => addWidget("doughnut"));
  onFabAction("addRadar", () => addWidget("radar"));
  onFabAction("addPolar", () => addWidget("polarArea"));
  onFabAction("addHBar", () => addWidget("barH"));
  onFabAction("addArea", () => addWidget("area"));
  onFabAction("addStacked", () => addWidget("stackedBar"));
  
  onFabAction("addMixed", () => addWidget("mixed"));
  onFabAction("clear", () => { grid.removeAll(); adjustGridHeight(); localStorage.removeItem(STORAGE_KEY); });
}
window.initDashboard = initDashboardInternal;
document.addEventListener("DOMContentLoaded", () => {
  try {
    const hasGrid = !!document.querySelector('.grid-stack');
    const libsReady = !!(window.GridStack && window.Chart);
    if (hasGrid && libsReady) { initDashboardInternal(); }
  } catch (e) { /* noop */ }
});

function trapFocusGeneric(modal, onEsc) {
  const focusables = modal.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusables[0]; const last = focusables[focusables.length - 1];
  const onKey = (ev) => {
    if (ev.key === 'Escape') { if (onEsc) onEsc(); }
    if (ev.key === 'Tab') {
      if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    }
  };
  modal.addEventListener('keydown', onKey);
  setTimeout(() => { (first || modal).focus(); }, 0);
}

function appendChatMessage(sender, text) {
  const box = document.getElementById('chatHistory');
  if (!box) return;
  const msg = document.createElement('div');
  msg.className = sender === 'user' ? 'msg user' : 'msg bot';
  msg.textContent = text;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

async function sendChatMessage(text) {
  const url = 'http://somos.socya.org:5678/webhook-test/195d398d-39a1-47f8-83b6-feebf0f7f392';
  let data = null, ok = false, status = 0;
  try {
    const sessionId = getChatSessionId();
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Accept': 'text/plain, application/json',
        'X-Session-Id': sessionId
      },
      body: text
    });
    status = resp.status; ok = resp.ok;
    const ct = resp.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      try { data = await resp.json(); }
      catch { try { data = await resp.text(); } catch { data = ''; } }
    } else {
      try { data = await resp.text(); } catch { data = ''; }
    }
  } catch (e) { data = String(e || 'Error'); }
  const reply = typeof data === 'object' ? (data.reply || data.message || JSON.stringify(data)) : String(data);
  const msg = ok ? reply : ('Error ' + status + ': ' + reply);
  appendChatMessage('bot', msg);
  saveChatMessage('bot', msg);
}

function ensureChatbotModal() {
  let modal = document.getElementById('chatbotModal');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.id = 'chatbotModal';
  modal.className = 'modal';
  modal.setAttribute('hidden','true');
  modal.innerHTML = '<div class="modal-backdrop"></div><div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="chatbotTitle"><div class="modal-header"><h2 id="chatbotTitle">Asistente</h2><div class="modal-header-actions"><button type="button" id="chatbotClose" class="modal-close" aria-label="Cerrar"><span data-lucide="x"></span></button></div></div><div class="modal-content"><div id="chatHistory" class="chat-history" aria-live="polite" role="region" aria-label="Historial de chat"></div><form id="chatForm" class="chat-input-row" aria-label="Enviar mensaje"><input id="chatMessageInput" type="text" placeholder="Escribe tu mensaje" aria-label="Mensaje" /><button type="submit" id="chatSendBtn" class="modal-add-btn" aria-label="Enviar">Enviar</button></form></div></div>';
  document.body.appendChild(modal);
  if (window.lucide && window.lucide.createIcons) { try { window.lucide.createIcons(); } catch {} }
  return modal;
}

function openChatbotModal() {
  const modal = ensureChatbotModal();
  const closeBtn = document.getElementById('chatbotClose');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatMessageInput');
  if (!modal || !form || !input) return;
  modal.classList.add('show');
  modal.removeAttribute('hidden');
  trapFocusGeneric(modal, () => closeChatbotModal());
  const backdrop = modal.querySelector('.modal-backdrop');
  const close = () => closeChatbotModal();
  if (backdrop) backdrop.addEventListener('click', close, { once: true });
  if (closeBtn) closeBtn.addEventListener('click', close, { once: true });
  // Evitar recarga y doble binding
  form.setAttribute('action','javascript:void(0)');
  if (!form.dataset.bound) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (!v) return;
      appendChatMessage('user', v);
      saveChatMessage('user', v);
      input.value = '';
      sendChatMessage(v);
    });
    form.dataset.bound = '1';
  }
  // Cargar historial al abrir
  restoreChatHistory();
}

function closeChatbotModal() {
  const modal = document.getElementById('chatbotModal');
  if (!modal) return;
  modal.classList.add('closing');
  setTimeout(() => {
    modal.classList.remove('show');
    modal.classList.remove('closing');
    modal.setAttribute('hidden','true');
  }, 180);
}

const CHAT_KEY = 'socya:chatbot-history';
const CHAT_SESSION_KEY = 'socya:chatbot-sessionId';
function getChatSessionId() {
  try {
    let id = sessionStorage.getItem(CHAT_SESSION_KEY);
    if (!id) {
      id = (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : ('sess-' + Date.now() + '-' + Math.floor(Math.random()*1000000));
      sessionStorage.setItem(CHAT_SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'sess-' + Date.now();
  }
}
function saveChatMessage(sender, text) {
  try {
    const key = CHAT_KEY + ':' + getChatSessionId();
    const raw = sessionStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push({ sender, text, ts: Date.now() });
    sessionStorage.setItem(key, JSON.stringify(arr));
  } catch {}
}
function restoreChatHistory() {
  try {
    const key = CHAT_KEY + ':' + getChatSessionId();
    const raw = sessionStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    const box = document.getElementById('chatHistory');
    if (!box) return;
    box.innerHTML = '';
    arr.forEach(m => appendChatMessage(m.sender, m.text));
    box.scrollTop = box.scrollHeight;
  } catch {}
}

try { window.openRequestsModal = openRequestsModal; } catch {}
try { window.openChatbotModal = openChatbotModal; } catch {}
try { window.ensureRequestsModal = ensureRequestsModal; } catch {}
try { window.ensureChatbotModal = ensureChatbotModal; } catch {}

function maskSensitive(label, value) {
  const k = String(label).toLowerCase();
  if (k.includes('password') || k.includes('authorization') || k.includes('cookie')) {
    return value ? '••••••••' : '';
  }
  return value;
}

function ensureSysInfoModal() {
  let modal = document.getElementById('sysInfoModal');
  if (modal) return modal;
  modal = document.createElement('div');
  modal.id = 'sysInfoModal';
  modal.className = 'modal';
  modal.setAttribute('hidden','true');
  modal.innerHTML = '<div class="modal-backdrop"></div><div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="sysInfoTitle"><div class="modal-header"><h2 id="sysInfoTitle">System Information</h2><div class="modal-header-actions"><button type="button" id="sysInfoClose" class="modal-close" aria-label="Cerrar"><span data-lucide="x"></span></button></div></div><div class="modal-content"><div id="sysInfoRoot"></div></div></div>';
  document.body.appendChild(modal);
  if (window.lucide && window.lucide.createIcons) { try { window.lucide.createIcons(); } catch {} }
  return modal;
}

function openSysInfoModal() {
  const modal = ensureSysInfoModal();
  const closeBtn = document.getElementById('sysInfoClose');
  const root = document.getElementById('sysInfoRoot');
  if (!modal || !root) return;
  const info = window.SYSTEM_INFO_DATA || {
    application: [
      ['DBType','1'],
      ['SQLServer','RESPETO\\APLICACIONES'],
      ['SQLDBase','HelpDesk'],
      ['AccessPath','C:\\Inetpub\\Databases\\helpdesk2000.mdb'],
      ['DNS_Name','HelpDeskDSN']
    ],
    verifyDb: [
      ['DB Connection','Good'],
      ['Access .MDB Exists','Database does not exist.'],
      ['Update DB','Good']
    ],
    config: [
      ['BaseURL','https://fundacion.socya.org/helpdesk'],
      ['EmailType','5'],
      ['SMTPServer','192.168.2.8'],
      ['EnablePager','3'],
      ['AuthType','1'],
      ['Version','0.97'],
      ['UseInOutBoard','0'],
      ['KBFreeText','1']
    ],
    serverVars: [
      ['APPL_MD_PATH','/LM/W3SVC/1/ROOT/Helpdesk'],
      ['APPL_PHYSICAL_PATH','C:\\inetpub\\wwwroot\\Helpdesk\\'],
      ['AUTH_PASSWORD','D1gital25+'],
      ['AUTH_TYPE','Basic'],
      ['AUTH_USER','hmanco'],
      ['CERT_COOKIE',''],
      ['CERT_FLAGS',''],
      ['CERT_ISSUER',''],
      ['CERT_KEYSIZE','256'],
      ['CERT_SECRETKEYSIZE','2048'],
      ['CERT_SERIALNUMBER',''],
      ['CERT_SERVER_ISSUER','C=US, O=DigiCert Inc, OU=www.digicert.com, CN=RapidSSL TLS RSA CA G1'],
      ['CERT_SERVER_SUBJECT','CN=*.socya.org'],
      ['CERT_SUBJECT',''],
      ['CONTENT_LENGTH','0'],
      ['CONTENT_TYPE',''],
      ['GATEWAY_INTERFACE','CGI/1.1'],
      ['HTTPS','on'],
      ['HTTPS_KEYSIZE','256'],
      ['HTTPS_SECRETKEYSIZE','2048'],
      ['HTTPS_SERVER_ISSUER','C=US, O=DigiCert Inc, OU=www.digicert.com, CN=RapidSSL TLS RSA CA G1'],
      ['HTTPS_SERVER_SUBJECT','CN=*.socya.org'],
      ['INSTANCE_ID','1'],
      ['INSTANCE_META_PATH','/LM/W3SVC/1'],
      ['LOCAL_ADDR','192.168.2.22'],
      ['LOGON_USER','hmanco'],
      ['PATH_INFO','/helpdesk/admin/sysinfo.asp'],
      ['PATH_TRANSLATED','C:\\inetpub\\wwwroot\\Helpdesk\\admin\\sysinfo.asp'],
      ['QUERY_STRING',''],
      ['REMOTE_ADDR','192.168.101.160'],
      ['REMOTE_HOST','192.168.101.160'],
      ['REMOTE_USER','hmanco'],
      ['REQUEST_METHOD','GET'],
      ['SCRIPT_NAME','/helpdesk/admin/sysinfo.asp'],
      ['SERVER_NAME','fundacion.socya.org'],
      ['SERVER_PORT','443'],
      ['SERVER_PORT_SECURE','1'],
      ['SERVER_PROTOCOL','HTTP/1.1'],
      ['SERVER_SOFTWARE','Microsoft-IIS/8.5'],
      ['URL','/helpdesk/admin/sysinfo.asp'],
      ['HTTP_CACHE_CONTROL','no-cache'],
      ['HTTP_CONNECTION','keep-alive'],
      ['HTTP_PRAGMA','no-cache'],
      ['HTTP_ACCEPT','text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'],
      ['HTTP_ACCEPT_ENCODING','gzip, deflate, br, zstd'],
      ['HTTP_ACCEPT_LANGUAGE','es-419,es;q=0.9'],
      ['HTTP_AUTHORIZATION','Basic aG1hbmNvOkQxZ2l0YWwyNSs='],
      ['HTTP_COOKIE','AspxAutoDetectCookieSupport=1; ASPSESSIONIDCUCSDACC=MNIJKJKAOJFDJMNHFMCHDHPA; ASPSESSIONIDCUDRBCCD=AEOBNMMAGKBFAGLGGIJLCICF'],
      ['HTTP_HOST','fundacion.socya.org'],
      ['HTTP_REFERER','https://fundacion.socya.org/helpdesk/admin/test.asp?doit=1'],
      ['HTTP_USER_AGENT','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'],
      ['HTTP_SEC_CH_UA','"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"'],
      ['HTTP_SEC_CH_UA_MOBILE','?0'],
      ['HTTP_SEC_CH_UA_PLATFORM','"Windows"'],
      ['HTTP_UPGRADE_INSECURE_REQUESTS','1'],
      ['HTTP_SEC_FETCH_SITE','same-origin'],
      ['HTTP_SEC_FETCH_MODE','navigate'],
      ['HTTP_SEC_FETCH_USER','?1'],
      ['HTTP_SEC_FETCH_DEST','document']
    ],
    raw: {
      ALL_HTTP: 'HTTP_CACHE_CONTROL:no-cache\nHTTP_CONNECTION:keep-alive\nHTTP_PRAGMA:no-cache\nHTTP_ACCEPT:text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7\nHTTP_ACCEPT_ENCODING:gzip, deflate, br, zstd\nHTTP_ACCEPT_LANGUAGE:es-419,es;q=0.9\nHTTP_AUTHORIZATION:Basic aG1hbmNvOkQxZ2l0YWwyNSs=\nHTTP_COOKIE:AspxAutoDetectCookieSupport=1; ASPSESSIONIDCUCSDACC=MNIJKJKAOJFDJMNHFMCHDHPA; ASPSESSIONIDCUDRBCCD=AEOBNMMAGKBFAGLGGIJLCICF\nHTTP_HOST:fundacion.socya.org\nHTTP_REFERER:https://fundacion.socya.org/helpdesk/admin/test.asp?doit=1\nHTTP_USER_AGENT:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36\nHTTP_SEC_CH_UA:"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"\nHTTP_SEC_CH_UA_MOBILE:?0\nHTTP_SEC_CH_UA_PLATFORM:"Windows"\nHTTP_UPGRADE_INSECURE_REQUESTS:1\nHTTP_SEC_FETCH_SITE:same-origin\nHTTP_SEC_FETCH_MODE:navigate\nHTTP_SEC_FETCH_USER:?1\nHTTP_SEC_FETCH_DEST:document',
      ALL_RAW: 'Cache-Control: no-cache\nConnection: keep-alive\nPragma: no-cache\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7\nAccept-Encoding: gzip, deflate, br, zstd\nAccept-Language: es-419,es;q=0.9\nAuthorization: Basic aG1hbmNvOkQxZ2l0YWwyNSs=\nCookie: AspxAutoDetectCookieSupport=1; ASPSESSIONIDCUCSDACC=MNIJKJKAOJFDJMNHFMCHDHPA; ASPSESSIONIDCUDRBCCD=AEOBNMMAGKBFAGLGGIJLCICF\nHost: fundacion.socya.org\nReferer: https://fundacion.socya.org/helpdesk/admin/test.asp?doit=1\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36\nsec-ch-ua: "Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"\nsec-ch-ua-mobile: ?0\nsec-ch-ua-platform: "Windows"\nUpgrade-Insecure-Requests: 1\nSec-Fetch-Site: same-origin\nSec-Fetch-Mode: navigate\nSec-Fetch-User: ?1\nSec-Fetch-Dest: document'
    }
  };
  const section = (title, rows) => {
    const safe = (s) => String(s||'').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const trs = rows.map(([k,v]) => `<tr><th>${safe(k)}</th><td>${safe(maskSensitive(k, v))}</td></tr>`).join('');
    return `<div class="sys-section"><div class="sys-title">${title}</div><table class="sys-table" aria-label="${title}"><tbody>${trs}</tbody></table></div>`;
  };
  const toRowsFromRaw = (text) => {
    return String(text||'').split(/\n+/).map(line => {
      const idx = line.indexOf(':');
      if (idx !== -1) { return [line.slice(0, idx), line.slice(idx+1).trim()]; }
      return [line, ''];
    }).filter(([k]) => k && k.trim().length > 0);
  };
  root.innerHTML = [
    section('Application Variable', info.application),
    section('Verify DB', info.verifyDb),
    section('Config Settings', info.config),
    section('Server Variable', info.serverVars),
    section('ALL_HTTP', toRowsFromRaw(info.raw.ALL_HTTP)),
    section('ALL_RAW', toRowsFromRaw(info.raw.ALL_RAW))
  ].join('');
  modal.classList.add('show');
  modal.removeAttribute('hidden');
  const backdrop = modal.querySelector('.modal-backdrop');
  const close = () => closeSysInfoModal();
  if (backdrop) backdrop.addEventListener('click', close, { once: true });
  if (closeBtn) closeBtn.addEventListener('click', close, { once: true });
}

function closeSysInfoModal() {
  const modal = document.getElementById('sysInfoModal');
  if (!modal) return;
  modal.classList.add('closing');
  setTimeout(() => {
    modal.classList.remove('show');
    modal.classList.remove('closing');
    modal.setAttribute('hidden','true');
    try { modal.style.display = ''; modal.style.visibility = ''; } catch(_){}
  }, 180);
}

try { window.openSysInfoModal = openSysInfoModal; } catch {}
