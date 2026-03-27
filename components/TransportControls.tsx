import React from 'react';
import { motion } from 'framer-motion';

interface TransportControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onReturnToZero: () => void;
  hasErrors: boolean;
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

export const TransportControls: React.FC<TransportControlsProps> = ({ isPlaying, onPlay, onPause, onStop, onReturnToZero, hasErrors }) => {
  return (
    <div className="flex items-center space-x-3 md:space-x-8">
      <motion.button 
        whileHover={{ scale: 1.1, color: '#f59e0b' }}
        whileTap={{ scale: 0.9 }}
        onClick={onReturnToZero} 
        className="text-stone-600 hover:text-amber-500 transition-colors p-1" 
        title="Início"
      >
        <RewindIcon className="w-5 h-5 md:w-5 md:h-5" />
      </motion.button>
      
      {isPlaying ? (
          <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(245, 158, 11, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onPause}
              className="p-3 md:p-3.5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow-lg border border-amber-300/30"
              aria-label="Pause"
          >
              <PauseIcon className="w-6 h-6 md:w-7 md:h-7" />
          </motion.button>
      ) : (
          <motion.button 
              whileHover={!hasErrors ? { scale: 1.05, boxShadow: "0 0 15px rgba(245, 158, 11, 0.3)" } : {}}
              whileTap={!hasErrors ? { scale: 0.95 } : {}}
              onClick={onPlay}
              className={`p-3 md:p-3.5 rounded-full shadow-lg border border-amber-300/30 ${
                  hasErrors 
                  ? 'bg-stone-800 text-stone-600 cursor-not-allowed' 
                  : 'bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow-amber-900/40'
              }`}
              disabled={hasErrors}
              aria-label="Play"
          >
              <PlayIcon className="w-6 h-6 md:w-7 md:h-7 ml-0.5" />
          </motion.button>
      )}

      <motion.button 
        whileHover={{ scale: 1.1, color: '#f59e0b' }}
        whileTap={{ scale: 0.9 }}
        onClick={onStop} 
        className="text-stone-600 hover:text-amber-500 transition-colors p-1" 
        title="Parar"
      >
        <StopIcon className="w-5 h-5 md:w-5 md:h-5" />
      </motion.button>
    </div>
  );
};