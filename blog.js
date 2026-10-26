/* ===== Consejos (blog de Cuidapp): tarjetas en el inicio, lista y artículo ===== */
const BLOG = [
  { id: 'b12', tag: 'Vitaminas', g: 'vit', img: 'b12', min: 4, t: '¿Cuándo conviene inyectarse vitamina B12?', d: 'Qué es, quién suele necesitarla y cómo es la visita a domicilio.',
    p: ['La vitamina B12 ayuda a formar glóbulos rojos y al funcionamiento del sistema nervioso. Algunas personas tienen niveles bajos, por ejemplo con ciertas dietas, con la edad o con algunos tratamientos.',
      'La B12 inyectable se indica después de una evaluación médica, normalmente con un examen de sangre. No conviene inyectarse por cuenta propia: el médico define la dosis y cada cuánto.',
      'Si ya tienes la receta y la ampolla, una enfermera puede administrarla en tu casa. Ten a mano la receta y avisa si tienes alergias o tomas anticoagulantes.'],
    cta: ['Agendar vitamina B12 a domicilio', 'svc', 'vb12', 'P10'] },
  { id: 'prev', tag: 'Exámenes', g: 'mue', img: 'preventivos', min: 5, t: 'Exámenes preventivos según tu edad', d: 'Una guía general para conversar con tu médico sobre tu chequeo.',
    p: ['Un chequeo preventivo ayuda a detectar a tiempo cosas como colesterol alto, glicemia elevada o anemia, muchas veces antes de tener síntomas.',
      'Los exámenes más pedidos en un chequeo general son hemograma, perfil lipídico, glicemia, perfil bioquímico y orina completa. Según tu edad, sexo y antecedentes, tu médico puede sumar otros.',
      'Esta lista es orientativa. Consulta a tu profesional qué exámenes te corresponden y cada cuánto repetirlos.'],
    cta: ['Ver exámenes para un chequeo', 'help', 'chq', 'P63'] },
  { id: 'vitd', tag: 'Vitaminas', g: 'vit', img: 'vitd', min: 3, t: 'Vitamina D en invierno', d: 'Por qué baja en los meses con menos sol y cómo saber tu nivel.',
    p: ['El cuerpo produce vitamina D con la luz del sol. En invierno, con días más cortos y más tiempo bajo techo, es común que los niveles bajen.',
      'La forma de saberlo es con un examen de sangre (25-OH vitamina D). Con ese resultado tu médico decide si necesitas suplemento y en qué forma: gotas, cápsulas o ampolla.',
      'No tomes dosis altas sin indicación: el exceso de vitamina D también hace daño. Consulta a tu profesional.'],
    cta: ['Tomarme el examen de vitamina D', 'exAdd', 'vitd', 'P40'] },
  { id: 'cur', tag: 'Cuidados', g: 'cur', img: 'curacion', min: 4, t: 'Cuidados después de una curación', d: 'Qué hacer en casa entre una visita y la siguiente.',
    p: ['Mantén el apósito limpio y seco. Si se moja o se despega, avisa a tu enfermera: puede ser necesario cambiarlo antes.',
      'Lávate las manos antes y después de tocar la zona, y no apliques cremas ni remedios caseros sin preguntar.',
      'Consulta pronto si notas más enrojecimiento, calor, mal olor, secreción o fiebre. Ante cualquier duda, consulta a tu profesional.'],
    cta: ['Agendar una curación', 'svc', 'cur', 'P10'] },
  { id: 'am', tag: 'Exámenes', g: 'mue', img: 'adulto-mayor', min: 4, t: 'Cómo preparar a un adulto mayor para la toma de muestra', d: 'Ayuno, abrigo y compañía para que la toma sea tranquila.',
    p: ['Revisa si algún examen pide ayuno y confirma el horario: las tomas temprano en la mañana son más cómodas cuando hay ayuno.',
      'Que tome agua (salvo indicación distinta), esté abrigado y tenga a mano su carnet y la orden si la tiene. Una manga cómoda facilita la toma.',
      'Si toma medicamentos, pregunta a su médico si debe tomarlos antes o después. Acompáñalo durante la visita: ayuda a que esté tranquilo.'],
    cta: ['Agendar toma de muestra', 'svc', 'mue', 'P40'] },
];
const bimg = b => `img/blog/${b.img}.webp`;
const bcard = b => `<button class="bcard" data-act="set" data-arg="blog=${b.id}" data-go="P67"><span class="bph"><img src="${bimg(b)}" alt="" loading="lazy"></span><span class="bbd"><span class="btag">${b.tag}</span><span class="bt">${b.t}</span><span class="xs t2">${b.min} min de lectura</span></span></button>`;
const consejos = () => `${shd('Consejos', 'P66', '', '', 'Ver blog')}<div class="hcar bcar">${BLOG.map(bcard).join('')}</div>`;

def({ id: 'P66', name: 'Blog · Consejos', kind: 'page', back: true, title: 'Consejos', next: ['P67'],
  body: () => { const f = S.blogF || ''; const l = BLOG.filter(b => !f || b.tag === f);
    return `<div class="sm t2">Guías cortas para saber cuándo pedir vitaminas, exámenes o cuidados. No reemplazan la indicación de tu médico.</div>
    <div class="chips mt16">${[['', 'Todos'], ['Vitaminas', 'Vitaminas'], ['Exámenes', 'Exámenes'], ['Cuidados', 'Cuidados']].map(t => `<button class="chip ${f === t[0] ? 'on' : ''}" data-act="set" data-arg="blogF=${t[0]}">${t[1]}</button>`).join('')}</div>
    <div class="blist mt16">${l.map(b => `<button class="brow" data-act="set" data-arg="blog=${b.id}" data-go="P67"><span class="bph"><img src="${bimg(b)}" alt="" loading="lazy"></span><span class="tx"><span class="btag">${b.tag}</span><span class="bt">${b.t}</span><span class="xs t2">${b.d}</span><span class="xs t3 mt4">${b.min} min de lectura</span></span></button>`).join('')}</div>`; } });

def({ id: 'P67', name: 'Blog · Artículo', kind: 'page', back: true, title: '', next: ['P10', 'P40', 'P63'],
  body: () => { const b = BLOG.find(x => x.id === S.blog) || BLOG[0];
    return `<div class="bhero"><img src="${bimg(b)}" alt=""></div>
    <span class="btag mt16">${b.tag}</span><h1 class="h-l mt8">${b.t}</h1><div class="xs t2 mt4">Equipo de enfermería Cuidapp · ${b.min} min de lectura</div>
    <div class="bbody mt16">${b.p.map(x => `<p>${x}</p>`).join('')}</div>
    <div class="mt16">${note('info', 'Información general. No reemplaza una consulta: ante dudas, consulta a tu profesional.')}</div>
    <div class="lbl2">Sigue leyendo</div><div class="hcar bcar">${BLOG.filter(x => x.id !== b.id).map(bcard).join('')}</div>`; },
  foot: () => { const b = BLOG.find(x => x.id === S.blog) || BLOG[0]; return abtn(b.cta[0], b.cta[1], b.cta[2], '', b.cta[3]); } });
