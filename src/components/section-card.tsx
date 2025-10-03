import * as React from 'react'
import type { LucideIcon } from 'lucide-react'

interface SectionCardProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
}

export function SectionCard({
  title,
  subtitle,
  icon: Icon,
  children,
  className = '',
}: SectionCardProps) {
  return (
    <section
      className={[
        'rounded-2xl border bg-card text-card-foreground',
        'shadow-sm hover:shadow-md transition-shadow',
        'p-5 md:p-6',
        className,
      ].join(' ')}
    >
      <header className="mb-4 flex items-center gap-3">
        {Icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
        <div>
          <h2 className="text-base md:text-lg font-semibold">{title}</h2>
          {subtitle && <p className="text-xs md:text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
      </header>
      {children}
    </section>
  )
}
