/* JM20 hub behaviour: language toggle, calculators, method stage, gallery zoom, contact form. */
(function(){'use strict';var U='https://wiavnyuchdsfztzhvaua.supabase.co',K='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpYXZueXVjaGRzZnp0emh2YXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMDI2ODQsImV4cCI6MjA4NjU3ODY4NH0.dXz7vyFglA_lihma__rbtBT8afZZ1YUJEkAmqpFOL6c',$=function(i){return document.getElementById(i)},Q=function(s){return[].slice.call(document.querySelectorAll(s))};
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function lg(){return document.documentElement.lang==='en'?'en':'es'}
function eu(n){return new Intl.NumberFormat(lg()==='en'?'en-GB':'es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0,useGrouping:true}).format(Math.round(n))}
function v(i){var n=parseFloat(String($(i).value).replace(',','.'));return isFinite(n)&&n>0?n:0}
var touched=false;
var F=[function(a,b,c){return a*Math.min(b,100)/100*c*4.3},function(a,b,c){return a*Math.min(b,100)/100*c},function(a,b,c){return a*Math.min(b,100)/100*c},function(a,b,c){return a*Math.min(b,100)/100*c*4.3}],
N={es:['Llamadas','Presupuestos','No-shows','Trabajo repetitivo'],en:['Calls','Quotes','No-shows','Repetitive work']},sum='';
function calc(){var t=0,p=[],m=[],L=lg()==='en'?'a month':'al mes';for(var k=0;k<4;k++){var x=F[k](v('c'+k+'0'),v('c'+k+'1'),v('c'+k+'2'));m.push(x);t+=x;$('r'+k).innerHTML=eu(x)+' <small>'+L+'</small>';$('rs'+k).textContent=eu(x);p.push(N[lg()][k]+' '+eu(x))}
 var mx=Math.max.apply(null,m)||1;m.forEach(function(x,k){$('rb'+k).style.width=(x/mx*100)+'%'});
 $('tm').textContent=eu(t);$('ty').textContent=eu(t*12);
 sum=(lg()==='en'?'Calculator: ':'Calculadora: ')+p.join(' · ')+' → '+eu(t)+(lg()==='en'?'/month.':'/mes.');if(touched){$('yf').hidden=false;$('yfv').textContent=eu(t)+(lg()==='en'?' a month':' al mes')}}
Q('.cl input[type=number]').forEach(function(e){e.addEventListener('input',function(){var r=$(e.id.replace('c','s'));if(r)r.value=Math.min(100,v(e.id));touched=true;calc()})});
Q('.cl input[type=range]').forEach(function(r){r.addEventListener('input',function(){$(r.id.replace('s','c')).value=r.value;touched=true;calc()})});
var cur=1,timer=null,sl=Q('.sl')[0];
function step(s,manual){cur=+s;$('sg').setAttribute('data-s',s);Q('.sl button').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-s')==s)});for(var i=1;i<5;i++)$('pn'+i).hidden=i!=s;if(manual){sl.classList.remove('auto');clearInterval(timer);timer=null}else{sl.classList.remove('auto');void sl.offsetWidth;sl.classList.add('auto')}}
Q('.sl button').forEach(function(b){b.addEventListener('click',function(){step(b.getAttribute('data-s'),true)})});
function play(){if(timer||reduce)return;sl.classList.add('auto');timer=setInterval(function(){step(cur%4+1,false)},6000)}
if('IntersectionObserver' in window&&!reduce){new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)play();else if(timer){clearInterval(timer);timer=null}})},{threshold:.4}).observe($('sg'))}
var vv=$('hv');if(reduce){vv.removeAttribute('autoplay');vv.pause()}
var mq=window.matchMedia?matchMedia('(max-width:700px)'):{matches:false};
var userPaused=false;
function vid(){var l=lg(),s=mq.matches?'-m':'';vv.setAttribute('aria-label',l==='en'?'Animation: money slips out through three leaks in a business and stays when they are plugged.':'Animación: el dinero se escapa por tres fugas de un negocio y se queda cuando se tapan.');vv.poster='assets/img/hero-'+l+s+'.jpg';vv.querySelector('source').src='assets/video/hero-'+l+s+'.mp4';vv.autoplay=!(reduce||userPaused);vv.load();if(!reduce&&!userPaused){var pr=vv.play();if(pr&&pr.catch)pr.catch(function(){})}}
if(mq.addEventListener)mq.addEventListener('change',vid);
$('lang').addEventListener('click',function(){var l=lg()==='es'?'en':'es';document.documentElement.lang=l;$('lang').textContent=l==='es'?'EN':'ES';document.title=l==='en'?"JM20 — You don't need AI. You need to stop the leaks.":'JM20 — No necesitas IA. Necesitas parar las fugas de dinero.';calc();vid();ppSync()});
$('go2').addEventListener('click',function(){if(!$('m').value)$('m').value=sum});
var f=$('form');f.addEventListener('submit',function(ev){ev.preventDefault();var er=$('err'),b=$('go'),g=function(i){return($(i).value||'').trim()};er.classList.remove('on');if(!f.reportValidity())return;
function ok(){f.style.display='none';var d=$('done');d.style.display='block';d.setAttribute('tabindex','-1');d.focus()}
if(g('h')){ok();return}b.disabled=true;
fetch(U+'/rest/v1/leads',{method:'POST',headers:{'Content-Type':'application/json',apikey:K,Authorization:'Bearer '+K,Prefer:'return=minimal'},body:JSON.stringify({full_name:g('n'),company:g('c'),email:g('e'),phone:g('p'),website:'',interest:'Discovery',comments:(g('m')+' (origen: web principal)').slice(0,1900)})})
.then(function(r){if(r.ok)ok();else throw 0}).catch(function(){er.classList.add('on');b.disabled=false})});
var pp=$('pp');
function ppSync(){var playing=!vv.paused;pp.classList.toggle('is-paused',!playing);pp.setAttribute('aria-label',(playing?{es:'Pausar animación',en:'Pause animation'}:{es:'Reproducir animación',en:'Play animation'})[lg()])}
pp.addEventListener('click',function(){if(vv.paused){userPaused=false;var pr=vv.play();if(pr&&pr.catch)pr.catch(function(){})}else{userPaused=true;vv.pause()}ppSync()});
['play','pause','loadeddata'].forEach(function(e){vv.addEventListener(e,ppSync)});
vid();ppSync();
var zm=$('zm'),zi=$('zi'),last=null;
function zoom(b){last=b;zi.src=b.getAttribute('data-big');zi.alt=b.querySelector('img').alt;zm.classList.add('on');document.body.style.overflow='hidden'}
function unzoom(){zm.classList.remove('on');document.body.style.overflow='';if(last)last.focus()}
Q('.bi').forEach(function(b){b.addEventListener('click',function(){zoom(b)})});
zm.addEventListener('click',unzoom);document.addEventListener('keydown',function(e){if(e.key==='Escape'&&zm.classList.contains('on'))unzoom()});
calc()})();
