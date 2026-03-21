import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Share2, Maximize2, Layers, Image as ImageIcon, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RenderPreviewProps {
  original: string | null;
  rendered: string | null;
  isRendering: boolean;
}

export const RenderPreview: React.FC<RenderPreviewProps> = ({ original, rendered, isRendering }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pos = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(pos, 0), 100));
  };

  if (!original && !isRendering) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center p-12 bg-zinc-50/50">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 border border-zinc-100">
          <ImageIcon className="w-10 h-10 text-zinc-300" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Pronto para Renderizar?</h2>
        <p className="text-zinc-500 max-w-md mx-auto">
          Faça o upload de um esboço ou foto do seu projeto no menu lateral para começar a transformar suas ideias em realidade.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-zinc-50/50 overflow-hidden relative">
      <div className="flex-grow p-6 md:p-12 flex items-center justify-center min-h-0">
        <div 
          ref={containerRef}
          className="relative w-full max-w-5xl aspect-video bg-zinc-200 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-zinc-200 group"
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
        >
          {/* Original Image (Background) */}
          {original && (
            <img 
              src={original} 
              alt="Original" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Rendered Image (Foreground with Clip) */}
          <AnimatePresence mode="wait">
            {rendered ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 w-full h-full"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <img 
                  src={rendered} 
                  alt="Rendered" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </motion.div>
            ) : isRendering && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-white font-bold text-lg tracking-tight">Processando Renderização...</p>
                  <p className="text-white/60 text-sm">A IA está aplicando materiais e iluminação.</p>
                </div>
              </div>
            )}
          </AnimatePresence>

          {/* Slider Handle */}
          {rendered && (
            <div 
              className="absolute inset-y-0 w-1 bg-white shadow-xl cursor-ew-resize z-20"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-emerald-500">
                <Layers className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                Original
              </div>
              <div className="absolute top-4 right-4 bg-emerald-600/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                Render AI
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <footer className="h-20 bg-white border-t border-zinc-200 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Projeto Atual</span>
            <span className="text-sm font-bold text-zinc-900">Residência Tropical - Render #01</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            disabled={!rendered}
            className="p-2 text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all disabled:opacity-30"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <button 
            disabled={!rendered}
            className="p-2 text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all disabled:opacity-30"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-zinc-200 mx-2" />
          <button 
            disabled={!rendered}
            className={cn(
              "flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
              rendered ? "bg-zinc-900 text-white hover:bg-black shadow-lg" : "bg-zinc-100 text-zinc-400"
            )}
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
