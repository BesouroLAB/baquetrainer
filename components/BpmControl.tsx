import React from 'react';

interface BpmControlProps {
  bpm: number;
  setBpm: (bpm: number) => void;
  originalBpm: number;
}

const BpmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.5c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V5z" clipRule="evenodd" />
    </svg>
);

export const BpmControl: React.FC<BpmControlProps> = ({ bpm, setBpm, originalBpm }) => {
  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBpm(parseInt(e.target.value, 10));
  };

  const handleReset = () => {
      setBpm(originalBpm);
  }

  const minBpm = Math.max(40, Math.round(originalBpm * 0.5));
  const maxBpm = Math.min(240, Math.round(originalBpm * 1.5));

  return (
    <div className="flex items-center space-x-3 w-48">
      <BpmIcon className="w-5 h-5 text-slate-400" />
      <input
        type="range"
        min={minBpm}
        max={maxBpm}
        step="1"
        value={bpm}
        onChange={handleBpmChange}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
        aria-label="BPM"
      />
      <button
        onClick={handleReset}
        className="text-xs font-mono w-16 text-center text-slate-400 bg-slate-700/50 hover:bg-slate-700 px-2 py-1 rounded-md transition-colors"
        title={`Reset to original BPM (${originalBpm})`}
      >
        {`${bpm} BPM`}
      </button>
    </div>
  );
};