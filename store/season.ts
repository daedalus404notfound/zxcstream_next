import { create } from "zustand";

type SeasonSelect = {
  name: string;
  number: number;
};

type SeasonState = {
  seasonSelect: Record<number, SeasonSelect>;
  setSeasonSelect: (showId: number, v: SeasonSelect) => void;
  getSeasonSelect: (showId: number) => SeasonSelect | undefined;
};

export const useSeasonStore = create<SeasonState>((set, get) => ({
  seasonSelect: {},

  setSeasonSelect: (showId, v) =>
    set((state) => ({
      seasonSelect: {
        ...state.seasonSelect,
        [showId]: v,
      },
    })),

  getSeasonSelect: (showId) => get().seasonSelect[showId],
}));
