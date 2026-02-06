import React from 'react';
import { motion } from 'framer-motion';

interface TransportControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onReturnToZero: () => void;
  hasErrors: boolean;
  currentTime: number;
  songDuration: number;
  onSeek: (time: number) => void;
}

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm9 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

const StopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
  </svg>
);

const RewindIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z" clipRule="evenodd" />
    </svg>
);

const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) {
        return '00:00';
    }
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const TransportControls: React.FC<TransportControlsProps> = ({ isPlaying, onPlay, onPause, onStop, onReturnToZero, hasErrors, currentTime, songDuration, onSeek }) => {
  const progressPercent = songDuration > 0 ? (currentTime / songDuration) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-1 md:space-y-2 w-full max-w-[95%] md:max-w-lg">
      <div className="flex items-center space-x-6">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onReturnToZero} 
          className="text-stone-500 hover:text-stone-300 transition-colors p-2" 
          title="Início"
        >
          <RewindIcon className="w-5 h-5" />
        </motion.button>
        
        {isPlaying ? (
            <motion.button 
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onPause}
                className="p-3 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-900 shadow-lg shadow-amber-900/40 border border-amber-300/20"
                aria-label="Pause"
            >
                <PauseIcon className="w-8 h-8" />
            </motion.button>
        ) : (
            <motion.button 
                whileHover={!hasErrors ? { scale: 1.1, boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)" } : {}}
                whileTap={!hasErrors ? { scale: 0.95 } : {}}
                onClick={onPlay}
                className={`p-3 rounded-full shadow-lg border border-amber-300/20 ${
                    hasErrors 
                    ? 'bg-stone-800 text-stone-600 cursor-not-allowed' 
                    : 'bg-gradient-to-br from-amber-400 to-amber-600 text-stone-900 shadow-amber-900/40'
                }`}
                disabled={hasErrors}
                aria-label="Play"
            >
                <PlayIcon className="w-8 h-8 ml-0.5" />
            </motion.button>
        )}

        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onStop} 
          className="text-stone-500 hover:text-stone-300 transition-colors p-2" 
          title="Parar"
        >
          <StopIcon className="w-5 h-5" />
        </motion.button>
      </div>

       <div className="w-full flex items-center gap-2 md:gap-3">
        <span className="font-mono text-[10px] text-stone-500 w-8 text-right">{formatTime(currentTime)}</span>
        
        <div className="relative flex-grow h-6 flex items-center group">
            <div className="absolute w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-amber-500/80"
                    style={{ width: `${progressPercent}%` }}
                    layoutId="progressbar"
                />
            </div>
             <input
                type="range"
                min="0"
                max={songDuration || 1}
                step="0.1"
                value={currentTime}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="w-full h-6 opacity-0 cursor-pointer absolute z-10"
                disabled={hasErrors || songDuration === 0}
            />
            {/* Visual thumb for hover effect */}
            <div 
                className="absolute h-3 w-3 bg-stone-200 rounded-full shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progressPercent}% - 6px)` }}
            ></div>
        </div>
        
        <span className="font-mono text-[10px] text-stone-500 w-8">{formatTime(songDuration)}</span>
      </div>
    </div>
  );
};