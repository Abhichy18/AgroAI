import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BentoGrid from "./components/Features/BentoGrid";
import { translations } from "./data/translations";
import AIProcessingOverlay from "./components/AIProcessingOverlay";

const STREAMLIT_APP_URL = import.meta.env.VITE_STREAMLIT_APP_URL || "http://localhost:8502";
const FRONTEND_APP_URL = import.meta.env.VITE_FRONTEND_APP_URL || window.location.origin;

function normalizeOrigin(url) {
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return window.location.origin;
  }
}

function buildStreamlitRedirectUrl() {
  const target = new URL(STREAMLIT_APP_URL);
  target.searchParams.set("return_to", normalizeOrigin(FRONTEND_APP_URL));
  return target.toString();
}

function App() {
  const [lang, setLang] = useState("en");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMode, setProcessingMode] = useState("outbound");
  const [prefillSelection, setPrefillSelection] = useState(null);
  const [initialSearch] = useState(() => window.location.search);
  const t = translations[lang] || translations.en;

  const handlePredict = () => {
    if (isProcessing) return;
    localStorage.setItem("aiVisited", "true");
    setProcessingMode("outbound");
    setIsProcessing(true);
  };

  useEffect(() => {
    const params = new URLSearchParams(initialSearch);
    const returnFlag = params.get("return") === "1";
    const crop = params.get("crop");
    const state = params.get("state");

    if (crop || state) {
      setPrefillSelection({
        crop: crop || undefined,
        state: state || undefined,
      });
    }

    if (returnFlag || localStorage.getItem("aiVisited") === "true") {
      setProcessingMode("return");
      setIsProcessing(true);

      const resumeTimer = setTimeout(() => {
        setIsProcessing(false);
        setProcessingMode("outbound");
        localStorage.removeItem("aiVisited");
      }, 1800);

      // Clean URL immediately after we capture params so refreshes don't replay return mode.
      if (window.location.search) {
        window.history.replaceState({}, "", window.location.pathname);
      }

      return () => clearTimeout(resumeTimer);
    }

    if (window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }
    return undefined;
  }, [initialSearch]);

  useEffect(() => {
    if (isProcessing) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    document.body.style.overflow = "";
    return undefined;
  }, [isProcessing]);

  useEffect(() => {
    if (!isProcessing || processingMode !== "outbound") return;

    const timeout = setTimeout(() => {
      window.location.href = buildStreamlitRedirectUrl();
    }, 2800);

    return () => {
      clearTimeout(timeout);
    };
  }, [isProcessing, processingMode]);

  return (
    <div className="antialiased overflow-x-hidden selection:bg-brand selection:text-forest">
      <Navbar lang={lang} setLang={setLang} onPredict={handlePredict} />
      <Hero lang={lang} onPredict={handlePredict} prefillSelection={prefillSelection} />
      <BentoGrid lang={lang} onPredict={handlePredict} />

      {/* Krishi Mitra Chatbot Section */}
      <section className="relative py-32 bg-forest border-t border-white/5" id="demo">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537446-5ba58ac5dc7b?q=80&w=600&auto=format&fit=crop')] bg-cover opacity-10 blur-sm pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-sans font-black text-white mb-4 tracking-tight">
              {t.chatbotTitlePrefix} <span className="text-brand-light">{t.chatbotTitleHighlight}</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              {t.chatbotDesc}
            </p>
          </div>
          
          <div className="glass-panel border-white/20 rounded-[2rem] p-6 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand to-brand-light"></div>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-brand/20 flex flex-shrink-0 items-center justify-center border border-brand/40 shadow-[0_0_15px_rgba(132,204,22,0.2)]">
                <i className="ph-bold ph-robot text-2xl text-brand-light"></i>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 backdrop-blur-md">
                <p className="text-white/90 text-sm md:text-base leading-relaxed">
                  <span className="text-brand-light font-bold">{t.chatbotBotPrefix}</span> {t.chatbotBotMsg} <span className="text-white font-black">₹2,600/qtl</span>. {t.chatbotBotMsg2}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 mb-8 flex-row-reverse">
               <div className="w-12 h-12 rounded-full bg-white/10 flex flex-shrink-0 items-center justify-center border border-white/20">
                <i className="ph-bold ph-user text-2xl text-white/70"></i>
              </div>
              <div className="bg-brand/10 border border-brand/30 rounded-2xl rounded-tr-sm p-4 backdrop-blur-md">
                <p className="text-white text-sm md:text-base">
                  {t.chatbotUserMsg}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <input type="text" placeholder={t.chatbotInputPlaceholder} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/40 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all" />
              <button className="bg-brand text-forest hover:bg-brand-light transition-colors rounded-xl px-6 font-bold flex items-center justify-center shadow-[0_0_20px_rgba(132,204,22,0.3)]">
                <i className="ph-bold ph-paper-plane-right text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */ }
      <section className="py-32 bg-[#0a140c] relative overflow-hidden flex flex-col items-center justify-center border-t border-brand/10">
        <div className="absolute w-[800px] h-[800px] bg-brand/5 rounded-full blur-[100px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            {t.finalTitle1} <span className="text-gradient">{t.finalTitle2}</span>
          </h2>
          <p className="text-white/60 text-lg mb-10">{t.finalDesc}</p>
          <button onClick={handlePredict} className="signal-pulse inline-block bg-brand text-forest px-10 py-5 rounded-full font-extrabold text-xl transition-transform hover:scale-105">
            {t.cta} &rarr;
          </button>
        </div>
      </section>

      {/* Footer */ }
      <footer className="bg-forest py-10 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <i className="ph-fill ph-plant text-brand"></i>
          <span className="text-white font-extrabold tracking-tight">AgroAI</span>
        </div>
        <p className="text-white/40 text-sm">&copy; 2026 AgroAI. {t.footerText}</p>
      </footer>

      <AIProcessingOverlay isVisible={isProcessing} lang={lang} mode={processingMode} />
    </div>
  );
}

export default App;
