import { cn } from '@tini/ui'
import type { Status } from '../data/types'

const statusColors: Record<Status, string> = {
  critical: 'bg-[var(--status-critical)]',
  warning: 'bg-[var(--status-warning)]',
  normal: 'bg-[var(--status-normal)]',
  neutral: 'bg-[var(--status-neutral)]',
}

const statusShapes: Record<Status, string> = {
  critical: 'rounded-none rotate-45',
  warning: 'rounded-none',
  normal: 'rounded-full',
  neutral: 'rounded-full',
}

interface StatusDotProps {
  status: Status
  className?: string
}

export function StatusDot({ status, className }: StatusDotProps) {
  return (
    <span
      className={cn('inline-block w-3 h-3 shrink-0', statusColors[status], statusShapes[status], className)}
      aria-label={status}
    />
  )
}
