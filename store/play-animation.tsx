// store/play-store.ts
import { create } from "zustand";

interface PlayState {
  play: boolean;
  setPlay: (value: boolean) => void;
}

export const usePlayStore = create<PlayState>((set) => ({
  play: false,
  setPlay: (value) => set({ play: value }),
}));
