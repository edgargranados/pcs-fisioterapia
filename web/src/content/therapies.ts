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
  note: Record<Locale, string>;
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
        "La terapia manual es el trabajo con las manos: movilización articular, tejido blando y un contacto que busca devolver movimiento donde el dolor lo ha cerrado. En Mataró, Pol la usa como primera herramienta cuando una espalda, un hombro o un cuello no dejan entrenar ni trabajar a gusto.",
        "No es un masaje para «quitar contracturas» y ya. Sirve para que la zona acepte carga otra vez. Por eso casi siempre va seguida de ejercicio terapéutico: lo que se gana en la camilla se tiene que poder usar al día siguiente en el box, corriendo o en la oficina.",
        "En la visita se decide cuánta mano hace falta. A veces es el centro de la sesión. A veces son unos minutos para poder punzar, aplicar neuromodulación o enseñar un ejercicio sin que el dolor mande.",
      ],
      ca: [
        "La teràpia manual és el treball amb les mans: mobilització articular, teixit tou i un contacte que busca tornar moviment on el dolor l'ha tancat. A Mataró, Pol la fa servir com a primera eina quan una esquena, una espatlla o un coll no deixen entrenar ni treballar a gust.",
        "No és un massatge per «treure contractures» i prou. Serveix perquè la zona accepti càrrega una altra vegada. Per això gairebé sempre va seguida d'exercici terapèutic: el que es guanya a la llitera s'ha de poder fer servir l'endemà al box, corrent o a l'oficina.",
        "A la visita es decideix quanta mà cal. De vegades és el centre de la sessió. De vegades són uns minuts per poder punxar, aplicar neuromodulació o ensenyar un exercici sense que el dolor mani.",
      ],
    },
    forWhom: {
      es: [
        "Dolor de espalda, cuello o cabeza que limita el día",
        "Hombro, cadera o rodilla cortos de movimiento",
        "Después de un gesto brusco entrenando, antes de volver a cargar",
        "Quien quiere entender qué pasa, no solo que le crujan la espalda",
      ],
      ca: [
        "Dolor d'esquena, coll o cap que limita el dia",
        "Espatlla, maluc o genoll curts de moviment",
        "Després d'un gest brusc entrenant, abans de tornar a carregar",
        "Qui vol entendre què passa, no només que li facin cruixir l'esquena",
      ],
    },
    note: {
      es: "No sustituye al ejercicio si el objetivo es volver al deporte. Y no es un sitio donde se prometa una sesión milagro.",
      ca: "No substitueix l'exercici si l'objectiu és tornar a l'esport. I no és un lloc on es prometi una sessió miracle.",
    },
    faq: {
      es: [
        {
          q: "¿Duele la terapia manual?",
          a: "Puede haber molestia mientras se mueve una zona irritable. Se gradúa. Si no puedes relajarte, se cambia el plan en la misma visita.",
        },
        {
          q: "¿Sirve si no hago deporte?",
          a: "Sí. El trabajo de pie, el ordenador o cargar peso también son carga. En Mataró no solo viene gente del box.",
        },
        {
          q: "¿Cuántas sesiones hacen falta?",
          a: "No hay un número de catálogo. Depende de qué no puedes hacer y de cómo responde tu cuerpo. Se habla en la primera visita, en Via Sèrgia 32.",
        },
      ],
      ca: [
        {
          q: "Fa mal la teràpia manual?",
          a: "Pot haver-hi molèstia mentre es mou una zona irritable. Es gradua. Si no et pots relaxar, es canvia el pla a la mateixa visita.",
        },
        {
          q: "Serveix si no faig esport?",
          a: "Sí. La feina dreta, l'ordinador o carregar pes també són càrrega. A Mataró no només ve gent del box.",
        },
        {
          q: "Quantes sessions calen?",
          a: "No hi ha un número de catàleg. Depèn de què no pots fer i de com respon el teu cos. Se'n parla a la primera visita, a Via Sèrgia 32.",
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
        "La punción seca es una aguja fina sobre un punto muscular sensible que cambia la forma de moverte. No es acupuntura: es una herramienta de fisioterapia para el punto gatillo y el músculo que no suelta.",
        "En la consulta de Via Sèrgia se usa cuando el dolor tiene un componente muscular claro —gemelo, cuádriceps, glúteo, espalda, antebrazo— y la mano sola no llega. A menudo se nota un espasmo breve y local. Después la zona puede estar cargada unas horas. Es frecuente y se explica antes de pinchar.",
        "No todo el mundo es candidato. En la visita se preguntan medicación, coagulación, miedo a la aguja, embarazo o una infección en la piel. Si no encaja, hay otras vías: terapia manual, neuromodulación o ejercicio.",
      ],
      ca: [
        "La punció seca és una agulla fina sobre un punt muscular sensible que canvia la manera de moure't. No és acupuntura: és una eina de fisioteràpia per al punt gallet i el múscul que no deixa anar.",
        "A la consulta de Via Sèrgia es fa servir quan el dolor té un component muscular clar —bessó, quàdriceps, glutis, esquena, avantbraç— i la mà sola no hi arriba. Sovint es nota un espasme breu i local. Després la zona pot quedar carregada unes hores. És freqüent i s'explica abans de punxar.",
        "No tothom és candidat. A la visita es pregunten medicació, coagulació, por de l'agulla, embaràs o una infecció a la pell. Si no encaixa, hi ha altres vies: teràpia manual, neuromodulació o exercici.",
      ],
    },
    forWhom: {
      es: [
        "Puntos del gemelo, el cuádriceps o el glúteo que limitan correr o saltar",
        "Dolor de espalda con banda muscular clara",
        "Antebrazo y codo de quien entrena o trabaja con las manos",
        "Cuando la terapia manual no llega al músculo que se queja",
      ],
      ca: [
        "Punts del bessó, el quàdriceps o el gluti que limiten córrer o saltar",
        "Dolor d'esquena amb una banda muscular clara",
        "Avantbraç i colze de qui entrena o treballa amb les mans",
        "Quan la teràpia manual no arriba al múscul que es queixa",
      ],
    },
    note: {
      es: "La aguja es intensa y corta. No se busca aguantar por aguantar, y no se pincha un día en el que no puedas permitirte la molestia posterior.",
      ca: "L'agulla és intensa i curta. No es busca aguantar per aguantar, i no es punxa un dia en què no et puguis permetre la molèstia posterior.",
    },
    faq: {
      es: [
        {
          q: "¿Duele mucho la punción seca?",
          a: "El momento de la aguja es intenso y breve. Antes se explica qué vas a notar. Si el miedo manda, se elige otra herramienta.",
        },
        {
          q: "¿Queda marca?",
          a: "A veces un hematoma pequeño. Se advierte en la visita. No es la norma en todas las zonas.",
        },
        {
          q: "¿Puedo entrenar después de la punción?",
          a: "Depende del tejido y de lo que se haya hecho. A veces toca bajar la carga ese día. Se dice antes de que salgas de Via Sèrgia.",
        },
      ],
      ca: [
        {
          q: "Fa molt mal la punció seca?",
          a: "El moment de l'agulla és intens i breu. Abans s'explica què notaràs. Si la por mana, s'escull una altra eina.",
        },
        {
          q: "Queda marca?",
          a: "De vegades un hematoma petit. S'avisa a la visita. No és la norma a totes les zones.",
        },
        {
          q: "Puc entrenar després de la punció?",
          a: "Depèn del teixit i del que s'hagi fet. De vegades toca baixar la càrrega aquell dia. Es diu abans que surtis de Via Sèrgia.",
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
        "La neuromodulación percutánea usa una aguja muy fina y una corriente suave, dosificada, para modular el dolor y la forma en la que el músculo se activa. No es pegar unos parches y marcharse: la corriente se dirige y se ajusta mientras se valora la respuesta.",
        "Tiene sentido cuando el dolor se ha vuelto pesado, cuando un músculo no entra en el gesto —un hombro que no sube limpio, un cuádriceps que no empuja, un tendón que se queja al correr— o cuando la punción seca sola se queda corta.",
        "La intensidad se decide en la visita, no con un protocolo sacado de internet. Si hay marcapasos, embarazo o una herida en la zona, se valora antes y, si no toca, no se hace.",
      ],
      ca: [
        "La neuromodulació percutània fa servir una agulla molt fina i un corrent suau, dosificat, per modular el dolor i la manera com el múscul s'activa. No és enganxar uns pegats i marxar: el corrent es dirigeix i s'ajusta mentre es valora la resposta.",
        "Té sentit quan el dolor s'ha fet pesat, quan un múscul no entra al gest —una espatlla que no puja neta, un quàdriceps que no empeny, un tendó que es queixa en córrer— o quan la punció seca sola es queda curta.",
        "La intensitat es decideix a la visita, no amb un protocol tret d'internet. Si hi ha marcapassos, embaràs o una ferida a la zona, es valora abans i, si no toca, no es fa.",
      ],
    },
    forWhom: {
      es: [
        "Dolor que ya dura y no cede solo con las manos",
        "Un músculo que no se activa en el gesto del deporte",
        "Tendón de hombro, rodilla o Aquiles que se queja al cargar",
        "Como complemento de la punción seca, cuando hace falta",
      ],
      ca: [
        "Dolor que ja dura i no cedeix només amb les mans",
        "Un múscul que no s'activa en el gest de l'esport",
        "Tendó d'espatlla, genoll o Aquil·les que es queixa en carregar",
        "Com a complement de la punció seca, quan cal",
      ],
    },
    note: {
      es: "La corriente se tiene que poder tolerar. Si deja de serlo, se baja o se para. No hay una frecuencia mágica que sirva para todo el mundo.",
      ca: "El corrent s'ha de poder tolerar. Si deixa de ser-ho, es baixa o s'atura. No hi ha una freqüència màgica que serveixi per a tothom.",
    },
    faq: {
      es: [
        {
          q: "¿Se nota la corriente?",
          a: "Sí: una sensación rítmica y tolerable. Tú puedes decir que baje. La sesión no consiste en aguantar.",
        },
        {
          q: "¿En qué se diferencia de la punción seca?",
          a: "La punción busca el punto muscular. La neuromodulación añade un estímulo eléctrico para cambiar dolor y activación. A veces se combinan. A veces basta una de las dos.",
        },
        {
          q: "¿Duele al día siguiente?",
          a: "Puede haber sensación de haber trabajado la zona. No debería impedirte caminar ni dormir. Si pasa, se comenta en la siguiente visita en Mataró.",
        },
      ],
      ca: [
        {
          q: "Es nota el corrent?",
          a: "Sí: una sensació rítmica i tolerable. Tu pots dir que baixi. La sessió no consisteix a aguantar.",
        },
        {
          q: "En què es diferencia de la punció seca?",
          a: "La punció busca el punt muscular. La neuromodulació hi afegeix un estímul elèctric per canviar dolor i activació. De vegades es combinen. De vegades en basta una de les dues.",
        },
        {
          q: "Fa mal l'endemà?",
          a: "Pot haver-hi sensació d'haver treballat la zona. No t'hauria d'impedir caminar ni dormir. Si passa, es comenta a la visita següent a Mataró.",
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
        "El ejercicio terapéutico es la parte que hace que el alivio dure. Fuerza, control y exposición gradual a lo que te duele hacer: una sentadilla, una carrera, un press, un día largo de pie.",
        "Pol también es entrenador personal en Oikos, así que el ejercicio no sale de una fotocopia genérica. Si ya entrenas en el box, el plan puede convivir con tu programación. Si no entrenas, no hace falta apuntarte a nada: se adapta a tu casa, tu tiempo y tu deporte, sea pádel, correr, nadar o ninguno.",
        "La dosis importa más que la lista. Pocas cosas, bien elegidas, con un criterio de cuándo subir y cuándo parar. El objetivo es que sepas qué hacer el martes.",
      ],
      ca: [
        "L'exercici terapèutic és la part que fa que l'alleujament duri. Força, control i exposició gradual al que et fa mal fer: una esquat, una cursa, un press, un dia llarg dret.",
        "Pol també és entrenador personal a Oikos, així que l'exercici no surt d'una fotocòpia genèrica. Si ja entrenes al box, el pla pot conviure amb la teva programació. Si no entrenes, no cal apuntar-te a res: s'adapta a casa teva, al teu temps i al teu esport, sigui pàdel, córrer, nedar o cap.",
        "La dosi importa més que la llista. Poques coses, ben triades, amb un criteri de quan pujar i quan parar. L'objectiu és que sàpigues què fer dimarts.",
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
    note: {
      es: "No hace falta ser socio de Oikos. El centro es el lugar de la consulta, no un requisito para tratarte.",
      ca: "No cal ser soci d'Oikos. El centre és el lloc de la consulta, no un requisit per tractar-te.",
    },
    faq: {
      es: [
        {
          q: "¿Tengo que ir al gimnasio?",
          a: "No. Si tienes uno, se usa. Si no, se busca una versión que quepa en tu semana y en tu casa.",
        },
        {
          q: "¿Puedo seguir yendo a clase?",
          a: "Casi siempre sí, con ajustes. Parar del todo solo cuando cargar empeora la lesión de forma clara.",
        },
        {
          q: "¿Esto sustituye a la camilla?",
          a: "No siempre. A veces primero hay que bajar el dolor para poder cargar. El ejercicio es lo que consolida el cambio.",
        },
      ],
      ca: [
        {
          q: "He d'anar al gimnàs?",
          a: "No. Si en tens un, es fa servir. Si no, es busca una versió que cap a la teva setmana i a casa teva.",
        },
        {
          q: "Puc seguir anant a classe?",
          a: "Gairebé sempre sí, amb ajustos. Parar del tot només quan carregar empitjora la lesió de manera clara.",
        },
        {
          q: "Això substitueix la llitera?",
          a: "No sempre. De vegades primer cal baixar el dolor per poder carregar. L'exercici és el que consolida el canvi.",
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
        "La readaptación deportiva es el puente entre «ya no me duele en la camilla» y «he vuelto a mi deporte». Pol la plantea para quien hace crosstraining, corre, juega a pádel o a un deporte de equipo y no quiere reaparecer el mismo día a la misma carga de antes.",
        "No va por calendario. Va por criterios: movimiento sin miedo, fuerza suficiente, el gesto del deporte tolerado y, entonces, la vuelta al grupo. Cada fase se explica con lo que puedes hacer y lo que todavía no.",
        "La consulta está dentro de un centro de entrenamiento. El final del proceso no es un alta en un papel: es que la carga del box, de la pista o de la carretera vuelva a ser tuya.",
      ],
      ca: [
        "La readaptació esportiva és el pont entre «ja no em fa mal a la llitera» i «he tornat al meu esport». Pol la planteja per a qui fa crosstraining, corre, juga a pàdel o a un esport d'equip i no vol reaparèixer el mateix dia a la mateixa càrrega d'abans.",
        "No va per calendari. Va per criteris: moviment sense por, força suficient, el gest de l'esport tolerat i, aleshores, la tornada al grup. Cada fase s'explica amb el que pots fer i el que encara no.",
        "La consulta és dins d'un centre d'entrenament. El final del procés no és una alta en un paper: és que la càrrega del box, de la pista o de la carretera torni a ser teva.",
      ],
    },
    forWhom: {
      es: [
        "Vuelta al crosstraining después de una lesión",
        "Corredores que recaen cada vez que suben kilómetros",
        "Pádel, fútbol u otro deporte de equipo con un gesto que aún no tolera",
        "Quien ya hizo terapia y necesita el tramo final, el de la carga",
      ],
      ca: [
        "Tornada al crosstraining després d'una lesió",
        "Corredors que recauen cada cop que pugen quilòmetres",
        "Pàdel, futbol o un altre esport d'equip amb un gest que encara no tolera",
        "Qui ja ha fet teràpia i necessita el tram final, el de la càrrega",
      ],
    },
    note: {
      es: "Volver del tirón es la forma habitual de recaer. La readaptación existe para subir la carga con un orden, no para prometer una fecha.",
      ca: "Tornar de cop és la forma habitual de recaure. La readaptació existeix per pujar la càrrega amb un ordre, no per prometre una data.",
    },
    faq: {
      es: [
        {
          q: "¿Cuánto dura una readaptación?",
          a: "Lo marca la lesión y tu punto de partida, no un paquete cerrado. Una molestia de hace una semana no se parece a un tendón de meses.",
        },
        {
          q: "¿Sirve si mi deporte no es crosstraining?",
          a: "Sí. El crosstraining es un idioma que Pol habla, no un requisito. Correr, pádel o un deporte de equipo también tienen su vuelta.",
        },
        {
          q: "¿Puedo lesionarme si vuelvo antes?",
          a: "Puedes recaer si la carga sube más rápido de lo que el tejido tolera. Por eso se pactan criterios, no una fecha bonita.",
        },
      ],
      ca: [
        {
          q: "Quant dura una readaptació?",
          a: "Ho marca la lesió i el teu punt de partida, no un paquet tancat. Una molèstia de fa una setmana no s'assembla a un tendó de mesos.",
        },
        {
          q: "Serveix si el meu esport no és crosstraining?",
          a: "Sí. El crosstraining és un idioma que Pol parla, no un requisit. Córrer, pàdel o un esport d'equip també tenen la seva tornada.",
        },
        {
          q: "Em puc lesionar si torno abans?",
          a: "Pots recaure si la càrrega puja més ràpid del que el teixit tolera. Per això es pacten criteris, no una data bonica.",
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
