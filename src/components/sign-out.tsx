// e.g., app/components/sign-out.tsx
export function SignOutButton() {
  async function signOut() {
    'use server'
    const { getSupabaseServerClient } = await import('@/lib/supabase/server')
    const supabase = await getSupabaseServerClient()
    await supabase.auth.signOut()
  }
  return (
    <form action={signOut}>
      <button className="text-sm underline">Sign out</button>
    </form>
  )
}
