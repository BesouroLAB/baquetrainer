import React from 'react';
import { motion } from 'framer-motion';

interface PlaybackSpeedControlProps {
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
}

const SpeedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
    </svg>
);


export const PlaybackSpeedControl: React.FC<PlaybackSpeedControlProps> = ({ playbackRate, setPlaybackRate }) => {
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaybackRate(parseFloat(e.target.value));
  };

  const handleReset = () => {
      setPlaybackRate(1.0);
  };

  return (
    <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-md p-1.5 rounded-xl border border-white/10 h-10 md:h-12 shadow-inner group transition-all">
      <div className="flex flex-col pl-2">
          <span className="text-[8px] md:text-[9px] text-stone-500 font-bold uppercase tracking-widest leading-none">Tempo</span>
          <span className="text-[10px] md:text-[11px] text-stone-300 font-black tracking-tighter">{playbackRate.toFixed(2)}x</span>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="relative w-16 md:w-28 group/slider h-4 flex items-center">
            {/* Center mark */}
            <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-2 bg-stone-700 z-0" />
            
            {/* Track */}
            <div className="absolute inset-x-0 h-1 bg-stone-800 rounded-full overflow-hidden pointer-events-none">
                <div 
                    className="h-full bg-stone-400 group-hover/slider:bg-amber-500 transition-colors"
                    style={{ 
                        width: `${((playbackRate - 0.5) / 1) * 100}%`,
                    }}
                ></div>
            </div>
            
            <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.01"
                value={playbackRate}
                onChange={handleRateChange}
                className="w-full h-full opacity-0 cursor-pointer z-10"
                aria-label="Playback Speed"
            />
            
            {/* Thumb */}
            <div 
                className="absolute top-1/2 -mt-1.5 h-3 w-3 bg-stone-100 rounded-full shadow-lg pointer-events-none transition-transform group-active/slider:scale-125"
                style={{ left: `calc(${((playbackRate - 0.5) / 1) * 100}% - 6px)` }}
            ></div>
        </div>

        <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(245, 158, 11, 0.4)" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleReset} 
            className="flex items-center justify-center p-1.5 rounded-lg bg-stone-800/80 text-stone-400 hover:text-white transition-all border border-transparent hover:border-amber-500/20"
            title="Resetar tempo (1.0x)"
        >
            <SpeedIcon className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  );
};