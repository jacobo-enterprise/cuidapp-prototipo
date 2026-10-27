/* ===== Paciente · marketplace de servicios de enfermería ===== */
Object.assign(ACT, {
  set: a => { const i = a.indexOf('='); const k = a.slice(0, i), v = a.slice(i + 1); S[k] = k === 'code' || isNaN(+v) || v === '' ? v : +v; }, /* code: siempre texto (se compara con '2749') */
  tog: a => { const [o, k] = a.split('.'); if (k === undefined) S[o] = !S[o]; else S[o][k] = !S[o][k]; },
  homeEnf: () => { S.item = ''; S.when = 'prog'; S.f = { enf: true, tens: false, cuid: false }; },
  qtab: t => { S.qt = t; const b = document.getElementById('sres'); if (b) b.innerHTML = QRES.sres(); else render(); },
  nextFree: () => { const x = nextOf(PRO()); if (x) { S.day = x[0]; S.slot = x[1]; } },
  svc: a => { S.item = a; S.when = 'prog'; S.sheet = ''; if (a) S.grp = CAT[a].g; fixSlot(); },
  grp: k => { S.grp = k; S.item = GRP[k].l.find(x => !CAT[x].soon); S.when = 'prog'; S.sheet = ''; fixSlot(); },
  ex: k => { S.exams[k] = !S.exams[k]; },
  mmode: m => { S.mmode = m; },
  ordenUp: () => { S.orden = 'si'; },
  exq: q => { S.exq = q; },
  kinAv: () => { S.kinAv = !S.kinAv; toast(S.kinAv ? 'Listo. Te avisaremos cuando Kinesiología abra en tu comuna.' : 'Ya no te avisaremos.'); },
  promo: k => { S.promo = k; },
  code: () => toast('Código CUIDAPP15 copiado: 15% hasta $20.000.'),
  medAv: () => { S.medAv = !S.medAv; toast(S.medAv ? 'Listo. Te avisaremos cuando Medicamentos abra en tu comuna.' : 'Ya no te avisaremos.'); },
  kin: () => toast('Kinesiología llega muy pronto. Te avisamos cuando abra en tu comuna.'),
  pick: a => { const [pro, d, t] = a.split('|'); S.pro = pro; S.when = 'prog'; if (!S.item || !priceOf(PRO(), S.item)) S.item = svcsOf(PRO())[0]; if (d !== undefined && d !== '') { S.day = +d; S.slot = t; } else { const x = nextOf(PRO()); if (x) { S.day = x[0]; S.slot = x[1]; } } S.pday = S.day; },
  day: d => { S.day = +d; fixSlot(); },
  pday: d => { S.pday = +d; },
  fav: id => { S.fav[id] = !S.fav[id]; toast(S.fav[id] ? `${PRO(id).n} quedó en tus favoritos.` : `Quitaste a ${PRO(id).n} de favoritos.`); },
  sort: v => { S.sort = v; S.sheet = ''; if (cur === 'P06') S.item = ''; },
  rsort: v => { S.revSort = v; S.sheet = ''; },
  today: () => { S.fday = S.fday === 'hoy' ? 'all' : 'hoy'; },
  only: k => { const on = S.f[k] && Object.keys(S.f).filter(x => S.f[x]).length === 1; S.f = on ? { enf: true, tens: true, cuid: true } : { enf: k === 'enf', tens: k === 'tens', cuid: k === 'cuid' }; },
  soon: k => toast(`${CAT[k].n} llega muy pronto. Te avisamos con una notificación push cuando abra en tu comuna.`),
  plan: () => toast('Te llamamos hoy para armar el plan con una enfermera coordinadora. Sin costo.'),
  r48: () => { S.frat = S.frat ? 0 : 4.8; },
  clearF: () => { S.f = { enf: true, tens: true, cuid: true }; S.fmax = 0; S.fday = 'all'; S.frat = 0; S.fgen = ''; S.fcom = ''; },
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
  <div class="fc-top">${pav(p, 'l', true)}${heart(p.id, 'fl')}</div>
  <div class="fc-b"><div class="fc-n">${p.n}</div><div class="fc-m">${p.t} · ${kmT(p)}</div><div class="fc-r"><span class="fc-m">${rate(p)}</span>${isDest(p) ? '<span class="fc-tag">Destacado</span>' : ''}</div>
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
  <div class="rc-top">${pav(pr, wide ? 'l' : '', true)}<div class="rc-id"><div class="rc-n">${pr.n}${isDest(pr) ? ' <span class="dtag">Destacado</span>' : ''}</div><div class="rc-m">${pr.t} · ${pr.yrs} años de experiencia</div><div class="rc-m">${rate(pr)}</div><div class="rc-m">${ic('map-pin')}${pr.com[0]} · a ${kmT(pr)}</div></div>${heart(pr.id)}</div>
  <div class="rc-price"><div class="rc-l"><div class="rc-svc">${it === 'mue' ? 'Toma a domicilio' : it ? CAT[it].n : 'Precio desde'}</div><div class="rc-inc">${(inc.length ? inc.slice(0, 2) : [INC.ins]).map(t => `<span>${ic('check')}${shortInc(t)}</span>`).join('')}</div></div>
  <div class="rc-p"><b class="num">${clp(p)}</b><span>${it === 'mue' ? '+ exámenes' : isT(it) ? `turno de ${minH(it)} h` : it ? durOf(pr, it) + ' min' : 'por visita'}</span></div></div>
  ${isT(it) ? `<div class="rc-sl"><span class="rc-d">Turnos</span><span class="spill dim">Día</span><span class="spill dim">Noche</span><span class="spill dim">24 h</span><button class="more" data-act="pick" data-arg="${pr.id}|" data-go="P13">Armar turno</button></div>` : `<div class="rc-sl"><span class="rc-d">${d0 >= 0 ? dayLbl(d0) : 'Sin horas'}</span>${sl.map(x => `<button class="spill" data-act="pick" data-arg="${pr.id}|${x[0]}|${x[1]}" data-go="P13">${x[1]}</button>`).join('')}<button class="more" data-act="pick" data-arg="${pr.id}|" data-go="P13">Ver más</button></div>`}
  <div class="rc-v">${sis()}<span>Antecedentes revisados</span></div></div>`;
};
const grpGo = k => GRP[k].l.length > 1 ? 'P37' : svcGo(GRP[k].l[0]);
const svcGo = k => k === 'mue' ? 'P40' : 'P10';
const grpStats = k => { const ps = PROS.filter(p => GRP[k].l.some(x => priceOf(p, x))); const mn = Math.min(...GRP[k].l.flatMap(x => PROS.map(p => priceOf(p, x)).filter(Boolean))); return [ps.length, mn]; };
/* «Packs» es una categoría propia (junto a Exámenes) */
const packTile = `<button class="cat" data-go="P74"><span class="ci">${i3('pk')}</span><span class="cn">Packs</span></button>`;
const catGrid = () => `<div class="cats hm">${GK.map(k => `<button class="cat" data-act="grp" data-arg="${k}" data-go="${grpGo(k)}"><span class="ci">${i3(k)}</span><span class="cn">${GRP[k].c}</span></button>${k === 'mue' ? packTile : ''}`).join('')}<button class="cat" data-go="P33"><span class="ci">${i3('todos')}</span><span class="cn">Ver todas</span></button></div>`;
const SCOPES = [['iny', 'Inyecciones'], ['vit', 'Vitaminas'], ['mue', 'Exámenes'], ['cuid', 'Cuidados']];
const SCG = { iny: ['iny'], vit: ['vit'], mue: ['mue'], cuid: ['am', 'pd', 'turn', 'cur', 'post', 'pal'] };
/* accesos rápidos del inicio: lo que más se busca, a un toque (Exámenes, Enfermera, Reembolso Isapre, Familia) */
const homeChips = () => `<div class="scopes hq">${[['test-tube', 'Exámenes', 'scopeGo', 'mue', 'P07'], ['syringe', 'Enfermera', 'homeEnf', '', 'P10'], ['receipt', 'Reembolso Isapre', '', '', 'P80'], ['users-three', 'Familia', '', '', 'P93']].map(c => `<button class="chip" ${c[2] ? `data-act="${c[2]}" data-arg="${c[3]}"` : ''} data-go="${c[4]}">${ic(c[0])}${c[1]}</button>`).join('')}</div>`;
/* estado vacío amable: ícono, qué pasó y qué hacer ahora */
const emptyS = (i, t, sub, acts = '') => `<div class="empty">${ic(i)}<div class="b-m mt8">${t}</div><div class="sm t2 mt4">${sub}</div>${acts}</div>`;
const scopeRow = (go = '') => `<div class="scopes">${SCOPES.map(s => `<button class="chip ${S.scope === s[0] ? 'on' : ''}" data-act="${go ? 'scopeGo' : 'scope'}" data-arg="${s[0]}" ${go ? `data-go="${go}"` : ''}>${s[1]}</button>`).join('')}</div>`;
/* Inicio, dos secciones: «Destacadas» (solo con Destacado pagado, con etiqueta) y «Recomendadas cerca de ti» (el resto, sin repetir, por cercanía y luego por nota) */
const byNear = (a, b) => a.km - b.km || b.rn - a.rn;
const destacadas = () => PROS.filter(p => priceOf(p, '') && isDest(p)).sort(byNear).slice(0, 5);
const featured = () => PROS.filter(p => priceOf(p, '') && !isDest(p)).sort(byNear).slice(0, 5);
const topRated = () => PROS.slice().sort((a, b) => b.rn - a.rn || b.rv - a.rv).slice(0, 3);
const range = l => { const ps = l.map(p => priceOf(p, S.item)); return ps.length ? [Math.min(...ps), Math.max(...ps)] : [0, 0]; };
const nFilt = () => (S.f.enf && S.f.tens && S.f.cuid ? 0 : 1) + (S.fmax ? 1 : 0) + (S.fday !== 'all' ? 1 : 0) + (S.frat ? 1 : 0) + (S.fgen ? 1 : 0) + (S.fcom ? 1 : 0);
const SORTS = [['rel', 'Relevancia', 'Nota, reseñas y cercanía'], ['pre', 'Menor precio', 'Del más barato al más caro'], ['rat', 'Mejor valorada', 'Mayor nota primero'], ['pro', 'Disponibilidad más pronta', 'La hora libre más cercana']];
const sortSheet = () => `<div class="h-s">Ordenar por</div><div class="mt8">${SORTS.map(x => radioRow(x[1], x[2], S.sort === x[0], 'sort', x[0])).join('')}</div>`;
const svcSheet = () => `<div class="h-s">Elige el servicio</div><div class="sm t2 mt4">Precios de ${first()}</div><div class="mt8">${svcsOf(PRO()).map(k => `<button class="row" data-act="svc" data-arg="${k}"><span class="ri box">${i3(k)}</span><span class="tx"><div class="a">${CAT[k].n}</div><div class="b">${durT(PRO(), k)}</div></span><span class="b-m num">${clp(priceOf(PRO(), k))}</span><span class="radio ${S.item === k ? 'on' : ''}"></span></button>`).join('')}</div>`;
const quick = () => `<div class="qchips">
  <button class="qc ${S.sort !== 'rel' ? 'on' : ''}" data-act="set" data-arg="sheet=sort">${ic('arrows-down-up')}${SORTS.find(x => x[0] === S.sort)[1]}${ic('caret-down')}</button>
  <button class="qc ${S.fday === 'hoy' ? 'on' : ''}" data-act="today">Disponible hoy</button>
  ${['enf', 'tens', 'cuid'].filter(w => !S.item || CAT[S.item].who.includes(w)).map(w => `<button class="qc ${S.f[w] && Object.keys(S.f).filter(x => S.f[x]).length === 1 ? 'on' : ''}" data-act="only" data-arg="${w}">${{ enf: 'Enfermera/o', tens: 'TENS', cuid: 'Cuidadora' }[w]}</button>`).join('')}
  <button class="qc ${S.frat ? 'on' : ''}" data-act="r48">${star()}4,8 o más</button></div>`;
const norm = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const SUG = [['Inyección intramuscular', 'iny'], ['Inyección de Neurobionta', 'iny'], ['Vitamina B12 inyectable', 'vb12'], ['Neurobionta o complejo B', 'vneu'], ['Complejo B inyectable', 'vneu'], ['Vitamina D en ampolla', 'vd'], ['Vitamina C endovenosa', 'vc'], ['Hierro endovenoso', 'vfe'], ['Sueroterapia con vitaminas', 'vsue'], ['Magnesio endovenoso', 'vmg'], ['Vitaminas con medicamento incluido', 'vmed'], ['Inyección subcutánea', 'inysc'], ['Inyección de heparina o enoxaparina', 'inysc'], ['Medicamento endovenoso', 'inyev'], ['Instalación de vía venosa', 'via'], ['Recambio de suero', 'recs'], ['Suero a domicilio', 'suero'], ['Hidratación endovenosa', 'suero'], ['Vacuna a domicilio', 'vac'], ['Vacuna de la influenza', 'vac'], ['Inyección de insulina', 'insu'], ['Control de glicemia', 'insu'], ['Pastillero semanal', 'past'], ['Ordenar remedios', 'past'], ['Curación simple', 'cur'], ['Curación avanzada', 'cura'], ['Curación de pie diabético', 'cura'], ['Úlcera venosa', 'cura'], ['Escaras', 'esc'], ['Úlceras por presión', 'esc'], ['Retiro de puntos', 'pun'], ['Herida operatoria', 'pun'], ['Drenaje', 'dren'], ['Exámenes de sangre', 'mue'], ['Hemograma', 'mue'], ['Perfil lipídico', 'mue'], ['Glicemia', 'mue'], ['Orina completa', 'mue'], ['Toma de muestras a domicilio', 'mue'], ['Electrocardiograma', 'ecg'], ['Holter', 'holt'], ['Cuidado de adulto mayor', 'cuid'], ['Cuidadora por turno', 'cuid'], ['Cuidadora de noche', 'ncasa'], ['Cuidadora 24 horas', 'cuid'], ['Acompañamiento por horas', 'acomp'], ['Valoración de enfermería', 'valo'], ['Baño en cama', 'bano'], ['Baño asistido', 'bano'], ['Estimulación cognitiva', 'cogn'], ['Alzhéimer y demencia', 'cogn'], ['TENS por turno', 'tens8'], ['Paciente postrado', 'tens8'], ['Invalidez y dependencia', 'pack'], ['Cambios de posición', 'pos'], ['Alimentación por sonda', 'sonali'], ['Gastrostomía', 'sonali'], ['Sonda Foley', 'son'], ['Cambio de sonda', 'son'], ['Ostomía', 'ost'], ['Traqueostomía', 'traq'], ['Oxígeno', 'oxi'], ['Visita post-alta', 'alta'], ['Alta de la clínica', 'alta'], ['Noche después de una cirugía', 'noche'], ['Acompañamiento en el hospital', 'hdia'], ['Acompañante de noche en la clínica', 'hnoc'], ['Acompañamiento 24 horas', 'h24'], ['Turno de noche en casa', 'ncasa'], ['Cuidados paliativos', 'pal'], ['Final de vida', 'fin'], ['Control de presión', 'sig'], ['Control de signos vitales', 'sig'], ['Programa de diabetes', 'diab'], ['Educación a la familia', 'edu'], ['Taller de RCP', 'rcp'], ['Primeros auxilios', 'rcp']];
/* plural tolerante: «inyecciones» encuentra «inyección» (misma lógica que el buscador de /web/) */
const plV = w => { const v = [w]; if (w.length > 4) { if (/ciones$/.test(w)) v.push(w.slice(0, -2)); if (/es$/.test(w)) v.push(w.slice(0, -2)); if (/s$/.test(w)) v.push(w.slice(0, -1)); } return v; };
const hasW = (s, w) => plV(w).some(x => s.includes(x));
const hl = (t, q) => { const n = norm(t), w = norm(q).trim().split(/\s+/)[0] || ''; let i = -1, l = 0; plV(w).some(x => { i = n.indexOf(x); l = x.length; return i >= 0; }); return i < 0 ? t : `${t.slice(0, i)}<b>${t.slice(i, i + l)}</b>${t.slice(i + l)}`; };
const statsOf = k => { const ps = PROS.filter(p => priceOf(p, k)).map(p => priceOf(p, k)); return [ps.length, ps.length ? Math.min(...ps) : CAT[k].base]; };
const nPro = n => `${n} profesional${n === 1 ? '' : 'es'}`;
const priceTxt = (k, mn) => k === 'mue' ? `toma desde ${clp(mn)} + exámenes` : CAT[k].plan ? `desde ${clp(mn)} a la semana` : CAT[k].turno ? `desde ${clp(mn)} por turno` : `desde ${clp(mn)}`;
const svcRow = (k, label, q) => { const [n, mn] = statsOf(k); if (CAT[k].soon) return `<button class="srow" data-act="soon" data-arg="${k}"><span class="si">${i3(k)}</span><span class="tx"><span class="a">${q ? hl(label, q) : CAT[k].n}</span><span class="b">Muy pronto · Avísame</span></span>${ic('bell')}</button>`; return `<button class="srow" ${CAT[k].plan ? 'data-act="plan" data-arg=""' : `data-act="svc" data-arg="${k}" data-go="${svcGo(k)}"`}><span class="si">${i3(k)}</span><span class="tx"><span class="a">${q ? hl(label, q) : CAT[k].n}</span><span class="b">${nPro(n)} · ${priceTxt(k, mn)}</span></span>${ic('caret-right')}</button>`; };
function sugg() {
  const q = S.q || '', t = exN(q).split(' ').filter(Boolean), sc = S.scope, inSc = k => !sc || SCG[sc].includes(CAT[k].g);
  const ph = t.some(w => w.length < 3) ? t.join(' ') : '', sm = x => { const s = exN(x[0] + ' ' + CAT[x[1]].n); return t.every(w => hasW(s, w)) && (!ph || (' ' + s + ' ').includes(' ' + ph)); };
  const s = sc === 'mue' ? [] : SUG.filter(x => sm(x) && inSc(x[1])).filter((x, i, l) => l.findIndex(y => y[1] === x[1]) === i);
  const ex = !sc || sc === 'mue' || sc === 'vit' ? exFind(q, sc === 'mue' ? 12 : 4) : [];
  const ps = sc ? [] : PROS.filter(p => norm(p.n).includes(norm(q)));
  const med = !sc && /medic|farma|remedi|pastill|receta/.test(norm(q));
  /* pestañas Todo / Servicios / Exámenes / Profesionales: solo cuando hay resultados de más de un tipo */
  const nEx = ex.length ? exFind(q).length : 0, cn = { sv: s.length, ex: nEx, ps: ps.length }, tab = Object.values(cn).filter(Boolean).length > 1 && cn[S.qt] ? S.qt : 'all', sh = k => tab === 'all' || tab === k, exs = tab === 'ex' ? exFind(q, 12) : ex;
  const tabs = Object.values(cn).filter(Boolean).length > 1 ? `<div class="qtabs" role="tablist">${[['all', 'Todo', 0], ['sv', 'Servicios', cn.sv], ['ex', 'Exámenes', cn.ex], ['ps', 'Profesionales', cn.ps]].filter(t => t[0] === 'all' || t[2]).map(t => `<button class="chip ${tab === t[0] ? 'on' : ''}" role="tab" aria-selected="${tab === t[0]}" data-act="qtab" data-arg="${t[0]}">${t[1]}${t[2] ? ` <span class="num">${t[2]}</span>` : ''}</button>`).join('')}</div>` : '';
  return `${tabs}${s.length && sh('sv') ? `<div class="lbl2">Servicios</div>${s.slice(0, 6).map(x => svcRow(x[1], x[0], q)).join('')}` : ''}
  ${exs.length && sh('ex') ? `<div class="lbl2">Exámenes de laboratorio</div>${exs.map(k => `<button class="srow" data-act="exAdd" data-arg="${k}" data-go="P40"><span class="si">${i3('mue')}</span><span class="tx"><span class="a">${hl(EXAMS[k][0], q)}</span><span class="b">${clp(EXAMS[k][1])} · ${fon(k)}</span></span>${ic('plus')}</button>`).join('')}${exFind(q).length > exs.length ? `<button class="lk mt8" data-act="set" data-arg="exq=${q.replace(/"/g, '')}" data-go="P40">Ver los ${exFind(q).length} exámenes</button>` : ''}` : ''}
  ${med && sh('sv') ? `<div class="lbl2">Muy pronto</div><button class="svcard dim" data-go="P46"><span class="si">${i3('med')}</span><span class="tx"><span class="a">Medicamentos</span><span class="b">Con tu receta, despacho a domicilio</span><span class="c">Muy pronto · Avísame</span></span>${ic('bell')}</button>` : ''}
  ${ps.length && sh('ps') ? `<div class="lbl2">Profesionales</div>${ps.map(p => lcard(p, 'flat')).join('')}` : ''}
  ${!s.length && !ex.length && !ps.length && !med ? emptyS('magnifying-glass', `No encontramos “${q}”`, 'Revisa la ortografía, prueba con otra palabra o mira todos los servicios.', btn('Ver todos los servicios', 'P33', 'sec') + `<button class="lk mt8" data-act="set" data-arg="q=">Borrar búsqueda</button>`) : ''}
  <div class="lbl2">Búsquedas parecidas</div><div class="chips"><button class="chip" data-act="svc" data-arg="vneu" data-go="P10">Neurobionta</button><button class="chip" data-act="svc" data-arg="vd" data-go="P10">Vitamina D</button><button class="chip" data-act="exAdd" data-arg="hemo" data-go="P40">Hemograma</button></div>`;
}
QRES.sres = () => S.q ? sugg() : p07idle();
/* recomendado para ti: sugerencias del perfil (chequeo anual y control sugerido), sin promesas médicas */
const recoRows = () => { const p = pkOf('pre'); return `<button class="srow" data-act="pk" data-arg="pre" data-go="P75"><span class="si">${i3('mue')}</span><span class="tx"><span class="a">${p[1]}</span><span class="b">${p[2]} · ${p[4].length} exámenes por ${clp(pkPr(p))}</span></span>${ic('caret-right')}</button>
  <button class="srow" data-act="exAdd" data-arg="vitd" data-go="P40"><span class="si">${i3('mue')}</span><span class="tx"><span class="a">${EXAMS.vitd[0]}</span><span class="b">Repetir cuando lo indique tu médico · ${clp(EXAMS.vitd[1])}</span></span>${ic('plus')}</button>`; };
const p07idle = () => S.scope ? (S.scope === 'mue' ? `<div class="lbl2">Exámenes más pedidos</div>${EXPOP.map(k => `<button class="srow" data-act="exAdd" data-arg="${k}" data-go="P40"><span class="si">${i3('mue')}</span><span class="tx"><span class="a">${EXAMS[k][0]}</span><span class="b">${clp(EXAMS[k][1])} · ${fon(k)}</span></span>${ic('plus')}</button>`).join('')}<button class="lk mt8" data-go="P40">Ver los ${Object.keys(EXAMS).length} exámenes</button>`
  : SCG[S.scope].map(g => `<div class="lbl2">${GRP[g].n}</div>${GRP[g].l.map(k => svcRow(k)).join('')}`).join(''))
  : `<div class="lbl2">Búsquedas recientes</div><div class="chips">${['Inyección intramuscular', 'Exámenes de sangre', 'Curación'].map((t, i) => `<button class="chip" data-act="svc" data-arg="${['iny', 'mue', 'cur'][i]}" data-go="${svcGo(['iny', 'mue', 'cur'][i])}">${ic('clock-counter-clockwise')}&nbsp;${t}</button>`).join('')}</div>
  <div class="shd"><h3>Servicios comunes</h3><button class="lk" data-go="P33">Ver todos</button></div>${['iny', 'vneu', 'mue', 'cur', 'cuid', 'alta'].map(k => svcRow(k)).join('')}
  <div class="shd"><h3>Recomendado para ti</h3></div>${recoRows()}`;
const groups = l => [['Por la mañana', t => t < '12:00'], ['Por la tarde', t => t >= '12:00' && t < '19:00'], ['Por la noche', t => t >= '19:00']].map(g => [g[0], l.filter(g[1])]).filter(g => g[1].length);
const hist = () => { const ps = PROS.filter(p => priceOf(p, S.item)).map(p => priceOf(p, S.item)); const bins = [12, 14, 16, 18, 20, 22, 24, 26, 28].map(x => x * 1000); return `<div class="hist">${bins.map(b => { const n = ps.filter(p => p >= b && p < b + 2000).length; return `<i class="${!S.fmax || b < S.fmax ? 'on' : ''}" style="height:${8 + n * 18}px"></i>`; }).join('')}</div><div class="hist-l xs t2"><span>$12.000</span><span>$30.000</span></div>`; };
const ll = p => { const a = { cr: [.006, -.008], fa: [-.012, .010], mc: [.003, .004], pg: [.010, -.002], vm: [-.004, .022], fl: [.014, .012], dn: [-.016, -.004], xv: [-.007, -.012], mp: [.012, -.015] }[p.id]; return [P().ll[0] + a[0], P().ll[1] + a[1]]; };
const dstrip = (p, key, act, pre) => `<div class="dstrip">${DAYS.map((d, i) => { const n = slotsOf(p, i).length; const on = S[key] === i; return !pre && n ? `<button class="ds ${on ? 'on' : ''}" data-act="${act}" data-arg="${i}"><span>${d[2] || d[0]}</span><b>${d[1]}</b><i></i></button>` : `<div class="ds ${on ? 'on' : ''} ${n ? '' : 'off'}"><span>${d[2] || d[0]}</span><b>${d[1]}</b><i></i></div>`; }).join('')}</div>`;
const acts = l => `<div class="acts">${l.map(a => `<button class="act" ${a[4] ? `data-go="${a[4]}"` : `data-act="${a[2]}" data-arg="${a[3]}"`}>${ic(a[0])}<span>${a[1]}</span>${ic('caret-right')}</button>`).join('')}</div>`;

/* ---------- inicio de la app: splash y bienvenida con elección de rol ---------- */
def({ id: 'S00', name: 'Inicio · splash', kind: 'page', noNav: true, auto: 'S01', enter: () => T(() => { if (cur === 'S00') go('S01'); }, 2100),
  body: () => `<button class="sp" data-go="S01" aria-label="Continuar"><span class="sp-sym">${logoImg('simbolo-nm', 84)}</span><span class="sp-wm">${logoImg('horizontal-nm', 30)}</span><span class="sp-tx">Cuidados de salud en tu casa</span><span class="sp-bar"><i></i></span></button>` });

def({ id: 'S01', name: 'Inicio · bienvenida y rol', kind: 'page', noNav: true, next: ['P01', 'R01'],
  body: () => `<div class="wl"><div class="wl-lg">${logoImg('horizontal-nm', 28)}</div>
  <h1 class="h-xl wl-h">Cuidados de salud en tu casa</h1>
  <div class="t2 mt8 wl-s">Enfermeras, TENS y cuidadoras que van a tu hogar. Con precio y reseñas a la vista.</div>
  <div class="wl-st" aria-hidden="true">
    <div class="wl-c c1">${lcard(PROS[0], 'flat')}</div>
    <div class="wl-c c2">${row('box:calendar-check', 'Curación simple', 'Mié 28 oct · 08:00 · en tu casa', '', st('ok', 'Confirmada'))}</div>
    <div class="wl-c c3">${svcRow('iny')}</div>
  </div></div>`,
  foot: () => `<div class="wl-q">¿Cómo quieres usar Cuidapp?</div>${btn('Soy paciente', 'P01')}${btn('Soy profesional', 'R01', 'sec')}` });

/* ---------- ingreso ---------- */
def({ id: 'P01', name: 'Ingreso', kind: 'page', noNav: true, back: true,
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
  ${lbl('Fecha de nacimiento')}${finp('yo', 'nac', FAM.yo.nac, '', { t: 'date', i: 'calendar-blank' })}<div class="xs t2 mt4">Edad: <b data-live="age">${ageTxt(FAM.yo.nac)}</b></div>
  ${lbl('Sexo al nacer')}<div class="chips">${chip('Mujer', FAM.yo.sx === 'F', 'fv', 'yo|sx|F')}${chip('Hombre', FAM.yo.sx === 'M', 'fv', 'yo|sx|M')}</div><div class="xs t3 mt4">Lo usamos para mostrar los rangos correctos en tus resultados.</div>
  ${lbl('Celular de contacto')}${finp('yo', 'cel', FAM.yo.cel, '+56 9 1234 5678', { t: 'tel', i: 'device-mobile' })}
  ${checkRow('Quiero recibir mis resultados por WhatsApp', FAM.yo.wa, 'ftog', 'yo|wa', 'Te avisamos cuando estén listos. El aviso no incluye valores')}
  ${lbl('Previsión de salud')}<div class="chips">${chip('Fonasa', S.pv.yo.t === 'fonasa', 'pvT', 'yo|fonasa')}${chip('Isapre', S.pv.yo.t === 'isapre', 'pvT', 'yo|isapre')}${chip('Particular', S.pv.yo.t === 'part', 'pvT', 'yo|part')}</div>${S.pv.yo.t === 'fonasa' ? `<div class="chips mt8">${['A', 'B', 'C', 'D'].map(t => chip('Tramo ' + t, S.pv.yo.tr === t, 'pvTr', 'yo|' + t)).join('')}</div>` : S.pv.yo.t === 'isapre' ? `<div class="chips mt8">${ISAPRES.map(t => chip(t, S.pv.yo.is === t, 'pvIs', 'yo|' + t)).join('')}</div>` : ''}<div class="xs t3 mt4">Para emitir tus boletas para reembolso.</div>`,
  foot: () => btn('Continuar', 'P04') });

def({ id: 'P04', name: 'Consentimiento de datos de salud', kind: 'page', back: true, noNav: true,
  body: () => `${ic('shield-check', 1).replace('<i ', '<i style="font-size:44px;color:#7A7CF0" ')}<div class="h-l mt12">Tus datos de salud son tuyos</div>
  <div class="mt8">${row('box:stethoscope', 'Para qué los usamos', 'Para que la profesional sepa qué hacer y para enviar tus exámenes al laboratorio.', '', '')}
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
  first: { cls: 'lav', eb: 'Primera atención', t: '15% de descuento', d: 'Con el código CUIDAPP15 · hasta $20.000', ic: 'iny' },
  lab: { cls: 'neu', eb: 'Exámenes a domicilio', t: '20% de descuento en tu primer pedido', d: 'En exámenes sobre $30.000 · hasta $20.000', ic: 'mue' },
};
const PSUB = { kin: 'Motora y respiratoria', first: 'CUIDAPP15 · hasta $20.000', lab: 'Exámenes sobre $30.000 · hasta $20.000' };
const PT = { kin: 'Kinesiología', first: '15% de descuento', lab: '20% en tu primer pedido' };
const promoEnd = k => k === 'kin' ? `<button class="pcta ${S.kinAv ? 'on' : ''}" data-act="kinAv">${S.kinAv ? ic('check', 0).replace('ph ', 'ph-bold ') + 'Avisado' : 'Avísame'}</button>`
  : k === 'first' ? `<button class="pcta" data-act="code">CUIDAPP15</button>` : `<span class="pchev">${ic('caret-right')}</span>`;
const promoCard = k => { const p = PROMO[k]; return `<div class="pslim ${p.cls}" data-act="promo" data-arg="${k}" data-go="P45" role="button"><span class="ps-ic">${i3(p.ic)}</span><span class="ps-tx"><span class="ps-eb">${p.eb}</span><b class="ps-t">${PT[k]}</b><span class="ps-d">${PSUB[k]}</span></span>${promoEnd(k)}</div>`; };
window.pdots = el => { const n = Math.round(el.scrollLeft / (el.firstElementChild.offsetWidth + 8)); el.nextElementSibling.querySelectorAll('i').forEach((d, i) => d.classList.toggle('on', i === n)); };
const promoCar = () => `<div class="pcar" onscroll="pdots(this)">${Object.keys(PROMO).map(promoCard).join('')}</div><div class="pdots"><i class="on"></i><i></i><i></i></div>`;

def({ id: 'P06', name: 'Servicios (inicio)', kind: 'page', tab: 'servicios', bodyCls: 'home',
  body: () => `<div class="hero"><div class="locrow"><button class="locb" data-act="set" data-arg="addrNext=P06" data-go="P08"><span class="xs t2">Atención a domicilio en</span><span class="lv">${P().n}, ${P().c}${ic('caret-down')}</span></button><button class="ib bell" data-act="toast" data-arg="No tienes notificaciones nuevas." aria-label="Notificaciones">${ic('bell')}</button></div>
  <h1 class="h-xl mt16">¿Qué necesitas?</h1>
  <button class="sbig mt16" data-act="set" data-arg="scope=" data-go="P07">${ic('magnifying-glass')}<span>Inyección, vitaminas, exámenes…</span></button><div class="mt12">${homeChips()}</div></div>
  ${S.booked && !S.hecho ? `<button class="upc mt16" data-act="set" data-arg="det=next" data-go="P27"><span class="db"><span>${DAYS[S.day][0]}</span><b>${DAYS[S.day][1]}</b></span><span class="tx"><span class="xs t2">Tu próxima cita</span><b>${CAT[S.item].n}</b><span class="sm t2">${S.slot} · ${PRO().n}</span></span>${ic('caret-right')}</button>` : ''}
  <div class="mt16">${promoCar()}</div>
  <div class="mt24">${shd('Servicios')}${catGrid()}</div>${typeof profRow === 'function' ? profRow() + cotBanner() : ''}
  ${destacadas().length ? `${shd('Destacadas', 'P10', 'svc', '')}
  <div class="hcar">${destacadas().map(fcard).join('')}</div>` : ''}
  ${shd('Recomendadas cerca de ti', 'P10', 'svc', '')}
  <div class="hcar">${featured().map(fcard).join('')}</div>
  ${typeof consejos === 'function' ? consejos() : ''}
  ${shd('Búsquedas recientes')}
  <div class="recent">${[['iny', 'Inyección intramuscular', 'Ñuñoa · 7 profesionales'], ['mue', 'Hemograma y perfil lipídico', 'Ñuñoa · sin orden médica'], ['cur', 'Curación simple', 'Providencia · 6 profesionales']].map(r => `<button class="rrow" data-act="${r[0] === 'mue' ? 'exPair' : 'svc'}" data-arg="${r[0]}" data-go="${svcGo(r[0])}"><span class="rc">${ic('clock-counter-clockwise')}</span><span class="tx"><span class="a">${r[1]}</span><span class="b">${r[2]}</span></span>${ic('arrow-up-right')}</button>`).join('')}</div>
  ${shd('Mejor valoradas', 'P10', 'sort', 'rat')}
  <div class="llist">${topRated().map(p => lcard(p)).join('')}</div>
    <div class="xs t3 mt16 center">Profesionales, precios y reseñas de ejemplo.</div>` });

def({ id: 'P07', name: 'Buscar servicio', kind: 'page', back: true,
  top: () => `<div class="srch"><button class="ib" data-go="back" aria-label="Volver">${ic('caret-left')}</button><label class="sinput">${ic('magnifying-glass')}<input class="sq" type="search" data-q="q" data-res="sres" value="${String(S.q || '').replace(/"/g, '&quot;')}" placeholder="${S.scope ? 'Buscar en ' + SCOPES.find(s => s[0] === S.scope)[1].toLowerCase() : 'Inyección, vitaminas, exámenes…'}" autocomplete="off" enterkeyhint="search">${S.q ? `<button class="clr" data-act="clearQ" aria-label="Borrar">${ic('x-circle', 1)}</button>` : ''}</label></div>
  <div class="scw">${scopeRow()}</div><button class="sloc" data-act="set" data-arg="addrNext=P07" data-go="P08">${ic('map-pin')}<span>En ${P().n}, ${P().c}</span><span class="link">Cambiar</span></button>`,
  body: () => `<div id="sres">${QRES.sres()}</div>`,
  enter: () => { if (S.typed || S.q || S.scope) return; S.typed = true; const w = 'inyec'; const step = i => setTimeout(() => { if (cur !== 'P07' || S.q === w || S.q !== w.slice(0, i - 1) || document.activeElement?.matches?.('input.sq')) return; S.q = w.slice(0, i); render(); if (i < w.length) step(i + 1); }, i === 1 ? 700 : 150); step(1); } });

const svcCard = k => { const c = CAT[k], [n, mn] = statsOf(k); const meta = `<span class="smeta">${whoB(k)}${indB(k)}<span class="dt">${ic('clock')}${c.dt}</span></span>`;
  if (c.soon) return `<button class="svcard dim" data-act="soon" data-arg="${k}"><span class="si">${i3(k)}</span><span class="tx"><span class="a">${c.n}<span class="pr soonb">Muy pronto</span></span><span class="b">${c.d}</span>${meta}<span class="c">Referencia ${clp(c.base)} · Avísame</span></span>${ic('bell')}</button>`;
  return `<button class="svcard" ${c.plan ? 'data-act="plan" data-arg=""' : `data-act="svc" data-arg="${k}" data-go="${svcGo(k)}"`}><span class="si">${i3(k)}</span><span class="tx"><span class="a">${c.n}</span><span class="b">${c.d}</span>${meta}<span class="c">${c.plan ? `Plan a medida · desde ${clp(c.base)} a la semana` : n ? `${nPro(n)} · ${priceTxt(k, mn)}` : 'Pronto en tu comuna'}</span></span>${ic('caret-right')}</button>`; };
def({ id: 'P33', name: 'Todas las categorías', kind: 'page', back: true, title: 'Todas las categorías',
  body: () => `<div class="sm t2">Cada profesional pone su precio y dice qué incluye. Los exámenes tienen el precio fijo del laboratorio.</div>
  <div class="cats all mt16">${GALL.map(k => `<button class="cat" data-act="grp" data-arg="${k}" data-go="${grpGo(k)}"><span class="ci">${i3(k)}</span><span class="cn">${GRP[k].c}</span></button>${k === 'mue' ? packTile : ''}`).join('')}<button class="cat dim" data-act="kin"><span class="ci">${i3('kin')}</span><span class="cn">Kinesiología</span><span class="pr">Muy pronto</span></button><button class="cat dim" data-go="P46"><span class="ci">${i3('med')}</span><span class="cn">Medicamentos</span><span class="pr">Muy pronto</span></button></div>
  ${GALL.map(k => `<div class="lbl2">${GRP[k].n}</div>${GRP[k].l.map(svcCard).join('')}`).join('')}
  <div class="lbl2">Muy pronto</div><button class="svcard dim" data-act="kin"><span class="si">${i3('kin')}</span><span class="tx"><span class="a">Kinesiología a domicilio<span class="pr soonb">Muy pronto</span></span><span class="b">Motora y respiratoria, de $26.990 a $40.000 la sesión</span><span class="c">Te avisamos cuando abra</span></span>${ic('bell')}</button><button class="svcard dim" data-go="P46"><span class="si">${i3('med')}</span><span class="tx"><span class="a">Medicamentos con farmacia<span class="pr soonb">Muy pronto</span></span><span class="b">Con receta, con despacho a domicilio</span><span class="c">Muy pronto · Avísame</span></span>${ic('bell')}</button>
  <div class="mt16">${note('info', 'La medicación siempre la aporta la paciente con su receta. Los precios son de referencia del mercado en Santiago (oct 2026).')}</div>` });

def({ id: 'P46', name: 'Medicamentos (muy pronto)', kind: 'page', back: true, title: '',
  body: () => `<div class="medh"><span class="medi">${i3('med')}</span><span class="badge medb">Muy pronto</span><div class="h-l mt16">Medicamentos</div><div class="t2 mt8">Pronto podrás pedir tus medicamentos con receta desde Cuidapp y recibirlos en tu casa.</div></div>
  <div class="mt24">${row('box:file-text', 'Con tu receta médica', 'La subes una vez y la farmacia la revisa', '', '')}${row('box:truck', 'Despacho a domicilio', 'Precios claros antes de pagar', '', '')}${row('box:bell', 'Te avisamos cuando abra', 'Con una notificación push y por correo', '', '')}</div>`,
  foot: () => abtn(S.medAv ? ic('check') + 'Te avisaremos' : ic('bell') + 'Avísame', 'medAv', '', S.medAv ? 'sec' : '') });

def({ id: 'P37', name: 'Categoría de servicios', kind: 'page', back: true, title: '', next: ['P10', 'P40'],
  body: () => { const k = S.grp || 'iny', g = GRP[k], l = g.l; return `<div class="i3hero">${i3(k)}</div><div class="h-l">${g.n}</div><div class="t2 sm mt4">${g.d}</div>
  <div class="catleg mt12"><span>${ic('user')}Quién lo hace</span><span>${ic('file-text')}Ind. médica = necesitas receta o indicación</span></div>
  <div class="mt12">${l.map(svcCard).join('')}</div>
  <div class="mt16 col8">${k === 'vit' ? `${note('pill', 'Trae tu ampolla o medicamento con su receta: la profesional lo administra. Con medicamento incluido llega pronto, con despacho a domicilio.')}${note('info', 'Precios de ejemplo: intramuscular desde $14.990 a $18.000; endovenoso desde $39.990. Cada profesional fija su precio.')}` : k === 'mue' ? note('check-circle', 'No necesitas orden médica: nosotros la gestionamos por ti. Si la tienes, súbela y elegimos los exámenes.', 'ok') : l.some(x => CAT[x].receta) ? note('file-text', 'Para inyecciones, sueros e insulina necesitas receta médica. Le sacas una foto al agendar. El medicamento lo tienes tú.') : ''}${l.some(x => CAT[x].turno) ? note('moon', 'Turnos de 8, 12 o 24 horas, de día o de noche y en los días que elijas. Domingo +50% y festivos +100%.') : ''}${note('notebook', 'Después de cada visita la profesional deja una nota en la ficha de la paciente: qué hizo, signos vitales y recomendaciones.')}</div>`; } });

/* P40 · exámenes: en lab.js (catálogo completo y orden médica opcional) */
def({ id: 'P16', name: 'Preparación para la toma', kind: 'page', back: true, title: 'Preparación', next: ['P10'],
  body: () => `<div class="h-l">Antes de la toma</div><div class="t2 sm mt4">${byOrder() ? 'Según tu orden médica' : examList().map(e => e[0]).join(', ')}</div>
  <div class="mt16">${prepRows()}</div>
  ${!byOrder() && examKeys().length > 1 ? `<div class="lbl2">Por examen</div>${examKeys().map(k => row('box:test-tube', EXAMS[k][0], ayLbl(EXAMS[k][3]) + ' · ' + plLbl(k), '', '')).join('')}` : ''}
  ${coKeys().map(k => row('box:user', FAM[k].c + ' · ' + coEx(k).length + ' exámenes', ayAgg(coEx(k)).txt + ' · ' + plAgg(coEx(k)).txt, '', '')).join('')}
  ${S.exams.ori || S.exams.uro ? row('box:drop', 'Primera orina de la mañana', 'En el frasco estéril que lleva la profesional', '', '') : ''}
  ${row('box:pill', 'Tus remedios de siempre', 'Tómalos, salvo que tu médico diga otra cosa', '', '')}
  ${row('box:identification-card', 'Ten a mano el carnet', 'De la persona que se toma el examen', '', '')}
  ${row('box:file-pdf', 'Tus resultados', 'Los recibes en PDF, en el detalle de tu cita', '', '')}</div>`,
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
  body: () => { const l = prosFor(), [a, b] = range(l); return `<div class="rsum"><div class="h-s">${nPro(l.length)} en ${P().c}</div><div class="sm t2 mt4">${!l.length ? 'Prueba quitando algún filtro.' : S.item === 'mue' ? `Toma a domicilio desde <b class="num">${clp(a)}</b>. Los exámenes (${byOrder() ? 'según tu orden' : clp(examSum())}) se suman aparte.` : `Desde <b class="num">${clp(a)}</b> hasta <b class="num">${clp(b)}</b> · cada una pone su precio`}</div></div>
  ${S.item && CAT[S.item].receta ? `<div class="rnote">${ic('file-text')}<span>Te recomendamos subir tu receta médica. Si no la tienes, puedes agendar igual.</span></div>` : ''}
  <div class="rlist">${l.map(p => rcard(p)).join('')}</div>
  ${l.length ? '' : emptyS('funnel', 'No hay profesionales con estos filtros', 'Quita alguno para ver más opciones en tu comuna, o prueba con otro servicio.', abtn('Quitar filtros', 'clearF', '', 'sec') + `<button class="lk mt8" data-go="P07">Buscar otro servicio</button>`)}
  <div class="xs t3 mt16 center" style="padding-bottom:64px">Precios fijados por cada profesional. Datos de ejemplo.</div>`; },
  float: () => `<button class="mapfab" data-go="P36">${ic('map-trifold')}Ver en mapa</button>` });

def({ id: 'P11', name: 'Filtros', kind: 'page', back: 'x', title: 'Filtros',
  body: () => `<div class="fsec"><div class="h-s">Precio</div><div class="sm t2 mt4">${S.item ? CAT[S.item].n : 'Precio por visita'} · lo fija cada profesional</div>${hist()}
  <div class="chips mt12">${[[0, 'Cualquiera'], [15000, 'Hasta $15.000'], [20000, 'Hasta $20.000'], [25000, 'Hasta $25.000']].map(x => chip(x[1], S.fmax === x[0], 'set', 'fmax=' + x[0])).join('')}</div></div>
  <div class="fsec"><div class="h-s">Disponibilidad</div><div class="chips mt12">${[['all', 'Cualquier día'], ['hoy', 'Disponible hoy'], ['man', 'Hoy o mañana']].map(x => chip(x[1], S.fday === x[0], 'set', 'fday=' + x[0])).join('')}</div></div>
  <div class="fsec"><div class="h-s">Comuna donde atiende</div><div class="chips mt12">${[['', 'Todas'], ['Ñuñoa', 'Ñuñoa'], ['Providencia', 'Providencia'], ['La Reina', 'La Reina'], ['Las Condes', 'Las Condes'], ['Macul', 'Macul'], ['Santiago', 'Santiago']].map(x => chip(x[1], S.fcom === x[0], 'set', 'fcom=' + x[0])).join('')}</div></div>
  <div class="fsec"><div class="h-s">Profesión</div><div class="mt4">${checkRow('Enfermera o enfermero', S.f.enf, 'tog', 'f.enf', 'Inyecciones, curaciones, sondas y exámenes')}${checkRow('TENS', S.f.tens, 'tog', 'f.tens', 'Técnico en enfermería: cuidados, inyecciones y muestras')}${checkRow('Cuidadora', S.f.cuid, 'tog', 'f.cuid', 'Turnos, compañía, higiene y acompañamiento')}</div></div>
  <div class="fsec"><div class="h-s">Valoración</div><div class="chips mt12">${[[0, 'Todas'], [4.5, '4,5 o más'], [4.8, '4,8 o más']].map(x => chip(x[1], S.frat === x[0], 'set', 'frat=' + x[0])).join('')}</div></div>
  <div class="fsec last"><div class="h-s">Género de la profesional</div><div class="chips mt12">${[['', 'Indistinto'], ['f', 'Mujer'], ['m', 'Hombre']].map(x => chip(x[1], S.fgen === x[0], 'set', 'fgen=' + x[0])).join('')}</div></div>`,
  foot: () => `<div class="fbar"><button class="lk u" data-act="clearF">Limpiar todo</button><button class="btn fbtn" data-go="back">Ver ${nPro(prosFor().length)}</button></div>` });

def({ id: 'P36', name: 'Resultados en mapa (opcional)', kind: 'map', back: true, sheetCls: 'lite',
  map: () => ({ home: P().ll, dots: prosFor().map(p => [ll(p), p.id === S.pro ? '#111111' : '#7A7CF0']), maxZoom: 15 }),
  body: () => { const l = prosFor(); return `<div class="shd" style="margin-top:0"><h3>${nPro(l.length)}</h3><button class="lk" data-go="back">Ver lista</button></div><div class="sm t2">${svcN(S.item)} · ${P().c}</div><div class="mcar mt12">${l.map(p => `<div class="mcard ${S.pro === p.id ? 'on' : ''}" data-act="pick" data-arg="${p.id}|" data-go="P12" role="button">${pav(p, 's', true)}<div class="tx"><div class="b-m">${p.n}</div><div class="sm t2">${rate(p)} · ${kmT(p)}</div></div><b class="num">${clp(priceOf(p, S.item))}</b></div>`).join('')}</div>`; } });

/* ---------- perfil de la profesional ---------- */
function profileBody(p, mode = 'm') {
  const d = mode === 'd', pre = mode === 'pre', rv = revsOf(p.id), it = S.item && priceOf(p, S.item) ? S.item : '';
  const svcList = svcsOf(p).map(k => { const sel = it === k; const inc = incOf(p, k); return `<${pre ? 'div' : 'button'} class="psvc ${sel ? 'on' : ''}" ${pre ? '' : `data-act="svc" data-arg="${k}"`}><span class="si">${i3(k)}</span><span class="tx"><span class="a">${CAT[k].n}</span><span class="b">${durT(p, k)} · ${shortInc(inc[0])}${inc.length > 1 ? ` y ${inc.length - 1} más` : ''}</span></span><span class="pp num"><small class="dsd">Desde</small>${clp(priceOf(p, k))}${CAT[k].turno ? `<small>${minH(k)} h</small>` : ''}</span></${pre ? 'div' : 'button'}>`; });
  const svcGrp = l => GALL.filter(g => GRP[g].l.some(k => svcsOf(p).includes(k))).map(g => `<div class="psg">${GRP[g].n}</div>` + svcsOf(p).filter(k => CAT[k].g === g).map(k => l[svcsOf(p).indexOf(k)]).join('')).join('');
  const avail = `<div class="avl">${DAYS.map((x, i) => { const n = slotsOf(p, i).length; return `<div class="avd ${n ? '' : 'off'}"><span>${x[2] || x[0]}</span><b>${x[1]}</b><em>${n ? n + (n === 1 ? ' hora' : ' horas') : '—'}</em></div>`; }).join('')}</div>`;
  const revs = `${scoreBlock(p)}${bars(p)}${crits(p)}<div class="rvl ${d ? 'two' : ''}">${rv.slice(0, d ? 4 : 2).map(r => rvCard(r, false, p.id)).join('')}</div>${pre ? '' : `<button class="btn sec mt16" data-go="P32">Ver las ${p.rv} reseñas</button>`}`;
  return `<div class="phero">${pav(p, 'xl', true)}<div class="ph-tx"><div class="h-l">${p.n}</div><div class="t2 mt4">${p.t} · ${p.yrs} años de experiencia</div><div class="mt8 rtl">${rate(p)}<span class="sep">·</span><span>${p.a} atenciones</span></div></div></div>
  <div class="pbadges">${sis()}<span class="badge g">${ic('shield-check', 1)}Antecedentes revisados</span><span class="badge g">${ic('identification-card', 1)}Identidad verificada</span></div>
  <div class="pstats"><div><b class="num">${p.r} ${star()}</b><span>nota</span></div><div><b class="num">${p.rv}</b><span>reseñas</span></div><div><b class="num">${p.yrs} años</b><span>de experiencia</span></div><div><b>${p.resp}</b><span>en responder</span></div></div>
  <div class="psec"><h3>Sobre ${p.g === 'm' ? 'él' : 'ella'}</h3><p class="bio">${p.bio}</p><div class="chips mt12">${p.spec.map(t => `<span class="chip dim">${t}</span>`).join('')}</div></div>
  <div class="psec"><h3>Servicios y precios</h3><div class="sm t2 mb8">Precios fijados por ${first(p)}. ${p.k === 'cuid' ? 'Por turno o por visita.' : 'Insumos incluidos.'}</div>${svcGrp(svcList)}</div>
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
/* sin horas ese día: lo decimos claro y ofrecemos saltar a la próxima hora libre */
const noSlots = p => { const x = nextOf(p); return x ? emptyS('calendar-x', `${first(p)} no tiene horas ${S.day === 0 ? 'hoy' : 'ese día'}`, `Su próxima hora libre es ${dayLbl(x[0]).toLowerCase()} a las ${x[1]}.`, abtn('Ver próxima hora disponible', 'nextFree', '', 'sec'))
  : emptyS('calendar-x', `${first(p)} no tiene horas disponibles por ahora`, 'Mira otros profesionales cerca de ti con horas libres.', btn('Ver otros profesionales', 'P10', 'sec')); };
def({ id: 'P13', name: 'Elegir servicio, día y hora', kind: 'page', back: true, title: 'Agendar', sheets: ['svc'], sheet: svcSheet,
  body: () => { const p = PRO(), l = slotsOf(p, S.day); if (isT()) return `${mini(p)}<div class="lbl2">Servicio</div><button class="svsel" data-act="set" data-arg="sheet=svc"><span class="si">${i3(S.item)}</span><span class="tx"><span class="a">${CAT[S.item].n}</span><span class="b">${durT(p, S.item)}</span></span><span class="lk">Cambiar</span></button>${shiftForm(p)}`; return `${mini(p)}
  <div class="lbl2">Servicio</div><button class="svsel" data-act="set" data-arg="sheet=svc"><span class="si">${i3(S.item)}</span><span class="tx"><span class="a">${CAT[S.item].n}</span><span class="b">${durOf(p)} min · ${clp(priceOf(p, S.item))}</span></span><span class="lk">Cambiar</span></button>
  <div class="lbl2">Día</div>${dstrip(p, 'day', 'day')}
  <div class="lbl2">Hora de llegada · ${DAYS[S.day][3].replace('hoy ', '')}</div>
  ${l.length ? '' : noSlots(p)}${groups(l).map(g => `<div class="sgrp"><div class="sg-t">${g[0]}</div><div class="slots3">${g[1].map(t => `<button class="slot ${S.slot === t ? 'on' : ''}" data-act="set" data-arg="slot=${t}">${t}${rcTag(p, S.day, t)}</button>`).join('')}</div></div>`).join('')}
  <div class="mt16 col8">${rcLines(p, priceOf(p, S.item), S.day, S.slot, false).map(x => note(x[0].includes('nocturno') ? 'moon' : 'calendar-star', `${x[0]}: +${clp(x[1])}. Lo define ${first()}.`)).join('')}${S.slot ? `<div class="lbl2">Resumen</div>${price().L.filter(l => l[0] !== 'Gestión de reembolso').map(bkv).join('')}${kv('Total', clp(price().L.filter(l => l[0] !== 'Gestión de reembolso').reduce((x, y) => x + y[1], 0)), 'tot')}<div class="xs t3 mt4">Si pides el reembolso automático se suma la gestión (${clp(RB_FEE)}).</div>` : ''}${l.length && S.slot ? note('calendar-check', `Llega entre ${S.slot} y ${slotEnd(S.slot)}. Cancelación gratis hasta 12 horas antes.`) : ''}</div>`; },
  foot: () => `<div class="fbar"><div class="fb-l"><b class="num">${clp(price().total)}</b><span>${isT() ? `${shiftDates().length} turnos · ${shH()} h` : S.slot && slotsOf(PRO(), S.day).length ? `${dayLbl(S.day)} · ${S.slot}` : 'Elige un día y una hora'} ${price().disc ? ` · −${clp(price().disc)} dto.` : ''}</span></div><button class="btn fbtn" data-act="set" data-arg="addrNext=P14" data-go="P14" ${!isT() && !(S.slot && slotsOf(PRO(), S.day).length) ? 'disabled' : ''}>Continuar</button></div>` });

const shiftForm = (p = PRO(), k = S.item, d = false) => { const c = CAT[k], hs = Object.keys(c.tp).map(Number), sc = shiftCalc(p, k);
  const st = [...Array(7)].map((_, i) => addD(SH0, i));
  return `<div class="lbl2">Duración del turno</div><div class="seg sh">${hs.map(h => `<button class="${shH(k) === h ? 'on' : ''}" data-act="shH" data-arg="${h}">${h} h<small>${clp(shiftUnit(p, k, h, shJor(k) === 'noche' && !c.jor ? 'noche' : 'dia'))}</small></button>`).join('')}</div>
  ${c.jor ? `<div class="mt8">${note(c.jor === 'noche' ? 'moon' : 'sun', `Turno de ${c.jor === 'noche' ? 'noche' : 'día'}: ${shRange(k)}.`)}</div>` : shH(k) >= 24 ? `<div class="mt8">${note('clock', 'Turno de 24 horas: de 08:00 a 08:00 del día siguiente, con entrega de turno escrita.')}</div>` : `<div class="lbl2">Jornada</div><div class="seg sh">${[['dia', 'sun', 'De día'], ['noche', 'moon', 'De noche']].map(j => `<button class="${S.sh.jor === j[0] ? 'on' : ''}" data-act="shJ" data-arg="${j[0]}">${ic(j[1])}${j[2]}<small>${j[0] === 'noche' ? '+25%' : 'desde 08:00'}</small></button>`).join('')}</div>`}
  <div class="lbl2">Primer turno</div><div class="dstrip d7">${st.map((x, i) => `<button class="ds ${S.sh.start === i ? 'on' : ''}" data-act="shS" data-arg="${i}"><span>${WDN[WD[x.getDay()]]}</span><b>${x.getDate()}</b>${festOf(x) ? '<em class="fst">festivo</em>' : x.getDay() === 0 ? '<em class="fst">+50%</em>' : '<i></i>'}</button>`).join('')}</div>
  <div class="lbl2">Repetir los días</div><div class="wdays">${Object.keys(WDN).map(w => `<button class="${S.sh.rep[w] ? 'on' : ''}" data-act="shRep" data-arg="${w}">${WDN[w].slice(0, 2)}</button>`).join('')}</div>
  <div class="lbl2">Durante</div><div class="chips">${[1, 2, 4].map(w => chip(w === 1 ? '1 semana' : w + ' semanas', S.sh.wk === w, 'shWk', w)).join('')}</div>
  <div class="lbl2">Tus turnos · ${sc.ds.length}</div><div class="shl">${sc.ds.map(x => `<div class="shr"><span>${dTxt(x.d)}</span><span class="t2">${shRange(k)}</span>${x.f ? `<span class="st warn">Festivo +100%</span>` : x.dom ? `<span class="st warn">Domingo +50%</span>` : '<span></span>'}</div>`).join('')}</div>
  <div class="lbl2">Precio</div>${sc.L.map(l => kv(l[0], clp(l[1]))).join('')}${kv('Total', clp(sc.total), 'tot')}
  <div class="mt12 col8">${note('info', `Precio de ${first(p)} por turno. Sus recargos: domingo +${rcPct(p, 'dom')}%, festivos +${rcPct(p, 'fes')}%${c.jor ? '' : `, noche +${rcPct(p, 'noc')}%`}. Se cobra cada turno al terminarlo.`)}${note('notebook', 'En cada turno la cuidadora o TENS anota en la bitácora y deja la entrega de turno para la siguiente.')}</div>`; };
const steps = n => `<div class="steps">${['Hora', 'Detalles', 'Pago'].map((t, i) => `<span class="${i < n ? 'done' : i === n ? 'on' : ''}">${t}</span>`).join('')}</div>`;
const whoSub = w => { const f = FAM[w]; return f.e + ' años · ' + (f.al[0].startsWith('Sin') ? f.dx[0] : 'Alergia a ' + f.al[0].toLowerCase()); };
const nEx = () => { const pk = typeof pkAct === 'function' && pkAct(); if (pk) { const x = examList().length - pk[4].length; return `Pack ${pk[1]}${x > 0 ? ` y ${x} más` : ''}`; } const l = examList().map(e => e[0]); return l.length > 2 ? `${l.slice(0, 2).join(', ')} y ${l.length - 2} más` : l.join(' y '); };
const SHARE = { todo: ['Todo el historial', 'Notas, curaciones, signos vitales y remedios'], res: ['Solo el resumen', 'Alergias, diagnósticos, remedios y la última nota'], nada: ['Nada', 'Solo verá lo que escribas al agendar'] };
const shareBlock = () => `<div class="lbl2">¿Qué puede ver ${first()} de la ficha de ${whoTxt().split(' (')[0].split(' ')[0]}?</div>${Object.keys(SHARE).map(k => radioRow(SHARE[k][0] + (k === 'res' ? ' · recomendado' : ''), SHARE[k][1], S.share === k, 'set', 'share=' + k)).join('')}
  <button class="row" data-act="tog" data-arg="sharePh"><span class="tx"><div class="a">Compartir fotos de heridas</div><div class="b">Aparte. Solo si ${first()} las necesita para la curación</div></span><span class="tog ${S.sharePh ? 'on' : ''}"></span></button>
  <div class="xs t2 mt4">El acceso dura hasta 7 días después de la visita. Lo puedes revocar cuando quieras en <button class="lk u" data-go="P56">Privacidad de la ficha</button>.</div>`;
function nextAfterP14() { return CAT[S.item].receta ? 'P15' : 'P17'; }
def({ id: 'P14', name: 'Dirección y detalles', kind: 'page', back: true, title: 'Detalles', next: ['P15', 'P17', 'P40', 'P78', 'P94', 'P98', 'P99'],
  body: () => {
    const who = S.item === 'mue' ? `<div class="lbl2">¿Quiénes se hacen exámenes?</div>${row('box:user', whoTxt(), whoSub(S.who), 'P29', '<span class="lk">Cambiar</span>')}${coKeys().map(k => row('box:user-plus', whoTxt(k), coEx(k).length ? coEx(k).length + ' exámenes · ' + clp(coGross(k)) : 'Elige sus exámenes', 'P99', '<span class="lk">Exámenes</span>', '', 'coFor', k)).join('')}${row('box:users', 'Agregar a otra persona en esta visita', 'La toma se cobra una sola vez · exámenes por persona', 'P98')}` : `<div class="lbl2">¿Para quién es?</div>${row('box:user', whoTxt(), whoSub(S.who), 'P29', '<span class="lk">Cambiar</span>')}`;
    const addr = `<div class="lbl2">Dirección</div>${row('box:map-pin', P().n, P().full.split(', ').slice(1).join(', '), 'P08', '<span class="lk">Cambiar</span>', '', 'set', 'addrNext=P14')}`;
    const rbq = rbAsk();
    const head = `${steps(1)}<div class="h-l mt16">${CAT[S.item].n}</div><div class="t2 mt4 sm">Con ${PRO().n} · ${whenTxt()}</div>`;
    let x;
    if (S.item === 'mue') x = `<div class="lbl2">Exámenes</div>${row('box:test-tube', byOrder() ? 'Orden por confirmar' : nEx(), byOrder() ? 'Confirma los exámenes que leímos' : S.needOrd ? clp(examSum()) + ' · orden médica por confirmar' : clp(examSum()) + ' · ' + ayAgg(examKeys()).txt + ' · ' + plAgg(examKeys()).txt, 'P40', '<span class="lk">Cambiar</span>')}`;
    else if (isT()) x = `<div class="lbl2">¿Qué necesita en el turno?</div><div class="chips">${[['hig', 'Higiene y baño'], ['ali', 'Alimentación'], ['mov', 'Movilización'], ['rem', 'Recordar remedios'], ['com', 'Compañía']].map(t => chip(t[1], S.sh.need[t[0]], 'tog2', 'need.' + t[0])).join('')}</div><div class="lbl2">${('Algo que deba saber')}</div>${field('', 'Usa andador. Diabética, controla glicemia en la mañana.')}`;
    else if (S.item === 'iny' || CAT[S.item].g === 'vit') x = `<div class="lbl2">Medicamento</div>${field('pill', S.item === 'iny' ? 'Neurobionta 5.000 (ampolla)' : CAT[S.item].s + ' · lo traes tú con receta')}<div class="lbl2">${('¿Ya tienes el medicamento?')}</div><div class="chips">${chip('Sí, lo tengo', S.hasMed, 'set', 'hasMed=1')}${chip('Todavía no', !S.hasMed, 'set', 'hasMed=')}</div>${!S.hasMed ? `<div class="mt12">${note('warning', 'La profesional no lleva medicamentos. Cómpralo antes de la hora.', 'warn')}</div>` : ''}`;
    else x = `<div class="lbl2">Cuéntanos qué necesitas</div>${field('', S.item === 'son' ? 'Cambio de sonda Foley.' : S.item === 'sig' ? 'Control de presión y glicemia.' : 'Herida en el talón, curación cada 2 días.')}`;
    return `${head}${addr}${who}${x}${shareBlock()}${rbq}<div class="lbl2">${('Nota para ' + first() + ' (opcional)')}</div>${field('', '', 'Ej.: el timbre no funciona, llamar al llegar')}`;
  },
  foot: () => `<button class="btn" data-go="${nextAfterP14()}" ${rbReady() ? '' : 'disabled'}>Continuar</button>` });

def({ id: 'P15', name: 'Receta médica', kind: 'page', back: true, title: 'Receta médica',
  body: () => `${steps(1)}<div class="h-m mt16">Receta médica (opcional)</div><div class="t2 mt8 sm">Te recomendamos subir tu receta médica. Si no la tienes, puedes agendar igual. Si la subes, ${first()} la revisa antes de confirmar.</div>
  <div class="mt16">${S.receta ? `<div class="recok">${receta()}<div>${st('ok', 'Se lee bien', 'check-circle')}<button class="pill mt12" data-act="set" data-arg="receta=">${ic('arrow-counter-clockwise')}Cambiar</button></div></div>`
    : `<div class="chips"><button class="chip ${S.sinRec ? '' : 'on'}" data-act="set" data-arg="sinRec=">${ic('upload-simple')}Subir receta (opcional)</button><button class="chip ${S.sinRec ? 'on' : ''}" data-act="set" data-arg="sinRec=1">${ic('x-circle')}No tengo receta</button></div>
    ${S.sinRec ? `<div class="mt12">${note('info', 'Puedes agendar igual. La profesional decide en la visita si puede administrar el medicamento sin receta.')}</div>` : `<div class="drop mt12"><div class="row8"><button class="pill on" data-act="receta">${ic('camera')}Tomar foto</button><button class="pill" data-act="receta">${ic('image')}Elegir de fotos</button></div><div class="t3 sm">Foto completa, derecha y con luz</div></div>`}`}</div>
  ${S.sinRec && !S.receta ? '' : `<div class="lbl2">Revisa que se vea</div>`}
  ${S.sinRec && !S.receta ? '' : ['Nombre del paciente', 'Medicamento, dosis y frecuencia', 'Firma y timbre del médico', 'Fecha (menos de 6 meses)'].map(t => `<div class="chk">${ic('check')}<span>${t}</span></div>`).join('')}`,
  foot: () => abtn('Continuar', '', '', '', 'P17') });

const bkv = l => l[2] === 'dsc' ? `<div class="kv dsc"><span class="k">${ic('tag')}${l[0]}</span><span class="num">−${clp(-l[1])}</span></div>` : kv(l[0], clp(l[1]));
const breakdown = () => { const p = price(); if (S.item === 'mue' && !isT()) return `${p.L.map(l => l[0].startsWith('Exámenes') ? `${bkv(l)}<div class="exsub">${examList().map(e => `<span>${e[0]}</span><span class="num">${clp(e[1])}</span>`).join('')}</div>` : bkv(l)).join('')}${p.pend ? kv('Exámenes (laboratorio)', 'Por confirmar') : ''}${kv(p.pend ? 'Total por ahora' : 'Total', clp(p.total), 'tot')}`;
  return `${p.L.map(bkv).join('')}${kv('Total', clp(p.total), 'tot')}`; };
const cuidaRow = () => { const p = price(), svcN = isT() ? 'de los turnos' : 'del servicio'; return S.cuida ? row('box:tag', 'CUIDAPP15 aplicado', p.disc ? `Primera atención · −${clp(p.disc)} (15% ${svcN}, hasta $20.000)` : 'Primera atención · 15% hasta $20.000', '', '<span class="lk sm">Quitar</span>', '', 'set', 'cuida=0') : row('box:tag', 'Tienes un código', 'CUIDAPP15 · 15% en tu primera atención, hasta $20.000', '', '<span class="lk sm">Aplicar</span>', '', 'set', 'cuida=1'); };

def({ id: 'P17', name: 'Revisa y paga', kind: 'page', back: true, title: 'Revisa y paga',
  body: () => `${steps(2)}<div class="rvw mt16"><div class="rvw-h">${pav(PRO(), '', true)}<div><div class="b-m">${CAT[S.item].n}</div><div class="sm t2">con ${PRO().n} · ${rate(PRO(), false)}</div></div></div>
  <div class="rvw-r">${ic('calendar-blank')}<span>${whenLong()}</span><button class="lk" data-go="P13">Cambiar</button></div>
  <div class="rvw-r">${ic('map-pin')}<span>${P().full}</span><button class="lk" data-act="set" data-arg="addrNext=P17" data-go="P08">Cambiar</button></div>
  <div class="rvw-r">${ic('user')}<span>${whoTxt()}${coKeys().length ? ' + ' + coKeys().map(k => FAM[k].c).join(', ') : ''}</span><button class="lk" data-go="${S.item === 'mue' ? 'P98' : 'P29'}">Cambiar</button></div>
  <div class="rvw-r">${ic('lock-simple')}<span>Ficha: ${SHARE[S.share][0].toLowerCase()}${S.sharePh ? ' y fotos' : ''}</span><button class="lk" data-go="P14">Cambiar</button></div>
  <div class="rvw-r">${ic('shield-check')}<span>Previsión: ${pvTxt()}</span><button class="lk" data-act="pvFor" data-arg="${S.who}" data-go="P64">Cambiar</button></div>${S.item === 'iny' || CAT[S.item].g === 'vit' ? `<div class="rvw-r">${ic('file-text')}<span>${S.receta ? 'Receta adjunta · ' + (S.item === 'iny' ? 'Neurobionta 5.000' : CAT[S.item].s) : 'Sin receta (opcional)'}</span><button class="lk" data-go="P15">${S.receta ? 'Ver' : 'Subir'}</button></div>` : ''}${S.item === 'mue' ? `<div class="rvw-r">${ic('test-tube')}<span>${byOrder() ? 'Orden médica por confirmar' : nEx() + (S.ordFrom ? ' · según tu orden' : S.needOrd ? ' · orden por el laboratorio' : '')}</span><button class="lk" data-go="P40">Cambiar</button></div>` : ''}</div>
  <div class="lbl2">Pago</div>${row('box:' + (S.pay === 'mp' ? 'wallet' : 'credit-card'), S.pay === 'mp' ? 'Saldo Mercado Pago' : S.pay === 'deb' ? 'Redcompra •••• 0937' : 'Visa •••• 4821', 'Con Mercado Pago', 'P18', '<span class="lk">Cambiar</span>')}
  <div class="mt12">${cuidaRow()}</div>${S.item === 'mue' ? `<div class="lbl2">Preparación y resultados</div>${prepRows()}${prepChk()}${embQ()}` : ''}<div class="lbl2">Desglose</div>${breakdown()}${S.item === 'mue' && S.needOrd && !S.ordFrom ? kv('Orden médica', 'Por confirmar') : ''}<div class="xs t2 mt4">${S.item === 'mue' ? `${first()} fija la toma. Los exámenes tienen el precio del laboratorio.` : `El precio y sus recargos los fija ${first()}.${isaOf(S.who) && S.rbAuto ? ` La gestión de reembolso (${clp(RB_FEE)}) es de Cuidapp y la ves aquí antes de pagar.` : ' Sin cobros ocultos.'}`}</div>
  ${reembolsoBlock()}${rbAutoRow() ? `<div class="mt8">${rbAutoRow()}</div>` : ''}<div class="mt16 col8">${note('lock-simple', isT() ? `No te cobramos todavía. Cuando ${first()} confirme, retenemos el primer turno (${clp(price().pro)}) y cada turno se cobra al terminarlo.` : `No te cobramos todavía. Cuando ${first()} confirme, retenemos ${clp(price().total)} y se cobra al terminar la atención.`, 'inf')}${note('calendar-x', 'Cancelación gratis hasta 12 horas antes.')}</div>`,
  foot: () => `<div class="fbar"><div class="fb-l"><b class="num">${clp(price().total)}</b><span>Total</span></div><button class="btn fbtn" data-go="P19" data-act="set" data-arg="cancelFrom=P19" ${needPrep() && !S.prepOk ? 'disabled' : ''}>Confirmar y pagar</button></div>` });

def({ id: 'P18', name: 'Métodos de pago', kind: 'page', back: true, title: 'Pago',
  body: () => `${radioRow('Visa •••• 4821', 'Tarjeta de crédito', S.pay === 'visa', 'set', 'pay=visa', 'credit-card')}
  ${radioRow('Redcompra •••• 0937', 'Tarjeta de débito', S.pay === 'deb', 'set', 'pay=deb', 'credit-card')}
  ${radioRow('Saldo Mercado Pago', 'Disponible $52.300 · daniela.fuentes@gmail.com', S.pay === 'mp', 'set', 'pay=mp', 'wallet')}
  ${row('box:plus', 'Agregar tarjeta', 'Débito o crédito', '', ic('caret-right'), '', 'toast', 'Se abre el checkout de Mercado Pago para agregar tu tarjeta.')}
  <div class="mt16">${note('shield-check', 'Pagas con Mercado Pago: tarjetas de crédito, débito o saldo Mercado Pago. Cuidapp no guarda los números de tu tarjeta.')}</div>`,
  foot: () => btn('Listo', 'back') });

/* estado «pensando»: iconos 3D saltando (thinking.css) */
const THK = '<div class="thk" role="status" aria-label="Esperando respuesta"><img src="web/assets/emoji/iny.webp?v=20261026t1" alt="" style="--i:0" draggable="false"><img src="web/assets/emoji/vit.webp?v=20261026t1" alt="" style="--i:1" draggable="false"><img src="web/assets/emoji/cur.webp?v=20261026t1" alt="" style="--i:2" draggable="false"><img src="web/assets/emoji/mue.webp?v=20261026t1" alt="" style="--i:3" draggable="false"><img src="web/assets/emoji/cron.webp?v=20261026t1" alt="" style="--i:4" draggable="false"><img src="web/assets/emoji/sig.webp?v=20261026t1" alt="" style="--i:5" draggable="false"></div>';
def({ id: 'P19', name: 'Esperando confirmación', kind: 'page', auto: 'P20', autoAct: () => { S.booked = true; },
  body: () => `<div class="center" style="margin-top:32px">${pav(PRO(), 'xl', true)}</div><div class="mt24">${THK}</div><div class="h-l mt16 center">Le enviamos tu solicitud a ${first()}</div>
  <div class="t2 mt8 center">Suele responder en ${PRO().resp}. Si no puede, te avisamos y eliges a otra.</div>
  <div class="progress bar-anim mt24"><span></span></div>
  <div class="mt16">${row('box:check', 'Solicitud enviada', `${CAT[S.item].n} · ${whenTxt()}`, '', '')}${row('box:hourglass-medium', `${first()} revisa tu solicitud`, S.item === 'iny' ? 'También revisa la receta' : 'Y confirma la hora', '', st('inf', 'En curso'))}${row('box:lock-simple', 'Aún no te cobramos nada', `Retenemos ${clp(price().total)} cuando confirme`, '', '')}</div>`,
  foot: () => `${btn('Ir a Servicios', 'P06', 'sec')}${btn('Cancelar solicitud', 'P30', 'ghost')}`, enter: () => T(() => { S.booked = true; go('P20'); }, 4500) });

def({ id: 'P20', name: 'Cita confirmada', kind: 'page', next: ['P27'],
  body: () => `<div class="okc mt24">${ic('check', 0).replace('ph ', 'ph-bold ')}</div>
  <div class="h-l mt16">¡Listo! ${first()} confirmó tu cita</div><div class="t2 mt8">${whenLong()}</div>
  <div class="rvw mt24"><div class="rvw-h">${pav(PRO(), '', true)}<div><div class="b-m">${PRO().n}</div><div class="sm t2">${PRO().t} · ${PRO().tel}</div></div></div>
  <div class="rvw-r">${ic(CAT[S.item].ic)}<span>${CAT[S.item].n} · ${whoTxt()}</span></div><div class="rvw-r">${ic('map-pin')}<span>${P().full}</span></div><div class="rvw-r">${ic('lock-simple')}<span>Retuvimos ${clp(price().total)} en Mercado Pago · se cobra al terminar</span></div><div class="rvw-r">${ic('receipt')}<span>Incluye costo por servicio (${S.svcP}%) ${clp(price().sf)}${price().L.some(l => l[0] === 'Gestión de reembolso') ? ` y gestión de reembolso ${clp(RB_FEE)}` : ''}</span></div>${price().disc ? `<div class="rvw-r">${ic('tag')}<span>Incluye descuento primera atención (CUIDAPP15) −${clp(price().disc)}</span></div>` : ''}</div>
  ${previa()}${S.item === 'mue' ? `<div class="lbl2">Cómo prepararte</div>${prepRows()}` : ''}${diaVisita()}
  <div class="mt12">${note('envelope-simple', 'Te enviamos el comprobante por correo. El día antes te recordamos la cita con una notificación push.')}</div>
  ${acts([['calendar-plus', 'Agregar a mi calendario', 'toast', 'Agregado a tu calendario.'], ['chat-circle', `Escribirle a ${first()}`, '', '', 'P22'], ['share-network', 'Compartir con la familia', 'toast', 'Link copiado. Mándalo por WhatsApp.']])}${reagCan()}`,
  foot: () => `${abtn('Ver mis citas', 'book', '', '', 'P26')}${btn('Ir a Servicios', 'P06', 'ghost')}` });

const addMin = (t, m) => { const [h, mi] = t.split(':').map(Number), x = h * 60 + mi + m; return String(Math.floor(x / 60) % 24).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0'); };
/* estado simple de llegada, sin mapa */
const etaCard = () => `<div class="eta mt16"><div class="eta-h"><span class="eta-d"></span><div style="flex:1;min-width:0"><b>${first()} va en camino</b><div class="sm t2">Llega aprox. ${addMin(S.slot, 10)} · te avisamos con una notificación cuando llegue</div></div></div>
  <div class="note inf mt12">${ic('key')}<div>Tu código es <b class="num" style="font-size:17px;letter-spacing:2px">2749</b>. Dáselo a ${first()} cuando llegue.</div></div>
  <div class="row8 mt12"><button class="btn sec" data-act="toast" data-arg="Llamando a ${first()}…">${ic('phone')}Llamar</button><button class="btn sec" data-go="P22">${ic('chat-circle')}Mensaje</button></div>
  <button class="lk sm mt12" data-act="set" data-arg="phase=llego" data-go="P23">Simular llegada</button></div>`;

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
  <button class="push mt16" data-go="P58"><div class="push-h"><img src="logo/apple-touch-icon.png" alt=""><span>Cuidapp</span><span class="t3">ahora</span></div><b>${first()} dejó el resumen de la visita de hoy</b><div>Toca para ver qué hacer en casa y las señales de alarma.</div></button>
  <div class="h-l mt16">Atención terminada</div><div class="t2 mt8">${S.item === 'iny' ? 'Inyección de Neurobionta aplicada' : CAT[S.item].n} a ${whoTxt().split(' (')[0]}</div>
  <div class="lbl2">Nota de ${first()}</div><div class="note">${ic('note')}<div>${S.item === 'iny' ? 'Glúteo derecho. Sin reacción. Próxima dosis en 48 h según receta.' : 'Sin novedades. Dejé las indicaciones en la ficha.'}</div></div><button class="btn sec mt8" data-go="P58">${ic('notebook')}Ver resumen de la visita</button>
  <div class="mt16">${kv('Cobrado con Mercado Pago · ' + (S.pay === 'mp' ? 'saldo' : S.pay === 'deb' ? 'Redcompra •••• 0937' : 'Visa •••• 4821'), clp(price().total))}</div>${row('box:receipt', 'Boletas y reembolso', pvTxt() + ' · RUT ' + RUTS[S.who] + (S.item === 'mue' ? ' · con códigos Fonasa' : ''), 'P65', st('ok', 'Lista', ''))}${isaOf(S.who) && S.rbAuto ? row('box:lightning', 'Reembolso automático', `Preparando el envío a ${isaOf(S.who).is} · gestión ${clp(RB_FEE)} incluida`, 'P81', st('inf', 'En curso', 'paper-plane-tilt'), '', 'rb', 'r1') : rbAutoRow()}<div class="mt12">${note('envelope-simple', 'Te enviamos el comprobante por correo a daniela.fuentes@gmail.com.')}</div>`,
  foot: () => `${btn('Dejar una reseña a ' + first(), 'P25')}<div class="row8"><button class="btn sec" data-go="P65">${ic('receipt')}Mis boletas</button><button class="btn sec" data-act="again" data-go="P13">${ic('repeat')}Agendar otra</button></div>` });

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
  <div class="citas mt16">${l.length ? l.map(citaCard).join('') : emptyS('calendar-blank', S.ctab === 'next' ? 'No tienes citas próximas' : 'Aún no tienes citas pasadas', S.ctab === 'next' ? 'Agenda una inyección, una curación o una toma de exámenes en casa.' : 'Cuando termines una atención, la verás aquí con su boleta.', S.ctab === 'next' ? btn('Agendar un servicio', 'P07') : '')}</div>
  ${S.ctab === 'past' ? `<div class="again mt16"><div><div class="b-m">¿Repetimos con Camila?</div><div class="sm t2">Curación simple · ${clp(priceOf(PRO('cr'), 'cur'))}</div></div><button class="pill on" data-act="pick" data-arg="cr|" data-go="P13">${ic('repeat')}Agendar</button></div>` : `<button class="newb mt16" data-go="P07">${ic('plus')}Agendar otro servicio</button>`}`; } });

def({ id: 'P27', name: 'Detalle de la cita', kind: 'page', back: true, title: 'Detalle de la cita', next: ['P23', 'P13', 'P42'],
  body: () => S.det === 'next' ? `<div class="h-l">${CAT[S.item].n}</div><div class="t2 mt4">${whenLong()}</div><div class="mt8">${st('ok', 'Confirmada', 'check-circle')}</div>${etaCard()}
  <div class="rvw mt16"><div class="rvw-h" data-act="pick" data-arg="${S.pro}|" data-go="P12" role="button">${pav(PRO(), '', true)}<div style="flex:1"><div class="b-m">${PRO().n}</div><div class="sm t2">${PRO().t} · ${rate(PRO(), false)}</div></div>${ic('caret-right')}</div>
  <div class="rvw-r">${ic('map-pin')}<span>${P().full}</span></div><div class="rvw-r">${ic('user')}<span>${whoTxt()}</span></div><div class="rvw-r">${ic('lock-simple')}<span>${clp(price().total)} retenido · se cobra al terminar</span></div>${price().disc ? `<div class="rvw-r">${ic('tag')}<span>Descuento primera atención (CUIDAPP15) −${clp(price().disc)}</span></div>` : ''}</div>
  ${previa()}${S.item === 'mue' ? `<div class="lbl2">Exámenes</div>${byOrder() ? row('box:file-text', 'Según orden médica', 'Confirma los exámenes y ves el precio', '', '') : examList().map(e => kv(e[0], clp(e[1]))).join('')}${byOrder() ? '' : prepRows()}${row('box:file-pdf', 'Resultados', 'Los recibes en PDF en la app', '', st('neu', 'Pendiente', ''))}` : ''}
  ${acts([['chat-circle', `Chat con ${first()}`, '', '', 'P22'], ['calendar-plus', 'Agregar a mi calendario', 'toast', 'Agregado a tu calendario.']])}
  ${reagCan('camino', false)}<div class="mt16">${note('calendar-x', 'Cancelación gratis hasta 12 horas antes. Después se cobra $5.000 por el traslado.')}</div>`
    : S.det === 'pastm' ? `<div class="h-l">Toma de muestras</div><div class="t2 mt4">3 oct · 07:30 · Av. Irarrázaval 3450, Ñuñoa</div><div class="mt16">${proCard(false, false, 'pg')}</div>
  <div class="lbl2">Resultados</div>${row('box:file-pdf', 'Resultados en PDF', 'Laboratorio · 4 oct', 'P42', st('ok', 'Listos'))}
  <div class="lbl2">Pago</div>${kv('Toma a domicilio · Paula', '$12.000')}${['hemo', 'lip', 'bioq'].map(k => kv(EXAMS[k][0], clp(EXAMS[k][1]))).join('')}${kv('Total · Visa •••• 4821', clp(12000 + ['hemo', 'lip', 'bioq'].reduce((a, k) => a + EXAMS[k][1], 0)), 'tot')}`
    : `<div class="h-l">Curación simple</div><div class="t2 mt4">12 sep · 19:00 a 19:45 · Av. Irarrázaval 3450, Ñuñoa</div><div class="mt16">${proCard()}</div>
  <div class="lbl2">Pago</div>${kv('Curación simple · precio de Camila', '$24.000')}${kv('Total · Visa •••• 4821', '$24.000', 'tot')}
  <div class="lbl2">Nota de la profesional</div><div class="note">${ic('note')}<div>Herida limpia, sin signos de infección. Repetir en 48 h.</div></div>${row('box:notebook', 'Ver en la ficha de Rosa', 'Nota firmada, signos vitales y fotos', 'P52', ic('caret-right'), '', 'fm', 'mama')}`,
  foot: () => S.det === 'next' ? '' : `<div class="row8"><button class="btn sec" data-go="P65">${ic('receipt')}Mis boletas</button><button class="btn sec" data-go="P95">${ic('lifebuoy')}Ayuda</button></div>${abtn('Agendar otra vez', 'pick', 'cr|', '', 'P13')}` });

def({ id: 'P42', name: 'Resultados de exámenes', kind: 'page', back: true, title: 'Resultados',
  body: () => `<div class="pdf"><div class="pdf-h"><div><b>Cuidapp · Laboratorio</b><div class="xs t2">Informe de resultados · 4 oct 2026</div></div>${ic('file-pdf', 1)}</div>
  <div class="xs t2 mt8">Paciente: <b style="color:var(--text)">Rosa Muñoz Pérez</b> · 78 años · Toma: 3 oct 07:30 · Paula Godoy (TENS)</div>
  <table class="rtab mt12"><tr><th>Examen</th><th>Resultado</th><th>Referencia</th></tr>
  ${[['Hemoglobina', '13,2 g/dL', '12 – 16'], ['Leucocitos', '6.800 /µL', '4.500 – 11.000'], ['Plaquetas', '245.000 /µL', '150.000 – 400.000'], ['Colesterol total', '<b>212 mg/dL</b>', '< 200'], ['HDL', '54 mg/dL', '> 40'], ['LDL', '<b>131 mg/dL</b>', '< 130'], ['Triglicéridos', '138 mg/dL', '< 150'], ['Glucosa', '96 mg/dL', '70 – 100'], ['Creatinina', '0,9 mg/dL', '0,5 – 1,1']].map(r => `<tr><td>${r[0]}</td><td class="num">${r[1]}</td><td class="num t2">${r[2]}</td></tr>`).join('')}</table>
  <div class="xs t3 mt12">Valores en negrita fuera de rango. Este informe no reemplaza la evaluación de tu médico.</div></div>`,
  foot: () => `${abtn(ic('download-simple') + 'Descargar PDF', 'toast', 'Descargado: Resultados-Rosa-Munoz-04-10-2026.pdf')}${abtn(ic('share-network') + 'Enviar a mi médico', 'toast', 'Listo. Le enviamos el PDF a la Dra. Marcela Ortiz.', 'sec')}` });

def({ id: 'P45', name: 'Promoción', kind: 'page', back: true, title: '', next: ['P40', 'P10'],
  body: () => { const k = S.promo, p = PROMO[k];
    const det = k === 'kin' ? `<div class="mt16">${row('box:person-simple-walk', 'Kinesiología motora', 'Después de una cirugía, caídas o reposo largo', '', '')}${row('box:wind', 'Kinesiología respiratoria', 'Para niños y adultos mayores', '', '')}${row('box:map-pin', 'Primero en Ñuñoa y Providencia', 'Te avisamos por correo cuando abra', '', '')}</div>`
      : k === 'first' ? `<button class="codebox mt16" data-act="code"><span><span class="xs t2">Tu código</span><b>CUIDAPP15</b></span><span class="lk">${ic('copy')}Copiar</span></button>
        <div class="lbl2">Condiciones</div><div class="sm t2" style="line-height:21px">15% en tu primera atención en Cuidapp, hasta $20.000 de descuento. Vale para cualquier servicio y profesional. No aplica a los exámenes del laboratorio. Válido hasta el 30 nov 2026.</div>`
      : `<div class="mt16">${row('box:test-tube', 'Elige exámenes por $30.000 o más', 'En tu primer pedido de exámenes', '', '')}${row('box:percent', '20% de descuento en los exámenes', 'Hasta $20.000. Se descuenta solo en el resumen', '', '')}${row('box:file-pdf', 'Resultados en PDF', 'Los recibes en el detalle de tu cita', '', '')}</div>
        <div class="xs t3 mt12">Ejemplo: ${['hemo', 'lip', 'bioq', 'tsh', 'hba'].map(k => EXAMS[k][0].toLowerCase()).join(' + ')} = ${clp(['hemo', 'lip', 'bioq', 'tsh', 'hba'].reduce((a, k) => a + EXAMS[k][1], 0))}.</div>`;
    return `<div class="promo big ${p.cls}"><div class="pr-tx"><span class="pr-eb">${p.eb}</span><b class="pr-t">${p.t}</b><span class="pr-d">${p.d}</span></div><span class="pr-ic">${i3(p.ic)}</span></div>${det}<div class="xs t3 mt24">Promoción de ejemplo del prototipo.</div>`; },
  foot: () => S.promo === 'kin' ? abtn(S.kinAv ? ic('check') + 'Te avisaremos' : ic('bell') + 'Avísame cuando abra', 'kinAv', '', S.kinAv ? 'sec' : '')
    : S.promo === 'first' ? btn('Buscar profesional', 'P10', '', 'data-act="svc" data-arg=""') : abtn('Elegir exámenes', 'grp', 'mue', '', 'P40') });

def({ id: 'P34', name: 'Favoritos', kind: 'page', tab: 'favoritos',
  body: () => { const l = PROS.filter(p => S.fav[p.id]); return `<h1 class="h-xl mt8">Favoritos</h1><div class="t2 sm mt4">Tus profesionales de confianza, para volver a agendar en dos toques.</div>
  ${l.length ? `<div class="rlist mt16">${l.map(p => `<div class="favc" data-act="pick" data-arg="${p.id}|" data-go="P12" role="button">${pav(p, 'l', true)}<div class="tx"><div class="b-m">${p.n}</div><div class="sm t2">${p.t} · ${rate(p)}</div><div class="sm t2">Desde <b class="num">${clp(priceOf(p, ''))}</b> · ${nextOf(p) ? 'Próxima: ' + dayLbl(nextOf(p)[0]) + ' ' + nextOf(p)[1] : 'Sin horas'}</div></div>${heart(p.id)}<button class="pill on fbk" data-act="pick" data-arg="${p.id}|" data-go="P13">Agendar</button></div>`).join('')}</div>`
    : `<div class="empty mt24">${ic('heart')}<div class="b-m mt8">Aún no tienes favoritas</div><div class="sm t2 mt4">Toca el corazón en un perfil para guardarla aquí.</div>${btn('Buscar profesionales', 'P10', 'sec')}</div>`}`; } });

def({ id: 'P28', name: 'Cuenta', kind: 'page', tab: 'cuenta',
  body: () => `<div class="acct mt8"><div><h1 class="h-xl">Daniela</h1><div class="sm t2 mt4">${st('ok', 'Cuenta verificada', 'seal-check')}</div></div>${av('DF', 'l')}</div>
  <div class="tiles2 mt24">${[['lifebuoy', 'Ayuda', 'P95'], ['credit-card', 'Pagos', 'P18'], ['calendar-blank', 'Mis citas', 'P26']].map(t => `<button class="tile" ${t[2] ? `data-go="${t[2]}"` : `data-act="${t[3]}" data-arg="${t[4]}"`}>${ic(t[0])}<span class="n">${t[1]}</span></button>`).join('')}</div>
  <div class="mt16">${row('users', 'Pacientes', S.mem.map(w => w === 'yo' ? 'Tú' : FAM[w].c).join(', '), 'P29')}${Object.keys(S.isa).length ? row('link', 'Mi Isapre', Object.keys(S.isa).map(w => S.isa[w].is + ' vinculada').join(' · '), 'P82', st('ok', 'Vinculada', 'link'), '', 'lkW', Object.keys(S.isa)[0]) : row('link', 'Mi Isapre · Vincular', 'Conecta tu Isapre y te ayudamos a enviar tus reembolsos', 'P78', '<span class="lk">Vincular</span>', '', 'lkW', 'yo')}${row('receipt', 'Reembolsos', Object.keys(S.isa).length ? Object.keys(S.isa).map(w => S.isa[w].is + ' vinculada').join(' · ') : 'Vincula tu Isapre y te ayudamos a enviarlos', 'P80', Object.keys(S.isa).length ? st('ok', 'Isapre vinculada', 'link') : ic('caret-right'))}${row('notebook', 'Fichas de salud', 'Notas de cada visita, curaciones y signos vitales', 'P50')}${row('map-pin', 'Direcciones', 'Casa y Mamá', 'P08', ic('caret-right'), '', 'set', 'addrNext=P28')}${row('heart', 'Favoritos', `${Object.values(S.fav).filter(Boolean).length} profesionales`, 'P34')}${row('shield-check', 'Datos de salud y privacidad', 'Consentimiento y descarga de tus datos', 'P04')}${row('stethoscope', 'Trabaja con Cuidapp', 'Para enfermeras y TENS', 'R01')}${row('sign-out', 'Cerrar sesión', '', 'S01', '')}</div>` });

def({ id: 'P95', name: 'Ayuda', kind: 'page', back: true, title: 'Ayuda',
  body: () => `<div class="sm t2 mt8">Escríbenos y te respondemos por correo.</div>
  <div class="mt8">${row('box:envelope-simple', 'Clientes', 'clientes@cuidapp.io', '', '', '', 'toast', 'Escríbenos a clientes@cuidapp.io')}${row('box:lifebuoy', 'Soporte', 'soporte@cuidapp.io', '', '', '', 'toast', 'Escríbenos a soporte@cuidapp.io')}</div>
  <div class="mt16">${note('shield', 'Por tu seguridad, no compartas datos de tarjetas ni claves por correo.')}</div>` });

def({ id: 'P29', name: 'Pacientes guardados', kind: 'page', back: true, title: 'Pacientes',
  body: () => `<div class="t2 sm">¿Para quién es la atención?</div><div class="mt8">
  ${S.mem.map(w => radioRow(whoTxt(w).replace(/ \((.*)\)/, ' · $1'), whoSub(w), S.who === w, 'set', 'who=' + w, 'user')).join('')}
  ${row('box:shield-check', 'Previsión de ' + whoTxt().split(' ')[0], pvTxt() + ' · RUT ' + RUTS[S.who], 'P64', '<span class="lk">Cambiar</span>', '', 'pvFor', S.who)}${row('box:plus', 'Agregar integrante', 'Nombre, RUT, nacimiento, sexo y previsión', 'P57', '', '', 'nmNew', '')}${S.item === 'mue' ? row('box:users', 'Varias personas en la misma visita', 'Exámenes por persona · toma una sola vez', 'P98') : ''}${row('box:notebook', 'Ver fichas de salud', 'Lo que han anotado las profesionales', 'P50')}</div>`,
  foot: () => btn('Listo', 'back') });

def({ id: 'P30', name: 'Cancelar', kind: 'page', back: true, title: 'Cancelar',
  body: () => `<div class="h-m">¿Por qué cancelas?</div><div class="mt8">${['Ya no la necesito', 'Me equivoqué de hora o dirección', 'Encontré otra hora', 'Otro motivo'].map((t, i) => radioRow(t, '', (S.cr || 0) === i, 'set', 'cr=' + i)).join('')}</div>
  <div class="mt16">${S.cancelFrom === 'camino' ? note('warning', `${first()} ya va en camino. Se cobra $5.000 por el traslado y liberamos el resto.`, 'warn') : S.cancelFrom === 'P19' ? note('check-circle', 'Aún no te cobramos nada. Cancelar no tiene costo.') : note('check-circle', `Faltan más de 12 horas: cancelar es gratis y liberamos los ${clp(price().total)} retenidos.`)}</div>`,
  foot: () => `${abtn('Cancelar cita', 'cancel', '', 'danger', 'P06')}${btn('Volver', 'back', 'ghost')}` });

/* ===== escritorio paciente ===== */
def({ id: 'W01', name: 'Servicios (web)', kind: 'dfree', dtab: 'servicios', sheets: ['wsvc'],
  sheet: () => `<div class="h-s">¿Qué servicio necesitas?</div>${GALL.map(g => `<div class="lbl2">${GRP[g].n}</div>${GRP[g].l.map(k => svcRow(k)).join('')}`).join('')}`,
  body: () => `<section class="whero"><div class="wh-in"><h1 class="h-xxl">Enfermeras, TENS y cuidadoras a domicilio, con precio y reseñas a la vista</h1><p class="t2 lg mt16">Busca el servicio, compara profesionales verificadas en ${P().c} y agenda la hora que te acomode.</p>
  <div class="wsearch mt32"><button class="ws-f" data-act="set" data-arg="sheet=wsvc"><span class="xs t2">Servicio</span><b>${svcN(S.item)}</b></button><span class="ws-d"></span><button class="ws-f" data-act="set" data-arg="addrNext=W01" data-go="P08"><span class="xs t2">Dirección</span><b>${P().n}, ${P().c}</b></button><button class="btn ws-b" data-go="W02">${ic('magnifying-glass')}Buscar</button></div>
  <div class="chips mt16">${['iny', 'vneu', 'vd', 'mue', 'cur', 'cuid'].map(k => `<button class="chip" data-act="svc" data-arg="${k}" data-go="${k === 'mue' ? 'P40' : 'W02'}">${k === 'mue' ? 'Exámenes de laboratorio' : k === 'iny' ? CAT[k].n : CAT[k].s}</button>`).join('')}</div></div></section>
  <section class="wsec wpromo"><div class="wprow">${Object.keys(PROMO).map(promoCard).join('')}</div></section>
  <section class="wsec"><div class="shd"><h2 class="h-l">Explora por categoría</h2><button class="lk" data-go="P33">Ver todas · Kinesiología y Medicamentos muy pronto</button></div><div class="wcats mt24">${GK.map(k => { const [n, mn] = grpStats(k); return `<button class="wcat" data-act="grp" data-arg="${k}" data-go="${grpGo(k)}"><span class="ci">${i3(k)}</span><b>${GRP[k].n}</b><span class="sm t2">${GRP[k].l.length > 1 ? GRP[k].l.slice(0, 4).map(x => CAT[x].s).join(' · ') + (GRP[k].l.length > 4 ? ' y más' : '') : k === 'mue' ? 'Precio del laboratorio + toma' : nPro(n) + ' · desde ' + clp(mn)}</span></button>${k === 'mue' ? `<button class="wcat" data-go="P74"><span class="ci">${i3('pk')}</span><b>Packs de exámenes</b><span class="sm t2">${PACKS.length} chequeos · desde ${clp(Math.min(...PACKS.map(pkPr)))}</span></button>` : ''}`; }).join('')}</div></section>
  ${destacadas().length ? `<section class="wsec"><div class="shd"><h2 class="h-l">Destacadas</h2><button class="lk" data-act="svc" data-arg="" data-go="W02">Ver todas</button></div><div class="wfeat mt24">${destacadas().slice(0, 4).map(fcard).join('')}</div></section>` : ''}
  <section class="wsec"><div class="shd"><h2 class="h-l">Recomendadas cerca de ti</h2><button class="lk" data-act="svc" data-arg="" data-go="W02">Ver todas</button></div><div class="wfeat mt24">${featured().slice(0, 4).map(fcard).join('')}</div></section>
  <section class="wsec last"><h2 class="h-l">Cómo funciona</h2><div class="wsteps mt24">${[['magnifying-glass', 'Busca el servicio', 'Inyección, curación, exámenes, turnos de cuidadora o TENS.'], ['users-three', 'Compara', 'Precio, qué incluye, reseñas reales y próxima hora libre.'], ['calendar-check', 'Agenda y listo', 'Pagas en la app. Se cobra solo al terminar la atención.']].map((s, i) => `<div class="wst"><span class="n">${i + 1}</span>${ic(s[0])}<b>${s[1]}</b><span class="t2">${s[2]}</span></div>`).join('')}</div></section>` });

def({ id: 'W02', name: 'Resultados (web)', kind: 'dfree', dtab: 'servicios', sheets: ['sort'], sheet: sortSheet,
  body: () => { const l = prosFor(), [a, b] = range(l); return `<div class="wres">
  <aside class="wfil"><div class="h-s">Filtros</div>
   <div class="wf"><b>Precio</b>${hist()}<div class="chips mt8">${[[0, 'Cualquiera'], [15000, 'Hasta $15.000'], [20000, 'Hasta $20.000']].map(x => chip(x[1], S.fmax === x[0], 'set', 'fmax=' + x[0])).join('')}</div></div>
   <div class="wf"><b>Disponibilidad</b><div class="chips mt8">${[['all', 'Cualquier día'], ['hoy', 'Disponible hoy'], ['man', 'Hoy o mañana']].map(x => chip(x[1], S.fday === x[0], 'set', 'fday=' + x[0])).join('')}</div></div>
   <div class="wf"><b>Profesión</b>${checkRow('Enfermera/o', S.f.enf, 'tog', 'f.enf')}${checkRow('TENS', S.f.tens, 'tog', 'f.tens')}${checkRow('Cuidadora', S.f.cuid, 'tog', 'f.cuid')}</div>
   <div class="wf"><b>Valoración</b><div class="chips mt8">${[[0, 'Todas'], [4.8, '4,8 o más']].map(x => chip(x[1], S.frat === x[0], 'set', 'frat=' + x[0])).join('')}</div></div>
   <div class="wf"><b>Comuna</b><div class="chips mt8">${[['', 'Todas'], ['Ñuñoa', 'Ñuñoa'], ['Providencia', 'Providencia'], ['Las Condes', 'Las Condes']].map(x => chip(x[1], S.fcom === x[0], 'set', 'fcom=' + x[0])).join('')}</div></div>
   <div class="wf last"><b>Género</b><div class="chips mt8">${[['', 'Indistinto'], ['f', 'Mujer'], ['m', 'Hombre']].map(x => chip(x[1], S.fgen === x[0], 'set', 'fgen=' + x[0])).join('')}</div></div>
   <button class="lk u mt16" data-act="clearF">Limpiar filtros</button></aside>
  <main class="wlist"><div class="wl-h"><div><h1 class="h-l">${svcN(S.item)} en ${P().c}</h1><div class="t2 mt4">${nPro(l.length)} · desde <b class="num">${clp(a)}</b> hasta <b class="num">${clp(b)}</b></div></div><button class="qc" data-act="set" data-arg="sheet=sort">${ic('arrows-down-up')}${SORTS.find(x => x[0] === S.sort)[1]}${ic('caret-down')}</button></div>
   ${S.item && CAT[S.item].receta ? `<div class="rnote mt16">${ic('file-text')}<span>Te recomendamos subir tu receta médica. Si no la tienes, puedes agendar igual.</span></div>` : ''}
   <div class="rlist mt16">${l.map(p => rcard(p, true)).join('')}</div><div class="xs t3 mt16">Profesionales y precios de ejemplo.</div></main>
  <aside class="wmap"><div class="mapbox"><div class="mapwrap" data-map="1"></div></div></aside></div>`; },
  map: () => ({ home: P().ll, dots: prosFor().map(p => [ll(p), '#7A7CF0']), zoom: 13.5 }) });

def({ id: 'W03', name: 'Perfil y agenda (web)', kind: 'dfree', dtab: 'servicios', next: ['P14', 'P22', 'P32'],
  body: () => { const p = PRO(), it = S.item && priceOf(p, S.item) ? S.item : svcsOf(p)[0], l = slotsOf(p, S.day); return `<div class="wprof"><div class="wp-main"><button class="lk mb16" data-go="back">${ic('caret-left')} Volver a resultados</button>${profileBody(p, 'd')}</div>
  <aside class="wp-side"><div class="bbox"><div class="bb-h"><div><div class="sm t2">${CAT[it].n}</div><div class="h-m num">${clp(priceOf(p, it, S.slot))}</div></div><div>${heart(p.id)}</div></div>
   <div class="sm t2">${durT(p, it)} · ${shortInc(incOf(p, it)[0])}</div>
   ${isT(it) ? shiftForm(p, it, true) : `<div class="lbl2">Día</div>${dstrip(p, 'day', 'day')}
   <div class="lbl2">Hora de llegada</div><div class="slots3">${l.map(t => `<button class="slot ${S.slot === t ? 'on' : ''}" data-act="set" data-arg="slot=${t}">${t}</button>`).join('')}</div>
   <div class="mt16">${kv('Total', clp(price().total), 'tot')}</div>`}
   <button class="btn mt16" data-act="set" data-arg="addrNext=P14" data-go="P14">Agendar</button><button class="btn ghost mt8" data-go="P22">${ic('chat-circle')}Preguntarle algo</button>
   <div class="xs t3 mt8 center">No se cobra nada hasta que ${first()} confirme.</div></div></aside></div>`; } });

