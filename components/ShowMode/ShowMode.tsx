import React, { useState, useRef, useEffect } from 'react';
import { Song, TrackState } from '../../types';
import { TimelineTrack } from './TimelineTrack';
import { motion } from 'framer-motion';

interface ShowModeProps {
  song: Song;
  trackStates: TrackState[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (id: number, vol: number) => void;
  onMuteToggle: (id: number) => void;
  onSoloToggle: (id: number) => void;
  getAudioBuffer: (id: number) => AudioBuffer | undefined;
}

export const ShowMode: React.FC<ShowModeProps> = ({
  song,
  trackStates,
  currentTime,
  duration,
  isPlaying,
  onPlayPause,
  onStop,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onSoloToggle,
  getAudioBuffer,
}) => {
  const [zoom, setZoom] = useState(50); // pixels per second
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Sync scroll position for ruler (if we add one)
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };

  // Auto-scroll during playback if playhead goes out of view
  useEffect(() => {
    if (isPlaying && scrollContainerRef.current) {
      const playheadPos = currentTime * zoom;
      const containerWidth = scrollContainerRef.current.clientWidth;
      const currentScroll = scrollContainerRef.current.scrollLeft;

      // If playhead is near the right edge, scroll
      if (playheadPos > currentScroll + containerWidth * 0.8) {
        scrollContainerRef.current.scrollTo({
          left: playheadPos - containerWidth * 0.2,
          behavior: 'smooth',
        });
      }
    }
  }, [currentTime, isPlaying, zoom]);

  // Calculate total width
  const totalWidth = Math.max(duration * zoom, 1000) + 192; // Ensure at least some width + sidebar

  // Format time for display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 100);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#131110] text-stone-300 overflow-hidden">
      {/* Toolbar */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-4 bg-stone-900/80 backdrop-blur-md z-20">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2 truncate max-w-[200px] md:max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
            </svg>
            {song.name}
          </h2>
          <div className="h-6 w-px bg-white/10 mx-2"></div>
          <div className="flex items-center space-x-2">
             <button onClick={onStop} className="p-2 hover:bg-white/5 rounded-full text-stone-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
                </svg>
             </button>
             <button onClick={onPlayPause} className="p-3 bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-full shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105">
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-0.5">
                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                  </svg>
                )}
             </button>
          </div>
          <div className="font-mono text-xl text-amber-500 w-24 text-center">
            {formatTime(currentTime)}
          </div>
        </div>

        <div className="flex items-center space-x-4">
            <span className="text-xs text-stone-500 uppercase tracking-widest">Zoom</span>
            <input 
                type="range" 
                min="10" 
                max="200" 
                value={zoom} 
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-32 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
        </div>
      </div>

      {/* Timeline Area */}
      <div className="flex-grow overflow-hidden relative flex flex-col">
        {/* Ruler (Optional - simplified for now) */}
        <div className="h-6 bg-stone-900 border-b border-white/5 flex-shrink-0 relative overflow-hidden" style={{ marginLeft: '12rem' }}> {/* 12rem = w-48 sidebar */}
             {/* We could render ticks here based on zoom and scrollLeft */}
        </div>

        {/* Scrollable Tracks Container */}
        <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-grow overflow-x-auto overflow-y-auto relative custom-scrollbar"
        >
            <div className="relative" style={{ width: totalWidth, minWidth: '100%' }}>
                
                {/* Playhead Line */}
                <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-25 pointer-events-none shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    style={{ left: `calc(12rem + ${currentTime * zoom}px)` }}
                >
                    <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-amber-500 transform rotate-45"></div>
                </div>

                {/* Click to seek overlay */}
                <div 
                    className="absolute top-0 bottom-0 right-0 z-20 cursor-crosshair"
                    style={{ left: '12rem' }}
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const time = x / zoom;
                        onSeek(time);
                    }}
                >
                </div>

                {/* Tracks */}
                <div className="flex flex-col pb-20 relative pointer-events-none"> {/* pointer-events-none to let clicks pass to overlay? No, buttons need events. */}
                    {/* 
                        Issue: If overlay is on top, buttons in TimelineTrack won't work.
                        Solution: The overlay should only cover the waveform part.
                        TimelineTrack renders the sidebar and the waveform div.
                        The waveform div inside TimelineTrack handles the click?
                        Or we handle global seek on the container, but exclude the sidebar area.
                    */}
                    
                    {song.tracks.map((track) => {
                        const state = trackStates.find(t => t.id === track.id);
                        if (!state) return null;

                        return (
                            <div key={track.id} className="pointer-events-auto relative"> {/* Re-enable pointer events for controls */}
                                <TimelineTrack
                                    trackId={track.id}
                                    name={track.instrument}
                                    buffer={getAudioBuffer(track.id)}
                                    color={state.isMuted ? '#44403c' : '#f59e0b'} // Dim color if muted
                                    zoom={zoom}
                                    onVolumeChange={onVolumeChange}
                                    onMuteToggle={onMuteToggle}
                                    onSoloToggle={onSoloToggle}
                                    volume={state.volume}
                                    isMuted={state.isMuted}
                                    isSoloed={state.isSoloed}
                                />
                                {/* Seek handler for this track's waveform area */}
                                <div 
                                    className="absolute top-0 bottom-0 left-48 right-0 cursor-crosshair z-20"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        const time = x / zoom;
                                        onSeek(time);
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
