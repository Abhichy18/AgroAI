import { motion } from "framer-motion";
import { translations } from "../../data/translations";

const BentoGrid = ({ lang, onPredict }) => {
  const t = translations[lang] || translations.en;
  return (
    <section className="py-24 bg-forest-light relative">
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MDAlJyBoZWlnaHQ9JzQwMCUnPgoJPGZpbHRlciBpZD0nbm9pc2UnPgoJCTxmZVR1cmJ1bGVuY2UgdHlwZT0nZnJhY3RhbE5vaXNlJyBiYXNlRnJlcXVlbmN5PScwLjknIG51bU9jdGF2ZXM9JzMnIHN0aXRjaFRpbGVzPSdzdGl0Y2gnLz4KCTwvZmlsdGVyPgoJPHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsdGVyPSd1cmwoI25vaXNlKScvPgo8L3N2Zz4=')]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-end justify-between mb-16"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-sans font-bold mb-4 text-white">
              {t.bentoTitle1} <br />
              {t.bentoTitle2}
            </h2>
            <p className="text-white/60 text-lg leading-relaxed">
              {t.bentoDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={onPredict}
            className="mt-6 md:mt-0 text-brand font-bold flex items-center gap-2 hover:text-brand-light transition-colors group"
          >
            <span>{t.cta}</span>{" "}
            <i className="ph-bold ph-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0 }}
            className="glass-panel rounded-[2.5rem] overflow-hidden group hover:border-brand/40 transition-colors"
          >
            <div className="bg-forest/80 h-full p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
              <div className="absolute inset-0 opacity-[0.02] bg-[url('https://images.unsplash.com/photo-1590494165264-1ebe3602eb80?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center"></div>
              
              <div className="z-10 mb-12">
                <div className="w-10 h-10 rounded-full bg-brand/20 text-brand flex items-center justify-center mb-6">
                  <i className="ph-bold ph-chart-polar text-xl"></i>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{t.bentoCard1Title}</h3>
                <p className="text-white/50 text-sm">
                  {t.bentoCard1Desc}
                </p>
              </div>
              <div className="relative w-full h-32 border-t border-white/10 border-l border-white/10 z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                <svg viewBox="0 0 100 50" className="w-full h-full p-2">
                  <path d="M0,45 L20,40 L40,42 L60,25 L80,10 L100,5" fill="none" stroke="#84CC16" strokeWidth="2" strokeLinecap="round"></path>
                  <path d="M0,45 L20,42 L40,40 L60,35 L80,30 L100,28" fill="none" stroke="rgba(255,255,255,0.3)" strokeDasharray="2 2" strokeWidth="1.5"></path>
                  <circle cx="100" cy="5" r="1.5" fill="#BEF264"></circle>
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="glass-panel rounded-[2.5rem] overflow-hidden group hover:border-brand/40 transition-colors"
          >
             <div className="bg-forest/80 h-full p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2674&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-brand/5 to-transparent pointer-events-none"></div>
              
              <div className="z-10 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <i className="ph-bold ph-map-trifold text-xl"></i>
                  </div>
                  <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded-full font-semibold border border-blue-500/20">{t.bentoCard2Badge}</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{t.bentoCard2Title}</h3>
                <p className="text-white/50 text-sm">
                  {t.bentoCard2Desc}
                </p>
              </div>
              <div className="z-10 space-y-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center opacity-80 group-hover:opacity-100 transition-opacity">
                  <div>
                    <div className="text-white text-sm font-semibold">{t.bentoCard2Mandi}</div>
                    <div className="text-white/40 text-xs">{t.bentoCard2Drive}</div>
                  </div>
                  <div className="text-brand text-sm font-bold">+₹400 / Qtl</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-panel rounded-[2.5rem] overflow-hidden group hover:border-brand/40 transition-colors"
          >
            <div className="bg-forest/80 h-full p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
              <div className="absolute inset-0 opacity-[0.02] bg-[image:var(--bg-image-chat-pattern)] bg-cover mix-blend-luminosity"></div>
              
              <div className="z-10 mb-8">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mb-6">
                  <i className="ph-bold ph-calculator text-xl"></i>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{t.bentoCard3Title}</h3>
                <p className="text-white/50 text-sm">
                  {t.bentoCard3Desc}
                </p>
              </div>
              
              <div className="bg-black/40 p-5 rounded-2xl border border-white/10 opacity-70 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-white/60"><i className="ph-bold ph-scales"></i> {t.bentoYield}</span>
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-white/60"></div></div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-white/60"><i className="ph-bold ph-truck"></i> {t.bentoTransport}</span>
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="w-1/4 h-full bg-amber-500/80"></div></div>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                  <span className="text-xs text-white/50 uppercase font-bold">{t.bentoNetProfit}</span>
                  <span className="text-brand-light font-black tracking-tight">₹1.2 Lakhs</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;