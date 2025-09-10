
import React from 'react';

interface MetronomeProps {
  bpm: number;
  timeSignature: [number, number];
  currentBeat: number;
  playbackRate: number;
}

export const Metronome: React.FC<MetronomeProps> = ({ bpm, timeSignature, currentBeat, playbackRate }) => {
  const beats = Array.from({ length: timeSignature[0] }, (_, i) => i + 1);
  const effectiveBpm = Math.round(bpm * playbackRate);

  return (
    <div className="flex items-center space-x-4 h-[48px]">
      <div>
        <div className="text-2xl font-bold">{effectiveBpm}<span className="text-sm font-normal text-slate-400"> BPM</span></div>
        <div className="text-sm text-slate-400">{timeSignature.join(' / ')}</div>
      </div>
      <div className="flex space-x-2 items-center">
        {beats.map((beat) => (
          <div
            key={beat}
            className={`w-4 h-4 rounded-full transition-all duration-100 ${
              currentBeat === beat
                ? beat === 1
                  ? 'bg-amber-400 scale-125' // Downbeat
                  : 'bg-cyan-400 scale-110' // Other beats
                : 'bg-slate-600'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};