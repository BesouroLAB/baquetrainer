import React from 'react';
import type { Song } from '../types';
import { motion } from 'framer-motion';

interface SongSelectorProps {
  songs: Song[];
  selectedSong: Song;
  onSelectSong: (song: Song) => void;
}

export const SongSelector: React.FC<SongSelectorProps> = ({ songs, selectedSong, onSelectSong }) => {
  return (
    <ul className="flex flex-col space-y-1">
      {songs.map((song, index) => {
        const isSelected = selectedSong.id === song.id;
        return (
          <li key={song.id}>
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectSong(song)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-300 flex items-center space-x-3 border ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/30 shadow-[inset_2px_0_0_0_rgba(245,158,11,1)]'
                  : 'bg-transparent border-transparent hover:bg-white/5 text-stone-500 hover:text-stone-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                  isSelected ? 'bg-amber-500 text-stone-900' : 'bg-stone-800 text-stone-600'
              }`}>
                  {index + 1}
              </div>
              
              <div className="flex flex-col min-w-0">
                  <span className={`font-semibold truncate transition-colors ${isSelected ? 'text-stone-100' : ''}`}>
                    {song.name}
                  </span>
                  {isSelected && (
                      <span className="text-[10px] text-amber-500/80 uppercase tracking-wider font-medium">Tocando agora</span>
                  )}
              </div>
            </motion.button>
          </li>
        );
      })}
    </ul>
  );
};