import { Home, Lock } from 'lucide-react'

export function NavRail() {
  return (
    <nav className="w-[60px] h-screen bg-[var(--nav-rail-bg)] flex flex-col items-center shrink-0 relative">
      {/* 1. Logo area */}
      <div className="flex items-center justify-center w-full py-5 px-4">
        <div className="w-8 h-8 rounded-[3px] bg-white/10 flex items-center justify-center">
          <span className="text-white text-xs font-bold">PVS</span>
        </div>
      </div>

      {/* 2. User avatar */}
      <div className="flex items-center justify-center w-full px-2 pb-2">
        <div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-[var(--color-avatar-bg)] border border-[rgba(19,50,75,0.1)] flex items-center justify-center">
            <span className="text-[var(--color-text-primary)] text-sm font-semibold leading-none">ML</span>
          </div>
        </div>
      </div>

      {/* Home nav item - active */}
      <button className="w-[60px] h-11 flex items-center justify-center hover:bg-white/10 transition-colors bg-white/10">
        <Home className="w-5 h-5 text-white" />
      </button>

      {/* Section divider */}
      <div className="px-4 py-2 w-full">
        <div className="h-px bg-[var(--nav-rail-divider)]" />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Lock button - bottom positioned */}
      <div className="absolute bottom-3.5 left-11 w-8 h-8 rounded-full bg-white shadow-[0px_1px_4px_rgba(0,7,123,0.3)] flex items-center justify-center z-10">
        <Lock className="w-4 h-4 text-[var(--color-text-muted-icon)]" />
      </div>

      {/* Bottom collapse area */}
      <div className="w-full h-[60px] flex items-center justify-center">
        <Lock className="w-5 h-5 text-white" />
      </div>
    </nav>
  )
}
