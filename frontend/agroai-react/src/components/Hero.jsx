import { motion, AnimatePresence } from "framer-motion";
import PredictionCard from "./PredictionCard";
import { translations } from "../data/translations";

const Hero = ({ lang, onPredict, prefillSelection }) => {
  const t = translations[lang] || translations.en;

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-forest bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to right, rgba(12, 16, 12, 0.98) 0%, rgba(12, 16, 12, 0.90) 30%, rgba(12, 16, 12, 0.6) 55%, rgba(12, 16, 12, 0.1) 80%, transparent 100%), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2676&auto=format&fit=crop')" }}>
      <div className="absolute inset-y-0 left-0 w-2/5 bg-black/10 z-[1] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid xl:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", staggerChildren: 0.15 }}
          className="z-20"
        >
          <div className="inline-flex items-center gap-2 mb-6 text-white/70 text-sm font-semibold tracking-wider uppercase drop-shadow-md">
            <i className="ph-bold ph-shield-check text-brand"></i> {t.accuracy}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.h1 
              key={lang + "h1"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-5xl lg:text-7xl font-sans font-extrabold mb-6 text-white leading-tight tracking-tighter text-shadow-sm"
            >
              {t.heading1}<br />
              <span className="text-[#51E17B]">{t.heading2}</span>
            </motion.h1>
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            <motion.p 
              key={lang + "p"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg text-white/80 mb-10 font-light leading-relaxed max-w-lg text-shadow-sm"
            >
              {t.description}
            </motion.p>
          </AnimatePresence>
          
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={onPredict}
              className="bg-brand text-forest px-8 py-4 rounded-full font-extrabold text-lg transition-all shadow-[0_0_30px_rgba(132,204,22,0.4)] hover:shadow-[0_0_50px_rgba(190,242,100,0.6)] hover:scale-105 flex items-center gap-2"
            >
              <AnimatePresence mode="wait">
                <motion.span key={lang + "cta"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {t.cta}
                </motion.span>
              </AnimatePresence>
              &rarr;
            </button>
            <div className="flex items-center gap-4 text-xs text-white/70 font-medium text-shadow-sm">
              <span className="flex items-center gap-1">
                <i className="ph-fill ph-microphone text-brand-light"></i> {t.voiceEntry}
              </span>
              <span className="flex items-center gap-1">
                <i className="ph-fill ph-whatsapp-logo text-brand-light"></i> {t.whatsappAlerts}
              </span>
            </div>
          </div>
        </motion.div>

        <PredictionCard lang={lang} onPredict={onPredict} initialSelection={prefillSelection} />
      </div>
    </section>
  );
};

export default Hero;
