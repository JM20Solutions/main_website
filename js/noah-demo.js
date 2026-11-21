/* Noah demo (tabs, transcript, audio-to-text sync).
   Logic copied from the Noah site (demos.js). Language comes from <html lang>.
   Audio and image paths come from data-base on #ndPanel. */
(function(){
  var panel = document.getElementById('ndPanel');
  if(!panel) return;

  var LANG = (document.documentElement.lang || 'es').slice(0,2) === 'en' ? 'en' : 'es';
  var BASE = panel.getAttribute('data-base') || '';

  var DEMOS = {
    booking: {
      title: {es:'Reserva nueva', en:'New booking'},
      sub: {es:'Corte de cabello · Martes, 17:00', en:'Haircut · Tuesday, 5:00 PM'},
      src: 'booking.mp3',
      lines: [
        {who:'agent', text:'Hola, soy Noah la asistente de IA de JM20, te puedo ayudar para agendar, cambiar o cancelar una reservacion.En que te puedo ayudar hoy?'},
        {who:'caller', text:'Hola, quería reservar un corte de cabello para el martes a las cinco.'},
        {who:'agent', text:'Perfecto, ¿me dices tu nombre completo?'},
        {who:'caller', text:'Maria Garcia.'},
        {who:'agent', text:'Gracias, Maria. Me das tu numero de telefono?'},
        {who:'caller', text:'Seis uno dos, tres cuatro cinco, seis siete ocho.'},
        {who:'agent', text:'Genial, sí que hay hueco para el martes a las cinco, te la dejo reservada?'},
        {who:'caller', text:'Si por favor.'},
        {who:'agent', text:'Listo, tu cita está confirmada para el martes a las cinco. Si necesitas cambiar o cancelar tu cita puedes llamarnos de nuevo en cualquier momento. Gracias y que tengas un buen dia.'}
      ]
    },
    reschedule: {
      title: {es:'Cambio de cita', en:'Reschedule'},
      sub: {es:'Corte de cabello · Movida al viernes, 14:00', en:'Haircut · Moved to Friday, 2:00 PM'},
      src: 'reschedule.mp3',
      lines: [
        {who:'agent', text:'Hola, soy Noah la asistente de IA de JM20, te puedo ayudar para agendar, cambiar o cancelar una reservacion. En que te puedo ayudar hoy?'},
        {who:'caller', text:'Hola, queria cambiar mi cita del martes a las cinco.'},
        {who:'agent', text:'Claro que si, ¿me dices tu nombre completo por favor?'},
        {who:'caller', text:'Sofia Pineda'},
        {who:'agent', text:'Gracias Sofia, me das tu numero de telefono?'},
        {who:'caller', text:'612 345 678.'},
        {who:'agent', text:'Genial, he encontrado tu reserva para corte y mechas para el martes a las cinco. Me dices para cuando la quieres cambiar?'},
        {who:'caller', text:'Para el viernes a las dos.'},
        {who:'agent', text:'Dejame ver si hay hueco. Listo Sofia, si hay hueco para el viernes a las dos. Te la cambio?'},
        {who:'caller', text:'Si por favor.'},
        {who:'agent', text:'Genial, ya esta cambiada. Si necesitas cambiarla de nuevo o cancelarla, nos puedes llamar otra vez cuando quieras. Muchas gracias y que pases muy buen dia.'}
      ]
    },
    cancel: {
      title: {es:'Cancelación', en:'Cancellation'},
      sub: {es:'Corte de cabello · Cancelada', en:'Haircut · Cancelled'},
      src: 'cancel.mp3',
      lines: [
        {who:'agent', text:'Hola, soy Noah la asistente de IA de JM20, te puedo ayudar para agendar, cambiar o cancelar una reservacion.En que te puedo ayudar hoy?'},
        {who:'caller', text:'Hola, quería cancelar mi cita de mañana.'},
        {who:'agent', text:'Sin problema. ¿Me das tu número de teléfono para localizar tu reserva?'},
        {who:'caller', text:'Seis uno dos, tres cuatro cinco, seis siete ocho.'},
        {who:'agent', text:'Encontré tu cita de mañana a las seis y media para corte de cabello. Me confirmas que quieres cancelar la cita?'},
        {who:'caller', text:'Sí, cancela por favor.'},
        {who:'agent', text:'Tu cita se ha cancelado correctamente.Necesitas que te ayude con algo mas?'},
        {who:'caller', text:'No gracias, es todo.'},
        {who:'agent', text:'Listo Pablo, tu cita del jueves a las seis y media esta cancelada. Si necesitas agendar de nuevo una cita puedes llamarnos en cualquier momento, Gracias y que tengas un buen dia.'}
      ]
    }
  };

  var audio = document.getElementById('ndAudio');
  var transcriptEl = document.getElementById('ndTranscript');
  var titleEl = document.getElementById('ndTitle');
  var subEl = document.getElementById('ndSub');
  var errEl = document.getElementById('ndErr');
  var tabs = [].slice.call(document.querySelectorAll('#ndTabs .nd-tab'));
  var pics = [].slice.call(panel.querySelectorAll('.nd-pic'));
  var lineEls = [], lineStarts = [], activeIdx = -2, rafId = null, currentKey = 'booking';

  function computeStarts(){
    var d = DEMOS[currentKey].lines;
    lineStarts = [];
    var dur = audio.duration;
    if(!isFinite(dur) || dur <= 0) return;
    var weights = d.map(function(l){ return l.text.length + 14; });
    var total = weights.reduce(function(a,b){ return a+b; }, 0), acc = 0;
    d.forEach(function(l,i){ lineStarts.push(acc/total*dur); acc += weights[i]; });
  }

  function indexAt(t){
    var idx = -1;
    for(var i=0;i<lineStarts.length;i++){ if(t >= lineStarts[i]) idx = i; }
    return idx;
  }

  function scrollToLine(el){
    var top = el.offsetTop + el.offsetHeight - transcriptEl.clientHeight + 16;
    transcriptEl.scrollTo({top: Math.max(0, top), behavior:'smooth'});
  }

  function syncTranscript(force){
    var t = audio.currentTime;
    if(!lineStarts.length) return;
    var syncing = t > 0 || !audio.paused;
    var ended = audio.ended;
    var idx = syncing ? indexAt(t) : -1;
    if(ended) idx = lineEls.length - 1;
    if(idx === activeIdx && !force) return;
    activeIdx = idx;
    transcriptEl.classList.toggle('sync', syncing);
    lineEls.forEach(function(el,i){
      el.classList.toggle('shown', syncing && i <= idx);
      el.classList.toggle('past', syncing && i < idx);
      el.classList.toggle('active', syncing && i === idx && !ended);
    });
    if(syncing && idx >= 0) scrollToLine(lineEls[idx]);
  }

  function loop(){ syncTranscript(); rafId = requestAnimationFrame(loop); }
  function stopLoop(){ if(rafId){ cancelAnimationFrame(rafId); rafId = null; } }

  function resetSync(){
    stopLoop();
    lineEls = [].slice.call(transcriptEl.children);
    lineStarts = [];
    activeIdx = -2;
    transcriptEl.classList.remove('sync');
    lineEls.forEach(function(el){ el.classList.remove('shown','past','active'); });
    transcriptEl.scrollTop = 0;
    computeStarts();
  }

  audio.addEventListener('loadedmetadata', function(){ computeStarts(); syncTranscript(true); });
  audio.addEventListener('durationchange', function(){ computeStarts(); });
  audio.addEventListener('play', function(){ stopLoop(); loop(); });
  audio.addEventListener('pause', function(){ stopLoop(); syncTranscript(true); });
  audio.addEventListener('ended', function(){ stopLoop(); syncTranscript(true); });
  audio.addEventListener('seeked', function(){ syncTranscript(true); });
  audio.addEventListener('timeupdate', function(){ if(audio.paused) syncTranscript(); });

  function renderDemo(key){
    currentKey = key;
    audio.pause();
    if(errEl) errEl.hidden = true;
    var d = DEMOS[key];
    titleEl.textContent = d.title[LANG];
    subEl.textContent = d.sub[LANG];
    transcriptEl.innerHTML = '';
    d.lines.forEach(function(l){
      var div = document.createElement('div');
      div.className = 'nd-line ' + l.who;
      div.textContent = l.text;
      transcriptEl.appendChild(div);
    });
    pics.forEach(function(p){ p.classList.toggle('on', p.getAttribute('data-pic') === key); });
    var source = audio.querySelector('source');
    source.src = BASE + d.src;
    audio.load();
    resetSync();
  }

  tabs.forEach(function(btn){
    btn.addEventListener('click', function(){
      tabs.forEach(function(b){ b.classList.remove('on'); b.setAttribute('aria-selected','false'); b.setAttribute('tabindex','-1'); });
      btn.classList.add('on'); btn.setAttribute('aria-selected','true'); btn.setAttribute('tabindex','0');
      panel.setAttribute('aria-labelledby', btn.id);
      renderDemo(btn.getAttribute('data-tab'));
    });
    btn.addEventListener('keydown', function(e){
      var i = tabs.indexOf(btn), n = null;
      if(e.key === 'ArrowRight') n = tabs[(i+1)%tabs.length];
      else if(e.key === 'ArrowLeft') n = tabs[(i-1+tabs.length)%tabs.length];
      else if(e.key === 'Home') n = tabs[0];
      else if(e.key === 'End') n = tabs[tabs.length-1];
      if(n){ e.preventDefault(); n.focus(); n.click(); }
    });
  });

  audio.addEventListener('error', function(){
    var sr = audio.querySelector('source');
    if(sr && sr.getAttribute('src') && errEl){ errEl.hidden = false; }
  }, true);

  renderDemo('booking');
})();
