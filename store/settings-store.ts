import { create } from "zustand";
import { persist } from "zustand/middleware";

type SpoilerState = {
  activateSpoiler: boolean;
  setActivateSpoiler: (value: boolean) => void;
};

export const useSpoilerStore = create<SpoilerState>()(
  persist(
    (set) => ({
      activateSpoiler: false,
      setActivateSpoiler: (value) => set({ activateSpoiler: value }),
    }),
    {
      name: "spoiler-store", // key in localStorage
    }
  )
);
