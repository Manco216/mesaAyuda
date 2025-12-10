// Componente reusable de menú lateral con modo delgado y expansión por hover
// - Sin botón hamburguesa: el menú permanece visible como barra delgada con iconos
// - Al acercar el cursor al borde/menú, se expande y muestra etiquetas
(function() {
  const STORAGE_KEY = 'socya:sidebarCollapsed';
  const EDGE_ZONE_PX = 60; // zona táctil ampliada para móvil
  const CLOSE_DELAY_MS = 220; // evitar cierres bruscos al transitar entre borde y menú
  let ignoreAutoCloseUntil = 0; // periodo de gracia tras abrir
  // Configuración: apertura por borde activada para descubrir el menú más fácil
  const USE_EDGE_OPEN = true;
  const AUTO_COLLAPSE = true; // auto-ocultar cuando el cursor sale

  let sidebar = null;
  let main = null;
  let hoverEdgeZone = false;
  let hoverSidebar = false;
  let closeTimer = null;
  let arrowOpen = null;
  let arrowClose = null;
  let edgeZoneEl = null; // zona táctil invisible en el borde

  const findSidebar = () => document.getElementById('app-sidebar') || document.querySelector('.sidebar');
  const findMain = () => document.querySelector('.main-content') || document.querySelector('.content');

  const applyState = (collapsed) => {
    if (!sidebar || !main) return;
    const isCollapsed = !!collapsed;
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
    if (isCollapsed) {
      // Siempre: mostrar como barra delgada con solo iconos (desktop y móvil)
      sidebar.classList.remove('collapsed');
      sidebar.classList.add('thin');
      main.classList.remove('full');
      main.classList.add('thin');
      sidebar.removeAttribute('aria-hidden');
      sidebar.setAttribute('aria-expanded', 'false');
    } else {
      // Expandido: mostrar sidebar completo con etiquetas
      sidebar.classList.remove('collapsed');
      sidebar.classList.remove('thin');
      main.classList.remove('full');
      main.classList.remove('thin');
      sidebar.removeAttribute('aria-hidden');
      sidebar.setAttribute('aria-expanded', 'true');
    }
    // Notificar a componentes que dependen del ancho (ej. GridStack)
    try { window.dispatchEvent(new Event('resize')); } catch (_) {}
    updateArrowsVisibility(isCollapsed);
  };

  const getCollapsed = () => (localStorage.getItem(STORAGE_KEY) === '1');
  const setCollapsed = (v) => localStorage.setItem(STORAGE_KEY, v ? '1' : '0');

  const updateHoverState = () => {
    // En móviles, mantener siempre abierto; no auto-cerrar
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
    if (isMobile) return;
    if (Date.now() < ignoreAutoCloseUntil) return;
    const collapsed = getCollapsed();
    if (collapsed) {
      // Abrir al entrar en el área del sidebar o al tocar la zona de borde
      if (hoverSidebar || hoverEdgeZone) {
        setCollapsed(false);
        applyState(false);
        ignoreAutoCloseUntil = Date.now() + 700; // dar tiempo al usuario para interactuar
      }
    } else {
      // Mantener abierto; si AUTO_COLLAPSE está activado, cerrar al salir
      if (AUTO_COLLAPSE && !hoverEdgeZone && !hoverSidebar) {
        setCollapsed(true);
        applyState(true);
      }
    }
  };

  const onMouseMove = (e) => {
    // Detectar zona de borde
    hoverEdgeZone = e.clientX <= EDGE_ZONE_PX;
    // Detectar si el cursor está dentro del área del sidebar
    let insideSidebar = false;
    if (sidebar) {
      const rect = sidebar.getBoundingClientRect();
      insideSidebar = (
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom
      );
    }
    hoverSidebar = insideSidebar;

    // Manejo de cierre con tolerancia para evitar parpadeo
    if (!hoverEdgeZone && !hoverSidebar) {
      if (closeTimer) { clearTimeout(closeTimer); }
      closeTimer = setTimeout(() => {
        closeTimer = null;
        updateHoverState();
      }, CLOSE_DELAY_MS);
    } else {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      updateHoverState();
    }
  };

  const bindSidebarListeners = () => {
    if (!sidebar) return;
    sidebar.dataset.menuInitialized = '1';
    // Apertura manual: al presionar dentro del sidebar delgado
    sidebar.addEventListener('pointerdown', (e) => {
      if (getCollapsed()) {
        setCollapsed(false);
        applyState(false);
        ignoreAutoCloseUntil = Date.now() + 700;
      }
    });
    // Accesibilidad: abrir al enfocar elementos del sidebar
    sidebar.addEventListener('focusin', () => {
      if (getCollapsed()) { setCollapsed(false); applyState(false); }
    });
  };

  const onPointerMove = (e) => {
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
    const evt = { clientX, clientY };
    onMouseMove(evt);
  };

  const onPointerDown = (e) => {
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
    hoverEdgeZone = clientX <= EDGE_ZONE_PX;
    let insideSidebar = false;
    if (sidebar) {
      const rect = sidebar.getBoundingClientRect();
      insideSidebar = (
        clientX >= rect.left && clientX <= rect.right &&
        clientY >= rect.top && clientY <= rect.bottom
      );
    }
    hoverSidebar = insideSidebar;
    updateHoverState();
  };

  const initMouseMoveOnce = () => {
    if (window.__socyaMenuMouseMoveInstalled) return;
    window.__socyaMenuMouseMoveInstalled = true;
    // Desktop: mousemove; Móvil/tablet: pointer/touch
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });
    document.addEventListener('touchmove', onPointerMove, { passive: true });

    // Accesibilidad: expandir al enfocar elementos del menú y volver a delgado al perder foco
    document.addEventListener('focusin', (e) => {
      // Abrir solo si el foco entra al sidebar
      const el = e.target;
      const insideSidebar = el && sidebar && sidebar.contains(el);
      if (insideSidebar) { setCollapsed(false); applyState(false); }
    });
    document.addEventListener('focusout', (e) => {
      // Cerrar solo si el foco sale del sidebar y borde
      const rel = e.relatedTarget;
      const insideSidebar = rel && sidebar && sidebar.contains(rel);
      if (!insideSidebar) { setCollapsed(true); applyState(true); }
    });
  };

  const ensureArrows = () => {
    // Se mantienen ocultas por solicitud del usuario
    if (!arrowOpen) { arrowOpen = document.createElement('div'); arrowOpen.hidden = true; document.body.appendChild(arrowOpen); }
    if (!arrowClose) { arrowClose = document.createElement('div'); arrowClose.hidden = true; document.body.appendChild(arrowClose); }
    updateArrowsVisibility(getCollapsed());
  };

  const updateArrowsVisibility = (isCollapsed) => {
    try {
      const isMobile = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
      if (!arrowOpen || !arrowClose) return;
      // Por preferencia del usuario: flechas siempre ocultas
      arrowOpen.hidden = true;
      arrowClose.hidden = true;
      // Asegurar la zona táctil invisible en móvil
      ensureEdgeZone(isMobile);
    } catch (_) {}
  };

  const ensureEdgeZone = (enable) => {
    if (!edgeZoneEl) {
      edgeZoneEl = document.createElement('div');
      edgeZoneEl.style.position = 'fixed';
      edgeZoneEl.style.left = '0';
      edgeZoneEl.style.top = '0';
      edgeZoneEl.style.width = EDGE_ZONE_PX + 'px';
      edgeZoneEl.style.height = '100vh';
      edgeZoneEl.style.zIndex = '1102';
      edgeZoneEl.style.background = 'transparent';
      edgeZoneEl.style.touchAction = 'pan-y';
      edgeZoneEl.setAttribute('aria-hidden', 'true');
      edgeZoneEl.addEventListener('pointerdown', (e) => { e.preventDefault(); setCollapsed(false); applyState(false); ignoreAutoCloseUntil = Date.now() + 700; });
      edgeZoneEl.addEventListener('touchstart', (e) => { setCollapsed(false); applyState(false); ignoreAutoCloseUntil = Date.now() + 700; }, { passive: true });
      document.body.appendChild(edgeZoneEl);
    }
    edgeZoneEl.style.display = enable ? 'block' : 'none';
  };

  const initForCurrentDOM = () => {
    sidebar = findSidebar();
    main = findMain();
    if (!sidebar || !main) return;
    initMouseMoveOnce();
    ensureArrows();
    ensureEdgeZone(USE_EDGE_OPEN);
    // Estado inicial: modo delgado (iconos), se expande al acercarse
    setCollapsed(true);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch(_){}
    // Reiniciar estado de hover tras cada re-render
    hoverEdgeZone = false;
    hoverSidebar = false;
    applyState(getCollapsed());
    bindSidebarListeners();
  };

  // API pública
  window.SocyaMenu = {
    initForCurrentDOM,
    applyState,
    setCollapsed,
    getCollapsed,
    toggle: () => { const next = !getCollapsed(); setCollapsed(next); applyState(next); }
  };

  // Inicializar cuando el documento esté listo
  document.addEventListener('DOMContentLoaded', initForCurrentDOM);
})();