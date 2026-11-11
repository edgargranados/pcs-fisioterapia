import type { Locale } from "@/lib/locale";

const es = {
  book: "Pedir cita",
  therapies: "Terapias",
  consult: "La consulta",
  zones: "Zonas",
  about: "Pol",
  langLabel: "Català",
  langAria: "Versió en català",
  skip: "Saltar al contenido",
  menu: "Menú",
  close: "Cerrar",
  addressLabel: "Dirección",
  howToGet: "Cómo llegar",
  college: "Colegiado n.º 18685",
  languages: "Catalán y castellano",
  byAppointment: "Con cita previa",
  readMore: "Ver la terapia",
  allZones: "Pueblos de alrededor",
  otherTherapies: "Otras terapias",
  nearby: "También se llega desde",
  firstVisit: "La primera visita",
  disclaimer:
    "Esto es información general de la consulta. El plan se decide en la visita, no por internet, y no sustituye una valoración médica cuando el caso lo pide.",
  emergency:
    "Un golpe fuerte, fiebre, una pérdida de fuerza brusca o un dolor en el pecho no esperan a la fisioterapia: eso es de urgencias.",
  heroEyebrow: "Fisioterapia deportiva · Maresme",
  heroTitleLead: "Fisioterapeuta",
  heroTitlePlace: "en Mataró",
  heroLede:
    "Pol Carmona trata en Via Sèrgia 32. Terapia manual, punción seca, neuromodulación, ejercicio terapéutico y readaptación para volver a moverte con criterio.",
  heroSecondary: "Ver las terapias",
  introKicker: "Consulta en Oikos",
  introTitle: "El dolor se trabaja en camilla. La recuperación, con ejercicio.",
  introBody:
    "La consulta está en Oikos Training System, en la zona oeste de Mataró. Pol es fisioterapeuta y también entrenador en el mismo centro, así que entiende la camilla y la carga del entrenamiento como una sola conversación. Vengas de Mataró o de un pueblo del Maresme, se atiende con cita previa.",
  stepsTitle: "Cómo es una visita",
  steps: [
    {
      title: "Cuentas qué no puedes hacer",
      text: "Qué duele, desde cuándo, y qué se ha quedado fuera: entrenar, correr, trabajar, dormir.",
    },
    {
      title: "Miramos el movimiento",
      text: "No solo el punto que señala el dedo. A menudo la queja está en un sitio y la causa de la carga, en otro.",
    },
    {
      title: "Tratamos si toca",
      text: "Manos, aguja o corriente, en la misma visita, cuando tiene sentido. Si no encaja, no se fuerza.",
    },
    {
      title: "Te vas con un plan corto",
      text: "Pocos ejercicios y un criterio para volver a la carga. La readaptación sigue hasta que el deporte vuelve a ser tuyo.",
    },
  ],
  aboutKicker: "El fisioterapeuta",
  aboutTitle: "Pol Carmona Santandreu",
  aboutBody: [
    "Graduado en Fisioterapia por la UAB-EUG (2020–2025). Hizo prácticas en hospitales, centros geriátricos, atención primaria y equipos deportivos. El deporte de competición lo acompaña desde joven.",
    "También es entrenador personal en Oikos Training System, el centro donde pasa consulta. Le interesa la traumatología y la readaptación: que el dolor baje, y que la persona vuelva a moverse y mejore su día a día.",
    "Colegiado n.º 18685. La consulta es en catalán o en castellano.",
  ],
  aboutImageAlt: "Pol Carmona, fisioterapeuta, en la consulta de Mataró",
  zonesKicker: "Maresme",
  zonesTitle: "Si vienes de un pueblo de al lado",
  zonesBody:
    "La consulta no se mueve de Mataró. Desde Cabrils, Argentona, Cabrera de Mar, Premià, Vilassar, Llavaneres o el Masnou se llega en coche en unos minutos. Cada pueblo tiene su página con el camino hasta Via Sèrgia.",
  faqTitle: "Preguntas frecuentes",
  homeFaq: [
    {
      q: "¿Dónde está la consulta de fisioterapia?",
      a: "En Oikos Training System, Carrer Via Sèrgia 32, 08302 Mataró, en la zona oeste de la ciudad. Se llega bien desde la C-32. Se atiende con cita previa.",
    },
    {
      q: "¿Cómo pido cita con Pol Carmona?",
      a: "Dejas nombre y teléfono en el formulario. El email es opcional. La solicitud queda guardada y, justo después, puedes escribirle por WhatsApp si quieres contarle el motivo.",
    },
    {
      q: "¿Hace falta volante del médico?",
      a: "No. Puedes venir por tu cuenta. Si traes pruebas o un informe, se leen en la visita. Una sesión de fisioterapia no sustituye las urgencias ni una valoración médica cuando el caso lo pide.",
    },
    {
      q: "¿Solo tratas a deportistas?",
      a: "No. Viene gente de Mataró y del Maresme por la espalda del trabajo, un hombro o una rodilla, sin competir en nada. El deporte es el terreno en el que Pol se ha formado, no un filtro.",
    },
    {
      q: "¿Atiendes a quien viene de Cabrils, Premià, Argentona o Vilassar?",
      a: "Sí. La consulta está en Mataró y desde esos pueblos se llega en unos minutos en coche. En la sección de zonas está el detalle de cada uno, de Cabrera de Mar a Arenys y de Teià al Masnou.",
    },
  ],
  formKicker: "Cita previa",
  formTitle: "Pide hora en Mataró",
  formLede:
    "Nombre y teléfono. El email, solo si quieres. La solicitud se guarda y, al momento, puedes seguir por WhatsApp.",
  formName: "Nombre",
  formPhone: "Teléfono",
  formEmail: "Email (opcional)",
  formConsent: "Acepto que PCS Fisioterapia use estos datos para responder a mi solicitud de cita.",
  formPrivacy: "Privacidad",
  formSubmit: "Guardar solicitud",
  formSending: "Guardando…",
  formSuccess: "Solicitud guardada",
  formThanks: "Gracias,",
  formCall: "Pol usará este teléfono para hablar contigo:",
  formWhatsapp: "Hablar por WhatsApp",
  formNoWhatsapp:
    "Tu solicitud ya está guardada. En cuanto el WhatsApp de la consulta esté activo, el botón aparecerá aquí. Mientras, Pol te llama al teléfono que has dejado.",
  formFix: "Corregir los datos",
  formError: "No se ha podido guardar. Revisa los datos o inténtalo en un momento.",
  errors: {
    name: "Escribe tu nombre, con al menos dos letras.",
    phone: "El teléfono tiene que ser un número español, móvil o fijo.",
    email: "El email no parece válido. Puedes dejarlo vacío.",
    consent: "Hace falta aceptar el uso de los datos para pedir la cita.",
    locale: "No se ha podido enviar el formulario.",
    server: "Ahora mismo no se ha podido guardar. Inténtalo de nuevo.",
    rate: "Has enviado varias solicitudes seguidas. Espera un rato.",
  },
  whatsappMessage: (name: string) =>
    `Hola Pol, soy ${name}. Acabo de pedir cita en pcsfisioterapia.com.`,
  mataroEyebrow: "Consulta en Mataró",
  mataroTitle: "Fisioterapia en Mataró",
  mataroLede:
    "Si buscas fisio en Mataró, la consulta de Pol Carmona está en Carrer Via Sèrgia 32, dentro de Oikos Training System. No es un hospital ni una mutua: es una consulta pequeña, con hora, donde cabe hablar del entrenamiento real.",
  zonesEyebrow: "Alrededor de Mataró",
  zonesPageTitle: "Fisioterapia cerca de tu pueblo",
  zonesPageLede:
    "Pol pasa consulta en Mataró y trabaja con gente de todo el Maresme de al lado. Elige tu pueblo para ver cómo llegar a Via Sèrgia y pedir hora.",
  bookEyebrow: "Nueva solicitud",
  bookTitle: "Pedir cita de fisioterapia",
  bookLede:
    "Deja tu nombre y un teléfono. Pol Carmona atiende en Via Sèrgia 32, Mataró, con cita previa. El email es opcional.",
  legalTitle: "Aviso legal",
  privacyTitle: "Privacidad",
  notFoundTitle: "Esta página no está",
  notFoundBody: "El enlace no lleva a ninguna terapia ni a ningún pueblo. Vuelve al inicio o pide cita.",
  notFoundHome: "Volver al inicio",
  mapTitle: "Mapa de la consulta en Via Sèrgia 32, Mataró",
  footerZones: "Cerca de Mataró",
  footerNote: "Fisioterapia deportiva en Mataró y el Maresme.",
  mustMember: "No hace falta ser socio de Oikos para pedir cita.",
  crumbsHome: "Inicio",
};

const ca = {
  book: "Demanar hora",
  therapies: "Teràpies",
  consult: "La consulta",
  zones: "Zones",
  about: "Pol",
  langLabel: "Castellano",
  langAria: "Versión en castellano",
  skip: "Salta al contingut",
  menu: "Menú",
  close: "Tanca",
  addressLabel: "Adreça",
  howToGet: "Com arribar",
  college: "Col·legiat núm. 18685",
  languages: "Català i castellà",
  byAppointment: "Amb hora prèvia",
  readMore: "Veure la teràpia",
  allZones: "Pobles del voltant",
  otherTherapies: "Altres teràpies",
  nearby: "També s'hi arriba des de",
  firstVisit: "La primera visita",
  disclaimer:
    "Això és informació general de la consulta. El pla es decideix a la visita, no per internet, i no substitueix una valoració mèdica quan el cas ho demana.",
  emergency:
    "Un cop fort, febre, una pèrdua de força sobtada o un dolor al pit no esperen la fisioteràpia: això és d'urgències.",
  heroEyebrow: "Fisioteràpia esportiva · Maresme",
  heroTitleLead: "Fisioterapeuta",
  heroTitlePlace: "a Mataró",
  heroLede:
    "Pol Carmona visita a Via Sèrgia 32. Teràpia manual, punció seca, neuromodulació, exercici terapèutic i readaptació per tornar a moure't amb criteri.",
  heroSecondary: "Veure les teràpies",
  introKicker: "Consulta a Oikos",
  introTitle: "El dolor es treballa a la llitera. La recuperació, amb exercici.",
  introBody:
    "La consulta és a Oikos Training System, a la zona oest de Mataró. Pol és fisioterapeuta i també entrenador al mateix centre, així que entén la llitera i la càrrega de l'entrenament com una sola conversa. Vinguis de Mataró o d'un poble del Maresme, s'atén amb hora prèvia.",
  stepsTitle: "Com és una visita",
  steps: [
    {
      title: "Expliques què no pots fer",
      text: "Què fa mal, des de quan, i què ha quedat fora: entrenar, córrer, treballar, dormir.",
    },
    {
      title: "Mirem el moviment",
      text: "No només el punt que assenyala el dit. Sovint la queixa és en un lloc i la causa de la càrrega, en un altre.",
    },
    {
      title: "Tractem si toca",
      text: "Mans, agulla o corrent, a la mateixa visita, quan té sentit. Si no encaixa, no es força.",
    },
    {
      title: "Te'n vas amb un pla curt",
      text: "Pocs exercicis i un criteri per tornar a la càrrega. La readaptació segueix fins que l'esport torna a ser teu.",
    },
  ],
  aboutKicker: "El fisioterapeuta",
  aboutTitle: "Pol Carmona Santandreu",
  aboutBody: [
    "Graduat en Fisioteràpia per la UAB-EUG (2020–2025). Va fer pràctiques a hospitals, centres geriàtrics, atenció primària i equips esportius. L'esport de competició l'acompanya des de jove.",
    "També és entrenador personal a Oikos Training System, el centre on passa consulta. Li interessa la traumatologia i la readaptació: que el dolor baixi, i que la persona torni a moure's i millori el seu dia a dia.",
    "Col·legiat núm. 18685. La consulta és en català o en castellà.",
  ],
  aboutImageAlt: "Pol Carmona, fisioterapeuta, a la consulta de Mataró",
  zonesKicker: "Maresme",
  zonesTitle: "Si vens d'un poble del costat",
  zonesBody:
    "La consulta no es mou de Mataró. Des de Cabrils, Argentona, Cabrera de Mar, Premià, Vilassar, Llavaneres o el Masnou s'hi arriba en cotxe en uns minuts. Cada poble té la seva pàgina amb el camí fins a Via Sèrgia.",
  faqTitle: "Preguntes freqüents",
  homeFaq: [
    {
      q: "On és la consulta de fisioteràpia?",
      a: "A Oikos Training System, carrer Via Sèrgia 32, 08302 Mataró, a la zona oest de la ciutat. S'hi arriba bé des de la C-32. S'atén amb hora prèvia.",
    },
    {
      q: "Com demano hora amb Pol Carmona?",
      a: "Deixes nom i telèfon al formulari. El correu és opcional. La sol·licitud queda desada i, just després, pots escriure-li per WhatsApp si vols explicar-li el motiu.",
    },
    {
      q: "Cal volant del metge?",
      a: "No. Pots venir pel teu compte. Si portes proves o un informe, es llegeixen a la visita. Una sessió de fisioteràpia no substitueix les urgències ni una valoració mèdica quan el cas ho demana.",
    },
    {
      q: "Només tractes esportistes?",
      a: "No. Ve gent de Mataró i del Maresme per l'esquena de la feina, una espatlla o un genoll, sense competir en res. L'esport és el terreny on Pol s'ha format, no un filtre.",
    },
    {
      q: "Atens qui ve de Cabrils, Premià, Argentona o Vilassar?",
      a: "Sí. La consulta és a Mataró i des d'aquests pobles s'hi arriba en uns minuts en cotxe. A la secció de zones hi ha el detall de cadascun, de Cabrera de Mar a Arenys i de Teià al Masnou.",
    },
  ],
  formKicker: "Hora prèvia",
  formTitle: "Demana hora a Mataró",
  formLede:
    "Nom i telèfon. El correu, només si vols. La sol·licitud es desa i, al moment, pots seguir per WhatsApp.",
  formName: "Nom",
  formPhone: "Telèfon",
  formEmail: "Correu (opcional)",
  formConsent:
    "Accepto que PCS Fisioterapia utilitzi aquestes dades per respondre a la meva sol·licitud d'hora.",
  formPrivacy: "Privacitat",
  formSubmit: "Desar la sol·licitud",
  formSending: "S'està desant…",
  formSuccess: "Sol·licitud desada",
  formThanks: "Gràcies,",
  formCall: "Pol farà servir aquest telèfon per parlar amb tu:",
  formWhatsapp: "Parlar per WhatsApp",
  formNoWhatsapp:
    "La sol·licitud ja està desada. Quan el WhatsApp de la consulta estigui actiu, el botó apareixerà aquí. Mentrestant, Pol et truca al telèfon que has deixat.",
  formFix: "Corregir les dades",
  formError: "No s'ha pogut desar. Revisa les dades o torna-ho a provar d'aquí una estona.",
  errors: {
    name: "Escriu el teu nom, amb almenys dues lletres.",
    phone: "El telèfon ha de ser un número espanyol, mòbil o fix.",
    email: "El correu no sembla vàlid. El pots deixar buit.",
    consent: "Cal acceptar l'ús de les dades per demanar hora.",
    locale: "No s'ha pogut enviar el formulari.",
    server: "Ara mateix no s'ha pogut desar. Torna-ho a provar.",
    rate: "Has enviat diverses sol·licituds seguides. Espera una estona.",
  },
  whatsappMessage: (name: string) =>
    `Hola Pol, sóc ${name}. Acabo de demanar hora a pcsfisioterapia.com.`,
  mataroEyebrow: "Consulta a Mataró",
  mataroTitle: "Fisioteràpia a Mataró",
  mataroLede:
    "Si busques fisio a Mataró, la consulta de Pol Carmona és al carrer Via Sèrgia 32, dins d'Oikos Training System. No és un hospital ni una mútua: és una consulta petita, amb hora, on es pot parlar de l'entrenament real.",
  zonesEyebrow: "Al voltant de Mataró",
  zonesPageTitle: "Fisioteràpia a prop del teu poble",
  zonesPageLede:
    "Pol passa consulta a Mataró i treballa amb gent de tot el Maresme del costat. Tria el teu poble per veure com arribar a Via Sèrgia i demanar hora.",
  bookEyebrow: "Nova sol·licitud",
  bookTitle: "Demanar hora de fisioteràpia",
  bookLede:
    "Deixa el teu nom i un telèfon. Pol Carmona atén a Via Sèrgia 32, Mataró, amb hora prèvia. El correu és opcional.",
  legalTitle: "Avís legal",
  privacyTitle: "Privacitat",
  notFoundTitle: "Aquesta pàgina no hi és",
  notFoundBody: "L'enllaç no porta a cap teràpia ni a cap poble. Torna a l'inici o demana hora.",
  notFoundHome: "Tornar a l'inici",
  mapTitle: "Mapa de la consulta a Via Sèrgia 32, Mataró",
  footerZones: "A prop de Mataró",
  footerNote: "Fisioteràpia esportiva a Mataró i el Maresme.",
  mustMember: "No cal ser soci d'Oikos per demanar hora.",
  crumbsHome: "Inici",
} satisfies typeof es;

export const ui: Record<Locale, typeof es> = { es, ca };

export type Ui = typeof es;
