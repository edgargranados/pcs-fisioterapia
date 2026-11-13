import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://pcsfisioterapia.com"),
  title: {
    default: "Fisioteràpia esportiva a Mataró | Pol Carmona",
    template: "%s · PCS Fisioterapia",
  },
  description:
    "Fisioteràpia esportiva i readaptació funcional a Mataró. Pol Carmona, Via Sèrgia 32: teràpia manual, exercici terapèutic, punció seca, neuromodulació i readaptació.",
  applicationName: "PCS Fisioterapia",
  authors: [{ name: "Pol Carmona Santandreu" }],
  creator: "Pol Carmona Santandreu",
  category: "health",
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ca" className={`${outfit.variable} ${fraunces.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
