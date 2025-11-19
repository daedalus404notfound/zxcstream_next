import logo from "@/assets/zxczxc.svg";
import {
  Bookmark,
  Film,
  GalleryVertical,
  Home,
  MoreHorizontal,
  Search,
  Tv,
} from "lucide-react";
import Settings from "./settings";
import SearchModal from "./search-components/search-modal";
export default function SideBar() {
  return (
    <div className="z-10 fixed inset-y-0 left-0 py-10 pl-12 pr-6  flex flex-col justify-between text-foreground ">
      <div>
        <img className="size-9" src={logo.src} alt="" />
      </div>
      <div className="space-y-10 ">
        <Home className=" drop-shadow-[0_0px_1px_rgba(0,0,0,1)]" />
        <SearchModal />
        <Film className=" drop-shadow-[0_0px_1px_rgba(0,0,0,1)]" />
        <Tv className=" drop-shadow-[0_0px_1px_rgba(0,0,0,1)]" />
        <Bookmark className=" drop-shadow-[0_0px_1px_rgba(0,0,0,1)]" />
        <GalleryVertical className=" drop-shadow-[0_0px_1px_rgba(0,0,0,1)]" />
        <MoreHorizontal className=" drop-shadow-[0_0px_1px_rgba(0,0,0,1)]" />
      </div>

      <div>
        <Settings />
      </div>
    </div>
  );
}
