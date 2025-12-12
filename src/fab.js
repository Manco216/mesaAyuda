(function(){
  function ensure(){
    var cont = document.getElementById('fabContainer');
    if(!cont){
      cont = document.createElement('div');
      cont.id = 'fabContainer';
      cont.className = 'fab-container';
      cont.innerHTML = '<button id="requestsBtn" class="fab-secondary" aria-label="Peticiones" title="Peticiones"><span class="fa fa-list"></span></button><button id="chatbotBtn" class="fab-secondary" aria-label="Asistente" title="Asistente"><span class="fa fa-robot"></span></button>';
      document.body.appendChild(cont);
    }
    Array.prototype.forEach.call(document.querySelectorAll('#requestsBtn'), function(req){
      if(!req.dataset.fBound){
        req.addEventListener('click',function(e){
          e.preventDefault();
          try { console.debug('FAB: click en Peticiones'); } catch(_){ }
          try { if (typeof window.ensureRequestsModal === 'function') window.ensureRequestsModal(); } catch(_){ }
          if(typeof window.openRequestsModal==='function') window.openRequestsModal();
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
      if (t.id === 'requestsBtn') { try { if (typeof window.ensureRequestsModal==='function') window.ensureRequestsModal(); } catch(_){}; if (typeof window.openRequestsModal==='function') window.openRequestsModal(); }
      if (t.id === 'chatbotBtn') { try { if (typeof window.ensureChatbotModal==='function') window.ensureChatbotModal(); } catch(_){}; if (typeof window.openChatbotModal==='function') window.openChatbotModal(); }
    }, true);
    document.__fabGlobalBound = true;
  }
})();
