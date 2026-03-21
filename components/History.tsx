import React from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Trash2, ExternalLink } from 'lucide-react';
import { RenderHistoryItem } from '../src/types';

interface HistoryProps {
  items: RenderHistoryItem[];
  onSelect: (item: RenderHistoryItem) => void;
  onClear: () => void;
}

export const History: React.FC<HistoryProps> = ({ items, onSelect, onClear }) => {
  if (items.length === 0) return null;

  return (
    <div className="p-6 border-t border-zinc-100 bg-zinc-50/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 text-zinc-900 font-semibold text-sm">
          <HistoryIcon className="w-4 h-4" />
          <span>Histórico Recente</span>
        </div>
        <button 
          onClick={onClear}
          className="text-[10px] text-zinc-400 hover:text-red-500 font-bold uppercase tracking-widest transition-colors"
        >
          Limpar Tudo
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.slice(0, 4).map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(item)}
            className="group relative aspect-square rounded-xl overflow-hidden border border-zinc-200 shadow-sm"
          >
            <img 
              src={item.renderedImage} 
              alt="Render" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-white" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
