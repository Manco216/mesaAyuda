// Proyecto nativo: librerías se cargan por CDN en index.html

// ----- Estado de la aplicación (nativo) -----
const state = {
  tasks: [
    { id: 1, title: 'Revisión de sistema de inventario', category: 'urgent', requestDate: '2025-01-10T09:00', solutionDate: '2025-01-12T14:00', meetingDate: '2025-01-11T10:00', status: 'pending' },
    { id: 2, title: 'Actualización de base de datos', category: 'recent', requestDate: '2025-01-15T11:30', solutionDate: '2025-01-18T16:00', meetingDate: '2025-01-16T15:00', status: 'pending' },
    { id: 3, title: 'Mantenimiento de servidores', category: 'expiring', requestDate: '2025-01-08T08:00', solutionDate: '2025-01-20T17:00', meetingDate: '2025-01-19T09:00', status: 'pending' },
    { id: 4, title: 'Configuración de red', category: 'recent', requestDate: '2025-01-14T10:00', solutionDate: '2025-01-17T12:00', meetingDate: '2025-01-16T11:00', status: 'pending' },
    { id: 5, title: 'Instalación de software', category: 'urgent', requestDate: '2025-01-09T13:00', solutionDate: '2025-01-13T15:00', meetingDate: '2025-01-12T14:00', status: 'pending' },
  ],
  selectedTask: null,
  filter: 'all',
  activePage: 'dashboard',
  currentDate: new Date(),
  fpSolution: null,
  fpMeeting: null,
  showModal: false,
  modalDate: null,
  fpModalRequest: null,
  fpModalSolution: null,
  fpModalMeeting: null,
  welcomeAnimatedShown: false,
  // Estado de colapso del menú lateral (inicia oculto hasta que el usuario haga clic)
  sidebarCollapsed: true,
  // Preferencias de interfaz y usuario
  preferences: {
    name: '',
    surname: '',
    department: 'ti',
    language: 'es',
    theme: 'light',
    fontSize: 16,
    palette: null,
    avatar: null,
  },
};

// ----- Configuración desde index.html -----
let uiConfig = null;
const getUiConfig = () => {
  if (uiConfig) return uiConfig;
  const el = document.getElementById('ui-config');
  if (!el) return {};
  try {
    uiConfig = JSON.parse(el.textContent.trim());
    return uiConfig || {};
  } catch (_e) {
    return {};
  }
};

// ===== Traducciones básicas (ES/EN) =====
const I18N = {
  es: {
    userConfig: 'Configuración de Usuario',
    name: 'Nombre',
    nameHint: 'Solo letras, espacios, apóstrofe y guion.',
    namePh: 'Tu nombre',
    surname: 'Apellido',
    surnameHint: 'Solo letras, espacios, apóstrofe y guion.',
    surnamePh: 'Tu apellido',
    department: 'Área de la empresa',
    language: 'Idioma preferido',
    languageHint: 'Se aplicará al contenido compatible.',
    palettes: 'Personalización de paletas',
    preview: 'Previsualizar',
    apply: 'Aplicar',
    logoHint: 'El logo mantiene sus colores originales.',
    uiPrefs: 'Preferencias de Interfaz',
    mode: 'Modo',
    light: 'Claro',
    dark: 'Oscuro',
    fontSize: 'Tamaño de fuente',
    reset: 'Restablecer valores por defecto',
    save: 'Guardar',
    pendingHeader: 'Pendientes',
    filterAll: 'Todos',
    filterRecent: 'Recientes',
    filterUrgent: 'Urgentes',
    filterExpiring: 'Por vencer',
    reqLabel: 'Petición',
    solLabel: 'Solución',
    meetLabel: 'Reunión',
    deletePendingAria: 'Eliminar pendiente',
    eventNewTitle: 'Nuevo pendiente',
    eventTitleLabel: 'Título del pendiente',
    eventCategoryLabel: 'Categoría',
    eventRequestLabel: 'Fecha y hora de petición',
    eventRequestPh: 'Selecciona fecha y hora',
    modalCancel: 'Cancelar',
    modalSave: 'Guardar',
    welcome: name => `Bienvenido a la mesa de ayuda${name?`, ${name}`:''}`,
    menuDash: 'Dashboards',
    menuPlan: 'Planificación',
    menuDocs: 'Documentos de operaciones TI',
    menuEdit: 'Editar',
    menuManual: 'Manual Interactivo',
    menuPolicy: 'Política de seguridad'
  },
  en: {
    userConfig: 'User Settings',
    name: 'First name',
    nameHint: 'Letters, spaces, apostrophe and hyphen only.',
    namePh: 'Your first name',
    surname: 'Last name',
    surnameHint: 'Letters, spaces, apostrophe and hyphen only.',
    surnamePh: 'Your last name',
    department: 'Company area',
    language: 'Preferred language',
    languageHint: 'Applied to compatible content.',
    palettes: 'Palette customization',
    preview: 'Preview',
    apply: 'Apply',
    logoHint: 'The logo keeps its original colors.',
    uiPrefs: 'Interface Preferences',
    mode: 'Mode',
    light: 'Light',
    dark: 'Dark',
    fontSize: 'Font size',
    reset: 'Reset to defaults',
    save: 'Save',
    pendingHeader: 'Pending',
    filterAll: 'All',
    filterRecent: 'Recent',
    filterUrgent: 'Urgent',
    filterExpiring: 'Expiring',
    reqLabel: 'Request',
    solLabel: 'Solution',
    meetLabel: 'Meeting',
    deletePendingAria: 'Delete task',
    eventNewTitle: 'New task',
    eventTitleLabel: 'Task title',
    eventCategoryLabel: 'Category',
    eventRequestLabel: 'Request date and time',
    eventRequestPh: 'Pick date and time',
    modalCancel: 'Cancel',
    modalSave: 'Save',
    welcome: name => `Welcome to the help desk${name?`, ${name}`:''}`,
    menuDash: 'Dashboards',
    menuPlan: 'Planning',
    menuDocs: 'IT operations documents',
    menuEdit: 'Edit',
    menuManual: 'Interactive Manual',
    menuPolicy: 'Security Policy'
  }
};
const t = (key, ...args) => {
  const lang = state?.preferences?.language || 'es';
  const dict = I18N[lang] || I18N.es;
  const val = dict[key];
  if (typeof val === 'function') return val(...args);
  return val || key;
};

// Renderizar iconos (Lucide)
const renderIcons = () => {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

// Obtiene el HTML de una plantilla definida en index.html
const getTemplateHTML = (id) => {
  const tpl = document.getElementById(id);
  return tpl ? tpl.innerHTML.trim() : null;
};

// ----- Utilidades -----
// Fallback seguro para traducción de pares (es, en).
// Si app.js expone window.tr, úsalo; si no, decidir por document.lang o preferencias.
const tr = (() => {
  try { if (typeof window !== 'undefined' && typeof window.tr === 'function') return window.tr; } catch(_) {}
  return (es, en) => {
    const langAttr = (typeof document !== 'undefined' && document.documentElement && document.documentElement.getAttribute('lang')) || null;
    const prefLang = (typeof state !== 'undefined' && state?.preferences?.language) || null;
    const lang = (langAttr || prefLang || 'es');
    return lang === 'en' ? en : es;
  };
})();

const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const weekdayShort = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

const getCategoryColor = (category) => ({
  urgent: '#8B0000',
  expiring: '#FF4444',
  recent: '#5B8DEF',
}[category] || '#999');

const getCategoryLabel = (category) => ({
  urgent: tr('Urgente','Urgent'),
  expiring: tr('Por vencer','Expiring'),
  recent: tr('Reciente','Recent'),
}[category] || tr('Otro','Other'));

// Resuelve rutas de assets para funcionar desde /public/index.html y desde servidor
const resolveAsset = (relativePath) => {
  try {
    const path = (typeof window !== 'undefined' ? window.location.pathname : '') || '';
    const inPublic = path.includes('/public/') || path.endsWith('/public/index.html');
    // Cuando se abre el archivo local de /public, subir un nivel
    return inPublic ? `../${relativePath}` : `./${relativePath}`;
  } catch (_) {
    return `./${relativePath}`;
  }
};

// ----- Preferencias (persistencia y aplicación) -----
const PREFS_KEY = 'socya:prefs';
const loadPrefs = () => {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    state.preferences = { ...state.preferences, ...parsed };
    // Migración ligera: convertir departamento textual a id canónico si aplica
    const dep = state.preferences.department;
    const known = ['ti','fin','hr','sales','log'];
    if (dep && !known.includes(dep)) {
      const map = {
        'Operaciones TI': 'ti', 'IT Operations': 'ti',
        'Finanzas': 'fin', 'Finance': 'fin',
        'RRHH': 'hr', 'HR': 'hr',
        'Comercial': 'sales', 'Sales': 'sales',
        'Logística': 'log', 'Logistics': 'log'
      };
      state.preferences.department = map[dep] || 'ti';
    }
  } catch (_) { /* ignore */ }
};
const savePrefs = () => { try { localStorage.setItem(PREFS_KEY, JSON.stringify(state.preferences)); } catch (_) { /* ignore */ } };
const setCssVar = (name, value) => { document.documentElement.style.setProperty(name, value); };
// Valores de marca por defecto (coinciden con :root en CSS)
const DEFAULT_BRAND = { primary: '#0c2340', secondary: '#7e63d4', accent: '#7c3aed' };
// Utilidades de color
const hexToRgb = (hex) => {
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16);
  const g = parseInt(h.substring(2,4),16);
  const b = parseInt(h.substring(4,6),16);
  return { r, g, b };
};
const rgbToHex = ({r,g,b}) => '#' + [r,g,b].map(v => {
  const s = Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2,'0');
  return s;
}).join('');
const mix = (hexA, hexB, t) => {
  const a = hexToRgb(hexA); const b = hexToRgb(hexB);
  return rgbToHex({ r: a.r*(1-t)+b.r*t, g: a.g*(1-t)+b.g*t, b: a.b*(1-t)+b.b*t });
};

const applyPrefs = () => {
  // Tema
  const isDark = state.preferences.theme === 'dark';
  document.body.classList.toggle('theme-dark', isDark);

  // Tamaño de fuente
  const fs = Math.min(24, Math.max(12, Number(state.preferences.fontSize || 16)));
  setCssVar('--base-font-size', `${fs}px`);

  // Paleta aplicada (si existe). Si no hay, volver SIEMPRE a los valores por defecto
  const brandPrimary = (state.preferences.palette?.primary || DEFAULT_BRAND.primary);
  const brandSecondary = (state.preferences.palette?.secondary || DEFAULT_BRAND.secondary);
  const brandAccent = (state.preferences.palette?.accent || DEFAULT_BRAND.accent);
  setCssVar('--brand-primary', brandPrimary.trim());
  setCssVar('--brand-secondary', brandSecondary.trim());
  setCssVar('--brand-accent', brandAccent.trim());

  // Fondo global (uniforme): en claro, aclaramos el acento hacia blanco; en oscuro, fondo profundo
  const lightBg = mix(brandAccent.trim(), '#ffffff', 0.90);
  const background = isDark ? '#0b1120' : lightBg;
  setCssVar('--color-background', background);

  // Texto principal según contraste con fondo
  const textColor = pickTextColor(background);
  setCssVar('--color-text', textColor);
  // Mantener --text sincronizado para compatibilidad; no lo modificamos en previsualización
  setCssVar('--text', textColor);

  // Colores de UI derivados
  const buttonColor = isDark ? brandSecondary : brandAccent;
  setCssVar('--color-primary', buttonColor);
  setCssVar('--color-button-text', pickTextColor(buttonColor));
  setCssVar('--color-border', isDark ? '#334155' : '#e5e7eb');
  setCssVar('--color-sidebar', isDark ? '#0f172a' : mix(background, '#ffffff', 0.92));
  setCssVar('--color-sidebar-active', isDark ? '#1e293b' : mix(buttonColor, '#ffffff', 0.85));

  // Superficies para tarjetas, modales, etc.
  setCssVar('--surface', isDark ? '#0f172a' : '#ffffff');
  setCssVar('--surface-2', isDark ? '#0b1220' : '#f5f7fb');
  // Actualizar defaults y refrescar gráficos según el tema
  try { if (typeof window.applyChartDefaults === 'function') window.applyChartDefaults(); } catch {}
  try { if (typeof window.refreshChartsForTheme === 'function') window.refreshChartsForTheme(); } catch {}
};
// Accesibilidad: contraste de texto según fondo
const luminance = (hex) => {
  const h = hex.replace('#','');
  const r = parseInt(h.substring(0,2),16)/255;
  const g = parseInt(h.substring(2,4),16)/255;
  const b = parseInt(h.substring(4,6),16)/255;
  const a = [r,g,b].map(v => v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4));
  return 0.2126*a[0] + 0.7152*a[1] + 0.0722*a[2];
};
const pickTextColor = (bgHex) => { try { return luminance(bgHex) > 0.5 ? '#111827' : '#ffffff'; } catch(_) { return '#111827'; } };

// Paletas base
const PALETTES = [
  { id: 'dorado', label: 'Dorado', swatches: ['#b57c00','#d09306','#ecab0f','#f7d547','#ffff72'], apply: { primary: '#8a5a00', secondary: '#ecab0f', accent: '#f7d547' } },
  { id: 'naranja', label: 'Naranja', swatches: ['#c65314','#e26a2c','#ff8243','#ffae6a','#ffd792'], apply: { primary: '#c65314', secondary: '#ff8243', accent: '#e26a2c' } },
  { id: 'verde', label: 'Verde', swatches: ['#006D2C','#238845','#41AB5D','#74C476','#A1D99B'], apply: { primary: '#006D2C', secondary: '#74C476', accent: '#41AB5D' } },
  { id: 'teal', label: 'Teal', swatches: ['#2BC5BE','#4EC8C7','#6CCACF','#86CFD5','#A7DDE4'], apply: { primary: '#2BC5BE', secondary: '#86CFD5', accent: '#4EC8C7' } },
  { id: 'azul-oscuro', label: 'Azul oscuro', swatches: ['#02152b','#02253d','#012e46','#153f59','#365b77'], apply: { primary: '#0c2340', secondary: '#365b77', accent: '#153f59' } },
];

const renderEditView = () => {
  const p = state.preferences;
  return `
    <div class="edit-panel" aria-label="Panel de configuración">
      <div class="edit-grid">
        <section>
          <h2>${t('userConfig')}</h2>
          <div class="edit-field">
            <label for="edit-name">${t('name')}</label>
            <input id="edit-name" type="text" autocomplete="given-name" value="${p.name || ''}" placeholder="${t('namePh')}">
            <div class="edit-error" id="err-name">${t('nameHint')}</div>
          </div>
          <div class="edit-field">
            <label for="edit-surname">${t('surname')}</label>
            <input id="edit-surname" type="text" autocomplete="family-name" value="${p.surname || ''}" placeholder="${t('surnamePh')}">
            <div class="edit-error" id="err-surname">${t('surnameHint')}</div>
          </div>
          <div class="edit-field">
            <label for="edit-dept">${t('department')}</label>
            <select id="edit-dept">
              ${DEPARTMENTS.map(d => `<option value="${d.id}" ${p.department===d.id?'selected':''}>${deptLabel(d.id)}</option>`).join('')}
            </select>
          </div>
          <div class="edit-field">
            <label for="edit-lang">${t('language')}</label>
            <select id="edit-lang">
              <option value="es" ${p.language==='es'?'selected':''}>Español</option>
              <option value="en" ${p.language==='en'?'selected':''}>English</option>
            </select>
            <div class="edit-hint">${t('languageHint')}</div>
          </div>
          <div class="edit-field" style="grid-column: 1 / -1; text-align:right">
            <button id="btn-save-user" type="button">${t('save')}</button>
          </div>
        </section>
        <section>
          <h2>${t('palettes')}</h2>
          <div id="palette-list">
            ${PALETTES.map(pal => `
              <div class="palette-card" data-id="${pal.id}">
                <div class="palette-swatches">
                  ${pal.swatches.map(c => `<div style="background:${c}" title="${c}"></div>`).join('')}
                </div>
                <div class="palette-actions">
                  <button class="preview" data-action="preview">${t('preview')}</button>
                  <button class="apply" data-action="apply">${t('apply')}</button>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="edit-hint">${t('logoHint')}</div>
        </section>
      </div>
      <section style="margin-top:16px">
        <h2>${t('uiPrefs')}</h2>
        <div class="edit-grid">
          <div class="edit-field">
            <label for="toggle-theme">${t('mode')}</label>
            <select id="toggle-theme">
              <option value="light" ${p.theme==='light'?'selected':''}>${t('light')}</option>
              <option value="dark" ${p.theme==='dark'?'selected':''}>${t('dark')}</option>
            </select>
          </div>
          <div class="edit-field">
            <label for="font-size">${t('fontSize')}</label>
            <input id="font-size" type="range" min="12" max="24" value="${p.fontSize || 16}">
            <div class="edit-hint">${p.fontSize || 16}px</div>
          </div>
          <div class="edit-field" style="grid-column: 1 / -1">
            <button id="btn-reset" type="button">${t('reset')}</button>
          </div>
        </div>
      </section>
    </div>
  `;
};
const initEditView = () => {
  // Validaciones nombre/apellido
  const allowed = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'\-]+$/;
  const bindText = (id, errId, key) => {
    const input = document.getElementById(id); const err = document.getElementById(errId);
    if (!input || !err) return;
    input.addEventListener('input', () => {
      const val = input.value.trim();
      const ok = val === '' || allowed.test(val);
      err.classList.toggle('show', !ok);
      if (ok) { state.preferences[key] = val; savePrefs(); }
    });
  };
  bindText('edit-name','err-name','name');
  bindText('edit-surname','err-surname','surname');
  // Departamento
  const dept = document.getElementById('edit-dept'); if (dept) dept.addEventListener('change', () => { state.preferences.department = dept.value; savePrefs(); });
  // Idioma
const lang = document.getElementById('edit-lang'); if (lang) lang.addEventListener('change', () => { state.preferences.language = lang.value; savePrefs(); document.documentElement.lang = lang.value; render(); applyLanguage(); });
  // Paletas
  const previewPalette = (p) => {
    setCssVar('--brand-primary', p.apply.primary);
    setCssVar('--brand-secondary', p.apply.secondary);
    setCssVar('--brand-accent', p.apply.accent);
    // No tocar el color global de texto en previsualización para evitar títulos invisibles
  };
  const applyPalette = (p) => { state.preferences.palette = { ...p.apply }; savePrefs(); applyPrefs(); };
  document.querySelectorAll('#palette-list .palette-card').forEach(card => {
    const id = card.dataset.id; const pal = PALETTES.find(x => x.id === id);
    const btnPrev = card.querySelector('[data-action="preview"]');
    const btnApply = card.querySelector('[data-action="apply"]');
    if (btnPrev && pal) btnPrev.addEventListener('click', () => previewPalette(pal));
    if (btnApply && pal) btnApply.addEventListener('click', () => applyPalette(pal));
  });
  // Tema y tamaño
  const toggleTheme = document.getElementById('toggle-theme'); if (toggleTheme) toggleTheme.addEventListener('change', () => { state.preferences.theme = toggleTheme.value; savePrefs(); applyPrefs(); });
  const fontSize = document.getElementById('font-size'); const fontHint = fontSize ? fontSize.nextElementSibling : null; if (fontSize) fontSize.addEventListener('input', () => { state.preferences.fontSize = Number(fontSize.value); if (fontHint) fontHint.textContent = `${fontSize.value}px`; applyPrefs(); savePrefs(); });
  // Reset
  const btnReset = document.getElementById('btn-reset'); if (btnReset) btnReset.addEventListener('click', () => {
    state.preferences = { name:'', surname:'', department:'ti', language:'es', theme:'light', fontSize:16, palette:null, avatar:null };
    savePrefs(); applyPrefs(); applyLanguage(); render();
    const el = document.getElementById('edit-view'); if (el) { el.innerHTML = renderEditView(); initEditView(); renderIcons(); }
  });

  // Guardar/confirmar nombre e información del usuario
  const btnSaveUser = document.getElementById('btn-save-user');
  if (btnSaveUser) {
    btnSaveUser.addEventListener('click', () => {
      const nm = document.getElementById('edit-name');
      const sn = document.getElementById('edit-surname');
      const dept = document.getElementById('edit-dept');
      const langSel = document.getElementById('edit-lang');
      const allowed = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'\-]+$/;
      const nameOk = !nm || nm.value.trim()==='' || allowed.test(nm.value.trim());
      const surOk = !sn || sn.value.trim()==='' || allowed.test(sn.value.trim());
      if (!nameOk) document.getElementById('err-name')?.classList.add('show');
      if (!surOk) document.getElementById('err-surname')?.classList.add('show');
      if (nameOk && surOk) {
        state.preferences.name = nm?.value.trim() || '';
        state.preferences.surname = sn?.value.trim() || '';
        if (dept) state.preferences.department = dept.value;
        if (langSel) state.preferences.language = langSel.value;
        savePrefs();
        applyPrefs();
        render();
        applyLanguage();
      }
    });
  }
};

const formatDateDisplay = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const suffix = h >= 12 ? 'Pm' : 'Am';
  h = h % 12 || 12;
  return `${dd}/${mm}/${yyyy} ${h}:${m} ${suffix}`;
};

const getDaysMeta = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay() };
};

const getTasksForDay = (date, day) => {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  return state.tasks.filter(task => {
    const requestDate = task.requestDate?.split('T')[0];
    const solutionDate = task.solutionDate ? task.solutionDate.split('T')[0] : null;
    const meetingDate = task.meetingDate ? task.meetingDate.split('T')[0] : null;
    return requestDate === dateStr || solutionDate === dateStr || meetingDate === dateStr;
  });
};

// ----- Operaciones sobre tareas -----
const addTask = (newTask) => {
  state.tasks = [...state.tasks, { ...newTask, id: state.tasks.length + 1, status: 'pending' }];
  render();
};

const updateTask = (id, updatedTask) => {
  state.tasks = state.tasks.map(t => t.id === id ? { ...t, ...updatedTask } : t);
  render();
};

const deleteTask = (id) => {
  state.tasks = state.tasks.filter(t => t.id !== id);
  if (state.selectedTask?.id === id) state.selectedTask = null;
  render();
};

// ----- Renderizado -----
const renderSidebar = () => {
  const tpl = getTemplateHTML('sidebar-template');
  if (tpl) {
    return `
      <div id="app-sidebar" class="sidebar" role="navigation" aria-label="Menú principal">
        <div class="sidebar-logo">
          <div class="logo-container">
            <img src="${resolveAsset('img/Logo_Socya.png')}" alt="Logo" class="logo-image" />
          </div>
        </div>
        ${tpl}
        <div class="sidebar-footer">
          <button class="sidebar-item avatar-item" data-page="editar" aria-label="${t('menuEdit')}">
            <img src="${state.preferences?.avatar || resolveAsset('img/Usuario1.png')}" alt="Perfil" class="avatar" />
          </button>
          <div class="avatar-name">${[(state.preferences?.name||'').trim(), (state.preferences?.surname||'').trim()].filter(Boolean).join(' ')}</div>
          <input id="avatar-file-input" type="file" accept="image/*" hidden aria-hidden="true" />
        </div>
      </div>
    `;
  }
  // Fallback a configuración JSON
  return `
    <div id="app-sidebar" class="sidebar" role="navigation" aria-label="Menú principal">
      <div class="sidebar-logo">
        <div class="logo-container">
          <img src="${resolveAsset('img/Logo_Socya.png')}" alt="Logo" class="logo-image" />
        </div>
      </div>
      <nav class="sidebar-menu">
        ${(() => {
          const cfg = getUiConfig();
          const items = Array.isArray(cfg.sidebarItems) && cfg.sidebarItems.length ? cfg.sidebarItems : [
            { id: 'dashboard', label: t('menuDash'), icon: 'layout-dashboard' },
            { id: 'planning', label: t('menuPlan'), icon: 'calendar' },
            { id: 'manual', label: 'Manual interactivo', icon: 'file-text' },
            { id: 'agenda', label: 'Política de agenda', icon: 'clipboard-list' },
            { id: 'documents', label: t('menuDocs'), icon: 'folder-open' },
            { id: 'editar', label: t('menuEdit'), icon: 'square-pen' },
          ];
          return items.map(item => {
            if (item.href) {
              return `
                <a class="sidebar-item" href="${item.href}" ${item.target ? `target="${item.target}" rel="noopener"` : ''}>
                  <span class="sidebar-icon" data-lucide="${item.icon || 'circle'}"></span>
                  <span>${item.label}</span>
                </a>
              `;
            }
            return `
              <button class="sidebar-item ${state.activePage === item.id ? 'active' : ''}" data-page="${item.id}">
                <span class="sidebar-icon" data-lucide="${item.icon || 'circle'}"></span>
                <span>${item.label}</span>
                ${state.activePage === item.id ? '<div class="active-indicator"></div>' : ''}
              </button>
            `;
          }).join('');
        })()}
      </nav>
      <div class="sidebar-footer">
        <button class="sidebar-item avatar-item" data-page="editar" aria-label="${t('menuEdit')}">
          <img src="${state.preferences?.avatar || resolveAsset('img/Usuario1.png')}" alt="Perfil" class="avatar" />
        </button>
        <div class="avatar-name">${[(state.preferences?.name||'').trim(), (state.preferences?.surname||'').trim()].filter(Boolean).join(' ')}</div>
        <input id="avatar-file-input" type="file" accept="image/*" hidden aria-hidden="true" />
      </div>
    </div>
  `;
};

const renderHeader = () => {
  const tpl = getTemplateHTML('header-template');
  if (tpl) {
    return `
      <header class="header">
        <div class="header-content">
          <div class="welcome-box">${tpl}</div>
          ${state.activePage === 'dashboard' ? '<button id="fabMain" type="button" class="dashboard-cta">Personaliza tu dashboard</button>' : ''}
        </div>
      </header>
    `;
  }
  return `
    <header class="header">
      <div class="header-content">
        <div class="welcome-box">
          <p class="welcome-text">${t('welcome', (state.preferences?.name||'').trim().split(/\s+/)[0] || '')}</p>
          <img src="${resolveAsset('img/Usuario1.png')}" alt="Ilustración" class="welcome-figure" />
        </div>
        ${state.activePage === 'dashboard' ? '<button id="fabMain" type="button" class="dashboard-cta">Personaliza tu dashboard</button>' : ''}
      </div>
    </header>
  `;
};

// Aplicar idioma en elementos existentes del DOM (sidebar y banner por plantillas)
function applyLanguage() {
  document.documentElement.lang = state.preferences?.language || 'es';
  const firstName = (state.preferences?.name||'').trim().split(/\s+/)[0] || '';
  const displayName = [ (state.preferences?.name||'').trim(), (state.preferences?.surname||'').trim() ].filter(Boolean).join(' ');
  const wt = document.querySelector('.welcome-text'); if (wt) wt.textContent = t('welcome', firstName);
  const sb = document.querySelector('.sidebar-menu');
  if (sb) {
    const itemDash = sb.querySelector('[data-page="dashboard"] span:last-child');
    const itemPlan = sb.querySelector('[data-page="planning"] span:last-child');
    const itemDocs = sb.querySelector('[data-page="documents"] span:last-child');
    const itemEdit = sb.querySelector('[data-page="editar"] span:last-child');
    if (itemDash) itemDash.textContent = t('menuDash');
    if (itemPlan) itemPlan.textContent = t('menuPlan');
    if (itemDocs) itemDocs.textContent = t('menuDocs');
    if (itemEdit) itemEdit.textContent = t('menuEdit');

    // Enlaces externos del menú por icono
    const manualIcon = sb.querySelector('.sidebar-item [data-lucide="file-text"]');
    if (manualIcon && manualIcon.parentElement) {
      const label = manualIcon.parentElement.querySelector('span:last-child');
      if (label) label.textContent = t('menuManual');
    }
    const policyIcon = sb.querySelector('.sidebar-item [data-lucide="shield"]');
    if (policyIcon && policyIcon.parentElement) {
      const label = policyIcon.parentElement.querySelector('span:last-child');
      if (label) label.textContent = t('menuPolicy');
    }
  }
  // Actualizar nombre completo bajo el avatar si existe en DOM
  const an = document.querySelector('.sidebar-footer .avatar-name'); if (an) an.textContent = displayName;
  // Refrescar textos de dashboard (widgets/gráficos/FAB)
  try { if (typeof window.applyDashboardLanguage === 'function') window.applyDashboardLanguage(); } catch {}
}

const renderCalendar = () => {
  const { daysInMonth, startingDayOfWeek } = getDaysMeta(state.currentDate);
  const today = new Date();
  const dayCells = [
    ...Array.from({ length: startingDayOfWeek }).map((_, idx) => `<div class="calendar-day empty"></div>`),
    ...Array.from({ length: daysInMonth }).map((_, idx) => {
      const day = idx + 1;
      const isToday = day === today.getDate() && state.currentDate.getMonth() === today.getMonth() && state.currentDate.getFullYear() === today.getFullYear();
      const dayTasks = getTasksForDay(state.currentDate, day);
      const dots = dayTasks.slice(0,3).map(t => `<div class="day-task-dot" style="background-color:${getCategoryColor(t.category)}" title="${t.title}"></div>`).join('');
      const more = dayTasks.length > 3 ? `<span class="more-tasks">+${dayTasks.length-3}</span>` : '';
      return `
        <div class="calendar-day ${isToday ? 'today' : ''}" data-day="${day}">
          <span class="day-number">${day}</span>
          <div class="day-tasks">${dots}${more}</div>
        </div>
      `;
    })
  ].join('');

  const selected = state.selectedTask;
  const details = selected ? `
    <div class="event-form-section">
      <h3>${tr('Detalles del Pendiente','Pending Details')}</h3>
      <div class="event-details">
        <div class="event-detail-item">
          <label>${tr('Título:','Title:')}</label>
          <p>${selected.title}</p>
        </div>
        <div class="event-detail-item">
          <label>${tr('Fecha y hora de petición:','Request date and time:')}</label>
          <p>${formatDateDisplay(selected.requestDate)}</p>
        </div>
        <div class="event-detail-item">
          <label>${tr('Fecha y hora de solución:','Solution date and time:')}</label>
          <input id="solution-input" type="text" placeholder="${tr('Selecciona fecha y hora','Pick date and time')}" />
        </div>
        <div class="event-detail-item">
          <label>${tr('Fecha y hora de reunión:','Meeting date and time:')}</label>
          <input id="meeting-input" type="text" placeholder="${tr('Selecciona fecha y hora','Pick date and time')}" />
        </div>
        <div class="event-detail-item">
          <button type="button" class="confirm-date-btn" id="confirm-btn">${tr('Confirmar fechas','Confirm dates')}</button>
        </div>
        <div class="event-detail-item">
          <label>${tr('Estado:','Status:')}</label>
          ${selected.solutionDate && new Date(selected.solutionDate) <= new Date()
            ? `<span class="status-badge status-solved">${tr('Ya solucionado','Already solved')}</span>`
            : `<span class="status-badge status-${selected.category}">${getCategoryLabel(selected.category)}</span>`}
        </div>
      </div>
    </div>
  ` : '';

  return `
    <div class="calendar-container">
      <div class="calendar-header">
        <button class="calendar-nav-btn" id="prev-month"><span data-lucide="chevron-left"></span></button>
        <h2 class="calendar-title">${(state.preferences?.language==='en'?['January','February','March','April','May','June','July','August','September','October','November','December']:monthNames)[state.currentDate.getMonth()]} ${state.currentDate.getFullYear()}</h2>
        <button class="calendar-nav-btn" id="next-month"><span data-lucide="chevron-right"></span></button>
      </div>
      <div class="calendar-grid">
        <div class="calendar-weekdays">
          ${(state.preferences?.language==='en'?['Sun','Mon','Tue','Wed','Thu','Fri','Sat']:weekdayShort).map(d => `<div class="weekday">${d}</div>`).join('')}
        </div>
        <div class="calendar-days">${dayCells}</div>
      </div>
      ${details}
    </div>
  `;
};

const renderTaskItem = (task, selected) => `
  <div class="task-item ${selected ? 'selected' : ''}" data-task-id="${task.id}">
    <div class="task-item-header">
      <div class="task-category-dot" style="background-color:${getCategoryColor(task.category)}"></div>
      <div class="task-item-info">
        <p class="task-title">${task.title}</p>
        <div class="task-info-row"><span>${t('reqLabel')}: ${formatDateDisplay(task.requestDate)}</span></div>
        ${task.solutionDate ? `<div class="task-info-row"><span>${t('solLabel')}: ${formatDateDisplay(task.solutionDate)}</span></div>` : ''}
        ${task.meetingDate ? `<div class="task-info-row"><span>${t('meetLabel')}: ${formatDateDisplay(task.meetingDate)}</span></div>` : ''}
      </div>
      <button class="task-delete-btn" data-delete-id="${task.id}" aria-label="${t('deletePendingAria')}"><span data-lucide="trash-2"></span></button>
    </div>
    <div class="task-item-footer">
      <span class="status-badge status-${task.category}">${getCategoryLabel(task.category)}</span>
    </div>
  </div>
`;

const renderTaskList = () => {
  const filters = [
    { id: 'all', label: t('filterAll'), color: '#999' },
    { id: 'recent', label: t('filterRecent'), color: '#5B8DEF' },
    { id: 'urgent', label: t('filterUrgent'), color: '#8B0000' },
    { id: 'expiring', label: t('filterExpiring'), color: '#FF4444' },
  ];
  const filtered = state.filter === 'all' ? state.tasks : state.tasks.filter(t => t.category === state.filter);
  const getCount = (id) => id === 'all' ? state.tasks.length : state.tasks.filter(t => t.category === id).length;
  const tabs = filters.map(f => `
    <button class="filter-tab ${state.filter === f.id ? 'active' : ''}" data-filter="${f.id}" style="border-bottom-color:${state.filter === f.id ? f.color : 'transparent'}">
      ${f.label}
      <span class="filter-count">${getCount(f.id)}</span>
    </button>
  `).join('');
  const list = filtered.length === 0
    ? `<div class="empty-state"><p>${t('emptyList')} ${state.filter !== 'all' ? `${t('inFilter')} "${filters.find(f => f.id === state.filter)?.label}"` : ''}</p></div>`
    : filtered.map(t => renderTaskItem(t, state.selectedTask?.id === t.id)).join('');
  return `
    <div class="task-list-container">
      <div class="task-list-header"><h2>${t('pendingHeader')}</h2><span data-lucide="filter"></span></div>
      <div class="filter-tabs" role="tablist" aria-label="${t('pendingHeader')} filters">${tabs}</div>
      <div class="task-list">${list}</div>
    </div>
  `;
};

// ---- Modal de creación de pendiente ----
const renderEventModal = () => `
  <div class="modal-overlay">
    <div class="event-modal">
      <div class="modal-header">
        <h3><span data-lucide="calendar-plus"></span> ${t('eventNewTitle')}</h3>
        <button class="close-btn" id="modal-close"><span data-lucide="x"></span></button>
      </div>
      <form class="event-form">
        <div class="form-group">
          <label><span data-lucide="type"></span> ${t('eventTitleLabel')}</label>
          <input id="modal-title-input" type="text" placeholder="${t('eventRequestPh')}" />
        </div>
        <div class="form-group">
          <label><span data-lucide="tag"></span> ${t('eventCategoryLabel')}</label>
          <select id="modal-category-select">
            <option value="recent">${t('filterRecent')}</option>
            <option value="urgent">${t('filterUrgent')}</option>
            <option value="expiring">${t('filterExpiring')}</option>
          </select>
        </div>
        <div class="form-group">
          <label><span data-lucide="clock"></span> ${t('eventRequestLabel')}</label>
          <input id="modal-request-input" type="text" placeholder="${t('eventRequestPh')}" />
        </div>
        <div class="modal-actions">
          <button type="button" class="cancel-btn" id="modal-cancel">${t('modalCancel')}</button>
          <button type="button" class="save-btn" id="modal-save">${t('modalSave')}</button>
        </div>
      </form>
    </div>
  </div>
`;

const renderDashboards = () => '';

const render = () => {
  const root = document.getElementById('root');
  const pageContent = (() => {
    if (state.activePage === 'planning') {
      const tpl = getTemplateHTML('planning-template');
      if (tpl) return tpl;
      return `<div class="planning-layout"><div class="calendar-section">${renderCalendar()}</div><div class="tasks-section">${renderTaskList()}</div></div>`;
    }
    const tpl = getTemplateHTML('dashboards-template');
    return tpl || renderDashboards();
  })();

  root.innerHTML = `
    <div class="app-container">
      ${renderSidebar()}
      <div class="main-content">
        ${renderHeader()}
        ${pageContent}
      </div>
    </div>
    ${state.showModal ? renderEventModal() : ''}
  `;

  // Re-inicializar el componente de menú tras cada render
  if (window.SocyaMenu && typeof window.SocyaMenu.initForCurrentDOM === 'function') {
    try { window.SocyaMenu.initForCurrentDOM(); } catch (e) { console.warn('SocyaMenu init error:', e); }
  }

  // Renderizar iconos Lucide (CDN) tras la estructura base
  renderIcons();

  // Reenganchar botón de hamburguesa para controlar el menú
  // Sin botón hamburguesa: el menú se controla por borde/hover

  // Aplicar traducción después de montar el DOM
  applyLanguage();

  if (state.activePage === 'dashboard' && window.initDashboard) {
    try { window.initDashboard(); } catch (e) { console.warn('Init dashboard error:', e); }
  }

  // Mantener el ítem "editar" tanto en menú como en footer; sin eliminar duplicados

  // Con hamburguesa, no colapsamos automáticamente al navegar
  const STORAGE_KEY = 'socya:sidebarCollapsed';
  const collapseSidebarOnNavigate = () => {};

  const welcomeBox = document.querySelector('.welcome-box');
  if (welcomeBox && !state.welcomeAnimatedShown) {
    welcomeBox.classList.add('welcome-animate');
    welcomeBox.addEventListener('animationend', () => {
      welcomeBox.classList.remove('welcome-animate');
    }, { once: true });
    state.welcomeAnimatedShown = true;
  }

  // Activar visualmente el item interno seleccionado (plantilla HTML)
  document.querySelectorAll('.sidebar .sidebar-item[data-page]').forEach(a => {
    const page = a.dataset.page;
    if (page === state.activePage) {
      a.classList.add('active');
      if (!a.querySelector('.active-indicator')) {
        a.insertAdjacentHTML('beforeend', '<div class="active-indicator"></div>');
      }
    }
  });

  // Navegación lateral (solo botones internos; los anchors navegan)
  document.querySelectorAll('button.sidebar-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const page = btn.dataset.page;
      if (!page) return; // enlaces externos dejan comportamiento por defecto
      e.preventDefault();
      state.activePage = page;
      render();
      // Al navegar desde el menú en móvil, colapsar el sidebar
      collapseSidebarOnNavigate();
    });
  });

  // Subida de avatar al hacer clic en la imagen (sin navegar)
  const avatarImgs = document.querySelectorAll('.sidebar-footer .avatar');
  const fileInput = document.getElementById('avatar-file-input');
  avatarImgs.forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      if (fileInput) {
        fileInput.value = '';
        fileInput.click();
      }
    });
  });
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      const maxSize = 4 * 1024 * 1024; // 4MB
      if (file.size > maxSize) {
        alert(state.preferences.language === 'en' ? 'Image too large (max 4MB).' : 'Imagen muy pesada (máximo 4MB).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result;
        if (!dataUrl || typeof dataUrl !== 'string') return;
        state.preferences.avatar = dataUrl;
        savePrefs();
        // Actualizar todas las instancias del avatar visibles
        document.querySelectorAll('.sidebar-footer .avatar').forEach(el => { el.src = dataUrl; });
        // Mantener la ilustración del banner intacta
        const fig = document.querySelector('.welcome-figure'); if (fig) fig.src = resolveAsset('img/Usuario1.png');
      };
      reader.readAsDataURL(file);
    });
  }


  if (state.activePage === 'planning') {
    // Si existe plantilla, inyectar contenido dinámico en los contenedores
    const calRoot = document.getElementById('calendar-root');
    const tasksRoot = document.getElementById('tasks-root');
    if (calRoot) calRoot.innerHTML = renderCalendar();
    if (tasksRoot) tasksRoot.innerHTML = renderTaskList();

    // Asegurar iconos tras inyección dinámica
    renderIcons();

    // Navegación de meses
    const prev = document.getElementById('prev-month');
    const next = document.getElementById('next-month');
    if (prev) prev.addEventListener('click', () => { state.currentDate.setMonth(state.currentDate.getMonth()-1); render(); });
    if (next) next.addEventListener('click', () => { state.currentDate.setMonth(state.currentDate.getMonth()+1); render(); });

    // Click en días (opcional: abrir modal de creación)
    document.querySelectorAll('.calendar-day').forEach(cell => {
      const dayStr = cell.dataset.day; if (!dayStr) return;
      cell.addEventListener('click', () => {
        const day = Number(dayStr);
        const now = new Date();
        state.modalDate = new Date(state.currentDate.getFullYear(), state.currentDate.getMonth(), day, now.getHours(), now.getMinutes());
        state.showModal = true;
        render();
      });
    });

    // Filtros
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => { state.filter = tab.dataset.filter; render(); });
    });

    // Selección y eliminación de tareas
    document.querySelectorAll('.task-item').forEach(item => {
      const id = Number(item.dataset.taskId);
      item.addEventListener('click', (e) => {
        if (e.target && (e.target.matches('.task-delete-btn') || e.target.closest('.task-delete-btn'))) return; // evitar selección al eliminar
        state.selectedTask = state.tasks.find(t => t.id === id) || null;
        render();
      });
    });
    document.querySelectorAll('.task-delete-btn').forEach(btn => {
      const id = Number(btn.dataset.deleteId);
      btn.addEventListener('click', (e) => { e.stopPropagation(); deleteTask(id); });
    });

    // Flatpickr para solución y reunión (seguro si CDN no carga)
    const solutionInput = document.getElementById('solution-input');
    const meetingInput = document.getElementById('meeting-input');
    if (solutionInput && window.flatpickr) {
      state.fpSolution = window.flatpickr(solutionInput, {
        locale: (state.preferences?.language==='en' ? undefined : window.flatpickr.l10ns.es),
        dateFormat: 'd/m/Y h:i K',
        enableTime: true,
        time_24hr: false,
        minuteIncrement: 5,
        allowInput: true,
        disableMobile: true,
        minDate: new Date(),
        defaultDate: state.selectedTask?.solutionDate ? new Date(state.selectedTask.solutionDate) : null,
      });
    }
    if (meetingInput && window.flatpickr) {
      state.fpMeeting = window.flatpickr(meetingInput, {
        locale: (state.preferences?.language==='en' ? undefined : window.flatpickr.l10ns.es),
        dateFormat: 'd/m/Y h:i K',
        enableTime: true,
        time_24hr: false,
        minuteIncrement: 5,
        allowInput: true,
        disableMobile: true,
        minDate: new Date(),
        defaultDate: state.selectedTask?.meetingDate ? new Date(state.selectedTask.meetingDate) : null,
      });
    }

    // Confirmar fechas (detalle de pendiente seleccionado)
    const btn = document.getElementById('confirm-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const parseDMYHK = (val) => {
          const m = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*([AP]M)\s*$/i.exec(val);
          if (!m) return null;
          const d = parseInt(m[1],10); const mo = parseInt(m[2],10)-1; const y = parseInt(m[3],10);
          let h = parseInt(m[4],10); const min = parseInt(m[5],10); const ap = m[6].toUpperCase();
          if (ap === 'PM' && h < 12) h += 12; if (ap === 'AM' && h === 12) h = 0;
          return new Date(y, mo, d, h, min);
        };
        const parseVisible = (val) => {
          if (window.flatpickr && typeof window.flatpickr.parseDate === 'function') {
            return window.flatpickr.parseDate(val, 'd/m/Y h:i K');
          }
          return parseDMYHK(val);
        };
        const now = new Date();
        const solVal = solutionInput?.value || '';
        const meetVal = meetingInput?.value || '';
        const solParsed = solVal ? parseVisible(solVal) : null;
        const meetParsed = meetVal ? parseVisible(meetVal) : null;
        let finalSolution = state.selectedTask?.solutionDate || '';
        let finalMeeting = state.selectedTask?.meetingDate || '';
        if (solParsed) finalSolution = (solParsed < now ? now : solParsed).toISOString().slice(0,16);
        if (meetParsed) finalMeeting = (meetParsed < now ? now : meetParsed).toISOString().slice(0,16);
        updateTask(state.selectedTask.id, { solutionDate: finalSolution || null, meetingDate: finalMeeting || null });
      });
    }
  }

  // Inicializar dashboard cuando es la vista activa
  if (state.activePage === 'dashboard') {
    // Al entrar a dashboard, asegurar que la vista de edición esté desactivada
    document.body.classList.remove('editing');
    // Preferencias y defaults de Chart antes de crear los gráficos
    try { loadPrefs(); } catch(_) {}
    applyPrefs();
    try { if (typeof window.applyChartDefaults === 'function') window.applyChartDefaults(); } catch {}
    if (window.initDashboard && typeof window.initDashboard === 'function') {
      try { window.initDashboard(); } catch (e) { console.error('Error inicializando dashboard:', e); }
    }
    // Tras inicializar, refrescar colores de gráficos según tema
    try { if (typeof window.refreshChartsForTheme === 'function') window.refreshChartsForTheme(); } catch {}
  }

  // Control del menú se realiza por acercamiento/hover (SocyaMenu)
  // Vista de edición: alternar clase en body para mostrar/ocultar
  if (state.activePage === 'editar') {
    document.body.classList.add('editing');
  } else {
    document.body.classList.remove('editing');
  }
  // Renderizar panel de edición y aplicar preferencias
  if (state.activePage === 'editar') {
    try { loadPrefs(); } catch(_) {}
    applyPrefs();
    const editRoot = document.getElementById('edit-view');
    if (editRoot) { editRoot.innerHTML = renderEditView(); initEditView(); renderIcons(); }
  } else {
    try { loadPrefs(); } catch(_) {}
    applyPrefs();
    try { if (typeof window.applyChartDefaults === 'function') window.applyChartDefaults(); } catch {}
    try { if (typeof window.refreshChartsForTheme === 'function') window.refreshChartsForTheme(); } catch {}
  }

  // Eventos del modal de creación
  if (state.showModal) {
    // Inicializar iconos del modal
    renderIcons();
    const titleInput = document.getElementById('modal-title-input');
    const categorySelect = document.getElementById('modal-category-select');
    const reqInput = document.getElementById('modal-request-input');
    const solInput = null;
    const meetInput = null;

    // Flatpickr en el modal (seguro si CDN no carga)
    if (reqInput && window.flatpickr) {
      state.fpModalRequest = window.flatpickr(reqInput, {
        locale: (state.preferences?.language==='en' ? undefined : window.flatpickr.l10ns.es),
        dateFormat: 'd/m/Y h:i K',
        enableTime: true,
        time_24hr: false,
        minuteIncrement: 5,
        allowInput: true,
        disableMobile: true,
        defaultDate: state.modalDate || new Date(),
      });
    }
    // Campos de solución y reunión ocultos en creación; se editan al seleccionar el pendiente

    const parseVisible = (val) => {
      if (!val) return null;
      if (window.flatpickr && typeof window.flatpickr.parseDate === 'function') {
        return window.flatpickr.parseDate(val, 'd/m/Y h:i K');
      }
      const m = /^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*([AP]M)\s*$/i.exec(val);
      if (!m) return null;
      const d = parseInt(m[1],10); const mo = parseInt(m[2],10)-1; const y = parseInt(m[3],10);
      let h = parseInt(m[4],10); const min = parseInt(m[5],10); const ap = m[6].toUpperCase();
      if (ap === 'PM' && h < 12) h += 12; if (ap === 'AM' && h === 12) h = 0;
      return new Date(y, mo, d, h, min);
    };
    const closeModal = () => { state.showModal = false; state.modalDate = null; render(); };
    const closeBtn = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('modal-cancel');
    const saveBtn = document.getElementById('modal-save');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const title = titleInput?.value?.trim() || t('newTask');
        const category = categorySelect?.value || 'recent';
        const reqParsed = parseVisible(reqInput?.value || '');
        const solParsed = null;
        const meetParsed = null;
        const toIso = (d) => d ? d.toISOString().slice(0,16) : null;
        addTask({
          title,
          category,
          requestDate: toIso(reqParsed || state.modalDate || new Date()),
          solutionDate: toIso(solParsed),
          meetingDate: toIso(meetParsed),
        });
        state.showModal = false;
        state.modalDate = null;
        render();
      });
    }
  }
};

// Inicializar
const detectInitialPage = () => {
  try {
    const p = (window.location && window.location.pathname || '').toLowerCase();
    if (p.includes('/public/editar.html') || p.endsWith('/editar.html')) {
      state.activePage = 'editar';
    } else if (p === '/' || p === '' || p.includes('/public/index.html') || p.endsWith('/index.html')) {
      state.activePage = 'planning';
    } else if (p.includes('/public/dashboard.html') || p.endsWith('/dashboard.html')) {
      state.activePage = 'dashboard';
    }
  } catch(_) {}
};
// Ejecutar la inicialización una vez que el archivo y el DOM estén listos,
// para evitar referencias a constantes definidas más abajo (p. ej., DEPARTMENTS).
const runInitialRender = () => {
  try {
    loadPrefs();
    applyPrefs();
    // Ensure HTML lang reflects preferences before first render
    try { document.documentElement.lang = state.preferences?.language || 'es'; } catch {}
    detectInitialPage();
    render();
    applyLanguage();
    // Inicializar/reenlazar el componente de menú para el DOM actual
    if (window.SocyaMenu && typeof window.SocyaMenu.initForCurrentDOM === 'function') {
      window.SocyaMenu.initForCurrentDOM();
    }
  } catch (err) {
    console.error('Init error:', err);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runInitialRender);
} else {
  // Si el documento ya está cargado, diferir al siguiente tick para
  // asegurar que el archivo completo (incluyendo constantes posteriores) se haya evaluado.
  setTimeout(runInitialRender, 0);
}
// Departamentos con id canónico y etiquetas por idioma
const DEPARTMENTS = [
  { id: 'ti', es: 'Operaciones TI', en: 'IT Operations' },
  { id: 'fin', es: 'Finanzas', en: 'Finance' },
  { id: 'hr', es: 'RRHH', en: 'HR' },
  { id: 'sales', es: 'Comercial', en: 'Sales' },
  { id: 'log', es: 'Logística', en: 'Logistics' }
];
const deptLabel = (id) => {
  const d = DEPARTMENTS.find(x => x.id === id);
  if (!d) return id;
  return (state?.preferences?.language === 'en') ? d.en : d.es;
};
