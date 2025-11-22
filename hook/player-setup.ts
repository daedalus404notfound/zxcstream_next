import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Streams } from "@/api/local-fetch";

export function useVideoSetup(localData: Streams | null) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  console.log("localData", localData);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !localData) return;

    if (localData.stream?.type === "hls") {
      if (Hls.isSupported()) {
        hlsRef.current = new Hls();
        hlsRef.current.loadSource(
          `/api/proxy?url=${localData.stream?.playlist}`
        );
        hlsRef.current.attachMedia(video);
      } else {
        video.src = localData.stream?.playlist;
      }
    } else if (localData.stream?.type === "file") {
      // pick a quality, e.g., 720p
      const url = localData.stream?.qualities["720"]?.url || "";
      if (url) {
        video.src = url;
      }
    }

    return () => {
      hlsRef.current?.destroy();
    };
  }, [localData]);

  return videoRef;
}

// https://scrennnifu.click/movie | serial/tt0899043/playlist.m3u8
