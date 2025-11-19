import useMovieById from "@/api/get-movie-by-id";
import { IMAGE_BASE_URL } from "@/constants/tmdb";

export default function OscarPage() {
  const query = useMovieById({ id: 1064213, media_type: "movie" });

  const data = query.data ?? null;

  if (!data) return null;
  return (
    <div className="relative pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-center">
        <div className="col-span-5 space-y-6">
          <div className="text-7xl font-extralight leading-none tracking-tight">
            Featured
            <br />
            <span className="italic font-serif">Masterpiece</span>
          </div>
          <div className="w-24 h-1 bg-linear-to-r from-red-600 to-transparent"></div>
          <div className="text-3xl font-light">{data.title}</div>
          <div className="text-gray-400 font-light leading-relaxed line-clamp-4">
            {data.overview}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full border border-red-600 flex items-center justify-center text-sm">
                {data.vote_average.toFixed(1)}
              </div>
              <span className="text-sm text-gray-500">Rating</span>
            </div>
            <div className="text-sm text-gray-500">
              {new Date(data.release_date).getFullYear()}
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button className="px-6 py-3 bg-red-600 text-backto-background font-medium rounded-sm hover:bg-red-300 transition">
              Experience
            </button>
            <button className="px-6 py-3 border border-white/20 rounded-sm hover:bg-white/5 transition">
              Trailer
            </button>
          </div>
        </div>
        <div className="col-span-7 relative">
          <div className="aspect-16/10 bg-linear-to-br from-red-900/20 via-zinc-900 to-orange-900/20 rounded-sm border border-white/10 relative overflow-hidden">
            {data.backdrop_path && (
              <img
                src={`${IMAGE_BASE_URL}/original${data.backdrop_path}`}
                alt={data.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-red-600/20 blur-3xl"></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-orange-400/20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
