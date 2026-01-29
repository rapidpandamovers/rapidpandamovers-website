import type { Metadata } from 'next'
import './globals.css'
import { getaiGrotesk } from './fonts'
import Header from './components/Header'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'Rapid Panda Movers - Professional Moving Services in Miami',
  description: 'Budget-friendly, reliable, and efficient apartment moving services in Miami. Get free quotes, transparent pricing, and exceptional service.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${getaiGrotesk.variable}`}>
      <body className="bg-white text-slate-900 font-sans antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}