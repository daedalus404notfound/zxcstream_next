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

import PlayerSettings from "./settings";
export default function WatchMode() {
  const router = useRouter();
  const { params } = useParams();
  const media_type = String(params?.[0]);
  const id = Number(params?.[1]);
  const season = Number(params?.[2]) || 1;
  const episode = Number(params?.[3]) || 1;

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
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [sandboxEnabled, setSandboxEnabled] = useState(true);
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

        <div className="absolute top-0 left-0 p-6">
          <ArrowLeft
            onClick={() => handleCloseDrawer(false)}
            className="cursor-pointer"
            size={30}
            strokeWidth={1}
          />
        </div>
        <PlayerSettings
          id={id}
          season={season}
          episode={episode}
          media_type={media_type}
          selectedServer={selectedServer}
          setSelectedServer={setSelectedServer}
        />

        {selectedServer && (
          <iframe
            key={`${selectedServer}-${sandboxEnabled}`}
            src={selectedServer}
            // onLoad={() => setIsLoading(false)}
            title="Video Player"
            className="h-full w-full"
            allowFullScreen
            frameBorder={0}
            {...(sandboxEnabled && {
              sandbox: "allow-scripts allow-same-origin allow-forms",
            })}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
