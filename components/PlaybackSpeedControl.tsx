import React from 'react';

interface PlaybackSpeedControlProps {
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
}

const SpeedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
    </svg>
);


export const PlaybackSpeedControl: React.FC<PlaybackSpeedControlProps> = ({ playbackRate, setPlaybackRate }) => {
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaybackRate(parseFloat(e.target.value));
  };

  const handleReset = () => {
      setPlaybackRate(1.0);
  }

  return (
    <div className="flex items-center space-x-3 w-48">
      <SpeedIcon className="w-5 h-5 text-slate-400" />
      <input
        type="range"
        min="0.5"
        max="1.5"
        step="0.05"
        value={playbackRate}
        onChange={handleRateChange}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
        aria-label="Playback Speed"
      />
      <button 
        onClick={handleReset} 
        className="text-xs font-mono w-14 text-center text-slate-400 bg-slate-700/50 hover:bg-slate-700 px-2 py-1 rounded-md transition-colors"
        title="Reset to normal speed (1.0x)"
      >
        {playbackRate.toFixed(2)}x
      </button>
    </div>
  );
};
