"use client";

import { Check, Minus } from "lucide-react";
import { useTheme } from "next-themes";

import systemImg from "@/assets/ui-system.png";
import darkImg from "@/assets/ui-dark.png";
import lightImg from "@/assets/ui-light.png";

const THEMES = [
  { id: "light", label: "Light", img: lightImg },
  { id: "dark", label: "Dark", img: darkImg },
  { id: "system", label: "System", img: systemImg },
];

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-center gap-4">
      {THEMES.map(({ id, label, img }) => {
        const isActive = theme === id;

        return (
          <div
            key={id}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setTheme(id)}
          >
            <span
              className={`rounded-sm overflow-hidden border border-transparent ${
                isActive ? "shadow border border-ring" : ""
              }`}
            >
              <img src={img.src} alt={`${label} theme`} />
            </span>
            <div className="flex gap-2 items-center mt-1">
              {isActive ? <Check size={15} /> : <Minus size={15} />}
              <p
                className={`text-muted-foreground text-xs ${
                  isActive ? "text-primary" : ""
                }`}
              >
                {label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
