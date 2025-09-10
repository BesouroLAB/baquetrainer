import React from 'react';
import type { Song } from '../types';

interface SongSelectorProps {
  songs: Song[];
  selectedSong: Song;
  onSelectSong: (song: Song) => void;
}

export const SongSelector: React.FC<SongSelectorProps> = ({ songs, selectedSong, onSelectSong }) => {
  return (
    <div className="flex flex-col space-y-1">
      {songs.map((song, index) => (
        <li key={song.id} className="list-none">
          <button
            onClick={() => onSelectSong(song)}
            className={`w-full text-left p-2 rounded-md transition-all duration-200 flex items-center space-x-3 ${
              selectedSong.id === song.id
                ? 'bg-slate-700/80 text-white'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <span className={`text-sm font-mono ${selectedSong.id === song.id ? 'text-amber-400' : 'text-slate-500'}`}>{index + 1}</span>
            <span className="font-semibold truncate" title={song.name}>{song.name}</span>
          </button>
        </li>
      ))}
    </div>
  );
};