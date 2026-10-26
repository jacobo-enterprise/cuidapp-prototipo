/* ===== Exámenes de laboratorio (catálogo completo), orden médica opcional, previsión de salud y reembolso ===== */
/* EXAMS[k] = [nombre, precio, tubo, ayuno, c|p, código, código Fonasa, muestra, plazo, nombre completo] */
const exN = t => norm(String(t || '')).replace(/\bvit\.?\s*(?=[a-z0-9])/g, 'vitamina ').replace(/\bfe\b/g, 'hierro').replace(/\s+/g, ' ').trim();
/* palabras de uso común que no aparecen en el nombre técnico */
const EXKW = [[/tiro|tsh|\bt3\b|\bt4/, 'tiroides'], [/hiv/, 'vih sida'], [/gonadotrofina corionica/, 'embarazo beta hcg'], [/glicemia|glucosa|hemoglobina glicosilada|insulina|homa/, 'azucar diabetes'], [/colesterol|lipid|triglic/, 'colesterol grasas'], [/fierro|hierro|ferritina/, 'hierro fierro anemia'], [/hemograma/, 'sangre completo anemia'], [/creatinina|nitrogeno ureico|urea/, 'rinon renal'], [/transaminasa|bilirrubina|hepatico/, 'higado'], [/antigeno prostatico/, 'psa prostata'], [/covid|coronavirus/, 'covid pcr']];
const EXIDX = Object.keys(EXAMS).map(k => { const e = EXAMS[k], n = exN(e[9] + ' ' + e[0]); return [k, exN(e[0]), exN([e[9], e[7], e[5], e[6]].join(' ')) + ' ' + EXKW.filter(x => x[0].test(n)).map(x => x[1]).join(' ')]; });
function exFind(q, lim = 9999) {
  const t = exN(q).split(' ').filter(Boolean); if (!t.length) return [];
  const out = [], ph = t.some(w => w.length < 3) ? t.join(' ') : '';
  for (const [k, a, b] of EXIDX) { const s = a + ' ' + b; if (t.every(w => s.includes(w)) && (!ph || (' ' + s + ' ').includes(' ' + ph))) out.push([k, a.startsWith(t[0]) ? 0 : t.every(w => a.includes(w)) ? 1 : 2]); }
  out.sort((x, y) => x[1] - y[1] || EXAMS[x[0]][0].length - EXAMS[y[0]][0].length);
  return out.slice(0, lim).map(x => x[0]);
}
const exF = q => exFind(q, 1)[0];
const ptag = k => EXAMS[k][4] === 'c' ? '<span class="ptag c">Precio Cuidapp</span>' : '<span class="ptag p">Precio particular</span>';
const fon = k => EXAMS[k][6] ? `Fonasa ${EXAMS[k][6]}` : `Cód. ${EXAMS[k][5] || 's/c'}`;
const exSub = k => { const e = EXAMS[k]; return [e[7], e[8], e[3] ? 'con ayuno' : '', fon(k)].filter(Boolean).join(' · '); };
const exRow = (k, q = '', act = 'ex', on = S.exams[k]) => `<button class="exr" data-act="${act}" data-arg="${k}"><span class="check ${on ? 'on' : ''}">${on ? ic('check', 0).replace('ph ', 'ph-bold ') : ''}</span><span class="tx"><span class="a">${q ? hl(EXAMS[k][0], q) : EXAMS[k][0]}</span><span class="b">${exSub(k)}</span></span><span class="exp"><span class="pp num">${clp(EXAMS[k][1])}</span>${ptag(k)}</span></button>`;

/* búsqueda en vivo: los inputs con data-q actualizan solo su lista de resultados (no se pierde el foco) */

document.addEventListener('input', e => {
  const el = e.target.closest('input[data-q]'); if (!el) return;
  S[el.dataset.q] = el.value; if (el.dataset.reset) S[el.dataset.reset] = el.dataset.q === 'exq' ? 20 : 0;
  const box = document.getElementById(el.dataset.res); if (box && QRES[el.dataset.res]) box.innerHTML = QRES[el.dataset.res]();
});
const qin = (k, res, ph, reset = '') => `<label class="qin">${ic('magnifying-glass')}<input type="search" data-q="${k}" data-res="${res}" ${reset ? `data-reset="${reset}"` : ''} value="${String(S[k] || '').replace(/"/g, '&quot;')}" placeholder="${ph}" autocomplete="off" enterkeyhint="search">${S[k] ? `<button class="qx" data-act="set" data-arg="${k}=" aria-label="Borrar">${ic('x')}</button>` : ''}</label>`;

QRES.exres = () => {
  const q = S.exq || '';
  if (!q.trim()) { const sel = examKeys().filter(k => !EXPOP.includes(k));
    return `${sel.length ? `<div class="lbl2">Elegidos</div><div class="exl">${sel.map(k => exRow(k)).join('')}</div>` : ''}<div class="lbl2">Más pedidos</div><div class="exl">${EXPOP.map(k => exRow(k)).join('')}</div>
    <div class="xs t3 mt12">${Object.keys(EXAMS).length} exámenes en el catálogo. Busca por nombre, parte del nombre o código Fonasa.</div>`; }
  const r = exFind(q), selK = examKeys();
  const selBar = selK.length ? `<div class="exsel mt12"><div class="xs t2">Elegidos · ${selK.length} · <b class="num">${clp(examSum())}</b></div><div class="chips mt8">${selK.map(k => `<button class="chip on" data-act="ex" data-arg="${k}">${EXAMS[k][0]} · ${clp(EXAMS[k][1])} ${ic('x')}</button>`).join('')}</div><button class="lk sm mt8" data-act="lbFrom" data-go="P88">${ic('flask')}Ver en qué laboratorios · por precio o distancia</button></div>` : '';
  if (!r.length) return selBar + `<div class="empty mt16">${ic('magnifying-glass')}<div class="b-m mt8">No encontramos «${q.replace(/</g, '')}»</div><div class="sm t2 mt4">Prueba con otra palabra o sube la foto de tu orden y lo buscamos por ti.</div>${btn('Subir foto de mi orden', 'P60', 'sec', 'data-act="mmode" data-arg="orden"')}</div>`;
  const lim = S.exLim || 20;
  return `${selBar}<div class="xs t2 mt12">${r.length} resultado${r.length > 1 ? 's' : ''}</div><div class="exl">${r.slice(0, lim).map(k => exRow(k, q)).join('')}</div>${r.length > lim ? `<button class="btn sec mt12" data-act="exMore">Ver ${Math.min(20, r.length - lim)} más</button>` : ''}`;
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
  ordUp: () => { S.orden = 'si'; S.ord = 'rev'; S.mmode = 'orden'; },
  ordReady: () => { S.ord = 'listo'; S.ordSel = ORD5.slice(); },
  ordOk: () => { S.pack = ''; S.exams = {}; (S.ordSel || ORD5).forEach(k => S.exams[k] = true); S.ord = 'ok'; S.ordFrom = true; S.mmode = 'cat'; S.item = 'mue'; },
  ordEdit: () => { ACT.ordOk(); toast('Puedes agregar o quitar exámenes. El laboratorio revisa los cambios.'); },
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
  aord: i => { S.aord = +i; S.aordSel = i == 0 ? { hemo: true, lip: true } : {}; S.aoq = ''; },
  aoTog: k => { S.aordSel[k] = !S.aordSel[k]; },
  aoSend: () => { if (!S.aordDone.includes(S.aord)) S.aordDone.push(S.aord); toast(`Enviado a ${AORD[S.aord][0].split(' ')[0]}: ${Object.values(S.aordSel).filter(Boolean).length} exámenes. Le avisamos por notificación push para que confirme.`); },
});

/* ---------- P40 · Exámenes: tres caminos ---------- */
const pathCard = (p, i, t, d, on, go = '') => `<button class="pathc ${on ? 'on' : ''}" ${go ? `data-go="${go}"` : `data-act="path" data-arg="${p}"`}><span class="pi">${ic(i, on)}</span><span class="tx"><b>${t}</b><span>${d}</span></span></button>`;
def({ id: 'P40', name: 'Exámenes de laboratorio', kind: 'page', back: true, title: 'Exámenes de laboratorio', next: ['P16', 'P60', 'P61', 'P62', 'P63'],
  prep: () => { S.item = 'mue'; },
  body: () => {
    const orden = S.mmode === 'orden';
    const paths = `<div class="paths mt16">${pathCard('cat', 'list-checks', 'Elegir mis exámenes', 'Busca y marca', !orden)}${pathCard('orden', 'camera', 'Subir foto de mi orden', 'Los elegimos por ti', orden)}${pathCard('', 'chat-circle-dots', 'Ayúdame a elegir', 'Según para qué es', false, 'P63')}</div>`;
    const head = `<div class="t2 sm">${Object.keys(EXAMS).length} exámenes. ${first()} solo cobra la toma a domicilio.</div>${paths}`;
    if (orden) {
      const stt = S.ord === 'rev' ? row('box:hourglass-medium', 'Estamos revisando tu orden', 'Te avisamos por notificación push', 'P61', st('inf', 'En revisión', ''))
        : S.ord === 'listo' ? row('box:list-checks', `Seleccionamos ${ORD5.length} exámenes`, 'Revísalos y confírmalos', 'P62', st('ok', 'Lista', ''))
        : S.ord === 'ok' ? row('box:check-circle', 'Orden confirmada', nEx(), 'P16', st('ok', 'Confirmada', '')) : '';
      return `${head}<div class="mt16">${note('sparkle', 'Sube una foto de tu orden y nuestro equipo marca los exámenes por ti. Tú confirmas los precios antes de pagar.', 'ok')}</div>${stt ? `<div class="mt16">${stt}</div>` : `<div class="lbl2">Cómo funciona</div>${[['camera', 'Sacas una foto a la orden', 'Papel o PDF, la de cualquier médico'], ['magnifying-glass', 'La revisamos en menos de 30 min', 'En horario hábil, con el catálogo del laboratorio'], ['check-circle', 'Confirmas los exámenes y el precio', 'Puedes editar antes de pagar']].map(t => row('box:' + t[0], t[1], t[2], '', '')).join('')}`}`;
    }
    return `${head}<div class="mt16">${note('check-circle', 'No necesitas orden: nosotros la gestionamos por ti.', 'ok')}</div>
    ${pkAct() ? `<div class="pkon mt16"><span class="ri box">${ic('package')}</span><span class="tx"><b>Pack ${pkAct()[1]}</b><span class="xs t2">${pkAct()[4].length} exámenes · ahorras ${clp(pkD())}</span></span><button class="lk sm" data-act="pkOff">Quitar</button></div>` : S.pack ? `<div class="mt16">${note('info', 'Quitaste un examen del pack, así que ahora se cobran por separado.')}</div>` : ''}
    ${pkSec()}
    ${labsNear()}
    <div class="lbl2">Buscar exámenes</div><div>${qin('exq', 'exres', 'Busca: hemograma, vitamina D, 0301045…', 'exLim')}</div><div id="exres">${QRES.exres()}</div>
    <div class="lbl2">Orden médica</div>${checkRow('Necesito orden médica', S.needOrd, 'tog', 'needOrd', 'La gestionamos con un médico · precio por confirmar')}
    <div class="xs t3 mt8">Precio Cuidapp: precio convenido con el laboratorio. Precio particular: valor de lista cuando no hay precio Cuidapp.</div>`;
  },
  foot: () => S.mmode === 'orden'
    ? (S.ord === 'ok' ? `<div class="fbar"><div class="fb-l"><b class="num">${clp(examSum())}</b><span>${nEx()}</span></div><button class="btn fbtn" data-go="P16">Continuar</button></div>`
      : S.ord === 'listo' ? btn(`Ver los ${ORD5.length} exámenes`, 'P62') : S.ord === 'rev' ? btn('Ver estado', 'P61', 'sec') : btn(`${ic('camera')}Subir foto de mi orden`, 'P60'))
    : `<div class="fbar"><div class="fb-l"><b class="num">${clp(examSum())}</b><span>${examList().length === 1 ? '1 examen' : examList().length + ' exámenes'}${S.needOrd ? ' + orden' : ''} · toma aparte</span></div><button class="btn fbtn" data-go="P16" ${examList().length ? '' : 'disabled'}>Continuar</button></div>` });

def({ id: 'P60', name: 'Subir foto de la orden', kind: 'page', back: true, title: 'Tu orden médica', next: ['P61'],
  body: () => `<div class="h-m">Sube la foto de tu orden</div><div class="t2 sm mt8">Nuestro equipo la lee y marca los exámenes por ti. Antes de pagar ves la lista con precios.</div>
  <div class="drop mt16"><div class="row8"><button class="pill on" data-act="ordUp" data-go="P61">${ic('camera')}Tomar foto</button><button class="pill" data-act="ordUp" data-go="P61">${ic('image')}Elegir de fotos</button><button class="pill" data-act="ordUp" data-go="P61">${ic('file-arrow-up')}PDF</button></div><div class="t3 sm">Foto completa, derecha y con luz</div></div>
  <div class="lbl2">Que se vea</div>${['Nombre del paciente', 'Exámenes indicados', 'Nombre y firma del médico'].map(t => `<div class="chk">${ic('check')}<span>${t}</span></div>`).join('')}
  <div class="mt16">${note('info', '¿No tienes orden? No es obligatoria: elige tus exámenes y nosotros la gestionamos.')}</div>`,
  foot: () => btn('Mejor elijo yo', 'P40', 'ghost', 'data-act="path" data-arg="cat"') });

def({ id: 'P61', name: 'Estamos revisando tu orden', kind: 'page', back: true, title: '', next: ['P62'], auto: 'P62', autoAct: () => ACT.ordReady(),
  prep: () => { if (!S.ord) S.ord = 'rev'; },
  body: () => `<div class="center mt8"><div class="recok" style="justify-content:center">${orden()}</div></div><div class="h-l mt16">Estamos revisando tu orden</div><div class="t2 sm mt8">Nuestro equipo marca los exámenes del catálogo. Suele tardar menos de 30 minutos en horario hábil.</div>
  <div class="tl3 mt16">${[['check-circle', 'Orden recibida', 'Hoy 10:31', 'ok'], ['hourglass-medium', 'Revisando exámenes', 'En curso', 'on'], ['list-checks', 'Lista para que confirmes', 'Te avisamos por notificación push', '']].map(t => `<div class="tl3r ${t[3]}">${ic(t[0], t[3] === 'ok')}<div><b>${t[1]}</b><span>${t[2]}</span></div></div>`).join('')}</div>`,
  foot: () => `${btn('Seguir explorando', 'P06', 'sec')}`,
  enter: () => T(() => { if (cur === 'P61') { ACT.ordReady(); go('P62'); } }, 3500) });

def({ id: 'P62', name: 'Seleccionamos tus exámenes', kind: 'page', back: true, title: '', next: ['P16', 'P40'],
  prep: () => { if (!S.ordSel) ACT.ordReady(); },
  body: () => { const l = S.ordSel || ORD5, tot = l.reduce((a, k) => a + EXAMS[k][1], 0);
    return `<button class="push" data-go="P62"><div class="push-h"><img src="logo/apple-touch-icon.png" alt=""><span>Cuidapp</span><span class="t3">ahora</span></div><b>Tu orden está lista</b><div>Seleccionamos ${l.length} exámenes. Revísalos y confirma.</div></button>
    <div class="h-l mt16">Seleccionamos ${l.length} exámenes</div><div class="t2 sm mt4">Según la orden de la Dra. Marcela Ortiz · revisada por nuestro equipo</div>
    <div class="exl mt8">${l.map(k => `<div class="exr"><span class="tx"><span class="a">${EXAMS[k][0]}</span><span class="b">${exSub(k)}</span></span><span class="exp"><span class="pp num">${clp(EXAMS[k][1])}</span>${ptag(k)}</span></div>`).join('')}</div>
    ${kv('Total exámenes', clp(tot), 'tot')}<div class="mt12">${note('lock-simple', 'No cobramos nada hasta que confirmes y la profesional acepte la toma.', 'inf')}</div>`; },
  foot: () => `<div class="row8">${abtn('Editar', 'ordEdit', '', 'sec', 'P40')}${abtn('Confirmar', 'ordOk', '', '', 'P16')}</div>` });

def({ id: 'P63', name: 'Ayúdame a elegir', kind: 'page', back: true, title: 'Ayúdame a elegir', next: ['P40', 'P60'],
  body: () => `<div class="h-m">¿Para qué son los exámenes?</div><div class="t2 sm mt4">Te sugerimos los más pedidos. Puedes quitar o agregar después.</div>
  <div class="hgrid mt16">${Object.entries(HELP).map(([k, h]) => `<button class="hcell ${S.help === k ? 'on' : ''}" data-act="help" data-arg="${k}">${ic(h[1], S.help === k)}<span>${h[0]}</span></button>`).join('')}</div>
  ${S.help ? `<div class="lbl2">Sugeridos · ${HELP[S.help][0]}</div><div class="exl">${HELP[S.help][2].map(k => `<div class="exr"><span class="tx"><span class="a">${EXAMS[k][0]}</span><span class="b">${exSub(k)}</span></span><span class="exp"><span class="pp num">${clp(EXAMS[k][1])}</span>${ptag(k)}</span></div>`).join('')}</div>` : ''}
  <div class="mt16">${note('info', 'Es una guía general y no reemplaza la indicación de tu médico. Si tienes una orden, súbela y la revisamos.')}</div>
  ${row('box:chat-circle-dots', 'Prefiero hablar con alguien', 'Chat con nuestro equipo · respuesta en minutos', '', ic('caret-right'), '', 'toast', 'Te escribimos por WhatsApp en menos de 10 minutos.')}${row('box:camera', 'Tengo una orden', 'Sube la foto y elegimos por ti', 'P60', ic('caret-right'), '', 'path', 'orden')}`,
  foot: () => abtn(S.help ? `Agregar ${HELP[S.help][2].length} exámenes` : 'Elige un motivo', 'helpAdd', '', '', 'P40', !S.help) });

/* ---------- Previsión de salud ---------- */
const pvBlock = w => { const p = S.pv[w];
  return `${radioRow('Fonasa', 'Tramo opcional', p.t === 'fonasa', 'pvT', w + '|fonasa', 'shield-check')}${p.t === 'fonasa' ? `<div class="chips sub">${['A', 'B', 'C', 'D'].map(t => chip('Tramo ' + t, p.tr === t, 'pvTr', w + '|' + t)).join('')}</div>` : ''}
  ${radioRow('Isapre', p.t === 'isapre' && p.is ? p.is : 'Elige tu isapre', p.t === 'isapre', 'pvT', w + '|isapre', 'buildings')}${p.t === 'isapre' ? `<div class="chips sub">${ISAPRES.map(t => chip(t, p.is === t, 'pvIs', w + '|' + t)).join('')}</div>` : ''}
  ${radioRow('Particular', 'Sin previsión o prefiero no usarla', p.t === 'part', 'pvT', w + '|part', 'wallet')}`; };
def({ id: 'P64', name: 'Previsión de salud', kind: 'page', back: true, title: 'Previsión de salud',
  body: () => { const w = pvW(); return `<div class="t2 sm">${patN(w)} · RUT ${RUTS[w]}</div><div class="mt12">${pvBlock(w)}</div>${S.pv[w].t === 'isapre' ? `<div class="mt12">${S.isa[w] ? row('box:link', `${S.isa[w].is} vinculada`, 'Reembolso automático activo', 'P82', st('ok', 'Activa'), '', 'lkW', w) : row('box:link', 'Reembolso automático', `Vincula ${S.pv[w].is || 'tu Isapre'} una vez y enviamos los reembolsos por ti`, 'P78', '<span class="lk">Vincular</span>', '', 'lkW', w)}</div>` : ''}
  <div class="mt12">${row('box:chart-bar', 'Cotiza tu Isapre', 'Asesores de Isapre comparan planes para ti', 'P89')}</div>
  <div class="mt16">${note('receipt', 'La usamos para emitir tus boletas para reembolso: van con tu RUT, tu previsión y los códigos Fonasa de cada examen.')}</div>`; },
  foot: () => btn('Guardar', 'back') });

/* ---------- Documentos para reembolso ---------- */
const reembolsoBlock = () => { const m = S.item === 'mue';
  return `<div class="rmb mt8"><div class="rmb-h">${ic('receipt')}<b>Boleta para reembolso</b></div>
  <div class="rmb-r"><span>Paciente</span><b>${patN(S.who)} · RUT ${RUTS[S.who]}</b></div><div class="rmb-r"><span>Previsión</span><b>${pvTxt()}</b></div>
  ${m ? `<div class="rmb-r"><span>Exámenes</span><b>${examList().length ? examKeys().slice(0, 3).map(k => EXAMS[k][6] || EXAMS[k][5]).join(', ') + (examKeys().length > 3 ? ` y ${examKeys().length - 3} más` : '') : 'Se agregan al confirmar la orden'}</b></div>` : ''}
  <div class="rmb-r"><span>${m ? 'Toma de muestra' : 'Atención'}</span><b>Boleta de honorarios de ${PRO().n.split(' ').slice(0, 2).join(' ')}</b></div>
  <button class="lk mt8" data-go="P65">${ic('file-pdf')}Ver documentos para reembolso</button></div>`; };
def({ id: 'P65', name: 'Documentos para reembolso', kind: 'page', back: true, title: 'Para tu reembolso',
  body: () => { const m = S.item === 'mue', w = S.who, pr = PRO(), p = price(); const toma = m ? p.pro : p.total;
    return `${(S.pv[w] || {}).t === 'isapre' ? `<div class="mb12">${S.isa[w] ? row('box:lightning', 'Reembolso automático', `Lo enviamos a ${S.isa[w].is} por ti`, 'P80', st('ok', 'Activo')) : row('box:link', 'Que lo envíe Cuidapp', `Vincula ${S.pv[w].is} y no tienes que subir nada`, 'P78', '<span class="lk">Vincular</span>', '', 'lkW', w)}</div>` : ''}<div class="pdfp"><div class="pdh"><div><b>Cuidapp</b><div class="xs t2">Documentos para reembolso · ${DAYS[S.day][3].replace(/^(hoy )?\S+ /, '')} 2026</div></div>${ic('file-pdf', 1)}</div>
    <div class="xs t2 mt8">Paciente: <b style="color:var(--text)">${patN(w)}</b> · RUT ${RUTS[w]} · ${pvTxt(w)}</div>
    ${m ? `<div class="rmbs mt12"><b>1. Boleta de exámenes</b><table class="rtab mt8"><tr><th>Código</th><th>Examen</th><th>Valor</th></tr>${examKeys().map(k => `<tr><td class="num">${EXAMS[k][6] || EXAMS[k][5] || 's/c'}</td><td>${EXAMS[k][0]}</td><td class="num">${clp(EXAMS[k][1])}</td></tr>`).join('')}<tr><td></td><td><b>Total</b></td><td class="num"><b>${clp(examSum())}</b></td></tr></table>${examKeys().some(k => !EXAMS[k][6]) ? '<div class="xs t3 mt4">Sin código Fonasa: consulta con tu previsión si lo cubre.</div>' : ''}</div>` : ''}
    <div class="rmbs mt12"><b>${m ? '2' : '1'}. Boleta de honorarios electrónica</b><table class="rtab mt8"><tr><td>Profesional</td><td>${pr.n} · ${pr.t}</td></tr><tr><td>RUT</td><td class="num">${PRUT[pr.id] || PRUT.cr}</td></tr><tr><td>Prestación</td><td>${m ? 'Toma de muestra venosa a domicilio · cód. 0307011' : CAT[S.item].n + ' a domicilio'}</td></tr><tr><td>Valor</td><td class="num">${clp(toma)}</td></tr></table></div>
    ${m ? `<div class="rmbs mt12"><b>3. Orden médica</b><div class="xs t2 mt4">${S.orden === 'si' ? 'Foto de tu orden · Dra. Marcela Ortiz R.' : S.needOrd ? 'Gestionada por Cuidapp · se adjunta al emitirla' : 'Si tu previsión la pide, podemos gestionarla por ti.'}</div></div>` : ''}</div>
    <div class="lbl2">Cómo pedir el reembolso</div>
    ${row('box:buildings', 'Isapre', 'En la app o el sitio de tu isapre, sección reembolsos: sube la boleta y la orden médica.', '', '')}
    ${row('box:shield-check', 'Fonasa', 'Consulta en una sucursal Fonasa o en fonasa.cl si aplica bono o reembolso para estas prestaciones.', '', '')}
    <div class="xs t3 mt8">Lo que te devuelven depende de tu plan y de tu previsión.</div>`; },
  foot: () => `${abtn(ic('download-simple') + 'Descargar documentos para reembolso', 'toast', 'Descargado: Reembolso-' + patN(S.who).split(' ').slice(0, 2).join('-').normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '.pdf (boletas y orden).')}${abtn(ic('envelope-simple') + 'Enviar a mi correo', 'toast', 'Te enviamos los documentos a daniela.fuentes@gmail.com.', 'sec')}` });

/* ---------- Admin: catálogo completo y órdenes por revisar ---------- */
const AORD = [['Rosa Muñoz Pérez', 'Ñuñoa', 'Hace 6 min', 'Dra. Marcela Ortiz R.'], ['Jorge Salinas Vera', 'Providencia', 'Hace 18 min', 'Dr. Andrés Lagos'], ['Carmen Ibarra Soto', 'La Reina', 'Hace 41 min', 'Dra. Paz Fuenzalida']];
QRES.aexres = () => {
  const q = S.aexq || '', f = S.aexF || 'all', per = 25;
  let l = q.trim() ? exFind(q) : Object.keys(EXAMS);
  if (f === 'c') l = l.filter(k => EXAMS[k][4] === 'c'); if (f === 'p') l = l.filter(k => EXAMS[k][4] === 'p'); if (f === 'sf') l = l.filter(k => !EXAMS[k][6]);
  const pg = Math.min(S.aexPage || 0, Math.max(0, Math.ceil(l.length / per) - 1)), n = Math.max(1, Math.ceil(l.length / per));
  return `<table class="t mt12"><tr><th>Código</th><th>Fonasa</th><th>Examen</th><th>Muestra</th><th>Plazo</th><th style="text-align:right">Precio</th><th>Tipo</th></tr>
  ${l.slice(pg * per, pg * per + per).map(k => { const e = EXAMS[k]; return `<tr><td class="num">${e[5] || '—'}</td><td class="num">${e[6] || '<span class="t3">—</span>'}</td><td>${q ? hl(e[0], q) : e[0]}</td><td class="t2">${e[7] || '—'}</td><td class="t2">${e[8] || '—'}</td><td class="num" style="text-align:right">${clp(e[1])}</td><td>${ptag(k)}</td></tr>`; }).join('')}</table>
  <div class="pgr mt12"><span class="t2 sm">${l.length} exámenes · página ${pg + 1} de ${n}</span><span class="sp"></span><button class="pill" data-act="aexPg" data-arg="-1" ${pg ? '' : 'disabled'}>${ic('caret-left')}Anterior</button><button class="pill" data-act="aexPg" data-arg="1" ${pg < n - 1 ? '' : 'disabled'}>Siguiente${ic('caret-right')}</button></div>`;
};
def({ id: 'A08', name: 'Catálogo de exámenes', kind: 'adm', side: 'lab',
  body: () => { const all = Object.keys(EXAMS), c = all.filter(k => EXAMS[k][4] === 'c').length, f = S.aexF || 'all';
    return `<div class="ahd"><div><h1 class="h-xl">Catálogo de exámenes</h1><div class="t2 sm mt4">Importado desde el Excel del laboratorio el 26 oct 2026</div></div><button class="btn sec" style="width:auto;padding:0 18px" data-act="toast" data-arg="Sube el Excel actualizado y te mostramos los cambios antes de publicarlos.">${ic('file-arrow-up')}Importar Excel</button></div>
    <div class="kpis mt16">${[[all.length, 'Exámenes publicados'], [c, 'Con precio Cuidapp'], [all.length - c, 'Con precio particular'], [all.filter(k => EXAMS[k][6]).length, 'Con código Fonasa']].map(t => `<div class="kpi"><b class="num">${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div>
    <div class="row8 mt16" style="align-items:center"><div style="flex:1;max-width:420px">${qin('aexq', 'aexres', 'Buscar por nombre o código', 'aexPage')}</div><div class="chips">${[['all', 'Todos'], ['c', 'Precio Cuidapp'], ['p', 'Precio particular'], ['sf', 'Sin código Fonasa']].map(t => chip(t[1], f === t[0], 'aexF', t[0])).join('')}</div></div>
    <div id="aexres">${QRES.aexres()}</div><div class="xs t3 mt12">Se muestra el precio Cuidapp cuando existe; si no, el precio particular. Los costos internos del Excel no se publican.</div>`; } });

def({ id: 'A09', name: 'Órdenes por revisar', kind: 'adm', side: 'ord', next: ['A10'],
  body: () => `<div class="ahd"><div><h1 class="h-xl">Órdenes por revisar</h1><div class="t2 sm mt4">Fotos de órdenes médicas subidas por pacientes. Marca los exámenes del catálogo y envíalos para que confirmen.</div></div></div>
  <table class="t mt16"><tr><th>Paciente</th><th>Comuna</th><th>Médico</th><th>Recibida</th><th>Estado</th><th></th></tr>
  ${AORD.map((o, i) => `<tr><td><b>${o[0]}</b></td><td>${o[1]}</td><td class="t2">${o[3]}</td><td class="t2">${o[2]}</td><td>${S.aordDone.includes(i) ? st('ok', 'Enviada') : st('warn', 'Por revisar')}</td><td><button class="pill" data-act="aord" data-arg="${i}" data-go="A10">Revisar</button></td></tr>`).join('')}</table>
  <div class="mt16" style="max-width:560px">${note('clock', 'Meta: responder en menos de 30 minutos en horario hábil. La paciente recibe una notificación push cuando la orden está lista.')}</div>` });

QRES.aores = () => { const q = S.aoq || ''; const l = q.trim() ? exFind(q, 12) : EXPOP;
  return `<div class="exl">${l.map(k => exRow(k, q, 'aoTog', !!S.aordSel[k])).join('')}</div>`; };
def({ id: 'A10', name: 'Revisar orden', kind: 'adm', side: 'ord', back: true,
  body: () => { const o = AORD[S.aord], sel = Object.keys(S.aordSel).filter(k => S.aordSel[k]), tot = sel.reduce((a, k) => a + EXAMS[k][1], 0);
    return `<button class="lk" data-go="A09">${ic('caret-left')}Órdenes por revisar</button><div class="ahd mt8"><div><h1 class="h-xl">${o[0]}</h1><div class="t2 sm mt4">${o[1]} · ${o[3]} · ${o[2]}</div></div></div>
    <div class="aord mt16"><div class="aord-l"><div class="lbl2" style="margin-top:0">Foto de la orden</div>${orden()}</div>
    <div class="aord-r"><div class="lbl2" style="margin-top:0">Marca los exámenes del catálogo</div>${qin('aoq', 'aores', 'Buscar entre ' + Object.keys(EXAMS).length + ' exámenes')}<div id="aores">${QRES.aores()}</div>
    <div class="lbl2">Seleccionados · ${sel.length}</div>${sel.length ? sel.map(k => kv(`${EXAMS[k][0]} <span class="t3 xs">${fon(k)}</span>`, clp(EXAMS[k][1]))).join('') + kv('Total', clp(tot), 'tot') : '<div class="sm t3">Aún no marcas exámenes.</div>'}
    <div class="row8 mt16">${abtn('Pedir foto nueva', 'toast', 'Le pedimos a la paciente una foto más nítida de la orden.', 'sec')}${abtn('Enviar a la paciente', 'aoSend', '', '', 'A09', !sel.length)}</div></div></div>`; } });
