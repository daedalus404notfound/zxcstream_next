"use client";

import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

export default function LazySection({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true, // only fire once
    rootMargin: "200px", // load earlier before entering viewport
  });

  const [mounted, setMounted] = useState(false);

  // mount component once it's in view
  useEffect(() => {
    if (inView) setMounted(true);
  }, [inView]);

  return <div ref={ref}>{mounted ? children : null}</div>;
}
