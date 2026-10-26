/* Cuidapp · prototipo navegable. Sin backend. */
// Logo: para cambiarlo, edita SOLO esta línea (carpeta con los SVG de marca).
const LOGO_DIR = 'logo/';
const LOGO = n => `${LOGO_DIR}cuidapp-${n}.svg`;

const $ = (s, r = document) => r.querySelector(s);
const ic = (n, f) => `<i class="${f ? 'ph-fill' : 'ph'} ph-${n}"></i>`;
const clp = n => '$' + Math.round(n).toLocaleString('es-CL');
const esc = s => String(s);

/* ---------- estado ---------- */
const S0 = () => ({
  item: 'iny', addr: 'mama', who: 'mama', when: 'prog', pro: 'cr', day: 1, slot: '08:00', sort: 'rel', ptab: 'serv', det: 'next',
  f: { enf: true, tens: true, cuid: true }, fmax: 0, fday: 'all', frat: 0, fgen: '', fcom: '',
  fav: { cr: true, pg: true }, q: '', typed: false, sheet: '', ctab: 'next', revF: 'all', revSort: 'rec', resp: { cr4: 'Gracias, Francisco. Ese día me pilló un taco en Grecia, por eso te avisé. ¡Nos vemos en el próximo control!' }, replyTo: 'cr1', rtxt: false, rcrit: {}, pday: 1, svcFrom: '',
  hasMed: true, receta: false, orden: '', mmode: 'cat', exq: '', kinAv: false, medAv: false, promo: 'kin', exams: {}, needOrd: false, ord: '', ordSel: null, ordFrom: false, help: '', exPage: 0, exLim: 20, scope: '', aexq: '', aexPage: 0, aord: 0, aordSel: {}, aordDone: [], pv: { mama: { t: 'fonasa', tr: 'B', is: '' }, papa: { t: 'isapre', tr: '', is: 'Colmena' }, yo: { t: 'isapre', tr: '', is: 'Banmédica' } }, isaOpen: false, blog: 'b12', blogF: '', bm: 'hba', bF: 'all', bSis: '', crit: false, incVis: false, shr: { cr: false, pg: true, lf: false }, shrLink: false, resShared: false, eduRes: false, pk: 'gen', pkOpen: '', ctl: { 0: true, 1: true, 2: false, 3: true }, lk: { w: 'yo', is: '', c1: false, c2: false, car: false, bank: false }, isa: {}, rbAuto: false, rbSel: 'r2', rbList: null, profAv: {}, labId: 'la', lbMode: 'dom', lbSuc: 0, lbEx: [], lbDay: '', lbHr: '', lbSort: '', lbDone: false, cq: { age: '', r: null, dep: 0, is: '' }, ase: 'mi', aseSent: {}, qa: { is: ['Colmena', 'Banmédica', 'Consalud'], plan: 'pro', paid: false }, lead: 0, leadSt: {}, mue: { up: false, rot: true, ord: true, fri: true, done: false }, aLab: 'la', mkG: 10, mkL: { bl: { g: 10, ex: { vitd: 12 } } }, aImp: false, aImpDone: {}, aPer: 'oct2', liqPaid: {}, cuida: true, rc: RC0(), rcMax: 100, rcEd: '', rbDocs: false, tensNeeds: { hig: true, mov: true, sig: true, com: false },
  pay: 'visa', prev: 'fonasa', consent: false, rating: 0, tags: {}, tip: 0, chat: [], phase: 'llego', cancelFrom: 'P27', booked: false, hecho: false, cr: 0,
  docs: { carnet: false, selfie: false, titulo: false, antec: false, banco: false }, prof: 'enf',
  online: false, code: '', chk: { id: false, rec: false, ale: false }, earn: 186405, done: 9, pRating: 0, pTags: {}, paid: false,
  my: {
    vneu: { on: true, p: 18000, night: 0, nOn: false, dur: 30, inc: { ins: true, pre: true, res: true, edu: false } },
    vb12: { on: true, p: 18000, night: 0, nOn: false, dur: 30, inc: { ins: true, pre: true, res: true, edu: false } },
    vd: { on: true, p: 18000, night: 0, nOn: false, dur: 30, inc: { ins: true, pre: true, res: true, edu: false } },
    vfe: { on: true, p: 52000, night: 0, nOn: false, dur: 90, inc: { ins: true, pre: true, res: true, edu: true } },
    iny: { on: true, p: 18000, night: 22000, nOn: true, dur: 30, inc: { ins: true, pre: true, res: true, edu: false } },
    cur: { on: true, p: 24000, night: 0, nOn: false, dur: 45, inc: { ins: true, pre: false, res: true, edu: true } },
    cura: { on: false, p: 34000, night: 0, nOn: false, dur: 60, inc: { ins: true, pre: false, res: true, edu: true } },
    mue: { on: true, p: 15000, night: 0, nOn: false, dur: 20, inc: { ins: true, pre: false, res: true, edu: false } },
    sig: { on: true, p: 16000, night: 0, nOn: false, dur: 30, inc: { ins: false, pre: true, res: false, edu: true } },
    son: { on: false, p: 34000, night: 0, nOn: false, dur: 45, inc: { ins: true, pre: false, res: true, edu: true } },
    inysc: { on: true, p: 16000, night: 0, nOn: false, dur: 20, inc: { ins: true, pre: false, res: true, edu: true } },
    inyev: { on: false, p: 34000, night: 0, nOn: false, dur: 45, inc: { ins: true, pre: true, res: true, edu: false } },
    pun: { on: true, p: 18000, night: 0, nOn: false, dur: 30, inc: { ins: true, pre: false, res: true, edu: true } },
    via: { on: false, p: 58000, night: 0, nOn: false, dur: 45, inc: { ins: true, pre: false, res: true, edu: true } },
    recs: { on: false, p: 28000, night: 0, nOn: false, dur: 30, inc: { ins: true, pre: false, res: true, edu: true } },
    vac: { on: true, p: 16000, night: 0, nOn: false, dur: 20, inc: { ins: true, pre: false, res: true, edu: true } },
    insu: { on: true, p: 18000, night: 0, nOn: false, dur: 30, inc: { ins: true, pre: false, res: true, edu: true } },
    past: { on: true, p: 24000, night: 0, nOn: false, dur: 45, inc: { ins: true, pre: false, res: true, edu: true } },
    esc: { on: true, p: 34000, night: 0, nOn: false, dur: 60, inc: { ins: true, pre: false, res: true, edu: true } },
    dren: { on: false, p: 30000, night: 0, nOn: false, dur: 45, inc: { ins: true, pre: false, res: true, edu: true } },
    valo: { on: true, p: 32000, night: 0, nOn: false, dur: 45, inc: { ins: true, pre: false, res: true, edu: true } },
    alta: { on: true, p: 40000, night: 0, nOn: false, dur: 60, inc: { ins: true, pre: false, res: true, edu: true } },
    sonali: { on: false, p: 34000, night: 0, nOn: false, dur: 45, inc: { ins: true, pre: false, res: true, edu: true } },
    ost: { on: false, p: 34000, night: 0, nOn: false, dur: 45, inc: { ins: true, pre: false, res: true, edu: true } },
    traq: { on: false, p: 40000, night: 0, nOn: false, dur: 45, inc: { ins: true, pre: false, res: true, edu: true } },
    oxi: { on: false, p: 24000, night: 0, nOn: false, dur: 30, inc: { ins: true, pre: false, res: true, edu: true } },
    pal: { on: false, p: 52000, night: 0, nOn: false, dur: 60, inc: { ins: true, pre: false, res: true, edu: true } },
    diab: { on: true, p: 26000, night: 0, nOn: false, dur: 45, inc: { ins: true, pre: false, res: true, edu: true } },
    edu: { on: true, p: 16000, night: 0, nOn: false, dur: 30, inc: { ins: true, pre: false, res: true, edu: true } },
    rcp: { on: false, p: 62000, night: 0, nOn: false, dur: 150, inc: { ins: true, pre: false, res: true, edu: true } },
    suero: { on: false, p: 48000, night: 0, nOn: false, dur: 60, inc: { ins: true, pre: true, res: true, edu: false } },
  },
  sh: { h: 12, jor: 'dia', start: 0, rep: { lun: false, mar: true, mie: false, jue: true, vie: false, sab: true, dom: true }, wk: 2, need: { hig: true, ali: true, mov: true, rem: false, com: true } },
  share: 'res', sharePh: false, shareOk: true, fichaOk: false, fichaChk: false, fm: 'mama', tlF: 'all', note: { hin: '08:02', hout: '08:41', tpl: 'cur', sig: false, add: false, rec: { a: true, b: true, c: true }, al: { a: true, b: true, c: true }, med5: { pac: true, med: true, dos: true, via: true, hor: true }, h0: '08:00', dur: '3 dosis', foto: true, prox: 2 }, bit: { h: 2 }, pushSeen: false, noteSigned: false, wsel: 'w1',
  edit: 'iny', setup: { pres: true, serv: false, com: false, hor: false },
  com: { prov: true, nun: true, lr: true, lc: false, vit: false, pen: false, stgo: true, mac: false, flo: false, sjo: false },
  week: { lun: true, mar: true, mie: true, jue: true, vie: true, sab: true, dom: false }, gap: 30, antic: 2,
  blocked: { 30: true }, req: { r1: 'new', r2: 'new' }, aday: 1, spec: { am: true, pd: true, ped: false, pal: false },
  sis: 0, aprob: [], rech: [], admTab: 'rev', cand: 0, aedit: 'iny', comm: 15,
  mins: { vneu: 12000, vb12: 12000, vd: 12000, vc: 30000, vfe: 38000, vsue: 38000, vmg: 30000, vmed: 18000, iny: 12000, inysc: 12000, inyev: 26000, via: 44000, recs: 22000, suero: 36000, vac: 12000, insu: 14000, past: 18000, cur: 15000, cura: 24000, esc: 26000, pun: 16000, dren: 22000, mue: 5000, ecg: 25000, holt: 68000, valo: 24000, cuid: 32000, acomp: 23000, bano: 18000, cogn: 16000, tens8: 37000, pos: 38000, sonali: 26000, son: 25000, ost: 26000, traq: 30000, oxi: 18000, pack: 250000, alta: 30000, noche: 40000, hdia: 27000, hnoc: 32000, h24: 52000, ncasa: 34000, pal: 40000, fin: 36000, sig: 12000, diab: 20000, edu: 12000, rcp: 48000 }, aRec: true,
});
let S = S0();
let view = localStorage.getItem('cv') || 'm';
let cur = null, stack = [], timers = [], maps = [], toastMsg = null, toastT = null;
const NATIVE = Math.min(window.innerWidth, window.screen.width) < 600;
if (NATIVE) view = 'm';

const SC = {};           // pantallas
const ACT = {};          // acciones
const def = s => (SC[s.id] = s);
const roleOf = id => id[0] === 'R' ? 'pro' : id[0] === 'A' ? 'adm' : id[0] === 'Q' ? 'ase' : 'pac';
const START = { pac: 'P06', pro: 'R01', adm: 'A01', ase: 'Q01' };
const ROLE_N = { pac: 'Paciente', pro: 'Profesional', adm: 'Admin', ase: 'Asesor' };
// equivalencias entre iPhone y escritorio
const TO_D = { P06: 'W01', P10: 'W02', P12: 'W03', P13: 'W03', P21: 'W04' };
const TO_M = { W01: 'P06', W02: 'P10', W03: 'P12', W04: 'P21' };
const resolve = id => {
  const r = roleOf(id);
  if (r === 'adm') return id;
  if (view === 'd' && TO_D[id]) return TO_D[id];
  if (view === 'm' && TO_M[id]) return TO_M[id];
  return id;
};

/* ---------- datos de mapa ---------- */
const G = window.GEO;
const PLACE = {
  mama: { ll: G.mama, n: 'Av. Irarrázaval 3450', c: 'Ñuñoa', full: 'Av. Irarrázaval 3450, depto 1204, Ñuñoa', route: G.route, km: '2,9', min: 9 },
  casa: { ll: G.casa, n: 'Los Leones 1180', c: 'Providencia', full: 'Los Leones 1180, depto 52, Providencia', route: G.routeCasa, km: '2,7', min: 8 },
};
const P = () => PLACE[S.addr];

/* ---------- catálogo de Cuidapp (lo define Cuidapp; el precio lo pone cada profesional) ----------
   who: enf = enfermera/o universitaria · tens = técnico en enfermería · cuid = cuidadora
   ind: requiere indicación o receta médica · dt: duración típica · base: precio de referencia del estudio de mercado
   turno: se agenda por turnos (tp = precio de referencia por turno según horas) */
const CAT = {
  // 1. Inyecciones y medicamentos
  iny: { n: 'Inyección intramuscular', s: 'Intramuscular', g: 'iny', d: 'Neurobionta, vitamina B12 y otras. Verifica la receta y observa la reacción', ic: 'syringe', who: ['enf', 'tens'], dur: 30, dt: '20–30 min', ind: 'Sí', receta: true, base: 14990 },
  inysc: { n: 'Inyección subcutánea', s: 'Subcutánea', g: 'iny', d: 'Heparina, enoxaparina y otras indicadas', ic: 'syringe', who: ['enf', 'tens'], dur: 20, dt: '20 min', ind: 'Sí', receta: true, base: 14990 },
  inyev: { n: 'Medicamento endovenoso', s: 'Endovenoso', g: 'iny', d: 'Vía venosa, administración (hasta 45 min), control y retiro', ic: 'syringe', who: ['enf'], dur: 60, dt: '45–60 min', ind: 'Sí', receta: true, base: 32890 },
  via: { n: 'Instalación o retiro de vía SC o EV', s: 'Vía SC o EV', g: 'iny', d: 'Vía, fijación y educación a la familia', ic: 'syringe', who: ['enf'], dur: 45, dt: '45 min', ind: 'Sí', receta: true, base: 54990 },
  recs: { n: 'Recambio de suero en vía instalada', s: 'Recambio de suero', g: 'iny', d: 'Recambio del suero o medicamento y control de la vía', ic: 'drop', who: ['enf'], dur: 30, dt: '30 min', ind: 'Sí', receta: true, base: 26990 },
  suero: { n: 'Hidratación o sueroterapia EV', s: 'Sueroterapia', g: 'iny', d: 'Suero, vía y control. El suero se paga aparte', ic: 'drop', who: ['enf'], dur: 90, dt: '60–90 min', ind: 'Sí', receta: true, base: 45000 },
  vac: { n: 'Vacuna a domicilio', s: 'Vacuna', g: 'iny', d: 'Administración, registro y observación. La vacuna se paga aparte', ic: 'syringe', who: ['enf'], dur: 20, dt: '20 min', ind: 'Según la vacuna', base: 14990 },
  insu: { n: 'Insulina y control de glicemia', s: 'Insulina', g: 'iny', d: 'Glicemia capilar, dosis según tu esquema y registro', ic: 'syringe', who: ['enf', 'tens'], dur: 30, dt: '20–30 min', ind: 'Sí', receta: true, base: 18000 },
  past: { n: 'Preparación de pastillero semanal', s: 'Pastillero', g: 'iny', d: 'Ordena los remedios por día y hora según la receta y deja una planilla', ic: 'pill', who: ['enf'], dur: 45, dt: '30–45 min', ind: 'Receta vigente', base: 22000 },
  // 2. Curaciones y heridas
  cur: { n: 'Curación simple', s: 'Simple', g: 'cur', d: 'Limpieza, cobertura y registro. Heridas pequeñas y quemaduras leves', ic: 'bandaids', who: ['enf', 'tens'], dur: 45, dt: '30–45 min', ind: 'Recomendada', base: 20000 },
  cura: { n: 'Curación avanzada', s: 'Avanzada', g: 'cur', i: 'cura', d: 'Úlceras, pie diabético y quemaduras. Apósitos especiales y fotos de control', ic: 'first-aid', who: ['enf'], dur: 60, dt: '45–60 min', ind: 'Sí', base: 30000 },
  esc: { n: 'Úlceras por presión (escaras)', s: 'Escaras', g: 'cur', i: 'cura', d: 'Valoración, curación y plan de cambios de posición', ic: 'first-aid', who: ['enf'], dur: 60, dt: '45–60 min', ind: 'Recomendada', base: 32000 },
  pun: { n: 'Herida operatoria y retiro de puntos', s: 'Herida operatoria', g: 'cur', d: 'Curación de la herida, retiro de puntos o corchetes y educación', ic: 'bandaids', who: ['enf'], dur: 30, dt: '30 min', ind: 'Sí (cirujano)', base: 22000 },
  dren: { n: 'Manejo de drenajes', s: 'Drenajes', g: 'cur', i: 'cura', d: 'Medición del débito, curación del sitio y registro', ic: 'first-aid', who: ['enf'], dur: 45, dt: '30–45 min', ind: 'Sí', base: 28000 },
  // 3. Exámenes a domicilio
  mue: { n: 'Toma de muestras a domicilio', s: 'Toma de muestras', g: 'mue', d: 'Sangre u orina. Más de 650 exámenes, sin orden médica', ic: 'test-tube', who: ['enf', 'tens'], dur: 20, dt: '15–20 min', ind: 'No', lab: true, base: 6490 },
  ecg: { n: 'Electrocardiograma a domicilio', s: 'Electrocardiograma', g: 'mue', i: 'sig', d: 'Registro e informe por cardiólogo', ic: 'heartbeat', who: ['enf'], dur: 30, dt: '30 min', ind: 'Sí', soon: true, base: 31990 },
  holt: { n: 'Holter de presión o de ritmo', s: 'Holter', g: 'mue', i: 'cron', d: 'Instalación del equipo, retiro e informe', ic: 'heartbeat', who: ['enf'], dur: 30, dt: '24 h', ind: 'Sí', soon: true, base: 84990 },
  // 4. Adulto mayor
  valo: { n: 'Valoración integral de enfermería', s: 'Valoración integral', g: 'am', d: 'Signos vitales, riesgo de caídas, piel, remedios y plan de cuidados', ic: 'clipboard-text', who: ['enf'], dur: 45, dt: '45 min', ind: 'No', base: 30000 },
  cuid: { n: 'Cuidadora de adulto mayor por turno', s: 'Cuidadora por turno', g: 'am', d: 'Higiene, alimentación, compañía, ayuda con remedios y movilización', ic: 'hand-heart', who: ['cuid', 'tens'], dur: 480, dt: '8, 12 o 24 h', ind: 'No', turno: true, tp: { 8: 40000, 12: 42000, 24: 80000 }, base: 40000 },
  acomp: { n: 'Acompañamiento por horas', s: 'Acompañamiento', g: 'am', d: 'Compañía, paseo y apoyo en casa. Mínimo 3 horas', ic: 'hand-heart', who: ['cuid', 'tens'], dur: 180, dt: '3 a 6 h', ind: 'No', turno: true, tp: { 3: 29000, 4: 36000, 6: 52000 }, base: 29000 },
  bano: { n: 'Baño e higiene asistida', s: 'Baño asistido', g: 'am', d: 'Ducha o baño en cama, cuidado de la piel y cambio de ropa', ic: 'drop', who: ['cuid', 'tens'], dur: 90, dt: '60–90 min', ind: 'No', base: 22000 },
  cogn: { n: 'Estimulación cognitiva y compañía', s: 'Estimulación cognitiva', g: 'am', d: 'Juegos de memoria, conversación y rutina diaria', ic: 'puzzle-piece', who: ['cuid'], dur: 120, dt: '2 h', ind: 'No', base: 20000 },
  // 5. Postrados y dependencia
  tens8: { n: 'TENS por turno', s: 'TENS por turno', g: 'pd', d: 'Higiene, movilización, signos vitales, remedios y registro en bitácora', ic: 'hand-heart', who: ['tens'], dur: 480, dt: '8, 12 o 24 h', ind: 'No', turno: true, tp: { 8: 46000, 12: 48000, 24: 92000 }, base: 46000 },
  pos: { n: 'Cambios de posición y prevención de escaras', s: 'Cambios de posición', g: 'pd', d: 'Cambios cada 2 horas, cuidado de la piel y registro', ic: 'arrows-clockwise', who: ['tens', 'cuid'], dur: 720, dt: 'Turno de 12 o 24 h', ind: 'No', turno: true, tp: { 12: 48000, 24: 92000 }, base: 48000 },
  sonali: { n: 'Alimentación por sonda', s: 'Alimentación por sonda', g: 'pd', i: 'son', d: 'Sonda nasogástrica o gastrostomía: instalación, control y educación', ic: 'first-aid-kit', who: ['enf'], dur: 45, dt: '45 min', ind: 'Sí', base: 32000 },
  son: { n: 'Sonda Foley', s: 'Sonda Foley', g: 'pd', i: 'son', d: 'Instalación, cambio, retiro o control de la sonda urinaria', ic: 'first-aid-kit', who: ['enf'], dur: 45, dt: '45 min', ind: 'Sí', base: 31990 },
  ost: { n: 'Cuidado de ostomías', s: 'Ostomías', g: 'pd', i: 'son', d: 'Cambio de bolsa, cuidado de la piel y educación a la familia', ic: 'first-aid-kit', who: ['enf'], dur: 45, dt: '45 min', ind: 'Recomendada', base: 32000 },
  traq: { n: 'Traqueostomía y aspiración', s: 'Traqueostomía', g: 'pd', i: 'son', d: 'Aspiración de secreciones, curación del estoma y educación', ic: 'wind', who: ['enf'], dur: 45, dt: '45 min', ind: 'Sí', base: 38000 },
  oxi: { n: 'Oxigenoterapia', s: 'Oxígeno', g: 'pd', i: 'cron', d: 'Control de saturación, uso del equipo y educación', ic: 'wind', who: ['enf', 'tens'], dur: 30, dt: '30 min', ind: 'Sí', base: 22000 },
  pack: { n: 'Plan dependencia severa', s: 'Plan semanal', g: 'pd', d: 'Enfermera coordinadora, visitas y turnos TENS. Plan semanal a medida', ic: 'users-three', who: ['enf'], dur: 60, dt: 'Plan semanal', ind: 'Sí', plan: true, base: 310000 },
  // 6. Post-operatorio y alta
  alta: { n: 'Visita post-alta de enfermería', s: 'Visita post-alta', g: 'post', d: 'Revisa la epicrisis, ordena los remedios, controla la herida y signos de alarma', ic: 'clipboard-text', who: ['enf'], dur: 60, dt: '45–60 min', ind: 'Epicrisis', base: 38000 },
  noche: { n: 'Turno de noche post-cirugía', s: 'Noche post-cirugía', g: 'post', i: 'turn', d: 'Vigilancia, ayuda para ir al baño, dolor y signos de alarma', ic: 'moon', who: ['tens', 'cuid'], dur: 720, dt: '12 h', ind: 'No', turno: true, jor: 'noche', tp: { 12: 50000 }, base: 50000 },
  // 7. Turnos y acompañamiento
  hdia: { n: 'Acompañamiento hospitalario de día', s: 'Hospital de día', g: 'turn', d: 'Compañía en la clínica u hospital, apoyo en comidas y aviso a la familia', ic: 'hospital', who: ['cuid', 'tens'], dur: 480, dt: '8 o 12 h', ind: 'No', turno: true, jor: 'dia', tp: { 8: 34000, 12: 45000 }, base: 34000 },
  hnoc: { n: 'Acompañamiento hospitalario de noche', s: 'Hospital de noche', g: 'turn', d: 'Noche completa en la clínica para que la familia descanse', ic: 'moon', who: ['cuid', 'tens'], dur: 720, dt: '12 h', ind: 'No', turno: true, jor: 'noche', tp: { 12: 40000 }, base: 40000 },
  h24: { n: 'Acompañamiento hospitalario 24 h', s: 'Hospital 24 h', g: 'turn', d: 'Turno completo con entrega de turno escrita', ic: 'hospital', who: ['cuid', 'tens'], dur: 1440, dt: '24 h', ind: 'No', turno: true, tp: { 24: 65000 }, base: 65000 },
  ncasa: { n: 'Turno de noche en casa', s: 'Noche en casa', g: 'turn', d: 'Vigilancia nocturna, cambios de posición y ayuda para ir al baño', ic: 'moon', who: ['cuid', 'tens'], dur: 720, dt: '10 o 12 h', ind: 'No', turno: true, jor: 'noche', tp: { 10: 42000, 12: 45000 }, base: 42000 },
  // 8. Cuidados paliativos
  pal: { n: 'Visita de enfermería paliativa', s: 'Visita paliativa', g: 'pal', d: 'Control del dolor y síntomas, apoyo a la familia. Coordinada con el equipo tratante', ic: 'heart', who: ['enf'], dur: 60, dt: '60 min', ind: 'Sí (equipo tratante)', base: 50000 },
  fin: { n: 'Acompañamiento de final de vida', s: 'Final de vida', g: 'pal', d: 'Confort, higiene, posición y compañía, de día o de noche', ic: 'heart', who: ['tens', 'cuid'], dur: 720, dt: '12 o 24 h', ind: 'No', turno: true, tp: { 12: 45000, 24: 85000 }, base: 45000 },
  // 1b. Vitaminas y sueros (la enfermera administra lo que la paciente trae con receta)
  vneu: { n: 'Neurobionta o complejo B', s: 'Neurobionta / complejo B', g: 'vit', i: 'vit', d: 'Inyección intramuscular. Trae tu ampolla con receta', ic: 'syringe', who: ['enf', 'tens'], dur: 30, dt: '20–30 min', ind: 'Sí', receta: true, base: 14990 },
  vb12: { n: 'Vitamina B12 inyectable', s: 'Vitamina B12', g: 'vit', i: 'vit', d: 'Intramuscular. Trae tu ampolla con receta', ic: 'syringe', who: ['enf', 'tens'], dur: 30, dt: '20–30 min', ind: 'Sí', receta: true, base: 14990 },
  vd: { n: 'Vitamina D en ampolla', s: 'Vitamina D', g: 'vit', i: 'vit', d: 'Intramuscular, por ejemplo 600.000 UI. Trae tu ampolla con receta', ic: 'syringe', who: ['enf', 'tens'], dur: 30, dt: '20–30 min', ind: 'Sí', receta: true, base: 15990 },
  vc: { n: 'Vitamina C endovenosa', s: 'Vitamina C EV', g: 'vit', i: 'vit', d: 'Vía venosa, goteo controlado y retiro. Trae el medicamento con receta', ic: 'drop', who: ['enf'], dur: 60, dt: '45–60 min', ind: 'Sí', receta: true, base: 39990 },
  vfe: { n: 'Hierro endovenoso', s: 'Hierro EV', g: 'vit', i: 'vit', d: 'Goteo lento con control de reacción durante y después. Trae el medicamento con receta', ic: 'drop', who: ['enf'], dur: 90, dt: '60–90 min', ind: 'Sí', receta: true, base: 49990 },
  vsue: { n: 'Sueroterapia con vitaminas', s: 'Suero con vitaminas', g: 'vit', i: 'vit', d: 'Hidratación EV con las vitaminas indicadas por tu médico', ic: 'drop', who: ['enf'], dur: 90, dt: '60–90 min', ind: 'Sí', receta: true, base: 49990 },
  vmg: { n: 'Magnesio endovenoso', s: 'Magnesio EV', g: 'vit', i: 'vit', d: 'Vía venosa y control de presión. Trae el medicamento con receta', ic: 'drop', who: ['enf'], dur: 60, dt: '45–60 min', ind: 'Sí', receta: true, base: 39990 },
  vmed: { n: 'Vitaminas con medicamento incluido', s: 'Con medicamento incluido', g: 'vit', i: 'vit', d: 'Te llevamos la ampolla con tu receta', ic: 'pill', who: ['enf'], dur: 30, dt: '30 min', ind: 'Sí', receta: true, soon: true, base: 24990 },
  // Ver todas · control de crónicos
  sig: { n: 'Control de signos vitales', s: 'Signos vitales', g: 'cron', d: 'Presión, glicemia, temperatura y saturación, con registro', ic: 'heartbeat', who: ['enf', 'tens'], dur: 30, dt: '20–30 min', ind: 'No', base: 15000 },
  diab: { n: 'Programa de diabetes', s: 'Programa diabetes', g: 'cron', d: 'Visitas periódicas: glicemia, insulina, pie y educación', ic: 'calendar-check', who: ['enf'], dur: 45, dt: '45 min por visita', ind: 'Recomendada', base: 25000 },
  // Ver todas · educación
  edu: { n: 'Educación a la familia o cuidadora', s: 'Educación', g: 'edu', d: 'Cómo movilizar, curar, alimentar por sonda o dar remedios', ic: 'chalkboard-teacher', who: ['enf'], dur: 30, dt: '30–60 min', ind: 'No', base: 15000 },
  rcp: { n: 'Taller de RCP y primeros auxilios', s: 'Taller RCP', g: 'edu', d: 'Para la familia en tu casa, con muñeco de práctica', ic: 'heartbeat', who: ['enf'], dur: 150, dt: '2–3 h', ind: 'No', base: 60000 },
};
/* categorías (lo que ve la paciente primero); cada una agrupa servicios concretos */
const GRP = {
  iny: { n: 'Inyecciones y medicamentos', c: 'Inyecciones', d: 'Intramuscular, endovenosa, sueros, vacunas, insulina y pastillero', l: ['iny', 'inysc', 'inyev', 'via', 'recs', 'suero', 'vac', 'insu', 'past'] },
  vit: { n: 'Vitaminas y sueros', c: 'Vitaminas', d: 'Neurobionta, B12, vitamina D y C, hierro y magnesio. Trae tu ampolla con receta', l: ['vneu', 'vb12', 'vd', 'vc', 'vfe', 'vsue', 'vmg', 'vmed'] },
  mue: { n: 'Exámenes de laboratorio', c: 'Exámenes de laboratorio', d: 'Más de 650 exámenes. Sin orden médica: nosotros la gestionamos', lab: true, l: ['mue', 'ecg', 'holt'] },
  cur: { n: 'Curaciones y heridas', c: 'Curaciones', d: 'Simple, avanzada, escaras, herida operatoria y drenajes', l: ['cur', 'cura', 'esc', 'pun', 'dren'] },
  am: { n: 'Adulto mayor', c: 'Adulto mayor', d: 'Cuidadoras por turno, acompañamiento, valoración y baño asistido', l: ['valo', 'cuid', 'acomp', 'bano', 'cogn'] },
  pd: { n: 'Postrados y dependencia', c: 'Postrados', d: 'Turnos TENS, sondas, ostomías, oxígeno y prevención de escaras', l: ['tens8', 'pos', 'sonali', 'son', 'ost', 'traq', 'oxi', 'pack'] },
  post: { n: 'Post-operatorio y alta', c: 'Post-operatorio', d: 'Para volver a casa tranquilos después de la clínica', l: ['alta', 'pun', 'noche'], x: true },
  turn: { n: 'Turnos y acompañamiento', c: 'Turnos', d: 'De día, de noche o 24 horas, en casa o en el hospital', l: ['hdia', 'hnoc', 'h24', 'ncasa', 'cuid'] },
  pal: { n: 'Cuidados paliativos', c: 'Paliativos', d: 'Confort y compañía, coordinados con el equipo tratante', l: ['pal', 'fin'], x: true },
  cron: { n: 'Control de crónicos', c: 'Crónicos', d: 'Signos vitales y programa de diabetes', l: ['sig', 'diab'], x: true },
  edu: { n: 'Educación a la familia', c: 'Educación', d: 'Aprende a cuidar en casa', l: ['edu', 'rcp'], x: true },
};
const GK = Object.keys(GRP).filter(k => !GRP[k].x);   // grilla de inicio: 7 categorías + «Ver todas»
const GX = Object.keys(GRP).filter(k => GRP[k].x);    // solo en «Ver todas»
const GALL = Object.keys(GRP);
const IC3 = { am: 'tens4', pal: 'sig' };              // íconos reutilizados
const WHO = { enf: 'Enfermera', tens: 'TENS', cuid: 'Cuidadora' };
const whoB = k => `<span class="wb">${CAT[k].who.map(w => WHO[w]).join(' · ')}</span>`;
const indB = k => CAT[k].ind && CAT[k].ind !== 'No' ? `<span class="ib2">${ic('file-text')}Ind. médica${CAT[k].ind !== 'Sí' ? ': ' + CAT[k].ind.replace(/^Sí \((.*)\)$/, '$1').toLowerCase() : ''}</span>` : '';
/* recargos: los define cada profesional (reglas por horario, día y urgencia). Admin fija un tope. */
function RC0() { return [
  { id: 'noc', t: 'hora', n: 'Nocturno', a: '20:00', b: '08:00', k: '%', v: 25, on: true },
  { id: 'sab', t: 'dia', n: 'Sábado', d: 'sab', k: '%', v: 0, on: false },
  { id: 'dom', t: 'dia', n: 'Domingo', d: 'dom', k: '%', v: 50, on: true },
  { id: 'fes', t: 'dia', n: 'Festivos', d: 'fest', k: '%', v: 100, on: true },
  { id: 'urg', t: 'urg', n: 'Urgencia (mismo día)', k: '$', v: 5000, on: false }]; }
const RB_FEE = 3500;
const CUIDA_P = 15, CUIDA_MAX = 20000; /* primera atención: 15% del servicio, hasta $20.000 */
const cuidaOf = svc => S.cuida && svc > 0 ? Math.min(CUIDA_MAX, Math.round(svc * CUIDA_P / 100 / 10) * 10) : 0;
const cuidaLine = svc => { const d = cuidaOf(svc); return d ? [['Descuento primera atención (CUIDA15)', -d, 'dsc']] : []; }; /* gestión de reembolso automático, por solicitud */
const rcOf = pr => pr.id === 'cr' ? S.rc : (pr.rc || (pr.rc = RC0().map(r => pr.rcx && pr.rcx[r.id] ? { ...r, ...pr.rcx[r.id] } : r)));
const inWin = (t, a, b) => a <= b ? t >= a && t < b : t >= a || t < b;
const dayOf = i => new Date(2026, 9, 26 + i);
const rcPct = (pr, id) => { const r = rcOf(pr).find(x => x.id === id); return r && r.on && r.k === '%' ? Math.min(r.v, S.rcMax) : 0; };
const rcAmt = (r, base) => r.k === '%' ? Math.round(base * Math.min(r.v, S.rcMax) / 100 / 100) * 100 : Math.min(r.v, Math.round(base * S.rcMax / 100));
const rcVal = r => r.k === '%' ? `+${r.v}%` : `+${clp(r.v)}`;
function rcHits(pr, di, t, urg) {
  const d = dayOf(di), wd = WD[d.getDay()], fe = !!festOf(d), on = rcOf(pr).filter(r => r.on && r.v > 0);
  const hr = on.filter(r => r.t === 'hora' && t && inWin(t, r.a, r.b));
  const dy = on.filter(r => r.t === 'dia' && (r.d === 'fest' ? fe : r.d === wd)); const dmax = dy.sort((a, b) => b.v - a.v).slice(0, 1);
  const ug = urg ? on.filter(r => r.t === 'urg') : [];
  return [...hr, ...dmax, ...ug];
}
function rcLines(pr, base, di, t, urg) {
  const cap = Math.round(base * S.rcMax / 100); let acc = 0;
  return rcHits(pr, di, t, urg).map(r => { const a = Math.min(rcAmt(r, base), cap - acc); acc += a; return [`Recargo ${r.n.toLowerCase().replace(' (mismo día)', '')} ${rcVal(r)}`, a]; }).filter(x => x[1] > 0);
}
const rcTag = (pr, di, t) => { const h = rcHits(pr, di, t, false); return h.length ? `<small>${h.map(rcVal).join(' ')}</small>` : ''; };
const SUR = { get dom() { return rcPct(PRO(), 'dom') / 100; }, get fest() { return rcPct(PRO(), 'fes') / 100; }, get noche() { return rcPct(PRO(), 'noc') / 100; } };
const FEST = { '31-10': 'Día de las Iglesias Evangélicas', '1-11': 'Todos los Santos', '8-12': 'Inmaculada Concepción' };
/* iconos 3D de servicios (img/iconos-3d); el resto de la interfaz usa Phosphor */
const i3k = k => CAT[k] ? (CAT[k].i || IC3[CAT[k].g] || CAT[k].g) : (IC3[k] || k);
const i3 = (k, c = '') => `<img class="i3d ${c}" src="img/iconos-3d/${i3k(k)}.webp?v=20261026j" alt="" draggable="false">`;
const INC = { ins: 'Insumos: jeringa, aguja, tórulas y guantes', pre: 'Control de presión antes y después', res: 'Retiro de residuos clínicos', edu: 'Indicaciones escritas para la familia' };
/* catálogo del laboratorio: precios fijos, no los pone la profesional */
const LAB = 'Laboratorio';
/* catálogo completo (examenes.js, desde el Excel del laboratorio): [nombre, precio, tubo, ayuno, tipo de precio c|p, código, código Fonasa, muestra, plazo, nombre completo] */
const EXAMS = {};
EXDB.forEach(r => { EXAMS[r[0]] = [r[1], r[2], r[7] || r[6] || 'Según indicación', r[9], r[3], r[4], r[5], r[6], r[8], r[10] || r[1]]; });
const QRES = {};   // listas de resultados que se actualizan al escribir (lab.js)
const EXPOP = ['hemo', 'lip', 'gli', 'bioq', 'ori', 'uro', 'tsh', 't4', 'hba', 'cre', 'vitd', 'pcr'];
const examKeys = () => Object.keys(EXAMS).filter(k => S.exams[k]);
const examList = () => examKeys().map(k => EXAMS[k]);
const examSum = () => examList().reduce((a, e) => a + e[1], 0);
const byOrder = () => S.mmode === 'orden' && S.ord !== 'ok';
const fasting = () => !byOrder() && examKeys().some(k => EXAMS[k][3]) || byOrder();
const tubes = () => [...new Set(examList().map(e => e[2]))];
const DAYS = [['Lun', 26, 'Hoy', 'hoy lun 26 oct'], ['Mar', 27, 'Mañana', 'mar 27 oct'], ['Mié', 28, '', 'mié 28 oct'], ['Jue', 29, '', 'jue 29 oct'], ['Vie', 30, '', 'vie 30 oct'], ['Sáb', 31, '', 'sáb 31 oct']];
const dayShort = i => DAYS[i][2] || `${DAYS[i][0]} ${DAYS[i][1]}`;

/* profesionales de ejemplo (datos ficticios) */
const PROS = [
  { id: 'cr', n: 'Camila Rojas', i: 'CR', t: 'Enfermera', k: 'enf', g: 'f', reg: '482.317', r: '4,9', rn: 4.9, a: 132, rv: 92, km: 1.8, yrs: 6, bg: '#EEEAFB', fg: '#4447C2', top: true,
    com: ['Ñuñoa', 'Providencia', 'La Reina', 'Santiago'], tel: '+56 9 7712 3008', resp: '20 min',
    bio: 'Soy enfermera de la U. de Chile y trabajé 5 años en medicina interna del Hospital del Salvador. Atiendo a domicilio hace 3 años, sobre todo a adultos mayores. Me gusta explicar todo con calma y dejar las indicaciones por escrito para la familia.',
    spec: ['Adulto mayor', 'Inyecciones con receta', 'Curaciones', 'Paciente diabético'],
    edu: [['Enfermería', 'Universidad de Chile', '2019'], ['Diplomado en Heridas y Ostomías', 'Pontificia Universidad Católica', '2022'], ['Curso IAAS y RCP básico', 'Hospital del Salvador', '2024']],
    dist: [91, 7, 2, 0, 0], crit: [['Puntualidad', '4,9'], ['Trato', '5,0'], ['Técnica', '4,9'], ['Explica todo', '4,9']],
    f: 1.1, gs: [], p: { iny: 18000, cur: 24000, mue: 15000, sig: 12000 }, night: { iny: 22000 }, xinc: 'Control de presión antes y después',
    sl: [[], ['08:00', '09:00', '11:30', '19:00', '21:00'], ['08:00', '10:00', '18:30', '21:00'], ['09:00', '12:00', '19:30'], ['08:00', '08:30', '17:00'], ['10:00', '11:00']] },
  { id: 'fa', n: 'Fernanda Araya', i: 'FA', t: 'Enfermera', k: 'enf', g: 'f', reg: '512.884', r: '5,0', rn: 5.0, a: 61, rv: 44, km: 3.2, yrs: 3, bg: '#F3F3F5', fg: '#111111',
    com: ['Ñuñoa', 'Macul', 'La Florida', 'Peñalolén'], tel: '+56 9 6620 1475', resp: '15 min',
    bio: 'Enfermera de la U. de Santiago. Vengo de atención primaria en el Cesfam de Macul y me especialicé en curaciones de pie diabético. Te enseño a cuidar la herida entre una visita y otra.',
    spec: ['Pie diabético', 'Heridas complejas', 'Sondas'],
    edu: [['Enfermería', 'Universidad de Santiago', '2022'], ['Curso de Curación Avanzada de Heridas', 'Fundación Instituto Nacional de Heridas', '2023']],
    dist: [98, 2, 0, 0, 0], crit: [['Puntualidad', '5,0'], ['Trato', '5,0'], ['Técnica', '5,0'], ['Explica todo', '4,9']],
    f: 1.15, gs: ['iny', 'cur', 'pd', 'post', 'cron'], p: { iny: 22000, cur: 28000, cura: 38000, mue: 17000, son: 32000 }, night: {}, xinc: 'Fotos de control de la herida',
    sl: [['19:30', '20:30'], ['07:30', '13:00', '20:00'], ['07:30', '14:00'], ['16:00', '20:00'], ['07:30'], []] },
  { id: 'mc', n: 'Matías Contreras', i: 'MC', t: 'Enfermero', k: 'enf', g: 'm', reg: '505.317', r: '4,7', rn: 4.7, a: 48, rv: 31, km: 0.9, yrs: 2, bg: '#EEEAFB', fg: '#3D3FB0',
    com: ['Ñuñoa', 'Santiago'], tel: '+56 9 5531 8820', resp: '1 h',
    bio: 'Enfermero de la U. Andrés Bello. Trabajo en la urgencia de la Clínica Indisa y atiendo a domicilio en mis días libres. Rápido, ordenado y con buen precio.',
    spec: ['Inyecciones', 'Toma de muestras', 'Control de presión'],
    edu: [['Enfermería', 'Universidad Andrés Bello', '2023'], ['Curso de Urgencias Prehospitalarias', 'Clínica Indisa', '2024']],
    dist: [76, 18, 4, 2, 0], crit: [['Puntualidad', '4,8'], ['Trato', '4,7'], ['Técnica', '4,8'], ['Explica todo', '4,5']],
    f: 0.95, gs: ['iny', 'mue', 'cron', 'edu'], p: { iny: 15000, cur: 20000, mue: 13000, sig: 10000 }, night: {}, xinc: '',
    sl: [[], [], ['09:00', '10:00', '11:00'], ['09:00', '15:00'], ['18:00', '19:00'], ['09:00', '10:00', '11:00', '12:00']] },
  { id: 'pg', n: 'Paula Godoy', i: 'PG', t: 'TENS', k: 'tens', g: 'f', reg: '311.208', r: '4,8', rn: 4.8, a: 87, rv: 63, km: 2.4, yrs: 8, bg: '#F3F3F5', fg: '#2A2A2E',
    com: ['Providencia', 'Ñuñoa', 'Santiago'], tel: '+56 9 8840 1206', resp: '25 min',
    bio: 'Técnica en enfermería (TENS) con 8 años en el Hospital Salvador. Acompaño a adultos mayores en su casa: higiene, movilización, remedios y compañía. También pongo inyecciones con receta.',
    spec: ['Cuidado de adulto mayor', 'Turnos de 8, 12 y 24 h', 'Movilización', 'Inyecciones con receta'],
    edu: [['Técnico de Nivel Superior en Enfermería', 'Inacap', '2017'], ['Curso de Cuidados Paliativos', 'Fundación Paliativos Chile', '2021']],
    dist: [84, 12, 3, 1, 0], crit: [['Puntualidad', '4,9'], ['Trato', '5,0'], ['Técnica', '4,7'], ['Explica todo', '4,8']],
    f: 1.0, gs: ['iny', 'cur', 'mue', 'am', 'pd', 'turn', 'pal', 'cron'], p: { iny: 14000, mue: 12000, sig: 12000, tens8: 46000 }, night: { iny: 17000 }, xinc: 'Ayuda a ordenar los remedios de la semana',
    sl: [['20:00'], ['10:30', '12:00', '16:00'], ['10:30', '17:00'], ['08:00', '10:30'], ['10:30', '12:00'], ['09:00']] },
  { id: 'vm', n: 'Valentina Morales', i: 'VM', t: 'Enfermera', k: 'enf', g: 'f', reg: '509.663', r: '4,9', rn: 4.9, a: 203, rv: 148, km: 4.1, yrs: 11, bg: '#EEEAFB', fg: '#5557D9', top: true,
    com: ['Las Condes', 'La Reina', 'Vitacura', 'Ñuñoa'], tel: '+56 9 9012 4477', resp: '30 min',
    bio: 'Enfermera de la PUC con 11 años en clínica. Me especialicé en heridas y en pacientes postrados. Después de cada atención te mando un informe por correo.',
    spec: ['Heridas y úlceras', 'Paciente postrado', 'Sondas', 'Post operatorio'],
    edu: [['Enfermería', 'Pontificia Universidad Católica', '2015'], ['Magíster en Enfermería', 'Universidad de los Andes', '2020'], ['Certificación en Heridas', 'WCET', '2021']],
    dist: [90, 8, 1, 1, 0], crit: [['Puntualidad', '5,0'], ['Trato', '4,9'], ['Técnica', '5,0'], ['Explica todo', '4,9']],
    f: 1.25, gs: ['iny', 'cur', 'pd', 'post', 'pal', 'am', 'edu'], p: { iny: 25000, cur: 30000, cura: 42000, mue: 18000, son: 35000 }, night: { iny: 30000 }, xinc: 'Informe de la atención por correo',
    sl: [[], [], [], ['08:30', '10:00', '15:00'], ['08:30', '12:00'], ['10:00']] },
  { id: 'fl', n: 'Francisca León', i: 'FL', t: 'Enfermera', k: 'enf', g: 'f', reg: '498.120', r: '4,8', rn: 4.8, a: 156, rv: 104, km: 3.6, yrs: 9, bg: '#F3F3F5', fg: '#3A3A40',
    com: ['Las Condes', 'Providencia', 'Ñuñoa', 'Vitacura'], tel: '+56 9 7340 2291', resp: '40 min',
    bio: 'Enfermera de la U. de los Andes. Nueve años en pabellón y recuperación de la Clínica Alemana. Hoy atiendo post operatorios y toma de muestras a domicilio.',
    spec: ['Post operatorio', 'Toma de muestras', 'Inyecciones'],
    edu: [['Enfermería', 'Universidad de los Andes', '2017'], ['Diplomado en Enfermería Quirúrgica', 'Universidad de Chile', '2019']],
    dist: [85, 11, 3, 1, 0], crit: [['Puntualidad', '4,8'], ['Trato', '4,9'], ['Técnica', '4,9'], ['Explica todo', '4,7']],
    f: 1.15, gs: ['iny', 'cur', 'mue', 'post'], p: { iny: 20000, cur: 27000, cura: 40000, mue: 16000 }, night: { iny: 24000 }, xinc: 'Control de presión antes y después',
    sl: [[], ['18:00', '19:00'], ['08:00', '18:00'], ['08:00'], ['07:30', '09:00'], ['10:00', '11:00']] },
  { id: 'dn', n: 'Diego Navarro', i: 'DN', t: 'Enfermero', k: 'enf', g: 'm', reg: '517.402', r: '4,7', rn: 4.7, a: 64, rv: 47, km: 2.9, yrs: 4, bg: '#EEEAFB', fg: '#4447C2',
    com: ['Macul', 'La Florida', 'Ñuñoa', 'Peñalolén'], tel: '+56 9 6118 4420', resp: '35 min',
    bio: 'Enfermero de la U. Mayor. Trabajo en el Hospital Sótero del Río y atiendo a domicilio en la tarde. Llego con todo lo necesario y dejo todo limpio.',
    spec: ['Inyecciones', 'Signos vitales', 'Toma de muestras'],
    edu: [['Enfermería', 'Universidad Mayor', '2021'], ['Curso de Toma de Muestras', 'Laboratorio Bionet', '2022']],
    dist: [74, 21, 3, 2, 0], crit: [['Puntualidad', '4,7'], ['Trato', '4,8'], ['Técnica', '4,7'], ['Explica todo', '4,6']],
    f: 1.0, gs: ['iny', 'mue', 'cron', 'am'], p: { iny: 16000, cur: 22000, mue: 14000, sig: 11000 }, night: { iny: 19000 }, xinc: '',
    sl: [[], ['17:00', '18:30', '20:00'], ['17:00', '19:00'], ['18:00'], ['17:30', '19:00'], ['09:00', '10:30']] },
  { id: 'xv', n: 'Ximena Vera', i: 'XV', t: 'Cuidadora', k: 'cuid', g: 'f', reg: 'Curso OTEC 2019', r: '4,9', rn: 4.9, a: 74, rv: 51, km: 2.2, yrs: 12, bg: '#EEEAFB', fg: '#4447C2',
    com: ['Ñuñoa', 'Providencia', 'La Reina', 'Macul'], tel: '+56 9 7120 4486', resp: '20 min',
    bio: 'Soy cuidadora hace 12 años. Acompañé a mi propia mamá con alzhéimer y desde entonces cuido a adultos mayores en su casa y en clínicas. Hago turnos de día y de noche y dejo todo anotado en la bitácora para la familia.',
    spec: ['Adulto mayor', 'Alzhéimer y demencias', 'Turnos de noche', 'Acompañamiento hospitalario'],
    edu: [['Curso de Cuidador de Adulto Mayor', 'OTEC Senama', '2019'], ['Primeros auxilios y RCP básico', 'Cruz Roja Chilena', '2024']],
    dist: [92, 6, 2, 0, 0], crit: [['Puntualidad', '4,9'], ['Trato', '5,0'], ['Técnica', '4,8'], ['Explica todo', '4,9']],
    f: 1.0, gs: ['am', 'turn', 'pd', 'pal', 'post'], p: {}, night: {}, xinc: 'Bitácora del turno para la familia',
    sl: [['20:00'], ['08:00', '10:00', '14:00', '20:00'], ['08:00', '20:00'], ['08:00', '14:00'], ['08:00', '20:00'], ['09:00', '20:00']] },
  { id: 'mp', n: 'Marisol Paredes', i: 'MP', t: 'Cuidadora', k: 'cuid', g: 'f', reg: 'Curso OTEC 2021', r: '4,8', rn: 4.8, a: 39, rv: 28, km: 3.4, yrs: 7, bg: '#F3F3F5', fg: '#2A2A2E',
    com: ['Ñuñoa', 'Santiago', 'San Joaquín', 'Macul'], tel: '+56 9 6633 9012', resp: '30 min',
    bio: 'Cuidadora con 7 años en casas de reposo y a domicilio. Me especialicé en personas postradas: cambios de posición, baño en cama y alimentación. Soy tranquila y muy cariñosa.',
    spec: ['Paciente postrado', 'Baño en cama', 'Acompañamiento hospitalario'],
    edu: [['Curso de Cuidados Básicos de Enfermería', 'OTEC Fundación Las Rosas', '2021'], ['Prevención de úlceras por presión', 'Hospital del Salvador', '2023']],
    dist: [86, 10, 3, 1, 0], crit: [['Puntualidad', '4,8'], ['Trato', '4,9'], ['Técnica', '4,7'], ['Explica todo', '4,8']],
    f: 1.05, gs: ['am', 'turn', 'pd', 'post'], p: {}, night: {}, xinc: 'Bitácora del turno para la familia',
    sl: [[], ['09:00', '15:00', '20:00'], ['09:00', '20:00'], ['08:00', '20:00'], ['20:00'], ['09:00', '12:00']] },
];
PROS.forEach(p => { if (p.gs.includes('iny')) p.gs.push('vit'); });
const comStr = p => p.com.length > 1 ? p.com.slice(0, -1).join(', ') + ' y ' + p.com[p.com.length - 1] : p.com[0];
/* reseñas de ejemplo (r: estrellas) */
const REVIEWS = {
  cr: [
    { id: 'cr1', n: 'Carolina Méndez', c: 'Ñuñoa', d: 'hace 5 días', s: 'iny', r: 5, t: 'Vino a ponerle la Neurobionta a mi mamá de 78 años. Llegó puntual, le explicó todo con calma y ni lo sintió. Ya la agendamos para las otras dos dosis.' },
    { id: 'cr2', n: 'Jorge Tapia', c: 'Providencia', d: 'hace 2 semanas', s: 'cur', r: 5, t: 'Curación del pie impecable. Dejó todo limpio, anotó cómo estaba la herida y me mandó una foto por el chat para mostrársela a mi doctor.' },
    { id: 'cr3', n: 'Marcela Pizarro', c: 'La Reina', d: 'hace 3 semanas', s: 'mue', r: 5, t: 'Tomó las muestras a las 7:30 y antes de las 9 ya estaban en el laboratorio. Muy cuidadosa con las venas difíciles de mi papá.' },
    { id: 'cr4', n: 'Francisco Lagos', c: 'Ñuñoa', d: 'hace 1 mes', s: 'sig', r: 4, t: 'Muy amable y profesional. Llegó 10 minutos tarde, pero avisó por el chat con tiempo.' },
    { id: 'cr5', n: 'Rocío Villalobos', c: 'Santiago', d: 'hace 1 mes', s: 'iny', r: 5, t: 'Me dan pánico las agujas y Camila tuvo toda la paciencia del mundo. Súper recomendada.' },
    { id: 'cr6', n: 'Patricio Núñez', c: 'Providencia', d: 'hace 2 meses', s: 'cur', r: 5, t: 'Atendió a mi señora después de la operación de cadera. Puntual, ordenada y muy humana.' },
  ],
  fa: [
    { id: 'fa1', n: 'Soledad Ríos', c: 'Macul', d: 'hace 1 semana', s: 'cura', r: 5, t: 'Lleva tres semanas curando el pie diabético de mi papá y la herida ha mejorado muchísimo. Nos enseñó a cuidarla entre visitas.' },
    { id: 'fa2', n: 'Andrés Cifuentes', c: 'Ñuñoa', d: 'hace 3 semanas', s: 'iny', r: 5, t: 'Rápida, prolija y muy simpática. Llegó con todo.' },
    { id: 'fa3', n: 'Gloria Henríquez', c: 'La Florida', d: 'hace 1 mes', s: 'son', r: 5, t: 'Cambió la sonda de mi mamá sin ningún problema. Se nota que sabe.' },
  ],
  mc: [
    { id: 'mc1', n: 'Diego Saavedra', c: 'Ñuñoa', d: 'hace 4 días', s: 'iny', r: 5, t: 'Puntual y muy claro. Buen precio.' },
    { id: 'mc2', n: 'Paula Espinoza', c: 'Santiago', d: 'hace 2 semanas', s: 'mue', r: 4, t: 'La toma fue rápida. Le faltó avisar cuándo llegaban los resultados.' },
    { id: 'mc3', n: 'Hernán Bustos', c: 'Ñuñoa', d: 'hace 1 mes', s: 'sig', r: 5, t: 'Me controló la presión toda la semana. Muy responsable.' },
  ],
  pg: [
    { id: 'pg1', n: 'Teresa Alarcón', c: 'Providencia', d: 'hace 6 días', s: 'tens8', r: 5, t: 'Cuida a mi mamá dos veces por semana. Es cariñosa, ordenada y la tiene feliz.' },
    { id: 'pg2', n: 'Luis Cárdenas', c: 'Santiago', d: 'hace 2 semanas', s: 'iny', r: 5, t: 'Excelente y muy cuidadosa. No dolió nada.' },
    { id: 'pg3', n: 'Mónica Fuenzalida', c: 'Ñuñoa', d: 'hace 1 mes', s: 'mue', r: 4, t: 'Muy amable. Tuvo que pincharme dos veces, pero me explicó por qué.' },
  ],
  vm: [
    { id: 'vm1', n: 'Isabel Montt', c: 'Las Condes', d: 'hace 1 semana', s: 'cura', r: 5, t: 'La mejor para heridas. Muy seria y muy dulce con mi papá postrado.' },
    { id: 'vm2', n: 'Cristián Ossa', c: 'Vitacura', d: 'hace 3 semanas', s: 'iny', r: 5, t: 'Puntualísima, y después me mandó un informe por correo.' },
    { id: 'vm3', n: 'Ana María Pino', c: 'La Reina', d: 'hace 1 mes', s: 'son', r: 5, t: 'Instaló la sonda con mucho cuidado. Volvería a agendar sin dudarlo.' },
  ],
  fl: [
    { id: 'fl1', n: 'Bernardita Soto', c: 'Las Condes', d: 'hace 3 días', s: 'cur', r: 5, t: 'Me hizo las curaciones después de la cirugía. Muy profesional y tranquila.' },
    { id: 'fl2', n: 'Rodrigo Vial', c: 'Providencia', d: 'hace 2 semanas', s: 'mue', r: 5, t: 'Llegó a las 7 en punto. Ni sentí el pinchazo.' },
    { id: 'fl3', n: 'Carmen Gloria Díaz', c: 'Ñuñoa', d: 'hace 1 mes', s: 'iny', r: 4, t: 'Todo bien, aunque tuvimos que mover la hora una vez.' },
  ],
  dn: [
    { id: 'dn1', n: 'Valeria Cortés', c: 'Macul', d: 'hace 1 semana', s: 'iny', r: 5, t: 'Vino en la tarde después de mi pega, justo lo que necesitaba. Muy amable.' },
    { id: 'dn2', n: 'Sergio Molina', c: 'La Florida', d: 'hace 3 semanas', s: 'sig', r: 5, t: 'Le controla la presión a mi papá cada semana. Responsable y puntual.' },
    { id: 'dn3', n: 'Javiera Rubio', c: 'Peñalolén', d: 'hace 1 mes', s: 'mue', r: 4, t: 'Rápido y ordenado. Recomendado.' },
  ],
  xv: [
    { id: 'xv1', n: 'Carolina Méndez', c: 'Ñuñoa', d: 'hace 5 días', s: 'cuid', r: 5, t: 'Cuidó a mi papá tres noches seguidas. Dejó todo anotado en la bitácora y pudimos dormir tranquilos.' },
    { id: 'xv2', n: 'Patricio Núñez', c: 'Providencia', d: 'hace 3 semanas', s: 'hnoc', r: 5, t: 'Acompañó a mi mamá en la clínica de noche. Muy atenta y nos avisaba todo por chat.' },
    { id: 'xv3', n: 'Soledad Ríos', c: 'La Reina', d: 'hace 1 mes', s: 'acomp', r: 4, t: 'Cariñosa y puntual. La sacó a caminar todos los días.' },
  ],
  mp: [
    { id: 'mp1', n: 'Rocío Villalobos', c: 'Macul', d: 'hace 1 semana', s: 'pos', r: 5, t: 'Mi abuelo está postrado y no ha tenido ni una escara desde que lo cuida Marisol.' },
    { id: 'mp2', n: 'Luis Cárdenas', c: 'Santiago', d: 'hace 1 mes', s: 'bano', r: 5, t: 'Lo baña en cama con mucho respeto. Mi papá la adora.' },
  ],
};
const PRO = (id = S.pro) => PROS.find(p => p.id === id);
const proName = () => PRO();
const r500 = n => Math.round(n / 500) * 500;
const minH = k => Math.min(...Object.keys(CAT[k].tp).map(Number));
// ¿la profesional ofrece el servicio? Lo define su profesión y las categorías donde atiende.
const offers = (pr, k) => !!CAT[k] && !CAT[k].soon && CAT[k].who.includes(pr.k) && (!!pr.p[k] || pr.gs.includes(CAT[k].g));
// precio por turno de h horas (día o noche). Recargo nocturno solo si el servicio no es ya de noche.
const shiftUnit = (pr, k, h = minH(k), jor = 'dia') => { const c = CAT[k]; if (!c.tp || !c.tp[h]) return 0; const b = pr.p[k] && h === minH(k) ? pr.p[k] : r500(c.tp[h] * pr.f); return r500(b * (jor === 'noche' && !c.jor ? 1 + rcPct(pr, 'noc') / 100 : 1)); };
// precio de una profesional para un servicio. Camila (la cuenta profesional del prototipo) usa lo que ella edita.
function priceOf(pr, item = S.item, slot) {
  if (!item) { const l = Object.keys(CAT).filter(k => !CAT[k].plan && !CAT[k].turno).map(k => priceOf(pr, k)).filter(Boolean); return l.length ? Math.min(...l) : 0; }
  if (!CAT[item] || CAT[item].soon) return 0;
  let base, nt = pr.night[item];
  if (pr.id === 'cr') { const m = S.my[item]; base = m && m.on ? m.p : undefined; nt = m && m.nOn ? m.night : 0; }
  else if (!offers(pr, item)) return 0;
  else if (CAT[item].turno) base = shiftUnit(pr, item);
  else base = pr.p[item] || r500(CAT[item].base * pr.f);
  if (!base) return 0;
  return base;
}
const nightOf = () => 0; /* reemplazado por recargos (rcHits) */
const durOf = (pr, item = S.item) => !item ? 0 : pr.id === 'cr' && S.my[item] ? S.my[item].dur : CAT[item].dur;
const svcsOf = pr => Object.keys(CAT).filter(k => priceOf(pr, k));
function incOf(pr, item = S.item) {
  if (pr.id === 'cr' && S.my[item]) return Object.keys(INC).filter(k => S.my[item].inc[k]).map(k => INC[k]);
  return [INC.ins, INC.res].concat(pr.xinc ? [pr.xinc] : []);
}
const slotsOf = (pr, d) => (pr.sl[d] || []);
const nextOf = pr => { for (let d = 0; d < pr.sl.length; d++) if (pr.sl[d].length) return [d, pr.sl[d][0]]; return null; };
const nextSlots = (pr, n = 3) => { const o = []; pr.sl.forEach((l, d) => l.forEach(t => o.push([d, t]))); return o.slice(0, n); };
function prosFor(item = S.item) {
  let l = PROS.filter(p => priceOf(p, item) && S.f[p.k]);
  if (S.fmax) l = l.filter(p => priceOf(p, item) <= S.fmax);
  if (S.frat) l = l.filter(p => p.rn >= S.frat);
  if (S.fgen) l = l.filter(p => p.g === S.fgen);
  if (S.fcom) l = l.filter(p => p.com.includes(S.fcom));
  if (S.fday === 'hoy') l = l.filter(p => p.sl[0].length);
  if (S.fday === 'man') l = l.filter(p => p.sl[0].length || p.sl[1].length);
  const nx = p => { const x = nextOf(p); return x ? x[0] * 100 + parseInt(x[1]) : 9999; };
  const s = { rel: (a, b) => (b.rn * 40 + Math.min(b.a, 150) / 10 - b.km) - (a.rn * 40 + Math.min(a.a, 150) / 10 - a.km), pre: (a, b) => priceOf(a, item) - priceOf(b, item), rat: (a, b) => b.rn - a.rn || b.a - a.a, pro: (a, b) => nx(a) - nx(b) }[S.sort];
  return l.sort(s);
}
function price() {
  const pr = PRO(), L = [];
  if (isT()) { const c = shiftCalc(pr), L2 = [...c.L, ...cuidaLine(c.total)]; return { L: L2, total: L2.reduce((a, b) => a + b[1], 0), pro: c.unit, shift: c, disc: cuidaOf(c.total) }; }
  const p = priceOf(pr, S.item);
  const rc = rcLines(pr, p, S.when === 'prog' ? S.day : 0, S.when === 'prog' ? S.slot : '', S.when !== 'prog'), rs = rc.reduce((a, b) => a + b[1], 0);
  const fee = typeof isaOf === 'function' && isaOf(S.who) && S.rbAuto ? [['Gestión de reembolso', RB_FEE]] : [];
  if (S.item === 'mue') { L.push([`Toma a domicilio · ${first(pr)}`, p], ...rc); if (!byOrder()) L.push([`Exámenes (laboratorio) · ${examList().length}`, examSum()]); if (!byOrder() && examSum() >= 30000) L.push(['Toma gratis · exámenes sobre $30.000', -p]); const svc = p + rs - (!byOrder() && examSum() >= 30000 ? p : 0); L.push(...cuidaLine(svc), ...fee); return { L, total: L.reduce((a, b) => a + b[1], 0), pro: p + rs, lab: byOrder() ? 0 : examSum(), pend: byOrder(), disc: cuidaOf(svc) }; }
  L.push([CAT[S.item].n, p], ...rc, ...cuidaLine(p + rs), ...fee);
  return { L, total: L.reduce((a, b) => a + b[1], 0), pro: p + rs, rc: rs, disc: cuidaOf(p + rs) };
}
/* ---------- turnos (cuidadoras y TENS) ---------- */
const SH0 = new Date(2026, 9, 27);   // mar 27 oct: primer día que se puede iniciar un turno
const WD = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
const WDN = { lun: 'Lun', mar: 'Mar', mie: 'Mié', jue: 'Jue', vie: 'Vie', sab: 'Sáb', dom: 'Dom' };
const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const addD = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const dTxt = d => `${WDN[WD[d.getDay()]].toLowerCase()} ${d.getDate()} ${MES[d.getMonth()]}`;
const festOf = d => FEST[`${d.getDate()}-${d.getMonth() + 1}`];
const shH = (k = S.item) => { const hs = Object.keys(CAT[k].tp).map(Number); return hs.includes(S.sh.h) ? S.sh.h : hs[hs.length > 1 && hs.includes(12) ? hs.indexOf(12) : 0]; };
const shJor = (k = S.item) => CAT[k].jor || (shH(k) >= 24 ? '24' : S.sh.jor);
const shRange = (k = S.item) => { const h = shH(k), j = shJor(k); if (h >= 24) return '08:00 a 08:00'; const st = j === 'noche' ? (h >= 12 ? 20 : 22) : 8; const en = (st + h) % 24; return `${String(st).padStart(2, '0')}:00 a ${String(en).padStart(2, '0')}:00`; };
function shiftDates() {
  const st = addD(SH0, S.sh.start), out = [];
  for (let i = 0; i < 7 * S.sh.wk; i++) { const d = addD(st, i); if (S.sh.rep[WD[d.getDay()]] || i === 0) { const f = festOf(d), dom = d.getDay() === 0; out.push({ d, f, dom, sur: f ? SUR.fest : dom ? SUR.dom : 0 }); } }
  return out;
}
function shiftCalc(pr = PRO(), k = S.item) {
  const h = shH(k), jor = shJor(k), unit = shiftUnit(pr, k, h, jor === 'noche' ? 'noche' : 'dia'), ds = shiftDates();
  const nF = ds.filter(x => x.f).length, nD = ds.filter(x => !x.f && x.dom).length;
  const L = [[`${ds.length} turno${ds.length === 1 ? '' : 's'} de ${h} h${jor === 'noche' ? ' de noche' : jor === 'dia' && h < 24 ? ' de día' : ''} × ${clp(unit)}`, unit * ds.length]];
  if (nD) L.push([`Recargo domingo +${rcPct(pr, 'dom')}% · ${nD} turno${nD === 1 ? '' : 's'}`, Math.round(unit * rcPct(pr, 'dom') / 100 * nD)]);
  if (nF) L.push([`Recargo festivo +${rcPct(pr, 'fes')}% · ${nF} turno${nF === 1 ? '' : 's'}`, Math.round(unit * rcPct(pr, 'fes') / 100 * nF)]);
  return { h, jor, unit, ds, nF, nD, L, total: L.reduce((a, b) => a + b[1], 0) };
}
const repTxt = () => { const l = Object.keys(WDN).filter(k => S.sh.rep[k]).map(k => WDN[k].toLowerCase()); return l.length ? (l.length > 1 ? l.slice(0, -1).join(', ') + ' y ' + l[l.length - 1] : l[0]) : 'un solo turno'; };
const isT = (k = S.item) => !!(k && CAT[k] && CAT[k].turno);
const durT = (pr, k) => CAT[k].turno ? `Turno de ${Object.keys(CAT[k].tp).join(', ').replace(/, (\d+)$/, ' o $1')} h` : CAT[k].plan ? 'Plan semanal' : `${durOf(pr, k)} min`;
const slotEnd = t => { const [h, m] = t.split(':').map(Number); const x = h * 60 + m + 30; return String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0'); };
const whenTxt = () => isT() ? `Desde ${dTxt(addD(SH0, S.sh.start))} · ${shH()} h · ${repTxt()}` : S.when === 'ahora' ? `Hoy, llega en ~${PRO().asap || 30} min` : `${dayShort(S.day)}, ${S.slot} a ${slotEnd(S.slot)}`;
const whenLong = () => isT() ? `${shiftDates().length} turnos de ${shH()} h (${shRange()}) desde el ${dTxt(addD(SH0, S.sh.start))} · ${repTxt()} · ${S.sh.wk} semana${S.sh.wk > 1 ? 's' : ''}` : S.when === 'ahora' ? `Hoy, llega en ~${PRO().asap || 30} min` : `${DAYS[S.day][3].replace(/^\w/, c => c.toUpperCase())}, llega entre ${S.slot} y ${slotEnd(S.slot)}`;
const whoTxt = () => ({ mama: 'Rosa Muñoz (mamá)', yo: 'Daniela Fuentes (tú)', papa: 'Luis Fuentes (papá)' })[S.who];
const FAM = { mama: { n: 'Rosa Muñoz Pérez', c: 'Rosa', r: 'mamá', i: 'RM', e: 78, al: ['Penicilina'], dx: ['Hipertensión arterial', 'Diabetes tipo 2', 'Úlcera venosa pierna izquierda'], meds: [
    { n: 'Losartán 50 mg', d: '1 comprimido', v: 'oral', f: 24, at: ['08:00'], dur: 'Permanente', by: 'Dr. Andrés Valenzuela', x: 'Antes del desayuno' },
    { n: 'Metformina 850 mg', d: '1 comprimido', v: 'oral', f: 12, at: ['13:00', '20:00'], dur: 'Permanente', by: 'Dr. Andrés Valenzuela', x: 'Con almuerzo y cena' },
    { n: 'Neurobionta 5.000', d: '1 ampolla', v: 'IM', f: 48, at: ['08:00'], dur: '3 dosis', dn: 2, dt: 3, nx: 'mié 28 oct · 08:00', by: 'Dr. Andrés Valenzuela', x: 'La aplica la enfermera' }], dev: ['Bastón', 'Glucómetro'], barthel: 75, braden: 17 }, papa: { n: 'Luis Fuentes Ortiz', c: 'Luis', r: 'papá', i: 'LF', e: 80, al: ['Sin alergias conocidas'], dx: ['Hipertensión arterial', 'Post-operatorio de cadera (oct 2026)'], meds: [
    { n: 'Amlodipino 5 mg', d: '1 comprimido', v: 'oral', f: 24, at: ['08:00'], dur: 'Permanente', by: 'Dra. Marcela Ortiz' },
    { n: 'Enoxaparina 40 mg', d: '1 jeringa', v: 'subcutánea', f: 24, at: ['20:00'], dur: 'Por 21 días', dn: 6, dt: 21, du: 'días', by: 'Dr. Tomás Riquelme', x: 'Abdomen, alternando lados' },
    { n: 'Paracetamol 1 g', d: '1 comprimido', v: 'oral', f: 'SOS', sos: 'Si hay dolor, mínimo cada 8 h', at: [], dur: 'Por 7 días', by: 'Dr. Tomás Riquelme', x: 'Máximo 3 al día' }], dev: ['Andador', 'Alza baño'], barthel: 55, braden: 15 }, yo: { n: 'Daniela Fuentes Muñoz', c: 'Daniela', r: 'tú', i: 'DF', e: 37, al: ['Sin alergias conocidas'], dx: ['Sin diagnósticos crónicos'], meds: [], dev: [], barthel: 100, braden: 23 } };
const FM = () => FAM[S.fm] || FAM.mama;
const first = (p = PRO()) => p.n.split(' ')[0];
const net = p => Math.round(p * (100 - S.comm) / 100);
const commTxt = p => `<div class="comm"><span>Cobras <b class="num">${clp(p)}</b></span><span>Comisión Cuidapp ${S.comm}%</span><span>Recibes <b class="num">${clp(net(p))}</b></span></div>`;

/* ---------- componentes ---------- */
const btn = (t, go, k = '', extra = '') => `<button class="btn ${k}" ${go ? `data-go="${go}"` : ''} ${extra}>${t}</button>`;
const abtn = (t, act, arg = '', k = '', go = '', dis = false) => `<button class="btn ${k}" data-act="${act}" data-arg="${arg}" ${go ? `data-go="${go}"` : ''} ${dis ? 'disabled' : ''}>${t}</button>`;
const row = (i, a, b = '', go = '', end = ic('caret-right'), cls = '', act = '', arg = '') => {
  const tag = go || act ? 'button' : 'div';
  return `<${tag} class="row ${cls}" ${go ? `data-go="${go}"` : ''} ${act ? `data-act="${act}" data-arg="${arg}"` : ''}>
  ${i ? (i.startsWith('av:') ? av(i.slice(3), 's') : `<span class="ri ${i.startsWith('box:') ? 'box' : ''}">${ic(i.replace('box:', ''))}</span>`) : ''}
  <span class="tx"><div class="a">${a}</div>${b ? `<div class="b">${b}</div>` : ''}</span>${end ? `<span class="end">${end}</span>` : ''}</${tag}>`;
};
const ST_I = { ok: 'check-circle', warn: 'clock', inf: 'clock-countdown', bad: 'x-circle' };
const st = (k, t, i) => { i = i === '' ? '' : (i || ST_I[k]); return `<span class="st ${k}">${i ? ic(i, 1) : ''}${t}</span>`; };
const PHOTO = ['CR', 'FA', 'MC', 'PG', 'VM', 'FL', 'DN', 'JS', 'CD', 'IP', 'RS', 'XV', 'MP'];
const V = '?v=20261026j';
const slug = n => n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\./g, '').trim().replace(/\s+/g, '-');
const PACPH = { DF: 'daniela-fuentes', RM: 'rosa-m', LF: 'luis-fuentes', MIb: 'isabel-montt', RVa: 'rodrigo-vial', CHe: 'valeria-cortes', FAr: 'francisco-lagos', JCa: 'soledad-rios' };
const phSrc = ini => PHOTO.includes(ini) ? `img/pro/${ini.toLowerCase()}.webp${V}` : PACPH[ini] ? `img/pac/${PACPH[ini]}.webp${V}` : '';
const avIn = ini => phSrc(ini) ? `<img class="avp" src="${phSrc(ini)}" alt="" loading="lazy">` : ini;
const av = (ini, cls = '', ver = false) => `<span class="av ${cls}${phSrc(ini) ? ' hasp' : ''}">${avIn(ini)}${ver ? `<span class="vb">${ic('check', 0).replace('ph ', 'ph-bold ')}</span>` : ''}</span>`;
const kv = (k, v, cls = '') => `<div class="kv ${cls}"><span class="k">${k}</span><span class="num">${v}</span></div>`;
const note = (i, t, k = '') => `<div class="note ${k}">${ic(i)}<div>${t}</div></div>`;
const chip = (t, on, act, arg) => `<button class="chip ${on ? 'on' : ''}" data-act="${act}" data-arg="${arg}">${t}</button>`;
const radioRow = (a, b, on, act, arg, i) => `<button class="row" data-act="${act}" data-arg="${arg}">${i ? `<span class="ri box">${ic(i)}</span>` : ''}<span class="tx"><div class="a">${a}</div>${b ? `<div class="b">${b}</div>` : ''}</span><span class="radio ${on ? 'on' : ''}"></span></button>`;
const checkRow = (a, on, act, arg, b = '') => `<button class="row nodiv" data-act="${act}" data-arg="${arg}"><span class="check ${on ? 'on' : ''}">${on ? ic('check', 0).replace('ph ', 'ph-bold ') : ''}</span><span class="tx"><div class="a">${a}</div>${b ? `<div class="b">${b}</div>` : ''}</span></button>`;
const field = (i, v, ph = '', cls = '') => `<div class="field ${cls}">${i ? ic(i) : ''}${v ? `<span>${v}</span>` : `<span class="ph-t">${ph}</span>`}</div>`;
const lbl = t => `<div class="lbl">${t}</div>`;
function receta(big) {
  return `<div class="doc" style="${big ? '' : 'max-width:220px'}"><div class="hd"><div><b>Dr. Andrés Valenzuela S.</b><br>Medicina Interna · RUT 9.884.120-3</div><div style="text-align:right">Clínica Ñuñoa<br>20/10/2026</div></div>
  <div>Paciente: <b>Rosa Muñoz Pérez</b> · 78 años</div><div class="hw mt8">Rp. Neurobionta 5.000<br>1 amp. IM cada 48 h · 3 dosis</div>
  <div style="display:flex;justify-content:flex-end;margin-top:6px"><div style="text-align:center;font-size:10px"><div class="hw" style="font-size:18px">A. Valenzuela</div>Firma y timbre</div></div></div>`;
}
function orden() {
  return `<div class="doc" style="max-width:220px"><div class="hd"><div><b>Dra. Marcela Ortiz R.</b><br>Medicina Familiar</div><div>18/10/2026</div></div><div>Paciente: <b>Rosa Muñoz Pérez</b></div><div class="hw mt8">Hemograma<br>Perfil lipídico</div></div>`;
}
const idcard = () => `<div class="idcard"><div class="ph">${ic('user', 1).replace('<i ', '<i style="font-size:56px;color:#A5A5AE" ')}</div><div style="flex:1"><b>CÉDULA DE IDENTIDAD</b><br>República de Chile<div class="blurline" style="width:80%"></div><div class="blurline" style="width:60%"></div><div class="blurline" style="width:70%"></div><div class="blurline" style="width:40%"></div></div></div>`;
const logoImg = (n = 'horizontal-nm', h = 28, st = '') => `<img src="${LOGO(n)}" alt="Cuidapp" style="height:${h}px;${st}">`;
const tabsP = [['servicios', 'magnifying-glass', 'Servicios', 'P06'], ['citas', 'calendar-blank', 'Mis citas', 'P26'], ['favoritos', 'heart', 'Favoritos', 'P34'], ['cuenta', 'user-circle', 'Cuenta', 'P28']];
const tabsR = [['inicio', 'house', 'Inicio', 'R16'], ['agenda', 'calendar-blank', 'Agenda', 'R24'], ['ganancias', 'wallet', 'Ganancias', 'R23'], ['perfil', 'user', 'Perfil', 'R25']];
const tabbar = (role, on) => `<div class="tabbar">${(role === 'pro' ? tabsR : tabsP).map(t => `<button class="${t[0] === on ? 'on' : ''}" data-go="${t[3]}">${ic(t[1], t[0] === on)}${t[2]}</button>`).join('')}</div>`;
const sbar = () => `<div class="sb ${'%M%'}"><span class="num">21:10</span><span class="ic">${ic('cell-signal-full', 1)}${ic('wifi-high', 1)}${ic('battery-full', 1)}</span></div>`;

/* ---------- render ---------- */
function T(fn, ms) { timers.push(setTimeout(fn, ms)); }
function I(fn, ms) { timers.push(setInterval(fn, ms)); }
function clearT() { timers.forEach(t => { clearTimeout(t); clearInterval(t); }); timers = []; maps.forEach(m => m.remove()); maps = []; }
function toast(m) { toastMsg = m; }

let navDir = 'f', lastId = null;
function go(id, push = true, isBack = false) {
  if (id === 'back') { const p = stack.pop(); if (!p) return; cur = null; navDir = 'b'; return go(p, false, true); }
  if (!isBack) { const a = SC[cur], b = SC[resolve(id)]; navDir = a && b && (a.tab || a.dtab) && (b.tab || b.dtab) && !b.back ? 'fade' : 'f'; }
  S.sheet = '';
  id = resolve(id);
  if (!SC[id]) { console.error('pantalla inexistente', id); return; }
  if (roleOf(id) === 'adm' && view === 'm') { view = 'd'; window.__forced = true; }
  else if (roleOf(id) !== 'adm' && window.__forced) { view = localStorage.getItem('cv') || 'm'; window.__forced = false; id = resolve(id); }
  if (push && cur && cur !== id) stack.push(cur);
  cur = id;
  history.replaceState(null, '', '#/' + id);
  render();
}

function frameM(s) {
  const k = s.kind;
  const bk = s.back ? `<button class="ib" data-go="back" aria-label="Volver">${ic(s.back === 'x' ? 'x' : 'caret-left')}</button>` : '<span class="ib"></span>';
  const right = s.navR ? s.navR() : '';
  const nav = s.title || s.back || right ? `<div class="nav ${s.navCls || ''}">${bk}<div class="t">${s.title || ''}</div><div class="nr">${right || '<span class="ib"></span>'}</div></div>` : '';
  const foot = s.foot ? `<div class="foot ${s.tab ? 'withtab' : ''} ${s.footCls || ''}">${s.foot()}</div>` : '';
  const tb = s.tab ? tabbar(roleOf(s.id), s.tab) : '';
  const sh = s.sheet && S.sheet ? s.sheet() : '';
  const ov = sh ? `<div class="ovl" data-act="set" data-arg="sheet="></div><div class="bsheet"><div class="grab"></div>${sh}</div>` : '';
  if (k === 'map') {
    return `<div class="scr"><div style="flex:1;position:relative;min-height:0"><div class="mapwrap" data-map="1"></div>${sbar().replace('%M%', 'on-map')}
      ${s.back ? `<button class="ib float" style="top:60px;left:16px" data-go="back" aria-label="Volver">${ic(s.back === 'x' ? 'x' : 'caret-left')}</button>` : ''}
      ${s.float ? s.float() : ''}
      <div class="sheet ${s.sheetCls || ''}"><div class="grab"></div>${s.top ? s.top() : ''}<div class="body">${s.body()}</div>${foot}</div></div>${tb}${ov}</div>`;
  }
  return `<div class="scr">${sbar().replace('%M%', '')}${s.top ? `<div class="topx">${s.top()}</div>` : nav}<div class="body ${s.bodyCls || ''}">${s.body()}</div>${s.float ? s.float() : ''}${foot}${tb}${ov}</div>`;
}
function headerD(s) {
  const r = roleOf(s.id);
  const items = r === 'pro' ? [['house', 'Inicio', 'R16', 'inicio'], ['calendar-blank', 'Agenda', 'R24', 'agenda'], ['wallet', 'Ganancias', 'R23', 'ganancias'], ['user', 'Perfil', 'R25', 'perfil']]
    : [['magnifying-glass', 'Servicios', 'W01', 'servicios'], ['calendar-blank', 'Mis citas', 'P26', 'citas'], ['heart', 'Favoritos', 'P34', 'favoritos'], ['user-circle', 'Cuenta', 'P28', 'cuenta']];
  const on = s.tab || s.dtab;
  const nav = s.noNav ? '' : `<nav>${items.map(t => `<button class="${t[3] === on ? 'on' : ''}" data-go="${t[2]}">${ic(t[0], t[3] === on)}${t[1]}</button>`).join('')}</nav>`;
  const me = s.noNav ? '' : (r === 'pro' ? `<div class="me">${av('CR', 's')}Camila</div>` : `<button class="me" data-go="P28">${av('DF', 's')}Daniela</button>`);
  return `<div class="dh">${logoImg('horizontal-nm', 30)}${r === 'pro' ? '<span class="tag">Profesionales</span>' : ''}${nav}<span class="sp"></span>${me}</div>`;
}
function frameD(s) {
  const sh = s.sheet && S.sheet ? s.sheet() : '';
  const ov = sh ? `<div class="ovl" data-act="set" data-arg="sheet="></div><div class="bsheet dsheet">${sh}</div>` : '';
  return frameD0(s).replace(/<\/div>$/, ov + '</div>');
}
function frameD0(s) {
  if (s.kind === 'dfree') return `<div class="desk">${headerD(s)}<div class="dfree">${s.body()}</div></div>`;
  if (s.kind === 'adm') return `<div class="desk"><div class="adm">${s.side === 'none' ? '' : sideA(s.side)}<div class="acont">${s.body()}</div></div></div>`;
  const back = s.back ? `<button class="ib" data-go="back">${ic(s.back === 'x' ? 'x' : 'arrow-left')}</button>` : '';
  const title = s.dtitle || s.title;
  const head = title ? `<div class="dtitle">${back}<div class="h-m">${title}</div>${s.navR ? `<span style="flex:1"></span>${s.navR()}` : ''}</div>` : (back ? `<div class="dtitle">${back}</div>` : '');
  const foot = s.foot ? `<div class="foot">${s.foot()}</div>` : '';
  if (s.kind === 'map') {
    return `<div class="desk">${headerD(s)}<div class="dmain"><div class="dpanel"><div class="card"><div class="body">${head}${s.top ? s.top() : ''}${s.body()}</div>${foot}</div></div><div class="dmap"><div class="mapwrap" data-map="1"></div>${s.dfloat ? s.dfloat() : s.float ? s.float() : ''}</div></div></div>`;
  }
  if (s.wide) return `<div class="desk">${headerD(s)}<div class="dpage wide"><div class="col">${head}<div class="body">${s.body()}</div>${foot}</div>${s.aside ? `<div class="aside ${s.asideCls || ''}">${s.aside()}</div>` : ''}</div></div>`;
  return `<div class="desk">${headerD(s)}<div class="dpage"><div class="col">${head}<div class="body">${s.body()}</div>${foot}</div>${s.aside ? `<div class="aside">${s.aside()}</div>` : ''}</div></div>`;
}
function sideA(on) {
  const n = 6 - S.aprob.length - S.rech.length;
  const it = [['A02', 'identification-card', 'Verificación', 'ver', n], ['A04', 'calendar-check', 'Reservas de hoy', 'hoy'], ['A06', 'users-three', 'Profesionales', 'pro'], ['A09', 'file-text', 'Órdenes por revisar', 'ord', 3 - S.aordDone.length], ['A05', 'list-checks', 'Catálogo y comisión', 'tar'], ['A08', 'test-tube', 'Catálogo de exámenes', 'lab'], ['A11', 'flask', 'Laboratorios', 'labs'], ['A13', 'receipt', 'Liquidaciones', 'liq']];
  return `<div class="side">${logoImg('horizontal-nm', 28)}${it.map(t => `<button class="${t[3] === on ? 'on' : ''}" data-go="${t[0]}">${ic(t[1], t[3] === on)}${t[2]}${t[4] ? `<span class="cnt num">${t[4]}</span>` : ''}</button>`).join('')}<div class="who">Operaciones<br>operaciones@cuidapp.cl</div><button data-go="A01">${ic('sign-out')}Salir</button></div>`;
}

function render() {
  clearT();
  const s = SC[cur];
  const stage = $('#stage');
  const html = view === 'm' ? `<div class="phone"><div class="island"></div>${frameM(s)}<div class="hi"></div></div>` : frameD(s);
  stage.innerHTML = `<div class="scaler">${html}</div>`;
  const scr = stage.querySelector('.phone,.desk');
  if (toastMsg) {
    const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = ic('check-circle', 1) + `<span>${toastMsg}</span>`;
    scr.appendChild(t); toastMsg = null; clearTimeout(toastT); toastT = setTimeout(() => t.remove(), 2600);
  }
  if (cur !== lastId) { const el = stage.querySelector('.scr,.dpage,.dmain,.dfree,.acont'); if (el) el.classList.add('a-' + navDir); lastId = cur; }
  fit();
  updateBar();
  if (s.map) { const el = stage.querySelector('[data-map]'); if (el) mkMap(el, s.map()); }
  if (s.enter) s.enter();
  window.__rendered = (window.__rendered || 0) + 1;
}
function fit() {
  const st = $('#stage'), sc = st.querySelector('.scaler'), el = sc.firstElementChild;
  if (NATIVE && view === 'm') { sc.style.transform = ''; sc.style.height = '100%'; return; }
  if (NATIVE) { const kw = st.clientWidth / el.offsetWidth; sc.style.transformOrigin = 'top left'; sc.style.height = ''; sc.style.transform = `scale(${kw})`; return; }
  const w = el.offsetWidth + (view === 'm' ? 24 : 0), h = el.offsetHeight + (view === 'm' ? 24 : 0);
  const k = Math.min(1, (st.clientWidth - 32) / w, (st.clientHeight - 32) / h);
  sc.style.transform = `scale(${k})`;
}
window.addEventListener('resize', () => cur && fit());

/* ---------- mapas ---------- */
const pinHome = () => L.divIcon({ className: '', iconSize: [26, 26], iconAnchor: [13, 13], html: '<div style="width:26px;height:26px;border-radius:6px;background:#111111;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.3)"><div style="width:8px;height:8px;background:#fff;border-radius:2px"></div></div>' });
const pinPro = (lbl) => L.divIcon({ className: '', iconSize: [40, 40], iconAnchor: [20, 20], html: `<div style="position:relative"><div style="width:40px;height:40px;border-radius:20px;background:#7A7CF0;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);overflow:hidden;box-sizing:border-box"><img src="${phSrc(typeof PRO === 'function' && view && S.pro && roleOf(cur) !== 'pro' ? PRO().i : 'CR')}" alt="" style="width:100%;height:100%;object-fit:cover;display:block"></div>${lbl ? `<div style="position:absolute;left:48px;top:6px;background:#111111;color:#fff;font:600 13px/28px var(--font);padding:0 10px;border-radius:14px;white-space:nowrap">${lbl}</div>` : ''}</div>` });
const pinDot = (c = '#7A7CF0') => L.divIcon({ className: '', iconSize: [14, 14], iconAnchor: [7, 7], html: `<div style="width:14px;height:14px;border-radius:7px;background:${c};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>` });
const pinPulse = () => L.divIcon({ className: '', iconSize: [160, 160], iconAnchor: [80, 80], html: '<div class="pulse"><span></span><span></span><span></span></div>' });
const pinLabel = (t) => L.divIcon({ className: '', iconSize: [0, 0], iconAnchor: [0, 0], html: `<div style="transform:translate(-50%,-44px);background:#111111;color:#fff;font:600 13px/30px var(--font);padding:0 12px;border-radius:15px;white-space:nowrap;display:inline-block">${t}</div>` });
const pinMe = () => L.divIcon({ className: '', iconSize: [22, 22], iconAnchor: [11, 11], html: '<div style="width:22px;height:22px;border-radius:11px;background:#111111;border:4px solid #fff;box-shadow:0 0 0 6px rgba(17,17,17,.16),0 2px 6px rgba(0,0,0,.3)"></div>' });
const pinNav = () => L.divIcon({ className: '', iconSize: [40, 40], iconAnchor: [20, 20], html: '<div style="width:40px;height:40px;border-radius:20px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"><i class="ph-fill ph-navigation-arrow" style="font-size:22px;color:#7A7CF0;transform:rotate(45deg)"></i></div>' });

function mkMap(el, o) {
  const m = L.map(el, { zoomControl: false, attributionControl: true, zoomSnap: 0.25, fadeAnimation: false });
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, maxNativeZoom: 16, attribution: 'Esri, HERE, Garmin, © OpenStreetMap' }).addTo(m);
  maps.push(m);
  const pts = [];
  const add = (ll, icon, z) => { const mk = L.marker(ll, { icon, interactive: false, zIndexOffset: z || 0 }).addTo(m); pts.push(ll); return mk; };
  if (o.pulse) add(o.pulse, pinPulse(), -10);
  if (o.route) { L.polyline(o.route, { color: '#7A7CF0', weight: 5, opacity: 1, lineCap: 'round', lineJoin: 'round' }).addTo(m); o.route.forEach(p => pts.push(p)); }
  if (o.home) add(o.home, pinHome(), 100);
  if (o.homeLabel) L.marker(o.home, { icon: pinLabel(o.homeLabel), interactive: false, zIndexOffset: 200 }).addTo(m);
  if (o.me) add(o.me, pinMe(), 50);
  (o.dots || []).forEach(d => add(d[0], pinDot(d[1]), 20));
  let mover = null;
  if (o.pro) mover = add(o.pro, o.nav ? pinNav() : pinPro(o.proLabel), 300);
  // encuadre: deja libre lo que tapa la hoja
  const sheet = el.closest('.scr') ? el.closest('.scr').querySelector('.sheet') : null;
  const pb = sheet ? sheet.offsetHeight + 10 : 30;
  const pt = el.closest('.scr') ? 90 : 40;
  if (o.center) m.setView(o.center, o.zoom || 15);
  else if (pts.length > 1) m.fitBounds(L.latLngBounds(pts), { paddingTopLeft: [40, pt], paddingBottomRight: [40, pb], maxZoom: o.maxZoom || 16 });
  else if (pts.length) { m.setView(pts[0], o.zoom || 15); if (sheet) m.panBy([0, pb / 2 - 20], { animate: false }); }
  if (o.anim && mover) {
    const r = o.anim.route, dur = o.anim.dur, t0 = performance.now();
    let i = 0;
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / dur);
      const idx = Math.floor(k * (r.length - 1)); mover.setLatLng(r[idx]);
      if (o.anim.tick) o.anim.tick(k);
      if (k < 1) timers.push(setTimeout(step, 60)); else if (o.anim.end) o.anim.end();
    };
    step();
  }
  window.__map = m;
}

/* ---------- eventos ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act],[data-go]');
  if (!el || el.disabled || !e.target.closest('#stage,.tb,.flow')) return;
  if (el.closest('.tb') || el.closest('.flow')) return; // la barra maneja lo suyo
  const a = el.dataset.act, g = el.dataset.go;
  if (a) { if (!ACT[a]) { console.error('acción inexistente', a); return; } ACT[a](el.dataset.arg); }
  if (g) go(g); else if (a) render();
});

/* ---------- barra del prototipo ---------- */
function updateBar() {
  const r = roleOf(cur);
  document.querySelectorAll('[data-role]').forEach(b => b.classList.toggle('on', b.dataset.role === r));
  document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('on', b.dataset.view === view));
  const s = SC[cur];
  $('#sel').textContent = `${cur} · ${s.name}`;
  const adv = $('#adv'); adv.style.display = s.auto ? '' : 'none';
}
function bar() {
  $('#tb').innerHTML = `${logoImg('horizontal-nm', 26, '').replace('<img', '<img class="lg"')}
  <div class="seg">${['pac', 'pro', 'adm', 'ase'].map(r => `<button data-role="${r}">${ROLE_N[r]}</button>`).join('')}</div>
  <div class="seg vseg"><button data-view="m">${'iPhone'}</button><button data-view="d">Escritorio</button></div>
  <span class="sel" id="sel"></span><span class="sp"></span>
  <button class="lnk" id="adv" style="background:var(--accent);color:#fff">${ic('fast-forward', 1)}<span class="tl">Avanzar</span></button>
  <button class="lnk" id="flowbtn">${ic('flow-arrow')}<span class="tl">Mapa del flujo</span></button>
  ${NATIVE ? `<button class="lnk" id="hidebar" style="background:var(--s2);color:var(--text)">${ic('arrows-out-simple')}</button>` : ''}`;
  $('#tb').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.role) { closeFlow(); stack = []; S = S0(); go(START[b.dataset.role], false); }
    else if (b.dataset.view) { closeFlow(); window.__forced = false; view = b.dataset.view; localStorage.setItem('cv', view); if (roleOf(cur) === 'adm' && view === 'm') view = 'd'; go(resolve(cur), false); }
    else if (b.id === 'adv') { const s = SC[cur]; if (s.auto) { if (s.autoAct) s.autoAct(); go(typeof s.auto === 'function' ? s.auto() : s.auto); } }
    else if (b.id === 'flowbtn') openFlow();
    else if (b.id === 'hidebar') { document.body.classList.add('tbhide'); showMini(); }
  });
}
function showMini() {
  const m = document.createElement('button'); m.id = 'mini'; m.innerHTML = ic('dots-three', 1);
  m.style.cssText = 'position:fixed;right:10px;top:calc(env(safe-area-inset-top) + 8px);width:36px;height:36px;border-radius:18px;background:rgba(29,29,27,.75);color:#fff;z-index:2000;display:flex;align-items:center;justify-content:center';
  m.onclick = () => { document.body.classList.remove('tbhide'); m.remove(); };
  document.body.appendChild(m);
}

/* ---------- enlaces y mapa del flujo ---------- */
function linksOf(id) {
  const s = SC[id], out = new Set();
  const grab = f => { try { const h = f(); (h.match(/data-go="([A-Z]\d\d)"/g) || []).forEach(x => out.add(x.slice(9, 12))); } catch (e) { } };
  const saved = JSON.stringify(S);
  ['body', 'foot', 'aside', 'top', 'float', 'dfloat', 'navR'].forEach(k => s[k] && grab(s[k]));
  (s.sheets || []).forEach(v => { S.sheet = v; grab(s.sheet); });
  (s.next || []).forEach(x => out.add(x));
  if (s.auto && typeof s.auto === 'string') out.add(s.auto);
  if (s.tab) (roleOf(id) === 'pro' ? tabsR : tabsP).forEach(t => out.add(t[3]));
  if (s.kind === 'adm' && s.side !== 'none') ['A02', 'A04', 'A06', 'A05', 'A09', 'A08', 'A01'].forEach(x => out.add(x));
  S = JSON.parse(saved);
  out.delete(id);
  return [...out].filter(x => SC[x]);
}
window.__links = linksOf;
const LANES = [
  ['pac', 'Paciente', [['P01', 'P02', 'P03', 'P04', 'P05'], ['P06', 'P07', 'P08', 'P09'], ['P10', 'P11', 'P36', 'P34'], ['P12', 'P32', 'P33', 'P22'], ['P13', 'P14', 'P15', 'P16'], ['P17', 'P18', 'P19', 'P20'], ['P26', 'P27', 'P30', 'P28', 'P29'], ['P21', 'P23', 'P24', 'P25'], ['P50', 'P51', 'P52', 'P53'], ['P54', 'P55', 'P56', 'P57', 'P58', 'P59'], ['P40', 'P60', 'P61', 'P62', 'P63'], ['P16', 'P64', 'P65'], ['P66', 'P67'], ['P70', 'P71', 'P72', 'P73'], ['P74', 'P75', 'P76', 'P77'], ['P78', 'P79', 'P80', 'P81', 'P82'], ['P83', 'P84', 'P85', 'P86', 'P87', 'P88'], ['P89', 'P90', 'P91', 'P92'], ['W01', 'W02', 'W03', 'W04']]],
  ['pro', 'Profesional', [['R01', 'R02', 'R03'], ['R04', 'R05', 'R06', 'R07'], ['R08', 'R09', 'R10', 'R26'], ['R11', 'R12', 'R13', 'R14', 'R15'], ['R16', 'R17', 'R18'], ['R19', 'R20', 'R21', 'R22'], ['R23', 'R24', 'R25'], ['R27', 'R28', 'R29'], ['R37', 'R38', 'R31', 'R32'], ['R40', 'R41', 'R33', 'R34'], ['R35', 'R39', 'R36', 'R42', 'R43']]],
  ['adm', 'Admin', [['A01', 'A02', 'A03'], ['A04', 'A05', 'A07'], ['A06', 'A08'], ['A09', 'A10'], ['A11', 'A12', 'A13']]],
  ['ase', 'Asesor de Isapre', [['Q01', 'Q02', 'Q03', 'Q04']]],
];
function openFlow() {
  const NW = 196, NH = 54, CG = 70, RG = 16, X0 = 40, pos = {};
  let y = 30, svgN = '', svgL = '';
  LANES.forEach(([r, name, cols]) => {
    const rows = Math.max(...cols.map(c => c.length));
    const h = rows * (NH + RG) + 60;
    svgL += `<rect x="16" y="${y}" width="${X0 + cols.length * (NW + CG)}" height="${h}" rx="16" fill="${r === 'pac' ? '#F7F7F7' : r === 'pro' ? '#F7F7FB' : '#F7F7F7'}"/><text x="40" y="${y + 32}" font-size="18" font-weight="700" fill="#1D1D1B">${name}</text>`;
    cols.forEach((c, ci) => c.forEach((id, ri) => { pos[id] = { x: X0 + ci * (NW + CG), y: y + 50 + ri * (NH + RG) }; }));
    y += h + 24;
  });
  const W = X0 + Math.max(...LANES.map(l => l[2].length)) * (NW + CG) + 40;
  let edges = '';
  Object.keys(pos).forEach(a => linksOf(a).forEach(b => {
    if (!pos[b]) return;
    const A = pos[a], B = pos[b];
    let x1 = A.x + NW, y1 = A.y + NH / 2, x2 = B.x, y2 = B.y + NH / 2;
    if (B.x < A.x + NW && B.x + NW > A.x) { x1 = A.x + NW / 2; x2 = B.x + NW / 2; y1 = B.y > A.y ? A.y + NH : A.y; y2 = B.y > A.y ? B.y : B.y + NH; edges += `<path data-e="${a} ${b}" d="M${x1},${y1} C${x1 + 40},${(y1 + y2) / 2} ${x2 + 40},${(y1 + y2) / 2} ${x2},${y2}" fill="none" stroke="#C9C9C9" stroke-width="1.5" marker-end="url(#ar)"/>`; return; }
    if (B.x < A.x) { x1 = A.x; x2 = B.x + NW; }
    const dx = Math.max(40, Math.abs(x2 - x1) / 2) * (x2 > x1 ? 1 : -1);
    edges += `<path data-e="${a} ${b}" d="M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}" fill="none" stroke="#C9C9C9" stroke-width="1.5" marker-end="url(#ar)"/>`;
  }));
  Object.entries(pos).forEach(([id, p]) => {
    const s = SC[id]; const nm = s.name.length > 24 ? s.name.slice(0, 23) + '…' : s.name;
    svgN += `<g class="node" data-open="${id}"><rect x="${p.x}" y="${p.y}" width="${NW}" height="${NH}" rx="10" fill="#fff" stroke="${id[0] === 'W' ? '#7A7CF0' : '#D9D9D9'}"/><text x="${p.x + 14}" y="${p.y + 22}" font-size="12" font-weight="600" fill="#8A8A8A">${id}${id[0] === 'W' ? ' · escritorio' : ''}</text><text x="${p.x + 14}" y="${p.y + 41}" font-size="14" font-weight="600" fill="#1D1D1B">${nm}</text></g>`;
  });
  const f = document.createElement('div'); f.className = 'flow'; f.id = 'flow';
  f.innerHTML = `<div style="padding:24px 40px 0;display:flex;align-items:baseline;gap:16px"><div class="h-l">Mapa del flujo</div><div class="t2">${Object.keys(pos).length} pantallas. Toca una para abrir el prototipo en ese punto. Pasa el mouse para ver sus conexiones.</div><span style="flex:1"></span><button class="btn sec" style="width:auto;padding:0 18px" id="flowclose">${ic('x')}Cerrar</button></div>
  <svg width="${W}" height="${y + 20}"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="#BDBDBD"/></marker><marker id="ar2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="#7A7CF0"/></marker></defs>${svgL}${edges}${svgN}</svg>`;
  $('#stage').after(f); f.style.top = '56px'; if (NATIVE) f.style.top = '0';
  f.addEventListener('click', e => {
    if (e.target.closest('#flowclose')) return closeFlow();
    const n = e.target.closest('[data-open]'); if (!n) return;
    const id = n.dataset.open; closeFlow();
    if (id[0] === 'W' && view === 'm' && !NATIVE) { view = 'd'; localStorage.setItem('cv', 'd'); }
    stack = []; go(id, false);
  });
  f.addEventListener('mouseover', e => {
    const n = e.target.closest('[data-open]'); const id = n && n.dataset.open;
    f.querySelectorAll('path[data-e]').forEach(p => { const [a, b] = p.dataset.e.split(' '); const on = id && (a === id || b === id); p.setAttribute('stroke', on ? '#7A7CF0' : '#C9C9C9'); p.setAttribute('stroke-width', on ? 2.5 : 1.5); p.setAttribute('marker-end', on ? 'url(#ar2)' : 'url(#ar)'); });
  });
}
function closeFlow() { const f = $('#flow'); if (f) f.remove(); }

/* ---------- auditoría (la usa Playwright) ---------- */
const AVSRC = new Set();
window.__audit = function () {
  const bad = [], ids = Object.keys(SC);
  const vs = ['m', 'd'];
  for (const v of vs) for (const id of ids) {
    if (v === 'm' && (roleOf(id) === 'adm' || TO_M[id])) continue;
    if (v === 'd' && TO_D[id]) continue;
    for (const shv of [''].concat(SC[id].sheets || [])) {
    view = v; S = S0(); stack = ['P06']; cur = id; if (SC[id].prep) SC[id].prep(); S.sheet = shv; render(); clearT();
    document.querySelectorAll('.av').forEach(x => { if (!x.querySelector('img.avp') && !x.classList.contains('addph') && x.offsetParent !== null) bad.push(`${v} ${id}: avatar con iniciales «${x.textContent.trim().slice(0, 4)}»`); x.querySelectorAll('img.avp').forEach(i => AVSRC.add(i.getAttribute('src'))); });
    document.querySelectorAll('#stage button, #stage a, #stage tr.cl').forEach(b => {
      const g = b.dataset.go, a = b.dataset.act;
      if (!g && !a && !b.disabled) bad.push(`${v} ${id}: botón muerto «${b.textContent.trim().slice(0, 40)}»`);
      if (g && g !== 'back' && !SC[resolve(g)]) bad.push(`${v} ${id}: destino inexistente ${g}`);
      if (a && !ACT[a]) bad.push(`${v} ${id}: acción inexistente ${a}`);
    });
    }
  }
  // alcanzables desde los inicios
  const seen = new Set(), q = ['P06', 'P01', 'R01', 'A01', 'Q01'];
  while (q.length) { const x = q.shift(); if (seen.has(x)) continue; seen.add(x); linksOf(x).forEach(y => { q.push(y); if (TO_D[y]) q.push(TO_D[y]); if (TO_M[y]) q.push(TO_M[y]); }); }
  ids.forEach(id => { if (!seen.has(id)) bad.push('pantalla suelta (no se llega): ' + id); });
  return { pantallas: ids.length, problemas: bad, fotos: [...AVSRC] };
};

/* ---------- inicio ---------- */
window.addEventListener('DOMContentLoaded', () => {
  if (NATIVE) document.body.classList.add('nat');
  bar();
  const h = location.hash.replace('#/', '');
  const q = new URLSearchParams(location.search);
  if (q.get('v') && !NATIVE) { view = q.get('v'); }
  go(SC[h] ? h : 'P06', false);
  window.addEventListener('hashchange', () => { const x = location.hash.replace('#/', ''); if (SC[x] && x !== cur) { closeFlow(); go(x); } });
});
