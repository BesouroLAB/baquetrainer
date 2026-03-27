import React, { useState } from 'react';
import type { Song, RhythmNote } from '../types';
import { AlfaiaVisualizer } from './AlfaiaVisualizer';

interface AlfaiaTrainerProps {
  selectedSong: Song;
  currentTime: number;
  isPlaying: boolean;
  pattern: RhythmNote[] | null;
  audioContext: AudioContext | null;
}

const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
        <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
    </svg>
);


export const AlfaiaTrainer: React.FC<AlfaiaTrainerProps> = ({ selectedSong, currentTime, isPlaying, pattern, audioContext }) => {
  const [isVisualizerVisible, setIsVisualizerVisible] = useState(true);

  return (
    <div className="bg-slate-900/50 rounded-lg p-4 h-full flex flex-col border border-slate-700/50">
      <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-3">
        <h3 className="text-lg font-semibold text-amber-400/90 flex items-center">
          <EyeIcon className="w-5 h-5 mr-2" />
          Alfaia Practice Pattern
        </h3>
        {pattern && (
            <div className="flex items-center space-x-2">
                <span className="text-sm">Visualizer</span>
                <button
                    onClick={() => setIsVisualizerVisible(!isVisualizerVisible)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isVisualizerVisible ? 'bg-amber-500' : 'bg-slate-600'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isVisualizerVisible ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>
        )}
      </div>
      <div className="flex-grow flex flex-col items-center justify-center min-h-0">
        {pattern && isVisualizerVisible && (
            <AlfaiaVisualizer
                pattern={pattern}
                bpm={selectedSong.bpm}
                timeSignature={selectedSong.timeSignature}
                currentTime={currentTime}
             />
        )}
        {pattern && !isVisualizerVisible && (
            <div className="text-center text-slate-400 p-4">
                <p>Pattern loaded.</p>
                <p>Enable the visualizer to see the notes, then press play.</p>
            </div>
        )}
        {!pattern && (
             <div className="w-full h-full rounded-lg flex items-center justify-center p-4">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-amber-400/90 mb-2">No Pattern Available</h3>
                    <p className="text-slate-400">A pre-defined practice pattern for the Alfaia is not available for this song.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};