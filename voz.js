/* Cuidapp · nota de la visita por voz (Web Speech API es-CL, con respaldo simulado) */
const VZ_SIM = 'Llegué a las 08:02. Rosa está más animada y durmió bien. Presión 132/80, pulso 76, temperatura 36,6, saturación 96 %, hemoglucotest 142. Puse la Neurobionta, segunda dosis, glúteo derecho, sin reacción a los 15 minutos. Curación de la úlcera de la pierna izquierda: mide más o menos 3,2 por 2,1, lecho granulatorio 80 %, exudado escaso seroso, piel alrededor sana. Dejé espuma con borde. Le recomiendo pierna en alto 20 minutos tres veces al día, no mojar el apósito y caminar 15 minutos en la mañana y en la tarde. Si tiene fiebre sobre 38, más dolor o mal olor en la herida, que llamen o vayan a urgencias. Próximo control en 48 horas.';
const VZ_W = VZ_SIM.split(' ');
const VZSEC = { all: 'Toda la nota', res: 'Resumen para la familia', sv: 'Signos vitales', proc: 'Procedimientos' };
const VZ = () => S.vz || (S.vz = { mode: 'sim', st: 'rec', t: 0, w: 0, txt: '', int: '', ok: {}, open: false, keep: false, rev: false, sec: 'all', done: false });
const SR = () => window.SpeechRecognition || window.webkitSpeechRecognition;
let vzRec = null;
function vzStopRec() { if (vzRec) { const r = vzRec; vzRec = null; try { r.onend = null; r.stop(); } catch (e) {} } }
function vzStartRec() {
  const C = SR(); if (!C) return false;
  try {
    const r = new C(); r.lang = 'es-CL'; r.continuous = true; r.interimResults = true;
    r.onresult = e => { const v = VZ(); let fin = '', int = ''; for (let i = e.resultIndex; i < e.results.length; i++) { const x = e.results[i]; if (x.isFinal) fin += x[0].transcript + ' '; else int += x[0].transcript; } v.txt = (v.txt + fin).replace(/\s+/g, ' '); v.int = int; vzPaint(); };
    r.onerror = e => { if (['not-allowed', 'service-not-allowed', 'network', 'audio-capture'].includes(e.error)) { vzStopRec(); const v = VZ(); v.mode = 'sim'; v.txt = ''; v.int = ''; toast('No pudimos usar el micrófono. Seguimos con un dictado de ejemplo.'); if (cur === 'R40') render(); } };
    r.onend = () => { if (vzRec === r && VZ().st === 'rec') { try { r.start(); } catch (e) {} } };
    r.start(); vzRec = r; return true;
  } catch (e) { return false; }
}
const vzText = () => { const v = VZ(); return v.mode === 'real' ? v.txt + (v.int ? `<span class="vz-int">${v.int}</span>` : '') : VZ_W.slice(0, v.w).join(' '); };
const mmss = t => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
function vzPaint() {
  const v = VZ(), tx = document.getElementById('vzTx'), tm = document.getElementById('vzT');
  if (tm) tm.textContent = mmss(Math.floor(v.t));
  if (tx) { const s = vzText(); tx.innerHTML = s ? s + (v.st === 'rec' ? '<span class="caret"></span>' : '') : `<span class="t3">${v.mode === 'real' ? 'Habla cuando quieras…' : 'Escuchando…'}</span>`; tx.scrollTop = tx.scrollHeight; }
  document.querySelectorAll('.wave i').forEach(b => { b.style.height = v.st === 'rec' ? (8 + Math.random() * 46) + 'px' : '6px'; });
}
const _goVZ = go;
go = function (id, ...a) { if (id !== 'R40' && cur === 'R40' && id !== cur) { vzStopRec(); if (VZ().st === 'rec') VZ().st = 'pause'; } return _goVZ(id, ...a); };

/* lo que la IA entendió (con el dictado real se buscan los números en el texto) */
function vzParse() {
  const v = VZ(), t = (v.mode === 'real' ? v.txt : VZ_SIM).toLowerCase(), n = s => s && s.replace('.', ',');
  const m = (re) => { const x = t.match(re); return x ? x : null; };
  const pa = m(/(?:presi[oó]n|pa)\D{0,12}(\d{2,3})\s*(?:\/|con|sobre)\s*(\d{2,3})/), fc = m(/(?:pulso|frecuencia(?: card[ií]aca)?|fc)\D{0,8}(\d{2,3})/), te = m(/(?:temperatura|t°)\D{0,8}(\d{2}[.,]\d)/), sa = m(/(?:saturaci[oó]n|sat)\D{0,8}(\d{2,3})/), gl = m(/(?:hemoglucotest|glicemia|glucosa|hgt)\D{0,8}(\d{2,3})/), md = m(/(\d+[.,]\d+)\s*(?:por|x)\s*(\d+[.,]\d+)/);
  const real = v.mode === 'real';
  return {
    pa: pa ? `${pa[1]}/${pa[2]}` : real ? '' : '132/80', fc: fc ? fc[1] : real ? '' : '76', te: te ? n(te[1]) : real ? '' : '36,6', sa: sa ? sa[1] : real ? '' : '96', gl: gl ? gl[1] : real ? '' : '142',
    md: md ? `${n(md[1])} × ${n(md[2])}` : real ? '' : '3,2 × 2,1', mdDud: !md || /m[aá]s o menos|aprox|como/.test(t),
    med: /neurobion/.test(t) || !real, prox: /48|dos d[ií]as|pasado ma[nñ]ana/.test(t) || !real ? 'En 48 horas · mié 28 oct' : 'No lo mencionaste',
  };
}
const vzFlags = () => { const p = vzParse(), f = []; if (p.mdDud) f.push(['md', `¿Confirmas ${p.md || 'las medidas de la herida'} cm?`, 'Dijiste «más o menos». Las medidas quedan en la evolución de la herida.']); if (p.gl) f.push(['gl', `¿La glicemia de ${p.gl} mg/dL fue en ayunas?`, 'Cambia cómo se lee el valor en la ficha de Rosa.']); return f; };

Object.assign(ACT, {
  dictStart: sec => { S.vz = null; const v = VZ(); v.sec = sec || 'all'; v.mode = vzStartRec() ? 'real' : 'sim'; if (v.mode === 'sim' && !SR()) toast('Este navegador no tiene dictado por voz. Te mostramos un ejemplo.'); },
  dictPause: () => { const v = VZ(); if (v.st === 'rec') { v.st = 'pause'; vzStopRec(); } else { v.st = 'rec'; if (v.mode === 'real' && !vzStartRec()) v.mode = 'sim'; } },
  dictStop: () => { const v = VZ(); vzStopRec(); v.st = 'done'; if (v.mode === 'sim') v.w = VZ_W.length; if (v.mode === 'real' && !v.txt.trim()) { v.mode = 'sim'; v.w = VZ_W.length; toast('No escuchamos nada. Te mostramos un dictado de ejemplo.'); } },
  dictRedo: () => { S.vz = null; VZ(); toast('Borramos el dictado. Puedes empezar de nuevo.'); },
  vzOk: k => { VZ().ok[k] = true; },
  vzFix: k => { VZ().ok[k] = true; toast('Corregido. Queda marcado como editado por ti.'); },
  vzOpen: () => { VZ().open = !VZ().open; },
  vzKeep: () => { VZ().keep = !VZ().keep; },
  vzRev: () => { VZ().rev = !VZ().rev; },
  vzEdit: k => toast(`Editando «${k}». Escribe o vuelve a dictar solo esta parte.`),
  vzApply: () => { const v = VZ(); v.done = true; S.note.rec = { a: true, b: true, c: true }; S.note.al = { a: true, b: true, c: true }; S.note.prox = 2; if (v.mode === 'sim') { S.note.hin = '08:02'; } },
});

/* ---------- R40 dictando ---------- */
def({ id: 'R40', name: 'Dictando la nota', kind: 'page', back: 'x', title: 'Dictando', next: ['R41'], auto: 'R41', autoAct: () => { VZ().st = 'done'; VZ().w = VZ_W.length; },
  body: () => { const v = VZ(); return `<div class="vz-top"><span class="st inf">${ic('microphone', 1)}${VZSEC[v.sec]}</span><span class="vz-mode">${v.mode === 'real' ? `${ic('broadcast')}Micrófono · español de Chile` : `${ic('play-circle')}Ejemplo simulado`}</span></div>
  <div class="vz-rec ${v.st}"><div class="vz-dot"></div><div id="vzT" class="vz-time num">${mmss(Math.floor(v.t))}</div><div class="sm t2">${v.st === 'rec' ? 'Escuchando…' : v.st === 'pause' ? 'En pausa' : 'Terminado'}</div></div>
  <div class="wave ${v.st}">${[...Array(28)].map(() => `<i style="height:${v.st === 'rec' ? 8 + Math.random() * 46 : 6}px"></i>`).join('')}</div>
  <div class="lbl2">Lo que vamos entendiendo</div><div id="vzTx" class="vz-tx">${vzText() || `<span class="t3">Escuchando…</span>`}</div>
  <div class="mt12">${note('lightbulb', 'Di los signos vitales, qué hiciste, cómo está la herida, qué recomiendas y cuándo es el próximo control. Habla normal: nosotros lo ordenamos.')}</div>`; },
  foot: () => { const v = VZ(); return `<div class="vz-ctl"><button class="vz-b sec" data-act="dictRedo" aria-label="Empezar de nuevo">${ic('arrow-counter-clockwise')}</button><button class="vz-b main ${v.st}" data-act="dictPause" aria-label="${v.st === 'rec' ? 'Pausar' : 'Seguir'}">${ic(v.st === 'rec' ? 'pause' : 'microphone', 1)}</button><button class="vz-b stop" data-act="dictStop" data-go="R41" aria-label="Listo">${ic('stop', 1)}</button></div><div class="vz-lab"><span>Repetir</span><span>${v.st === 'rec' ? 'Pausar' : 'Seguir'}</span><span>Listo</span></div>`; },
  enter: () => { const v = VZ(); I(() => { if (v.st !== 'rec') return; v.t += .25; if (v.mode === 'sim' && v.w < VZ_W.length && Math.random() < .9) v.w += 1; vzPaint(); }, 250); } });

/* ---------- R41 revisa lo que entendimos ---------- */
const vzf = (k, lab, val, ed = true) => `<div class="vzf"><div class="vzf-h"><span class="vzf-l">${lab}</span><span class="vzd">${ic('microphone', 1)}desde tu dictado</span>${ed ? `<button class="lk sm" data-act="vzEdit" data-arg="${lab.toLowerCase()}">${ic('pencil-simple')}Editar</button>` : ''}</div>${val}</div>`;
const miss = '<span class="vz-miss">No lo mencionaste</span>';
def({ id: 'R41', name: 'Revisa lo que entendimos', kind: 'page', back: true, title: 'Revisa la nota', next: ['R35'],
  body: () => { const v = VZ(), p = vzParse(), fl = vzFlags();
    return `<div class="h-l">Revisa lo que entendimos</div><div class="t2 sm mt4">Ordenamos tu dictado en la nota. Revisa cada campo: tú firmas, no la app.</div>
  ${fl.map(f => `<div class="vzu ${v.ok[f[0]] ? 'ok' : ''}">${ic(v.ok[f[0]] ? 'check-circle' : 'warning', 1)}<div class="tx"><b>${v.ok[f[0]] ? 'Confirmado: ' + f[1].replace(/^¿|\?$/g, '') : f[1]}</b><div class="sm">${f[2]}</div>${v.ok[f[0]] ? '' : `<div class="row8 mt8"><button class="btn sm" data-act="vzOk" data-arg="${f[0]}">Sí, confirmo</button><button class="btn sec sm" data-act="vzFix" data-arg="${f[0]}">Corregir</button></div>`}</div></div>`).join('')}
  ${vzf('Resumen', 'Resumen para la familia', `<div class="vzv">Rosa está más animada y durmió bien. La herida se ve más chica y limpia. La inyección salió sin problemas.</div>`)}
  ${vzf('Signos', 'Signos vitales', `<div class="vgrid">${[['PA', p.pa, 'mmHg'], ['FC', p.fc, 'lpm'], ['T°', p.te, '°C'], ['Sat O₂', p.sa, '%'], ['Glicemia', p.gl, 'mg/dL', 'gl'], ['Llegada', S.note.hin, '']].map(x => `<div class="vg ${x[3] && !v.ok[x[3]] ? 'unc' : ''}"><span class="xs t2">${x[0]}</span>${x[1] ? `<b class="num">${x[1]}<small>${x[2]}</small></b>` : miss}</div>`).join('')}</div>`)}
  ${vzf('Curación', 'Curación', `<div class="vzv"><span class="${p.mdDud && !v.ok.md ? 'hl-u' : 'hl'}">${p.md || '—'} cm</span> · úlcera venosa, pierna izquierda (H1)<br>Lecho 80% granulatorio · exudado escaso, seroso · piel alrededor sana · espuma con borde</div>`)}
  ${vzf('Medicamento', 'Medicamentos', p.med ? `${medCard(FAM.mama.meds[2], { c: 1 })}<div class="xs t2 mt4">Hoy: 2ª dosis · glúteo derecho · sin reacción a los 15 min</div><button class="lk sm mt4" data-go="R33">${ic('list-checks')}Revisar los 5 correctos</button>` : miss)}
  ${vzf('Recomendaciones', 'Recomendaciones', `<div class="recs">${Object.values(REC).map(r => `<div>${ic('check-circle', 1)}<span>${r}</span></div>`).join('')}</div>`)}
  ${vzf('Alarmas', 'Señales de alarma', `<div class="vzv">${Object.values(ALR).map(r => '· ' + r).join('<br>')}</div>`)}
  ${vzf('Control', 'Próximo control', `<div class="vzv">${p.prox}</div>`)}
  <button class="vzo" data-act="vzOpen">${ic('waveform')}<span class="tx"><b>Dictado original</b><span class="sm t2">${mmss(Math.max(42, Math.floor(v.t)))} · ${v.mode === 'real' ? 'tu voz' : 'ejemplo'}</span></span>${ic(v.open ? 'caret-up' : 'caret-down')}</button>
  ${v.open ? `<div class="vz-tx sm">${v.mode === 'real' ? v.txt : VZ_SIM}</div>` : ''}
  <button class="row" data-act="vzKeep"><span class="tx"><div class="a">Guardar el audio en la ficha</div><div class="b">Si no, se borra apenas terminamos de transcribir</div></span><span class="tog ${v.keep ? 'on' : ''}"></span></button>
  <div class="mt8">${note('lock-simple', 'El audio no se guarda después de transcribirlo, salvo que tú lo elijas. Solo queda la nota que firmas.')}</div>
  ${checkRow('Revisé cada campo y la nota está correcta', v.rev, 'vzRev', '', 'La firma es tuya y la nota queda con tu registro SIS')}`; },
  foot: () => { const v = VZ(), okAll = vzFlags().every(f => v.ok[f[0]]); return `${abtn(okAll && v.rev ? 'Continuar a firmar' : !okAll ? 'Confirma lo marcado en ámbar' : 'Marca que revisaste la nota', 'vzApply', '', '', 'R35', !(okAll && v.rev))}`; } });
