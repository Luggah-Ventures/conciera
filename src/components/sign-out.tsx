// src/components/sign-out.tsx
import { getSupabaseServerClientAction } from '@/lib/supabase/server'

export function SignOutButton() {
  async function signOut() {
    'use server'
    const supabase = await getSupabaseServerClientAction()
    await supabase.auth.signOut()
  }

  return (
    <form action={signOut}>
      <button className="text-sm underline">Sign out</button>
    </form>
  )
}
