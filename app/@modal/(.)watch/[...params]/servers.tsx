import {
  LucideIcon,
  Tally1,
  Tally2,
  Tally3,
  Tally4,
  Tally5,
} from "lucide-react";
export interface ServerTypes {
  name: string;
  isRecommended: boolean;
  sandboxSupport: boolean;
  description: string;
  link: string;
  icon: LucideIcon;
  value: number;
  default?: boolean;
}
export const serverLists = (
  id: number,
  media_type: string,
  season?: number,
  episode?: number
): ServerTypes[] => [
  {
    name: "Server 1",
    isRecommended: true,
    sandboxSupport: true,
    default: true,
    description:
      "Fast and ad-free streaming. Limited to movies and may occasionally be unavailable.",
    link:
      media_type === "movie"
        ? `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=true`
        : `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}?autoPlay=true`,
    icon: Tally1,
    value: 1,
  },
  {
    name: "Server 2",
    isRecommended: true,
    sandboxSupport: true,
    default: false,
    description: "New Updated Server.",
    link:
      media_type === "movie"
        ? `https://vidnest.fun/movie/${id}`
        : `https://vidnest.fun/tv/${id}/${season}/${episode}`,

    icon: Tally2,
    value: 2,
  },
  {
    name: "Server 3",
    isRecommended: true,
    sandboxSupport: true,
    default: false,
    description: "New Updated Server.",
    link:
      media_type === "movie"
        ? `https://zxczxc-pi.vercel.app/player/movie/${id}`
        : `https://zxczxc-pi.vercel.app/player/tv/${id}/${season}/${episode}`,

    icon: Tally3,
    value: 3,
  },
];
