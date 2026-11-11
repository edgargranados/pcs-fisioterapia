import type { Locale } from "@/lib/locale";

export type Town = {
  slug: string;
  name: string;
  minutes: number;
  km: number;
  road: Record<Locale, string>;
  intro: Record<Locale, string>;
  local: Record<Locale, string>;
  who: Record<Locale, string>;
  nearby: string[];
};

export const towns: Town[] = [
  {
    slug: "cabrils",
    name: "Cabrils",
    minutes: 10,
    km: 6,
    road: {
      es: "bajando hacia Mataró oeste, hasta Via Sèrgia",
      ca: "baixant cap a Mataró oest, fins a Via Sèrgia",
    },
    intro: {
      es: "Desde Cabrils, la consulta de Pol Carmona queda a unos 10 minutos en coche. No hay consulta en el pueblo: se baja a Mataró, a Carrer Via Sèrgia 32.",
      ca: "Des de Cabrils, la consulta de Pol Carmona queda a uns 10 minuts en cotxe. No hi ha consulta al poble: es baixa a Mataró, al carrer Via Sèrgia 32.",
    },
    local: {
      es: "Cabrils está en las colinas entre Mataró y la Serralada Litoral. Mucha gente corre por las pistas de alrededor o entrena y luego necesita a alguien que entienda la carga, no solo la camilla. Pol está vinculado a Cabrils y pasa consulta en Oikos, ya en Mataró.",
      ca: "Cabrils és a les costes entre Mataró i la Serralada Litoral. Molta gent corre per les pistes del voltant o entrena i després necessita algú que entengui la càrrega, no només la llitera. Pol està vinculat a Cabrils i passa consulta a Oikos, ja a Mataró.",
    },
    who: {
      es: "Suele venir quien entrena en el Maresme, quien tiene una rodilla o una espalda del trabajo, y quien prefiere diez minutos de coche a buscar fisio en Barcelona.",
      ca: "Sol venir qui entrena al Maresme, qui té un genoll o una esquena de la feina, i qui prefereix deu minuts de cotxe a buscar fisio a Barcelona.",
    },
    nearby: ["orrius", "argentona", "cabrera-de-mar"],
  },
  {
    slug: "argentona",
    name: "Argentona",
    minutes: 12,
    km: 6,
    road: {
      es: "hacia Mataró y la salida oeste, hasta Via Sèrgia",
      ca: "cap a Mataró i la sortida oest, fins a Via Sèrgia",
    },
    intro: {
      es: "Argentona está a unos 12 minutos de la consulta. El camino baja a Mataró y entra por el oeste, donde está Via Sèrgia 32.",
      ca: "Argentona és a uns 12 minuts de la consulta. El camí baixa a Mataró i entra per l'oest, on hi ha Via Sèrgia 32.",
    },
    local: {
      es: "Es un pueblo grande, con gente que camina por el entorno del Corredor y gente que trabaja en Mataró. La queja habitual no siempre es deportiva: espalda, hombro y rodilla del día a día también tienen sitio.",
      ca: "És un poble gran, amb gent que camina per l'entorn del Corredor i gent que treballa a Mataró. La queixa habitual no sempre és esportiva: esquena, espatlla i genoll del dia a dia també hi tenen lloc.",
    },
    who: {
      es: "Quien vive en Argentona y quiere un fisioterapeuta cerca, sin cruzar Barcelona, tiene la consulta de Pol al otro lado de Mataró.",
      ca: "Qui viu a Argentona i vol un fisioterapeuta a prop, sense creuar Barcelona, té la consulta de Pol a l'altra banda de Mataró.",
    },
    nearby: ["orrius", "dosrius", "cabrils"],
  },
  {
    slug: "cabrera-de-mar",
    name: "Cabrera de Mar",
    minutes: 8,
    km: 5,
    road: {
      es: "por la N-II o la C-32, salida de Mataró oeste",
      ca: "per la N-II o la C-32, sortida de Mataró oest",
    },
    intro: {
      es: "Cabrera de Mar es de los pueblos más cercanos: unos 8 minutos hasta Via Sèrgia 32. La consulta queda justo al entrar en Mataró por el oeste.",
      ca: "Cabrera de Mar és dels pobles més propers: uns 8 minuts fins a Via Sèrgia 32. La consulta queda just en entrar a Mataró per l'oest.",
    },
    local: {
      es: "Entre el mar y la colina, en Cabrera se corre, se juega en el pueblo y se baja a Mataró a entrenar. La distancia es corta también para quien solo quiere resolver un hombro o una espalda sin montar una excursión.",
      ca: "Entre el mar i la costa, a Cabrera es corre, es juga al poble i es baixa a Mataró a entrenar. La distància és curta també per a qui només vol resoldre una espatlla o una esquena sense muntar una excursió.",
    },
    who: {
      es: "Vecinos de Cabrera que buscan fisioterapia deportiva o una punción seca cerca, sin irse al centro de Mataró ni a Barcelona.",
      ca: "Veïns de Cabrera que busquen fisioteràpia esportiva o una punció seca a prop, sense anar al centre de Mataró ni a Barcelona.",
    },
    nearby: ["cabrils", "premia-de-dalt", "vilassar-de-dalt"],
  },
  {
    slug: "premia-de-mar",
    name: "Premià de Mar",
    minutes: 14,
    km: 9,
    road: {
      es: "por la N-II o la C-32 en dirección Mataró, salida oeste",
      ca: "per la N-II o la C-32 en direcció Mataró, sortida oest",
    },
    intro: {
      es: "Desde Premià de Mar son unos 14 minutos en coche hasta la consulta, subiendo la costa hacia Mataró y saliendo por el oeste.",
      ca: "Des de Premià de Mar són uns 14 minuts en cotxe fins a la consulta, pujant la costa cap a Mataró i sortint per l'oest.",
    },
    local: {
      es: "El paseo, la carrera junto al mar y el pádel dejan rodillas, tendones de Aquiles y hombros. Premià de Mar tiene vida deportiva propia; la readaptación, si hace falta un plan y no solo una camilla, se puede hacer en Mataró.",
      ca: "El passeig, la cursa vora el mar i el pàdel deixen genolls, tendons d'Aquil·les i espatlles. Premià de Mar té vida esportiva pròpia; la readaptació, si cal un pla i no només una llitera, es pot fer a Mataró.",
    },
    who: {
      es: "Corredores del paseo, gente de pádel y quien trabaja en Mataró y prefiere la cita a la ida o a la vuelta.",
      ca: "Corredors del passeig, gent de pàdel i qui treballa a Mataró i prefereix l'hora a l'anada o a la tornada.",
    },
    nearby: ["premia-de-dalt", "vilassar-de-mar", "teia"],
  },
  {
    slug: "premia-de-dalt",
    name: "Premià de Dalt",
    minutes: 12,
    km: 8,
    road: {
      es: "bajando a la C-32 o por Cabrera, hacia Mataró oeste",
      ca: "baixant a la C-32 o per Cabrera, cap a Mataró oest",
    },
    intro: {
      es: "Premià de Dalt está a unos 12 minutos de Via Sèrgia. Se baja hacia la autopista o se cruza Cabrera de Mar y se entra en Mataró por el oeste.",
      ca: "Premià de Dalt és a uns 12 minuts de Via Sèrgia. Es baixa cap a l'autopista o es creua Cabrera de Mar i s'entra a Mataró per l'oest.",
    },
    local: {
      es: "Es un pueblo más quieto, encima de Premià de Mar. Quien vive aquí suele moverse en coche igual, y Mataró oeste le pilla de paso. La consulta no pide que cambies de gimnasio: pide hora y bajas.",
      ca: "És un poble més tranquil, a sobre de Premià de Mar. Qui hi viu sol moure's en cotxe igual, i Mataró oest li queda de pas. La consulta no demana que canviïs de gimnàs: demanes hora i baixes.",
    },
    who: {
      es: "Quien busca fisioterapeuta cerca de Premià de Dalt para espalda, rodilla o una vuelta al deporte sin ir hasta Barcelona.",
      ca: "Qui busca fisioterapeuta a prop de Premià de Dalt per a esquena, genoll o una tornada a l'esport sense anar fins a Barcelona.",
    },
    nearby: ["premia-de-mar", "teia", "cabrera-de-mar"],
  },
  {
    slug: "vilassar-de-mar",
    name: "Vilassar de Mar",
    minutes: 16,
    km: 11,
    road: {
      es: "N-II o C-32 hacia el norte, salida Mataró oeste",
      ca: "N-II o C-32 cap al nord, sortida Mataró oest",
    },
    intro: {
      es: "Vilassar de Mar queda a unos 16 minutos. Se sube la costa por la N-II o la C-32 y se sale en Mataró oeste, junto a Via Sèrgia.",
      ca: "Vilassar de Mar queda a uns 16 minuts. Es puja la costa per la N-II o la C-32 i se surt a Mataró oest, al costat de Via Sèrgia.",
    },
    local: {
      es: "Pueblo de mar, con carrera, pádel y deporte de club. Cuando una molestia se queda y la camilla del pueblo no incluye el regreso a la carga, la readaptación en Mataró está a un trayecto corto.",
      ca: "Poble de mar, amb cursa, pàdel i esport de club. Quan una molèstia es queda i la llitera del poble no inclou el retorn a la càrrega, la readaptació a Mataró és a un trajecte curt.",
    },
    who: {
      es: "Deportistas de Vilassar de Mar y gente con dolor de hombro, espalda o rodilla que quiere cita en Mataró, no en el centro de Barcelona.",
      ca: "Esportistes de Vilassar de Mar i gent amb dolor d'espatlla, esquena o genoll que vol hora a Mataró, no al centre de Barcelona.",
    },
    nearby: ["vilassar-de-dalt", "premia-de-mar", "cabrera-de-mar"],
  },
  {
    slug: "vilassar-de-dalt",
    name: "Vilassar de Dalt",
    minutes: 15,
    km: 10,
    road: {
      es: "hacia Cabrera de Mar y la entrada oeste de Mataró",
      ca: "cap a Cabrera de Mar i l'entrada oest de Mataró",
    },
    intro: {
      es: "Desde Vilassar de Dalt, unos 15 minutos hasta la consulta, cruzando hacia Cabrera y entrando en Mataró por el oeste.",
      ca: "Des de Vilassar de Dalt, uns 15 minuts fins a la consulta, creuant cap a Cabrera i entrant a Mataró per l'oest.",
    },
    local: {
      es: "Vilassar de Dalt mira a la colina más que al paseo. Hay quien corre por caminos y quien baja al mar el fin de semana. En los dos casos, la carga acaba en la misma rodilla o en la misma espalda.",
      ca: "Vilassar de Dalt mira més cap a la muntanya que cap al passeig. Hi ha qui corre per camins i qui baixa al mar el cap de setmana. En els dos casos, la càrrega acaba al mateix genoll o a la mateixa esquena.",
    },
    who: {
      es: "Quien vive arriba y busca un fisioterapeuta deportivo cerca, con punción seca, neuromodulación y un plan de ejercicio.",
      ca: "Qui viu a dalt i busca un fisioterapeuta esportiu a prop, amb punció seca, neuromodulació i un pla d'exercici.",
    },
    nearby: ["vilassar-de-mar", "cabrera-de-mar", "premia-de-dalt"],
  },
  {
    slug: "sant-andreu-de-llavaneres",
    name: "Sant Andreu de Llavaneres",
    minutes: 12,
    km: 8,
    road: {
      es: "C-32 hacia el sur, salida Mataró oeste",
      ca: "C-32 cap al sud, sortida Mataró oest",
    },
    intro: {
      es: "Sant Andreu de Llavaneres está al norte de Mataró, a unos 12 minutos por la C-32. La salida oeste deja la consulta de Via Sèrgia al lado.",
      ca: "Sant Andreu de Llavaneres és al nord de Mataró, a uns 12 minuts per la C-32. La sortida oest deixa la consulta de Via Sèrgia al costat.",
    },
    local: {
      es: "Entre el mar y las urbanizaciones, en Llavaneres se juega a pádel, se corre y se entrena. Cuando hay que volver a ese gesto sin recaer, la readaptación cabe en el mismo trayecto que mucha gente ya hace hacia Mataró.",
      ca: "Entre el mar i les urbanitzacions, a Llavaneres es juga a pàdel, es corre i s'entrena. Quan cal tornar a aquell gest sense recaure, la readaptació encaixa en el mateix trajecte que molta gent ja fa cap a Mataró.",
    },
    who: {
      es: "Gente de Llavaneres que quiere fisioterapia deportiva en Mataró: hombro de pádel, gemelo de la carrera o espalda del trabajo.",
      ca: "Gent de Llavaneres que vol fisioteràpia esportiva a Mataró: espatlla de pàdel, bessó de la cursa o esquena de la feina.",
    },
    nearby: ["sant-vicenc-de-montalt", "caldes-destrac", "arenys-de-mar"],
  },
  {
    slug: "sant-vicenc-de-montalt",
    name: "Sant Vicenç de Montalt",
    minutes: 14,
    km: 9,
    road: {
      es: "hacia la C-32 y la salida de Mataró oeste",
      ca: "cap a la C-32 i la sortida de Mataró oest",
    },
    intro: {
      es: "Sant Vicenç de Montalt queda a unos 14 minutos, un poco al interior de Llavaneres. Se baja a la C-32 y se sale en Mataró oeste.",
      ca: "Sant Vicenç de Montalt queda a uns 14 minuts, una mica a l'interior de Llavaneres. Es baixa a la C-32 i se surt a Mataró oest.",
    },
    local: {
      es: "Pueblo pequeño, entre la costa y el Corredor. Quien vive aquí ya coge el coche para casi todo. Sumar un fisioterapeuta en Mataró no cambia el día: cambia que haya un plan para la lesión, no solo una sesión suelta.",
      ca: "Poble petit, entre la costa i el Corredor. Qui hi viu ja agafa el cotxe per a gairebé tot. Sumar un fisioterapeuta a Mataró no canvia el dia: canvia que hi hagi un pla per a la lesió, no només una sessió solta.",
    },
    who: {
      es: "Vecinos de Sant Vicenç que buscan punción seca, terapia manual o readaptación sin desplazarse a Barcelona.",
      ca: "Veïns de Sant Vicenç que busquen punció seca, teràpia manual o readaptació sense desplaçar-se a Barcelona.",
    },
    nearby: ["sant-andreu-de-llavaneres", "dosrius", "caldes-destrac"],
  },
  {
    slug: "arenys-de-mar",
    name: "Arenys de Mar",
    minutes: 18,
    km: 14,
    road: {
      es: "C-32 hacia el sur, salida Mataró oeste",
      ca: "C-32 cap al sud, sortida Mataró oest",
    },
    intro: {
      es: "Desde Arenys de Mar, el puerto queda a unos 18 minutos de la consulta por la C-32. Es el extremo norte razonable para venir a Via Sèrgia.",
      ca: "Des d'Arenys de Mar, el port queda a uns 18 minuts de la consulta per la C-32. És l'extrem nord raonable per venir a Via Sèrgia.",
    },
    local: {
      es: "Arenys tiene puerto, instituto, clubs y mucha gente que se mueve por el Maresme cada día. Si la lesión es de correr, de un deporte de equipo o de un trabajo físico, Mataró está antes que Barcelona en el mapa.",
      ca: "Arenys té port, institut, clubs i molta gent que es mou pel Maresme cada dia. Si la lesió és de córrer, d'un esport d'equip o d'una feina física, Mataró és abans que Barcelona al mapa.",
    },
    who: {
      es: "Quien en Arenys busca un fisioterapeuta deportivo y acepta un cuarto de hora de autopista a cambio de una consulta centrada en la vuelta a la carga.",
      ca: "Qui a Arenys busca un fisioterapeuta esportiu i accepta un quart d'hora d'autopista a canvi d'una consulta centrada en la tornada a la càrrega.",
    },
    nearby: ["caldes-destrac", "sant-vicenc-de-montalt", "sant-andreu-de-llavaneres"],
  },
  {
    slug: "caldes-destrac",
    name: "Caldes d'Estrac",
    minutes: 15,
    km: 11,
    road: {
      es: "un tramo corto de C-32 hasta Mataró oeste",
      ca: "un tram curt de C-32 fins a Mataró oest",
    },
    intro: {
      es: "Caldes d'Estrac está a unos 15 minutos. Es un pueblo pequeño entre Llavaneres y Arenys, y la bajada a Mataró por la C-32 es directa.",
      ca: "Caldes d'Estrac és a uns 15 minuts. És un poble petit entre Llavaneres i Arenys, i la baixada a Mataró per la C-32 és directa.",
    },
    local: {
      es: "Paseo corto, pueblo a escala humana y las mismas molestias que el resto de la costa: tendón, hombro, espalda. No hay por qué quedarse sin un plan de ejercicio porque el pueblo sea pequeño.",
      ca: "Passeig curt, poble a escala humana i les mateixes molèsties que la resta de la costa: tendó, espatlla, esquena. No hi ha per què quedar-se sense un pla d'exercici perquè el poble sigui petit.",
    },
    who: {
      es: "Gente de Caldes que quiere fisioterapia en Mataró, con hora y con alguien que hable de deporte sin convertir la visita en un discurso.",
      ca: "Gent de Caldes que vol fisioteràpia a Mataró, amb hora i amb algú que parli d'esport sense convertir la visita en un discurs.",
    },
    nearby: ["arenys-de-mar", "sant-andreu-de-llavaneres", "sant-vicenc-de-montalt"],
  },
  {
    slug: "dosrius",
    name: "Dosrius",
    minutes: 15,
    km: 10,
    road: {
      es: "bajando hacia Argentona y Mataró, hasta el oeste",
      ca: "baixant cap a Argentona i Mataró, fins a l'oest",
    },
    intro: {
      es: "Dosrius está tierra adentro, a unos 15 minutos de Via Sèrgia, bajando hacia Argentona y Mataró.",
      ca: "Dosrius és terra endins, a uns 15 minuts de Via Sèrgia, baixant cap a Argentona i Mataró.",
    },
    local: {
      es: "El parque del Corredor deja rodillas de sendero y tobillos de camino. También hay quien simplemente trabaja en Mataró y quiere la cita cerca de la bajada, no al otro lado de la ciudad.",
      ca: "El parc del Corredor deixa genolls de sender i turmells de camí. També hi ha qui simplement treballa a Mataró i vol l'hora a prop de la baixada, no a l'altra banda de la ciutat.",
    },
    who: {
      es: "Quien baja de Dosrius y busca terapia manual, punción o un plan para volver a caminar y correr sin recaer.",
      ca: "Qui baixa de Dosrius i busca teràpia manual, punció o un pla per tornar a caminar i córrer sense recaure.",
    },
    nearby: ["argentona", "orrius", "sant-vicenc-de-montalt"],
  },
  {
    slug: "orrius",
    name: "Òrrius",
    minutes: 14,
    km: 8,
    road: {
      es: "hacia Argentona o Cabrils y después Mataró oeste",
      ca: "cap a Argentona o Cabrils i després Mataró oest",
    },
    intro: {
      es: "Òrrius es un pueblo pequeño en la colina, a unos 14 minutos de la consulta. Se baja hacia Argentona o Cabrils y se entra en Mataró por el oeste.",
      ca: "Òrrius és un poble petit a les costes, a uns 14 minuts de la consulta. Es baixa cap a Argentona o Cabrils i s'entra a Mataró per l'oest.",
    },
    local: {
      es: "Poca gente, caminos y la Serralada al lado. La fisioterapia no está en el pueblo, y Mataró oeste es el sitio cercano donde la visita puede incluir ejercicio de verdad, no solo la camilla.",
      ca: "Poca gent, camins i la Serralada al costat. La fisioteràpia no és al poble, i Mataró oest és el lloc proper on la visita pot incloure exercici de debò, no només la llitera.",
    },
    who: {
      es: "Vecinos de Òrrius y de las urbanizaciones de alrededor que prefieren una cita en Mataró a desplazarse a Barcelona.",
      ca: "Veïns d'Òrrius i de les urbanitzacions del voltant que prefereixen una hora a Mataró a desplaçar-se a Barcelona.",
    },
    nearby: ["argentona", "cabrils", "dosrius"],
  },
  {
    slug: "el-masnou",
    name: "El Masnou",
    minutes: 20,
    km: 16,
    road: {
      es: "C-32 o N-II hacia Mataró, salida oeste",
      ca: "C-32 o N-II cap a Mataró, sortida oest",
    },
    intro: {
      es: "El Masnou está a unos 20 minutos, ya en el extremo sur del recorrido. Se sube por la C-32 o la N-II y se sale en Mataró oeste.",
      ca: "El Masnou és a uns 20 minuts, ja a l'extrem sud del recorregut. Es puja per la C-32 o la N-II i se surt a Mataró oest.",
    },
    local: {
      es: "Es un pueblo grande, con puerto, tren y mucha gente que podría ir a Barcelona. Quien viene hasta Mataró suele buscar justo lo contrario: una consulta pequeña, de deporte y de ejercicio, sin la ciudad.",
      ca: "És un poble gran, amb port, tren i molta gent que podria anar a Barcelona. Qui ve fins a Mataró sol buscar just el contrari: una consulta petita, d'esport i d'exercici, sense la ciutat.",
    },
    who: {
      es: "Deportistas del Masnou que quieren readaptación, punción seca o neuromodulación y les encaja el trayecto por la costa.",
      ca: "Esportistes del Masnou que volen readaptació, punció seca o neuromodulació i els encaixa el trajecte per la costa.",
    },
    nearby: ["alella", "teia", "premia-de-mar"],
  },
  {
    slug: "alella",
    name: "Alella",
    minutes: 20,
    km: 15,
    road: {
      es: "hacia el Masnou o Teià y la C-32 hasta Mataró oeste",
      ca: "cap al Masnou o Teià i la C-32 fins a Mataró oest",
    },
    intro: {
      es: "Alella queda a unos 20 minutos, bajando hacia la costa y subiendo luego por la C-32 hasta la salida oeste de Mataró.",
      ca: "Alella queda a uns 20 minuts, baixant cap a la costa i pujant després per la C-32 fins a la sortida oest de Mataró.",
    },
    local: {
      es: "Viñedos, colina y un pueblo que se mueve en coche. La distancia es la misma que hasta muchos sitios de Barcelona, con la diferencia de que la consulta está en un centro de entrenamiento y no en una sala anónima.",
      ca: "Vinyes, costa i un poble que es mou en cotxe. La distància és la mateixa que fins a molts llocs de Barcelona, amb la diferència que la consulta és en un centre d'entrenament i no en una sala anònima.",
    },
    who: {
      es: "Quien en Alella busca fisioterapeuta para volver a entrenar, correr o simplemente quitarse una espalda que ya dura.",
      ca: "Qui a Alella busca fisioterapeuta per tornar a entrenar, córrer o simplement treure's una esquena que ja dura.",
    },
    nearby: ["teia", "el-masnou", "premia-de-dalt"],
  },
  {
    slug: "teia",
    name: "Teià",
    minutes: 18,
    km: 13,
    road: {
      es: "hacia Premià y la C-32, salida Mataró oeste",
      ca: "cap a Premià i la C-32, sortida Mataró oest",
    },
    intro: {
      es: "Teià está a unos 18 minutos, entre Alella y Premià de Dalt. Se baja a la autopista y se sale en Mataró oeste.",
      ca: "Teià és a uns 18 minuts, entre Alella i Premià de Dalt. Es baixa a l'autopista i se surt a Mataró oest.",
    },
    local: {
      es: "Pueblo de colina, con gente que entrena en la costa o en Mataró. Si el dolor es de un hombro de pádel, de un tendón o de la oficina, el trayecto es corto y la cita es en Via Sèrgia, no hay que cruzar la ciudad.",
      ca: "Poble enlairat, amb gent que entrena a la costa o a Mataró. Si el dolor és d'una espatlla de pàdel, d'un tendó o de l'oficina, el trajecte és curt i l'hora és a Via Sèrgia, no cal creuar la ciutat.",
    },
    who: {
      es: "Vecinos de Teià que quieren un fisioterapeuta deportivo cerca y les va bien la consulta de Pol en Mataró.",
      ca: "Veïns de Teià que volen un fisioterapeuta esportiu a prop i els va bé la consulta de Pol a Mataró.",
    },
    nearby: ["alella", "premia-de-dalt", "premia-de-mar"],
  },
];

export function townBySlug(slug: string) {
  return towns.find((town) => town.slug === slug);
}
