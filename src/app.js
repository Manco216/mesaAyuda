﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿// JS externo para dashboard.html, migrado desde el script inline
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
  let requestsState = { view: 'my', query: '', all: [], my: [], received: [] };
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
    const src = requestsState.view === 'my' ? requestsState.my : requestsState.received;
    const filtered = filterRequests(src, requestsState.query);
    renderRequests(filtered);
  }

  function setRequestsView(view) {
    const myBtn = document.getElementById('reqTabMy');
    const recBtn = document.getElementById('reqTabReceived');
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
    updateRequestsList();
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
    const current = filterRequests(base, requestsState.query);
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

  function openRequestsModal() {
    const modal = document.getElementById('requestsModal');
    const closeBtn = document.getElementById('requestsClose');
    if (!modal) return;
    // Asegurar que todos los textos del dashboard/modales estén en el idioma actual
    try { if (typeof window.applyDashboardLanguage === 'function') window.applyDashboardLanguage(); } catch {}
    const titleEl = document.getElementById('requestsTitle'); if (titleEl) titleEl.textContent = tr('Peticiones','Requests');
    requestsState.all = loadRequests();
    const split = splitRequests(requestsState.all);
    requestsState.my = split.my;
    requestsState.received = split.received;
    requestsState.view = 'my';
    requestsState.query = '';
    setRequestsView('my');
    updateSuggestionsUI('');
    setupRequestsSearch();
    const myBtn = document.getElementById('reqTabMy');
    const recBtn = document.getElementById('reqTabReceived');
    if (myBtn && !myBtn.dataset.inited) { myBtn.addEventListener('click', () => setRequestsView('my')); myBtn.dataset.inited = 'true'; }
    if (recBtn && !recBtn.dataset.inited) { recBtn.addEventListener('click', () => setRequestsView('received')); recBtn.dataset.inited = 'true'; }
    const newBtn = document.getElementById('requestNewBtn');
    if (newBtn && !newBtn.dataset.inited) { newBtn.addEventListener('click', () => openNewRequestForm()); newBtn.dataset.inited = 'true'; }
    initNewRequestForm();
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
    if (!panel || !listPanel) return;
    panel.hidden = false;
    panel.setAttribute('aria-hidden','false');
    void panel.offsetWidth;
    panel.classList.add('show');
    listPanel.classList.add('dimmed');
    if (container) container.classList.add('overlaying');
    const first = document.getElementById('reqNewUser');
    if (first) first.focus();
  }

  function closeNewRequestForm() {
    const panel = document.getElementById('requestNewPanel');
    const listPanel = document.getElementById('requestsListPanel');
    const container = document.getElementById('requestsContainer');
    if (!panel || !listPanel) return;
    panel.classList.remove('show');
    listPanel.classList.remove('dimmed');
    panel.setAttribute('aria-hidden','true');
    panel.hidden = true;
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
document.addEventListener("DOMContentLoaded", initDashboardInternal);

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
    const memoryPayload = { 
      nodes: [ { parameters: { contextWindowLength: 15 }, type: '@n8n/n8n-nodes-langchain.memoryBufferWindow', typeVersion: 1.3, position: [6944, 1568], id: '0c79fe87-e356-41b0-b2ce-8299557b2d96', name: 'Simple Memory1' } ],
      connections: { 'Simple Memory1': { ai_memory: [ [] ] } },
      pinData: {},
      meta: { templateCredsSetupCompleted: true, instanceId: '01a7d86cd60aa5ad6a79b3966c762b4026878cfbcdf18bf8e52d2bcf5a38ce9f' }
    };
    const payload = { sessionId, message: text, memory: memoryPayload };
    const resp = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    status = resp.status; ok = resp.ok;
    const ct = resp.headers.get('content-type') || '';
    if (ct.includes('application/json')) data = await resp.json(); else data = await resp.text();
  } catch (e) { data = String(e || 'Error'); }
  const reply = typeof data === 'object' ? (data.reply || data.message || JSON.stringify(data)) : String(data);
  const msg = ok ? reply : ('Error ' + status + ': ' + reply);
  appendChatMessage('bot', msg);
  saveChatMessage('bot', msg);
}

function openChatbotModal() {
  const modal = document.getElementById('chatbotModal');
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
