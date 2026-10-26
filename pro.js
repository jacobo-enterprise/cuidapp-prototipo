/* ===== Profesional ===== */
Object.assign(ACT, {
  doc: k => { S.docs[k] = true; },
  online: () => { S.online = !S.online; toast(S.online ? 'Listo. Te mostramos a pacientes que piden “lo antes posible” cerca.' : 'Ya no recibes pedidos para hoy. Tu agenda sigue igual.'); },
  key: d => { if (d === '<') S.code = S.code.slice(0, -1); else if (S.code.length < 4) S.code += d; },
  chk: k => { S.chk[k] = !S.chk[k]; },
  earn: () => { if (!S.paid) { S.earn += net(S.my.iny.p); S.done += 1; S.paid = true; } toast(`Ganaste ${clp(net(S.my.iny.p))}. Se deposita el martes.`); },
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
const mySvcs = () => Object.keys(S.my).filter(k => CAT[k].who.includes(S.prof));
const COMUNAS = [['Oriente', [['prov', 'Providencia'], ['nun', 'Ñuñoa'], ['lr', 'La Reina'], ['lc', 'Las Condes'], ['vit', 'Vitacura'], ['pen', 'Peñalolén']]], ['Centro y sur', [['stgo', 'Santiago'], ['mac', 'Macul'], ['sjo', 'San Joaquín'], ['flo', 'La Florida']]]];
const comTxt = () => COMUNAS.flatMap(g => g[1]).filter(c => S.com[c[0]]).map(c => c[1]);
const WEEK = [['lun', 'Lunes', '08:00 a 12:00 · 18:00 a 22:00'], ['mar', 'Martes', '08:00 a 12:00 · 18:00 a 22:00'], ['mie', 'Miércoles', '08:00 a 12:00 · 18:00 a 22:00'], ['jue', 'Jueves', '09:00 a 13:00 · 19:00 a 22:00'], ['vie', 'Viernes', '08:00 a 12:00 · 17:00 a 20:00'], ['sab', 'Sábado', '10:00 a 14:00'], ['dom', 'Domingo', '10:00 a 13:00']];

def({ id: 'R01', name: 'Postula como profesional', kind: 'page', noNav: true, back: true,
  body: () => `<div style="padding-top:8px">${logoImg('horizontal-color', 30)}</div><div class="h-xl mt24">Atiende pacientes a tu manera</div>
  <div class="t2 mt8">Para enfermeras, enfermeros y TENS con registro en la Superintendencia de Salud.</div>
  <div class="mt16">${row('box:currency-circle-dollar', 'Tú pones tus precios', 'Sobre un mínimo por servicio. Cuidapp cobra 15% solo cuando atiendes.', '', '')}
  ${row('box:calendar-blank', 'Tú eliges horarios y comunas', 'Las pacientes agendan solo en tus horas libres', '', '')}
  ${row('box:bank', 'Pago todos los martes', 'A tu CuentaRUT o cuenta corriente', '', '')}</div>`,
  foot: () => `${btn('Postular', 'R02')}${btn('Ya tengo cuenta', 'R16', 'ghost')}` });

def({ id: 'R02', name: 'Datos de la profesional', kind: 'page', back: true, noNav: true, title: 'Paso 1 de 2',
  body: () => `<div class="h-l">Tus datos</div>${lbl('Nombre completo')}${field('', 'Camila Rojas Vergara')}${lbl('RUT')}${field('', '18.903.442-K')}${lbl('Celular')}${field('', '+56 9 7712 3008')}
  ${lbl('Profesión')}<div class="chips">${chip('Enfermera/o', S.prof === 'enf', 'set', 'prof=enf')}${chip('TENS', S.prof === 'tens', 'set', 'prof=tens')}</div>
  <div class="mt16">${note('lock-simple', 'Tu celular no se muestra a las pacientes hasta que confirmas una reserva.')}</div>`,
  foot: () => btn('Continuar', 'R03') });

def({ id: 'R03', name: 'Documentos', kind: 'page', back: true, noNav: true, title: 'Paso 2 de 2',
  body: () => `<div class="h-l">Sube tus documentos</div><div class="t2 mt8 sm">Los revisamos en menos de 48 horas hábiles.</div>
  <div class="progress mt16"><span style="width:${Object.values(S.docs).filter(Boolean).length * 20}%"></span></div><div class="mt8">
  ${docRow('carnet', 'identification-card', 'Carnet de identidad', 'Ambos lados', 'R04')}
  ${docRow('selfie', 'user-focus', 'Selfie', 'Para comparar con tu carnet', 'R05')}
  ${docRow('titulo', 'graduation-cap', 'Título y registro SIS', 'Registro 482.317', 'R06')}
  ${docRow('antec', 'file-text', 'Certificado de antecedentes', 'Descargado del Registro Civil', '', 'antec')}
  ${docRow('banco', 'bank', 'Cuenta para pagos', 'BancoEstado CuentaRUT', 'R07')}</div>`,
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

def({ id: 'R07', name: 'Cuenta bancaria', kind: 'page', back: true, noNav: true, title: 'Cuenta para pagos',
  body: () => `${lbl('Banco')}${field('bank', 'BancoEstado')}${lbl('Tipo de cuenta')}<div class="chips">${chip('CuentaRUT', true, 'toast', 'CuentaRUT seleccionada.')}${chip('Corriente', false, 'toast', 'Puedes cambiarla después en tu perfil.')}${chip('Vista', false, 'toast', 'Puedes cambiarla después en tu perfil.')}</div>
  ${lbl('Número de cuenta')}${field('', '18903442')}${lbl('Titular')}${field('', 'Camila Rojas Vergara · 18.903.442-K')}
  <div class="mt16">${note('info', 'La cuenta debe estar a tu nombre.')}</div>`,
  foot: () => abtn('Guardar', 'doc', 'banco', '', 'R03') });

def({ id: 'R08', name: 'En revisión', kind: 'page', noNav: true, auto: 'R09', enter: () => T(() => go('R09'), 5000),
  body: () => `<div style="margin-top:40px">${ic('hourglass-medium', 1).replace('<i ', '<i style="font-size:56px;color:#1AA7EC" ')}</div><div class="h-l mt16">Estamos revisando tus documentos</div>
  <div class="t2 mt8">Te avisamos por SMS en menos de 48 horas hábiles. Mientras, puedes ir pensando tus precios y horarios.</div><div class="mt24">
  ${row('box:check', 'Documentos recibidos', 'Hoy 10:42', '', '')}${row('box:magnifying-glass', 'Revisión del registro SIS', 'En curso', '', st('inf', 'Revisando'))}${row('box:video-camera', 'Entrevista corta por videollamada', 'Después de la revisión', '', '')}</div>` });

def({ id: 'R09', name: 'Cuenta aprobada', kind: 'page', noNav: true,
  body: () => `<div style="margin-top:40px">${av('CR', 'l', true)}</div><div class="h-l mt16">Listo, Camila. Ya estás verificada</div>
  <div class="t2 mt8">Revisamos tu registro SIS 482.317: habilitada como Enfermera.</div>
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
  <button class="pill mt16" data-act="pick" data-arg="cr|" data-go="P12">${ic('eye')}Ver cómo me ven las pacientes</button>`; },
  foot: () => abtn('Publicar mi perfil', 'publish', '', '', 'R16') });

def({ id: 'R26', name: 'Foto y presentación', kind: 'page', back: true, title: 'Presentación',
  body: () => `<div style="display:flex;align-items:center;gap:16px">${av('CR', 'l', true)}<button class="pill" data-act="toast" data-arg="Foto actualizada.">${ic('camera')}Cambiar foto</button></div>
  ${lbl('Sobre ti')}<div class="field" style="height:auto;min-height:96px;align-items:flex-start;padding-top:12px"><span>${PRO('cr').bio}</span></div>
  ${lbl('Años de experiencia')}${field('', '6 años')}
  ${lbl('En qué tienes más experiencia')}<div class="chips">${[['am', 'Adulto mayor'], ['pd', 'Pie diabético'], ['ped', 'Pediatría'], ['pal', 'Cuidados paliativos']].map(x => chip(x[1], S.spec[x[0]], 'tog', 'spec.' + x[0])).join('')}</div>`,
  foot: () => abtn('Guardar', 'done', 'pres', '', 'back') });

def({ id: 'R11', name: 'Servicios y precios', kind: 'page', back: true, title: 'Servicios y precios',
  body: () => `<div class="t2 sm">Cuidapp define los servicios. Tú eliges cuáles haces, cuánto cobras y qué incluyes.</div><div class="mt8">
  ${mySvcs().map(k => { const m = S.my[k]; return `<div class="svcrow"><button class="tog ${m.on ? 'on' : ''}" data-act="svcOn" data-arg="${k}"></button>
  <button class="tx" data-act="edit" data-arg="${k}" data-go="R12"><div class="a">${CAT[k].n}</div><div class="b">${m.on ? `${m.dur} min · mínimo ${clp(S.mins[k])}${m.nOn ? ` · noche ${clp(m.night)}` : ''}` : 'No lo ofreces'}</div></button>
  <button class="end" data-act="edit" data-arg="${k}" data-go="R12">${m.on ? money(m.p) : ''}${ic('caret-right')}</button></div>`; }).join('')}</div>
  <div class="mt16">${note('info', `Cuidapp cobra ${S.comm}% de cada atención. El resto es tuyo y se deposita los martes.`)}</div>`,
  foot: () => abtn('Guardar', 'done', 'serv', '', 'back') });

def({ id: 'R12', name: 'Editar servicio y precio', kind: 'page', back: true, title: '',
  body: () => { const k = S.edit, m = S.my[k], min = S.mins[k]; return `<div class="h-l">${CAT[k].n}</div><div class="t2 sm mt4">${CAT[k].d}</div>
  ${lbl('Tu precio')}<div class="pricein"><button class="ib sbtn" data-act="pr" data-arg="-">${ic('minus')}</button><div class="v num">${clp(m.p)}</div><button class="ib sbtn" data-act="pr" data-arg="+">${ic('plus')}</button></div>
  <div class="pmeta"><span>Mínimo Cuidapp <b class="num">${clp(min)}</b></span><span>Promedio en Ñuñoa <b class="num">$19.500</b></span></div>
  <div class="mt8">${kv(`Tú recibes (Cuidapp cobra ${S.comm}%)`, `<b style="color:var(--text)">${clp(net(m.p))}</b>`)}</div>
  ${lbl('Duración de la atención')}<div class="chips">${[20, 30, 45, 60].map(v => chip(v + ' min', m.dur === v, 'dur', v)).join('')}</div>
  ${lbl('Qué incluye')}${Object.keys(INC).map(x => checkRow(INC[x], m.inc[x], 'inc', x)).join('')}
  ${field('', '', 'Agrega algo más (opcional)')}
  <button class="row" data-act="nOn"><span class="tx"><div class="a">Precio distinto de noche y feriados</div><div class="b">Desde las 21:00, domingos y feriados</div></span><span class="tog ${m.nOn ? 'on' : ''}"></span></button>
  ${m.nOn ? `<div class="pricein sm2"><button class="ib sbtn" data-act="npr" data-arg="-">${ic('minus')}</button><div class="v num">${clp(m.night)}</div><button class="ib sbtn" data-act="npr" data-arg="+">${ic('plus')}</button></div>` : ''}`; },
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

const reqRow = (r, i, a, b, p) => S.req[r] === 'new' ? row('box:' + i, a, b, 'R17', money(p)) : '';
def({ id: 'R16', name: 'Inicio profesional', kind: 'page', tab: 'inicio', next: ['R17'],
  body: () => { const pend = Object.values(S.req).filter(v => v === 'new').length; return `<div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px"><div><div class="h-l">Hola, Camila</div><div class="sm t2 mt4">★ 4,9 · ${S.done} atenciones esta semana</div></div><button class="weekchip2" data-go="R23"><span class="num">${clp(S.earn)}</span><span class="xs t2">esta semana</span></button></div>
  <div class="sec-t">Solicitudes por responder ${pend ? `<span class="cnt num">${pend}</span>` : ''}</div>
  ${pend ? `${reqRow('r1', 'syringe', 'Mar 27 · 08:00 · Inyección', 'Ñuñoa · Rosa M., 78 años · responde en 1 h 42 min', S.my.iny.p)}${reqRow('r2', 'test-tube', 'Mié 28 · 08:00 · Toma de muestras', 'Providencia · Andrea P. · responde en 1 h 10 min', S.my.mue.p)}` : `<div class="t2 sm mt8">No tienes solicitudes pendientes.</div>`}
  <div class="sec-t">Hoy</div>
  ${row('box:bandaids', '19:00 · Curación simple', 'Providencia · Jorge T. · confirmada', 'R18', money(S.my.cur.p))}
  ${row('box:heartbeat', '20:30 · Signos vitales', 'Ñuñoa · Carmen V. · confirmada', 'R18', money(S.my.sig.p))}
  <div class="asap2 mt16"><span class="tx"><b>Atender “lo antes posible” hoy</b><span class="sm t2">Opcional. Te llegan pedidos urgentes cerca mientras esté activo.</span></span><button class="tog ${S.online ? 'on' : ''}" data-act="online"></button></div>
  <div class="mt12">${row('box:storefront', 'Mi perfil público', '4 servicios · desde ' + clp(Math.min(...mySvcs().filter(k => S.my[k].on).map(k => S.my[k].p))) + ' · 4 comunas', 'R10')}</div>`; } });

def({ id: 'R17', name: 'Solicitud de reserva', kind: 'page', back: true, title: 'Nueva solicitud', auto: 'R18', autoAct: () => { S.req.r1 = 'ok'; },
  body: () => `<div class="sm t2">Agendada para</div><div class="h-l">Martes 27 oct · 08:00</div><div class="t2 sm mt4">Responde antes de 1 h 42 min o se libera la solicitud.</div>
  <div class="pbox mt16"><div><div class="sm t2">Tu precio</div><div class="price num">${clp(S.my.iny.p)}</div></div><div style="text-align:right"><div class="sm t2">Recibes</div><div class="h-m num">${clp(net(S.my.iny.p))}</div></div></div>
  <div class="mt8">${row('box:syringe', 'Inyección intramuscular', 'Neurobionta 5.000 · tiene el medicamento', '', '')}
  ${row('box:file-text', 'Receta adjunta', 'Dr. Andrés Valenzuela · 20/10/2026', '', st('ok', 'Se lee bien'))}
  ${row('box:map-pin', 'Ñuñoa · 1,8 km de tu casa', 'La dirección exacta aparece al aceptar', '', '')}
  ${row('box:user', 'Rosa Muñoz, 78 años', 'La pidió su hija, Daniela', '', '')}</div>
  <div class="mt8">${note('warning', '<b>Alergia a penicilina.</b>', 'warn')}</div>`,
  foot: () => `${abtn('Aceptar reserva', 'req', 'r1:ok', '', 'R18')}<div style="display:flex;gap:8px"><button class="btn sec" data-act="toast" data-arg="Le propusimos a Daniela el martes 27 a las 09:00.">Proponer otra hora</button><button class="btn danger" data-act="req" data-arg="r1:no" data-go="R16">Rechazar</button></div>` });

def({ id: 'R18', name: 'Detalle de la visita', kind: 'page', back: true, title: 'Reserva confirmada',
  body: () => `<div class="h-l">Rosa Muñoz</div><div class="t2 mt4">78 años · la pidió Daniela Fuentes (hija) · +56 9 8765 4321</div>
  <div class="mt16">${note('warning', '<b>Alergia a penicilina.</b>', 'warn')}</div>
  <div class="mt8">${row('box:calendar-check', 'Martes 27 oct · 08:00 a 08:30', 'Te recordamos 1 hora antes', '', '')}
  ${row('box:map-pin', 'Av. Irarrázaval 3450, depto 1204, torre B', 'Ñuñoa · Conserjería 24 h · estacionar en visitas', '', '')}
  ${row('box:syringe', 'Inyección intramuscular', 'El medicamento está en la casa (refrigerador)', '', '')}
  ${row('box:chat-circle', 'Escribir a Daniela', 'Chat de Cuidapp', '', ic('caret-right'), '', 'toast', 'Mensaje enviado: "Hola, nos vemos mañana a las 08:00".')}</div>
  <div class="sec-t">Receta</div><div class="mt8">${receta(true)}</div>`,
  foot: () => btn(ic('navigation-arrow', 1) + 'Ir a la dirección', 'R19') });

def({ id: 'R19', name: 'Navegación', kind: 'map', noNav: true, auto: 'R20',
  map: () => ({ home: G.mama, pro: G.route[0], nav: true, route: G.route, anim: { route: G.route, dur: 14000, tick: k => { const e = $('#nm'); if (e) e.textContent = Math.max(1, Math.round(9 * (1 - k))); } } }),
  float: () => `<div class="navbanner">${ic('arrow-bend-up-right', 1)}<div><div style="font-size:20px;font-weight:700">300 m</div><div style="opacity:.8;font-size:15px">Gira a la derecha en Av. Irarrázaval</div></div></div>`,
  body: () => `<div style="display:flex;align-items:center;justify-content:space-between"><div><div class="h-m"><span id="nm" class="num">9</span> min · 2,9 km</div><div class="sm t2 mt4">Llegas 07:58 · Irarrázaval 3450</div></div>${av('RM', 's')}</div>`,
  foot: () => `${btn('Llegué', 'R20')}<div style="display:flex;gap:8px"><button class="btn sec" data-act="toast" data-arg="Abriendo Waze…">${ic('map-trifold')}Waze</button><button class="btn sec" data-act="toast" data-arg="Llamando a Daniela…">${ic('phone')}Llamar</button></div>` });

def({ id: 'R20', name: 'Código y checklist', kind: 'page', back: true, title: 'Inicia la atención',
  body: () => `<div class="h-m">Pide el código a la paciente</div><div class="code mt16">${[0, 1, 2, 3].map(i => `<span class="${i === S.code.length ? 'f' : ''}">${S.code[i] || ''}</span>`).join('')}</div>
  ${S.code.length === 4 ? `<div class="mt8">${S.code === '2749' ? st('ok', 'Código correcto', 'check-circle') : st('bad', 'No coincide. Pídelo otra vez.', 'x-circle')}</div>` : ''}
  ${S.code === '2749' ? `<div class="sec-t">Antes de inyectar</div>${checkRow('Mostré mi credencial de Cuidapp', S.chk.id, 'chk', 'id')}${checkRow('Revisé la receta y el medicamento', S.chk.rec, 'chk', 'rec')}${checkRow('Pregunté por alergias (penicilina)', S.chk.ale, 'chk', 'ale')}`
    : `<div class="keys mt16">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '<'].map(k => k === '' ? '<span></span>' : `<button data-act="key" data-arg="${k}">${k === '<' ? ic('backspace') : k}</button>`).join('')}</div><button class="link sm mt12" data-act="set" data-arg="code=2749">Rellenar 2749</button>`}`,
  foot: () => abtn('Iniciar atención', '', '', '', 'R21', !(S.code === '2749' && S.chk.id && S.chk.rec && S.chk.ale)), auto: 'R21', autoAct: () => { S.code = '2749'; S.chk = { id: true, rec: true, ale: true }; } });

def({ id: 'R21', name: 'Cerrar atención', kind: 'page', title: 'Atención en curso',
  body: () => `<div class="t2">Comenzó 08:02 · Rosa Muñoz</div><div class="h-l mt8 num">00:12:40</div>
  ${lbl('¿Qué hiciste?')}${checkRow('Inyección IM de Neurobionta 5.000', true, 'toast', 'Procedimiento registrado.')}
  ${lbl('Zona')}<div class="chips">${chip('Glúteo derecho', true, 'toast', 'Zona registrada.')}${chip('Glúteo izquierdo', false, 'toast', 'Zona registrada.')}${chip('Deltoides', false, 'toast', 'Zona registrada.')}</div>
  ${lbl('Nota para la familia')}<div class="field" style="height:auto;min-height:72px;align-items:flex-start;padding-top:12px"><span>Sin reacción. Próxima dosis en 48 h según receta.</span></div>`,
  foot: () => abtn('Terminar atención', 'earn', '', '', 'R22') });

def({ id: 'R22', name: 'Calificar paciente', kind: 'page',
  body: () => `<div class="st ok" style="margin-top:12px">${ic('check-circle', 1)}+${clp(net(S.my.iny.p))}</div><div class="h-l mt16">Terminaste. ¿Cómo te fue?</div>
  <div class="t2 mt8">Califica a Daniela y Rosa. Ellas no ven tu nota.</div>
  <div class="stars mt24">${[1, 2, 3, 4, 5].map(n => `<button class="${S.pRating >= n ? 'on' : ''}" data-act="prate" data-arg="${n}">${ic('star', 1)}</button>`).join('')}</div>
  <div class="chips mt24" style="justify-content:center">${['Dirección clara', 'Amables', 'Tenían todo listo', 'Me esperaron abajo'].map(t => chip(t, S.pTags[t], 'ptag', t)).join('')}</div>`,
  foot: () => `${btn('Listo', 'R23')}${btn('Ver mi agenda', 'R24', 'sec')}` });

def({ id: 'R23', name: 'Ganancias', kind: 'page', tab: 'ganancias',
  body: () => { const d = [['M', 36000], ['M', 18000], ['J', 41400], ['V', 20000], ['S', 36600], ['D', 0], ['L', Math.max(0, S.earn - 152000)]]; const mx = 60000; const gross = Math.round(S.earn / (1 - S.comm / 100));
    return `<div class="sm t2 mt8">Semana del 20 al 26 oct</div><div class="price mt4" style="font-size:40px;line-height:46px">${clp(S.earn)}</div><div class="t2 sm mt4">${S.done} atenciones · para ti, ya descontada la comisión</div>
  <div class="bars mt24">${d.map((x, i) => `<div class="${i === 6 ? 'on' : ''}"><span style="height:${Math.max(4, x[1] / mx * 100)}%"></span>${x[0]}</div>`).join('')}</div>
  <div class="mt16">${kv('Cobrado a pacientes', clp(gross))}${kv(`Comisión Cuidapp (${S.comm}%)`, '−' + clp(gross - S.earn))}${kv('Para ti', clp(S.earn), 'tot')}</div>
  <div class="sec-t">Hoy</div>${S.paid ? row('box:syringe', 'Inyección · Ñuñoa', '08:14 · Rosa M.', '', money(net(S.my.iny.p))) : ''}
  ${row('box:bandaids', 'Curación · Providencia', '19:45 · Jorge T.', '', money(net(S.my.cur.p)))}
  <div class="mt16">${note('bank', 'Próximo depósito: martes 27 oct a BancoEstado CuentaRUT ••••3442.')}</div>`; } });

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
  <div class="mt16">${row('storefront', 'Ver mi perfil público', 'Como lo ven las pacientes', 'P12', ic('caret-right'), '', 'pick', 'cr|')}${row('user-circle', 'Foto y presentación', '', 'R26')}${row('currency-circle-dollar', 'Servicios y precios', `${mySvcs().filter(k => S.my[k].on).length} servicios`, 'R11')}${row('map-pin-area', 'Comunas', comTxt().join(', '), 'R13')}${row('calendar-blank', 'Horario semanal', 'Lun a sáb', 'R14')}
  ${row('identification-card', 'Documentos', 'Todos vigentes', 'R03', st('ok', 'Verificada', 'seal-check'))}${row('bank', 'Cuenta para pagos', 'BancoEstado CuentaRUT', 'R07')}${row('first-aid-kit', 'Pedir una atención para mí', 'Ir a la app de pacientes', 'P06')}${row('sign-out', 'Cerrar sesión', '', 'R01', '')}</div>` });
