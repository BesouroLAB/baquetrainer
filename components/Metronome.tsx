
import React from 'react';

interface MetronomeProps {
  bpm: number;
  timeSignature: [number, number];
  currentBeat: number;
  playbackRate: number;
  isAnalyzingBpm?: boolean;
}

export const Metronome: React.FC<MetronomeProps> = ({ bpm, timeSignature, currentBeat, playbackRate, isAnalyzingBpm }) => {
  const beats = Array.from({ length: timeSignature[0] }, (_, i) => i + 1);
  const effectiveBpm = Math.round(bpm * playbackRate);

  if (isAnalyzingBpm) {
    return (
        <div className="flex items-center space-x-4 h-[48px]">
            <div>
                <div className="text-2xl font-bold flex items-center text-slate-400">
                    <svg className="animate-spin h-6 w-6 mr-2 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>...</span>
                </div>
                <div className="text-sm text-slate-400">Analyzing BPM</div>
            </div>
        </div>
    );
  }


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