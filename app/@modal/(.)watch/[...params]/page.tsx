"use client";
import Hls from "hls.js";
import { usePlayStore } from "@/store/play-animation";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useMovieById from "@/api/get-movie-by-id";
import useLocalFetch from "@/api/local-fetch";
import { useTvSeason } from "@/api/get-seasons";
import ZXCPlayer from "./player";
import { useLibreSubsTV } from "@/api/subtitle-hooks";

export default function WatchMode() {
  const router = useRouter();
  const { params } = useParams();
  const media_type = String(params?.[0]);
  const id = Number(params?.[1]);
  const season = Number(params?.[2]) || 1;
  const episode = Number(params?.[3]) || 1;
  const [open, setOpen] = useState(true);
  const setPlay = usePlayStore((s) => s.setPlay);

  const dataQuery = useMovieById({ media_type, id });
  const seasonQuery = useTvSeason({
    id,
    season_number: season,
    media_type,
  });
  const metaData = dataQuery.data;
  const seasonData = seasonQuery.data;
  const title = metaData?.title || metaData?.name || "";
  const releaseYear = Number(
    (metaData?.release_date || metaData?.first_air_date || "0000").slice(0, 4)
  );
  const seasonTitle = seasonData?.name || `Season ${season}`;
  const episodeCount = seasonData?.episodes?.length || 0;
  const localQuery = useLocalFetch({
    id,
    media_type,
    season,
    episode,
    title,
    releaseYear,
    seasonTitle,
    episodeCount,
  });
  const localData = localQuery.data ?? null;
  const isLoading = localQuery.isLoading;
  const isError = localQuery.isError;
  const handleCloseDrawer = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setPlay(false);
      setTimeout(() => router.back(), 300);
    }
  };

  const subtitleQuery = useLibreSubsTV({
    imdbId: metaData?.external_ids?.imdb_id ?? "",
    season: media_type === "tv" ? season : undefined,
    episode: media_type === "tv" ? episode : undefined,
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <div className="absolute top-0 z-10 left-0 p-6">
          {/* <ArrowLeft
            onClick={() => handleCloseDrawer(false)}
            className="cursor-pointer"
            size={30}
            strokeWidth={1}
          /> */}
        </div>
        <ZXCPlayer
          localData={localData}
          isError={isError}
          isLoading={isLoading}
          subtitleQuery={subtitleQuery.data ?? []}
          metaData={metaData ?? null}
          closePlayer={open}
          setClosePlayer={handleCloseDrawer}
        />
      </DialogContent>
    </Dialog>
  );
}
