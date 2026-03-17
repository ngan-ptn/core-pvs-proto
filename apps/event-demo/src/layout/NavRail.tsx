import { Home } from 'lucide-react'

export function NavRail() {
  return (
    <nav className="w-[60px] min-h-screen bg-card border-r flex flex-col items-center py-4 shrink-0">
      <div className="w-8 h-8 rounded bg-primary flex items-center justify-center mb-6">
        <span className="text-primary-foreground text-xs font-bold">PVS</span>
      </div>
      <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-accent text-accent-foreground">
        <Home className="w-5 h-5" />
      </button>
    </nav>
  )
}
