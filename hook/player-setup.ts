import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Stream } from "@/api/local-fetch";

export function useVideoSetup(localData: Stream | null) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !localData) return;

    if (localData.type === "hls") {
      if (Hls.isSupported()) {
        hlsRef.current = new Hls();
        hlsRef.current.loadSource(localData.playlist);
        hlsRef.current.attachMedia(video);
      } else {
        video.src = localData.playlist;
      }
    } else {
      video.src = localData.playlist;
    }

    return () => {
      hlsRef.current?.destroy();
    };
  }, [localData]);

  return videoRef;
}
