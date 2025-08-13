"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-semibold">Conciera</h1>
      <p className="text-muted-foreground mt-2">Your personal concierge for a new era.</p>

      <div className="mt-6">
        <Button onClick={() => toast.success("Welcome to Conciera!")}>
          Show toast
        </Button>
      </div>
    </main>
  )
}
