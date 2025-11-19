import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination, Keyboard, Scrollbar } from "swiper/modules";
import MovieCard from "@/components/ui/movie-card";
import useGetReusableData from "@/api/get-reusable-data";
import { ApiTypes, ReusablePropTypes } from "@/types/api-types";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function ReusableSwiper({
  endpoint,
  params,
  title,
  label,
}: ReusablePropTypes) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const query = useGetReusableData<ApiTypes>({
    endpoint,
    params,
    isVisible: inView,
  });

  const data = query.data?.results ?? [];
  const filtered = data.filter((filter) => filter.vote_average > 3);
  return (
    <div className="py-20 border-b " ref={ref}>
      <div className="max-w-7xl mx-auto  relative">
        <h2 className="text-2xl font-extralight mb-3 montserrat tracking-wide p-1">
          {title}{" "}
          <span className="italic font-serif text-gray-500">{label}</span>
        </h2>

        {!inView || query.isLoading ? (
          <div className="grid grid-cols-5 gap-5">
            <Skeleton className="aspect-2/3" />
            <Skeleton className="aspect-2/3" />
            <Skeleton className="aspect-2/3" />
            <Skeleton className="aspect-2/3" />
            <Skeleton className="aspect-2/3" />
          </div>
        ) : (
          <Swiper
            spaceBetween={20}
            navigation={true}
            keyboard={{ enabled: true }}
            scrollbar={{
              el: ".swiper-scrollbar",
              hide: false,
            }}
            slidesPerGroup={5}
            slidesPerView={5}
            modules={[Navigation, Pagination, Keyboard, Scrollbar]}
          >
            {filtered.map((movie, i) => (
              <SwiperSlide key={movie.id} className="p-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: i * 0.03,
                      duration: 0.3,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <MovieCard media_type="movie" movie={movie} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}
