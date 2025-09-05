import { redirect } from 'next/navigation'
import { getSupabaseServerClientRSC } from '@/lib/supabase/server'
import { SignOutButton } from '@/components/sign-out'

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClientRSC()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  return (
    <div className="mx-auto max-w-3xl p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome, {user.email}</p>
      <SignOutButton />
    </div>
  )
}
