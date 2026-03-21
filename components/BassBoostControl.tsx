import React from 'react';
import { motion } from 'framer-motion';

interface BassBoostControlProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export const BassBoostControl: React.FC<BassBoostControlProps> = ({ enabled, setEnabled }) => {
  return (
    <div className="flex items-center space-x-3 bg-stone-900/40 backdrop-blur-sm border border-white/5 px-4 py-2 rounded-full shadow-lg">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold leading-none mb-1">Sub-Grave</span>
        <span className="text-xs font-medium text-stone-300">Bass Boost</span>
      </div>
      
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${
          enabled 
            ? 'bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
            : 'bg-stone-800'
        }`}
      >
        <span className="sr-only">Ativar Bass Boost</span>
        <motion.span
          animate={{ x: enabled ? 24 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="inline-block h-4 w-4 transform rounded-full bg-white shadow-md"
        />
      </button>
      
      {enabled && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]"
        />
      )}
    </div>
  );
};
