import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TrackActivity {
  id: number;
  name: string;
  start: number;
  end: number;
  color: string;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (startTime: number, endTime: number) => void;
  duration: number;
  currentTime: number;
  trackActivities: TrackActivity[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport, duration, currentTime, trackActivities }) => {
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

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setStartTime(Math.min(val, endTime - 1));
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setEndTime(Math.max(val, startTime + 1));
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

          <div className="space-y-6 mb-6 bg-stone-900/50 p-4 rounded-xl border border-white/5">
            {/* Start Time Slider */}
            <div className="relative">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-stone-400 font-medium">Início do corte:</span>
                <span className="text-amber-400 font-mono bg-stone-950 px-2 py-0.5 rounded border border-white/10 shadow-inner">
                  {formatTime(startTime)}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={duration || 100} 
                value={startTime} 
                onChange={handleStartChange}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {/* End Time Slider */}
            <div className="relative">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-stone-400 font-medium">Fim do corte:</span>
                <span className="text-amber-400 font-mono bg-stone-950 px-2 py-0.5 rounded border border-white/10 shadow-inner">
                  {formatTime(endTime)}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={duration || 100} 
                value={endTime} 
                onChange={handleEndChange}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-white/5">
              <span className="text-xs text-stone-500">Duração do arquivo final:</span>
              <span className="font-mono text-stone-300 font-medium bg-stone-800 px-2 py-1 rounded-md">{formatTime(endTime - startTime)}</span>
            </div>
          </div>

          {trackActivities.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                Mapa de Áudio
              </h3>
              
              <div className="relative bg-stone-950/80 border border-white/5 rounded-xl p-3 overflow-hidden">
                {/* Selection Overlay */}
                <div 
                  className="absolute top-0 bottom-0 bg-amber-500/10 border-x border-amber-500/50 z-10 pointer-events-none transition-all duration-150"
                  style={{
                    left: `${(startTime / duration) * 100}%`,
                    width: `${((endTime - startTime) / duration) * 100}%`
                  }}
                >
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9Im5vbmUiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI0NSwgMTU4LCAxMSwgMC4yKSIvPjwvc3ZnPg==')] opacity-50"></div>
                </div>

                <div className="space-y-2.5 max-h-32 overflow-y-auto custom-scrollbar relative z-20">
                  {trackActivities.map(track => (
                    <div key={track.id} className="flex items-center text-xs group">
                      <div className="w-28 shrink-0 flex items-center gap-2" title={track.name}>
                        <div 
                          className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_5px_rgba(0,0,0,0.5)]" 
                          style={{ backgroundColor: track.color }} 
                        />
                        <span className="truncate font-medium text-stone-300 group-hover:text-white transition-colors">
                          {track.name}
                        </span>
                      </div>
                      
                      <div className="flex-1 h-2 bg-stone-900 rounded-full relative mx-3 overflow-hidden shadow-inner">
                        {track.end > track.start ? (
                          <div 
                            className="absolute top-0 bottom-0 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                            style={{
                              backgroundColor: track.color,
                              left: `${(track.start / duration) * 100}%`,
                              width: `${((track.end - track.start) / duration) * 100}%`,
                              opacity: 0.85
                            }}
                          />
                        ) : null}
                      </div>
                      <span className="w-20 shrink-0 text-right text-stone-500 font-mono text-[10px]">
                        {track.end > track.start ? `${formatTime(track.start)} - ${formatTime(track.end)}` : 'Silêncio'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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
