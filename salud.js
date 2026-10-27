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
/* ---------- datos de cada integrante y rangos por sexo y edad ----------
   TODO es de ejemplo del prototipo: personas, fechas, valores y rangos. En producción el rango (según sexo y edad) y la marca
   vienen del informe del laboratorio. Verde = en rango · amarillo = en el límite (hasta 10% fuera del límite) · rojo = fuera de rango. */
const HIST0 = {}; Object.keys(BIOM).forEach(k => HIST0[k] = BIOM[k].h);   // Rosa (mamá): los ejemplos originales
BIOM.fer = { n: 'Ferritina', t: 'Ferritina', s: 'Hierro guardado', sis: 'sangre', u: 'ng/mL', min: 15, max: 150, d: 0, h: [], ex: 'x4', que: 'Muestra cuánto hierro tiene guardado el cuerpo.' };
const B0 = {}; Object.keys(BIOM).forEach(k => B0[k] = [BIOM[k].min, BIOM[k].max]);
const RG = { hb: { F: [12, 16], M: [13.5, 17.5], N: [11.5, 15.5] }, hdl: { F: [50, 90], M: [40, 90] }, cre: { F: [0.5, 1.1], M: [0.7, 1.3], N: [0.3, 0.7] }, got: { F: [0, 35], M: [0, 40] }, gpt: { F: [0, 35], M: [0, 45] }, fer: { F: [15, 150], M: [30, 400], N: [15, 100] }, leu: { N: [5.0, 13.0] } };
const rgOf = (k, f) => { const g = RG[k] || {}; return (f.e < 12 && g.N) || g[f.sx] || B0[k]; };
const RES = {
  mama: HIST0,
  yo: { hb: h5([12.6, 12.8]), glu: h5([94, 92]), col: h5([192, 196]), ldl: h5([104, 108]), hdl: h5([55, 58]), tg: h5([110, 118]), tsh: h5([2.0, 2.2]), vitd: h5([24, 19]), b12: h5([420, 390]), fer: h5([14.2, 13.8]), cre: h5([0.8, 0.82]), k: h5([4.3, 4.2]), pcr: h5([1.2, 0.9]) },
  papa: { hb: h5([13.1, 12.8, 12.4]), cre: h5([1.15, 1.3, 1.6]), pcr: h5([6, 12, 18]), pla: h5([310, 420, 478]), glu: h5([102, 98, 104]), ldl: h5([96, 99, 104]), k: h5([4.6, 4.8, 4.7]), na: h5([139, 138, 137]), got: h5([28, 31, 33]), gpt: h5([30, 35, 41]), leu: h5([9.8, 10.2, 10.9]) },
  tomas: { hb: h5([12.4, 11.1]), leu: h5([7.4, 7.0]), pla: h5([310, 298]), glu: h5([84, 86]), cre: h5([0.5, 0.52]), vitd: h5([31, 28]), fer: h5([22, 21]), k: h5([4.4, 4.3]), tsh: h5([2.8, 2.6]) },
};
const fmk = () => FAM[S.fm] ? S.fm : 'mama';
const BKEYS = [];
const bapply = () => { const w = fmk(), f = FAM[w], r = RES[w] || {}; BKEYS.length = 0;
  Object.keys(BIOM).forEach(k => { const b = BIOM[k]; if (r[k]) { b.h = r[k]; [b.min, b.max] = rgOf(k, f); BKEYS.push(k); } }); };
const bval = k => (k === 'k' && S.crit) ? 6.6 : lastL(BIOM[k])[1];
const CRIT = { k: [3.0, 6.0], glu: [50, 400], hb: [7, 20], na: [120, 160], pla: [30, 1000], leu: [2, 30], cre: [0, 4], hba: [0, 14] };   // muy alterado: rojo + «consulta a un médico»
const bst = k => { const b = BIOM[k], v = bval(k), c = CRIT[k]; if (c && (v < c[0] || v > c[1])) return 'crit'; return v > b.max ? 'hi' : v < b.min ? 'lo' : 'ok'; };
const semV = (k, v) => { const b = BIOM[k], c = CRIT[k]; if (c && (v < c[0] || v > c[1])) return 'r'; if (v <= b.max && v >= b.min) return 'g'; const lim = v > b.max ? b.max : b.min, tol = (lim ? Math.abs(lim) : b.max - b.min) * .10; return Math.abs(v - lim) <= tol + 1e-9 ? 'y' : 'r'; };
const bsem = k => semV(k, bval(k));
const SEMT = { g: ['En rango', 'check-circle'], y: ['En el límite', 'warning-circle'], r: ['Fuera de rango', 'warning'] };
const bchip = k => { const s = bsem(k), c = bst(k), dir = c === 'hi' || c === 'crit' && bval(k) > BIOM[k].max ? 'arrow-up' : c === 'lo' || c === 'crit' ? 'arrow-down' : '';
  return `<span class="st sem-${s}">${ic(c === 'crit' ? 'warning-octagon' : SEMT[s][1], 1)}${c === 'crit' ? 'Consulta a un médico' : SEMT[s][0]}${s !== 'g' && dir ? ic(dir, 1) : ''}</span>`; };
const semCnt = () => { const n = { g: 0, y: 0, r: 0 }; BKEYS.forEach(k => n[bsem(k)]++);
  return `<div class="bcnt sem mt16">${[['g', 'check-circle', 'en rango'], ['y', 'warning-circle', 'en el límite'], ['r', 'warning', 'fuera de rango']].map(t => `<div class="sem-${t[0]}">${ic(t[1], 1)}<b class="num">${n[t[0]]}</b><span>${t[2]}</span></div>`).join('')}</div>`; };
const semLeg = () => `<div class="sleg xs t2 mt8"><span><i class="sg"></i>Verde: dentro del rango</span><span><i class="sy"></i>Amarillo: en el límite</span><span><i class="sr"></i>Rojo: fuera del rango</span></div>`;
const refTxt = (f = FAM[fmk()]) => `${f.e < 12 ? 'niños menores de 12 años' : f.sx === 'F' ? 'mujeres' : 'hombres'}${f.e >= 12 ? ', ' + f.e + ' años' : ''}`;
const brng = b => `${b.min === 0 ? 'Menor a ' + nf(b.max, b.d) : nf(b.min, b.d) + ' – ' + nf(b.max, b.d)} ${b.u}`;
const bdom = b => { const w = b.max - b.min, vs = b.h.map(x => x[1]); return [Math.max(0, Math.min(b.min - w * .5, ...vs) - w * .05), Math.max(b.max + w * .5, ...vs) + w * .05]; };
const rbar = (k, v = bval(k)) => { const b = BIOM[k], [lo, hi] = bdom(b), pc = x => Math.max(1, Math.min(99, (x - lo) / (hi - lo) * 100)); const s = bsem(k);
  return `<div class="rbar"><span class="band" style="left:${pc(b.min)}%;width:${pc(b.max) - pc(b.min)}%"></span><span class="dot d-${s}" style="left:${pc(v)}%"></span></div><div class="xs t2 mt4">Rango del laboratorio: ${brng(b)}</div>`; };
const spark = k => { const b = BIOM[k], l = b.h.filter(x => x[2] === 'l'); if (l.length < 2) return ''; const [lo, hi] = bdom(b), W = 76, H = 30, y = v => H - 3 - (v - lo) / (hi - lo) * (H - 6), x = i => 3 + i * (W - 6) / (l.length - 1);
  return `<svg class="spk" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true"><rect x="0" y="${y(b.max)}" width="${W}" height="${Math.max(1, y(b.min) - y(b.max))}" class="spb"/><polyline points="${l.map((p, i) => x(i) + ',' + y(p[1])).join(' ')}"/>${l.map((p, i) => `<circle cx="${x(i)}" cy="${y(p[1])}" r="${i === l.length - 1 ? 3 : 2}"/>`).join('')}</svg>`; };
const bchart = k => { const b = BIOM[k], pts = b.h.filter(x => x[2] === 'l' || S.incVis || k === 'glu'), dates = [...new Set(pts.map(p => p[0]))], [lo, hi] = bdom(b), W = 330, H = 170, L = 34, B = 26;
  const X = d => L + 14 + dates.indexOf(d) * (W - L - 36) / Math.max(1, dates.length - 1), Y = v => 10 + (hi - v) / (hi - lo) * (H - B - 10);
  const sc = p => 'c-' + semV(k, p[1]);
  const lab = pts.filter(p => p[2] === 'l');
  return `<svg class="bch" viewBox="0 0 ${W} ${H}" role="img" aria-label="Historial de ${b.n}"><rect x="${L}" y="${Y(b.max)}" width="${W - L}" height="${Math.max(1, Y(b.min) - Y(b.max))}" class="bnd"/>
  <text x="${L - 4}" y="${Y(b.max) + 4}" text-anchor="end">${nf(b.max, b.d)}</text>${b.min > 0 ? `<text x="${L - 4}" y="${Y(b.min) + 4}" text-anchor="end">${nf(b.min, b.d)}</text>` : ''}
  <polyline points="${lab.map(p => X(p[0]) + ',' + Y(p[1])).join(' ')}"/>
  ${pts.map(p => p[2] === 'l' ? `<circle class="${sc(p)}" cx="${X(p[0])}" cy="${Y(p[1])}" r="5"/>` : `<rect class="${sc(p)} vis" x="${X(p[0]) - 4.5}" y="${Y(p[1]) - 4.5}" width="9" height="9" transform="rotate(45 ${X(p[0])} ${Y(p[1])})"/>`).join('')}
  ${dates.map(d => `<text x="${X(d)}" y="${H - 6}" text-anchor="middle">${d}</text>`).join('')}</svg>
  <div class="blg xs t2"><span><i class="lgc"></i>Laboratorio</span>${k === 'glu' ? '<span><i class="lgd"></i>Visita de enfermería (capilar)</span>' : ''}<span><i class="lgb"></i>Rango del laboratorio</span></div>`; };
const outK = () => BKEYS.filter(k => bst(k) !== 'ok');
const critBan = () => BKEYS.some(k => bst(k) === 'crit') ? `<div class="critb">${ic('warning', 1)}<div><b>Hay un resultado muy alterado: consulta a un médico hoy.</b><span>Llama a tu médico tratante. Si hay síntomas graves, llama al 131. Esta aplicación no reemplaza a un médico.</span></div></div>` : '';
const DISC = 'Estos resultados no son un diagnóstico y no reemplazan a un médico. Los datos y los rangos son de ejemplo del prototipo.';
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
  lkW: w => { S.lk.w = w; S.lk.rut = ''; S.lk.cl = false; S.lk.c1 = false; S.lk.c2 = false; S.lk.del = false; const p = S.pv[w]; if (p && p.t === 'isapre') S.lk.is = p.is; },
  lkIs: i => { S.lk.is = i; },
  lkC: k => { S.lk[k] = !S.lk[k]; },
  carFor: w => { S.carFor = w; },
  carRm: s => { S.car[cw()][s] = ''; },
  /* la clave NO se guarda en el estado del prototipo: solo se marca que se ingresó. En producción se cifra en el servidor */
  isaLink: () => { const w = S.lk.w; S.isa[w] = { is: S.lk.is, desde: '26 oct 2026', rutA: S.lk.rut || RUTS[w], ult: '', uso: [['Hoy', 'Clave guardada cifrada · autorizaste su uso']] }; S.pv[w].t = 'isapre'; S.pv[w].is = S.lk.is; S.rbAuto = true;
    (S.isaLog = S.isaLog || []).unshift({ w, is: S.lk.is, a: 'Clave guardada cifrada', r: 'Autorizada por la usuaria', f: 'Hoy' }); S.lk.cl = false; S.lk.c1 = false; S.lk.c2 = false; if (S.lkNext) S.rbAsk = 'si'; toast(`Isapre de ${FAM[w].c} vinculada. Usamos su clave solo para hacer sus reembolsos.`); },
  lkDel: w => { S.lk.w = w; S.lk.del = false; },
  lkDelAsk: () => { S.lk.del = true; },
  lkDelNo: () => { S.lk.del = false; },
  isaUn: w => { const i = S.isa[w]; delete S.isa[w]; S.lk.del = false; if (!Object.keys(S.isa).length) S.rbAuto = false;
    (S.isaLog = S.isaLog || []).unshift({ w, is: i ? i.is : '', a: 'Clave borrada', r: 'Borrada por la usuaria', f: 'Hoy' }); toast(`Clave borrada. Dejamos de presentar reembolsos de ${FAM[w].c} en ${i ? i.is : 'su Isapre'}.`); },
  rbAuto: () => { S.rbAuto = !S.rbAuto; S.rbAsk = S.rbAuto ? 'si' : 'no'; },
  rbAsk: v => { S.rbAsk = v; S.rbAuto = v === 'si' && !!isaOf(S.who); },
  lkBook: () => { S.lk.w = S.who; S.lk.is = (S.pv[S.who] || {}).is || S.lk.is; S.lkNext = 'P14'; },
  rb: id => { S.rbSel = id; },
  rbFix: () => { const r = RBS().find(x => x.id === S.rbSel); if (r) r.st = 'env'; toast('Reenviado con la orden médica corregida.'); },
});

/* ---------- P70 · Biomarcadores (resumen) ---------- */
const bmCard = k => { const b = BIOM[k], v = bval(k), p = prevL(b), s = bst(k);
  return `<button class="bmc s-${bsem(k)}" data-act="bm" data-arg="${k}" data-go="P71"><div class="bmh"><div><b>${b.n}</b><span class="xs t3">${b.t} · ${b.s}</span></div>${bchip(k)}</div>
  <div class="bmv"><span class="num big">${nf(v, b.d)}</span><span class="u">${b.u}</span>${p ? `<span class="xs t2 dl">${v < p[1] ? '↓' : v > p[1] ? '↑' : '='} ${nf(Math.abs(v - p[1]), b.d)} desde ${p[0]}</span>` : ''}${spark(k)}</div>${rbar(k)}</button>`; };
def({ id: 'P70', name: 'Biomarcadores', kind: 'page', back: true, get title() { return 'Exámenes de ' + FAM[fmk()].c; }, next: ['P71', 'P72', 'P73', 'P76', 'P77'],
  body: () => { bapply(); if (!BKEYS.length) return noRes(); const f = S.bF || 'all', out = outK(); let l = [...out, ...BKEYS.filter(k => !out.includes(k))]; if (f === 'rev') l = out; if (S.bSis) l = l.filter(k => BIOM[k].sis === S.bSis);
    return `${critBan()}<div class="sm t2">Exámenes del 24 oct · ${BKEYS.length} biomarcadores · tomados por Paula Godoy</div><button class="lk sm mt4" data-act="toast" data-arg="Abriendo Resultados-${FAM[fmk()].c}-24-10-2026.pdf (informe original del laboratorio).">${ic('file-pdf')}Ver informe original (PDF)</button>
    ${semCnt()}
    ${semLeg()}<div class="seg mt16">${[['all', 'Todos'], ['rev', 'Para revisar']].map(t => `<button class="${f === t[0] ? 'on' : ''}" data-act="bF" data-arg="${t[0]}">${t[1]}</button>`).join('')}</div>
    <div class="chips scx mt12">${SIS.map(s => chip(s[1], S.bSis === s[0], 'bSis', s[0])).join('')}</div>
    <div class="row nodiv mt8"><span class="tx"><div class="a">Incluir mediciones de las visitas</div><div class="b">Glicemia capilar, presión y saturación de las notas de enfermería</div></span><span class="end">${swc(S.incVis, 'tog', 'incVis', 'Incluir mediciones de las visitas')}</span></div>
    ${S.incVis ? `<div class="lbl2">De las visitas</div><div class="vism">${VISM.map(m => `<div class="vm"><span class="xs t2">${m[0]}</span><b class="num">${m[1]}</b><span class="xs t3">${m[2]}</span></div>`).join('')}</div>` : ''}
    <div class="lbl2">${f === 'rev' ? 'Para revisar' : 'Resultados'} · ${l.length}</div><div class="bml">${l.map(bmCard).join('') || '<div class="sm t2">Nada en este grupo.</div>'}</div>
    <div class="lbl2">Seguimiento</div>${row('box:path', 'Estado de los exámenes', 'Tomados 24 oct · todos listos', 'P76', st('ok', 'Listos'))}${row('box:bell-ringing', 'Controles', 'Repetir hemoglobina glicosilada · 24 ene 2027', 'P77')}
    <div class="mt16">${note('info', DISC)}</div>`; },
  foot: () => btn(ic('share-network') + 'Compartir resultados', 'P73', 'sec') });

/* ---------- P71 · Detalle ---------- */
def({ id: 'P71', name: 'Detalle del biomarcador', kind: 'page', back: true, title: '', next: ['P73', 'P40'],
  body: () => { bapply(); const k = BKEYS.includes(S.bm) ? S.bm : BKEYS[0] || 'hba', b = BIOM[k], v = bval(k), s = bst(k), p = prevL(b), lab = b.h.filter(x => x[2] === 'l');
    
    return `${bst(k) === 'crit' ? critBan() : ''}<div class="xs t3">${b.t} · ${SIS.find(x => x[0] === b.sis)[1]}</div><h1 class="h-l mt4">${b.n}</h1><div class="row8 mt8" style="align-items:baseline;gap:8px"><span class="num big">${nf(v, b.d)}</span><span class="t2">${b.u}</span>${bchip(k)}</div>
    <div class="mt16 bchw">${bchart(k)}</div>
    <div class="lbl2">Qué mide</div><div class="sm">${b.que}</div>
    ${semExp(k)}
    <div class="lbl2">Qué puedes hacer</div><ul class="bhl">${[...(s === 'ok' ? ['Mantén tus controles según te indique tu médico'] : SISH[b.sis]), 'Conversa este resultado con tu médico tratante'].map(x => `<li>${ic('check')}<span>${x}</span></li>`).join('')}</ul>
    <div class="xs t3 mt4">${ic('seal-check')} Contenido general de ejemplo del prototipo: en producción lo revisa el equipo médico de Cuidapp</div>
    <div class="lbl2">Historial</div><table class="rtab bht"><tr><th>Fecha</th><th>Valor</th><th>Rango</th><th>Origen</th></tr>${b.h.slice().reverse().filter(x => x[2] === 'l' || k === 'glu').map(x => `<tr><td>${x[0]}</td><td class="num tv-${semV(k, x[1])}">${nf(x[1], b.d)}</td><td class="t2">${x[2] === 'l' ? brng(b) : '—'}</td><td class="t2">${x[2] === 'l' ? 'Laboratorio' : 'Visita · Camila'}</td></tr>`).join('')}</table>
    <div class="mt12">${note('info', DISC)}</div>
    <button class="lk sm mt12" data-act="toast" data-arg="Fuente: MedlinePlus en español · medlineplus.gov/spanish/laboratorytests.html">${ic('arrow-square-out')}Fuente: MedlinePlus en español</button>
    <button class="row mt12" data-act="toast" data-arg="Revisar con un médico: llega pronto, con telemedicina."><span class="ri box">${ic('stethoscope')}</span><span class="tx"><div class="a">Revisar con un médico <span class="pr soonb">Muy pronto</span></div><div class="b">Una videollamada para conversar tus resultados</div></span></button>`; },
  foot: () => `<div class="row8">${btn(ic('share-network') + 'Compartir', 'P73', 'sec')}${abtn(ic('repeat') + 'Repetir examen', 'rep', S.bm || 'hba', '', 'P40')}</div>` });

/* ---------- P72 · Resultado listo ---------- */
const TRK = [['test-tube', 'Muestra tomada', '24 oct · 08:41 · Paula Godoy'], ['flask', 'En el laboratorio', '24 oct · 11:20'], ['file-text', 'Resultado parcial', '25 oct · 16:05 · 15 de 18'], ['check-circle', 'Resultados listos', '26 oct · 09:12']];
def({ id: 'P72', name: 'Resultados listos', kind: 'page', back: true, title: '', next: ['P70', 'P76'],
  body: () => { bapply(); if (!BKEYS.length) return noRes(); const out = outK(), nm = FAM[fmk()].c;
    return `<button class="push" data-go="P70"><div class="push-h"><img src="logo/apple-touch-icon.png" alt=""><span>Cuidapp</span><span class="t3">ahora</span></div><b>${S.crit ? 'Un resultado de ' + nm + ' necesita atención hoy' : 'Los resultados de ' + nm + ' están listos'}</b><div>${S.crit ? 'Abre la app para ver qué hacer.' : `Hay ${out.length} valores para revisar.`}</div></button>
    <div class="mt16">${critBan()}</div><h1 class="h-l">Resultados listos</h1><div class="sm t2 mt4">Exámenes del 24 oct · ${BKEYS.length} biomarcadores</div>
    ${semCnt()}
    <div class="lbl2">Para revisar</div>${out.slice(0, 3).map(k => row('box:drop', BIOM[k].n, `${nf(bval(k), BIOM[k].d)} ${BIOM[k].u} · rango ${brng(BIOM[k])}`, 'P71', bchip(k), '', 'bm', k)).join('')}
    <div class="lbl2">Seguimiento</div><div class="tl3">${TRK.map(t => `<div class="tl3r ok">${ic(t[0], 1)}<div><b>${t[1]}</b><span>${t[2]}</span></div></div>`).join('')}</div>
    <div class="mt16">${row('box:file-pdf', 'Informe original del laboratorio', `Resultados-${nm}-24-10-2026.pdf · 4 páginas`, '', ic('download-simple'), '', 'toast', `Descargado: Resultados-${nm}-24-10-2026.pdf`)}</div>
    ${BKEYS.includes('k') ? `<button class="lk sm mt12" data-act="crit">${S.crit ? 'Volver al ejemplo normal' : 'Ver cómo se ve un valor muy alterado (ejemplo)'}</button>` : ''}<div class="mt16">${note('info', DISC)}</div>`; },
  foot: () => btn('Ver mis biomarcadores', 'P70') });

/* ---------- P73 · Compartir ---------- */
def({ id: 'P73', name: 'Compartir resultados', kind: 'page', back: true, title: 'Compartir resultados',
  body: () => `<div class="sm t2">Tú decides quién ve los exámenes de ${FAM[fmk()].c}. Puedes quitar el acceso cuando quieras.</div>
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
def({ id: 'P77', name: 'Controles', kind: 'page', back: true, get title() { return 'Controles de ' + FAM[fmk()].c; }, next: ['P40'],
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
const cw = () => S.carFor || S.who;
const carOk = w => !!(S.car && S.car[w] && S.car[w].f && S.car[w].b);
const rbReady = () => { const w = S.who; return S.rbAsk !== 'si' || (S.pv[w] || {}).t === 'fonasa' || (!!isaOf(w) && carOk(w)); };
document.addEventListener('change', e => { const t = e.target; if (!t.classList || !t.classList.contains('carin') || !t.files || !t.files[0]) return;
  const r = new FileReader(); r.onload = () => { S.car = S.car || {}; S.car[cw()] = S.car[cw()] || {}; S.car[cw()][t.dataset.side] = r.result; render(); toast(t.dataset.side === 'f' ? 'Frente del carnet subido.' : 'Reverso del carnet subido.'); }; r.readAsDataURL(t.files[0]); });
const carTile = (s, n) => { const v = ((S.car || {})[cw()] || {})[s]; return `<div class="cart ${v ? 'on' : ''}">${v ? `${String(v).startsWith('data:') ? `<img src="${v}" alt="${n} del carnet">` : `<span class="carph">${ic('identification-card')}</span>`}<div class="cart-f"><span class="sm">${ic('check-circle', 1)} ${n}</span><button class="lk sm" data-act="carRm" data-arg="${s}">Cambiar</button></div>`
  : `<label class="cart-up"><span class="carph">${ic(s === 'f' ? 'identification-card' : 'identification-badge')}</span><b>${n}</b><span class="xs t2">Tomar foto o elegir de galería</span><input class="carin" data-side="${s}" type="file" accept="image/*" hidden></label>`}</div>`; };
def({ id: 'P94', name: 'Carnet para el reembolso', kind: 'page', back: true, get title() { return 'Carnet de ' + FAM[cw()].c; },
  body: () => `<div class="sm t2">La Isapre pide el carnet de ${FAM[cw()].c} para cada reembolso. Se sube una vez y se guarda cifrado.</div>
    <div class="carg mt16">${carTile('f', 'Frente')}${carTile('b', 'Reverso')}</div>
    <div class="phg mt16"><div class="b-m sm">Para que se lea bien</div><ul>${['Carnet completo, sin cortar las esquinas', 'Con luz, sin reflejos ni dedos encima', 'Vigente'].map(t => `<li>${ic('check')}${t}</li>`).join('')}</ul></div>
    <div class="mt12">${note('lock-simple', 'Se guarda cifrado y solo lo usa el proceso de reembolsos. Lo puedes borrar cuando quieras.')}</div>`,
  foot: () => btn('Listo', 'back', '', carOk(cw()) ? '' : 'disabled') });

const rbAsk = () => { const w = S.who, p = S.pv[w] || {}; if (p.t === 'fonasa') return '';
  const lk = isaOf(w), is = lk ? lk.is : p.is || 'tu Isapre';
  return `<div class="rbq mt16"><div class="rbq-h"><span class="ri box">${ic('lightning')}</span><div><b>¿Quieres que gestionemos tu reembolso automáticamente?</b><div class="sm t2 mt4">Cuidapp prepara los documentos y presenta el reembolso en ${is} · ${clp(RB_FEE)}</div></div></div>
  <div class="row8 mt12"><button class="btn ${S.rbAsk === 'si' ? '' : 'sec'} sm" data-act="rbAsk" data-arg="si">${S.rbAsk === 'si' ? ic('check') : ''}Sí</button><button class="btn ${S.rbAsk === 'no' ? '' : 'sec'} sm" data-act="rbAsk" data-arg="no">${S.rbAsk === 'no' ? ic('check') : ''}No, gracias</button></div>
  ${S.rbAsk === 'si' ? `<div class="rbreq mt12"><div class="xs t2">Para ayudarte a enviarlo necesitamos 2 cosas, una sola vez:</div>
    ${lk ? row('box:check-circle', `1. ${lk.is} vinculada`, 'Listo', '', st('ok', 'Hecho')) : row('box:link', '1. Vincular la Isapre de ' + FAM[w].c, `Con su RUT y clave de ${is}. Toma 2 minutos.`, 'P78', '<span class="lk">Vincular</span>', '', 'lkBook', '')}
    ${carOk(w) ? row('box:check-circle', '2. Carnet por ambos lados', 'Subido', 'P94', st('ok', 'Hecho'), '', 'carFor', w) : row('box:identification-card', '2. Subir el carnet de ' + FAM[w].c, 'Foto por delante y por detrás', 'P94', '<span class="lk">Subir</span>', '', 'carFor', w)}
    ${rbReady() ? `<div class="xs t2 mt8">${ic('check-circle')} Listo. Al terminar la atención preparamos los documentos y presentamos el reembolso en ${is}. La gestión (${clp(RB_FEE)}) aparece en el desglose.</div>` : `<div class="xs warnt mt8">Completa los 2 pasos para continuar, o elige «No, gracias».</div>`}</div>` : S.rbAsk === 'no' ? `<div class="xs t2 mt12">Igual te dejamos la boleta para que la presentes tú.</div>` : ''}</div>`; };
const rbAutoRow = () => { const w = S.who, p = S.pv[w] || {};
  if (p.t !== 'isapre') return p.t === 'fonasa' ? row('box:receipt', 'Reembolso Fonasa', 'Descarga los documentos y preséntalos en Fonasa', 'P65') : '';
  if (!isaOf(w)) return row('box:link', 'Reembolso automático', `Vincula la Isapre de ${FAM[w].c} · gestión ${clp(RB_FEE)}`, 'P78', '<span class="lk">Vincular</span>', '', 'lkW', w);
  return `<div class="row nodiv"><span class="ri box">${ic('lightning')}</span><span class="tx"><div class="a">Reembolso automático</div><div class="b">${S.rbAuto ? `Presentamos el reembolso en ${isaOf(w).is} al terminar · gestión ${clp(RB_FEE)}` : `Desactivado · si lo activas, gestión ${clp(RB_FEE)}`}</div></span><span class="end">${swc(S.rbAuto, 'rbAuto', '', 'Reembolso automático')}</span></div>`; };

const CLVG = [['lock-key', 'Se guarda cifrada', 'Nadie puede leerla'], ['gear-six', 'Solo la usa el proceso de reembolsos', 'No se usa para nada más'], ['eye-slash', 'Nadie del equipo la ve', 'Ni soporte ni operaciones'], ['list-checks', 'Cada uso queda registrado', 'Fecha, qué se hizo y en qué Isapre. Tú puedes verlo'], ['trash', 'La borras cuando quieras', 'Con «Borrar clave». Dejamos de presentar reembolsos al instante']];
const clvGar = () => `<div class="clvg">${CLVG.map(t => row('box:' + t[0], t[1], t[2], '', '')).join('')}</div>`;
const pvHead = w => `<div class="pers sc mt16" role="tablist">${S.mem.map(x => `<button class="${x === w ? 'on' : ''}" data-act="lkW" data-arg="${x}" role="tab" aria-selected="${x === w}">${av(FAM[x].i, 's')}<span>${x === 'yo' ? 'Tú' : FAM[x].c}</span></button>`).join('')}</div>`;

def({ id: 'P78', name: 'Vincular Isapre · paso 1', kind: 'page', back: true, title: 'Vincular Isapre', next: ['P79', 'P64'],
  prep: () => { if (!S.lk.is) ACT.lkW(S.lk.w || S.who); },
  body: () => { const w = S.lk.w, p = S.pv[w] || {}, f = FAM[w];
    return `<div class="xs t2">Paso 1 de 3</div><h1 class="h-l mt4">¿De quién es la Isapre?</h1><div class="sm t2 mt4">Cada integrante tiene su propia previsión y su propio carnet. Vincula la Isapre de ${f.c} una vez y Cuidapp presenta sus reembolsos. Gestión: ${clp(RB_FEE)} por solicitud, solo cuando lo activas.</div>
    ${pvHead(w)}
    ${p.t !== 'isapre' ? `<div class="mt16">${note('info', p.t === 'fonasa' ? `${f.c} es de Fonasa. Por ahora el reembolso automático es para Isapres: con Fonasa descargas los documentos y los presentas tú. Si ${f.c} se cambió a una Isapre, cambia su previsión.` : `${f.c} es particular, sin Isapre. Si tiene Isapre, cambia su previsión.`)}</div>${row('box:shield-check', 'Previsión de ' + f.c, pvTxt(w), 'P64', '<span class="lk">Cambiar</span>', '', 'pvFor', w)}${p.t === 'fonasa' ? btn('Ver documentos para Fonasa', 'P65', 'sec mt12') : ''}` : `
    <div class="lbl2">Isapre de ${f.c}</div><div class="isal">${ISAPRES.map(i => `<button class="isai ${S.lk.is === i ? 'on' : ''}" data-act="lkIs" data-arg="${i}"><span class="isl">${i.split(' ').map(x => x[0]).join('').slice(0, 2)}</span><span>${i}</span>${S.lk.is === i ? ic('check-circle', 1) : ''}</button>`).join('')}</div>
    <div class="mt16">${note('lock-simple', 'En el paso 2 pedimos el RUT y la clave de la Isapre. Antes de guardarla te mostramos qué hacemos con ella y tú autorizas.')}</div>`}`; },
  foot: () => (S.pv[S.lk.w] || {}).t !== 'isapre' ? '' : btn('Continuar', 'P79', '', S.lk.is ? '' : 'disabled') });

def({ id: 'P79', name: 'Vincular Isapre · RUT y clave', kind: 'page', back: true, title: 'RUT y clave de la Isapre', next: ['P97', 'P94'],
  body: () => { const w = S.lk.w, f = FAM[w], is = S.lk.is || 'la Isapre';
    return `<div class="xs t2">Paso 2 de 3</div><div class="lkh mt8"><span class="lkl">${ic('lock-key', 1)}</span><div><h1 class="h-l">Ingresa a ${is}</h1><div class="sm t2 mt4">El RUT y la clave que ${w === 'yo' ? 'usas' : f.c + ' usa'} en el sitio de ${is}.</div></div></div>
    <div class="lbl2">RUT en ${is}</div>${finp('_lk', 'rut', S.lk.rut || RUTS[w], '12.345.678-5', { i: 'identification-card' })}
    <div class="lbl2">Clave de ${is}</div>${finp('_lk', 'clave', '', S.lk.cl ? '•••••••• · ya la ingresaste' : 'Tu clave de ' + is, { t: 'password', i: 'lock-simple', x: 'autocomplete="new-password"' })}
    <div class="xs t3 mt4">Prototipo: escribe cualquier clave de prueba. No se envía a ningún lado.</div>
    <div class="lbl2">Qué hacemos con tu clave</div>${clvGar()}
    <div class="lbl2">Para presentar el reembolso de ${f.c}</div>${row('box:identification-card', 'Carnet de identidad', carOk(w) ? 'Subido por ambos lados' : 'Foto por ambos lados', 'P94', carOk(w) ? st('ok', 'Listo') : '<span class="lk">Subir</span>', '', 'carFor', w)}
    ${row('box:bank', 'Cuenta para recibir el pago', S.lk.bank ? 'BancoEstado · Cuenta RUT •••• 3207' : 'Opcional, si tu Isapre paga por transferencia', '', S.lk.bank ? st('ok', 'Lista') : '<span class="lk">Agregar</span>', '', 'lkC', 'bank')}
    <div class="mt16">${note('info', 'Sujeto a las condiciones y plazos de cada Isapre. La Isapre decide el monto que reembolsa según el plan.')}</div>`; },
  foot: () => `<button class="btn" data-go="P97" data-chk="cl" ${S.lk.cl ? '' : 'disabled'}>Continuar</button>` });

def({ id: 'P97', name: 'Vincular Isapre · autorización de la clave', kind: 'page', back: true, title: 'Tu autorización', next: ['P82', 'P80', 'P14'],
  body: () => { const w = S.lk.w, f = FAM[w], is = S.lk.is || 'la Isapre';
    return `<div class="xs t2">Paso 3 de 3</div><h1 class="h-l mt4">Usamos tu clave solo para hacer tus reembolsos</h1><div class="sm t2 mt8">Esto es lo que pasa con la clave de ${is} de ${f.c}:</div>
    <div class="mt12">${clvGar()}</div>
    <div class="lbl2">Autorización</div>
    ${checkRow(`Autorizo a Cuidapp a guardar la clave de ${is} (cifrada) y usarla solo para hacer los reembolsos de ${f.c}`, S.lk.c1, 'lkC', 'c1', `Cada uso queda registrado y lo puedo ver. Puedo borrar la clave cuando quiera. Acepto el cobro de ${clp(RB_FEE)} por cada reembolso gestionado`)}
    ${checkRow('Acepto el uso de los datos de salud necesarios para este fin', S.lk.c2, 'lkC', 'c2', 'Solo para presentar reembolsos de atenciones agendadas en Cuidapp')}
    <button class="lk sm mt4" data-act="toast" data-arg="Cuidapp guarda la clave cifrada y solo el proceso de reembolsos la usa para ingresar a tu Isapre, presentar los reembolsos de atenciones agendadas en Cuidapp y consultar su estado. Nadie del equipo puede ver la clave y cada uso queda registrado. Puedes borrarla cuando quieras con «Borrar clave».">Leer la autorización completa</button>
    <div class="mt16">${note('info', 'El reembolso automático necesita la Isapre vinculada y el carnet de la misma persona.')}</div>`; },
  foot: () => abtn(`${ic('link')}Autorizar y vincular ${S.lk.is || 'Isapre'}`, 'isaLink', '', '', S.lkNext || 'P80', !(S.lk.c1 && S.lk.c2)) });

def({ id: 'P80', name: 'Mis reembolsos', kind: 'page', back: true, title: 'Reembolsos', next: ['P81', 'P78', 'P82'],
  body: () => { const l = RBS(), ws = S.mem.filter(w => (S.pv[w] || {}).t === 'isapre');
    return `<div class="lbl2" style="margin-top:0">Isapre de cada integrante</div>${ws.length ? ws.map(w => msIsa(w, 1)).join('') : row('box:link', 'Nadie tiene Isapre vinculada', 'Vincula la Isapre de cada integrante para presentar sus reembolsos', 'P78', '<span class="lk">Vincular</span>')}
    <div class="lbl2">Solicitudes</div>${l.map(r => `<button class="rbc" data-act="rb" data-arg="${r.id}" data-go="P81"><span class="tx"><b>${r.svc}</b><span class="xs t2">${FAM[r.w].c} · ${r.f} · gestión ${clp(RB_FEE)} · ${(S.pv[r.w] || {}).t === 'isapre' ? 'Isapre ' + S.pv[r.w].is : pvTxt(r.w)}</span></span><span class="rbr"><b class="num">${clp(r.m)}</b>${rbChip(r.st)}</span></button>`).join('')}
    <div class="mt16">${note('info', 'Sujeto a las condiciones y plazos de cada Isapre.')}</div>`; } });

def({ id: 'P81', name: 'Detalle del reembolso', kind: 'page', back: true, title: 'Reembolso', next: ['P65'],
  body: () => { const r = RBS().find(x => x.id === S.rbSel) || RBS()[1], ix = rbIdx(r.st), isa = (S.pv[r.w] || {}).is || 'la Isapre';
    const steps = [['file-text', 'Documentos listos'], ['paper-plane-tilt', 'Enviado a la Isapre'], ['hourglass-medium', 'En revisión'], [r.st === 'rech' ? 'x-circle' : 'check', r.st === 'rech' ? 'Rechazado' : 'Aprobado'], ['bank', 'Pagado']];
    const log = [['26 oct · 09:14', 'El proceso de reembolsos preparó la boleta y la orden médica'], ['26 oct · 09:20', `El proceso de reembolsos usó la clave de ${FAM[r.w].c} para ingresar a ${isa} y presentó la solicitud (uso registrado)`], ['26 oct · 09:21', `${isa} entregó el n.º de solicitud 4821-77`], ['28 oct · 12:03', `${isa} cambió el estado a «En revisión»`], ['2 nov · 10:40', r.st === 'rech' ? `${isa} rechazó: falta la orden médica` : `${isa} aprobó la solicitud`], ['5 nov · 15:10', 'Pago depositado en tu cuenta']].slice(0, Math.max(1, [1, 3, 4, 5, 6][ix]));
    return `<div class="xs t2">${FAM[r.w].c} · ${r.f}</div><h1 class="h-l mt4">${r.svc}</h1><div class="mt8">${rbChip(r.st)}</div>
    <div class="mt16">${kv('Monto presentado', clp(r.m))}${kv('Monto reembolsado', r.pago ? clp(r.pago) : r.st === 'rech' ? '—' : 'Lo informa la Isapre')}${kv('Gestión de reembolso Cuidapp', clp(RB_FEE))}</div>
    ${r.st === 'rech' ? `<div class="mt12">${note('warning', r.mot, 'bad')}</div>` : ''}
    <div class="lbl2">Estado</div><div class="tl3">${steps.map((t, i) => `<div class="tl3r ${i < ix || (i === ix && (r.st === 'pag')) ? 'ok' : i === ix ? 'on' : ''}">${ic(t[0], i <= ix)}<div><b>${t[1]}</b><span>${i < ix || r.st === 'pag' ? 'Hecho' : i === ix ? 'Ahora' : 'Pendiente'}</span></div></div>`).join('')}</div>
    <div class="lbl2">Documentos</div>${[['Boleta', 'receipt'], ['Orden médica', 'file-text'], ['Carnet de identidad', 'identification-card']].map((d, i) => row('box:' + d[1], d[0], r.d[i] ? 'Adjunta' : 'Falta', '', r.d[i] ? st('ok', 'Lista') : st('bad', 'Falta'))).join('')}
    <div class="lbl2">Paso a paso</div><div class="rblog">${log.map(l => `<div><span class="xs t3">${l[0]}</span><span class="sm">${l[1]}</span></div>`).join('')}</div>
    <div class="mt16">${note('info', 'Sujeto a las condiciones y plazos de cada Isapre.')}</div>`; },
  foot: () => { const r = RBS().find(x => x.id === S.rbSel) || RBS()[1]; return r.st === 'rech' ? abtn('Subir orden y reenviar', 'rbFix', '', '', '') : btn(ic('file-pdf') + 'Ver documentos', 'P65', 'sec'); } });

def({ id: 'P82', name: 'Isapre vinculada', kind: 'page', back: true, title: 'Isapre vinculada', next: ['P80', 'P94'],
  body: () => { const w = S.lk.w || 'yo', f = FAM[w], i = S.isa[w] || { is: (S.pv[w] || {}).is || 'Isapre', desde: '—', uso: [] };
    return `<div class="lkh"><span class="lkl ok">${ic('link', 1)}</span><div><h1 class="h-l">${i.is} · ${S.isa[w] ? 'vinculada' : 'sin vincular'}</h1><div class="sm t2 mt4">${f.n} · RUT ${i.rutA || RUTS[w]}</div></div></div>
    <div class="mt12">${S.isa[w] ? st('ok', 'Última vez usada: ' + (i.ult || 'aún no se ha usado'), 'check-circle') : st('neu', 'La clave fue borrada', 'trash')}</div>
    <div class="lbl2">Clave</div>${row('box:lock-key', S.isa[w] ? 'Clave guardada' : 'Sin clave guardada', S.isa[w] ? '•••••••• · cifrada · nadie del equipo la ve' : 'Para volver a presentar reembolsos, vincula de nuevo', '', S.isa[w] ? '' : '')}
    <div class="lbl2">Reembolso automático de ${f.c}</div>${row('box:' + (S.isa[w] ? 'check-circle' : 'circle'), '1. Isapre vinculada (clave)', S.isa[w] ? 'Listo' : 'Falta', S.isa[w] ? '' : 'P78', S.isa[w] ? st('ok', 'Hecho') : '<span class="lk">Vincular</span>', '', S.isa[w] ? '' : 'lkW', w)}${row('box:' + (carOk(w) ? 'check-circle' : 'identification-card'), '2. Carnet por ambos lados', carOk(w) ? 'Subido' : 'Falta el carnet de ' + f.c, 'P94', carOk(w) ? st('ok', 'Hecho') : '<span class="lk">Subir</span>', '', 'carFor', w)}
    <div class="lbl2">Registro de usos de la clave</div>${(i.uso || []).length ? `<div class="rblog">${i.uso.map(l => `<div><span class="xs t3">${l[0]}</span><span class="sm">${l[1]}</span></div>`).join('')}</div>` : '<div class="sm t2">Todavía no se usó.</div>'}
    <div class="lbl2">Cómo cuidamos la clave</div>${clvGar()}`; },
  foot: () => { const w = S.lk.w || 'yo';
    if (!S.isa[w]) return btn('Vincular de nuevo', 'P78', '', 'data-act="lkW" data-arg="' + w + '"');
    return S.lk.del ? `<div class="xs t2" style="text-align:center">¿Borrar la clave de ${S.isa[w].is} de ${FAM[w].c}? Dejamos de presentar sus reembolsos.</div><div class="row8">${abtn('No, conservar', 'lkDelNo', '', 'sec')}${abtn('Sí, borrar clave', 'isaUn', w, 'danger', 'P28')}</div>` : `<div class="row8">${btn('Ver reembolsos', 'P80', 'sec')}${abtn('Borrar clave', 'lkDelAsk', '', 'sec danger')}</div>`; } });

/* ---------- P93 · Mi salud (pestaña): una ficha por integrante ---------- */
const MSX = {
  mama: { pk: ['met', 'cv'], prox: [['calendar-check', 'Mié 28 oct · 08:00', 'Curación y 3ª dosis de Neurobionta · Camila', 'P26', 'Confirmada'], ['bell-ringing', 'Hemoglobina glicosilada', 'Control · 24 ene 2027', 'P77', ''], ['pill', 'Remedios de hoy', 'Losartán 08:00 · Metformina 13:00 y 20:00', 'P51', '']] },
  papa: { pk: ['hom', 'cv'], prox: [['syringe', 'Enoxaparina 40 mg · 20:00', 'Día 6 de 21 · abdomen, alternando lados', 'P51', ''], ['calendar-blank', 'Sin visitas agendadas', 'Agenda una curación o control en casa', 'P06', '']] },
  yo: { pk: ['pre', 'muj'], prox: [['calendar-blank', 'Chequeo preventivo anual', 'Sugerido una vez al año', 'P75', ''], ['bell-ringing', 'Control de vitamina D', 'Repetir cuando lo indique tu médico', 'P77', '']] },
  tomas: { pk: [], prox: [['calendar-blank', 'Sin visitas agendadas', 'Agenda un examen o un control en casa', 'P06', '']] },
  nuevo: { pk: [], prox: [['calendar-blank', 'Sin visitas agendadas', 'Agenda una atención o un examen en casa', 'P06', '']] },
};
const msTrend = k => { const b = BIOM[k], v = bval(k), p = prevL(b);
  return `<button class="mstr" data-act="bm" data-arg="${k}" data-go="P71"><span class="tx"><b>${b.n}</b><span class="sm t2"><b class="num">${nf(v, b.d)}</b> ${b.u}${p ? ` · ${v < p[1] ? '↓' : v > p[1] ? '↑' : '='} desde ${nf(p[1], b.d)} (${p[0]})` : ''}</span><span class="msst sem-t-${bsem(k)}">${bst(k) === 'crit' ? 'Consulta a un médico' : SEMT[bsem(k)][0]}</span></span>${spark(k)}${ic('caret-right')}</button>`; };
Object.assign(ACT, { msFm: k => { S.fm = k; } });
const msIsa = (k, full) => { const p = S.pv[k] || {}, l = isaOf(k), f = FAM[k];
  if (l) return `<div class="isac on mt12" role="button" data-act="lkW" data-arg="${k}" data-go="P82"><span class="ri box">${ic('link')}</span><span class="tx"><b>${full ? f.c + ' · ' : ''}${l.is} · vinculada</b><span class="xs t2">Última vez usada ${l.ult || 'aún no se ha usado'}${carOk(k) ? '' : ' · falta el carnet'}</span></span><span class="isa-end">${st('ok', 'Activa')}<button class="lk sm" data-act="lkDel" data-arg="${k}" data-go="P82">Borrar clave</button></span></div>`;
  if (p.t === 'fonasa') return `<div class="isac mt12"><span class="ri box">${ic('shield-check')}</span><span class="tx"><b>${f.c} es de Fonasa ${p.tr ? 'tramo ' + p.tr : ''}</b><span class="xs t2">Descarga los documentos para su reembolso. ¿Se cambió a Isapre? Cambia su previsión.</span></span><button class="pill" data-act="pvFor" data-arg="${k}" data-go="P64">Cambiar</button></div>`;
  if (p.t !== 'isapre') return `<div class="isac mt12"><span class="ri box">${ic('shield-check')}</span><span class="tx"><b>${f.c} es particular</b><span class="xs t2">Sin reembolso de Isapre. Descarga la boleta si la necesitas.</span></span><button class="pill" data-act="pvFor" data-arg="${k}" data-go="P64">Cambiar</button></div>`;
  return `<div class="isac mt12"><span class="ri box">${ic('link')}</span><span class="tx"><b>Vincula la Isapre de ${f.c}${p.is ? ' · ' + p.is : ''}</b><span class="xs t2">Con su RUT y clave presentamos sus reembolsos al terminar cada atención</span></span><button class="btn sm2" data-act="lkW" data-arg="${k}" data-go="P78">Vincular</button></div>`; };
def({ id: 'P93', name: 'Mi salud', kind: 'page', tab: 'salud', next: ['P70', 'P71', 'P74', 'P75', 'P77', 'P51', 'P52', 'P55', 'P59', 'P80', 'P81', 'P26', 'P78', 'P82', 'P65', 'P96', 'P57', 'P64', 'P94'],
  body: () => { if (!S.msSeen) { S.msSeen = 1; S.fm = 'yo'; } const k = fmk(), f = FAM[k]; bapply(); const x = MSX[k] || MSX.nuevo, hasRes = BKEYS.length > 0, out = outK(), rbs = RBS().filter(r => r.w === k);
    const res = hasRes ? `<div class="msc"><div class="msc-h"><div><b>Exámenes del 24 oct</b><span class="xs t2">${BKEYS.length} biomarcadores · Paula Godoy · datos de ejemplo</span></div><button class="lk sm" data-go="P70">Ver todos</button></div>
      ${semCnt()}${out.length ? `<div class="mstl mt12">${out.slice(0, 3).map(msTrend).join('')}</div>` : `<div class="sm t2 mt12">Todo está en rango.</div>`}</div>`
      : `<div class="msc ms-e"><span class="ri box">${ic('chart-line-up')}</span><div><b>Aún no hay exámenes de ${f.c}</b><div class="sm t2 mt4">Cuando estén los resultados vas a ver aquí cómo cambian en el tiempo.</div><button class="lk sm mt8" data-go="P74">Ver packs de exámenes</button></div></div>`;
    return `<h1 class="h-xl mt8">Mi salud</h1><div class="t2 sm mt4">Una ficha por integrante: datos, resultados, previsión y reembolsos.</div>
    <div class="pers sc mt16" role="tablist">${S.mem.map(w => `<button class="${w === k ? 'on' : ''}" data-act="msFm" data-arg="${w}" role="tab" aria-selected="${w === k}">${av(FAM[w].i, 's')}<span>${w === 'yo' ? 'Yo' : FAM[w].c}</span></button>`).join('')}<button class="padd" data-act="nmNew" data-go="P57" aria-label="Agregar integrante">${ic('plus')}</button></div>
    <button class="memh mt16" data-go="P96" data-act="fm" data-arg="${k}">${av(f.i, 'l')}<span class="tx"><b>${f.n}</b><span class="xs t2">${f.r === 'tú' ? 'Titular' : f.r.replace(/^./, c => c.toUpperCase())} · ${f.e} años · ${f.sx === 'F' ? 'Mujer' : 'Hombre'} · RUT ${RUTS[k]}</span><span class="xs t2">${pvTxt(k)}${f.peso && f.alt ? ' · IMC ' + imcTxt(f) : ''}</span></span><span class="lk sm">Datos</span></button>
    <div class="mt12">${pinAl(f)}</div>
    <div class="lbl2">Previsión y reembolsos</div>${row('box:shield-check', 'Previsión de ' + f.c, pvTxt(k), 'P64', '<span class="lk">Cambiar</span>', '', 'pvFor', k)}${(S.pv[k] || {}).t === 'isapre' ? row('box:identification-card', 'Carnet de ' + f.c, carOk(k) ? 'Subido por ambos lados' : 'Falta para el reembolso', 'P94', carOk(k) ? st('ok', 'Listo') : '<span class="lk">Subir</span>', '', 'carFor', k) : ''}
    ${msIsa(k)}
    <div class="lbl2">Últimos resultados</div>${res}
    <div class="lbl2">Próximos y recordatorios</div>${x.prox.map(p => row('box:' + p[0], p[1], p[2], p[3], p[4] ? st('ok', p[4]) : '', '', p[3] === 'P51' ? 'fm' : p[3] === 'P75' ? 'pk' : '', p[3] === 'P51' ? k : p[3] === 'P75' ? 'pre' : '')).join('')}
    ${x.pk.length ? `<div class="shd mt24"><h3>Chequeos sugeridos</h3><button class="lk sm" data-go="P74">Ver packs</button></div><div class="pkl2">${x.pk.map(id => pkCard(pkOf(id), 1)).join('')}</div>` : ''}
    <div class="lbl2">Ficha y documentos</div>${row('box:notebook', 'Ficha de salud', f.dx[0], 'P51', '', '', 'fm', k)}${row('box:heartbeat', 'Antecedentes, peso y estatura', f.cron && f.cron.length || f.ale || f.med || f.peso ? 'Completados' : 'Opcional · mejora tus resultados', 'P96', '', '', 'fm', k)}${row('box:list', 'Línea de tiempo', k === 'mama' ? '9 registros · última nota hoy' : k === 'papa' ? '3 registros · última nota 21 oct' : 'Sin registros todavía', 'P52', '', '', 'fm', k)}${hasRes ? row('box:file-pdf', 'Informe del laboratorio', `Resultados ${f.c} 24 oct · PDF`, '', ic('download-simple'), '', 'toast', `Descargado: Resultados-${f.c}-24-10-2026.pdf`) : ''}${row('box:file-pdf', 'Ficha en PDF', 'Para llevarla al médico', 'P59', '', '', 'fm', k)}
    <div class="lbl2">Reembolsos</div>${rbs.length ? rbs.map(r => row('box:receipt', r.svc, `${r.f} · ${clp(r.m)}`, 'P81', rbChip(r.st), '', 'rb', r.id)).join('') : row('box:receipt', 'Sin reembolsos en curso', S.pv[k] && S.pv[k].t === 'isapre' ? 'Los presentamos cuando vinculas su Isapre' : pvTxt(k), 'P80', '<span class="lk">Ver todos</span>')}
    <div class="lbl2">Privacidad</div>${row('box:eye', 'Quién vio la ficha', k === 'mama' ? 'Último acceso hoy 08:41 · Camila' : 'Registro de accesos', 'P55', '', '', 'fm', k)}
    <div class="mt16">${note('info', 'Esto no es un diagnóstico y no reemplaza a un médico. Conversa tus resultados con tu médico tratante.')}</div>`; } });

/* ===================================================================================================
   Una ficha por integrante: datos (fecha de nacimiento, sexo al nacer, celular), antecedentes, peso y estatura,
   previsión propia, agregar integrante y varias personas en una misma visita de exámenes.
   Todas las personas y datos son ficticios.
   =================================================================================================== */
Object.assign(FAM.yo, { nac: '1989-03-14', sx: 'F', par: 'Titular', cel: '+56 9 8123 4567', wa: true, cron: [], ale: '', med: '', peso: '62', alt: '165' });
Object.assign(FAM.mama, { nac: '1948-06-02', sx: 'F', par: 'Mamá', cel: '', wa: false, cron: ['Hipertensión', 'Diabetes'], ale: 'Penicilina', med: 'Losartán, metformina', peso: '', alt: '' });
Object.assign(FAM.papa, { nac: '1946-09-11', sx: 'M', par: 'Papá', cel: '', wa: false, cron: ['Hipertensión'], ale: '', med: 'Amlodipino, enoxaparina', peso: '', alt: '' });
FAM.tomas = { n: 'Tomás Fuentes Muñoz', c: 'Tomás', r: 'hijo', i: '+TF', e: 8, al: ['Sin alergias conocidas'], dx: ['Sin diagnósticos crónicos'], meds: [], dev: [], barthel: 100, braden: 23, nac: '2018-05-20', sx: 'M', par: 'Hijo', cel: '', wa: false, cron: [], ale: '', med: '', peso: '27', alt: '128' };
RUTS.tomas = rut(25512390);
const NOW = new Date(2026, 9, 26);
const ageOf = nac => { const d = new Date(nac + 'T00:00:00'); if (!nac || isNaN(d)) return null; let a = NOW.getFullYear() - d.getFullYear(); if (NOW.getMonth() < d.getMonth() || (NOW.getMonth() === d.getMonth() && NOW.getDate() < d.getDate())) a--; return a; };
const ageTxt = nac => { const a = ageOf(nac); return a == null || a < 0 || a > 120 ? '—' : a < 1 ? 'Menos de 1 año' : a + (a === 1 ? ' año' : ' años'); };
const rutOk = r => { const t = String(r || '').replace(/[.\s]/g, '').toUpperCase(), m = t.match(/^(\d{7,8})-?([\dK])$/); return !!m && rutDV(m[1]) === m[2]; };
const fmtRut = r => { const t = String(r).replace(/[.\s-]/g, '').toUpperCase(); return Number(t.slice(0, -1)).toLocaleString('es-CL') + '-' + t.slice(-1); };
const imcTxt = o => { const p = parseFloat(String(o.peso).replace(',', '.')), a = parseFloat(String(o.alt).replace(',', '.')) / 100; return p > 0 && a > 0.3 ? nf(p / (a * a), 1) + ' kg/m²' : '—'; };
const finp = (m, f, v, ph = '', o = {}) => `<label class="field fin">${o.i ? ic(o.i) : ''}<input data-m="${m}" data-f="${f}" type="${o.t || 'text'}" value="${String(v || '').replace(/"/g, '&quot;')}" placeholder="${ph}" ${o.x || 'autocomplete="off"'}>${o.u ? `<span class="fu">${o.u}</span>` : ''}</label>`;
const ftgt = m => m === '_lk' ? S.lk : m === '_nm' ? S.nm : FAM[m];
const nmOk = () => { const n = S.nm || {}, a = ageOf(n.nac); return !!(n.n && n.n.trim().split(/\s+/).length >= 2 && rutOk(n.rut) && a != null && a >= 0 && a <= 120 && n.sx && n.par && n.pvt && (n.pvt !== 'isapre' || n.pvis) && (n.pvt !== 'fonasa' || n.pvtr) && n.chk); };
const fLive = m => { const o = ftgt(m) || {};
  document.querySelectorAll('[data-live]').forEach(el => { const k = el.dataset.live;
    if (k === 'age') el.textContent = ageTxt(o.nac); else if (k === 'imc') el.textContent = imcTxt(o);
    else if (k === 'rutok') el.innerHTML = !o.rut ? '' : rutOk(o.rut) ? ic('check-circle', 1) + ' RUT válido' : 'Revisa el RUT'; });
  document.querySelectorAll('[data-chk="nm"]').forEach(b => b.disabled = !nmOk());
  document.querySelectorAll('[data-chk="cl"]').forEach(b => b.disabled = !S.lk.cl); };
/* los datos escritos se guardan en el estado; la clave de la Isapre NUNCA: solo se marca que se ingresó */
document.addEventListener('input', e => { const el = e.target.closest ? e.target.closest('input[data-f]') : null; if (!el) return; const o = ftgt(el.dataset.m); if (!o) return; const f = el.dataset.f;
  if (f === 'clave') S.lk.cl = el.value.length > 0; else { o[f] = el.value; if (f === 'nac' && el.dataset.m !== '_nm') o.e = ageOf(o.nac); }
  fLive(el.dataset.m); });
Object.assign(ACT, {
  fv: a => { const [m, f, v] = a.split('|'), o = ftgt(m); o[f] = v; if (f === 'sx' && m !== '_nm') o.sx = v; },
  ftog: a => { const [m, f] = a.split('|'), o = ftgt(m); o[f] = !o[f]; },
  cronT: a => { const [m, v] = a.split('|'), o = ftgt(m); o.cron = o.cron || []; o.cron = o.cron.includes(v) ? o.cron.filter(x => x !== v) : [...o.cron, v]; FAM[m] && (FAM[m].dx = o.cron.length ? o.cron : ['Sin diagnósticos crónicos']); },
  nmNew: () => { S.nm = {}; },
  nmSet: a => { const [f, ...v] = a.split('|'); S.nm[f] = v.join('|'); },
  nmChk: () => { S.nm.chk = !S.nm.chk; },
  nmAdd: () => { const n = S.nm, key = 'm' + (S.mem.length + 1), nm = n.n.trim().replace(/\s+/g, ' '), pt = nm.split(' ');
    FAM[key] = { n: nm, c: pt[0], r: (n.par || 'otro').toLowerCase(), i: '+' + pt[0][0].toUpperCase(), e: ageOf(n.nac), al: ['Sin alergias conocidas'], dx: ['Sin diagnósticos crónicos'], meds: [], dev: [], barthel: 100, braden: 23, nac: n.nac, sx: n.sx, par: n.par, cel: '', wa: false, cron: [], ale: '', med: '', peso: '', alt: '' };
    RUTS[key] = fmtRut(n.rut); S.pv[key] = { t: n.pvt, tr: n.pvtr || '', is: n.pvis || '' }; S.mem.push(key); S.fm = key; S.nm = {}; toast(`${pt[0]} ya está en tu familia. Puedes completar sus datos de salud.`); },
  prepOk: () => { S.prepOk = !S.prepOk; },
  emb: a => { const [w, v] = a.split('|'); S.emb[w] = v; },
  coTog: w => { S.co = S.co || []; S.co = S.co.includes(w) ? S.co.filter(x => x !== w) : [...S.co, w]; S.exCo = S.exCo || {}; S.exCo[w] = S.exCo[w] || {}; },
  coFor: w => { S.coFor = w; },
  coEx: k => { S.exCo = S.exCo || {}; const w = S.coFor; S.exCo[w] = S.exCo[w] || {}; S.exCo[w][k] = !S.exCo[w][k]; },
  coCopy: () => { S.exCo = S.exCo || {}; S.exCo[S.coFor] = { ...S.exams }; toast(`Mismos exámenes que ${FAM[S.who].c}.`); },
});
const noRes = () => `<div class="msc ms-e"><span class="ri box">${ic('chart-line-up')}</span><div><b>Aún no hay exámenes de ${FAM[fmk()].c}</b><div class="sm t2 mt4">Cuando estén los resultados vas a ver aquí cada marcador en verde, amarillo o rojo.</div><button class="lk sm mt8" data-go="P74">Ver packs de exámenes</button></div></div>`;
const semExp = k => { const b = BIOM[k], v = bval(k), s = bsem(k), c = bst(k), p = prevL(b), f = FAM[fmk()], val = `<b>${nf(v, b.d)} ${b.u}</b>`;
  const t = c === 'crit' ? `Tu valor, ${val}, está muy alterado. <b>Consulta a un médico hoy.</b>` : s === 'g' ? `Tu valor, ${val}, está dentro del rango.` : s === 'y' ? `Tu valor, ${val}, está ${c === 'hi' ? 'un poco sobre' : 'un poco bajo'} el rango. Está en el límite: conviene comentarlo en tu próximo control.` : `Tu valor, ${val}, está ${c === 'lo' ? 'bajo' : 'sobre'} el rango. <b>Consulta a un médico</b> para que lo interprete.`;
  return `<div class="lbl2">Tu resultado</div><div class="semx sem-${s}">${bchip(k)}<div class="sm mt8">${t}${p ? ` El ${p[0]} fue ${nf(p[1], b.d)} ${b.u}.` : ''}</div><div class="xs t2 mt8">Rango de referencia para ${refTxt(f)}: ${brng(b)}. Rango de ejemplo; el laboratorio entrega el oficial por sexo y edad.</div></div>`; };

/* ---------- P96 · Ficha del integrante: datos, antecedentes, peso y estatura ---------- */
const CRONL = ['Hipertensión', 'Diabetes', 'Hipotiroidismo', 'Asma', 'Colesterol alto', 'Enfermedad renal'];
def({ id: 'P96', name: 'Datos de salud del integrante', kind: 'page', back: true, get title() { return FAM[fmk()].c; }, next: ['P64', 'P94', 'P82', 'P78', 'P70'],
  body: () => { const k = fmk(), f = FAM[k];
    return `<div class="fhead">${av(f.i, 'l')}<div><div class="h-l">${f.n}</div><div class="t2 sm mt4">${k === 'yo' ? 'Titular' : f.par || f.r} · RUT ${RUTS[k]}</div></div></div>
    <div class="lbl2">Datos</div>
    ${lbl('Fecha de nacimiento')}${finp(k, 'nac', f.nac, '', { t: 'date', i: 'calendar-blank' })}<div class="xs t2 mt4">Edad: <b data-live="age">${ageTxt(f.nac)}</b></div>
    ${lbl('Sexo al nacer')}<div class="chips">${chip('Mujer', f.sx === 'F', 'fv', k + '|sx|F')}${chip('Hombre', f.sx === 'M', 'fv', k + '|sx|M')}</div><div class="xs t3 mt4">Lo usamos para mostrar los rangos de referencia correctos en los resultados.</div>
    ${lbl('Celular de contacto')}${finp(k, 'cel', f.cel, '+56 9 1234 5678', { t: 'tel', i: 'device-mobile' })}
    ${checkRow('Quiero recibir los resultados por WhatsApp', f.wa, 'ftog', k + '|wa', 'Te avisamos cuando estén listos. El aviso no incluye valores')}
    <div class="lbl2">Previsión y carnet</div>${row('box:shield-check', 'Previsión', pvTxt(k), 'P64', '<span class="lk">Cambiar</span>', '', 'pvFor', k)}${(S.pv[k] || {}).t === 'isapre' ? row('box:identification-card', 'Carnet', carOk(k) ? 'Subido por ambos lados' : 'Falta para el reembolso', 'P94', carOk(k) ? st('ok', 'Listo') : '<span class="lk">Subir</span>', '', 'carFor', k) : ''}${msIsa(k)}
    <div class="lbl2">Antecedentes <span class="t3">· opcional</span></div><div class="xs t2">Enfermedades crónicas</div><div class="chips mt8">${CRONL.map(c => chip(c, (f.cron || []).includes(c), 'cronT', k + '|' + c)).join('')}</div>
    ${lbl('Alergias')}${finp(k, 'ale', f.ale, 'Ej.: penicilina, látex', { i: 'warning' })}
    ${lbl('Medicamentos que toma')}${finp(k, 'med', f.med, 'Ej.: losartán 50 mg', { i: 'pill' })}
    <div class="lbl2">Peso y estatura <span class="t3">· opcional</span></div>
    <div class="row8">${finp(k, 'peso', f.peso, '62', { t: 'text', x: 'inputmode="decimal" autocomplete="off"', u: 'kg' })}${finp(k, 'alt', f.alt, '165', { t: 'text', x: 'inputmode="decimal" autocomplete="off"', u: 'cm' })}</div>
    <div class="xs t2 mt8">IMC: <b data-live="imc">${imcTxt(f)}</b> · es solo una referencia, no un diagnóstico.</div>
    <div class="mt16">${note('lock-simple', 'Estos datos son de ' + f.c + ' y solo los ven las profesionales que agendas, cuando los necesitan para atenderle. Los puedes cambiar o borrar cuando quieras.')}</div>`; },
  foot: () => btn('Listo', 'back') });

/* ---------- P57 · Agregar integrante (reemplaza la ficha solo de consentimiento) ---------- */
const PARL = ['Mamá', 'Papá', 'Hijo/a', 'Pareja', 'Abuelo/a', 'Hermano/a', 'Otro'];
def({ id: 'P57', name: 'Agregar integrante', kind: 'page', back: true, title: 'Agregar integrante', next: ['P96'],
  body: () => { const n = S.nm || {}, a = ageOf(n.nac), men = a != null && a < 18;
    return `<div class="sm t2">Cada integrante tiene su ficha, su previsión y sus resultados. Pídelos una vez.</div>
    ${lbl('Nombre y apellidos')}${finp('_nm', 'n', n.n, 'Ej.: Camilo Soto Pérez', { i: 'user' })}
    ${lbl('RUT')}${finp('_nm', 'rut', n.rut, '12.345.678-5', { i: 'identification-card' })}<div class="xs t2 mt4" data-live="rutok">${!n.rut ? '' : rutOk(n.rut) ? ic('check-circle', 1) + ' RUT válido' : 'Revisa el RUT'}</div>
    ${lbl('Fecha de nacimiento')}${finp('_nm', 'nac', n.nac, '', { t: 'date', i: 'calendar-blank' })}<div class="xs t2 mt4">Edad: <b data-live="age">${ageTxt(n.nac)}</b></div>
    ${lbl('Sexo al nacer')}<div class="chips">${chip('Mujer', n.sx === 'F', 'nmSet', 'sx|F')}${chip('Hombre', n.sx === 'M', 'nmSet', 'sx|M')}</div>
    ${lbl('Parentesco')}<div class="chips">${PARL.map(p => chip(p, n.par === p, 'nmSet', 'par|' + p)).join('')}</div>
    ${lbl('Previsión de salud')}<div class="chips">${[['fonasa', 'Fonasa'], ['isapre', 'Isapre'], ['part', 'Particular']].map(t => chip(t[1], n.pvt === t[0], 'nmSet', 'pvt|' + t[0])).join('')}</div>
    ${n.pvt === 'fonasa' ? `<div class="chips mt8">${['A', 'B', 'C', 'D'].map(t => chip('Tramo ' + t, n.pvtr === t, 'nmSet', 'pvtr|' + t)).join('')}</div>` : n.pvt === 'isapre' ? `<div class="chips mt8">${ISAPRES.map(t => chip(t, n.pvis === t, 'nmSet', 'pvis|' + t)).join('')}</div>` : ''}
    <div class="xs t3 mt4">Cada integrante puede tener una previsión distinta.</div>
    <div class="mt16">${checkRow(men ? 'Soy su madre, padre o tutor y acepto que Cuidapp guarde sus datos de salud para coordinar la atención' : 'Acepto que Cuidapp guarde estos datos de salud para coordinar la atención', n.chk, 'nmChk', '', 'Solo la ven las profesionales que agendas. Puedo retirar el consentimiento cuando quiera')}</div>`; },
  foot: () => `<button class="btn" data-act="nmAdd" data-go="P96" data-chk="nm" ${nmOk() ? '' : 'disabled'}>Agregar integrante</button>` });

/* ---------- P98 / P99 · Varias personas en una misma visita de exámenes ---------- */
def({ id: 'P98', name: 'Personas en la visita de exámenes', kind: 'page', back: true, title: 'Personas en la visita', next: ['P99', 'P57'],
  body: () => `<div class="sm t2">La profesional toma las muestras de todas en una sola visita. Los exámenes se cobran por persona y la toma a domicilio se cobra <b>una sola vez</b> por visita.</div>
  <div class="lbl2">Paciente principal</div>${row('box:user', whoTxt(), FAM[S.who].e + ' años · ' + nEx(), 'P40', '<span class="lk">Exámenes</span>')}
  <div class="lbl2">Agregar a la visita</div>${S.mem.filter(w => w !== S.who).map(w => checkRow(whoTxt(w), (S.co || []).includes(w), 'coTog', w, `${FAM[w].e} años · ${pvTxt(w)}${(S.co || []).includes(w) ? ' · ' + (coEx(w).length ? coEx(w).length + (coEx(w).length === 1 ? ' examen · ' : ' exámenes · ') + clp(coGross(w)) : 'sin exámenes aún') : ''}`)).join('')}
  ${row('box:plus', 'Agregar un integrante nuevo', 'Nombre, RUT, nacimiento, sexo y previsión', 'P57', '', '', 'nmNew', '')}
  ${coKeys().length ? `<div class="lbl2">Exámenes de cada persona</div>${coKeys().map(w => row('box:test-tube', FAM[w].c, coEx(w).length ? coEx(w).length + (coEx(w).length === 1 ? ' examen · ' : ' exámenes · ') + clp(coGross(w)) : 'Elige sus exámenes', 'P99', '<span class="lk">Elegir</span>', '', 'coFor', w)).join('')}` : ''}
  <div class="mt16">${note('info', 'Cada persona lleva su boleta y sus documentos de reembolso, con su RUT y su previsión.')}</div>`,
  foot: () => btn('Listo', 'back') });
def({ id: 'P99', name: 'Exámenes de otra persona', kind: 'page', back: true, get title() { return 'Exámenes de ' + FAM[S.coFor || (coKeys()[0] || 'yo')].c; }, next: ['P98'],
  body: () => { const w = S.coFor || coKeys()[0] || 'yo'; S.coFor = w; const ex = (S.exCo || {})[w] || {};
    return `<div class="sm t2">Los más pedidos. ${FAM[w].c} · ${FAM[w].e} años · ${pvTxt(w)}</div>
    ${examKeys().length ? `<button class="btn sec sm mt12" data-act="coCopy">${ic('copy')}Mismos exámenes que ${FAM[S.who].c}</button>` : ''}
    <div class="exl mt12">${EXPOP.filter(k => EXAMS[k]).map(k => `<button class="exr" data-act="coEx" data-arg="${k}"><span class="check ${ex[k] ? 'on' : ''}">${ex[k] ? ic('check', 0).replace('ph ', 'ph-bold ') : ''}</span><span class="tx"><span class="a">${EXAMS[k][0]}</span><span class="b">${exSub(k)}</span></span><span class="exp"><span class="pp num">${clp(EXAMS[k][1])}</span></span></button>`).join('')}</div>
    <div class="mt12">${kv('Exámenes de ' + FAM[w].c, clp(coGross(w)))}</div><div class="xs t2 mt4">La toma a domicilio no se cobra de nuevo. En el prototipo se muestran los exámenes más pedidos.</div>`; },
  foot: () => btn('Listo', 'P98') });

/* ---------- Admin · registro de usos de la clave de Isapre (sin claves) ---------- */
const ISALOG0 = [['26 oct · 09:20', 'Daniela F.', 'Banmédica', 'Ingreso para presentar reembolso (Vitamina D)', 'Solicitud presentada'], ['24 oct · 18:02', 'Luis F.', 'Colmena', 'Consulta de estado de reembolso', 'Estado: en revisión'], ['19 oct · 10:41', 'Daniela F.', 'Banmédica', 'Ingreso para presentar reembolso (B12 inyectable)', 'Isapre pidió orden médica'], ['12 oct · 08:15', 'Luis F.', 'Colmena', 'Ingreso para presentar reembolso (Curación)', 'Solicitud presentada'], ['3 oct · 12:30', 'Daniela F.', 'Banmédica', 'Clave guardada cifrada', 'Autorizada por la usuaria']];
def({ id: 'A15', name: 'Registro de reembolsos', kind: 'adm', side: 'rbl', next: ['A16'],
  body: () => { const dyn = (S.isaLog || []).map(l => [l.f, FAM[l.w].c, l.is, l.a, l.r]), all = [...dyn, ...ISALOG0];
    return `<div class="ahd"><div><h1 class="h-xl">Registro de reembolsos</h1><div class="t2 sm mt4">Cada vez que el proceso de reembolsos usa la clave de una Isapre. Las claves no se muestran en ninguna parte: están cifradas y nadie del equipo puede verlas.</div></div></div>
    <div class="kpis mt16">${[[Object.keys(S.isa).length + 12, 'Claves guardadas (cifradas)'], [all.length + 31, 'Usos esta semana'], [all.filter(l => /borrada/i.test(l[3])).length + 2, 'Borradas por usuarias'], [2, 'Ingresos fallidos']].map(t => `<div class="kpi"><b class="num">${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div>
    <table class="t mt16"><tr><th>Fecha</th><th>Paciente</th><th>Isapre</th><th>Qué hizo el proceso</th><th>Resultado</th><th>Clave</th></tr>
    ${all.map(l => `<tr><td>${l[0]}</td><td>${l[1]}</td><td>${l[2]}</td><td>${l[3]}</td><td>${l[4]}</td><td class="t3">•••••••• cifrada</td></tr>`).join('')}</table>
    <div class="xs t3 mt12">Sin contraseñas: el registro solo guarda cuándo se usó la clave, para qué y con qué resultado.</div>`; } });

/* ---------- Preparación (ayuno) y pregunta de embarazo, solo cuando corresponde ---------- */
const needPrep = () => S.item === 'mue' && !byOrder() && ayAgg(allExKeys()).h > 0;
const prepChk = () => needPrep() ? `<div class="mt12">${checkRow('Entendí la preparación', S.prepOk, 'prepOk', '', `${ayAgg(allExKeys()).txt}: solo agua, sin comer ni beber otra cosa. Agenda temprano en la mañana`)}</div>` : '';
const EMBX = k => /gonadotrofina|embarazada|estriol/i.test(EXAMS[k][0]);
const embQ = () => { if (byOrder()) return ''; const L = [[S.who, examKeys()], ...coKeys().map(k => [k, coEx(k)])].filter(([w, ks]) => FAM[w].sx === 'F' && FAM[w].e >= 12 && FAM[w].e <= 55 && ks.some(EMBX));
  return L.map(([w, ks]) => `<div class="lbl2">Una pregunta para ${FAM[w].c} <span class="t3">· opcional</span></div><div class="sm t2">Te la hacemos porque pediste: ${ks.filter(EMBX).map(k => EXAMS[k][0].split(',')[0]).join(', ')}.</div>
  <div class="chips mt8">${[['si', w === 'yo' ? 'Sí, estoy embarazada' : 'Sí, está embarazada'], ['no', 'No'], ['nd', 'Prefiero no decir']].map(t => chip(t[1], (S.emb || {})[w] === t[0], 'emb', w + '|' + t[0])).join('')}</div>`).join(''); };

/* ===================================================================================================
   Boletas: quién emite qué (modelo definido por Jacob, 26 oct 2026)
   · Exámenes: el LABORATORIO emite su boleta al paciente (nombre y RUT) por lo que cobra; esa es la que se usa para el reembolso de la Isapre.
     Cuidapp emite su propia boleta solo por su parte (recargo y costo por servicio).
   · Servicios: la profesional emite su boleta de honorarios al paciente por su monto y Cuidapp emite la suya por su parte.
     Cómo se emite la boleta de honorarios: por definir; en el prototipo se dice «se emite automáticamente» (copy neutro).
   · La boleta del laboratorio llega por correo al buzón boletas@cuidapp.io (dirección propuesta): el sistema la lee, la cruza con el pedido
     (RUT del paciente o n.º de pedido) y la adjunta. Si no se puede, el equipo la adjunta a mano.
   · Solo la boleta de honorarios y la de Cuidapp son automáticas.
   El paciente ve el nombre de cada documento y su estado, no el desglose entre laboratorio, profesional y Cuidapp.
   =================================================================================================== */
const BOLMAIL = 'boletas@cuidapp.io';
const svcTot = base => Math.round(base * (100 + S.svcP) / 100 / 10) * 10;
const BOL0 = () => [
  { id: 'CU-1042', f: '26 oct', w: 'yo', tipo: 'ex', d: 'Exámenes · hemograma, perfil lipídico, TSH', tot: 52600, lab: 33400, pro: 9400, pn: 'Camila Rojas', st: { lab: 'pend', bhe: 'pend', cu: 'pend' } },
  { id: 'CU-1041', f: '26 oct', w: 'yo', tipo: 'sv', d: 'Inyección intramuscular', tot: svcTot(14990), lab: 0, pro: net(14990), pn: 'Camila Rojas', st: { bhe: 'pend', cu: 'pend' } },
  { id: 'CU-1040', f: '25 oct', w: 'papa', tipo: 'sv', d: 'Curación simple', tot: svcTot(20000), lab: 0, pro: net(20000), pn: 'Jorge Tapia', st: { bhe: 'emi', cu: 'pend' } },
  { id: 'CU-1039', f: '24 oct', w: 'mama', tipo: 'ex', d: 'Exámenes · hemoglobina glicosilada, creatinina', tot: 31400, lab: 20800, pro: 6000, pn: 'Paula Godoy', st: { lab: 'rec', labsrc: 'correo', bhe: 'emi', cu: 'emi' } },
  { id: 'CU-1038', f: '23 oct', w: 'yo', tipo: 'ex', d: 'Exámenes · vitamina D', tot: 28600, lab: 18100, pro: 6200, pn: 'Paula Godoy', st: { lab: 'rec', labsrc: 'correo', bhe: 'fail', cu: 'pend' } },
  { id: 'CU-1037', f: '22 oct', w: 'papa', tipo: 'sv', d: 'Cuidadora por turno · 8 h', tot: svcTot(40000), lab: 0, pro: net(40000), pn: 'Carmen Vera', st: { bhe: 'emi', cu: 'emi' } },
];
const bolO = o => ({ ...o, st: { ...o.st, ...((S.bolO || {})[o.id] || {}) } });
const BOLS = () => BOL0().map(bolO);
const bolCu = o => o.tot - o.lab - o.pro;
const bolNeto = o => Math.round(bolCu(o) / 1.19);
const bolSet = (id, k, v, x) => { S.bolO = S.bolO || {}; S.bolO[id] = { ...(S.bolO[id] || {}), [k]: v, ...(x || {}) }; };
Object.assign(ACT, {
  bolSel: id => { S.bolSel = S.bolSel || {}; S.bolSel[id] = !S.bolSel[id]; },
  bolSelAll: () => { S.bolSel = {}; BOLS().filter(o => o.st.cu === 'pend').forEach(o => S.bolSel[o.id] = true); },
  bolCu: id => { bolSet(id, 'cu', 'emi'); toast(`Boleta Cuidapp emitida y enviada al correo del paciente (${id}).`); },
  bolCuSel: () => { const ids = Object.keys(S.bolSel || {}).filter(i => S.bolSel[i]); ids.forEach(i => bolSet(i, 'cu', 'emi')); S.bolSel = {}; toast(ids.length ? `${ids.length} boletas Cuidapp emitidas.` : 'Selecciona al menos un pedido.'); },
  bolBhe: id => { bolSet(id, 'bhe', 'emi'); toast(`Boleta de honorarios emitida a nombre del paciente (${id}).`); },
  bolAdj: id => { bolSet(id, 'lab', 'rec', { labsrc: 'manual' }); toast(`Boleta del laboratorio adjuntada a mano (${id}). El paciente ya la ve.`); },
  bolMail: () => { BOLS().filter(o => o.tipo === 'ex' && o.st.lab === 'pend').forEach(o => bolSet(o.id, 'lab', 'rec', { labsrc: 'correo' })); toast('Llegó el correo del laboratorio: boletas cruzadas por RUT y adjuntadas.'); },
});
const bolChip = (k, v, src) => k === 'lab' ? (v === 'rec' ? st('ok', src === 'manual' ? 'Adjuntada a mano' : 'Recibida por correo', 'check-circle') : st('warn', 'Pendiente', 'clock')) : k === 'bhe' ? (v === 'emi' ? st('ok', 'Emitida', 'check-circle') : v === 'fail' ? st('bad', 'Falló la emisión', 'warning') : st('warn', 'Pendiente', 'clock')) : (v === 'emi' ? st('ok', 'Emitida', 'check-circle') : st('warn', 'Pendiente', 'clock'));
def({ id: 'A16', name: 'Boletas por emitir', kind: 'adm', side: 'bol', next: ['A15', 'A13'],
  body: () => { const L = BOLS(), sel = S.bolSel || {}, nSel = Object.keys(sel).filter(i => sel[i]).length;
    const cuP = L.filter(o => o.st.cu === 'pend').length, bhP = L.filter(o => o.st.bhe !== 'emi').length, lbP = L.filter(o => o.tipo === 'ex' && o.st.lab === 'pend').length, em = L.filter(o => o.st.cu === 'emi').length;
    return `<div class="ahd"><div><h1 class="h-xl">Boletas por emitir</h1><div class="t2 sm mt4">Cada pedido genera hasta tres documentos. El laboratorio emite el suyo por lo que cobra, la profesional emite su boleta de honorarios por su monto y Cuidapp emite solo la suya, por su parte.</div></div>
    <div class="row8"><button class="pill" data-act="bolSelAll">Seleccionar pendientes</button><button class="pill dark" data-act="bolCuSel" ${nSel ? '' : 'disabled'}>Emitir boleta Cuidapp${nSel ? ' (' + nSel + ')' : ' a la selección'}</button></div></div>
    <div class="kpis mt16">${[[cuP, 'Boletas Cuidapp por emitir'], [bhP, 'Boletas de honorarios pendientes o con falla'], [lbP, 'Boletas de laboratorio por recibir'], [em, 'Boletas Cuidapp emitidas']].map(t => `<div class="kpi"><b class="num">${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div>
    <div class="mt16">${note('envelope-simple', `Los laboratorios envían su boleta a <b>${BOLMAIL}</b> (dirección propuesta). El sistema lee el correo, la cruza con el pedido por el RUT del paciente o el n.º de pedido y la adjunta aquí. Si no la reconoce, la adjuntas a mano. El paciente la ve en su pedido cuando llega. <button class="lk sm" data-act="bolMail">Simular llegada de correos (prototipo)</button>`)}</div>
    <div class="mt16">${L.map(o => `<div class="bolc"><div class="bolh">${o.st.cu === 'pend' ? `<button class="check ${sel[o.id] ? 'on' : ''}" data-act="bolSel" data-arg="${o.id}" aria-label="Seleccionar ${o.id}">${sel[o.id] ? ic('check', 0).replace('ph ', 'ph-bold ') : ''}</button>` : '<span class="bsp"></span>'}
      <div class="bti"><b>${o.id}</b> <span class="t2 sm">· ${o.f} · ${o.d}</span><div class="xs t2">${FAM[o.w].n} · RUT ${RUTS[o.w]}</div></div><div class="btot"><span class="xs t2">Total cobrado</span><b class="num">${clp(o.tot)}</b></div></div>
      <div class="bolg">${o.tipo === 'ex' ? `<div class="bd"><span class="xs t2">Boleta del laboratorio</span><b class="num">${clp(o.lab)}</b>${bolChip('lab', o.st.lab, o.st.labsrc)}${o.st.lab === 'pend' ? `<button class="pill" data-act="bolAdj" data-arg="${o.id}">Adjuntar</button>` : `<span class="xs t2">${o.st.labsrc === 'manual' ? 'La adjuntó operaciones' : 'Cruzada por RUT del paciente'}</span>`}</div>` : ''}
      <div class="bd"><span class="xs t2">Boleta de honorarios · ${o.pn.split(' ')[0]}</span><b class="num">${clp(o.pro)}</b>${bolChip('bhe', o.st.bhe)}<span class="xs t2">${o.st.bhe === 'emi' ? 'Se emitió automáticamente' : o.st.bhe === 'fail' ? 'Autorización SII vencida' : 'Se emite automáticamente al terminar'}</span>${o.st.bhe !== 'emi' ? `<button class="pill" data-act="bolBhe" data-arg="${o.id}">${o.st.bhe === 'fail' ? 'Reintentar emisión' : 'Emitir boleta de honorarios'}</button>` : ''}${o.st.bhe === 'fail' ? `<button class="lk sm" data-act="toast" data-arg="Enviamos a ${o.pn.split(' ')[0]} un enlace guiado para que emita ella la boleta y renueve su autorización en el SII.">Enviar enlace guiado</button>` : ''}</div>
      <div class="bd"><span class="xs t2">Boleta Cuidapp</span><b class="num">${clp(bolCu(o))}</b>${bolChip('cu', o.st.cu)}<span class="xs t2">Neto ${clp(bolNeto(o))} + IVA ${clp(bolCu(o) - bolNeto(o))} (si corresponde)</span>${o.st.cu === 'pend' ? `<button class="pill" data-act="bolCu" data-arg="${o.id}">Emitir boleta Cuidapp</button>` : ''}</div></div></div>`).join('')}</div>
    <div class="xs t3 mt12">El IVA de la boleta de Cuidapp está por confirmar con el criterio tributario. Nunca pedimos la clave del SII a la profesional: ella nos autoriza una vez al año como usuario autorizado.</div>`; } });

/* ---------- Paciente: documentos del pedido ---------- */
const docsBlock = () => { const m = S.item === 'mue', o = BOLS().find(x => x.id === (m ? 'CU-1042' : 'CU-1041')), pr = PRO().n.split(' ')[0];
  const D = [];
  if (m) D.push(['flask', 'Boleta del laboratorio', o.st.lab === 'rec' ? 'La emite el laboratorio a tu nombre y RUT. Con esta pides el reembolso de tus exámenes.' : 'La emite el laboratorio a tu nombre y RUT. Te la enviamos por correo y la ves aquí apenas llegue.', o.st.lab === 'rec' ? st('ok', 'Recibida', 'check-circle') : st('neu', 'Pendiente', 'clock'), o.st.lab === 'rec']);
  D.push(['user-circle', `Boleta de honorarios de ${pr}`, m ? 'Por la toma de muestra. Se emite automáticamente a tu nombre y RUT.' : 'Por su atención. Se emite automáticamente a tu nombre y RUT.', o.st.bhe === 'emi' ? st('ok', 'Emitida', 'check-circle') : st('neu', 'Pendiente', 'clock'), o.st.bhe === 'emi']);
  D.push(['receipt', 'Boleta Cuidapp', 'Por el servicio de Cuidapp. Se emite al terminar y llega a tu correo.', o.st.cu === 'emi' ? st('ok', 'Emitida', 'check-circle') : st('neu', 'Pendiente', 'clock'), o.st.cu === 'emi']);
  return `<div class="rmbs mt12"><b>1. Tus boletas</b><div class="xs t2 mt4">Las recibes en daniela.fuentes@gmail.com y aquí. Cada una es de quien presta el servicio.</div>${D.map(d => row('box:' + d[0], d[1], d[2], '', d[4] ? `<button class="pill" data-act="toast" data-arg="Descargado: ${d[1].replace(/ /g, '-')}.pdf">PDF</button>` : d[3])).join('')}</div>`; };


/* ---------- Antes de tu visita: lista con avance + cómo será el día (P20 y P27) ---------- */
const previaItems = () => {
  const w = S.who, f = FAM[w] || FAM.yo, L = [];
  L.push({ i: 'lock-simple', t: 'Pago', d: 'Retenido en Mercado Pago · se cobra al terminar', ok: true });
  const dOk = !!(f.nac && f.sx);
  L.push({ i: 'user', t: 'Datos del paciente', d: dOk ? `${whoTxt()} · completos` : 'Falta fecha de nacimiento o sexo', ok: dOk, go: dOk ? '' : 'P29' });
  if (S.item === 'mue' && !byOrder()) { const a = ayAgg(allExKeys()), need = needPrep();
    L.push({ i: a.h > 0 ? 'fork-knife' : 'coffee', t: need ? 'Preparación: ' + a.txt : 'Preparación', d: !need ? 'Puedes comer y tomar normal' : S.prepOk ? 'Entendida' : 'Toca para confirmar «Entendí la preparación»', ok: !need || !!S.prepOk, act: need && !S.prepOk ? 'prepOk' : '' }); }
  if (S.mmode === 'orden' || S.ordFrom) { const ok = S.ord === 'ok';
    L.push({ i: 'file-text', t: 'Orden médica', d: ok ? 'Revisada · ya confirmamos tus exámenes' : S.ord === 'rev' ? 'En revisión · te avisamos apenas esté' : 'Sube la foto para confirmar tus exámenes', ok, go: S.ord ? '' : 'P60' }); }
  if (S.rbAsk === 'si' && (S.pv[w] || {}).t !== 'fonasa') { const ok = rbReady();
    L.push({ i: 'receipt', t: 'Isapre para reembolso', d: ok ? 'Isapre y carnet listos' : 'Falta vincular tu Isapre o subir el carnet', ok, go: ok ? '' : 'P78' }); }
  return L;
};
const previa = () => { const L = previaItems(), n = L.filter(x => x.ok).length, all = n === L.length;
  return `<div class="prev mt16"><div class="prev-h"><b>${all ? 'Todo listo para tu visita' : 'Antes de tu visita'}</b><span class="xs t2 num">${n} de ${L.length}</span></div>
  <div class="progress mt8" role="progressbar" aria-valuemin="0" aria-valuemax="${L.length}" aria-valuenow="${n}"><span style="width:${Math.round(n / L.length * 100)}%"></span></div>
  <div class="prev-l">${L.map(x => { const inner = `<span class="check ${x.ok ? 'on' : ''}">${x.ok ? ic('check', 0).replace('ph ', 'ph-bold ') : ''}</span><span class="tx"><span class="a">${x.t}</span><span class="b">${x.d}</span></span>${x.go || x.act ? ic('caret-right') : ''}`;
    return x.act ? `<button class="prev-r" data-act="${x.act}" data-arg="">${inner}</button>` : x.go ? `<button class="prev-r" data-go="${x.go}">${inner}</button>` : `<div class="prev-r">${inner}</div>`; }).join('')}</div></div>`; };
const diaVisita = () => { const ex = S.item === 'mue', st = [
  ['bell', `${first()} sale hacia tu casa`, 'Te avisamos con una notificación. Verás la hora aproximada de llegada.'],
  ['key', `Recíbela con tu código`, `Dale el código de 4 dígitos para confirmar que es ${first()}.`],
  [ex ? 'test-tube' : CAT[S.item].ic, ex ? 'Toma de muestras en tu casa' : CAT[S.item].n, ex ? 'Ten a mano tu carnet y, si corresponde, tu orden médica.' : 'Ten a mano tu carnet y, si corresponde, tu receta.'],
  ['receipt', 'Pago y comprobante', ex ? 'Se cobra al terminar y recibes la boleta. Tus resultados llegan a la app.' : 'Se cobra al terminar y recibes la boleta por correo.']];
  return `<div class="lbl2">Cómo será el día de tu visita</div><ol class="dsteps">${st.map((x, i) => `<li><span class="n">${i + 1}</span><span class="tx"><b>${x[1]}</b><span>${x[2]}</span></span></li>`).join('')}</ol>`; };
const reagCan = (from = '', cap = true) => `<div class="row8 mt16"><button class="btn sec" data-go="P13">${ic('calendar-blank')}Reagendar</button><button class="btn sec dng" data-act="set" data-arg="cancelFrom=${from}" data-go="P30">${ic('x-circle')}Cancelar cita</button></div>${cap ? '<div class="xs t3 mt8 center">Cancelación gratis hasta 12 horas antes.</div>' : ''}`;
