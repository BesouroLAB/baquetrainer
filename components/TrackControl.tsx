import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { TrackState } from '../types';
import { motion } from 'framer-motion';

interface TrackControlProps {
  trackState: TrackState;
  setVolume: (trackId: number, volume: number) => void;
  toggleMute: (trackId: number) => void;
  toggleSolo: (trackId: number) => void;
  errorMessage?: string;
}

const ErrorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);

export const TrackControl: React.FC<TrackControlProps> = ({ trackState, setVolume, toggleMute, toggleSolo, errorMessage }) => {
  const { id, instrument, volume, isMuted, isSoloed } = trackState;
  const hasError = !!errorMessage;
  const faderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const MAX_VOLUME = 1.2;
  const volumeDb = volume === 0 ? -Infinity : 20 * Math.log10(volume);
  const displayDb = isFinite(volumeDb) ? volumeDb.toFixed(1) : '-INF';
  
  // Calculate percentage for visual height (0 to 100)
  const faderFillPercentage = Math.min((volume / MAX_VOLUME) * 100, 100);

  // Determine colors based on volume level
  const getFaderColor = (vol: number) => {
      if (vol > 1.0) return 'bg-gradient-to-t from-orange-500 to-red-500';
      if (vol > 0.8) return 'bg-gradient-to-t from-amber-500 to-orange-500';
      return 'bg-gradient-to-t from-lime-600 to-amber-500';
  };

  // --- Custom Drag Logic ---
  const updateVolumeFromPointer = useCallback((clientY: number) => {
      if (!faderRef.current || hasError) return;
      
      const rect = faderRef.current.getBoundingClientRect();
      const height = rect.height;
      const bottom = rect.bottom;
      
      // Calculate distance from bottom of the track
      const relativeY = bottom - clientY;
      
      // Clamp between 0 and 1
      const percentage = Math.max(0, Math.min(1, relativeY / height));
      
      const newVolume = percentage * MAX_VOLUME;
      setVolume(id, newVolume);
  }, [id, setVolume, hasError]);

  const handlePointerDown = (e: React.PointerEvent) => {
      if (hasError) return;
      e.preventDefault();
      setIsDragging(true);
      updateVolumeFromPointer(e.clientY);
      
      // Capture pointer to track movement even outside the element
      (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
      if (isDragging) {
          e.preventDefault();
          updateVolumeFromPointer(e.clientY);
      }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
      setIsDragging(false);
      (e.target as Element).releasePointerCapture(e.pointerId);
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (hasError) return;
      let newVol = volume;
      const step = 0.05;

      switch(e.key) {
          case 'ArrowUp':
              newVol = Math.min(MAX_VOLUME, volume + step);
              break;
          case 'ArrowDown':
              newVol = Math.max(0, volume - step);
              break;
          case 'PageUp':
              newVol = Math.min(MAX_VOLUME, volume + (step * 4));
              break;
          case 'PageDown':
               newVol = Math.max(0, volume - (step * 4));
               break;
          case 'Home':
              newVol = MAX_VOLUME;
              break;
          case 'End':
              newVol = 0;
              break;
          default:
              return;
      }
      e.preventDefault();
      setVolume(id, newVol);
  };

  return (
    <motion.div 
        layout
        className={`flex flex-col items-center p-3 bg-[#131110] rounded-2xl w-28 h-full border border-white/5 shadow-xl relative overflow-hidden group select-none`}
    >
      {/* Background texture */}
      <div className="absolute inset-0 bg-stone-800/20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Instrument Name */}
      <div className="text-center w-full mb-3 relative z-10">
        <div className="flex items-center justify-center space-x-1 h-6">
            {hasError ? (
                <div title={errorMessage}>
                    <ErrorIcon className="w-4 h-4 text-red-500" />
                </div>
            ) : (
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
            )}
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-stone-400 truncate w-full" title={instrument}>
            {instrument}
        </p>
      </div>
      
      {/* Mute/Solo Buttons */}
      <div className="flex flex-col space-y-2 mb-4 w-full px-1 z-10">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleSolo(id)}
          className={`w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all duration-200 ${
            isSoloed 
                ? 'bg-amber-500 text-stone-900 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                : 'bg-stone-800/50 text-stone-500 border-stone-700 hover:bg-stone-700 hover:text-stone-300'
          }`}
          disabled={hasError}
        >
          Solo
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleMute(id)}
          className={`w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all duration-200 ${
            isMuted 
                ? 'bg-red-500/90 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                : 'bg-stone-800/50 text-stone-500 border-stone-700 hover:bg-stone-700 hover:text-stone-300'
          }`}
          disabled={hasError}
        >
          Mute
        </motion.button>
      </div>
      
      {/* Fader Track Container */}
      <div className="flex-grow relative w-full flex justify-center z-10 py-2">
         {/* The Interactive Area (Wider than visual track for usability) */}
        <div 
            className={`relative h-full w-12 flex justify-center cursor-pointer touch-none outline-none focus:ring-1 focus:ring-amber-500/50 rounded`}
            ref={faderRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp} // Safety fallback
            onKeyDown={handleKeyDown}
            tabIndex={hasError ? -1 : 0}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={MAX_VOLUME}
            aria-valuenow={volume}
            aria-label={`${instrument} Volume`}
        >
            {/* The Visual Groove (Background) */}
            <div className="absolute h-full w-2 bg-black/60 rounded-full shadow-[inset_0_0_4px_rgba(0,0,0,0.8)] border border-white/5 overflow-hidden pointer-events-none">
                {/* The Filled Level */}
                <motion.div 
                    className={`absolute bottom-0 left-0 right-0 w-full ${getFaderColor(volume)} opacity-80`}
                    style={{ height: `${faderFillPercentage}%` }}
                    transition={{ type: 'tween', ease: 'linear', duration: 0.05 }}
                />
            </div>

            {/* 0dB Marker */}
            <div className="absolute right-0 left-0 top-[16.6%] border-t border-white/10 opacity-50 text-[9px] text-stone-600 text-right pr-4 pointer-events-none">
                0
            </div>
            
            {/* The Visual Thumb Handle (Follows value) */}
            <div 
                className="absolute left-1/2 -ml-4 w-8 h-5 bg-gradient-to-b from-stone-600 to-stone-800 rounded shadow-lg border-t border-white/20 border-b border-black/50 pointer-events-none z-20 flex items-center justify-center transform translate-y-1/2"
                style={{ bottom: `${faderFillPercentage}%` }}
            >
                <div className="w-6 h-[1px] bg-stone-900 shadow-[0_1px_0_rgba(255,255,255,0.1)]"></div>
            </div>
        </div>
      </div>
      
      {/* Volume Readout */}
      <div className="mt-1 w-full text-center">
         <div className="bg-black/40 rounded px-1 py-0.5 border border-white/5 shadow-inner">
            <p className={`text-[10px] font-mono font-bold ${isMuted ? 'text-stone-600' : (volume > 1.0 ? 'text-red-400' : 'text-amber-500')}`}>
                {hasError ? 'ERR' : `${displayDb}`}
            </p>
         </div>
      </div>
    </motion.div>
  );
};