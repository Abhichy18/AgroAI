import { translations } from '../data/translations';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";


const cropData = {
  wheat: {
    punjab: {
      current: "2,450",
      predicted: "2,600",
      action: "SELL",
      trend: [2400, 2420, 2500, 2550, 2600],
      message: "Peak harvest demand window active."
    },
    haryana: {
      current: "2,400",
      predicted: "2,550",
      action: "HOLD",
      trend: [2480, 2460, 2400, 2450, 2550],
      message: "Prices stabilizing. Wait for better margins."
    }
  },
  rice: {
    up: {
      current: "2,100",
      predicted: "2,000",
      action: "WAIT",
      trend: [2200, 2180, 2150, 2050, 2000],
      message: "Market oversupplied. Avoid selling now."
    },
    punjab: {
      current: "2,150",
      predicted: "2,250",
      action: "SELL",
      trend: [2000, 2050, 2100, 2200, 2250],
      message: "Export demand surging. Great time to sell."
    }
  }
};

const actionStyles = {
  SELL: {
    color: "text-[#84CC16]",
    bg: "bg-[#84CC16]",
    bgSoft: "bg-[#84CC16]/20",
    border: "border-[#84CC16]/50",
    shadow: "shadow-[0_0_20px_rgba(132,204,22,0.6)]",
    hoverShadow: "group-hover:shadow-[0_0_25px_rgba(132,204,22,0.8)]",
    icon: "ph-check",
    hex: "#84CC16",
    trendIcon: "ph-trend-up"
  },
  HOLD: {
    color: "text-[#F59E0B]",
    bg: "bg-[#F59E0B]",
    bgSoft: "bg-[#F59E0B]/20",
    border: "border-[#F59E0B]/50",
    shadow: "shadow-[0_0_20px_rgba(245,158,11,0.6)]",
    hoverShadow: "group-hover:shadow-[0_0_25px_rgba(245,158,11,0.8)]",
    icon: "ph-hand-palm",
    hex: "#F59E0B",
    trendIcon: "ph-trend-up"
  },
  WAIT: {
    color: "text-[#EF4444]",
    bg: "bg-[#EF4444]",
    bgSoft: "bg-[#EF4444]/20",
    border: "border-[#EF4444]/50",
    shadow: "shadow-[0_0_20px_rgba(239,68,68,0.6)]",
    hoverShadow: "group-hover:shadow-[0_0_25px_rgba(239,68,68,0.8)]",
    icon: "ph-warning-circle",
    hex: "#EF4444",
    trendIcon: "ph-trend-down"
  }
};

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.15, delayChildren: 0.3 } },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const floatingAnimation = {
  y: [-5, 5],
  transition: { duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
};

const generatePath = (data) => {
  const min = Math.min(...data) - 40;
  const max = Math.max(...data) + 40;
  const range = Math.max(max - min, 1);
  const points = data.map((val, i) => {
    const x = i * 100;
    const y = 80 - ((val - min) / range) * 70;
    return { x, y };
  });
  
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p1 = points[i - 1];
    const p2 = points[i];
    d += ` C ${p1.x + 40},${p1.y} ${p2.x - 40},${p2.y} ${p2.x},${p2.y}`;
  }
  return { line: d, area: `${d} L400,100 L0,100 Z`, endY: points[points.length - 1].y };
};



const PredictionCard = ({ lang, onPredict, initialSelection }) => {
  const t = translations[lang] || translations.en;
  const [crop, setCrop] = useState("wheat");
  const [stateName, setStateName] = useState("punjab");
  const [isDemoMode, setIsDemoMode] = useState(true);

  useEffect(() => {
    if (!initialSelection) return;

    const incomingCrop = initialSelection.crop;
    const incomingState = initialSelection.state;

    const normalizedCrop = incomingCrop ? incomingCrop.toLowerCase() : undefined;
    const normalizedState = incomingState ? incomingState.toLowerCase() : undefined;

    if (normalizedCrop && cropData[normalizedCrop]) {
      setCrop(normalizedCrop);

      const stateOptions = Object.keys(cropData[normalizedCrop]);
      if (normalizedState && stateOptions.includes(normalizedState)) {
        setStateName(normalizedState);
      } else {
        setStateName(stateOptions[0]);
      }
      setIsDemoMode(false);
      return;
    }

    if (normalizedState) {
      const stateOptions = Object.keys(cropData[crop]);
      if (stateOptions.includes(normalizedState)) {
        setStateName(normalizedState);
        setIsDemoMode(false);
      }
    }
  }, [initialSelection]);

  // Auto demo cycle
  useEffect(() => {
    if (!isDemoMode) return;
    const sequence = [
      ["wheat", "punjab"],
      ["wheat", "haryana"],
      ["rice", "up"],
      ["rice", "punjab"]
    ];
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % sequence.length;
      setCrop(sequence[step][0]);
      setStateName(sequence[step][1]);
    }, 3500);
    return () => clearInterval(interval);
  }, [isDemoMode]);

  const handleCropChange = (e) => {
    setIsDemoMode(false);
    const newCrop = e.target.value;
    setCrop(newCrop);
    setStateName(Object.keys(cropData[newCrop])[0]);
  };

  const handleStateChange = (e) => {
    setIsDemoMode(false);
    setStateName(e.target.value);
  };

  const selected = cropData[crop]?.[stateName] || cropData.wheat.punjab;
  const style = actionStyles[selected.action];
  const paths = generatePath(selected.trend);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative">
      <motion.div
        animate={floatingAnimation}
        whileHover={{ scale: 1.02, y: -10, boxShadow: "0 25px 50px -12px rgba(132,204,22,0.25)", transition: { duration: 0.3 } }}
        className="glass-panel border-white/20 rounded-[2rem] p-8 bg-white/10 backdrop-blur-[40px] shadow-[0_20px_50px_-12px_rgba(132,204,22,0.15)] transition-colors duration-500"
      >
        <motion.div variants={childVariants} className="flex gap-4 mb-8">
          <div className="relative flex-1 bg-white/[0.08] hover:bg-white/[0.15] hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all border border-white/10 rounded-xl p-3 flex justify-between items-center text-sm text-white backdrop-blur-sm cursor-pointer group">
            <select value={crop} onChange={handleCropChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none">
              <option value="wheat" className="bg-[#051207] text-white py-2">{t.wheat}</option>
              <option value="rice" className="bg-[#051207] text-white py-2">{t.rice}</option>
            </select>
            <span className="font-medium capitalize">{crop === "wheat" ? t.wheat : t.rice}</span>
            <i className="ph-bold ph-caret-down text-white/50 group-hover:text-white transition-colors"></i>
          </div>
          
          <div className="relative flex-1 bg-white/[0.08] hover:bg-white/[0.15] hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all border border-white/10 rounded-xl p-3 flex justify-between items-center text-sm text-white backdrop-blur-sm cursor-pointer group">
            <select value={stateName} onChange={handleStateChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none">
              {Object.keys(cropData[crop]).map(s => (
                <option key={s} value={s} className="bg-[#051207] text-white py-2">{t[s] || s.toUpperCase()}</option>
              ))}
            </select>
            <span className="font-medium capitalize">{t[stateName] || stateName}</span>
            <i className="ph-bold ph-caret-down text-white/50 group-hover:text-white transition-colors"></i>
          </div>
        </motion.div>

        <motion.div variants={childVariants} className="grid grid-cols-2 gap-6 mb-8 pt-4 border-t border-white/10">
          <div>
            <div className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">
              <span className="en-text">{t.currentPrice}</span>
            </div>
            <motion.div key={selected.current} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-white text-3xl font-black">
              ₹{selected.current} <span className="text-sm text-white/50 font-medium">{t.perQtl}</span>
            </motion.div>
          </div>
          
          <button type="button" onClick={onPredict} className="block w-full text-left p-2 -m-2 rounded-xl transition-colors hover:bg-white/5 group">
            <div className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
              <span className="en-text">{t.predictedPrice}</span>
              <motion.i animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className={`ph-bold ${style.trendIcon} ${style.color} font-bold text-sm`}></motion.i>
            </div>
            <motion.div key={selected.predicted} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${style.color} text-3xl font-black transition-all`}>
              ₹{selected.predicted} <span className={`text-sm ${style.color} opacity-70 font-medium`}>{t.perQtl}</span>
            </motion.div>
          </button>
        </motion.div>

        <motion.div variants={childVariants} className="mb-8 w-full h-24 relative overflow-hidden">
          <svg viewBox="0 0 400 100" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <motion.stop animate={{ stopColor: style.hex }} transition={{ duration: 0.5 }} offset="0%" stopOpacity="0.5" />
                <motion.stop animate={{ stopColor: style.hex }} transition={{ duration: 0.5 }} offset="100%" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              key={crop + stateName + "-area"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              d={paths.area}
              fill="url(#areaGrad)"
            />
            <motion.path
              key={crop + stateName + "-line"}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d={paths.line}
              fill="none"
              stroke={style.hex}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <motion.circle
              key={crop + stateName + "-circle"}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              cx="400"
              cy={paths.endY}
              r="6"
              fill={style.hex}
              style={{ filter: `drop-shadow(0px 0px 8px ${style.hex})` }}
            />
          </svg>
          <div className="absolute bottom-0 left-0 w-full flex justify-between text-[10px] text-white/50 font-mono mt-2">
            <span>{t.today}</span>
            <span>{t.day3}</span>
            <span>{t.day7}</span>
          </div>
        </motion.div>

        <motion.button
          type="button"
          onClick={onPredict}
          variants={childVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`block w-full text-left ${style.bgSoft} border ${style.border} rounded-2xl p-5 flex items-center justify-between shadow-[inset_0_0_20px_rgba(0,0,0,0.15)] cursor-pointer relative overflow-hidden backdrop-blur-md transition-all duration-500 group`}
        >
          <motion.div animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className={`absolute top-0 left-0 w-1 h-full ${style.bg}`}></motion.div>
          
          <div>
            <motion.div key={selected.action + "-t"} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-white font-black text-xl mb-1 tracking-tight">
              {lang === "hi" ? (selected.action === "SELL" ? t.actionSell : selected.action === "WAIT" ? t.actionWait : t.actionHold) : selected.action + " " + t.nowText}
            </motion.div>
            <div className={`${style.color} text-sm font-medium transition-colors`}>
              {lang === "hi"
                ? selected.action === "SELL"
                  ? crop === "rice"
                    ? t.msgSellRice
                    : t.msgSell
                  : selected.action === "WAIT"
                    ? t.msgWait
                    : t.msgHold
                : selected.message}
            </div>
          </div>
          
          <div className={`w-12 h-12 rounded-full ${style.bg} flex items-center justify-center ${style.shadow} ${style.hoverShadow} transition-shadow duration-500`}>
            <i className={`ph-bold ${style.icon} text-2xl text-[#051207]`}></i>
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default PredictionCard;







