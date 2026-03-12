import { Button } from '@tini/ui'

export function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Main App</h1>
        <Button variant="outline" size="sm">
          Toggle Theme
        </Button>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <p className="text-muted-foreground">
          Main application variant — ready for development.
        </p>
      </main>
    </div>
  )
}
