/* ===== Paciente ===== */
Object.assign(ACT, {
  set: a => { const i = a.indexOf('='); const k = a.slice(0, i), v = a.slice(i + 1); S[k] = isNaN(+v) || v === '' ? v : +v; },
  tog: a => { const [o, k] = a.split('.'); if (k === undefined) S[o] = !S[o]; else S[o][k] = !S[o][k]; },
  svc: a => { S.item = a; S.when = 'prog'; },
  pick: a => { const [pro, d, t] = a.split('|'); S.pro = pro; S.when = 'prog'; if (d !== undefined && d !== '') { S.day = +d; S.slot = t; } else { const x = nextOf(PRO()); if (x) { S.day = x[0]; S.slot = x[1]; } } S.ptab = 'serv'; },
  day: d => { S.day = +d; const l = slotsOf(PRO(), +d); if (l.length && !l.includes(S.slot)) S.slot = l[0]; },
  asap: p => { S.when = 'ahora'; S.pro = p || 'pg'; if (!priceOf(PRO())) S.item = 'iny'; },
  consent: () => { S.consent = !S.consent; },
  receta: () => { S.receta = true; },
  toast: m => toast(m),
  send: () => { S.chat.push(S.booked ? 'Te espero abajo, gracias.' : 'Perfecto, gracias. Te agendo ahora.'); },
  rate: n => { S.rating = +n; },
  tag: t => { S.tags[t] = !S.tags[t]; },
  sent: () => { toast(`Gracias. ${first()} recibió tu calificación.`); S.hecho = true; },
  cancel: () => { toast(S.cancelFrom === 'P19' ? 'Solicitud cancelada. No se cobró nada.' : 'Reserva cancelada. Liberamos el monto retenido.'); S.booked = false; },
  inCourse: () => { S.phase = 'curso'; },
  book: () => { S.booked = true; },
  again: () => { S.when = 'prog'; S.day = 2; S.slot = slotsOf(PRO(), 2)[0] || '08:00'; },
});
const R = n => `<span class="num">${clp(n)}</span>`;
const sis = () => `<span class="sis">${ic('seal-check', 1)}Registro SIS verificado</span>`;
const proCard = (big, phone) => { const p = PRO(); return `<div class="procard">${av(p.i, big ? 'l' : '', true)}<div style="flex:1;min-width:0"><div class="h-s">${p.n}</div><div class="sm t2">${p.t} · Registro SIS ${p.reg}</div><div class="sm mt4"><span style="font-weight:600">★ ${p.r}</span> <span class="t2">· ${p.a} atenciones${phone ? ` · ${p.tel}` : ''}</span></div></div></div>`; };
const svcTiles = (list, h) => list.map(k => `<button class="tile" ${h ? `style="height:${h}px"` : ''} data-act="svc" data-arg="${k}" data-go="P08">${ic(CAT[k].ic)}<span class="n">${CAT[k].s}</span></button>`).join('');

// tarjeta del catálogo de profesionales
const pcard = (pr, wide) => {
  const p = priceOf(pr), nx = nextSlots(pr, wide ? 4 : 3), inc = incOf(pr);
  return `<div class="pcard"><button class="ptop" data-act="pick" data-arg="${pr.id}|" data-go="P12">${av(pr.i, '', true)}
   <span class="tx"><span class="b-m" style="font-weight:600">${pr.n}</span><span class="sm t2">${pr.t} · ${String(pr.km).replace('.', ',')} km</span>
   <span class="sm"><b style="font-weight:600">★ ${pr.r}</b> <span class="t2">(${pr.a} atenciones)</span></span></span>
   <span class="pp"><span class="price-s num">${clp(p)}</span><span class="xs t2">${durOf(pr)} min</span></span></button>
   <div class="sis-row">${sis()}${nightOf(pr) ? `<span class="xs t2">Noche: ${clp(nightOf(pr))}</span>` : ''}</div>
   <div class="inc sm t2">${ic('check')}<span>${inc.slice(0, 2).join(' · ')}</span></div>
   <div class="nslots">${nx.length ? `<span class="nd">${dayShort(nx[0][0])}</span>${nx.filter(x => x[0] === nx[0][0]).map(x => `<button class="spill" data-act="pick" data-arg="${pr.id}|${x[0]}|${x[1]}" data-go="P13">${x[1]}</button>`).join('')}` : '<span class="sm t3">Sin horas esta semana</span>'}</div></div>`;
};
const sortChips = () => `<div class="hscroll">${[['rec', 'Recomendadas'], ['pre', 'Menor precio'], ['rat', 'Mejor nota'], ['pro', 'Más pronto']].map(x => chip(x[1], S.sort === x[0], 'set', 'sort=' + x[0])).join('')}</div>`;

def({ id: 'P01', name: 'Ingreso', kind: 'page', noNav: true,
  body: () => `<div style="padding-top:40px">${logoImg('simbolo-color', 64)}</div>
  <div class="h-l mt24">Atención de salud en tu casa</div><div class="t2 mt8">Elige a tu enfermera o TENS verificada y agenda a la hora que te acomode.</div>
  ${lbl('Tu celular')}<div style="display:flex;gap:8px"><div class="field" style="width:96px;flex:none">🇨🇱&nbsp;+56</div>${field('', '9 8765 4321', '', 'focus')}</div>`,
  foot: () => `${btn('Continuar', 'P02')}
  <div style="display:flex;align-items:center;gap:12px;margin:6px 0" class="t3 sm"><span style="flex:1;height:1px;background:var(--border)"></span>o<span style="flex:1;height:1px;background:var(--border)"></span></div>
  ${btn(ic('apple-logo', 1) + 'Continuar con Apple', 'P02', 'sec')}${btn(ic('google-logo', 1) + 'Continuar con Google', 'P02', 'sec')}
  <button class="btn ghost sm" data-go="R01" style="font-size:15px">¿Eres enfermera o TENS? <span class="link" style="margin-left:4px">Postula aquí</span></button>
  <div class="xs t3" style="text-align:center">Al continuar aceptas los Términos y la Política de privacidad de Cuidapp.</div>` });

def({ id: 'P02', name: 'Código SMS', kind: 'page', back: true, noNav: true,
  body: () => `<div class="h-l mt8">Ingresa el código</div><div class="t2 mt8">Te lo enviamos por SMS al +56 9 8765 4321.</div>
  <div class="code mt24">${'4816'.split('').map((d, i) => `<span class="${i === 3 ? 'f' : ''}">${d}</span>`).join('')}</div>
  <div class="t2 sm mt16">Reenviar código en <span class="num">0:24</span></div>
  <button class="pill mt16" data-go="back">${ic('pencil-simple')}Cambiar número</button>`,
  foot: () => btn('Continuar', 'P03') });

def({ id: 'P03', name: 'Tus datos', kind: 'page', back: true, noNav: true, title: '',
  body: () => `<div class="h-l">Cuéntanos de ti</div><div class="t2 mt8">Los pedimos una vez. Van en tu boleta.</div>
  ${lbl('Nombre y apellidos')}${field('', 'Daniela Fuentes Muñoz')}
  ${lbl('RUT')}${field('', '17.482.913-5')}
  ${lbl('Correo')}${field('', 'daniela.fuentes@gmail.com')}
  ${lbl('Previsión')}<div class="chips">${chip('Fonasa', S.prev === 'fonasa', 'set', 'prev=fonasa')}${chip('Isapre', S.prev === 'isapre', 'set', 'prev=isapre')}${chip('Particular', S.prev === 'part', 'set', 'prev=part')}</div>`,
  foot: () => btn('Continuar', 'P04') });

def({ id: 'P04', name: 'Consentimiento de datos de salud', kind: 'page', back: true, noNav: true,
  body: () => `${ic('shield-check', 1).replace('<i ', '<i style="font-size:44px;color:#1AA7EC" ')}<div class="h-l mt12">Tus datos de salud son tuyos</div>
  <div class="mt8">${row('box:stethoscope', 'Para qué los usamos', 'Para que la profesional sepa qué hacer y para enviar tus exámenes al laboratorio aliado.', '', '')}
  ${row('box:eye', 'Quién los ve', 'Solo la profesional que agendas y el equipo clínico de Cuidapp.', '', '')}
  ${row('box:trash', 'Cuánto tiempo', 'Mientras tengas cuenta. Puedes pedir que los borremos cuando quieras.', '', '')}</div>
  <div class="hr"></div>${checkRow('Autorizo a Cuidapp a tratar mis datos de salud para coordinar mi atención, según la Ley 19.628.', S.consent, 'consent', '')}`,
  foot: () => abtn('Aceptar y seguir', '', '', '', 'P05', !S.consent) });

def({ id: 'P05', name: 'Permiso de ubicación', kind: 'map', noNav: true, map: () => ({ me: G.casa, zoom: 15 }),
  body: () => `<div class="h-m">Activa tu ubicación</div><div class="t2 mt8">Así te mostramos las profesionales que atienden en tu comuna.</div>`,
  foot: () => `${btn('Permitir ubicación', 'P06')}${btn('Escribir mi dirección', 'P08', 'sec')}` });

const nearDots = () => [[[-33.4268, -70.6123]], [[-33.4205, -70.5985]], [[-33.4282, -70.5952]], [[-33.4405, -70.6010]], [[-33.4330, -70.6190]]];
def({ id: 'P06', name: 'Inicio', kind: 'map', tab: 'inicio', map: () => ({ me: G.casa, dots: nearDots(), zoom: 14.25 }),
  body: () => `<button class="search" data-go="P07">${ic('magnifying-glass', 0)}¿Qué necesitas?<span class="when">${ic('calendar-blank', 1)}Agendar</span></button>
  ${S.booked ? `<div class="mt8">${row('box:calendar-check', `${dayShort(S.day)}, ${S.slot} · ${PRO().n}`, `${CAT[S.item].n} · confirmada`, 'P27', '', '', 'set', 'det=next')}</div>` : ''}
  <div class="tiles2 mt12">${svcTiles(['iny', 'cur', 'mue'], 84)}</div>
  <button class="asap mt12" data-act="asap" data-arg="pg" data-go="P31"><span class="dot"></span><span class="tx"><b>¿La necesitas hoy?</b><span class="sm t2">2 profesionales disponibles ahora cerca de ti</span></span>${ic('caret-right')}</button>` });

def({ id: 'P07', name: 'Servicios', kind: 'page', tab: 'servicios',
  body: () => `<div class="h-xl mt8">Servicios</div><div class="t2 mt4 sm">Elige el servicio y te mostramos quién lo hace cerca de ti, con su precio.</div><div class="sec-t">Enfermería y TENS</div>
  <div class="grid mt8">${svcTiles(['iny', 'cur', 'cura', 'mue', 'sig', 'son', 'tens4'])}</div>
  <div class="sec-t">Muy pronto</div><div class="grid mt8"><div class="tile dim"><span class="tag">Pronto</span>${ic('person-simple-walk')}<span class="n">Kinesiología</span></div><div class="tile dim"><span class="tag">Pronto</span>${ic('pill')}<span class="n">Farmacia</span></div><div class="tile dim"><span class="tag">Pronto</span>${ic('flask')}<span class="n">Laboratorios</span></div></div>
  <div class="mt24">${note('info', 'Cada profesional pone su precio y dice qué incluye. Lo ves antes de agendar y pagas en la app.')}</div>` });

def({ id: 'P08', name: 'Buscar dirección', kind: 'page', back: true, title: 'Dirección de la atención',
  body: () => `${field('magnifying-glass', 'Irarrázaval 34', '', 'focus')}
  <div class="mt8">${row('box:map-pin', 'Av. Irarrázaval 3450', 'Ñuñoa, Santiago', 'P09', '', '', 'set', 'addr=mama')}
  ${row('box:map-pin', 'Av. Irarrázaval 3400', 'Ñuñoa, Santiago', 'P09', '', '', 'set', 'addr=mama')}
  ${row('box:map-pin', 'Av. Irarrázaval 3499', 'Ñuñoa, Santiago', 'P09', '', '', 'set', 'addr=mama')}</div>
  <div class="sec-t">Guardadas</div>
  ${row('box:house', 'Casa', 'Los Leones 1180, Providencia', 'P09', '', '', 'set', 'addr=casa')}
  ${row('box:heart', 'Mamá', 'Av. Irarrázaval 3450, Ñuñoa', 'P09', '', '', 'set', 'addr=mama')}
  ${row('box:crosshair', 'Fijar en el mapa', '', 'P09')}` });

def({ id: 'P09', name: 'Confirmar domicilio', kind: 'map', back: true, map: () => ({ home: P().ll, homeLabel: 'La profesional llega aquí', zoom: 17 }), next: ['P10', 'P31'],
  body: () => `<div class="h-s" style="text-align:center">Confirma el domicilio</div><div class="b-m mt12">${P().n}</div><div class="t2 sm">${P().c}, Santiago</div>
  ${lbl('Depto, casa o block')}${field('', S.addr === 'mama' ? 'Depto 1204, torre B' : 'Depto 52')}
  ${lbl('Indicaciones para llegar')}${field('', S.addr === 'mama' ? 'Conserjería abierta 24 h. Estacionar en visitas.' : 'Timbre 52. Portón negro.')}`,
  foot: () => `<button class="btn" data-go="${S.when === 'ahora' ? 'P31' : 'P10'}">${S.when === 'ahora' ? 'Confirmar domicilio' : 'Ver profesionales'}</button>` });

def({ id: 'P10', name: 'Profesionales cerca (catálogo)', kind: 'page', back: true,
  title: '', body: () => { const l = prosFor(); return `<div class="h-m">${CAT[S.item].n}</div>
  <button class="addr-l mt4" data-go="P08">${ic('map-pin', 1)}<span>${P().n}, ${P().c}</span>${ic('caret-down')}</button>
  <div class="sortbar mt12"><button class="pill flt ico" data-go="P11" aria-label="Filtros">${ic('sliders-horizontal')}</button>${sortChips()}</div>
  <div class="sm t2 mt12">${l.length} profesionales atienden en ${P().c}</div>
  ${CAT[S.item].receta ? `<div class="mt8">${note('file-text', 'Para inyecciones necesitas una foto de la receta médica. La subes al agendar.')}</div>` : ''}
  <div class="plist mt8">${l.map(p => pcard(p)).join('')}</div>
  <div class="xs t3 mt12" style="text-align:center">Profesionales y precios de ejemplo para el prototipo.</div>`; } });

def({ id: 'P11', name: 'Filtros', kind: 'page', back: 'x', title: 'Filtros',
  body: () => `${lbl('Profesión')}<div class="chips">${chip('Enfermera/o', S.f.enf, 'tog', 'f.enf')}${chip('TENS', S.f.tens, 'tog', 'f.tens')}</div>
  ${lbl('Precio máximo')}<div class="chips">${[[0, 'Sin límite'], [15000, '$15.000'], [20000, '$20.000'], [25000, '$25.000']].map(x => chip(x[1], S.fmax === x[0], 'set', 'fmax=' + x[0])).join('')}</div>
  ${lbl('Disponibilidad')}<div class="chips">${chip('Hoy o mañana', S.fday === 'man', 'set', 'fday=man')}${chip('Esta semana', S.fday === 'sem', 'set', 'fday=sem')}</div>
  ${lbl('Nota')}${checkRow('Solo 4,8 o más', S.frat, 'tog', 'frat')}
  <div class="mt16">${note('seal-check', 'Todas las profesionales de Cuidapp tienen su registro verificado en la Superintendencia de Salud.')}</div>`,
  foot: () => `${btn(`Ver ${prosFor().length} profesionales`, 'back')}${abtn('Limpiar filtros', 'set', 'fmax=0', 'ghost')}` });

const svcRows = (pr, icons) => Object.keys(CAT).filter(k => priceOf(pr, k)).map(k => `<button class="opt ${S.item === k ? 'sel' : ''}" data-act="svc" data-arg="${k}">${icons ? `<span class="im">${ic(CAT[k].ic)}</span>` : ''}<span class="tx"><div class="b-m">${CAT[k].n}</div><div class="sm t2">${durOf(pr, k)} min · ${incOf(pr, k).includes(INC.ins) ? 'Insumos incluidos' : 'Sin insumos'}</div>${nightOf(pr, k) ? `<div class="sm t2">Noche y feriados: ${clp(nightOf(pr, k))}</div>` : ''}</span><span class="pr">${clp(priceOf(pr, k))}</span></button>`).join('');
const reviews = () => `<div style="display:flex;align-items:baseline;gap:8px"><span class="price num">${PRO().r}</span><span class="t2">★ · ${Math.round(PRO().a * .7)} reseñas</span></div>
  ${[['Carolina M.', 'hace 1 semana', 'Súper puntual y muy cariñosa con mi papá. Le explicó todo con paciencia.'], ['Jorge T.', 'hace 3 semanas', 'Curación impecable. Dejó todo limpio y anotado.'], ['Marcela P.', 'hace 1 mes', 'La agendé para la Neurobionta de mi mamá. Llegó a la hora y no dolió nada.']].map(r => `<div class="rev"><div style="display:flex;justify-content:space-between"><b style="font-weight:600">${r[0]}</b><span class="xs t3">${r[1]}</span></div><div class="stars-s">★★★★★</div><div class="sm">${r[2]}</div></div>`).join('')}`;
const about = () => `<div class="sm" style="line-height:21px">${PRO().bio}</div>
  ${lbl('Comunas donde atiende')}<div class="sm t2">${PRO().com}</div>
  ${lbl('Verificaciones de Cuidapp')}${row('box:seal-check', `Registro SIS ${PRO().reg}`, `${PRO().t} habilitada`, '', '')}${row('box:identification-card', 'Identidad y antecedentes', 'Revisados', '', '')}`;
def({ id: 'P12', name: 'Perfil de la profesional', kind: 'page', back: true, next: ['P13', 'P22'],
  body: () => { const p = PRO(); return `<div style="display:flex;gap:16px;align-items:center">${av(p.i, 'l', true)}<div style="min-width:0"><div class="h-m">${p.n}</div><div class="sm t2">${p.t} · ${p.yrs} años de experiencia</div><div class="mt4">${sis()}</div></div></div>
  <div class="stats mt16"><div><b class="num">★ ${p.r}</b><span>nota</span></div><div><b class="num">${p.a}</b><span>atenciones</span></div><div><b class="num">${String(p.km).replace('.', ',')} km</b><span>de ${P().c}</span></div></div>
  <div class="ptabs mt16">${[['serv', 'Servicios'], ['rev', 'Reseñas'], ['about', 'Sobre ella']].map(t => `<button class="${S.ptab === t[0] ? 'on' : ''}" data-act="set" data-arg="ptab=${t[0]}">${t[1]}</button>`).join('')}</div>
  <div class="mt12">${S.ptab === 'serv' ? `${svcRows(p)}<div class="sec-t">Qué incluye</div>${incOf(p).map(t => `<div class="row" style="min-height:36px;padding:4px 0">${ic('check')}<span class="tx sm" style="font-size:15px">${t}</span></div>`).join('')}` : S.ptab === 'rev' ? reviews() : about()}</div>
  <div class="mt16">${note('lock-simple', `Su teléfono aparece cuando confirma tu reserva. Antes, pregúntale lo que quieras por el chat de Cuidapp.`)}</div>`; },
  foot: () => `<div style="display:flex;gap:8px"><button class="btn sec" style="flex:0 0 auto;width:auto;padding:0 18px;height:56px" data-go="P22">${ic('chat-circle')}Preguntar</button><button class="btn" data-go="P13">Agendar · ${R(priceOf(PRO()))}</button></div>` });

const dayCards = () => `<div class="dcards">${DAYS.map((d, i) => { const n = slotsOf(PRO(), i).length; return n ? `<button class="dcard ${S.day === i ? 'on' : ''}" data-act="day" data-arg="${i}"><span class="xs">${d[2] || d[0]}</span><b>${d[1]}</b><span class="xs">${n} ${n === 1 ? 'hora' : 'horas'}</span></button>` : `<div class="dcard off"><span class="xs">${d[2] || d[0]}</span><b>${d[1]}</b><span class="xs">Sin horas</span></div>`; }).join('')}</div>`;
const slotGrid = () => `<div class="slots3 mt8">${slotsOf(PRO(), S.day).map(t => `<button class="slot ${S.slot === t ? 'on' : ''}" data-act="set" data-arg="slot=${t}">${t}${t >= '21:00' && nightOf(PRO()) ? '<span class="xs" style="display:block;font-weight:500;opacity:.75">noche</span>' : ''}</button>`).join('')}</div>`;
const slotNotes = () => `${S.slot >= '21:00' && nightOf(PRO()) ? note('moon', `Horario nocturno: ${first()} cobra ${clp(nightOf(PRO()))} desde las 21:00.`) : ''}
  ${note('calendar-check', `Llega entre ${S.slot} y ${slotEnd(S.slot)}. Cancelación gratis hasta 12 horas antes.`)}`;
def({ id: 'P13', name: 'Elegir día y hora', kind: 'page', back: true, title: 'Día y hora',
  body: () => `<div class="procard">${av(PRO().i, 's')}<div><div class="b-m">${PRO().n}</div><div class="sm t2">${CAT[S.item].n} · ${durOf(PRO())} min</div></div></div>
  <div class="sec-t">Elige el día</div>${dayCards()}
  <div class="sec-t">Hora de llegada</div>${slotGrid()}
  <div class="mt16" style="display:flex;flex-direction:column;gap:8px">${slotNotes()}</div>`,
  foot: () => btn(`Continuar · ${R(price().pro)}`, 'P14') });

function nextAfterP14() { return S.item === 'mue' ? 'P16' : CAT[S.item].receta ? 'P15' : 'P17'; }
def({ id: 'P14', name: 'Detalles de la atención', kind: 'page', back: true, title: 'Detalles', next: ['P15', 'P16', 'P17'],
  body: () => {
    const who = `${lbl('¿Para quién?')}${row('box:user', whoTxt(), S.who === 'mama' ? '78 años · Alergia a penicilina' : S.who === 'papa' ? '80 años · Hipertenso' : '37 años', 'P29', 'Cambiar')}`;
    const head = `<div class="h-l">${CAT[S.item].n}</div><div class="t2 mt4 sm">Con ${PRO().n} · ${whenTxt()}</div>`;
    if (S.item === 'mue') return `${head}<div class="t2 mt8 sm">${first()} lleva la muestra al laboratorio aliado el mismo día.</div>
      ${lbl('Exámenes')}${Object.keys(EXAMS).map(k => checkRow(EXAMS[k][0], S.exams[k], 'tog', 'exams.' + k, clp(EXAMS[k][1]) + ' · precio del laboratorio')).join('')}${who}`;
    if (S.item === 'tens4') return `${head}${lbl('¿Qué necesita?')}<div class="chips">${[['hig', 'Higiene y baño'], ['mov', 'Movilización'], ['sig', 'Signos vitales'], ['com', 'Compañía']].map(t => chip(t[1], S.tensNeeds[t[0]], 'tog', 'tensNeeds.' + t[0])).join('')}</div>
      ${lbl('Algo que deba saber')}${field('', 'Usa andador. Diabética, controla glicemia en la mañana.')}${who}`;
    if (S.item === 'iny') return `${head}${lbl('Medicamento')}${field('pill', 'Neurobionta 5.000 (ampolla)')}${lbl('¿Ya tienes el medicamento?')}<div class="chips">${chip('Sí, lo tengo', S.hasMed, 'set', 'hasMed=1')}${chip('No', !S.hasMed, 'set', 'hasMed=')}</div>
      ${!S.hasMed ? `<div class="mt12">${note('warning', 'La profesional no lleva medicamentos. Cómpralo antes de la hora de la atención.', 'warn')}</div>` : ''}${who}`;
    return `${head}${lbl('Cuéntanos qué necesitas')}${field('', S.item === 'son' ? 'Cambio de sonda Foley.' : S.item === 'sig' ? 'Control de presión y glicemia.' : 'Herida en el talón, curación cada 2 días.')}${who}`;
  },
  foot: () => `<button class="btn" data-go="${nextAfterP14()}">Continuar</button>` });

def({ id: 'P15', name: 'Foto de la receta', kind: 'page', back: true, title: 'Receta médica',
  body: () => `<div class="h-m">Sube la receta médica</div><div class="t2 mt8 sm">Sin receta no se ponen inyecciones. ${first()} la revisa antes de confirmar.</div>
  <div class="mt16">${S.receta ? `<div style="display:flex;gap:12px;align-items:flex-start">${receta()}<div>${st('ok', 'Se lee bien', 'check-circle')}<button class="pill mt12" data-act="set" data-arg="receta=">${ic('arrow-counter-clockwise')}Cambiar</button></div></div>`
    : `<div style="border:2px dashed #CFCFCF;border-radius:12px;height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px"><div style="display:flex;gap:8px"><button class="pill on" data-act="receta">${ic('camera')}Tomar foto</button><button class="pill" data-act="receta">${ic('image')}Elegir de fotos</button></div><div class="t3 sm">Foto completa, derecha y con luz</div></div>`}</div>
  <div class="sec-t">Revisa que se vea</div>
  ${['Nombre del paciente', 'Medicamento, dosis y frecuencia', 'Firma y timbre del médico', 'Fecha (vigente, menos de 6 meses)'].map(t => `<div class="row" style="min-height:40px;padding:6px 0">${ic('check')}<span class="tx sm" style="font-size:15px">${t}</span></div>`).join('')}`,
  foot: () => abtn('Continuar', '', '', '', 'P17', !S.receta) });

def({ id: 'P16', name: 'Orden médica y preparación', kind: 'page', back: true, title: 'Orden médica',
  body: () => `<div class="h-m">¿Tienes orden médica?</div><div class="t2 sm mt8">No es obligatoria, pero sirve para Fonasa o tu isapre.</div>
  <div class="mt8">${radioRow('Subir foto de la orden', S.orden === 'si' ? 'Orden de la Dra. Marcela Ortiz · 18/10/2026' : 'Foto o PDF', S.orden === 'si', 'set', 'orden=si', 'file-arrow-up')}
  ${radioRow('No tengo orden', 'Igual te tomamos los exámenes', S.orden === 'no', 'set', 'orden=no', 'file-x')}</div>
  ${S.orden === 'si' ? `<div class="mt8">${orden()}</div>` : ''}
  <div class="sec-t">Preparación</div>
  ${row('box:clock-countdown', 'Ayuno de 8 horas', 'Solo puedes tomar agua', '', '')}
  ${row('box:identification-card', 'Ten a mano el carnet', 'De la persona que se toma el examen', '', '')}
  ${row('box:envelope-simple', 'Resultados en 24 a 48 horas', 'Llegan a tu correo y a la app', '', '')}`,
  foot: () => abtn('Continuar', '', '', '', 'P17', !S.orden) });

const breakdown = () => { const p = price(); return `${p.L.map(l => kv(l[0], clp(l[1]))).join('')}${kv('Total', clp(p.total), 'tot')}`; };
def({ id: 'P17', name: 'Revisa y paga', kind: 'page', back: true, title: 'Revisa tu reserva',
  body: () => `${proCard()}<div class="mt8">
  ${row('box:' + CAT[S.item].ic, CAT[S.item].n, S.item === 'iny' ? 'Neurobionta 5.000 · receta adjunta' : `${durOf(PRO())} min`, '', '')}
  ${row('box:clock', whenTxt(), S.when === 'ahora' ? 'Lo antes posible' : 'Agendada', S.when === 'ahora' ? 'P31' : 'P13', 'Cambiar')}
  ${row('box:map-pin', P().n, P().full.split(', ').slice(1).join(', '), 'P09', 'Cambiar')}
  ${row('box:user', whoTxt(), S.who === 'mama' ? 'Alergia a penicilina' : '', 'P29', 'Cambiar')}
  ${row('box:' + (S.pay === 'mp' ? 'wallet' : 'credit-card'), S.pay === 'mp' ? 'Mercado Pago' : 'Visa •••• 4821', 'Pago dentro de la app', 'P18', 'Cambiar')}</div>
  <div class="sec-t">Desglose</div>${breakdown()}
  <div class="xs t2 mt4">El precio lo fija ${first()}. Sin cobros extra.</div>
  <div class="mt12" style="display:flex;flex-direction:column;gap:8px">${note('lock-simple', `No te cobramos todavía. Cuando ${first()} confirme, retenemos ${clp(price().total)} en tu tarjeta y se cobra al terminar la atención.`, 'inf')}
  ${note('calendar-x', S.when === 'ahora' ? 'Puedes cancelar gratis hasta que salga hacia tu casa.' : 'Cancelación gratis hasta 12 horas antes.')}</div>`,
  foot: () => `<button class="btn" data-go="P19" data-act="set" data-arg="cancelFrom=P19"><span>Solicitar reserva</span><span class="num" style="opacity:.7">· ${clp(price().total)}</span></button>` });

def({ id: 'P18', name: 'Métodos de pago', kind: 'page', back: true, title: 'Pago',
  body: () => `${radioRow('Visa •••• 4821', 'Crédito · vía Webpay', S.pay === 'visa', 'set', 'pay=visa', 'credit-card')}
  ${radioRow('Redcompra •••• 0937', 'Débito · vía Webpay', S.pay === 'deb', 'set', 'pay=deb', 'credit-card')}
  ${radioRow('Mercado Pago', 'daniela.fuentes@gmail.com', S.pay === 'mp', 'set', 'pay=mp', 'wallet')}
  ${row('box:plus', 'Agregar tarjeta', 'Débito o crédito', '', ic('caret-right'), '', 'toast', 'Se abre Webpay para agregar tu tarjeta.')}
  <div class="mt16">${note('shield-check', 'Cuidapp no guarda los números de tu tarjeta. Los procesa Transbank.')}</div>`,
  foot: () => btn('Listo', 'back') });

def({ id: 'P19', name: 'Esperando confirmación', kind: 'page', auto: 'P20', autoAct: () => { S.booked = true; },
  body: () => `<div style="margin-top:24px">${av(PRO().i, 'l', true)}</div><div class="h-l mt16">Le enviamos tu solicitud a ${first()}</div>
  <div class="t2 mt8">Suele responder en 20 minutos. Tiene hasta 2 horas; si no puede, te avisamos y eliges a otra.</div>
  <div class="progress bar-anim mt16"><span></span></div>
  <div class="mt16">${row('box:check', 'Solicitud enviada', `${CAT[S.item].n} · ${whenTxt()}`, '', '')}${row('box:hourglass-medium', `${first()} revisa tu solicitud`, S.item === 'iny' ? 'También revisa la receta' : 'Y confirma la hora', '', st('inf', 'En curso'))}${row('box:lock-simple', 'Aún no te cobramos nada', `Retenemos ${clp(price().total)} cuando confirme`, '', '')}</div>`,
  foot: () => `${btn('Ir al inicio', 'P06', 'sec')}${btn('Cancelar solicitud', 'P30', 'ghost')}`, enter: () => T(() => { S.booked = true; go('P20'); }, 4500) });

def({ id: 'P20', name: 'Reserva confirmada', kind: 'page', next: ['P21'],
  body: () => `<div class="okc">${ic('check', 0).replace('ph ', 'ph-bold ')}</div>
  <div class="h-l mt16">${first()} confirmó tu atención</div><div class="t2 mt8">${whenLong()}</div>
  <div class="mt16">${proCard(false, true)}</div>
  <div class="mt12">${row('box:map-pin', P().n, P().full.split(', ').slice(1).join(', '), '', '')}${row('box:' + CAT[S.item].ic, CAT[S.item].n, whoTxt(), '', '')}${row('box:lock-simple', `Retuvimos ${clp(price().total)} en tu ${S.pay === 'mp' ? 'Mercado Pago' : 'Visa •••• 4821'}`, 'Se cobra al terminar la atención', '', '')}</div>
  <div style="display:flex;gap:8px" class="mt12"><button class="btn sec" data-go="P22">${ic('chat-circle')}Mensaje</button><button class="btn sec" data-act="toast" data-arg="Agregado a tu calendario.">${ic('calendar-plus')}Calendario</button></div>`,
  foot: () => `${abtn('Ver mis reservas', 'book', '', '', 'P26')}${btn('Ver el día de la atención', 'P21', 'ghost')}` });

const trackBody = () => `<div style="display:flex;align-items:baseline;justify-content:space-between"><div class="h-m">Llega en <span id="eta" class="num">${P().min + 3}</span> min</div><span class="sm t2">${S.when === 'ahora' ? 'Hoy' : dayShort(S.day) + ' · ' + S.slot}</span></div>
  <div class="progress mt12"><span id="etabar" style="width:4%"></span></div>
  <div class="mt16">${proCard(false, true)}</div>
  <div class="note inf mt12">${ic('key')}<div>Tu código es <b class="num" style="font-size:17px;letter-spacing:2px">2749</b>. Dáselo a ${first()} cuando llegue.</div></div>
  <div style="display:flex;gap:8px" class="mt12"><button class="btn sec" data-go="P22">${ic('chat-circle')}Mensaje</button><button class="btn sec" data-act="toast" data-arg="Llamando a ${first()}…">${ic('phone')}Llamar</button><button class="btn sec" data-act="toast" data-arg="Link copiado. Mándaselo a tu familia por WhatsApp.">${ic('share-network')}Compartir</button></div>
  <button class="btn ghost mt8" style="color:var(--danger)" data-act="set" data-arg="cancelFrom=P21" data-go="P30">Cancelar atención</button>`;
const trackMap = () => ({ home: P().ll, pro: P().route[0], route: P().route, anim: { route: P().route, dur: 16000, tick: k => { const e = $('#eta'); if (e) e.textContent = Math.max(1, Math.round((P().min + 3) * (1 - k))); const b = $('#etabar'); if (b) b.style.width = Math.max(4, k * 100) + '%'; }, end: () => { S.phase = 'llego'; go('P23'); } } });
def({ id: 'P21', name: 'Día de la atención: en camino', kind: 'map', auto: 'P23', autoAct: () => { S.phase = 'llego'; }, map: trackMap, body: trackBody });

def({ id: 'P22', name: 'Chat con la profesional', kind: 'page', back: true,
  body: () => `<div class="procard" style="padding:4px 0 12px">${av(PRO().i, 's')}<div><div class="b-m">${PRO().n}</div><div class="sm t2">${PRO().t} · ${S.booked ? whenTxt() : 'responde en ~20 min'}</div></div></div>
  ${note('shield', S.booked ? 'Por tu seguridad, no compartas datos de tarjetas ni claves.' : 'Paga siempre por la app: así tu reserva queda protegida. Su teléfono aparece al confirmar.')}
  ${S.booked ? `<div class="ts">${dayShort(S.day)} 07:41</div>
  <div class="bubble they">Hola Daniela, soy ${first()}. Voy en camino, llego a las ${S.slot}.</div>
  <div class="bubble me">Hola, gracias. Es el depto 1204, torre B. El conserje sabe.</div>
  <div class="bubble they">Perfecto. ¿La Neurobionta está en el refri?</div><div class="bubble me">Sí, ahí está.</div>`
    : `<div class="ts">Hoy 20:52</div><div class="bubble me">Hola ${first()}, ¿llevas tú la jeringa y las tórulas?</div>
  <div class="bubble they">Hola Daniela. Sí, llevo todo. Solo ten el medicamento y la receta a mano.</div>`}${S.chat.map(c => `<div class="bubble me">${c}</div>`).join('')}`,
  foot: () => `<div style="display:flex;gap:8px;align-items:center">${field('', '', 'Escribe un mensaje')}<button class="ib" style="background:var(--primary);color:#fff" data-act="send">${ic('paper-plane-right', 1)}</button></div>` });

def({ id: 'P23', name: 'Llegó y atención en curso', kind: 'page', auto: 'P24', autoAct: () => { S.phase = 'curso'; },
  body: () => S.phase === 'llego' ? `<div class="mt16">${proCard(true)}</div><div class="h-l mt24">${first()} llegó</div><div class="t2 mt8">Dale este código para confirmar que es ella.</div>
  <div class="code mt16">${'2749'.split('').map(d => `<span>${d}</span>`).join('')}</div><div class="mt24">${note('identification-card', 'Ella también te mostrará su credencial de Cuidapp con foto.')}</div>`
    : `<div class="mt16">${proCard(true)}</div><div class="h-l mt24">Atención en curso</div><div class="t2 mt8">Comenzó a las ${S.slot} · ${CAT[S.item].n}</div><div class="progress bar-anim mt16"><span></span></div>
  <div class="mt16">${row('box:check', 'Código confirmado', 'Identidad verificada', '', '')}${S.item === 'iny' ? row('box:file-text', 'Receta revisada', 'Neurobionta 5.000 · 1 ampolla', '', '') : ''}${row('box:hand-heart', 'Atendiendo a ' + whoTxt().split(' (')[0], '', '', '')}</div>`,
  foot: () => S.phase === 'llego' ? abtn('Ya está conmigo', 'inCourse') : btn('Avisar un problema', 'P22', 'sec'),
  enter: () => { if (S.phase === 'curso') T(() => go('P24'), 6000); } });

def({ id: 'P24', name: 'Atención terminada', kind: 'page',
  body: () => `<div class="okc">${ic('check', 0).replace('ph ', 'ph-bold ')}</div>
  <div class="h-l mt16">Listo, atención terminada</div><div class="t2 mt8">${S.item === 'iny' ? 'Inyección de Neurobionta aplicada' : CAT[S.item].n} a ${whoTxt().split(' (')[0]}</div>
  <div class="sec-t">Nota de ${first()}</div><div class="note mt8">${ic('note')}<div>${S.item === 'iny' ? 'Glúteo derecho. Sin reacción. Próxima dosis en 48 h según receta.' : 'Sin novedades. Dejé indicaciones escritas en la mesa del comedor.'}</div></div>
  <div class="mt16">${kv('Cobrado en ' + (S.pay === 'mp' ? 'Mercado Pago' : 'Visa •••• 4821'), clp(price().total))}</div>`,
  foot: () => `${btn('Calificar a ' + first(), 'P25')}<div style="display:flex;gap:8px"><button class="btn sec" data-act="toast" data-arg="Boleta enviada a daniela.fuentes@gmail.com.">${ic('receipt')}Boleta</button><button class="btn sec" data-act="again" data-go="P13">${ic('repeat')}Agendar otra</button></div>` });

def({ id: 'P25', name: 'Calificar', kind: 'page', back: 'x',
  body: () => `<div style="display:flex;justify-content:center;margin-top:8px">${av(PRO().i, 'l', true)}</div><div class="h-m mt16" style="text-align:center">¿Cómo fue tu atención con ${first()}?</div>
  <div class="stars mt16">${[1, 2, 3, 4, 5].map(n => `<button class="${S.rating >= n ? 'on' : ''}" data-act="rate" data-arg="${n}">${ic('star', 1)}</button>`).join('')}</div>
  ${S.rating ? `<div class="chips mt24" style="justify-content:center">${['Puntual', 'Amable', 'Cuidadosa', 'Explicó todo', 'Precio justo'].map(t => chip(t, S.tags[t], 'tag', t)).join('')}</div>
  <div class="sec-t" style="text-align:center">Propina para ${first()}</div><div class="chips mt8" style="justify-content:center">${[0, 1000, 2000, 3000].map(v => chip(v ? clp(v) : 'Sin propina', S.tip === v, 'set', 'tip=' + v)).join('')}</div>
  <div class="xs t3 mt12" style="text-align:center">Tu nota se publica en su perfil.</div>` : '<div class="t3 sm mt16" style="text-align:center">Toca una estrella</div>'}`,
  foot: () => abtn('Enviar', 'sent', '', '', 'P26', !S.rating) });

const pastRows = () => `${S.hecho ? row('box:' + CAT[S.item].ic, CAT[S.item].n, `${dayShort(S.day)} · ${PRO().n} · ${clp(price().total)}`, 'P27', ic('caret-right'), '', 'set', 'det=past') : ''}
  ${row('box:test-tube', 'Toma de muestras', '3 oct · Paula Godoy · $35.390', 'P27', ic('caret-right'), '', 'set', 'det=past')}
  ${row('box:bandaids', 'Curación simple', '12 sep · Camila Rojas · $24.000', 'P27', ic('caret-right'), '', 'set', 'det=past')}`;
def({ id: 'P26', name: 'Actividad (mis reservas)', kind: 'page', tab: 'actividad',
  body: () => `<div class="h-xl mt8">Actividad</div><div class="sec-t">Próximas</div>
  ${!S.hecho ? row('box:calendar-check', `${dayShort(S.day)}, ${S.slot} · ${CAT[S.item].n}`, `${PRO().n} · ${S.booked ? 'Confirmada' : 'Confirmada'}`, 'P27', st('ok', 'Confirmada'), '', 'set', 'det=next') : ''}
  ${row('box:calendar-blank', 'Vie 30, 08:00 · Inyección intramuscular', 'Camila Rojas · 2ª dosis', 'P27', st('warn', 'Por confirmar'), '', 'set', 'det=next')}
  <div class="sec-t">Pasadas</div>${pastRows()}
  <button class="pill mt16" data-act="pick" data-arg="cr|" data-go="P12">${ic('repeat')}Agendar otra vez con Camila</button>` });

def({ id: 'P27', name: 'Detalle de la reserva', kind: 'page', back: true, title: '',
  body: () => S.det === 'next' ? `<div class="h-l">${CAT[S.item].n}</div><div class="t2 mt4">${whenLong()}</div><div class="mt8">${st('ok', 'Confirmada', 'check-circle')}</div>
  <div class="mt16">${proCard(false, true)}</div>
  <div class="mt8">${row('box:map-pin', P().n, P().c, '', '')}${row('box:user', whoTxt(), '', '', '')}${row('box:lock-simple', `${clp(price().total)} retenido`, 'Se cobra al terminar la atención', '', '')}</div>
  <div style="display:flex;gap:8px" class="mt12"><button class="btn sec" data-go="P22">${ic('chat-circle')}Mensaje</button><button class="btn sec" data-go="P13">${ic('calendar-blank')}Cambiar hora</button></div>
  <button class="btn ghost mt8" style="color:var(--danger)" data-act="set" data-arg="cancelFrom=P27" data-go="P30">Cancelar reserva</button>`
    : `<div class="h-l">Curación simple</div><div class="t2 mt4">12 sep · 19:00 a 19:45 · Av. Irarrázaval 3450, Ñuñoa</div><div class="mt16">${proCard()}</div>
  <div class="sec-t">Pago</div>${kv('Curación simple · precio de Camila', '$24.000')}${kv('Total · Visa •••• 4821', '$24.000', 'tot')}
  <div class="sec-t">Nota de la profesional</div><div class="note mt8">${ic('note')}<div>Herida limpia, sin signos de infección. Repetir en 48 h.</div></div>`,
  foot: () => S.det === 'next' ? btn('Ver el día de la atención', 'P21') : `<div style="display:flex;gap:8px"><button class="btn sec" data-act="toast" data-arg="Boleta enviada a daniela.fuentes@gmail.com.">${ic('receipt')}Boleta</button><button class="btn sec" data-act="toast" data-arg="Te escribimos por WhatsApp en menos de 10 minutos.">${ic('lifebuoy')}Ayuda</button></div>${abtn('Agendar otra vez', 'pick', 'cr|', '', 'P13')}`, next: ['P21', 'P13'] });

def({ id: 'P28', name: 'Cuenta', kind: 'page', tab: 'cuenta',
  body: () => `<div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px"><div><div class="h-l">Daniela Fuentes</div><div class="sm t2 mt4">${st('ok', 'Cuenta verificada', 'seal-check')}</div></div>${av('DF', 'l')}</div>
  <div class="tiles2 mt16">${[['lifebuoy', 'Ayuda', '', 'toast', 'Te escribimos por WhatsApp en menos de 10 minutos.'], ['credit-card', 'Pagos', 'P18'], ['receipt', 'Actividad', 'P26']].map(t => `<button class="tile" style="height:84px" ${t[2] ? `data-go="${t[2]}"` : `data-act="${t[3]}" data-arg="${t[4]}"`}>${ic(t[0])}<span class="n">${t[1]}</span></button>`).join('')}</div>
  <div class="mt8">${row('heart', 'Profesionales favoritas', 'Camila Rojas, Paula Godoy', 'P12', ic('caret-right'), '', 'pick', 'cr|')}${row('users', 'Pacientes', 'Tú, Rosa y Luis', 'P29')}${row('shield-check', 'Datos de salud y privacidad', 'Consentimiento y descarga de tus datos', 'P04')}${row('map-pin', 'Direcciones', 'Casa y Mamá', 'P08')}${row('stethoscope', 'Trabaja con Cuidapp', 'Para enfermeras y TENS', 'R01')}${row('sign-out', 'Cerrar sesión', '', 'P01', '')}</div>` });

def({ id: 'P29', name: 'Pacientes guardados', kind: 'page', back: true, title: 'Pacientes',
  body: () => `<div class="t2 sm">¿Para quién es la atención?</div><div class="mt8">
  ${radioRow('Rosa Muñoz · mamá', '78 años · Alergia a penicilina', S.who === 'mama', 'set', 'who=mama', 'user')}
  ${radioRow('Luis Fuentes · papá', '80 años · Hipertenso', S.who === 'papa', 'set', 'who=papa', 'user')}
  ${radioRow('Daniela Fuentes · tú', '37 años', S.who === 'yo', 'set', 'who=yo', 'user')}
  ${row('box:plus', 'Agregar paciente', 'Nombre, RUT, edad y alergias', '', ic('caret-right'), '', 'toast', 'Agrega nombre, RUT, edad y alergias del paciente.')}</div>`,
  foot: () => btn('Listo', 'back') });

def({ id: 'P30', name: 'Cancelar', kind: 'page', back: true, title: 'Cancelar',
  body: () => `<div class="h-m">¿Por qué cancelas?</div><div class="mt8">${['Ya no la necesito', 'Me equivoqué de hora o dirección', 'Encontré otra hora', 'Otro motivo'].map((t, i) => radioRow(t, '', (S.cr || 0) === i, 'set', 'cr=' + i)).join('')}</div>
  <div class="mt16">${S.cancelFrom === 'P21' ? note('warning', `${first()} ya va en camino. Se cobra $5.000 por el traslado y liberamos el resto.`, 'warn') : S.cancelFrom === 'P19' ? note('check-circle', 'Aún no te cobramos nada. Cancelar no tiene costo.') : note('check-circle', `Faltan más de 12 horas: cancelar es gratis y liberamos los ${clp(price().total)} retenidos.`)}</div>`,
  foot: () => `${abtn('Cancelar', 'cancel', '', 'danger', 'P06')}${btn('Volver', 'back', 'ghost')}` });

const asapPros = () => PROS.filter(p => p.asap && priceOf(p));
def({ id: 'P31', name: 'Lo antes posible (secundario)', kind: 'map', back: true, map: () => ({ home: P().ll, dots: [[[P().ll[0] + .006, P().ll[1] - .008]], [[P().ll[0] - .004, P().ll[1] + .009]]], maxZoom: 15 }),
  body: () => `<div class="h-m">Disponibles ahora</div><div class="t2 sm mt4">Profesionales conectadas cerca de ${P().c} que pueden ir hoy. ${CAT[S.item].n}.</div>
  <div class="mt12">${asapPros().map(p => `<button class="opt ${S.pro === p.id ? 'sel' : ''}" data-act="asap" data-arg="${p.id}">${av(p.i, '', true)}<span class="tx"><div class="b-m">${p.n}</div><div class="sm t2">${p.t} · ★ ${p.r} · llega en ~${p.asap} min</div></span><span class="pr">${clp(priceOf(p))}</span></button>`).join('')}</div>
  <div class="mt8">${note('info', 'Solo aparece cuando hay profesionales conectadas cerca. Si no hay, agenda para la primera hora libre.')}</div>`,
  foot: () => `${btn(`Continuar con ${first()}`, 'P14')}${abtn('Mejor agendo una hora', 'set', 'when=prog', 'ghost', 'P10')}` });

/* ===== escritorio paciente ===== */
def({ id: 'W01', name: 'Agendar (web)', kind: 'map', dtab: 'inicio', map: () => ({ home: P().ll, homeLabel: P().n, dots: nearDots(), zoom: 14 }),
  body: () => `<div class="h-l">Agenda una atención en tu casa</div><div class="t2 mt4">Elige a tu enfermera o TENS verificada, con su precio y su próxima hora libre.</div>
  ${lbl('Servicio')}<div class="chips">${['iny', 'cur', 'mue', 'sig', 'tens4'].map(k => chip(CAT[k].s, S.item === k, 'svc', k)).join('')}</div>
  ${lbl('Dirección')}<button class="field" data-go="P08" style="text-align:left">${ic('map-pin')}<span>${P().full}</span></button>
  ${lbl('Para')}<button class="field" data-go="P29" style="text-align:left">${ic('user')}<span>${whoTxt()}</span></button>
  <button class="asap mt16" data-act="asap" data-arg="pg" data-go="P31"><span class="dot"></span><span class="tx"><b>¿La necesitas hoy?</b><span class="sm t2">2 disponibles ahora cerca</span></span>${ic('caret-right')}</button>`,
  foot: () => btn('Ver profesionales', 'W02') });

def({ id: 'W02', name: 'Profesionales cerca (web)', kind: 'page', dtab: 'inicio', wide: true, back: true, dtitle: '',
  body: () => { const l = prosFor(); return `<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:16px"><div><div class="h-l">${CAT[S.item].n} en ${P().c}</div><button class="addr-l mt4" data-go="P08">${ic('map-pin', 1)}<span>${P().full}</span>${ic('caret-down')}</button></div></div>
  <div class="sortbar mt16">${sortChips()}<span style="flex:1"></span><button class="pill flt" data-go="P11">${ic('sliders-horizontal')}Filtros</button></div>
  <div class="sm t2 mt12">${l.length} profesionales · precios fijados por cada una</div>
  <div class="plist mt8">${l.map(p => pcard(p, true)).join('')}</div><div class="xs t3 mt12">Profesionales y precios de ejemplo para el prototipo.</div>`; },
  aside: () => `<div class="mapbox"><div class="mapwrap" data-map="1"></div></div>${CAT[S.item].receta ? `<div class="mt12">${note('file-text', 'Para inyecciones necesitas foto de la receta médica.')}</div>` : ''}`,
  map: () => ({ home: P().ll, dots: nearDots(), zoom: 13.5 }) });

def({ id: 'W03', name: 'Perfil y reserva (web)', kind: 'page', dtab: 'inicio', wide: true, back: true, dtitle: '', asideCls: 'book', next: ['P14', 'P22'],
  body: () => { const p = PRO(); return `<div style="display:flex;gap:20px;align-items:center">${av(p.i, 'l', true)}<div><div class="h-l">${p.n}</div><div class="t2">${p.t} · ${p.yrs} años de experiencia · ${p.com}</div><div class="mt4">${sis()}</div></div></div>
  <div class="stats mt16" style="max-width:520px"><div><b class="num">★ ${p.r}</b><span>nota</span></div><div><b class="num">${p.a}</b><span>atenciones</span></div><div><b class="num">${String(p.km).replace('.', ',')} km</b><span>de ${P().c}</span></div></div>
  <div class="sec-t">Servicios y precios</div><div class="svc2">${svcRows(p, true)}</div>
  <div class="sec-t">Qué incluye</div><div class="chips mt8">${incOf(p).map(t => `<span class="chip" style="cursor:default">${ic('check')}&nbsp;${t}</span>`).join('')}</div>
  <div class="two mt16"><div><div class="sec-t" style="margin-top:0">Reseñas</div>${reviews()}</div><div><div class="sec-t" style="margin-top:0">Sobre ella</div>${about()}</div></div>`; },
  aside: () => `<div class="box"><div style="display:flex;justify-content:space-between;align-items:baseline"><div class="b-m">${CAT[S.item].n}</div><div class="price-s num">${clp(price().pro)}</div></div>
  <div class="sm t2">${durOf(PRO())} min · precio de ${first()}</div>
  <div class="b-m mt16">Día</div><div class="mt8">${dayCards()}</div><div class="b-m mt16">Hora de llegada</div>${slotGrid()}
  <div class="mt12" style="display:flex;flex-direction:column;gap:8px">${slotNotes()}</div>
  <div class="mt12">${kv('Total', clp(price().total), 'tot')}</div>
  <div class="mt12">${btn('Continuar', 'P14')}</div><button class="btn ghost mt4" data-go="P22">${ic('chat-circle')}Preguntarle algo</button>
  <div class="xs t3 mt8" style="text-align:center">No se cobra nada hasta que ${first()} confirme.</div></div>` });

def({ id: 'W04', name: 'Seguimiento (web)', kind: 'map', dtab: 'inicio', auto: 'P23', autoAct: () => { S.phase = 'llego'; }, map: trackMap, body: trackBody });
