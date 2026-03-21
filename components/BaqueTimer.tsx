import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BaqueTimerProps {
  isPlaying: boolean;
  bpm: number;
  currentTime: number;
}

export const BaqueTimer: React.FC<BaqueTimerProps> = ({ isPlaying, bpm, currentTime }) => {
  const [centiseconds, setCentiseconds] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isOffBeat, setIsOffBeat] = useState(false);
  
  // Calculate beat timing
  // 60 / BPM = seconds per beat
  const beatDuration = 60 / bpm;
  const halfBeatDuration = beatDuration / 2;

  useEffect(() => {
    if (!isPlaying) {
      // Sync with currentTime when paused/stopped
      const totalMs = currentTime * 1000;
      setMinutes(Math.floor(totalMs / 60000));
      setSeconds(Math.floor((totalMs % 60000) / 1000));
      setCentiseconds(Math.floor((totalMs % 1000) / 10));
      return;
    }

    // When playing, we use the currentTime from the audio engine for accuracy
    const totalMs = currentTime * 1000;
    setMinutes(Math.floor(totalMs / 60000));
    setSeconds(Math.floor((totalMs % 60000) / 1000));
    setCentiseconds(Math.floor((totalMs % 1000) / 10));

    // Calculate if we are in "contratempo" (off-beat)
    // We are off-beat if the time since the last beat is between 0.25 and 0.75 of the beat duration
    const timeInBeat = currentTime % beatDuration;
    const offBeatThreshold = halfBeatDuration;
    
    // Simple pulse logic for off-beat
    setIsOffBeat(timeInBeat > offBeatThreshold - 0.05 && timeInBeat < offBeatThreshold + 0.05);

  }, [currentTime, isPlaying, bpm, beatDuration, halfBeatDuration]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-center bg-stone-950/80 backdrop-blur-md border border-amber-500/20 rounded-2xl p-4 shadow-2xl">
      <div className="flex items-baseline space-x-1 font-mono text-4xl md:text-6xl font-black tracking-tighter text-stone-100">
        <span className="text-stone-400">{formatNumber(minutes)}</span>
        <span className="text-amber-500">:</span>
        <span>{formatNumber(seconds)}</span>
        <span className="text-amber-500">:</span>
        <span className="text-xs md:text-xl text-stone-500 w-8 md:w-12">{formatNumber(centiseconds)}</span>
      </div>
      
      <div className="mt-4 flex items-center space-x-4">
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-1">Alfaia Pulse</span>
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* Main Beat Circle */}
            <div className={`absolute inset-0 rounded-full border-2 transition-all duration-100 ${isPlaying && (currentTime % beatDuration < 0.1) ? 'border-amber-500 scale-110' : 'border-stone-800 scale-100'}`}></div>
            
            {/* Contratempo Pulse */}
            <AnimatePresence>
              {isOffBeat && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: 0.5 }}
                  exit={{ scale: 2, opacity: 0 }}
                  className="absolute inset-0 rounded-full bg-amber-500"
                />
              )}
            </AnimatePresence>
            
            <div className={`w-3 h-3 rounded-full ${isOffBeat ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-stone-700'}`}></div>
          </div>
          <span className={`text-[9px] mt-1 font-bold ${isOffBeat ? 'text-amber-500' : 'text-stone-600'}`}>CONTRATEMPO</span>
        </div>

        <div className="h-10 w-px bg-stone-800"></div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-1">BPM Sync</span>
          <div className="text-lg font-bold text-stone-300">{bpm}</div>
          <div className="flex space-x-1 mt-1">
            {[0, 1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-75 ${isPlaying && Math.floor((currentTime % (beatDuration * 4)) / beatDuration) === i ? 'bg-amber-500' : 'bg-stone-800'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
