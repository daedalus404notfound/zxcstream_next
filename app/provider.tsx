"use client";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import SideBar from "./sidebar";
import ZoomAnimation from "./zoom-animation";

export default function Provider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>loading</div>;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <SideBar />
        <ZoomAnimation>{children}</ZoomAnimation>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
