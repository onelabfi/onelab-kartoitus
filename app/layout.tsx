import type { Metadata } from 'next';
import './globals.css';
import { LangProvider } from '@/lib/LangContext';

export const metadata: Metadata = {
  title: 'Onelab Kartoittaja — Asbestikartoitussovellus ammattilaisille',
  description: 'Mobiilisovellus asbestikartoittajille. Kerää näytteet, dokumentoi kohteet ja lähetä asbestikartoitusraportti suoraan laboratorioon. Analyysi: Onelab Oy.',
  keywords: 'asbestikartoitus, asbestinäyte, asbestikartoittaja, haitta-ainekartoitus, asbestitutkimus, asbesti remontti, asbestianalyysi, kartoitusraportti, onelab',
  manifest: '/manifest.json',
  metadataBase: new URL('https://onelab-kartoitus.vercel.app'),
  alternates: { canonical: 'https://onelab-kartoitus.vercel.app' },
  openGraph: {
    type: 'website',
    url: 'https://onelab-kartoitus.vercel.app',
    title: 'Onelab Kartoittaja — Asbestikartoitussovellus ammattilaisille',
    description: 'Mobiilisovellus asbestikartoittajille. Kerää näytteet, dokumentoi kohteet ja lähetä raportti laboratorioon.',
    siteName: 'Onelab Kartoittaja',
    locale: 'fi_FI',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Onelab Kartoittaja' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Onelab Kartoittaja — Asbestikartoitus tehokkaasti',
    description: 'Mobiilisovellus asbestikartoittajille. Näytteet, dokumentointi ja raportit.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Onelab Kartoittaja',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'iOS, Android, Web',
              description: 'Mobiilisovellus asbestikartoittajille. Kerää näytteet, dokumentoi kohteet ja lähetä kartoitus suoraan laboratorioon.',
              url: 'https://onelab-kartoitus.vercel.app',
              publisher: {
                '@type': 'Organization',
                name: 'Onelab Oy',
                url: 'https://onelab.fi',
              },
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
              inLanguage: 'fi',
            }),
          }}
        />
      </head>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
