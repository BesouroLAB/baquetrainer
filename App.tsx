import React, { useState, useCallback } from 'react';
import { SongSelector } from './components/SongSelector';
import { Mixer } from './components/Mixer';
import { TransportControls } from './components/TransportControls';
import { Alert } from './components/Alert';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { SONGS } from './constants';
import type { Song } from './types';
import { MasterControl } from './components/MasterControl';
import { PlaybackSpeedControl } from './components/PlaybackSpeedControl';

const App: React.FC = () => {
  const [selectedSong, setSelectedSong] = useState<Song>(SONGS[0]);

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
    trackLoadErrors,
    masterVolume,
    setMasterVolume,
    currentTime,
    songDuration,
    seek,
    playbackRate,
    setPlaybackRate,
  } = useAudioPlayer(selectedSong);

  const handleSelectSong = useCallback((song: Song) => {
    stop();
    setSelectedSong(song);
    setPlaybackRate(1.0);
  }, [stop, setPlaybackRate]);

  const hasErrors = trackLoadErrors.size > 0;

  return (
    <div className="h-screen flex flex-col font-sans bg-black text-slate-300">
      <div className="flex-grow grid grid-cols-1 md:grid-cols-[300px_1fr] gap-2 p-2 overflow-hidden">
        {/* Sidebar */}
        <aside className="bg-slate-950/70 rounded-lg flex flex-col p-4 space-y-4">
          <div className="flex-shrink-0">
            <img 
                src="https://raw.githubusercontent.com/BesouroLAB/albumsankofa/master/capa.png" 
                alt="Capa do álbum Malungos do Interior"
                className="w-full h-auto object-cover rounded-md shadow-lg"
            />
            <div className="mt-4 text-center">
              <h1 className="text-xl font-bold text-white">Malungos do Interior</h1>
              <p className="text-sm text-amber-400">Nação Sankofa Baobá</p>
            </div>
          </div>
          <nav className="flex-grow overflow-y-auto">
            <SongSelector songs={SONGS} selectedSong={selectedSong} onSelectSong={handleSelectSong} />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="bg-slate-950/70 rounded-lg flex flex-col overflow-hidden">
          <section className="flex-grow flex flex-col p-4 gap-4 min-h-0">
              <h2 className="text-2xl font-bold text-white border-b-2 border-slate-800 pb-2 flex-shrink-0">
                {selectedSong.name}
              </h2>
              
              {hasErrors && (
                <Alert
                  title="Audio Loading Error"
                  message="One or more tracks could not be loaded. Please ensure audio file links are correct and accessible."
                />
              )}

              {isLoading ? (
                <div className="flex-grow flex items-center justify-center">
                  <div className="text-center">
                    <svg className="animate-spin h-8 w-8 text-amber-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p>Loading audio tracks...</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col flex-grow min-h-0">
                    <h3 className="text-lg font-semibold mb-3 text-amber-400/90 flex-shrink-0">Mixer Console</h3>
                    <div className="flex-grow overflow-hidden">
                        <Mixer 
                          trackStates={trackStates} 
                          setVolume={setVolume} 
                          toggleMute={toggleMute} 
                          toggleSolo={toggleSolo} 
                          trackLoadErrors={trackLoadErrors} 
                        />
                    </div>
                </div>
              )}
            </section>
        </main>
      </div>

      {/* Footer Player Bar */}
      <footer className="flex-shrink-0 bg-slate-900 p-3 border-t border-slate-800">
          <div className="max-w-full mx-auto grid grid-cols-3 items-center justify-between gap-4">
            <div className="flex items-center justify-start gap-6">
               {/* Future content can go here, like track info */}
            </div>
            <div className="flex justify-center">
              <TransportControls isPlaying={isPlaying} onPlay={play} onPause={pause} onStop={stop} onReturnToZero={returnToZero} hasErrors={hasErrors} currentTime={currentTime} songDuration={songDuration} onSeek={seek} />
            </div>
            <div className="flex justify-end items-center gap-4">
                <PlaybackSpeedControl playbackRate={playbackRate} setPlaybackRate={setPlaybackRate} />
                <MasterControl volume={masterVolume} setVolume={setMasterVolume} />
            </div>
          </div>
      </footer>
    </div>
  );
};

export default App;