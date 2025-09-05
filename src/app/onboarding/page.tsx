// app/onboarding/page.tsx
import { redirect } from 'next/navigation'
import { getSupabaseServerClientRSC, getSupabaseServerClientAction } from '@/lib/supabase/server'
import { generateTasksForMove } from '@/lib/db/tasks'

type InstitutionRow = { id: string; title: string; notes: string | null }

async function saveOnboarding(formData: FormData) {
  'use server'

  const supabase = await getSupabaseServerClientAction()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  // --- Required basics
  const full_name = String(formData.get('full_name') || '')
  const email = String(formData.get('email') || '')
  const current_address = String(formData.get('current_address') || '')
  const new_address = String(formData.get('new_address') || '')
  const move_date = String(formData.get('move_date') || '')

  // --- Optional details
  const adults = Number(formData.get('adults') || 1)
  const children = Number(formData.get('children') || 0)
  const pets = Number(formData.get('pets') || 0)
  const vehicle_owned = formData.get('vehicle_owned') === 'on'
  const driving_licence_no = String(formData.get('driving_licence_no') || '')

  // --- Preferences (energy/broadband)
  const preferences = {
    greenEnergy: formData.get('pref_greenEnergy') === 'on',
    fibrePreferred: formData.get('pref_fibrePreferred') === 'on',
    budgetRange: String(formData.get('pref_budgetRange') || ''),
  }

  // --- Clubs & Societies (added in Step 2 tweak)
  const new_postcode = String(formData.get('new_postcode') || '')
  const clubs_interests = String(formData.get('clubs_interests') || '')
  const clubs_gymPriority = formData.get('clubs_gymPriority') === 'on'
  const clubs_prefs = {
    interests: clubs_interests,
    gymPriority: clubs_gymPriority,
  }

  // --- Selected institutions (checkboxes)
  const selectedInstitutionIds = (formData.getAll('institutions') as string[]) ?? []

  // 1) Upsert profile (bind to auth user id)
  await supabase.from('profiles').upsert({
    id: user.id,
    email,
    full_name,
  })

  // 2) Insert move (latest move will be used by dashboard)
  const { data: moveRow, error } = await supabase
    .from('moves')
    .insert({
      user_id: user.id,
      current_address,
      new_address,
      move_date,
      adults,
      children,
      pets,
      vehicle_owned,
      driving_licence_no,
      preferences,
      // Step 2B additions:
      new_postcode,
      clubs_prefs,
    })
    .select()
    .single()

  if (error) {
    // You can improve this with a nicer error page or toast later
    throw error
  }

  // 3) Generate tasks for the chosen institutions
  await generateTasksForMove(moveRow.id, selectedInstitutionIds)

  // 4) Go to dashboard
  redirect('/dashboard')
}

export default async function OnboardingPage() {
  const supabase = await getSupabaseServerClientRSC()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  // Pull registry so we can show checkboxes (includes Clubs & Societies row)
  const { data: institutions } = (await supabase
    .from('institutions')
    .select('id,title,notes')
    .order('title', { ascending: true })) as { data: InstitutionRow[] | null }

  return (
    <main className="mx-auto max-w-3xl p-8 space-y-8">
      <h1 className="text-2xl font-semibold">Tell us about your move</h1>

      <form action={saveOnboarding} className="space-y-8">
        {/* Basics */}
        <section className="grid gap-4 md:grid-cols-2">
          <div className="col-span-2">
            <label className="block text-sm font-medium">Full name</label>
            <input name="full_name" required className="mt-1 w-full rounded border px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={user.email ?? ''}
              required
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone (optional)</label>
            <input name="phone" className="mt-1 w-full rounded border px-3 py-2" />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium">Current address</label>
            <textarea
              name="current_address"
              required
              rows={2}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium">New address</label>
            <textarea
              name="new_address"
              required
              rows={2}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Move date</label>
            <input
              name="move_date"
              type="date"
              required
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">New postcode</label>
            <input name="new_postcode" required className="mt-1 w-full rounded border px-3 py-2" />
          </div>
        </section>

        {/* Household */}
        <section className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium">Adults</label>
            <input
              name="adults"
              type="number"
              min="0"
              defaultValue={1}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Children</label>
            <input
              name="children"
              type="number"
              min="0"
              defaultValue={0}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Pets</label>
            <input
              name="pets"
              type="number"
              min="0"
              defaultValue={0}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          <div className="col-span-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="vehicle_owned" /> Vehicle owned
            </label>
          </div>

          <div className="col-span-3">
            <label className="block text-sm font-medium">Driving licence number (optional)</label>
            <input name="driving_licence_no" className="mt-1 w-full rounded border px-3 py-2" />
          </div>
        </section>

        {/* Preferences */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="col-span-3 font-medium">Preferences</div>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="pref_greenEnergy" /> Green energy only
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="pref_fibrePreferred" /> Fibre preferred
          </label>
          <div>
            <label className="block text-sm font-medium">Budget</label>
            <select name="pref_budgetRange" className="mt-1 w-full rounded border px-3 py-2">
              <option value="">Select…</option>
              <option>£</option>
              <option>££</option>
              <option>£££</option>
            </select>
          </div>
        </section>

        {/* Clubs & Societies */}
        <section className="grid gap-4">
          <div className="font-medium">Clubs & Societies</div>
          <div>
            <label className="block text-sm font-medium">Interests (comma-separated)</label>
            <input
              name="clubs_interests"
              placeholder="football, padel, CrossFit, CFA Society, Rotary"
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="clubs_gymPriority" /> Gym is a priority
          </label>
        </section>

        {/* Institutions (checkbox list) */}
        <section className="space-y-3">
          <div className="font-medium">Which institutions should we set up?</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {institutions?.map((inst: InstitutionRow) => (
              <label key={inst.id} className="inline-flex items-start gap-2 border rounded p-3">
                <input type="checkbox" name="institutions" value={inst.id} defaultChecked />
                <span>
                  <div className="font-medium">{inst.title}</div>
                  <div className="text-sm text-muted-foreground">{inst.notes}</div>
                </span>
              </label>
            ))}
          </div>
        </section>

        <div className="pt-2">
          <button type="submit" className="rounded bg-black px-4 py-2 text-white">
            Create my plan
          </button>
        </div>
      </form>
    </main>
  )
}
