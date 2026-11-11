import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pcsfisioterapia.com"),
  title: {
    default: "Fisioterapeuta en Mataró | Pol Carmona",
    template: "%s · PCS Fisioterapia",
  },
  description:
    "Fisioterapia deportiva en Mataró. Pol Carmona atiende en Via Sèrgia 32: terapia manual, punción seca, neuromodulación, ejercicio terapéutico y readaptación.",
  applicationName: "PCS Fisioterapia",
  authors: [{ name: "Pol Carmona Santandreu" }],
  creator: "Pol Carmona Santandreu",
  category: "health",
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
