import { Skeleton } from "@/components/ui/skeleton";

export function MediaSkeleton() {
  return (
    <div className="flex-1 relative bg-background">
      {/* Genres skeleton */}
      <div className="absolute top-8 left-8 flex gap-3">
        <Skeleton className="w-16 h-6 rounded-full" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      {/* Backdrop Skeleton */}
      <div className="absolute h-[35dvh] overflow-hidden ">
        {/* Home button skeleton */}
        <Skeleton className="absolute top-6 right-6 w-10 h-10 rounded-md" />

        {/* Play controls skeleton */}
        <div className="absolute top-3/4 right-0 flex gap-4 py-3 px-8 border-l-2 border-red-700/30">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="w-px h-5" />
          <Skeleton className="w-5 h-5 rounded" />
        </div>
      </div>
      {/* Content area skeleton */}
      <div className="relative p-8 space-y-12 mt-30">
        {/* Title/Logo skeleton */}
        <div className="space-y-6">
          {/* Tagline skeleton */}
          <Skeleton className="w-full max-w-xl h-6" />
          {/* Logo/Title skeleton */}
          <Skeleton className="w-48 h-16 rounded-lg" />
        </div>

        {/* Buttons skeleton */}
        <div className="flex gap-4 items-center">
          <Skeleton className="w-32 h-11 rounded-md" />
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-28 h-11 rounded-md" />
          <Skeleton className="w-28 h-11 rounded-md" />
        </div>

        {/* Rating/Info skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-16 h-px" />
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Skeleton className="w-12 h-8" />
              <Skeleton className="w-10 h-5" />
            </div>
            <Skeleton className="w-px h-8" />
            <Skeleton className="w-24 h-5" />
            <Skeleton className="w-px h-8" />
            <Skeleton className="w-20 h-5" />
          </div>
        </div>

        {/* Overview skeleton */}
        <div className="space-y-2 w-1/2">
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-3/4 h-5" />
        </div>

        {/* Credits skeleton */}
        <div className="space-y-3">
          <Skeleton className="w-25 h-6" />
          <div className="flex -space-x-2">
            <Skeleton className="size-24 rounded-full border-2 border-background" />
            <Skeleton className="size-24 rounded-full border-2 border-background" />
            <Skeleton className="size-24 rounded-full border-2 border-background" />
          </div>
        </div>

        {/* Episodes/Recommendations skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-47 h-6 rounded-lg" />
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-2/3" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
