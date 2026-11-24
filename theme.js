(function(){
  'use strict';
  var key='khafagy-theme', root=document.documentElement;
  var saved=null;try{saved=localStorage.getItem(key)}catch(e){}
  root.dataset.theme=saved==='light'?'light':'dark';
  function sync(){
    var light=root.dataset.theme==='light';
    document.querySelectorAll('.kh-theme-toggle').forEach(function(button){button.setAttribute('aria-pressed',String(light));button.setAttribute('aria-label',light?'Switch to dark theme':'Switch to light theme');button.title=light?'Dark theme':'Light theme'});
    var meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=light?'#ffffff':'#000000';
  }
  function init(){sync();document.querySelectorAll('.kh-theme-toggle').forEach(function(button){button.addEventListener('click',function(){root.dataset.theme=root.dataset.theme==='light'?'dark':'light';try{localStorage.setItem(key,root.dataset.theme)}catch(e){}sync()})})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('storage',function(event){if(event.key===key){root.dataset.theme=event.newValue==='light'?'light':'dark';sync()}});
})();
