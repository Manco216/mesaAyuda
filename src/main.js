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
  showAdmaAuth: false,
  admaPassword: '',
  admaView: null,
  siteConfig: {},
  // Estado de colapso del menú lateral (inicia oculto hasta que el usuario haga clic)
  sidebarCollapsed: true,
  // Preferencias de interfaz y usuario
  preferences: {
    name: '',
    surname: '',
    email: '',
    phone: '',
    location: '',
    departmentName: '',
    department: 'ti',
    language: 'es',
    theme: 'light',
    fontSize: 16,
    palette: null,
    avatar: null,
    notifyEmail: true,
    weeklyReminders: false,
  },
};

const ADMA_PASS_KEY = 'socya:admaPass';
const loadAdminPass = () => {
  try {
    const v = localStorage.getItem(ADMA_PASS_KEY);
    return v && v.length ? v : 'admin';
  } catch (_) {
    return 'admin';
  }
};
const saveAdminPass = (pwd) => {
  try {
    localStorage.setItem(ADMA_PASS_KEY, String(pwd || 'admin'));
  } catch (_) {}
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

const showSuccessAlert = (message) => {
  const id = 'successAlertOverlay';
  let overlay = document.getElementById(id);
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = id;
    overlay.className = 'alert-overlay';
    overlay.innerHTML = '<div class="alert-dialog"><svg class="success-anim" viewBox="0 0 120 120" aria-hidden="true"><circle class="ring" cx="60" cy="60" r="46"></circle><circle class="fill" cx="60" cy="60" r="46"></circle><path class="check" d="M38 62 L52 76 L82 46"></path></svg><div class="alert-title"></div></div>';
    document.body.appendChild(overlay);
  }
  // Reiniciar animación siempre: reemplazar el SVG para reiniciar los keyframes
  const dialog = overlay.querySelector('.alert-dialog');
  if (dialog) {
    let svg = dialog.querySelector('.success-anim');
    if (svg) { try { svg.remove(); } catch(_) {} }
    const fresh = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    fresh.setAttribute('class', 'success-anim');
    fresh.setAttribute('viewBox', '0 0 120 120');
    fresh.setAttribute('aria-hidden', 'true');
    const mk = (tag, attrs) => { const el = document.createElementNS('http://www.w3.org/2000/svg', tag); Object.entries(attrs||{}).forEach(([k,v]) => el.setAttribute(k,v)); return el; };
    fresh.appendChild(mk('circle', { class: 'ring', cx: '60', cy: '60', r: '46' }));
    fresh.appendChild(mk('circle', { class: 'fill', cx: '60', cy: '60', r: '46' }));
    fresh.appendChild(mk('path', { class: 'check', d: 'M38 62 L52 76 L82 46' }));
    const titleEl = dialog.querySelector('.alert-title');
    dialog.insertBefore(fresh, titleEl || null);
  }
  const title = overlay.querySelector('.alert-title');
  if (title) title.textContent = String(message||'');
  // Cancelar temporizador anterior si existe
  if (overlay.__hideTimer) { try { clearTimeout(overlay.__hideTimer); } catch(_) {} }
  overlay.classList.remove('show');
  // Forzar reflow antes de mostrar para asegurar CSS aplica desde estado inicial
  void overlay.offsetWidth;
  overlay.classList.add('show');
  overlay.__hideTimer = setTimeout(() => { overlay.classList.remove('show'); overlay.__hideTimer = null; }, 2200);
};

const showErrorAlert = (message) => {
  const id = 'errorAlertOverlay';
  let overlay = document.getElementById(id);
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = id;
    overlay.className = 'alert-overlay';
    overlay.innerHTML = '<div class="alert-dialog"><svg class="error-anim" viewBox="0 0 120 120" aria-hidden="true"><circle class="ring" cx="60" cy="60" r="46"></circle><circle class="fill" cx="60" cy="60" r="46"></circle><path class="cross" d="M40 40 L80 80 M80 40 L40 80"></path></svg><div class="alert-title"></div></div>';
    document.body.appendChild(overlay);
  }
  const dialog = overlay.querySelector('.alert-dialog');
  if (dialog) {
    let svg = dialog.querySelector('.error-anim');
    if (svg) { try { svg.remove(); } catch(_) {} }
    const fresh = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    fresh.setAttribute('class', 'error-anim');
    fresh.setAttribute('viewBox', '0 0 120 120');
    fresh.setAttribute('aria-hidden', 'true');
    const mk = (tag, attrs) => { const el = document.createElementNS('http://www.w3.org/2000/svg', tag); Object.entries(attrs||{}).forEach(([k,v]) => el.setAttribute(k,v)); return el; };
    fresh.appendChild(mk('circle', { class: 'ring', cx: '60', cy: '60', r: '46' }));
    fresh.appendChild(mk('circle', { class: 'fill', cx: '60', cy: '60', r: '46' }));
    fresh.appendChild(mk('path', { class: 'cross', d: 'M40 40 L80 80 M80 40 L40 80' }));
    const titleEl = dialog.querySelector('.alert-title');
    dialog.insertBefore(fresh, titleEl || null);
  }
  const title = overlay.querySelector('.alert-title');
  if (title) title.textContent = String(message||'');
  if (overlay.__hideTimer) { try { clearTimeout(overlay.__hideTimer); } catch(_) {} }
  overlay.classList.remove('show');
  void overlay.offsetWidth;
  overlay.classList.add('show');
  overlay.__hideTimer = setTimeout(() => { overlay.classList.remove('show'); overlay.__hideTimer = null; }, 2400);
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

const passwordStrength = (pwd) => {
  const s = (pwd || '').trim();
  let score = 0;
  if (s.length >= 8) score++;
  if (/[A-Z]/.test(s)) score++;
  if (/[a-z]/.test(s)) score++;
  if (/\d/.test(s)) score++;
  if (/[^A-Za-z0-9]/.test(s)) score++;
  return Math.min(score, 4);
};
const passwordStrengthLabel = (score) => {
  if (score <= 1) return tr('Débil','Weak');
  if (score === 2) return tr('Media','Medium');
  if (score === 3) return tr('Fuerte','Strong');
  return tr('Muy fuerte','Very strong');
};
const openAdmaAuth = () => { state.showAdmaAuth = true; state.admaPassword = ''; render(); };

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
        <div class="edit-card">
          <h2>${t('userConfig')}</h2>
          <div class="edit-grid">
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
          </div>
        <div class="edit-grid">
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
        </div>
        <div class="edit-grid">
          <div class="edit-field">
            <label for="edit-phone">Número de teléfono</label>
            <input id="edit-phone" type="tel" autocomplete="tel" value="${p.phone || ''}" placeholder="">
          </div>
          <div class="edit-field">
            <label for="edit-location">Ubicación</label>
            <select id="edit-location">
              ${LOCATIONS.map(l => `<option value="${l.id}" ${p.location===l.id?'selected':''}>${locationLabel(l.id)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="edit-grid">
          <div class="edit-field" style="grid-column: 1 / -1">
            <label for="edit-dept-name">Departamento</label>
            <select id="edit-dept-name">
              ${ORG_DEPT_NAMES.map(d => `<option value="${d.id}" ${p.departmentName===d.id?'selected':''}>${orgDeptLabel(d.id)}</option>`).join('')}
            </select>
          </div>
        </div>
          <div class="edit-field">
            <label>Foto de perfil</label>
            <div class="photo-row">
              <img id="edit-avatar-preview" class="avatar-preview" src="${p.avatar || resolveAsset('img/Usuario1.png')}" alt="Avatar" />
              <div class="photo-actions">
                <button type="button" id="btn-upload-photo" class="photo-btn upload">Subir foto</button>
                <button type="button" id="btn-remove-photo" class="photo-btn remove">Quitar foto</button>
              </div>
              <input id="edit-avatar-file" type="file" accept="image/*" hidden />
            </div>
          </div>
          <div class="section-subtitle">Cambiar contraseña</div>
          <div class="edit-grid two">
            <div class="edit-field">
              <label for="edit-pass-current">Contraseña actual</label>
              <input id="edit-pass-current" type="password" autocomplete="current-password" placeholder="••••••••">
            </div>
            <div class="edit-field">
              <label for="edit-pass-new">Nueva contraseña</label>
              <input id="edit-pass-new" type="password" autocomplete="new-password" placeholder="••••••••">
              <div class="edit-hint">Mínimo 8 caracteres.</div>
            </div>
          </div>
          <div class="edit-field" style="grid-column: 1 / -1; text-align:right">
            <button id="btn-save-user" type="button" class="edit-save-btn">${t('save')}</button>
          </div>
        </div>
        <div class="edit-card">
          <h2>${t('palettes')}</h2>
          <div id="palette-list">
            ${PALETTES.map(pal => `
              <div class="palette-card" data-id="${pal.id}">
                <div class="palette-swatches">
                  ${pal.swatches.map(c => `<div style=\"background:${c}\" title=\"${c}\"></div>`).join('')}
                </div>
                <div class="palette-actions">
                  <button class="preview" data-action="preview">${t('preview')}</button>
                  <button class="apply" data-action="apply">${t('apply')}</button>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="edit-hint">${t('logoHint')}</div>
          <h2 style="margin-top:16px">${t('uiPrefs')}</h2>
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
        </div>
      </div>
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
  const phone = document.getElementById('edit-phone'); if (phone) phone.addEventListener('input', () => { state.preferences.phone = phone.value.trim(); savePrefs(); });
  const location = document.getElementById('edit-location'); if (location) location.addEventListener('change', () => { state.preferences.location = location.value; savePrefs(); });
  const deptName = document.getElementById('edit-dept-name'); if (deptName) deptName.addEventListener('change', () => { state.preferences.departmentName = deptName.value; savePrefs(); });
  (function bindAvatarEdit(){
    const upload = document.getElementById('btn-upload-photo');
    const remove = document.getElementById('btn-remove-photo');
    const file = document.getElementById('edit-avatar-file');
    const preview = document.getElementById('edit-avatar-preview');
    if (upload && file) upload.addEventListener('click', () => { try { file.value = ''; file.click(); } catch(_) {} });
    if (file) file.addEventListener('change', () => {
      const f = file.files && file.files[0];
      if (!f) return;
      const maxSize = 4 * 1024 * 1024;
      if (f.size > maxSize) { showErrorAlert(state.preferences.language==='en' ? 'Image too large (max 4MB).' : 'Imagen muy pesada (máximo 4MB).'); return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result;
        if (!dataUrl || typeof dataUrl !== 'string') return;
        state.preferences.avatar = dataUrl; savePrefs();
        document.querySelectorAll('.header-avatar').forEach(el => { el.src = dataUrl; });
        if (preview) preview.src = dataUrl;
      };
      reader.readAsDataURL(f);
    });
    if (remove) remove.addEventListener('click', () => {
      state.preferences.avatar = null; savePrefs();
      const def = resolveAsset('img/Usuario1.png');
      document.querySelectorAll('.header-avatar').forEach(el => { el.src = def; });
      if (preview) preview.src = def;
    });
  })();
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
  const prefNotify = document.getElementById('pref-notify-email'); if (prefNotify) prefNotify.addEventListener('change', () => { state.preferences.notifyEmail = !!prefNotify.checked; savePrefs(); });
  const prefWeekly = document.getElementById('pref-weekly'); if (prefWeekly) prefWeekly.addEventListener('change', () => { state.preferences.weeklyReminders = !!prefWeekly.checked; savePrefs(); });
  // Reset
  const btnReset = document.getElementById('btn-reset'); if (btnReset) btnReset.addEventListener('click', () => {
    state.preferences = { name:'', surname:'', email:'', phone:'', location:'', departmentName:'', department:'ti', language:'es', theme:'light', fontSize:16, palette:null, avatar:null, notifyEmail:true, weeklyReminders:false };
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
      const phoneEl = document.getElementById('edit-phone');
      const locationEl = document.getElementById('edit-location');
      const deptNameEl = document.getElementById('edit-dept-name');
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
        if (phoneEl) state.preferences.phone = phoneEl.value.trim();
        if (locationEl) state.preferences.location = locationEl.value.trim();
        if (deptNameEl) state.preferences.departmentName = deptNameEl.value.trim();
        savePrefs();
        applyPrefs();
        render();
        applyLanguage();
      }
    });
  }

  const btnChangePass = document.getElementById('btn-change-pass');
  if (btnChangePass) {
    btnChangePass.addEventListener('click', () => {
      const cur = document.getElementById('edit-pass-current');
      const nw = document.getElementById('edit-pass-new');
      const cf = document.getElementById('edit-pass-confirm');
      const err = document.getElementById('err-pass');
      if (!nw || !cf || !err) return;
      const a = (nw.value || '').trim();
      const b = (cf.value || '').trim();
      if (!a || a.length < 8) { err.textContent = 'La contraseña debe tener al menos 8 caracteres'; err.classList.add('show'); return; }
      if (a !== b) { err.textContent = 'Las contraseñas no coinciden'; err.classList.add('show'); return; }
      err.textContent = 'Contraseña actualizada';
      err.classList.add('show');
      setTimeout(() => { err.classList.remove('show'); err.textContent = ''; nw.value = ''; cf.value = ''; if (cur) cur.value = ''; }, 1400);
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
    </div>
  `;
};

const renderHeader = () => {
  const tpl = getTemplateHTML('header-template');
  const isDashboard = (() => {
    try {
      const p = (window.location && window.location.pathname) || '';
      const byPath = /\/dashboard\.html$/.test(p);
      const onEditPath = /\/editar\.html$/.test(p);
      const byState = state.activePage === 'dashboard';
      return (byState || byPath) && !onEditPath && state.activePage !== 'planning' && state.activePage !== 'editar';
    } catch(_) { return state.activePage === 'dashboard'; }
  })();
  const customizeItem = isDashboard ? `<button type="button" class="header-menu-item" role="menuitem" data-action="customize-dashboard"><span class="menu-icon" data-lucide="wand-2"></span><span>Personaliza tu dashboard</span></button>` : '';
  const menuHTML = `
    <div id="header-menu" class="header-menu" role="menu" aria-labelledby="header-profile" hidden>
      <button type="button" class="header-menu-item" role="menuitem" data-action="go-edit"><span class="menu-icon" data-lucide="square-pen"></span><span>Editar</span></button>
      ${customizeItem}
      <button type="button" class="header-menu-item logout" role="menuitem" data-action="logout"><span class="menu-icon" data-lucide="log-out"></span><span>Cerrar sesión</span></button>
    </div>`;
  if (tpl) {
    return `
      <header class="header">
        <div class="header-content">
          <div class="header-bar">
            <button id="header-profile" class="header-profile-btn" aria-label="Perfil" aria-haspopup="menu" aria-expanded="false" aria-controls="header-menu"><img src="${state.preferences?.avatar || resolveAsset('img/Usuario1.png')}" alt="Perfil" class="header-avatar" /></button>
            ${menuHTML}
            <input id="avatar-file-input" type="file" accept="image/*" hidden aria-hidden="true" />
          </div>
          <div class="welcome-box">${tpl}</div>
          ${state.activePage === 'dashboard' ? '<button id="fabMain" type="button" class="dashboard-cta">Personaliza tu dashboard</button>' : ''}
        </div>
      </header>
    `;
  }
  return `
    <header class="header">
      <div class="header-content">
        <div class="header-bar">
          <button id="header-profile" class="header-profile-btn" aria-label="Perfil" aria-haspopup="menu" aria-expanded="false" aria-controls="header-menu"><img src="${state.preferences?.avatar || resolveAsset('img/Usuario1.png')}" alt="Perfil" class="header-avatar" /></button>
          ${menuHTML}
          <input id="avatar-file-input" type="file" accept="image/*" hidden aria-hidden="true" />
        </div>
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
    if (state.activePage === 'adma') {
      if (state.admaView === 'config') {
        const cfgTpl = getTemplateHTML('adma-config-template');
        if (cfgTpl) return cfgTpl;
        return `<section class="admin-config"><h2>Configuración</h2><p>Formulario de configuración no disponible.</p></section>`;
      } else if (state.admaView === 'changePass') {
        const passTpl = getTemplateHTML('adma-change-pass-template');
        if (passTpl) return passTpl;
        return `<section class="admin-config"><h2>Cambiar la contraseña del administrador</h2></section>`;
      } else if (state.admaView === 'mail' || state.admaView === 'mailEdit') {
        const mailDefaults = {
          user_new: { subject: 'Nueva solicitud de servicio #[problemid]', body: 'Su solicitud fue registrada correctamente.\n\nPuede ingresar a su solicitud con el siguiente enlace: [url]\n\nDETALLES\nID: [problemid]\nUsuario: [uid]' },
          user_update: { subject: 'Solicitud de servicio: #[problemid] Actualizada', body: 'Su solicitud de servicio fue actualizada, agradecemos revisar la actualización de las notas.\n\nPuede ingresar a su solicitud de servicio con el siguiente enlace: [url]\n\nDETALLES DE LA SOLICITUD\n--------------\nID: [problemid]\nUsuario: [uid]' },
          user_close: { subject: 'Solicitud #[problemid] cerrada', body: 'Su solicitud ha sido cerrada.\n\nPuede revisar los detalles y dejar comentarios en: [url]' },
          rep_new: { subject: 'Nuevo ticket asignado #[problemid]', body: 'Se le ha asignado un nuevo ticket.\n\nVer detalles: [url]\nUsuario: [uid]' },
          rep_update: { subject: 'Ticket #[problemid] actualizado', body: 'El ticket ha sido actualizado.\n\nVer detalles: [url]' },
          rep_close: { subject: 'Ticket #[problemid] cerrado', body: 'El ticket ha sido cerrado.\n\nVer detalles: [url]' },
          rep_pager: { subject: 'Aviso de pager #[problemid]', body: 'Alerta de pager generada para el ticket.\n\nVer detalles: [url]' }
        };
        const MAIL_KEY = 'socya:mailTemplates';
        const loadMail = () => { try { const raw = localStorage.getItem(MAIL_KEY); if (raw) return { ...mailDefaults, ...(JSON.parse(raw)||{}) }; } catch(_) {} return { ...mailDefaults }; };
        const mails = loadMail();
        const key = state.mailKey || 'user_update';
        const opts = [
          ['user_new','User - New'],
          ['user_update','User - Update'],
          ['user_close','User - Close'],
          ['rep_new','Rep - New'],
          ['rep_update','Rep - Update'],
          ['rep_close','Rep - Close'],
          ['rep_pager','Rep - Pager']
        ];
        if (state.admaView === 'mail') {
          return `
          <section class="admin-config" aria-label="Mensajes de correo">
            <header class="admin-config-header">
              <h2>${tr('Mensajes de correo','E-mail Messages')}</h2>
              <div class="admin-config-actions">
                <button type="button" class="admin-config-btn" data-action="back"><span data-lucide="arrow-left"></span><span>Volver</span></button>
              </div>
            </header>
            <form id="mailSelectForm" class="admin-form" novalidate>
              <div class="form-field">
                <label for="mailMessageSel"><strong>${tr('Mensaje:','Message:')}</strong></label>
                <select id="mailMessageSel">${opts.map(([v,l]) => `<option value="${v}" ${v===key?'selected':''}>${l}</option>`).join('')}</select>
              </div>
              <div style="padding-top:10px">
                <button type="button" id="mailEditBtn" class="admin-config-btn primary"><span data-lucide="square-pen"></span><span>${tr('Editar mensaje','Edit Message')}</span></button>
              </div>
            </form>
          </section>`;
        } else {
          const cur = mails[key] || { subject:'', body:'' };
          return `
          <section class="admin-config" aria-label="Editar mensaje de correo">
            <header class="admin-config-header">
              <h2>${tr('Mensajes de correo','E-mail Messages')}</h2>
              <div class="admin-config-actions">
                <button type="button" class="admin-config-btn" data-action="back-to-mail"><span data-lucide="arrow-left"></span><span>${tr('Elegir otro mensaje','Choose another message')}</span></button>
              </div>
            </header>
            <form id="mailEditForm" class="admin-form" novalidate>
              <div class="form-field">
                <label for="mailSubject">${tr('Asunto:','Subject:')}</label>
                <input id="mailSubject" type="text" value="${cur.subject.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}" />
              </div>
              <div class="form-field">
                <label for="mailBody">${tr('Cuerpo:','Body:')}</label>
                <textarea id="mailBody" rows="10" style="min-height:180px">${cur.body.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</textarea>
              </div>
              <div style="padding:6px 0">
                <button type="button" id="mailSyntaxHelp" class="admin-config-btn"><span data-lucide="help-circle"></span><span>${tr('Ayuda de sintaxis','Syntax Help')}</span></button>
              </div>
              <div style="padding-top:6px">
                <button type="button" id="mailSaveBtn" class="admin-config-btn primary"><span data-lucide="save"></span><span>${tr('Guardar','Save')}</span></button>
              </div>
              <div style="padding-top:14px">
                <button type="button" id="mailGoAdmin" class="admin-config-btn"><span data-lucide="home"></span><span>${tr('Menú administrativo','Administrative Menu')}</span></button>
              </div>
            </form>
          </section>`;
        }
      } else if (state.admaView === 'users' || state.admaView === 'userEdit' || state.admaView === 'userAdd') {
        const USERS_KEY = 'socya:users';
        const defaults = [
          { id: 1, username: 'aaguirre', firstName: 'Alejandro', lastName: 'Aguirre Gutiérrez', email: 'aaguirre@socya.org.co', pager: '', phone: '3184695944', location: 'Pereira', department: 'DIRECCION DE PROYECTOS SOCIOAMBIENTALES', language: 'es', isSupport: false, access: 'normal', password: '' },
          { id: 2, username: 'aarango', firstName: 'Alexander', lastName: 'Arango Sánchez', email: 'aarango@socya.org.co', pager: '', phone: '', location: '', department: 'DIRECCION DE PROYECTOS SOCIOAMBIENTALES', language: 'es', isSupport: false, access: 'normal', password: '' },
          { id: 3, username: 'aarboleda', firstName: 'Angie Paola', lastName: 'Arboleda Marquez', email: 'aarboleda@socya.org.co', pager: '', phone: '', location: '', department: 'DIRECCION DE PROYECTOS SOCIOAMBIENTALES', language: 'es', isSupport: false, access: 'normal', password: '' }
        ];
        const loadUsers = () => { try { const raw = localStorage.getItem(USERS_KEY); if (raw) return (JSON.parse(raw)||defaults); } catch(_) {} return defaults; };
        const esc = (s) => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        const users = loadUsers();
        const departments = [ 'DIRECCION DE PROYECTOS SOCIOAMBIENTALES', 'DIRECCION ADMINISTRATIVA Y FINANCIERA', 'TECNOLOGÍAS DE INFORMACIÓN', 'Not Specified' ];
        const langs = [ ['es', tr('Español (Spanish)','Spanish (Español)')], ['en', tr('Inglés (English)','English (English)')] ];
        const accessLevels = [ ['normal', tr('Normal','Normal')], ['admin', tr('Administrador','Admin')] ];
        const selId = state.selectedUserId || users[0]?.id || 0;
        if (state.admaView === 'users') {
          return `
          <section class="admin-config" aria-label="Administrar usuarios">
            <header class="admin-config-header"><h2>${tr('Administrar Usuarios','Manage Users')}</h2><div class="admin-config-actions"><button type="button" class="admin-config-btn" data-action="back"><span data-lucide="arrow-left"></span><span>${tr('Volver','Back')}</span></button></div></header>
            <form class="admin-form" id="manageUsersForm">
              <div class="form-field">
                <select id="userList" size="12">${users.map(u => `<option value="${u.id}" ${u.id===selId?'selected':''}>${esc(u.username)} (${esc(u.firstName)} ${esc(u.lastName)})</option>`).join('')}</select>
              </div>
              <div style="padding-top:10px"><button type="button" id="editUserBtn" class="admin-config-btn primary"><span data-lucide="square-pen"></span><span>${tr('Editar usuario','Edit User Account')}</span></button></div>
              <div style="padding-top:10px"><button type="button" id="addUserLink" class="admin-config-btn primary"><span data-lucide="user-plus"></span><span>${tr('Agregar usuarios','Add New Users')}</span></button></div>
            </form>
          </section>`;
        }
        if (state.admaView === 'userEdit') {
          const u = users.find(x => x.id === selId) || users[0] || { id: 0, username:'', firstName:'', lastName:'', email:'', pager:'', phone:'', location:'', department:'Not Specified', language:'es', isSupport:false, access:'normal', password:'' };
          return `
          <section class="admin-config" aria-label="Actualizar usuario">
            <header class="admin-config-header"><h2>${tr('Actualizar Información','Update Information')}</h2><div class="admin-config-actions"><button type="button" class="admin-config-btn" data-action="back-users"><span data-lucide="arrow-left"></span><span>${tr('Volver','Back')}</span></button></div></header>
            <form id="userEditForm" class="admin-form" novalidate>
              <div class="form-field"><label for="uUser">${tr('Usuario','User Name')}:</label><input id="uUser" type="text" value="${esc(u.username)}" disabled /></div>
              <div class="form-field"><label for="uFirst">${tr('Nombre','First Name')}:</label><input id="uFirst" type="text" required value="${esc(u.firstName)}" /></div>
              <div class="form-field"><label for="uLast">${tr('Apellido','Last Name')}:</label><input id="uLast" type="text" required value="${esc(u.lastName)}" /></div>
              <div class="form-field"><label for="uEmail">${tr('Correo electrónico','E-Mail Address')}:</label><input id="uEmail" type="email" required value="${esc(u.email)}" /></div>
              <div class="form-field"><label for="uPager">${tr('Dirección de pager','Pager Address')}:</label><input id="uPager" type="text" value="${esc(u.pager)}" /></div>
              <div class="form-field"><label for="uPhone">${tr('Teléfono','Phone Number')}:</label><input id="uPhone" type="text" value="${esc(u.phone)}" /></div>
              <div class="form-field"><label for="uLoc">${tr('Ubicación','Location')}:</label><input id="uLoc" type="text" value="${esc(u.location)}" /></div>
              <div class="form-field"><label for="uDept">${tr('Departamento','Department')}:</label><select id="uDept">${departments.map(d => `<option value="${esc(d)}" ${u.department===d?'selected':''}>${esc(d)}</option>`).join('')}</select></div>
              <div class="form-field"><label for="uLang">${tr('Idioma','Language')}:</label><select id="uLang">${langs.map(([v,l]) => `<option value="${v}" ${u.language===v?'selected':''}>${l}</option>`).join('')}</select></div>
              <div class="form-field"><label>${tr('Agente de soporte','Support Rep')}:</label><div><input id="uSupport" type="checkbox" ${u.isSupport?'checked':''} /> <label for="uSupport">${tr('Habilitar','Enable')}</label></div></div>
              <div class="form-field"><label for="uAccess">${tr('Nivel de acceso','Access Level')}:</label><select id="uAccess">${accessLevels.map(([v,l]) => `<option value="${v}" ${u.access===v?'selected':''}>${l}</option>`).join('')}</select></div>
              <div class="form-field"><label for="uPass">${tr('Nueva contraseña','New Password')}:</label><input id="uPass" type="password" /></div>
              <div style="padding-top:8px"><button type="button" id="userSaveBtn" class="admin-config-btn primary"><span data-lucide="save"></span><span>${tr('Guardar','Save')}</span></button></div>
              <div style="padding-top:8px; display:flex; gap:8px"><button type="button" id="userChooseLink" class="admin-config-btn"><span data-lucide="arrow-left"></span><span>${tr('Elegir otro usuario','Choose another user')}</span></button></div>
              <div style="padding-top:12px"><button type="button" id="userDeleteBtn" class="admin-config-btn"><span data-lucide="trash-2"></span><span>${tr('Eliminar cuenta','Delete Account')}</span></button></div>
            </form>
          </section>`;
        }
        if (state.admaView === 'userAdd') {
          return `
          <section class="admin-config" aria-label="Agregar usuario">
            <header class="admin-config-header"><h2>${tr('Agregar usuarios','Add New Users')}</h2><div class="admin-config-actions"><button type="button" class="admin-config-btn" data-action="back-users"><span data-lucide="arrow-left"></span><span>${tr('Volver','Back')}</span></button></div></header>
            <form id="userAddForm" class="admin-form" novalidate>
              <div class="form-field"><label for="nUser">${tr('Usuario','User Name')}:</label><input id="nUser" type="text" required /></div>
              <div class="form-field"><label for="nFirst">${tr('Nombre','First Name')}:</label><input id="nFirst" type="text" required /></div>
              <div class="form-field"><label for="nLast">${tr('Apellido','Last Name')}:</label><input id="nLast" type="text" required /></div>
              <div class="form-field"><label for="nEmail">${tr('Correo electrónico','E-Mail Address')}:</label><input id="nEmail" type="email" required /></div>
              <div class="form-field"><label for="nPager">${tr('Dirección de pager','Pager Address')}:</label><input id="nPager" type="text" /></div>
              <div class="form-field"><label for="nPhone">${tr('Teléfono','Phone Number')}:</label><input id="nPhone" type="text" /></div>
              <div class="form-field"><label for="nLoc">${tr('Ubicación','Location')}:</label><input id="nLoc" type="text" /></div>
              <div class="form-field"><label for="nDept">${tr('Departamento','Department')}:</label><select id="nDept">${departments.map(d => `<option value="${esc(d)}">${esc(d)}</option>`).join('')}</select></div>
              <div class="form-field"><label for="nLang">${tr('Idioma','Language')}:</label><select id="nLang">${langs.map(([v,l]) => `<option value="${v}">${l}</option>`).join('')}</select></div>
              <div class="form-field"><label>${tr('Agente de soporte','Support Rep')}:</label><div><input id="nSupport" type="checkbox" /> <label for="nSupport">${tr('Habilitar','Enable')}</label></div></div>
              <div class="form-field"><label for="nAccess">${tr('Nivel de acceso','Access Level')}:</label><select id="nAccess">${accessLevels.map(([v,l]) => `<option value="${v}">${l}</option>`).join('')}</select></div>
              <div class="form-field"><label for="nPass">${tr('Nueva contraseña','New Password')}:</label><input id="nPass" type="password" required /></div>
              <div style="padding-top:8px"><button type="button" id="userCreateBtn" class="admin-config-btn primary"><span data-lucide="save"></span><span>${tr('Guardar','Save')}</span></button></div>
              
            </form>
          </section>`;
        }
      } else if (state.admaView === 'categories' || state.admaView === 'categoryEdit' || state.admaView === 'categoryAdd') {
        const CATEGORIES_KEY = 'socya:categories';
        const USERS_KEY = 'socya:users';
        const userDefaults = [
          { id: 1, username: 'aaguirre', firstName: 'Alejandro', lastName: 'Aguirre Gutiérrez', email: 'aaguirre@socya.org.co', pager: '', phone: '3184695944', location: 'Pereira', department: 'DIRECCION DE PROYECTOS SOCIOAMBIENTALES', language: 'es', isSupport: false, access: 'normal', password: '' },
          { id: 2, username: 'aarango', firstName: 'Alexander', lastName: 'Arango Sánchez', email: 'aarango@socya.org.co', pager: '', phone: '', location: '', department: 'DIRECCION DE PROYECTOS SOCIOAMBIENTALES', language: 'es', isSupport: false, access: 'normal', password: '' },
          { id: 3, username: 'aarboleda', firstName: 'Angie Paola', lastName: 'Arboleda Marquez', email: 'aarboleda@socya.org.co', pager: '', phone: '', location: '', department: 'DIRECCION DE PROYECTOS SOCIOAMBIENTALES', language: 'es', isSupport: false, access: 'normal', password: '' }
        ];
        const loadUsers = () => { try { const raw = localStorage.getItem(USERS_KEY); if (raw) return (JSON.parse(raw)||userDefaults); } catch(_) {} return userDefaults; };
        const users = loadUsers();
        const reps = users.map(u => u.username);
        const catDefaults = [
          { id: 1, name: 'A: Creacion de centros de costos GP', rep: reps[0] || 'aaguirre' },
          { id: 2, name: 'A: Permisos en plataforma de clientes', rep: reps[2] || reps[0] || 'aarboleda' }
        ];
        const loadCats = () => { try { const raw = localStorage.getItem(CATEGORIES_KEY); if (raw) return (JSON.parse(raw)||catDefaults); } catch(_) {} return catDefaults; };
        const esc = (s) => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        const cats = loadCats();
        if (state.admaView === 'categories') {
          return `
          <section class="admin-config" aria-label="Administrar categorías">
            <header class="admin-config-header"><h2>${tr('Administrar Categorías','Manage Categories')}</h2><div class="admin-config-actions"><button type="button" class="admin-config-btn" data-action="back"><span data-lucide="arrow-left"></span><span>${tr('Volver','Back')}</span></button></div></header>
            <form class="admin-form" id="manageCategoriesForm">
              <div class="form-field">
                <table class="admin-table" id="categoriesTable" aria-label="${tr('Categorías','Categories')}">
                  <thead><tr><th>${tr('Categoría','Category')}</th><th>${tr('Rep','Rep')}</th><th>${tr('Modificar','Modify')}</th></tr></thead>
                  <tbody>
                    ${cats.map(c => `
                      <tr data-id="${c.id}">
                        <td>${esc(c.name)}</td>
                        <td>${esc(c.rep)}</td>
                        <td>
                          <button type="button" class="admin-config-btn" data-action="edit-cat" data-id="${c.id}"><span data-lucide="square-pen"></span><span>${tr('Editar','Edit')}</span></button>
                          <button type="button" class="admin-config-btn" data-action="delete-cat" data-id="${c.id}"><span data-lucide="trash-2"></span><span>${tr('Eliminar','Delete')}</span></button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
              <div style="padding-top:10px"><button type="button" id="addCategoryBtn" class="admin-config-btn primary"><span data-lucide="plus"></span><span>${tr('Agregar nueva categoría','Add New Category')}</span></button></div>
            </form>
          </section>`;
        } else {
          const id = state.selectedCategoryId || 0;
          const cur = cats.find(x => x.id === id) || { id: 0, name: '', rep: reps[0] || '' };
          const title = id ? tr('Crear/Modificar Categoría','Create/Modify Category') : tr('Agregar categoría','Add Category');
          return `
          <section class="admin-config" aria-label="Editar categoría">
            <header class="admin-config-header"><h2>${title}</h2><div class="admin-config-actions"><button type="button" class="admin-config-btn" data-action="back-categories"><span data-lucide="arrow-left"></span><span>${tr('Volver','Back')}</span></button></div></header>
            <form id="categoryEditForm" class="admin-form" novalidate>
              <div class="form-field"><label for="catName">${tr('Nombre de la categoría','Category Name')}:</label><input id="catName" type="text" required value="${esc(cur.name)}" /></div>
              <div class="form-field"><label for="catRep">${tr('Representante principal','Primary Rep')}:</label><select id="catRep">${reps.map(r => `<option value="${esc(r)}" ${cur.rep===r?'selected':''}>${esc(r)}</option>`).join('')}</select></div>
              <div style="padding-top:8px"><button type="button" id="catSaveBtn" class="admin-config-btn primary"><span data-lucide="save"></span><span>${tr('Guardar','Save')}</span></button></div>
            </form>
          </section>`;
        }
      } else {
        const tpl = getTemplateHTML('adma-template');
        if (tpl) return tpl;
        return `<div class="planning-layout"><div class="calendar-section"><h2>ADMA</h2><p>Acceso administrativo</p></div></div>`;
      }
    }
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
    ${state.showAdmaAuth ? `
      <div id="admaAuth" class="auth-modal show" role="dialog" aria-modal="true" aria-labelledby="admaAuthTitle">
        <div class="auth-backdrop"></div>
        <div class="auth-dialog">
          <div class="auth-header">
            <span class="auth-icon" data-lucide="lock-keyhole"></span>
            <h2 id="admaAuthTitle">Acceso administrativo</h2>
            <button type="button" id="admaClose" class="auth-close" aria-label="Cerrar"><span data-lucide="x"></span></button>
          </div>
          <div class="auth-body">
            <label for="admaPassword">Contraseña</label>
            <input id="admaPassword" type="password" autocomplete="current-password" placeholder="${tr('Ingresa la contraseña','Enter password')}" aria-describedby="admaError" aria-invalid="false" />
            <div id="admaError" class="auth-error" aria-live="polite"></div>
            <button type="button" id="admaSubmit" class="auth-submit" disabled>${tr('Continuar','Continue')}</button>
          </div>
        </div>
      </div>
    ` : ''}
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
  if (typeof window.ensureFab === 'function') { try { window.ensureFab(); } catch(e){} }
  if (state.showAdmaAuth) {
    const input = document.getElementById('admaPassword');
    const err = document.getElementById('admaError');
    const submit = document.getElementById('admaSubmit');
    const close = document.getElementById('admaClose');
    const update = () => {
      const v = input ? (input.value || '') : '';
      const hasVal = v.trim().length > 0;
      if (submit) submit.disabled = !hasVal;
      if (err) { err.textContent = ''; }
      if (input) input.setAttribute('aria-invalid', 'false');
    };
    if (input && !input.dataset.bound) {
      input.addEventListener('input', update);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && submit && !submit.disabled) submit.click(); });
      input.dataset.bound = '1';
      update();
      try { input.focus(); } catch(_) {}
    }
    if (submit && !submit.dataset.bound) {
      submit.addEventListener('click', () => {
        const v = input ? (input.value || '').trim() : '';
        const expected = loadAdminPass();
        if (v === expected) {
          state.showAdmaAuth = false;
          state.activePage = 'adma';
          render();
        } else {
          if (input) input.setAttribute('aria-invalid', 'true');
          if (err) { err.textContent = tr('Acceso denegado','Access denied'); }
        }
      });
      submit.dataset.bound = '1';
    }
    if (close && !close.dataset.bound) {
      close.addEventListener('click', () => { state.showAdmaAuth = false; render(); });
      close.dataset.bound = '1';
    }
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && state.showAdmaAuth) { state.showAdmaAuth = false; render(); } });
  }

  if (state.activePage === 'adma') {
    if (state.admaView === 'config') {
      const backBtn = document.querySelector('.admin-config [data-action="back"]');
      const saveBtn = document.querySelector('.admin-config [data-action="save"]');
      if (backBtn && !backBtn.dataset.bound) {
        backBtn.addEventListener('click', (e) => { e.preventDefault(); state.admaView = null; render(); });
        backBtn.dataset.bound = '1';
      }
      if (saveBtn && !saveBtn.dataset.bound) {
        saveBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const val = (id) => (document.getElementById(id)?.value || '').trim();
          state.siteConfig = {
            siteName: val('cfgSiteName'),
            baseUrl: val('cfgBaseUrl'),
            adminName: val('cfgAdminName'),
            adminEmail: val('cfgAdminEmail'),
            baseEmail: val('cfgBaseEmail'),
            mailType: val('cfgMailType'),
            smtpServer: val('cfgSmtp'),
            locatorPriority: val('cfgLocatorPriority'),
            notifyUserUpdates: val('cfgNotifyUser'),
            knowledgeAccess: val('cfgKnowledgeAccess'),
            knowledgeSql: val('cfgKnowledgeSql'),
            defaultPriority: val('cfgDefaultPriority'),
            defaultState: val('cfgDefaultState'),
            closedState: val('cfgClosedState'),
            authType: val('cfgAuthType'),
            userSelection: val('cfgUserSelection'),
            inOutBoard: val('cfgInOutBoard'),
            allowImage: val('cfgAllowImage'),
            maxImageSize: val('cfgMaxImage'),
          };
          try { localStorage.setItem('socya:siteConfig', JSON.stringify(state.siteConfig)); } catch(_) {}
          showSuccessAlert(tr('Configuración guardada','Settings saved'));
        });
        saveBtn.dataset.bound = '1';
      }
      renderIcons();
    } else if (state.admaView === 'changePass') {
      const backBtn = document.querySelector('.admin-config [data-action="back"]');
      const saveBtn = document.querySelector('.admin-config [data-action="save-pass"]');
      if (backBtn && !backBtn.dataset.bound) {
        backBtn.addEventListener('click', (e) => { e.preventDefault(); state.admaView = null; render(); });
        backBtn.dataset.bound = '1';
      }
      if (saveBtn && !saveBtn.dataset.bound) {
        saveBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const cur = (document.getElementById('adminPassCurrent')?.value || '').trim();
          const next = (document.getElementById('adminPassNew')?.value || '').trim();
          const conf = (document.getElementById('adminPassConfirm')?.value || '').trim();
          const expected = loadAdminPass();
          if (cur !== expected) { showErrorAlert(tr('Contraseña actual incorrecta','Current password incorrect')); return; }
          if (!next || next.length < 4) { showErrorAlert(tr('La nueva contraseña es muy corta','New password too short')); return; }
          if (next !== conf) { showErrorAlert(tr('Las contraseñas no coinciden','Passwords do not match')); return; }
          saveAdminPass(next);
          showSuccessAlert(tr('Contraseña actualizada','Password updated'));
          state.admaView = null;
          render();
        });
        saveBtn.dataset.bound = '1';
      }
      renderIcons();
    } else if (state.admaView === 'mail') {
      const sel = document.getElementById('mailMessageSel');
      const edit = document.getElementById('mailEditBtn');
      const back = document.querySelector('.admin-config [data-action="back"]');
      if (back && !back.dataset.bound) { back.addEventListener('click', (e) => { e.preventDefault(); state.admaView = null; render(); }); back.dataset.bound = '1'; }
      if (sel && !sel.dataset.bound) { sel.addEventListener('change', () => { state.mailKey = sel.value; }); sel.dataset.bound = '1'; }
      if (edit && !edit.dataset.bound) { edit.addEventListener('click', () => { state.mailKey = (sel?.value)||state.mailKey||'user_update'; state.admaView = 'mailEdit'; render(); }); edit.dataset.bound = '1'; }
      renderIcons();
    } else if (state.admaView === 'mailEdit') {
      const MAIL_KEY = 'socya:mailTemplates';
      const saveMail = (obj) => { try { localStorage.setItem(MAIL_KEY, JSON.stringify(obj||{})); showSuccessAlert(tr('Configuración guardada','Settings saved')); } catch(_) {} };
      const subj = document.getElementById('mailSubject');
      const body = document.getElementById('mailBody');
      const save = document.getElementById('mailSaveBtn');
      const help = document.getElementById('mailSyntaxHelp');
      const backToMail = document.querySelector('.admin-config [data-action="back-to-mail"]');
      const admin = document.getElementById('mailGoAdmin');
      const defaults = {
        user_new: { subject: 'Nueva solicitud de servicio #[problemid]', body: 'Su solicitud fue registrada correctamente.\n\nPuede ingresar a su solicitud con el siguiente enlace: [url]\n\nDETALLES\nID: [problemid]\nUsuario: [uid]' },
        user_update: { subject: 'Solicitud de servicio: #[problemid] Actualizada', body: 'Su solicitud de servicio fue actualizada, agradecemos revisar la actualización de las notas.\n\nPuede ingresar a su solicitud de servicio con el siguiente enlace: [url]\n\nDETALLES DE LA SOLICITUD\n--------------\nID: [problemid]\nUsuario: [uid]' },
        user_close: { subject: 'Solicitud #[problemid] cerrada', body: 'Su solicitud ha sido cerrada.\n\nPuede revisar los detalles y dejar comentarios en: [url]' },
        rep_new: { subject: 'Nuevo ticket asignado #[problemid]', body: 'Se le ha asignado un nuevo ticket.\n\nVer detalles: [url]\nUsuario: [uid]' },
        rep_update: { subject: 'Ticket #[problemid] actualizado', body: 'El ticket ha sido actualizado.\n\nVer detalles: [url]' },
        rep_close: { subject: 'Ticket #[problemid] cerrado', body: 'El ticket ha sido cerrado.\n\nVer detalles: [url]' },
        rep_pager: { subject: 'Aviso de pager #[problemid]', body: 'Alerta de pager generada para el ticket.\n\nVer detalles: [url]' }
      };
      const loadMail = () => { try { const raw = localStorage.getItem(MAIL_KEY); if (raw) return { ...defaults, ...(JSON.parse(raw)||{}) }; } catch(_) {} return { ...defaults }; };
      const mails = loadMail();
      const key = state.mailKey || 'user_update';
      if (help && !help.dataset.bound) { help.addEventListener('click', (e) => { e.preventDefault(); alert('Placeholders soportados:\n[problemid] ID del ticket\n[uid] Usuario\n[url] Enlace al ticket'); }); help.dataset.bound = '1'; }
      if (save && !save.dataset.bound) { save.addEventListener('click', (e) => { e.preventDefault(); const next = { ...mails, [key]: { subject: String(subj?.value||''), body: String(body?.value||'') } }; saveMail(next); }); save.dataset.bound = '1'; }
      if (backToMail && !backToMail.dataset.bound) { backToMail.addEventListener('click', (e) => { e.preventDefault(); state.admaView = 'mail'; render(); }); backToMail.dataset.bound = '1'; }
      if (admin && !admin.dataset.bound) { admin.addEventListener('click', (e) => { e.preventDefault(); state.admaView = null; render(); }); admin.dataset.bound = '1'; }
      renderIcons();
    } else if (state.admaView === 'users') {
      const USERS_KEY = 'socya:users';
      const loadUsers = () => { try { const raw = localStorage.getItem(USERS_KEY); if (raw) return (JSON.parse(raw)||[]); } catch(_) {} return []; };
      const users = loadUsers();
      const back = document.querySelector('.admin-config [data-action="back"]');
      const list = document.getElementById('userList');
      const edit = document.getElementById('editUserBtn');
      const add = document.getElementById('addUserLink');
      if (back && !back.dataset.bound) { back.addEventListener('click', (e) => { e.preventDefault(); state.admaView = null; render(); }); back.dataset.bound = '1'; }
      if (list && !list.dataset.bound) { list.addEventListener('change', () => { state.selectedUserId = Number(list.value); }); list.dataset.bound = '1'; }
      if (edit && !edit.dataset.bound) { edit.addEventListener('click', () => { state.selectedUserId = Number((list?.value)||state.selectedUserId||users[0]?.id||0); state.admaView = 'userEdit'; render(); }); edit.dataset.bound = '1'; }
      if (add && !add.dataset.bound) { add.addEventListener('click', (e) => { e.preventDefault(); state.admaView = 'userAdd'; render(); }); add.dataset.bound = '1'; }
      renderIcons();
    } else if (state.admaView === 'userEdit') {
      const USERS_KEY = 'socya:users';
      const loadUsers = () => { try { const raw = localStorage.getItem(USERS_KEY); if (raw) return (JSON.parse(raw)||[]); } catch(_) {} return []; };
      const saveUsers = (arr) => { try { localStorage.setItem(USERS_KEY, JSON.stringify(arr||[])); } catch(_) {} };
      const users = loadUsers();
      const id = state.selectedUserId || users[0]?.id || 0;
      const back = document.querySelector('.admin-config [data-action="back-users"]');
      const first = document.getElementById('uFirst');
      const last = document.getElementById('uLast');
      const email = document.getElementById('uEmail');
      const pager = document.getElementById('uPager');
      const phone = document.getElementById('uPhone');
      const loc = document.getElementById('uLoc');
      const dept = document.getElementById('uDept');
      const lang = document.getElementById('uLang');
      const support = document.getElementById('uSupport');
      const access = document.getElementById('uAccess');
      const pass = document.getElementById('uPass');
      const save = document.getElementById('userSaveBtn');
      const del = document.getElementById('userDeleteBtn');
      const choose = document.getElementById('userChooseLink');
      
      if (back && !back.dataset.bound) { back.addEventListener('click', (e) => { e.preventDefault(); state.admaView = 'users'; render(); }); back.dataset.bound = '1'; }
      if (save && !save.dataset.bound) { save.addEventListener('click', () => { const arr = users.map(u => (u.id===id ? { ...u, firstName: String(first?.value||''), lastName: String(last?.value||''), email: String(email?.value||''), pager: String(pager?.value||''), phone: String(phone?.value||''), location: String(loc?.value||''), department: String(dept?.value||''), language: String(lang?.value||'es'), isSupport: !!(support&&support.checked), access: String(access?.value||'normal'), password: String(pass?.value||'') || u.password } : u)); saveUsers(arr); showSuccessAlert(tr('Usuario actualizado','User updated')); }); save.dataset.bound = '1'; }
      if (del && !del.dataset.bound) { del.addEventListener('click', () => { const arr = users.filter(u => u.id !== id); saveUsers(arr); showSuccessAlert(tr('Cuenta eliminada','Account deleted')); state.admaView = 'users'; render(); }); del.dataset.bound = '1'; }
      if (choose && !choose.dataset.bound) { choose.addEventListener('click', (e) => { e.preventDefault(); state.admaView = 'users'; render(); }); choose.dataset.bound = '1'; }
      renderIcons();
    } else if (state.admaView === 'userAdd') {
      const USERS_KEY = 'socya:users';
      const loadUsers = () => { try { const raw = localStorage.getItem(USERS_KEY); if (raw) return (JSON.parse(raw)||[]); } catch(_) {} return []; };
      const saveUsers = (arr) => { try { localStorage.setItem(USERS_KEY, JSON.stringify(arr||[])); } catch(_) {} };
      const users = loadUsers();
      const back = document.querySelector('.admin-config [data-action="back-users"]');
      const user = document.getElementById('nUser');
      const first = document.getElementById('nFirst');
      const last = document.getElementById('nLast');
      const email = document.getElementById('nEmail');
      const pager = document.getElementById('nPager');
      const phone = document.getElementById('nPhone');
      const loc = document.getElementById('nLoc');
      const dept = document.getElementById('nDept');
      const lang = document.getElementById('nLang');
      const support = document.getElementById('nSupport');
      const access = document.getElementById('nAccess');
      const pass = document.getElementById('nPass');
      const create = document.getElementById('userCreateBtn');
      
      if (back && !back.dataset.bound) { back.addEventListener('click', (e) => { e.preventDefault(); state.admaView = 'users'; render(); }); back.dataset.bound = '1'; }
      if (create && !create.dataset.bound) { create.addEventListener('click', () => { const nextId = (users.reduce((max,u)=>Math.max(max,u.id),0) + 1) || 1; const u = { id: nextId, username: String(user?.value||'').trim(), firstName: String(first?.value||''), lastName: String(last?.value||''), email: String(email?.value||''), pager: String(pager?.value||''), phone: String(phone?.value||''), location: String(loc?.value||''), department: String(dept?.value||''), language: String(lang?.value||'es'), isSupport: !!(support&&support.checked), access: String(access?.value||'normal'), password: String(pass?.value||'') }; const arr = [...users, u]; saveUsers(arr); showSuccessAlert(tr('Usuario creado','User created')); state.selectedUserId = u.id; state.admaView = 'users'; render(); }); create.dataset.bound = '1'; }
      renderIcons();
    } else if (state.admaView === 'categories') {
      const back = document.querySelector('.admin-config [data-action="back"]');
      const add = document.getElementById('addCategoryBtn');
      const edits = Array.from(document.querySelectorAll('.admin-config [data-action="edit-cat"]'));
      const deletes = Array.from(document.querySelectorAll('.admin-config [data-action="delete-cat"]'));
      const CATEGORIES_KEY = 'socya:categories';
      const loadCats = () => { try { const raw = localStorage.getItem(CATEGORIES_KEY); if (raw) return (JSON.parse(raw)||[]); } catch(_) {} return []; };
      const saveCats = (arr) => { try { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(arr||[])); } catch(_) {} };
      const cats = loadCats();
      if (back && !back.dataset.bound) { back.addEventListener('click', (e) => { e.preventDefault(); state.admaView = null; render(); }); back.dataset.bound = '1'; }
      if (add && !add.dataset.bound) { add.addEventListener('click', (e) => { e.preventDefault(); state.selectedCategoryId = 0; state.admaView = 'categoryAdd'; render(); }); add.dataset.bound = '1'; }
      edits.forEach(btn => { if (!btn.dataset.bound) { btn.addEventListener('click', (e) => { e.preventDefault(); const id = Number(btn.dataset.id||0); state.selectedCategoryId = id; state.admaView = 'categoryEdit'; render(); }); btn.dataset.bound = '1'; } });
      deletes.forEach(btn => { if (!btn.dataset.bound) { btn.addEventListener('click', (e) => { e.preventDefault(); const id = Number(btn.dataset.id||0); const arr = cats.filter(c => c.id !== id); saveCats(arr); showSuccessAlert(tr('Categoría eliminada','Category deleted')); render(); }); btn.dataset.bound = '1'; } });
      renderIcons();
    } else if (state.admaView === 'categoryEdit' || state.admaView === 'categoryAdd') {
      const back = document.querySelector('.admin-config [data-action="back-categories"]');
      const save = document.getElementById('catSaveBtn');
      const name = document.getElementById('catName');
      const rep = document.getElementById('catRep');
      const CATEGORIES_KEY = 'socya:categories';
      const loadCats = () => { try { const raw = localStorage.getItem(CATEGORIES_KEY); if (raw) return (JSON.parse(raw)||[]); } catch(_) {} return []; };
      if (back && !back.dataset.bound) { back.addEventListener('click', (e) => { e.preventDefault(); state.admaView = 'categories'; render(); }); back.dataset.bound = '1'; }
      if (save && !save.dataset.bound) { save.addEventListener('click', () => { const cats = loadCats(); const id = state.selectedCategoryId || 0; const nextId = id || ((cats.reduce((max,c)=>Math.max(max,c.id),0) + 1) || 1); const obj = { id: nextId, name: String(name?.value||''), rep: String(rep?.value||'') }; const arr = cats.some(c => c.id === nextId) ? cats.map(c => (c.id===nextId?obj:c)) : [...cats, obj]; const msg = id ? tr('Categoría modificada','Category updated') : tr('Categoría creada','Category created'); try { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(arr||[])); showSuccessAlert(msg); } catch(_) {} state.admaView = 'categories'; render(); }); save.dataset.bound = '1'; }
      renderIcons();
    } else {
      document.querySelectorAll('.admin-item').forEach(btn => {
        if (btn.dataset.bound) return;
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const act = btn.dataset.action;
          if (act === 'config-site') {
            state.admaView = 'config';
            render();
            return;
          } else if (act === 'config-mail') {
            state.admaView = 'mail';
            render();
            return;
          } else if (act === 'test-config') {
            try {
              if (typeof window.openSysInfoModal === 'function') {
                window.openSysInfoModal();
              } else {
                window.location.hash = '#sysinfo';
              }
            } catch(_) {}
            return;
          } else if (act === 'change-admin-pass') {
            state.admaView = 'changePass';
            render();
            return;
          } else if (act === 'manage-users') {
            state.admaView = 'users';
            render();
            return;
          } else if (act === 'manage-categories') {
            state.admaView = 'categories';
            render();
            return;
          }
          try {
            console.log('Admin action:', act);
            alert(tr('Acción administrativa pendiente','Administrative action pending'));
          } catch(_) {}
        });
        btn.dataset.bound = '1';
      });
      renderIcons();
    }
  }
  const headerBtn = document.getElementById('header-profile');
  const headerMenu = document.getElementById('header-menu');
  if (headerBtn && headerMenu && !headerBtn.dataset.bound) {
    const openMenu = () => {
      headerMenu.hidden = false;
      headerMenu.classList.add('show');
      headerBtn.setAttribute('aria-expanded', 'true');
      const first = headerMenu.querySelector('.header-menu-item');
      if (first) { try { first.focus(); } catch(_) {} }
    };
    const closeMenu = () => {
      headerMenu.classList.remove('show');
      headerBtn.setAttribute('aria-expanded', 'false');
      setTimeout(() => { headerMenu.hidden = true; }, 180);
    };
    headerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (headerMenu.hidden) openMenu(); else closeMenu();
    });
    headerBtn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (headerMenu.hidden) openMenu(); }
      if (e.key === 'Escape') { e.preventDefault(); if (!headerMenu.hidden) closeMenu(); }
    });
    document.addEventListener('click', (e) => {
      if (!headerMenu.hidden && !e.target.closest('#header-menu') && !e.target.closest('#header-profile')) { closeMenu(); }
    });
    headerMenu.addEventListener('keydown', (e) => {
      const items = Array.from(headerMenu.querySelectorAll('.header-menu-item'));
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); const next = items[(idx + 1) % items.length]; if (next) next.focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); const prev = items[(idx - 1 + items.length) % items.length]; if (prev) prev.focus(); }
      if (e.key === 'Home') { e.preventDefault(); if (items[0]) items[0].focus(); }
      if (e.key === 'End') { e.preventDefault(); if (items[items.length - 1]) items[items.length - 1].focus(); }
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); headerBtn.focus(); }
    });
    headerMenu.querySelectorAll('.header-menu-item').forEach(item => {
      item.addEventListener('click', (ev) => {
        ev.preventDefault();
        const act = item.dataset.action;
        closeMenu();
        if (act === 'go-edit') {
          try { window.location.href = './editar.html'; } catch(_) {}
        } else if (act === 'customize-dashboard') {
          try {
            const onDash = !!document.getElementById('fabMain');
            if (onDash) { document.getElementById('fabMain')?.click(); }
            else { window.location.href = './dashboard.html#customize'; }
          } catch(_) {}
        } else if (act === 'logout') {
          try {
            localStorage.removeItem(PREFS_KEY);
            state.preferences = { name:'', surname:'', department:'ti', language:'es', theme:'light', fontSize:16, palette:null, avatar:null };
            savePrefs();
            window.location.href = './index.html';
          } catch(_) {}
        }
      });
    });
    headerBtn.dataset.bound = '1';
  }

  // FAB global: disponible en todas las vistas
  (function bindGlobalFab(){
    const req = document.getElementById('requestsBtn');
    if (req && !req.dataset.bound) { req.addEventListener('click', () => { try { if (typeof window.openRequestsModal === 'function') window.openRequestsModal(); else { window.location.href = './dashboard.html#requests'; } } catch(e){} }); req.dataset.bound = '1'; }
    const chat = document.getElementById('chatbotBtn');
    if (chat && !chat.dataset.bound) { chat.addEventListener('click', () => { try { if (typeof window.openChatbotModal === 'function') window.openChatbotModal(); else { window.location.href = './dashboard.html#chatbot'; } } catch(e){} }); chat.dataset.bound = '1'; }
  })();

  // Delegación de eventos como respaldo: asegura acción aunque falle el binding
  if (!document.__fabDelegationBound) {
    document.addEventListener('click', (ev) => {
      const el = ev.target.closest ? ev.target.closest('#requestsBtn, #chatbotBtn') : null;
      if (!el) return;
      ev.preventDefault();
      if (el.id === 'requestsBtn') { try { if (typeof window.openRequestsModal === 'function') window.openRequestsModal(); else { window.location.href = './dashboard.html#requests'; } } catch(_){} }
      if (el.id === 'chatbotBtn') { try { if (typeof window.openChatbotModal === 'function') window.openChatbotModal(); else { window.location.href = './dashboard.html#chatbot'; } } catch(_){} }
    }, true);
    document.__fabDelegationBound = true;
  }
  if (!document.__admaDelegationBound) {
    document.addEventListener('click', (ev) => {
      const el = ev.target.closest ? ev.target.closest('#admaButton') : null;
      if (!el) return;
      ev.preventDefault();
      openAdmaAuth();
    }, true);
    document.__admaDelegationBound = true;
  }

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
  const admaBtn = document.getElementById('admaButton');
  if (admaBtn && !admaBtn.dataset.bound) {
    admaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openAdmaAuth();
    });
    admaBtn.dataset.bound = '1';
  }

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
        showErrorAlert(state.preferences.language === 'en' ? 'Image too large (max 4MB).' : 'Imagen muy pesada (máximo 4MB).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result;
        if (!dataUrl || typeof dataUrl !== 'string') return;
        state.preferences.avatar = dataUrl;
        savePrefs();
        // Actualizar todas las instancias del avatar visibles
        document.querySelectorAll('.sidebar-footer .avatar, .header-avatar').forEach(el => { el.src = dataUrl; });
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
    // Abrir catálogo si se solicitó por hash/parámetro
    try {
      const hash = (window.location && window.location.hash) || '';
      const search = (window.location && window.location.search) || '';
      const wantsCatalog = (hash === '#customize' || search.includes('openCatalog=1'));
      const wantsRequests = (hash === '#requests' || search.includes('openRequests=1'));
      const wantsChatbot = (hash === '#chatbot' || search.includes('openChatbot=1'));
      const wantsSysInfo = (hash === '#sysinfo' || search.includes('openSysInfo=1'));
      if (wantsCatalog) { document.getElementById('fabMain')?.click(); }
      if (wantsRequests) { try { if (typeof window.openRequestsModal === 'function') window.openRequestsModal(); } catch(_){} }
      if (wantsChatbot) { try { if (typeof window.openChatbotModal === 'function') window.openChatbotModal(); } catch(_){} }
      if (wantsSysInfo) { try { if (typeof window.openSysInfoModal === 'function') window.openSysInfoModal(); } catch(_){} }
    } catch(_) {}
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
const LOCATIONS = [
  { id: 'bogota', es: 'Bogotá — Sede Principal', en: 'Bogotá — Headquarters' },
  { id: 'medellin', es: 'Medellín', en: 'Medellín Office' },
  { id: 'cali', es: 'Cali', en: 'Cali Office' },
  { id: 'barranquilla', es: 'Barranquilla', en: 'Barranquilla Office' },
  { id: 'cartagena', es: 'Cartagena', en: 'Cartagena Office' },
  { id: 'bucaramanga', es: 'Bucaramanga', en: 'Bucaramanga Office' },
  { id: 'pereira', es: 'Pereira', en: 'Pereira Office' },
  { id: 'manizales', es: 'Manizales', en: 'Manizales Office' },
  { id: 'santa_marta', es: 'Santa Marta', en: 'Santa Marta Office' },
  { id: 'villavicencio', es: 'Villavicencio', en: 'Villavicencio Office' },
  { id: 'remoto', es: 'Remoto', en: 'Remote' },
];
const locationLabel = (id) => {
  const d = LOCATIONS.find(x => x.id === id);
  if (!d) return id;
  return (state?.preferences?.language === 'en') ? d.en : d.es;
};
const ORG_DEPT_NAMES = [
  { id: 'operaciones', es: 'Operaciones', en: 'Operations' },
  { id: 'finanzas', es: 'Finanzas', en: 'Finance' },
  { id: 'ventas', es: 'Ventas', en: 'Sales' },
  { id: 'logistica', es: 'Logística', en: 'Logistics' },
  { id: 'legal', es: 'Legal', en: 'Legal' },
  { id: 'compras', es: 'Compras', en: 'Purchasing' },
  { id: 'marketing', es: 'Marketing', en: 'Marketing' },
  { id: 'diseno', es: 'Diseño', en: 'Design' },
  { id: 'ti', es: 'TI', en: 'IT' },
  { id: 'rrhh', es: 'RRHH', en: 'HR' },
  { id: 'calidad', es: 'Calidad', en: 'Quality' },
  { id: 'atencion', es: 'Atención al cliente', en: 'Customer Support' },
];
const orgDeptLabel = (id) => {
  const d = ORG_DEPT_NAMES.find(x => x.id === id);
  if (!d) return id;
  return (state?.preferences?.language === 'en') ? d.en : d.es;
};
  // Menú del header (avatar)
  const headerBtn = document.getElementById('header-profile');
  const headerMenu = document.getElementById('header-menu');
  if (headerBtn && headerMenu) {
    let openedByKeyboard = false;
    const openMenu = () => {
      headerMenu.hidden = false;
      headerMenu.classList.add('show');
      headerBtn.setAttribute('aria-expanded', 'true');
      if (openedByKeyboard) {
        const first = headerMenu.querySelector('.header-menu-item');
        if (first) { try { first.focus(); } catch(_) {} }
      }
    };
    const closeMenu = () => {
      headerMenu.classList.remove('show');
      headerBtn.setAttribute('aria-expanded', 'false');
      setTimeout(() => { headerMenu.hidden = true; }, 180);
    };
    headerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openedByKeyboard = false;
      if (headerMenu.hidden) openMenu(); else closeMenu();
    });
    headerBtn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openedByKeyboard = true; if (headerMenu.hidden) openMenu(); }
      if (e.key === 'Escape') { e.preventDefault(); if (!headerMenu.hidden) closeMenu(); }
    });
    document.addEventListener('click', (e) => {
      if (!headerMenu.hidden && !e.target.closest('#header-menu') && !e.target.closest('#header-profile')) { closeMenu(); }
    });
    headerMenu.addEventListener('keydown', (e) => {
      const items = Array.from(headerMenu.querySelectorAll('.header-menu-item'));
      const idx = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); const next = items[(idx + 1) % items.length]; if (next) next.focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); const prev = items[(idx - 1 + items.length) % items.length]; if (prev) prev.focus(); }
      if (e.key === 'Home') { e.preventDefault(); if (items[0]) items[0].focus(); }
      if (e.key === 'End') { e.preventDefault(); if (items[items.length - 1]) items[items.length - 1].focus(); }
      if (e.key === 'Escape') { e.preventDefault(); closeMenu(); headerBtn.focus(); }
    });
    headerMenu.querySelectorAll('.header-menu-item').forEach(item => {
      item.addEventListener('click', (ev) => {
        ev.preventDefault();
        const act = item.dataset.action;
        closeMenu();
        if (act === 'go-edit') {
          try { window.location.href = './editar.html'; } catch(_) {}
        } else if (act === 'customize-dashboard') {
          try {
            const onDash = !!document.getElementById('fabMain');
            if (onDash) { document.getElementById('fabMain')?.click(); }
            else { window.location.href = './dashboard.html#customize'; }
          } catch(_) {}
        } else if (act === 'logout') {
          try {
            localStorage.removeItem(PREFS_KEY);
            state.preferences = { name:'', surname:'', department:'ti', language:'es', theme:'light', fontSize:16, palette:null, avatar:null };
            savePrefs();
            window.location.href = './index.html';
          } catch(_) {}
        }
      });
    });
  }
