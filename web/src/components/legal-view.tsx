import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteShell } from "@/components/site-shell";
import { ui } from "@/content/ui";
import type { Locale } from "@/lib/locale";
import { homePath, legalPath, privacyPath } from "@/lib/paths";
import { clinic } from "@/lib/site";

export function LegalView({ locale, kind }: { locale: Locale; kind: "legal" | "privacy" }) {
  const copy = ui[locale];
  const alternate = kind === "legal" ? legalPath(locale === "es" ? "ca" : "es") : privacyPath(locale === "es" ? "ca" : "es");
  const title = kind === "legal" ? copy.legalTitle : copy.privacyTitle;

  return (
    <SiteShell locale={locale} alternateHref={alternate}>
      <article className="mx-auto w-full max-w-3xl px-5 pb-28 pt-12 md:pt-16">
        <Breadcrumbs items={[{ name: copy.crumbsHome, href: homePath(locale) }, { name: title }]} />
        <h1 className="mt-8 font-serif text-4xl tracking-tight md:text-6xl">{title}</h1>
        <div className="mt-8 space-y-4 text-[16px] leading-8 text-muted-foreground">
          {kind === "legal" ? <LegalCopy locale={locale} /> : <PrivacyCopy locale={locale} />}
        </div>
      </article>
    </SiteShell>
  );
}

function LegalCopy({ locale }: { locale: Locale }) {
  if (locale === "ca") {
    return (
      <>
        <p>
          Aquest lloc, pcsfisioterapia.com, és el web professional de {clinic.fullName}, fisioterapeuta col·legiat núm. {clinic.collegeNumber} al {clinic.collegeName}. La consulta és a {clinic.place}, {clinic.street}, {clinic.postalCode} {clinic.city}.
        </p>
        <p>
          El NIF consta a la factura i es pot demanar a la consulta. L&apos;activitat és l&apos;assistència de fisioteràpia amb hora prèvia. Els textos descriuen la manera de treballar i no són un diagnòstic ni una promesa de resultat.
        </p>
        <p>
          Els continguts d&apos;aquest web (textos i fotografies de la consulta) són de {clinic.person}. No se&apos;n permet la còpia per a un altre servei. Les marques d&apos;Oikos Training System pertanyen als seus titulars; aquí només s&apos;indica el lloc on es passa consulta.
        </p>
        <p>La llei aplicable és l&apos;espanyola. Per a qualsevol qüestió sobre el web, es pot fer servir el formulari de sol·licitud d&apos;hora o preguntar directament a la consulta.</p>
      </>
    );
  }

  return (
    <>
      <p>
        Este sitio, pcsfisioterapia.com, es la web profesional de {clinic.fullName}, fisioterapeuta colegiado n.º {clinic.collegeNumber} en el {clinic.collegeName}. La consulta está en {clinic.place}, {clinic.street}, {clinic.postalCode} {clinic.city}.
      </p>
      <p>
        El NIF figura en la factura y se puede pedir en la consulta. La actividad es la asistencia de fisioterapia con cita previa. Los textos describen la forma de trabajar y no son un diagnóstico ni una promesa de resultado.
      </p>
      <p>
        Los contenidos de esta web (textos y fotografías de la consulta) son de {clinic.person}. No se permite copiarlos para otro servicio. Las marcas de Oikos Training System pertenecen a sus titulares; aquí solo se indica el lugar donde se pasa consulta.
      </p>
      <p>La ley aplicable es la española. Para cualquier cuestión sobre la web se puede usar el formulario de cita o preguntar directamente en la consulta.</p>
    </>
  );
}

function PrivacyCopy({ locale }: { locale: Locale }) {
  if (locale === "ca") {
    return (
      <>
        <p>Responsable: {clinic.fullName}, consulta a {clinic.street}, {clinic.postalCode} {clinic.city}.</p>
        <p>Dades que es demanen: nom, telèfon i, si el vols deixar, correu electrònic. També es desa l&apos;idioma i la pàgina des de la qual envies el formulari, i el moment de la sol·licitud.</p>
        <p>Finalitat: respondre a la petició d&apos;hora i gestionar la cita. La base és el teu consentiment, que dónes en marcar la casella, i la relació precontractual de demanar visita.</p>
        <p>No es venen ni es cedeixen a tercers per a publicitat. Es conserven el temps necessari per atendre la sol·licitud i, si no hi ha una relació assistencial, com a màxim 12 mesos.</p>
        <p>El botó de WhatsApp no envia res sol. Si el prems, s&apos;obre WhatsApp al teu telèfon amb un missatge que pots editar abans d&apos;enviar. Aquesta conversa la gestiona Meta, no aquesta web.</p>
        <p>El mapa incrustat carrega OpenStreetMap quan obres la pàgina de la consulta. Aquesta web no fa servir galetes d&apos;analítica ni de publicitat. L&apos;única galeta és tècnica i només es crea si algú entra al panell privat de sol·licituds.</p>
        <p>Pots demanar accés, rectificació o supressió a la consulta, o indicant-ho al telèfon que vas deixar. També pots reclamar davant l&apos;Agència Espanyola de Protecció de Dades.</p>
      </>
    );
  }

  return (
    <>
      <p>Responsable: {clinic.fullName}, consulta en {clinic.street}, {clinic.postalCode} {clinic.city}.</p>
      <p>Datos que se piden: nombre, teléfono y, si quieres dejarlo, email. También se guarda el idioma, la página desde la que envías el formulario y el momento de la solicitud.</p>
      <p>Finalidad: responder a la petición de cita y gestionarla. La base es tu consentimiento, que das al marcar la casilla, y la relación precontractual de pedir visita.</p>
      <p>No se venden ni se ceden a terceros para publicidad. Se conservan el tiempo necesario para atender la solicitud y, si no hay una relación asistencial, como máximo 12 meses.</p>
      <p>El botón de WhatsApp no envía nada solo. Si lo pulsas, se abre WhatsApp en tu teléfono con un mensaje que puedes editar antes de enviar. Esa conversación la gestiona Meta, no esta web.</p>
      <p>El mapa incrustado carga OpenStreetMap al abrir la página de la consulta. Esta web no usa cookies de analítica ni de publicidad. La única cookie es técnica y solo se crea si alguien entra en el panel privado de solicitudes.</p>
      <p>Puedes pedir acceso, rectificación o supresión en la consulta, o indicándolo en el teléfono que dejaste. También puedes reclamar ante la Agencia Española de Protección de Datos.</p>
    </>
  );
}
