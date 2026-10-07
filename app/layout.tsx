import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Courier_Prime } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { LangProvider } from "@/components/lang-provider"
import { WhatsAppButton } from "@/components/whatsapp-button"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const courierPrime = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-courier", display: "swap" });
const ibmPlexSans = IBM_Plex_Sans({ weight: ["300", "400", "500"], subsets: ["latin"], variable: "--font-plex", display: "swap" });

export const metadata: Metadata = {
  title: 'Resa Swastyani — Web Developer & Software Engineer',
  description: 'Portofolio profesional Resa Swastyani, Wisudawati Terbaik IPK 3.94 dari STMIK El Rahma Yogyakarta. Fullstack Developer spesialisasi Next.js, Laravel, Python, dan Machine Learning. Berpengalaman di berbagai proyek nyata dengan tingkat error ~0%.',
  keywords: [
    'Resa Swastyani',
    'Web Developer',
    'Software Engineer',
    'Fullstack Developer',
    'Next.js Developer',
    'Laravel Developer',
    'Python Developer',
    'Machine Learning',
    'Portofolio Developer Indonesia',
    'STMIK El Rahma',
    'Wisudawati Terbaik',
    'Developer Yogyakarta',
    'Developer Boyolali',
    'IoT Developer',
  ],
  authors: [{ name: 'Resa Swastyani', url: 'mailto:resaarrazy@gmail.com' }],
  creator: 'Resa Swastyani',
  openGraph: {
    title: 'Resa Swastyani — Web Developer & Software Engineer',
    description: 'Portofolio profesional Resa Swastyani. Fullstack Developer spesialisasi Next.js, Laravel, Python & Machine Learning. Wisudawati Terbaik IPK 3.94/4.00.',
    type: 'website',
    url: 'https://resaswastyani.com',
    siteName: 'Resa Swastyani Portfolio',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resa Swastyani — Web Developer & Software Engineer',
    description: 'Portofolio profesional Resa Swastyani. Fullstack Developer spesialisasi Next.js, Laravel, Python & Machine Learning.',
    creator: '@resaswastyani',
  },
  icons: {
    icon: [
      {
        url: '/favicon-light.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon-dark.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/favicon-dark.png',
    shortcut: '/favicon-dark.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F4F0' },
    { media: '(prefers-color-scheme: dark)', color: '#111110' },
  ],
}

// Runs before paint: skips the intro overlay for returning visitors in the same session
const introScript = `try{if(sessionStorage.getItem('intro-seen'))document.documentElement.classList.add('intro-seen')}catch(e){}`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} ${courierPrime.variable} ${ibmPlexSans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <link rel="preconnect" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" crossOrigin="" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LangProvider>
            {children}
            <WhatsAppButton />
            <Analytics />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
