import { Skeleton } from '@tini/ui'

export function KpiSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-16" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-[60px]" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function LocationsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-48" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-56" />
      <Skeleton className="h-[300px] w-full rounded-lg" />
    </div>
  )
}

export function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <KpiSkeleton />
      <LocationsSkeleton />
    </div>
  )
}

export function TabSkeleton() {
  return (
    <div className="space-y-6">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  )
}
