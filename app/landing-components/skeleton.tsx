import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
export default function SkeletonLanding({ isSearching }: { isSearching: boolean }) {
  return (
    <motion.div
      animate={{ height: isSearching ? "0" : "100dvh" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="max-h-screen  relative bg-card"
    >
      {/* IMAGE SKELETON */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative  overflow-hidden min-h-screen"
      >
        <Skeleton className="h-full w-full rounded-none" />
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background pointer-events-none" />

      {/* CONTENT SKELETON */}
      <div className="absolute flex items-center justify-end inset-0 p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-[38%] w-2xl space-y-6"
        >
          {/* Genre Badge */}
          <div className="inline-block">
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-12 w-4/5 rounded-lg" />
          </div>

          {/* Rating + Date */}
          <div className="flex items-center gap-6">
            <Skeleton className="h-10 w-20 rounded-lg" />
            <div className="h-8 w-px bg-white/10" />
            <Skeleton className="h-6 w-16 rounded-lg" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-2/3 rounded-lg" />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 w-32 rounded-lg" />
            <Skeleton className="h-12 w-32 rounded-lg" />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <span className="absolute bottom-10 left-1/2 z-10 h-9 w-6 -translate-x-1/2 rounded-full border border-foreground/80 flex items-start justify-center pt-1 animate-bounce opacity-80 shadow-md">
        <span className="h-2.5 w-px bg-foreground border-foreground/80 rounded-full"></span>
      </span>
    </motion.div>
  );
}
