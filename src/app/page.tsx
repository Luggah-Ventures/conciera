// src/app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CalendarCheck2, Shield, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-primary/5 via-transparent to-transparent">
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* soft radial highlight */}
          <div className="absolute left-1/2 top-[-20%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              Now in private beta
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Conciera</h1>
            <p className="mt-3 text-lg text-muted-foreground md:text-xl">
              A calmer way to handle life admin. Plan your move, automate the paperwork, and track
              everything in one beautiful dashboard.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-xl">
                <Link href="/onboarding">
                  Create my plan <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl">
                <Link href="/dashboard">View dashboard</Link>
              </Button>
            </div>

            <div className="mt-6 text-xs text-muted-foreground">
              No spam. You control what’s shared with services.
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-5xl px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Smart checklist"
            desc="We generate the right tasks for your situation and keep due dates in order."
          />
          <FeatureCard
            icon={<CalendarCheck2 className="h-5 w-5" />}
            title="Timeline aware"
            desc="See what’s due now, what’s next, and what can wait until after you move."
          />
          <FeatureCard
            icon={<Shield className="h-5 w-5" />}
            title="Private by design"
            desc="Your data stays yours. We store only what’s needed to help you get things done."
          />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6">
        <h2 className="text-xl font-semibold">How it works</h2>
        <ol className="mt-4 grid gap-4 md:grid-cols-3">
          <StepCard
            step="1"
            title="Tell us about your move"
            desc="Basics, preferences, and any constraints."
          />
          <StepCard
            step="2"
            title="We build your plan"
            desc="Concise tasks, links, and templates—ready to go."
          />
          <StepCard
            step="3"
            title="Track + complete"
            desc="Progress updates and reminders at the right time."
          />
        </ol>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6">
        <div className="rounded-3xl border bg-card p-8 md:p-12 text-center">
          <h3 className="text-2xl font-semibold">Ready to take the stress out of moving?</h3>
          <p className="mt-2 text-muted-foreground">
            Get a tailored checklist and timeline in under two minutes.
          </p>
          <Button asChild size="lg" className="mt-6 rounded-xl">
            <Link href="/onboarding">
              Start onboarding <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

function StepCard({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <li className="rounded-2xl border bg-card p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
          {step}
        </span>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </li>
  )
}
