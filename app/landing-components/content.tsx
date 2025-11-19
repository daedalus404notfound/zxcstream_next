import { Button } from "@/components/ui/button";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { usePlayStore } from "@/store/play-animation";
import { MovieTypes } from "@/types/movie-by-id";
import { motion } from "framer-motion";
import { Bookmark, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingContent({
  isSearching,
  isActive,
  data,
}: {
  isSearching: boolean;
  isActive: boolean;
  data: MovieTypes;
}) {
  return (
    <motion.div
      animate={{ height: isSearching ? "0" : "100dvh" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="max-h-screen grid grid-cols-4 relative"
    >
      {/*IMAGE */}
      <motion.div
        initial={{ scale: 1, opacity: 0 }}
        animate={{
          scale: isActive ? 1.03 : 1,
          opacity: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative col-span-3  overflow-hidden min-h-screen"
      >
        <Image
          src={`${IMAGE_BASE_URL}/original${data.backdrop_path}`}
          alt={data.title || data.name}
          className="object-cover 
               mask-[linear-gradient(to_right,black_70%,transparent_100%)]
               mask-size-[100%_100%]"
          fill
          sizes="75vw"
          quality={75}
          priority={isActive}
        />
      </motion.div>
      {/*IMAGE */}{" "}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background pointer-events-none"></div>
      <div className="absolute flex items-center justify-end inset-0 p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: isActive ? 1 : 0,
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-[38%]"
        >
          {data.genres && (
            <div className="inline-block px-4 py-1 bg-red-500/20  tracking-wide uppercase  rounded-full text-xs text-red-600 mb-6">
              {data.genres[0].name}
            </div>
          )}

          <h1 className="text-7xl font-bold mb-6 leading-none">
            {data.title || data.name}
          </h1>
          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-red-500">
                {data.vote_average.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">/ 10</div>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="text-muted-foreground">
              {new Date(data.release_date || data.first_air_date).getFullYear()}
            </div>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-10 line-clamp-4">
            {data.overview}
          </p>
          <div className="flex gap-4">
            <Button
              asChild
              size="xl"
              variant="accent"
              className="active:scale-95"
            >
              <Link
                href={`/details/${data.media_type}/${data.id}`}
                scroll={false}
                prefetch={true}
              >
                <Play className=" fill-current" /> Play Now
              </Link>
            </Button>

            <Button size="xl" variant="outline">
              Add to List <Bookmark strokeWidth={3} />
            </Button>
          </div>
        </motion.div>
      </div>
      {/*IMAGE */}{" "}
      <span className="absolute bottom-10 left-1/2 z-10 h-9 w-6 -translate-x-1/2 rounded-full border border-foreground/80 flex items-start justify-center pt-1 animate-bounce opacity-80 shadow-md">
        <span className="h-2.5 w-px bg-foreground  border-foreground/80 rounded-full"></span>
      </span>
    </motion.div>
  );
}
