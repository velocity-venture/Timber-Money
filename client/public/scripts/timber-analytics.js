(function(){
  function hash(s){ // lightweight hash for copy content
    var h=0,i,c;if(!s) return 0; for(i=0;i<s.length;i++){c=s.charCodeAt(i);h=((h<<5)-h)+c;h|=0;} return h>>>0;
  }
  function uid(){
    try{
      var x = localStorage.getItem('tm_uid');
      if (!x){ x = (crypto && crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2)) + '-' + Date.now(); localStorage.setItem('tm_uid', x); }
      return x;
    }catch(e){ return 'anon'; }
  }
  function send(ev, tipCopy){
    try{
      fetch('/api/timber/analytics', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          event: ev,
          path: location.pathname + location.search,
          ts: Date.now(),
          uid: uid(),
          tipHash: hash(tipCopy||'')
        })
      }).catch(()=>{});
    }catch(e){}
  }
  window.TimberAnalytics = { send: send };
})();
