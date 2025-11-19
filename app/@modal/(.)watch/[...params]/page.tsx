"use client";

import { usePlayStore } from "@/store/play-animation";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export default function WatchMode() {
  const router = useRouter();
  const { params } = useParams() as { params?: string[] };
  const id = params?.[1];
  const season = params?.[2];
  const episode = params?.[3];

  const [open, setOpen] = useState(true);
  const setPlay = usePlayStore((s) => s.setPlay);

  const handleCloseDrawer = (value: boolean) => {
    setOpen(value);

    if (!value) {
      setPlay(false);
      setTimeout(() => {
        router.back();
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <ArrowLeft
          onClick={() => handleCloseDrawer(false)}
          className="cursor-pointer"
        />
      </DialogContent>
    </Dialog>
  );
}
