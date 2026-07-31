import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, IBM_Plex_Sans } from 'next/font/google'
import { Courier_Prime } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { LangProvider } from "@/components/lang-provider"
import { WhatsAppButton } from "@/components/whatsapp-button"

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _courierPrime = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"] });
const _ibmPlexSans = IBM_Plex_Sans({ weight: ["300", "400", "500", "600"], subsets: ["latin"] });

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
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
