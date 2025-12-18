(function(){
  function ensure(){
    var cont = document.getElementById('fabContainer');
    var isDash = (window.state && state.activePage === 'dashboard')
      || /\/dashboard\.html$/.test(String(location && location.pathname || ''))
      || !!document.getElementById('dashboards-template');
    if (!isDash) {
      if (cont) { try { cont.remove(); } catch(_){} }
      return;
    }
    if(!cont){
      cont = document.createElement('div');
      cont.id = 'fabContainer';
      cont.className = 'fab-container';
      cont.innerHTML = '<button id="requestsBtn" class="fab-secondary" aria-label="Peticiones" title="Peticiones"><span class="fa fa-list"></span></button><button id="chatbotBtn" class="fab-secondary" aria-label="Asistente" title="Asistente"><span class="fa fa-robot"></span></button>';
      document.body.appendChild(cont);
    } else {
      var hasReq = !!document.getElementById('requestsBtn');
      var hasChat = !!document.getElementById('chatbotBtn');
      if (!hasReq || !hasChat) {
        cont.innerHTML = '<button id="requestsBtn" class="fab-secondary" aria-label="Peticiones" title="Peticiones"><span class="fa fa-list"></span></button><button id="chatbotBtn" class="fab-secondary" aria-label="Asistente" title="Asistente"><span class="fa fa-robot"></span></button>';
      }
    }
    Array.prototype.forEach.call(document.querySelectorAll('#requestsBtn'), function(req){
      if(!req.dataset.fBound){
        req.addEventListener('click',function(e){
          e.preventDefault();
          try { console.debug('FAB: click en Peticiones'); } catch(_){ }
          try { if (typeof window.ensureRequestsModal === 'function') window.ensureRequestsModal(); } catch(_){ }
          if(typeof window.openRequestsModal==='function') window.openRequestsModal();
          else { try { window.location.href = './dashboard.html#requests'; } catch(_){} }
        });
        req.dataset.fBound = '1';
      }
    });
    Array.prototype.forEach.call(document.querySelectorAll('#chatbotBtn'), function(chat){
      if(!chat.dataset.fBound){
        chat.addEventListener('click',function(e){
          e.preventDefault();
          try { if (typeof window.ensureChatbotModal === 'function') window.ensureChatbotModal(); } catch(_){ }
          if(typeof window.openChatbotModal==='function') window.openChatbotModal();
          else { try { window.location.href = './dashboard.html#chatbot'; } catch(_){} }
        });
        chat.dataset.fBound = '1';
      }
    });
  }
  if(document.readyState!=='loading') ensure(); else document.addEventListener('DOMContentLoaded', ensure);
  window.ensureFab = ensure;
  if (!document.__fabGlobalBound) {
    document.addEventListener('click', function(e){
      var t = e.target && e.target.closest ? e.target.closest('#requestsBtn, #chatbotBtn') : null;
      if(!t) return;
      e.preventDefault();
      try { console.debug('FAB: delegación global ->', t.id); } catch(_){}
      if (t.id === 'requestsBtn') { try { if (typeof window.ensureRequestsModal==='function') window.ensureRequestsModal(); } catch(_){}; if (typeof window.openRequestsModal==='function') window.openRequestsModal(); else { try { window.location.href = './dashboard.html#requests'; } catch(_){} } }
      if (t.id === 'chatbotBtn') { try { if (typeof window.ensureChatbotModal==='function') window.ensureChatbotModal(); } catch(_){}; if (typeof window.openChatbotModal==='function') window.openChatbotModal(); else { try { window.location.href = './dashboard.html#chatbot'; } catch(_){} } }
    }, true);
    document.__fabGlobalBound = true;
  }

  var __rq = { view: 'my', query: '', all: [], my: [], received: [], lastOption: 'menu', criteria: null };
  function __rqLoad(){
    var demo = [
      { objetivo:'Patrocinios seguros', referencia:'Al menos 5 asociaciones nuevas', equipo:'Equipo de marketing', responsable:'Rafael Urbina', fecha:'10 jun 2030', estado:'Culminado' },
      { objetivo:'Mejora de presencia virtual', referencia:'Aumento del 25 % en la interacción del post', equipo:'Equipo de redes sociales', responsable:'—', fecha:'17 jun 2030', estado:'En curso' },
      { objetivo:'Aumentar la tasa de respuestas', referencia:'Aumento del 40 % en el prerregistro', equipo:'Equipo de marketing', responsable:'—', fecha:'24 jun 2030', estado:'Bloqueado' },
      { objetivo:'Mejorar la interacción de los asistentes', referencia:'80 % en sesiones y encuestas', equipo:'Equipo del evento', responsable:'—', fecha:'25 jun 2030', estado:'Culminado' },
      { objetivo:'Generar clientes potenciales', referencia:'500 nuevos contactos', equipo:'Equipo de marketing', responsable:'—', fecha:'27 jun 2030', estado:'En curso' },
      { objetivo:'Mejorar la satisfacción', referencia:'90 % satisfacción en encuestas', equipo:'Equipo de marketing', responsable:'—', fecha:'29 jun 2030', estado:'Bloqueado' }
    ];
    var extra = [
      { objetivo:'Recursos de marca', referencia:'Anuncios y banners semana 3', equipo:'Equipo de diseño', responsable:'—', fecha:'11 jun 2030', estado:'Culminado' },
      { objetivo:'Propuesta de presupuesto', referencia:'Cálculo final semana 2', equipo:'Equipo de compras', responsable:'—', fecha:'12 jun 2030', estado:'Bajo revisión' },
      { objetivo:'Contratos proveedores', referencia:'5 proveedores confirmados', equipo:'Compras', responsable:'—', fecha:'13 jun 2030', estado:'En curso' }
    ];
    var src = Array.isArray(window.REQUESTS_DATA) ? window.REQUESTS_DATA : demo.concat(extra);
    return src;
  }
  function __rqSplit(list){
    var my = [], received = [];
    for (var i=0;i<list.length;i++){
      var r = list[i];
      var sent = r && (r.sentByMe===true || r.my===true);
      var recv = r && (r.received===true);
      if (sent) my.push(r); else if (recv) received.push(r); else (i < Math.ceil(list.length/2) ? my : received).push(r);
    }
    return { my: my, received: received };
  }
  function __rqFields(r){
    var vals = [r&&r.objetivo, r&&r.referencia, r&&r.equipo, r&&r.responsable, r&&r.fecha, r&&r.estado];
    return vals.filter(Boolean).map(function(v){ return String(v).toLowerCase(); });
  }
  function __rqFilter(list, q){
    var t = String(q||'').trim().toLowerCase();
    if (!t) return list;
    var tokens = t.split(/\s+/);
    return list.filter(function(r){
      var vals = __rqFields(r);
      return tokens.every(function(tok){ return vals.some(function(v){ return v.indexOf(tok) >= 0; }); });
    });
  }
  function __rqParseDate(s){
    if (!s) return null;
    var d1 = new Date(s); if (!isNaN(d1.getTime())) return d1;
    var m = String(s).trim().toLowerCase().match(/^(\d{1,2})\s+([a-zñ\.]+)\s+(\d{4})$/);
    if (m){
      var map = { 'ene':0,'feb':1,'mar':2,'abr':3,'may':4,'jun':5,'jul':6,'ago':7,'sep':8,'oct':9,'nov':10,'dic':11,'jan':0,'feb':1,'mar':2,'apr':3,'may':4,'jun':5,'jul':6,'aug':7,'sep':8,'oct':9,'nov':10,'dec':11 };
      var dd = Number(m[1]), mm = map[m[2].slice(0,3)]!=null?map[m[2].slice(0,3)]:map[m[2]], yyyy = Number(m[3]);
      if (mm!=null) return new Date(yyyy, mm, dd);
    }
    var m2 = String(s).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m2) return new Date(Number(m2[1]), Number(m2[2])-1, Number(m2[3]));
    return null;
  }
  function __rqFilterAdv(list, c){
    if (!c) return list;
    var reported = String(c.reportedBy||'').trim().toLowerCase();
    var pid = String(c.id||'').trim().toLowerCase();
    var assigned = String(c.assignedTo||'').trim().toLowerCase();
    var category = String(c.category||'').trim().toLowerCase();
    var dept = String(c.department||'').trim().toLowerCase();
    var status = String(c.status||'').trim().toLowerCase();
    var priority = String(c.priority||'').trim().toLowerCase();
    var kw = String(c.keywords||'').trim().toLowerCase();
    var tokens = kw ? kw.split(/\s+/) : [];
    var fields = c.fields||{ title:true, description:true, solution:true };
    var from = c.dateFrom ? new Date(c.dateFrom) : null;
    var to = c.dateTo ? new Date(c.dateTo) : null;
    var fromOk = from && !isNaN(from.getTime()) ? from : null;
    var toOk = to && !isNaN(to.getTime()) ? to : null;
    var res = list.filter(function(r){
      if (reported && ![r&&r.remitente,r&&r.autor,r&&r.de,r&&r.from].filter(Boolean).map(function(v){return String(v).toLowerCase();}).some(function(v){ return v.indexOf(reported)>=0; })) return false;
      if (pid && String(r&&r.id||'').toLowerCase() !== pid) return false;
      if (assigned && String(r&&r.responsable||'').toLowerCase().indexOf(assigned) < 0) return false;
      if (category && ![r&&r.category,r&&r.tipo].filter(Boolean).map(function(v){return String(v).toLowerCase();}).some(function(v){ return v.indexOf(category)>=0; })) return false;
      if (dept && String(r&&r.equipo||'').toLowerCase().indexOf(dept) < 0) return false;
      if (status && String(r&&r.estado||'').toLowerCase().indexOf(status) < 0) return false;
      if (priority && String(r&&r.priority||'').toLowerCase().indexOf(priority) < 0) return false;
      if (tokens.length){
        var pool = [];
        if (fields.title) pool.push(String(r&&r.objetivo||'').toLowerCase());
        if (fields.description) pool.push(String(r&&r.referencia||'').toLowerCase());
        if (fields.solution) pool.push(String(r&&r.notas||'').toLowerCase());
        var ok = tokens.every(function(t){ return pool.some(function(v){ return v && v.indexOf(t)>=0; }); });
        if (!ok) return false;
      }
      if (fromOk || toOk){
        var rf = __rqParseDate(r&&r.fecha);
        if (!rf) return false;
        if (fromOk && rf < fromOk) return false;
        if (toOk && rf > toOk) return false;
      }
      return true;
    });
    var order = String(c.orderBy||'').trim().toLowerCase();
    if (order){
      function keyOf(r){
        if (order==='fecha') { var d = __rqParseDate(r&&r.fecha); return d?d.getTime():0; }
        if (order==='estado') return String(r&&r.estado||'').toLowerCase();
        if (order==='responsable') return String(r&&r.responsable||'').toLowerCase();
        if (order==='equipo') return String(r&&r.equipo||'').toLowerCase();
        if (order==='objetivo' || order==='titulo' || order==='title') return String(r&&r.objetivo||'').toLowerCase();
        if (order==='id') return String(r&&r.id||'');
        return String(r&&r.objetivo||'').toLowerCase();
      }
      res.sort(function(a,b){ var va=keyOf(a), vb=keyOf(b); if (typeof va==='number' && typeof vb==='number') return va-vb; return String(va).localeCompare(String(vb)); });
    }
    return res;
  }
  function __rqSuggest(all){
    var map = {};
    function add(v){ if(!v) return; var s=String(v).trim(); if(!s) return; var k=s.toLowerCase(); if(!map[k]) map[k]=s; }
    for (var i=0;i<all.length;i++){
      var r = all[i];
      add(r&&r.responsable); add(r&&r.equipo); add(r&&r.estado); add(r&&r.fecha); add(r&&r.objetivo); add(r&&r.referencia);
    }
    var arr = []; for (var k in map){ if (Object.prototype.hasOwnProperty.call(map,k)) arr.push(map[k]); }
    return arr;
  }
  function __rqUpdateSuggestionsUI(query){
    var el = document.getElementById('requestsSearchSuggestions');
    if (!el) return;
    var candidates = __rqSuggest(__rq.all);
    var t = String(query||'').trim().toLowerCase();
    var list = t ? candidates.filter(function(s){ return s.toLowerCase().indexOf(t)>=0; }).slice(0,8) : [];
    el.innerHTML = list.map(function(s,i){ return '<li data-index="'+i+'">'+s+'</li>'; }).join('');
    el.hidden = list.length === 0;
  }
  function __rqRenderList(list){
    var el = document.getElementById('requestsList');
    if (!el) return;
    var items = list.map(function(r,i){
      var badge = 'badge-danger';
      var st = String(r.estado||'').toLowerCase();
      if (st.indexOf('culmin')>=0) badge='badge-success'; else if (st.indexOf('curso')>=0 || st.indexOf('revisión')>=0) badge='badge-warning';
      return '<li class="request-item" role="button" tabindex="0" data-index="'+i+'" aria-label="Ver detalles de '+(r.objetivo||'')+'"><div class="request-title">'+(r.objetivo||'')+'</div><div class="request-meta">'+(r.referencia||'')+'</div><div class="request-meta">'+(r.equipo||'')+'</div><div class="request-meta">'+(r.responsable||'—')+'</div><div class="request-meta">'+(r.fecha||'')+'</div><div><span class="request-badge '+badge+'">'+(r.estado||'')+'</span></div></li>';
    }).join('');
    el.innerHTML = items;
  }
  function __rqRenderSearchResults(list){
    var wrap = document.getElementById('requestsSearchResults');
    var tbody = document.getElementById('srTbody');
    if (!wrap || !tbody) return;
    if (!list || list.length===0) {
      tbody.innerHTML = '<tr><td colspan="6" class="sr-empty">No se encontraron resultados.</td></tr>';
    } else {
      tbody.innerHTML = list.map(function(r){
        return '<tr><td>'+(r.id||'—')+'</td><td>'+(r.objetivo||'')+'</td><td>'+(r.user||'—')+'</td><td>'+(r.responsable||'—')+'</td><td>'+(r.fecha||'')+'</td><td>'+String(r.estado||'')+'</td></tr>';
      }).join('');
    }
    wrap.hidden = false;
  }
  function __rqUpdateList(){
    var src = __rq.view === 'my' ? __rq.my : __rq.received;
    var filtered = (__rq.lastOption==='search' && __rq.criteria) ? __rqFilterAdv(src, __rq.criteria) : __rqFilter(src, __rq.query);
    __rqRenderList(filtered);
  }
  function __rqSetView(view){
    __rq.view = view;
    var myBtn = document.getElementById('reqTabMy');
    var recBtn = document.getElementById('reqTabReceived');
    if (myBtn && recBtn){
      if (view === 'my'){ myBtn.classList.add('active'); myBtn.setAttribute('aria-selected','true'); recBtn.classList.remove('active'); recBtn.setAttribute('aria-selected','false'); }
      else { recBtn.classList.add('active'); recBtn.setAttribute('aria-selected','true'); myBtn.classList.remove('active'); myBtn.setAttribute('aria-selected','false'); }
    }
    __rqUpdateList();
  }
  function __rqSetupSearch(){
    var input = document.getElementById('requestsSearchInput');
    var sugg = document.getElementById('requestsSearchSuggestions');
    if (!input || !sugg) return;
    if (!input.dataset.inited){
      input.addEventListener('input', function(e){ __rq.query = e.target.value || ''; __rqUpdateSuggestionsUI(__rq.query); __rqUpdateList(); });
      input.addEventListener('keydown', function(e){
        var items = Array.prototype.slice.call(sugg.querySelectorAll('li'));
        if (sugg.hidden || items.length===0) return;
        var idx = items.findIndex(function(x){ return x.classList.contains('active'); });
        if (e.key === 'ArrowDown'){ e.preventDefault(); idx = Math.min(idx+1, items.length-1); items.forEach(function(x){ x.classList.remove('active'); }); items[idx].classList.add('active'); }
        else if (e.key === 'ArrowUp'){ e.preventDefault(); idx = Math.max(idx-1, 0); items.forEach(function(x){ x.classList.remove('active'); }); items[idx].classList.add('active'); }
        else if (e.key === 'Enter'){ var act = items[idx>=0?idx:0]; if (act){ __rq.query = act.textContent || ''; input.value = __rq.query; sugg.hidden = true; __rqUpdateList(); } }
        else if (e.key === 'Escape'){ sugg.hidden = true; }
      });
      input.addEventListener('blur', function(){ setTimeout(function(){ sugg.hidden = true; }, 100); });
      sugg.addEventListener('click', function(e){ var li = e.target.closest('li'); if (!li) return; __rq.query = li.textContent || ''; input.value = __rq.query; sugg.hidden = true; __rqUpdateList(); });
      input.dataset.inited = 'true';
    }
  }
  function __rqOpenNewForm(){
    var panel = document.getElementById('requestNewPanel');
    var listPanel = document.getElementById('requestsListPanel');
    var container = document.getElementById('requestsContainer');
    if (!panel || !listPanel) return;
    panel.hidden = false;
    panel.setAttribute('aria-hidden','false');
    void panel.offsetWidth;
    panel.classList.add('show');
    listPanel.classList.add('dimmed');
    if (container) container.classList.add('overlaying');
    var first = document.getElementById('reqNewCategory'); if (first) first.focus();
    (function(){
      var disableForm = function(flag){
        var form = document.getElementById('requestNewForm');
        if(!form) return;
        var nodes = form.querySelectorAll('input, select, textarea, button#requestNewSave');
        Array.prototype.forEach.call(nodes, function(el){ try { el.disabled = !!flag; } catch(_){} });
      };
      var applyProcess = function(proc){
        var map = {
          'Gestión Contable': ['Finanzas'],
          'Soporte TI': ['Soporte'],
          'Operaciones': ['Operaciones'],
          'General': ['General','Soporte','Finanzas','Operaciones']
        };
        var el = document.getElementById('reqNewCategory');
        if(!el) return;
        var allowed = map[proc] || map['General'];
        var isSelect = el.tagName && el.tagName.toUpperCase()==='SELECT';
        if (isSelect) {
          var allOpts = Array.prototype.map.call(el.querySelectorAll('option'), function(o){ return { v:o.value||o.textContent||'', t:o.textContent||o.value||'' }; });
          var ph = allOpts.find(function(o){ return o.v==='' || /^\s*$/.test(o.v); });
          var opts = allOpts.filter(function(o){ return allowed.indexOf(o.t)>=0; });
          el.innerHTML = (ph ? '<option value="'+ph.v+'">'+(ph.t||'Seleccione')+'</option>' : '<option value="">Seleccione</option>') + opts.map(function(o){ return '<option>'+o.t+'</option>'; }).join('');
          el.value = '';
        } else {
          var dl = document.getElementById('rqCategorySuggestions');
          if(!dl){ dl = document.createElement('datalist'); dl.id = 'rqCategorySuggestions'; document.body.appendChild(dl); }
          dl.innerHTML = allowed.map(function(t){ return '<option value="'+t+'">'; }).join('');
          try { el.setAttribute('list','rqCategorySuggestions'); el.value=''; el.placeholder='Seleccione'; } catch(_){}
        }
      };
      var ensureProcessModal = function(){
        var m = document.getElementById('requestProcessModal');
        if (m) return m;
        m = document.createElement('div');
        m.id = 'requestProcessModal';
        m.className = 'modal';
        m.setAttribute('hidden','true');
        m.innerHTML = '<div class="modal-backdrop"></div><div class="modal-dialog process" role="dialog" aria-modal="true" aria-labelledby="processTitle"><div class="modal-header"><h2 id="processTitle">Seleccione proceso</h2></div><div class="modal-content"><div class="menu-section"><div class="menu-title">¿A cuál proceso quiere hacer la solicitud?</div><div class="menu-actions"><select id="rqProcessSelect" class="menu-select"><option value="">Seleccione</option><option value="Gestión Contable">Gestión Contable</option><option value="Soporte TI">Soporte TI</option><option value="Operaciones">Operaciones</option><option value="General">General</option></select></div><div id="rqProcessError" class="error-text"></div></div><div class="modal-actions"><button type="button" id="rqProcessBack" class="modal-secondary-btn">Volver</button><button type="button" id="rqProcessAccept" class="modal-add-btn" disabled>Aceptar</button></div></div></div>';
        document.body.appendChild(m);
        return m;
      };
      var already = !!(window.__rq && __rq.process);
      if (already) { applyProcess(__rq.process); disableForm(false); return; }
      var m = ensureProcessModal();
      var accept = function(){
        var selP = document.getElementById('rqProcessSelect');
        var val = selP && selP.value ? String(selP.value).trim() : '';
        if (!val) { var err = document.getElementById('rqProcessError'); if (err) err.textContent = 'Seleccione un proceso'; if (selP) selP.focus(); return; }
        __rq.process = val;
        applyProcess(val);
        disableForm(false);
        var panel2 = document.getElementById('requestNewPanel');
        var listPanel2 = document.getElementById('requestsListPanel');
        var container2 = document.getElementById('requestsContainer');
        if (panel2 && panel2.hidden) {
          panel2.hidden = false;
          panel2.setAttribute('aria-hidden','false');
          void panel2.offsetWidth;
          panel2.classList.add('show');
          if (listPanel2) listPanel2.classList.add('dimmed');
          if (container2) container2.classList.add('overlaying');
        }
        m.classList.remove('show');
        m.setAttribute('hidden','true');
      };
      var btn = m.querySelector('#rqProcessAccept');
      var backBtn = m.querySelector('#rqProcessBack');
      var backdrop = m.querySelector('.modal-backdrop');
      disableForm(true);
      m.classList.add('show');
      m.removeAttribute('hidden');
      if (backdrop && !backdrop.dataset.bound) { backdrop.addEventListener('click', function(e){ e.stopPropagation(); }); backdrop.dataset.bound='1'; }
      if (btn && !btn.dataset.bound) { btn.addEventListener('click', accept); btn.dataset.bound='1'; }
      var onChange = function(){ var selP = document.getElementById('rqProcessSelect'); var has = !!(selP && selP.value && selP.value.trim()); var err = document.getElementById('rqProcessError'); if (err) err.textContent=''; if (btn) btn.disabled = !has; };
      var selEl = document.getElementById('rqProcessSelect'); if (selEl && !selEl.dataset.bound) { selEl.addEventListener('change', onChange); selEl.dataset.bound='1'; }
      if (backBtn && !backBtn.dataset.bound) {
        backBtn.addEventListener('click', function(){
          m.classList.remove('show');
          m.setAttribute('hidden','true');
          var panel = document.getElementById('requestNewPanel');
          var container = document.getElementById('requestsContainer');
          var menuView = document.getElementById('requestsMenuView');
          var backArrow = document.getElementById('requestsBackArrow');
          __rq.lastOption = 'menu';
          if (panel) { panel.classList.remove('show'); panel.setAttribute('aria-hidden','true'); panel.hidden = true; }
          if (container) container.hidden = true;
          if (menuView) { menuView.hidden = false; void menuView.offsetWidth; menuView.classList.add('show'); }
          if (backArrow) backArrow.hidden = true;
        });
        backBtn.dataset.bound='1';
      }
    })();
  }
  function __rqCloseNewForm(){
    var panel = document.getElementById('requestNewPanel');
    var listPanel = document.getElementById('requestsListPanel');
    var container = document.getElementById('requestsContainer');
    if (!panel || !listPanel) return;
    panel.classList.remove('show');
    listPanel.classList.remove('dimmed');
    panel.setAttribute('aria-hidden','true');
    panel.hidden = true;
    if (container) container.classList.remove('overlaying');
  }
  function __rqInitNewForm(){
    var newBtn = document.getElementById('requestNewBtn');
    var cancelBtn = document.getElementById('requestNewCancel');
    var saveBtn = document.getElementById('requestNewSave');
    if (newBtn && !newBtn.dataset.inited){ newBtn.addEventListener('click', function(){ __rqOpenNewForm(); }); newBtn.dataset.inited = 'true'; }
    if (cancelBtn && !cancelBtn.dataset.inited){ cancelBtn.addEventListener('click', function(){ __rqCloseNewForm(); }); cancelBtn.dataset.inited = 'true'; }
    if (saveBtn && !saveBtn.dataset.inited){ saveBtn.addEventListener('click', function(){
      var v = function(id){ var el = document.getElementById(id); return (el && el.value && String(el.value).trim()) || ''; };
      var today = new Date();
      var dd = String(today.getDate()).padStart(2,'0');
      var mons = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
      var mon = mons[today.getMonth()];
      var yyyy = today.getFullYear();
      var r = {
        objetivo: v('reqNewCategory') || 'Nueva petición',
        referencia: v('reqNewDescription').slice(0,80),
        equipo: v('reqNewDept'),
        responsable: 'Sin asignar',
        fecha: dd+' '+mon+' '+yyyy,
        estado: 'Solicitado',
        notas: v('reqNewDescription'),
        sentByMe: true
      };
      __rq.all = [r].concat(__rq.all);
      __rq.my = [r].concat(__rq.my);
      __rqUpdateSuggestionsUI('');
      __rqUpdateList();
      var status = document.getElementById('requestNewStatus'); if (status){ status.textContent = 'Petición enviada correctamente'; status.classList.add('status-success'); }
      setTimeout(function(){ __rqCloseNewForm(); var form = document.getElementById('requestNewForm'); if (form) form.reset(); }, 600);
    }); saveBtn.dataset.inited = 'true'; }
  }
  function __rqInitTabs(){
    var myBtn = document.getElementById('reqTabMy');
    var recBtn = document.getElementById('reqTabReceived');
    if (myBtn && !myBtn.dataset.inited){ myBtn.addEventListener('click', function(){ __rqSetView('my'); }); myBtn.dataset.inited = 'true'; }
    if (recBtn && !recBtn.dataset.inited){ recBtn.addEventListener('click', function(){ __rqSetView('received'); }); recBtn.dataset.inited = 'true'; }
  }

  if (typeof window.ensureRequestsModal !== 'function') {
    window.ensureRequestsModal = function(){
      var modal = document.getElementById('requestsModal');
      if (modal) return modal;
      modal = document.createElement('div');
      modal.id = 'requestsModal';
      modal.className = 'modal';
      modal.setAttribute('hidden','true');
      modal.innerHTML = '<div class="modal-backdrop"></div><div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="requestsTitle"><div class="modal-header"><h2 id="requestsTitle">Peticiones</h2><div class="modal-header-actions"><button type="button" id="requestsClose" class="modal-close" aria-label="Cerrar"><span data-lucide="x"></span></button></div></div><div class="modal-content"><div class="requests-container" id="requestsContainer"><div class="requests-topbar" role="toolbar" aria-label="Navegación de peticiones"><div class="tabs" role="tablist"><button id="reqTabMy" class="tab-btn active" role="tab" aria-selected="true">Mis Peticiones</button><button id="reqTabReceived" class="tab-btn" role="tab" aria-selected="false">Peticiones Recibidas</button></div><div class="search-row" role="search"><div class="search-input-wrap"><input id="requestsSearchInput" type="text" placeholder="Buscar" aria-label="Buscar peticiones" autocomplete="off" /><ul id="requestsSearchSuggestions" class="search-suggestions" hidden aria-label="Sugerencias"></ul></div><button id="requestNewBtn" type="button" class="modal-add-btn" aria-label="Nueva petición">Nueva petición</button></div></div><div id="requestsListPanel" class="requests-panel"><ul id="requestsList" class="requests-list" aria-live="polite" aria-label="Lista de peticiones"></ul></div><div id="requestNewPanel" class="requests-panel details" hidden aria-hidden="true"><div class="details-header"><h3>Nueva petición</h3><button type="button" id="requestNewCancel" class="modal-secondary-btn" aria-label="Cancelar">Cancelar</button></div><div class="details-content"><form id="requestNewForm" class="request-form"><div class="form-grid"><div class="field"><label for="reqNewUser">Usuario</label><input id="reqNewUser" type="text" /></div><div class="field"><label for="reqNewEmail">E‑mail</label><input id="reqNewEmail" type="email" /></div><div class="field"><label for="reqNewDept">Departamento</label><input id="reqNewDept" type="text" /></div><div class="field"><label for="reqNewCategory">Categoría</label><input id="reqNewCategory" type="text" /></div><div class="field"><label for="reqNewStatus">Estado</label><input id="reqNewStatus" type="text" /></div><div class="field"><label for="reqNewPriority">Prioridad</label><input id="reqNewPriority" type="text" /></div><div class="field"><label for="reqNewAssign">Asignado a</label><input id="reqNewAssign" type="text" /></div></div><div class="field"><label for="reqNewDescription">Descripción</label><textarea id="reqNewDescription"></textarea></div><div class="modal-actions"><button type="button" id="requestNewSave" class="modal-add-btn">Guardar</button></div><div id="requestNewStatus" class="form-status"></div></form></div></div></div></div>';
      document.body.appendChild(modal);
      if (window.lucide && window.lucide.createIcons) { try { window.lucide.createIcons(); } catch(_){} }
      try {
        var ct = document.getElementById('reqNewUser'); if (ct) { var f = ct.closest('.field'); if (f) f.remove(); }
        var em = document.getElementById('reqNewEmail'); if (em) { var f2 = em.closest('.field'); if (f2) f2.remove(); }
        var dp = document.getElementById('reqNewDept'); if (dp) { var f3 = dp.closest('.field'); if (f3) f3.remove(); }
        var st = document.getElementById('reqNewStatus'); if (st) { var f4 = st.closest('.field'); if (f4) f4.remove(); }
        var asg = document.getElementById('reqNewAssign'); if (asg) { var f5 = asg.closest('.field'); if (f5) f5.remove(); }
        var tm = document.getElementById('reqNewTime'); if (tm) { var f6 = tm.closest('.field'); if (f6) f6.remove(); }
      } catch(_){ }
      return modal;
    };
  }
  if (typeof window.openRequestsModal !== 'function') {
    window.openRequestsModal = function(){
      var modal = (typeof window.ensureRequestsModal==='function') ? window.ensureRequestsModal() : document.getElementById('requestsModal');
      if (!modal) return;
      modal.classList.add('show');
      modal.removeAttribute('hidden');
      var header = modal.querySelector('.modal-header');
      var titleEl2 = document.getElementById('requestsTitle');
      var getBackArrow = function(){ return document.getElementById('requestsBackArrow'); };
      var removeBackArrow = function(){ var b = getBackArrow(); if (b){ try { b.remove(); } catch(_){ } } };
      var ensureBackArrow = function(){
        var b = getBackArrow();
        if (!b && header && titleEl2) {
          b = document.createElement('button');
          b.id = 'requestsBackArrow';
          b.type = 'button';
          b.className = 'modal-back-btn';
          b.innerHTML = '<span data-lucide="arrow-left"></span>';
          header.insertBefore(b, titleEl2);
          try { if (window.lucide && window.lucide.createIcons) window.lucide.createIcons(); } catch(_){ }
        }
        return b;
      };
      var backdrop = modal.querySelector('.modal-backdrop');
      var closeBtn = document.getElementById('requestsClose');
      var close = function(){ if (typeof window.closeRequestsModal==='function') window.closeRequestsModal(); };
      if (backdrop) backdrop.addEventListener('click', close, { once: true });
      if (closeBtn) closeBtn.addEventListener('click', close, { once: true });
      __rq.all = __rqLoad();
      var sp = __rqSplit(__rq.all);
      __rq.my = sp.my; __rq.received = sp.received;
      if (!__rq.lastOption || __rq.lastOption === 'menu') { __rq.view = 'my'; __rq.query = ''; }
      __rqSetView(__rq.view || 'my');
      __rqUpdateSuggestionsUI(__rq.query || '');
      __rqSetupSearch();
      __rqInitTabs();
      __rqInitNewForm();
      var menuView = document.getElementById('requestsMenuView');
      var content = modal.querySelector('.modal-content');
      var container = document.getElementById('requestsContainer');
      var listPanel = document.getElementById('requestsListPanel');
      if (!menuView && content) {
        menuView = document.createElement('div');
        menuView.id = 'requestsMenuView';
        menuView.className = 'requests-view show';
        menuView.innerHTML = '<div class="requests-menu">\n          <button id="rqMenuNew" class="menu-item" type="button"><span class="icon" data-lucide="file-plus"></span><span>Nueva solicitud</span></button>\n          <button id="rqMenuMy" class="menu-item" type="button"><span class="icon" data-lucide="user"></span><span>Mis solicitudes</span></button>\n          <button id="rqMenuProcess" class="menu-item" type="button"><span class="icon" data-lucide="workflow"></span><span>Pendientes del proceso</span></button>\n          <button id="rqMenuClosed" class="menu-item" type="button"><span class="icon" data-lucide="lock"></span><span>Cerrados</span></button>\n          <button id="rqMenuSearch" class="menu-item" type="button"><span class="icon" data-lucide="search"></span><span>Buscar solicitudes</span></button>\n          <button id="rqMenuEdit" class="menu-item" type="button"><span class="icon" data-lucide="pencil"></span><span>Editar información</span></button>\n        </div>\n        <div class="menu-section">\n          <div class="menu-title">Buscar en la base de conocimiento</div>\n          <div class="menu-actions"><input id="rqKbInput" class="menu-input" type="text" placeholder="ID" /><button id="rqKbBtn" type="button" class="modal-add-btn">Buscar</button></div>\n        </div>\n        <div class="menu-section">\n          <div class="menu-title">Ver problemas por usuario</div>\n          <div class="menu-actions"><select id="rqUserSelect" class="menu-select"><option value="hmanco">hmanco</option></select><button id="rqUserViewBtn" type="button" class="menu-view-btn">Ver</button></div>\n        </div>';
        content.appendChild(menuView);
        try { if (window.lucide && window.lucide.createIcons) window.lucide.createIcons(); } catch(_){ }
        var showMenu = function(){
          if (menuView) menuView.classList.add('show');
          if (container) container.hidden = true;
          var sv = document.getElementById('requestsSearchView');
          if (sv){ sv.classList.remove('show'); sv.hidden = true; }
          var rv = document.getElementById('requestsResultsView');
          if (rv){ rv.classList.remove('show'); rv.hidden = true; }
          removeBackArrow();
          __rq.lastOption = 'menu';
        };
        var ensureSearchView = function(){
          var v = document.getElementById('requestsSearchView');
          if (!v && content){
            v = document.createElement('div');
            v.id = 'requestsSearchView';
            v.className = 'requests-view';
            v.innerHTML = '<div class="search-view"><form id="requestsSearchForm" class="search-form" aria-label="Buscar solicitudes"><div class="menu-section"><div class="menu-title">Especificaciones</div><div class="search-grid"><label class="field"><span>Reportado por</span><input id="rqSearchReported" type="text" class="menu-input" /></label><label class="field"><span>ID del problema</span><input id="rqSearchId" type="text" class="menu-input" /></label><label class="field"><span>Asignado a</span><select id="rqSearchAssigned" class="menu-select"><option value="">Cualquiera</option></select></label><label class="field"><span>Categoría</span><input id="rqSearchCategory" type="text" class="menu-input" /></label><label class="field"><span>Departamento</span><select id="rqSearchDept" class="menu-select"><option value="">Cualquiera</option></select></label><label class="field"><span>Estado</span><select id="rqSearchStatus" class="menu-select"><option value="">Cualquiera</option><option value="Culminado">Culminado</option><option value="En curso">En curso</option><option value="Bloqueado">Bloqueado</option><option value="Bajo revisión">Bajo revisión</option></select></label><label class="field"><span>Prioridad</span><input id="rqSearchPriority" type="text" class="menu-input" /></label></div></div><div class="menu-section"><div class="menu-title">Contiene</div><div class="search-grid"><label class="field"><span>Palabras clave</span><input id="rqSearchKeywords" type="text" class="menu-input" placeholder="Ej: proveedor junio" /></label><div class="search-checkboxes"><label><input id="rqSFTitle" type="checkbox" checked /> Título</label><label><input id="rqSFDesc" type="checkbox" checked /> Descripción</label><label><input id="rqSFSolution" type="checkbox" checked /> Solución</label></div></div></div><div class="menu-section"><div class="menu-title">Orden y fechas</div><div class="search-grid"><label class="field"><span>Ordenar por</span><select id="rqSearchOrderBy" class="menu-select"><option value="">Predeterminado</option><option value="fecha">Fecha</option><option value="estado">Estado</option><option value="responsable">Responsable</option><option value="equipo">Departamento</option><option value="objetivo">Título</option><option value="id">ID</option></select></label><label class="field"><span>Desde</span><input id="rqSearchFrom" type="date" class="menu-input" /></label><label class="field"><span>Hasta</span><input id="rqSearchTo" type="date" class="menu-input" /></label></div></div></form></div>';
            content.appendChild(v);
          }
          return v;
        };
        var applyOption = function(opt){ if (menuView) menuView.classList.remove('show'); if (container) container.hidden = false; if (listPanel) listPanel.classList.remove('dimmed'); __rq.lastOption = opt; var backBtn = ensureBackArrow(); if (backBtn && !backBtn.dataset.inited){ backBtn.addEventListener('click', function(){ try { __rqCloseNewForm(); } catch(_){} showMenu(); }); backBtn.dataset.inited='true'; } switch(opt){ case 'my': __rqSetView('my'); break; case 'received': __rqSetView('received'); break; case 'closed': __rq.query='Culminado'; __rqUpdateSuggestionsUI(__rq.query); __rqUpdateList(); break; case 'search': var v2 = ensureSearchView(); if (container) container.hidden = true; if (v2){ v2.hidden = false; void v2.offsetWidth; v2.classList.add('show'); } var svContainer = (v2 && v2.querySelector('.search-view')) || v2; if (svContainer && !svContainer.querySelector('.requests-topbar')){ var tb = document.createElement('div'); tb.className = 'requests-topbar'; tb.innerHTML = '<div class="menu-title">Buscar solicitudes</div><div class="menu-actions"><button type="submit" id="rqSearchSubmitTop" class="modal-add-btn" form="requestsSearchForm">Buscar</button></div>'; svContainer.insertBefore(tb, svContainer.firstChild); } var names = []; var depts = []; for (var i=0;i<__rq.all.length;i++){ var r = __rq.all[i]; var nm = r && r.responsable; var dp = r && r.equipo; if (nm && names.indexOf(nm)<0) names.push(nm); if (dp && depts.indexOf(dp)<0) depts.push(dp); } var selA = document.getElementById('rqSearchAssigned'); var selD = document.getElementById('rqSearchDept'); if (selA && !selA.dataset.filled){ selA.innerHTML = '<option value="">Cualquiera</option>' + names.map(function(n){ return '<option value="'+n+'">'+n+'</option>'; }).join(''); selA.dataset.filled='true'; } if (selD && !selD.dataset.filled){ selD.innerHTML = '<option value="">Cualquiera</option>' + depts.map(function(n){ return '<option value="'+n+'">'+n+'</option>'; }).join(''); selD.dataset.filled='true'; } var form = document.getElementById('requestsSearchForm'); var bottomActions = form && form.querySelector('.form-actions'); if (bottomActions){ try { bottomActions.remove(); } catch(_){} } var bottomBtnExisting = document.getElementById('rqSearchSubmit'); if (bottomBtnExisting){ try { bottomBtnExisting.remove(); } catch(_){} } var resultsWrap = document.getElementById('requestsSearchResults'); var resultsView = document.getElementById('requestsResultsView'); if (!resultsWrap){ resultsWrap = document.createElement('div'); resultsWrap.id='requestsSearchResults'; resultsWrap.className='search-results'; resultsWrap.setAttribute('hidden',''); resultsWrap.innerHTML = '<div class="sr-header">Resultados de búsqueda</div><table class="sr-table" aria-label="Resultados"><thead><tr><th>ID</th><th>Título</th><th>Usuario</th><th>Asignado a</th><th>Fecha</th><th>Estado</th></tr></thead><tbody id="srTbody"></tbody></table><div class="sr-actions"><button type="button" id="rqSearchAgain" class="modal-secondary-btn">Buscar de nuevo</button></div>'; } if (!resultsView && content){ resultsView = document.createElement('div'); resultsView.id='requestsResultsView'; resultsView.className='requests-view'; resultsView.appendChild(resultsWrap); resultsView.hidden = true; content.appendChild(resultsView); } var againBtn = document.getElementById('rqSearchAgain'); var submitBtn = document.getElementById('rqSearchSubmit'); var submitTop = document.getElementById('rqSearchSubmitTop'); if (form && !form.dataset.initedV2){ form.addEventListener('submit', function(e){ e.preventDefault(); var v = function(id){ var el = document.getElementById(id); return (el && el.value && String(el.value).trim()) || ''; }; var b = function(id){ var el = document.getElementById(id); return !!(el && el.checked); }; __rq.criteria = { reportedBy: v('rqSearchReported'), id: v('rqSearchId'), assignedTo: v('rqSearchAssigned'), category: v('rqSearchCategory'), department: v('rqSearchDept'), status: v('rqSearchStatus'), priority: v('rqSearchPriority'), keywords: v('rqSearchKeywords'), fields: { title: b('rqSFTitle'), description: b('rqSFDesc'), solution: b('rqSFSolution') }, orderBy: v('rqSearchOrderBy'), dateFrom: v('rqSearchFrom'), dateTo: v('rqSearchTo') }; var rv = document.getElementById('requestsResultsView'); var base = __rq.all; var filtered = __rqFilterAdv(base, __rq.criteria); __rqRenderSearchResults(filtered); if (v2){ v2.classList.remove('show'); v2.hidden = true; } if (rv){ rv.hidden = false; void rv.offsetWidth; rv.classList.add('show'); } }); form.dataset.initedV2='true'; } if (submitBtn && !submitBtn.dataset.inited){ submitBtn.addEventListener('click', function(e){ e.preventDefault(); if (form && typeof form.requestSubmit==='function') form.requestSubmit(); else if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); }); submitBtn.dataset.inited='true'; } if (submitTop && !submitTop.dataset.inited){ submitTop.addEventListener('click', function(e){ e.preventDefault(); if (form && typeof form.requestSubmit==='function') form.requestSubmit(); else if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); }); submitTop.dataset.inited='true'; } if (againBtn && !againBtn.dataset.inited){ againBtn.addEventListener('click', function(){ var rv = document.getElementById('requestsResultsView'); var sv = document.getElementById('requestsSearchView'); if (rv){ rv.classList.remove('show'); rv.hidden = true; } if (sv){ sv.hidden = false; void sv.offsetWidth; sv.classList.add('show'); } }); againBtn.dataset.inited='true'; } break; case 'new': __rqOpenNewForm(); break; case 'edit': __rqSetView('my'); break; case 'kb': __rqSetView('my'); break; case 'user': __rqSetView('my'); break; default: __rqSetView('my'); break; } };
        var btnNew = document.getElementById('rqMenuNew'); if (btnNew && !btnNew.dataset.inited){ btnNew.addEventListener('click', function(){ applyOption('new'); }); btnNew.dataset.inited='true'; }
        var btnMy = document.getElementById('rqMenuMy'); if (btnMy && !btnMy.dataset.inited){ btnMy.addEventListener('click', function(){ applyOption('my'); }); btnMy.dataset.inited='true'; }
        var btnProc = document.getElementById('rqMenuProcess'); if (btnProc && !btnProc.dataset.inited){ btnProc.addEventListener('click', function(){ applyOption('received'); }); btnProc.dataset.inited='true'; }
        var btnClosed = document.getElementById('rqMenuClosed'); if (btnClosed && !btnClosed.dataset.inited){ btnClosed.addEventListener('click', function(){ applyOption('closed'); }); btnClosed.dataset.inited='true'; }
        var btnSearch = document.getElementById('rqMenuSearch'); if (btnSearch && !btnSearch.dataset.inited){ btnSearch.addEventListener('click', function(){ applyOption('search'); }); btnSearch.dataset.inited='true'; }
        var btnEdit = document.getElementById('rqMenuEdit'); if (btnEdit && !btnEdit.dataset.inited){ btnEdit.addEventListener('click', function(){ applyOption('edit'); }); btnEdit.dataset.inited='true'; }
        var kbBtn = document.getElementById('rqKbBtn'); if (kbBtn && !kbBtn.dataset.inited){ kbBtn.addEventListener('click', function(){ var vEl = document.getElementById('rqKbInput'); var v = vEl && vEl.value ? String(vEl.value).trim() : ''; applyOption('kb'); if (v){ __rq.query = v; __rqUpdateSuggestionsUI(__rq.query); __rqUpdateList(); } }); kbBtn.dataset.inited='true'; }
        var select = document.getElementById('rqUserSelect');
        if (select) {
          var names = [];
          for (var i=0;i<__rq.all.length;i++){ var nm = __rq.all[i] && __rq.all[i].responsable; if (nm && names.indexOf(nm) < 0) names.push(nm); }
          if (names.length > 0) select.innerHTML = names.map(function(n){ return '<option value="'+n+'">'+n+'</option>'; }).join('');
        }
        var viewBtn = document.getElementById('rqUserViewBtn'); if (viewBtn && !viewBtn.dataset.inited){ viewBtn.addEventListener('click', function(){ var sel = document.getElementById('rqUserSelect'); var val = sel && sel.value ? String(sel.value).trim() : ''; applyOption('user'); if (val){ __rq.query = val; __rqUpdateSuggestionsUI(__rq.query); __rqUpdateList(); } }); viewBtn.dataset.inited='true'; }
      }
      // Remover elementos redundantes del flujo de "Nueva solicitud"
      var topNewBtn = document.getElementById('requestNewBtn'); if (topNewBtn){ try { topNewBtn.remove(); } catch(_){} }
      var newBreadcrumb = modal.querySelector('#requestNewPanel .details-breadcrumb'); if (newBreadcrumb){ try { newBreadcrumb.remove(); } catch(_){} }
      var newCancelBtn = document.getElementById('requestNewCancel'); if (newCancelBtn){ try { newCancelBtn.remove(); } catch(_){} }

      if (__rq.lastOption && __rq.lastOption !== 'menu') {
        var opt = __rq.lastOption;
        if (opt === 'closed') { __rq.query = 'Culminado'; }
        if (menuView) menuView.classList.remove('show');
        if (container) container.hidden = false;
        ensureBackArrow();
        if (opt === 'my') __rqSetView('my');
        else if (opt === 'received') __rqSetView('received');
        else if (opt === 'search') {
          var v3 = document.getElementById('requestsSearchView') || (content && content.querySelector('#requestsSearchView'));
          var viewEl = v3;
          if (!viewEl){
            viewEl = document.createElement('div');
            viewEl.id = 'requestsSearchView';
            viewEl.className = 'requests-view';
            viewEl.innerHTML = '<div class="search-view"><form id="requestsSearchForm" class="search-form" aria-label="Buscar solicitudes"><div class="menu-section"><div class="menu-title">Especificaciones</div><div class="search-grid"><label class="field"><span>Reportado por</span><input id="rqSearchReported" type="text" class="menu-input" /></label><label class="field"><span>ID del problema</span><input id="rqSearchId" type="text" class="menu-input" /></label><label class="field"><span>Asignado a</span><select id="rqSearchAssigned" class="menu-select"><option value="">Cualquiera</option></select></label><label class="field"><span>Categoría</span><input id="rqSearchCategory" type="text" class="menu-input" /></label><label class="field"><span>Departamento</span><select id="rqSearchDept" class="menu-select"><option value="">Cualquiera</option></select></label><label class="field"><span>Estado</span><select id="rqSearchStatus" class="menu-select"><option value="">Cualquiera</option><option value="Culminado">Culminado</option><option value="En curso">En curso</option><option value="Bloqueado">Bloqueado</option><option value="Bajo revisión">Bajo revisión</option></select></label><label class="field"><span>Prioridad</span><input id="rqSearchPriority" type="text" class="menu-input" /></label></div></div><div class="menu-section"><div class="menu-title">Contiene</div><div class="search-grid"><label class="field"><span>Palabras clave</span><input id="rqSearchKeywords" type="text" class="menu-input" /></label><div class="search-checkboxes"><label><input id="rqSFTitle" type="checkbox" checked /> Título</label><label><input id="rqSFDesc" type="checkbox" checked /> Descripción</label><label><input id="rqSFSolution" type="checkbox" checked /> Solución</label></div></div></div><div class="menu-section"><div class="menu-title">Orden y fechas</div><div class="search-grid"><label class="field"><span>Ordenar por</span><select id="rqSearchOrderBy" class="menu-select"><option value="">Predeterminado</option><option value="fecha">Fecha</option><option value="estado">Estado</option><option value="responsable">Responsable</option><option value="equipo">Departamento</option><option value="objetivo">Título</option><option value="id">ID</option></select></label><label class="field"><span>Desde</span><input id="rqSearchFrom" type="date" class="menu-input" /></label><label class="field"><span>Hasta</span><input id="rqSearchTo" type="date" class="menu-input" /></label></div></div></form><div id="requestsSearchResults" class="search-results" hidden><div class="sr-header">Resultados de búsqueda</div><table class="sr-table" aria-label="Resultados"><thead><tr><th>ID</th><th>Título</th><th>Usuario</th><th>Asignado a</th><th>Fecha</th><th>Estado</th></tr></thead><tbody id="srTbody"></tbody></table><div class="sr-actions"><button type="button" id="rqSearchAgain" class="modal-secondary-btn">Buscar de nuevo</button></div></div></div>';
            if (content) content.appendChild(viewEl);
          }
          var svContainer2 = (viewEl && viewEl.querySelector('.search-view')) || viewEl;
          if (svContainer2 && !svContainer2.querySelector('.requests-topbar')){
            var tb2 = document.createElement('div');
            tb2.className = 'requests-topbar';
            tb2.innerHTML = '<div class="menu-title">Buscar solicitudes</div><div class="menu-actions"><button type="submit" id="rqSearchSubmitTop" class="modal-add-btn" form="requestsSearchForm">Buscar</button></div>';
            svContainer2.insertBefore(tb2, svContainer2.firstChild);
          }
          var names2 = [], depts2 = [];
          for (var j=0;j<__rq.all.length;j++){ var rr = __rq.all[j]; var nn = rr && rr.responsable; var dd = rr && rr.equipo; if (nn && names2.indexOf(nn)<0) names2.push(nn); if (dd && depts2.indexOf(dd)<0) depts2.push(dd); }
          var selA2 = document.getElementById('rqSearchAssigned'); var selD2 = document.getElementById('rqSearchDept');
          if (selA2 && !selA2.dataset.filled){ selA2.innerHTML = '<option value="">Cualquiera</option>' + names2.map(function(n){ return '<option value="'+n+'">'+n+'</option>'; }).join(''); selA2.dataset.filled='true'; }
          if (selD2 && !selD2.dataset.filled){ selD2.innerHTML = '<option value="">Cualquiera</option>' + depts2.map(function(n){ return '<option value="'+n+'">'+n+'</option>'; }).join(''); selD2.dataset.filled='true'; }
          if (__rq.criteria){
            var set = function(id,v){ var el = document.getElementById(id); if (el) el.value = v||''; };
            var setB = function(id,v){ var el = document.getElementById(id); if (el) el.checked = !!v; };
            set('rqSearchReported', __rq.criteria.reportedBy);
            set('rqSearchId', __rq.criteria.id);
            set('rqSearchAssigned', __rq.criteria.assignedTo);
            set('rqSearchCategory', __rq.criteria.category);
            set('rqSearchDept', __rq.criteria.department);
            set('rqSearchStatus', __rq.criteria.status);
            set('rqSearchPriority', __rq.criteria.priority);
            set('rqSearchKeywords', __rq.criteria.keywords);
            setB('rqSFTitle', __rq.criteria.fields && __rq.criteria.fields.title);
            setB('rqSFDesc', __rq.criteria.fields && __rq.criteria.fields.description);
            setB('rqSFSolution', __rq.criteria.fields && __rq.criteria.fields.solution);
            set('rqSearchOrderBy', __rq.criteria.orderBy);
            set('rqSearchFrom', __rq.criteria.dateFrom);
            set('rqSearchTo', __rq.criteria.dateTo);
            var res2 = document.getElementById('requestsSearchResults');
            var rv2 = document.getElementById('requestsResultsView');
            if (!res2){
              res2 = document.createElement('div');
              res2.id = 'requestsSearchResults';
              res2.className = 'search-results';
              res2.innerHTML = '<div class="sr-header">Resultados de búsqueda</div><table class="sr-table" aria-label="Resultados"><thead><tr><th>ID</th><th>Título</th><th>Usuario</th><th>Asignado a</th><th>Fecha</th><th>Estado</th></tr></thead><tbody id="srTbody"></tbody></table><div class="sr-actions"><button type="button" id="rqSearchAgain" class="modal-secondary-btn">Buscar de nuevo</button></div>';
            }
            if (!rv2 && res2 && content){ rv2 = document.createElement('div'); rv2.id='requestsResultsView'; rv2.className='requests-view'; rv2.appendChild(res2); content.appendChild(rv2); }
            var base2 = __rq.all; var filtered2 = __rqFilterAdv(base2, __rq.criteria);
            __rqRenderSearchResults(filtered2);
            var submitBtn2 = document.getElementById('rqSearchSubmit'); var submitTop2 = document.getElementById('rqSearchSubmitTop'); var againBtn2 = document.getElementById('rqSearchAgain'); var form2 = document.getElementById('requestsSearchForm');
            if (viewEl){ viewEl.classList.remove('show'); viewEl.hidden = true; }
            if (rv2){ rv2.hidden = false; void rv2.offsetWidth; rv2.classList.add('show'); }
            if (form2 && !form2.dataset.inited){
              form2.addEventListener('submit', function(e){
                e.preventDefault();
                var v = function(id){ var el = document.getElementById(id); return (el && el.value && String(el.value).trim()) || ''; };
                var b = function(id){ var el = document.getElementById(id); return !!(el && el.checked); };
                __rq.criteria = { reportedBy: v('rqSearchReported'), id: v('rqSearchId'), assignedTo: v('rqSearchAssigned'), category: v('rqSearchCategory'), department: v('rqSearchDept'), status: v('rqSearchStatus'), priority: v('rqSearchPriority'), keywords: v('rqSearchKeywords'), fields: { title: b('rqSFTitle'), description: b('rqSFDesc'), solution: b('rqSFSolution') }, orderBy: v('rqSearchOrderBy'), dateFrom: v('rqSearchFrom'), dateTo: v('rqSearchTo') };
                var res3 = document.getElementById('requestsSearchResults');
                var rv3 = document.getElementById('requestsResultsView');
                if (!res3){ res3 = document.createElement('div'); res3.id='requestsSearchResults'; res3.className='search-results'; res3.innerHTML = '<div class="sr-header">Resultados de búsqueda</div><table class="sr-table" aria-label="Resultados"><thead><tr><th>ID</th><th>Título</th><th>Usuario</th><th>Asignado a</th><th>Fecha</th><th>Estado</th></tr></thead><tbody id="srTbody"></tbody></table><div class="sr-actions"><button type="button" id="rqSearchAgain" class="modal-secondary-btn">Buscar de nuevo</button></div>';
                }
                if (!rv3 && res3 && content){ rv3 = document.createElement('div'); rv3.id='requestsResultsView'; rv3.className='requests-view'; rv3.appendChild(res3); content.appendChild(rv3); }
                var base3 = __rq.all; var filtered3 = __rqFilterAdv(base3, __rq.criteria);
                __rqRenderSearchResults(filtered3);
                if (viewEl){ viewEl.classList.remove('show'); viewEl.hidden = true; }
                if (rv3){ rv3.hidden = false; void rv3.offsetWidth; rv3.classList.add('show'); }
              });
              form2.dataset.inited = 'true';
            }
            if (submitBtn2 && !submitBtn2.dataset.inited){
              submitBtn2.addEventListener('click', function(e){
                e.preventDefault();
                if (form2 && typeof form2.requestSubmit==='function') form2.requestSubmit();
                else if (form2) form2.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
              });
              submitBtn2.dataset.inited = 'true';
            }
            if (submitTop2 && !submitTop2.dataset.inited){
              submitTop2.addEventListener('click', function(e){
                e.preventDefault();
                if (form2 && typeof form2.requestSubmit==='function') form2.requestSubmit();
                else if (form2) form2.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
              });
              submitTop2.dataset.inited = 'true';
            }
            if (againBtn2 && !againBtn2.dataset.inited){
              againBtn2.addEventListener('click', function(){
                var rv2 = document.getElementById('requestsResultsView'); var sv2 = document.getElementById('requestsSearchView');
                if (rv2){ rv2.classList.remove('show'); rv2.hidden = true; }
                if (sv2){ sv2.hidden = false; void sv2.offsetWidth; sv2.classList.add('show'); }
              });
              againBtn2.dataset.inited = 'true';
            }
          }
          if (!__rq.criteria) { viewEl.hidden = false; void viewEl.offsetWidth; viewEl.classList.add('show'); } else { viewEl.classList.remove('show'); viewEl.hidden = true; }
        }
        else if (opt === 'new') { __rqOpenNewForm(); }
        else { __rqSetView('my'); }
        __rqUpdateSuggestionsUI(__rq.query);
        __rqUpdateList();
      } else {
        if (container) container.hidden = true;
        if (backBtn) backBtn.hidden = true;
        if (menuView) menuView.classList.add('show');
      }
    };
  }
  if (typeof window.closeRequestsModal !== 'function') {
    window.closeRequestsModal = function(){
      var modal = document.getElementById('requestsModal');
      if (!modal) return;
      modal.classList.add('closing');
      setTimeout(function(){
        modal.classList.remove('show');
        modal.classList.remove('closing');
        modal.setAttribute('hidden','true');
        try { modal.style.display=''; modal.style.visibility=''; } catch(_){}
        try {
          var sv = document.getElementById('requestsSearchView');
          var rv = document.getElementById('requestsResultsView');
          if (sv) { sv.classList.remove('show'); sv.hidden = true; }
          if (rv) { rv.classList.remove('show'); rv.hidden = true; }
        } catch(_){}
      }, 180);
    };
  }

  if (typeof window.ensureChatbotModal !== 'function') {
    window.ensureChatbotModal = function(){
      var modal = document.getElementById('chatbotModal');
      if (modal) return modal;
      modal = document.createElement('div');
      modal.id = 'chatbotModal';
      modal.className = 'modal';
      modal.setAttribute('hidden','true');
      modal.innerHTML = '<div class="modal-backdrop"></div><div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="chatbotTitle"><div class="modal-header"><h2 id="chatbotTitle">Asistente</h2><div class="modal-header-actions"><button type="button" id="chatbotClose" class="modal-close" aria-label="Cerrar"><span data-lucide="x"></span></button></div></div><div class="modal-content"><div id="chatHistory" class="chat-history" aria-live="polite" role="region" aria-label="Historial de chat"></div><form id="chatForm" class="chat-input-row" aria-label="Enviar mensaje"><input id="chatMessageInput" type="text" placeholder="Escribe tu mensaje" aria-label="Mensaje" /><button type="submit" id="chatSendBtn" class="modal-add-btn" aria-label="Enviar">Enviar</button></form></div></div>';
      document.body.appendChild(modal);
      if (window.lucide && window.lucide.createIcons) { try { window.lucide.createIcons(); } catch(_){} }
      return modal;
    };
  }
  if (typeof window.openChatbotModal !== 'function') {
    window.openChatbotModal = function(){
      var modal = (typeof window.ensureChatbotModal==='function') ? window.ensureChatbotModal() : document.getElementById('chatbotModal');
      if (!modal) return;
      modal.classList.add('show');
      modal.removeAttribute('hidden');
      var backdrop = modal.querySelector('.modal-backdrop');
      var closeBtn = document.getElementById('chatbotClose');
      var close = function(){ if (typeof window.closeChatbotModal==='function') window.closeChatbotModal(); };
      if (backdrop) backdrop.addEventListener('click', close, { once: true });
      if (closeBtn) closeBtn.addEventListener('click', close, { once: true });
    };
  }
  if (typeof window.closeChatbotModal !== 'function') {
    window.closeChatbotModal = function(){
      var modal = document.getElementById('chatbotModal');
      if (!modal) return;
      modal.classList.add('closing');
      setTimeout(function(){
        modal.classList.remove('show');
        modal.classList.remove('closing');
        modal.setAttribute('hidden','true');
        try { modal.style.display=''; modal.style.visibility=''; } catch(_){}
      }, 180);
    };
  }
})();
