import { Skeleton } from "@/components/ui/skeleton";

export function NowPlayingSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6">
      <Skeleton className="w-64 h-64 rounded-2xl bg-muted" />
      <Skeleton className="w-48 h-6 bg-muted" />
      <Skeleton className="w-32 h-4 bg-muted" />
      <Skeleton className="w-full h-2 bg-muted rounded-full" />
    </div>
  );
}

export function TrackListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 glass rounded-xl">
          <Skeleton className="w-12 h-12 rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-3/4 h-4 bg-muted" />
            <Skeleton className="w-1/2 h-3 bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
