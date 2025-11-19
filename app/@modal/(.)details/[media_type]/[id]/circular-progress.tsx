"use client";
import React, { useMemo } from "react";

const VOTE_COLORS = {
  high: {
    text: "text-green-400",
    stroke: "#4ade80",
  },
  mid: {
    text: "text-yellow-400",
    stroke: "#facc15",
  },
  low: {
    text: "text-red-400",
    stroke: "#f87171",
  },
};

const getVoteClass = (vote: number) => {
  if (vote >= 7.5) return VOTE_COLORS.high;
  if (vote >= 6) return VOTE_COLORS.mid;
  return VOTE_COLORS.low;
};

export default function CircularProgress({
  voteAverage,
}: {
  voteAverage: number;
}) {
  // Clamp invalid values
  const safeVote = Math.min(Math.max(voteAverage || 0, 0), 10);

  const { circumference, strokeDashoffset, colors } = useMemo(() => {
    const percentage = safeVote * 10;
    const radius = 16;
    const c = 2 * Math.PI * radius;

    return {
      circumference: c,
      strokeDashoffset: c - (percentage / 100) * c,
      colors: getVoteClass(safeVote),
    };
  }, [safeVote]);

  return (
    <div className="absolute top-2 right-2">
      <svg width="48" height="48" className="-rotate-90">
        {/* Background circle */}
        <circle
          cx="24"
          cy="24"
          r="16"
          fill="rgba(0, 0, 0, 0.6)"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="3"
        />

        {/* Progress circle */}
        <circle
          cx="24"
          cy="24"
          r="16"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />

        {/* Rating text */}
        <text
          x="24"
          y="24"
          textAnchor="middle"
          dominantBaseline="central"
          fill="currentColor"
          transform="rotate(90 24 24)"
          className={`text-xs font-semibold ${colors.text}`}
        >
          {safeVote.toFixed(1)}
        </text>
      </svg>
    </div>
  );
}
