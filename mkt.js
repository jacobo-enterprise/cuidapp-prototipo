/* ===== Marketplace: laboratorios, «Cotiza tu Isapre» (asesores), profesiones, entrega de muestras y liquidaciones =====
   Laboratorios, asesores, precios y planes son FICTICIOS / DE EJEMPLO.
   Modelo de laboratorios: cada laboratorio envía su lista de precios (Excel); Cuidapp aplica un recargo y cobra a la paciente.
   La enfermera solo toma la muestra y la entrega. Cuidapp liquida con cada laboratorio (semanal, quincenal o mensual).
   El costo del laboratorio y el margen solo se ven en Admin. */

/* ---------- Profesiones (modelo genérico: PROS[i].k) ---------- */
const PROFS = [
  { k: 'enf', n: 'Enfermera', i: 'first-aid-kit', on: true },
  { k: 'tens', n: 'TENS', i: 'syringe', on: true },
  { k: 'kin', n: 'Kinesiólogo', i: 'person-simple-walk' },
  { k: 'psi', n: 'Psicólogo', i: 'brain' },
  { k: 'med', n: 'Telemedicina', i: 'video-camera' },
  { k: 'nut', n: 'Nutricionista', i: 'carrot' },
  { k: 'mat', n: 'Matrona', i: 'baby' },
  { k: 'fon', n: 'Fonoaudiólogo', i: 'ear' },
  { k: 'tO', n: 'Terapeuta ocupacional', i: 'hand-heart' },
];
const profOf = p => PROFS.find(x => x.k === p.k) || PROFS[0];
/* tarjetas de «Buscar por profesional»: ilustración 3D de color (img/profesionales, Fluent Emoji 3D), fondo suave por profesión,
   disponibilidad real del prototipo (profesionales cercanas con foto); las que aún no están muestran «Muy pronto» discreto */
const PRFX = { enf: '#FDE7EE', tens: '#E3F2FD', kin: '#FFF1D6', psi: '#FCE4F3', med: '#E3F4FB', nut: '#FFE9D6', mat: '#EDE7FD', fon: '#FFF4D2', tO: '#E6F6E4' };
const profRow = () => `<div class="shd mt24"><h3>Buscar por profesional</h3></div><div class="prfr">${PROFS.map(f => { const ps = PROS.filter(p => p.k === f.k), av3 = ps.slice(0, 3); return `<button class="prf ${f.on ? '' : 'dim'}" style="--pc:${PRFX[f.k] || '#F1F1FE'}" data-act="${f.on ? 'profGo' : 'profAv'}" data-arg="${f.k}" ${f.on ? 'data-go="P07"' : ''}><span class="pri"><img src="img/profesionales/${f.k}.webp?v=prf1" alt="" draggable="false"></span><span class="prn">${f.n}</span>${f.on ? `<span class="prm"><span class="cav xs">${av3.map(p => av(p.i, 'xs')).join('')}</span><span class="xs t2">${ps.length} cerca</span></span>` : `<span class="prm pws${S.profAv[f.k] ? ' ok' : ''}">${S.profAv[f.k] ? `${ic('bell-ringing')}Te avisamos` : 'Muy pronto'}</span>`}</button>`; }).join('')}</div>`;

/* ---------- Laboratorios (ficticios) ---------- */
const LABS = [
  { id: 'la', n: 'LabAndes Clínico', ini: 'LA', c: '#E9E8FD', fg: '#4447C2', km: 1.2, r: '4,8', nr: 412, hrs: 'Lun a vie 07:00–19:00 · sáb 08:00–13:00', ab: 'Abierto hasta 19:00', mods: ['dom', 'pre'], dir: 'Av. Irarrázaval 3120, Ñuñoa', sucs: [['Ñuñoa', 'Av. Irarrázaval 3120', 1.2], ['Providencia', 'Av. Providencia 2155', 3.4]], f: 1.0, freq: 'quincenal', no: [], rec: 'Lun a vie hasta 12:00 · sáb hasta 11:00', mes: 'Mesón «Recepción de muestras», 1.er piso' },
  { id: 'pz', n: 'Laboratorio Plaza Egaña', ini: 'PE', c: '#F3ECFF', fg: '#6B3FC9', km: 2.1, r: '4,7', nr: 236, hrs: 'Lun a sáb 07:30–14:00', ab: 'Abierto hasta 14:00', mods: ['pre'], dir: 'Av. Larraín 5862, La Reina', sucs: [['La Reina', 'Av. Larraín 5862', 2.1]], f: 0.94, freq: 'mensual', no: ['x191'], rec: 'Lun a sáb hasta 11:30', mes: 'Ventanilla 2, entrada por Av. Larraín' },
  { id: 'bl', n: 'Biocentro Los Leones', ini: 'BL', c: '#EAF0FF', fg: '#3E5BB8', km: 2.8, r: '4,9', nr: 588, hrs: 'Lun a vie 07:00–20:00 · sáb 08:00–14:00', ab: 'Abierto hasta 20:00', mods: ['dom', 'pre'], dir: 'Av. Los Leones 1240, Providencia', sucs: [['Providencia', 'Av. Los Leones 1240', 2.8], ['Las Condes', 'Av. Apoquindo 4499', 6.1]], f: 1.06, freq: 'semanal', no: [], rec: 'Lun a vie hasta 13:00 · sáb hasta 12:00', mes: 'Recepción de muestras externas, piso -1' },
  { id: 'ls', n: 'LabSur Macul', ini: 'LS', c: '#F0EEF8', fg: '#5557D9', km: 3.5, r: '4,6', nr: 154, hrs: 'Lun a vie 07:30–17:00', ab: 'Abierto hasta 17:00', mods: ['dom'], dir: 'Av. Macul 2890, Macul', sucs: [['Macul', 'Av. Macul 2890', 3.5]], f: 0.9, freq: 'mensual', no: ['tsh', 't4'], rec: 'Lun a vie hasta 11:00', mes: 'Mesón de toma de muestras' },
];
const labOf = id => LABS.find(l => l.id === id) || LABS[0];
const labHas = (l, k) => !l.no.includes(k);
const mkOf = (l, k) => { const m = S.mkL[l.id] || {}; return (m.ex && m.ex[k] != null) ? m.ex[k] : (m.g != null ? m.g : S.mkG); };
const lcost = (l, k) => Math.round(EXAMS[k][1] * l.f / 1.15 / 10) * 10; /* precio del laboratorio (Excel) · solo Admin */
const lpp = (l, k) => Math.round(lcost(l, k) * (1 + mkOf(l, k) / 100) / 10) * 10; /* precio a la paciente */
const MODN = { dom: 'A domicilio', pre: 'Presencial' };
const labLogo = (l, cls = '') => `<span class="lbl-lg ${cls}" style="background:${l.c};color:${l.fg}">${ic('flask', 1)}<b>${l.ini}</b></span>`;
const modTags = l => l.mods.map(m => `<span class="mtag">${ic(m === 'dom' ? 'house-line' : 'storefront')}${MODN[m]}</span>`).join('');
const labCard = l => `<button class="labc" data-act="lab" data-arg="${l.id}" data-go="P84">${labLogo(l)}<span class="tx"><b>${l.n}</b><span class="xs t2">${String(l.km).replace('.', ',')} km · ${ic('star', 1)} ${l.r} (${l.nr}) · ${l.ab}</span><span class="mtags">${modTags(l)}</span></span>${ic('caret-right')}</button>`;
const labsNear = () => `<div class="shd mt24"><h3>Laboratorios cerca de ti</h3><button class="lk sm" data-go="P83">Ver todos</button></div><div class="xs t2">Cerca de ${P().n}, ${P().c}</div><div class="labl mt8">${LABS.slice(0, 3).map(labCard).join('')}</div><button class="lk sm mt8" data-act="lbFrom" data-go="P88">${ic('arrows-down-up')}Comparar precios entre laboratorios</button>`;
const selEx = () => Object.keys(S.exams).filter(k => S.exams[k]);
const labSel = l => (S.lbEx.length ? S.lbEx : ['hemo', 'lip']).filter(k => labHas(l, k));
const TOMA_D = () => CAT.mue.base;
const lbTot = () => { const l = labOf(S.labId), ex = labSel(l), s = ex.reduce((a, k) => a + lpp(l, k), 0), t = S.lbMode === 'dom' ? TOMA_D() : 0, sf = svcFeeOf(s + t); return { l, ex, s, t, sf, tot: s + t + sf }; };
const mapThumb = l => `<div class="mapt"><span class="mpin">${ic('map-pin', 1)}</span><span class="mlab">${l.dir}</span></div>`;

/* ---------- Asesores de Isapre (ficticios) ---------- */
const ASES = [
  { id: 'mi', n: 'Macarena Ibáñez', i: 'MIb', is: ['Colmena'], r: '4,9', nr: 128, yrs: 9, reg: 'AS-10482', resp: '15 min', bio: 'Te ayudo a comparar planes según tu edad, renta y cargas. Explico la letra chica antes de que firmes.' },
  { id: 'rv', g: 'm', n: 'Rodrigo Valdés', i: 'RVa', is: ['Cruz Blanca'], plus: true, r: '4,8', nr: 96, yrs: 7, reg: 'AS-11730', resp: '30 min', bio: 'Especialista en planes familiares y cambios de Isapre con preexistencias declaradas.' },
  { id: 'ch', n: 'Constanza Herrera', i: 'CHe', is: ['Banmédica'], r: '4,9', nr: 71, yrs: 5, reg: 'AS-12215', resp: '20 min', bio: 'Planes para independientes y primeras cotizaciones. Atiendo por videollamada o WhatsApp.' },
  { id: 'fa', g: 'm', n: 'Felipe Araya', i: 'FAr', is: ['Consalud'], r: '4,7', nr: 54, yrs: 4, reg: 'AS-12904', resp: '1 h', bio: 'Comparo planes con buena cobertura en clínicas del sector oriente.' },
  { id: 'jc', n: 'Javiera Castro', i: 'JCa', is: ['Banmédica'], plus: true, r: '5,0', nr: 203, yrs: 14, reg: 'AS-08311', resp: '25 min', bio: 'Más de 14 años asesorando a adultos mayores y familias con cargas.' },
];
const aseT = a => a.g === 'm' ? 'Asesor de Isapre' : 'Asesora de Isapre';
const aseOf = id => ASES.find(a => a.id === id) || ASES[0];
const aseIsa = a => a.is[0];
const asePlus = a => a.id === 'mi' ? S.qa.plus : !!a.plus;
const RENTAS = ['Hasta $800.000', '$800.000 – $1.500.000', '$1.500.000 – $2.500.000', '$2.500.000 – $4.000.000', 'Más de $4.000.000'];
const aseIs = a => `<div class="chips mt8"><span class="chip sm st0">${ic('shield-check')}Asesora solo ${aseIsa(a)}</span></div>`.replace('Asesora', a.g === 'm' ? 'Asesor' : 'Asesora');

Object.assign(ACT, {
  profGo: k => { S.f = { enf: k === 'enf', tens: k === 'tens' }; S.scope = ''; toast(`Mostrando solo ${PROFS.find(x => x.k === k).n}. Elige el servicio.`); },
  profAv: k => { S.profAv[k] = true; toast(`${PROFS.find(x => x.k === k).n}: muy pronto en Cuidapp. Te avisamos con una notificación push.`); },
  lab: id => { S.labId = id; const l = labOf(id); S.lbMode = l.mods[0]; S.lbSuc = 0; if (!S.lbEx.length) S.lbEx = selEx().length ? selEx() : ['hemo', 'lip']; },
  lbMode: m => { S.lbMode = m; },
  lbEx: k => { S.lbEx = S.lbEx.includes(k) ? S.lbEx.filter(x => x !== k) : [...S.lbEx, k]; },
  lbSuc: i => { S.lbSuc = +i; },
  lbDay: d => { S.lbDay = d; }, lbHr: h => { S.lbHr = h; },
  lbSort: s => { S.lbSort = s; },
  lbFrom: () => { S.lbEx = selEx().length ? selEx() : ['hemo', 'lip']; },
  lbPay: () => { S.lbDone = true; },
  cqA: v => { S.cq.age = v; }, cqR: i => { S.cq.r = +i; }, cqD: v => { S.cq.dep = +v; }, cqI: v => { S.cq.is = v; },
  ase: id => { S.ase = id; },
  aseReq: id => { if (!S.aseOk[id]) return toast('Marca la casilla para aceptar el contacto.'); S.ase = id; S.aseSent[id] = true; },
  aseOk: id => { S.aseOk[id] = !S.aseOk[id]; },
  qPlus: () => { S.qa.plus = !S.qa.plus; },
  unl: i => { S.unl[+i] = true; toast(`Contacto desbloqueado. Pagaste ${clp(S.pz.unl)} con Mercado Pago (ejemplo).`); },
  pz: a => { const [k, d] = a.split(':'); S.pz[k] = Math.max(0, S.pz[k] + (+d)); },
  pDest: () => { S.dest.cr = !S.dest.cr; toast(S.dest.cr ? `Listo: apareces primero con la etiqueta «Destacado». ${clp(S.pz.pdest)} al mes con Mercado Pago.` : 'Destacado desactivado. Sigues apareciendo en los resultados normales.'); },
  qIs: v => { S.qa.is = [v]; ASES[0].is = [v]; },
  qPlan: v => { S.qa.plan = v; },
  qPay: () => { S.qa.paid = true; toast(S.qa.plan === 'free' && !S.qa.plus ? 'Listo: ya apareces gratis en «Cotiza tu Isapre».' : 'Pago con Mercado Pago aprobado (ejemplo).'); },
  lead: i => { S.lead = +i; },
  leadSt: () => { S.leadSt[S.lead] = 'cot'; toast('Cotización enviada. La paciente la recibe con una notificación push.'); },
  mueUp: () => { S.mue.up = !S.mue.up; },
  mueChk: k => { S.mue[k] = !S.mue[k]; },
  mueDone: () => { S.mue.done = true; toast('Muestra entregada. Avisamos a Daniela que está en el laboratorio.'); },
  aLab: id => { S.aLab = id; },
  aMk: d => { const m = S.mkL[S.aLab] || (S.mkL[S.aLab] = {}); m.g = Math.max(15, Math.min(60, (m.g != null ? m.g : S.mkG) + (+d))); },
  aMkEx: a => { const [k, d] = a.split(':'), m = S.mkL[S.aLab] || (S.mkL[S.aLab] = {}); m.ex = m.ex || {}; const cur = m.ex[k] != null ? m.ex[k] : mkOf(labOf(S.aLab), k); m.ex[k] = Math.max(15, Math.min(60, cur + (+d))); },
  aMkRs: k => { const m = S.mkL[S.aLab]; if (m && m.ex) delete m.ex[k]; },
  aFreq: f => { labOf(S.aLab).freq = f; toast(`Liquidación ${f} con ${labOf(S.aLab).n}.`); },
  aImp: () => { S.aImp = !S.aImp; },
  aImpOk: () => { S.aImp = false; S.aImpDone[S.aLab] = '26 oct 2026'; toast('Lista de precios publicada. Los precios a pacientes se recalcularon con el recargo.'); },
  aPer: p => { S.aPer = p; },
  aPaid: id => { S.liqPaid[S.aPer + id] = true; toast('Liquidación marcada como pagada.'); },
});

/* ===== Paciente · laboratorios ===== */
def({ id: 'P83', name: 'Laboratorios cerca de ti', kind: 'page', back: true, title: 'Laboratorios', next: ['P84'],
  body: () => { const s = S.lbSort || 'km', l = [...LABS].sort((a, b) => s === 'km' ? a.km - b.km : parseFloat(b.r.replace(',', '.')) - parseFloat(a.r.replace(',', '.')));
    return `${note('hourglass-medium', '<b>Muy pronto.</b> Podrás elegir un laboratorio y sacar hora, a domicilio o presencial. Por ahora, pide la toma de muestras a domicilio: una enfermera o TENS va a tu casa.')}${btn(`${ic('house-line')}Pedir toma a domicilio`, 'P40', 'sec mt12')}
    <div class="sm t2 mt16">Vista previa · cerca de ${P().n}, ${P().c}</div><button class="lk sm mt4" data-act="lbFrom" data-go="P88">${ic('arrows-down-up')}Comparar precios entre laboratorios</button>
    <div class="seg mt16">${[['km', 'Más cerca'], ['r', 'Mejor evaluados']].map(t => `<button class="${s === t[0] ? 'on' : ''}" data-act="lbSort" data-arg="${t[0]}">${t[1]}</button>`).join('')}</div>
    <div class="labl mt16">${l.map(labCard).join('')}</div>`; } });

def({ id: 'P84', name: 'Perfil del laboratorio', kind: 'page', back: true, title: '', next: ['P85'],
  body: () => { const l = labOf(S.labId);
    return `<div class="labh">${labLogo(l, 'xl')}<div><h1 class="h-l">${l.n}</h1><div class="sm t2 mt4">${ic('star', 1)} ${l.r} · ${l.nr} reseñas · ${String(l.km).replace('.', ',')} km</div><div class="mtags mt8">${modTags(l)}</div></div></div>
    <div class="mt16">${mapThumb(l)}</div>
    ${row('box:map-pin', l.dir, l.sucs.length > 1 ? `${l.sucs.length} sucursales` : 'Una sucursal', '', '')}${row('box:clock', 'Horario', l.hrs, '', '')}
    <div class="lbl2">Exámenes y precios</div><div class="exl">${EXPOP.filter(k => labHas(l, k)).slice(0, 8).map(k => `<div class="exr"><span class="tx"><span class="a">${EXAMS[k][0]}</span><span class="b">${EXAMS[k][7] || EXAMS[k][2]} · ${EXAMS[k][3] ? 'ayuno' : 'sin ayuno'} · ${EXAMS[k][8]}</span></span><span class="exp"><span class="pp num">${clp(lpp(l, k))}</span></span></div>`).join('')}</div>
    <div class="xs t3 mt8">Precio final que pagas en Cuidapp. Precios de ejemplo.</div>
    <div class="lbl2">Preparación</div>${row('box:fork-knife', 'Ayuno de 8 a 12 horas', 'Para glicemia, perfil lipídico y bioquímico. Puedes tomar agua.', '', '')}${row('box:drop', 'Orina', 'Primera orina de la mañana, en frasco estéril', '', '')}${row('box:pill', 'Tus medicamentos', 'Tómalos como siempre, salvo que tu médico diga otra cosa', '', '')}`; },
  foot: () => `${btn('Agendar en laboratorio · Muy pronto', '', '', 'disabled')}${btn(`${ic('house-line')}Pedir toma a domicilio`, 'P40', 'sec')}`, footOld: () => { const l = labOf(S.labId); return `<div class="row8">${l.mods.map((m, i) => abtn(ic(m === 'dom' ? 'house-line' : 'storefront') + MODN[m], 'lbMode', m, i && l.mods.length > 1 ? 'sec' : (l.mods.length > 1 ? '' : ''), 'P85')).join('')}</div>`; } });

const LDAYS = ['Mié 28', 'Jue 29', 'Vie 30', 'Sáb 31'], LHRS = ['07:30', '08:00', '08:30', '09:00', '10:00'];
def({ id: 'P85', name: 'Agendar en laboratorio', kind: 'page', back: true, title: 'Agendar', next: ['P86'],
  body: () => { const { l, ex, s, t } = lbTot(), m = S.lbMode;
    return `<div class="row8" style="align-items:center;gap:10px">${labLogo(l, 'sm')}<b>${l.n}</b></div>
    ${l.mods.length > 1 ? `<div class="seg mt16">${l.mods.map(x => `<button class="${m === x ? 'on' : ''}" data-act="lbMode" data-arg="${x}">${MODN[x]}</button>`).join('')}</div>` : `<div class="mt12"><span class="mtag">${MODN[m]}</span></div>`}
    <div class="lbl2">Exámenes</div>${EXPOP.filter(k => labHas(l, k)).slice(0, 8).map(k => checkRow(`${EXAMS[k][0]} · ${clp(lpp(l, k))}`, S.lbEx.includes(k), 'lbEx', k, ayLbl(EXAMS[k][3]))).join('')}
    ${m === 'pre' ? `<div class="lbl2">Sucursal</div>${l.sucs.map((x, i) => checkRow(`${x[0]} · ${x[1]}`, S.lbSuc === i, 'lbSuc', i, `${String(x[2]).replace('.', ',')} km de ti`)).join('')}` : `<div class="lbl2">Dirección</div>${row('box:map-pin', P().n, P().c + ' · la enfermera o TENS va a tu casa', 'P08', '<span class="lk">Cambiar</span>', '', 'set', 'addrNext=P85')}`}
    <div class="lbl2">Día</div><div class="chips">${LDAYS.map(d => chip(d, S.lbDay === d, 'lbDay', d)).join('')}</div>
    <div class="lbl2">Hora</div><div class="chips">${LHRS.map(h => chip(h, S.lbHr === h, 'lbHr', h)).join('')}</div>
    ${ayAgg(ex).h > 0 || ayAgg(ex).pend ? `<div class="mt16">${note('fork-knife', ayAgg(ex).txt + (m === 'pre' ? '. Llega en ayunas, solo agua. Lleva tu carnet y la orden médica si tienes.' : '. Solo agua antes de la toma.'), 'warn')}</div>` : ''}`; },
  foot: () => { const { ex, tot } = lbTot(); return `<div class="fbar"><div class="fb-l"><b class="num">${clp(tot)}</b><span class="xs t2">${ex.length} exámenes${S.lbMode === 'dom' ? ' · con toma' : ''}</span></div>${btn('Continuar', 'P86', 'fbtn', ex.length && S.lbDay && S.lbHr ? '' : 'disabled')}</div>`; } });

def({ id: 'P86', name: 'Pagar exámenes', kind: 'page', back: true, title: 'Revisa y paga', next: ['P87'],
  body: () => { const { l, ex, s, t, tot } = lbTot(), m = S.lbMode, su = l.sucs[S.lbSuc] || l.sucs[0];
    return `<div class="row8" style="align-items:center;gap:10px">${labLogo(l, 'sm')}<span class="tx"><b>${l.n}</b><div class="xs t2">${MODN[m]} · ${S.lbDay || 'Mié 28'} · ${S.lbHr || '08:00'}</div></span></div>
    ${row('box:' + (m === 'dom' ? 'house-line' : 'storefront'), m === 'dom' ? P().n : `Sucursal ${su[0]}`, m === 'dom' ? P().c : su[1], '', '')}
    <div class="lbl2">Detalle</div>${ex.map(k => kv(EXAMS[k][0], clp(lpp(l, k)))).join('')}${m === 'dom' ? kv('Toma a domicilio', t ? clp(t) : '<s class="t3">' + clp(TOMA_D()) + '</s> $0') : ''}${kv(`Costo por servicio (${S.svcP}%)`, clp(lbTot().sf))}${kv('Total', clp(tot), 'tot')}
    <div class="lbl2">Pago</div>${row('box:wallet', 'Mercado Pago', 'Visa •••• 4821', '', '<span class="lk">Cambiar</span>')}
    <div class="mt16">${note('receipt', 'Pagas todo en Cuidapp. Te enviamos la boleta para el reembolso de tu Isapre o Fonasa.')}</div>`; },
  foot: () => abtn(`Pagar ${clp(lbTot().tot)}`, 'lbPay', '', '', 'P87') });

def({ id: 'P87', name: 'Exámenes agendados', kind: 'page', title: '', next: ['P76'],
  body: () => { const { l, ex } = lbTot(), m = S.lbMode, su = l.sucs[S.lbSuc] || l.sucs[0];
    return `<div class="okh">${ic('check-circle', 1)}</div><h1 class="h-l mt16">Exámenes agendados</h1><div class="t2 mt8">${l.n} · ${MODN[m]} · ${S.lbDay || 'Mié 28'} a las ${S.lbHr || '08:00'}</div>
    <div class="mt16">${row('box:' + (m === 'dom' ? 'house-line' : 'storefront'), m === 'dom' ? 'Toma en tu casa' : `Sucursal ${su[0]}`, m === 'dom' ? `${P().n} · te avisamos quién va` : su[1], '', '')}${row('box:test-tube', `${ex.length} exámenes`, ex.map(k => EXAMS[k][0]).join(', '), '', '')}</div>
    ${ayAgg(ex).h > 0 || ayAgg(ex).pend ? note('fork-knife', ayAgg(ex).txt + (m === 'pre' ? '. Llega en ayunas, solo agua. Lleva tu carnet.' : '. Solo agua antes de la toma.'), 'warn') : ''}
    <div class="mt12">${note('bell', 'Te avisamos por notificación push cuando estén los resultados. La notificación no incluye valores.')}</div>`; },
  foot: () => `${btn('Seguir el estado', 'P76')}${btn('Volver al inicio', 'P06', 'sec')}` });

def({ id: 'P88', name: 'Dónde hacer tus exámenes', kind: 'page', back: true, title: 'Dónde hacerlos', next: ['P84'],
  prep: () => { if (!S.lbEx.length) ACT.lbFrom(); },
  body: () => { const ex = S.lbEx, s = S.lbSort || 'p';
    let l = LABS.map(x => ({ x, ok: ex.filter(k => labHas(x, k)), sum: ex.filter(k => labHas(x, k)).reduce((a, k) => a + lpp(x, k), 0) }));
    l.sort((a, b) => (b.ok.length - a.ok.length) || (s === 'p' ? a.sum - b.sum : a.x.km - b.x.km));
    return `<div class="sm t2">${ex.map(k => EXAMS[k][0]).join(' · ')}</div>
    <div class="seg mt16">${[['p', 'Menor precio'], ['km', 'Más cerca']].map(t => `<button class="${s === t[0] ? 'on' : ''}" data-act="lbSort" data-arg="${t[0]}">${t[1]}</button>`).join('')}</div>
    <div class="labl mt16">${l.map(o => `<button class="labc" data-act="lab" data-arg="${o.x.id}" data-go="P84">${labLogo(o.x)}<span class="tx"><b>${o.x.n}</b><span class="xs t2">${String(o.x.km).replace('.', ',')} km · ${ic('star', 1)} ${o.x.r}</span><span class="mtags">${modTags(o.x)}</span>${o.ok.length < ex.length ? `<span class="xs warnt">No hace ${ex.filter(k => !labHas(o.x, k)).map(k => EXAMS[k][0]).join(', ')}</span>` : ''}</span><span class="pkp"><b class="num">${clp(o.sum)}</b><span class="xs t2">${o.ok.length} de ${ex.length}</span></span></button>`).join('')}</div>
    <div class="xs t3 mt12">Precio de los exámenes. La toma a domicilio se suma aparte.</div>`; } });

/* ===== Paciente · Cotiza tu Isapre ===== */
const cotBanner = () => `<button class="cotb mt24" data-go="P89"><span class="tx"><b>Cotiza tu Isapre</b><span class="sm t2">Asesores de Isapre comparan planes para ti, sin costo</span></span><span class="cav">${ASES.slice(0, 3).map(a => av(a.i, 's')).join('')}</span></button>
  <div class="soonr mt12"><button class="soonc" data-go="P46"><span class="si">${i3('med')}</span><span class="tx"><b>Medicamentos y farmacia</b><span class="xs t2">Con tu receta, a domicilio</span></span><span class="pr soonb">Muy pronto</span></button></div>`;
def({ id: 'P89', name: 'Cotiza tu Isapre', kind: 'page', back: true, title: 'Cotiza tu Isapre', next: ['P90'],
  body: () => { const q = S.cq;
    return `<div class="sm t2">Cuéntanos lo básico y te mostramos Asesores de Isapre que pueden cotizar por ti. Es gratis para ti.</div>
    <div class="lbl2">Tu edad</div><div class="chips">${['18–29', '30–39', '40–49', '50–59', '60 o más'].map(v => chip(v, q.age === v, 'cqA', v)).join('')}</div>
    <div class="lbl2">Renta imponible mensual</div><div class="chips">${RENTAS.map((v, i) => chip(v, q.r === i, 'cqR', i)).join('')}</div>
    <div class="lbl2">Cargas</div><div class="chips">${[0, 1, 2, 3, 4].map(v => chip(v === 4 ? '4 o más' : v === 0 ? 'Sin cargas' : String(v), q.dep === v, 'cqD', v)).join('')}</div>
    <div class="lbl2">Previsión actual</div><div class="chips">${['Fonasa', ...ISAPRES].map(v => chip(v, q.is === v, 'cqI', v)).join('')}</div>
    <div class="mt16">${note('lock-simple', 'Solo compartimos estos datos con el asesor que elijas. No pedimos tu clave ni tu RUT en este paso.')}</div>`; },
  foot: () => btn('Ver asesores', 'P90', '', S.cq.age && S.cq.r != null && S.cq.is ? '' : 'disabled') });

const aseCard = a => `<div class="asec"><button class="aseh" data-act="ase" data-arg="${a.id}" data-go="P91">${av(a.i, 'l')}<span class="tx"><b>${a.n}${asePlus(a) ? ' <span class="dtag">Destacado</span>' : ''}</b><span class="xs t2">${aseT(a)} ${aseIsa(a)} · ${a.yrs} años · responde en ${a.resp}</span><span class="sm">${ic('star', 1)} ${a.r} <span class="t3">(${a.nr})</span></span></span></button>${aseIs(a)}
  <div class="mt12">${S.aseSent[a.id] ? `<button class="btn sec" disabled>${ic('check')}Solicitud enviada</button>` : btn('Pedir contacto', 'P91', 'sec', `data-act="ase" data-arg="${a.id}"`)}</div></div>`;
def({ id: 'P90', name: 'Asesores de Isapre', kind: 'page', back: true, title: 'Asesores de Isapre', next: ['P91', 'P92'],
  body: () => { const q = S.cq, l = [...ASES].sort((a, b) => (asePlus(b) - asePlus(a)) || ((aseIsa(b) === q.is) - (aseIsa(a) === q.is)));
    return `<div class="sm t2">${q.age || '—'} años · ${RENTAS[q.r] || '—'} · ${q.dep ? (q.dep === 4 ? '4 o más cargas' : q.dep + (q.dep === 1 ? ' carga' : ' cargas')) : 'sin cargas'} · ${q.is || '—'}</div>
    <div class="mt12">${note('info', 'Cada asesor trabaja con una sola Isapre. Para comparar, pide contacto a asesores de distintas Isapres.')}</div>
    <div class="asel mt16">${l.map(aseCard).join('')}</div>
    <div class="xs t3 mt12">«Destacado» es un espacio pagado por el asesor. Personas y datos de ejemplo.</div>`; } });

def({ id: 'P91', name: 'Perfil del asesor', kind: 'page', back: true, title: '', next: ['P92'],
  body: () => { const a = aseOf(S.ase);
    return `<div class="aseph">${av(a.i, 'xl', true)}<h1 class="h-l mt12">${a.n}</h1><div class="sm t2 mt4">${aseT(a)} ${aseIsa(a)} · registro ${a.reg} (ejemplo)${asePlus(a) ? ' <span class="dtag">Destacado</span>' : ''}</div></div>
    <div class="kst mt16"><div><b class="num">${a.r}</b><span>${a.nr} reseñas</span></div><div><b class="num">${a.yrs}</b><span>años</span></div><div><b class="num">${a.resp}</b><span>responde</span></div></div>
    <div class="lbl2">Sobre su trabajo</div><div class="sm">${a.bio}</div>
    <div class="lbl2">Isapre</div>${aseIs(a)}
    <div class="lbl2">Cómo funciona</div>${row('box:paper-plane-tilt', 'Envías tu solicitud', 'Edad, renta, cargas y previsión actual', '', '')}${row('box:chat-circle-text', 'Te contacta por la app', 'Con 2 o 3 planes comparados', '', '')}${row('box:hand', 'Tú decides', 'Sin costo ni compromiso para ti', '', '')}
    ${S.aseSent[a.id] ? '' : `<div class="lbl2">Consentimiento</div><div class="cons">${checkRow(`Acepto que un asesor de ${aseIsa(a)} me contacte`, S.aseOk[a.id], 'aseOk', a.id, 'Compartimos con este asesor tu edad, renta, cargas, previsión actual, nombre y teléfono. Puedes retirar el consentimiento cuando quieras.')}</div>`}`; },
  foot: () => { const a = aseOf(S.ase); return S.aseSent[a.id] ? btn(ic('check') + 'Solicitud enviada', '', 'sec', 'disabled') : abtn('Pedir contacto', 'aseReq', a.id, '', S.aseOk[a.id] ? 'P92' : '', !S.aseOk[a.id]); } });

def({ id: 'P92', name: 'Solicitud de cotización enviada', kind: 'page', title: '', next: ['P90'],
  body: () => { const a = aseOf(S.ase);
    return `<div class="okh">${ic('check-circle', 1)}</div><h1 class="h-l mt16">Solicitud enviada</h1><div class="t2 mt8">${a.n} recibió tus datos y te escribe por la app, normalmente en ${a.resp}.</div>
    <div class="mt16 asec">${row('av:' + a.i, a.n, aseT(a) + ' ' + aseIsa(a), 'P91')}</div>
    <div class="mt12">${note('bell', 'Te avisamos con una notificación push cuando te responda.')}</div>`; },
  foot: () => `${btn('Pedir a otro asesor', 'P90', 'sec')}${btn('Volver al inicio', 'P06')}` });

/* ===== Asesor de Isapre (rol) =====
   Modelo: Gratis (aparece, ve solicitudes con el contacto oculto; desbloquea cada contacto por S.pz.unl),
   Membresía (S.pz.mem al mes, contactos ilimitados) y Destacado (S.pz.plus por 1 mes, pago único: primero en la búsqueda con la etiqueta «Destacado»). */
const AP = () => [['free', 'Gratis', 0, 'Apareces en «Cotiza tu Isapre»', `Ves cada solicitud, pero el contacto está oculto. Desbloqueas cada uno por ${clp(S.pz.unl)}.`], ['mem', 'Membresía', S.pz.mem, 'Contactos ilimitados', 'Ves nombre y teléfono de todas las solicitudes, sin pagar por cada una.']];
const LEADS = [['Daniela Fuentes', '30–39', '$1.500.000 – $2.500.000', 1, 'Fonasa', 'Hace 12 min', '+56 9 8123 4471', 'Ñuñoa'], ['Luis Morales', '60 o más', '$800.000 – $1.500.000', 0, 'Colmena', 'Hace 1 h', '+56 9 6650 2210', 'Providencia'], ['Carolina Pizarro', '40–49', '$2.500.000 – $4.000.000', 3, 'Banmédica', 'Ayer', '+56 9 7344 0982', 'Las Condes'], ['Tomás Riveros', '18–29', 'Hasta $800.000', 0, 'Fonasa', 'Ayer', '+56 9 5521 7730', 'Santiago']];
const qMem = () => S.qa.plan === 'mem' && S.qa.paid;
const lOpen = i => qMem() || !!S.unl[i];
const blur = t => `<span class="blr" aria-label="Oculto">${t}</span>`;
const qPlanTxt = () => `${qMem() ? 'Membresía' : 'Gratis'}${S.qa.plus ? ' + Destacado' : ''}`;
def({ id: 'Q01', name: 'Registro de asesor', kind: 'page', title: 'Únete como Asesor de Isapre', next: ['Q02'],
  body: () => `<div class="sm t2">Aparece gratis en «Cotiza tu Isapre» y recibe solicitudes de personas que quieren cotizar.</div>
  <div class="lbl2">Tus datos</div>${field('user', 'Macarena Ibáñez')}${field('identification-card', '15.482.903-1')}${field('certificate', 'AS-10482', 'N.º de registro de agente de ventas')}
  <div class="lbl2">¿Con qué Isapre trabajas?</div><div class="xs t2" style="margin:-4px 0 8px">Solo una. Las personas te ven como asesora de esa Isapre.</div><div class="chips">${ISAPRES.map(i => chip(i, S.qa.is[0] === i, 'qIs', i)).join('')}</div>
  <div class="lbl2">Foto de perfil</div>${row('av:MIb', 'Foto subida', 'Se ve en tu tarjeta', '', st('ok', 'Lista'))}
  <div class="mt16">${note('shield-check', 'Revisamos tu registro antes de publicarte.')}</div>`,
  foot: () => btn('Elegir plan', 'Q02', '', S.qa.is.length ? '' : 'disabled') });
def({ id: 'Q02', name: 'Planes del asesor', kind: 'page', back: true, title: 'Elige tu plan', next: ['Q03'],
  body: () => `<div class="sm t2">Mensual, sin permanencia. Cancelas cuando quieras.</div>
  <div class="pll mt16">${AP().map(p => `<button class="plc ${S.qa.plan === p[0] ? 'on' : ''}" data-act="qPlan" data-arg="${p[0]}"><span class="tx"><b>${p[1]}</b><span class="sm">${p[3]}</span><span class="xs t2">${p[4]}</span></span><span class="pkp"><b class="num">${p[2] ? clp(p[2]) : '$0'}</b><span class="xs t2">${p[2] ? 'al mes' : 'siempre'}</span></span></button>`).join('')}</div>
  <div class="lbl2">Agrega</div><div class="plc plus ${S.qa.plus ? 'on' : ''}"><span class="tx"><b>Destacado</b><span class="sm">Apareces primero en la búsqueda durante 1 mes</span><span class="xs t2">Con la etiqueta «Destacado» entre los asesores de ${S.qa.is[0]}.</span></span><span class="pkp"><b class="num">+${clp(S.pz.plus)}</b><span class="xs t2">por 1 mes</span></span>${swc(S.qa.plus, 'qPlus', '', 'Agregar Destacado')}</div>
  ${S.qa.plan === 'mem' || S.qa.plus ? `<div class="lbl2">Pago</div>${row('box:wallet', 'Mercado Pago', S.qa.plan === 'mem' ? 'Membresía mensual · cancelas cuando quieras' + (S.qa.plus ? ' · Destacado: pago único por 1 mes' : '') : 'Pago único · Destacado por 1 mes', '', '')}` : ''}`,
  foot: () => { const t = (S.qa.plan === 'mem' ? S.pz.mem : 0) + (S.qa.plus ? S.pz.plus : 0); return abtn(t ? `Pagar ${clp(t)} con Mercado Pago` : 'Empezar gratis', 'qPay', '', '', 'Q03'); } });
def({ id: 'Q03', name: 'Solicitudes (leads)', kind: 'page', title: 'Solicitudes', next: ['Q04', 'Q02', 'Q05'],
  body: () => { const nl = LEADS.filter((l, i) => !lOpen(i)).length;
    return `<div class="row8" style="justify-content:space-between;align-items:center"><span class="sm t2">Plan ${qPlanTxt()} · ${LEADS.length} solicitudes este mes</span><button class="lk sm" data-go="Q02">Cambiar plan</button></div>
    ${nl ? `<div class="mt12">${note('lock-simple', `${nl} contactos ocultos. Desbloquea cada uno por ${clp(S.pz.unl)} o pásate a Membresía (${clp(S.pz.mem)} al mes) para verlos todos.`)}</div>` : ''}
    <div class="mt12">${LEADS.map((l, i) => { const o = lOpen(i); return `<button class="rbc" data-act="lead" data-arg="${i}" data-go="Q04"><span class="tx"><b>${o ? l[0] : blur('Nombre oculto')} · ${l[1]} años</b><span class="xs t2">${l[2]} · ${l[3] ? l[3] + (l[3] === 1 ? ' carga' : ' cargas') : 'sin cargas'} · ${l[4]}</span>${o ? `<span class="xs t2">${ic('phone')} ${l[6]}</span>` : `<span class="xs lkd">${ic('lock-simple')} Contacto oculto · desbloquear ${clp(S.pz.unl)}</span>`}</span><span class="rbr"><span class="xs t3">${l[5]}</span>${S.leadSt[i] === 'cot' ? st('ok', 'Cotizado', 'check') : !o ? st('neu', 'Oculto', 'lock-simple') : i < 2 ? st('inf', 'Nueva', 'sparkle') : st('neu', 'Vista', 'eye')}</span></button>`; }).join('')}</div>`; },
  foot: () => btn(ic('user') + 'Mi perfil público', 'Q01', 'sec') });
def({ id: 'Q04', name: 'Detalle de solicitud', kind: 'page', back: true, title: 'Solicitud', next: ['Q03', 'Q05'],
  body: () => { const i = S.lead || 0, l = LEADS[i], o = lOpen(i);
    return `<h1 class="h-l">${o ? l[0] : blur('Persona interesada')}</h1><div class="sm t2 mt4">Recibida ${l[5].toLowerCase()} · desde «Cotiza tu Isapre»</div>
    <div class="mt16">${kv('Edad', l[1])}${kv('Renta imponible', l[2])}${kv('Cargas', l[3] ? String(l[3]) : 'Sin cargas')}${kv('Previsión actual', l[4])}${kv('Comuna', l[7])}</div>
    <div class="lbl2">Contacto</div>${o ? `${kv('Nombre', l[0])}${kv('Teléfono', l[6])}` : `${kv('Nombre', blur('Nombre oculto'))}${kv('Teléfono', blur('+56 9 0000 0000'))}<div class="mt12">${note('lock-simple', `El contacto está oculto en el plan Gratis. Desbloquéalo por ${clp(S.pz.unl)} o con Membresía.`)}</div>`}
    <div class="mt16">${note('check-circle', `Aceptó que un asesor de ${S.qa.is[0]} la contacte · ${l[5].toLowerCase()}. Contáctala solo para cotizar.`, 'ok')}</div>`; },
  foot: () => { const i = S.lead || 0; if (!lOpen(i)) return `${btn(`${ic('lock-simple-open')}Desbloquear por ${clp(S.pz.unl)}`, 'Q05')}${btn('Ver Membresía', 'Q02', 'sec')}`; return S.leadSt[i] === 'cot' ? btn(ic('check') + 'Cotización enviada', '', 'sec', 'disabled') : abtn('Enviar cotización', 'leadSt', '', '', ''); } });
def({ id: 'Q05', name: 'Desbloquear contacto', kind: 'page', back: true, title: 'Desbloquear contacto', next: ['Q04'],
  body: () => { const l = LEADS[S.lead || 0];
    return `<div class="sm t2">Pagas una vez y ves el nombre y teléfono de esta persona.</div>
    <div class="msc mt16">${kv('Solicitud', `${l[1]} años · ${l[4]} · ${l[7]}`)}${kv('Desbloqueo de contacto', clp(S.pz.unl))}${kv('Total', clp(S.pz.unl), 'tot')}</div>
    <div class="lbl2">Pago</div>${row('box:wallet', 'Mercado Pago', 'Visa •••• 2290', '', '<span class="lk">Cambiar</span>')}
    <div class="mt16">${row('box:infinity', `Membresía · ${clp(S.pz.mem)} al mes`, 'Contactos ilimitados. Conviene desde el 7.º contacto del mes.', 'Q02', '<span class="lk">Ver</span>', '', 'qPlan', 'mem')}</div>`; },
  foot: () => abtn(`Pagar ${clp(S.pz.unl)} con Mercado Pago`, 'unl', S.lead || 0, '', 'Q04') });

/* ===== Profesional · laboratorios afiliados (nombres de ejemplo) ===== */
Object.assign(ACT, { alab: id => { S.alab = S.alab === id ? '' : id; }, labMap: id => { window.open('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(labOf(id).dir), '_blank', 'noopener'); } });
const ENTR = ['Entrega en el mesón de recepción y di que vienes de Cuidapp, con el código de la orden', 'Tubos rotulados con nombre completo y RUT de la paciente', 'Orden médica o lista de exámenes (en la app o impresa)', 'Caja térmica de 2 a 8 °C; entrega dentro de 4 horas desde la toma', 'Pide el acta o comprobante de recepción y súbelo en la app'];
def({ id: 'R45', name: 'Laboratorios afiliados', kind: 'page', back: true, title: 'Laboratorios afiliados',
  body: () => { const on = S.alab === undefined ? 'la' : S.alab;
    return `<div class="sm t2">Aquí entregas las muestras que tomas en visitas de Cuidapp. Revisa el horario de recepción antes de salir.</div>
    <div class="labl mt16">${LABS.map(l => { const o = on === l.id; return `<div class="alab ${o ? 'on' : ''}"><button class="alab-h" data-act="alab" data-arg="${l.id}">${labLogo(l, 'sm')}<span class="tx"><b>${l.n} <span class="ptag p">Ejemplo</span></b><span class="xs t2">${l.dir}</span><span class="xs t2">${ic('clock')} Recibe ${l.rec.toLowerCase()}</span></span>${ic(o ? 'caret-up' : 'caret-down')}</button>
      ${o ? `<div class="alab-b">${row('box:map-pin', l.dir, l.mes, '', '')}${row('box:clock', 'Atención', l.hrs, '', '')}${row('box:test-tube', 'Qué recibe', 'Sangre (tubos lila, amarillo y celeste), orina y deposiciones', '', '')}${l.no.length ? row('box:x-circle', 'No procesa', l.no.map(k => EXAMS[k][0]).join(', ') + ' · llévalos a otro laboratorio', '', '') : ''}
      <div class="lbl2">Cómo entregar</div><ol class="entr">${ENTR.map(t => `<li>${t}</li>`).join('')}</ol>
      <div class="row8 mt12"><button class="pill" data-act="labMap" data-arg="${l.id}">${ic('navigation-arrow')}Cómo llegar</button></div></div>` : ''}</div>`; }).join('')}</div>
    <div class="xs t3 mt12">Nombres, direcciones y horarios de ejemplo.</div>`; } });

/* ===== Admin · planes y destacados ===== */
const PZN = [['unl', 'Desbloqueo de contacto (asesor)', 'Por cada contacto, en plan Gratis', 1000, false], ['mem', 'Membresía de asesor', 'Al mes · contactos ilimitados', 1000, false], ['plus', 'Destacado de asesor', 'Por 1 mes · primero en «Cotiza tu Isapre»', 1000, false], ['pdest', 'Destacado de profesional', 'Al mes · enfermeras y TENS primero en los resultados', 500, false]];
const REVQ = { unl: 46, mem: 9, plus: 6, pdest: 24 };
def({ id: 'A14', name: 'Planes y destacados', kind: 'adm', side: 'pln',
  body: () => { const tot = Object.keys(REVQ).reduce((a, k) => a + REVQ[k] * S.pz[k], 0);
    return `<div class="h-l">Planes y destacados</div><div class="t2 mt4">Precios que pagan asesores de Isapre y profesionales por aparecer o destacar. Los cambios rigen para cobros nuevos.</div>
  <div class="pzg mt24">${PZN.map(p => `<div class="box" style="border:1px solid var(--border);border-radius:12px;padding:16px"><div class="b-m">${p[1]} </div><div class="t2 sm mt4">${p[2]}</div><div class="stp mt12"><button class="ib" data-act="pz" data-arg="${p[0]}:-${p[3]}" aria-label="Bajar">${ic('minus')}</button><b class="num">${clp(S.pz[p[0]])}</b><button class="ib" data-act="pz" data-arg="${p[0]}:${p[3]}" aria-label="Subir">${ic('plus')}</button></div></div>`).join('')}</div>
  <div class="h-m mt32">Ingresos del mes · oct 2026 (ejemplo)</div>
  <table class="t mt16"><tr><th>Línea</th><th>Cantidad</th><th>Precio</th><th>Ingreso</th></tr>${PZN.map(p => `<tr><td><b style="font-weight:600">${p[1]}</b></td><td class="num">${REVQ[p[0]]}</td><td class="num">${clp(S.pz[p[0]])}</td><td class="num"><b style="font-weight:600">${clp(REVQ[p[0]] * S.pz[p[0]])}</b></td></tr>`).join('')}<tr><td><b style="font-weight:700">Total</b></td><td></td><td></td><td class="num"><b style="font-weight:700">${clp(tot)}</b></td></tr></table>
  <div class="t2 sm mt12">Asesores: el listado es gratis; cobramos por desbloquear contactos, la Membresía y el Destacado. Cantidades de ejemplo.</div>`; } });

/* ===== Profesional · entregar muestra ===== */
def({ id: 'R42', name: 'Entregar muestra en laboratorio', kind: 'page', back: true, title: 'Entregar muestra', next: ['R22'],
  body: () => { const l = LABS[0];
    return `<div class="sm t2">Toma de muestra · Rosa Muñoz · hoy 08:12 · 3 tubos</div>
    <div class="mt16">${S.mue.done ? st('ok', 'Entregada', 'check-circle') : st('inf', 'Por entregar', 'truck')}</div>
    <div class="lbl2">Laboratorio</div><div class="row8" style="align-items:center;gap:10px">${labLogo(l, 'sm')}<span class="tx"><b>${l.n}</b><div class="xs t2">${l.dir} · recibe hasta las 12:00</div></span></div>
    <div class="mt12">${mapThumb(l)}</div>
    <div class="lbl2">Antes de entregar</div>${checkRow('Tubos rotulados con nombre y RUT', S.mue.rot, 'mueChk', 'rot')}${checkRow('Orden y lista de exámenes impresa', S.mue.ord, 'mueChk', 'ord')}${checkRow('Cadena de frío en caja térmica', S.mue.fri, 'mueChk', 'fri')}
    <div class="lbl2">Comprobante</div>${row('box:camera', 'Foto del acta o comprobante de recepción', S.mue.up ? 'Subida · acta n.º 58213' : 'Firmada o timbrada por el laboratorio', '', S.mue.up ? st('ok', 'Lista') : '<span class="lk">Subir</span>', '', 'mueUp', '')}
    <div class="mt12">${row('box:flask', 'Laboratorios afiliados', 'Direcciones, horarios de recepción e instrucciones', 'R45')}</div>
    <div class="mt16">${note('info', 'Tú solo entregas la muestra. Cuidapp paga al laboratorio en la liquidación del período.')}</div>`; },
  foot: () => S.mue.done ? btn('Volver a la agenda', 'R04', 'sec') : abtn(ic('check') + 'Marcar entregada', 'mueDone', '', '', '', !S.mue.up) });

/* ===== Admin · laboratorios y liquidaciones ===== */
const FREQ = [['semanal', 'Semanal'], ['quincenal', 'Quincenal'], ['mensual', 'Mensual']];
const LIQN = { la: 46, pz: 18, bl: 61, ls: 22 };
const liqRow = (l, per) => { const n = Math.round(LIQN[l.id] * (per === 'sep' ? 1.9 : 1)), mix = ['hemo', 'lip', 'gli', 'hba', 'vitd', 'tsh'].filter(k => labHas(l, k));
  const c = Math.round(n * mix.reduce((a, k) => a + lcost(l, k), 0) / mix.length), p = Math.round(n * mix.reduce((a, k) => a + lpp(l, k), 0) / mix.length); return { n, c, p, m: p - c }; };
def({ id: 'A11', name: 'Laboratorios', kind: 'adm', side: 'labs', next: ['A12'],
  body: () => `<div class="ahd"><div><h1 class="h-xl">Laboratorios</h1><div class="t2 sm mt4">Cada laboratorio envía su lista de precios. Cuidapp aplica un recargo y ese es el precio a la paciente. Los laboratorios no pagan por aparecer.</div></div></div>
  <table class="t mt16"><tr><th>Laboratorio</th><th>Modalidad</th><th>Sucursales</th><th>Recargo</th><th>Liquidación</th><th>Lista de precios</th><th></th></tr>
  ${LABS.map(l => `<tr class="cl" data-act="aLab" data-arg="${l.id}" data-go="A12"><td><div style="display:flex;align-items:center;gap:10px">${labLogo(l, 'sm')}<b style="font-weight:600">${l.n}</b></div></td><td>${l.mods.map(m => MODN[m]).join(' · ')}</td><td class="num">${l.sucs.length}</td><td class="num">${(S.mkL[l.id] || {}).g != null ? S.mkL[l.id].g : S.mkG} %</td><td>${FREQ.find(f => f[0] === l.freq)[1]}</td><td class="t2">${S.aImpDone[l.id] || '12 oct 2026'}</td><td><button class="pill" data-act="aLab" data-arg="${l.id}" data-go="A12">Configurar</button></td></tr>`).join('')}</table>
  <div class="row8 mt16"><button class="pill" data-go="A13">${ic('receipt')}Liquidaciones</button></div>` });

def({ id: 'A12', name: 'Configurar laboratorio', kind: 'adm', side: 'labs', back: true, next: ['A13'],
  body: () => { const l = labOf(S.aLab), g = (S.mkL[l.id] || {}).g != null ? S.mkL[l.id].g : S.mkG, ex = ['hemo', 'lip', 'gli', 'hba', 'vitd', 'tsh', 'cre', 'pcr'].filter(k => labHas(l, k));
    return `<button class="lk" data-go="A11">${ic('caret-left')}Laboratorios</button><div class="ahd mt8"><div style="display:flex;gap:12px;align-items:center">${labLogo(l)}<div><h1 class="h-xl">${l.n}</h1><div class="t2 sm mt4">${l.dir} · lista del ${S.aImpDone[l.id] || '12 oct 2026'}</div></div></div><button class="btn sec" style="width:auto;padding:0 18px" data-act="aImp">${ic('file-arrow-up')}Subir lista de precios (Excel)</button></div>
    ${S.aImp ? `<div class="abox mt16"><div class="b-m">Vista previa · precios_${l.id}_oct2026.xlsx</div><div class="t2 sm mt4">412 filas · 409 coinciden con el catálogo · 3 nuevas · 7 cambian de precio</div>
    <table class="t mt12"><tr><th>Código</th><th>Examen</th><th>Precio lab. actual</th><th>Precio lab. nuevo</th><th>Cambio</th><th>Precio paciente nuevo</th></tr>${ex.slice(0, 5).map((k, i) => { const c = lcost(l, k), n = Math.round(c * (i % 2 ? 1.04 : 1) / 10) * 10; return `<tr><td class="num t2">${EXAMS[k][5] || '—'}</td><td>${EXAMS[k][0]}</td><td class="num">${clp(c)}</td><td class="num">${clp(n)}</td><td>${n === c ? st('neu', 'Sin cambio') : st('warn', '+4 %', 'arrow-up')}</td><td class="num">${clp(Math.round(n * (1 + mkOf(l, k) / 100) / 10) * 10)}</td></tr>`; }).join('')}</table>
    <div class="row8 mt12"><button class="btn" style="width:auto;padding:0 18px" data-act="aImpOk">Publicar precios</button><button class="btn sec" style="width:auto;padding:0 18px" data-act="aImp">Cancelar</button></div></div>` : ''}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px" class="mt24"><div class="abox"><div class="b-m">Recargo global (margen Cuidapp)</div><div class="t2 sm mt4">Mínimo 15% sobre el precio del laboratorio (puede ser mayor). Es el precio que paga la paciente.</div>
    <div class="mkst mt12"><button class="pill" data-act="aMk" data-arg="-1">${ic('minus')}</button><b class="num">${g} %</b><button class="pill" data-act="aMk" data-arg="1">${ic('plus')}</button></div></div>
    <div class="abox"><div class="b-m">Liquidación</div><div class="t2 sm mt4">Cada cuánto Cuidapp le paga a este laboratorio, según el convenio.</div><div class="chips mt12">${FREQ.map(f => chip(f[1], l.freq === f[0], 'aFreq', f[0])).join('')}</div></div></div>
    <div class="h-m mt32">Recargo por examen</div><div class="t2 sm mt4">Si no defines uno, se usa el global.</div>
    <table class="t mt12"><tr><th>Examen</th><th>Precio laboratorio</th><th>Recargo</th><th>Precio paciente</th><th>Margen</th><th></th></tr>${ex.map(k => { const o = ((S.mkL[l.id] || {}).ex || {})[k] != null; return `<tr><td>${EXAMS[k][0]}</td><td class="num">${clp(lcost(l, k))}</td><td><div class="mkst sm"><button class="pill" data-act="aMkEx" data-arg="${k}:-1">${ic('minus')}</button><b class="num">${mkOf(l, k)} %</b><button class="pill" data-act="aMkEx" data-arg="${k}:1">${ic('plus')}</button></div></td><td class="num">${clp(lpp(l, k))}</td><td class="num">${clp(lpp(l, k) - lcost(l, k))}</td><td>${o ? `<button class="lk sm" data-act="aMkRs" data-arg="${k}">Usar global</button>` : '<span class="xs t3">Global</span>'}</td></tr>`; }).join('')}</table>
    <div class="xs t3 mt12">Precios y recargos de ejemplo. El precio del laboratorio y el margen nunca se muestran a pacientes.</div>`; } });

def({ id: 'A13', name: 'Liquidaciones de laboratorios', kind: 'adm', side: 'liq', next: ['A12', 'A16', 'A15'],
  body: () => { const per = S.aPer || 'oct2', rows = LABS.map(l => ({ l, ...liqRow(l, per) })), T = rows.reduce((a, r) => ({ n: a.n + r.n, c: a.c + r.c, p: a.p + r.p, m: a.m + r.m }), { n: 0, c: 0, p: 0, m: 0 });
    const paid = id => S.liqPaid[per + id] || per === 'sep';
    return `<div class="ahd"><div><h1 class="h-xl">Liquidaciones</h1><div class="t2 sm mt4">Exámenes realizados por período. Cuidapp paga a cada laboratorio según su frecuencia; la profesional solo entrega las muestras.</div></div><button class="btn sec" style="width:auto;padding:0 18px" data-act="toast" data-arg="Exportado: liquidaciones_${per}.xlsx">${ic('download-simple')}Exportar Excel</button></div>
    <div class="chips mt16">${[['oct2', '16–31 oct 2026'], ['oct1', '1–15 oct 2026'], ['sep', 'Septiembre 2026']].map(p => chip(p[1], per === p[0], 'aPer', p[0])).join('')}</div>
    <div class="kpis mt16">${[[T.n, 'Exámenes realizados'], [clp(T.c), 'Costo laboratorios'], [clp(T.p), 'Cobrado a pacientes'], [clp(T.m), 'Margen exámenes (15%)']].map(t => `<div class="kpi"><b class="num">${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div>
    <table class="t mt16"><tr><th>Laboratorio</th><th>Frecuencia</th><th>Exámenes</th><th>Costo laboratorio</th><th>Precio paciente</th><th>Margen</th><th>%</th><th>Estado</th><th></th></tr>
    ${rows.map(r => `<tr><td><b style="font-weight:600">${r.l.n}</b></td><td>${FREQ.find(f => f[0] === r.l.freq)[1]}</td><td class="num">${r.n}</td><td class="num">${clp(r.c)}</td><td class="num">${clp(r.p)}</td><td class="num">${clp(r.m)}</td><td class="num t2">${Math.round(r.m / r.c * 100)}%</td><td>${paid(r.l.id) ? st('ok', 'Pagada', 'check-circle') : st('warn', 'Pendiente', 'clock')}</td><td>${paid(r.l.id) ? '' : `<button class="pill" data-act="aPaid" data-arg="${r.l.id}">Marcar pagada</button>`}</td></tr>`).join('')}</table>
    <div class="h-m mt32">Profesionales · comisión ${S.comm}%</div><div class="t2 sm mt4">Cuidapp cobra a la paciente y abona el resto a la Billetera de cada profesional, que retira cuando quiere. Comisión sobre el precio base más sus recargos.</div>
    <table class="t mt12"><tr><th>Profesional</th><th>Atenciones</th><th>Base</th><th>Recargos</th><th>Cobrado</th><th>Comisión ${S.comm}%</th><th>Abonado a Billetera</th><th>Estado</th></tr>${PROS.slice(0, 5).map((p, i) => { const n = [14, 9, 11, 6, 8][i], b = n * (priceOf(p, 'iny') || 18000), rcg = Math.round(b * [0.06, 0.1, 0.04, 0, 0.08][i] / 100) * 100, t = b + rcg, c = Math.round(t * S.comm / 100); return `<tr><td><b style="font-weight:600">${p.n}</b></td><td class="num">${n}</td><td class="num">${clp(b)}</td><td class="num">${clp(rcg)}</td><td class="num">${clp(t)}</td><td class="num">${clp(c)}</td><td class="num">${clp(t - c)}</td><td>${st('ok', 'Abonado', 'check-circle')}</td></tr>`; }).join('')}</table>
    <div class="h-m mt32">Costo por servicio · ${S.svcP}%</div><div class="t2 sm mt4">Lo paga la paciente sobre el total del pedido (servicios y exámenes, después de CUIDAPP15, sin la gestión de reembolso). Aparte de la comisión de profesionales y el margen de exámenes.</div>
    <div class="kpis mt12">${[[412, 'Pedidos del período'], [clp(9864000), 'Total pedidos'], [clp(Math.round(9864000 * S.svcP / 100)), `Ingreso por costo ${S.svcP}%`]].map(t => `<div class="kpi"><b class="num">${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div>
    <div class="h-m mt32">Gestión de reembolsos</div><div class="t2 sm mt4">${clp(RB_FEE)} por cada reembolso automático enviado a una Isapre.</div>
    <div class="kpis mt12">${[[38, 'Reembolsos gestionados'], [clp(38 * RB_FEE), 'Ingreso por gestión'], [31, 'Pagados por la Isapre']].map(t => `<div class="kpi"><b class="num">${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div>
    <div class="xs t3 mt12">Cifras de ejemplo.</div>`; } });

/* ===== Profesional · recargos (reglas propias) ===== */
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0') + ':00');
const rcCond = r => r.t === 'hora' ? `De ${r.a} a ${r.b}` : r.t === 'dia' ? ({ sab: 'Sábados', dom: 'Domingos', fest: 'Festivos', lun: 'Lunes', mar: 'Martes', mie: 'Miércoles', jue: 'Jueves', vie: 'Viernes' }[r.d]) : 'Reservas para hoy mismo';
Object.assign(ACT, {
  rcOn: id => { const r = S.rc.find(x => x.id === id); r.on = !r.on; },
  rcV: a => { const [id, d] = a.split(':'), r = S.rc.find(x => x.id === id), st = r.k === '%' ? 5 : 1000, mx = r.k === '%' ? S.rcMax : 50000; r.v = Math.max(0, Math.min(mx, r.v + (+d) * st)); },
  rcK: id => { const r = S.rc.find(x => x.id === id); r.k = r.k === '%' ? '$' : '%'; r.v = r.k === '%' ? Math.min(25, S.rcMax) : 5000; },
  rcH: a => { const [id, w, d] = a.split(':'), r = S.rc.find(x => x.id === id), i = HOURS.indexOf(r[w]); r[w] = HOURS[(i + (+d) + 24) % 24]; },
  rcD: a => { const [id, d] = a.split(':'); S.rc.find(x => x.id === id).d = d; },
  rcAdd: t => { const id = 'x' + (S.rc.length + 1); S.rc.push(t === 'hora' ? { id, t, n: 'Horario', a: '18:00', b: '20:00', k: '$', v: 3000, on: true } : t === 'dia' ? { id, t, n: 'Día', d: 'sab', k: '%', v: 20, on: true } : { id, t: 'urg', n: 'Urgencia (mismo día)', k: '$', v: 5000, on: true }); S.rcEd = id; },
  rcDel: id => { S.rc = S.rc.filter(x => x.id !== id); },
  rcMax: v => { S.rcMax = +v; toast(`Tope de recargos: hasta +${v}% sobre el precio base.`); },
});
def({ id: 'R43', name: 'Recargos', kind: 'page', back: true, title: 'Recargos',
  body: () => `<div class="sm t2">Tú decides cuánto más cobras de noche, en fines de semana, festivos o por urgencia. La paciente lo ve antes de pagar. Tope de Cuidapp: hasta +${S.rcMax}% sobre tu precio base.</div>
  <div class="rcl mt16">${S.rc.map(r => `<div class="rcc ${r.on ? '' : 'off'}"><div class="rch"><span class="ri box">${ic(r.t === 'hora' ? 'moon' : r.t === 'dia' ? 'calendar-star' : 'lightning')}</span><span class="tx"><b>${r.n}</b><span class="xs t2">${rcCond(r)}</span></span>${swc(r.on, 'rcOn', r.id, 'Activar ' + r.n)}</div>
  ${r.on ? `<div class="rcb">${r.t === 'hora' ? `<div class="rcr"><span class="sm t2">Desde</span><div class="mkst sm"><button class="pill" data-act="rcH" data-arg="${r.id}:a:-1">${ic('minus')}</button><b class="num">${r.a}</b><button class="pill" data-act="rcH" data-arg="${r.id}:a:1">${ic('plus')}</button></div></div><div class="rcr"><span class="sm t2">Hasta</span><div class="mkst sm"><button class="pill" data-act="rcH" data-arg="${r.id}:b:-1">${ic('minus')}</button><b class="num">${r.b}</b><button class="pill" data-act="rcH" data-arg="${r.id}:b:1">${ic('plus')}</button></div></div>` : ''}
  ${r.t === 'dia' && r.id.startsWith('x') ? `<div class="chips">${['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom', 'fest'].map(d => chip({ lun: 'Lun', mar: 'Mar', mie: 'Mié', jue: 'Jue', vie: 'Vie', sab: 'Sáb', dom: 'Dom', fest: 'Festivo' }[d], r.d === d, 'rcD', r.id + ':' + d)).join('')}</div>` : ''}
  <div class="rcr"><div class="seg sm2">${['%', '$'].map(k => `<button class="${r.k === k ? 'on' : ''}" data-act="${r.k === k ? 'toast' : 'rcK'}" data-arg="${r.k === k ? 'Ya está en ' + (k === '%' ? 'porcentaje' : 'monto fijo') : r.id}">${k === '%' ? '+ %' : '+ $'}</button>`).join('')}</div><div class="mkst"><button class="pill" data-act="rcV" data-arg="${r.id}:-1">${ic('minus')}</button><b class="num">${rcVal(r)}</b><button class="pill" data-act="rcV" data-arg="${r.id}:1">${ic('plus')}</button></div></div>
  <div class="xs t2">Inyección a ${clp(S.my.iny.p)} → <b class="num">${clp(S.my.iny.p + rcAmt(r, S.my.iny.p))}</b>${r.id.startsWith('x') ? ` · <button class="lk xs" data-act="rcDel" data-arg="${r.id}">Eliminar</button>` : ''}</div></div>` : ''}</div>`).join('')}</div>
  <div class="lbl2">Agregar regla</div><div class="chips">${chip(ic('moon') + 'Por horario', false, 'rcAdd', 'hora')}${chip(ic('calendar-star') + 'Por día', false, 'rcAdd', 'dia')}${chip(ic('lightning') + 'Urgencia', false, 'rcAdd', 'urg')}</div>
  <div class="mt16">${note('info', `Si se cruzan dos reglas (por ejemplo, domingo de noche), se suman: la de horario más la de día más alta. Comisión Cuidapp ${S.comm}% también sobre el recargo.`)}</div>`,
  foot: () => btn('Guardar recargos', 'back') });
