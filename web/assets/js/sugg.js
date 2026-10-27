/* Sugerencias del buscador: misma lógica y datos que «Buscar servicio» (P07) de la plataforma. */
(function(){
var D=window.CUIDA_SUG;if(!D)return;
var PLAT='../plataforma/',KEY='cuidapp:go';
var norm=function(t){return String(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()};
var exN=function(t){return norm(t).replace(/\bvit\.?\s*(?=[a-z0-9])/g,'vitamina ').replace(/\bfe\b/g,'hierro').replace(/\s+/g,' ').trim()};
var esc=function(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
/* plural tolerante: «inyecciones» encuentra «inyección» */
var vars=function(w){var v=[w];if(w.length>4){if(/ciones$/.test(w))v.push(w.slice(0,-2));if(/es$/.test(w))v.push(w.slice(0,-2));if(/s$/.test(w))v.push(w.slice(0,-1))}return v};
var hl=function(t,q){var n=norm(t),w=norm(q).trim().split(/\s+/)[0]||'',i=-1,l=0;vars(w).some(function(x){i=n.indexOf(x);l=x.length;return i>=0});return i<0?esc(t):esc(t.slice(0,i))+'<b>'+esc(t.slice(i,i+l))+'</b>'+esc(t.slice(i+l))};
var ICON={svc:'\uD83D\uDC89',plan:'\uD83E\uDDD1\u200D\u2695\uFE0F',soon:'\uD83D\uDD14',ex:'\uD83E\uDDEA',med:'\uD83D\uDC8A'};
function find(q){
  var t=exN(q).split(' ').filter(Boolean);if(!t.length)return[];
  var ph=t.some(function(w){return w.length<3})?t.join(' '):'';
  var has=function(s,w){return vars(w).some(function(x){return s.indexOf(x)>=0})};
  var ok=function(s){return t.every(function(w){return has(s,w)})&&(!ph||(' '+s+' ').indexOf(' '+ph+' ')>=0)};
  var out=[],i,x;
  var sv=D.sug.filter(function(x){return ok(exN(x[0]+' '+x[2]))}).filter(function(x,i,l){return l.findIndex(function(y){return y[1]===x[1]})===i}).slice(0,6);
  if(sv.length){out.push({h:'Servicios'});sv.forEach(function(x){out.push({ic:ICON[x[3]==='svc'?'svc':x[3]],a:hl(x[0],q),b:esc(x[5]),go:{act:x[3]==='svc'?'svc':x[3],arg:x[3]==='plan'?'':x[1],go:x[3]==='svc'?x[4]:''}})})}
  var ex=[];
  D.ex.forEach(function(r){var s=r[3]+' '+r[4];if(ok(s))ex.push([r,vars(t[0]).some(function(x){return r[3].indexOf(x)===0})?0:t.every(function(w){return has(r[3],w)})?1:2])});
  ex.sort(function(a,b){return a[1]-b[1]||a[0][1].length-b[0][1].length});
  if(ex.length){out.push({h:'Exámenes de laboratorio'});ex.slice(0,4).forEach(function(e){var r=e[0];out.push({ic:ICON.ex,a:hl(r[1],q),b:esc(r[2]),go:{act:'exAdd',arg:r[0],go:'P40'}})})}
  if(/medic|farma|remedi|pastill|receta/.test(norm(q))){out.push({h:'Muy pronto'});out.push({ic:ICON.med,a:'Medicamentos',b:'Con tu receta, despacho a domicilio · Muy pronto',go:{go:'P46'}})}
  var ps=D.pr.filter(function(p){return p[9].indexOf(norm(q))>=0});
  if(ps.length){out.push({h:'Profesionales'});ps.slice(0,3).forEach(function(p){out.push({av:p,a:hl(p[1],q),b:esc(p[2])+' · \u2605 '+esc(p[3])+' ('+p[4]+')',go:{act:'pick',arg:p[0]+'|',go:'P12'}})})}
  return out;
}
function jump(o){try{sessionStorage.setItem(KEY,JSON.stringify(o||{}))}catch(e){}location.href=PLAT}
function attach(input){
  var form=input.closest('form'),box=document.createElement('div'),items=[],act=-1,open=false;
  box.className='sgg';box.setAttribute('role','listbox');box.hidden=true;form.appendChild(box);
  input.setAttribute('role','combobox');input.setAttribute('aria-expanded','false');input.setAttribute('aria-autocomplete','list');
  function close(){box.hidden=true;open=false;act=-1;input.setAttribute('aria-expanded','false')}
  function mark(){var els=box.querySelectorAll('.srow');els.forEach(function(e,i){e.classList.toggle('on',i===act);e.setAttribute('aria-selected',i===act)});if(els[act])els[act].scrollIntoView({block:'nearest'})}
  function draw(){
    var q=input.value.trim();if(!q){close();return}
    var r=find(q);items=r.filter(function(x){return !x.h});
    var h='',n=0;
    if(!items.length){h='<div class="empty"><b>No encontramos «'+esc(q)+'»</b><span>Prueba con otra palabra o mira todos los servicios.</span></div>'}
    r.forEach(function(x){if(x.h){h+='<div class="lbl2">'+x.h+'</div>';return}
      var si=x.av?'<span class="si av" style="background:'+x.av[6]+';color:'+x.av[7]+'">'+esc(x.av[5])+'</span>':'<span class="si">'+x.ic+'</span>';
      h+='<button type="button" class="srow" role="option" data-i="'+(n++)+'">'+si+'<span class="tx"><span class="a">'+x.a+'</span><span class="b">'+x.b+'</span></span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'});
    box.innerHTML=h;box.style.top=(input.offsetTop+input.offsetHeight+8)+'px';box.hidden=false;open=true;act=-1;input.setAttribute('aria-expanded','true');
  }
  input.addEventListener('input',draw);
  input.addEventListener('focus',function(){if(input.value.trim())draw()});
  input.addEventListener('keydown',function(e){
    if(e.key==='Escape'){close();return}
    if(!open||!items.length)return;
    if(e.key==='ArrowDown'){e.preventDefault();act=(act+1)%items.length;mark()}
    else if(e.key==='ArrowUp'){e.preventDefault();act=act<=0?items.length-1:act-1;mark()}
  });
  box.addEventListener('mousedown',function(e){e.preventDefault()});
  box.addEventListener('click',function(e){var b=e.target.closest('.srow');if(b)jump(items[+b.dataset.i].go)});
  form.addEventListener('submit',function(e){e.preventDefault();var q=input.value.trim();
    if(open&&items.length)return jump(items[Math.max(act,0)].go);
    jump(q?{q:q}:null)});
  document.addEventListener('click',function(e){if(!form.contains(e.target))close()});
}
['nq','q'].forEach(function(id){var i=document.getElementById(id);if(i)attach(i)});
})();
