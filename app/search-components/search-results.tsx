import useSearch from "@/api/get-search";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Tabs } from "@/components/ui/vercel-tabs";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Waveform } from "ldrs/react";
import "ldrs/react/Waveform.css";
import { TextSearch } from "lucide-react";
import { useInView } from "react-intersection-observer";
import MovieCard from "@/components/ui/movie-card";
import { motion, AnimatePresence } from "framer-motion";
export default function SearchResult() {
  const searchParams = useSearchParams();
  const search = searchParams.get("query") ?? "";
  const [tab, setTab] = useState("movie");
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useSearch({ search, media_type: tab });
  const { ref, inView } = useInView({
    threshold: 1,
    rootMargin: "200px",
  });
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);
  const allResults = useMemo(
    () =>
      data?.pages.flatMap((p) =>
        p.results.filter(
          (m) =>
            m.poster_path &&
            m.backdrop_path &&
            m.vote_average > 1 &&
            m.vote_count > 10 &&
            m.overview &&
            m.popularity > 5
        )
      ) ?? [],
    [data]
  );

  const total = useMemo(
    () => data?.pages[0]?.total_results ?? 0,
    [data?.pages]
  );
  const tabs = useMemo(
    () => [
      {
        id: "movie",
        label: "Movie",
        indicator: tab === "movie" ? total : null,
      },
      { id: "tv", label: "TV Show", indicator: tab === "tv" ? total : null },
      {
        id: "person",
        label: "People",
        indicator: tab === "person" ? total : null,
      },
      {
        id: "collection",
        label: "Collection",
        indicator: tab === "collection" ? total : null,
      },
      {
        id: "company",
        label: "Company",
        indicator: tab === "company" ? total : null,
      },
      {
        id: "keyword",
        label: "Keyword",
        indicator: tab === "keyword" ? total : null,
      },
      {
        id: "network",
        label: "Network",
        indicator: tab === "network" ? total : null,
      },
    ],
    [tab, total]
  );
  return (
    <div className="relative flex flex-col items-center min-h-[calc(100dvh-390px)] pt-30 max-w-7xl mx-auto space-y-10 ">
      <div className="pb-[4.5px] border-b w-full ">
        <Tabs tabs={tabs} onTabChange={(tabId) => setTab(tabId)} />
      </div>

      {isLoading ? (
        <div className=" flex-1 grid place-items-center">
          <Waveform size="35" stroke="3.5" speed="1" color="white" />
        </div>
      ) : allResults.length === 0 ? (
        <div className=" flex-1 grid place-items-center">
          <div className="flex flex-col items-center gap-5">
            <span className="p-3 bg-card border-2 rounded-full">
              <TextSearch />
            </span>
            <div className="text-center">
              <p className="">No data found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try another keyword.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <motion.div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allResults.map((movie, i) => (
            <motion.div
              key={`${movie.id}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                delay: i * 0.03, // <-- stagger animation
              }}
            >
              <MovieCard
                media_type={tab}
                movie={movie}
                paramKey="query"
                paramQuery={search}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="py-10 flex justify-center">
        {isFetchingNextPage && (
          <Waveform size="35" stroke="3.5" speed="1" color="white" />
        )}
      </div>
      <ScrollToTop />
    </div>
  );
}
