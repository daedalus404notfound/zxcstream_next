import React, { useRef, useState, ReactNode, MouseEvent } from "react";
interface SpotlightBorderWrapperProps {
  children: ReactNode;
  className?: string;
  radius?: number;
}
export default function SpotlightBorderWrapper({
  children,
  className = "",
  radius = 30,
}: SpotlightBorderWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className={`relative ${className}`}
    >
      {/* Spotlight border layer */}
      <div
        style={{
          border: "2px solid red",
          opacity: isVisible ? 1 : 0,
          WebkitMaskImage: `radial-gradient(${radius}% ${radius}px at ${position.x}px ${position.y}px, black 45%, transparent)`,
          maskImage: `radial-gradient(${radius}% ${radius}px at ${position.x}px ${position.y}px, black 45%, transparent)`,
        }}
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full rounded-full transition-opacity duration-500"
        aria-hidden="true"
      />
      <div className="relative z-0">{children}</div>
    </div>
  );
}
