"use client";

import LandingPage from "./landing-components/landing-page";
import ReusableSwiper from "./reusable-display";

import SearchResult from "./search-components/search-results";

import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { usePlayStore } from "@/store/play-animation";
export default function MovieWebsite() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const isSearching = Boolean(query);
  const { play } = usePlayStore();

  console.log(play);
  return (
    <>
      <LandingPage />

      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                delay: 0.3,
                duration: 0.3,
                ease: "easeInOut",
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.25,
                ease: "easeInOut",
              },
            }}
          >
            <SearchResult />
          </motion.div>
        ) : (
          <>
            <ReusableSwiper
              endpoint="discover/movie"
              params={{
                with_keywords: 163053,
                with_genres: 27, // horror genre for stronger filtering
                sort_by: "popularity.desc",
              }}
              title="Found Footage Horror"
            />
            <ReusableSwiper
              endpoint="movie/157336/recommendations"
              params={{}}
              title="Because You Watched Interstellar"
            />
            <ReusableSwiper
              endpoint="discover/movie"
              params={{
                with_crew: 525,
                sort_by: "vote_average.desc",
              }}
              title="Christopher Nolan Films"
            />

            <ReusableSwiper
              endpoint="trending/movie/week"
              params={{}}
              title="Trending This Week"
            />
            <ReusableSwiper
              endpoint="discover/movie"
              params={{
                with_origin_country: "JP",
                sort_by: "popularity.desc",
              }}
              title="Popular Japanese Movies"
            />
            <ReusableSwiper
              endpoint="discover/movie"
              params={{
                with_genres: "10749,35",
                sort_by: "popularity.desc",
              }}
              title="Rom-Com Movies"
            />

            <ReusableSwiper
              endpoint="movie/top_rated"
              params={{}}
              title="Top Rated Movies"
            />
            <ReusableSwiper
              endpoint="discover/movie"
              params={{
                with_cast: 6384,
                sort_by: "popularity.desc",
              }}
              title="Keanu Reeves Movies"
            />
            <ReusableSwiper
              endpoint="discover/movie"
              params={{
                sort_by: "popularity.desc",
                with_genres: 28,
              }}
              title="Action Movies"
            />
            <ReusableSwiper
              endpoint="discover/movie"
              params={{
                with_genres: 27,
                primary_release_year: 2023,
              }}
              title="Horror Movies"
            />
            <ReusableSwiper
              endpoint="discover/movie"
              params={{
                with_keywords: 186565,
              }}
              title="Zombie Movies"
            />
            <ReusableSwiper
              endpoint="discover/movie"
              params={{
                with_keywords: 4379,
              }}
              title="Time Travel Movies"
            />
            <ReusableSwiper
              endpoint="discover/movie"
              params={{
                with_origin_country: "KR",
                with_genres: 80,
              }}
              title="Korean Crime Movies"
            />
          </>
        )}
      </AnimatePresence>

      <ScrollToTop />
    </>
  );
}
