// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { differenceInCalendarDays } from 'date-fns'
import { getSupabaseServerClientRSC } from '@/lib/supabase/server'
import { StatCard } from '@/components/ui/stat-card'
import { TaskItem, type Task } from '@/components/task-item'

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

  // All tasks for this user
  const { data: tasksRaw } = await supabase
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true })

  // Ensure tasks is always an array for type-safety
  const tasks: Task[] = (tasksRaw ?? []) as Task[]

  const daysToGo = move ? differenceInCalendarDays(new Date(move.move_date), new Date()) : null

  const total = tasks.length
  const done = tasks.filter((t) => t.status === 'done').length
  const pct = total ? Math.round((done / total) * 100) : 0
  const nextUndone = tasks.find((t) => t.status !== 'done') || null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user.email}</p>
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
              <div className="h-2 rounded bg-primary" style={{ width: `${pct}%` }} />
            </div>
          }
        />
        <StatCard label="Tasks done" value={`${done}/${total}`} helper={`${pct}% complete`} />
        <StatCard
          label="Next due"
          value={nextUndone?.title ?? 'All caught up'}
          helper={
            nextUndone?.due_date ? new Date(nextUndone.due_date).toLocaleDateString() : undefined
          }
        />
      </div>

      {/* Task columns */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Your tasks</h2>

        {/* Summary banner */}
        {tasks.filter((t) => t.status !== 'done').length ? (
          <div className="rounded-xl bg-muted/40 p-3 text-sm">
            You have {tasks.filter((t) => t.status !== 'done').length} open task
            {tasks.filter((t) => t.status !== 'done').length === 1 ? '' : 's'}.
          </div>
        ) : (
          <div className="rounded-xl bg-emerald-50 text-emerald-900 p-3 text-sm">
            🎉 All tasks complete!
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          {(['not_started', 'in_progress', 'done'] as const).map((status) => (
            <div
              key={status}
              className="space-y-3 rounded-2xl border bg-card text-card-foreground p-4"
            >
              <div className="text-sm font-medium capitalize">
                {status.replace('_', ' ')} ({tasks.filter((t) => t.status === status).length})
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
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Local essentials</h2>
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
      </section>
    </div>
  )
}
