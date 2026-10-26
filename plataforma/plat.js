/* ===== Cuidapp · plataforma web =====
   Usa las mismas pantallas, datos y reglas del prototipo (app.js, pac.js, pro.js…)
   y las presenta como una web real: navegación superior en escritorio, columnas,
   resumen fijo al reservar y pagar, URL propia por pantalla y versión móvil a pantalla completa. */
const PLAT_BP = 900;
const platNarrow = () => window.innerWidth < PLAT_BP;
const PLAT_URL = location.pathname + location.search;
let platDepth = 0, platPop = false;

/* sin barra del prototipo ni escalado */
bar = function () { };
updateBar = function () { };
fit = function () { };

/* ---------- navegación ---------- */
const NAV_GRP = {
  examenes: ['P40', 'P16', 'P60', 'P61', 'P62', 'P63', 'P74', 'P75', 'P83', 'P84', 'P85', 'P86', 'P87', 'P88'],
  salud: ['P93', 'P42', 'P50', 'P51', 'P52', 'P53', 'P54', 'P55', 'P56', 'P57', 'P58', 'P59', 'P70', 'P71', 'P72', 'P73', 'P76', 'P77'],
  reembolsos: ['P78', 'P79', 'P80', 'P81', 'P82', 'P64', 'P65'],
  isapre: ['P89', 'P90', 'P91', 'P92'],
  citas: ['P26', 'P27', 'P30', 'P19', 'P20', 'P22', 'P23', 'P24', 'P25'],
  servicios: ['W01', 'W02', 'W03', 'P06', 'P07', 'P33', 'P37', 'P46', 'P10', 'P11', 'P36', 'P12', 'P32', 'P13', 'P14', 'P15', 'P17', 'P18', 'P45', 'P66', 'P67'],
  inicio: ['R16', 'R17', 'R30', 'R18', 'R20', 'R21', 'R22', 'R42', 'R37', 'R38', 'R31', 'R32', 'R33', 'R34', 'R35', 'R39', 'R36', 'R40', 'R41'],
  agenda: ['R24', 'R14', 'R15'],
  ganancias: ['R23'],
  perfil: ['R25', 'R27', 'R28', 'R29', 'R11', 'R12', 'R13', 'R43', 'R44', 'R10', 'R26'],
  solicitudes: ['Q03', 'Q04', 'Q05'], plan: ['Q02'],
};
const navOn = s => s.tab || s.dtab || Object.keys(NAV_GRP).find(k => NAV_GRP[k].includes(s.id)) || '';
const tabP = k => (tabsP.find(t => t[0] === k) || [])[3];
function navItems(r) {
  if (r === 'pro') return [...tabsR.map(t => [t[1], t[2], t[3], t[0]]), ['star', 'Destacado', SC.R44 ? 'R44' : 'R25', 'dest', 1]];
  if (r === 'ase') return [['tray', 'Solicitudes', 'Q03', 'solicitudes'], ['crown-simple', 'Mi plan', 'Q02', 'plan']];
  const it = [['magnifying-glass', 'Servicios', 'W01', 'servicios'], ['test-tube', 'Exámenes', 'P40', 'examenes']];
  if (tabP('salud')) it.push(['heartbeat', 'Mi salud', tabP('salud'), 'salud']);
  it.push(['calendar-blank', 'Mis citas', tabP('citas') || 'P26', 'citas'], ['receipt', 'Reembolsos', 'P80', 'reembolsos', 1], ['shield-check', 'Cotiza tu Isapre', 'P89', 'isapre', 1]);
  return it;
}
function menuItems(r) {
  if (r === 'pro') return [['storefront', 'Mi perfil público', 'R29'], ['list-checks', 'Servicios y precios', 'R11'], ['clock', 'Horario semanal', 'R14'], ['moon-stars', 'Recargos', 'R43'], SC.R44 && ['star', 'Destacar mi perfil', 'R44'], ['chat-centered-text', 'Mis reseñas', 'R27'], '-', ['user-switch', 'Ir a la web de pacientes', 'W01'], ['briefcase', 'Panel de administración', 'A01'], ['sign-out', 'Cerrar sesión', 'R01']].filter(Boolean);
  if (r === 'ase') return [['user-switch', 'Ir a la web de pacientes', 'W01'], ['sign-out', 'Cerrar sesión', 'Q01']];
  return [['user-circle', 'Mi cuenta', tabP('cuenta') || 'P28'], ['heart', 'Favoritos', tabP('favoritos') || 'P34'], ['users', 'Pacientes guardados', 'P29'], ['receipt', 'Reembolsos', 'P80', 1], ['shield-check', 'Cotiza tu Isapre', 'P89', 1], ['package', 'Packs de exámenes', 'P74'], '-', ['first-aid-kit', 'Soy profesional de la salud', 'R16'], ['identification-badge', 'Soy asesor de Isapre', 'Q03'], ['briefcase', 'Panel de administración', 'A01'], ['sign-out', 'Cerrar sesión', 'P01']].filter(x => x === '-' || SC[x[2]]);
}
headerD = function (s) {
  const r = roleOf(s.id), on = navOn(s);
  const nav = s.noNav ? '' : `<nav>${navItems(r).filter(t => SC[resolve(t[2])]).map(t => `<button class="${t[3] === on ? 'on' : ''} ${t[4] ? 'sec' : ''}" data-go="${t[2]}">${ic(t[0], t[3] === on)}<span>${t[1]}</span></button>`).join('')}</nav>`;
  const me = r === 'pro' ? ['CR', 'Camila'] : r === 'ase' ? ['FL', 'Asesor'] : ['DF', 'Daniela'];
  const sw = r === 'pac' ? `<button class="plink" data-go="R16">Para profesionales</button>` : `<button class="plink" data-go="W01">Web de pacientes</button>`;
  const menu = `<div class="pmenu" role="menu">${menuItems(r).map(m => m === '-' ? '<hr>' : `<button class="${m[3] ? 'sec' : ''}" data-go="${m[2]}">${ic(m[0])}${m[1]}</button>`).join('')}</div>`;
  return `<header class="dh pdh"><button class="plogo" data-go="${r === 'pro' ? 'R16' : r === 'ase' ? 'Q03' : 'W01'}" aria-label="Inicio">${logoImg('horizontal-nm', 30)}</button>${r === 'pro' ? '<span class="tag">Profesionales</span>' : r === 'ase' ? '<span class="tag">Asesores</span>' : ''}
  ${nav}<span class="sp"></span>${s.noNav ? '' : `${sw}<button class="ib pbell" data-act="toast" data-arg="No tienes notificaciones nuevas." aria-label="Notificaciones">${ic('bell')}</button>
  <div class="pme-w"><button class="me pme" data-pm="1" aria-haspopup="menu">${av(me[0], 's')}<span>${me[1]}</span>${ic('caret-down')}</button>${menu}</div>`}</header>`;
};

/* ---------- resumen fijo (reserva, exámenes) ---------- */
const BOOK = ['P14', 'P15', 'P17', 'P18', 'P29', 'P64'];
const EXS = ['P40', 'P16', 'P62', 'P63'];
function sumBook(id) {
  const p = PRO(); if (!p || !S.item || !CAT[S.item]) return '';
  const pr = price();
  const lines = id === 'P17' ? '' : `<div class="ps-lines">${pr.L.map(l => `<div class="${l[1] < 0 ? 'neg' : ''}"><span>${l[0]}</span><span class="num">${l[1] < 0 ? '−' + clp(-l[1]) : clp(l[1])}</span></div>`).join('')}</div>`;
  return `<div class="ps-h">${pav(p, '', true)}<div><b>${p.n}</b><div class="sm t2">${p.t} · ${rate(p)}</div></div></div>
  <div class="ps-svc"><span class="si">${i3(S.item)}</span><div><b>${CAT[S.item].n}</b><div class="sm t2">${whenTxt()}</div></div></div>
  <div class="ps-r">${ic('map-pin')}<span>${P().full}</span></div><div class="ps-r">${ic('user')}<span>${whoTxt()}</span></div>${lines}
  <div class="ps-tot"><span>Total</span><b class="num">${clp(pr.total)}</b></div>`;
}
function sumEx() {
  const l = examList(); if (!l.length) return `<div class="ps-empty">${i3('mue')}<b>Tus exámenes</b><span class="sm t2">Elige exámenes o un pack y aquí verás el total.</span></div>`;
  return `<div class="ps-t">Tus exámenes <span class="t2">· ${l.length}</span></div><div class="ps-lines">${l.slice(0, 8).map(e => `<div><span>${e[0]}</span><span class="num">${clp(e[1])}</span></div>`).join('')}${l.length > 8 ? `<div class="t2"><span>y ${l.length - 8} más</span><span></span></div>` : ''}</div>
  <div class="ps-tot"><span>Exámenes</span><b class="num">${clp(examSum())}</b></div><div class="xs t2 mt4">Precio del laboratorio. La toma a domicilio se suma al elegir profesional${examSum() >= 30000 ? ' y es gratis sobre $30.000' : ''}.</div>`;
}
function safeH(f) { try { return f ? f() : ''; } catch (e) { return ''; } }
const proSide = () => { const cr = PRO('cr'), d = typeof isDest === 'function' && cr && isDest(cr);
  return `<div class="psum pro-side"><div class="ps-t">Esta semana</div><div class="pp-big num">${clp(S.earn)}</div><div class="pp-st"><div><b class="num">${S.done}</b><span>atenciones</span></div><div><b class="num">${cr ? String(cr.r).replace('.', ',') : '4,9'}</b><span>nota</span></div><div><b class="num">${cr ? cr.rv : ''}</b><span>reseñas</span></div></div>
  <button class="btn sec" data-go="R23">${ic('wallet')}Ver ganancias</button></div>
  ${SC.R44 ? `<button class="pp-dest" data-go="R44"><span class="pp-di">${ic('star', 1)}</span><span><b>${d ? 'Tu perfil está Destacado' : 'Destaca tu perfil'}</b><span class="sm t2">${d ? 'Apareces primero en las búsquedas.' : 'Aparece primero en las búsquedas con la etiqueta Destacado.'}</span></span>${ic('caret-right')}</button>` : ''}
  <div class="pp-links">${[['moon-stars', 'Recargos por hora y día', 'R43'], ['clock', 'Horario semanal', 'R14'], ['list-checks', 'Servicios y precios', 'R11'], ['storefront', 'Mi perfil público', 'R29']].filter(x => SC[x[2]]).map(x => `<button data-go="${x[2]}">${ic(x[0])}<span>${x[1]}</span>${ic('caret-right')}</button>`).join('')}</div>`; };
function platS(s) {
  if (s.kind === 'page' && !s.aside && roleOf(s.id) === 'pro' && s.tab) { const o = Object.create(s); o.wide = true; o.asideCls = 'book psum-w'; o.aside = proSide; return o; }
  if (s.kind !== 'page' || s.aside) return s;
  const bk = BOOK.includes(s.id) && S.item && CAT[S.item], ex = EXS.includes(s.id);
  const ft = safeH(s.foot), bar = /fbar/.test(ft);
  if (!bk && !ex && !bar) return s;
  const o = Object.create(s);
  o.wide = true; o.asideCls = 'book psum-w';
  o.aside = () => `<div class="psum">${bk ? sumBook(s.id) : ex ? sumEx() : ''}${ft ? `<div class="psum-f ${bk || ex ? '' : 'solo'}">${ft}</div>` : ''}<div class="ps-safe">${ic('lock-simple')}<span>Pago seguro con Mercado Pago. Se cobra al terminar la atención.</span></div></div>`;
  o.foot = null;
  return o;
}

/* ---------- ir a una pantalla (con historial del navegador) ---------- */
go = function (id, push = true, isBack = false) {
  platMenu(false);
  if (id === 'back') {
    if (platDepth > 0 && history.state && history.state.plat) { history.back(); return; }
    const p = stack.pop(); cur = null; navDir = 'b';
    return go(p || (roleOf(lastId || 'W01') === 'pro' ? 'R16' : 'W01'), false, true);
  }
  view = roleOf(id) === 'adm' ? 'd' : platNarrow() ? 'm' : 'd';
  if (!isBack) { const a = SC[cur], b = SC[resolve(id)]; navDir = a && b && (a.tab || a.dtab) && (b.tab || b.dtab) && !b.back ? 'fade' : 'f'; }
  S.sheet = '';
  id = resolve(id);
  if (!SC[id]) { console.error('pantalla inexistente', id); return; }
  const prev = cur;
  if (push && cur && cur !== id) stack.push(cur);
  cur = id;
  const url = PLAT_URL + '#/' + id;
  if (push && prev && prev !== id && !platPop) history.pushState({ plat: 1, d: ++platDepth }, '', url);
  else history.replaceState({ plat: 1, d: platDepth }, '', url);
  render();
};
window.addEventListener('popstate', e => {
  const x = location.hash.replace('#/', ''); if (!SC[x]) return;
  platDepth = (e.state && e.state.d) || 0;
  const i = stack.lastIndexOf(x); if (i >= 0) stack.length = i;
  platPop = true; navDir = 'b'; cur = null; go(x, false, true); platPop = false;
});

/* ---------- render ---------- */
const SCROLLERS = '.dpage,.dfree,.acont,.dpanel .body,.scr > .body,.wfil';
render = function () {
  clearT();
  const s = SC[cur], stage = $('#stage'), same = cur === lastId;
  const keep = same ? [...stage.querySelectorAll(SCROLLERS)].map(e => e.scrollTop) : null;
  document.body.classList.toggle('pm', view === 'm');
  document.body.classList.toggle('pd', view === 'd');
  const html = view === 'm' ? `<div class="phone">${frameM(s)}</div>` : frameD(platS(s));
  stage.innerHTML = `<div class="scaler">${html}</div>`;
  const scr = stage.querySelector('.phone,.desk');
  if (keep) stage.querySelectorAll(SCROLLERS).forEach((e, i) => { if (keep[i]) e.scrollTop = keep[i]; });
  if (toastMsg) {
    const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = ic('check-circle', 1) + `<span>${toastMsg}</span>`;
    scr.appendChild(t); toastMsg = null; clearTimeout(toastT); toastT = setTimeout(() => t.remove(), 2600);
  }
  if (!same) { const el = stage.querySelector('.scr,.dpage,.dmain,.dfree,.acont'); if (el) el.classList.add('a-' + navDir); lastId = cur; }
  if (s.auto) { const a = document.createElement('button'); a.className = 'pauto'; a.dataset.auto = '1'; a.innerHTML = `<span>Demostración</span>${ic('fast-forward', 1)}${AUTO_L[cur] || 'Simular siguiente paso'}`; scr.appendChild(a); }
  if (s.map) { const el = stage.querySelector('[data-map]'); if (el) mkMap(el, s.map()); }
  if (s.enter) s.enter();
  platReveal(stage);
  document.title = `${(s.dtitle || s.title || s.name || '').replace(/<[^>]+>/g, '') || 'Inicio'} · Cuidapp`;
  window.__rendered = (window.__rendered || 0) + 1;
};
/* aparición suave de tarjetas al entrar en pantalla */
let platIO = null;
function platReveal(root) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  if (platIO) platIO.disconnect();
  platIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); platIO.unobserve(e.target); } }), { threshold: .08 });
  root.querySelectorAll('.rv').forEach(el => platIO.observe(el));
}
/* encabezado con sombra al hacer scroll */
document.addEventListener('scroll', e => {
  const t = e.target; if (!(t instanceof Element) || !t.matches('.dpage,.dfree,.acont')) return;
  const d = t.closest('.desk'); if (d) d.classList.toggle('scrolled', t.scrollTop > 4);
}, true);

/* pasos que en la vida real dependen de otra persona (confirmación, término de la atención…) */
const AUTO_L = { P19: 'Simular: la profesional confirma', P23: 'Simular: termina la atención', P61: 'Simular: orden revisada', R08: 'Simular: cuenta aprobada', R17: 'Simular: aceptar solicitud', R20: 'Simular: checklist completo', R40: 'Simular: terminar dictado' };
document.addEventListener('click', e => {
  if (!e.target.closest('[data-auto]')) return; const s = SC[cur]; if (!s || !s.auto) return;
  if (s.autoAct) s.autoAct(); go(typeof s.auto === 'function' ? s.auto() : s.auto);
});
/* menú de usuario */
function platMenu(open) { const w = document.querySelector('.pme-w'); if (w) w.classList.toggle('open', open === undefined ? !w.classList.contains('open') : open); }
document.addEventListener('click', e => {
  if (e.target.closest('[data-pm]')) { platMenu(); return; }
  if (!e.target.closest('.pmenu')) platMenu(false);
}, true);
document.addEventListener('keydown', e => { if (e.key === 'Escape') { platMenu(false); if (S.sheet) { S.sheet = ''; render(); } } });

/* cambia entre escritorio y móvil al redimensionar */
let platRT = null;
window.addEventListener('resize', () => {
  clearTimeout(platRT); platRT = setTimeout(() => {
    if (!cur) return; const v = roleOf(cur) === 'adm' ? 'd' : platNarrow() ? 'm' : 'd';
    if (v !== view) { view = v; const id = resolve(cur); cur = null; lastId = null; go(id, false); }
  }, 120);
});

/* ---------- inicio de la web de pacientes (escritorio) ---------- */
const W01base = SC.W01.body;
const platHome = () => {
  const cr = PRO('cr') || PROS[0], pi = priceOf(cr, 'iny') || priceOf(cr, '');
  const tiles = [['P40', 'mue', 'Exámenes y packs', 'Toma de muestra en tu casa o en el laboratorio más cerca.'], [tabP('salud') || 'P50', 'sig', 'Mi salud', 'Resultados, controles y ficha de toda tu familia.'], ['P80', 'cron', 'Reembolsos', 'Vincula tu Isapre y gestionamos el reembolso por ti.'], ['P89', 'pd', 'Cotiza tu Isapre', 'Asesores comparan planes para ti, sin costo.']].filter(t => SC[t[0]]);
  return `<section class="px-hero"><div class="px-in">
   <div class="px-l">
    <button class="px-loc" data-act="set" data-arg="addrNext=W01" data-go="P08">${ic('map-pin', 1)}Atención a domicilio en <b>${P().n}, ${P().c}</b>${ic('caret-down')}</button>
    <h1 class="px-h1">Salud a domicilio,<br><span>con precio y reseñas a la vista.</span></h1>
    <p class="px-sub">Enfermeras y TENS verificadas en la Superintendencia de Salud. Compara, agenda y paga al terminar la atención.</p>
    <div class="px-prof" role="tablist" aria-label="Buscar por profesional">${(typeof PROFS !== 'undefined' ? PROFS : []).slice(0, 7).map(f => f.on ? `<button class="on ${S.f && S.f[f.k] && !Object.keys(S.f).some(k => k !== f.k && S.f[k]) ? 'sel' : ''}" data-act="profGo" data-arg="${f.k}" data-go="W02">${ic(f.i)}${f.n}</button>` : `<button class="soon" data-act="profAv" data-arg="${f.k}">${ic(f.i)}${f.n}<em>${S.profAv && S.profAv[f.k] ? 'Te avisamos' : 'Muy pronto'}</em></button>`).join('')}</div>
    <div class="wsearch px-search"><button class="ws-f" data-act="set" data-arg="sheet=wsvc"><span class="xs t2">Servicio</span><b>${svcN(S.item)}</b></button><span class="ws-d"></span><button class="ws-f" data-act="set" data-arg="addrNext=W01" data-go="P08"><span class="xs t2">Dirección</span><b>${P().n}, ${P().c}</b></button><button class="btn ws-b" data-go="W02">${ic('magnifying-glass')}Buscar</button></div>
    <div class="chips px-chips">${['iny', 'vneu', 'vd', 'mue', 'cur', 'cuid'].filter(k => CAT[k]).map(k => `<button class="chip" data-act="${k === 'mue' ? 'svc' : 'svc'}" data-arg="${k}" data-go="${k === 'mue' ? 'P40' : 'W02'}">${k === 'mue' ? 'Exámenes de laboratorio' : k === 'iny' ? CAT[k].n : CAT[k].s}</button>`).join('')}</div>
   </div>
   <div class="px-r" aria-hidden="false">
    <div class="px-card" data-act="pick" data-arg="${cr.id}|" data-go="P12" role="button">
     <div class="px-ph"><img src="${phSrc(cr.i)}" alt="${cr.n}"><span class="px-dest">${ic('star', 1)}Destacado</span></div>
     <div class="px-cb"><div class="px-cn"><b>${cr.n}</b>${rate(cr)}</div><div class="sm t2">${cr.t} · registro SIS verificado</div>
      <div class="px-cp"><span class="sm">Inyección intramuscular</span><b class="num">${clp(pi)}</b></div>
      <div class="px-sl">${nextSlots(cr, 3).map(x => `<span>${dayShort(x[0])} ${x[1]}</span>`).join('')}</div></div>
    </div>
    <div class="px-n n1">${ic('navigation-arrow', 1)}<span><b>${first(cr)} va en camino</b><small>Llega aprox. 19:40</small></span></div>
    <div class="px-n n2"><span class="px-pc">−15%</span><span><b>CUIDA15</b><small>Primera atención, hasta $20.000</small></span></div>
    <div class="px-n n3">${ic('check-circle', 1)}<span><b>Reembolso pagado</b><small>Isapre Colmena · ${clp(12400)}</small></span></div>
   </div></div></section>
  <section class="px-sec"><div class="px-w"><div class="px-tiles">${tiles.map(t => `<button class="px-tile rv" data-go="${t[0]}"><span class="px-ti">${i3(t[1])}</span><b>${t[2]}</b><span class="sm t2">${t[3]}</span><span class="px-go">${ic('arrow-right')}</span></button>`).join('')}</div></div></section>
  <section class="px-sec"><div class="px-w"><div class="wprow rv">${Object.keys(PROMO).map(promoCard).join('')}</div></div></section>
  <section class="px-sec"><div class="px-w"><div class="shd"><h2 class="h-l">Explora por categoría</h2><button class="lk" data-go="P33">Ver todas</button></div><div class="wcats mt24 rv">${GK.map(k => { const [n, mn] = grpStats(k); return `<button class="wcat" data-act="grp" data-arg="${k}" data-go="${grpGo(k)}"><span class="ci">${i3(k)}</span><b>${GRP[k].n}</b><span class="sm t2">${GRP[k].l.length > 1 ? GRP[k].l.slice(0, 3).map(x => CAT[x].s).join(' · ') + (GRP[k].l.length > 3 ? ' y más' : '') : k === 'mue' ? 'Precio del laboratorio + toma' : nPro(n) + ' · desde ' + clp(mn)}</span></button>`; }).join('')}</div></div></section>
  <section class="px-sec"><div class="px-w"><div class="shd"><h2 class="h-l">Destacadas cerca de ti</h2><button class="lk" data-act="svc" data-arg="" data-go="W02">Ver todas</button></div><div class="wfeat mt24 rv">${featured().slice(0, 4).map(fcard).join('')}</div></div></section>
  ${typeof BLOG !== 'undefined' ? `<section class="px-sec"><div class="px-w"><div class="shd"><h2 class="h-l">Consejos</h2><button class="lk" data-go="P66">Ver blog</button></div><div class="px-blog mt24 rv">${BLOG.slice(0, 4).map(bcard).join('')}</div></div></section>` : ''}
  <section class="px-sec"><div class="px-w"><div class="px-how rv">${[['magnifying-glass', 'Busca', 'Por servicio o por profesional: enfermera o TENS.'], ['users-three', 'Compara', 'Precio con recargos a la vista, qué incluye y reseñas reales.'], ['calendar-check', 'Agenda', 'Elige día y hora. Se cobra solo al terminar la atención.'], ['receipt', 'Reembolsa', 'Si quieres, gestionamos tu reembolso con la Isapre.']].map((s, i) => `<div><span class="n num">0${i + 1}</span>${ic(s[0])}<b>${s[1]}</b><span class="t2 sm">${s[2]}</span></div>`).join('')}</div></div></section>
  ${platFooter()}`;
};
const platFooter = () => `<footer class="px-foot"><div class="px-w"><div class="px-fl">${logoImg('horizontal-nm', 26)}<span class="sm t2">Enfermeras y TENS a domicilio en Santiago.</span></div>
  <div class="px-fc"><b>Pacientes</b><button data-go="W02">Buscar profesional</button><button data-go="P40">Exámenes</button><button data-go="P80">Reembolsos</button><button data-go="P89">Cotiza tu Isapre</button></div>
  <div class="px-fc"><b>Profesionales</b><button data-go="R01">Postula como profesional</button><button data-go="R16">Ingresar</button>${SC.Q01 ? '<button data-go="Q01">Soy asesor de Isapre</button>' : ''}</div>
  <div class="px-fc"><b>Cuidapp</b><button data-go="P66">Blog · Consejos</button><button data-go="A01">Administración</button></div></div>
  <div class="px-w px-legal xs t3">Profesionales, precios y reseñas de ejemplo · Prototipo navegable.</div></footer>`;
SC.W01 = Object.assign(Object.create(SC.W01), { body: platHome });
SC.W01.id = 'W01';

/* cuenta: accesos a las otras partes de Cuidapp (útil sobre todo en móvil) */
if (SC.P28) { const b0 = SC.P28.body; SC.P28 = Object.assign(Object.create(SC.P28), { body: () => b0() + `<div class="lbl2 mt24">Otros accesos</div>${[['first-aid-kit', 'Soy profesional de la salud', 'Ir a mi panel', 'R16'], ['user-plus', 'Postula como profesional', 'Enfermeras y TENS', 'R01'], ['identification-badge', 'Soy asesor de Isapre', 'Solicitudes y planes', 'Q01'], ['briefcase', 'Administración', 'Solo equipo Cuidapp', 'A01']].filter(x => SC[x[3]]).map(x => row('box:' + x[0], x[1], x[2], x[3])).join('')}` }); }

/* ---------- arranque ---------- */
(function platInit() {
  document.body.classList.add('plat');
  const h = location.hash.replace('#/', '');
  view = platNarrow() ? 'm' : 'd';
  history.replaceState({ plat: 1, d: 0 }, '', PLAT_URL + location.hash);
  go(SC[h] ? h : (view === 'd' ? 'W01' : 'P06'), false);
  window.addEventListener('hashchange', () => { const x = location.hash.replace('#/', ''); if (SC[x] && x !== cur) go(x); });
})();

// Fix: «Rellenar 2749» guardaba el código como número y el checklist no aparecía (bug del prototipo base).
(() => { const _set = ACT.set; ACT.set = a => { _set(a); const k = a.slice(0, a.indexOf('=')); if (k === 'code') S.code = String(S.code); }; })();
