/* ===== Resultados y biomarcadores, chequeos, seguimiento, controles y reembolso automático con Isapre =====
   Valores y rangos de la DEMO son ficticios. En producción el rango y la marca (H/L/crítico) vienen del informe del laboratorio.
   Nunca se interpreta más allá de «sobre / bajo el rango del laboratorio». */
const SIS = [['azucar', 'Azúcar'], ['corazon', 'Corazón y grasas'], ['rinon', 'Riñón'], ['higado', 'Hígado'], ['sangre', 'Sangre y defensas'], ['tiroides', 'Tiroides'], ['vitaminas', 'Vitaminas'], ['inflam', 'Inflamación']];
const SISH = {
  azucar: ['Sigue el plan de alimentación y los medicamentos que indicó tu médico', 'Muévete a diario según lo que puedas'],
  corazon: ['Prefiere comidas caseras, con verduras y menos frituras', 'Muévete a diario según lo que puedas'],
  rinon: ['Toma agua durante el día, salvo que tu médico indique otra cosa', 'No tomes antiinflamatorios por tu cuenta'],
  higado: ['Evita el alcohol', 'No tomes remedios ni suplementos sin preguntar'],
  sangre: ['Lleva una alimentación variada', 'Anota si tienes cansancio, moretones o fiebre para contarlo en tu control'],
  tiroides: ['Toma tus medicamentos a la misma hora, si tienes indicados', 'Anota cambios de peso, ánimo o sueño para tu control'],
  vitaminas: ['No tomes suplementos ni dosis altas sin indicación', 'Si tu médico lo indica, la profesional puede ponértela en casa'],
  inflam: ['Anota si tienes fiebre, dolor o algún síntoma reciente', 'Repite el examen solo si tu médico lo pide'],
};
const D5 = ['12 feb', '15 abr', '12 jun', '20 ago', '24 oct'];
const h5 = a => a.map((v, i) => [D5[D5.length - a.length + i], v, 'l']);
const BIOM = {
  hba: { n: 'Hemoglobina glicosilada', t: 'HbA1c', s: 'Azúcar promedio de 3 meses', sis: 'azucar', u: '%', min: 4.0, max: 6.0, d: 1, h: h5([8.9, 8.6, 8.4, 8.1, 7.8]), ex: 'hba', que: 'Muestra el promedio de azúcar en la sangre de los últimos 2 a 3 meses.' },
  glu: { n: 'Glicemia en ayunas', t: 'Glucosa', s: 'Azúcar en la sangre hoy', sis: 'azucar', u: 'mg/dL', min: 70, max: 100, d: 0, h: [...h5([148, 141, 139, 136, 132]).slice(0, 4), ['16 oct', 160, 'v'], ['20 oct', 155, 'v'], ['24 oct', 132, 'l'], ['24 oct', 151, 'v']], ex: 'gli', que: 'Mide el azúcar en la sangre en el momento del examen, con ayuno.' },
  ldl: { n: 'Colesterol LDL', t: 'LDL', s: 'Colesterol «malo»', sis: 'corazon', u: 'mg/dL', min: 0, max: 100, d: 0, h: h5([131, 125, 118]), ex: 'lip', que: 'Es el colesterol que puede acumularse en las arterias.' },
  hdl: { n: 'Colesterol HDL', t: 'HDL', s: 'Colesterol «bueno»', sis: 'corazon', u: 'mg/dL', min: 40, max: 90, d: 0, h: h5([49, 50, 52]), ex: 'lip', que: 'Ayuda a sacar el colesterol de las arterias.' },
  tg: { n: 'Triglicéridos', t: 'TG', s: 'Grasas en la sangre', sis: 'corazon', u: 'mg/dL', min: 0, max: 150, d: 0, h: h5([162, 151, 140]), ex: 'lip', que: 'Son grasas que vienen de la comida y se guardan en el cuerpo.' },
  col: { n: 'Colesterol total', t: 'CT', s: 'Suma del colesterol', sis: 'corazon', u: 'mg/dL', min: 0, max: 200, d: 0, h: h5([214, 205, 196]), ex: 'lip', que: 'Suma de los distintos tipos de colesterol en la sangre.' },
  cre: { n: 'Creatinina', t: 'Creatinina', s: 'Cómo filtran los riñones', sis: 'rinon', u: 'mg/dL', min: 0.5, max: 1.1, d: 2, h: h5([1.02, 1.05, 1.08]), ex: 'cre', que: 'Es un desecho de los músculos que filtran los riñones.' },
  na: { n: 'Sodio', t: 'Na', s: 'Sal en la sangre', sis: 'rinon', u: 'mEq/L', min: 135, max: 145, d: 0, h: h5([138, 140, 139]), ex: 'x38', que: 'Ayuda a mantener el agua del cuerpo en equilibrio.' },
  k: { n: 'Potasio', t: 'K', s: 'Mineral del corazón y músculos', sis: 'rinon', u: 'mEq/L', min: 3.5, max: 5.1, d: 1, h: h5([4.4, 4.2, 4.3]), ex: 'x38', que: 'Ayuda a que el corazón y los músculos funcionen bien.' },
  got: { n: 'Transaminasa GOT', t: 'GOT/AST', s: 'Hígado', sis: 'higado', u: 'U/L', min: 0, max: 40, d: 0, h: h5([24, 22]), ex: 'x53', que: 'Es una enzima del hígado y de los músculos.' },
  gpt: { n: 'Transaminasa GPT', t: 'GPT/ALT', s: 'Hígado', sis: 'higado', u: 'U/L', min: 0, max: 41, d: 0, h: h5([27, 25]), ex: 'x608', que: 'Es una enzima que está sobre todo en el hígado.' },
  hb: { n: 'Hemoglobina', t: 'Hb', s: 'Transporta el oxígeno', sis: 'sangre', u: 'g/dL', min: 12.0, max: 16.0, d: 1, h: h5([12.4, 12.0, 12.1]), ex: 'hemo', que: 'Es la proteína de los glóbulos rojos que lleva el oxígeno.' },
  leu: { n: 'Leucocitos', t: 'Glóbulos blancos', s: 'Defensas', sis: 'sangre', u: 'mil/µL', min: 4.0, max: 10.5, d: 1, h: h5([7.1, 6.8]), ex: 'hemo', que: 'Son las células de las defensas del cuerpo.' },
  pla: { n: 'Plaquetas', t: 'PLT', s: 'Coagulación', sis: 'sangre', u: 'mil/µL', min: 150, max: 400, d: 0, h: h5([238, 245]), ex: 'hemo', que: 'Ayudan a que la sangre coagule cuando hay una herida.' },
  tsh: { n: 'TSH', t: 'Tirotropina', s: 'Tiroides', sis: 'tiroides', u: 'µUI/mL', min: 0.4, max: 4.0, d: 1, h: h5([2.4, 2.1]), ex: 'tsh', que: 'Es la hormona que regula cómo trabaja la tiroides.' },
  vitd: { n: 'Vitamina D', t: '25-OH vitamina D', s: 'Huesos y músculos', sis: 'vitaminas', u: 'ng/mL', min: 30, max: 100, d: 0, h: h5([21, 18]), ex: 'vitd', que: 'Ayuda a absorber el calcio y a mantener los huesos.' },
  b12: { n: 'Vitamina B12', t: 'Cobalamina', s: 'Nervios y glóbulos rojos', sis: 'vitaminas', u: 'pg/mL', min: 200, max: 900, d: 0, h: h5([385, 410]), ex: 'x191', que: 'Ayuda a formar glóbulos rojos y al sistema nervioso.' },
  pcr: { n: 'Proteína C reactiva', t: 'PCR', s: 'Inflamación', sis: 'inflam', u: 'mg/L', min: 0, max: 5, d: 1, h: h5([2.8, 3.0]), ex: 'pcr', que: 'Sube cuando hay inflamación o infección en el cuerpo.' },
};
const nf = (v, d) => Number(v).toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d });
const lastL = b => b.h.filter(x => x[2] === 'l').slice(-1)[0];
const prevL = b => b.h.filter(x => x[2] === 'l').slice(-2, -1)[0];
const bval = k => (k === 'k' && S.crit) ? 6.6 : lastL(BIOM[k])[1];
const bst = k => { const b = BIOM[k], v = bval(k); if (k === 'k' && S.crit) return 'crit'; return v > b.max ? 'hi' : v < b.min ? 'lo' : 'ok'; };
const bchip = s => s === 'ok' ? st('ok', 'En rango', 'check-circle') : s === 'hi' ? st('warn', 'Sobre el rango', 'arrow-up') : s === 'lo' ? st('warn', 'Bajo el rango', 'arrow-down') : s === 'crit' ? st('bad', 'Requiere atención hoy', 'warning') : st('neu', 'Ver informe', 'file-text');
const brng = b => `${b.min === 0 ? 'Menor a ' + nf(b.max, b.d) : nf(b.min, b.d) + ' – ' + nf(b.max, b.d)} ${b.u}`;
const bdom = b => { const w = b.max - b.min, vs = b.h.map(x => x[1]); return [Math.max(0, Math.min(b.min - w * .5, ...vs) - w * .05), Math.max(b.max + w * .5, ...vs) + w * .05]; };
const rbar = (k, v = bval(k)) => { const b = BIOM[k], [lo, hi] = bdom(b), pc = x => Math.max(1, Math.min(99, (x - lo) / (hi - lo) * 100)); const s = bst(k);
  return `<div class="rbar"><span class="band" style="left:${pc(b.min)}%;width:${pc(b.max) - pc(b.min)}%"></span><span class="dot d-${s}" style="left:${pc(v)}%"></span></div><div class="xs t2 mt4">Rango del laboratorio: ${brng(b)}</div>`; };
const spark = k => { const b = BIOM[k], l = b.h.filter(x => x[2] === 'l'); if (l.length < 2) return ''; const [lo, hi] = bdom(b), W = 76, H = 30, y = v => H - 3 - (v - lo) / (hi - lo) * (H - 6), x = i => 3 + i * (W - 6) / (l.length - 1);
  return `<svg class="spk" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><rect x="0" y="${y(b.max)}" width="${W}" height="${Math.max(1, y(b.min) - y(b.max))}" class="spb"/><polyline points="${l.map((p, i) => x(i) + ',' + y(p[1])).join(' ')}"/>${l.map((p, i) => `<circle cx="${x(i)}" cy="${y(p[1])}" r="${i === l.length - 1 ? 3 : 2}"/>`).join('')}</svg>`; };
const bchart = k => { const b = BIOM[k], pts = b.h.filter(x => x[2] === 'l' || S.incVis || k === 'glu'), dates = [...new Set(pts.map(p => p[0]))], [lo, hi] = bdom(b), W = 330, H = 170, L = 34, B = 26;
  const X = d => L + 14 + dates.indexOf(d) * (W - L - 36) / Math.max(1, dates.length - 1), Y = v => 10 + (hi - v) / (hi - lo) * (H - B - 10);
  const sc = p => 'c-' + (p[1] > b.max ? 'hi' : p[1] < b.min ? 'lo' : 'ok');
  const lab = pts.filter(p => p[2] === 'l');
  return `<svg class="bch" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tendencia de ${b.n}"><rect x="${L}" y="${Y(b.max)}" width="${W - L}" height="${Math.max(1, Y(b.min) - Y(b.max))}" class="bnd"/>
  <text x="${L - 4}" y="${Y(b.max) + 4}" text-anchor="end">${nf(b.max, b.d)}</text>${b.min > 0 ? `<text x="${L - 4}" y="${Y(b.min) + 4}" text-anchor="end">${nf(b.min, b.d)}</text>` : ''}
  <polyline points="${lab.map(p => X(p[0]) + ',' + Y(p[1])).join(' ')}"/>
  ${pts.map(p => p[2] === 'l' ? `<circle class="${sc(p)}" cx="${X(p[0])}" cy="${Y(p[1])}" r="5"/>` : `<rect class="${sc(p)} vis" x="${X(p[0]) - 4.5}" y="${Y(p[1]) - 4.5}" width="9" height="9" transform="rotate(45 ${X(p[0])} ${Y(p[1])})"/>`).join('')}
  ${dates.map(d => `<text x="${X(d)}" y="${H - 6}" text-anchor="middle">${d}</text>`).join('')}</svg>
  <div class="blg xs t2"><span><i class="lgc"></i>Laboratorio</span>${k === 'glu' ? '<span><i class="lgd"></i>Visita de enfermería (capilar)</span>' : ''}<span><i class="lgb"></i>Rango del laboratorio</span></div>`; };
const BKEYS = Object.keys(BIOM);
const outK = () => BKEYS.filter(k => bst(k) !== 'ok');
const critBan = () => S.crit ? `<div class="critb">${ic('warning', 1)}<div><b>El laboratorio marcó un resultado que necesita atención hoy.</b><span>Llama a tu médico tratante. Si hay síntomas graves, llama al 131. Nuestro equipo te va a llamar para acompañarte.</span></div></div>` : '';
const swc = (on, act, arg, lab = '') => `<button class="swc ${on ? 'on' : ''}" data-act="${act}" data-arg="${arg}" role="switch" aria-checked="${on ? 'true' : 'false'}" aria-label="${lab}"><span></span></button>`;
const VISM = [['Glicemia capilar', '151 mg/dL', 'Camila · 24 oct'], ['Presión arterial', '128/78 mmHg', 'Camila · 24 oct'], ['Saturación', '96 %', 'Camila · 24 oct']];

Object.assign(ACT, {
  bm: k => { S.bm = k; },
  bF: f => { S.bF = f; },
  bSis: s => { S.bSis = S.bSis === s ? '' : s; },
  crit: () => { S.crit = !S.crit; },
  shr: k => { S.shr[k] = !S.shr[k]; },
  shrGo: () => { S.resShared = Object.values(S.shr).some(Boolean); toast(S.resShared ? 'Compartido. Queda registrado en «Quién vio la ficha».' : 'No compartiste con nadie.'); },
  shrLink: () => { S.shrLink = !S.shrLink; toast(S.shrLink ? 'Enlace creado: dura 7 días y puedes revocarlo cuando quieras.' : 'Enlace revocado.'); },
  rep: k => { S.pack = ''; S.item = 'mue'; S.mmode = 'cat'; S.exams = { [BIOM[k].ex]: true }; S.exq = ''; },
  pk: id => { S.pk = id; },
  pkOpen: id => { S.pkOpen = S.pkOpen === id ? '' : id; },
  pkGo: id => { const p = pkOf(id); S.item = 'mue'; S.mmode = 'cat'; S.exams = {}; p[4].forEach(k => S.exams[k] = true); S.pack = p[0]; S.exq = ''; toast(`${p[1]} agregado: ${p[4].length} exámenes por ${clp(pkPr(p))}.`); },
  pkOff: () => { const p = pkAct(); if (p) p[4].forEach(k => S.exams[k] = false); S.pack = ''; toast('Pack quitado.'); },
  ctl: i => { S.ctl[i] = !S.ctl[i]; },
  ctlGo: k => { S.pack = ''; S.item = 'mue'; S.mmode = 'cat'; S.exams = { [k]: true }; S.exq = ''; },
  /* Isapre */
  lkW: w => { S.lk.w = w; const p = S.pv[w]; if (p.t === 'isapre') S.lk.is = p.is; },
  lkIs: i => { S.lk.is = i; },
  lkC: k => { S.lk[k] = !S.lk[k]; if (k === 'car') { S.car = S.car || {}; S.car[S.lk.w] = S.lk.car ? { f: 'ok', b: 'ok' } : null; } },
  carRm: s => { S.car[S.who][s] = ''; },
  isaLink: () => { S.isa[S.lk.w] = { is: S.lk.is, desde: '26 oct 2026' }; S.pv[S.lk.w].t = 'isapre'; S.pv[S.lk.w].is = S.lk.is; S.rbAuto = true; if (S.lkNext) S.rbAsk = 'si'; toast(`${S.lk.is} vinculada. Desde ahora te ayudamos a enviar tus reembolsos.`); },
  isaUn: w => { delete S.isa[w]; S.rbAuto = false; toast('Isapre desvinculada. Borramos el acceso y dejamos de enviar reembolsos.'); },
  rbAuto: () => { S.rbAuto = !S.rbAuto; S.rbAsk = S.rbAuto ? 'si' : 'no'; },
  rbAsk: v => { S.rbAsk = v; S.rbAuto = v === 'si' && !!isaOf(S.who); },
  lkBook: () => { S.lk.w = S.who; S.lk.is = (S.pv[S.who] || {}).is || S.lk.is; S.lkNext = 'P14'; },
  rb: id => { S.rbSel = id; },
  rbFix: () => { const r = RBS().find(x => x.id === S.rbSel); if (r) r.st = 'env'; toast('Reenviado con la orden médica corregida.'); },
});

/* ---------- P70 · Biomarcadores (resumen) ---------- */
const bmCard = k => { const b = BIOM[k], v = bval(k), p = prevL(b), s = bst(k);
  return `<button class="bmc s-${s}" data-act="bm" data-arg="${k}" data-go="P71"><div class="bmh"><div><b>${b.n}</b><span class="xs t3">${b.t} · ${b.s}</span></div>${bchip(s)}</div>
  <div class="bmv"><span class="num big">${nf(v, b.d)}</span><span class="u">${b.u}</span>${p ? `<span class="xs t2 dl">${v < p[1] ? '↓' : v > p[1] ? '↑' : '='} ${nf(Math.abs(v - p[1]), b.d)} desde ${p[0]}</span>` : ''}${spark(k)}</div>${rbar(k)}</button>`; };
def({ id: 'P70', name: 'Biomarcadores', kind: 'page', back: true, title: 'Exámenes de Rosa', next: ['P71', 'P72', 'P73', 'P76', 'P77'],
  body: () => { const f = S.bF || 'all', out = outK(); let l = [...out, ...BKEYS.filter(k => !out.includes(k))]; if (f === 'rev') l = out; if (S.bSis) l = l.filter(k => BIOM[k].sis === S.bSis);
    return `${critBan()}<div class="sm t2">Exámenes del 24 oct · ${BKEYS.length} biomarcadores · tomados por Paula Godoy</div><button class="lk sm mt4" data-act="toast" data-arg="Abriendo Resultados-Rosa-24-10-2026.pdf (informe original del laboratorio).">${ic('file-pdf')}Ver informe original (PDF)</button>
    <div class="bcnt mt16"><div class="ok">${ic('check-circle', 1)}<b class="num">${BKEYS.length - out.length}</b><span>en rango</span></div><div class="warn">${ic('arrows-down-up', 1)}<b class="num">${out.length}</b><span>para revisar</span></div></div>
    <div class="seg mt16">${[['all', 'Todos'], ['rev', 'Para revisar']].map(t => `<button class="${f === t[0] ? 'on' : ''}" data-act="bF" data-arg="${t[0]}">${t[1]}</button>`).join('')}</div>
    <div class="chips scx mt12">${SIS.map(s => chip(s[1], S.bSis === s[0], 'bSis', s[0])).join('')}</div>
    <div class="row nodiv mt8"><span class="tx"><div class="a">Incluir mediciones de las visitas</div><div class="b">Glicemia capilar, presión y saturación de las notas de enfermería</div></span><span class="end">${swc(S.incVis, 'tog', 'incVis', 'Incluir mediciones de las visitas')}</span></div>
    ${S.incVis ? `<div class="lbl2">De las visitas</div><div class="vism">${VISM.map(m => `<div class="vm"><span class="xs t2">${m[0]}</span><b class="num">${m[1]}</b><span class="xs t3">${m[2]}</span></div>`).join('')}</div>` : ''}
    <div class="lbl2">${f === 'rev' ? 'Para revisar' : 'Resultados'} · ${l.length}</div><div class="bml">${l.map(bmCard).join('') || '<div class="sm t2">Nada en este grupo.</div>'}</div>
    <div class="lbl2">Seguimiento</div>${row('box:path', 'Estado de los exámenes', 'Tomados 24 oct · todos listos', 'P76', st('ok', 'Listos'))}${row('box:bell-ringing', 'Controles', 'Repetir hemoglobina glicosilada · 24 ene 2027', 'P77')}
    <div class="mt16">${note('info', 'Estos resultados no son un diagnóstico. Conversa los resultados con tu médico tratante. Valores y rangos de ejemplo.')}</div>`; },
  foot: () => btn(ic('share-network') + 'Compartir resultados', 'P73', 'sec') });

/* ---------- P71 · Detalle ---------- */
def({ id: 'P71', name: 'Detalle del biomarcador', kind: 'page', back: true, title: '', next: ['P73', 'P40'],
  body: () => { const k = S.bm || 'hba', b = BIOM[k], v = bval(k), s = bst(k), p = prevL(b), lab = b.h.filter(x => x[2] === 'l');
    const rel = s === 'hi' || s === 'crit' ? '<b>sobre</b> el rango' : s === 'lo' ? '<b>bajo</b> el rango' : '<b>dentro</b> del rango';
    return `${k === 'k' ? critBan() : ''}<div class="xs t3">${b.t} · ${SIS.find(x => x[0] === b.sis)[1]}</div><h1 class="h-l mt4">${b.n}</h1><div class="row8 mt8" style="align-items:baseline;gap:8px"><span class="num big">${nf(v, b.d)}</span><span class="t2">${b.u}</span>${bchip(s)}</div>
    <div class="mt16 bchw">${bchart(k)}</div>
    <div class="lbl2">Qué mide</div><div class="sm">${b.que}</div>
    <div class="lbl2">Tu resultado</div><div class="sm">${nf(v, b.d)} ${b.u} está ${rel} de referencia del laboratorio (${brng(b)}).${p ? ` El ${p[0]} fue ${nf(p[1], b.d)} ${b.u}.` : ''}</div>
    <div class="lbl2">Qué puedes hacer</div><ul class="bhl">${[...(s === 'ok' ? ['Mantén tus controles según te indique tu médico'] : SISH[b.sis]), 'Conversa este resultado con tu médico tratante'].map(x => `<li>${ic('check')}<span>${x}</span></li>`).join('')}</ul>
    <div class="xs t3 mt4">${ic('seal-check')} Contenido general revisado por el equipo médico de Cuidapp · oct 2026 (ejemplo)</div>
    <div class="lbl2">Historial</div><table class="rtab bht"><tr><th>Fecha</th><th>Valor</th><th>Rango</th><th>Origen</th></tr>${b.h.slice().reverse().filter(x => x[2] === 'l' || k === 'glu').map(x => `<tr><td>${x[0]}</td><td class="num">${nf(x[1], b.d)}</td><td class="t2">${x[2] === 'l' ? brng(b) : '—'}</td><td class="t2">${x[2] === 'l' ? 'Laboratorio' : 'Visita · Camila'}</td></tr>`).join('')}</table>
    <button class="lk sm mt12" data-act="toast" data-arg="Fuente: MedlinePlus en español · medlineplus.gov/spanish/laboratorytests.html">${ic('arrow-square-out')}Fuente: MedlinePlus en español</button>
    <button class="row mt12" data-act="toast" data-arg="Revisar con un médico: llega pronto, con telemedicina."><span class="ri box">${ic('stethoscope')}</span><span class="tx"><div class="a">Revisar con un médico <span class="pr soonb">Muy pronto</span></div><div class="b">Una videollamada para conversar tus resultados</div></span></button>`; },
  foot: () => `<div class="row8">${btn(ic('share-network') + 'Compartir', 'P73', 'sec')}${abtn(ic('repeat') + 'Repetir examen', 'rep', S.bm || 'hba', '', 'P40')}</div>` });

/* ---------- P72 · Resultado listo ---------- */
const TRK = [['test-tube', 'Muestra tomada', '24 oct · 08:41 · Paula Godoy'], ['flask', 'En el laboratorio', '24 oct · 11:20'], ['file-text', 'Resultado parcial', '25 oct · 16:05 · 15 de 18'], ['check-circle', 'Resultados listos', '26 oct · 09:12']];
def({ id: 'P72', name: 'Resultados listos', kind: 'page', back: true, title: '', next: ['P70', 'P76'],
  body: () => { const out = outK();
    return `<button class="push" data-go="P70"><div class="push-h"><img src="logo/apple-touch-icon.png" alt=""><span>Cuidapp</span><span class="t3">ahora</span></div><b>${S.crit ? 'Un resultado de Rosa necesita atención hoy' : 'Los resultados de Rosa están listos'}</b><div>${S.crit ? 'Abre la app para ver qué hacer.' : `Hay ${out.length} valores para revisar.`}</div></button>
    <div class="mt16">${critBan()}</div><h1 class="h-l">Resultados listos</h1><div class="sm t2 mt4">Exámenes del 24 oct · ${BKEYS.length} biomarcadores</div>
    <div class="bcnt mt16"><div class="ok">${ic('check-circle', 1)}<b class="num">${BKEYS.length - out.length}</b><span>en rango</span></div><div class="warn">${ic('arrows-down-up', 1)}<b class="num">${out.length}</b><span>para revisar</span></div></div>
    <div class="lbl2">Para revisar</div>${out.slice(0, 3).map(k => row('box:drop', BIOM[k].n, `${nf(bval(k), BIOM[k].d)} ${BIOM[k].u} · rango ${brng(BIOM[k])}`, 'P71', bchip(bst(k)), '', 'bm', k)).join('')}
    <div class="lbl2">Seguimiento</div><div class="tl3">${TRK.map(t => `<div class="tl3r ok">${ic(t[0], 1)}<div><b>${t[1]}</b><span>${t[2]}</span></div></div>`).join('')}</div>
    <div class="mt16">${row('box:file-pdf', 'Informe original del laboratorio', 'Resultados-Rosa-24-10-2026.pdf · 4 páginas', '', ic('download-simple'), '', 'toast', 'Descargado: Resultados-Rosa-24-10-2026.pdf')}</div>
    <button class="lk sm mt12" data-act="crit">${S.crit ? 'Volver al ejemplo normal' : 'Ver cómo se ve un valor crítico (ejemplo)'}</button>`; },
  foot: () => btn('Ver mis biomarcadores', 'P70') });

/* ---------- P73 · Compartir ---------- */
def({ id: 'P73', name: 'Compartir resultados', kind: 'page', back: true, title: 'Compartir resultados',
  body: () => `<div class="sm t2">Tú decides quién ve los exámenes de Rosa. Puedes quitar el acceso cuando quieras.</div>
  <div class="lbl2">Profesionales con reserva activa</div>${checkRow('Camila Rojas · enfermera', S.shr.cr, 'shr', 'cr', 'Visita del jueves · verá los exámenes recientes')}${checkRow('Paula Godoy · TENS', S.shr.pg, 'shr', 'pg', 'Tomó la muestra · ya ve el estado del examen')}
  <div class="lbl2">Mi médico</div>${row('box:link', S.shrLink ? 'Enlace activo · vence el 2 nov' : 'Crear enlace o PDF', S.shrLink ? 'Toca para revocarlo' : 'Dura 7 días y lo puedes revocar', '', S.shrLink ? st('ok', 'Activo') : ic('plus'), '', 'shrLink', '')}
  <div class="lbl2">Familia</div>${checkRow('Luis Fuentes · papá', S.shr.lf, 'shr', 'lf', 'Según su nivel de acceso: solo el resumen')}
  <div class="mt16">${note('eye', 'Cada vez que alguien abre los resultados queda registrado en «Quién vio la ficha».')}</div>`,
  foot: () => abtn('Guardar', 'shrGo', '', '', 'back') });

/* ---------- P74 / P75 · Chequeos ---------- */
const PACKS = [
  ["pre", "Chequeo preventivo", "Adultos, una vez al año", "Revisa sangre, azúcar, colesterol, riñón e hígado en un solo pinchazo.", ["hemo", "bioq", "lip", "ori"], 34200],
  ["cv", "Preventivo cardiovascular", "Presión alta o colesterol", "Colesterol, grasas y sales de la sangre para tu control con el médico.", ["bioq", "lip", "x38"], 28200],
  ["met", "Control metabólico", "Diabetes o azúcar alta", "Azúcar de los últimos 3 meses, colesterol, riñón e hígado.", ["hba", "gli", "lip", "cre", "x58"], 40000],
  ["tir", "Tiroides y hormonas", "Cansancio, peso o ciclo irregular", "Tiroides y las principales hormonas, para conversar con tu médico.", ["tsh", "x81", "x82", "x69", "x70", "x73", "x62"], 60100],
  ["nut", "Nutricional y vitaminas", "Cansancio frecuente o dieta especial", "Vitaminas, hierro y minerales que más se piden en controles.", ["x191", "vitd", "x267", "x5", "x4", "x31", "x42"], 75000],
  ["muj", "Salud mujer", "Control anual de la mujer", "Hormonas, tiroides, hierro, vitaminas y calcio.", ["x69", "x70", "tsh", "t4", "x82", "x191", "x5", "x4", "x267", "x31", "ori"], 90300],
  ["hom", "Salud hombre", "Hombres desde los 40", "Sangre, azúcar, colesterol, tiroides y antígeno prostático.", ["hemo", "bioq", "lip", "x105", "tsh", "ori"], 56200],
  ["int", "Salud integral", "El chequeo más completo", "Todo lo del preventivo más azúcar de 3 meses, tiroides, B12 y ferritina.", ["hemo", "bioq", "lip", "hba", "tsh", "t4", "x82", "x191", "x4", "ori"], 88300],
]; /* precio pack = suma de los precios al paciente −5%, redondeado a $100 (datos/examenes-con-packs.xlsx, hoja Packs). Contenido clínico: validar con médico y laboratorio antes de producción (interno) */
const EXBM = { hemo: ['Hemoglobina', 'Leucocitos', 'Plaquetas', 'Hematocrito'], bioq: ['Glicemia', 'Nitrógeno ureico', 'Ácido úrico', 'Colesterol total', 'Proteínas', 'Albúmina', 'Bilirrubina', 'Fosfatasas alcalinas', 'GOT', 'LDH', 'Calcio', 'Fósforo'], lip: ['Colesterol total', 'LDL', 'HDL', 'VLDL', 'Triglicéridos'], ori: ['Orina completa'], cre: ['Creatinina'], gli: ['Glicemia'], hba: ['Hemoglobina glicosilada'], x616: ['Microalbuminuria'], x38: ['Sodio', 'Potasio', 'Cloro'], tsh: ['TSH'], t4: ['T4 libre'], x81: ['T4'], x82: ['T3'], x69: ['FSH'], x70: ['LH'], x73: ['Progesterona'], x62: ['Cortisol'], vitd: ['Vitamina D'], x191: ['Vitamina B12'], x267: ['Ácido fólico'], x4: ['Ferritina'], x5: ['Hierro'], x31: ['Calcio'], x42: ['Fósforo'], x58: ['Bilirrubina', 'GGT', 'Fosfatasas alcalinas', 'Tiempo de protrombina', 'Transaminasas'], x105: ['Antígeno prostático (PSA)'], pcr: ['Proteína C reactiva'] };
const pkSum = p => p[4].reduce((a, k) => a + EXAMS[k][1], 0);
const pkBm = p => [...new Set(p[4].flatMap(k => EXBM[k] || [EXAMS[k][0]]))];
const pkAy = p => ayAgg(p[4]);
const pkPl = p => plAgg(p[4]).txt.replace(/^Resultados en /, '');
const TOMA = () => CAT.mue.base;
const pkPr = p => p[5];
const pkSave = p => pkSum(p) - pkPr(p);
const exD = pr => S.exFirst && pr >= EXD_MIN ? Math.min(EXD_MAX, Math.round(pr * EXD_P / 100 / 10) * 10) : 0;
const pkTot = p => pkPr(p) + TOMA() - exD(pkPr(p));
const pkOf = id => PACKS.find(x => x[0] === id) || PACKS[0];
const pkCard = (p, sm) => `<button class="pkc2 ${sm ? 'sm' : ''}" data-act="pk" data-arg="${p[0]}" data-go="P75"><span class="tx"><b>${p[1]}</b><span class="sm t2">${p[2]}</span><span class="pkmeta xs t2"><span>${ic('test-tube')}${p[4].length} exámenes</span><span>${ic(pkAy(p).h > 0 ? 'fork-knife' : 'coffee')}${pkAy(p).txt}</span>${sm ? '' : `<span>${ic('clock')}${pkPl(p)}</span>`}</span></span><span class="pkp"><b class="num">${clp(pkPr(p))}</b><s class="xs t3 num">${clp(pkSum(p))}</s><span class="pksv">Ahorras ${clp(pkSave(p))}</span></span></button>`;
const pkSec = () => `<div class="shd mt24"><h3>Packs de exámenes</h3><button class="lk sm" data-go="P74">Ver los ${PACKS.length}</button></div><div class="xs t2">Exámenes que se piden juntos, a menor precio que por separado.</div><div class="pkl2 mt8">${PACKS.slice(0, 3).map(p => pkCard(p, 1)).join('')}</div>`;
const pkAct = () => { const p = S.pack && PACKS.find(x => x[0] === S.pack); return p && p[4].every(k => S.exams[k]) ? p : null; };
const pkD = () => { const p = pkAct(); return p && !byOrder() ? pkSave(p) : 0; };
def({ id: 'P74', name: 'Packs de exámenes', kind: 'page', back: true, title: 'Packs de exámenes', next: ['P75'],
  body: () => `<div class="sm t2">Exámenes que se piden juntos, a menor precio que por separado. En tu primer pedido de exámenes sobre $30.000 tienes 20% de descuento (hasta $20.000).</div>
  <div class="pkl2 mt16">${PACKS.map(p => pkCard(p)).join('')}</div>
  <div class="xs t3 mt12">Consulta a tu médico qué exámenes necesitas. Packs de ejemplo.</div>`,
  foot: () => btn('Prefiero elegir exámenes sueltos', 'P40', 'sec') });
def({ id: 'P75', name: 'Detalle del pack', kind: 'page', back: true, title: '', next: ['P40', 'P16'],
  body: () => { const p = pkOf(S.pk), sm = pkSum(p), pr = pkPr(p), tubes = [...new Set(p[4].map(k => EXAMS[k][7] === 'Orina' ? 'Frasco de orina' : EXAMS[k][2]))];
    return `<div class="xs t3">Pack · ${p[4].length} exámenes</div><h1 class="h-l mt4">${p[1]}</h1><div class="sm t2 mt4">${p[2]} · resultados en ${pkPl(p)}${plAgg(p[4]).pend ? ' (algunos por confirmar)' : ''}</div>
    <div class="lbl2">Para qué sirve</div><div class="sm">${p[3]}</div>
    <div class="lbl2">Qué incluye</div><div class="exl">${p[4].map(k => `<div class="exr"><span class="check on">${ic('check', 0).replace('ph ', 'ph-bold ')}</span><span class="tx"><span class="a">${EXAMS[k][0]}</span><span class="b">${(EXBM[k] && EXBM[k].length > 1 ? EXBM[k].join(', ') + ' · ' : '') + exSub(k)}</span></span></div>`).join('')}</div>
    <div class="lbl2">Precio</div>${kv('Por separado', clp(sm))}${kv('Descuento pack', '−' + clp(sm - pr), 'dsc')}${kv('Precio del pack', clp(pr))}${kv('Toma a domicilio', clp(TOMA()))}${exD(pr) ? kv('Primer pedido de exámenes (20%)', '−' + clp(exD(pr)), 'dsc') : ''}${kv('Total', clp(pkTot(p)), 'tot')}
    <div class="xs t2 mt8">${pr >= EXD_MIN ? 'El 20% de descuento aplica a tu primer pedido de exámenes (sobre $30.000, hasta $20.000).' : 'La toma a domicilio se suma al precio del pack.'} El costo por servicio (${S.svcP}%) y el descuento CUIDAPP15 en la toma se ven al pagar.</div>
    <div class="lbl2">Preparación</div>${row('box:' + (pkAy(p).h > 0 ? 'fork-knife' : pkAy(p).pend ? 'question' : 'coffee'), pkAy(p).txt + (pkAy(p).h > 0 ? ' (el mayor del pack)' : ''), pkAy(p).h > 0 ? 'Solo agua. Agenda temprano en la mañana.' + (pkAy(p).pend ? ' ' + pkAy(p).pend + (pkAy(p).pend > 1 ? ' exámenes' : ' examen') + ' por confirmar.' : '') : pkAy(p).pend ? 'Te confirmamos antes de la toma si algún examen pide ayuno' : 'Puedes comer normal', '', '')}${row('box:clock', plAgg(p[4]).txt, 'Todos los resultados del pack, contando desde la toma' + (plAgg(p[4]).pend ? ' · ' + plAgg(p[4]).pend + ' por confirmar' : ''), '', '')}${row('box:test-tube', 'Muestras', tubes.join(' · '), '', '')}${p[4].includes('x62') ? row('box:clock', 'Cortisol antes de las 9:30', 'Agenda la toma temprano', '', '') : ''}
    <div class="lbl2">Orden médica y reembolso</div>${row('box:file-text', 'No necesitas orden médica', 'Si la necesitas, la gestionamos por ti', '', '')}
    <div class="mt8">${note('receipt', 'Con orden médica suele ser más fácil reembolsar en la Isapre o Fonasa. Revisa las condiciones de tu plan.')}</div>`; },
  foot: () => `<div class="fbar"><div class="fb-l"><b class="num">${clp(pkPr(pkOf(S.pk)))}</b><span>${pkOf(S.pk)[4].length} exámenes · ${exD(pkPr(pkOf(S.pk))) ? 'con 20% dto.' : 'toma aparte'}</span></div>${abtn('Agregar pack', 'pkGo', S.pk || PACKS[0][0], 'fbtn', 'P40')}</div>` });

/* ---------- P76 · Seguimiento de exámenes ---------- */
def({ id: 'P76', name: 'Seguimiento de exámenes', kind: 'page', back: true, title: 'Estado de los exámenes', next: ['P72'],
  body: () => { const l = ['hemo', 'bioq', 'lip', 'hba', 'vitd', 'x191'];
    return `<div class="sm t2">Toma del 24 oct · Paula Godoy · ${l.length} exámenes</div>
    <div class="tl3 mt16">${TRK.map((t, i) => `<div class="tl3r ${i < 3 ? 'ok' : 'on'}">${ic(t[0], i < 3)}<div><b>${t[1]}</b><span>${i < 3 ? t[2] : 'Estimado 28 oct, según el plazo del catálogo'}</span></div></div>`).join('')}</div>
    <div class="lbl2">Por examen</div>${l.map((k, i) => row('box:test-tube', EXAMS[k][0], `Plazo ${EXAMS[k][8]} · ${i < 4 ? 'listo 25 oct' : 'estimado 28 oct'}`, '', i < 4 ? st('ok', 'Listo') : st('inf', 'En laboratorio'))).join('')}
    <div class="mt16">${note('bell', 'Te avisamos por notificación push cuando cada resultado esté listo. La notificación no incluye valores.')}</div>`; },
  foot: () => btn('Ver resultados listos', 'P72', 'sec') });

/* ---------- P77 · Controles ---------- */
const CTL = [['hba', 'Hemoglobina glicosilada', 'Cada 3 meses · según tu médico', '24 ene 2027'], ['lip', 'Perfil lipídico', 'Una vez al año', '24 oct 2027'], ['vitd', 'Vitamina D', 'Cuando tu médico lo indique', 'Por definir'], ['cre', 'Creatinina', 'Cada 6 meses', '24 abr 2027']];
def({ id: 'P77', name: 'Controles', kind: 'page', back: true, title: 'Controles de Rosa', next: ['P40'],
  body: () => `<div class="sm t2">Te recordamos cuándo repetir cada examen y lo agendas en un toque.</div>
  <div class="ctll mt16">${CTL.map((c, i) => `<div class="ctlc"><div class="ctlh"><span class="tx"><b>${c[1]}</b><span class="xs t2">${c[2]}</span></span>${swc(S.ctl[i], 'ctl', i, 'Recordatorio de ' + c[1])}</div>
  <div class="ctlf"><span class="sm">${ic('calendar-blank')}Próximo: <b>${c[3]}</b></span><button class="lk sm" data-act="ctlGo" data-arg="${c[0]}" data-go="P40">Agendar ahora</button></div></div>`).join('')}</div>
  <div class="mt16">${note('bell', 'Recordatorio por notificación push una semana antes. Las fechas son de ejemplo: las define tu médico.')}</div>`,
  foot: () => btn(ic('plus') + 'Agregar control', '', 'sec', 'data-act="toast" data-arg="Elige el examen y cada cuánto repetirlo."') });

/* ---------- Reembolso automático con Isapre ---------- */
const isaOf = w => S.isa[w];
const RB0 = () => [
  { id: 'r1', w: 'yo', svc: CAT[S.item] ? CAT[S.item].n : 'Atención', f: 'Hoy', m: price().total, st: S.booked ? 'listos' : 'listos', d: [1, 1, 1] },
  { id: 'r2', w: 'papa', svc: 'Curación simple', f: '12 sep', m: 24000, st: 'rev', d: [1, 1, 1] },
  { id: 'r3', w: 'yo', svc: 'Vitamina D · toma de muestra', f: '3 oct', m: 31400, st: 'pag', d: [1, 1, 1], pago: 18840 },
  { id: 'r4', w: 'yo', svc: 'Vitamina B12 inyectable', f: '19 sep', m: 18000, st: 'rech', d: [1, 0, 1], mot: 'La Isapre pidió la orden médica de la inyección.' },
];
const RBS = () => S.rbList || (S.rbList = RB0());
const RBST = ['listos', 'env', 'rev', 'res', 'pag'];
const RBN = { listos: 'Documentos listos', env: 'Enviado a la Isapre', rev: 'En revisión', apr: 'Aprobado', rech: 'Rechazado', pag: 'Pagado' };
const rbChip = s => s === 'pag' ? st('ok', 'Pagado', 'check-circle') : s === 'apr' ? st('ok', 'Aprobado', 'check') : s === 'rech' ? st('bad', 'Rechazado', 'x-circle') : s === 'rev' ? st('inf', 'En revisión', 'hourglass-medium') : s === 'env' ? st('inf', 'Enviado', 'paper-plane-tilt') : st('neu', 'Documentos listos', 'file-text');
const rbIdx = s => s === 'pag' ? 4 : s === 'apr' || s === 'rech' ? 3 : RBST.indexOf(s);
/* pregunta en la reserva: ¿gestionamos el reembolso? (antes de pagar). Requisitos: Isapre vinculada + carnet por ambos lados */
const carOk = w => !!(S.car && S.car[w] && S.car[w].f && S.car[w].b);
const rbReady = () => { const w = S.who; return S.rbAsk !== 'si' || (S.pv[w] || {}).t === 'fonasa' || (!!isaOf(w) && carOk(w)); };
document.addEventListener('change', e => { const t = e.target; if (!t.classList || !t.classList.contains('carin') || !t.files || !t.files[0]) return;
  const r = new FileReader(); r.onload = () => { S.car = S.car || {}; S.car[S.who] = S.car[S.who] || {}; S.car[S.who][t.dataset.side] = r.result; if (carOk(S.who) && S.lk.w === S.who) S.lk.car = true; render(); toast(t.dataset.side === 'f' ? 'Frente del carnet subido.' : 'Reverso del carnet subido.'); }; r.readAsDataURL(t.files[0]); });
const carTile = (s, n) => { const v = ((S.car || {})[S.who] || {})[s]; return `<div class="cart ${v ? 'on' : ''}">${v ? `${String(v).startsWith('data:') ? `<img src="${v}" alt="${n} del carnet">` : `<span class="carph">${ic('identification-card')}</span>`}<div class="cart-f"><span class="sm">${ic('check-circle', 1)} ${n}</span><button class="lk sm" data-act="carRm" data-arg="${s}">Cambiar</button></div>`
  : `<label class="cart-up"><span class="carph">${ic(s === 'f' ? 'identification-card' : 'identification-badge')}</span><b>${n}</b><span class="xs t2">Tomar foto o elegir de galería</span><input class="carin" data-side="${s}" type="file" accept="image/*" hidden></label>`}</div>`; };
def({ id: 'P94', name: 'Carnet para el reembolso', kind: 'page', back: true, title: 'Tu carnet',
  body: () => `<div class="sm t2">Tu Isapre pide el carnet de ${whoTxt().split(' ')[0]} para cada reembolso. Lo subes una vez y lo guardamos cifrado.</div>
    <div class="carg mt16">${carTile('f', 'Frente')}${carTile('b', 'Reverso')}</div>
    <div class="phg mt16"><div class="b-m sm">Para que se lea bien</div><ul>${['Carnet completo, sin cortar las esquinas', 'Con luz, sin reflejos ni dedos encima', 'Vigente'].map(t => `<li>${ic('check')}${t}</li>`).join('')}</ul></div>
    <div class="mt12">${note('lock-simple', 'Solo lo usa el agente de Cuidapp para presentar tus reembolsos. Lo puedes borrar desde Cuenta.')}</div>`,
  foot: () => btn('Listo', 'back', '', carOk(S.who) ? '' : 'disabled') });

const rbAsk = () => { const w = S.who, p = S.pv[w] || {}; if (p.t === 'fonasa') return '';
  const lk = isaOf(w), is = lk ? lk.is : p.is || 'tu Isapre';
  return `<div class="rbq mt16"><div class="rbq-h"><span class="ri box">${ic('lightning')}</span><div><b>¿Quieres que gestionemos tu reembolso automáticamente?</b><div class="sm t2 mt4">Cuidapp prepara tus documentos y te ayuda a enviarlos a ${is} · ${clp(RB_FEE)}</div></div></div>
  <div class="row8 mt12"><button class="btn ${S.rbAsk === 'si' ? '' : 'sec'} sm" data-act="rbAsk" data-arg="si">${S.rbAsk === 'si' ? ic('check') : ''}Sí</button><button class="btn ${S.rbAsk === 'no' ? '' : 'sec'} sm" data-act="rbAsk" data-arg="no">${S.rbAsk === 'no' ? ic('check') : ''}No, gracias</button></div>
  ${S.rbAsk === 'si' ? `<div class="rbreq mt12"><div class="xs t2">Para ayudarte a enviarlo necesitamos 2 cosas, una sola vez:</div>
    ${lk ? row('box:check-circle', `1. ${lk.is} vinculada`, 'Listo', '', st('ok', 'Hecho')) : row('box:link', '1. Vincular tu Isapre', `Conecta ${is}. Toma 2 minutos.`, 'P78', '<span class="lk">Vincular</span>', '', 'lkBook', '')}
    ${carOk(w) ? row('box:check-circle', '2. Carnet por ambos lados', 'Subido', 'P94', st('ok', 'Hecho')) : row('box:identification-card', '2. Subir tu carnet', 'Foto por delante y por detrás', 'P94', '<span class="lk">Subir</span>')}
    ${rbReady() ? `<div class="xs t2 mt8">${ic('check-circle')} Listo. Al terminar la atención preparamos tus documentos y te ayudamos a enviarlos a ${is}. La gestión (${clp(RB_FEE)}) aparece en el desglose.</div>` : `<div class="xs warnt mt8">Completa los 2 pasos para continuar, o elige «No, gracias».</div>`}</div>` : S.rbAsk === 'no' ? `<div class="xs t2 mt12">Igual te dejamos la boleta para que la presentes tú.</div>` : ''}</div>`; };
const rbAutoRow = () => { const w = S.who, p = S.pv[w] || {};
  if (p.t !== 'isapre') return p.t === 'fonasa' ? row('box:receipt', 'Reembolso Fonasa', 'Descarga los documentos y preséntalos en Fonasa', 'P65') : '';
  if (!isaOf(w)) return row('box:link', 'Reembolso automático', `Vincula ${p.is || 'tu Isapre'} y te ayudamos a enviarlo · gestión ${clp(RB_FEE)}`, 'P78', '<span class="lk">Vincular</span>', '', 'lkW', w);
  return `<div class="row nodiv"><span class="ri box">${ic('lightning')}</span><span class="tx"><div class="a">Reembolso automático</div><div class="b">${S.rbAuto ? `Te ayudamos a enviarlo a ${isaOf(w).is} al terminar · gestión ${clp(RB_FEE)}` : `Desactivado · si lo activas, gestión ${clp(RB_FEE)}`}</div></span><span class="end">${swc(S.rbAuto, 'rbAuto', '', 'Reembolso automático')}</span></div>`; };

def({ id: 'P78', name: 'Vincular mi Isapre · paso 1', kind: 'page', back: true, title: 'Vincular mi Isapre', next: ['P79'],
  prep: () => { if (!S.lk.is) ACT.lkW(S.lk.w || S.who); },
  body: () => { const w = S.lk.w, p = S.pv[w];
    return `<div class="xs t2">Paso 1 de 2</div><h1 class="h-l mt4">¿De quién es la Isapre?</h1><div class="sm t2 mt4">La vinculas una vez y un agente de Cuidapp prepara tu boleta, la orden médica y tu carnet cada vez que te atiendes, y te ayuda a enviarlos. Gestión de reembolso: ${clp(RB_FEE)} por solicitud, solo cuando lo activas.</div>
    <div class="chips mt16">${['yo', 'papa', 'mama'].map(x => chip(FAM[x].c + (x === 'yo' ? ' (tú)' : ''), w === x, 'lkW', x)).join('')}</div>
    ${p.t === 'fonasa' ? `<div class="mt16">${note('info', `${FAM[w].c} es de Fonasa. Por ahora el envío automático es para Isapres: con Fonasa descargas los documentos y los presentas tú.`)}</div>${btn('Ver documentos para Fonasa', 'P65', 'sec mt12')}` : `
    <div class="lbl2">Isapre</div><div class="isal">${ISAPRES.map(i => `<button class="isai ${S.lk.is === i ? 'on' : ''}" data-act="lkIs" data-arg="${i}"><span class="isl">${i.split(' ').map(x => x[0]).join('').slice(0, 2)}</span><span>${i}</span>${S.lk.is === i ? ic('check-circle', 1) : ''}</button>`).join('')}</div>
    <div class="lbl2">RUT de la persona afiliada</div>${field('identification-card', RUTS[w])}`}`; },
  foot: () => S.pv[S.lk.w].t === 'fonasa' ? '' : btn('Continuar', 'P79', '', S.lk.is ? '' : 'disabled') });

def({ id: 'P79', name: 'Vincular mi Isapre · conectar cuenta', kind: 'page', back: true, title: 'Conectar cuenta', next: ['P80'],
  body: () => { const w = S.lk.w, is = S.lk.is || 'tu Isapre';
    return `<div class="xs t2">Paso 2 de 2</div><div class="lkh mt8"><span class="lkl">${ic('lock-simple', 1)}</span><div><h1 class="h-l">Envío asistido a ${is}</h1><div class="sm t2 mt4">Cuidapp prepara tus documentos y te ayuda a enviarlos. Tú ingresas a ${is} con tu clave.</div></div></div>
    <div class="lkbox mt16"><div class="lkn">${ic('shield-check', 1)}<span>Cuidapp no te pide ni guarda la clave de ${is}. Puedes desvincular cuando quieras.</span></div></div>
    <div class="lbl2">Autorización</div>
    ${checkRow('Autorizo a Cuidapp a ayudarme con mis reembolsos', S.lk.c1, 'lkC', 'c1', `Para que un agente de Cuidapp prepare mi boleta, mi orden médica y mi carnet de las atenciones agendadas en Cuidapp y me ayude a enviarlos a ${is}. Acepto el cobro de ${clp(RB_FEE)} por cada reembolso gestionado`)}
    ${checkRow('Acepto el uso de mis datos de salud para este fin', S.lk.c2, 'lkC', 'c2', 'Solo para tramitar reembolsos. Cada envío queda registrado y lo puedes ver')}
    <button class="lk sm mt4" data-act="toast" data-arg="Cuidapp solo prepara y ayuda a enviar reembolsos de atenciones agendadas en Cuidapp. No guarda tu clave de la Isapre, no cambia tu plan ni tus datos. Puedes revocarlo cuando quieras desde Cuenta.">Leer la autorización completa</button>
    <div class="lbl2">Una sola vez</div>${row('box:identification-card', 'Carnet de identidad', S.lk.car ? 'Subido · por ambos lados' : 'Foto por ambos lados', '', S.lk.car ? st('ok', 'Listo') : '<span class="lk">Subir</span>', '', 'lkC', 'car')}
    ${row('box:bank', 'Cuenta para recibir el pago', S.lk.bank ? 'BancoEstado · Cuenta RUT •••• 3207' : 'Opcional, si tu Isapre paga por transferencia', '', S.lk.bank ? st('ok', 'Lista') : '<span class="lk">Agregar</span>', '', 'lkC', 'bank')}
    <div class="mt16">${note('info', 'Sujeto a las condiciones y plazos de cada Isapre. La Isapre decide el monto que reembolsa según tu plan.')}</div>`; },
  foot: () => abtn(`${ic('link')}Vincular ${S.lk.is || 'Isapre'}`, 'isaLink', '', '', S.lkNext || 'P80', !(S.lk.c1 && S.lk.c2)) });

def({ id: 'P80', name: 'Mis reembolsos', kind: 'page', back: true, title: 'Reembolsos', next: ['P81', 'P78', 'P82'],
  body: () => { const ws = Object.keys(S.isa); const l = RBS();
    return `${ws.length ? ws.map(w => row('box:link', `${S.isa[w].is} vinculada`, `${FAM[w].c} · RUT ${RUTS[w]}`, 'P82', st('ok', 'Activa'), '', 'lkW', w)).join('') : row('box:link', 'Vincula tu Isapre', 'Y te ayudamos a enviar tus reembolsos', 'P78', '<span class="lk">Vincular</span>')}
    <div class="lbl2">Solicitudes</div>${l.map(r => `<button class="rbc" data-act="rb" data-arg="${r.id}" data-go="P81"><span class="tx"><b>${r.svc}</b><span class="xs t2">${FAM[r.w].c} · ${r.f} · gestión ${clp(RB_FEE)} · ${(S.pv[r.w] || {}).t === 'isapre' ? 'Isapre ' + S.pv[r.w].is : pvTxt(r.w)}</span></span><span class="rbr"><b class="num">${clp(r.m)}</b>${rbChip(r.st)}</span></button>`).join('')}
    <div class="mt16">${note('info', 'Sujeto a las condiciones y plazos de cada Isapre.')}</div>`; } });

def({ id: 'P81', name: 'Detalle del reembolso', kind: 'page', back: true, title: 'Reembolso', next: ['P65'],
  body: () => { const r = RBS().find(x => x.id === S.rbSel) || RBS()[1], ix = rbIdx(r.st), isa = (S.pv[r.w] || {}).is || 'la Isapre';
    const steps = [['file-text', 'Documentos listos'], ['paper-plane-tilt', 'Enviado a la Isapre'], ['hourglass-medium', 'En revisión'], [r.st === 'rech' ? 'x-circle' : 'check', r.st === 'rech' ? 'Rechazado' : 'Aprobado'], ['bank', 'Pagado']];
    const log = [['26 oct · 09:14', 'Agente Cuidapp preparó la boleta y la orden médica'], ['26 oct · 09:20', `Enviaste los documentos al sitio de ${isa} con ayuda del agente`], ['26 oct · 09:21', `${isa} entregó el n.º de solicitud 4821-77`], ['28 oct · 12:03', `${isa} cambió el estado a «En revisión»`], ['2 nov · 10:40', r.st === 'rech' ? `${isa} rechazó: falta la orden médica` : `${isa} aprobó la solicitud`], ['5 nov · 15:10', 'Pago depositado en tu cuenta']].slice(0, Math.max(1, [1, 3, 4, 5, 6][ix]));
    return `<div class="xs t2">${FAM[r.w].c} · ${r.f}</div><h1 class="h-l mt4">${r.svc}</h1><div class="mt8">${rbChip(r.st)}</div>
    <div class="mt16">${kv('Monto presentado', clp(r.m))}${kv('Monto reembolsado', r.pago ? clp(r.pago) : r.st === 'rech' ? '—' : 'Lo informa la Isapre')}${kv('Gestión de reembolso Cuidapp', clp(RB_FEE))}</div>
    ${r.st === 'rech' ? `<div class="mt12">${note('warning', r.mot, 'bad')}</div>` : ''}
    <div class="lbl2">Estado</div><div class="tl3">${steps.map((t, i) => `<div class="tl3r ${i < ix || (i === ix && (r.st === 'pag')) ? 'ok' : i === ix ? 'on' : ''}">${ic(t[0], i <= ix)}<div><b>${t[1]}</b><span>${i < ix || r.st === 'pag' ? 'Hecho' : i === ix ? 'Ahora' : 'Pendiente'}</span></div></div>`).join('')}</div>
    <div class="lbl2">Documentos</div>${[['Boleta', 'receipt'], ['Orden médica', 'file-text'], ['Carnet de identidad', 'identification-card']].map((d, i) => row('box:' + d[1], d[0], r.d[i] ? 'Adjunta' : 'Falta', '', r.d[i] ? st('ok', 'Lista') : st('bad', 'Falta'))).join('')}
    <div class="lbl2">Paso a paso</div><div class="rblog">${log.map(l => `<div><span class="xs t3">${l[0]}</span><span class="sm">${l[1]}</span></div>`).join('')}</div>
    <div class="mt16">${note('info', 'Sujeto a las condiciones y plazos de cada Isapre.')}</div>`; },
  foot: () => { const r = RBS().find(x => x.id === S.rbSel) || RBS()[1]; return r.st === 'rech' ? abtn('Subir orden y reenviar', 'rbFix', '', '', '') : btn(ic('file-pdf') + 'Ver documentos', 'P65', 'sec'); } });

def({ id: 'P82', name: 'Isapre vinculada', kind: 'page', back: true, title: 'Isapre vinculada', next: ['P80'],
  body: () => { const w = S.lk.w || 'yo', i = S.isa[w] || { is: S.pv[w].is || 'Isapre', desde: '—' };
    return `<div class="lkh"><span class="lkl ok">${ic('link', 1)}</span><div><h1 class="h-l">${i.is}</h1><div class="sm t2 mt4">${FAM[w].n} · RUT ${RUTS[w]}</div></div></div>
    <div class="mt16">${st('ok', 'Vinculada desde el ' + i.desde, 'check-circle')}</div>
    <div class="lbl2">Qué puede hacer Cuidapp</div>${row('box:file-text', 'Preparar boleta, orden médica y carnet', 'Solo de atenciones agendadas en Cuidapp', '', '')}${row('box:hand-pointing', 'Ayudarte a enviarlos', 'Tú ingresas a tu Isapre con tu clave. Cuidapp no la guarda', '', '')}${row('box:prohibit', 'No cambia tu plan ni tus datos', 'Tampoco hace otros trámites', '', '')}
    <div class="lbl2">Actividad</div>${row('box:clock-counter-clockwise', 'Último envío', 'Hoy 09:20 · Vitamina D', 'P80')}`; },
  foot: () => `<div class="row8">${btn('Ver reembolsos', 'P80', 'sec')}${abtn('Desvincular', 'isaUn', S.lk.w || 'yo', 'sec danger', 'P28')}</div>` });

/* ---------- P93 · Mi salud (pestaña) ---------- */
const MSX = {
  mama: { pk: ['met', 'cv'], prox: [['calendar-check', 'Mié 28 oct · 08:00', 'Curación y 3ª dosis de Neurobionta · Camila', 'P26', 'Confirmada'], ['bell-ringing', 'Hemoglobina glicosilada', 'Control · 24 ene 2027', 'P77', ''], ['pill', 'Remedios de hoy', 'Losartán 08:00 · Metformina 13:00 y 20:00', 'P51', '']] },
  papa: { pk: ['hom', 'cv'], prox: [['syringe', 'Enoxaparina 40 mg · 20:00', 'Día 6 de 21 · abdomen, alternando lados', 'P51', ''], ['calendar-blank', 'Sin visitas agendadas', 'Agenda una curación o control en casa', 'P06', '']] },
  yo: { pk: ['pre', 'muj'], prox: [['calendar-blank', 'Chequeo preventivo anual', 'Sugerido una vez al año', 'P75', ''], ['bell-ringing', 'Sin recordatorios', 'Agrégalos cuando tengas exámenes', '', '']] },
};
const msTrend = k => { const b = BIOM[k], v = bval(k), p = prevL(b);
  return `<button class="mstr" data-act="bm" data-arg="${k}" data-go="P71"><span class="tx"><b>${b.n}</b><span class="sm t2"><b class="num">${nf(v, b.d)}</b> ${b.u}${p ? ` · ${v < p[1] ? '↓' : v > p[1] ? '↑' : '='} desde ${nf(p[1], b.d)} (${p[0]})` : ''}</span><span class="msst ${bst(k) === 'ok' ? 'ok' : 'warn'}">${{ ok: 'En rango', hi: 'Sobre el rango', lo: 'Bajo el rango', crit: 'Requiere atención hoy' }[bst(k)]}</span></span>${spark(k)}${ic('caret-right')}</button>`; };
Object.assign(ACT, { msFm: k => { S.fm = k; } });
const msIsa = k => { const p = S.pv[k] || {}, l = isaOf(k), nm = k === 'yo' ? 'tu' : 'la';
  if (l) return `<div class="isac on mt12" role="button" data-act="lkW" data-arg="${k}" data-go="P82"><span class="ri box">${ic('link')}</span><span class="tx"><b>${l.is} vinculada</b><span class="xs t2">Te ayudamos a enviar los reembolsos · desde ${l.desde}</span></span>${st('ok', 'Activa')}</div>`;
  if (p.t === 'fonasa') return `<div class="isac mt12"><span class="ri box">${ic('shield-check')}</span><span class="tx"><b>${FAM[k].c} es de Fonasa ${p.tr ? 'tramo ' + p.tr : ''}</b><span class="xs t2">Descarga los documentos para tu reembolso. ¿Se cambió a Isapre? Vincúlala.</span></span><button class="pill" data-act="lkW" data-arg="${k}" data-go="P78">Vincular</button></div>`;
  return `<div class="isac mt12"><span class="ri box">${ic('link')}</span><span class="tx"><b>Vincula ${nm} Isapre${p.is ? ' · ' + p.is : ''}</b><span class="xs t2">Y te ayudamos a enviar tus reembolsos al terminar cada atención</span></span><button class="btn sm2" data-act="lkW" data-arg="${k}" data-go="P78">Vincular</button></div>`; };
def({ id: 'P93', name: 'Mi salud', kind: 'page', tab: 'salud', next: ['P70', 'P71', 'P74', 'P75', 'P77', 'P51', 'P52', 'P55', 'P59', 'P80', 'P81', 'P26', 'P78', 'P82', 'P65'],
  body: () => { const k = FAM[S.fm] ? S.fm : 'mama', f = FAM[k], x = MSX[k], m = k === 'mama', out = outK(), rbs = RBS().filter(r => r.w === k);
    const res = m ? `<div class="msc"><div class="msc-h"><div><b>Exámenes del 24 oct</b><span class="xs t2">${BKEYS.length} biomarcadores · Paula Godoy</span></div><button class="lk sm" data-go="P70">Ver todos</button></div>
      <div class="bcnt mt12"><div class="ok">${ic('check-circle', 1)}<b class="num">${BKEYS.length - out.length}</b><span>en rango</span></div><div class="warn">${ic('arrows-down-up', 1)}<b class="num">${out.length}</b><span>para revisar</span></div></div>
      <div class="mstl mt12">${out.slice(0, 3).map(msTrend).join('')}</div></div>`
      : `<div class="msc ms-e"><span class="ri box">${ic('chart-line-up')}</span><div><b>Aún no hay exámenes de ${f.c}</b><div class="sm t2 mt4">Cuando estén los resultados vas a ver aquí cómo cambian en el tiempo.</div><button class="lk sm mt8" data-go="P74">Ver packs de exámenes</button></div></div>`;
    return `<h1 class="h-xl mt8">Mi salud</h1><div class="t2 sm mt4">Resultados, controles y documentos de tu familia.</div>
    <div class="pers mt16" role="tablist">${['mama', 'papa', 'yo'].map(w => `<button class="${w === k ? 'on' : ''}" data-act="msFm" data-arg="${w}" role="tab" aria-selected="${w === k}">${av(FAM[w].i, 's')}<span>${w === 'yo' ? 'Tú' : FAM[w].c}</span></button>`).join('')}</div>
    <div class="mt16">${pinAl(f)}</div>
    ${msIsa(k)}
    <div class="lbl2">Últimos resultados</div>${res}
    <div class="lbl2">Próximos y recordatorios</div>${x.prox.map(p => row('box:' + p[0], p[1], p[2], p[3], p[4] ? st('ok', p[4]) : '', '', p[3] === 'P51' ? 'fm' : p[3] === 'P75' ? 'pk' : '', p[3] === 'P51' ? k : p[3] === 'P75' ? 'pre' : '')).join('')}
    <div class="shd mt24"><h3>Chequeos sugeridos</h3><button class="lk sm" data-go="P74">Ver packs</button></div><div class="pkl2">${x.pk.map(id => pkCard(pkOf(id), 1)).join('')}</div>
    <div class="lbl2">Ficha y documentos</div>${row('box:notebook', 'Ficha de salud', f.dx[0], 'P51', '', '', 'fm', k)}${row('box:list', 'Línea de tiempo', m ? '9 registros · última nota hoy' : k === 'papa' ? '3 registros · última nota 21 oct' : 'Sin registros todavía', 'P52', '', '', 'fm', k)}${m ? row('box:file-pdf', 'Informe del laboratorio', 'Resultados 24 oct · PDF', '', ic('download-simple'), '', 'toast', 'Descargado: Resultados-Rosa-24-10-2026.pdf') : ''}${row('box:file-pdf', 'Ficha en PDF', 'Para llevarla al médico', 'P59', '', '', 'fm', k)}
    <div class="lbl2">Reembolsos</div>${rbs.length ? rbs.map(r => row('box:receipt', r.svc, `${r.f} · ${clp(r.m)}`, 'P81', rbChip(r.st), '', 'rb', r.id)).join('') : row('box:receipt', 'Sin reembolsos en curso', S.pv[k] && S.pv[k].t === 'isapre' ? 'Te ayudamos a enviarlos cuando vinculas tu Isapre' : pvTxt(k), 'P80', '<span class="lk">Ver todos</span>')}
    <div class="lbl2">Privacidad</div>${row('box:eye', 'Quién vio la ficha', m ? 'Último acceso hoy 08:41 · Camila' : 'Registro de accesos', 'P55', '', '', 'fm', k)}
    <div class="mt16">${note('info', 'Esto no es un diagnóstico. Conversa tus resultados con tu médico tratante.')}</div>`; } });
