import React from 'react';

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
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const volumePercentage = Math.round(volume * 100);

  return (
    <div className="flex items-center space-x-3 w-48">
      <SpeakerIcon className="w-6 h-6 text-slate-400" />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
        aria-label="Master Volume"
      />
      <span className="text-xs font-mono w-10 text-right text-slate-400">{volumePercentage}%</span>
    </div>
  );
};