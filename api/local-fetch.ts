// import { useQuery } from "@tanstack/react-query";
// // Type for individual quality info
// export interface QualityInfo {
//   type: string;
//   url: string;
// }

// // Type for the main stream object
// export interface StreamData {
//   id: string;
//   type?: string;
//   playlist?: string;
//   headers?: Record<string, string>;
//   flags?: string[];
//   captions?: any[];
//   qualities?: Record<string, QualityInfo>;
// }

// // Type returned by the API
// export interface ApiResponse {
//   success: boolean;
//   streams?: {
//     sourceId: string;
//     stream: StreamData;
//   };
// }

// // Normalized stream type used in the hook
// export interface Stream {
//   url: string;
//   type?: string;
//   quality?: string;
// }

// export default function useLocalFetch({
//   id,
//   media_type,
//   season,
//   title,
//   releaseYear,
//   episode,
//   seasonTitle,
//   episodeCount,
// }: {
//   id: number;
//   media_type: string;
//   season: number;
//   title: string;
//   releaseYear: number;
//   episode: number;
//   seasonTitle: string;
//   episodeCount: number;
// }) {
//   const query = useQuery<Stream[]>({
//     enabled:
//       (!!id && media_type === "movie") ||
//       (!!id && media_type === "tv" && episodeCount !== 0),
//     queryKey: [
//       "streams",
//       id,
//       media_type,
//       season,
//       episode,
//       title,
//       releaseYear,
//       seasonTitle,
//       episodeCount,
//     ],
//     queryFn: async () => {
//       const params = new URLSearchParams({
//         title,
//         releaseYear: releaseYear.toString(),
//         tmdbId: id.toString(),
//         media_type: media_type === "tv" ? "show" : "movie",
//       });

//       if (media_type === "tv") {
//         params.set("seasonTitle", seasonTitle);
//         params.set("season", season.toString());
//         params.set("episode", episode.toString());
//         params.set("episodeCount", episodeCount.toString());
//       }

//       const res = await fetch(`/api/scrape?${params.toString()}`);
//       const json = await res.json();

//       if (!json.success || !json.streams) return [];

//       const streamObj = json.streams.stream;

//       // Case 1: qualities exist (file)
//       if (streamObj.qualities) {
//         const qualities = streamObj.qualities as Record<string, QualityInfo>;
//         return Object.entries(qualities).map(([quality, info]) => ({
//           url: info.url,
//           type: info.type,
//           quality,
//         })) as Stream[];
//       }

//       // Case 2: HLS / playlist stream
//       if (streamObj.playlist) {
//         return [
//           {
//             url: streamObj.playlist,
//             type: streamObj.type,
//             quality: "HLS",
//           },
//         ];
//       }

//       return [];
//     },
//     refetchOnWindowFocus: false,
//     refetchOnMount: false,
//   });

//   return query;
// }
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export interface Stream {
  id: string;
  type?: string;
  playlist: string;
  headers?: Record<string, string>;
  flags?: string[];
  captions?: any[];
  qualities: Record<string, FileQuality>;
}
export interface FileQuality {
  type: string; // "mp4"
  url: string;
}

export interface Streams {
  sourceId: string;
  stream: Stream;
}
export default function useLocalFetch({
  id,
  media_type,
  season,
  title,
  releaseYear,
  episode,
  seasonTitle,
  episodeCount,
}: {
  id: number;
  media_type: string;
  season: number;
  title: string;
  releaseYear: number;
  episode: number;
  seasonTitle: string;
  episodeCount: number;
}) {
  const query = useQuery<Streams | null>({
    enabled:
      (!!id && media_type === "movie") ||
      (!!id && media_type === "tv" && episodeCount !== 0),
    queryKey: [
      "stream",
      id,
      media_type,
      season,
      episode,
      title,
      releaseYear,
      seasonTitle,
      episodeCount,
    ],
    queryFn: async () => {
      const params: Record<string, string> = {
        title,
        releaseYear: releaseYear.toString(),
        tmdbId: id.toString(),
        media_type: media_type === "tv" ? "show" : "movie",
      };

      if (media_type === "tv") {
        params.seasonTitle = seasonTitle;
        params.season = season.toString();
        params.episode = episode.toString();
        params.episodeCount = episodeCount.toString();
      }

      try {
        const { data } = await axios.get("/api/scrape", { params });

        if (!data.success) return null;
        return data.streams as Streams | null;
      } catch (error) {
        console.error("Error fetching stream:", error);
        return null;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return query;
}
