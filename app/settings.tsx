"use client";
import { DarkModeToggle } from "@/components/ui/darkmode-toggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSpoilerStore } from "@/store/settings-store";
import { SettingsIcon } from "lucide-react";
import { useId } from "react";
export default function Settings() {
  const id = useId();
  const { activateSpoiler, setActivateSpoiler } = useSpoilerStore();
  return (
    <Dialog>
      <DialogTrigger>
        <SettingsIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            {/* This action cannot be undone. This will permanently delete your
            account and remove your data from our servers. */}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex justify-between items-center">
          <label className="text-sm" htmlFor={id}>
            Anti Spoiler
          </label>
          <div className="inline-flex items-center gap-2">
            <Switch
              checked={activateSpoiler}
              onCheckedChange={setActivateSpoiler}
              id={id}
              className="rounded-sm [&_span]:rounded"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
