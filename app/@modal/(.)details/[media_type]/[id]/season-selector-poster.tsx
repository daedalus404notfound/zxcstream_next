import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination, Keyboard, Scrollbar } from "swiper/modules";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { Season } from "@/types/movie-by-id";
import useHoverSound from "@/hook/sound-hover-hook";
import { useSeasonStore } from "@/store/season";
import { motion } from "framer-motion";
export default function SeasonSelectorPoster({
  seasons,
  id,
}: {
  seasons: Season[];
  id: number;
}) {
  const playHover = useHoverSound("/keyboard.wav");
  const { setSeasonSelect, getSeasonSelect } = useSeasonStore();
  const savedSeason = getSeasonSelect(id);
  const initialIndex = savedSeason
    ? seasons.findIndex((s) => s.season_number === savedSeason.number)
    : seasons.length - 1; // fallback to last season
  return (
    <div className="space-y-3">
      <div>
        <motion.span
          className="bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-size-[200%_100%] bg-clip-text  text-red-600/70 
  text-4xl  havelock tracking-[-5px] py-5 bg    drop-shadow-[1px_1px_3px_rgba(0,0,0,0.3)]
  "
          initial={{ backgroundPosition: "200% 0", opacity: 0, y: 20 }}
          animate={{ backgroundPosition: "-200% 0", opacity: 1, y: 0 }}
          transition={{
            backgroundPosition: {
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              duration: 7,
              ease: "linear",
            },
            opacity: { duration: 0.4, delay: 1.1 },
            y: { duration: 0.4, delay: 1.1 },
          }}
        >
          Seasons
        </motion.span>
        <p className="text-muted-foreground">{seasons.length} seasons</p>
      </div>
      <Swiper
        spaceBetween={10}
        navigation={true}
        keyboard={{ enabled: true }}
        scrollbar={{
          el: ".swiper-scrollbar",
          hide: false,
        }}
        // slidesPerGroup={5}
        data-vaul-no-drag
        slidesPerView={5}
        initialSlide={initialIndex}
        modules={[Navigation, Pagination, Keyboard, Scrollbar]}
      >
        {seasons.map((season) => {
          const isSelected = savedSeason?.number === season.season_number;
          return (
            <SwiperSlide key={season.id} className="p-1">
              <div
                onClick={() =>
                  setSeasonSelect(id, {
                    name: season.name,
                    number: season.season_number,
                  })
                }
              >
                <div
                  className={`group p-px rounded-sm bg-linear-to-b hover:to-red-800 from-transparent active:scale-98 active:from-red-800 ${
                    isSelected ? "to-red-800 from-transparent" : ""
                  }`}
                >
                  <div
                    className="aspect-2/3 rounded-sm  transition cursor-pointer overflow-hidden relative "
                    onMouseEnter={playHover}
                  >
                    <div className="absolute top-0 -left-2 flex items-center z-20">
                      <div
                        className="flex items-center justify-center text-gray-200 tracking-widest font-semibold text-xs pl-5 pr-6  uppercase  py-1.5 bg-linear-to-br to-red-950 from-red-800"
                        style={{
                          clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
                        }}
                      >
                        {season.name}
                      </div>
                    </div>
                    {season.poster_path && (
                      <img
                        src={`${IMAGE_BASE_URL}/w780${season.poster_path}`}
                        alt={season.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {!isSelected && (
                      <div className="absolute inset-0 bg-background/50 "></div>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-linear-to-b to-red-800/40 from-transparent rounded-md animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
