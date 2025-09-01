// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = { title: 'Conciera' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  )
}
