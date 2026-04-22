import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Cormorant+SC:wght@300;400;500;600;700&family=Great+Vibes&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="app-shell">
          <div className="app-container">{children}</div>
        </div>
      </body>
    </html>
  );
}
