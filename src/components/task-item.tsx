import Link from 'next/link'

export type Task = {
  id: string
  slug: string
  title: string
  status: 'not_started' | 'in_progress' | 'done'
  due_date: string | null
}

function StatusBadge({ status }: { status: Task['status'] }) {
  const map = {
    not_started: 'bg-secondary text-secondary-foreground',
    in_progress: 'bg-accent text-accent-foreground',
    done: 'bg-primary text-primary-foreground',
  } as const
  const label = status.replace('_', ' ')
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${map[status]}`}>{label}</span>
  )
}

export function TaskItem({ task }: { task: Task }) {
  const due = task.due_date ? new Date(task.due_date).toLocaleDateString() : null
  return (
    <div className="rounded-xl border p-3 hover:bg-muted/40 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <Link href={`/tasks/${task.slug}`} className="font-medium hover:underline">
          {task.title}
        </Link>
        <div className="flex items-center gap-2">
          {due ? <span className="text-xs text-muted-foreground">{due}</span> : null}
          <StatusBadge status={task.status} />
        </div>
      </div>
    </div>
  )
}
