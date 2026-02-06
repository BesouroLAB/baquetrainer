import React, { useRef, useState, useCallback } from 'react';

interface MasterControlProps {
  volume: number;
  setVolume: (volume: number) => void;
}

const SpeakerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.348 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.584 14.828a.75.75 0 001.06-1.06L17.16 11.28a.75.75 0 00-1.06 1.06l2.484 2.488zM19.645 15.889a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 00-1.06 1.06l1.06 1.06z" />
  </svg>
);

export const MasterControl: React.FC<MasterControlProps> = ({ volume, setVolume }) => {
  const faderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // --- Custom Drag Logic Horizontal ---
  const updateVolumeFromPointer = useCallback((clientX: number) => {
      if (!faderRef.current) return;
      
      const rect = faderRef.current.getBoundingClientRect();
      const width = rect.width;
      const left = rect.left;
      
      const relativeX = clientX - left;
      const percentage = Math.max(0, Math.min(1, relativeX / width));
      
      setVolume(percentage);
  }, [setVolume]);

  const handlePointerDown = (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      updateVolumeFromPointer(e.clientX);
      (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
      if (isDragging) {
          e.preventDefault();
          updateVolumeFromPointer(e.clientX);
      }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
      setIsDragging(false);
      (e.target as Element).releasePointerCapture(e.pointerId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      let newVol = volume;
      const step = 0.05;

      switch(e.key) {
          case 'ArrowRight':
          case 'ArrowUp':
              newVol = Math.min(1, volume + step);
              break;
          case 'ArrowLeft':
          case 'ArrowDown':
              newVol = Math.max(0, volume - step);
              break;
          default:
              return;
      }
      e.preventDefault();
      setVolume(newVol);
  };

  const volumePercentage = Math.round(volume * 100);

  return (
    <div className="flex items-center space-x-2 md:space-x-3 w-full md:w-40 p-2 rounded-lg bg-stone-900/50 border border-white/5 select-none">
      <SpeakerIcon className={`w-4 h-4 md:w-5 md:h-5 transition-colors flex-shrink-0 ${volume > 0.8 ? 'text-amber-500' : 'text-stone-500'}`} />
      
      <div 
        className="relative flex-grow h-6 flex items-center cursor-pointer touch-none outline-none focus:ring-1 focus:ring-amber-500/50 rounded"
        ref={faderRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={volume}
        aria-label="Master Volume"
      >
         {/* Visual Track */}
         <div className="absolute w-full h-1 bg-stone-700 rounded-full overflow-hidden pointer-events-none">
             <div 
                className="h-full bg-stone-400"
                style={{ width: `${volume * 100}%` }}
             ></div>
         </div>
         
         {/* Thumb */}
         <div 
            className="absolute h-3 w-3 bg-stone-200 rounded-full shadow-md pointer-events-none transform -translate-x-1/2"
            style={{ left: `${volume * 100}%` }}
         ></div>
      </div>
      
      <span className="text-[10px] font-mono font-bold w-6 md:w-8 text-right text-stone-400 flex-shrink-0">{volumePercentage}%</span>
    </div>
  );
};