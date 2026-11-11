import type { Metadata } from "next";
import { therapies } from "@/content/therapies";
import { towns } from "@/content/towns";
import type { Locale } from "@/lib/locale";
import { absoluteUrl, therapyPath } from "@/lib/paths";
import { clinic } from "@/lib/site";

type PageMetaInput = {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  esPath: string;
  caPath: string;
};

export function pageMeta({ locale, title, description, path, esPath, caPath }: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
      languages: {
        es: absoluteUrl(esPath),
        ca: absoluteUrl(caPath),
        "x-default": absoluteUrl(esPath),
      },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: clinic.brand,
      locale: locale === "ca" ? "ca_ES" : "es_ES",
      alternateLocale: locale === "ca" ? ["es_ES"] : ["ca_ES"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: {
      "geo.region": "ES-B",
      "geo.placename": "Mataró",
      "geo.position": `${clinic.lat};${clinic.lng}`,
    },
  };
}

export function businessJsonLd(locale: Locale) {
  const description =
    locale === "ca"
      ? "Fisioteràpia esportiva a Mataró. Pol Carmona: teràpia manual, punció seca, neuromodulació, exercici terapèutic i readaptació esportiva."
      : "Fisioterapia deportiva en Mataró. Pol Carmona: terapia manual, punción seca, neuromodulación, ejercicio terapéutico y readaptación deportiva.";

  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "Physiotherapy"],
    "@id": `${clinic.url}/#consulta`,
    name: clinic.brand,
    alternateName: locale === "ca" ? "Fisioteràpia Pol Carmona" : "Fisioterapia Pol Carmona",
    description,
    url: clinic.url,
    image: [`${clinic.url}/media/pol-carmona.jpg`, `${clinic.url}/media/terapia-manual.jpg`],
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.street,
      addressLocality: clinic.city,
      postalCode: clinic.postalCode,
      addressRegion: clinic.region,
      addressCountry: clinic.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: clinic.lat,
      longitude: clinic.lng,
    },
    hasMap: clinic.maps,
    areaServed: [{ "@type": "City", name: "Mataró" }, ...towns.map((town) => ({ "@type": "City", name: town.name }))],
    availableService: therapies.map((therapy) => ({
      "@type": "MedicalTherapy",
      name: therapy.name[locale],
      url: absoluteUrl(therapyPath(locale, therapy.slug[locale])),
    })),
    employee: {
      "@type": "Person",
      name: clinic.fullName,
      jobTitle: locale === "ca" ? "Fisioterapeuta" : "Fisioterapeuta",
      identifier: clinic.collegeNumber,
      alumniOf: clinic.graduation,
    },
    knowsLanguage: ["ca", "es"],
    isAcceptingNewPatients: true,
    currenciesAccepted: "EUR",
    medicalSpecialty: "Physiotherapy",
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceJsonLd(locale: Locale, name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    areaServed: { "@type": "City", name: "Mataró" },
    provider: { "@id": `${clinic.url}/#consulta` },
    serviceType: name,
  };
}
