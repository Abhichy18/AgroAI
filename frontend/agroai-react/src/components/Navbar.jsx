import { useState, useEffect } from "react";
import { translations } from "../data/translations";

const Navbar = ({ lang, setLang, onPredict }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const t = translations[lang] || translations.en;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-forest/95 shadow-lg" : "bg-forest/80"
      }`}
      id="navbar"
    >
      <div className="backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-brand text-2xl">
              <i className="ph-fill ph-plant"></i>
            </span>
            <span className="font-serif font-bold text-lg tracking-tight">
              AgroAI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand-light text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-light signal-pulse"></span>
              {t.liveDataStatus}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className="hidden md:flex items-center gap-1 text-xs font-semibold text-white/60 bg-white/5 rounded-lg p-1"
            >
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                  lang === "en" ? "bg-white/10 text-white" : "hover:text-white"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang("hi")}
                className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                  lang === "hi" ? "bg-white/10 text-white" : "hover:text-white"
                }`}
              >
                हिन्दी
              </button>
            </div>
            <button
              type="button"
              onClick={onPredict}
              className="bg-brand text-forest px-5 py-2 rounded-full font-bold text-sm transition-all shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:shadow-[0_0_30px_rgba(190,242,100,0.5)] hover:scale-105 flex items-center gap-2"
            >
              {t.cta} &rarr;
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
