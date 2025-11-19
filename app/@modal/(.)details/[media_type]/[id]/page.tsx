"use client";
import useMovieById from "@/api/get-movie-by-id";
import { format } from "date-fns";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { AnimatePresence, motion, number } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import {
  ArrowRight,
  Bookmark,
  BookMarked,
  Check,
  GalleryVerticalEndIcon,
  Home,
  Layers2,
  Layers3,
  Pause,
  Play,
  PlayIcon,
  Plus,
  Speaker,
  TextSearch,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Recommendations from "./recommendations";
import Genres from "./genres";
import { Button } from "@/components/ui/button";
import Credits from "./credits";
import { formatRuntime } from "@/lib/runtime";
import useYouTubePlayer from "@/hook/youtube-api";
import SeasonSelectorPoster from "./season-selector-poster";
import { useSeasonStore } from "@/store/season";
import Episodes from "./episodes";
import { Separator } from "@/components/ui/separator";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Waveform } from "ldrs/react";
import "ldrs/react/Waveform.css";
import { usePlayStore } from "@/store/play-animation";

import ZoomAnimation from "@/app/zoom-animation";
import Link from "next/link";
import Image from "next/image";
export default function Modal() {
  const searchParams = useSearchParams();
  const queryUrl = searchParams.get("query");
  const isSearching = Boolean(queryUrl);
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const media_type = String(params.media_type);
  const query = useMovieById({ id, media_type });

  const handleCloseDrawer = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setPlay(false);
      setTimeout(() => {
        router.back();
      }, 300);
    }
  };

  const handleHomeDrawer = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setTimeout(() => {
        router.push("/");
      }, 300);
    }
  };

  const handlePlayMovie = (id: number) => {
    if (open) {
      setPlay(true);
      setTimeout(() => {
        router.push(
          `/watch/${media_type}/${id}${isSearching ? `?query=${queryUrl}` : ""}`
        );
      }, 1000);
    }
  };

  const data = query.data ?? null;
  const loading = query.isLoading;
  //Seasons
  const { setSeasonSelect, getSeasonSelect } = useSeasonStore();
  const saved = getSeasonSelect(id);
  const filtered =
    data?.seasons?.filter(
      (meow) => meow.name !== "Specials" && meow.episode_count
    ) ?? [];
  //RECO
  const recommendations = data?.recommendations.results ?? [];
  const logo =
    data?.images.logos.find(
      (meow) => meow.iso_639_1 === "en" && meow.vote_average < 5
    )?.file_path || data?.images.logos[0]?.file_path;
  const credits = data?.credits.cast;
  const trailerKey = data?.videos.results.find(
    (meow) => meow.type === "Trailer"
  )?.key;
  const { isReady, isMuted, isPlaying, handleUnmute, handlePlay } =
    useYouTubePlayer(trailerKey ?? null);

  useEffect(() => {
    if (!saved && data?.seasons?.length) {
      const last = filtered[filtered.length - 1];
      setSeasonSelect(id, {
        name: last.name,
        number: last.season_number,
      });
    }
  }, [data]);

  //AUTO SCROLL
  const episodesRef = useRef<HTMLDivElement>(null);
  const similarRef = useRef<HTMLDivElement>(null);
  const setPlay = usePlayStore((s) => s.setPlay);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setMounted(true), 250); // 250ms after open
      return () => clearTimeout(t);
    }
    setMounted(false); // reset when closing
  }, [open]);
  return (
    <Drawer
      direction="right"
      open={open}
      onOpenChange={(value) => handleCloseDrawer(value)}
    >
      <DrawerContent className="overflow-y-auto overflow-x-hidden outline-none will-change-opacity">
        <DrawerHeader className="sr-only">
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <ZoomAnimation className="flex-1 bg-background">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
              delay: 0.3,
            }}
            className="flex flex-col flex-1"
          >
            {loading ? (
              <div className=" flex-1 grid place-items-center bg-card">
                <Waveform size="35" stroke="3.5" speed="1" color="white" />
              </div>
            ) : data === null ? (
              <div className=" flex-1 grid place-items-center  bg-card">
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
              <div className="relative flex-1 bg-background ">
                <div className="absolute inset-0 max-h-[60dvh] overflow-hidden">
                  <div
                    id={`yt-player-${trailerKey}`}
                    className="absolute inset-0 w-full h-full scale-140"
                  />

                  {(!isPlaying || !isReady) && (
                    <Image
                      src={
                        data?.backdrop_path
                          ? `${IMAGE_BASE_URL}/original${data.backdrop_path}`
                          : "https://github.com/shadcn.png"
                      }
                      alt={data.title ?? data.name}
                      fill
                      className="object-cover"
                      quality={75}
                    />
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-background/90" />
                  <div className="absolute inset-0 bg-linear-to-bl from-transparent via-transparent  to-background" />
                  {data?.genres && (
                    <div className="absolute top-8 left-8 flex gap-6 items-center">
                      <Genres genres={data?.genres} />
                    </div>
                  )}
                  <Button
                    className="fixed top-6 right-6"
                    variant="ghost"
                    onClick={() => handleHomeDrawer(false)}
                  >
                    <Home />
                  </Button>
                  {/* {data.pr (
              <motion.img
                key="backdrop"
                initial={{ opacity: 0, filter: "blur(0px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                src={
                  data?.backdrop_path
                    ? `${IMAGE_BASE_URL}/original${data.backdrop_path}`
                    : "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200"
                }
                alt=""
              />
            )} */}
                  {isReady && (
                    <motion.div
                      initial={{ x: 80, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 80, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut", delay: 1 }}
                      className="flex absolute top-3/4 right-0 z-10 border-l-2 py-3 bg-background/50 border-red-700 pl-4 pr-8 gap-4"
                    >
                      <button onClick={handlePlay}>
                        {isPlaying ? (
                          <Video className="size-5" />
                        ) : (
                          <VideoOff className="size-5" />
                        )}
                      </button>
                      <p className="text-muted-foreground">|</p>
                      <button onClick={handleUnmute}>
                        {isMuted ? (
                          <VolumeX className="size-5" />
                        ) : (
                          <Volume2 className="size-5" />
                        )}
                      </button>
                    </motion.div>
                  )}
                </div>

                <div className="relative p-8 mt-30 space-y-12">
                  <div className="space-y-6">
                    {data?.tagline && (
                      <div className="relative">
                        <p className="text-lg font-light text-zinc-300 italic leading-relaxed">
                          {data.tagline}
                        </p>
                      </div>
                    )}
                    {logo ? (
                      <div className="  max-w-sm">
                        <img
                          className="w-full h-full object-contain"
                          src={`${IMAGE_BASE_URL}/w780${logo}}`}
                          alt=""
                        />
                      </div>
                    ) : (
                      <h1 className="text-6xl">{data?.title}</h1>
                    )}
                  </div>
                  <div className="flex gap-4 items-center">
                    <Button
                      variant="accent"
                      size="xl"
                      onClick={() => handlePlayMovie(data.id)}
                    >
                      <Play className=" fill-current" /> Play Now
                    </Button>
                    <Button
                      variant="outline"
                      size="xl"
                      className="rounded-full size-12"
                    >
                      <Plus />
                    </Button>
                    {data.seasons && data.seasons.length !== 0 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          episodesRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }}
                      >
                        <GalleryVerticalEndIcon /> Episodes
                      </Button>
                    )}

                    {recommendations.length !== 0 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          similarRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }}
                      >
                        <Layers3 /> Similar
                      </Button>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="h-px w-16 bg-zinc-700 " />
                    <div className="flex items-center gap-6 mb-8">
                      {(data?.vote_average ?? 0) > 0 && (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="text-3xl font-bold text-red-500">
                              {data?.vote_average.toFixed(1)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              / 10
                            </div>
                          </div>
                          <div className="h-8 w-px bg-white/10"></div>
                        </>
                      )}
                      {(data?.release_date || data?.first_air_date) && (
                        <>
                          <div className="text-muted-foreground">
                            {format(
                              data.release_date ?? data.first_air_date,
                              "yyyy"
                            )}
                          </div>

                          <div className="h-8 w-px bg-white/10"></div>
                        </>
                      )}

                      <div className="text-muted-foreground uppercase">
                        {data?.runtime
                          ? formatRuntime(data.runtime)
                          : data?.number_of_seasons
                          ? `S${data?.number_of_seasons}E${data.number_of_seasons}`
                          : "N/A"}
                      </div>
                    </div>
                    {data?.overview && (
                      <p className="text-base leading-loose text-muted-foreground max-w-2xl">
                        {data.overview}
                      </p>
                    )}
                  </div>
                  {credits && <Credits credits={credits} />}
                  {data && media_type === "tv" && (
                    <div className="space-y-6" ref={episodesRef}>
                      <SeasonSelectorPoster seasons={filtered} id={id} />
                      <Episodes id={id} />
                    </div>
                  )}
                  <Separator />
                  {recommendations.length !== 0 && (
                    <div ref={similarRef}>
                      <Recommendations recommendations={recommendations} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </ZoomAnimation>
        <ScrollToTop />
      </DrawerContent>
    </Drawer>
  );
}
