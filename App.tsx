import React, { useState, useCallback, useEffect } from 'react';
import { SongSelector } from './components/SongSelector';
import { Mixer } from './components/Mixer';
import { TransportControls } from './components/TransportControls';
import { Alert } from './components/Alert';
import { Header } from './components/Header';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { SONGS, SHOW_SONGS } from './constants';
import type { Song } from './types';
import { MasterControl } from './components/MasterControl';
import { PlaybackSpeedControl } from './components/PlaybackSpeedControl';
import { motion, AnimatePresence } from 'framer-motion';
import { exportMix } from './utils/audioExport';
import { ExportModal } from './components/ExportModal';

const App: React.FC = () => {
  const [selectedSong, setSelectedSong] = useState<Song>(SHOW_SONGS[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'repertorio' | 'ensaio'>('ensaio');
  const [isExporting, setIsExporting] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const {
    isLoading,
    isPlaying,
    play,
    pause,
    stop,
    returnToZero,
    trackStates,
    setVolume,
    toggleMute,
    toggleSolo,
    resetMixer,
    trackLoadErrors,
    masterVolume,
    setMasterVolume,
    currentTime,
    songDuration,
    seek,
    playbackRate,
    setPlaybackRate,
    getAudioBuffer,
  } = useAudioPlayer(selectedSong);

  const handleSelectSong = useCallback((song: Song) => {
    stop();
    setSelectedSong(song);
    setPlaybackRate(1.0);
    setIsMobileMenuOpen(false); // Close menu on selection (mobile)
  }, [stop, setPlaybackRate]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const hasErrors = trackLoadErrors.size > 0;

  const currentSongsList = sidebarTab === 'repertorio' ? SONGS : SHOW_SONGS;

  const handleExportClick = () => {
    setIsExportModalOpen(true);
  };

  const confirmExport = async (startTime: number, endTime: number) => {
    setIsExportModalOpen(false);
    try {
      setIsExporting(true);
      await exportMix(selectedSong.name, trackStates, getAudioBuffer, masterVolume, startTime, endTime);
    } catch (error: any) {
      alert(error.message || "Erro ao exportar o áudio.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900 via-[#0c0a09] to-black text-stone-300 overflow-hidden relative">
      <Header 
        onToggleMenu={() => setIsMobileMenuOpen(true)} 
      />
      
        <div className="flex-grow grid grid-cols-1 md:grid-cols-[320px_1fr] gap-2 md:gap-4 p-2 md:p-4 min-h-0 relative">
            
            {/* Mobile Sidebar Overlay (Drawer) */}
            <AnimatePresence>
            {isMobileMenuOpen && (
                <>
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] md:hidden"
                />
                <motion.aside
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-[#131110] border-r border-white/10 z-[60] flex flex-col p-4 shadow-2xl md:hidden"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-amber-500">Músicas</h2>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-stone-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        </button>
                    </div>
                    
                    <div className="flex-shrink-0 relative mb-4">
                        <img 
                        src="https://raw.githubusercontent.com/BesouroLAB/albumsankofa/master/capa.png" 
                        alt="Capa"
                        className="w-full rounded-lg shadow-lg opacity-80"
                        />
                    </div>

                    <div className="flex bg-stone-900/50 p-1 rounded-lg border border-stone-800 mb-4">
                        <button
                            onClick={() => setSidebarTab('ensaio')}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                                sidebarTab === 'ensaio' 
                                ? 'bg-amber-500 text-stone-900 shadow-lg' 
                                : 'text-stone-400 hover:text-stone-200'
                            }`}
                        >
                            Ensaio Show
                        </button>
                        <button
                            onClick={() => setSidebarTab('repertorio')}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                                sidebarTab === 'repertorio' 
                                ? 'bg-amber-500 text-stone-900 shadow-lg' 
                                : 'text-stone-400 hover:text-stone-200'
                            }`}
                        >
                            Álbum
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar overscroll-contain">
                        <SongSelector songs={currentSongsList} selectedSong={selectedSong} onSelectSong={handleSelectSong} />
                    </div>
                </motion.aside>
                </>
            )}
            </AnimatePresence>

            {/* Desktop Sidebar (Static) */}
            <aside className="hidden md:flex bg-stone-900/40 backdrop-blur-xl border border-white/5 rounded-2xl flex-col p-5 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-[0.03] pointer-events-none"></div>

            <div className="flex-shrink-0 relative z-10">
                <div className="relative rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover:ring-amber-500/30 transition-all duration-500">
                <img 
                    src="https://raw.githubusercontent.com/BesouroLAB/albumsankofa/master/capa.png" 
                    alt="Capa do álbum Malungos do Interior"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-0 left-0 p-4">
                    <h1 className="text-xl font-bold text-white leading-tight">Malungos do Interior</h1>
                    <p className="text-sm text-amber-400 font-medium">Nação Sankofa Baobá</p>
                </div>
                </div>
            </div>
            
            <div className="mt-6 flex-grow overflow-y-auto relative z-10 space-y-2 pr-1 custom-scrollbar flex flex-col">
                <div className="flex bg-stone-900/50 p-1 rounded-lg border border-stone-800 mb-2 flex-shrink-0">
                    <button
                        onClick={() => setSidebarTab('ensaio')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                            sidebarTab === 'ensaio' 
                            ? 'bg-amber-500 text-stone-900 shadow-lg' 
                            : 'text-stone-400 hover:text-stone-200'
                        }`}
                    >
                        Ensaio Show
                    </button>
                    <button
                        onClick={() => setSidebarTab('repertorio')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                            sidebarTab === 'repertorio' 
                            ? 'bg-amber-500 text-stone-900 shadow-lg' 
                            : 'text-stone-400 hover:text-stone-200'
                        }`}
                    >
                        Álbum
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    <SongSelector songs={currentSongsList} selectedSong={selectedSong} onSelectSong={handleSelectSong} />
                </div>
            </div>
            </aside>

            {/* Main Content - Mixer Area */}
            <main className="bg-stone-900/40 backdrop-blur-xl border border-white/5 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none"></div>

            <section className="flex-grow flex flex-col p-3 md:p-6 min-h-0 relative z-10">
                <div className="flex justify-between items-end border-b border-white/5 pb-3 md:pb-4 mb-3 md:mb-4 flex-shrink-0">
                    <div className="overflow-hidden">
                    <motion.h2 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={selectedSong.id}
                        className="text-lg md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-stone-100 to-stone-400 truncate"
                    >
                        {selectedSong.name}
                    </motion.h2>
                    <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[9px] md:text-xs bg-stone-800/50 text-stone-400 px-1.5 py-0.5 md:px-2 rounded-full border border-white/5">
                        {selectedSong.bpm} BPM
                        </span>
                        <span className="text-[9px] md:text-xs bg-stone-800/50 text-stone-400 px-1.5 py-0.5 md:px-2 rounded-full border border-white/5">
                        {selectedSong.timeSignature.join('/')}
                        </span>
                    </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetMixer}
                        className="flex items-center space-x-1 md:space-x-2 px-2 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm font-medium bg-stone-800/50 hover:bg-stone-700 text-stone-300 rounded-full border border-white/5 transition-colors shadow-lg shadow-black/20"
                        title="Resetar mesa"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden md:inline">Resetar Mix</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleExportClick}
                        disabled={isExporting || isLoading}
                        className={`flex items-center space-x-1 md:space-x-2 px-2 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm font-medium rounded-full border transition-colors shadow-lg shadow-black/20 ml-2 ${
                            isExporting || isLoading 
                            ? 'bg-stone-800 text-stone-500 border-stone-700 cursor-not-allowed' 
                            : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/30'
                        }`}
                        title="Baixar mixagem atual (respeita SOLO e MUTE)"
                    >
                        {isExporting ? (
                            <svg className="animate-spin h-3 w-3 md:h-4 md:w-4 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        )}
                        <span className="hidden md:inline">{isExporting ? 'Exportando...' : 'Baixar Mix'}</span>
                    </motion.button>
                </div>
                
                <AnimatePresence>
                    {hasErrors && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <Alert
                        title="Erro"
                        message="Falha ao carregar trilhas."
                        />
                    </motion.div>
                    )}
                </AnimatePresence>

                {isLoading ? (
                    <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="relative w-12 h-12 md:w-16 md:h-16 mx-auto mb-4">
                            <div className="absolute inset-0 rounded-full border-4 border-stone-800"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-amber-500/80 font-medium tracking-wide animate-pulse text-sm">Carregando...</p>
                    </div>
                    </div>
                ) : (
                    <div className="flex-grow overflow-hidden relative">
                        {/* Fader area background accent */}
                        <div className="absolute inset-x-0 bottom-0 h-24 md:h-32 bg-gradient-to-t from-stone-950/50 to-transparent pointer-events-none"></div>
                        <Mixer 
                        trackStates={trackStates} 
                        setVolume={setVolume} 
                        toggleMute={toggleMute} 
                        toggleSolo={toggleSolo} 
                        trackLoadErrors={trackLoadErrors} 
                        />
                    </div>
                )}
            </section>

            {/* Footer Player Bar - Responsive */}
            <footer className="flex-shrink-0 bg-[#161311] border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 safe-area-bottom">
                <div className="max-w-[1920px] mx-auto px-2 md:px-4 py-1.5 md:py-3 flex flex-col md:grid md:grid-cols-3 gap-1 md:gap-4 items-center">
                    
                    {/* Desktop: Left / Mobile: Bottom Row (2nd Item) */}
                    <div className="hidden md:flex justify-start order-2 md:order-1">
                    <PlaybackSpeedControl playbackRate={playbackRate} setPlaybackRate={setPlaybackRate} />
                    </div>

                    {/* Desktop: Center / Mobile: Top Row (Main) */}
                    <div className="w-full flex justify-center order-1 md:order-2">
                    <TransportControls isPlaying={isPlaying} onPlay={play} onPause={pause} onStop={stop} onReturnToZero={returnToZero} hasErrors={hasErrors} currentTime={currentTime} songDuration={songDuration} onSeek={seek} />
                    </div>

                    {/* Desktop: Right / Mobile: Bottom Row (Shared with Speed in a flex container if implemented, currently stacked or hidden) */}
                    <div className="hidden md:flex justify-end order-3">
                        <MasterControl volume={masterVolume} setVolume={setMasterVolume} />
                    </div>

                    {/* Mobile-Only Row for Extra Controls */}
                    <div className="flex md:hidden w-full justify-between items-center space-x-2 order-3 pt-1">
                        <PlaybackSpeedControl playbackRate={playbackRate} setPlaybackRate={setPlaybackRate} />
                        <MasterControl volume={masterVolume} setVolume={setMasterVolume} />
                    </div>
                </div>
            </footer>
            </main>
        </div>
        
        <ExportModal 
          isOpen={isExportModalOpen} 
          onClose={() => setIsExportModalOpen(false)} 
          onExport={confirmExport} 
          duration={songDuration} 
          currentTime={currentTime} 
        />
    </div>
  );
};

export default App;

