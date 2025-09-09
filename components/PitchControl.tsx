import React from 'react';

interface PitchControlProps {
  pitch: number;
  setPitch: (pitch: number) => void;
}

const MusicNoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3V3z" />
    </svg>
);


export const PitchControl: React.FC<PitchControlProps> = ({ pitch, setPitch }) => {
  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPitch(parseInt(e.target.value, 10));
  };

  const handleReset = () => {
      setPitch(0);
  }

  const displayValue = pitch > 0 ? `+${pitch}` : `${pitch}`;

  return (
    <div className="flex items-center space-x-3 w-48">
      <MusicNoteIcon className="w-5 h-5 text-slate-400" />
      <input
        type="range"
        min="-12"
        max="12"
        step="1"
        value={pitch}
        onChange={handlePitchChange}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
        aria-label="Pitch Shift (Semitones)"
      />
      <button 
        onClick={handleReset} 
        className="text-xs font-mono w-14 text-center text-slate-400 bg-slate-700/50 hover:bg-slate-700 px-2 py-1 rounded-md transition-colors"
        title="Reset pitch (0 semitones)"
      >
        {displayValue} st
      </button>
    </div>
  );
};
