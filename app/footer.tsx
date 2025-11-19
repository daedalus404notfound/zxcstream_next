export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-12 gap-8">
        <div className="col-span-4">
          <div className="text-3xl font-light tracking-widest mb-4">KINØ</div>
          <div className="text-sm text-gray-600 font-light leading-relaxed">
            A curated cinematic experience for the discerning film enthusiast.
          </div>
        </div>
        <div className="col-span-2">
          <div className="text-xs text-gray-600 mb-4 tracking-wider">
            EXPLORE
          </div>
          <div className="space-y-2 text-sm font-light text-gray-400">
            <div className="hover:text-white transition cursor-pointer">
              Collections
            </div>
            <div className="hover:text-white transition cursor-pointer">
              Directors
            </div>
            <div className="hover:text-white transition cursor-pointer">
              Decades
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="text-xs text-gray-600 mb-4 tracking-wider">ABOUT</div>
          <div className="space-y-2 text-sm font-light text-gray-400">
            <div className="hover:text-white transition cursor-pointer">
              Philosophy
            </div>
            <div className="hover:text-white transition cursor-pointer">
              Curation
            </div>
            <div className="hover:text-white transition cursor-pointer">
              Contact
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <div className="text-xs text-gray-600 mb-4 tracking-wider">
            NEWSLETTER
          </div>
          <div className="text-sm font-light text-gray-400 mb-4">
            Weekly cinematic recommendations
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-white/5 border border-white/10 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-red-600/30"
            />
            <button className="px-4 py-2 bg-red-600 text-backto-background text-sm rounded-sm hover:bg-red-300 transition">
              →
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-8 text-center text-xs text-gray-700 font-light">
          © 2024 KINØ — A Premium Streaming Experience
        </div>
      </div>
    </footer>
  );
}
