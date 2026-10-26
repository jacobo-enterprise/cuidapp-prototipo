/* ===== Admin ===== */
const CANDS = [
  ['Fernanda Araya Lagos', 'FA', 'Enfermera', 'La Florida', '512.884', 'Hace 2 h'],
  ['Javiera Soto Muñoz', 'JS', 'TENS', 'Maipú', '498.120', 'Hace 5 h'],
  ['Matías Contreras Vega', 'MC', 'Enfermero', 'Ñuñoa', '505.317', 'Ayer'],
  ['Constanza Díaz Reyes', 'CD', 'TENS', 'Puente Alto', '520.004', 'Ayer'],
  ['Ignacio Pérez Lillo', 'IP', 'Enfermero', 'Las Condes', '477.902', 'Hace 2 días'],
  ['Valentina Morales Toro', 'VM', 'Enfermera', 'Santiago', '509.663', 'Hace 2 días'],
];
Object.assign(ACT, {
  cand: i => { S.cand = +i; S.sis = 0; },
  sis: () => { S.sis = 1; setTimeout(() => { S.sis = 2; if (cur === 'A03') render(); }, 1400); },
  aprob: () => { S.aprob.push(S.cand); toast(`${CANDS[S.cand][0].split(' ')[0]} aprobada. Le avisamos por SMS.`); },
  rech: () => { S.rech.push(S.cand); toast(`Rechazo enviado a ${CANDS[S.cand][0].split(' ')[0]}.`); },
  corr: () => { toast(`Pedimos a ${CANDS[S.cand][0].split(' ')[0]} una foto nueva del título.`); },
  admTab: t => { S.admTab = t; },
  aedit: k => { S.aedit = k; },
  amin: d => { const k = S.aedit; S.mins[k] = Math.max(5000, S.mins[k] + (d === '+' ? 500 : -500)); },
  comm: v => { S.comm = +v; toast(`Comisión propuesta: ${v}%. Rige para reservas nuevas.`); },
});
const stOf = i => S.aprob.includes(i) ? st('ok', 'Aprobada') : S.rech.includes(i) ? st('bad', 'Rechazada') : i === 2 ? st('warn', 'Falta título') : st('neu', 'Por revisar');

def({ id: 'A01', name: 'Ingreso admin', kind: 'adm', side: 'none',
  body: () => `<div style="max-width:380px;margin:80px auto 0">${logoImg('horizontal-nm', 34)}<div class="h-l mt24">Panel de operaciones</div><div class="t2 mt8">Solo para el equipo de Cuidapp.</div>
  ${lbl('Correo')}${field('', 'operaciones@cuidapp.cl')}${lbl('Contraseña')}${field('', '••••••••••••')}<div class="mt24">${btn('Entrar', 'A02')}</div></div>` });

def({ id: 'A02', name: 'Cola de verificación', kind: 'adm', side: 'ver',
  body: () => `<div style="display:flex;align-items:flex-end;justify-content:space-between"><div><div class="h-l">Verificación de profesionales</div><div class="t2 mt4">${6 - S.aprob.length - S.rech.length} por revisar · se responde en menos de 48 h</div></div>
  <div class="chips">${chip('Por revisar', S.admTab === 'rev', 'admTab', 'rev')}${chip('Todas', S.admTab === 'all', 'admTab', 'all')}</div></div>
  <table class="t mt24"><tr><th>Postulante</th><th>Profesión</th><th>Comuna</th><th>Registro SIS</th><th>Enviado</th><th>Estado</th><th></th></tr>
  ${CANDS.map((c, i) => S.admTab === 'rev' && (S.aprob.includes(i) || S.rech.includes(i)) ? '' : `<tr class="cl" data-act="cand" data-arg="${i}" data-go="A03"><td><div style="display:flex;align-items:center;gap:10px">${av(c[1], 's')}<b style="font-weight:600">${c[0]}</b></div></td><td>${c[2]}</td><td>${c[3]}</td><td class="num">${c[4]}</td><td class="t2">${c[5]}</td><td>${stOf(i)}</td><td>${ic('caret-right')}</td></tr>`).join('')}</table>` });

def({ id: 'A03', name: 'Revisar documentos', kind: 'adm', side: 'ver',
  body: () => { const c = CANDS[S.cand]; return `<div style="display:flex;align-items:center;gap:12px"><button class="ib" data-go="A02">${ic('arrow-left')}</button>${av(c[1])}<div style="flex:1"><div class="h-m">${c[0]}</div><div class="t2 sm">${c[2]} · ${c[3]} · +56 9 6620 1475 · ${c[5].toLowerCase()}</div></div>${stOf(S.cand)}</div>
  <div class="docgrid mt24"><div class="box"><div class="b-m">Carnet de identidad</div><div class="mt8">${idcard()}</div></div>
  <div class="box"><div class="b-m">Selfie</div><div class="selfie mt8">${ic('user', 1)}</div><div class="mt8">${st('ok', 'Coincide con el carnet 96%', 'check-circle')}</div></div>
  <div class="box"><div class="b-m">Título</div><div class="doc mt8"><div class="hd"><b>Universidad de Santiago</b><span>2021</span></div><div style="text-align:center">Otorga el título de<div class="hw" style="font-size:18px">${c[2]}</div>a ${c[0]}</div></div></div>
  <div class="box"><div class="b-m">Registro en la Superintendencia de Salud</div><div class="t2 sm mt4">N° ${c[4]}</div>
  <div class="mt12">${S.sis === 0 ? abtn(ic('magnifying-glass') + 'Consultar registro', 'sis', '', 'sec') : S.sis === 1 ? `<div class="progress bar-anim"><span></span></div><div class="sm t2 mt8">Consultando el Registro de Prestadores…</div>` : `${kv('Titular', c[0])}${kv('Profesión', c[2])}${kv('Estado', '<span style="color:var(--ok)">Habilitada</span>')}`}</div>
  <div class="mt12">${st('ok', 'Antecedentes sin registros', 'check-circle')}</div></div></div>
  <div style="display:flex;gap:8px;justify-content:flex-end" class="mt24"><div style="width:180px">${abtn('Rechazar', 'rech', '', 'danger', 'A02')}</div><div style="width:200px">${abtn('Pedir corrección', 'corr', '', 'sec', 'A02')}</div><div style="width:180px">${abtn('Aprobar', 'aprob', '', '', 'A02', S.sis !== 2)}</div></div>`; } });


const MKT = { iny: ['$19.500', '$14.000 – $25.000', 148], cur: ['$25.200', '$20.000 – $30.000', 96], cura: ['$39.800', '$32.000 – $48.000', 41], mue: ['$15.400', '$12.000 – $19.990', 112], sig: ['$11.600', '$10.000 – $15.000', 131], son: ['$33.000', '$28.000 – $38.000', 37], tens4: ['$30.500', '$26.000 – $36.000', 58], inysc: ['$17.200', '$12.000 – $23.000', 121], inyev: ['$27.500', '$22.000 – $33.000', 64], pie: ['$41.500', '$34.000 – $50.000', 38], pun: ['$19.000', '$14.000 – $24.000', 88], suero: ['$31.000', '$26.000 – $36.000', 33], tens8: ['$52.500', '$46.000 – $58.000', 44] };
def({ id: 'A04', name: 'Reservas de hoy', kind: 'adm', side: 'hoy',
  body: () => `<div class="h-l">Reservas de hoy</div><div class="t2 mt4">Lunes 26 de octubre · 21:10</div>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px" class="mt16">${[['Por confirmar', '6'], ['Confirmadas', '43'], ['En curso', '7'], ['Valor del día', '$1.182.000']].map(k => `<div class="box" style="border:1px solid var(--border);border-radius:12px;padding:14px"><div class="t2 sm">${k[0]}</div><div class="price num">${k[1]}</div></div>`).join('')}</div>
  <div style="height:280px;border-radius:12px;overflow:hidden;margin-top:16px;position:relative"><div class="mapwrap" data-map="1"></div></div>
  <table class="t mt16"><tr><th>Hora</th><th>Paciente</th><th>Servicio</th><th>Comuna</th><th>Profesional</th><th>Precio</th><th>Estado</th></tr>
  ${[['21:00', 'Pedro Silva', 'Inyección', 'La Reina', 'Valentina Morales', '$30.000', st('warn', 'Por confirmar')], ['20:30', 'Carmen Vidal', 'Signos vitales', 'Ñuñoa', 'Camila Rojas', clp(S.my.sig.p), st('inf', 'En camino')], ['20:00', 'Jorge Tapia', 'Inyección', 'Providencia', 'Paula Godoy', '$14.000', st('warn', 'En curso')], ['19:30', 'Ana Herrera', 'Curación simple', 'Macul', 'Fernanda Araya', '$28.000', st('ok', 'Terminada')], ['19:00', 'Jorge T.', 'Curación simple', 'Providencia', 'Camila Rojas', clp(S.my.cur.p), st('ok', 'Terminada')]].map(r => `<tr>${r.map((x, j) => `<td class="${j === 5 ? 'num' : ''}">${x}</td>`).join('')}</tr>`).join('')}</table>`,
  map: () => ({ home: G.mama, pro: G.route[20], route: G.route, dots: [[[-33.4268, -70.6123], '#111111'], [[-33.4900, -70.5990], '#111111'], [[-33.4420, -70.5480]], [[-33.4130, -70.5800], '#7A7CF0']], maxZoom: 13 }) });

def({ id: 'A05', name: 'Catálogo y comisión', kind: 'adm', side: 'tar', next: ['A07'],
  body: () => `<div class="h-l">Catálogo y comisión</div><div class="t2 mt4">Cuidapp define las categorías, los servicios y un precio mínimo. Cada profesional pone su precio sobre ese mínimo; en exámenes, solo su tarifa de toma.</div>
  <table class="t mt24"><tr><th>Servicio</th><th>Quién lo hace</th><th>Mínimo</th><th>Promedio</th><th>Rango publicado</th><th>Profesionales</th><th>Requisito</th><th></th></tr>
  ${GK.map(g => `<tr><td colspan="8" class="grp-h">${GRP[g].n}</td></tr>${GRP[g].l.map(k => `<tr class="cl" data-act="aedit" data-arg="${k}" data-go="A07"><td><div style="display:flex;align-items:center;gap:10px"><span class="ri box">${i3(k)}</span><b style="font-weight:600">${CAT[k].n}</b></div></td><td>${CAT[k].who.map(w => w === 'enf' ? 'Enfermera/o' : 'TENS').join(', ')}</td><td class="num"><b style="font-weight:600">${clp(S.mins[k])}</b></td><td class="num">${MKT[k][0]}</td><td class="num t2">${MKT[k][1]}</td><td class="num">${MKT[k][2]}</td><td class="t2">${CAT[k].receta ? 'Receta' : CAT[k].lab ? 'Laboratorio aliado' : '—'}</td><td>${ic('caret-right')}</td></tr>`).join('')}`).join('')}</table>
  <div class="h-m mt32">${LAB} · exámenes</div><div class="t2 sm mt4">Precios fijos por convenio. La paciente los paga aparte de la toma; Cuidapp no cobra comisión sobre ellos.</div>
  <table class="t mt16"><tr><th>Examen</th><th>Precio</th><th>Muestra</th><th>Preparación</th><th>Pedidos (30 días)</th><th></th></tr>
  ${Object.keys(EXAMS).map((k, i) => `<tr class="cl" data-act="toast" data-arg="El precio de ${EXAMS[k][0]} lo fija el convenio con el laboratorio. Se actualiza en la próxima carga del catálogo."><td><b style="font-weight:600">${EXAMS[k][0]}</b></td><td class="num">${clp(EXAMS[k][1])}</td><td class="t2">${EXAMS[k][2]}</td><td class="t2">${EXAMS[k][3] ? 'Ayuno 8 h' : 'Sin ayuno'}</td><td class="num">${[212, 168, 190, 74, 131, 45, 96, 58, 83, 61, 49, 37][i]}</td><td>${ic('caret-right')}</td></tr>`).join('')}</table>
  <div class="mt12"><button class="pill" data-act="toast" data-arg="Catálogo actualizado desde el laboratorio: 12 exámenes, sin cambios de precio.">${ic('arrows-clockwise')}Sincronizar con el laboratorio</button></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px" class="mt24"><div class="box" style="border:1px solid var(--border);border-radius:12px;padding:16px"><div class="b-m">Comisión de Cuidapp</div><div class="t2 sm mt4">Se descuenta de cada atención terminada. Propuesta; por definir.</div>
  <div class="chips mt12">${[10, 12, 15, 20].map(v => chip(v + '%', S.comm === v, 'comm', v)).join('')}</div>
  <div class="mt12">${kv('Inyección a $18.000 · profesional recibe', clp(net(18000)))}</div></div>
  <div class="box" style="border:1px solid var(--border);border-radius:12px;padding:16px"><div class="b-m">Reglas del catálogo</div><div class="sm t2 mt8" style="line-height:21px">Sin recargos fijos por comuna ni por horario. Cada profesional puede definir un precio de noche y feriados. Los precios publicados son de ejemplo para el prototipo.</div></div></div>` });

def({ id: 'A07', name: 'Editar servicio del catálogo', kind: 'adm', side: 'tar',
  body: () => { const k = S.aedit; return `<div style="display:flex;align-items:center;gap:12px"><button class="ib" data-go="A05">${ic('arrow-left')}</button><div class="h-l">${CAT[k].n}</div></div>
  <div style="display:grid;grid-template-columns:1.1fr 1fr;gap:32px;max-width:900px" class="mt24"><div>
  ${lbl(k === 'mue' ? 'Tarifa mínima de toma a domicilio' : 'Precio mínimo')}<div class="pricein"><button class="ib sbtn" data-act="amin" data-arg="-">${ic('minus')}</button><div class="v num">${clp(S.mins[k])}</div><button class="ib sbtn" data-act="amin" data-arg="+">${ic('plus')}</button></div>
  <div class="sm t2 mt8">Hoy publican entre ${MKT[k][1]} · promedio ${MKT[k][0]}</div>
  ${lbl('Descripción para pacientes')}${field('', CAT[k].d)}
  ${lbl('Duración sugerida')}${field('', CAT[k].dur + ' min')}</div><div>
  ${lbl('Quién puede ofrecerlo')}<div class="chips">${chip('Enfermera/o', CAT[k].who.includes('enf'), 'toast', 'Requiere revisión clínica antes de cambiarlo.')}${chip('TENS', CAT[k].who.includes('tens'), 'toast', 'Requiere revisión clínica antes de cambiarlo.')}</div>
  ${lbl('Requisitos')}<button class="row" data-act="tog" data-arg="aRec"><span class="tx"><div class="a">Pedir receta médica</div><div class="b">La paciente sube foto antes de agendar</div></span><span class="tog ${S.aRec ? 'on' : ''}"></span></button>
  ${lbl('Lo mínimo que debe incluir')}${checkRow(INC.ins, true, 'toast', 'Obligatorio para todas.')}${checkRow(INC.res, true, 'toast', 'Obligatorio para todas.')}</div></div>
  <div class="mt24" style="width:220px">${abtn('Guardar', 'toast', 'Mínimo actualizado. Avisamos a las profesionales bajo el mínimo.', '', 'A05')}</div>`; } });

def({ id: 'A06', name: 'Profesionales', kind: 'adm', side: 'pro', next: ['A03'],
  body: () => `<div class="h-l">Profesionales</div><div class="t2 mt4">214 activas · cada una con sus precios, comunas y horarios</div>
  <table class="t mt24"><tr><th>Nombre</th><th>Profesión</th><th>Comunas</th><th>Inyección</th><th>Atenciones</th><th>Nota</th><th>Estado</th></tr>
  ${[['Camila Rojas Vergara', 'CR', 'Enfermera', 'Providencia, Ñuñoa', clp(S.my.iny.p), 132, '4,9', st('ok', 'Activa')], ['Paula Godoy Fuentes', 'PG', 'TENS', 'Providencia, Santiago', '$14.000', 87, '4,8', st('ok', 'Activa')], ['Diego Navarro Paz', 'DN', 'Enfermero', 'Macul, La Florida', '$16.000', 64, '4,7', st('inf', 'En atención')], ['Francisca León Ruiz', 'FL', 'Enfermera', 'Las Condes, Vitacura', '$24.000', 201, '5,0', st('neu', 'Agenda llena')], ['Rodrigo Saavedra Mena', 'RS', 'TENS', 'Maipú', '$13.000', 23, '4,6', st('warn', 'Sin horarios')]].map(r => `<tr class="cl" data-act="toast" data-arg="Ficha de ${r[0].split(' ')[0]}: ${r[5]} atenciones, nota ${r[6]}, inyección a ${r[4]}."><td><div style="display:flex;align-items:center;gap:10px">${av(r[1], 's', true)}<b style="font-weight:600">${r[0]}</b></div></td><td>${r[2]}</td><td>${r[3]}</td><td class="num">${r[4]}</td><td class="num">${r[5]}</td><td>★ ${r[6]}</td><td>${r[7]}</td></tr>`).join('')}</table>
  <div class="mt16"><button class="pill" data-go="A02">${ic('identification-card')}Ver postulantes por revisar</button></div>` });
