import { IMAGE_BASE_URL } from "@/constants/tmdb";
import useHoverSound from "@/hook/sound-hover-hook";
import { MovieTypes } from "@/types/movie-by-id";
import { format } from "date-fns";
import Link from "next/link";

export default function MovieCard({
  movie,
  media_type,
  paramKey,
  paramQuery,
}: {
  movie: MovieTypes;
  media_type: string;
  paramKey?: string;
  paramQuery?: string;
}) {
  const playHover = useHoverSound("/keyboard.wav");
  return (
    <Link
      href={`/details/${media_type}/${movie.id}${
        paramKey ? `?${paramKey}=${paramQuery}` : ""
      }`}
      scroll={false}
      prefetch
    >
      <div
        onClick={playHover}
        className="group p-px rounded-sm bg-linear-to-b hover:to-red-800 from-transparent active:scale-98 active:from-red-800 transition duration-150"
      >
        <div className="aspect-2/3   rounded-sm  transition cursor-pointer overflow-hidden relative ">
          {movie.poster_path && (
            <img
              src={`${IMAGE_BASE_URL}/w780${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-linear-to-b from-transparent to-background/50 opacity-0 group-hover:opacity-100 transition duration-150"></div>
        </div>
      </div>
      <div className="mt-3">
        <h1 className="text-sm font-light truncate">
          {movie.title ?? movie.name}
        </h1>
        <p className="text-xs text-muted-foreground">
          {movie.release_date
            ? format(movie.release_date, "yyyy")
            : movie.first_air_date
            ? format(movie.first_air_date, "yyyy")
            : ""}{" "}
          • {movie.vote_average && movie.vote_average.toFixed(1)} ★
        </p>
      </div>
    </Link>
  );
}
