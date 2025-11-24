"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface StreamResponse {
  success: boolean;
  realStreamUrl?: string;
  download?: string;
  error?: string;
  otherM3u8: string;
}

export default function HlsPlayerTest() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Input state
  const [movieId, setMovieId] = useState("");
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");
  const [season, setSeason] = useState<number>(1);
  const [episode, setEpisode] = useState<number>(1);

  const fetchStream = async () => {
    if (!movieId) {
      setError("Please enter a Movie/TV ID");
      return;
    }

    setLoading(true);
    setError(null);
    setStreamUrl(null);

    try {
      let url = `/api/get?id=${movieId}&media_type=${mediaType}`;
      if (mediaType === "tv") {
        url += `&season=${season}&episode=${episode}`;
      }

      const res = await fetch(url);
      const json: StreamResponse = await res.json();

      if (json.success && json.realStreamUrl) {
        setStreamUrl(json.realStreamUrl);
      } else {
        setError(json.error ?? "Unknown error");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    const video = videoRef.current;
    let hls: Hls;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      let isRecovering = false;

      const recover = async () => {
        if (isRecovering) return;
        isRecovering = true;

        const currentTime = video.currentTime;

        try {
          // Re-use your existing API but call it silently
          const res = await fetch(
            `/api/get?id=${movieId}&media_type=${mediaType}` +
              (mediaType === "tv" ? `&season=${season}&episode=${episode}` : "")
          );
          const json: StreamResponse = await res.json();

          if (json.success && json.realStreamUrl) {
            console.log("Hot-swapping expired m3u8 → fresh one");

            // THIS IS THE MAGIC LINE
            hls.loadSource(json.realStreamUrl);

            // Manifest will reload instantly
            hls.once(Hls.Events.MANIFEST_LOADED, () => {
              // Resume ~8 seconds back to avoid gap
              video.currentTime = Math.max(currentTime - 8, 0);
              video.play();
            });
          }
        } catch (err) {
          console.error("Recovery failed", err);
        } finally {
          isRecovering = false;
        }
      };

      // Auto-recover on fatal error OR long stall
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal || data.type === "networkError") {
          recover();
        }
      });

      // If stuck buffering >12s → token probably died
      let stallTimer: NodeJS.Timeout;
      video.addEventListener("waiting", () => {
        stallTimer = setTimeout(recover, 12000);
      });
      video.addEventListener("playing", () => clearTimeout(stallTimer));
    }

    return () => {
      hls?.destroy();
    };
  }, [streamUrl, movieId, mediaType, season, episode]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-purple-500/20">
        <h1 className="text-4xl font-bold text-white mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          HLS Video Player
        </h1>

        {/* Input fields */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Movie/TV ID
            </label>
            <input
              type="text"
              value={movieId}
              onChange={(e) => setMovieId(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="Enter TMDB ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Media Type
            </label>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as "movie" | "tv")}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition cursor-pointer"
            >
              <option value="movie">Movie</option>
              <option value="tv">TV Show</option>
            </select>
          </div>

          {mediaType === "tv" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Season
                </label>
                <input
                  type="number"
                  min={1}
                  value={season}
                  onChange={(e) => setSeason(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Episode
                </label>
                <input
                  type="number"
                  min={1}
                  value={episode}
                  onChange={(e) => setEpisode(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>
            </div>
          )}

          <button
            onClick={fetchStream}
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading Stream...
              </span>
            ) : (
              "Load Stream"
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Video Player */}
        <div className="relative rounded-lg overflow-hidden bg-black shadow-2xl">
          <video ref={videoRef} controls className="w-full aspect-video" />
        </div>

        {/* Stream URL Info */}
        {streamUrl && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
            <p className="text-green-400 text-sm">
              <span className="font-semibold">✓ Stream Loaded:</span>
              <span className="block mt-1 text-xs text-gray-400 break-all">
                {streamUrl}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
