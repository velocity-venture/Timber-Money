(function(){
  const el = document.createElement('div');
  el.id = 'timber-header';
  el.style.cssText = `
    position: fixed; top: 14px; right: 14px; z-index: 9999;
    width: 72px; height: 72px; pointer-events: auto;
  `;
  el.innerHTML = '<img src="/mascot/timber-animated.svg" alt="Timber, your money guide" style="width:100%;height:100%;display:block;">';
  document.addEventListener('DOMContentLoaded', function(){
    document.body.appendChild(el);
  });
})();
