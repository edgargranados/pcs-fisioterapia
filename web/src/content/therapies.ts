import type { Locale } from "@/lib/locale";

export type Faq = { q: string; a: string };

export type Therapy = {
  id: string;
  slug: Record<Locale, string>;
  image: string;
  imageAlt: Record<Locale, string>;
  name: Record<Locale, string>;
  summary: Record<Locale, string>;
  paragraphs: Record<Locale, string[]>;
  forWhom: Record<Locale, string[]>;
  asideTitle?: Record<Locale, string>;
  asideNote?: Record<Locale, string>;
  faq: Record<Locale, Faq[]>;
};

export const therapies: Therapy[] = [
  {
    id: "manual",
    slug: { es: "terapia-manual", ca: "terapia-manual" },
    image: "/media/terapia-manual.jpg",
    imageAlt: {
      es: "Manos trabajando la espalda en una sesión de terapia manual",
      ca: "Mans treballant l'esquena en una sessió de teràpia manual",
    },
    name: { es: "Terapia manual", ca: "Teràpia manual" },
    summary: {
      es: "Técnicas manuales orientadas a mejorar la movilidad, reducir el dolor y recuperar la funcionalidad.",
      ca: "Tècniques manuals orientades a millorar la mobilitat, reduir el dolor i recuperar la funcionalitat.",
    },
    paragraphs: {
      es: [
        "La terapia manual es una herramienta fundamental en fisioterapia que utiliza diferentes técnicas manuales para mejorar la movilidad, reducir el dolor y favorecer la recuperación de los tejidos.",
        "A través de movilizaciones articulares, técnicas de tejido blando y otras intervenciones específicas, trabajamos para recuperar la funcionalidad y facilitar el movimiento.",
        "Cada tratamiento se adapta a las necesidades de cada persona, teniendo en cuenta su situación, sus objetivos y las actividades que quiere volver a realizar, tanto en el día a día como en la práctica deportiva.",
        "La terapia manual se combina con ejercicio terapéutico y otras técnicas de fisioterapia cuando es necesario, con el objetivo de conseguir una recuperación completa y duradera.",
      ],
      ca: [
        "La teràpia manual és una eina fonamental en fisioteràpia que utilitza diferents tècniques manuals per millorar la mobilitat, reduir el dolor i afavorir la recuperació dels teixits.",
        "A través de mobilitzacions articulars, tècniques de teixit tou i altres intervencions específiques, treballem per recuperar la funcionalitat i facilitar el moviment.",
        "Cada tractament s'adapta a les necessitats de cada persona, tenint en compte la seva situació, els seus objectius i les activitats que vol tornar a realitzar, tant en el dia a dia com en la pràctica esportiva.",
        "La teràpia manual es combina amb exercici terapèutic i altres tècniques de fisioteràpia quan és necessari, amb l'objectiu d'aconseguir una recuperació completa i duradora.",
      ],
    },
    forWhom: {
      es: [
        "Personas con dolor musculoesquelético que interfiere en su día a día.",
        "Personas con limitaciones de movilidad en el hombro, la cadera o la rodilla.",
        "Deportistas que han sufrido una lesión o molestia, tanto durante el entrenamiento como en su día a día, y quieren volver a practicar deporte y recuperar su funcionalidad.",
        "Personas que quieren entender el origen de sus molestias y participar activamente en su proceso de recuperación.",
      ],
      ca: [
        "Persones amb dolor musculoesquelètic que interfereix en el seu dia a dia.",
        "Persones amb limitacions de mobilitat a l'espatlla, el maluc o el genoll.",
        "Esportistes que han patit una lesió o molèstia, tant durant l'entrenament com en el seu dia a dia, i volen tornar a practicar esport i recuperar la seva funcionalitat.",
        "Persones que volen entendre l'origen de les seves molèsties i participar activament en el seu procés de recuperació.",
      ],
    },
    faq: {
      es: [
        {
          q: "¿La terapia manual provoca molestias?",
          a: "La terapia manual no debería generar molestias. Las técnicas se adaptan a cada persona, respetando siempre su sensibilidad y sus límites.",
        },
        {
          q: "¿Sirve si no hago deporte?",
          a: "Sí. La fisioterapia está indicada tanto para personas deportistas como para aquellas que quieren mejorar su día a día, aliviar el dolor y recuperar la movilidad y la funcionalidad.",
        },
        {
          q: "¿Cuántas sesiones hacen falta?",
          a: "Depende de cada caso, de la lesión y de la evolución de cada persona. En la primera visita hacemos una valoración y establecemos un plan de tratamiento adaptado a tus necesidades.",
        },
      ],
      ca: [
        {
          q: "La teràpia manual provoca molèsties?",
          a: "La teràpia manual no hauria de generar molèsties. Les tècniques s'adapten a cada persona, respectant sempre la seva sensibilitat i els seus límits.",
        },
        {
          q: "Serveix si no faig esport?",
          a: "Sí. La fisioteràpia està indicada tant per a persones esportistes com per a aquelles que volen millorar el seu dia a dia, alleujar el dolor i recuperar la mobilitat i la funcionalitat.",
        },
        {
          q: "Quantes sessions calen?",
          a: "Depèn de cada cas, de la lesió i de l'evolució de cada persona. A la primera visita fem una valoració i establim un pla de tractament adaptat a les teves necessitats.",
        },
      ],
    },
  },
  {
    id: "dry",
    slug: { es: "puncion-seca", ca: "puncio-seca" },
    image: "/media/puncion-seca.jpg",
    imageAlt: {
      es: "Punción seca en el hombro, con aguja fina y guantes",
      ca: "Punció seca a l'espatlla, amb agulla fina i guants",
    },
    name: { es: "Punción seca", ca: "Punció seca" },
    summary: {
      es: "Técnica invasiva utilizada en el tratamiento de determinadas disfunciones musculares.",
      ca: "Tècnica invasiva utilitzada en el tractament de determinades disfuncions musculars.",
    },
    paragraphs: {
      es: [
        "La punción seca es una técnica de fisioterapia invasiva que se utiliza para tratar puntos de tensión muscular (puntos gatillo), que pueden provocar dolor y limitar el movimiento.",
        "Durante la aplicación se puede notar una pequeña contracción muscular. Después, a veces, puede aparecer una ligera sensibilidad en la zona que suele desaparecer en poco tiempo.",
        "La técnica se adapta a cada persona y se puede combinar con terapia manual y ejercicio terapéutico para favorecer la recuperación y mejorar la funcionalidad.",
      ],
      ca: [
        "La punció seca és una tècnica de fisioteràpia invasiva que s'utilitza per tractar punts de tensió muscular (punts gallet), que poden provocar dolor i limitar el moviment.",
        "Durant l'aplicació es pot notar una petita contracció muscular. Després, de vegades, pot aparèixer una lleugera sensibilitat a la zona que acostuma a desaparèixer en poc temps.",
        "La tècnica s'adapta a cada persona i es pot combinar amb teràpia manual i exercici terapèutic per afavorir la recuperació i millorar la funcionalitat.",
      ],
    },
    forWhom: {
      es: [
        "Personas con puntos de tensión muscular que generan dolor.",
        "Cuando hace falta complementar la terapia manual con una técnica más específica para trabajar la musculatura.",
      ],
      ca: [
        "Persones amb punts de tensió musculars que generen dolor.",
        "Quan es necessita complementar la teràpia manual amb una tècnica més específica per treballar la musculatura.",
      ],
    },
    faq: {
      es: [
        {
          q: "¿Qué notaré durante la punción seca?",
          a: "Puedes notar una pequeña sensación de presión o una respuesta muscular local durante la aplicación. La técnica se adapta a cada persona y a su tolerancia.",
        },
        {
          q: "¿Qué notaré después del tratamiento?",
          a: "Es posible notar una ligera sensibilidad o sensación de carga muscular durante las horas posteriores, que suele desaparecer en poco tiempo.",
        },
        {
          q: "¿Puedo entrenar después de la punción seca?",
          a: "Sí. Se recomienda adaptar la intensidad del entrenamiento según la respuesta de la zona tratada.",
        },
        {
          q: "¿Es lo mismo que la acupuntura?",
          a: "No. Aunque utilizan elementos similares, la punción seca es una técnica de fisioterapia orientada al tratamiento de los puntos gatillo miofasciales.",
        },
      ],
      ca: [
        {
          q: "Què notaré durant la punció seca?",
          a: "Pots notar una petita sensació de pressió o una resposta muscular local durant l'aplicació. La tècnica s'adapta a cada persona i a la seva tolerància.",
        },
        {
          q: "Què notaré després del tractament?",
          a: "És possible notar una lleugera sensibilitat o sensació de càrrega muscular durant les hores posteriors, que acostuma a desaparèixer en poc temps.",
        },
        {
          q: "Puc entrenar després de la punció seca?",
          a: "Sí. Es recomana adaptar la intensitat de l'entrenament segons la resposta de la zona tractada.",
        },
        {
          q: "És el mateix que l'acupuntura?",
          a: "No. Tot i que utilitzen elements similars, la punció seca és una tècnica de fisioteràpia orientada al tractament dels punts gallet miofascials.",
        },
      ],
    },
  },
  {
    id: "neuro",
    slug: { es: "neuromodulacion", ca: "neuromodulacio" },
    image: "/media/neuromodulacion-aparato.jpg",
    imageAlt: {
      es: "Aparato de neuromodulación junto al hombro durante una sesión",
      ca: "Aparell de neuromodulació al costat de l'espatlla durant una sessió",
    },
    name: { es: "Neuromodulación", ca: "Neuromodulació" },
    summary: {
      es: "Aplicación de técnicas de estimulación percutánea del sistema nervioso con distintos objetivos terapéuticos.",
      ca: "Aplicació de tècniques d'estimulació percutània del sistema nerviós amb diferents objectius terapèutics.",
    },
    paragraphs: {
      es: [
        "La neuromodulación percutánea es una técnica de fisioterapia invasiva que utiliza estimulación eléctrica de baja intensidad para actuar sobre el sistema nervioso y modular la respuesta muscular y la percepción del dolor.",
        "Es una técnica especialmente útil cuando hay alteraciones en la activación muscular, dificultades en determinados movimientos o molestias que afectan a la actividad física y deportiva.",
        "La intensidad y los parámetros del tratamiento se adaptan a cada persona según la valoración y la respuesta.",
        "Se puede combinar con terapia manual, punción seca y ejercicio terapéutico para conseguir un tratamiento más completo e individualizado.",
      ],
      ca: [
        "La neuromodulació percutània és una tècnica de fisioteràpia invasiva que utilitza estimulació elèctrica de baixa intensitat per actuar sobre el sistema nerviós i modular la resposta muscular i la percepció del dolor.",
        "És una tècnica especialment útil quan hi ha alteracions en l'activació muscular, dificultats en determinats moviments o molèsties que afecten l'activitat física i esportiva.",
        "La intensitat i els paràmetres del tractament s'adapten a cada persona segons la valoració i la resposta.",
        "Es pot combinar amb teràpia manual, punció seca i exercici terapèutic per aconseguir un tractament més complet i individualitzat.",
      ],
    },
    forWhom: {
      es: [
        "Dolor muscular y puntos gatillo.",
        "Tendinopatías (hombro, rodilla, Aquiles, codo…).",
        "Dolor cervical y lumbar.",
        "Lesiones musculares y deportivas.",
        "Dolor articular.",
        "Alteraciones de la activación y el control muscular.",
        "Dolor neuropático e irradiado.",
        "Déficits de fuerza y control neuromuscular.",
      ],
      ca: [
        "Dolor muscular i punts gallet.",
        "Tendinopaties (espatlla, genoll, Aquil·les, colze…).",
        "Dolor cervical i lumbar.",
        "Lesions musculars i esportives.",
        "Dolor articular.",
        "Alteracions de l'activació i el control muscular.",
        "Dolor neuropàtic i irradiat.",
        "Dèficits de força i control neuromuscular.",
      ],
    },
    asideTitle: { es: "¿Para qué patologías?", ca: "Per a quines patologies?" },
    asideNote: {
      es: "Importante: la neuromodulación percutánea no está indicada de forma general para todas estas patologías; hay que valorar cada caso y seleccionarla según los objetivos terapéuticos.",
      ca: "Important: la neuromodulació percutània no està indicada de manera general per a totes aquestes patologies; cal valorar cada cas i seleccionar-la segons els objectius terapèutics.",
    },
    faq: {
      es: [
        {
          q: "¿Se nota la corriente?",
          a: "Sí. Puedes notar una sensación rítmica o pequeños impulsos musculares, siempre tolerables y adaptados a cada persona. La intensidad se regula durante toda la sesión.",
        },
        {
          q: "¿En qué se diferencia de la punción seca?",
          a: "La punción seca actúa principalmente sobre el tejido muscular mediante una aguja. La neuromodulación añade un estímulo eléctrico para trabajar sobre el sistema nervioso, el dolor y la activación muscular. Se pueden combinar según el caso.",
        },
        {
          q: "¿Cuántas sesiones necesitaré?",
          a: "Depende de cada caso, del tipo de lesión y de la respuesta al tratamiento. Después de la valoración inicial, establecemos un plan de tratamiento individualizado según tus necesidades.",
        },
      ],
      ca: [
        {
          q: "Es nota el corrent?",
          a: "Sí. Pots notar una sensació rítmica o petits impulsos musculars, sempre tolerables i adaptats a cada persona. La intensitat es regula durant tota la sessió.",
        },
        {
          q: "En què es diferencia de la punció seca?",
          a: "La punció seca actua principalment sobre el teixit muscular mitjançant una agulla. La neuromodulació afegeix un estímul elèctric per treballar sobre el sistema nerviós, el dolor i l'activació muscular. Es poden combinar segons el cas.",
        },
        {
          q: "Quantes sessions necessitaré?",
          a: "Depèn de cada cas, del tipus de lesió i de la resposta al tractament. Després de la valoració inicial, establim un pla de tractament individualitzat segons les teves necessitats.",
        },
      ],
    },
  },
  {
    id: "exercise",
    slug: { es: "ejercicio-terapeutico", ca: "exercici-terapeutic" },
    image: "/media/terapia-manual-bn.jpg",
    imageAlt: {
      es: "Trabajo manual sobre la espalda, el paso previo a cargar con ejercicio",
      ca: "Treball manual sobre l'esquena, el pas previ a carregar amb exercici",
    },
    name: { es: "Ejercicio terapéutico", ca: "Exercici terapèutic" },
    summary: {
      es: "Ejercicios individualizados para recuperar fuerza, movilidad, estabilidad y control motor.",
      ca: "Exercicis individualitzats per recuperar força, mobilitat, estabilitat i control motor.",
    },
    paragraphs: {
      es: [
        "El ejercicio terapéutico es una parte fundamental del proceso de recuperación. Mediante el trabajo de fuerza, control y movilidad, buscamos recuperar la funcionalidad, mejorar la capacidad física y volver progresivamente a las actividades que te generan molestias.",
        "Cada programa de ejercicios se adapta a las necesidades y objetivos de cada persona. Tanto si practicas deporte como si no, los ejercicios se planifican teniendo en cuenta tu nivel físico, tus actividades y tu día a día.",
        "El objetivo no es solo aliviar el dolor, sino conseguir una mejora duradera, recuperar la confianza en el movimiento y prevenir posibles recaídas.",
        "No hace falta tener experiencia deportiva ni entrenar en un centro concreto. El ejercicio se adapta a ti, a tu ritmo y a tus necesidades.",
      ],
      ca: [
        "L'exercici terapèutic és una part fonamental del procés de recuperació. Mitjançant el treball de força, control i mobilitat, busquem recuperar la funcionalitat, millorar la capacitat física i tornar progressivament a les activitats que et generen molèsties.",
        "Cada programa d'exercicis s'adapta a les necessitats i objectius de cada persona. Tant si practiques esport com si no, els exercicis es planifiquen tenint en compte el teu nivell físic, les teves activitats i el teu dia a dia.",
        "L'objectiu no és només alleujar el dolor, sinó aconseguir una millora duradora, recuperar la confiança en el moviment i prevenir possibles recaigudes.",
        "No cal tenir experiència esportiva ni entrenar en cap centre específic. L'exercici s'adapta a tu, al teu ritme i a les teves necessitats.",
      ],
    },
    forWhom: {
      es: [
        "Quien ya no tiene un dolor agudo y quiere que no vuelva al cargar",
        "Deportistas de crosstraining, carrera, pádel o deporte de equipo",
        "Gente que trabaja de pie o sentada y necesita fuerza útil",
        "Después de terapia manual, punción o neuromodulación",
      ],
      ca: [
        "Qui ja no té un dolor agut i vol que no torni en carregar",
        "Esportistes de crosstraining, cursa, pàdel o esport d'equip",
        "Gent que treballa dreta o asseguda i necessita força útil",
        "Després de teràpia manual, punció o neuromodulació",
      ],
    },
    faq: {
      es: [
        {
          q: "¿Tengo que ir al gimnasio?",
          a: "No. Los ejercicios se adaptan a tus recursos y necesidades. Si entrenas en un gimnasio, podemos aprovecharlo; si no, preparamos un programa que puedas hacer en casa y adaptar a tu día a día.",
        },
        {
          q: "¿Puedo seguir entrenando?",
          a: "En la mayoría de los casos, sí. Adaptamos los ejercicios y las cargas según cada situación para poder mantener la actividad física sin comprometer la recuperación.",
        },
        {
          q: "¿El ejercicio terapéutico sustituye el tratamiento en el box?",
          a: "No siempre. En algunos casos, el tratamiento manual ayuda a reducir el dolor y facilita el movimiento. El ejercicio terapéutico permite consolidar la recuperación y mejorar la funcionalidad a largo plazo.",
        },
      ],
      ca: [
        {
          q: "He d'anar al gimnàs?",
          a: "No. Els exercicis s'adapten als teus recursos i necessitats. Si entrenes en un gimnàs, podem aprofitar-lo; si no, preparem un programa que puguis fer a casa i adaptar al teu dia a dia.",
        },
        {
          q: "Puc seguir entrenant?",
          a: "En la majoria dels casos, sí. Adaptem els exercicis i les càrregues segons cada situació per poder mantenir l'activitat física sense comprometre la recuperació.",
        },
        {
          q: "L'exercici terapèutic substitueix el tractament dins del box?",
          a: "No sempre. En alguns casos, el tractament manual ajuda a reduir el dolor i facilita el moviment. L'exercici terapèutic permet consolidar la recuperació i millorar la funcionalitat a llarg termini.",
        },
      ],
    },
  },
  {
    id: "return",
    slug: { es: "readaptacion-deportiva", ca: "readaptacio-esportiva" },
    image: "/media/neuromodulacion-bn.jpg",
    imageAlt: {
      es: "Trabajo sobre el hombro en un proceso de recuperación deportiva",
      ca: "Treball sobre l'espatlla en un procés de recuperació esportiva",
    },
    name: { es: "Readaptación deportiva", ca: "Readaptació esportiva" },
    summary: {
      es: "Trabajo progresivo para recuperar las capacidades físicas y volver a la actividad deportiva con garantías.",
      ca: "Treball progressiu per recuperar les capacitats físiques i tornar a l'activitat esportiva amb garanties.",
    },
    paragraphs: {
      es: [
        "La readaptación deportiva es el puente entre superar una lesión y recuperar la capacidad de hacer vida normal y volver a practicar tu deporte con confianza y seguridad.",
        "Está pensada tanto para personas que quieren recuperar las actividades de su día a día como para quienes practican crosstraining, running, pádel u otros deportes y quieren volver a entrenar sin precipitarse.",
        "El trabajo se basa en una progresión individualizada, adaptando los ejercicios y las cargas a cada persona. Buscamos recuperar la fuerza, la movilidad, la coordinación y la capacidad de movimiento necesarias para volver a las actividades habituales o deportivas con garantías.",
        "Cada fase se adapta a tu evolución, aumentando la exigencia hasta recuperar las actividades habituales, los entrenamientos o la competición.",
        "La consulta está ubicada dentro de un centro de entrenamiento, lo que permite trabajar con ejercicios y movimientos adaptados a las necesidades de cada persona.",
        "El objetivo no es simplemente superar una lesión, sino recuperar la confianza, la funcionalidad y la capacidad de volver a hacer lo que te gusta.",
      ],
      ca: [
        "La readaptació esportiva és el pont entre superar una lesió i recuperar la capacitat de fer vida normal i tornar a practicar el teu esport amb confiança i seguretat.",
        "Està pensada tant per a persones que volen recuperar les activitats del seu dia a dia com per a aquelles que practiquen crosstraining, running, pàdel o altres esports i volen tornar a entrenar sense precipitar-se.",
        "El treball es basa en una progressió individualitzada, adaptant els exercicis i les càrregues a cada persona. Busquem recuperar la força, la mobilitat, la coordinació i la capacitat de moviment necessàries per tornar a les activitats habituals o esportives amb garanties.",
        "Cada fase s'adapta a la teva evolució, augmentant l'exigència fins a recuperar les activitats habituals, els entrenaments o la competició.",
        "La consulta està ubicada dins d'un centre d'entrenament, fet que permet treballar amb exercicis i moviments adaptats a les necessitats de cada persona.",
        "L'objectiu no és simplement superar una lesió, sinó recuperar la confiança, la funcionalitat i la capacitat de tornar a fer allò que t'agrada.",
      ],
    },
    forWhom: {
      es: [
        "Personas que quieren volver al crosstraining después de una lesión.",
        "Deportistas que quieren recuperar progresivamente su nivel físico después de una lesión.",
        "Personas que tienen recaídas cuando aumentan la intensidad o la carga de entrenamiento.",
        "Personas que todavía no toleran determinados movimientos o gestos deportivos.",
        "Personas que ya han hecho tratamiento de fisioterapia y necesitan completar la recuperación con un trabajo progresivo de fuerza y carga.",
        "Personas que quieren recuperar su capacidad física y volver a las actividades habituales con confianza.",
      ],
      ca: [
        "Persones que volen tornar al crosstraining després d'una lesió.",
        "Esportistes que volen recuperar progressivament el seu nivell físic després d'una lesió.",
        "Persones que tenen recaigudes quan augmenten la intensitat o la càrrega d'entrenament.",
        "Persones que encara no toleren determinats moviments o gestos esportius.",
        "Persones que ja han fet tractament de fisioteràpia i necessiten completar la recuperació amb un treball progressiu de força i càrrega.",
        "Persones que volen recuperar la seva capacitat física i tornar a les activitats habituals amb confiança.",
      ],
    },
    faq: {
      es: [
        {
          q: "¿Cuánto dura una readaptación?",
          a: "Depende del tipo de lesión, de su evolución y del punto de partida de cada persona. No hay un tiempo establecido, ya que cada proceso de recuperación es diferente.",
        },
        {
          q: "¿Necesito hacer deporte para empezar una readaptación?",
          a: "No. La readaptación no es exclusiva de los deportistas. También está indicada para personas que quieren recuperar la fuerza, la movilidad y la funcionalidad para volver a hacer las actividades de su día a día.",
        },
        {
          q: "¿Me puedo lesionar si vuelvo antes de hora?",
          a: "Sí, volver a aumentar la carga demasiado rápido puede favorecer una recaída. Por eso, la progresión se basa en criterios físicos y funcionales, no únicamente en el tiempo transcurrido.",
        },
      ],
      ca: [
        {
          q: "Quant dura una readaptació?",
          a: "Depèn del tipus de lesió, de la seva evolució i del punt de partida de cada persona. No hi ha un temps establert, ja que cada procés de recuperació és diferent.",
        },
        {
          q: "Necessito fer esport per començar una readaptació?",
          a: "No. La readaptació no és exclusiva dels esportistes. També està indicada per a persones que volen recuperar la força, la mobilitat i la funcionalitat per tornar a fer les activitats del seu dia a dia.",
        },
        {
          q: "Em puc lesionar si torno abans d'hora?",
          a: "Sí, tornar a augmentar la càrrega massa ràpid pot afavorir una recaiguda. Per això, la progressió es basa en criteris físics i funcionals, no únicament en el temps transcorregut.",
        },
      ],
    },
  },
];

const displayOrder = ["manual", "exercise", "dry", "neuro", "return"];

export function orderedTherapies() {
  return displayOrder.map((id) => {
    const therapy = therapies.find((item) => item.id === id);
    if (!therapy) throw new Error(`Missing therapy ${id}`);
    return therapy;
  });
}

export function therapyBySlug(locale: Locale, slug: string) {
  return therapies.find((therapy) => therapy.slug[locale] === slug);
}
