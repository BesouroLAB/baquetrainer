import React from 'react';
import { motion } from 'framer-motion';

interface PlayerLineProps {
  currentTime: number;
  songDuration: number;
  onSeek: (time: number) => void;
  loopRegion: { start: number | null, end: number | null };
  disabled?: boolean;
}

const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const PlayerLine: React.FC<PlayerLineProps> = ({ currentTime, songDuration, onSeek, loopRegion, disabled }) => {
  const progressPercent = songDuration > 0 ? (currentTime / songDuration) * 100 : 0;

  return (
    <div className="w-full relative h-[4px] bg-white/5 cursor-pointer group">
      {/* Background Track */}
      <div className="absolute inset-0 bg-stone-900/40" />
      
      {/* Progress Track */}
      <motion.div 
        className="absolute h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.5)] z-10"
        style={{ width: `${progressPercent}%` }}
      />

      {/* Loop Region Highlight */}
      {loopRegion.start !== null && loopRegion.end !== null && (
        <div 
          className="absolute h-full bg-amber-500/20 border-x border-amber-500/50 z-5"
          style={{ 
            left: `${(loopRegion.start / songDuration) * 100}%`,
            width: `${((loopRegion.end - loopRegion.start) / songDuration) * 100}%`
          }}
        />
      )}

      {/* Loop Marker A */}
      {loopRegion.start !== null && (
        <div 
          className="absolute top-0 bottom-0 w-1 bg-amber-400 z-15 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
          style={{ left: `${(loopRegion.start / songDuration) * 100}%` }}
        >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-black text-amber-500">A</div>
        </div>
      )}

      {/* Loop Marker B */}
      {loopRegion.end !== null && (
        <div 
          className="absolute top-0 bottom-0 w-1 bg-amber-400 z-15 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
          style={{ left: `${(loopRegion.end / songDuration) * 100}%` }}
        >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-black text-amber-500">B</div>
        </div>
      )}

      {/* Invisible Input for Seeking */}
      <input
        type="range"
        min="0"
        max={songDuration || 1}
        step="0.1"
        value={currentTime}
        onChange={(e) => onSeek(parseFloat(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        disabled={disabled}
      />
    </div>
  );
};
