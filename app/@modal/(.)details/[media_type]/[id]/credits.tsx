import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IMAGE_BASE_URL } from "@/constants/tmdb";
import { CastMemberTypes } from "@/types/movie-by-id";

export default function Credits({ credits }: { credits: CastMemberTypes[] }) {
  const limit = 6;
  const visible = credits.slice(0, limit);
  const remaining = credits.length - limit;
  return (
    <div className="space-y-4">
      <h1>Casts</h1>
      <div className="flex ">
        {visible?.map((meow) => (
          <div
            key={meow.id}
            className="*:data-[slot=avatar]:ring-background  space-y-2 *:data-[slot=avatar]:ring-3 items-center "
          >
            <Avatar key={meow.id} className="size-25">
              <AvatarImage
                className="object-cover"
                src={
                  meow.profile_path
                    ? `${IMAGE_BASE_URL}/w780${meow.profile_path}`
                    : "https://github.com/shadcn.png"
                }
                alt="@shadcn"
              />
              <AvatarFallback className="uppercase">
                {meow.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <p className="text-center text-sm text-muted-foreground">
              {meow.name.split(" ")[0]} as <br />
              <strong>{meow.character.split(" ")[0]}</strong>
            </p>
          </div>
        ))}

        {remaining > 0 && (
          <div className="*:data-[slot=avatar]:ring-background *:data-[slot=avatar]:ring-3 items-center">
            <Avatar className="size-25">
              <AvatarFallback className="uppercase">
                +{remaining}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
}
