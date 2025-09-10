import React from 'react';

interface TransportControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onReturnToZero: () => void;
  hasErrors: boolean;
  currentTime: number;
  songDuration: number;
  onSeek: (time: number) => void;
}

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
  </svg>
);

const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm9 0a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

const StopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
  </svg>
);

const RewindIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z" clipRule="evenodd" />
    </svg>
);

const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) {
        return '00:00';
    }
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const TransportControls: React.FC<TransportControlsProps> = ({ isPlaying, onPlay, onPause, onStop, onReturnToZero, hasErrors, currentTime, songDuration, onSeek }) => {
  const playButtonTooltip = hasErrors 
    ? "Cannot play: One or more audio tracks failed to load." 
    : "Play";

  return (
    <div className="flex flex-col items-center space-y-2 w-full max-w-md">
      <div className="flex items-center space-x-4">
        <button onClick={onReturnToZero} className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors" title="Return to Start">
          <RewindIcon className="w-6 h-6" />
        </button>
        <button onClick={onStop} className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors" title="Stop">
          <StopIcon className="w-6 h-6" />
        </button>
        
        {isPlaying ? (
            <button 
                onClick={onPause}
                className="p-4 rounded-full bg-amber-500 text-slate-900 hover:bg-amber-400 transition-colors"
                aria-label="Pause"
                title="Pause"
            >
                <PauseIcon className="w-8 h-8" />
            </button>
        ) : (
            <div title={playButtonTooltip}>
                <button 
                    onClick={onPlay}
                    className="p-4 rounded-full bg-amber-500 text-slate-900 hover:bg-amber-400 transition-colors disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={hasErrors}
                    aria-label="Play"
                >
                    <PlayIcon className="w-8 h-8" />
                </button>
            </div>
        )}

      </div>
       <div className="w-full flex items-center gap-2 text-slate-400">
        <span className="font-mono text-xs">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={songDuration || 1}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Song progress"
          disabled={hasErrors || songDuration === 0}
        />
        <span className="font-mono text-xs">{formatTime(songDuration)}</span>
      </div>
    </div>
  );
};