import React from 'react';
import { motion } from 'framer-motion';
import { Repeat, X } from 'lucide-react';

interface LoopControlProps {
  currentTime: number;
  duration: number;
  loopRegion: { start: number | null, end: number | null };
  setLoopRegion: (region: { start: number | null, end: number | null }) => void;
}

export const LoopControl: React.FC<LoopControlProps> = ({
  currentTime,
  duration,
  loopRegion,
  setLoopRegion
}) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSetA = () => {
    setLoopRegion({ ...loopRegion, start: currentTime });
  };

  const handleSetB = () => {
    if (loopRegion.start === null) return;
    
    if (currentTime > loopRegion.start) {
        setLoopRegion({ ...loopRegion, end: currentTime });
    } else {
        // If user sets B before A, swap them to define the region
        setLoopRegion({ start: currentTime, end: loopRegion.start });
    }
  };

  const clearLoop = () => {
    setLoopRegion({ start: null, end: null });
  };

  const hasA = loopRegion.start !== null;
  const hasB = loopRegion.end !== null;
  const isActive = hasA && hasB;

  return (
    <div className="flex items-center space-x-1.5 bg-white/5 backdrop-blur-md p-1.5 rounded-xl border border-white/10 h-10 md:h-12 shadow-inner group">
      <div className="flex items-center space-x-1">
        <button
          onClick={handleSetA}
          className={`flex items-center justify-center min-w-[32px] md:min-w-[40px] h-full px-2 rounded-lg text-[10px] md:text-[11px] font-black transition-all ${
            hasA 
              ? 'bg-amber-500 text-stone-900' 
              : 'bg-stone-800/50 text-stone-500 hover:text-stone-300 hover:bg-stone-800'
          }`}
          title="Marcar início do Loop (A)"
        >
          {hasA ? formatTime(loopRegion.start!) : 'A'}
        </button>
        
        <button
          onClick={handleSetB}
          disabled={!hasA}
          className={`flex items-center justify-center min-w-[32px] md:min-w-[40px] h-full px-2 rounded-lg text-[10px] md:text-[11px] font-black transition-all ${
            hasB 
              ? 'bg-amber-500 text-stone-900 shadow-[0_0_10px_rgba(245,158,11,0.3)]' 
              : hasA 
                ? 'bg-stone-700 text-stone-200 hover:bg-stone-600' 
                : 'bg-stone-900/50 text-stone-700 cursor-not-allowed'
          }`}
          title="Marcar fim do Loop (B)"
        >
          {hasB ? formatTime(loopRegion.end!) : 'B'}
        </button>
      </div>

      {(hasA || hasB) && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={clearLoop}
          className="p-1.5 md:p-2 rounded-lg bg-stone-800/80 text-stone-400 hover:text-white hover:bg-red-900/40 transition-all border border-transparent hover:border-red-500/20"
          title="Limpar Loop"
        >
          <X className="w-3 h-3 md:w-3.5 md:h-3.5" />
        </motion.button>
      )}

      {isActive && (
        <div className="flex items-center pr-1">
          <Repeat className="w-3 h-3 text-amber-500/80 animate-spin-slow" />
        </div>
      )}
    </div>
  );
};
