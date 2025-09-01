// src/app/auth/sign-in/page.tsx
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

// ❌ export async function signIn(...) { ... }
async function signIn(formData: FormData) {
  // ✅ no 'export'
  'use server'
  const email = String(formData.get('email') || '').trim()
  if (!email) return

  const { getSupabaseServerClient } = await import('@/lib/supabase/server')
  const supabase = await getSupabaseServerClient()

  await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${
        process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      }/auth/callback`,
    },
  })

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
