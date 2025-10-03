// src/app/onboarding/page.tsx
import { redirect } from 'next/navigation'
import { getSupabaseServerClientRSC } from '@/lib/supabase/server'
import OnboardingForm from './_Form'

type InstitutionRow = { id: string; title: string; notes: string | null }

export default async function OnboardingPage() {
  const supabase = await getSupabaseServerClientRSC()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const { data: institutions } = (await supabase
    .from('institutions')
    .select('id,title,notes')
    .order('title', { ascending: true })) as { data: InstitutionRow[] | null }

  const userName =
    (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) ||
    (user.email ? user.email.split('@')[0] : null)

  return (
    <main className="min-h-screen">
      <OnboardingForm
        institutions={institutions}
        userEmail={user.email ?? null}
        userName={userName}
      />
    </main>
  )
}
