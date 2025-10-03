import { ReactNode } from 'react'

export function StatCard({
  label,
  value,
  helper,
  footer,
}: {
  label: string
  value: ReactNode
  helper?: string
  footer?: ReactNode
}) {
  return (
    <div className="rounded-2xl border bg-card text-card-foreground p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.04),_0_8px_24px_-12px_rgba(0,0,0,0.12)]">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {helper ? <div className="mt-1 text-sm text-muted-foreground">{helper}</div> : null}
      {footer ? <div className="mt-3">{footer}</div> : null}
    </div>
  )
}
