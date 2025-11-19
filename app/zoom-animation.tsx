"use client";
import { motion } from "framer-motion";
import { usePlayStore } from "@/store/play-animation";
import { ReactNode, useEffect } from "react";

type ZoomAnimationProps = {
  children: ReactNode;
  className?: string;

  distort?: boolean; // combined effect
  enhance?: boolean; // brightness + contrast
};

export default function ZoomAnimation({
  children,
  className,

  distort = true,
  enhance = true,
}: ZoomAnimationProps) {
  const play = usePlayStore((s) => s.play);

  useEffect(() => {
    if (play) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  }, [play]);

  return (
    <motion.main
      animate={{
        // opacity: play ? 0 : 1,
        zoom: play && distort ? 1.06 : 1,
        y: play && distort ? -12 : 0,

        filter: play ? "brightness(0) " : "brightness(1) ",

        transformPerspective: 900,
      }}
      transition={
        play
          ? {
              duration: 1.25,
              ease: [0.1, 0.7, 0.9, 1],
            }
          : {
              duration: 0,
            }
      }
      className={`overflow-x-hidden ${className}`}
    >
      {children}
    </motion.main>
  );
}
