const U='https://wiavnyuchdsfztzhvaua.supabase.co',K='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpYXZueXVjaGRzZnp0emh2YXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMDI2ODQsImV4cCI6MjA4NjU3ODY4NH0.dXz7vyFglA_lihma__rbtBT8afZZ1YUJEkAmqpFOL6c';
const $=s=>document.querySelector(s),eur=n=>new Intl.NumberFormat('en-IE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
const P=[['p1','You\'re getting opportunities your business isn\'t making the most of.','A customer calls and nobody answers. Someone writes on WhatsApp and gets a reply too late. You send a quote and never follow up.','We organise your enquiries in a single system, give customers a first response, spot opportunities and automate follow-up on quotes.','Make better use of the opportunities that already reach your business.'],
['p2','Your customers already know you. But are they still in touch with your business?','You have a customer base, but you don\'t know who hasn\'t been back for months or who might need your services again.','We identify inactive customers, organise their history and set up reminders and personalised communication.','Make better use of the relationships you\'ve already built.'],
['p3','You\'ve sold the service, but you haven\'t been paid yet.','Pending invoices, manual reminders and hours spent checking who owes you money.','We automate due-date alerts, invoice follow-up and late-payment notifications.','Cut administrative work and keep better control of your payments.'],
['p4','Your team loses hours doing the same thing over and over.','Copying information, checking emails, preparing documents and moving data between programs.','We connect your tools, automate administrative tasks and process documents.','Free up time for higher-value work.'],
['p5','You have staff and resources, but you don\'t always use their capacity.','Cancelled appointments, no-shows and disorganised calendars.','We improve appointment management, automate confirmations and reminders, and coordinate calendars.','Make better use of the capacity your business already has.'],
['p6','You sell and you work, but you don\'t know what really makes you money.','Not every customer or service is equally profitable, and you don\'t always know what a job really costs.','We centralise sales and costs, analyse margins and identify what is least profitable.','Decide with clearer information about your profitability.']];
$('#pr').innerHTML=P.map(p=>`<div class="pr"><img src="../assets/img/${p[0]}.webp" alt="" loading="lazy" width="1280" height="720"><div><h3>${p[1]}</h3><p class="m">${p[2]}</p><h4>What can we do?</h4><p>${p[3]}</p><p class="g">The goal: ${p[4].charAt(0).toLowerCase()+p[4].slice(1)}</p></div></div>`).join('');
const C=[['Unanswered calls and messages','Customers who write or call and get no reply.',['Unanswered per week',8],['Would have bought (%)',40],['Average sale (€)',30],(a,b,c)=>a*4.33*b/100*c,'Potential sales not captured per month'],
['Quotes with no follow-up','Quotes sent that nobody picks up again.',['Not followed up per month',10],['Would have accepted (%)',20],['Average value (€)',400],(a,b,c)=>a*b/100*c,'Potentially unconverted quotes per month'],
['Appointments nobody shows up for','Slots lost because the customer doesn\'t show.',['No-shows per month',12],['Recoverable (%)',50],['Price per appointment (€)',25],(a,b,c)=>a*b/100*c,'Capacity that could be recovered per month'],
['Repetitive work','Your hours spent on tasks a machine can do.',['Hours per week',6],['Automatable (%)',60],['Cost of your hour (€)',15],(a,b,c)=>a*4.33*b/100*c,'Estimated cost of automatable time per month']];
$('#cal').innerHTML=C.map((c,i)=>`<div class="c"><h4>${c[0]}</h4><p>${c[1]}</p>${[2,3,4].map(j=>`<label>${c[j][0]}<input type="number" min="0" inputmode="decimal" value="${c[j][1]}" data-i="${i}"></label>`).join('')}<b id="r${i}"></b><small>${c[6]}</small></div>`).join('');
let tm=0,sum='';const rd=()=>{const v=[...document.querySelectorAll('#cal .c')].map((el,i)=>{const n=[...el.querySelectorAll('input')].map(x=>Math.max(0,+x.value||0));return C[i][5](...n)});
v.forEach((x,i)=>$('#r'+i).textContent=eur(x));const t=v.reduce((a,b)=>a+b,0);const a=tm,s=performance.now();tm=t;
const step=n=>{const k=Math.min(1,(n-s)/400),e=a+(t-a)*(1-Math.pow(1-k,3));$('#tm').textContent=eur(e);$('#ty').textContent=eur(e*12);if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step);
sum='Calculators (estimate): '+C.map((c,i)=>c[0]+' '+eur(v[i])+'/month').join('; ')+'. Total '+eur(t)+'/month, '+eur(t*12)+'/year.'};
$('#cal').addEventListener('input',rd);rd();
document.querySelector('[data-calc]').addEventListener('click',()=>{$('#cs').textContent='We will include your calculator results with your enquiry.';$('#cs').dataset.on=1});
const D=[['A customer asks for a quote','Which service the customer is asking for','Measurements, deadline and contact details','Records the opportunity and schedules the sales follow-up','No quote goes unanswered'],
['You receive a supplier invoice','That it is a supplier invoice','Amount, date, supplier and number','Extracts the data and checks for possible duplicates','Information ready for your accounting software'],
['A customer wants to change an appointment','That they want to move their appointment','Calendar availability','Offers alternatives and updates the calendar once confirmed','An up-to-date calendar without crossed calls'],
['A customer hasn\'t been back in months','Which customers have been inactive for a while','Customer history','Prepares personalised messages to win back contact','Contact recovered with customers you already know'],
['You want to know which service is most profitable','That you want to compare margins','Sales and costs per service','Calculates margins and compares services','A comparison of your most profitable services']];
let di=0;const T=['What the system understands','What information it needs','What actions it can take','Possible operational result'];
$('#tabs').innerHTML=D.map((d,i)=>`<button aria-pressed="${i==0}" data-i="${i}">${d[0]}</button>`).join('');
const show=()=>{$('#out').innerHTML=D[di].slice(1).map((t,i)=>`<div style="animation-delay:${i*.12}s"><h5>${T[i]}</h5>${t}</div>`).join('')};
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;di=+b.dataset.i;[...$('#tabs').children].forEach(x=>x.setAttribute('aria-pressed',x==b));show()});show();
$('#map').innerHTML=[['We understand your business','We analyse how you win customers, how you work and where problems appear.'],['We identify the leaks','We look for lost opportunities, unnecessary tasks and avoidable costs, and prioritise by impact.'],['We calculate the impact','We estimate what they cost in time, money and opportunities to decide what to fix first.'],['We design and implement','We present a project with the problem, the solution and its scope. If you go ahead, we build and integrate it.'],['We measure and improve','We compare the process before and after and look for further improvements.']].map((s,i)=>`<div><b>${i+1}</b><h4>${s[0]}</h4><p>${s[1]}</p></div>`).join('');
$('#sec').innerHTML=[['s1','Barbershop','May lose bookings by not answering calls.'],['s2','Service company','May lose sales by not following up on quotes.'],['s3','Shop','May lose customers by not handling their enquiries.'],['s4','Distribution','May lose hours processing orders and invoices by hand.'],['s5','Consultancy','May struggle to control projects and get paid on time.']].map(s=>`<figure><img src="../assets/img/${s[0]}.webp" alt="${s[1]}" loading="lazy" width="1408" height="768"><figcaption><b>${s[1]}</b>${s[2]}</figcaption></figure>`).join('');
$('#f').onsubmit=async e=>{e.preventDefault();const f=e.target,g=n=>f.elements[n].value.trim(),st=$('#st');if(g('hp'))return;st.textContent='Sending…';
const m=[g('m'),$('#cs').dataset.on?sum:''].filter(Boolean).join(' | ')+' (origin: main website EN)';
try{const r=await fetch(U+'/rest/v1/leads',{method:'POST',headers:{'Content-Type':'application/json',apikey:K,Authorization:'Bearer '+K,Prefer:'return=minimal'},body:JSON.stringify({full_name:g('n'),company:g('c'),email:g('e'),phone:g('p'),website:g('w'),interest:g('i'),comments:m.slice(0,1900)})});if(!r.ok)throw 0;st.textContent='Thank you. We will be in touch shortly.';f.reset()}catch(_){st.textContent='Could not send. Please try again or email us.'}};
{const hv=$('#hv'),mob=matchMedia('(max-width:700px)').matches,n='hero-en'+(mob?'-m':'');hv.poster='../assets/img/'+n+'.jpg';hv.hidden=false;if(!matchMedia('(prefers-reduced-motion:reduce)').matches){hv.src='../assets/video/'+n+'.mp4';hv.play().catch(()=>{})}}
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
