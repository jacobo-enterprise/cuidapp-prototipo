/* ===== Paciente · marketplace de servicios de enfermería ===== */
Object.assign(ACT, {
  set: a => { const i = a.indexOf('='); const k = a.slice(0, i), v = a.slice(i + 1); S[k] = isNaN(+v) || v === '' ? v : +v; },
  tog: a => { const [o, k] = a.split('.'); if (k === undefined) S[o] = !S[o]; else S[o][k] = !S[o][k]; },
  svc: a => { S.item = a; S.when = 'prog'; S.sheet = ''; if (a) S.grp = CAT[a].g; fixSlot(); },
  grp: k => { S.grp = k; S.item = GRP[k].l[0]; S.when = 'prog'; S.sheet = ''; fixSlot(); },
  ex: k => { S.exams[k] = !S.exams[k]; },
  mmode: m => { S.mmode = m; },
  ordenUp: () => { S.orden = 'si'; },
  exq: q => { S.exq = q; },
  kinAv: () => { S.kinAv = !S.kinAv; toast(S.kinAv ? 'Listo. Te avisaremos cuando Kinesiología abra en tu comuna.' : 'Ya no te avisaremos.'); },
  promo: k => { S.promo = k; },
  code: () => toast('Código CUIDA20 copiado.'),
  medAv: () => { S.medAv = !S.medAv; toast(S.medAv ? 'Listo. Te avisaremos cuando Medicamentos abra en tu comuna.' : 'Ya no te avisaremos.'); },
  kin: () => toast('Kinesiología llega muy pronto. Te avisamos cuando abra en tu comuna.'),
  pick: a => { const [pro, d, t] = a.split('|'); S.pro = pro; S.when = 'prog'; if (!S.item || !priceOf(PRO(), S.item)) S.item = svcsOf(PRO())[0]; if (d !== undefined && d !== '') { S.day = +d; S.slot = t; } else { const x = nextOf(PRO()); if (x) { S.day = x[0]; S.slot = x[1]; } } S.pday = S.day; },
  day: d => { S.day = +d; fixSlot(); },
  pday: d => { S.pday = +d; },
  fav: id => { S.fav[id] = !S.fav[id]; toast(S.fav[id] ? `${PRO(id).n} quedó en tus favoritos.` : `Quitaste a ${PRO(id).n} de favoritos.`); },
  sort: v => { S.sort = v; S.sheet = ''; if (cur === 'P06') S.item = ''; },
  rsort: v => { S.revSort = v; S.sheet = ''; },
  today: () => { S.fday = S.fday === 'hoy' ? 'all' : 'hoy'; },
  only: k => { const on = S.f[k] && !S.f[k === 'enf' ? 'tens' : 'enf']; S.f = on ? { enf: true, tens: true } : { enf: k === 'enf', tens: k === 'tens' }; },
  r48: () => { S.frat = S.frat ? 0 : 4.8; },
  clearF: () => { S.f = { enf: true, tens: true }; S.fmax = 0; S.fday = 'all'; S.frat = 0; S.fgen = ''; S.fcom = ''; },
  clearQ: () => { S.q = ''; S.typed = true; },
  share: () => toast('Link del perfil copiado. Compártelo por WhatsApp.'),
  consent: () => { S.consent = !S.consent; },
  receta: () => { S.receta = true; },
  toast: m => toast(m),
  send: () => { S.chat.push(S.booked ? 'Te espero abajo, gracias.' : 'Perfecto, gracias. Te agendo ahora.'); },
  rate: n => { S.rating = +n; },
  tag: t => { S.tags[t] = !S.tags[t]; },
  rtxt: () => { S.rtxt = true; },
  sent: () => { toast(`Gracias. Tu reseña quedó publicada en el perfil de ${first()}.`); S.hecho = true; S.myRev = { pro: S.pro, r: S.rating, s: S.item }; },
  cancel: () => { toast(S.cancelFrom === 'P19' ? 'Solicitud cancelada. No se cobró nada.' : 'Cita cancelada. Liberamos el monto retenido.'); S.booked = false; },
  inCourse: () => { S.phase = 'curso'; },
  book: () => { S.booked = true; },
  again: () => { S.when = 'prog'; S.day = 2; S.slot = slotsOf(PRO(), 2)[0] || '08:00'; },
});
function fixSlot() { const l = slotsOf(PRO(), S.day); if (l.length && !l.includes(S.slot)) S.slot = l[0]; }

/* ---------- piezas ---------- */
const R = n => `<span class="num">${clp(n)}</span>`;
const vb = `<span class="vb">${ic('check', 0).replace('ph ', 'ph-bold ')}</span>`;
const pav = (p, k = '', ver = false) => `<span class="av ${k}${PHOTO.includes(p.i) ? ' hasp' : ''}" style="background:${p.bg};color:${p.fg}">${avIn(p.i)}${ver ? vb : ''}</span>`;
const kmT = p => String(p.km).replace('.', ',') + ' km';
const star = () => '<i class="ph-fill ph-star"></i>';
const rate = (p, n = true) => `<span class="rt">${star()}<b>${p.r}</b>${n ? `<span>(${p.rv})</span>` : ''}</span>`;
const heart = (id, k = '') => `<button class="hrt ${k} ${S.fav[id] ? 'on' : ''}" data-act="fav" data-arg="${id}" aria-label="Guardar">${ic('heart', S.fav[id])}</button>`;
const seal = () => `<i class="ph-fill ph-seal-check sealc"></i>`;
const sis = () => `<span class="badge">${ic('seal-check', 1)}SIS verificado</span>`;
const svcN = k => k ? CAT[k].n : 'Todos los servicios';
const dayLbl = d => d === 0 ? 'Hoy' : d === 1 ? 'Mañana' : `${DAYS[d][0]} ${DAYS[d][1]}`;
const SHORT = { [INC.ins]: 'Insumos incluidos', [INC.pre]: 'Control de presión', [INC.res]: 'Retiro de residuos', [INC.edu]: 'Indicaciones por escrito' };
const shortInc = t => SHORT[t] || t;
const mini = (p = PRO(), sub) => `<div class="mini">${pav(p, 's', true)}<div class="tx"><div class="b-m">${p.n}</div><div class="sm t2">${sub || `${p.t} · ${rate(p, false)}`}</div></div></div>`;
const proCard = (big, phone, id) => { const p = PRO(id); return `<div class="procard">${pav(p, big ? 'l' : '', true)}<div style="flex:1;min-width:0"><div class="h-s">${p.n}</div><div class="sm t2">${p.t} · Registro SIS ${p.reg}</div><div class="sm mt4">${rate(p)} <span class="t2">· ${p.a} atenciones${phone ? ` · ${p.tel}` : ''}</span></div></div></div>`; };
const shd = (t, go, act, arg, lab = 'Ver todas') => `<div class="shd"><h3>${t}</h3>${go || act ? `<button class="lk" ${go ? `data-go="${go}"` : ''} ${act ? `data-act="${act}" data-arg="${arg}"` : ''}>${lab}</button>` : ''}</div>`;
const revsOf = id => { const l = (REVIEWS[id] || []).slice(); if (S.myRev && S.myRev.pro === id) l.unshift({ id: 'me', n: 'Daniela Fuentes', c: 'Ñuñoa', d: 'recién', s: S.myRev.s, r: S.myRev.r, t: 'Llegó puntual, le explicó todo a mi mamá y dejó las indicaciones por escrito. Muy recomendada.' }); return l; };
const starsN = n => `<span class="strs">${[1, 2, 3, 4, 5].map(i => `<i class="ph-fill ph-star ${i <= n ? '' : 'off'}"></i>`).join('')}</span>`;
const ini = n => n.split(' ').map(x => x[0]).slice(0, 2).join('');
const rvCard = (r, full, pid) => `<div class="rv ${full ? 'full' : ''}"><div class="rv-h"><span class="av s rvav hasp"><img class="avp" src="img/pac/${slug(r.n)}.webp${V}" alt="" loading="lazy"></span><div><div class="rv-n">${r.n}</div><div class="rv-m">${r.c} · ${r.d}</div></div></div>
  <div class="rv-s">${starsN(r.r)}<span>${CAT[r.s].n}</span></div><div class="rv-t">${r.t}</div>
  ${full && S.resp[r.id] ? `<div class="rv-resp"><div class="rv-n sm">Respuesta de ${first(PRO(pid))}</div><div class="sm t2 mt4">${S.resp[r.id]}</div></div>` : ''}</div>`;
const bars = p => `<div class="rbars">${[5, 4, 3, 2, 1].map((n, i) => `<div class="rb"><span>${n}</span><div class="tr"><i style="width:${p.dist[i]}%"></i></div></div>`).join('')}</div>`;
const crits = p => `<div class="crit">${p.crit.map(c => `<div><span>${c[0]}</span><b class="num">${c[1]}</b></div>`).join('')}</div>`;
const scoreBlock = p => `<div class="score"><div class="big num">${p.r}</div><div>${starsN(5)}<div class="sm t2 mt4">${p.rv} reseñas de pacientes verificadas</div></div></div>`;

// tarjeta destacada (carrusel)
const fcard = p => `<div class="fcard" data-act="pick" data-arg="${p.id}|" data-go="P12" role="button">
  <div class="fc-hd" style="background:${p.bg}">${pav(p, 'l', true)}${heart(p.id, 'fl')}${p.top ? '<span class="fc-tag">Destacada</span>' : ''}</div>
  <div class="fc-b"><div class="fc-n">${p.n}</div><div class="fc-m">${p.t} · ${kmT(p)}</div><div class="fc-m mt4">${rate(p)}</div>
  <div class="fc-f"><span class="sm">Desde <b class="num">${clp(priceOf(p, ''))}</b></span>${nextOf(p) ? `<span class="nx">${dayLbl(nextOf(p)[0])} ${nextOf(p)[1]}</span>` : ''}</div></div></div>`;
// tarjeta de lista simple
const lcard = (p, k = '') => `<div class="lcard ${k}" data-act="pick" data-arg="${p.id}|" data-go="P12" role="button">${pav(p, '', true)}
  <div class="tx"><div class="b-m">${p.n}</div><div class="sm t2">${p.t} · ${p.com[0]}, a ${kmT(p)}</div><div class="sm mt4">${rate(p)}</div></div>
  <div class="pr"><span class="xs t2">Desde</span><b class="num">${clp(priceOf(p, ''))}</b></div></div>`;
// tarjeta de resultado (el corazón del marketplace)
const rcard = (pr, wide) => {
  const it = S.item, p = priceOf(pr, it), inc = it ? incOf(pr, it) : [], nx = nextSlots(pr, 12);
  const d0 = nx.length ? nx[0][0] : -1, sl = nx.filter(x => x[0] === d0).slice(0, wide ? 4 : 3);
  return `<div class="rcard ${wide ? 'w' : ''}" data-act="pick" data-arg="${pr.id}|" data-go="P12" role="button">
  <div class="rc-top">${pav(pr, wide ? 'l' : '', true)}<div class="rc-id"><div class="rc-n">${pr.n}</div><div class="rc-m">${pr.t} · ${pr.yrs} años de experiencia</div><div class="rc-m">${rate(pr)}</div><div class="rc-m">${ic('map-pin')}${pr.com[0]} · a ${kmT(pr)}</div></div>${heart(pr.id)}</div>
  <div class="rc-price"><div class="rc-l"><div class="rc-svc">${it === 'mue' ? 'Toma a domicilio' : it ? CAT[it].n : 'Precio desde'}</div><div class="rc-inc">${(inc.length ? inc.slice(0, 2) : [INC.ins]).map(t => `<span>${ic('check')}${shortInc(t)}</span>`).join('')}</div></div>
  <div class="rc-p"><b class="num">${clp(p)}</b><span>${it === 'mue' ? '+ exámenes' : it ? durOf(pr, it) + ' min' : 'por visita'}</span></div></div>
  <div class="rc-sl"><span class="rc-d">${d0 >= 0 ? dayLbl(d0) : 'Sin horas'}</span>${sl.map(x => `<button class="spill" data-act="pick" data-arg="${pr.id}|${x[0]}|${x[1]}" data-go="P13">${x[1]}</button>`).join('')}<button class="more" data-act="pick" data-arg="${pr.id}|" data-go="P13">Ver más</button></div>
  <div class="rc-v">${sis()}<span>Antecedentes revisados</span></div></div>`;
};
const grpGo = k => k === 'mue' ? 'P40' : GRP[k].l.length > 1 ? 'P37' : 'P10';
const svcGo = k => k === 'mue' ? 'P40' : 'P10';
const grpStats = k => { const ps = PROS.filter(p => GRP[k].l.some(x => priceOf(p, x))); const mn = Math.min(...GRP[k].l.flatMap(x => PROS.map(p => priceOf(p, x)).filter(Boolean))); return [ps.length, mn]; };
const catGrid = () => `<div class="cats">${GK.map(k => `<button class="cat" data-act="grp" data-arg="${k}" data-go="${grpGo(k)}"><span class="ci">${i3(k)}</span><span class="cn">${GRP[k].c}</span></button>`).join('')}<button class="cat dim" data-act="kin"><span class="ci">${i3('kin')}</span><span class="cn">Kinesiología</span><span class="pr">Muy pronto</span></button><button class="cat dim" data-go="P46"><span class="ci">${i3('med')}</span><span class="cn">Medicamentos</span><span class="pr">Muy pronto</span></button></div>`;
const featured = () => PROS.filter(p => priceOf(p, '')).sort((a, b) => (b.top ? 1 : 0) - (a.top ? 1 : 0) || a.km - b.km).slice(0, 5);
const topRated = () => PROS.slice().sort((a, b) => b.rn - a.rn || b.rv - a.rv).slice(0, 3);
const range = l => { const ps = l.map(p => priceOf(p, S.item)); return ps.length ? [Math.min(...ps), Math.max(...ps)] : [0, 0]; };
const nFilt = () => (S.f.enf && S.f.tens ? 0 : 1) + (S.fmax ? 1 : 0) + (S.fday !== 'all' ? 1 : 0) + (S.frat ? 1 : 0) + (S.fgen ? 1 : 0) + (S.fcom ? 1 : 0);
const SORTS = [['rel', 'Relevancia', 'Nota, reseñas y cercanía'], ['pre', 'Menor precio', 'Del más barato al más caro'], ['rat', 'Mejor valorada', 'Mayor nota primero'], ['pro', 'Disponibilidad más pronta', 'La hora libre más cercana']];
const sortSheet = () => `<div class="h-s">Ordenar por</div><div class="mt8">${SORTS.map(x => radioRow(x[1], x[2], S.sort === x[0], 'sort', x[0])).join('')}</div>`;
const svcSheet = () => `<div class="h-s">Elige el servicio</div><div class="sm t2 mt4">Precios de ${first()}</div><div class="mt8">${svcsOf(PRO()).map(k => `<button class="row" data-act="svc" data-arg="${k}"><span class="ri box">${i3(k)}</span><span class="tx"><div class="a">${CAT[k].n}</div><div class="b">${durOf(PRO(), k)} min</div></span><span class="b-m num">${clp(priceOf(PRO(), k))}</span><span class="radio ${S.item === k ? 'on' : ''}"></span></button>`).join('')}</div>`;
const quick = () => `<div class="qchips">
  <button class="qc ${S.sort !== 'rel' ? 'on' : ''}" data-act="set" data-arg="sheet=sort">${ic('arrows-down-up')}${SORTS.find(x => x[0] === S.sort)[1]}${ic('caret-down')}</button>
  <button class="qc ${S.fday === 'hoy' ? 'on' : ''}" data-act="today">Disponible hoy</button>
  <button class="qc ${S.f.enf && !S.f.tens ? 'on' : ''}" data-act="only" data-arg="enf">Enfermera/o</button>
  <button class="qc ${S.f.tens && !S.f.enf ? 'on' : ''}" data-act="only" data-arg="tens">TENS</button>
  <button class="qc ${S.frat ? 'on' : ''}" data-act="r48">${star()}4,8 o más</button></div>`;
const norm = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const SUG = [['Inyección intramuscular', 'iny'], ['Inyección subcutánea', 'inysc'], ['Inyección endovenosa', 'inyev'], ['Inyección de Neurobionta', 'iny'], ['Inyección de vitamina B12', 'iny'], ['Inyección de insulina', 'inysc'], ['Curación simple', 'cur'], ['Curación avanzada', 'cura'], ['Curación de pie diabético', 'pie'], ['Retiro de puntos', 'pun'], ['Exámenes de sangre', 'mue'], ['Hemograma', 'mue'], ['Perfil lipídico', 'mue'], ['Glicemia', 'mue'], ['Orina completa', 'mue'], ['Toma de muestras a domicilio', 'mue'], ['Control de presión', 'sig'], ['Control de signos vitales', 'sig'], ['Instalación de sonda', 'son'], ['Cambio de sonda Foley', 'son'], ['Instalación de suero', 'suero'], ['Cuidados TENS por 4 horas', 'tens4'], ['Cuidados TENS por 8 horas', 'tens8'], ['Cuidado de adulto mayor', 'tens4']];
const hl = (t, q) => { const i = norm(t).indexOf(norm(q)); return i < 0 ? t : `${t.slice(0, i)}<b>${t.slice(i, i + q.length)}</b>${t.slice(i + q.length)}`; };
const statsOf = k => { const ps = PROS.filter(p => priceOf(p, k)).map(p => priceOf(p, k)); return [ps.length, Math.min(...ps)]; };
const nPro = n => `${n} profesional${n === 1 ? '' : 'es'}`;
const priceTxt = (k, mn) => k === 'mue' ? `toma desde ${clp(mn)} + exámenes` : `desde ${clp(mn)}`;
const svcRow = (k, label, q) => { const [n, mn] = statsOf(k); return `<button class="srow" data-act="svc" data-arg="${k}" data-go="${svcGo(k)}"><span class="si">${i3(k)}</span><span class="tx"><span class="a">${q ? hl(label, q) : CAT[k].n}</span><span class="b">${nPro(n)} · ${priceTxt(k, mn)}</span></span>${ic('caret-right')}</button>`; };
function sugg() {
  const q = S.q, s = SUG.filter(x => norm(x[0]).includes(norm(q))), ps = PROS.filter(p => norm(p.n).includes(norm(q)));
  return `${s.length ? `<div class="lbl2">Servicios</div>${s.slice(0, 5).map(x => svcRow(x[1], x[0], q)).join('')}` : ''}
  ${/medic|farma|remedi|pastill|receta/.test(norm(q)) ? `<div class="lbl2">Muy pronto</div><button class="svcard dim" data-go="P46"><span class="si">${i3('med')}</span><span class="tx"><span class="a">Medicamentos</span><span class="b">Con receta, junto a una farmacia aliada</span><span class="c">Muy pronto · Avísame</span></span>${ic('bell')}</button>` : ''}
  ${ps.length ? `<div class="lbl2">Profesionales</div>${ps.map(p => lcard(p, 'flat')).join('')}` : ''}
  ${!s.length && !ps.length && !/medic|farma|remedi|pastill|receta/.test(norm(q)) ? `<div class="empty"><div class="b-m">No encontramos “${q}”</div><div class="sm t2 mt4">Prueba con otra palabra o mira todos los servicios.</div>${btn('Ver todos los servicios', 'P33', 'sec')}</div>` : ''}
  <div class="lbl2">Búsquedas parecidas</div><div class="chips">${['Neurobionta', 'Vitamina B12', 'Con receta'].map(t => `<button class="chip" data-act="svc" data-arg="iny" data-go="P10">${t}</button>`).join('')}</div>`;
}
const groups = l => [['Por la mañana', t => t < '12:00'], ['Por la tarde', t => t >= '12:00' && t < '19:00'], ['Por la noche', t => t >= '19:00']].map(g => [g[0], l.filter(g[1])]).filter(g => g[1].length);
const hist = () => { const ps = PROS.filter(p => priceOf(p, S.item)).map(p => priceOf(p, S.item)); const bins = [12, 14, 16, 18, 20, 22, 24, 26, 28].map(x => x * 1000); return `<div class="hist">${bins.map(b => { const n = ps.filter(p => p >= b && p < b + 2000).length; return `<i class="${!S.fmax || b < S.fmax ? 'on' : ''}" style="height:${8 + n * 18}px"></i>`; }).join('')}</div><div class="hist-l xs t2"><span>$12.000</span><span>$30.000</span></div>`; };
const ll = p => { const a = { cr: [.006, -.008], fa: [-.012, .010], mc: [.003, .004], pg: [.010, -.002], vm: [-.004, .022], fl: [.014, .012], dn: [-.016, -.004] }[p.id]; return [P().ll[0] + a[0], P().ll[1] + a[1]]; };
const dstrip = (p, key, act, pre) => `<div class="dstrip">${DAYS.map((d, i) => { const n = slotsOf(p, i).length; const on = S[key] === i; return !pre && n ? `<button class="ds ${on ? 'on' : ''}" data-act="${act}" data-arg="${i}"><span>${d[2] || d[0]}</span><b>${d[1]}</b><i></i></button>` : `<div class="ds ${on ? 'on' : ''} ${n ? '' : 'off'}"><span>${d[2] || d[0]}</span><b>${d[1]}</b><i></i></div>`; }).join('')}</div>`;
const acts = l => `<div class="acts">${l.map(a => `<button class="act" ${a[4] ? `data-go="${a[4]}"` : `data-act="${a[2]}" data-arg="${a[3]}"`}>${ic(a[0])}<span>${a[1]}</span>${ic('caret-right')}</button>`).join('')}</div>`;

/* ---------- ingreso ---------- */
def({ id: 'P01', name: 'Ingreso', kind: 'page', noNav: true,
  body: () => `<div style="padding-top:40px">${logoImg('simbolo-nm', 64)}</div>
  <div class="h-l mt24">Enfermeras y TENS que van a tu casa</div><div class="t2 mt8">Busca el servicio, compara precios y reseñas, y agenda con la profesional que elijas.</div>
  ${lbl('Tu celular')}<div style="display:flex;gap:8px"><div class="field" style="width:96px;flex:none">🇨🇱&nbsp;+56</div>${field('', '9 8765 4321', '', 'focus')}</div>`,
  foot: () => `${btn('Continuar', 'P02')}
  <div style="display:flex;align-items:center;gap:12px;margin:6px 0" class="t3 sm"><span style="flex:1;height:1px;background:var(--border)"></span>o<span style="flex:1;height:1px;background:var(--border)"></span></div>
  ${btn(ic('apple-logo', 1) + 'Continuar con Apple', 'P02', 'sec')}${btn(ic('google-logo', 1) + 'Continuar con Google', 'P02', 'sec')}
  <button class="btn ghost sm" data-go="R01" style="font-size:15px">¿Eres enfermera o TENS? <span class="link" style="margin-left:4px">Ofrece tus servicios</span></button>
  <div class="xs t3" style="text-align:center">Al continuar aceptas los Términos y la Política de privacidad de Cuidapp.</div>` });

def({ id: 'P02', name: 'Código SMS', kind: 'page', back: true, noNav: true,
  body: () => `<div class="h-l mt8">Ingresa el código</div><div class="t2 mt8">Te lo enviamos por SMS al +56 9 8765 4321.</div>
  <div class="code mt24">${'4816'.split('').map((d, i) => `<span class="${i === 3 ? 'f' : ''}">${d}</span>`).join('')}</div>
  <div class="t2 sm mt16">Reenviar código en <span class="num">0:24</span></div>
  <button class="pill mt16" data-go="back">${ic('pencil-simple')}Cambiar número</button>`,
  foot: () => btn('Continuar', 'P03') });

def({ id: 'P03', name: 'Tus datos', kind: 'page', back: true, noNav: true, title: '',
  body: () => `<div class="h-l">Cuéntanos de ti</div><div class="t2 mt8">Los pedimos una vez. Van en tu boleta.</div>
  ${lbl('Nombre y apellidos')}${field('', 'Daniela Fuentes Muñoz')}
  ${lbl('RUT')}${field('', '17.482.913-5')}
  ${lbl('Correo')}${field('', 'daniela.fuentes@gmail.com')}
  ${lbl('Previsión')}<div class="chips">${chip('Fonasa', S.prev === 'fonasa', 'set', 'prev=fonasa')}${chip('Isapre', S.prev === 'isapre', 'set', 'prev=isapre')}${chip('Particular', S.prev === 'part', 'set', 'prev=part')}</div>`,
  foot: () => btn('Continuar', 'P04') });

def({ id: 'P04', name: 'Consentimiento de datos de salud', kind: 'page', back: true, noNav: true,
  body: () => `${ic('shield-check', 1).replace('<i ', '<i style="font-size:44px;color:#7A7CF0" ')}<div class="h-l mt12">Tus datos de salud son tuyos</div>
  <div class="mt8">${row('box:stethoscope', 'Para qué los usamos', 'Para que la profesional sepa qué hacer y para enviar tus exámenes al laboratorio aliado.', '', '')}
  ${row('box:eye', 'Quién los ve', 'Solo la profesional que agendas y el equipo clínico de Cuidapp.', '', '')}
  ${row('box:trash', 'Cuánto tiempo', 'Mientras tengas cuenta. Puedes pedir que los borremos cuando quieras.', '', '')}</div>
  <div class="hr"></div>${checkRow('Autorizo a Cuidapp a tratar mis datos de salud para coordinar mi atención, según la Ley 19.628.', S.consent, 'consent', '')}`,
  foot: () => abtn('Aceptar y seguir', '', '', '', 'P05', !S.consent) });

def({ id: 'P05', name: 'Dirección de atención', kind: 'page', noNav: true, back: true, title: '',
  body: () => `<div class="h-l">¿Dónde serán las atenciones?</div><div class="t2 mt8">Te mostramos las profesionales que atienden en esa comuna, con sus precios.</div>
  <div class="mt24">${row('box:navigation-arrow', 'Usar mi ubicación actual', 'Ñuñoa, Santiago', 'P06', ic('caret-right'), '', 'toast', 'Listo. Te mostramos profesionales que atienden en Ñuñoa.')}
  ${row('box:magnifying-glass', 'Escribir una dirección', 'Calle, número y comuna', 'P08', ic('caret-right'), '', 'set', 'addrNext=P06')}</div>
  <div class="mt24">${note('lock-simple', 'Tu dirección exacta solo la ve la profesional que agendas, cuando confirma la cita.')}</div>` });

/* ---------- Servicios (inicio de la app) ---------- */

/* ---------- promociones (ejemplos del prototipo) ---------- */
const PROMO = {
  kin: { cls: 'dark', eb: 'Muy pronto en Cuidapp', t: 'Kinesiología a domicilio', d: 'Motora y respiratoria, en tu casa.', ic: 'kin' },
  first: { cls: 'lav', eb: 'Primera atención', t: '20% de descuento', d: 'Con el código CUIDA20 · tope $10.000', ic: 'iny' },
  lab: { cls: 'neu', eb: 'Exámenes a domicilio', t: 'Toma gratis sobre $30.000', d: 'Pagas solo los exámenes del laboratorio.', ic: 'mue' },
};
const PSUB = { kin: 'Motora y respiratoria', first: 'Primera atención · tope $10.000', lab: 'Pagas solo los exámenes' };
const PT = { kin: 'Kinesiología', first: '20% de descuento', lab: 'Toma gratis sobre $30.000' };
const promoEnd = k => k === 'kin' ? `<button class="pcta ${S.kinAv ? 'on' : ''}" data-act="kinAv">${S.kinAv ? ic('check', 0).replace('ph ', 'ph-bold ') + 'Avisado' : 'Avísame'}</button>`
  : k === 'first' ? `<button class="pcta" data-act="code">CUIDA20</button>` : `<span class="pchev">${ic('caret-right')}</span>`;
const promoCard = k => { const p = PROMO[k]; return `<div class="pslim ${p.cls}" data-act="promo" data-arg="${k}" data-go="P45" role="button"><span class="ps-ic">${i3(p.ic)}</span><span class="ps-tx"><span class="ps-eb">${p.eb}</span><b class="ps-t">${PT[k]}</b><span class="ps-d">${PSUB[k]}</span></span>${promoEnd(k)}</div>`; };
window.pdots = el => { const n = Math.round(el.scrollLeft / (el.firstElementChild.offsetWidth + 8)); el.nextElementSibling.querySelectorAll('i').forEach((d, i) => d.classList.toggle('on', i === n)); };
const promoCar = () => `<div class="pcar" onscroll="pdots(this)">${Object.keys(PROMO).map(promoCard).join('')}</div><div class="pdots"><i class="on"></i><i></i><i></i></div>`;

def({ id: 'P06', name: 'Servicios (inicio)', kind: 'page', tab: 'servicios', bodyCls: 'home',
  body: () => `<div class="hero"><div class="locrow"><button class="locb" data-act="set" data-arg="addrNext=P06" data-go="P08"><span class="xs t2">Atención a domicilio en</span><span class="lv">${P().n}, ${P().c}${ic('caret-down')}</span></button><button class="ib bell" data-act="toast" data-arg="No tienes notificaciones nuevas." aria-label="Notificaciones">${ic('bell')}</button></div>
  <h1 class="h-xl mt16">¿Qué necesitas?</h1>
  <button class="sbig mt16" data-go="P07">${ic('magnifying-glass')}<span>Inyección, curación, exámenes…</span></button></div>
  ${S.booked && !S.hecho ? `<button class="upc mt16" data-act="set" data-arg="det=next" data-go="P27"><span class="db"><span>${DAYS[S.day][0]}</span><b>${DAYS[S.day][1]}</b></span><span class="tx"><span class="xs t2">Tu próxima cita</span><b>${CAT[S.item].n}</b><span class="sm t2">${S.slot} · ${PRO().n}</span></span>${ic('caret-right')}</button>` : ''}
  <div class="mt16">${promoCar()}</div>
  <div class="mt24">${shd('Servicios', 'P33', '', '', 'Ver todos')}${catGrid()}</div>
  ${shd('Destacadas cerca de ti', 'P10', 'svc', '')}
  <div class="hcar">${featured().map(fcard).join('')}</div>
  ${shd('Búsquedas recientes')}
  <div class="recent">${[['iny', 'Inyección intramuscular', 'Ñuñoa · 7 profesionales'], ['mue', 'Hemograma y perfil lipídico', 'Ñuñoa · laboratorio aliado'], ['cur', 'Curación simple', 'Providencia · 6 profesionales']].map(r => `<button class="rrow" data-act="svc" data-arg="${r[0]}" data-go="${svcGo(r[0])}"><span class="rc">${ic('clock-counter-clockwise')}</span><span class="tx"><span class="a">${r[1]}</span><span class="b">${r[2]}</span></span>${ic('arrow-up-right')}</button>`).join('')}</div>
  ${shd('Mejor valoradas', 'P10', 'sort', 'rat')}
  <div class="llist">${topRated().map(p => lcard(p)).join('')}</div>
    <div class="xs t3 mt16 center">Profesionales, precios y reseñas de ejemplo.</div>` });

def({ id: 'P07', name: 'Buscar servicio', kind: 'page', back: true,
  top: () => `<div class="srch"><button class="ib" data-go="back" aria-label="Volver">${ic('caret-left')}</button><div class="sinput">${ic('magnifying-glass')}<span class="qv">${S.q}<i class="caret"></i>${S.q ? '' : '<span class="ph-t">¿Qué necesitas?</span>'}</span>${S.q ? `<button class="clr" data-act="clearQ" aria-label="Borrar">${ic('x-circle', 1)}</button>` : ''}</div></div>
  <button class="sloc" data-act="set" data-arg="addrNext=P07" data-go="P08">${ic('map-pin')}<span>En ${P().n}, ${P().c}</span><span class="link">Cambiar</span></button>`,
  body: () => S.q ? sugg() : `<div class="lbl2">Búsquedas recientes</div><div class="chips">${['Inyección intramuscular', 'Exámenes de sangre', 'Curación'].map((t, i) => `<button class="chip" data-act="svc" data-arg="${['iny', 'mue', 'cur'][i]}" data-go="${svcGo(['iny', 'mue', 'cur'][i])}">${ic('clock-counter-clockwise')}&nbsp;${t}</button>`).join('')}</div>
  <div class="shd"><h3>Lo más pedido</h3><button class="lk" data-go="P33">Ver todos</button></div>${['iny', 'mue', 'cur', 'tens4'].map(k => svcRow(k)).join('')}`,
  enter: () => { if (S.typed || S.q) return; S.typed = true; const w = 'inyec'; const step = i => setTimeout(() => { if (cur !== 'P07' || S.q === w) return; S.q = w.slice(0, i); render(); if (i < w.length) step(i + 1); }, i === 1 ? 700 : 150); step(1); } });

const svcCard = k => { const [n, mn] = statsOf(k); return `<button class="svcard" data-act="svc" data-arg="${k}" data-go="${svcGo(k)}"><span class="si">${i3(k)}</span><span class="tx"><span class="a">${CAT[k].n}</span><span class="b">${CAT[k].d}</span><span class="c">${n ? `${nPro(n)} · ${priceTxt(k, mn)}` : 'Pronto en tu comuna'}</span></span>${ic('caret-right')}</button>`; };
def({ id: 'P33', name: 'Todos los servicios', kind: 'page', back: true, title: 'Servicios',
  body: () => `<div class="sm t2">Cada profesional pone su precio y dice qué incluye. Los exámenes tienen el precio fijo del laboratorio aliado.</div>
  ${GK.map(k => `<div class="lbl2">${GRP[k].n}</div>${GRP[k].l.map(svcCard).join('')}`).join('')}
  <div class="lbl2">Muy pronto</div><button class="svcard dim" data-act="kin"><span class="si">${i3('kin')}</span><span class="tx"><span class="a">Kinesiología a domicilio</span><span class="b">Motora y respiratoria</span><span class="c">Te avisamos cuando abra</span></span>${ic('bell')}</button><button class="svcard dim" data-go="P46"><span class="si">${i3('med')}</span><span class="tx"><span class="a">Medicamentos</span><span class="b">Con receta, junto a una farmacia aliada</span><span class="c">Muy pronto · Avísame</span></span>${ic('bell')}</button>` });

def({ id: 'P46', name: 'Medicamentos (muy pronto)', kind: 'page', back: true, title: '',
  body: () => `<div class="medh"><span class="medi">${i3('med')}</span><span class="badge medb">Muy pronto</span><div class="h-l mt16">Medicamentos</div><div class="t2 mt8">Pronto podrás pedir tus medicamentos con receta desde Cuidapp junto a una farmacia aliada.</div></div>
  <div class="mt24">${row('box:file-text', 'Con tu receta médica', 'La subes una vez y la farmacia la revisa', '', '')}${row('box:storefront', 'Farmacia aliada', 'Precios de la farmacia, sin recargo de Cuidapp', '', '')}${row('box:bell', 'Te avisamos cuando abra', 'Con una notificación push y por correo', '', '')}</div>`,
  foot: () => abtn(S.medAv ? ic('check') + 'Te avisaremos' : ic('bell') + 'Avísame', 'medAv', '', S.medAv ? 'sec' : '') });

def({ id: 'P37', name: 'Categoría de servicios', kind: 'page', back: true, title: '', next: ['P10'],
  body: () => { const g = GRP[S.grp || 'iny']; return `<div class="i3hero">${i3(S.grp || 'iny')}</div><div class="h-l">${g.n}</div><div class="t2 sm mt4">${g.d}</div>
  <div class="mt16">${g.l.map(svcCard).join('')}</div>
  ${g.l.some(k => CAT[k].receta) ? `<div class="mt16">${note('file-text', 'Las inyecciones y sueros requieren receta médica. La subes al agendar.')}</div>` : ''}`; } });

/* ---------- exámenes: catálogo del laboratorio aliado ---------- */
def({ id: 'P40', name: 'Exámenes y toma de muestras', kind: 'page', back: true, title: 'Exámenes', next: ['P16'],
  prep: () => { S.item = 'mue'; },
  body: () => { const q = norm(S.exq || ''); const ks = Object.keys(EXAMS).filter(k => !q || norm(EXAMS[k][0]).includes(q));
    return `<div class="h-l">¿Qué exámenes necesitas?</div><div class="t2 sm mt4">Precios fijos del ${LAB.toLowerCase()}. La profesional solo cobra la toma a domicilio.</div>
  <div class="seg mt16 full"><button class="${!byOrder() ? 'on' : ''}" data-act="mmode" data-arg="cat">Elegir exámenes</button><button class="${byOrder() ? 'on' : ''}" data-act="mmode" data-arg="orden">Subir orden médica</button></div>
  ${byOrder() ? `<div class="mt16">${S.orden === 'si' ? `<div class="recok">${orden()}<div>${st('inf', 'En revisión')}<div class="sm t2 mt8">El laboratorio lee tu orden y te confirma el precio antes de cobrar.</div><button class="pill mt12" data-act="set" data-arg="orden=">${ic('arrow-counter-clockwise')}Cambiar</button></div></div>`
      : `<div class="drop"><div class="row8"><button class="pill on" data-act="ordenUp">${ic('camera')}Tomar foto</button><button class="pill" data-act="ordenUp">${ic('file-arrow-up')}Subir PDF</button></div><div class="t3 sm">Que se lean el nombre, los exámenes y la firma</div></div>`}</div>`
    : `<button class="exsearch mt16" data-act="exq" data-arg="${S.exq ? '' : 'perfil'}">${ic('magnifying-glass')}<span class="${S.exq ? '' : 'ph-t'}">${S.exq || 'Buscar examen'}</span>${S.exq ? ic('x-circle', 1) : ''}</button>
  <div class="lbl2">${S.exq ? 'Resultados' : 'Más pedidos'} · ${LAB}</div>
  <div class="exl">${ks.map(k => `<button class="exr ${S.exams[k] ? 'on' : ''}" data-act="ex" data-arg="${k}"><span class="tx"><span class="a">${EXAMS[k][0]}</span><span class="b">${EXAMS[k][3] ? 'Ayuno de 8 horas' : 'Sin ayuno'}</span></span><span class="num pp">${clp(EXAMS[k][1])}</span><span class="check ${S.exams[k] ? 'on' : ''}">${S.exams[k] ? ic('check', 0).replace('ph ', 'ph-bold ') : ''}</span></button>`).join('')}</div>`}`; },
  foot: () => byOrder() ? abtn('Continuar', '', '', '', 'P16', S.orden !== 'si') : `<div class="fbar"><div class="fb-l"><b class="num">${clp(examSum())}</b><span>${examKeys().length} exámenes · laboratorio</span></div>${abtn('Continuar', '', '', 'fbtn', 'P16', !examKeys().length)}</div>` });

def({ id: 'P16', name: 'Preparación para la toma', kind: 'page', back: true, title: 'Preparación', next: ['P10'],
  body: () => `<div class="h-l">Antes de la toma</div><div class="t2 sm mt4">${byOrder() ? 'Según tu orden médica' : examList().map(e => e[0]).join(', ')}</div>
  <div class="mt16">${fasting() ? row('box:clock-countdown', 'Ayuno de 8 horas', 'Solo agua. Agenda temprano, entre 07:00 y 10:00', '', '') : row('box:coffee', 'No necesitas ayuno', 'Puedes tomar desayuno normal', '', '')}
  ${S.exams.ori || S.exams.uro ? row('box:drop', 'Primera orina de la mañana', 'En el frasco estéril que lleva la profesional', '', '') : ''}
  ${row('box:pill', 'Tus remedios de siempre', 'Tómalos, salvo que tu médico diga otra cosa', '', '')}
  ${row('box:identification-card', 'Ten a mano el carnet', 'De la persona que se toma el examen', '', '')}
  ${row('box:file-pdf', 'Resultados en 24 a 48 horas', 'En PDF, en el detalle de tu cita', '', '')}</div>`,
  foot: () => btn('Elegir profesional', 'P10') });

/* ---------- direcciones ---------- */
def({ id: 'P08', name: 'Buscar dirección', kind: 'page', back: true, title: 'Dirección de la atención',
  body: () => `${field('magnifying-glass', 'Irarrázaval 34', '', 'focus')}
  <div class="mt8">${row('box:map-pin', 'Av. Irarrázaval 3450', 'Ñuñoa, Santiago', 'P09', '', '', 'set', 'addr=mama')}
  ${row('box:map-pin', 'Av. Irarrázaval 3400', 'Ñuñoa, Santiago', 'P09', '', '', 'set', 'addr=mama')}
  ${row('box:map-pin', 'Av. Irarrázaval 3499', 'Ñuñoa, Santiago', 'P09', '', '', 'set', 'addr=mama')}</div>
  <div class="lbl2">Guardadas</div>
  ${row('box:house', 'Casa', 'Los Leones 1180, Providencia', 'P09', '', '', 'set', 'addr=casa')}
  ${row('box:heart', 'Mamá', 'Av. Irarrázaval 3450, Ñuñoa', 'P09', '', '', 'set', 'addr=mama')}
  ${row('box:navigation-arrow', 'Usar mi ubicación actual', '', 'P09', '', '', 'set', 'addr=casa')}` });

def({ id: 'P09', name: 'Confirmar domicilio', kind: 'page', back: true, title: 'Confirma la dirección', next: ['P06', 'P07', 'P14', 'P17'],
  body: () => `<div class="addrc">${ic('map-pin', 1)}<div><div class="b-m">${P().n}</div><div class="sm t2">${P().c}, Región Metropolitana</div></div></div>
  ${lbl('Depto, casa o block')}${field('', S.addr === 'mama' ? 'Depto 1204, torre B' : 'Depto 52')}
  ${lbl('Indicaciones para llegar')}${field('', S.addr === 'mama' ? 'Conserjería abierta 24 h. Estacionar en visitas.' : 'Timbre 52. Portón negro.')}
  ${lbl('Guardar como')}<div class="chips">${chip('Mamá', S.addr === 'mama', 'set', 'addr=mama')}${chip('Casa', S.addr === 'casa', 'set', 'addr=casa')}${chip('Otra', false, 'toast', 'Ponle un nombre a esta dirección.')}</div>
  <div class="mt24">${note('lock-simple', 'La dirección exacta solo la ve la profesional que agendas.')}</div>`,
  foot: () => `<button class="btn" data-go="${S.addrNext || 'P06'}">Guardar dirección</button>` });

/* ---------- resultados ---------- */
def({ id: 'P10', name: 'Resultados del servicio', kind: 'page', back: true, sheets: ['sort'], sheet: sortSheet,
  top: () => `<div class="rtop"><button class="ib" data-go="back" aria-label="Volver">${ic('caret-left')}</button><button class="spl" data-go="P07"><b>${svcN(S.item)}</b><span>${P().c} · Cualquier día</span></button><button class="ib fb" data-go="P11" aria-label="Filtros">${ic('sliders-horizontal')}${nFilt() ? `<span class="cnt">${nFilt()}</span>` : ''}</button></div>${quick()}`,
  body: () => { const l = prosFor(), [a, b] = range(l); return `<div class="rsum"><div class="h-s">${nPro(l.length)} en ${P().c}</div><div class="sm t2 mt4">${!l.length ? 'Prueba quitando algún filtro.' : S.item === 'mue' ? `Toma a domicilio desde <b class="num">${clp(a)}</b>. Los exámenes (${byOrder() ? 'según tu orden' : clp(examSum())}) los cobra el laboratorio.` : `Desde <b class="num">${clp(a)}</b> hasta <b class="num">${clp(b)}</b> · cada una pone su precio`}</div></div>
  ${S.item && CAT[S.item].receta ? `<div class="rnote">${ic('file-text')}<span>Necesitas receta médica. La subes al agendar.</span></div>` : ''}
  <div class="rlist">${l.map(p => rcard(p)).join('')}</div>
  ${l.length ? '' : `<div class="empty">${abtn('Quitar filtros', 'clearF', '', 'sec')}</div>`}
  <div class="xs t3 mt16 center" style="padding-bottom:64px">Precios fijados por cada profesional. Datos de ejemplo.</div>`; },
  float: () => `<button class="mapfab" data-go="P36">${ic('map-trifold')}Ver en mapa</button>` });

def({ id: 'P11', name: 'Filtros', kind: 'page', back: 'x', title: 'Filtros',
  body: () => `<div class="fsec"><div class="h-s">Precio</div><div class="sm t2 mt4">${S.item ? CAT[S.item].n : 'Precio por visita'} · lo fija cada profesional</div>${hist()}
  <div class="chips mt12">${[[0, 'Cualquiera'], [15000, 'Hasta $15.000'], [20000, 'Hasta $20.000'], [25000, 'Hasta $25.000']].map(x => chip(x[1], S.fmax === x[0], 'set', 'fmax=' + x[0])).join('')}</div></div>
  <div class="fsec"><div class="h-s">Disponibilidad</div><div class="chips mt12">${[['all', 'Cualquier día'], ['hoy', 'Disponible hoy'], ['man', 'Hoy o mañana']].map(x => chip(x[1], S.fday === x[0], 'set', 'fday=' + x[0])).join('')}</div></div>
  <div class="fsec"><div class="h-s">Comuna donde atiende</div><div class="chips mt12">${[['', 'Todas'], ['Ñuñoa', 'Ñuñoa'], ['Providencia', 'Providencia'], ['La Reina', 'La Reina'], ['Las Condes', 'Las Condes'], ['Macul', 'Macul'], ['Santiago', 'Santiago']].map(x => chip(x[1], S.fcom === x[0], 'set', 'fcom=' + x[0])).join('')}</div></div>
  <div class="fsec"><div class="h-s">Profesión</div><div class="mt4">${checkRow('Enfermera o enfermero', S.f.enf, 'tog', 'f.enf', 'Inyecciones, curaciones, sondas y exámenes')}${checkRow('TENS', S.f.tens, 'tog', 'f.tens', 'Técnico en enfermería: cuidados, inyecciones y muestras')}</div></div>
  <div class="fsec"><div class="h-s">Valoración</div><div class="chips mt12">${[[0, 'Todas'], [4.5, '4,5 o más'], [4.8, '4,8 o más']].map(x => chip(x[1], S.frat === x[0], 'set', 'frat=' + x[0])).join('')}</div></div>
  <div class="fsec last"><div class="h-s">Género de la profesional</div><div class="chips mt12">${[['', 'Indistinto'], ['f', 'Mujer'], ['m', 'Hombre']].map(x => chip(x[1], S.fgen === x[0], 'set', 'fgen=' + x[0])).join('')}</div></div>`,
  foot: () => `<div class="fbar"><button class="lk u" data-act="clearF">Limpiar todo</button><button class="btn fbtn" data-go="back">Ver ${nPro(prosFor().length)}</button></div>` });

def({ id: 'P36', name: 'Resultados en mapa (opcional)', kind: 'map', back: true, sheetCls: 'lite',
  map: () => ({ home: P().ll, dots: prosFor().map(p => [ll(p), p.id === S.pro ? '#111111' : '#7A7CF0']), maxZoom: 15 }),
  body: () => { const l = prosFor(); return `<div class="shd" style="margin-top:0"><h3>${nPro(l.length)}</h3><button class="lk" data-go="back">Ver lista</button></div><div class="sm t2">${svcN(S.item)} · ${P().c}</div><div class="mcar mt12">${l.map(p => `<div class="mcard ${S.pro === p.id ? 'on' : ''}" data-act="pick" data-arg="${p.id}|" data-go="P12" role="button">${pav(p, 's', true)}<div class="tx"><div class="b-m">${p.n}</div><div class="sm t2">${rate(p)} · ${kmT(p)}</div></div><b class="num">${clp(priceOf(p, S.item))}</b></div>`).join('')}</div>`; } });

/* ---------- perfil de la profesional ---------- */
function profileBody(p, mode = 'm') {
  const d = mode === 'd', pre = mode === 'pre', rv = revsOf(p.id), it = S.item && priceOf(p, S.item) ? S.item : '';
  const svcList = svcsOf(p).map(k => { const sel = it === k; const inc = incOf(p, k); return `<${pre ? 'div' : 'button'} class="psvc ${sel ? 'on' : ''}" ${pre ? '' : `data-act="svc" data-arg="${k}"`}><span class="si">${i3(k)}</span><span class="tx"><span class="a">${CAT[k].n}</span><span class="b">${durOf(p, k)} min · ${shortInc(inc[0])}${inc.length > 1 ? ` y ${inc.length - 1} más` : ''}</span>${nightOf(p, k) ? `<span class="b">Desde las 21:00: ${clp(nightOf(p, k))}</span>` : ''}</span><span class="pp num">${clp(priceOf(p, k))}</span></${pre ? 'div' : 'button'}>`; }).join('');
  const avail = `<div class="avl">${DAYS.map((x, i) => { const n = slotsOf(p, i).length; return `<div class="avd ${n ? '' : 'off'}"><span>${x[2] || x[0]}</span><b>${x[1]}</b><em>${n ? n + (n === 1 ? ' hora' : ' horas') : '—'}</em></div>`; }).join('')}</div>`;
  const revs = `${scoreBlock(p)}${bars(p)}${crits(p)}<div class="rvl ${d ? 'two' : ''}">${rv.slice(0, d ? 4 : 2).map(r => rvCard(r, false, p.id)).join('')}</div>${pre ? '' : `<button class="btn sec mt16" data-go="P32">Ver las ${p.rv} reseñas</button>`}`;
  return `<div class="phero">${pav(p, 'xl', true)}<div class="ph-tx"><div class="h-l">${p.n}</div><div class="t2 mt4">${p.t} · ${p.yrs} años de experiencia</div><div class="mt8 rtl">${rate(p)}<span class="sep">·</span><span>${p.a} atenciones</span></div></div></div>
  <div class="pbadges">${sis()}<span class="badge g">${ic('shield-check', 1)}Antecedentes revisados</span><span class="badge g">${ic('identification-card', 1)}Identidad verificada</span></div>
  <div class="pstats"><div><b class="num">${p.r} ${star()}</b><span>nota</span></div><div><b class="num">${p.rv}</b><span>reseñas</span></div><div><b class="num">${p.yrs} años</b><span>de experiencia</span></div><div><b>${p.resp}</b><span>en responder</span></div></div>
  <div class="psec"><h3>Sobre ${p.g === 'm' ? 'él' : 'ella'}</h3><p class="bio">${p.bio}</p><div class="chips mt12">${p.spec.map(t => `<span class="chip dim">${t}</span>`).join('')}</div></div>
  <div class="psec"><h3>Servicios y precios</h3><div class="sm t2 mb8">Precios fijados por ${first(p)}. Insumos incluidos.</div>${svcList}</div>
  <div class="psec"><h3>Reseñas</h3>${revs}</div>
  <div class="psec"><h3>Disponibilidad</h3><div class="sm t2 mb8">Próximos 6 días</div>${avail}${pre ? '' : `<button class="lk mt12" data-go="P13">Ver todas las horas</button>`}</div>
  <div class="psec"><h3>Comunas donde atiende</h3><div class="chips">${p.com.map(c => `<span class="chip dim">${ic('map-pin')}&nbsp;${c}</span>`).join('')}</div></div>
  <div class="psec last"><h3>Estudios y certificaciones</h3>${p.edu.map(e => `<div class="edu"><span class="ei">${ic('graduation-cap')}</span><div><div class="b-m">${e[0]}</div><div class="sm t2">${e[1]} · ${e[2]}</div></div></div>`).join('')}<div class="edu"><span class="ei">${ic('seal-check')}</span><div><div class="b-m">Registro Nacional de Prestadores</div><div class="sm t2">Superintendencia de Salud · N° ${p.reg}</div></div></div></div>`;
}
const bookBar = () => { const p = PRO(), it = S.item && priceOf(p, S.item) ? S.item : ''; return `<div class="fbar"><div class="fb-l"><b class="num">${it ? clp(priceOf(p, it)) : 'Desde ' + clp(priceOf(p, ''))}</b><span>${it ? CAT[it].n : 'Elige un servicio'}</span></div><button class="btn fbtn" data-act="pick" data-arg="${p.id}|" data-go="P13">Agendar</button></div>`; };
def({ id: 'P12', name: 'Perfil de la profesional', kind: 'page', back: true, navCls: 'clear',
  navR: () => `<button class="ib" data-act="share" aria-label="Compartir">${ic('export')}</button>${heart(S.pro, 'ib')}`,
  body: () => profileBody(PRO()), foot: bookBar });

def({ id: 'P32', name: 'Todas las reseñas', kind: 'page', back: true, title: 'Reseñas', sheets: ['rsort'],
  sheet: () => `<div class="h-s">Ordenar reseñas</div><div class="mt8">${[['rec', 'Más recientes'], ['alta', 'Mejor nota'], ['baja', 'Peor nota']].map(x => radioRow(x[1], '', S.revSort === x[0], 'rsort', x[0])).join('')}</div>`,
  body: () => { const p = PRO(); let l = revsOf(p.id); const svcs = [...new Set(l.map(r => r.s))]; if (S.revF !== 'all') l = l.filter(r => r.s === S.revF); if (S.revSort === 'alta') l = l.slice().sort((a, b) => b.r - a.r); if (S.revSort === 'baja') l = l.slice().sort((a, b) => a.r - b.r);
    return `${mini(p)}<div class="mt16">${scoreBlock(p)}${bars(p)}${crits(p)}</div>
  <div class="rvbar"><div class="chips nowrap">${chip('Todas', S.revF === 'all', 'set', 'revF=all')}${svcs.map(k => chip(CAT[k].g === 'cur' || CAT[k].g === 'iny' ? GRP[CAT[k].g].c : CAT[k].s, S.revF === k, 'set', 'revF=' + k)).join('')}</div></div>
  <div class="rvhd"><span class="sm t2">${l.length} de ${p.rv} reseñas</span><button class="lk" data-act="set" data-arg="sheet=rsort">${ic('arrows-down-up')} ${{ rec: 'Más recientes', alta: 'Mejor nota', baja: 'Peor nota' }[S.revSort]}</button></div>
  ${l.map(r => rvCard(r, true, p.id)).join('')}<div class="xs t3 mt16 center">Solo pueden opinar pacientes que tuvieron una atención por Cuidapp.</div>`; },
  foot: bookBar });

/* ---------- agendar ---------- */
def({ id: 'P13', name: 'Elegir servicio, día y hora', kind: 'page', back: true, title: 'Agendar', sheets: ['svc'], sheet: svcSheet,
  body: () => { const p = PRO(), l = slotsOf(p, S.day); return `${mini(p)}
  <div class="lbl2">Servicio</div><button class="svsel" data-act="set" data-arg="sheet=svc"><span class="si">${i3(S.item)}</span><span class="tx"><span class="a">${CAT[S.item].n}</span><span class="b">${durOf(p)} min · ${clp(priceOf(p, S.item))}</span></span><span class="lk">Cambiar</span></button>
  <div class="lbl2">Día</div>${dstrip(p, 'day', 'day')}
  <div class="lbl2">Hora de llegada · ${DAYS[S.day][3].replace('hoy ', '')}</div>
  ${groups(l).map(g => `<div class="sgrp"><div class="sg-t">${g[0]}</div><div class="slots3">${g[1].map(t => `<button class="slot ${S.slot === t ? 'on' : ''}" data-act="set" data-arg="slot=${t}">${t}${t >= '21:00' && nightOf(p) ? '<small>noche</small>' : ''}</button>`).join('')}</div></div>`).join('')}
  <div class="mt16 col8">${S.slot >= '21:00' && nightOf(p) ? note('moon', `Horario nocturno: ${first()} cobra ${clp(nightOf(p))} desde las 21:00.`) : ''}${note('calendar-check', `Llega entre ${S.slot} y ${slotEnd(S.slot)}. Cancelación gratis hasta 12 horas antes.`)}</div>`; },
  foot: () => `<div class="fbar"><div class="fb-l"><b class="num">${clp(price().pro)}</b><span>${dayLbl(S.day)} · ${S.slot}</span></div><button class="btn fbtn" data-act="set" data-arg="addrNext=P14" data-go="P14">Continuar</button></div>` });

const steps = n => `<div class="steps">${['Hora', 'Detalles', 'Pago'].map((t, i) => `<span class="${i < n ? 'done' : i === n ? 'on' : ''}">${t}</span>`).join('')}</div>`;
const nEx = () => { const l = examList().map(e => e[0]); return l.length > 2 ? `${l.slice(0, 2).join(', ')} y ${l.length - 2} más` : l.join(' y '); };
function nextAfterP14() { return CAT[S.item].receta ? 'P15' : 'P17'; }
def({ id: 'P14', name: 'Dirección y detalles', kind: 'page', back: true, title: 'Detalles', next: ['P15', 'P17', 'P40'],
  body: () => {
    const who = `<div class="lbl2">¿Para quién es?</div>${row('box:user', whoTxt(), S.who === 'mama' ? '78 años · Alergia a penicilina' : S.who === 'papa' ? '80 años · Hipertenso' : '37 años', 'P29', '<span class="lk">Cambiar</span>')}`;
    const addr = `<div class="lbl2">Dirección</div>${row('box:map-pin', P().n, P().full.split(', ').slice(1).join(', '), 'P08', '<span class="lk">Cambiar</span>', '', 'set', 'addrNext=P14')}`;
    const head = `${steps(1)}<div class="h-l mt16">${CAT[S.item].n}</div><div class="t2 mt4 sm">Con ${PRO().n} · ${whenTxt()}</div>`;
    let x;
    if (S.item === 'mue') x = `<div class="lbl2">Exámenes · ${LAB}</div>${row('box:test-tube', byOrder() ? 'Según orden médica' : nEx(), byOrder() ? 'Precio por confirmar' : clp(examSum()) + ' · ' + (fasting() ? 'con ayuno' : 'sin ayuno'), 'P40', '<span class="lk">Cambiar</span>')}`;
    else if (S.item === 'tens4') x = `<div class="lbl2">¿Qué necesita?</div><div class="chips">${[['hig', 'Higiene y baño'], ['mov', 'Movilización'], ['sig', 'Signos vitales'], ['com', 'Compañía']].map(t => chip(t[1], S.tensNeeds[t[0]], 'tog', 'tensNeeds.' + t[0])).join('')}</div><div class="lbl2">${('Algo que deba saber')}</div>${field('', 'Usa andador. Diabética, controla glicemia en la mañana.')}`;
    else if (S.item === 'iny') x = `<div class="lbl2">Medicamento</div>${field('pill', 'Neurobionta 5.000 (ampolla)')}<div class="lbl2">${('¿Ya tienes el medicamento?')}</div><div class="chips">${chip('Sí, lo tengo', S.hasMed, 'set', 'hasMed=1')}${chip('Todavía no', !S.hasMed, 'set', 'hasMed=')}</div>${!S.hasMed ? `<div class="mt12">${note('warning', 'La profesional no lleva medicamentos. Cómpralo antes de la hora.', 'warn')}</div>` : ''}`;
    else x = `<div class="lbl2">Cuéntanos qué necesitas</div>${field('', S.item === 'son' ? 'Cambio de sonda Foley.' : S.item === 'sig' ? 'Control de presión y glicemia.' : 'Herida en el talón, curación cada 2 días.')}`;
    return `${head}${addr}${who}${x}<div class="lbl2">${('Nota para ' + first() + ' (opcional)')}</div>${field('', '', 'Ej.: el timbre no funciona, llamar al llegar')}`;
  },
  foot: () => `<button class="btn" data-go="${nextAfterP14()}">Continuar</button>` });

def({ id: 'P15', name: 'Receta médica', kind: 'page', back: true, title: 'Receta médica',
  body: () => `${steps(1)}<div class="h-m mt16">Sube la receta médica</div><div class="t2 mt8 sm">Sin receta no se ponen inyecciones. ${first()} la revisa antes de confirmar.</div>
  <div class="mt16">${S.receta ? `<div class="recok">${receta()}<div>${st('ok', 'Se lee bien', 'check-circle')}<button class="pill mt12" data-act="set" data-arg="receta=">${ic('arrow-counter-clockwise')}Cambiar</button></div></div>`
    : `<div class="drop"><div class="row8"><button class="pill on" data-act="receta">${ic('camera')}Tomar foto</button><button class="pill" data-act="receta">${ic('image')}Elegir de fotos</button></div><div class="t3 sm">Foto completa, derecha y con luz</div></div>`}</div>
  <div class="lbl2">Revisa que se vea</div>
  ${['Nombre del paciente', 'Medicamento, dosis y frecuencia', 'Firma y timbre del médico', 'Fecha (menos de 6 meses)'].map(t => `<div class="chk">${ic('check')}<span>${t}</span></div>`).join('')}`,
  foot: () => abtn('Continuar', '', '', '', 'P17', !S.receta) });

const breakdown = () => { const p = price(); if (S.item === 'mue') return `${kv(p.L[0][0], clp(p.L[0][1]))}${p.pend ? kv('Exámenes (laboratorio)', 'Por confirmar') : `${kv(p.L[1][0], clp(p.L[1][1]))}<div class="exsub">${examList().map(e => `<span>${e[0]}</span><span class="num">${clp(e[1])}</span>`).join('')}</div>`}${kv('Cargo por servicio', '$0')}${kv(p.pend ? 'Total por ahora' : 'Total', clp(p.total), 'tot')}`;
  return `${p.L.map(l => kv(l[0], clp(l[1]))).join('')}${kv('Cargo por servicio', '$0')}${kv('Total', clp(p.total), 'tot')}`; };

def({ id: 'P17', name: 'Revisa y paga', kind: 'page', back: true, title: 'Revisa y paga',
  body: () => `${steps(2)}<div class="rvw mt16"><div class="rvw-h">${pav(PRO(), '', true)}<div><div class="b-m">${CAT[S.item].n}</div><div class="sm t2">con ${PRO().n} · ${rate(PRO(), false)}</div></div></div>
  <div class="rvw-r">${ic('calendar-blank')}<span>${whenLong()}</span><button class="lk" data-go="P13">Cambiar</button></div>
  <div class="rvw-r">${ic('map-pin')}<span>${P().full}</span><button class="lk" data-act="set" data-arg="addrNext=P17" data-go="P08">Cambiar</button></div>
  <div class="rvw-r">${ic('user')}<span>${whoTxt()}</span><button class="lk" data-go="P29">Cambiar</button></div>
  ${S.item === 'iny' ? `<div class="rvw-r">${ic('file-text')}<span>Receta adjunta · Neurobionta 5.000</span><button class="lk" data-go="P15">Ver</button></div>` : ''}${S.item === 'mue' ? `<div class="rvw-r">${ic('test-tube')}<span>${byOrder() ? 'Orden médica adjunta' : nEx()}</span><button class="lk" data-go="P40">Cambiar</button></div>` : ''}</div>
  <div class="lbl2">Pago</div>${row('box:' + (S.pay === 'mp' ? 'wallet' : 'credit-card'), S.pay === 'mp' ? 'Saldo Mercado Pago' : S.pay === 'deb' ? 'Redcompra •••• 0937' : 'Visa •••• 4821', 'Con Mercado Pago', 'P18', '<span class="lk">Cambiar</span>')}
  <div class="lbl2">Desglose</div>${breakdown()}<div class="xs t2 mt4">${S.item === 'mue' ? `${first()} fija la toma. Los exámenes tienen el precio del ${LAB.toLowerCase()}.` : `El precio lo fija ${first()}. Sin cobros extra.`}</div>
  <div class="mt16 col8">${note('lock-simple', `No te cobramos todavía. Cuando ${first()} confirme, retenemos ${clp(price().total)} y se cobra al terminar la atención.`, 'inf')}${note('calendar-x', 'Cancelación gratis hasta 12 horas antes.')}</div>`,
  foot: () => `<div class="fbar"><div class="fb-l"><b class="num">${clp(price().total)}</b><span>Total</span></div><button class="btn fbtn" data-go="P19" data-act="set" data-arg="cancelFrom=P19">Confirmar y pagar</button></div>` });

def({ id: 'P18', name: 'Métodos de pago', kind: 'page', back: true, title: 'Pago',
  body: () => `${radioRow('Visa •••• 4821', 'Tarjeta de crédito', S.pay === 'visa', 'set', 'pay=visa', 'credit-card')}
  ${radioRow('Redcompra •••• 0937', 'Tarjeta de débito', S.pay === 'deb', 'set', 'pay=deb', 'credit-card')}
  ${radioRow('Saldo Mercado Pago', 'Disponible $52.300 · daniela.fuentes@gmail.com', S.pay === 'mp', 'set', 'pay=mp', 'wallet')}
  ${row('box:plus', 'Agregar tarjeta', 'Débito o crédito', '', ic('caret-right'), '', 'toast', 'Se abre el checkout de Mercado Pago para agregar tu tarjeta.')}
  <div class="mt16">${note('shield-check', 'Pagas con Mercado Pago: tarjetas de crédito, débito o saldo Mercado Pago. Cuidapp no guarda los números de tu tarjeta.')}</div>`,
  foot: () => btn('Listo', 'back') });

def({ id: 'P19', name: 'Esperando confirmación', kind: 'page', auto: 'P20', autoAct: () => { S.booked = true; },
  body: () => `<div class="center" style="margin-top:32px">${pav(PRO(), 'xl', true)}</div><div class="h-l mt24 center">Le enviamos tu solicitud a ${first()}</div>
  <div class="t2 mt8 center">Suele responder en ${PRO().resp}. Si no puede, te avisamos y eliges a otra.</div>
  <div class="progress bar-anim mt24"><span></span></div>
  <div class="mt16">${row('box:check', 'Solicitud enviada', `${CAT[S.item].n} · ${whenTxt()}`, '', '')}${row('box:hourglass-medium', `${first()} revisa tu solicitud`, S.item === 'iny' ? 'También revisa la receta' : 'Y confirma la hora', '', st('inf', 'En curso'))}${row('box:lock-simple', 'Aún no te cobramos nada', `Retenemos ${clp(price().total)} cuando confirme`, '', '')}</div>`,
  foot: () => `${btn('Ir a Servicios', 'P06', 'sec')}${btn('Cancelar solicitud', 'P30', 'ghost')}`, enter: () => T(() => { S.booked = true; go('P20'); }, 4500) });

def({ id: 'P20', name: 'Cita confirmada', kind: 'page', next: ['P21'],
  body: () => `<div class="okc mt24">${ic('check', 0).replace('ph ', 'ph-bold ')}</div>
  <div class="h-l mt16">¡Listo! ${first()} confirmó tu cita</div><div class="t2 mt8">${whenLong()}</div>
  <div class="rvw mt24"><div class="rvw-h">${pav(PRO(), '', true)}<div><div class="b-m">${PRO().n}</div><div class="sm t2">${PRO().t} · ${PRO().tel}</div></div></div>
  <div class="rvw-r">${ic(CAT[S.item].ic)}<span>${CAT[S.item].n} · ${whoTxt()}</span></div><div class="rvw-r">${ic('map-pin')}<span>${P().full}</span></div><div class="rvw-r">${ic('lock-simple')}<span>Retuvimos ${clp(price().total)} en Mercado Pago · se cobra al terminar</span></div></div>
  <div class="mt12">${note('envelope-simple', 'Te enviamos el comprobante por correo. El día antes te recordamos la cita con una notificación push.')}</div>
  ${acts([['chat-circle', `Escribirle a ${first()}`, '', '', 'P22'], ['calendar-plus', 'Agregar a mi calendario', 'toast', 'Agregado a tu calendario.'], ['share-network', 'Compartir con la familia', 'toast', 'Link copiado. Mándalo por WhatsApp.']])}`,
  foot: () => `${abtn('Ver mis citas', 'book', '', '', 'P26')}${btn('Ir a Servicios', 'P06', 'ghost')}` });

const trackBody = () => `<div class="trk-h"><div class="h-m">Va en camino · llega en <span id="eta" class="num">${P().min + 3}</span> min</div></div><div class="sm t2 mt4">${dayShort(S.day)} · ${S.slot} · ${CAT[S.item].n}</div>
  <div class="progress mt12"><span id="etabar" style="width:4%"></span></div>
  <div class="mt16">${proCard(false, true)}</div>
  <div class="note inf mt12">${ic('key')}<div>Tu código es <b class="num" style="font-size:17px;letter-spacing:2px">2749</b>. Dáselo a ${first()} cuando llegue.</div></div>
  <div class="row8 mt12"><button class="btn sec" data-go="P22">${ic('chat-circle')}Mensaje</button><button class="btn sec" data-act="toast" data-arg="Llamando a ${first()}…">${ic('phone')}Llamar</button></div>
  <button class="btn ghost mt8" style="color:var(--danger)" data-act="set" data-arg="cancelFrom=P21" data-go="P30">Cancelar atención</button>`;
const trackMap = () => ({ home: P().ll, pro: P().route[0], route: P().route, anim: { route: P().route, dur: 16000, tick: k => { const e = $('#eta'); if (e) e.textContent = Math.max(1, Math.round((P().min + 3) * (1 - k))); const b = $('#etabar'); if (b) b.style.width = Math.max(4, k * 100) + '%'; }, end: () => { S.phase = 'llego'; go('P23'); } } });
def({ id: 'P21', name: 'Va en camino (mapa)', kind: 'map', back: true, auto: 'P23', autoAct: () => { S.phase = 'llego'; }, map: trackMap, body: trackBody });

def({ id: 'P22', name: 'Chat con la profesional', kind: 'page', back: true, title: '',
  body: () => `${mini(PRO(), `${PRO().t} · ${S.booked ? whenTxt() : 'responde en ~' + PRO().resp}`)}
  <div class="mt12">${note('shield', S.booked ? 'Por tu seguridad, no compartas datos de tarjetas ni claves.' : 'Paga siempre por la app: así tu cita queda protegida.')}</div>
  ${S.booked ? `<div class="ts">${dayShort(S.day)} 07:41</div>
  <div class="bubble they">Hola Daniela, soy ${first()}. Voy en camino, llego a las ${S.slot}.</div>
  <div class="bubble me">Hola, gracias. Es el depto 1204, torre B. El conserje sabe.</div>
  <div class="bubble they">Perfecto. ¿La Neurobionta está en el refri?</div><div class="bubble me">Sí, ahí está.</div>`
    : `<div class="ts">Hoy 20:52</div><div class="bubble me">Hola ${first()}, ¿llevas tú la jeringa y las tórulas?</div>
  <div class="bubble they">Hola Daniela. Sí, llevo todo. Solo ten el medicamento y la receta a mano.</div>`}${S.chat.map(c => `<div class="bubble me">${c}</div>`).join('')}`,
  foot: () => `<div class="row8 ac">${field('', '', 'Escribe un mensaje')}<button class="ib send" data-act="send" aria-label="Enviar">${ic('paper-plane-right', 1)}</button></div>` });

def({ id: 'P23', name: 'Llegó y atención en curso', kind: 'page', auto: 'P24', autoAct: () => { S.phase = 'curso'; },
  body: () => S.phase === 'llego' ? `<div class="mt16">${proCard(true)}</div><div class="h-l mt24">${first()} llegó</div><div class="t2 mt8">Dale este código para confirmar que es ella.</div>
  <div class="code mt16">${'2749'.split('').map(d => `<span>${d}</span>`).join('')}</div><div class="mt24">${note('identification-card', 'También te mostrará su credencial de Cuidapp con foto.')}</div>`
    : `<div class="mt16">${proCard(true)}</div><div class="h-l mt24">Atención en curso</div><div class="t2 mt8">Comenzó a las ${S.slot} · ${CAT[S.item].n}</div><div class="progress bar-anim mt16"><span></span></div>
  <div class="mt16">${row('box:check', 'Código confirmado', 'Identidad verificada', '', '')}${S.item === 'iny' ? row('box:file-text', 'Receta revisada', 'Neurobionta 5.000 · 1 ampolla', '', '') : ''}${row('box:hand-heart', 'Atendiendo a ' + whoTxt().split(' (')[0], '', '', '')}</div>`,
  foot: () => S.phase === 'llego' ? abtn('Ya está conmigo', 'inCourse') : btn('Avisar un problema', 'P22', 'sec'),
  enter: () => { if (S.phase === 'curso') T(() => go('P24'), 6000); } });

def({ id: 'P24', name: 'Atención terminada', kind: 'page',
  body: () => `<div class="okc mt24">${ic('check', 0).replace('ph ', 'ph-bold ')}</div>
  <div class="h-l mt16">Atención terminada</div><div class="t2 mt8">${S.item === 'iny' ? 'Inyección de Neurobionta aplicada' : CAT[S.item].n} a ${whoTxt().split(' (')[0]}</div>
  <div class="lbl2">Nota de ${first()}</div><div class="note">${ic('note')}<div>${S.item === 'iny' ? 'Glúteo derecho. Sin reacción. Próxima dosis en 48 h según receta.' : 'Sin novedades. Dejé indicaciones escritas en la mesa del comedor.'}</div></div>
  <div class="mt16">${kv('Cobrado con Mercado Pago · ' + (S.pay === 'mp' ? 'saldo' : S.pay === 'deb' ? 'Redcompra •••• 0937' : 'Visa •••• 4821'), clp(price().total))}</div><div class="mt12">${note('envelope-simple', 'Te enviamos el comprobante por correo a daniela.fuentes@gmail.com.')}</div>`,
  foot: () => `${btn('Dejar una reseña a ' + first(), 'P25')}<div class="row8"><button class="btn sec" data-act="toast" data-arg="Te enviamos la boleta por correo a daniela.fuentes@gmail.com.">${ic('receipt')}Boleta</button><button class="btn sec" data-act="again" data-go="P13">${ic('repeat')}Agendar otra</button></div>` });

def({ id: 'P25', name: 'Dejar reseña', kind: 'page', back: 'x', title: 'Tu reseña',
  body: () => `<div class="center mt8">${pav(PRO(), 'xl', true)}</div><div class="h-m mt16 center">¿Cómo fue tu atención con ${first()}?</div><div class="sm t2 center mt4">${CAT[S.item].n} · ${dayShort(S.day)}</div>
  <div class="stars mt16">${[1, 2, 3, 4, 5].map(n => `<button class="${S.rating >= n ? 'on' : ''}" data-act="rate" data-arg="${n}" aria-label="${n} estrellas">${ic('star', 1)}</button>`).join('')}</div>
  ${S.rating ? `<div class="lbl2">¿Qué destacarías?</div><div class="chips">${['Puntual', 'Amable', 'Cuidadosa', 'Explicó todo', 'Precio justo', 'Dejó todo limpio'].map(t => chip(t, S.tags[t], 'tag', t)).join('')}</div>
  <div class="lbl2">Cuéntale a otras familias</div>${S.rtxt ? `<div class="field ta"><span>Llegó puntual, le explicó todo a mi mamá y dejó las indicaciones por escrito. Muy recomendada.</span></div>` : `<button class="field ta" data-act="rtxt"><span class="ph-t">Escribe tu experiencia (opcional)</span></button>`}
  <div class="lbl2">Propina para ${first()}</div><div class="chips">${[0, 1000, 2000, 3000].map(v => chip(v ? clp(v) : 'Sin propina', S.tip === v, 'set', 'tip=' + v)).join('')}</div>
  <div class="xs t3 mt16">Se publica en su perfil con tu nombre y comuna. La propina es 100% para ella.</div>` : '<div class="t3 sm mt16 center">Toca una estrella</div>'}`,
  foot: () => abtn('Publicar reseña', 'sent', '', '', 'P26', !S.rating) });

/* ---------- Mis citas ---------- */
const citaCard = (c) => `<button class="cita" data-act="set" data-arg="det=${c.det}" data-go="P27"><span class="db"><span>${c.dw}</span><b>${c.dn}</b></span><span class="tx"><span class="a">${c.svc}</span><span class="b">${c.time}</span><span class="c">${pav(PRO(c.pro), 'xs')}${PRO(c.pro).n}</span>${c.st ? `<span class="cst">${c.st}</span>` : ''}</span>${ic('caret-right')}</button>`;
def({ id: 'P26', name: 'Mis citas', kind: 'page', tab: 'citas',
  body: () => { const next = [], past = [];
    if (S.booked && !S.hecho) next.push({ det: 'next', dw: DAYS[S.day][0], dn: DAYS[S.day][1], svc: CAT[S.item].n, time: `${S.slot} a ${slotEnd(S.slot)} · ${P().c}`, pro: S.pro, st: st('ok', 'Confirmada') });
    next.push({ det: 'next', dw: 'Vie', dn: 30, svc: 'Inyección intramuscular · 2ª dosis', time: '08:00 a 08:30 · Ñuñoa', pro: 'cr', st: st('warn', 'Por confirmar') });
    if (S.hecho) past.push({ det: 'past', dw: DAYS[S.day][0], dn: DAYS[S.day][1], svc: CAT[S.item].n, time: `${clp(price().total)} · Ñuñoa`, pro: S.pro, st: '' });
    past.push({ det: 'pastm', dw: 'Oct', dn: 3, svc: 'Toma de muestras', time: '$40.300 · Ñuñoa', pro: 'pg', st: st('ok', 'Resultados listos', 'file-pdf') }, { det: 'past', dw: 'Sep', dn: 12, svc: 'Curación simple', time: '$24.000 · Ñuñoa', pro: 'cr', st: '' });
    const l = S.ctab === 'next' ? next : past;
    return `<h1 class="h-xl mt8">Mis citas</h1><div class="seg mt16"><button class="${S.ctab === 'next' ? 'on' : ''}" data-act="set" data-arg="ctab=next">Próximas</button><button class="${S.ctab === 'past' ? 'on' : ''}" data-act="set" data-arg="ctab=past">Pasadas</button></div>
  <div class="citas mt16">${l.map(citaCard).join('')}</div>
  ${S.ctab === 'past' ? `<div class="again mt16"><div><div class="b-m">¿Repetimos con Camila?</div><div class="sm t2">Curación simple · ${clp(priceOf(PRO('cr'), 'cur'))}</div></div><button class="pill on" data-act="pick" data-arg="cr|" data-go="P13">${ic('repeat')}Agendar</button></div>` : `<button class="newb mt16" data-go="P07">${ic('plus')}Agendar otro servicio</button>`}`; } });

def({ id: 'P27', name: 'Detalle de la cita', kind: 'page', back: true, title: 'Detalle de la cita', next: ['P21', 'P13', 'P42'],
  body: () => S.det === 'next' ? `<div class="h-l">${CAT[S.item].n}</div><div class="t2 mt4">${whenLong()}</div><div class="mt8">${st('ok', 'Confirmada', 'check-circle')}</div>
  <div class="rvw mt16"><div class="rvw-h" data-act="pick" data-arg="${S.pro}|" data-go="P12" role="button">${pav(PRO(), '', true)}<div style="flex:1"><div class="b-m">${PRO().n}</div><div class="sm t2">${PRO().t} · ${rate(PRO(), false)}</div></div>${ic('caret-right')}</div>
  <div class="rvw-r">${ic('map-pin')}<span>${P().full}</span></div><div class="rvw-r">${ic('user')}<span>${whoTxt()}</span></div><div class="rvw-r">${ic('lock-simple')}<span>${clp(price().total)} retenido · se cobra al terminar</span></div></div>
  ${S.item === 'mue' ? `<div class="lbl2">Exámenes · ${LAB}</div>${byOrder() ? row('box:file-text', 'Según orden médica', 'El laboratorio confirma el precio', '', '') : examList().map(e => kv(e[0], clp(e[1]))).join('')}${row('box:file-pdf', 'Resultados', 'Disponibles en PDF 24 a 48 horas después de la toma', '', st('neu', 'Pendiente', ''))}` : ''}
  ${acts([['chat-circle', `Chat con ${first()}`, '', '', 'P22'], ['navigation-arrow', 'Ver dónde viene (el día de la cita)', '', '', 'P21'], ['calendar-blank', 'Cambiar día u hora', '', '', 'P13'], ['calendar-plus', 'Agregar a mi calendario', 'toast', 'Agregado a tu calendario.']])}
  <div class="mt16">${note('calendar-x', 'Cancelación gratis hasta 12 horas antes. Después se cobra $5.000 por el traslado.')}</div>
  <button class="btn ghost mt8" style="color:var(--danger)" data-act="set" data-arg="cancelFrom=P27" data-go="P30">Cancelar cita</button>`
    : S.det === 'pastm' ? `<div class="h-l">Toma de muestras</div><div class="t2 mt4">3 oct · 07:30 · Av. Irarrázaval 3450, Ñuñoa</div><div class="mt16">${proCard(false, false, 'pg')}</div>
  <div class="lbl2">Resultados</div>${row('box:file-pdf', 'Resultados en PDF', `${LAB} · 4 oct`, 'P42', st('ok', 'Listos'))}
  <div class="lbl2">Pago</div>${kv('Toma a domicilio · Paula', '$12.000')}${kv('Hemograma', '$6.500')}${kv('Perfil lipídico', '$8.900')}${kv('Perfil bioquímico', '$12.900')}${kv('Total · Visa •••• 4821', '$40.300', 'tot')}`
    : `<div class="h-l">Curación simple</div><div class="t2 mt4">12 sep · 19:00 a 19:45 · Av. Irarrázaval 3450, Ñuñoa</div><div class="mt16">${proCard()}</div>
  <div class="lbl2">Pago</div>${kv('Curación simple · precio de Camila', '$24.000')}${kv('Total · Visa •••• 4821', '$24.000', 'tot')}
  <div class="lbl2">Nota de la profesional</div><div class="note">${ic('note')}<div>Herida limpia, sin signos de infección. Repetir en 48 h.</div></div>`,
  foot: () => S.det === 'next' ? `<div class="row8"><button class="btn sec" data-go="P22">${ic('chat-circle')}Chat</button><button class="btn" data-go="P21">Va en camino</button></div>` : `<div class="row8"><button class="btn sec" data-act="toast" data-arg="Te enviamos la boleta por correo a daniela.fuentes@gmail.com.">${ic('receipt')}Boleta</button><button class="btn sec" data-act="toast" data-arg="Te escribimos por WhatsApp en menos de 10 minutos.">${ic('lifebuoy')}Ayuda</button></div>${abtn('Agendar otra vez', 'pick', 'cr|', '', 'P13')}` });

def({ id: 'P42', name: 'Resultados de exámenes', kind: 'page', back: true, title: 'Resultados',
  body: () => `<div class="pdf"><div class="pdf-h"><div><b>${LAB}</b><div class="xs t2">Informe de resultados · 4 oct 2026</div></div>${ic('file-pdf', 1)}</div>
  <div class="xs t2 mt8">Paciente: <b style="color:var(--text)">Rosa Muñoz Pérez</b> · 78 años · Toma: 3 oct 07:30 · Paula Godoy (TENS)</div>
  <table class="rtab mt12"><tr><th>Examen</th><th>Resultado</th><th>Referencia</th></tr>
  ${[['Hemoglobina', '13,2 g/dL', '12 – 16'], ['Leucocitos', '6.800 /µL', '4.500 – 11.000'], ['Plaquetas', '245.000 /µL', '150.000 – 400.000'], ['Colesterol total', '<b>212 mg/dL</b>', '< 200'], ['HDL', '54 mg/dL', '> 40'], ['LDL', '<b>131 mg/dL</b>', '< 130'], ['Triglicéridos', '138 mg/dL', '< 150'], ['Glucosa', '96 mg/dL', '70 – 100'], ['Creatinina', '0,9 mg/dL', '0,5 – 1,1']].map(r => `<tr><td>${r[0]}</td><td class="num">${r[1]}</td><td class="num t2">${r[2]}</td></tr>`).join('')}</table>
  <div class="xs t3 mt12">Valores en negrita fuera de rango. Este informe no reemplaza la evaluación de tu médico.</div></div>`,
  foot: () => `${abtn(ic('download-simple') + 'Descargar PDF', 'toast', 'Descargado: Resultados-Rosa-Munoz-04-10-2026.pdf')}${abtn(ic('share-network') + 'Enviar a mi médico', 'toast', 'Listo. Le enviamos el PDF a la Dra. Marcela Ortiz.', 'sec')}` });

def({ id: 'P45', name: 'Promoción', kind: 'page', back: true, title: '', next: ['P40', 'P10'],
  body: () => { const k = S.promo, p = PROMO[k];
    const det = k === 'kin' ? `<div class="mt16">${row('box:person-simple-walk', 'Kinesiología motora', 'Después de una cirugía, caídas o reposo largo', '', '')}${row('box:wind', 'Kinesiología respiratoria', 'Para niños y adultos mayores', '', '')}${row('box:map-pin', 'Primero en Ñuñoa y Providencia', 'Te avisamos por correo cuando abra', '', '')}</div>`
      : k === 'first' ? `<button class="codebox mt16" data-act="code"><span><span class="xs t2">Tu código</span><b>CUIDA20</b></span><span class="lk">${ic('copy')}Copiar</span></button>
        <div class="lbl2">Condiciones</div><div class="sm t2" style="line-height:21px">20% en tu primera atención en Cuidapp, con tope de $10.000. Vale para cualquier servicio y profesional. No aplica a los exámenes del laboratorio. Válido hasta el 30 nov 2026.</div>`
      : `<div class="mt16">${row('box:test-tube', 'Elige exámenes por $30.000 o más', 'Precios fijos del laboratorio aliado', '', '')}${row('box:house-line', 'La toma a domicilio queda en $0', 'Se descuenta sola en el resumen', '', '')}${row('box:file-pdf', 'Resultados en PDF', 'En 24 a 48 horas, en el detalle de tu cita', '', '')}</div>
        <div class="xs t3 mt12">Ejemplo: hemograma + perfil lipídico + perfil bioquímico = $28.300, agrega glicemia y ya califica.</div>`;
    return `<div class="promo big ${p.cls}"><div class="pr-tx"><span class="pr-eb">${p.eb}</span><b class="pr-t">${p.t}</b><span class="pr-d">${p.d}</span></div><span class="pr-ic">${i3(p.ic)}</span></div>${det}<div class="xs t3 mt24">Promoción de ejemplo del prototipo.</div>`; },
  foot: () => S.promo === 'kin' ? abtn(S.kinAv ? ic('check') + 'Te avisaremos' : ic('bell') + 'Avísame cuando abra', 'kinAv', '', S.kinAv ? 'sec' : '')
    : S.promo === 'first' ? btn('Buscar profesional', 'P10', '', 'data-act="svc" data-arg=""') : abtn('Elegir exámenes', 'grp', 'mue', '', 'P40') });

def({ id: 'P34', name: 'Favoritos', kind: 'page', tab: 'favoritos',
  body: () => { const l = PROS.filter(p => S.fav[p.id]); return `<h1 class="h-xl mt8">Favoritos</h1><div class="t2 sm mt4">Tus profesionales de confianza, para volver a agendar en dos toques.</div>
  ${l.length ? `<div class="rlist mt16">${l.map(p => `<div class="favc" data-act="pick" data-arg="${p.id}|" data-go="P12" role="button">${pav(p, 'l', true)}<div class="tx"><div class="b-m">${p.n}</div><div class="sm t2">${p.t} · ${rate(p)}</div><div class="sm t2">Desde <b class="num">${clp(priceOf(p, ''))}</b> · ${nextOf(p) ? 'Próxima: ' + dayLbl(nextOf(p)[0]) + ' ' + nextOf(p)[1] : 'Sin horas'}</div></div>${heart(p.id)}<button class="pill on fbk" data-act="pick" data-arg="${p.id}|" data-go="P13">Agendar</button></div>`).join('')}</div>`
    : `<div class="empty mt24">${ic('heart')}<div class="b-m mt8">Aún no tienes favoritas</div><div class="sm t2 mt4">Toca el corazón en un perfil para guardarla aquí.</div>${btn('Buscar profesionales', 'P10', 'sec')}</div>`}`; } });

def({ id: 'P28', name: 'Cuenta', kind: 'page', tab: 'cuenta',
  body: () => `<div class="acct mt8"><div><h1 class="h-xl">Daniela</h1><div class="sm t2 mt4">${st('ok', 'Cuenta verificada', 'seal-check')}</div></div>${av('DF', 'l')}</div>
  <div class="tiles2 mt24">${[['lifebuoy', 'Ayuda', '', 'toast', 'Te escribimos por WhatsApp en menos de 10 minutos.'], ['credit-card', 'Pagos', 'P18'], ['calendar-blank', 'Mis citas', 'P26']].map(t => `<button class="tile" ${t[2] ? `data-go="${t[2]}"` : `data-act="${t[3]}" data-arg="${t[4]}"`}>${ic(t[0])}<span class="n">${t[1]}</span></button>`).join('')}</div>
  <div class="mt16">${row('users', 'Pacientes', 'Tú, Rosa y Luis', 'P29')}${row('map-pin', 'Direcciones', 'Casa y Mamá', 'P08', ic('caret-right'), '', 'set', 'addrNext=P28')}${row('heart', 'Favoritos', `${Object.values(S.fav).filter(Boolean).length} profesionales`, 'P34')}${row('shield-check', 'Datos de salud y privacidad', 'Consentimiento y descarga de tus datos', 'P04')}${row('stethoscope', 'Trabaja con Cuidapp', 'Para enfermeras y TENS', 'R01')}${row('sign-out', 'Cerrar sesión', '', 'P01', '')}</div>` });

def({ id: 'P29', name: 'Pacientes guardados', kind: 'page', back: true, title: 'Pacientes',
  body: () => `<div class="t2 sm">¿Para quién es la atención?</div><div class="mt8">
  ${radioRow('Rosa Muñoz · mamá', '78 años · Alergia a penicilina', S.who === 'mama', 'set', 'who=mama', 'user')}
  ${radioRow('Luis Fuentes · papá', '80 años · Hipertenso', S.who === 'papa', 'set', 'who=papa', 'user')}
  ${radioRow('Daniela Fuentes · tú', '37 años', S.who === 'yo', 'set', 'who=yo', 'user')}
  ${row('box:plus', 'Agregar paciente', 'Nombre, RUT, edad y alergias', '', ic('caret-right'), '', 'toast', 'Agrega nombre, RUT, edad y alergias del paciente.')}</div>`,
  foot: () => btn('Listo', 'back') });

def({ id: 'P30', name: 'Cancelar', kind: 'page', back: true, title: 'Cancelar',
  body: () => `<div class="h-m">¿Por qué cancelas?</div><div class="mt8">${['Ya no la necesito', 'Me equivoqué de hora o dirección', 'Encontré otra hora', 'Otro motivo'].map((t, i) => radioRow(t, '', (S.cr || 0) === i, 'set', 'cr=' + i)).join('')}</div>
  <div class="mt16">${S.cancelFrom === 'P21' ? note('warning', `${first()} ya va en camino. Se cobra $5.000 por el traslado y liberamos el resto.`, 'warn') : S.cancelFrom === 'P19' ? note('check-circle', 'Aún no te cobramos nada. Cancelar no tiene costo.') : note('check-circle', `Faltan más de 12 horas: cancelar es gratis y liberamos los ${clp(price().total)} retenidos.`)}</div>`,
  foot: () => `${abtn('Cancelar cita', 'cancel', '', 'danger', 'P06')}${btn('Volver', 'back', 'ghost')}` });

/* ===== escritorio paciente ===== */
def({ id: 'W01', name: 'Servicios (web)', kind: 'dfree', dtab: 'servicios', sheets: ['wsvc'],
  sheet: () => `<div class="h-s">¿Qué servicio necesitas?</div>${GK.map(g => `<div class="lbl2">${GRP[g].n}</div>${GRP[g].l.map(k => svcRow(k)).join('')}`).join('')}`,
  body: () => `<section class="whero"><div class="wh-in"><h1 class="h-xxl">Enfermeras y TENS a domicilio, con precio y reseñas a la vista</h1><p class="t2 lg mt16">Busca el servicio, compara profesionales verificadas en ${P().c} y agenda la hora que te acomode.</p>
  <div class="wsearch mt32"><button class="ws-f" data-act="set" data-arg="sheet=wsvc"><span class="xs t2">Servicio</span><b>${svcN(S.item)}</b></button><span class="ws-d"></span><button class="ws-f" data-act="set" data-arg="addrNext=W01" data-go="P08"><span class="xs t2">Dirección</span><b>${P().n}, ${P().c}</b></button><button class="btn ws-b" data-go="W02">${ic('magnifying-glass')}Buscar</button></div>
  <div class="chips mt16">${['iny', 'mue', 'cur', 'sig'].map(k => `<button class="chip" data-act="svc" data-arg="${k}" data-go="${k === 'mue' ? 'P40' : 'W02'}">${k === 'mue' ? 'Exámenes de sangre' : CAT[k].n}</button>`).join('')}</div></div></section>
  <section class="wsec wpromo"><div class="wprow">${Object.keys(PROMO).map(promoCard).join('')}</div></section>
  <section class="wsec"><h2 class="h-l">Explora por servicio</h2><div class="wcats mt24">${GK.map(k => { const [n, mn] = grpStats(k); return `<button class="wcat" data-act="grp" data-arg="${k}" data-go="${k === 'mue' ? 'P40' : GRP[k].l.length > 1 ? 'P37' : 'W02'}"><span class="ci">${i3(k)}</span><b>${GRP[k].n}</b><span class="sm t2">${GRP[k].l.length > 1 ? GRP[k].l.map(x => CAT[x].s).join(' · ') : k === 'mue' ? 'Precio del laboratorio + toma' : nPro(n) + ' · desde ' + clp(mn)}</span></button>`; }).join('')}<button class="wcat soon" data-act="kin"><span class="ci">${i3('kin')}</span><b>Kinesiología</b><span class="sm t2">Muy pronto</span></button><button class="wcat soon" data-go="P46"><span class="ci">${i3('med')}</span><b>Medicamentos</b><span class="sm t2">Muy pronto · farmacia aliada</span></button></div></section>
  <section class="wsec"><div class="shd"><h2 class="h-l">Destacadas cerca de ti</h2><button class="lk" data-act="svc" data-arg="" data-go="W02">Ver todas</button></div><div class="wfeat mt24">${featured().slice(0, 4).map(fcard).join('')}</div></section>
  <section class="wsec last"><h2 class="h-l">Cómo funciona</h2><div class="wsteps mt24">${[['magnifying-glass', 'Busca el servicio', 'Inyección, curación, exámenes o cuidados TENS.'], ['users-three', 'Compara', 'Precio, qué incluye, reseñas reales y próxima hora libre.'], ['calendar-check', 'Agenda y listo', 'Pagas en la app. Se cobra solo al terminar la atención.']].map((s, i) => `<div class="wst"><span class="n">${i + 1}</span>${ic(s[0])}<b>${s[1]}</b><span class="t2">${s[2]}</span></div>`).join('')}</div></section>` });

def({ id: 'W02', name: 'Resultados (web)', kind: 'dfree', dtab: 'servicios', sheets: ['sort'], sheet: sortSheet,
  body: () => { const l = prosFor(), [a, b] = range(l); return `<div class="wres">
  <aside class="wfil"><div class="h-s">Filtros</div>
   <div class="wf"><b>Precio</b>${hist()}<div class="chips mt8">${[[0, 'Cualquiera'], [15000, 'Hasta $15.000'], [20000, 'Hasta $20.000']].map(x => chip(x[1], S.fmax === x[0], 'set', 'fmax=' + x[0])).join('')}</div></div>
   <div class="wf"><b>Disponibilidad</b><div class="chips mt8">${[['all', 'Cualquier día'], ['hoy', 'Disponible hoy'], ['man', 'Hoy o mañana']].map(x => chip(x[1], S.fday === x[0], 'set', 'fday=' + x[0])).join('')}</div></div>
   <div class="wf"><b>Profesión</b>${checkRow('Enfermera/o', S.f.enf, 'tog', 'f.enf')}${checkRow('TENS', S.f.tens, 'tog', 'f.tens')}</div>
   <div class="wf"><b>Valoración</b><div class="chips mt8">${[[0, 'Todas'], [4.8, '4,8 o más']].map(x => chip(x[1], S.frat === x[0], 'set', 'frat=' + x[0])).join('')}</div></div>
   <div class="wf"><b>Comuna</b><div class="chips mt8">${[['', 'Todas'], ['Ñuñoa', 'Ñuñoa'], ['Providencia', 'Providencia'], ['Las Condes', 'Las Condes']].map(x => chip(x[1], S.fcom === x[0], 'set', 'fcom=' + x[0])).join('')}</div></div>
   <div class="wf last"><b>Género</b><div class="chips mt8">${[['', 'Indistinto'], ['f', 'Mujer'], ['m', 'Hombre']].map(x => chip(x[1], S.fgen === x[0], 'set', 'fgen=' + x[0])).join('')}</div></div>
   <button class="lk u mt16" data-act="clearF">Limpiar filtros</button></aside>
  <main class="wlist"><div class="wl-h"><div><h1 class="h-l">${svcN(S.item)} en ${P().c}</h1><div class="t2 mt4">${nPro(l.length)} · desde <b class="num">${clp(a)}</b> hasta <b class="num">${clp(b)}</b></div></div><button class="qc" data-act="set" data-arg="sheet=sort">${ic('arrows-down-up')}${SORTS.find(x => x[0] === S.sort)[1]}${ic('caret-down')}</button></div>
   ${S.item && CAT[S.item].receta ? `<div class="rnote mt16">${ic('file-text')}<span>Para inyecciones necesitas receta médica. La subes al agendar.</span></div>` : ''}
   <div class="rlist mt16">${l.map(p => rcard(p, true)).join('')}</div><div class="xs t3 mt16">Profesionales y precios de ejemplo.</div></main>
  <aside class="wmap"><div class="mapbox"><div class="mapwrap" data-map="1"></div></div></aside></div>`; },
  map: () => ({ home: P().ll, dots: prosFor().map(p => [ll(p), '#7A7CF0']), zoom: 13.5 }) });

def({ id: 'W03', name: 'Perfil y agenda (web)', kind: 'dfree', dtab: 'servicios', next: ['P14', 'P22', 'P32'],
  body: () => { const p = PRO(), it = S.item && priceOf(p, S.item) ? S.item : svcsOf(p)[0], l = slotsOf(p, S.day); return `<div class="wprof"><div class="wp-main"><button class="lk mb16" data-go="back">${ic('caret-left')} Volver a resultados</button>${profileBody(p, 'd')}</div>
  <aside class="wp-side"><div class="bbox"><div class="bb-h"><div><div class="sm t2">${CAT[it].n}</div><div class="h-m num">${clp(priceOf(p, it, S.slot))}</div></div><div>${heart(p.id)}</div></div>
   <div class="sm t2">${durOf(p, it)} min · ${shortInc(incOf(p, it)[0])}</div>
   <div class="lbl2">Día</div>${dstrip(p, 'day', 'day')}
   <div class="lbl2">Hora de llegada</div><div class="slots3">${l.map(t => `<button class="slot ${S.slot === t ? 'on' : ''}" data-act="set" data-arg="slot=${t}">${t}</button>`).join('')}</div>
   <div class="mt16">${kv('Total', clp(price().total), 'tot')}</div>
   <button class="btn mt16" data-act="set" data-arg="addrNext=P14" data-go="P14">Agendar</button><button class="btn ghost mt8" data-go="P22">${ic('chat-circle')}Preguntarle algo</button>
   <div class="xs t3 mt8 center">No se cobra nada hasta que ${first()} confirme.</div></div></aside></div>`; } });

def({ id: 'W04', name: 'Va en camino (web)', kind: 'map', dtab: 'citas', back: true, auto: 'P23', autoAct: () => { S.phase = 'llego'; }, map: trackMap, body: trackBody });
