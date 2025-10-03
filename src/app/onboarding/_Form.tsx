// src/app/onboarding/_Form.tsx
'use client'

import Image from 'next/image'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Home,
  Users,
  Settings,
  Heart,
  CarFront,
  IdCard,
  Landmark,
  Activity,
  Tv,
  UtilityPole,
  ShieldCheck,
  FileText,
} from 'lucide-react'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { SectionCard } from '@/components/section-card'

type InstitutionRow = { id: string; title: string; notes: string | null }

const onboardingSchema = z.object({
  // Required basics
  full_name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Enter a valid email'),
  current_address: z.string().min(5, 'Enter your current address'),
  new_address: z.string().min(5, 'Enter your new address'),
  move_date: z.string().min(1, 'Select your move date'),
  new_postcode: z.string().min(2, 'Enter your new postcode'),

  // Optional
  phone: z.string().optional(),
  adults: z.coerce.number().min(0),
  children: z.coerce.number().min(0),
  pets: z.coerce.number().min(0),

  // checkboxes often post ""/undefined – we still keep them required in the output shape
  vehicle_owned: z.boolean().default(false),
  driving_licence_no: z.string().optional(),

  // Preferences
  pref_greenEnergy: z.boolean().default(false),
  pref_fibrePreferred: z.boolean().default(false),
  pref_budgetRange: z.string().optional(),

  // Clubs & societies
  clubs_interests: z.string().optional(),
  clubs_gymPriority: z.boolean().default(false),
})

export type FormValues = z.infer<typeof onboardingSchema>

/** Simple icon resolver so each tile gets a relevant pictogram. */
function getIconFor(title: string) {
  const key = title.toLowerCase()
  if (key.includes('dvla')) return CarFront
  if (key.includes('driving licence')) return IdCard
  if (key.includes('hmrc')) return FileText
  if (key.includes('council')) return Landmark
  if (key.includes('nhrc')) return Landmark
  if (key.includes('nhs')) return Activity
  if (key.includes('dentist')) return Activity
  if (key.includes('gp')) return Activity
  if (key.includes('tv licence')) return Tv
  if (key.includes('utilities') || key.includes('broadband') || key.includes('energy'))
    return UtilityPole
  if (key.includes('bank')) return ShieldCheck
  return Home
}

/** A small presentational “tile” (icon + title + helper + optional checkbox). */
function Tile({
  title,
  helper,
  icon: Icon,
  checkboxName,
  checkboxValue,
  defaultChecked,
}: {
  title: string
  helper?: string | null
  icon: React.ElementType
  checkboxName?: string
  checkboxValue?: string
  defaultChecked?: boolean
}) {
  return (
    <label className="group relative flex cursor-pointer items-start gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:bg-muted/40 hover:shadow-md">
      {checkboxName ? (
        <input
          type="checkbox"
          name={checkboxName}
          value={checkboxValue}
          defaultChecked={defaultChecked}
          className="absolute right-4 top-4 h-4 w-4 rounded border-muted-foreground/30 text-primary focus:ring-primary"
        />
      ) : null}

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>

      <span className="flex min-w-0 flex-col">
        <span className="truncate font-medium">{title}</span>
        {helper ? <span className="truncate text-sm text-muted-foreground">{helper}</span> : null}
      </span>
    </label>
  )
}

function OnboardingForm({
  institutions,
  userEmail,
  userName,
}: {
  institutions: InstitutionRow[] | null
  userEmail: string | null
  userName?: string | null
}) {
  const defaultValues: FormValues = useMemo(
    () => ({
      full_name: '',
      email: userEmail ?? '',
      phone: '',
      current_address: '',
      new_address: '',
      move_date: '',
      new_postcode: '',
      adults: 1,
      children: 0,
      pets: 0,
      vehicle_owned: false,
      driving_licence_no: '',
      pref_greenEnergy: false,
      pref_fibrePreferred: false,
      pref_budgetRange: '',
      clubs_interests: '',
      clubs_gymPriority: false,
    }),
    [userEmail]
  )

  // 🧠 IMPORTANT: let RHF infer types from the resolver+schema.
  const form = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues,
    mode: 'onBlur',
  })

  // Block submit if form invalid (works with server action <form action=...>)
  useEffect(() => {
    const btn = document.getElementById('onboarding-submit')
    if (!btn) return
    const handler = async (e: Event) => {
      const ok = await form.trigger()
      if (!ok) e.preventDefault()
    }
    btn.addEventListener('click', handler)
    return () => btn.removeEventListener('click', handler)
  }, [form])

  return (
    <div className="min-h-screen bg-white">
      {/* Header / hero – matches landing page tone */}
      <div className="bg-[#1E73BE] text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex justify-center">
            <Image
              src="/conciera-logo.png"
              alt="Conciera"
              width={180}
              height={36}
              className="h-10 sm:h-12 w-auto"
              priority
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3 text-balance">
            {userName
              ? `Let’s get started with your move, ${userName}`
              : 'Let’s get started with your move'}
          </h1>
          <p className="text-lg text-center text-white/90">We’ll guide you step by step.</p>
        </div>
      </div>

      {/* Form body */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Form {...form}>
          <div className="space-y-6">
            {/* Basics */}
            <SectionCard title="Basics" icon={Home}>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input {...field} className="rounded-lg" required name="full_name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="rounded-lg"
                          required
                          name="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} className="rounded-lg" name="phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="move_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Move date</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="rounded-lg"
                          required
                          name="move_date"
                        />
                      </FormControl>
                      <p className="mt-1 text-xs text-muted-foreground">
                        We’ll use this to plan your timeline and reminders.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="current_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current address</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={2}
                            className="rounded-lg"
                            required
                            name="current_address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="new_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New address</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={2}
                            className="rounded-lg"
                            required
                            name="new_address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="new_postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New postcode</FormLabel>
                      <FormControl>
                        <Input {...field} className="rounded-lg" required name="new_postcode" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </SectionCard>

            {/* Household */}
            <SectionCard title="Household" icon={Users}>
              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="adults"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adults</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          className="rounded-lg"
                          name="adults"
                          value={(field.value as number | string | undefined) ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                          }
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="children"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Children</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          className="rounded-lg"
                          name="children"
                          value={(field.value as number | string | undefined) ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                          }
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pets</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          className="rounded-lg"
                          name="pets"
                          value={(field.value as number | string | undefined) ?? ''}
                          onChange={(e) =>
                            field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                          }
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicle_owned"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormLabel className="sr-only">Vehicle owned</FormLabel>
                      <div className="flex items-center gap-3 rounded-xl border p-4">
                        <FormControl>
                          <Checkbox
                            checked={!!field.value}
                            onCheckedChange={(v) => field.onChange(!!v)}
                            aria-label="Vehicle owned"
                          />
                        </FormControl>
                        <span className="text-sm">I own a vehicle</span>
                        {/* native input so the value posts with server action */}
                        <input type="hidden" name="vehicle_owned" value={field.value ? 'on' : ''} />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="driving_licence_no"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormLabel>Driving licence number (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} className="rounded-lg" name="driving_licence_no" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </SectionCard>

            {/* Preferences (icon tiles like v0) */}
            <SectionCard title="Preferences" icon={Settings}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Tile title="DVLA" helper="Send drivers/postal address" icon={CarFront} />
                <Tile title="HMRC" helper="Get the right online form" icon={FileText} />
                <Tile title="NHRC" helper="Postal address change" icon={Landmark} />
                <Tile title="NHS" helper="Register for nearest GP" icon={Activity} />
                <Tile title="TV licence" helper="Update your new address" icon={Tv} />
                <Tile title="Utilities" helper="Compare providers and rates" icon={UtilityPole} />
              </div>

              {/* Your two boolean prefs + budget input remain below (optional) */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="pref_greenEnergy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Green energy only</FormLabel>
                      <div className="flex items-center gap-3 rounded-xl border p-4">
                        <FormControl>
                          <Checkbox
                            checked={!!field.value}
                            onCheckedChange={(v) => field.onChange(!!v)}
                            aria-label="Green energy only"
                          />
                        </FormControl>
                        <span className="text-sm">Green energy only</span>
                        <input
                          type="hidden"
                          name="pref_greenEnergy"
                          value={field.value ? 'on' : ''}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pref_fibrePreferred"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Fibre preferred</FormLabel>
                      <div className="flex items-center gap-3 rounded-xl border p-4">
                        <FormControl>
                          <Checkbox
                            checked={!!field.value}
                            onCheckedChange={(v) => field.onChange(!!v)}
                            aria-label="Fibre preferred"
                          />
                        </FormControl>
                        <span className="text-sm">Fibre preferred</span>
                        <input
                          type="hidden"
                          name="pref_fibrePreferred"
                          value={field.value ? 'on' : ''}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pref_budgetRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="£, ££ or £££"
                          className="rounded-lg"
                          name="pref_budgetRange"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </SectionCard>

            {/* Clubs & Societies */}
            <SectionCard title="Clubs & Societies" icon={Heart}>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="clubs_interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests (comma-separated)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-lg"
                          name="clubs_interests"
                          placeholder="football, padel, CrossFit, CFA Society, Rotary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clubs_gymPriority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Gym is a priority</FormLabel>
                      <div className="flex items-center gap-3 rounded-xl border p-4">
                        <FormControl>
                          <Checkbox
                            checked={!!field.value}
                            onCheckedChange={(v) => field.onChange(!!v)}
                            aria-label="Gym is a priority"
                          />
                        </FormControl>
                        <span className="text-sm">Gym is a priority</span>
                        <input
                          type="hidden"
                          name="clubs_gymPriority"
                          value={field.value ? 'on' : ''}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Institutions checklist rendered as icon tiles */}
              {institutions && institutions.length > 0 && (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {institutions.map((inst) => {
                    const Icon = getIconFor(inst.title)
                    return (
                      <Tile
                        key={inst.id}
                        title={inst.title}
                        helper={inst.notes ?? undefined}
                        icon={Icon}
                        checkboxName="institutions"
                        checkboxValue={inst.id}
                        defaultChecked
                      />
                    )
                  })}
                </div>
              )}
            </SectionCard>

            {/* Submit helper row */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                You can adjust these later from your dashboard.
              </p>
              <Button
                id="onboarding-submit"
                type="submit"
                size="lg"
                className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-semibold bg-[#1E73BE] hover:bg-[#1557a0] text-white shadow-lg hover:shadow-xl transition-all"
              >
                Generate Moving Plan
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default OnboardingForm
export { OnboardingForm }
