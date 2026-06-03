import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Tabitus',
    default: 'Tabitus — Le marché qui travaille pour vous',
  },
  description:
    'Publiez votre demande, recevez les meilleures offres de commerçants vérifiés. ' +
    'Comparez, choisissez, économisez. La marketplace intelligente du Maroc et de l\'Afrique.',
  keywords: ['marketplace', 'Maroc', 'achats', 'commerçants', 'demande', 'offres', 'prix'],
  authors: [{ name: 'Tabitus' }],
  creator: 'Tabitus',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    url: 'https://tabitus.com',
    siteName: 'Tabitus',
    title: 'Tabitus — Le marché qui travaille pour vous',
    description: 'Publiez votre besoin. Recevez les meilleures offres. Économisez.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Tabitus' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tabitus — Le marché qui travaille pour vous',
    description: 'Publiez votre besoin. Recevez les meilleures offres.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#080808' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'hsl(240 5% 7%)',
              border: '1px solid hsl(240 4% 13%)',
              color: 'hsl(0 0% 98%)',
              borderRadius: '0.875rem',
              fontSize: '0.875rem',
            },
          }}
        />
      </body>
    </html>
  )
}
