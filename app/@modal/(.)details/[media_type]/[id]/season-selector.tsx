import { useTvSeason } from "@/api/get-seasons";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { cn } from "@/lib/utils";
import { Season } from "@/types/movie-by-id";
import { Check } from "lucide-react";
import { useState } from "react";
export default function SeasonSelector({
  seasons,
  seasonSelect,
  setSeasonSelect,
}: {
  seasons: Season[];
  seasonSelect: {
    name: string;
    number: number;
  };
  setSeasonSelect: (value: { name: string; number: number }) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {seasonSelect.name}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 ">
        <Command>
          <CommandInput
            placeholder="Search season..."
            className="h-9"
            autoFocus={false}
          />
          <CommandList className="">
            <CommandEmpty>No episode found.</CommandEmpty>
            <CommandGroup>
              {seasons.map((season) => (
                <CommandItem
                  key={season.id}
                  value={season.name}
                  onSelect={() => {
                    setSeasonSelect({
                      name: season.name,
                      number: season.season_number,
                    });
                    setOpen(false);
                  }}
                >
                  <img
                    src={`${IMAGE_BASE_URL}/w780${season.poster_path}}`}
                    alt=""
                  />
                  {season.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      seasonSelect.number === season.season_number
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
