import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface BassBoostControlProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export const BassBoostControl: React.FC<BassBoostControlProps> = ({ enabled, setEnabled }) => {
  return (
    <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-md p-1.5 rounded-xl border border-white/10 h-10 md:h-12 shadow-inner group">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setEnabled(!enabled)}
        className={`flex items-center justify-center p-2 rounded-lg transition-all ${
          enabled 
            ? 'bg-amber-600/90 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
            : 'bg-stone-800/50 text-stone-500 hover:text-stone-300'
        }`}
        title={enabled ? "Desativar Bass Boost" : "Ativar Bass Boost"}
      >
        <Activity className={`w-4 h-4 md:w-5 md:h-5 ${enabled ? 'animate-pulse' : ''}`} />
      </motion.button>
      
      <div className="flex flex-col pr-2">
          <span className="text-[8px] md:text-[9px] text-stone-500 font-bold uppercase tracking-widest leading-none">Sub-Grave</span>
          <span className={`text-[10px] md:text-[11px] font-black tracking-tighter transition-colors ${enabled ? 'text-amber-500' : 'text-stone-400'}`}>BOOST</span>
      </div>
    </div>
  );
};
