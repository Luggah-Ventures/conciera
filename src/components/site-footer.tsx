export function SiteFooter() {
  return (
    <footer className="w-full border-t">
      <div className="mx-auto max-w-5xl p-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Conciera
      </div>
    </footer>
  )
}
