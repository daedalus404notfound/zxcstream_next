"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop({
  threshold = 300,
  className = "",
}: {
  threshold?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-30   flex flex-col gap-2 items-center animate-bounce">
      <ArrowUp className="opacity-80 size-5" strokeWidth={1} />
      <span
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="  h-9 w-6  rounded-full border border-foreground/80 flex items-start justify-center pt-1 opacity-80 shadow-md"
      >
        <span className="h-2.5 w-px bg-foreground  border-foreground/80 rounded-full"></span>
      </span>
    </div>
  );
}
