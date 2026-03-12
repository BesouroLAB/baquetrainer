import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (startTime: number, endTime: number) => void;
  duration: number;
  currentTime: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport, duration, currentTime }) => {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(duration);

  useEffect(() => {
    if (isOpen) {
      // Default to current time for start, and full duration for end
      setStartTime(Math.floor(currentTime));
      setEndTime(Math.floor(duration));
    }
  }, [isOpen, currentTime, duration]);

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
          
          <h2 className="text-xl font-bold text-stone-100 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar Mixagem
          </h2>
          
          <p className="text-stone-400 text-sm mb-6 leading-relaxed">
            Escolha o trecho da música que deseja baixar. O áudio exportado respeitará os volumes e as faixas em <span className="text-amber-500 font-bold">SOLO</span>/<span className="text-stone-500 font-bold">MUTE</span>.
          </p>

          <div className="space-y-6 mb-8 bg-stone-950/50 p-4 rounded-xl border border-white/5">
            {/* Start Time Slider */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-stone-300 font-medium">Início:</span>
                <span className="text-amber-500 font-mono bg-stone-900 px-2 py-0.5 rounded border border-white/10 shadow-inner">
                  {formatTime(startTime)}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={Math.max(0, endTime - 1)} 
                value={startTime} 
                onChange={(e) => setStartTime(Number(e.target.value))}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {/* End Time Slider */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-stone-300 font-medium">Fim:</span>
                <span className="text-amber-500 font-mono bg-stone-900 px-2 py-0.5 rounded border border-white/10 shadow-inner">
                  {formatTime(endTime)}
                </span>
              </div>
              <input 
                type="range" 
                min={Math.min(duration, startTime + 1)} 
                max={duration} 
                value={endTime} 
                onChange={(e) => setEndTime(Number(e.target.value))}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            
            <div className="flex justify-between text-xs text-stone-500 pt-2 border-t border-white/5">
              <span>Duração do trecho:</span>
              <span className="font-mono text-stone-300">{formatTime(endTime - startTime)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-full text-sm font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-colors border border-transparent hover:border-stone-700"
            >
              Cancelar
            </button>
            <button 
              onClick={() => onExport(startTime, endTime)}
              className="px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-900 transition-all shadow-lg shadow-amber-500/20 transform hover:scale-105 active:scale-95"
            >
              Exportar Trecho
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
