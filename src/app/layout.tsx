import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google"; // 👈 Cormorant_Garamond removed from here
import { site } from "@/config/site";
import { ALLOW_THEME_QUERY, THEME, themeNames } from "@/config/theme";
import "./globals.css";

const body = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: site.seo.title,
  description: site.seo.description,
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    type: "website",
    locale: "ru_RU",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: THEME === "carbon" ? "#121316" : THEME === "studio" ? "#faf8f5" : "#ffffff",
  width: "device-width",
  initialScale: 1,
  // maximumScale НЕ ограничиваем — иначе ломаем зум для слабовидящих
  viewportFit: "cover",
};

/**
 * Демонстрация клиенту без пересборки: ?theme=precision в адресе.
 * Атрибут ставится до отрисовки, поэтому темы не мигают.
 * Список зашит здесь же — чужое значение из адреса не применится.
 */
const themeQueryScript = `(function(){try{var t=new URLSearchParams(location.search).get("theme");if(t&&${JSON.stringify(
  themeNames,
)}.indexOf(t)>-1){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})()`;

/** Структурированные данные — Google показывает часы работы и рейтинг прямо в выдаче. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: site.name,
  description: site.seo.description,
  telephone: site.contacts.phone,
  email: site.contacts.email,
  address: { "@type": "PostalAddress", streetAddress: site.contacts.address, addressLocality: site.city },
  openingHours: ["Mo-Fr 08:00-19:00", "Sa 09:00-15:00"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme={THEME} className={body.variable}>
      <head>
        {/* Load Cormorant Garamond directly via CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {ALLOW_THEME_QUERY && (
          <script dangerouslySetInnerHTML={{ __html: themeQueryScript }} />
        )}
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
