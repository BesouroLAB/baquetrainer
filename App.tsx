import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SongSelector } from './components/SongSelector';
import { Mixer } from './components/Mixer';
import { TransportControls } from './components/TransportControls';
import { Metronome } from './components/Metronome';
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
    isMetronomeOn,
    toggleMetronome,
    currentBeat,
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
  }, [stop]);

  const hasErrors = trackLoadErrors.size > 0;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <Header />
      
      <div className="py-4 px-4 border-b border-slate-800 shadow-md">
        <SongSelector songs={SONGS} selectedSong={selectedSong} onSelectSong={handleSelectSong} />
      </div>

      <main className="flex-grow flex flex-col p-4 gap-4 min-h-0">
        <section className="flex-grow bg-slate-800/50 rounded-lg p-4 flex flex-col h-full">
          <h2 className="text-xl font-bold mb-4 text-amber-400 border-b-2 border-slate-700 pb-2">{selectedSong.name}</h2>
          
          {hasErrors && (
            <Alert
              title="Audio Loading Error"
              message="One or more tracks could not be loaded. This commonly occurs with Google Drive links due to security policies (CORS). Please use a direct link from a hosting service like GitHub or Vercel for your audio files."
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
                <h3 className="text-lg font-semibold mb-3 text-amber-400/90 border-b border-slate-700 pb-2">Mixer Console</h3>
                <div className="flex-grow">
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
      <footer className="bg-slate-950/80 p-4 sticky bottom-0 border-t border-slate-700 backdrop-blur-sm shadow-t-lg">
          <div className="max-w-7xl mx-auto grid grid-cols-3 items-center justify-between gap-4">
            <div className="flex items-center justify-start gap-4">
              <Metronome bpm={selectedSong.bpm} timeSignature={selectedSong.timeSignature} currentBeat={currentBeat} playbackRate={playbackRate} />
              <div className="flex items-center space-x-2">
                  <span className="text-sm">Metronome</span>
                  <button
                      onClick={toggleMetronome}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isMetronomeOn ? 'bg-amber-500' : 'bg-slate-600'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isMetronomeOn ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
              </div>
            </div>
            <div className="flex justify-center">
              <TransportControls isPlaying={isPlaying} onPlay={play} onPause={pause} onStop={stop} onReturnToZero={returnToZero} hasErrors={hasErrors} currentTime={currentTime} songDuration={songDuration} onSeek={seek} />
            </div>
            <div className="flex justify-end items-center gap-6">
                <PlaybackSpeedControl playbackRate={playbackRate} setPlaybackRate={setPlaybackRate} />
                <MasterControl volume={masterVolume} setVolume={setMasterVolume} />
            </div>
          </div>
      </footer>
    </div>
  );
};

export default App;