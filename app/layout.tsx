import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Cormorant_SC, Great_Vibes, Inter } from "next/font/google";
import "./globals.css";

// Self-hosted via next/font — zero external requests, no FOUT, no CLS
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const cormorantSC = Cormorant_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cormorant-sc",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-great-vibes",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "John & Julie — Wedding Day",
  description:
    "Join us as we celebrate our wedding on May 16, 2026. RSVP, view event details, and share your photos.",
  openGraph: {
    title: "John & Julie — Wedding Day",
    description: "05.16.26 — We joyfully invite you to our wedding.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${cormorantSC.variable} ${greatVibes.variable} ${inter.variable}`}
    >
      <body>
        <div className="app-shell">
          <div className="app-container">{children}</div>
        </div>
      </body>
    </html>
  );
}
