import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Pathwise | iGCSE revision: past papers, question bank and flashcards',
    template: '%s | Pathwise',
  },
  description:
    'Edexcel iGCSE Maths, Physics and Chemistry revision. Past papers with mark schemes, a timed question bank, and spaced-repetition flashcards that save your progress.',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#14121f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${display.variable}`}>
      <body className="min-h-svh antialiased">
        <SiteHeader />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
