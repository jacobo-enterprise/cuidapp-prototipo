/* Cuidapp · ficha clínica compartida, nota de la visita y bitácora de turno */
Object.assign(ACT, {
  shH: h => { S.sh.h = +h; }, shJ: j => { S.sh.jor = j; }, shS: i => { S.sh.start = +i; }, shWk: w => { S.sh.wk = +w; },
  shRep: w => { S.sh.rep[w] = !S.sh.rep[w]; },
  tog2: a => { const [o, k] = a.split('.'); S.sh[o][k] = !S.sh[o][k]; },
  ntog: a => { const [o, k] = a.split('.'); if (k) S.note[o][k] = !S.note[o][k]; else S.note[o] = !S.note[o]; },
  nset: a => { const [k, v] = a.split('='); S.note[k] = isNaN(+v) ? v : +v; },
  fm: k => { S.fm = k; },
  tlF: k => { S.tlF = k; },
  phView: () => { S.phView = !S.phView; },
  fichaChk: () => { S.fichaChk = !S.fichaChk; },
  fichaNew: () => { S.fichaOk = true; S.fm = 'papa'; toast('Ficha creada. Solo tú decides quién la ve.'); },
  revoke: k => { S.rev = S.rev || {}; S.rev[k] = true; toast('Acceso revocado. Ya no puede ver la ficha.'); },
  revokeAll: () => { S.rev = { cr: true, vm: true, pg: true }; S.share = 'nada'; toast('Revocaste todos los accesos. Las notas firmadas se conservan.'); },
  pdf: () => toast(`Descargado: Ficha-${FM().n.split(' ').slice(0, 2).join('-')}-26-10-2026.pdf`),
  askAcc: () => toast('Le pedimos a Daniela acceso al historial completo. Te avisamos con una notificación push.'),
  sign: () => { S.note.sig = true; S.noteSigned = true; },
  addend: () => { S.note.add = true; toast('Addendum agregado con fecha y hora. La nota original no cambia.'); },
  bitAdd: () => { S.bit.h++; toast('Registro agregado a la bitácora: 06:00 · control de signos vitales.'); },
  handoff: () => toast('Entrega de turno firmada. Ximena la verá al llegar a las 08:00.'),
});
if (S.phView === undefined) S.phView = false;

/* ---------- datos ---------- */
const WOUND = [  // evolución de la herida H1 de Rosa
  { d: '15 oct', l: 4.6, a: 3.0, p: 0.4, gr: 50, es: 50, ex: 'Moderado · seroso', pi: 'Eritematosa', eva: 5, pro: 'cr' },
  { d: '19 oct', l: 4.1, a: 2.8, p: 0.3, gr: 60, es: 40, ex: 'Moderado · seroso', pi: 'Eritematosa', eva: 4, pro: 'vm' },
  { d: '22 oct', l: 3.8, a: 2.6, p: 0.3, gr: 70, es: 30, ex: 'Escaso · seroso', pi: 'Sana', eva: 3, pro: 'vm' },
  { d: '24 oct', l: 3.5, a: 2.3, p: 0.2, gr: 75, es: 25, ex: 'Escaso · seroso', pi: 'Sana', eva: 3, pro: 'cr' },
  { d: 'Hoy', l: 3.2, a: 2.1, p: 0.2, gr: 80, es: 20, ex: 'Escaso · seroso', pi: 'Sana', eva: 2, pro: 'cr' },
];
const VIT = { d: ['15 oct', '19 oct', '22 oct', '24 oct', 'Hoy'], pas: [148, 142, 138, 136, 132], pad: [88, 86, 84, 82, 80], glu: [168, 155, 149, 151, 142], sat: [95, 96, 96, 95, 96] };
const TL = [
  { t: 'vis', d: 'Hoy · 08:41', pro: 'cr', a: 'Inyección IM y curación', b: 'Neurobionta 2ª dosis, glúteo derecho. Úlcera 3,2 × 2,1 cm, mejor que el 24 oct.', go: 'P58', today: true },
  { t: 'sv', d: 'Hoy · 08:10', pro: 'cr', a: 'Signos vitales', b: 'PA 132/80 · FC 76 · T° 36,6 · Sat 96% · Glicemia 142', go: 'P54' },
  { t: 'cur', d: '24 oct · 19:20', pro: 'cr', a: 'Curación avanzada', b: '3,5 × 2,3 cm · lecho 75% granulatorio · exudado escaso', go: 'P53' },
  { t: 'med', d: '24 oct · 08:00', pro: 'cr', a: 'Inyección IM', b: 'Neurobionta 1ª de 3 dosis · cada 48 h · 5 correctos verificados', go: 'P58' },
  { t: 'cur', d: '22 oct · 18:05', pro: 'vm', a: 'Curación avanzada', b: '3,8 × 2,6 cm · se cambia a espuma con borde', go: 'P53' },
  { t: 'doc', d: '20 oct', pro: '', a: 'Receta · Dr. Andrés Valenzuela', b: 'Neurobionta 5.000, 1 amp. IM cada 48 h, 3 dosis', go: 'P15' },
  { t: 'tur', d: '19 oct · 20:00 a 08:00', pro: 'pg', a: 'Turno de noche · TENS', b: 'Durmió bien. 2 cambios de posición. Entrega de turno sin alertas.', go: 'R36' },
  { t: 'cur', d: '15 oct · 10:30', pro: 'cr', a: 'Primera curación', b: 'Úlcera venosa 4,6 × 3,0 cm · se toma foto con consentimiento', go: 'P53' },
  { t: 'doc', d: '4 oct', pro: 'pg', a: 'Resultados de exámenes', b: 'Colesterol 212 y LDL 131 sobre el rango', go: 'P42' },
];
const TLT = { all: ['Todo', 'list'], vis: ['Visitas', 'house-line'], cur: ['Curaciones', 'bandaids'], sv: ['Signos vitales', 'heartbeat'], med: ['Remedios', 'pill'], tur: ['Turnos', 'moon'], doc: ['Documentos', 'file-text'] };
const SEEN = [
  ['cr', 'Vio el resumen antes de la visita', 'Hoy · 07:55', 'Solo resumen'],
  ['cr', 'Escribió y firmó la nota de la visita', 'Hoy · 08:41', 'Autora'],
  ['', 'Tú descargaste la ficha en PDF', '25 oct · 21:14', ''],
  ['vm', 'Vio la ficha completa durante la visita', '22 oct · 17:52', 'Todo'],
  ['pg', 'Vio el resumen y dejó la bitácora del turno', '19 oct · 19:58', 'Solo resumen'],
  ['', 'Equipo de Cuidapp revisó una alerta de seguridad', '19 oct · 09:03', 'Soporte'],
];
const proById = id => PROS.find(p => p.id === id);
const pName = id => id ? proById(id).n : 'Tú';
const pAv = id => id ? av(id.toUpperCase(), 's') : av('DF', 's');

/* ---------- gráficos ---------- */
function chart(series, labels, lo, hi, band, unit) {
  const W = 320, H = 132, L = 30, B = 22, T = 10, X = i => L + i * ((W - L - 12) / (labels.length - 1)), Y = v => T + (hi - v) * (H - T - B) / (hi - lo);
  const grid = [lo, (lo + hi) / 2, hi].map(v => `<line x1="${L}" x2="${W - 6}" y1="${Y(v)}" y2="${Y(v)}" stroke="#ECEBF3"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${Math.round(v)}</text>`).join('');
  const bd = band ? `<rect x="${L}" width="${W - L - 6}" y="${Y(band[1])}" height="${Y(band[0]) - Y(band[1])}" fill="#F1F1FE"/>` : '';
  const ln = series.map(s => `<polyline fill="none" stroke="${s.c}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" points="${s.v.map((v, i) => X(i) + ',' + Y(v)).join(' ')}"/>${s.v.map((v, i) => `<circle cx="${X(i)}" cy="${Y(v)}" r="${i === s.v.length - 1 ? 4.5 : 3}" fill="${i === s.v.length - 1 ? s.c : '#fff'}" stroke="${s.c}" stroke-width="2"/>`).join('')}`).join('');
  const lb = labels.map((t, i) => `<text x="${X(i)}" y="${H - 5}" text-anchor="middle">${t}</text>`).join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Gráfico ${unit}">${bd}${grid}${ln}${lb}</svg>`;
}
function woundSvg(w, i = 0) {   // ilustración clínica de la úlcera (no es una foto real)
  const rx = 18 + w.l * 9, ry = 12 + w.a * 8, g = w.gr / 100;
  return `<svg viewBox="0 0 160 120" class="wsvg"><defs><radialGradient id="sk${i}" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#E8C2A4"/><stop offset="1" stop-color="#D4A585"/></radialGradient><radialGradient id="wd${i}" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#C9586B"/><stop offset="${g}" stop-color="#D86F7E"/><stop offset="1" stop-color="#E3C47A"/></radialGradient></defs>
  <rect width="160" height="120" fill="url(#sk${i})"/><ellipse cx="80" cy="58" rx="${rx + 6}" ry="${ry + 5}" fill="#D99A8E" opacity=".45"/><ellipse cx="80" cy="58" rx="${rx}" ry="${ry}" fill="url(#wd${i})"/>
  ${[...Array(9)].map((_, j) => `<circle cx="${80 + Math.cos(j * 2.1) * rx * .5}" cy="${58 + Math.sin(j * 2.1) * ry * .45}" r="2.2" fill="#B84A5E" opacity=".7"/>`).join('')}
  <g stroke="#fff" stroke-width="1"><line x1="12" y1="108" x2="72" y2="108"/>${[0, 1, 2, 3, 4, 5].map(j => `<line x1="${12 + j * 12}" y1="${j % 5 ? 105 : 102}" x2="${12 + j * 12}" y2="108"/>`).join('')}</g><text x="76" y="111" fill="#fff" font-size="9" font-weight="600">5 cm</text></svg>`;
}
const wPhoto = (w, i, big) => `<button class="wph ${big ? 'big' : ''} ${S.phView ? '' : 'blur'}" data-act="phView">${woundSvg(w, i)}${S.phView ? '' : `<span class="wlock">${ic('eye-slash')}<span>Foto clínica · toca para ver</span></span>`}<span class="wd">${w.d}</span></button>`;

/* ---------- piezas ---------- */
/* ---------- posología: dosis · vía · cada X h · horarios · duración · indicado por ---------- */
const FRQ = [4, 6, 8, 12, 24, 48, 'SOS'];
const frqTxt = f => f === 'SOS' ? 'SOS' : `cada ${f} h`;
const autoHrs = (h0, f) => { if (f === 'SOS' || !f) return []; if (f >= 24) return [h0]; const b = +h0.slice(0, 2), out = []; for (let k = 0; k < 24 / f; k++) out.push(String((b + k * f) % 24).padStart(2, '0') + ':00'); return out.sort(); };
const medProg = m => m.dt ? `<div class="mprog"><span class="pbar"><i style="width:${Math.round(m.dn / m.dt * 100)}%"></i></span><span class="xs t2">${m.du === 'días' ? `Día ${m.dn} de ${m.dt}` : `${m.dn} de ${m.dt} dosis aplicadas`}</span></div>${m.nx ? `<div class="xs t2 mt4">Próxima dosis: <b>${m.nx}</b></div>` : ''}` : '';
const medCard = (m, o = {}) => `<div class="medp${o.c ? ' c' : ''}"><span class="ri box">${ic(m.v === 'oral' ? 'pill' : 'syringe')}</span><div class="tx">
  <div class="mh"><b>${m.n}</b><span class="frq${m.f === 'SOS' ? ' sos' : ''}">${frqTxt(m.f)}</span></div>
  <div class="sm t2">${m.d} · ${m.v} · ${m.dur.toLowerCase()}${m.x && !o.c ? ' · ' + m.x.toLowerCase() : ''}</div>
  <div class="hrs">${m.f === 'SOS' ? `<span class="sosx">${ic('info')}${m.sos}</span>` : m.at.map(h => `<span>${ic('clock')}${h}</span>`).join('') + (m.f === 48 ? '<em>día por medio</em>' : '')}</div>
  ${medProg(m)}${o.c ? '' : `<div class="xs t3 mt4">Indicado por ${m.by}</div>`}</div></div>`;
const medList = (l, o) => l.length ? `<div class="medl">${l.map(m => medCard(m, o)).join('')}</div>` : '<div class="sm t2">No toma remedios de forma permanente.</div>';
const famHead = (f = FM()) => `<div class="fhead">${av(f.i, 'l')}<div><div class="h-l">${f.c} ${f.n.split(' ')[1]}</div><div class="t2 sm mt4">${f.e} años · ${f.r} · ficha de salud</div></div></div>`;
const pinAl = (f = FM()) => `<div class="pinal ${f.al[0].startsWith('Sin') ? 'ok' : ''}">${ic(f.al[0].startsWith('Sin') ? 'check-circle' : 'warning', 1)}<div><div class="xs">${ic('push-pin', 1)}Alergias · siempre visible</div><b>${f.al.join(', ')}</b></div></div>`;
const scale = (n, v, max, txt, d) => `<div class="scl"><div class="scl-h"><span>${n}</span><b class="num">${v}<small>/${max}</small></b></div><div class="bar"><span style="width:${v / max * 100}%"></span></div><div class="xs t2 mt4">${txt} · ${d}</div></div>`;
const barTxt = v => v >= 100 ? 'Independiente' : v >= 60 ? 'Dependencia leve' : v >= 40 ? 'Dependencia moderada' : v >= 20 ? 'Dependencia severa' : 'Dependencia total';
const bradTxt = v => v >= 19 ? 'Sin riesgo de escaras' : v >= 15 ? 'Riesgo bajo de escaras' : v >= 13 ? 'Riesgo moderado' : 'Riesgo alto';
const tlItem = (e, pro) => `<button class="tli" data-go="${pro ? (e.go === 'P53' ? 'R32' : e.go === 'P15' ? 'R18' : e.go === 'R36' ? 'R36' : 'R37') : e.go}"><span class="tl-dot ${e.t}">${ic(TLT[e.t][1])}</span><span class="tx"><span class="xs t2">${e.d}${e.today ? ' · <b class="acc">Nueva</b>' : ''}</span><span class="a">${e.a}</span><span class="b">${e.b}</span>${e.pro ? `<span class="tl-by">${av(e.pro.toUpperCase(), 'xs')}${proById(e.pro).n} · ${proById(e.pro).t}</span>` : ''}</span>${ic('caret-right')}</button>`;
const vitGrid = (x = true) => `<div class="vgrid">${[['PA', '132/80', 'mmHg', 'heartbeat'], ['FC', '76', 'lpm', 'heart'], ['T°', '36,6', '°C', 'thermometer-simple'], ['Sat O₂', '96', '%', 'drop'], ['Glicemia', '142', 'mg/dL', 'drop-half'], ['Dolor', '2', '/10', 'smiley-meh']].map(v => `<div class="vg"><span class="xs t2">${ic(v[3])}${v[0]}</span><b class="num">${v[1]}<small>${v[2]}</small></b></div>`).join('')}</div>${x ? '<div class="xs t2 mt8">Glicemia sobre 130 en ayunas: se le avisa a Daniela en las recomendaciones.</div>' : ''}`;
const REC = { a: 'Mantén la pierna en alto 20 minutos, 3 veces al día.', b: 'No mojes el apósito. Para ducharte, cúbrelo con una bolsa.', c: 'Camina 15 minutos en la mañana y en la tarde, con el bastón.' };
const ALR = { a: 'Fiebre de 38 °C o más.', b: 'Más dolor, mal olor o pus en la herida.', c: 'Enrojecimiento o hinchazón que se extiende por la pierna.' };
const PROX = { 2: 'mié 28 oct · curación y 3ª dosis', 3: 'vie 30 oct · curación', 7: 'lun 2 nov · control semanal' };

/* ---------- paciente: fichas ---------- */
def({ id: 'P50', name: 'Fichas de salud', kind: 'page', back: true, title: 'Fichas de salud', next: ['P51', 'P57'],
  body: () => `<div class="t2 sm">Una ficha por persona. La escriben las profesionales después de cada visita y tú decides quién la ve.</div>
  <div class="mt16">${S.mem.map(k => { const f = FAM[k]; return `<button class="famc" data-act="fm" data-arg="${k}" data-go="P51">${av(f.i, '')}<span class="tx"><span class="a">${f.c} ${f.n.split(' ')[1]} · ${f.r}</span><span class="b">${f.al[0].startsWith('Sin') ? f.dx[0] : 'Alergia a ' + f.al[0].toLowerCase()}</span><span class="xs t2">${k === 'mama' ? '9 registros · última nota hoy' : k === 'papa' ? '3 registros · última nota 21 oct' : 'Sin registros todavía'} · ${f.e} años</span></span>${k === 'mama' ? `<span class="st inf">Nueva nota</span>` : ic('caret-right')}</button>`; }).join('')}</div>
  ${row('box:plus', 'Agregar integrante', 'Nombre, RUT, nacimiento, sexo y previsión', 'P57', '', '', 'nmNew', '')}
  <div class="mt16">${note('lock-simple', 'Tus fichas son privadas. Cada vez que una profesional la abre, queda registrado en «Quién vio la ficha».')}</div>` });

def({ id: 'P51', name: 'Ficha de salud', kind: 'page', back: true, title: '', next: ['P52', 'P53', 'P54', 'P55', 'P56'],
  body: () => { const f = FM(), m = S.fm === 'mama'; return `${famHead(f)}<div class="mt8">${row('box:identification-badge', 'Datos, antecedentes y peso', f.e + ' años · ' + (f.sx === 'F' ? 'mujer' : 'hombre'), 'P96', '', '', 'msFm', S.fm)}</div><div class="mt16">${pinAl(f)}</div>${S.pv[S.fm] ? `<div class="mt8">${row('box:shield-check', 'Previsión de salud', pvTxt(S.fm) + ' · RUT ' + RUTS[S.fm], 'P64', '<span class="lk">Cambiar</span>', '', 'pvFor', S.fm)}</div>` : ''}
  ${m ? `<button class="lastn mt12" data-go="P58">${av('CR', 's')}<span class="tx"><span class="xs t2">Última nota · hoy 08:41</span><span class="a">Camila dejó el resumen de la visita</span><span class="b">Herida 3,2 × 2,1 cm, mejor que el 24 oct</span></span>${ic('caret-right')}</button>` : ''}
  <div class="lbl2">Diagnósticos</div><div class="chips">${f.dx.map(x => `<span class="chip">${x}</span>`).join('')}</div>
  <div class="lbl2">Medicamentos que toma</div>${medList(f.meds)}
  <div class="lbl2">Dispositivos y ayudas</div><div class="chips">${f.dev.length ? f.dev.map(x => `<span class="chip">${x}</span>`).join('') : '<span class="sm t2">Ninguno</span>'}</div>
  <div class="lbl2">Escalas</div><div class="scls">${scale('Barthel', f.barthel, 100, barTxt(f.barthel), m ? 'hoy, Camila' : '21 oct')}${scale('Braden', f.braden, 23, bradTxt(f.braden), m ? 'hoy, Camila' : '21 oct')}</div>
  <div class="lbl2">Exámenes</div>${RES[S.fm] ? `${row('box:chart-line-up', 'Resultados y biomarcadores', '24 oct · datos de ejemplo', 'P70', '', '', 'msFm', S.fm)}${row('box:bell-ringing', 'Controles', 'Próximo: hemoglobina glicosilada · 24 ene', 'P77')}` : row('box:chart-line-up', 'Resultados y biomarcadores', 'Aún no hay exámenes', 'P74', '<span class="lk">Ver packs</span>')}
  <div class="lbl2">Historial</div>
  ${row('box:list', 'Línea de tiempo', m ? '9 registros desde el 4 oct' : 'Visitas, remedios y documentos', 'P52')}
  ${m ? row('box:bandaids', 'Evolución de la herida', 'Úlcera venosa · −51% de área en 11 días', 'P53') : ''}
  ${row('box:heartbeat', 'Signos vitales', m ? 'Presión y glicemia bajando' : 'Presión y pulso', 'P54')}
  <div class="lbl2">Privacidad</div>
  ${row('box:eye', 'Quién vio la ficha', m ? '3 profesionales · último acceso hoy 08:41' : 'Registro de accesos', 'P55')}
  ${row('box:lock-simple', 'Accesos y consentimiento', SHARE[S.share][0] + ' por defecto', 'P56')}
  ${row('box:file-pdf', 'Ficha en PDF', 'Para llevarla al médico', 'P59')}`; } });

def({ id: 'P52', name: 'Línea de tiempo', kind: 'page', back: true, title: 'Línea de tiempo',
  body: () => { const l = S.fm === 'mama' ? TL : TL.slice(5, 6).map(e => ({ ...e, a: 'Receta · Dra. Marcela Ortiz', b: 'Enoxaparina 40 mg SC al día, 21 días' })); const fl = l.filter(e => S.tlF === 'all' || e.t === S.tlF);
    return `<div class="t2 sm">${FM().c} · todo lo que han hecho las profesionales, en orden.</div><div class="chips scrollx mt12">${Object.keys(TLT).map(k => chip(TLT[k][0], S.tlF === k, 'tlF', k)).join('')}</div>
    <div class="tl mt16">${fl.length ? fl.map(e => tlItem(e)).join('') : `<div class="empty">${ic('funnel')}<div class="sm t2 mt8">No hay registros de este tipo.</div><button class="lk mt8" data-act="tlF" data-arg="all">Ver todo</button></div>`}</div>`; } });

def({ id: 'P53', name: 'Evolución de la herida', kind: 'page', back: true, title: 'Evolución de la herida',
  body: () => { const w = WOUND, a = w.map(x => +(x.l * x.a * .785).toFixed(1)); return `<div class="hid">${st('inf', 'H1', 'bandaids')}<div><b>Úlcera venosa · pierna izquierda</b><div class="xs t2">Cara interna del tobillo · desde el 15 oct</div></div></div>
  <div class="wbig mt12">${wPhoto(w[w.length - 1], 9, true)}</div>
  <div class="wstrip mt8">${w.map((x, i) => wPhoto(x, i)).join('')}</div>
  <div class="xs t2 mt8">${ic('lock-simple')} Fotos con consentimiento de Daniela. Solo las ven ella y quienes autorice.</div>
  <div class="lbl2">Área de la herida (cm²)</div>${chart([{ v: a, c: '#7A7CF0' }], w.map(x => x.d), 0, 12, null, 'cm²')}
  <div class="kpi mt8"><b class="num">−${Math.round((1 - a[a.length - 1] / a[0]) * 100)}%</b><span class="sm t2">de área desde la primera curación</span></div>
  <div class="lbl2">Evaluaciones</div><div class="wtab"><table><tr><th>Fecha</th><th>Medidas</th><th>Lecho</th><th>Exudado</th></tr>${w.slice().reverse().map(x => `<tr><td>${x.d}<div class="xs t2">${first(proById(x.pro))}</div></td><td class="num">${String(x.l).replace('.', ',')} × ${String(x.a).replace('.', ',')}<div class="xs t2">prof. ${String(x.p).replace('.', ',')}</div></td><td>${x.gr}% granulatorio<div class="xs t2">${x.es}% esfacelo</div></td><td>${x.ex}<div class="xs t2">Piel ${x.pi.toLowerCase()}</div></td></tr>`).join('')}</table></div>` } });

def({ id: 'P54', name: 'Signos vitales', kind: 'page', back: true, title: 'Signos vitales',
  body: () => `<div class="t2 sm">${FM().c} · medidos por las profesionales en cada visita.</div>
  <div class="vhead mt16"><div><span class="xs t2">Presión arterial · hoy</span><b class="num">132/80</b></div>${st('ok', 'Bajando', 'trend-down')}</div>
  ${chart([{ v: VIT.pas, c: '#7A7CF0' }, { v: VIT.pad, c: '#B9B4F5' }], VIT.d, 70, 160, [70, 130], 'mmHg')}<div class="leg"><span><i style="background:#7A7CF0"></i>Sistólica</span><span><i style="background:#B9B4F5"></i>Diastólica</span><span><i class="bd"></i>Rango meta</span></div>
  <div class="vhead mt24"><div><span class="xs t2">Glicemia · hoy</span><b class="num">142 <small>mg/dL</small></b></div>${st('warn', 'Sobre la meta', 'warning')}</div>
  ${chart([{ v: VIT.glu, c: '#7A7CF0' }], VIT.d, 80, 180, [80, 130], 'mg/dL')}
  <div class="vhead mt24"><div><span class="xs t2">Saturación de oxígeno · hoy</span><b class="num">96%</b></div>${st('ok', 'Normal', 'check-circle')}</div>
  ${chart([{ v: VIT.sat, c: '#7A7CF0' }], VIT.d, 90, 100, [94, 100], '%')}
  <div class="mt16">${note('info', 'Estos datos no reemplazan el control con el médico. Puedes descargarlos en PDF y llevarlos a la consulta.')}</div>`,
  foot: () => abtn(ic('download-simple') + 'Descargar en PDF', 'pdf', '', 'sec') });

def({ id: 'P55', name: 'Quién vio la ficha', kind: 'page', back: true, title: 'Quién vio la ficha',
  body: () => `<div class="t2 sm">Cada acceso a la ficha de ${FM().c} queda registrado y no se puede borrar.</div>
  <div class="mt16">${SEEN.map(x => `<div class="row seen">${x[0] ? av(x[0].toUpperCase(), 's') : x[3] === 'Soporte' ? `<span class="ri box">${ic('lifebuoy')}</span>` : av('DF', 's')}<span class="tx"><div class="a">${x[0] ? proById(x[0]).n : x[3] === 'Soporte' ? 'Cuidapp' : 'Tú'}</div><div class="b">${x[1]}</div><div class="xs t3">${x[2]}</div></span>${x[3] && x[3] !== 'Soporte' ? `<span class="st inf">${x[3]}</span>` : ''}</div>`).join('')}</div>
  <div class="mt16">${note('warning', '¿Ves un acceso que no reconoces? Revócalo y avísanos. Lo revisamos en menos de 24 horas.', 'warn')}</div>`,
  foot: () => `${btn('Revisar accesos', 'P56', 'sec')}` });

def({ id: 'P56', name: 'Accesos y consentimiento', kind: 'page', back: true, title: 'Accesos y consentimiento',
  body: () => `<div class="lbl2" style="margin-top:0">Quién tiene acceso ahora</div>
  ${[['cr', 'Hasta el 2 nov · cita del mié 28 oct', 'Solo resumen'], ['vm', 'Hasta el 29 oct', 'Todo'], ['pg', 'Terminó el 26 oct', 'Solo resumen']].map(x => `<div class="row">${av(x[0].toUpperCase(), 's')}<span class="tx"><div class="a">${proById(x[0]).n}</div><div class="b">${S.rev && S.rev[x[0]] ? 'Acceso revocado' : x[2] + ' · ' + x[1]}</div></span>${S.rev && S.rev[x[0]] ? st('neu', 'Revocado', '') : `<button class="lk" data-act="revoke" data-arg="${x[0]}" style="color:var(--danger)">Revocar</button>`}</div>`).join('')}
  <div class="lbl2">Al agendar, compartir por defecto</div>${Object.keys(SHARE).map(k => radioRow(SHARE[k][0], SHARE[k][1], S.share === k, 'set', 'share=' + k)).join('')}
  <button class="row" data-act="tog" data-arg="sharePh"><span class="tx"><div class="a">Fotos de heridas</div><div class="b">Se piden aparte, en cada cita</div></span><span class="tog ${S.sharePh ? 'on' : ''}"></span></button>
  <div class="mt16 col8">${note('shield-check', 'La profesional solo ve la ficha desde 24 horas antes de la cita y hasta 7 días después. Las alergias siempre se muestran.')}${note('archive', 'La ley obliga a guardar la ficha clínica al menos 15 años. Si revocas, nadie más la ve, pero las notas firmadas se conservan.')}</div>
  <button class="btn ghost mt8" style="color:var(--danger)" data-act="revokeAll">Revocar todos los accesos</button>` });

def({ id: 'P58', name: 'Resumen de la visita', kind: 'page', back: true, title: 'Resumen de la visita', next: ['P51'],
  body: () => `<div class="sgn">${av('CR', '')}<div><div class="b-m">Camila Rojas · Enfermera</div><div class="xs t2">${ic('seal-check', 1)} Firmado hoy 08:41 · Reg. SIS 482.317</div></div></div>
  <div class="t2 sm mt12">Rosa Muñoz · llegó 08:02 y se fue 08:41</div>
  <div class="lbl2">Qué hacer en casa</div><div class="recs">${Object.keys(REC).filter(k => S.note.rec[k]).map(k => `<div>${ic('check-circle', 1)}<span>${REC[k]}</span></div>`).join('')}</div>
  <div class="alarm mt12"><div class="b-m">${ic('warning', 1)}Llama o consulta en urgencias si:</div>${Object.keys(ALR).filter(k => S.note.al[k]).map(k => `<div>· ${ALR[k]}</div>`).join('')}<div class="xs mt8">Salud Responde: 600 360 7777 · SAMU: 131</div></div>
  <div class="lbl2">Próximo control</div>${row('box:calendar-check', PROX[S.note.prox], 'Camila ya dejó la hora reservada', 'P26')}
  <div class="lbl2">Lo que hizo Camila</div>
  <div class="vrow">${ic('syringe')}<div><b>Inyección intramuscular</b><div class="sm t2">Neurobionta 5.000 · 2ª de 3 dosis · glúteo derecho. Sin reacción a los 15 min.</div></div></div>
  <div class="vrow">${ic('bandaids')}<div><b>Curación de la úlcera</b><div class="sm t2">3,2 × 2,1 cm, más chica que el 24 oct (3,5 × 2,3). Lecho rosado y limpio. Apósito de espuma.</div></div></div>
  <div class="lbl2">Signos vitales</div>${vitGrid()}
  <div class="lbl2">Medicamentos de Rosa</div><div class="xs t2" style="margin:-4px 0 8px">Sin cambios en esta visita. Así le toca cada uno:</div>${medList(FAM.mama.meds)}
  ${S.note.add ? `<div class="lbl2">Addendum</div><div class="note">${ic('note-pencil')}<div><b>Hoy 09:15 · Camila</b><br>Daniela avisó que Rosa ya tomó el losartán. Sin cambios en las indicaciones.</div></div>` : ''}
  <div class="mt16">${note('lock-simple', 'La nota firmada no se puede editar. Si algo cambia, la profesional agrega un addendum con fecha y hora.')}</div>`,
  foot: () => `${btn('Ver ficha de Rosa', 'P51', '', 'data-act="fm" data-arg="mama"')}<div class="row8"><button class="btn sec" data-go="P59">${ic('file-pdf')}PDF</button><button class="btn sec" data-go="P22">${ic('chat-circle')}Preguntar</button></div>` });

/* ---------- profesional: antes y durante la visita ---------- */
def({ id: 'R37', name: 'Resumen antes de la visita', kind: 'page', back: true, title: 'Resumen de la paciente', next: ['R38'],
  body: () => `${famHead(FAM.mama)}<div class="mt8">${st('inf', 'Daniela compartió: ' + SHARE[S.share][0].toLowerCase(), 'lock-simple')}</div><div class="mt12">${pinAl(FAM.mama)}</div>
  <div class="lbl2">Diagnósticos</div><div class="chips">${FAM.mama.dx.map(x => `<span class="chip">${x}</span>`).join('')}</div>
  <div class="lbl2">Medicamentos</div>${medList(FAM.mama.meds, { c: 1 })}
  <div class="lbl2">Funcionalidad</div><div class="scls">${scale('Barthel', 75, 100, barTxt(75), '24 oct')}${scale('Braden', 17, 23, bradTxt(17), '24 oct')}</div>
  <div class="lbl2">Exámenes recientes</div>${S.shr.cr ? `<div class="note">${ic('chart-line-up')}<div>Hemoglobina glicosilada 7,8 % (sobre el rango del laboratorio) · 24 oct<br>Vitamina D 18 ng/mL (bajo el rango del laboratorio) · 24 oct</div></div>` : '<div class="sm t2">Daniela no compartió exámenes contigo.</div>'}
  <div class="lbl2">Última nota · 24 oct · Camila (tú)</div><div class="note">${ic('note')}<div>Úlcera venosa 3,5 × 2,3 cm, lecho 75% granulatorio, exudado escaso. Espuma con borde. Revisar glicemia: 151 mg/dL.</div></div>
  <div class="lbl2">Dispositivos</div><div class="chips">${FAM.mama.dev.map(x => `<span class="chip">${x}</span>`).join('')}</div>
  <div class="mt16">${note('clock', 'Ves este resumen desde 24 horas antes de la cita. El historial completo solo si Daniela lo autoriza.')}</div>`,
  foot: () => btn(ic('list') + 'Ver historial', 'R38', 'sec') });

def({ id: 'R38', name: 'Historial de la paciente', kind: 'page', back: true, title: 'Historial de Rosa',
  body: () => { const full = S.share === 'todo'; return `<div class="mt4">${pinAl(FAM.mama)}</div><div class="mt12">${st(full ? 'ok' : 'inf', full ? 'Acceso completo hasta el 2 nov' : 'Solo resumen · últimas 2 notas', 'lock-simple')}</div>
  <div class="lbl2">Medicamentos vigentes</div>${medList(FAM.mama.meds, { c: 1 })}<div class="lbl2">Registros</div><div class="tl">${(full ? TL : TL.slice(2, 4)).map(e => tlItem(e, true)).join('')}</div>
  ${full ? '' : `<div class="lockd mt12">${ic('lock-simple')}<div><b>7 registros más</b><div class="sm t2">Daniela compartió solo el resumen. Puedes pedirle acceso al historial.</div></div></div>`}
  <div class="mt16">${note('eye', 'Este acceso queda registrado en la ficha y Daniela lo puede ver.')}</div>`; },
  foot: () => S.share === 'todo' ? btn('Volver a la atención', 'back') : `${abtn('Pedir acceso completo', 'askAcc', '', 'sec')}` });

/* ---------- profesional: nota de la visita ---------- */
const nStep = n => `<div class="nsteps">${['Visita', 'Procedimientos', 'Indicaciones', 'Firma'].map((t, i) => `<span class="${i < n ? 'done' : i === n ? 'on' : ''}">${t}</span>`).join('')}</div>`;
def({ id: 'R31', name: 'Nota de la visita', kind: 'page', back: true, title: 'Nota de la visita', next: ['R32', 'R33', 'R34', 'R36', 'R35'],
  body: () => `${nStep(0)}${row('box:test-tube', 'Entregar muestra en laboratorio', S.mue.done ? 'Entregada · LabAndes Clínico' : 'Toma de hoy · LabAndes Clínico · hasta 12:00', 'R42', S.mue.done ? st('ok', 'Entregada') : st('warn', 'Pendiente'))}<button class="dictar mt16" data-act="dictStart" data-arg="all" data-go="R40"><span class="dm">${ic('microphone', 1)}</span><span class="tx"><b>Dictar nota</b><span>Cuéntala con tu voz. La ordenamos y tú la revisas.</span></span>${ic('caret-right')}</button>
  ${S.vz && S.vz.done ? `<div class="mt8">${st('ok', 'Nota completada desde tu dictado', 'microphone')}</div>` : ''}<div class="nmeta mt16">${kv('Llegada', S.note.hin + ' · con el código de Daniela')}${kv('Salida', S.note.hout + ' · al terminar')}</div>
  <div class="lbl2 lmic">Resumen para la familia<button class="micb" data-act="dictStart" data-arg="res" data-go="R40" aria-label="Dictar">${ic('microphone')}</button></div><div class="field area"><span>Rosa está más animada. La herida se ve más chica y limpia. Inyección sin problemas.</span></div><div class="xs t2 mt4">Escríbelo simple: es lo primero que lee Daniela.</div>
  <div class="lbl2 lmic">Signos vitales<button class="micb" data-act="dictStart" data-arg="sv" data-go="R40" aria-label="Dictar">${ic('microphone')}</button></div>${vitGrid(false)}<button class="lk sm mt8" data-act="toast" data-arg="Signos vitales actualizados.">${ic('pencil-simple')}Editar</button>
  <div class="lbl2 lmic">Procedimientos<button class="micb" data-act="dictStart" data-arg="proc" data-go="R40" aria-label="Dictar">${ic('microphone')}</button></div>
  ${row('box:bandaids', 'Curación · plantilla', 'Herida H1 · medidas, lecho, exudado y foto', 'R32', st('ok', 'Completa'))}
  ${row('box:pill', 'Medicamentos · 5 correctos', 'Neurobionta 5.000 IM', 'R33', st('ok', 'Completa'))}
  ${row('box:moon', 'Bitácora de turno', 'Para turnos de TENS y cuidadoras', 'R36')}
  ${row('box:plus', 'Otra plantilla', 'Sonda, ostomía, paliativos, valoración', '', ic('caret-right'), '', 'toast', 'Plantillas: sonda Foley, ostomía, traqueostomía, paliativos y valoración geriátrica.')}
  ${S.shr.cr ? `<div class="lbl2">Resultados de exámenes</div>${checkRow('Educación entregada sobre el resultado', S.eduRes, 'tog', 'eduRes', 'Explicaste qué mide y que lo converse con su médico. Sin interpretar.')}` : ''}
  <div class="lbl2">Escalas</div><div class="scls">${scale('Barthel', 75, 100, barTxt(75), 'sin cambios')}${scale('Braden', 17, 23, bradTxt(17), 'sin cambios')}</div>`,
  foot: () => btn('Siguiente: indicaciones', 'R34') });

def({ id: 'R32', name: 'Plantilla de curación', kind: 'page', back: true, title: 'Curación',
  body: () => { const w = WOUND[WOUND.length - 1], p = WOUND[WOUND.length - 2]; return `<div class="lbl2" style="margin-top:0">Herida</div><div class="chips">${chip('H1 · Úlcera venosa, tobillo izq.', true, 'toast', 'Herida H1 seleccionada.')}${chip('+ Nueva herida', false, 'toast', 'Registra ubicación, tipo y fecha de inicio de la nueva herida.')}</div>
  <div class="lbl2">Medidas (cm)</div><div class="m3">${[['Largo', w.l], ['Ancho', w.a], ['Profundidad', w.p]].map(x => `<div class="field"><span class="xs t2">${x[0]}</span><b class="num">${String(x[1]).replace('.', ',')}</b></div>`).join('')}</div>
  <div class="xs t2 mt4">Anterior (24 oct): ${String(p.l).replace('.', ',')} × ${String(p.a).replace('.', ',')} · ${st('ok', '−17% de área', 'trend-down')}</div>
  <div class="lbl2">Lecho de la herida</div>${[['Granulatorio (rojo, sano)', 80], ['Esfacelo (amarillo)', 20], ['Necrótico (negro)', 0]].map(x => `<div class="lech"><span>${x[0]}</span><div class="bar"><span style="width:${x[1]}%"></span></div><b class="num">${x[1]}%</b></div>`).join('')}
  <div class="lbl2">Exudado</div><div class="chips">${['Ninguno', 'Escaso', 'Moderado', 'Abundante'].map(x => chip(x, x === 'Escaso', 'toast', 'Exudado: ' + x.toLowerCase() + '.')).join('')}</div><div class="chips mt8">${['Seroso', 'Hemático', 'Purulento'].map(x => chip(x, x === 'Seroso', 'toast', 'Tipo: ' + x.toLowerCase() + '.')).join('')}</div>
  <div class="lbl2">Piel alrededor</div><div class="chips">${['Sana', 'Macerada', 'Enrojecida', 'Seca'].map(x => chip(x, x === 'Sana', 'toast', 'Piel: ' + x.toLowerCase() + '.')).join('')}</div>
  <div class="lbl2">Apósito</div>${field('bandaids', 'Limpieza con suero fisiológico + espuma con borde')}
  <div class="lbl2">Foto</div>${S.sharePh ? `<div class="wbig">${wPhoto(w, 8, true)}</div>${st('ok', 'Daniela autorizó fotos en esta cita', 'check-circle')}` : `<div class="lockd">${ic('camera-slash')}<div><b>Sin permiso para fotos</b><div class="sm t2">Daniela no autorizó fotos en esta cita. Pídeselo antes de tomarla.</div></div></div><button class="btn sec mt8" data-act="tog" data-arg="sharePh">${ic('camera')}Daniela autorizó en persona</button>`}`; },
  foot: () => btn('Guardar curación', 'back') });

def({ id: 'R33', name: 'Medicamentos · 5 correctos', kind: 'page', back: true, title: 'Medicamento',
  body: () => { const n = S.note, f = n.frq, hs = autoHrs(n.h0, f); return `<div class="medc">${ic('syringe')}<div><b>Neurobionta 5.000</b><div class="sm t2">1 ampolla · intramuscular · dosis 2 de 3</div></div></div>
  <div class="lbl2">Indicación</div>
  <div class="m2">${field('', '1 ampolla (3 ml)')}${field('', 'Intramuscular')}</div>
  <div class="lbl2 req">Cada cuántas horas <span class="xs t2">obligatorio</span></div>
  <div class="chips frqp">${FRQ.map(x => chip(x === 'SOS' ? 'SOS' : x + ' h', f === x, 'nset', 'frq=' + x)).join('')}</div>
  ${f ? '' : `<div class="xs t2 mt4">${ic('file-text')} La receta dice: cada 48 h, 3 dosis</div>`}
  ${f && f !== 'SOS' ? `<div class="lbl2">Primera hora</div><div class="chips">${['08:00', '09:00', '18:00', '20:00'].map(h => chip(h, n.h0 === h, 'nset', 'h0=' + h)).join('')}</div>
  <div class="hrsbox mt12"><div class="xs t2">Horarios que verá la familia</div><div class="hrs big">${hs.map(h => `<span>${ic('clock')}${h}</span>`).join('')}${f === 48 ? '<em>día por medio</em>' : ''}</div></div>` : f === 'SOS' ? `<div class="mt12">${field('info', 'Si hay dolor · mínimo cada 8 h · máximo 3 al día')}</div>` : ''}
  <div class="lbl2">Duración</div><div class="chips">${['3 dosis', '7 días', 'Permanente'].map(d => chip(d, n.dur === d, 'nset', 'dur=' + d)).join('')}</div>
  <div class="xs t2 mt8">Indicado por Dr. Andrés Valenzuela · receta del 20 oct</div>
  <div class="lbl2">Los 5 correctos</div>
  ${[['pac', 'Paciente correcto', 'Rosa Muñoz Pérez · RUT revisado'], ['med', 'Medicamento correcto', 'Coincide con la receta del Dr. Valenzuela'], ['dos', 'Dosis correcta', '1 ampolla de 3 ml'], ['via', 'Vía correcta', 'Intramuscular · glúteo derecho'], ['hor', 'Hora correcta', 'Cada 48 h · 1ª dosis sáb 24 oct 08:00 · hoy 08:10']].map(x => checkRow(x[1], S.note.med5[x[0]], 'ntog', 'med5.' + x[0], x[2])).join('')}
  <div class="lbl2">Lote y vencimiento</div><div class="m2">${field('', 'L-24K118')}${field('', '08/2027')}</div>
  <div class="lbl2">Después de inyectar</div>${field('check-circle', 'Sin reacción a los 15 minutos')}
  <div class="mt12">${note('warning', '<b>Alergia a penicilina.</b> Este medicamento no la contiene.', 'warn')}</div>`; },
  foot: () => abtn(S.note.frq ? 'Guardar' : 'Elige cada cuántas horas', 'toast', 'Medicamento registrado.', '', 'back', !S.note.frq || !Object.values(S.note.med5).every(Boolean)) });

def({ id: 'R34', name: 'Indicaciones para la familia', kind: 'page', back: true, title: 'Indicaciones',
  body: () => `${nStep(2)}<div class="lbl2">Recomendaciones de cuidado</div>${Object.keys(REC).map(k => checkRow(REC[k], S.note.rec[k], 'ntog', 'rec.' + k)).join('')}
  ${row('box:plus', 'Escribir otra', 'O elegir de la plantilla de úlcera venosa', '', ic('caret-right'), '', 'toast', 'Plantilla: elevar piernas, medias de compresión si el médico las indica, hidratar la piel.')}
  <div class="lbl2">Señales de alarma</div>${Object.keys(ALR).map(k => checkRow(ALR[k], S.note.al[k], 'ntog', 'al.' + k)).join('')}
  <div class="lbl2">Próximo control</div><div class="chips">${[[2, '48 horas'], [3, '3 días'], [7, '1 semana']].map(x => chip(x[1], S.note.prox === x[0], 'nset', 'prox=' + x[0])).join('')}</div><div class="xs t2 mt4">${PROX[S.note.prox]}. Le proponemos la hora a Daniela.</div>`,
  foot: () => btn('Revisar y firmar', 'R35') });

def({ id: 'R35', name: 'Revisar y firmar', kind: 'page', back: true, title: 'Revisar y firmar', next: ['R39'],
  body: () => `${nStep(3)}<div class="t2 sm mt16">Así la verá Daniela en la ficha de Rosa:</div>
  <div class="prev mt8"><div class="b-m">Rosa está más animada. La herida se ve más chica y limpia.</div>
  ${kv('Visita', `${S.note.hin} a ${S.note.hout}`)}${kv('Procedimientos', 'Inyección IM · curación')}${kv('Signos vitales', 'PA 132/80 · Glicemia 142')}${kv('Recomendaciones', Object.values(S.note.rec).filter(Boolean).length)}${kv('Señales de alarma', Object.values(S.note.al).filter(Boolean).length)}${kv('Próximo control', PROX[S.note.prox].split(' · ')[0])}${kv('Foto de la herida', S.sharePh ? 'Sí, con permiso' : 'No')}</div>
  ${S.vz && S.vz.done ? `<div class="mt12">${note('microphone', 'Creada desde tu dictado y revisada por ti. ' + (S.vz.keep ? 'El audio queda guardado en la ficha.' : 'El audio ya se borró.'))}</div>` : ''}<div class="mt16">${note('lock-simple', 'Al firmar, la nota queda en la ficha con tu nombre y registro SIS, y ya no se puede editar. Si algo cambia, agregas un addendum.')}</div>`,
  foot: () => abtn(ic('signature') + 'Firmar nota', 'sign', '', '', 'R39') });

def({ id: 'R39', name: 'Nota firmada', kind: 'page', title: '', next: ['R22'],
  body: () => `<div class="okc mt24">${ic('seal-check', 1)}</div><div class="h-l mt16">Nota firmada</div><div class="t2 mt8">Quedó en la ficha de Rosa. La próxima profesional verá lo que hiciste hoy.</div>
  <div class="lbl2">Le llegó a Daniela</div><div class="push"><div class="push-h"><img src="logo/apple-touch-icon.png" alt=""><span>Cuidapp</span><span class="t3">ahora</span></div><b>Camila dejó el resumen de la visita de hoy</b><div>Rosa · inyección y curación. Toca para ver qué hacer en casa.</div></div>
  <div class="mt16">${row('box:note-pencil', 'Agregar addendum', S.note.add ? 'Agregado hoy 09:15' : 'Si olvidaste algo o algo cambió', '', S.note.add ? st('ok', 'Listo') : ic('caret-right'), '', 'addend', '')}</div>`,
  foot: () => btn('Continuar', 'R22') });

def({ id: 'R36', name: 'Bitácora de turno', kind: 'page', back: true, title: 'Bitácora del turno',
  body: () => `<div class="t2 sm">Turno de noche · 20:00 a 08:00 · Rosa Muñoz</div><div class="mt8">${st('inf', 'Recibido de Ximena Vera a las 20:00', 'hand-arrow-down')}</div>
  <div class="bit mt16">${[['20:00', 'Recibe turno', 'Ximena: cenó bien, glicemia 138, losartán tomado.'], ['22:00', 'Cambio de posición', 'Lado izquierdo. Piel de talones sana.'], ['00:30', 'Baño y pañal', 'Diuresis 300 ml, orina clara.'], ['02:00', 'Cambio de posición', 'Despierta, toma agua, vuelve a dormir.'], ['04:00', 'Cambio de posición', 'Lado derecho. Tranquila.'], ['06:00', 'Signos vitales', 'PA 128/78 · FC 72 · Sat 95% · Glicemia 118']].slice(0, 4 + S.bit.h).map(x => `<div class="bi"><span class="num">${x[0]}</span><div><b>${x[1]}</b><div class="sm t2">${x[2]}</div></div></div>`).join('')}</div>
  <button class="lk sm mt8" data-act="bitAdd">${ic('plus')}Agregar registro</button>
  <div class="lbl2">Entrega de turno</div><div class="handoff">${kv('Cómo está', 'Estable, durmió 6 h')}${kv('Pendientes', 'Losartán 08:00 · curación jue')}${kv('Alertas', 'Tos leve de noche')}</div>`,
  foot: () => abtn('Entregar turno y firmar', 'handoff', '', '', 'back') });

def({ id: 'P59', name: 'Ficha en PDF', kind: 'page', back: true, title: 'Ficha en PDF',
  body: () => { const p = FM(); return `<div class="t2 sm">Así se ve el PDF que llevas al médico.</div>
  <div class="pdfp mt12"><div class="pdh"><div><b>Ficha de salud · ${p.n}</b><div>${p.e} años · Cuidapp</div></div><div style="text-align:right">26/10/2026</div></div>
  <div class="ps"><b>Alergias:</b> ${p.al.join(', ')}</div><div class="ps"><b>Diagnósticos:</b> ${p.dx.join(' · ')}</div>
  <div class="pt">Medicamentos</div>${p.meds.length ? `<table><tr><th>Medicamento</th><th>Dosis y vía</th><th>Frecuencia</th><th>Horarios</th><th>Duración</th></tr>${p.meds.map(m => `<tr><td><b>${m.n}</b><div>${m.by}</div></td><td>${m.d}<div>${m.v}</div></td><td><b>${m.f === 'SOS' ? 'SOS' : 'Cada ' + m.f + ' h'}</b>${m.f === 'SOS' ? `<div>${m.sos.toLowerCase()}</div>` : ''}</td><td>${m.at.join('<br>') || '—'}</td><td>${m.dur}${m.dt ? `<div>${m.dn}/${m.dt}${m.du === 'días' ? ' días' : ' dosis'}</div>` : ''}</td></tr>`).join('')}</table>` : '<div class="ps">No toma remedios de forma permanente.</div>'}
  <div class="pt">Signos vitales · última visita</div><div class="ps">PA 132/80 mmHg · FC 76 lpm · T° 36,6 °C · Sat O₂ 96% · Glicemia 142 mg/dL</div>
  <div class="pf">Generado por Cuidapp · notas firmadas por profesionales con registro SIS</div></div>`; },
  foot: () => abtn(ic('download-simple') + 'Descargar PDF', 'pdf') });
