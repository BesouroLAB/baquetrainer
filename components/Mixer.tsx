import React from 'react';
import { TrackControl } from './TrackControl';
import type { TrackState } from '../types';

interface MixerProps {
  trackStates: TrackState[];
  setVolume: (trackId: number, volume: number) => void;
  toggleMute: (trackId: number) => void;
  toggleSolo: (trackId: number) => void;
  trackLoadErrors: Map<number, string>;
}

export const Mixer: React.FC<MixerProps> = ({ trackStates, setVolume, toggleMute, toggleSolo, trackLoadErrors }) => {
  return (
    <div className="overflow-x-auto pb-4 h-full">
      <div className="inline-flex space-x-4 h-full">
        {trackStates.map((track) => (
          <TrackControl
            key={track.id}
            trackState={track}
            setVolume={setVolume}
            toggleMute={toggleMute}
            toggleSolo={toggleSolo}
            errorMessage={trackLoadErrors.get(track.id)}
          />
        ))}
      </div>
    </div>
  );
};