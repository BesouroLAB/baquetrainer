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
  }

  return (
    <div className="flex items-center space-x-2 md:space-x-3 w-full md:w-40">
      <SpeedIcon className="w-4 h-4 text-stone-500 flex-shrink-0" />
      <div className="relative flex-grow h-1 bg-stone-800 rounded-full">
         <div 
            className="absolute h-full bg-amber-600 rounded-full"
            style={{ width: `${((playbackRate - 0.5) / 1) * 100}%` }}
         ></div>
         <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={playbackRate}
            onChange={handleRateChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Playback Speed"
        />
        {/* Thumb */}
        <div 
            className="absolute top-1/2 -mt-1.5 h-3 w-3 bg-stone-300 rounded-full shadow pointer-events-none"
            style={{ left: `calc(${((playbackRate - 0.5) / 1) * 100}% - 6px)` }}
        ></div>
      </div>
      <motion.button 
        whileHover={{ scale: 1.05, backgroundColor: "rgba(87, 83, 78, 0.8)" }}
        whileTap={{ scale: 0.95 }}
        onClick={handleReset} 
        className="text-[10px] font-mono w-9 md:w-10 text-center text-stone-400 bg-stone-800/50 px-1 py-1 rounded border border-white/5 transition-colors flex-shrink-0"
        title="Resetar velocidade (1.0x)"
      >
        {playbackRate.toFixed(1)}x
      </motion.button>
    </div>
  );
};