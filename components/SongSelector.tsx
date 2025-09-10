import React from 'react';
import type { Song } from '../types';

interface SongSelectorProps {
  songs: Song[];
  selectedSong: Song;
  onSelectSong: (song: Song) => void;
}

export const SongSelector: React.FC<SongSelectorProps> = ({ songs, selectedSong, onSelectSong }) => {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="inline-flex space-x-4">
        {songs.map((song) => (
          <li key={song.id} className="list-none">
            <button
              onClick={() => onSelectSong(song)}
              className={`w-64 text-left p-3 rounded-lg transition-all duration-200 border-2 ${
                selectedSong.id === song.id
                  ? 'bg-slate-700 border-amber-500 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/80 hover:border-slate-600'
              }`}
            >
              <p className="text-xs text-amber-400/80 font-semibold">{song.artist}</p>
              <p className="font-bold text-lg text-slate-100 mt-1 truncate" title={song.name}>{song.name}</p>
            </button>
          </li>
        ))}
      </div>
    </div>
  );
};
