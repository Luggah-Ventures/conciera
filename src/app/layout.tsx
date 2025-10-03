// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import SiteHeader from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { fontSans, fontMono } from './fonts' // ✅ bring in the fonts

export const metadata: Metadata = {
  title: 'Conciera',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <SiteFooter />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
