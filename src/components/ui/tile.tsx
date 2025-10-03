import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

type TileProps = {
  title: string
  helper?: string
  icon?: LucideIcon
  // checkbox behavior
  name?: string
  value?: string
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
}

export function Tile({
  title,
  helper,
  icon: Icon,
  name,
  value,
  defaultChecked,
  onChange,
  className,
}: TileProps) {
  return (
    <label
      className={cn(
        'group relative flex cursor-pointer items-start gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all',
        'hover:shadow-md hover:bg-muted/40',
        className
      )}
    >
      {name && (
        <input
          type="checkbox"
          name={name}
          value={value}
          defaultChecked={defaultChecked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="absolute right-4 top-4 h-4 w-4 rounded border-muted-foreground/30 text-primary focus:ring-primary"
        />
      )}

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
        {Icon ? <Icon className="h-6 w-6 text-primary" /> : <span className="text-lg">🏷️</span>}
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="truncate font-medium">{title}</div>
        {helper ? <div className="truncate text-sm text-muted-foreground">{helper}</div> : null}
      </div>
    </label>
  )
}
