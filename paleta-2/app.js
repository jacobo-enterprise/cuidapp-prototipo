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
  f: { enf: true, tens: true }, fmax: 0, fday: 'all', frat: 0, fgen: '', fcom: '',
  fav: { cr: true, pg: true }, q: '', typed: false, sheet: '', ctab: 'next', revF: 'all', revSort: 'rec', resp: { cr4: 'Gracias, Francisco. Ese día me pilló un taco en Grecia, por eso te avisé. ¡Nos vemos en el próximo control!' }, replyTo: 'cr1', rtxt: false, rcrit: {}, pday: 1, svcFrom: '',
  hasMed: true, receta: false, orden: '', mmode: 'cat', exq: '', kinAv: false, promo: 'kin', exams: { hemo: true, lip: true, gli: true }, tensNeeds: { hig: true, mov: true, sig: true, com: false },
  pay: 'visa', prev: 'fonasa', consent: false, rating: 0, tags: {}, tip: 0, chat: [], phase: 'llego', cancelFrom: 'P27', booked: false, hecho: false, cr: 0,
  docs: { carnet: false, selfie: false, titulo: false, antec: false, banco: false }, prof: 'enf',
  online: false, code: '', chk: { id: false, rec: false, ale: false }, earn: 186405, done: 9, pRating: 0, pTags: {}, paid: false,
  my: {
    iny: { on: true, p: 18000, night: 22000, nOn: true, dur: 30, inc: { ins: true, pre: true, res: true, edu: false } },
    cur: { on: true, p: 24000, night: 0, nOn: false, dur: 45, inc: { ins: true, pre: false, res: true, edu: true } },
    cura: { on: false, p: 25000, night: 0, nOn: false, dur: 60, inc: { ins: true, pre: false, res: true, edu: true } },
    mue: { on: true, p: 15000, night: 0, nOn: false, dur: 20, inc: { ins: true, pre: false, res: true, edu: false } },
    sig: { on: true, p: 12000, night: 0, nOn: false, dur: 30, inc: { ins: false, pre: true, res: false, edu: true } },
    son: { on: false, p: 28000, night: 0, nOn: false, dur: 45, inc: { ins: true, pre: false, res: true, edu: true } },
    inysc: { on: true, p: 16000, night: 0, nOn: false, dur: 20, inc: { ins: true, pre: false, res: true, edu: true } },
    inyev: { on: false, p: 26000, night: 0, nOn: false, dur: 45, inc: { ins: true, pre: true, res: true, edu: false } },
    pie: { on: false, p: 32000, night: 0, nOn: false, dur: 60, inc: { ins: true, pre: false, res: true, edu: true } },
    pun: { on: true, p: 18000, night: 0, nOn: false, dur: 30, inc: { ins: true, pre: false, res: true, edu: true } },
    suero: { on: false, p: 30000, night: 0, nOn: false, dur: 60, inc: { ins: true, pre: true, res: true, edu: false } },
  },
  edit: 'iny', setup: { pres: true, serv: false, com: false, hor: false },
  com: { prov: true, nun: true, lr: true, lc: false, vit: false, pen: false, stgo: true, mac: false, flo: false, sjo: false },
  week: { lun: true, mar: true, mie: true, jue: true, vie: true, sab: true, dom: false }, gap: 30, antic: 2,
  blocked: { 30: true }, req: { r1: 'new', r2: 'new' }, aday: 1, spec: { am: true, pd: true, ped: false, pal: false },
  sis: 0, aprob: [], rech: [], admTab: 'rev', cand: 0, aedit: 'iny', comm: 15,
  mins: { iny: 12000, inysc: 10000, inyev: 18000, cur: 15000, cura: 25000, pie: 25000, pun: 12000, mue: 10000, sig: 10000, son: 25000, suero: 22000, tens4: 24000, tens8: 40000 }, aRec: true,
});
let S = S0();
let view = localStorage.getItem('cv') || 'm';
let cur = null, stack = [], timers = [], maps = [], toastMsg = null, toastT = null;
const NATIVE = Math.min(window.innerWidth, window.screen.width) < 600;
if (NATIVE) view = 'm';

const SC = {};           // pantallas
const ACT = {};          // acciones
const def = s => (SC[s.id] = s);
const roleOf = id => id[0] === 'R' ? 'pro' : id[0] === 'A' ? 'adm' : 'pac';
const START = { pac: 'P06', pro: 'R01', adm: 'A01' };
const ROLE_N = { pac: 'Paciente', pro: 'Profesional', adm: 'Admin' };
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

/* ---------- catálogo de Cuidapp (lo define Cuidapp; el precio lo pone cada profesional) ---------- */
const CAT = {
  iny: { n: 'Inyección intramuscular', s: 'Intramuscular', g: 'iny', d: 'Neurobionta, vitamina B12 y otras, con receta', ic: 'syringe', who: ['enf', 'tens'], dur: 30, receta: true },
  inysc: { n: 'Inyección subcutánea', s: 'Subcutánea', g: 'iny', d: 'Insulina, heparina y vacunas indicadas, con receta', ic: 'syringe', who: ['enf', 'tens'], dur: 20, receta: true },
  inyev: { n: 'Inyección endovenosa', s: 'Endovenosa', g: 'iny', d: 'Medicamento por la vena, con receta', ic: 'syringe', who: ['enf'], dur: 45, receta: true },
  cur: { n: 'Curación simple', s: 'Simple', g: 'cur', d: 'Heridas, puntos y quemaduras leves', ic: 'bandaids', who: ['enf'], dur: 45 },
  cura: { n: 'Curación avanzada', s: 'Avanzada', g: 'cur', i: 'cura', d: 'Escaras, úlceras y heridas que no cierran', ic: 'first-aid', who: ['enf'], dur: 60 },
  pie: { n: 'Curación de pie diabético', s: 'Pie diabético', g: 'cur', i: 'cura', d: 'Con evaluación y fotos de control', ic: 'first-aid', who: ['enf'], dur: 60 },
  pun: { n: 'Retiro de puntos', s: 'Retiro de puntos', g: 'cur', d: 'Puntos o corchetes después de una cirugía', ic: 'bandaids', who: ['enf'], dur: 30 },
  mue: { n: 'Toma de muestras a domicilio', s: 'Toma de muestras', g: 'mue', d: 'Exámenes con precio del laboratorio aliado', ic: 'test-tube', who: ['enf', 'tens'], dur: 20, lab: true },
  sig: { n: 'Control de signos vitales', s: 'Signos vitales', g: 'sig', d: 'Presión, glicemia, temperatura y saturación', ic: 'heartbeat', who: ['enf', 'tens'], dur: 30 },
  son: { n: 'Instalación o cambio de sonda', s: 'Sondas', g: 'son', d: 'Sonda Foley o nasogástrica', ic: 'first-aid-kit', who: ['enf'], dur: 45 },
  suero: { n: 'Instalación de suero', s: 'Suero', g: 'son', d: 'Hidratación o medicamento por goteo, con receta', ic: 'drop', who: ['enf'], dur: 60, receta: true },
  tens4: { n: 'Cuidados TENS · 4 horas', s: '4 horas', g: 'tens4', d: 'Higiene, movilización, remedios y compañía', ic: 'hand-heart', who: ['tens'], dur: 240 },
  tens8: { n: 'Cuidados TENS · 8 horas', s: '8 horas', g: 'tens4', d: 'Turno de día o de noche', ic: 'hand-heart', who: ['tens'], dur: 480 },
};
/* categorías (lo que ve la paciente primero); cada una agrupa servicios concretos */
const GRP = {
  iny: { n: 'Inyecciones', c: 'Inyecciones', d: 'Intramuscular, subcutánea y endovenosa', l: ['iny', 'inysc', 'inyev'] },
  cur: { n: 'Curaciones y heridas', c: 'Curaciones y heridas', d: 'Simple, avanzada, pie diabético y retiro de puntos', l: ['cur', 'cura', 'pie', 'pun'] },
  mue: { n: 'Exámenes y toma de muestras', c: 'Exámenes', d: 'Precios del laboratorio aliado + toma a domicilio', l: ['mue'] },
  sig: { n: 'Signos vitales', c: 'Signos vitales', d: 'Presión, glicemia, temperatura y saturación', l: ['sig'] },
  son: { n: 'Sondas y sueros', c: 'Sondas y sueros', d: 'Sonda Foley, nasogástrica y suero', l: ['son', 'suero'] },
  tens4: { n: 'Cuidados TENS (por horas)', c: 'Cuidados TENS', d: 'Turnos de 4 u 8 horas', l: ['tens4', 'tens8'] },
};
const GK = Object.keys(GRP);
/* iconos 3D de servicios (img/iconos-3d); el resto de la interfaz usa Phosphor */
const i3k = k => CAT[k] ? (CAT[k].i || CAT[k].g) : k;
const i3 = (k, c = '') => `<img class="i3d ${c}" src="img/iconos-3d/${i3k(k)}.webp" alt="" draggable="false">`;
const INC = { ins: 'Insumos: jeringa, aguja, tórulas y guantes', pre: 'Control de presión antes y después', res: 'Retiro de residuos clínicos', edu: 'Indicaciones escritas para la familia' };
/* catálogo del laboratorio aliado: precios fijos, no los pone la profesional */
const LAB = 'Laboratorio aliado';
const EXAMS = {
  hemo: ['Hemograma', 6500, 'Tubo lila', 0], lip: ['Perfil lipídico', 8900, 'Tubo rojo', 1], gli: ['Glicemia', 3900, 'Tubo gris', 1], bioq: ['Perfil bioquímico', 12900, 'Tubo rojo', 1],
  ori: ['Orina completa', 4500, 'Frasco estéril', 0], uro: ['Urocultivo', 7900, 'Frasco estéril', 0], tsh: ['TSH', 9900, 'Tubo rojo', 0], t4: ['T4 libre', 9500, 'Tubo rojo', 0],
  hba: ['Hemoglobina glicosilada', 8500, 'Tubo lila', 0], cre: ['Creatinina', 3500, 'Tubo rojo', 0], vitd: ['Vitamina D', 18900, 'Tubo rojo', 0], pcr: ['Proteína C reactiva', 6900, 'Tubo rojo', 0],
};
const examKeys = () => Object.keys(EXAMS).filter(k => S.exams[k]);
const examList = () => examKeys().map(k => EXAMS[k]);
const examSum = () => examList().reduce((a, e) => a + e[1], 0);
const byOrder = () => S.mmode === 'orden';
const fasting = () => !byOrder() && examKeys().some(k => EXAMS[k][3]) || byOrder();
const tubes = () => [...new Set(examList().map(e => e[2]))];
const DAYS = [['Lun', 26, 'Hoy', 'hoy lun 26 oct'], ['Mar', 27, 'Mañana', 'mar 27 oct'], ['Mié', 28, '', 'mié 28 oct'], ['Jue', 29, '', 'jue 29 oct'], ['Vie', 30, '', 'vie 30 oct'], ['Sáb', 31, '', 'sáb 31 oct']];
const dayShort = i => DAYS[i][2] || `${DAYS[i][0]} ${DAYS[i][1]}`;

/* profesionales de ejemplo (datos ficticios) */
const PROS = [
  { id: 'cr', n: 'Camila Rojas', i: 'CR', t: 'Enfermera', k: 'enf', g: 'f', reg: '482.317', r: '4,9', rn: 4.9, a: 132, rv: 92, km: 1.8, yrs: 6, bg: '#EEEBFE', fg: '#4A33D0', top: true,
    com: ['Ñuñoa', 'Providencia', 'La Reina', 'Santiago'], tel: '+56 9 7712 3008', resp: '20 min',
    bio: 'Soy enfermera de la U. de Chile y trabajé 5 años en medicina interna del Hospital del Salvador. Atiendo a domicilio hace 3 años, sobre todo a adultos mayores. Me gusta explicar todo con calma y dejar las indicaciones por escrito para la familia.',
    spec: ['Adulto mayor', 'Inyecciones con receta', 'Curaciones', 'Paciente diabético'],
    edu: [['Enfermería', 'Universidad de Chile', '2019'], ['Diplomado en Heridas y Ostomías', 'Pontificia Universidad Católica', '2022'], ['Curso IAAS y RCP básico', 'Hospital del Salvador', '2024']],
    dist: [91, 7, 2, 0, 0], crit: [['Puntualidad', '4,9'], ['Trato', '5,0'], ['Técnica', '4,9'], ['Explica todo', '4,9']],
    p: { iny: 18000, cur: 24000, mue: 15000, sig: 12000 }, night: { iny: 22000 }, xinc: 'Control de presión antes y después',
    sl: [[], ['08:00', '09:00', '11:30', '19:00', '21:00'], ['08:00', '10:00', '18:30', '21:00'], ['09:00', '12:00', '19:30'], ['08:00', '08:30', '17:00'], ['10:00', '11:00']] },
  { id: 'fa', n: 'Fernanda Araya', i: 'FA', t: 'Enfermera', k: 'enf', g: 'f', reg: '512.884', r: '5,0', rn: 5.0, a: 61, rv: 44, km: 3.2, yrs: 3, bg: '#F3F3F5', fg: '#0D0D0D',
    com: ['Ñuñoa', 'Macul', 'La Florida', 'Peñalolén'], tel: '+56 9 6620 1475', resp: '15 min',
    bio: 'Enfermera de la U. de Santiago. Vengo de atención primaria en el Cesfam de Macul y me especialicé en curaciones de pie diabético. Te enseño a cuidar la herida entre una visita y otra.',
    spec: ['Pie diabético', 'Heridas complejas', 'Sondas'],
    edu: [['Enfermería', 'Universidad de Santiago', '2022'], ['Curso de Curación Avanzada de Heridas', 'Fundación Instituto Nacional de Heridas', '2023']],
    dist: [98, 2, 0, 0, 0], crit: [['Puntualidad', '5,0'], ['Trato', '5,0'], ['Técnica', '5,0'], ['Explica todo', '4,9']],
    p: { iny: 22000, cur: 28000, cura: 38000, mue: 17000, son: 32000 }, night: {}, xinc: 'Fotos de control de la herida',
    sl: [['19:30', '20:30'], ['07:30', '13:00', '20:00'], ['07:30', '14:00'], ['16:00', '20:00'], ['07:30'], []] },
  { id: 'mc', n: 'Matías Contreras', i: 'MC', t: 'Enfermero', k: 'enf', g: 'm', reg: '505.317', r: '4,7', rn: 4.7, a: 48, rv: 31, km: 0.9, yrs: 2, bg: '#EEEBFE', fg: '#3520B8',
    com: ['Ñuñoa', 'Santiago'], tel: '+56 9 5531 8820', resp: '1 h',
    bio: 'Enfermero de la U. Andrés Bello. Trabajo en la urgencia de la Clínica Indisa y atiendo a domicilio en mis días libres. Rápido, ordenado y con buen precio.',
    spec: ['Inyecciones', 'Toma de muestras', 'Control de presión'],
    edu: [['Enfermería', 'Universidad Andrés Bello', '2023'], ['Curso de Urgencias Prehospitalarias', 'Clínica Indisa', '2024']],
    dist: [76, 18, 4, 2, 0], crit: [['Puntualidad', '4,8'], ['Trato', '4,7'], ['Técnica', '4,8'], ['Explica todo', '4,5']],
    p: { iny: 15000, cur: 20000, mue: 13000, sig: 10000 }, night: {}, xinc: '',
    sl: [[], [], ['09:00', '10:00', '11:00'], ['09:00', '15:00'], ['18:00', '19:00'], ['09:00', '10:00', '11:00', '12:00']] },
  { id: 'pg', n: 'Paula Godoy', i: 'PG', t: 'TENS', k: 'tens', g: 'f', reg: '311.208', r: '4,8', rn: 4.8, a: 87, rv: 63, km: 2.4, yrs: 8, bg: '#F3F3F5', fg: '#2A2A2E',
    com: ['Providencia', 'Ñuñoa', 'Santiago'], tel: '+56 9 8840 1206', resp: '25 min',
    bio: 'Técnica en enfermería (TENS) con 8 años en el Hospital Salvador. Acompaño a adultos mayores en su casa: higiene, movilización, remedios y compañía. También pongo inyecciones con receta.',
    spec: ['Cuidado de adulto mayor', 'Movilización', 'Inyecciones con receta'],
    edu: [['Técnico de Nivel Superior en Enfermería', 'Inacap', '2017'], ['Curso de Cuidados Paliativos', 'Fundación Paliativos Chile', '2021']],
    dist: [84, 12, 3, 1, 0], crit: [['Puntualidad', '4,9'], ['Trato', '5,0'], ['Técnica', '4,7'], ['Explica todo', '4,8']],
    p: { iny: 14000, mue: 12000, sig: 10000, tens4: 28000 }, night: { iny: 17000 }, xinc: 'Ayuda a ordenar los remedios de la semana',
    sl: [['20:00'], ['10:30', '12:00', '16:00'], ['10:30', '17:00'], ['08:00', '10:30'], ['10:30', '12:00'], ['09:00']] },
  { id: 'vm', n: 'Valentina Morales', i: 'VM', t: 'Enfermera', k: 'enf', g: 'f', reg: '509.663', r: '4,9', rn: 4.9, a: 203, rv: 148, km: 4.1, yrs: 11, bg: '#EEEBFE', fg: '#5B41E6', top: true,
    com: ['Las Condes', 'La Reina', 'Vitacura', 'Ñuñoa'], tel: '+56 9 9012 4477', resp: '30 min',
    bio: 'Enfermera de la PUC con 11 años en clínica. Me especialicé en heridas y en pacientes postrados. Después de cada atención te mando un informe por correo.',
    spec: ['Heridas y úlceras', 'Paciente postrado', 'Sondas', 'Post operatorio'],
    edu: [['Enfermería', 'Pontificia Universidad Católica', '2015'], ['Magíster en Enfermería', 'Universidad de los Andes', '2020'], ['Certificación en Heridas', 'WCET', '2021']],
    dist: [90, 8, 1, 1, 0], crit: [['Puntualidad', '5,0'], ['Trato', '4,9'], ['Técnica', '5,0'], ['Explica todo', '4,9']],
    p: { iny: 25000, cur: 30000, cura: 42000, mue: 18000, son: 35000 }, night: { iny: 30000 }, xinc: 'Informe de la atención por correo',
    sl: [[], [], [], ['08:30', '10:00', '15:00'], ['08:30', '12:00'], ['10:00']] },
  { id: 'fl', n: 'Francisca León', i: 'FL', t: 'Enfermera', k: 'enf', g: 'f', reg: '498.120', r: '4,8', rn: 4.8, a: 156, rv: 104, km: 3.6, yrs: 9, bg: '#F3F3F5', fg: '#3A3A40',
    com: ['Las Condes', 'Providencia', 'Ñuñoa', 'Vitacura'], tel: '+56 9 7340 2291', resp: '40 min',
    bio: 'Enfermera de la U. de los Andes. Nueve años en pabellón y recuperación de la Clínica Alemana. Hoy atiendo post operatorios y toma de muestras a domicilio.',
    spec: ['Post operatorio', 'Toma de muestras', 'Inyecciones'],
    edu: [['Enfermería', 'Universidad de los Andes', '2017'], ['Diplomado en Enfermería Quirúrgica', 'Universidad de Chile', '2019']],
    dist: [85, 11, 3, 1, 0], crit: [['Puntualidad', '4,8'], ['Trato', '4,9'], ['Técnica', '4,9'], ['Explica todo', '4,7']],
    p: { iny: 20000, cur: 27000, cura: 40000, mue: 16000 }, night: { iny: 24000 }, xinc: 'Control de presión antes y después',
    sl: [[], ['18:00', '19:00'], ['08:00', '18:00'], ['08:00'], ['07:30', '09:00'], ['10:00', '11:00']] },
  { id: 'dn', n: 'Diego Navarro', i: 'DN', t: 'Enfermero', k: 'enf', g: 'm', reg: '517.402', r: '4,7', rn: 4.7, a: 64, rv: 47, km: 2.9, yrs: 4, bg: '#EEEBFE', fg: '#4A33D0',
    com: ['Macul', 'La Florida', 'Ñuñoa', 'Peñalolén'], tel: '+56 9 6118 4420', resp: '35 min',
    bio: 'Enfermero de la U. Mayor. Trabajo en el Hospital Sótero del Río y atiendo a domicilio en la tarde. Llego con todo lo necesario y dejo todo limpio.',
    spec: ['Inyecciones', 'Signos vitales', 'Toma de muestras'],
    edu: [['Enfermería', 'Universidad Mayor', '2021'], ['Curso de Toma de Muestras', 'Laboratorio Bionet', '2022']],
    dist: [74, 21, 3, 2, 0], crit: [['Puntualidad', '4,7'], ['Trato', '4,8'], ['Técnica', '4,7'], ['Explica todo', '4,6']],
    p: { iny: 16000, cur: 22000, mue: 14000, sig: 11000 }, night: { iny: 19000 }, xinc: '',
    sl: [[], ['17:00', '18:30', '20:00'], ['17:00', '19:00'], ['18:00'], ['17:30', '19:00'], ['09:00', '10:30']] },
];
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
    { id: 'pg1', n: 'Teresa Alarcón', c: 'Providencia', d: 'hace 6 días', s: 'tens4', r: 5, t: 'Cuida a mi mamá dos veces por semana. Es cariñosa, ordenada y la tiene feliz.' },
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
};
const PRO = (id = S.pro) => PROS.find(p => p.id === id);
const proName = () => PRO();
const DERIV = { inysc: ['iny', -2000], inyev: ['iny', 8000, 'enf'], pie: ['cura', 2000], pun: ['cur', -6000], suero: ['son', -2000], tens8: ['tens4', 22000] };
const derived = (pr, k) => { const d = DERIV[k]; if (!d || !pr.p[d[0]] || (d[2] && pr.k !== d[2])) return 0; return pr.p[d[0]] + d[1]; };
// precio de una profesional para un servicio. Camila (la cuenta profesional del prototipo) usa lo que ella edita.
function priceOf(pr, item = S.item, slot) {
  if (!item) { const l = Object.keys(CAT).map(k => priceOf(pr, k)).filter(Boolean); return l.length ? Math.min(...l) : 0; }
  let base = pr.p[item] || derived(pr, item), nt = pr.night[item];
  if (pr.id === 'cr') { const m = S.my[item]; base = m && m.on ? m.p : undefined; nt = m && m.nOn ? m.night : 0; }
  if (!base) return 0;
  return slot && slot >= '21:00' && nt ? nt : base;
}
const nightOf = (pr, item = S.item) => pr.id === 'cr' ? (S.my[item] && S.my[item].nOn ? S.my[item].night : 0) : (pr.night[item] || 0);
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
  const p = priceOf(pr, S.item, S.when === 'prog' ? S.slot : '');
  const isN = S.when === 'prog' && S.slot >= '21:00' && nightOf(pr);
  if (S.item === 'mue') { L.push([`Toma a domicilio · ${first(pr)}`, p]); if (!byOrder()) L.push([`Exámenes (laboratorio) · ${examList().length}`, examSum()]); if (!byOrder() && examSum() >= 30000) L.push(['Toma gratis · exámenes sobre $30.000', -p]); return { L, total: L.reduce((a, b) => a + b[1], 0), pro: p, lab: byOrder() ? 0 : examSum(), pend: byOrder() }; }
  L.push([`${CAT[S.item].n}${isN ? ' · horario nocturno' : ''}`, p]);
  return { L, total: L.reduce((a, b) => a + b[1], 0), pro: p };
}
const slotEnd = t => { const [h, m] = t.split(':').map(Number); const x = h * 60 + m + 30; return String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0'); };
const whenTxt = () => S.when === 'ahora' ? `Hoy, llega en ~${PRO().asap || 30} min` : `${dayShort(S.day)}, ${S.slot} a ${slotEnd(S.slot)}`;
const whenLong = () => S.when === 'ahora' ? `Hoy, llega en ~${PRO().asap || 30} min` : `${DAYS[S.day][3].replace(/^\w/, c => c.toUpperCase())}, llega entre ${S.slot} y ${slotEnd(S.slot)}`;
const whoTxt = () => ({ mama: 'Rosa Muñoz (mamá)', yo: 'Daniela Fuentes (tú)', papa: 'Luis Fuentes (papá)' })[S.who];
const first = (p = PRO()) => p.n.split(' ')[0];
const net = p => Math.round(p * (100 - S.comm) / 100);

/* ---------- componentes ---------- */
const btn = (t, go, k = '', extra = '') => `<button class="btn ${k}" ${go ? `data-go="${go}"` : ''} ${extra}>${t}</button>`;
const abtn = (t, act, arg = '', k = '', go = '', dis = false) => `<button class="btn ${k}" data-act="${act}" data-arg="${arg}" ${go ? `data-go="${go}"` : ''} ${dis ? 'disabled' : ''}>${t}</button>`;
const row = (i, a, b = '', go = '', end = ic('caret-right'), cls = '', act = '', arg = '') => {
  const tag = go || act ? 'button' : 'div';
  return `<${tag} class="row ${cls}" ${go ? `data-go="${go}"` : ''} ${act ? `data-act="${act}" data-arg="${arg}"` : ''}>
  ${i ? `<span class="ri ${i.startsWith('box:') ? 'box' : ''}">${ic(i.replace('box:', ''))}</span>` : ''}
  <span class="tx"><div class="a">${a}</div>${b ? `<div class="b">${b}</div>` : ''}</span>${end ? `<span class="end">${end}</span>` : ''}</${tag}>`;
};
const ST_I = { ok: 'check-circle', warn: 'clock', inf: 'clock-countdown', bad: 'x-circle' };
const st = (k, t, i) => { i = i === '' ? '' : (i || ST_I[k]); return `<span class="st ${k}">${i ? ic(i, 1) : ''}${t}</span>`; };
const av = (ini, cls = '', ver = false) => `<span class="av ${cls}">${ini}${ver ? `<span class="vb">${ic('check', 0).replace('ph ', 'ph-bold ')}</span>` : ''}</span>`;
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
  const it = [['A02', 'identification-card', 'Verificación', 'ver', n], ['A04', 'calendar-check', 'Reservas de hoy', 'hoy'], ['A06', 'users-three', 'Profesionales', 'pro'], ['A05', 'list-checks', 'Catálogo y comisión', 'tar']];
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
const pinHome = () => L.divIcon({ className: '', iconSize: [26, 26], iconAnchor: [13, 13], html: '<div style="width:26px;height:26px;border-radius:6px;background:#0D0D0D;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.3)"><div style="width:8px;height:8px;background:#fff;border-radius:2px"></div></div>' });
const pinPro = (lbl) => L.divIcon({ className: '', iconSize: [22, 22], iconAnchor: [11, 11], html: `<div style="position:relative"><div style="width:22px;height:22px;border-radius:11px;background:#6950F2;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></div>${lbl ? `<div style="position:absolute;left:30px;top:-3px;background:#0D0D0D;color:#fff;font:600 13px/28px var(--font);padding:0 10px;border-radius:14px;white-space:nowrap">${lbl}</div>` : ''}</div>` });
const pinDot = (c = '#6950F2') => L.divIcon({ className: '', iconSize: [14, 14], iconAnchor: [7, 7], html: `<div style="width:14px;height:14px;border-radius:7px;background:${c};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>` });
const pinPulse = () => L.divIcon({ className: '', iconSize: [160, 160], iconAnchor: [80, 80], html: '<div class="pulse"><span></span><span></span><span></span></div>' });
const pinLabel = (t) => L.divIcon({ className: '', iconSize: [0, 0], iconAnchor: [0, 0], html: `<div style="transform:translate(-50%,-44px);background:#0D0D0D;color:#fff;font:600 13px/30px var(--font);padding:0 12px;border-radius:15px;white-space:nowrap;display:inline-block">${t}</div>` });
const pinMe = () => L.divIcon({ className: '', iconSize: [22, 22], iconAnchor: [11, 11], html: '<div style="width:22px;height:22px;border-radius:11px;background:#0D0D0D;border:4px solid #fff;box-shadow:0 0 0 6px rgba(17,17,17,.16),0 2px 6px rgba(0,0,0,.3)"></div>' });
const pinNav = () => L.divIcon({ className: '', iconSize: [40, 40], iconAnchor: [20, 20], html: '<div style="width:40px;height:40px;border-radius:20px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center"><i class="ph-fill ph-navigation-arrow" style="font-size:22px;color:#6950F2;transform:rotate(45deg)"></i></div>' });

function mkMap(el, o) {
  const m = L.map(el, { zoomControl: false, attributionControl: true, zoomSnap: 0.25, fadeAnimation: false });
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, maxNativeZoom: 16, attribution: 'Esri, HERE, Garmin, © OpenStreetMap' }).addTo(m);
  maps.push(m);
  const pts = [];
  const add = (ll, icon, z) => { const mk = L.marker(ll, { icon, interactive: false, zIndexOffset: z || 0 }).addTo(m); pts.push(ll); return mk; };
  if (o.pulse) add(o.pulse, pinPulse(), -10);
  if (o.route) { L.polyline(o.route, { color: '#6950F2', weight: 5, opacity: 1, lineCap: 'round', lineJoin: 'round' }).addTo(m); o.route.forEach(p => pts.push(p)); }
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
  <div class="seg">${['pac', 'pro', 'adm'].map(r => `<button data-role="${r}">${ROLE_N[r]}</button>`).join('')}</div>
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
  if (s.kind === 'adm' && s.side !== 'none') ['A02', 'A04', 'A06', 'A05', 'A01'].forEach(x => out.add(x));
  S = JSON.parse(saved);
  out.delete(id);
  return [...out].filter(x => SC[x]);
}
window.__links = linksOf;
const LANES = [
  ['pac', 'Paciente', [['P01', 'P02', 'P03', 'P04', 'P05'], ['P06', 'P07', 'P08', 'P09'], ['P10', 'P11', 'P36', 'P34'], ['P12', 'P32', 'P33', 'P22'], ['P13', 'P14', 'P15', 'P16'], ['P17', 'P18', 'P19', 'P20'], ['P26', 'P27', 'P30', 'P28', 'P29'], ['P21', 'P23', 'P24', 'P25'], ['W01', 'W02', 'W03', 'W04']]],
  ['pro', 'Profesional', [['R01', 'R02', 'R03'], ['R04', 'R05', 'R06', 'R07'], ['R08', 'R09', 'R10', 'R26'], ['R11', 'R12', 'R13', 'R14', 'R15'], ['R16', 'R17', 'R18'], ['R19', 'R20', 'R21', 'R22'], ['R23', 'R24', 'R25'], ['R27', 'R28', 'R29']]],
  ['adm', 'Admin', [['A01', 'A02', 'A03'], ['A04', 'A05', 'A07'], ['A06']]],
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
    svgN += `<g class="node" data-open="${id}"><rect x="${p.x}" y="${p.y}" width="${NW}" height="${NH}" rx="10" fill="#fff" stroke="${id[0] === 'W' ? '#6950F2' : '#D9D9D9'}"/><text x="${p.x + 14}" y="${p.y + 22}" font-size="12" font-weight="600" fill="#8A8A8A">${id}${id[0] === 'W' ? ' · escritorio' : ''}</text><text x="${p.x + 14}" y="${p.y + 41}" font-size="14" font-weight="600" fill="#1D1D1B">${nm}</text></g>`;
  });
  const f = document.createElement('div'); f.className = 'flow'; f.id = 'flow';
  f.innerHTML = `<div style="padding:24px 40px 0;display:flex;align-items:baseline;gap:16px"><div class="h-l">Mapa del flujo</div><div class="t2">${Object.keys(pos).length} pantallas. Toca una para abrir el prototipo en ese punto. Pasa el mouse para ver sus conexiones.</div><span style="flex:1"></span><button class="btn sec" style="width:auto;padding:0 18px" id="flowclose">${ic('x')}Cerrar</button></div>
  <svg width="${W}" height="${y + 20}"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="#BDBDBD"/></marker><marker id="ar2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="#6950F2"/></marker></defs>${svgL}${edges}${svgN}</svg>`;
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
    f.querySelectorAll('path[data-e]').forEach(p => { const [a, b] = p.dataset.e.split(' '); const on = id && (a === id || b === id); p.setAttribute('stroke', on ? '#6950F2' : '#C9C9C9'); p.setAttribute('stroke-width', on ? 2.5 : 1.5); p.setAttribute('marker-end', on ? 'url(#ar2)' : 'url(#ar)'); });
  });
}
function closeFlow() { const f = $('#flow'); if (f) f.remove(); }

/* ---------- auditoría (la usa Playwright) ---------- */
window.__audit = function () {
  const bad = [], ids = Object.keys(SC);
  const vs = ['m', 'd'];
  for (const v of vs) for (const id of ids) {
    if (v === 'm' && (roleOf(id) === 'adm' || TO_M[id])) continue;
    if (v === 'd' && TO_D[id]) continue;
    for (const shv of [''].concat(SC[id].sheets || [])) {
    view = v; S = S0(); stack = ['P06']; cur = id; if (SC[id].prep) SC[id].prep(); S.sheet = shv; render(); clearT();
    document.querySelectorAll('#stage button, #stage a, #stage tr.cl').forEach(b => {
      const g = b.dataset.go, a = b.dataset.act;
      if (!g && !a && !b.disabled) bad.push(`${v} ${id}: botón muerto «${b.textContent.trim().slice(0, 40)}»`);
      if (g && g !== 'back' && !SC[resolve(g)]) bad.push(`${v} ${id}: destino inexistente ${g}`);
      if (a && !ACT[a]) bad.push(`${v} ${id}: acción inexistente ${a}`);
    });
    }
  }
  // alcanzables desde los inicios
  const seen = new Set(), q = ['P06', 'P01', 'R01', 'A01'];
  while (q.length) { const x = q.shift(); if (seen.has(x)) continue; seen.add(x); linksOf(x).forEach(y => { q.push(y); if (TO_D[y]) q.push(TO_D[y]); if (TO_M[y]) q.push(TO_M[y]); }); }
  ids.forEach(id => { if (!seen.has(id)) bad.push('pantalla suelta (no se llega): ' + id); });
  return { pantallas: ids.length, problemas: bad };
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
