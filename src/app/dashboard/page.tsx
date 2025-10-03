// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { differenceInCalendarDays, format } from 'date-fns'
import { getSupabaseServerClientRSC } from '@/lib/supabase/server'
import { StatCard } from '@/components/ui/stat-card'
import { TaskItem, type Task } from '@/components/task-item'
import { SectionCard } from '@/components/section-card' // if you added this for onboarding

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClientRSC()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  // Latest move for this user
  const { data: move } = await supabase
    .from('moves')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Tasks for that move (fallback to empty list if no move yet)
  const { data: tasks = [] } = move
    ? await supabase
        .from('tasks')
        .select('*')
        .eq('move_id', move.id)
        .order('due_date', { ascending: true })
    : { data: [] as Task[] }

  const daysToGo = move ? differenceInCalendarDays(new Date(move.move_date), new Date()) : null
  const total = tasks.length
  const done = tasks.filter((t) => t.status === 'done').length
  const pct = total ? Math.round((done / total) * 100) : 0

  const nextUndone = tasks.find((t) => t.status !== 'done') || null
  const prettyDue = (d: string | Date | null) => (d ? format(new Date(d), 'd MMM') : '—')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border p-5 md:p-6 bg-gradient-to-b from-primary/5 to-background">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome, {user.email}
          {move?.new_address ? ` · ${move.new_address}` : ''}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          label="Move timeline"
          value={
            daysToGo === null
              ? 'No move yet'
              : daysToGo > 0
              ? `In ${daysToGo} day${daysToGo === 1 ? '' : 's'}`
              : daysToGo === 0
              ? 'Today'
              : `${Math.abs(daysToGo)} day${Math.abs(daysToGo) === 1 ? '' : 's'} ago`
          }
          helper={move ? new Date(move.move_date).toLocaleDateString() : undefined}
          footer={
            <div className="h-2 w-full rounded bg-muted">
              <div className="h-2 rounded bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
          }
        />

        <StatCard label="Tasks done" value={`${done}/${total}`} helper={`${pct}% complete`} />

        <StatCard
          label="Next due"
          value={nextUndone?.title ?? 'All caught up'}
          helper={nextUndone?.due_date ? prettyDue(nextUndone.due_date) : undefined}
        />
      </div>

      {/* Upcoming */}
      <SectionCard title="Upcoming" subtitle="Your next few due items">
        {tasks.filter((t) => t.status !== 'done').length ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tasks
              .filter((t) => t.status !== 'done')
              .slice(0, 6)
              .map((t) => (
                <li key={t.id} className="rounded-xl border p-3 bg-card/60">
                  {/* Reuse your TaskItem for visual consistency */}
                  <TaskItem task={t} />
                  <div className="mt-2 text-xs text-muted-foreground">
                    Due: {prettyDue(t.due_date)}
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nothing upcoming—nice work!</p>
        )}
      </SectionCard>

      {/* Task columns */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Your tasks</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(['not_started', 'in_progress', 'done'] as const).map((status) => (
            <div
              key={status}
              className="space-y-3 rounded-2xl border bg-card text-card-foreground p-4"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium capitalize">{status.replace('_', ' ')}</div>
                <span className="text-xs text-muted-foreground">
                  {tasks.filter((t) => t.status === status).length}
                </span>
              </div>

              {tasks
                .filter((t) => t.status === status)
                .map((t) => (
                  <TaskItem key={t.id} task={t as Task} />
                ))}
              {!tasks.some((t) => t.status === status) && (
                <div className="text-sm text-muted-foreground">No tasks</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Local essentials */}
      <SectionCard title="Local essentials" subtitle="Helpful links">
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 text-sm">
          <a
            className="underline"
            href="https://www.gov.uk/find-local-council"
            target="_blank"
            rel="noreferrer"
          >
            Find your council
          </a>
          <a
            className="underline"
            href="https://www.nhs.uk/service-search/gp"
            target="_blank"
            rel="noreferrer"
          >
            Find a GP
          </a>
          <a
            className="underline"
            href="https://www.nhs.uk/service-search/find-a-dentist"
            target="_blank"
            rel="noreferrer"
          >
            Find a dentist
          </a>
          <a
            className="underline"
            href="https://www.gov.uk/apply-for-a-resident-parking-permit"
            target="_blank"
            rel="noreferrer"
          >
            Parking permits
          </a>
          <a
            className="underline"
            href="https://www.gov.uk/rubbish-collection-day"
            target="_blank"
            rel="noreferrer"
          >
            Bin collection day
          </a>
          <a className="underline" href="/onboarding">
            Update move details
          </a>
        </div>
      </SectionCard>
    </div>
  )
}
