// src/components/site-header.tsx
import Link from 'next/link'
import { getSupabaseServerClientRSC } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/sign-out'

export default async function SiteHeader() {
  const supabase = await getSupabaseServerClientRSC() // read-only at render
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="w-full border-b">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
        <div className="font-semibold text-lg">Conciera</div>
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
