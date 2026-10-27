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
  servicios_ex: ['P40', 'P16', 'P60', 'P61', 'P62', 'P63', 'P74', 'P75', 'P83', 'P84', 'P85', 'P86', 'P87', 'P88'],
  salud: ['P93', 'P42', 'P50', 'P51', 'P52', 'P53', 'P54', 'P55', 'P56', 'P57', 'P58', 'P59', 'P70', 'P71', 'P72', 'P73', 'P76', 'P77'],
  cuenta: ['P28', 'P29', 'P04', 'P08', 'P09', 'P78', 'P79', 'P80', 'P81', 'P82', 'P64', 'P65', 'P95'],
  servicios_is: ['P89', 'P90', 'P91', 'P92'],
  citas: ['P26', 'P27', 'P30', 'P19', 'P20', 'P22', 'P23', 'P24', 'P25'],
  servicios: ['S00', 'S01', 'W01', 'W02', 'W03', 'P06', 'P07', 'P33', 'P37', 'P46', 'P10', 'P11', 'P36', 'P12', 'P32', 'P13', 'P14', 'P15', 'P17', 'P18', 'P45', 'P66', 'P67'],
  inicio: ['R16', 'R17', 'R30', 'R18', 'R20', 'R21', 'R22', 'R42', 'R37', 'R38', 'R31', 'R32', 'R33', 'R34', 'R35', 'R39', 'R36', 'R40', 'R41'],
  agenda: ['R24', 'R14', 'R15'],
  ganancias: ['R23', 'R46', 'R47'],
  perfil: ['R25', 'R27', 'R28', 'R29', 'R11', 'R12', 'R13', 'R43', 'R44', 'R10', 'R26', 'R48', 'R49'],
  solicitudes: ['Q03', 'Q04', 'Q05'], plan: ['Q02'],
};
const navOn = s => (s.tab || s.dtab || Object.keys(NAV_GRP).find(k => NAV_GRP[k].includes(s.id)) || '').split('_')[0];
/* mismas pestañas que la app (barra inferior), arriba en la web */
function navItems(r) {
  if (r === 'pro') return tabsR.map(t => [t[1], t[2], t[3], t[0]]);
  if (r === 'ase') return [['tray', 'Solicitudes', 'Q03', 'solicitudes'], ['crown-simple', 'Mi plan', 'Q02', 'plan']];
  return tabsP.map(t => [t[1], t[2], t[3], t[0]]);
}
headerD = function (s) {
  const r = roleOf(s.id), on = navOn(s);
  const nav = s.noNav ? '' : `<nav>${navItems(r).filter(t => SC[t[2]]).map(t => `<button class="${t[3] === on ? 'on' : ''}" data-go="${t[2]}">${ic(t[0], t[3] === on)}<span>${t[1]}</span></button>`).join('')}</nav>`;
  const srch = r === 'pac' && !s.noNav && s.id !== 'P07' ? `<button class="psearch" data-act="set" data-arg="scope=" data-go="P07" aria-label="Buscar">${ic('magnifying-glass')}<span>Inyección, vitaminas, exámenes…</span></button>` : '';
  /* inicio (P06): arriba logo completo y sin buscador (ya está el de la pantalla); al pasar el buscador, símbolo + buscador. Resto de pantallas: siempre símbolo + buscador */
  const cmp = s.id === 'P06' ? '' : ' cmp';
  return `<header class="dh pdh${cmp}"><button class="plogo" data-go="${r === 'pro' ? 'R16' : r === 'ase' ? 'Q03' : 'P06'}" aria-label="Inicio"><span class="lg-f">${logoImg('horizontal-nm', 30)}</span><span class="lg-s">${logoImg('simbolo-nm', 36)}</span></button>${r === 'pro' ? '<span class="tag">Profesionales</span>' : r === 'ase' ? '<span class="tag">Asesores</span>' : ''}<span class="psp">${srch}</span><span class="pnv">${nav}</span></header>`;
};

/* ---------- escritorio: el pie de la app (total + botón) pasa a una tarjeta fija a la derecha ---------- */
function safeH(f) { try { return f ? f() : ''; } catch (e) { return ''; } }
function platS(s) {
  if (s.kind === 'page' && s.top) { const t = s; s = Object.create(t); s.back = false; s.title = ''; s.dtitle = ''; s.top = null; s.body = () => `<div class="ptop">${t.top()}</div>${t.body()}`; }
  if (s.id === 'P06') { const o = Object.create(s); o.wide = true; o.home = true; return o; }
  if (s.kind !== 'page' || s.aside || s.tab) return s;
  const ft = safeH(s.foot);
  if (!/fbar/.test(ft)) return s;
  const o = Object.create(s);
  o.wide = true; o.asideCls = 'book psum-w';
  o.aside = () => `<div class="psum"><div class="psum-f solo">${s.foot()}</div></div>`;
  o.foot = null;
  return o;
}

/* ---------- ir a una pantalla (con historial del navegador) ---------- */
go = function (id, push = true, isBack = false) {
  if (id === 'back') {
    if (platDepth > 0 && history.state && history.state.plat) { history.back(); return; }
    const p = stack.pop(); cur = null; navDir = 'b';
    return go(p || (roleOf(lastId || 'P06') === 'pro' ? 'R16' : 'P06'), false, true);
  }
  view = roleOf(id) === 'adm' ? 'd' : platNarrow() ? 'm' : 'd';
  if (!isBack) { const a = SC[cur], b = SC[resolve(id)]; navDir = a && b && (a.tab || a.dtab) && (b.tab || b.dtab) && !b.back ? 'fade' : 'f'; }
  S.sheet = '';
  if (id === 'W01') id = 'P06';
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
  document.body.classList.toggle('phome', view === 'd' && cur === 'P06');
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
  platCmp();
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
  platCmp();
}, true);
/* P06: el encabezado se compacta cuando el buscador grande sale de la vista */
function platCmp() {
  if (cur !== 'P06') return;
  const h = document.querySelector('.pdh'), sb = document.querySelector('.dpage .hero .sbig'); if (!h || !sb) return;
  h.classList.toggle('cmp', sb.getBoundingClientRect().bottom < h.getBoundingClientRect().bottom + 4);
}

/* pasos que en la vida real dependen de otra persona (confirmación, término de la atención…) */
const AUTO_L = { P19: 'Simular: la profesional confirma', P23: 'Simular: termina la atención', P61: 'Simular: orden revisada', R08: 'Simular: cuenta aprobada', R17: 'Simular: aceptar solicitud', R20: 'Simular: checklist completo', R40: 'Simular: terminar dictado' };
document.addEventListener('click', e => {
  if (!e.target.closest('[data-auto]')) return; const s = SC[cur]; if (!s || !s.auto) return;
  if (s.autoAct) s.autoAct(); go(typeof s.auto === 'function' ? s.auto() : s.auto);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && S.sheet) { S.sheet = ''; render(); } });

/* cambia entre escritorio y móvil al redimensionar */
let platRT = null;
window.addEventListener('resize', () => {
  clearTimeout(platRT); platRT = setTimeout(() => {
    if (!cur) return; const v = roleOf(cur) === 'adm' ? 'd' : platNarrow() ? 'm' : 'd';
    if (v !== view) { view = v; const id = resolve(cur); cur = null; lastId = null; go(id, false); }
  }, 120);
});

/* inicio en escritorio = P06 de la app (mismo contenido), no la W01 */
delete TO_D.P06;

/* ---------- arranque ---------- */
(function platInit() {
  document.body.classList.add('plat');
  const h = location.hash.replace('#/', '');
  view = platNarrow() ? 'm' : 'd';
  history.replaceState({ plat: 1, d: 0 }, '', PLAT_URL + location.hash);
  go(SC[h] ? h : 'P06', false);
  // Entrada desde el buscador de la web (/web/): abre la misma pantalla que el buscador de la app (P07) al tocar una sugerencia.
  try {
    const j = sessionStorage.getItem('cuidapp:go');
    if (j) {
      sessionStorage.removeItem('cuidapp:go');
      const o = JSON.parse(j);
      if (o.q) { S.q = String(o.q).slice(0, 80); go('P07'); }
      else { if (o.act && ACT[o.act]) ACT[o.act](o.arg); if (o.go && SC[o.go]) go(o.go); else render(); }
    }
  } catch (e) {}
  window.addEventListener('hashchange', () => { const x = location.hash.replace('#/', ''); if (SC[x] && x !== cur) go(x); });
})();

// Fix: «Rellenar 2749» guardaba el código como número y el checklist no aparecía (bug del prototipo base).
(() => { const _set = ACT.set; ACT.set = a => { _set(a); const k = a.slice(0, a.indexOf('=')); if (k === 'code') S.code = String(S.code); }; })();
