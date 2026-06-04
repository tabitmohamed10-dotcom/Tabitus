import type { Metadata } from 'next'
import { Playfair_Display, Inter, Noto_Naskh_Arabic } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const playfair = Playfair_Display({ subsets:['latin'], weight:['400','500'], style:['normal','italic'], variable:'--font-playfair', display:'swap' })
const inter = Inter({ subsets:['latin'], weight:['300','400','500'], variable:'--font-inter', display:'swap' })
const arabic = Noto_Naskh_Arabic({ subsets:['arabic'], weight:['400','500','600'], variable:'--font-arabic', display:'swap' })

export const metadata: Metadata = {
  title: 'TABIT — Le marché travaille pour vous',
  description: 'Publiez votre besoin. Les meilleurs commerçants du Maroc vous font leurs offres. Prix fixe, confiance garantie.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable} ${arabic.variable}`}>
      <body style={{background:'#FAFAF7',color:'#0C0B09'}}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
