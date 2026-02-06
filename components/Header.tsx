import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onToggleMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMenu }) => {
  return (
    <header className="bg-transparent pt-4 px-4 md:px-6 pb-0 flex justify-between items-center z-50 flex-shrink-0">
      <div className="flex items-center space-x-3">
        {/* Mobile Menu Button */}
        <button 
          onClick={onToggleMenu}
          className="md:hidden p-2 -ml-2 text-stone-400 hover:text-amber-500 transition-colors"
          aria-label="Abrir menu de músicas"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Logo Icon */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-900" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.972 7.972 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
        </div>
        
        {/* Title Area with SankofaPlayer */}
        <div className="flex flex-col justify-center">
            <div className="flex items-baseline">
                <h1 className="text-xl font-bold text-stone-200 tracking-wide leading-none">
                <span className="text-amber-500">Baque</span>Treino
                </h1>
                
                {/* Desktop Tagline */}
                <div className="hidden md:flex items-center ml-3">
                    <span className="text-stone-700 mr-3 text-lg font-light">|</span>
                    <span className="text-stone-400 font-medium tracking-tight">SankofaPlayer</span>
                    {/* Sound Wave Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 ml-2 text-amber-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                </div>
            </div>
            
            {/* Mobile Tagline - Stacked underneath */}
            <div className="md:hidden flex items-center text-[10px] text-stone-500 -mt-0.5 font-mono tracking-wider">
                <span>SankofaPlayer</span>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 ml-1 text-amber-500/80">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                 </svg>
            </div>
        </div>
      </div>
      
      <div className="hidden md:block">
          <p className="text-xs font-mono text-stone-500 uppercase tracking-widest border border-stone-800 px-3 py-1 rounded-full bg-stone-900/50">
             Versão 2.2 • Baobá Digital
          </p>
      </div>
    </header>
  );
};