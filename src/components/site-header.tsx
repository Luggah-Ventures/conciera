// src/components/site-header.tsx
import Image from 'next/image'
import Link from 'next/link'
import { getSupabaseServerClientRSC } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/sign-out'

export default async function SiteHeader() {
  const supabase = await getSupabaseServerClientRSC()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          {/* Use SVG if available; PNG fallback works too */}
          <Image
            src="/conciera-logo.png" // or '/conciera-logo.svg'
            alt="Conciera"
            width={140}
            height={28}
            priority
            className="h-7 w-auto select-none"
          />
          <span className="sr-only">Conciera</span>
        </Link>

        {user ? (
          <SignOutButton />
        ) : (
          <Link href="/auth/sign-in" className="text-sm underline hover:text-foreground">
            Sign in
          </Link>
        )}
      </div>
    </header>
  )
}
