import { create } from "zustand";

interface LandingSwiperState {
  index: number;
  setIndex: (i: number) => void;
}

export const useLandingSwiper = create<LandingSwiperState>((set) => ({
  index: 0,
  setIndex: (i) => set({ index: i }), // now `i` is typed
}));
