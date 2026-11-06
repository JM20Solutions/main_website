const U='https://wiavnyuchdsfztzhvaua.supabase.co',K='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpYXZueXVjaGRzZnp0emh2YXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMDI2ODQsImV4cCI6MjA4NjU3ODY4NH0.dXz7vyFglA_lihma__rbtBT8afZZ1YUJEkAmqpFOL6c';
const $=s=>document.querySelector(s),eur=n=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
const P=[['p1','Estás consiguiendo oportunidades que tu negocio no está aprovechando.','Un cliente llama y nadie contesta. Alguien escribe por WhatsApp y recibe respuesta tarde. Envías un presupuesto y no vuelves a contactar.','Organizamos tus consultas en un único sistema, respondemos inicialmente, identificamos oportunidades y automatizamos el seguimiento de presupuestos.','Aprovechar mejor las oportunidades que ya llegan a tu negocio.'],
['p2','Tus clientes ya te conocen. ¿Pero siguen en contacto con tu negocio?','Tienes una base de clientes, pero no sabes quién lleva meses sin volver ni quién podría necesitar de nuevo tus servicios.','Identificamos clientes inactivos, organizamos su historial y creamos recordatorios y comunicación personalizada.','Aprovechar mejor las relaciones comerciales que ya has construido.'],
['p3','Has vendido el servicio, pero todavía no has cobrado.','Facturas pendientes, recordatorios manuales y horas revisando quién debe dinero.','Automatizamos avisos de vencimiento, seguimiento de facturas y notificaciones de impago.','Reducir el trabajo administrativo y controlar mejor tus cobros.'],
['p4','Tu equipo pierde horas haciendo siempre lo mismo.','Copiar información, revisar correos, preparar documentos y trasladar datos entre programas.','Conectamos tus herramientas, automatizamos tareas administrativas y procesamos documentos.','Liberar tiempo para actividades de mayor valor.'],
['p5','Tienes empleados y recursos, pero no siempre aprovechas su capacidad.','Citas canceladas, clientes que no aparecen y agendas desorganizadas.','Mejoramos la gestión de citas, automatizamos confirmaciones y recordatorios y coordinamos agendas.','Aprovechar mejor la capacidad que ya tiene tu negocio.'],
['p6','Vendes y trabajas, pero no sabes qué te deja realmente dinero.','No todos los clientes ni servicios son igual de rentables, y no siempre sabes cuánto cuesta realmente un trabajo.','Centralizamos ventas y costes, analizamos márgenes e identificamos lo menos rentable.','Decidir con información más clara sobre la rentabilidad.']];
$('#pr').innerHTML=P.map(p=>`<div class="pr"><img src="assets/img/${p[0]}.webp" alt="" loading="lazy" width="1280" height="720"><div><h3>${p[1]}</h3><p class="m">${p[2]}</p><h4>¿Qué podemos hacer?</h4><p>${p[3]}</p><p class="g">El objetivo: ${p[4].charAt(0).toLowerCase()+p[4].slice(1)}</p></div></div>`).join('');
const C=[['Llamadas y mensajes sin contestar','Clientes que escriben o llaman y no reciben respuesta.',['Sin contestar por semana',8],['Habrían comprado (%)',40],['Venta media (€)',30],(a,b,c)=>a*4.33*b/100*c,'Ventas potenciales no capturadas al mes'],
['Presupuestos sin seguimiento','Presupuestos enviados que nadie retoma.',['Sin retomar al mes',10],['Habrían aceptado (%)',20],['Valor medio (€)',400],(a,b,c)=>a*b/100*c,'Presupuestos potencialmente no convertidos al mes'],
['Citas a las que no vienen','Huecos que se pierden porque el cliente no aparece.',['No-shows al mes',12],['Recuperable (%)',50],['Precio por cita (€)',25],(a,b,c)=>a*b/100*c,'Capacidad que podría recuperarse al mes'],
['Trabajo repetitivo','Horas tuyas en tareas que una máquina puede hacer.',['Horas por semana',6],['Automatizable (%)',60],['Coste de tu hora (€)',15],(a,b,c)=>a*4.33*b/100*c,'Coste estimado del tiempo automatizable al mes']];
$('#cal').innerHTML=C.map((c,i)=>`<div class="c"><h4>${c[0]}</h4><p>${c[1]}</p>${[2,3,4].map(j=>`<label>${c[j][0]}<input type="number" min="0" inputmode="decimal" value="${c[j][1]}" data-i="${i}"></label>`).join('')}<b id="r${i}"></b><small>${c[6]}</small></div>`).join('');
let tm=0,sum='';const rd=()=>{const v=[...document.querySelectorAll('#cal .c')].map((el,i)=>{const n=[...el.querySelectorAll('input')].map(x=>Math.max(0,+x.value||0));return C[i][5](...n)});
v.forEach((x,i)=>$('#r'+i).textContent=eur(x));const t=v.reduce((a,b)=>a+b,0);const a=tm,s=performance.now();tm=t;
const step=n=>{const k=Math.min(1,(n-s)/400),e=a+(t-a)*(1-Math.pow(1-k,3));$('#tm').textContent=eur(e);$('#ty').textContent=eur(e*12);if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step);
sum='Calculadoras (estimación): '+C.map((c,i)=>c[0]+' '+eur(v[i])+'/mes').join('; ')+'. Total '+eur(t)+'/mes, '+eur(t*12)+'/año.'};
$('#cal').addEventListener('input',rd);rd();
document.querySelector('[data-calc]').addEventListener('click',()=>{$('#cs').textContent='Incluiremos los resultados de tus calculadoras con tu consulta.';$('#cs').dataset.on=1});
const D=[['Un cliente solicita un presupuesto','Qué servicio pide el cliente','Medidas, plazo y datos de contacto','Registra la oportunidad y programa el seguimiento comercial','Ningún presupuesto se queda sin respuesta'],
['Recibes una factura de un proveedor','Que es una factura de proveedor','Importe, fecha, proveedor y número','Extrae los datos y comprueba posibles duplicados','Información lista para tu programa de contabilidad'],
['Un cliente quiere cambiar una cita','Que quiere mover su cita','La disponibilidad de la agenda','Ofrece alternativas y actualiza la agenda al confirmar','Agenda al día sin llamadas cruzadas'],
['Un cliente lleva meses sin volver','Qué clientes llevan tiempo inactivos','El historial de clientes','Prepara comunicaciones personalizadas para recuperar el contacto','Contacto recuperado con clientes que ya conoces'],
['Quieres saber qué servicio es más rentable','Que quieres comparar márgenes','Ventas y costes por servicio','Calcula los márgenes y compara los servicios','Una comparativa de los servicios más rentables']];
let di=0;const T=['Qué entiende el sistema','Qué información necesita','Qué acciones puede realizar','Resultado operativo posible'];
$('#tabs').innerHTML=D.map((d,i)=>`<button aria-pressed="${i==0}" data-i="${i}">${d[0]}</button>`).join('');
const show=()=>{$('#out').innerHTML=D[di].slice(1).map((t,i)=>`<div style="animation-delay:${i*.12}s"><h5>${T[i]}</h5>${t}</div>`).join('')};
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;di=+b.dataset.i;[...$('#tabs').children].forEach(x=>x.setAttribute('aria-pressed',x==b));show()});show();
$('#map').innerHTML=[['Entendemos tu negocio','Analizamos cómo consigues clientes, cómo trabajas y dónde aparecen los problemas.'],['Identificamos las fugas','Buscamos oportunidades perdidas, tareas innecesarias y costes evitables, y priorizamos por impacto.'],['Calculamos su impacto','Estimamos cuánto cuestan en tiempo, dinero y oportunidades para decidir qué solucionar primero.'],['Diseñamos e implementamos','Te presentamos un proyecto con el problema, la solución y su alcance. Si avanzas, lo construimos e integramos.'],['Medimos y mejoramos','Comparamos el proceso antes y después y buscamos nuevas mejoras.']].map((s,i)=>`<div><b>${i+1}</b><h4>${s[0]}</h4><p>${s[1]}</p></div>`).join('');
$('#sec').innerHTML=[['s1','Barbería','Puede perder reservas por no contestar llamadas.'],['s2','Empresa de servicios','Puede perder ventas por no seguir sus presupuestos.'],['s3','Tienda','Puede perder clientes por no gestionar sus consultas.'],['s4','Distribución','Puede perder horas procesando pedidos y facturas a mano.'],['s5','Consultora','Puede tener problemas para controlar proyectos y cobrar a tiempo.']].map(s=>`<figure><img src="assets/img/${s[0]}.webp" alt="${s[1]}" loading="lazy" width="1408" height="768"><figcaption><b>${s[1]}</b>${s[2]}</figcaption></figure>`).join('');
$('#f').onsubmit=async e=>{e.preventDefault();const f=e.target,g=n=>f.elements[n].value.trim(),st=$('#st');if(g('hp'))return;st.textContent='Enviando…';
const m=[g('m'),$('#cs').dataset.on?sum:''].filter(Boolean).join(' | ')+' (origen: web principal)';
try{const r=await fetch(U+'/rest/v1/leads',{method:'POST',headers:{'Content-Type':'application/json',apikey:K,Authorization:'Bearer '+K,Prefer:'return=minimal'},body:JSON.stringify({full_name:g('n'),company:g('c'),email:g('e'),phone:g('p'),website:g('w'),interest:g('i'),comments:m.slice(0,1900)})});if(!r.ok)throw 0;st.textContent='Gracias. Te contactaremos en breve.';f.reset()}catch(_){st.textContent='No se pudo enviar. Inténtalo de nuevo o escríbenos por email.'}};
{const hv=$('#hv'),mob=matchMedia('(max-width:700px)').matches,n='hero-es'+(mob?'-m':'');hv.poster='assets/img/'+n+'.jpg';hv.hidden=false;if(!matchMedia('(prefers-reduced-motion:reduce)').matches){hv.src='assets/video/'+n+'.mp4';hv.play().catch(()=>{})}}
// Mobile navigation
const nav = document.querySelector('nav');
const menuButton = document.getElementById('mnav');

if (nav && menuButton) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('.navlinks a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}
