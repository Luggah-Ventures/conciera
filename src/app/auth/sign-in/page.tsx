// src/app/auth/sign-in/page.tsx
import { redirect } from 'next/navigation'
import { getSupabaseServerClientAction } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function signIn(formData: FormData) {
  'use server'
  const email = String(formData.get('email') || '').trim()
  if (!email) return

  const supabase = await getSupabaseServerClientAction()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${
        process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      }/auth/callback`,
    },
  })
  if (error) throw error

  redirect('/auth/check-email')
}

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <form action={signIn} className="mt-6 space-y-4">
        <input type="email" name="email" required className="w-full rounded-md border px-3 py-2" />
        <button type="submit" className="w-full rounded-md bg-black px-3 py-2 text-white">
          Send magic link
        </button>
      </form>
    </main>
  )
}
