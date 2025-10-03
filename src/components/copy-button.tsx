'use client'
import { toast } from 'sonner'

export function CopyButton({ text, label = 'Copy template' }: { text: string; label?: string }) {
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        toast.success('Copied to clipboard')
      }}
      className="rounded-lg border px-3 py-1.5 text-sm hover:bg-muted"
      title="Copy to clipboard"
    >
      {label}
    </button>
  )
}
