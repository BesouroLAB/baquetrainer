
import React from 'react';
import type { Song } from '../types';

interface SongSelectorProps {
  songs: Song[];
  selectedSong: Song;
  onSelectSong: (song: Song) => void;
}

export const SongSelector: React.FC<SongSelectorProps> = ({ songs, selectedSong, onSelectSong }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 h-full">
      <h3 className="text-lg font-semibold mb-3 border-b border-slate-700 pb-2">Song Library</h3>
      <ul className="space-y-2">
        {songs.map((song) => (
          <li key={song.id}>
            <button
              onClick={() => onSelectSong(song)}
              className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${
                selectedSong.id === song.id
                  ? 'bg-amber-500 text-slate-900 font-bold shadow-md'
                  : 'bg-slate-700/50 hover:bg-slate-700'
              }`}
            >
              <p className="font-semibold">{song.name}</p>
              <p className="text-xs opacity-80">{song.artist}</p>
              <p className="text-xs opacity-80 mt-1">{song.bpm} BPM | {song.timeSignature.join('/')}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
