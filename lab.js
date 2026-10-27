/* ===== Exámenes de laboratorio (catálogo completo), orden médica opcional, previsión de salud y reembolso ===== */
/* EXAMS[k] = [nombre, precio, tubo, ayuno, c|p, código, código Fonasa, muestra, plazo, nombre completo] */
const exN = t => norm(String(t || '')).replace(/\bvit(?:\.\s*|\s+)(?=[a-z0-9])/g, 'vitamina ').replace(/\bfe\b/g, 'hierro').replace(/\s+/g, ' ').trim();
/* palabras de uso común que no aparecen en el nombre técnico */
const EXKW = [[/tiro|tsh|\bt3\b|\bt4/, 'tiroides'], [/hiv/, 'vih sida'], [/gonadotrofina corionica/, 'embarazo beta hcg'], [/glicemia|glucosa|hemoglobina glicosilada|insulina|homa/, 'azucar diabetes'], [/colesterol|lipid|triglic/, 'colesterol grasas'], [/fierro|hierro|ferritina/, 'hierro fierro anemia'], [/hemograma/, 'sangre completo anemia'], [/creatinina|nitrogeno ureico|urea/, 'rinon renal'], [/transaminasa|bilirrubina|hepatico/, 'higado'], [/antigeno prostatico/, 'psa prostata'], [/covid|coronavirus/, 'covid pcr']];
/* Cargos internos: no se muestran a la paciente. La toma venosa ya va en la tarifa de toma a domicilio por paciente y el jarabe de glucosa va incluido en el costo de la curva/tolerancia. Solo se ven en el catálogo de Admin («Insumo/cargo interno») */
const EXHID = ['x142', 'x143', 'x472'];
const EXIDX = Object.keys(EXAMS).map(k => { const e = EXAMS[k], n = exN(e[9] + ' ' + e[0]); return [k, exN(e[0]), exN([e[9], e[7], e[5], e[6]].join(' ')) + ' ' + EXKW.filter(x => x[0].test(n)).map(x => x[1]).join(' ')]; });
function exFind(q, lim = 9999, all = false) {
  const t = exN(q).split(' ').filter(Boolean); if (!t.length) return [];
  const out = [], ph = t.some(w => w.length < 3) ? t.join(' ') : '';
  for (const [k, a, b] of EXIDX) { if (!all && EXHID.includes(k)) continue; const s = a + ' ' + b; if (t.every(w => hasW(s, w)) && (!ph || (' ' + s + ' ').includes(' ' + ph))) out.push([k, plV(t[0]).some(x => a.startsWith(x)) ? 0 : t.every(w => hasW(a, w)) ? 1 : 2]); }
  out.sort((x, y) => x[1] - y[1] || EXAMS[x[0]][0].length - EXAMS[y[0]][0].length);
  return out.slice(0, lim).map(x => x[0]);
}
/* Electro y procedimientos: lo del catálogo que no es un análisis de sangre u orina (sin muestra ni tubo). Hoy: x654 Electrocardiograma */
const EXPROC = ['x654'];
const isProc = k => EXPROC.includes(k);
const EXTABS = [['ex', 'Exámenes'], ['pk', 'Packs'], ['pr', 'Electro y procedimientos']];
const exTabs = () => { const t = S.exTab || 'ex', n = { ex: nPat() - EXPROC.length, pk: PACKS.length, pr: EXPROC.length }; return `<div class="qtabs extabs" role="tablist">${EXTABS.map(x => `<button class="chip ${t === x[0] ? 'on' : ''}" role="tab" aria-selected="${t === x[0]}" data-act="set" data-arg="exTab=${x[0]}">${x[1]} <span class="num">${n[x[0]]}</span></button>`).join('')}</div>`; };
/* selección visible en las tres pestañas */
const exSelBar = () => { const k = examKeys(); return k.length ? `<div class="exsel mt16"><div class="xs t2">Tu selección · ${k.length} · <b class="num">${clp(examSum())}</b></div><div class="chips mt8">${k.map(x => `<button class="chip on" data-act="ex" data-arg="${x}">${EXAMS[x][0]} · ${clp(EXAMS[x][1])} ${ic('x')}</button>`).join('')}</div><button class="lk sm mt8" data-act="lbFrom" data-go="P88">${ic('flask')}Ver en qué laboratorios · por separado</button></div>` : ''; };
const nPat = () => Object.keys(EXAMS).length - EXHID.length;
const exF = q => exFind(q, 1)[0];
const ptag = k => EXAMS[k][4] === 'c' ? '<span class="ptag c">Costo + recargo</span>' : '<span class="ptag p">Particular + recargo</span>';
const fon = k => EXAMS[k][6] ? `Fonasa ${EXAMS[k][6]}` : `Cód. ${EXAMS[k][5] || 's/c'}`;
const exSub = k => { const e = EXAMS[k]; return [e[7], ayLbl(e[3]), plLbl(k), fon(k)].filter(Boolean).join(' · '); };
/* preparación y entrega de lo que lleva la paciente: filas reutilizadas en selección, resumen, pago y confirmación */
const prepRows = () => {
  if (byOrder()) return row('box:file-text', 'Ayuno y entrega según tu orden', 'Los vemos apenas confirmes los exámenes de tu orden', '', '');
  const ks = allExKeys(), a = ayAgg(ks), p = plAgg(ks), n = ks.length > 1 ? ' (el mayor entre todos los exámenes)' : '';
  return row('box:' + (a.h > 0 ? 'fork-knife' : a.pend ? 'question' : 'coffee'), a.txt, a.h > 0 ? `Solo agua${n}${a.pend ? ' · ' + a.pend + ' por confirmar' : ''}` : a.pend ? 'Te confirmamos antes de la toma si algún examen pide ayuno' : 'Puedes comer y tomar normal', '', '')
    + row('box:clock', p.txt, ks.length > 1 && p.plazo ? 'Todos tus resultados, contando desde la toma' + (p.pend ? ' · ' + p.pend + ' por confirmar' : '') : 'Contando desde la toma · te avisamos cuando estén', '', '');
};
const exRow = (k, q = '', act = 'ex', on = S.exams[k]) => `<button class="exr" data-act="${act}" data-arg="${k}"><span class="check ${on ? 'on' : ''}">${on ? ic('check', 0).replace('ph ', 'ph-bold ') : ''}</span><span class="tx"><span class="a">${q ? hl(EXAMS[k][0], q) : EXAMS[k][0]}</span><span class="b">${exSub(k)}</span></span><span class="exp"><span class="pp num">${clp(EXAMS[k][1])}</span></span></button>`;

/* búsqueda en vivo: los inputs con data-q actualizan solo su lista de resultados (no se pierde el foco) */

document.addEventListener('input', e => {
  const el = e.target.closest('input[data-q]'); if (!el) return;
  S[el.dataset.q] = el.value; if (el.dataset.reset) S[el.dataset.reset] = el.dataset.q === 'exq' ? 20 : 0;
  const box = document.getElementById(el.dataset.res); if (box && QRES[el.dataset.res]) box.innerHTML = QRES[el.dataset.res]();
});
const qin = (k, res, ph, reset = '') => `<label class="qin">${ic('magnifying-glass')}<input type="search" data-q="${k}" data-res="${res}" ${reset ? `data-reset="${reset}"` : ''} value="${String(S[k] || '').replace(/"/g, '&quot;')}" placeholder="${ph}" autocomplete="off" enterkeyhint="search">${S[k] ? `<button class="qx" data-act="set" data-arg="${k}=" aria-label="Borrar">${ic('x')}</button>` : ''}</label>`;

QRES.exres = () => {
  const q = S.exq || '';
  if (!q.trim()) return `<div class="lbl2">Más pedidos</div><div class="exl">${EXPOP.map(k => exRow(k)).join('')}</div>
    <div class="xs t3 mt12">${nPat() - EXPROC.length} exámenes en el catálogo. Busca por nombre, parte del nombre o código Fonasa.</div>`;
  const all = exFind(q), r = all.filter(k => !isProc(k)), np = all.length - r.length;
  const hint = np ? `<button class="lk sm mt12" data-act="set" data-arg="exTab=pr">${ic('heartbeat')}${np} resultado${np > 1 ? 's' : ''} en Electro y procedimientos</button>` : '';
  if (!r.length) return `${hint}<div class="empty mt16">${ic('magnifying-glass')}<div class="b-m mt8">No encontramos «${q.replace(/</g, '')}»</div><div class="sm t2 mt4">Prueba con otra palabra o sube la foto de tu orden y lo buscamos por ti.</div>${btn('Subir foto de mi orden', 'P60', 'sec', 'data-act="mmode" data-arg="orden"')}</div>`;
  const lim = S.exLim || 20;
  return `<div class="xs t2 mt12">${r.length} resultado${r.length > 1 ? 's' : ''}</div><div class="exl">${r.slice(0, lim).map(k => exRow(k, q)).join('')}</div>${r.length > lim ? `<button class="btn sec mt12" data-act="exMore">Ver ${Math.min(20, r.length - lim)} más</button>` : ''}${hint}`;
};

/* sugerencias por motivo (ayúdame a elegir) */
const HELP = {
  chq: ['Chequeo preventivo', 'heart', ['hemo', 'lip', 'gli', 'bioq', 'ori']],
  dia: ['Diabetes o glicemia', 'drop', ['gli', 'hba', 'lip', 'cre', 'ori']],
  tir: ['Tiroides', 'pulse', ['tsh', 't4']],
  cans: ['Cansancio o anemia', 'battery-low', ['hemo', 'x4', 'x5', 'x191']],
  vit: ['Vitaminas', 'pill', ['vitd', 'x191', 'x267', 'x4']],
  ren: ['Riñón y presión', 'heartbeat', ['cre', 'x49', 'x38', 'ori']],
};
const ORD5 = ['hemo', 'bioq', 'tsh', 'hba', 'ori'];
/* lo que la lectura automática no reconoce del catálogo (la paciente lo busca ella) */
const ORDNO = ['Panel de alergias alimentarias'];

/* ---------- RUT de ejemplo con dígito verificador válido ---------- */
const rutDV = n => { let s = 0, m = 2; for (const d of String(n).split('').reverse()) { s += +d * m; m = m === 7 ? 2 : m + 1; } const r = 11 - (s % 11); return r === 11 ? '0' : r === 10 ? 'K' : String(r); };
const rut = n => `${n.toLocaleString('es-CL')}-${rutDV(n)}`;
const RUTS = { mama: rut(6482115), papa: rut(5917344), yo: rut(16843207) };
const PRUT = { cr: rut(17325418), pg: rut(18904226) };
const ISAPRES = ['Banmédica', 'Colmena', 'Consalud', 'Cruz Blanca', 'Nueva Masvida', 'Vida Tres', 'Esencial'];
const pvW = () => S.pvFor || S.who;
const pvTxt = (w = S.who) => { const p = S.pv[w] || {}; return p.t === 'fonasa' ? `Fonasa${p.tr ? ' · tramo ' + p.tr : ''}` : p.t === 'isapre' ? `Isapre ${p.is || ''}`.trim() : 'Particular'; };
const patN = w => FAM[w].n;

Object.assign(ACT, {
  exPair: () => { S.pack = ''; S.item = 'mue'; S.mmode = 'cat'; S.exams = { hemo: true, lip: true }; S.exq = ''; },
  exMore: () => { S.exLim = (S.exLim || 20) + 20; },
  exAdd: k => { S.item = 'mue'; S.mmode = 'cat'; S.exams[k] = true; S.exq = ''; toast(`${EXAMS[k][0]} agregado a tus exámenes.`); },
  path: p => { S.mmode = p; },
  ordUp: () => { S.orden = 'si'; S.ord = 'lee'; S.mmode = 'orden'; S.ordSel = null; S.ordLst = null; S.ordNo = []; S.ordq = ''; },
  ordReady: () => { S.ord = 'listo'; S.ordSel = ORD5.slice(); S.ordLst = ORD5.slice(); S.ordNo = ORDNO.slice(); S.ordq = ''; },
  ordTog: k => { const l = S.ordLst || (S.ordLst = []), s = S.ordSel || (S.ordSel = []); if (!l.includes(k)) l.push(k); if (s.includes(k)) S.ordSel = s.filter(x => x !== k); else { s.push(k); toast(`${EXAMS[k][0]} agregado a tu orden.`); } },
  ordNoX: i => { S.ordNo.splice(+i, 1); },
  ordCancel: () => { S.ord = ''; S.ordSel = null; S.ordLst = null; S.ordNo = []; S.ordq = ''; S.mmode = 'cat'; },
  ordOk: () => { S.pack = ''; S.exams = {}; (S.ordSel || []).forEach(k => S.exams[k] = true); S.ord = 'ok'; S.ordFrom = true; S.mmode = 'cat'; S.item = 'mue'; },
  help: k => { S.help = k; },
  helpAdd: () => { HELP[S.help][2].forEach(k => S.exams[k] = true); S.mmode = 'cat'; S.exq = ''; toast(`Agregamos ${HELP[S.help][2].length} exámenes sugeridos.`); },
  pvFor: w => { S.pvFor = w; },
  pvT: a => { const [w, t] = a.split('|'); S.pv[w].t = t; if (w === 'yo') S.prev = t === 'isapre' ? 'isapre' : t === 'fonasa' ? 'fonasa' : 'part'; },
  pvTr: a => { const [w, t] = a.split('|'); S.pv[w].tr = S.pv[w].tr === t ? '' : t; },
  pvIs: a => { const [w, t] = a.split('|'); S.pv[w].is = t; },
  scope: s => { S.scope = S.scope === s ? '' : s; },
  scopeGo: s => { S.scope = s; S.q = ''; S.typed = true; },
  aexPg: d => { S.aexPage = Math.max(0, S.aexPage + (+d)); },
  aexF: f => { S.aexF = f; S.aexPage = 0; },
});

/* ---------- P40 · Exámenes: tres caminos ---------- */
const pathCard = (p, i, t, d, on, go = '') => `<button class="pathc ${on ? 'on' : ''}" ${go ? `data-go="${go}"` : `data-act="path" data-arg="${p}"`}><span class="pi">${ic(i, on)}</span><span class="tx"><b>${t}</b><span>${d}</span></span></button>`;
const exPane = () => { const t = S.exTab || 'ex';
  if (t === 'pk') return `<div class="sm t2 mt16">Exámenes que se piden juntos, a menor precio que por separado. En tu primer pedido de exámenes sobre $30.000 tienes 20% de descuento (hasta $20.000).</div><div class="pkl2 mt12">${PACKS.map(p => pkCard(p)).join('')}</div><div class="xs t3 mt12">Consulta a tu médico qué exámenes necesitas. Packs de ejemplo.</div>`;
  if (t === 'pr') return `<div class="sm t2 mt16">Electrocardiograma y otras prestaciones del catálogo que no son un análisis de sangre u orina.</div><div class="exl mt8">${EXPROC.map(k => exRow(k)).join('')}</div>`;
  return `<div class="lbl2">Buscar exámenes</div><div>${qin('exq', 'exres', 'Busca: hemograma, vitamina D, 0301045…', 'exLim')}</div><div id="exres">${QRES.exres()}</div>`; };
def({ id: 'P40', name: 'Exámenes de laboratorio', kind: 'page', back: true, title: 'Exámenes de laboratorio', next: ['P16', 'P60', 'P61', 'P62', 'P63'],
  prep: () => { S.item = 'mue'; },
  body: () => {
    const orden = S.mmode === 'orden';
    const paths = `<div class="paths mt16">${pathCard('cat', 'list-checks', 'Elegir mis exámenes', 'Busca y marca', !orden)}${pathCard('orden', 'camera', 'Subir foto de mi orden', 'Los marcamos por ti', orden)}${pathCard('', 'chat-circle-dots', 'Ayúdame a elegir', 'Según para qué es', false, 'P63')}</div>`;
    const head = `<div class="tsteps">${[['file-arrow-up', 'Sube tu orden médica o elige tus exámenes'], ['house-line', 'Una enfermera o TENS va a tu casa y toma la muestra'], ['flask', 'La entrega en un laboratorio afiliado y te avisamos con los resultados']].map((t, i) => `<div class="tst"><span class="tsn">${i + 1}</span><span class="tsi">${ic(t[0])}</span><span class="sm">${t[1]}</span></div>`).join('')}</div>
    <div class="t2 sm mt12">${nPat()} exámenes. La profesional solo cobra la toma; los exámenes los pagas a Cuidapp.</div>${paths}`;
    if (orden) {
      const stt = S.ord === 'lee' ? row('box:scan', 'Leyendo tu orden', 'Son unos segundos', 'P61', st('inf', 'Leyendo', ''))
        : S.ord === 'listo' ? row('box:list-checks', `Detectamos ${(S.ordSel || ORD5).length} exámenes`, 'Revísalos y confirma', 'P62', st('ok', 'Lista', ''))
        : S.ord === 'ok' ? row('box:check-circle', 'Orden confirmada', nEx(), 'P16', st('ok', 'Confirmada', '')) : '';
      return `${head}<div class="mt16">${note('sparkle', 'Sube una foto de tu orden y la leemos al instante y marcamos los exámenes por ti. Tú confirmas los precios antes de pagar.', 'ok')}</div>${stt ? `<div class="mt16">${stt}</div>` : `<div class="lbl2">Cómo funciona</div>${[['camera', 'Sacas una foto a la orden', 'Papel o PDF, la de cualquier médico'], ['scan', 'La leemos en unos segundos', 'Buscamos cada examen en el catálogo del laboratorio'], ['check-circle', 'Confirmas los exámenes y el precio', 'Puedes editar antes de pagar']].map(t => row('box:' + t[0], t[1], t[2], '', '')).join('')}`}`;
    }
    return `${head}<div class="mt16">${note('check-circle', 'No necesitas orden: nosotros la gestionamos por ti.', 'ok')}</div>
    <div class="mt16">${exTabs()}</div>
    ${pkAct() ? `<div class="pkon mt16"><span class="ri box">${ic('package')}</span><span class="tx"><b>Pack ${pkAct()[1]}</b><span class="xs t2">${pkAct()[4].length} exámenes · ahorras ${clp(pkD())}</span></span><button class="lk sm" data-act="pkOff">Quitar</button></div>` : S.pack ? `<div class="mt16">${note('info', 'Quitaste un examen del pack, así que ahora se cobran por separado.')}</div>` : ''}
    ${exSelBar()}
    ${exPane()}
    ${examKeys().length ? `<div class="lbl2">Preparación de tu selección</div>${prepRows()}` : ''}
    <div class="soonr mt24"><button class="soonc" data-go="P83"><span class="ri box">${ic('storefront')}</span><span class="tx"><b>Agendar directo en un laboratorio</b><span class="xs t2">Elige laboratorio, día y si vas tú o te visitan</span></span><span class="pr soonb">Muy pronto</span></button></div>
    <div class="lbl2">Orden médica</div>${checkRow('Necesito orden médica', S.needOrd, 'tog', 'needOrd', 'La gestionamos con un médico · precio por confirmar')}
`;
  },
  foot: () => S.mmode === 'orden'
    ? (S.ord === 'ok' ? `<div class="fbar"><div class="fb-l"><b class="num">${clp(examSum())}</b><span>${nEx()}</span></div><button class="btn fbtn" data-go="P16">Continuar</button></div>`
      : S.ord === 'listo' ? btn(`Ver los ${(S.ordSel || ORD5).length} exámenes`, 'P62') : S.ord === 'lee' ? btn('Ver la lectura', 'P61', 'sec') : btn(`${ic('camera')}Subir foto de mi orden`, 'P60'))
    : `<div class="fbar"><div class="fb-l"><b class="num">${clp(examSum())}</b><span>${examList().length === 1 ? '1 examen' : examList().length + ' exámenes'}${S.needOrd ? ' + orden' : ''} · toma aparte</span></div><button class="btn fbtn" data-go="P16" ${examList().length ? '' : 'disabled'}>Continuar</button></div>` });

def({ id: 'P60', name: 'Subir foto de la orden', kind: 'page', back: true, title: 'Tu orden médica', next: ['P61'],
  body: () => `<div class="h-m">Sube la foto de tu orden</div><div class="t2 sm mt8">La leemos sola y marcamos los exámenes por ti. Antes de pagar ves la lista con precios.</div>
  <div class="drop mt16"><div class="row8"><button class="pill on" data-act="ordUp" data-go="P61">${ic('camera')}Tomar foto</button><button class="pill" data-act="ordUp" data-go="P61">${ic('image')}Elegir de fotos</button><button class="pill" data-act="ordUp" data-go="P61">${ic('file-arrow-up')}PDF</button></div><div class="t3 sm">Foto completa, derecha y con luz</div></div>
  <div class="lbl2">Que se vea</div>${['Nombre del paciente', 'Exámenes indicados', 'Nombre y firma del médico'].map(t => `<div class="chk">${ic('check')}<span>${t}</span></div>`).join('')}
  <div class="mt16">${note('info', '¿No tienes orden? No es obligatoria: elige tus exámenes y nosotros la gestionamos.')}</div>`,
  foot: () => btn('Mejor elijo yo', 'P40', 'ghost', 'data-act="ordCancel"') });

def({ id: 'P61', name: 'Leyendo tu orden', kind: 'page', back: true, title: '', next: ['P62', 'P40'], auto: 'P62', autoAct: () => ACT.ordReady(),
  prep: () => { if (!S.ord) S.ord = 'lee'; },
  body: () => `<div class="center mt8"><div class="ordscan" role="status" aria-label="Leyendo tu orden">${orden()}<span class="ordscan-l"></span></div></div><div class="h-l mt16">Leyendo tu orden</div><div class="t2 sm mt8">Estamos reconociendo cada examen y buscándolo en el catálogo. Son unos segundos.</div>
  <div class="progress bar-anim mt16"><span></span></div>
  <div class="tl3 mt16">${[['check-circle', 'Foto recibida', 'Se ve completa y derecha', 'ok'], ['scan', 'Leyendo los exámenes', 'En curso', 'on'], ['list-checks', 'Marcando en el catálogo', 'Después los revisas tú', '']].map(t => `<div class="tl3r ${t[3]}">${ic(t[0], t[3] === 'ok')}<div><b>${t[1]}</b><span>${t[2]}</span></div></div>`).join('')}</div>`,
  foot: () => `${btn('Cancelar y elegir yo', 'P40', 'ghost', 'data-act="ordCancel"')}`,
  enter: () => T(() => { if (cur === 'P61') { ACT.ordReady(); go('P62'); } }, 3200) });

QRES.ordres = () => { const q = S.ordq || ''; if (!q.trim()) return '';
  const l = exFind(q, 8), on = S.ordSel || [];
  return l.length ? `<div class="exl">${l.map(k => exRow(k, q, 'ordTog', on.includes(k))).join('')}</div>` : `<div class="empty mt16">${ic('magnifying-glass')}<div class="b-m mt8">No encontramos «${q.replace(/</g, '')}»</div><div class="sm t2 mt4">Prueba con otra palabra o con el código del examen.</div></div>`; };
def({ id: 'P62', name: 'Exámenes detectados', kind: 'page', back: true, title: '', next: ['P16', 'P40'],
  prep: () => { if (!S.ordSel) ACT.ordReady(); },
  body: () => { const sel = S.ordSel || [], lst = S.ordLst || [], tot = sel.reduce((a, k) => a + EXAMS[k][1], 0), no = S.ordNo || [];
    return `<button class="push" data-go="P62"><div class="push-h"><img src="logo/apple-touch-icon.png" alt=""><span>Cuidapp</span><span class="t3">ahora</span></div><b>Leímos tu orden</b><div>Detectamos ${ORD5.length} exámenes. Revísalos y confirma.</div></button>
    <div class="h-l mt16">Detectamos ${sel.length} ${sel.length === 1 ? 'examen' : 'exámenes'}</div><div class="t2 sm mt4">Orden de la Dra. Marcela Ortiz · leída automáticamente. Quita los que no quieras o agrega otros.</div>
    ${no.length ? `<div class="mt16">${no.map((t, i) => `<div>${note('warning', `No pudimos leer: «${t}». Búscalo en el catálogo y agrégalo.`, 'warn')}<button class="lk sm mt4" data-act="ordNoX" data-arg="${i}">Quitar este aviso</button></div>`).join('')}</div>` : ''}
    <div class="exl mt8">${lst.map(k => exRow(k, '', 'ordTog', sel.includes(k))).join('')}</div>
    ${kv('Total exámenes', clp(tot), 'tot')}
    <div class="lbl2">Buscar en el catálogo</div>${qin('ordq', 'ordres', 'Busca: hemograma, vitamina D, 0301045…')}<div id="ordres">${QRES.ordres()}</div>
    <div class="mt12">${note('lock-simple', 'No cobramos nada hasta que confirmes y la profesional acepte la toma.', 'inf')}</div>`; },
  foot: () => { const sel = S.ordSel || [], tot = sel.reduce((a, k) => a + EXAMS[k][1], 0);
    return `<div class="fbar"><div class="fb-l"><b class="num">${clp(tot)}</b><span>${sel.length === 1 ? '1 examen' : sel.length + ' exámenes'} · toma aparte</span></div><button class="btn fbtn" data-act="ordOk" data-go="P16" ${sel.length ? '' : 'disabled'}>Continuar</button></div>`; } });

def({ id: 'P63', name: 'Ayúdame a elegir', kind: 'page', back: true, title: 'Ayúdame a elegir', next: ['P40', 'P60'],
  body: () => `<div class="h-m">¿Para qué son los exámenes?</div><div class="t2 sm mt4">Te sugerimos los más pedidos. Puedes quitar o agregar después.</div>
  <div class="hgrid mt16">${Object.entries(HELP).map(([k, h]) => `<button class="hcell ${S.help === k ? 'on' : ''}" data-act="help" data-arg="${k}">${ic(h[1], S.help === k)}<span>${h[0]}</span></button>`).join('')}</div>
  ${S.help ? `<div class="lbl2">Sugeridos · ${HELP[S.help][0]}</div><div class="exl">${HELP[S.help][2].map(k => `<div class="exr"><span class="tx"><span class="a">${EXAMS[k][0]}</span><span class="b">${exSub(k)}</span></span><span class="exp"><span class="pp num">${clp(EXAMS[k][1])}</span></span></div>`).join('')}</div>` : ''}
  <div class="mt16">${note('info', 'Es una guía general y no reemplaza la indicación de tu médico. Si tienes una orden, súbela y la leemos.')}</div>
  ${row('box:chat-circle-dots', 'Prefiero hablar con alguien', 'Chat con nuestro equipo · respuesta en minutos', '', ic('caret-right'), '', 'toast', 'Te escribimos por WhatsApp en menos de 10 minutos.')}${row('box:camera', 'Tengo una orden', 'Sube la foto y marcamos los exámenes por ti', 'P60', ic('caret-right'), '', 'path', 'orden')}`,
  foot: () => abtn(S.help ? `Agregar ${HELP[S.help][2].length} exámenes` : 'Elige un motivo', 'helpAdd', '', '', 'P40', !S.help) });

/* ---------- Previsión de salud ---------- */
const pvBlock = w => { const p = S.pv[w];
  return `${radioRow('Fonasa', 'Tramo opcional', p.t === 'fonasa', 'pvT', w + '|fonasa', 'shield-check')}${p.t === 'fonasa' ? `<div class="chips sub">${['A', 'B', 'C', 'D'].map(t => chip('Tramo ' + t, p.tr === t, 'pvTr', w + '|' + t)).join('')}</div>` : ''}
  ${radioRow('Isapre', p.t === 'isapre' && p.is ? p.is : 'Elige tu isapre', p.t === 'isapre', 'pvT', w + '|isapre', 'buildings')}${p.t === 'isapre' ? `<div class="chips sub">${ISAPRES.map(t => chip(t, p.is === t, 'pvIs', w + '|' + t)).join('')}</div>` : ''}
  ${radioRow('Particular', 'Sin previsión o prefiero no usarla', p.t === 'part', 'pvT', w + '|part', 'wallet')}`; };
def({ id: 'P64', name: 'Previsión de salud', kind: 'page', back: true, title: 'Previsión de salud',
  body: () => { const w = pvW(); return `<div class="t2 sm">${patN(w)} · RUT ${RUTS[w]} · cada integrante tiene su propia previsión</div><div class="mt12">${pvBlock(w)}</div>${S.pv[w].t === 'isapre' ? `<div class="mt12">${S.isa[w] ? row('box:link', `${S.isa[w].is} vinculada`, 'Reembolso automático activo', 'P82', st('ok', 'Activa'), '', 'lkW', w) : row('box:link', 'Reembolso automático', `Vincula la Isapre de ${FAM[w].c} una vez y presentamos sus reembolsos`, 'P78', '<span class="lk">Vincular</span>', '', 'lkW', w)}</div>` : ''}
  <div class="mt12">${row('box:chart-bar', 'Cotiza tu Isapre', 'Asesores de Isapre comparan planes para ti', 'P89')}</div>
  <div class="mt16">${note('receipt', 'La usamos para emitir tus boletas para reembolso: van con tu RUT, tu previsión y los códigos Fonasa de cada examen.')}</div>`; },
  foot: () => btn('Guardar', 'back') });

/* ---------- Documentos para reembolso ---------- */
const reembolsoBlock = () => { const m = S.item === 'mue';
  return `<div class="rmb mt8"><div class="rmb-h">${ic('receipt')}<b>Boletas y reembolso</b></div>
  <div class="rmb-r"><span>Paciente</span><b>${patN(S.who)} · RUT ${RUTS[S.who]}</b></div><div class="rmb-r"><span>Previsión</span><b>${pvTxt()}</b></div>
  ${m ? `<div class="rmb-r"><span>Exámenes</span><b>${examList().length ? examKeys().slice(0, 3).map(k => EXAMS[k][6] || EXAMS[k][5]).join(', ') + (examKeys().length > 3 ? ` y ${examKeys().length - 3} más` : '') : 'Se agregan al confirmar la orden'}</b></div>` : ''}
  <div class="rmb-r"><span>Boletas</span><b>${m ? 'Laboratorio, honorarios y Cuidapp' : 'Honorarios y Cuidapp'}</b></div>
  <button class="lk mt8" data-go="P65">${ic('file-pdf')}Ver mis boletas y documentos</button></div>`; };
def({ id: 'P65', name: 'Documentos para reembolso', kind: 'page', back: true, title: 'Para tu reembolso',
  body: () => { const m = S.item === 'mue', w = S.who, pr = PRO(), p = price(); const toma = m ? p.pro : p.total;
    return `${(S.pv[w] || {}).t === 'isapre' ? `<div class="mb12">${S.isa[w] ? row('box:lightning', 'Reembolso automático', `Presentamos el reembolso en ${S.isa[w].is}`, 'P80', st('ok', 'Activo')) : row('box:link', 'Reembolso automático', `Vincula ${S.pv[w].is} y presentamos el reembolso por ti`, 'P78', '<span class="lk">Vincular</span>', '', 'lkW', w)}</div>` : ''}<div class="pdfp"><div class="pdh"><div><b>Cuidapp</b><div class="xs t2">Documentos para reembolso · ${DAYS[S.day][3].replace(/^(hoy )?\S+ /, '')} 2026</div></div>${ic('file-pdf', 1)}</div>
    <div class="xs t2 mt8">Paciente: <b style="color:var(--text)">${patN(w)}</b> · RUT ${RUTS[w]} · ${pvTxt(w)}</div>
    ${docsBlock()}<table class="rtab mt8"><tr><td>Pagado con</td><td>Mercado Pago</td></tr><tr><td>Total pagado</td><td class="num">${clp(p.total)}</td></tr></table>
    ${m ? `<div class="rmbs mt12"><b>2. Exámenes</b><table class="rtab mt8"><tr><th>Código</th><th>Examen</th><th>Valor</th></tr>${examKeys().map(k => `<tr><td class="num">${EXAMS[k][6] || EXAMS[k][5] || 's/c'}</td><td>${EXAMS[k][0]}</td><td class="num">${clp(EXAMS[k][1])}</td></tr>`).join('')}<tr><td></td><td><b>Total</b></td><td class="num"><b>${clp(examSum())}</b></td></tr></table>${examKeys().some(k => !EXAMS[k][6]) ? '<div class="xs t3 mt4">Sin código Fonasa: consulta con tu previsión si lo cubre.</div>' : ''}</div>` : ''}
    <div class="rmbs mt12"><b>${m ? '3' : '2'}. Detalle de la atención</b><table class="rtab mt8"><tr><td>Profesional</td><td>${pr.n} · ${pr.t}</td></tr><tr><td>RUT</td><td class="num">${PRUT[pr.id] || PRUT.cr}</td></tr><tr><td>Prestación</td><td>${m ? 'Toma de muestra venosa a domicilio · cód. 0307011' : CAT[S.item].n + ' a domicilio'}</td></tr><tr><td>Valor</td><td class="num">${clp(toma)}</td></tr></table></div>
    ${m ? `<div class="rmbs mt12"><b>${m ? '4' : '3'}. Orden médica</b><div class="xs t2 mt4">${S.orden === 'si' ? 'Foto de tu orden · Dra. Marcela Ortiz R.' : S.needOrd ? 'Gestionada por Cuidapp · se adjunta al emitirla' : 'Si tu previsión la pide, podemos gestionarla por ti.'}</div></div>` : ''}</div>
    <div class="lbl2">Cómo pedir el reembolso</div>
    ${row('box:buildings', 'Isapre', 'En la app o el sitio de tu isapre, sección reembolsos: sube la boleta y la orden médica.', '', '')}
    ${row('box:shield-check', 'Fonasa', 'Consulta en una sucursal Fonasa o en fonasa.cl si aplica bono o reembolso para estas prestaciones.', '', '')}
    <div class="xs t3 mt8">Lo que te devuelven depende de tu plan y de tu previsión.</div>`; },
  foot: () => `${abtn(ic('download-simple') + 'Descargar documentos para reembolso', 'toast', 'Descargado: Reembolso-' + patN(S.who).split(' ').slice(0, 2).join('-').normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '.pdf (boletas y orden).')}${abtn(ic('envelope-simple') + 'Enviar a mi correo', 'toast', 'Te enviamos los documentos a daniela.fuentes@gmail.com.', 'sec')}` });

/* ---------- Admin: catálogo completo y lecturas de órdenes ---------- */
/* registro de lecturas automáticas: [fecha, paciente, exámenes detectados, no reconocidos, resultado ('res' reservó · 'sin' no reservó)] */
const ALEC = [['26 oct · 10:31', 'Rosa Muñoz Pérez', ORD5, ORDNO, 'res'], ['26 oct · 09:12', 'Jorge Salinas Vera', ['hemo', 'lip', 'bioq'], [], 'res'], ['25 oct · 19:48', 'Carmen Ibarra Soto', ['hemo', 'ori', 'tsh', 'hba'], ['Estudio de sueño'], 'sin'], ['25 oct · 11:05', 'Luis Fuentes Rojas', ['bioq', 'lip'], [], 'res'], ['24 oct · 16:20', 'Marta Díaz Osorio', ['hemo', 'ori'], [], 'sin'], ['23 oct · 08:55', 'Pedro Araya Lagos', ['hemo', 'bioq', 'tsh', 'lip'], ['Panel de alergias alimentarias', 'Test de intolerancia'], 'res']];
QRES.aexres = () => {
  const q = S.aexq || '', f = S.aexF || 'all', per = 25;
  let l = q.trim() ? exFind(q, 9999, true) : Object.keys(EXAMS);
  if (f === 'c') l = l.filter(k => EXAMS[k][4] === 'c'); if (f === 'p') l = l.filter(k => EXAMS[k][4] === 'p'); if (f === 'sf') l = l.filter(k => !EXAMS[k][6]); if (f === 'ay') l = l.filter(k => EXAMS[k][3] < 0);
  const pg = Math.min(S.aexPage || 0, Math.max(0, Math.ceil(l.length / per) - 1)), n = Math.max(1, Math.ceil(l.length / per));
  return `<table class="t mt12"><tr><th>Código</th><th>Fonasa</th><th>Examen</th><th>Muestra</th><th>Entrega</th><th>Ayuno</th><th style="text-align:right">Precio</th><th>Tipo</th></tr>
  ${l.slice(pg * per, pg * per + per).map(k => { const e = EXAMS[k]; return `<tr><td class="num">${e[5] || '—'}</td><td class="num">${e[6] || '<span class="t3">—</span>'}</td><td>${q ? hl(e[0], q) : e[0]}</td><td class="t2">${e[7] || '—'}</td><td class="t2">${plDias(k) == null ? 'Por confirmar' : e[8]}</td><td class="t2">${e[3] >= 0 ? ayLbl(e[3]) + ' <span class="t3">· ' + (e[10] === 3 ? 'fuentes difieren' : e[10] === 2 ? 'fuente pública' : 'por tipo de examen') + '</span>' : 'Por confirmar'}</td><td class="num" style="text-align:right">${clp(e[1])}</td><td>${EXHID.includes(k) ? '<span class="ptag p">Insumo/cargo interno</span>' : ptag(k)}</td></tr>`; }).join('')}</table>
  <div class="pgr mt12"><span class="t2 sm">${l.length} exámenes · página ${pg + 1} de ${n}</span><span class="sp"></span><button class="pill" data-act="aexPg" data-arg="-1" ${pg ? '' : 'disabled'}>${ic('caret-left')}Anterior</button><button class="pill" data-act="aexPg" data-arg="1" ${pg < n - 1 ? '' : 'disabled'}>Siguiente${ic('caret-right')}</button></div>`;
};
def({ id: 'A08', name: 'Catálogo de exámenes', kind: 'adm', side: 'lab',
  body: () => { const all = Object.keys(EXAMS), c = all.filter(k => EXAMS[k][4] === 'c').length, f = S.aexF || 'all';
    return `<div class="ahd"><div><h1 class="h-xl">Catálogo de exámenes</h1><div class="t2 sm mt4">Importado desde el Excel del laboratorio el 26 oct 2026</div></div><button class="btn sec" style="width:auto;padding:0 18px" data-act="toast" data-arg="Sube el Excel actualizado y te mostramos los cambios antes de publicarlos.">${ic('file-arrow-up')}Importar Excel</button></div>
    <div class="kpis mt16">${[[all.length, 'Exámenes publicados'], [c, 'Costo del laboratorio + recargo'], [all.length - c, 'Particular + recargo (sin costo)'], [all.filter(k => EXAMS[k][6]).length, 'Con código Fonasa'], [all.filter(k => EXAMS[k][10] >= 2).length, 'Ayuno con fuente pública'], [all.filter(k => EXAMS[k][10] === 1).length, 'Ayuno por tipo de examen'], [all.filter(k => EXAMS[k][3] < 0).length, 'Ayuno por confirmar'], [all.filter(k => plDias(k) == null).length, 'Entrega por confirmar']].map(t => `<div class="kpi"><b class="num">${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div>
    <div class="row8 mt16" style="align-items:center"><div style="flex:1;max-width:420px">${qin('aexq', 'aexres', 'Buscar por nombre o código', 'aexPage')}</div><div class="chips">${[['all', 'Todos'], ['c', 'Costo + recargo'], ['p', 'Particular + recargo'], ['sf', 'Sin código Fonasa'], ['ay', 'Ayuno por confirmar']].map(t => chip(t[1], f === t[0], 'aexF', t[0])).join('')}</div></div>
    <div id="aexres">${QRES.aexres()}</div><div class="xs t3 mt12">Precio paciente = costo del laboratorio + recargo; si no hay costo, precio particular + recargo. Los costos internos del Excel no se publican. El laboratorio informa la entrega pero no el ayuno: el ayuno viene de fuentes públicas chilenas (Hospital San Juan de Dios, RedSalud, Examedi, Laboval; la URL por examen está en el Excel) o del tipo de examen; si las fuentes difieren se usa el criterio más estricto. El resto está por confirmar con el laboratorio.</div>`; } });

def({ id: 'A09', name: 'Lecturas de órdenes', kind: 'adm', side: 'ord',
  body: () => { const live = S.ord === 'listo' || S.ord === 'ok' ? [['Ahora · esta sesión', 'Rosa Muñoz Pérez', S.ordSel || [], S.ordNo || [], S.ord === 'ok' ? 'res' : 'cur']] : [], rows = live.concat(ALEC),
      nEx = rows.reduce((a, r) => a + r[2].length, 0), nNo = rows.reduce((a, r) => a + r[3].length, 0), nRes = rows.filter(r => r[4] === 'res').length;
    return `<div class="ahd"><div><h1 class="h-xl">Lecturas de órdenes</h1><div class="t2 sm mt4">Cada foto de orden se lee automáticamente. Es un registro: no hay nada que revisar ni aprobar.</div></div></div>
  <div class="kpis mt16">${[[rows.length, 'Órdenes leídas'], [nEx, 'Exámenes detectados'], [nNo, 'No reconocidos'], [nRes, 'Terminaron en reserva']].map(t => `<div class="kpi"><b class="num">${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div>
  <table class="t mt16"><tr><th>Fecha</th><th>Paciente</th><th>Exámenes detectados</th><th>No reconocidos</th><th>Resultado</th></tr>
  ${rows.map(r => `<tr><td class="t2">${r[0]}</td><td><b>${r[1]}</b></td><td>${r[2].length ? `<b class="num">${r[2].length}</b> <span class="t2">· ${r[2].slice(0, 3).map(k => EXAMS[k][0]).join(', ')}${r[2].length > 3 ? ' y ' + (r[2].length - 3) + ' más' : ''}</span>` : '<span class="t3">Ninguno</span>'}</td><td class="t2">${r[3].length ? r[3].join(', ') : '<span class="t3">—</span>'}</td><td>${r[4] === 'res' ? st('ok', 'Reservó') : r[4] === 'cur' ? st('inf', 'En curso', 'hourglass-medium') : st('neu', 'No reservó')}</td></tr>`).join('')}</table>
  <div class="mt16" style="max-width:560px">${note('lock-simple', 'Registro de solo lectura. Lo que no se reconoce lo busca la paciente en el catálogo, en su propia pantalla.')}</div>`; } });
