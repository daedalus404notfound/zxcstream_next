"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEscape } from "@/lib/useEscape";
import { useDebounce } from "@/lib/debounder";
import SpotlightBorderWrapper from "@/components/ui/border";
export default function SearchModal() {
  const [open, setOpen] = useState(false);
  useEscape(() => setOpen((prev) => !prev));
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [lastPage, setLastPage] = useState("/");
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [text, setText] = useState(query ?? "");
  const typeDebounced = useDebounce(text, 800);
  const clearDebounced = useDebounce(text, 100);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    if (
      !pathname.startsWith("/search") &&
      !pathname.startsWith("/details") &&
      !pathname.startsWith("/watch")
    ) {
      setLastPage(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      setText("");
    }
  }, [open]);

  useEffect(() => {
    // 1. User cleared input (fast)
    if (clearDebounced.trim().length === 0) {
      router.replace(lastPage);
      return;
    }

    // 2. User is typing (slow)
    if (typeDebounced.trim().length > 0) {
      router.replace(`/search?query=${encodeURIComponent(typeDebounced)}`);
    }
  }, [typeDebounced, clearDebounced, lastPage]);

  // handle input change
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  return (
    <div className="relative flex items-center">
      <div onClick={() => setOpen((prev) => !prev)}>
        <Search className={open ? "text-red-800" : ""} />
      </div>

      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            key="search-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ willChange: "opacity, transform" }}
            className="fixed top-6 left-1/2 -translate-x-1/2 border-2 p-1 rounded-full flex items-center gap-3 z-99 "
          >
            <SpotlightBorderWrapper>
              <Input
                ref={inputRef}
                value={text}
                type="search"
                placeholder="Search ..."
                className="w-2xl backdrop-blur-2xl border-0 h-11 pl-14 rounded-full bg-background/50! text-base!"
                onChange={handleSearch}
              />
            </SpotlightBorderWrapper>
            <span className="absolute left-2 flex items-center border-r pl-2 pr-3">
              <Search className="size-4 opacity-50" />
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
