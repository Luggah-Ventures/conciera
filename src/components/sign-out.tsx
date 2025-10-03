// src/components/sign-out.tsx
import { getSupabaseServerClientAction } from '@/lib/supabase/server'

export function SignOutButton({ className }: { className?: string }) {
  async function signOut() {
    'use server'
    const supabase = await getSupabaseServerClientAction()
    await supabase.auth.signOut()
  }

  return (
    <form action={signOut}>
      <button
        type="submit"
        className={`text-sm px-4 py-1.5 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors ${
          className ?? ''
        }`}
      >
        Sign out
      </button>
    </form>
  )
}
