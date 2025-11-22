// import { useEffect, useRef } from "react";
// import Hls from "hls.js";
// import { Streams } from "@/api/local-fetch";

// export function useVideoSetup(localData: Streams | null) {
//   const origin = localData?.stream.headers?.Origin;
//   const referer = localData?.stream.headers?.Referer;
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const hlsRef = useRef<Hls | null>(null);
//   console.log("localData", localData);
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !localData) return;

//     if (localData.stream?.type === "hls") {
//       if (Hls.isSupported()) {
//         hlsRef.current = new Hls();
//         hlsRef.current.loadSource(
//           `/api/proxy?url=${localData.stream?.playlist}${
//             referer ? `&referer=${referer}` : ""
//           }${origin ? `&origin=${origin}` : ""}`
//         );
//         hlsRef.current.attachMedia(video);
//       } else {
//         video.src = localData.stream?.playlist;
//       }
//     } else if (localData.stream?.type === "file") {
//       // pick a quality, e.g., 720p
//       const url = localData.stream?.qualities["720"]?.url || "";
//       if (url) {
//         video.src = url;
//       }
//     }

//     return () => {
//       hlsRef.current?.destroy();
//     };
//   }, [localData]);

//   return videoRef;
// }

// // https://scrennnifu.click/movie | serial/tt0899043/playlist.m3u8
import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Streams } from "@/api/local-fetch";

export function useVideoSetup(localData: Streams | null) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !localData?.stream) return;

    // Clean up previous HLS instance
    hlsRef.current?.destroy();
    hlsRef.current = null;

    if (localData.stream.type === "hls") {
      const playlist = localData.stream.playlist;
      const referer = localData.stream.headers?.Referer;
      const origin = localData.stream.headers?.Origin;

      // Build proxy URL safely
      const params = new URLSearchParams({ url: playlist });
      if (referer) params.set("referer", referer);
      if (origin) params.set("origin", origin);

      const proxyUrl = `/api/proxy?${params.toString()}`;

      console.log("Playing HLS via proxy:", proxyUrl);

      if (Hls.isSupported()) {
        const hls = new Hls({
          // Optional: improve reliability
          maxLoadingDelay: 10,
          xhrSetup: (xhr) => {
            xhr.withCredentials = false;
          },
        });

        hls.loadSource(proxyUrl);
        hls.attachMedia(video);
        hlsRef.current = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native
        video.src = proxyUrl;
      }
    }

    // Direct MP4
    else if (localData.stream.type === "file") {
      const quality =
        localData.stream.qualities?.["1080"] ||
        localData.stream.qualities?.["720"] ||
        Object.values(localData.stream.qualities || {})[0];

      if (quality?.url) {
        video.src = quality.url;
      }
    }

    // Cleanup
    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [localData]);

  return videoRef;
}
