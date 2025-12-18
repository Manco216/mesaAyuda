document.addEventListener('DOMContentLoaded', function(){
  var form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var u = document.getElementById('loginUser');
    var p = document.getElementById('loginPass');
    var user = (u && u.value || '').trim();
    var pass = (p && p.value || '').trim();
    if (!user || !pass) { try { alert('Completa usuario y contraseña'); } catch(_) {} return; }
    try {
      try { sessionStorage.setItem('socya:auth','1'); } catch(_) {}
      window.location.href = './public/dashboard.html';
    } catch(_) {}
  });
});
