/* ===== Profesional ===== */
Object.assign(ACT, {
  doc: k => { S.docs[k] = true; },
  proGo: () => { S.proSt = 'camino'; toast('Listo. Le avisamos a Daniela que vas en camino.'); },
  gmaps: () => { window.open(GMAPS, '_blank', 'noopener'); },
  online: () => { S.online = !S.online; toast(S.online ? 'Listo. Te mostramos a pacientes que piden “lo antes posible” cerca.' : 'Ya no recibes pedidos para hoy. Tu agenda sigue igual.'); },
  key: d => { S.code = String(S.code); if (d === '<') S.code = S.code.slice(0, -1); else if (S.code.length < 4) S.code += d; },
  chk: k => { S.chk[k] = !S.chk[k]; },
  earn: () => { if (!S.paid) { S.earn += net(S.my.iny.p); S.done += 1; S.paid = true; } toast(`Ganaste ${clp(net(S.my.iny.p))}. Ya está en tu Billetera.`); },
  wset: n => { S.wAmt = n === 'all' ? 0 : +n; },
  wdo: () => { const sd = S.earn - S.wd, a = Math.min(S.wAmt || sd, sd); if (a <= 0) return; S.wd += a; S.wdL.unshift(['Hoy ' + new Date().toTimeString().slice(0, 5), a]); S.wAmt = 0; toast(`Retiraste ${clp(a)}. Va a tu cuenta BancoEstado ••••3442.`); },
  prate: n => { S.pRating = +n; },
  ptag: t => { S.pTags[t] = !S.pTags[t]; },
  antec: () => { S.docs.antec = true; toast('Certificado descargado del Registro Civil.'); },
  edit: k => { S.edit = k; },
  svcOn: k => { S.my[k].on = !S.my[k].on; },
  pr: d => { const m = S.my[S.edit], min = S.mins[S.edit]; const v = m.p + (d === '+' ? 500 : -500); if (v < min) { m.p = min; toast(`No puede ser menor al mínimo de Cuidapp: ${clp(min)}.`); } else m.p = v; },
  npr: d => { const m = S.my[S.edit]; m.night = Math.max(m.p, (m.night || m.p) + (d === '+' ? 500 : -500)); },
  nOn: () => { const m = S.my[S.edit]; m.nOn = !m.nOn; if (m.nOn && !m.night) m.night = m.p + 4000; },
  dur: v => { S.my[S.edit].dur = +v; },
  inc: k => { S.my[S.edit].inc[k] = !S.my[S.edit].inc[k]; },
  done: k => { S.setup[k] = true; },
  blk: d => { S.blocked[d] = !S.blocked[d]; },
  req: a => { const [r, v] = a.split(':'); S.req[r] = v; if (v === 'no') toast('Rechazaste la solicitud. Le avisamos a la paciente para que elija otra hora.'); if (v === 'ok') toast('Reserva confirmada. Retuvimos el pago de la paciente.'); },
  publish: () => { Object.keys(S.setup).forEach(k => S.setup[k] = true); toast('Tu perfil ya aparece a pacientes de tus comunas.'); },
});
const docsOk = () => Object.values(S.docs).every(Boolean);
const docRow = (k, i, a, b, go, act) => row('box:' + i, a, S.docs[k] ? b : 'Pendiente', go, S.docs[k] ? st('ok', 'Listo', 'check-circle') : ic('caret-right'), '', act || '', act ? k : '');
const money = n => `<span class="num" style="color:var(--text);font-weight:600">${clp(n)}</span>`;
const mySvcs = () => Object.keys(CAT).filter(k => S.my[k] && CAT[k].who.includes(S.prof));
const TUBE = { 'Tubo lila': '#A78BFA', 'Tubo rojo': '#E5484D', 'Tubo gris': '#9A9AA2', 'Frasco estéril': '#F5C542' };
const COMUNAS = [['Oriente', [['prov', 'Providencia'], ['nun', 'Ñuñoa'], ['lr', 'La Reina'], ['lc', 'Las Condes'], ['vit', 'Vitacura'], ['pen', 'Peñalolén']]], ['Centro y sur', [['stgo', 'Santiago'], ['mac', 'Macul'], ['sjo', 'San Joaquín'], ['flo', 'La Florida']]]];
const comTxt = () => COMUNAS.flatMap(g => g[1]).filter(c => S.com[c[0]]).map(c => c[1]);
const WEEK = [['lun', 'Lunes', '08:00 a 12:00 · 18:00 a 22:00'], ['mar', 'Martes', '08:00 a 12:00 · 18:00 a 22:00'], ['mie', 'Miércoles', '08:00 a 12:00 · 18:00 a 22:00'], ['jue', 'Jueves', '09:00 a 13:00 · 19:00 a 22:00'], ['vie', 'Viernes', '08:00 a 12:00 · 17:00 a 20:00'], ['sab', 'Sábado', '10:00 a 14:00'], ['dom', 'Domingo', '10:00 a 13:00']];

def({ id: 'R01', name: 'Postula como profesional', kind: 'page', noNav: true, back: true,
  body: () => `<div style="padding-top:8px">${logoImg('horizontal-nm', 30)}</div><div class="h-xl mt24">Atiende pacientes a tu manera</div>
  <div class="t2 mt8">Para enfermeras, enfermeros, TENS y cuidadoras. Enfermeras y TENS con registro en la Superintendencia de Salud.</div>
  <div class="mt16">${row('box:currency-circle-dollar', 'Tú pones tus precios', 'Sobre un mínimo por servicio. Cuidapp cobra 15% solo cuando atiendes.', '', '')}
  ${row('box:calendar-blank', 'Tú eliges horarios y comunas', 'Las pacientes agendan solo en tus horas libres', '', '')}
  ${row('box:wallet', 'Tu Billetera en la app', 'Cuidapp cobra a la paciente y abona tu parte. Retiras cuando quieras a tu cuenta.', '', '')}</div>`,
  foot: () => `${btn('Postular', 'R02')}${btn('Ya tengo cuenta', 'R16', 'ghost')}` });

def({ id: 'R02', name: 'Datos de la profesional', kind: 'page', back: true, noNav: true, title: 'Paso 1 de 2',
  body: () => `<div class="h-l">Tus datos</div>${lbl('Nombre completo')}${field('', 'Camila Rojas Vergara')}${lbl('RUT')}${field('', '18.903.442-K')}${lbl('Celular')}${field('', '+56 9 7712 3008')}
  ${lbl('Profesión')}<div class="chips">${chip('Enfermera/o', S.prof === 'enf', 'set', 'prof=enf')}${chip('TENS', S.prof === 'tens', 'set', 'prof=tens')}${chip('Cuidadora', S.prof === 'cuid', 'set', 'prof=cuid')}</div>
  <div class="mt16">${note('lock-simple', 'Tu celular no se muestra a las pacientes hasta que confirmas una reserva.')}</div>`,
  foot: () => btn('Continuar', 'R03') });

def({ id: 'R03', name: 'Documentos', kind: 'page', back: true, noNav: true, title: 'Paso 2 de 2', next: ['R06', 'R48', 'R50'],
  body: () => `<div class="h-l">Sube tus documentos</div><div class="t2 mt8 sm">Los revisamos en menos de 48 horas hábiles.</div>
  <div class="progress mt16"><span style="width:${Math.round(Object.values(S.docs).filter(Boolean).length / Object.keys(S.docs).length * 100)}%"></span></div><div class="mt8">
  ${docRow('carnet', 'identification-card', 'Carnet de identidad', 'Ambos lados', 'R04')}
  ${docRow('selfie', 'user-focus', 'Selfie', 'Para comparar con tu carnet', 'R05')}
  ${S.prof === 'cuid' ? docRow('titulo', 'hand-heart', 'Experiencia y referencias', '6 años · 2 referencias', 'R48') : docRow('titulo', 'graduation-cap', 'Título y registro SIS', 'Registro 482.317', 'R06')}
  ${docRow('antec', 'file-text', 'Certificado de antecedentes', 'Descargado del Registro Civil', '', 'antec')}
  ${docRow('banco', 'bank', 'Cuenta para retiros', 'BancoEstado CuentaRUT', 'R07')}
  ${docRow('sii', 'seal-check', 'Autoriza a Cuidapp para emitir tus boletas', 'Autorización SII cargada', 'R50')}</div>`,
  foot: () => abtn('Enviar a revisión', '', '', '', 'R08', !docsOk()) });

def({ id: 'R04', name: 'Foto del carnet', kind: 'page', back: 'x', noNav: true, title: 'Carnet de identidad',
  body: () => `<div class="cam" style="height:240px"><div style="width:84%">${idcard()}</div><div class="frame"></div></div>
  <div class="h-s mt16" style="text-align:center">Frente del carnet</div><div class="t2 sm mt4" style="text-align:center">Que se vea entero, sin reflejos.</div>`,
  foot: () => abtn('Tomar foto', 'doc', 'carnet', '', 'R03') });

def({ id: 'R05', name: 'Selfie', kind: 'page', back: 'x', noNav: true, title: 'Selfie',
  body: () => `<div class="cam"><div class="oval"></div><div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%)">${ic('user', 1).replace('<i ', '<i style="font-size:220px;color:#3a3a3a;display:block;margin-bottom:-30px" ')}</div></div>
  <div class="h-s mt16" style="text-align:center">Mira a la cámara</div><div class="t2 sm mt4" style="text-align:center">Sin lentes de sol ni gorro. Esta foto también va en tu perfil.</div>`,
  foot: () => abtn('Tomar selfie', 'doc', 'selfie', '', 'R03') });

def({ id: 'R06', name: 'Título y registro SIS', kind: 'page', back: true, noNav: true, title: 'Título profesional',
  body: () => `${lbl('Número de registro en la Superintendencia de Salud')}${field('', '482.317')}
  <div class="mt8">${note('magnifying-glass', 'Lo revisamos en el Registro Nacional de Prestadores Individuales. Tu perfil mostrará el sello “Registro SIS verificado”.', 'inf')}</div>
  ${lbl('Institución')}${field('', 'Universidad de Chile')}${lbl('Foto del título')}
  <div class="doc"><div class="hd"><b>Universidad de Chile</b><span>2019</span></div><div style="text-align:center;padding:8px 0">Otorga el título de<div class="hw" style="font-size:20px;margin:4px 0">Enfermera</div>a Camila Rojas Vergara</div></div>`,
  foot: () => abtn('Guardar', 'doc', 'titulo', '', 'R03') });

def({ id: 'R07', name: 'Cuenta bancaria', kind: 'page', back: true, noNav: true, title: 'Cuenta para retiros',
  body: () => `${lbl('Banco')}${field('bank', 'BancoEstado')}${lbl('Tipo de cuenta')}<div class="chips">${chip('CuentaRUT', true, 'toast', 'CuentaRUT seleccionada.')}${chip('Corriente', false, 'toast', 'Puedes cambiarla después en tu perfil.')}${chip('Vista', false, 'toast', 'Puedes cambiarla después en tu perfil.')}</div>
  ${lbl('Número de cuenta')}${field('', '18903442')}${lbl('Titular')}${field('', 'Camila Rojas Vergara · 18.903.442-K')}
  <div class="mt16">${note('info', 'La cuenta debe estar a tu nombre. Es donde llegan los retiros de tu Billetera.')}</div>`,
  foot: () => abtn('Guardar', 'doc', 'banco', '', 'R03') });

def({ id: 'R08', name: 'En revisión', kind: 'page', noNav: true, auto: 'R09', enter: () => T(() => go('R09'), 5000),
  body: () => `<div style="margin-top:40px">${ic('hourglass-medium', 1).replace('<i ', '<i style="font-size:56px;color:#7A7CF0" ')}</div><div class="h-l mt16">Estamos revisando tus documentos</div>
  <div class="t2 mt8">Te avisamos con una notificación push y por correo en menos de 48 horas hábiles. Mientras, puedes ir pensando tus precios y horarios.</div><div class="mt24">
  ${row('box:check', 'Documentos recibidos', 'Hoy 10:42', '', '')}${row('box:magnifying-glass', S.prof === 'cuid' ? 'Revisión de tus referencias' : 'Revisión del registro SIS', 'En curso', '', st('inf', 'Revisando'))}${row('box:video-camera', 'Entrevista corta por videollamada', 'Después de la revisión', '', '')}</div>` });

def({ id: 'R09', name: 'Cuenta aprobada', kind: 'page', noNav: true,
  body: () => `<div style="margin-top:40px">${av('CR', 'l', true)}</div><div class="h-l mt16">Listo, Camila. Ya estás verificada</div>
  <div class="t2 mt8">${S.prof === 'cuid' ? 'Revisamos tus documentos y tus referencias: habilitada como Cuidadora.' : S.prof === 'tens' ? 'Revisamos tu registro SIS 482.317: habilitada como TENS.' : 'Revisamos tu registro SIS 482.317: habilitada como Enfermera.'}</div>
  <div class="mt24">${note('lightbulb', 'Ahora arma tu perfil: tus servicios, tus precios, tus comunas y tus horarios. Toma unos 5 minutos.')}</div>`,
  foot: () => btn('Armar mi perfil', 'R10') });

const stepRow = (k, i, a, b, go) => row('box:' + i, a, b, go, S.setup[k] ? st('ok', 'Listo', 'check-circle') : st('neu', 'Pendiente'));
def({ id: 'R10', name: 'Arma tu perfil', kind: 'page', back: true, title: 'Tu perfil',
  body: () => { const n = Object.values(S.setup).filter(Boolean).length; return `<div class="h-l">Arma tu perfil</div><div class="t2 mt8 sm">Así te verán las pacientes cuando busquen un servicio en tus comunas.</div>
  <div class="progress mt16"><span style="width:${n * 25}%"></span></div><div class="sm t2 mt8">${n} de 4 listos</div><div class="mt8">
  ${stepRow('pres', 'user-circle', 'Foto y presentación', 'Lo que ven primero', 'R26')}
  ${stepRow('serv', 'currency-circle-dollar', 'Servicios y precios', `${mySvcs().filter(k => S.my[k].on).length} servicios · desde ${clp(Math.min(...mySvcs().filter(k => S.my[k].on).map(k => S.my[k].p)))}`, 'R11')}
  ${stepRow('com', 'map-pin-area', 'Comunas donde atiendes', comTxt().join(', '), 'R13')}
  ${stepRow('hor', 'calendar-blank', 'Horario semanal', 'Lun a sáb · bloquear días', 'R14')}</div>
  <button class="pill mt16" data-act="pick" data-arg="cr|" data-go="R29">${ic('eye')}Ver cómo me ven las pacientes</button>`; },
  foot: () => abtn('Publicar mi perfil', 'publish', '', '', 'R16') });

def({ id: 'R26', name: 'Foto y presentación', kind: 'page', back: true, title: 'Presentación',
  body: () => `<div class="phed">${av('CR', 'xl', true)}<div class="tx"><b>Tu foto de perfil</b><span class="xs t2">${S.proPh ? 'Foto nueva · ya se ve en tu perfil público' : 'Es lo primero que ven las pacientes'}</span><button class="pill mt8" data-act="tog" data-arg="phOpt">${ic('camera')}Cambiar foto</button></div></div>
  ${S.phOpt ? `<div class="phop mt12"><label class="row nodiv"><span class="ri box">${ic('camera')}</span><span class="tx"><div class="a">Tomar foto</div><div class="b">Con la cámara frontal</div></span><input class="phin" type="file" accept="image/*" capture="user" hidden></label><label class="row nodiv"><span class="ri box">${ic('image')}</span><span class="tx"><div class="a">Elegir de galería</div><div class="b">JPG o PNG</div></span><input class="phin" type="file" accept="image/*" hidden></label>${S.proPh ? `<button class="row nodiv" data-act="phRm"><span class="ri box">${ic('arrow-counter-clockwise')}</span><span class="tx"><div class="a">Volver a la foto anterior</div></span></button>` : ''}</div>` : ''}
  <div class="phg mt12"><div class="b-m sm">Para que te aprueben la foto</div><ul>${['Rostro visible y centrado, mirando a la cámara', 'Fondo claro y liso, con buena luz', 'Solo tú, sin lentes de sol, gorro ni filtros', 'Puedes usar tu uniforme o ropa de trabajo'].map(t => `<li>${ic('check')}${t}</li>`).join('')}</ul></div>
  ${lbl('Sobre ti')}<div class="field" style="height:auto;min-height:96px;align-items:flex-start;padding-top:12px"><span>${PRO('cr').bio}</span></div>
  ${lbl('Años de experiencia')}${field('', '6 años')}
  ${lbl('En qué tienes más experiencia')}<div class="chips">${[['am', 'Adulto mayor'], ['pd', 'Pie diabético'], ['ped', 'Pediatría'], ['pal', 'Cuidados paliativos']].map(x => chip(x[1], S.spec[x[0]], 'tog', 'spec.' + x[0])).join('')}</div>`,
  foot: () => abtn('Guardar', 'done', 'pres', '', 'back') });

def({ id: 'R11', name: 'Servicios y precios', kind: 'page', back: true, title: 'Servicios y precios',
  body: () => `<div class="t2 sm">Cuidapp define los servicios. Tú eliges cuáles haces, cuánto cobras y qué incluyes. Cuidapp cobra ${S.comm}% de comisión.</div><div class="mt12">${row('box:moon', 'Recargos', rcOf(PROS[0]).filter(r => r.on && r.v > 0).map(r => r.n + ' ' + rcVal(r)).join(' · '), 'R43')}</div><div class="mt8">
  ${GALL.filter(g => GRP[g].l.some(k => mySvcs().includes(k))).map(g => `<div class="lbl2">${GRP[g].n}</div>${GRP[g].l.filter(k => mySvcs().includes(k)).map(k => { const m = S.my[k]; return `<div class="svcrow"><span class="si">${i3(k)}</span><button class="tog ${m.on ? 'on' : ''}" data-act="svcOn" data-arg="${k}"></button>
  <button class="tx" data-act="edit" data-arg="${k}" data-go="R12"><div class="a">${CAT[k].n}</div><div class="b">${!m.on ? 'No lo ofreces' : k === 'mue' ? 'Tu tarifa de toma · exámenes los cobra el laboratorio' : `${m.dur} min · mínimo ${clp(S.mins[k])}`}</div></button>
  <button class="end" data-act="edit" data-arg="${k}" data-go="R12">${m.on ? money(m.p) : ''}${ic('caret-right')}</button></div>`; }).join('')}`).join('')}</div>
  <div class="mt16">${note('info', `Cuidapp cobra ${S.comm}% de cada atención. El resto es tuyo y se abona a tu Billetera.`)}</div>`,
  foot: () => abtn('Guardar', 'done', 'serv', '', 'back') });

def({ id: 'R12', name: 'Editar servicio y precio', kind: 'page', back: true, title: '',
  body: () => { const k = S.edit, m = S.my[k], min = S.mins[k]; return `<div class="i3hero">${i3(k)}</div><div class="h-l">${CAT[k].n}</div><div class="t2 sm mt4">${CAT[k].d}</div>
  ${k === 'mue' ? `<div class="mt16">${note('info', 'Los exámenes tienen precio fijo del laboratorio y se cobran aparte. Tú solo defines lo que cobras por ir a tomar la muestra.')}</div>` : ''}
  ${lbl(k === 'mue' ? 'Tu tarifa de toma a domicilio' : 'Tu precio')}<div class="pricein"><button class="ib sbtn" data-act="pr" data-arg="-">${ic('minus')}</button><div class="v num">${clp(m.p)}</div><button class="ib sbtn" data-act="pr" data-arg="+">${ic('plus')}</button></div>
  <div class="pmeta"><span>Mínimo Cuidapp <b class="num">${clp(min)}</b></span><span>Promedio en Ñuñoa <b class="num">$19.500</b></span></div>
  <div class="mt8">${commTxt(m.p)}</div><div class="mt12">${row('box:moon', 'Recargos', rcOf(PROS[0]).filter(r => r.on && r.v > 0).map(r => r.n + ' ' + rcVal(r)).join(' · ') || 'Sin recargos', 'R43')}</div><div class="xs t3 mt4">La comisión también aplica sobre los recargos.</div>
  ${lbl('Duración de la atención')}<div class="chips">${[20, 30, 45, 60].map(v => chip(v + ' min', m.dur === v, 'dur', v)).join('')}</div>
  ${lbl('Qué incluye')}${Object.keys(INC).map(x => checkRow(k === 'mue' && x === 'ins' ? 'Tubos, aguja, ligadura y traslado de la muestra al laboratorio' : INC[x], m.inc[x], 'inc', x)).join('')}
  ${field('', '', 'Agrega algo más (opcional)')}
`; },
  foot: () => btn('Guardar servicio', 'back') });

def({ id: 'R13', name: 'Comunas donde atiendes', kind: 'page', back: true, title: 'Comunas',
  body: () => `<div class="t2 sm">Solo te verán pacientes de estas comunas.</div>
  ${COMUNAS.map(g => `${lbl(g[0])}<div class="chips">${g[1].map(c => chip(c[1], S.com[c[0]], 'tog', 'com.' + c[0])).join('')}</div>`).join('')}
  <div class="mt16">${note('lightbulb', 'En Ñuñoa y La Reina hay más pacientes que profesionales esta semana.')}</div>`,
  foot: () => abtn(`Guardar · ${comTxt().length} comunas`, 'done', 'com', '', 'back') });

def({ id: 'R14', name: 'Horario semanal', kind: 'page', back: true, title: 'Horario semanal',
  body: () => `<div class="t2 sm">Las pacientes solo pueden agendar en estos horarios.</div><div class="mt8">
  ${WEEK.map(d => `<button class="row" data-act="tog" data-arg="week.${d[0]}"><span class="tx"><div class="a">${d[1]}</div><div class="b">${S.week[d[0]] ? d[2] : 'No atiendo'}</div></span><span class="tog ${S.week[d[0]] ? 'on' : ''}"></span></button>`).join('')}</div>
  ${lbl('Tiempo entre atenciones')}<div class="chips">${[15, 30, 45].map(v => chip(v + ' min', S.gap === v, 'set', 'gap=' + v)).join('')}</div>
  ${lbl('Aviso mínimo para agendar')}<div class="chips">${[[2, '2 horas'], [12, '12 horas'], [24, '1 día']].map(v => chip(v[1], S.antic === v[0], 'set', 'antic=' + v[0])).join('')}</div>
  <div class="mt8">${row('box:calendar-x', 'Bloquear días', `${Object.values(S.blocked).filter(Boolean).length} día bloqueado`, 'R15')}</div>`,
  foot: () => abtn('Guardar horario', 'done', 'hor', '', 'back') });

def({ id: 'R15', name: 'Bloquear días', kind: 'page', back: true, title: 'Bloquear días',
  body: () => `<div class="h-s">Octubre y noviembre 2026</div><div class="t2 sm mt4">Toca los días que no vas a atender.</div>
  <div class="cal mt12">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => `<span class="hd">${d}</span>`).join('')}
  ${Array.from({ length: 21 }, (_, i) => { const n = 26 + i, d = n > 31 ? n - 31 : n; const past = false; return `<button class="${S.blocked[n] ? 'on' : ''} ${n === 26 ? 'today' : ''}" data-act="blk" data-arg="${n}">${d}</button>`; }).join('')}</div>
  <div class="mt16" style="display:flex;gap:16px" class="sm"><span class="sm"><span class="lg-b"></span> Bloqueado</span><span class="sm"><span class="lg-t"></span> Hoy</span></div>
  <div class="mt16">${note('info', 'Las reservas ya confirmadas en esos días no se cancelan solas. Si necesitas cancelar una, avísale a la paciente por el chat.')}</div>`,
  foot: () => btn('Listo', 'back') });

const GMAPS = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent('Av. Irarrázaval 3450, Ñuñoa, Santiago, Chile');
const goCard = () => `<div class="gost mt16 ${S.proSt === 'camino' ? 'on' : ''}"><div class="gost-h">${S.proSt === 'camino' ? st('inf', 'En camino', 'car-simple') : st('neu', 'Aún no sales', 'clock')}<span class="xs t2">${S.proSt === 'camino' ? 'Daniela ve «Camila va en camino»' : 'Avísale a Daniela cuando salgas'}</span></div>
  <div class="gost-a">${ic('map-pin')}<div><b>Av. Irarrázaval 3450, depto 1204</b><div class="sm t2">Ñuñoa · torre B</div></div></div>
  <button class="btn sec mt12" data-act="gmaps">${ic('arrow-square-out')}Abrir en Google Maps</button></div>`;
const avlPill = () => `<button class="avl mt16 ${S.online ? 'on' : ''}" data-act="online" role="switch" aria-checked="${S.online}" aria-label="Disponible hoy"><span class="avl-d"></span><span class="avl-t"><b>${S.online ? 'Disponible' : 'No disponible'}</b><span>${S.online ? 'Apareces en «Disponible hoy»' : 'Actívalo para recibir pedidos de hoy'}</span></span><span class="tog ${S.online ? 'on' : ''}" aria-hidden="true"></span></button>`;
const reqRow = (r, i, a, b, p, go = 'R17') => S.req[r] === 'new' ? row('box:' + i, a, b, go, money(p)) : '';
def({ id: 'R16', name: 'Inicio profesional', kind: 'page', tab: 'inicio', next: ['R17'],
  body: () => { const pend = Object.values(S.req).filter(v => v === 'new').length; return `<div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px"><div><div class="h-l">Hola, Camila</div><div class="sm t2 mt4">★ 4,9 · ${S.done} atenciones esta semana</div></div><button class="weekchip2" data-go="R23"><span class="num">${clp(S.earn)}</span><span class="xs t2">esta semana</span></button></div>
  ${avlPill()}
  <div class="sec-t">Solicitudes por responder ${pend ? `<span class="cnt num">${pend}</span>` : ''}</div>
  ${pend ? `${reqRow('r1', 'syringe', 'Mar 27 · 08:00 · Inyección', 'Ñuñoa · Rosa M., 78 años · responde en 1 h 42 min', S.my.iny.p)}${reqRow('r2', 'test-tube', 'Mié 28 · 08:00 · Toma de muestras', 'Providencia · Andrea P. · 4 exámenes · responde en 1 h 10 min', S.my.mue.p, 'R30')}` : `<div class="t2 sm mt8">No tienes solicitudes pendientes.</div>`}
  <div class="sec-t">Hoy</div>
  ${row('box:bandaids', '19:00 · Curación simple', 'Providencia · Jorge T. · confirmada', 'R18', money(S.my.cur.p))}
  ${row('box:heartbeat', '20:30 · Signos vitales', 'Ñuñoa · Carmen V. · confirmada', 'R18', money(S.my.sig.p))}
  <div class="mt12">${row('box:storefront', 'Mi perfil público', '4 servicios · desde ' + clp(Math.min(...mySvcs().filter(k => S.my[k].on).map(k => S.my[k].p))) + ' · 4 comunas', 'R10')}</div>`; } });

def({ id: 'R17', name: 'Solicitud de reserva', kind: 'page', back: true, title: 'Nueva solicitud', auto: 'R18', autoAct: () => { S.req.r1 = 'ok'; },
  body: () => `<div class="sm t2">Agendada para</div><div class="h-l">Martes 27 oct · 08:00</div><div class="t2 sm mt4">Responde antes de 1 h 42 min o se libera la solicitud.</div>
  <div class="pbox mt16"><div><div class="sm t2">Tu precio</div><div class="price num">${clp(S.my.iny.p)}</div></div><div style="text-align:right"><div class="sm t2">Recibes</div><div class="h-m num">${clp(net(S.my.iny.p))}</div></div></div><div class="mt8">${commTxt(S.my.iny.p)}</div>
  <div class="mt8">${row('box:syringe', 'Inyección intramuscular', 'Neurobionta 5.000 · tiene el medicamento', '', '')}
  ${row('box:file-text', 'Receta adjunta', 'Dr. Andrés Valenzuela · 20/10/2026', '', st('ok', 'Se lee bien'))}
  ${row('box:map-pin', 'Ñuñoa · 1,8 km de tu casa', 'La dirección exacta aparece al aceptar', '', '')}
  ${row('av:RM', 'Rosa Muñoz, 78 años', 'La pidió su hija, Daniela', '', '')}</div>
  <div class="mt8">${note('warning', '<b>Alergia a penicilina.</b>', 'warn')}</div>`,
  foot: () => `${abtn('Aceptar reserva', 'req', 'r1:ok', '', 'R18')}<div style="display:flex;gap:8px"><button class="btn sec" data-act="toast" data-arg="Le propusimos a Daniela el martes 27 a las 09:00.">Proponer otra hora</button><button class="btn danger" data-act="req" data-arg="r1:no" data-go="R16">Rechazar</button></div>` });

def({ id: 'R18', name: 'Detalle de la visita', kind: 'page', back: true, title: 'Reserva confirmada', next: ['R20'],
  body: () => `<div style="display:flex;align-items:center;gap:14px">${av('RM', 'l')}<div><div class="h-l">Rosa Muñoz</div><div class="t2 mt4">78 años · la pidió Daniela Fuentes (hija) · +56 9 8765 4321</div></div></div>
  <div class="mt16">${note('warning', '<b>Alergia a penicilina.</b>', 'warn')}</div>${goCard()}
  <button class="lastn mt12" data-go="R37">${ic('notebook')}<span class="tx"><span class="xs t2">Disponible 24 h antes de la cita</span><span class="a">Resumen de la ficha de Rosa</span><span class="b">Diagnósticos, remedios, última curación y escalas</span></span>${ic('caret-right')}</button>
  <div class="mt8">${row('box:calendar-check', 'Martes 27 oct · 08:00 a 08:30', 'Te recordamos 1 hora antes', '', '')}
  ${row('box:map-pin', 'Av. Irarrázaval 3450, depto 1204, torre B', 'Ñuñoa · Conserjería 24 h · estacionar en visitas', '', '')}
  ${row('box:syringe', 'Inyección intramuscular', 'El medicamento está en la casa (refrigerador)', '', '')}
  ${row('box:chat-circle', 'Escribir a Daniela', 'Chat de Cuidapp', '', ic('caret-right'), '', 'toast', 'Mensaje enviado: "Hola, nos vemos mañana a las 08:00".')}</div>
  <div class="sec-t">Receta</div><div class="mt8">${receta(true)}</div>`,
  foot: () => S.proSt === 'camino' ? `${btn(ic('map-pin-simple-area', 1) + 'Llegué', 'R20')}<button class="btn ghost" data-act="set" data-arg="proSt=">Aún no salgo</button>` : abtn(ic('car-simple', 1) + 'Voy en camino', 'proGo') });

def({ id: 'R20', name: 'Código y checklist', kind: 'page', back: true, title: 'Inicia la atención',
  body: () => `<div class="h-m">Pide el código a la paciente</div><div class="code mt16">${[0, 1, 2, 3].map(i => `<span class="${i === S.code.length ? 'f' : ''}">${S.code[i] || ''}</span>`).join('')}</div>
  ${String(S.code).length === 4 ? `<div class="mt8">${String(S.code) === '2749' ? st('ok', 'Código correcto', 'check-circle') : st('bad', 'No coincide. Pídelo otra vez.', 'x-circle')}</div>` : ''}
  ${String(S.code) === '2749' ? `<div class="sec-t">Antes de inyectar</div>${checkRow('Mostré mi credencial de Cuidapp', S.chk.id, 'chk', 'id')}${checkRow('Revisé la receta y el medicamento', S.chk.rec, 'chk', 'rec')}${checkRow('Pregunté por alergias (penicilina)', S.chk.ale, 'chk', 'ale')}`
    : `<div class="keys mt16">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '<'].map(k => k === '' ? '<span></span>' : `<button data-act="key" data-arg="${k}">${k === '<' ? ic('backspace') : k}</button>`).join('')}</div><button class="link sm mt12" data-act="set" data-arg="code=2749">Rellenar 2749</button>`}`,
  foot: () => abtn('Iniciar atención', '', '', '', 'R21', !(String(S.code) === '2749' && S.chk.id && S.chk.rec && S.chk.ale)), auto: 'R21', autoAct: () => { S.code = '2749'; S.chk = { id: true, rec: true, ale: true }; } });

def({ id: 'R21', name: 'Cerrar atención', kind: 'page', title: 'Atención en curso',
  body: () => `<div class="t2">Comenzó 08:02 · Rosa Muñoz</div><div class="h-l mt8 num">00:12:40</div>
  ${lbl('¿Qué hiciste?')}${checkRow('Inyección IM de Neurobionta 5.000', true, 'toast', 'Procedimiento registrado.')}
  ${lbl('Zona')}<div class="chips">${chip('Glúteo derecho', true, 'toast', 'Zona registrada.')}${chip('Glúteo izquierdo', false, 'toast', 'Zona registrada.')}${chip('Deltoides', false, 'toast', 'Zona registrada.')}</div>
  ${lbl('Durante la visita')}${row('box:list', 'Historial de Rosa', SHARE[S.share][0] + ' · compartido por Daniela', 'R38')}
  <div class="mt12">${note('notebook', 'Al terminar escribes la nota: signos vitales, curación, indicaciones y próximo control. Daniela la recibe con una notificación push.')}</div>`,
  foot: () => abtn('Terminar y escribir la nota', 'earn', '', '', 'R31') });

def({ id: 'R22', name: 'Calificar paciente', kind: 'page',
  body: () => `<div class="st ok" style="margin-top:12px">${ic('check-circle', 1)}+${clp(net(S.my.iny.p))}</div><div class="h-l mt16">Terminaste. ¿Cómo te fue?</div>
  <div class="t2 mt8">Califica a Daniela y Rosa. Ellas no ven tu nota.</div>
  <div class="stars mt24">${[1, 2, 3, 4, 5].map(n => `<button class="${S.pRating >= n ? 'on' : ''}" data-act="prate" data-arg="${n}">${ic('star', 1)}</button>`).join('')}</div>
  <div class="chips mt24" style="justify-content:center">${['Dirección clara', 'Amables', 'Tenían todo listo', 'Me esperaron abajo'].map(t => chip(t, S.pTags[t], 'ptag', t)).join('')}</div>`,
  foot: () => `${btn('Listo', 'R23')}${btn('Ver mi agenda', 'R24', 'sec')}` });

const WMOV = () => { const iny = net(S.my.iny.p), cur = net(S.my.cur.p), sg = S.my.sig ? net(S.my.sig.p) : 15000;
  return [...(S.paid ? [['syringe', 'Inyección · Ñuñoa', 'Hoy 08:14 · Rosa M.', iny]] : []), ['bandaids', 'Curación · Providencia', 'Hoy 19:45 · Jorge T.', cur], ['heartbeat', 'Signos vitales · Ñuñoa', 'Dom 25 oct · Carmen V.', sg], ['bandaids', 'Curación · La Reina', 'Sáb 24 oct · Pedro S.', cur]]; };
def({ id: 'R23', name: 'Billetera', kind: 'page', tab: 'ganancias', next: ['R46', 'R47', 'R07'],
  body: () => { const sd = S.earn - S.wd, d = [['M', 36000], ['M', 18000], ['J', 41400], ['V', 20000], ['S', 36600], ['D', 0], ['L', Math.max(0, S.earn - 152000)]]; const mx = 60000; const gross = Math.round(S.earn / (1 - S.comm / 100));
    return `<div class="sm t2 mt8">Saldo disponible</div><div class="price mt4" style="font-size:40px;line-height:46px">${clp(sd)}</div><div class="t2 sm mt4">Lo retiras cuando quieras, sin esperar a un día de pago.</div>
  <div class="mt16">${abtn(ic('arrow-up-right') + 'Retirar', '', '', '', 'R46', sd <= 0)}</div>
  <div class="mt8">${row('box:bank', 'Cuenta de retiro', 'BancoEstado CuentaRUT ••••3442', 'R07')}</div>
  <div class="mt8">${note('receipt', 'Cuidapp cobra a la paciente con Mercado Pago y abona tu parte en la Billetera. Tu boleta de honorarios a la paciente se emite automáticamente con tu autorización del SII.')}</div>
  <div class="sec-t">Movimientos</div>
  ${S.wdL.map(w => row('box:arrow-up-right', 'Retiro a BancoEstado ••••3442', w[0], '', `<span class="num">−${clp(w[1])}</span>`)).join('')}${WMOV().map(m => row('box:' + m[0], m[1], m[2], 'R47', money(m[3]))).join('')}${row('box:arrow-up-right', 'Retiro a BancoEstado ••••3442', 'Lun 19 oct', '', `<span class="num">−${clp(140000)}</span>`)}
  <div class="mt8">${row('box:receipt', 'Boletas de honorarios', `${bheN().p} por emitir · se emiten automáticamente`, 'R47')}${row('box:seal-check', 'Autorización SII', siiOk() ? `Vigente hasta ${SIIFIN}` : 'Pendiente de cargar', 'R50')}</div>
  <div class="sec-t">Esta semana · 20 al 26 oct</div><div class="t2 sm mt4">${S.done} atenciones</div>
  <div class="bars mt16">${d.map((x, i) => `<div class="${i === 6 ? 'on' : ''}"><span style="height:${Math.max(4, x[1] / mx * 100)}%"></span>${x[0]}</div>`).join('')}</div>
  <div class="mt16">${kv('Cobrado a pacientes', clp(gross))}${kv(`Comisión Cuidapp (${S.comm}%, incluye recargos)`, '−' + clp(gross - S.earn))}${kv('Abonado a tu Billetera', clp(S.earn), 'tot')}</div>
  <div class="mt16">${note('flask', 'Los exámenes de laboratorio los paga Cuidapp aparte; no pasan por tu Billetera.')}</div>`; } });

def({ id: 'R46', name: 'Retirar de la Billetera', kind: 'page', back: true, title: 'Retirar', next: ['R23'],
  body: () => { const sd = S.earn - S.wd, a = Math.min(S.wAmt || sd, sd); const opts = [['all', 'Todo'], ...[20000, 50000, 100000].filter(x => x < sd).map(x => [x, clp(x)])];
    return `<div class="sm t2 mt8">Monto a retirar</div><div class="price mt4" style="font-size:40px;line-height:46px">${clp(a)}</div><div class="t2 sm mt4">Disponible: ${clp(sd)}</div>
  <div class="chips mt16">${opts.map(o => chip(o[1], o[0] === 'all' ? !S.wAmt || S.wAmt >= sd : S.wAmt === o[0], 'wset', o[0])).join('')}</div>
  <div class="lbl2">Se transfiere a</div>${row('box:bank', 'BancoEstado · CuentaRUT', '••••3442 · Camila Rojas Vergara', 'R07')}
  <div class="mt16">${note('info', 'Retiras cuando quieras. La cuenta debe estar a tu nombre.')}</div>`; },
  foot: () => { const sd = S.earn - S.wd, a = Math.min(S.wAmt || sd, sd); return abtn(`Retirar ${clp(a)}`, 'wdo', '', '', 'R23', a <= 0); } });

const SIIFIN = '26/10/2027';
const siiOk = () => !S.siiOff;
const BHE_ST = { 'Hoy 08:14 · Rosa M.': 'pend', 'Hoy 19:45 · Jorge T.': 'pend', 'Dom 25 oct · Carmen V.': 'fail', 'Sáb 24 oct · Pedro S.': 'emi' };
const bheS = m => (S.bheFix || {})[m[2]] || BHE_ST[m[2]] || 'emi';
const bheN = () => { const L = WMOV(); return { p: L.filter(m => bheS(m) === 'pend').length, f: L.filter(m => bheS(m) === 'fail').length }; };
const ppmEst = () => Math.round(WMOV().filter(m => bheS(m) === 'emi').reduce((a, m) => a + m[3], 0) * 0.1 / 10) * 10;
Object.assign(ACT, { bheFix: m => { S.bheFix = { ...(S.bheFix || {}), [m]: 'emi' }; toast('Emitiste tu boleta de honorarios. Queda registrada en tu Billetera.'); },
  siiChk: () => { S.siiChk = !S.siiChk; }, siiUp: () => { S.siiUp = !S.siiUp; } });
def({ id: 'R47', name: 'Boletas de honorarios', kind: 'page', back: true, title: 'Boletas de honorarios',
  body: () => `<div class="sm t2 mt8">Cuidapp emite automáticamente tu boleta de honorarios a la paciente por tu parte de cada atención, con tu autorización del SII.</div>
  <div class="mt12">${row('box:seal-check', siiOk() ? `Autorización SII vigente hasta ${SIIFIN}` : 'Falta tu autorización SII', siiOk() ? 'Te avisamos 30 días antes para renovarla. Se renueva una vez al año.' : 'Sin ella no podemos emitir tus boletas.', 'R50', siiOk() ? st('ok', 'Vigente', 'check-circle') : st('warn', 'Pendiente'))}</div>
  <div class="mt8">${WMOV().map(m => { const e = bheS(m); return row('box:' + m[0], m[1], m[2] + (e === 'fail' ? ' · no pudimos emitirla' : ''), '', `<span class="num">${clp(m[3])}</span>${e === 'emi' ? st('ok', 'Emitida') : e === 'fail' ? st('bad', 'Falló') : st('warn', 'Pendiente')}`); }).join('')}</div>
  ${WMOV().filter(m => bheS(m) === 'fail').map(m => `<div class="mt12">${note('warning', 'No pudimos emitir una de tus boletas: la autorización del SII venció o falló. Puedes emitirla tú con un enlace guiado y renovar la autorización.')}<div class="mt8"><button class="btn sec" data-act="bheFix" data-arg="${m[2]}">${ic('arrow-square-out')}Emitir yo misma · enlace guiado</button></div></div>`).join('')}
  <div class="mt16">${kv('Boletas emitidas este mes', clp(WMOV().filter(m => bheS(m) === 'emi').reduce((a, m) => a + m[3], 0)))}${kv('PPM estimado del mes', clp(ppmEst()))}</div>
  <div class="xs t3 mt4">Estimación de ejemplo con una tasa de 10%, por confirmar. La retención la hace quien emite la boleta y el PPM lo declaras tú en tu F29. Nunca te pedimos la clave del SII.</div>` });

def({ id: 'R50', name: 'Autoriza a Cuidapp para emitir tus boletas', kind: 'page', back: true, noNav: true, title: 'Autoriza tus boletas',
  body: () => `<div class="h-l">Autoriza a Cuidapp para emitir tus boletas</div><div class="t2 mt8 sm">Así tu boleta de honorarios a cada paciente sale sola, con su nombre y RUT, por el monto de tu atención. Lo haces una vez al año y lo revisas tú.</div>
  <div class="mt16">${checkRow('Tengo inicio de actividades en 2ª categoría', S.siiChk, 'siiChk', '', 'Es un requisito. Enfermeras, TENS y cuidadoras lo hacen en sii.cl')}</div>
  <div class="lbl2">En 3 pasos, en sii.cl</div>
  <div class="sii3">${[['Entra a sii.cl con tu clave', 'La pones tú en el SII. Cuidapp nunca te pide tu clave del SII.'], ['Ve a Boletas de Honorarios > Emisor', 'Elige «Delegar emisión a un usuario autorizado».'], ['Agrega el RUT de Cuidapp SpA', 'Te lo mostramos aquí cuando esté definido. Descarga el comprobante en PDF.']].map((t, i) => `<div class="s3"><span>${i + 1}</span><div><b>${t[0]}</b><div class="xs t2">${t[1]}</div></div></div>`).join('')}</div>
  <div class="lbl2">Sube el comprobante</div>${row('box:file-pdf', S.siiUp ? 'comprobante-autorizacion-sii.pdf' : 'Subir comprobante (PDF)', S.siiUp ? 'Cargado hoy · vigente por 1 año' : 'El que descargas del SII al autorizar', '', S.siiUp ? st('ok', 'Cargado', 'check-circle') : ic('upload-simple'), '', 'siiUp')}
  <div class="mt16">${note('arrows-clockwise', 'La autorización dura 1 año. Te avisamos 30 días antes para renovarla. Si alguna vez falla la emisión, te enviamos un enlace guiado para que emitas tú esa boleta.')}</div>`,
  foot: () => abtn('Guardar autorización', 'doc', 'sii', '', 'R03', !(S.siiChk && S.siiUp)) });

def({ id: 'R48', name: 'Experiencia y referencias', kind: 'page', back: true, noNav: true, title: 'Experiencia y referencias',
  body: () => `${lbl('Años de experiencia como cuidadora')}${field('', '6 años')}
  ${lbl('Cuidados que realizas')}<div class="chips">${['Adulto mayor', 'Postración', 'Acompañamiento', 'Después de una cirugía'].map((t, i) => chip(t, i < 3, 'toast', 'Los puedes cambiar después en tu perfil.')).join('')}</div>
  ${lbl('Referencia 1')}${field('', 'Marta Illanes · +56 9 5540 1122')}${lbl('Referencia 2')}${field('', 'Pablo Soto · +56 9 6628 3350')}
  <div class="mt8">${note('magnifying-glass', 'Las revisamos antes de aprobar tu cuenta. Tu perfil mostrará el sello «Verificada».', 'inf')}</div>
  ${lbl('Certificado de curso (si tienes)')}<div class="doc"><div class="hd"><b>Curso de cuidados</b><span>Opcional</span></div><div style="text-align:center;padding:8px 0">Puedes subir un certificado o diploma que respalde tu experiencia.</div></div>`,
  foot: () => abtn('Guardar', 'doc', 'titulo', '', 'R03') });

def({ id: 'R49', name: 'Ayuda para profesionales', kind: 'page', back: true, title: 'Ayuda',
  body: () => `<div class="sm t2 mt8">Escríbenos y te respondemos por correo.</div>
  <div class="mt8">${row('box:envelope-simple', 'Profesionales', 'profesionales@cuidapp.io', '', '', '', 'toast', 'Escríbenos a profesionales@cuidapp.io')}${row('box:lifebuoy', 'Soporte', 'soporte@cuidapp.io', '', '', '', 'toast', 'Escríbenos a soporte@cuidapp.io')}</div>
  <div class="mt16">${note('wallet', 'Para dudas de tu Billetera o de tus boletas de honorarios, usa profesionales@cuidapp.io.')}</div>` });

const AG = { 0: [['19:00', 'Curación simple', 'Providencia · Jorge T.', 'ok', 'bandaids'], ['20:30', 'Signos vitales', 'Ñuñoa · Carmen V.', 'ok', 'heartbeat']], 1: [['08:00', 'Inyección', 'Ñuñoa · Rosa M.', 'r1', 'syringe'], ['11:30', 'Libre', '', 'free', 'clock'], ['19:00', 'Curación simple', 'La Reina · Pedro S.', 'ok', 'bandaids']], 2: [['08:00', 'Toma de muestras', 'Providencia · Andrea P.', 'r2', 'test-tube'], ['18:30', 'Inyección', 'Ñuñoa · Rosa M. · 2ª dosis', 'ok', 'syringe']], 3: [['09:00', 'Libre', '', 'free', 'clock']], 4: [], 5: [['10:00', 'Libre', '', 'free', 'clock']] };
def({ id: 'R24', name: 'Agenda', kind: 'page', tab: 'agenda', next: ['R17', 'R18'],
  body: () => `<div class="h-xl mt8">Agenda</div><div class="days mt16">${DAYS.map((d, i) => `<button class="day ${S.aday === i ? 'on' : ''} ${S.blocked[d[1]] ? 'blk' : ''}" data-act="set" data-arg="aday=${i}">${d[0]}<b>${d[1]}</b></button>`).join('')}</div>
  <div class="sec-t">${DAYS[S.aday][3].replace(/^\w/, c => c.toUpperCase())}</div>
  ${S.blocked[DAYS[S.aday][1]] ? `<div class="mt8">${note('calendar-x', 'Bloqueaste este día. No recibes reservas.')}</div>` : (AG[S.aday].length ? AG[S.aday].map(x => {
    const stt = x[3] === 'ok' ? st('ok', 'Confirmada') : x[3] === 'free' ? st('neu', 'Libre') : S.req[x[3]] === 'new' ? st('warn', 'Por responder') : S.req[x[3]] === 'ok' ? st('ok', 'Confirmada') : st('bad', 'Rechazada');
    const go = x[3] === 'free' ? '' : x[3] === 'ok' || S.req[x[3]] === 'ok' ? 'R18' : 'R17';
    return row('box:' + x[4], `${x[0]} · ${x[1]}`, x[2] || 'Visible para pacientes', go, stt, '', go ? '' : 'toast', go ? '' : 'Esta hora está libre y visible para pacientes.'); }).join('') : `<div class="t2 sm mt8">Sin reservas este día.</div>`)}
  <div class="mt16">${row('calendar-blank', 'Horario semanal', 'Lun a sáb', 'R14')}${row('calendar-x', 'Bloquear días', 'Vacaciones, turnos, trámites', 'R15')}</div>` });

def({ id: 'R25', name: 'Perfil profesional', kind: 'page', tab: 'perfil',
  body: () => `<div style="display:flex;align-items:center;gap:16px;margin-top:8px">${av('CR', 'l', true)}<div><div class="h-l">Camila Rojas</div><div class="sm t2">Enfermera · SIS 482.317 · ★ 4,9</div></div></div>
  <div class="mt16">${row('camera', 'Cambiar foto', S.proPh ? 'Foto nueva publicada' : 'Tomar foto o elegir de galería', 'R26')}${row('lifebuoy', 'Ayuda', 'profesionales@cuidapp.io', 'R49')}${row('flask', 'Laboratorios afiliados', 'Dónde entregar las muestras', 'R45')}${row('storefront', 'Ver mi perfil público', 'Como lo ven las pacientes', 'R29', ic('caret-right'), '', 'pick', 'cr|')}${row('star', 'Mis reseñas', `★ 4,9 · ${REVIEWS.cr.filter(r => !S.resp[r.id]).length} sin responder`, 'R27')}${row('user-circle', 'Foto y presentación', '', 'R26')}${row('megaphone', 'Destacar mi perfil', S.dest.cr ? 'Activo · apareces primero' : `Aparece primero · ${clp(S.pz.pdest)} al mes`, 'R44', S.dest.cr ? st('ok', 'Destacado') : ic('caret-right'))}${row('currency-circle-dollar', 'Servicios y precios', `${mySvcs().filter(k => S.my[k].on).length} servicios`, 'R11')}${row('map-pin-area', 'Comunas', comTxt().join(', '), 'R13')}${row('calendar-blank', 'Horario semanal', 'Lun a sáb', 'R14')}
  ${row('identification-card', 'Documentos', 'Todos vigentes', 'R03', st('ok', 'Verificada', 'seal-check'))}${row('bank', 'Cuenta para retiros', 'BancoEstado CuentaRUT', 'R07')}${row('first-aid-kit', 'Pedir una atención para mí', 'Ir a la app de pacientes', 'P06')}${row('sign-out', 'Cerrar sesión', '', 'S01', '')}</div>` });

/* ===== Destacado (pagado por la profesional; precio en S.pz.pdest) ===== */
def({ id: 'R44', name: 'Destacar mi perfil', kind: 'page', back: true, title: 'Destacar mi perfil', next: ['R25'],
  body: () => { const p = PRO('cr');
    return `<div class="sm t2">Apareces primero en los resultados de tus comunas, con la etiqueta «Destacado». Tu precio y tus reseñas no cambian.</div>
    <div class="lbl2">Así te ven las pacientes</div><div class="dprev">${pav(p, '', true)}<div class="tx"><b>${p.n} <span class="dtag">Destacado</span></b><span class="xs t2">${p.t} · ${p.yrs} años de experiencia</span><span class="xs">${rate(p)}</span></div></div>
    <div class="lbl2">Qué incluye</div>${row('box:sort-ascending', 'Primero en la búsqueda', 'En Ñuñoa, Providencia, La Reina y Santiago', '', '')}${row('box:seal-check', 'Etiqueta «Destacado»', 'En tu tarjeta y en tu perfil público', '', '')}${row('box:calendar-x', 'Sin permanencia', 'Lo desactivas cuando quieras', '', '')}
    <div class="msc mt16 dpz"><div class="tx"><b>Destacado</b><span class="xs t2">Mensual · se cobra con Mercado Pago</span></div><div class="pkp"><b class="num">${clp(S.pz.pdest)}</b><span class="xs t2">al mes</span></div></div>
    <div class="mt12">${note('info', 'Destacar no reemplaza la verificación: solo aparecen profesionales con documentos al día.')}</div>`; },
  foot: () => S.dest.cr ? abtn('Desactivar Destacado', 'pDest', '', 'sec', 'R25') : abtn(`Activar por ${clp(S.pz.pdest)} al mes`, 'pDest', '', '', 'R25') });

/* ===== reseñas de la profesional ===== */
def({ id: 'R27', name: 'Mis reseñas', kind: 'page', back: true, title: 'Mis reseñas',
  body: () => { const p = PRO('cr'), l = REVIEWS.cr; return `${scoreBlock(p)}${bars(p)}${crits(p)}
  <div class="lbl2">${l.filter(r => !S.resp[r.id]).length} sin responder</div>
  ${l.map(r => `${rvCard(r, true, 'cr')}${S.resp[r.id] ? '' : `<button class="pill mt8 mb16" data-act="set" data-arg="replyTo=${r.id}" data-go="R28">${ic('arrow-bend-up-left')}Responder</button>`}`).join('')}
  <div class="xs t3 mt16">Tu respuesta se publica en tu perfil, bajo la reseña.</div>`; } });
def({ id: 'R28', name: 'Responder reseña', kind: 'page', back: true, title: 'Responder',
  body: () => { const r = REVIEWS.cr.find(x => x.id === S.replyTo) || REVIEWS.cr[0]; return `<div class="mt8">${rvCard(r, false, 'cr')}</div>
  <div class="lbl2">Tu respuesta</div><div class="field ta"><span>Muchas gracias, ${r.n.split(' ')[0]}. Fue un gusto atender a tu familia. Cuando necesiten otra visita, aquí estoy.</span></div>
  <div class="mt16">${note('info', 'Sé breve y amable. No compartas datos de salud de la paciente.')}</div>`; },
  foot: () => abtn('Publicar respuesta', 'pubResp', '', '', 'R27') });
ACT.pubResp = () => { const r = REVIEWS.cr.find(x => x.id === S.replyTo); S.resp[S.replyTo] = `Muchas gracias, ${r.n.split(' ')[0]}. Fue un gusto atender a tu familia. Cuando necesiten otra visita, aquí estoy.`; toast('Respuesta publicada en tu perfil.'); };
def({ id: 'R29', name: 'Vista previa del perfil público', kind: 'page', back: true, title: 'Vista previa',
  body: () => `<div class="pvb">${ic('eye')}<span>Así te ven las pacientes cuando buscan un servicio.</span></div>${profileBody(PRO('cr'), 'pre')}`,
  foot: () => `<div class="row8"><button class="btn sec" data-go="R26">Editar presentación</button><button class="btn sec" data-go="R11">Editar precios</button></div>` });

/* ---------- solicitud de toma de muestras: exámenes y tubos ---------- */
const R30EX = ['hemo', 'bioq', 'tsh', 'ori'];
def({ id: 'R30', name: 'Solicitud de toma de muestras', kind: 'page', back: true, title: 'Nueva solicitud',
  body: () => { const ex = R30EX.map(k => EXAMS[k]); const tb = [...new Set(ex.map(e => e[2]))];
    return `<div class="sm t2">Agendada para</div><div class="h-l">Miércoles 28 oct · 08:00</div><div class="t2 sm mt4">Responde antes de 1 h 10 min o se libera la solicitud.</div>
  <div class="pbox mt16"><div><div class="sm t2">Tu tarifa de toma</div><div class="price num">${clp(S.my.mue.p)}</div></div><div style="text-align:right"><div class="sm t2">Recibes</div><div class="h-m num">${clp(net(S.my.mue.p))}</div></div></div><div class="mt8">${commTxt(S.my.mue.p)}</div>
  <div class="xs t2 mt8">Los exámenes los cobra Cuidapp a la paciente y no pasan por tu pago. Tú tomas la muestra y la entregas en el laboratorio.</div>
  <div class="lbl2">Exámenes</div>${ex.map(e => `<div class="kv"><span class="k">${e[0]}</span><span class="t2 sm">${e[2]}</span></div>`).join('')}
  <div class="lbl2">Lleva</div><div class="tubes">${tb.map(t => `<span class="tube"><span class="dot" style="background:${TUBE[t]}"></span>${t} × ${ex.filter(e => e[2] === t).length}</span>`).join('')}</div>
  <div class="mt16">${row('box:clock-countdown', 'Paciente en ayuno de 12 horas', 'Perfil bioquímico', '', '')}
  ${row('box:map-pin', 'Providencia · 2,4 km de tu casa', 'La dirección exacta aparece al aceptar', '', '')}
  ${row('box:flask', 'Entrega en el laboratorio · Providencia', 'Antes de las 12:00, en la caja refrigerada', 'R45', '<span class="lk">Ver laboratorios</span>')}</div>`; },
  foot: () => `${abtn('Aceptar solicitud', 'req', 'r2:ok', '', 'R16')}<button class="btn danger" data-act="req" data-arg="r2:no" data-go="R16">Rechazar</button>` });

/* foto de perfil: la elegida se previsualiza y reemplaza la foto en el perfil público (solo en este navegador) */
Object.assign(ACT, { phRm: () => { S.proPh = ''; S.phOpt = false; toast('Volviste a tu foto anterior.'); } });
document.addEventListener('change', e => { const t = e.target; if (!t.classList || !t.classList.contains('phin') || !t.files || !t.files[0]) return;
  const r = new FileReader(); r.onload = () => { S.proPh = r.result; S.phOpt = false; render(); toast('Foto actualizada. Ya se ve en tu perfil público.'); }; r.readAsDataURL(t.files[0]); });
