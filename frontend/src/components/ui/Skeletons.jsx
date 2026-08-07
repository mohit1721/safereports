export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-neutral-800 ${className}`} />
);

export const ReportCardSkeleton = () => (
  <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
    <div className="flex items-center justify-between gap-3">
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <Skeleton className="mt-4 h-3 w-full" />
    <Skeleton className="mt-2 h-3 w-3/4" />
    <div className="mt-5 flex flex-wrap gap-6">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={i} className="border-b border-neutral-800/60">
        {Array.from({ length: cols }).map((__, j) => (
          <td key={j} className="py-3 pr-4">
            <Skeleton className="h-3.5 w-full" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export const DetailCardSkeleton = () => (
  <div className="rounded-xl border border-white/5 bg-black/30 p-6">
    <Skeleton className="h-5 w-32" />
    <div className="mt-4 space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-28" />
        </div>
      ))}
    </div>
  </div>
);
