"use client";
import { useReusableApi } from "@/api/tanstack-query";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  EffectFade,
  Navigation,
  Pagination,
  Keyboard,
  Autoplay,
} from "swiper/modules";
import { useLandingSwiper } from "@/store/landing-swiper";
import { useSearchParams } from "next/navigation";
import SkeletonLanding from "./skeleton";
import LandingContent from "./content";
import { useEffect, useRef } from "react";

export default function LandingPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("query");
  const isSearching = Boolean(search);

  const { index, setIndex } = useLandingSwiper();
  const custom_list = [
    { id: 1100988, media_type: "movie" },
    { id: 1234821, media_type: "movie" },
    { id: 94605, media_type: "tv" },
    { id: 1396, media_type: "tv" },
    { id: 1062722, media_type: "movie" },
    { id: 1284120, media_type: "movie" },
    { id: 157336, media_type: "movie" },
    { id: 1233413, media_type: "movie" },
    { id: 1197137, media_type: "movie" },
    { id: 1184918, media_type: "movie" },
    { id: 886083, media_type: "movie" },
    { id: 1422096, media_type: "movie" },
  ];
  const swiperRef = useRef<SwiperType | null>(null);
  const query = useReusableApi({
    custom_list,
    activeIndex: index,
    prefetchRange: 1,
  });
  useEffect(() => {
    if (!swiperRef.current) return;

    if (isSearching) {
      swiperRef.current.autoplay.stop();
    } else {
      swiperRef.current.autoplay.start();
    }
  }, [isSearching]);
  return (
    <Swiper
      spaceBetween={30}
      effect={"fade"}
      navigation={true}
      keyboard={{
        enabled: true,
      }}
      pagination={{
        type: "progressbar",
      }}
      onSwiper={(s) => (swiperRef.current = s)}
      autoplay={{
        delay: 20000,
        disableOnInteraction: false,
      }}
      modules={[EffectFade, Navigation, Pagination, Keyboard, Autoplay]}
      initialSlide={index}
      onSlideChange={(s) => setIndex(s.activeIndex)}
    >
      {query.map((meow, idx) => {
        const data = meow.data;
        const loading = meow.isLoading;
        if (!data || loading) {
          return (
            <SwiperSlide key={`skeleton-${idx}`}>
              <SkeletonLanding isSearching={isSearching} />
            </SwiperSlide>
          );
        }
        return (
          <SwiperSlide>
            {({ isActive }) => (
              <LandingContent
                isSearching={isSearching}
                isActive={isActive}
                data={data}
              />
            )}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
