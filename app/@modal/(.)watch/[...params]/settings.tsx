"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { HardDrive, Server, Settings } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { serverLists, ServerTypes } from "./servers";
export default function PlayerSettings({
  id,
  season,
  episode,
  media_type,
  selectedServer,
  setSelectedServer,
}: {
  id: number;
  season: number;
  episode: number;
  media_type: string;
  selectedServer: string | null;
  setSelectedServer: (selectedServer: string) => void;
}) {
  const servers = serverLists(id, media_type, season, episode);
  useEffect(() => {
    if (!selectedServer) {
      const def = servers.find((s) => s.default);
      if (def) setSelectedServer(def.link);
    }
  }, [servers, selectedServer, setSelectedServer]);
  return (
    <Drawer direction="right">
      <DrawerTrigger className="absolute top-0 right-0 p-6">
        <Settings size={30} strokeWidth={1} />
      </DrawerTrigger>
      <DrawerContent className="max-w-md! p-3">
        <div className="bg-card flex-1 rounded-md   ">
          <DrawerHeader>
            <DrawerTitle>Choose Server</DrawerTitle>
            <DrawerDescription>
              Select fastest server in your area.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 flex flex-col divide-y">
            {servers.map((server) => (
              <ServerUi
                key={server.value}
                server={server}
                selected={selectedServer === server.link}
                onSelect={() => setSelectedServer(server.link)}
              />
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function ServerUi({
  server,
  selected,
  onSelect,
}: {
  selected: boolean;
  server: ServerTypes;
  onSelect: () => void;
}) {
  const id = useId();
  return (
    <div className="relative flex w-full items-start gap-2  py-6 outline-none  bg-linear-to-br from-card to-card/60">
      <Switch
        id={id}
        checked={selected}
        onCheckedChange={onSelect}
        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
        aria-describedby={`${id}-description`}
      />

      <div className="grid grow gap-2">
        <HardDrive />
        <label htmlFor={id} className="has-data-[state=checked]:text-red-500">
          {server.name}{" "}
          <span className="text-xs leading-[inherit] font-normal text-muted-foreground">
            {server.sandboxSupport ? "(No Ads)" : "(w/ Ads)"}
          </span>
        </label>
        <p id={`${id}-description`} className="text-xs text-muted-foreground">
          {server.description}
        </p>
      </div>
    </div>
  );
}
