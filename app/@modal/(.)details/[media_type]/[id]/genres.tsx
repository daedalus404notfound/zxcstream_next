import { GenreTypes } from "@/types/movie-by-id";

export default function Genres({ genres }: { genres: GenreTypes[] }) {
  return genres.slice(0, 3).map((genre) => (
    <p
      key={genre.id}
      className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground"
    >
      {genre.name}
    </p>
  ));
}
