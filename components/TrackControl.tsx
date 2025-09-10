import React from 'react';
import type { TrackState } from '../types';

interface TrackControlProps {
  trackState: TrackState;
  setVolume: (trackId: number, volume: number) => void;
  toggleMute: (trackId: number) => void;
  toggleSolo: (trackId: number) => void;
  errorMessage?: string;
}

const ErrorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);


export const TrackControl: React.FC<TrackControlProps> = ({ trackState, setVolume, toggleMute, toggleSolo, errorMessage }) => {
  const { id, instrument, volume, isMuted, isSoloed } = trackState;
  const hasError = !!errorMessage;

  let errorTooltip = '';
  let errorText = 'ERROR';

  if (hasError && errorMessage) {
      if (errorMessage.includes('404')) {
          errorTooltip = 'File not found. Please add the audio file to the /audio folder and ensure the path is correct.';
          errorText = '404';
      } else {
          errorTooltip = `Failed to load audio. Check format or permissions. Error: ${errorMessage}`;
          errorText = 'FAIL';
      }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(id, parseFloat(e.target.value));
  };

  const MAX_VOLUME = 1.5;

  // Convert linear volume to dB for display
  const volumeDb = volume === 0 ? -Infinity : 20 * Math.log10(volume);
  const displayDb = isFinite(volumeDb) ? volumeDb.toFixed(1) : '-INF';

  // Calculate fader fill percentage based on the new max volume
  const faderFillPercentage = (volume / MAX_VOLUME) * 100;

  // Determine colors based on volume level for better feedback
  const faderFillColor = volume > 1.0 ? 'bg-red-500/90' : 'bg-amber-500/80';
  const readoutColor = hasError ? 'text-red-400' : (volume > 1.0 ? 'text-red-400' : 'text-slate-300');


  return (
    <div className={`flex flex-col items-center p-3 bg-slate-900/70 rounded-lg w-32 h-full border-2 ${
        hasError ? 'border-red-500/50' : 'border-slate-700/50'
    } shadow-lg`}>
      
      {/* Instrument Name */}
      <div className="text-center w-full bg-slate-800 p-2 rounded-t-md">
        <div className="flex items-center justify-center space-x-1">
            {hasError && (
                <div title={errorTooltip}>
                    <ErrorIcon className="w-4 h-4 text-red-500" />
                </div>
            )}
            <p className="text-sm font-bold truncate text-slate-200" title={instrument}>{instrument}</p>
        </div>
      </div>
      
      {/* Mute/Solo Buttons */}
      <div className="flex items-center justify-center space-x-2 my-3">
        <button
          onClick={() => toggleMute(id)}
          className={`w-10 h-8 rounded-md text-sm font-bold transition-all duration-200 ${
            isMuted ? 'bg-red-500 text-white shadow-red-500/50 shadow-[0_0_8px]' : 'bg-slate-700 hover:bg-slate-600'
          }`}
          disabled={hasError}
          aria-label={`Mute ${instrument}`}
        >
          M
        </button>
        <button
          onClick={() => toggleSolo(id)}
          className={`w-10 h-8 rounded-md text-sm font-bold transition-all duration-200 ${
            isSoloed ? 'bg-amber-500 text-slate-900 shadow-amber-400/60 shadow-[0_0_8px]' : 'bg-slate-700 hover:bg-slate-600'
          }`}
          disabled={hasError}
          aria-label={`Solo ${instrument}`}
        >
          S
        </button>
      </div>
      
      {/* Fader */}
      <div className="flex-grow flex flex-col items-center justify-center my-2 relative w-full">
        <div className="relative h-48 w-8 bg-slate-700 rounded-lg overflow-hidden border-b border-t border-slate-600/50">
           {/* 0 dB line marker */}
          <div 
            className="absolute left-1 right-1 h-px bg-slate-400/70 z-10"
            style={{ bottom: `${(1.0 / MAX_VOLUME) * 100}%` }}
            title="0 dB"
          ></div>
          {/* Fill level */}
          <div
            className={`absolute bottom-0 left-0 right-0 ${faderFillColor} transition-colors duration-100`}
            style={{ height: `${faderFillPercentage}%` }}
          />
          <input
            type="range"
            min="0"
            max={MAX_VOLUME}
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="appearance-none [writing-mode:vertical-lr] bg-transparent w-8 h-48 cursor-pointer accent-amber-400 disabled:opacity-50 transform rotate-180 absolute inset-0 z-20"
            disabled={hasError}
            aria-label={`${instrument} volume`}
          />
        </div>
      </div>
      
      {/* Volume Readout */}
      <div className={`text-center mt-2 w-full p-1 rounded-b-md`}>
        <p className={`text-lg font-mono font-bold transition-colors duration-150 ${readoutColor}`}>
            {hasError ? errorText : `${displayDb} dB`}
        </p>
      </div>
    </div>
  );
};