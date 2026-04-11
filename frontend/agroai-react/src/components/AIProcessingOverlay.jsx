import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { translations } from "../data/translations";

const AIProcessingOverlay = ({ isVisible, lang = "en", mode = "outbound" }) => {
  const t = translations[lang] || translations.en;
  const steps = useMemo(
    () =>
      mode === "return"
        ? [t.aiReturnStep1, t.aiReturnStep2, t.aiReturnStep3]
        : [t.aiStep1, t.aiStep2, t.aiStep3, t.aiStep4, t.aiStep5],
    [mode, t],
  );

  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setActiveStep(0);
      setProgress(0);
      return;
    }

    const stepTimer = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, mode === "return" ? 600 : 560);

    const progressTimer = setInterval(() => {
      const maxProgress = mode === "return" ? 100 : 99;
      const increment = mode === "return" ? 4 : 2;
      setProgress((prev) => (prev < maxProgress ? prev + increment : maxProgress));
    }, mode === "return" ? 60 : 55);

    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    };
  }, [isVisible, mode, steps.length]);

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#04150A]/90 to-[#031106]/95 backdrop-blur-xl" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 left-[10%] h-64 w-64 rounded-full bg-brand/20 blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 right-[12%] h-72 w-72 rounded-full bg-brand-light/15 blur-3xl animate-pulse" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative z-10 w-full max-w-xl rounded-3xl border border-white/20 bg-white/10 p-8 text-white shadow-[0_0_70px_rgba(132,204,22,0.18)] backdrop-blur-2xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/20 text-brand-light shadow-[0_0_20px_rgba(132,204,22,0.4)]">
                <i className={`ph-bold ${mode === "return" ? "ph-arrow-clockwise" : "ph-brain"} text-xl`} />
              </div>
              <div>
                <div className="text-lg font-bold tracking-tight">
                  {mode === "return" ? t.aiReturnTitle : t.aiProcessingTitle}
                </div>
                <div className="text-sm text-white/65">
                  {mode === "return" ? t.aiReturnSubtitle : t.aiProcessingSubtitle}
                </div>
              </div>
            </div>

            <div className="mb-6 grid place-items-center">
              <div className="relative h-36 w-36">
                <svg className="h-36 w-36 -rotate-90" viewBox="0 0 140 140" aria-hidden="true">
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke="url(#aiProgressGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    style={{ transition: "stroke-dashoffset 0.2s ease" }}
                  />
                  <defs>
                    <linearGradient id="aiProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#BEF264" />
                      <stop offset="100%" stopColor="#84CC16" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className="text-3xl font-black tracking-tight">{progress}%</div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">{t.aiProgressLabel}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">{t.aiPipelineLabel}</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={steps[activeStep]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24 }}
                  className="text-base font-medium text-white/95"
                >
                  {steps[activeStep]}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center justify-between text-sm text-white/70">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-light signal-pulse" />
                {t.aiLiveSignal}
              </span>
              <span className="font-semibold text-brand-light">{t.aiConfidence}</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default AIProcessingOverlay;