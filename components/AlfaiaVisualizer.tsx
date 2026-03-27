import React, { useMemo, useState, useRef, useLayoutEffect } from 'react';
import type { RhythmNote } from '../types';

interface AlfaiaVisualizerProps {
  pattern: RhythmNote[];
  bpm: number;
  timeSignature: [number, number];
  currentTime: number;
}

// Config Constants
const NOTE_TRAVEL_TIME_SECONDS = 2.0; // Time for a note to go from top to strike zone
const STRIKE_ZONE_OFFSET_PX = 40; // Vertical position of the strike zone from the bottom

const noteStyles = {
  ataque: 'bg-red-500 text-slate-900 shadow-lg shadow-red-500/30 h-8 font-bold',
  rebate: 'bg-cyan-400/80 text-slate-800 h-7 opacity-90 font-medium',
};

const noteText: { [key: string]: string } = {
  ataque: 'R', // Right
  rebate: 'L', // Left
};

export const AlfaiaVisualizer: React.FC<AlfaiaVisualizerProps> = ({ pattern, bpm, timeSignature, currentTime }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  // Measure the container height for accurate note positioning and update on resize
  useLayoutEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const { patternDuration, notesWithTime } = useMemo(() => {
    const secondsPerBeat = 60 / bpm;
    const secondsPerBar = timeSignature[0] * secondsPerBeat;

    const notes = pattern.map((note, index) => {
      const time = typeof note.time === 'number'
        ? note.time
        : ((note.bar! - 1) * timeSignature[0] + (note.beat! - 1)) * secondsPerBeat;
      return { ...note, time, id: `${time}-${index}` };
    }).sort((a, b) => a.time - b.time);

    const maxTime = notes.length > 0 ? notes[notes.length - 1].time : 0;
    // Round up to the nearest full bar to get a consistent loop duration
    const bars = Math.ceil((maxTime + 0.01) / secondsPerBar) || 1;
    const duration = bars * secondsPerBar;
    
    return { patternDuration: duration, notesWithTime: notes };
  }, [pattern, bpm, timeSignature]);

  // Don't render if we can't calculate positions
  if (patternDuration === 0 || containerHeight === 0) return null;

  // Find our current position within the repeating pattern
  const timeInPattern = currentTime % patternDuration;

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-800/50 rounded-lg relative overflow-hidden flex-grow flex flex-col">
      {/* Track Lines */}
      <div className="h-full relative px-4">
        <div className="grid grid-cols-2 h-full">
            <div className="border-x border-slate-600/50 relative">
                <p className="text-center absolute top-2 left-0 right-0 text-slate-400 font-bold">Left (Rebate)</p>
            </div>
            <div className="border-r border-slate-600/50 relative">
                <p className="text-center absolute top-2 left-0 right-0 text-slate-400 font-bold">Right (Ataque)</p>
            </div>
        </div>
      </div>
      
      {/* Strike Zone */}
      <div className="absolute left-0 right-0 h-1 bg-amber-400/80 shadow-[0_0_15px] shadow-amber-400/80" style={{ bottom: `${STRIKE_ZONE_OFFSET_PX}px` }}></div>
      <div className="absolute left-0 right-0 text-center" style={{ bottom: `${STRIKE_ZONE_OFFSET_PX - 8}px` }}>
          <span className="bg-slate-900 px-2 text-amber-300 text-xs font-mono tracking-widest">PLAY</span>
      </div>

      {/* Notes Container */}
      <div className="absolute inset-0">
          {notesWithTime.map(note => {
              // Find the next time this note will be hit relative to the start of the pattern.
              // This handles the "wrap around" case for looping.
              const nextNoteTimeInPattern = timeInPattern > note.time + 0.1 // Add buffer for float precision
                  ? note.time + patternDuration // It already passed in this loop, so target the one in the next
                  : note.time;                  // It's coming up in this loop

              // How many seconds until the note should be hit?
              const timeUntilStrike = nextNoteTimeInPattern - timeInPattern;

              // If it's too far in the future to be on screen, don't render it.
              if (timeUntilStrike > NOTE_TRAVEL_TIME_SECONDS) {
                  return null;
              }

              // Calculate visual progress (0 at top, 1 at strike zone)
              const progress = 1.0 - (timeUntilStrike / NOTE_TRAVEL_TIME_SECONDS);
              const yPos = progress * (containerHeight - STRIKE_ZONE_OFFSET_PX);

              // Don't render if it's visually off-screen
              if (yPos < -40 || yPos > containerHeight) return null;

              // Create a key that is unique for each note instance in each loop
              const noteId = `${note.id}-${Math.floor(currentTime / patternDuration)}`;

              if (note.type === 'flam') {
                  return (
                      <div key={noteId} className="absolute w-full h-8 top-0" style={{ transform: `translateY(${yPos}px)` }}>
                          <div className="grid grid-cols-2 gap-x-2 px-1 h-full items-center">
                              <div className={`w-full rounded flex items-center justify-center ${noteStyles.rebate}`}>L</div>
                              <div className={`w-full rounded flex items-center justify-center ${noteStyles.ataque}`}>R</div>
                          </div>
                      </div>
                  )
              }
              const isRebate = note.type === 'rebate';
              return (
                  <div key={noteId} className="absolute w-1/2 h-8 top-0 flex items-center justify-center" style={{ left: isRebate ? 0 : '50%', transform: `translateY(${yPos}px)` }}>
                      <div className={`mx-1 w-full rounded flex items-center justify-center ${isRebate ? noteStyles.rebate : noteStyles.ataque}`}>
                          {noteText[note.type]}
                      </div>
                  </div>
              );
          })}
      </div>
    </div>
  );
};