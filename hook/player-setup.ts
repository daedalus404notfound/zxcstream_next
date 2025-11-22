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

    // Destroy previous instance
    hlsRef.current?.destroy();
    hlsRef.current = null;

    if (localData.stream.type === "hls") {
      const playlist = localData.stream.playlist;
      const referer = localData.stream.headers?.Referer || "";
      const origin = localData.stream.headers?.Origin || referer;

      // Force trailing slash — StreamWish now requires it on some domains
      const finalReferer = referer.endsWith("/") ? referer : referer + "/";
      const finalOrigin = origin.endsWith("/") ? origin : origin + "/";

      const params = new URLSearchParams({ url: playlist });
      if (finalReferer) params.set("referer", finalReferer);
      if (finalOrigin) params.set("origin", finalOrigin);

      const proxyUrl = `/api/proxy?${params.toString()}`;

      console.log("HLS proxy URL →", proxyUrl);

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,

          // THIS IS THE CRITICAL LINE — forces hls.js to use the EXACT URL we give it
          xhrSetup: (xhr, url) => {
            xhr.open("GET", url, true); // ← preserves ?t=...&s=... tokens + our proxy params
          },
        });

        hls.loadSource(proxyUrl);
        hls.attachMedia(video);
        hlsRef.current = hls;

        // Optional: retry on fatal errors
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error("HLS fatal error:", data);
            setTimeout(() => hls.loadSource(proxyUrl), 3000);
          }
        });
      }
      // Safari native HLS
      else if (video.canPlayType("application/vnd.apple.mpegurl")) {
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

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [localData]);

  return videoRef;
}
