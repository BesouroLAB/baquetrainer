import React, { useEffect, useRef, useState } from 'react';

interface TimelineTrackProps {
  trackId: number;
  name: string;
  buffer: AudioBuffer | undefined;
  color: string;
  height?: number;
  zoom: number; // pixels per second
  onVolumeChange: (id: number, vol: number) => void;
  onMuteToggle: (id: number) => void;
  onSoloToggle: (id: number) => void;
  volume: number;
  isMuted: boolean;
  isSoloed: boolean;
}

const CHUNK_WIDTH = 4000; // Max width per canvas chunk

export const TimelineTrack: React.FC<TimelineTrackProps> = ({
  trackId,
  name,
  buffer,
  color,
  height = 80,
  zoom,
  onVolumeChange,
  onMuteToggle,
  onSoloToggle,
  volume,
  isMuted,
  isSoloed,
}) => {
  const [chunks, setChunks] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!buffer) {
      setChunks([]);
      return;
    }

    const totalWidth = Math.ceil(buffer.duration * zoom);
    const numChunks = Math.ceil(totalWidth / CHUNK_WIDTH);
    setChunks(Array.from({ length: numChunks }, (_, i) => i));
  }, [buffer, zoom]);

  return (
    <div className="flex items-center bg-stone-900/40 border-b border-white/5 h-24">
      {/* Track Controls (Left Sidebar) */}
      <div className="w-48 flex-shrink-0 p-2 border-r border-white/5 flex flex-col justify-center gap-2 bg-stone-900/80 backdrop-blur-md z-30 sticky left-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-stone-300 truncate w-24" title={name}>
            {name}
          </span>
          <div className="flex gap-1">
             <button
              onClick={() => onMuteToggle(trackId)}
              className={`text-[10px] px-1.5 py-0.5 rounded border ${
                isMuted
                  ? 'bg-red-500/20 text-red-400 border-red-500/50'
                  : 'bg-stone-800 text-stone-500 border-stone-700 hover:text-stone-300'
              }`}
            >
              M
            </button>
            <button
              onClick={() => onSoloToggle(trackId)}
              className={`text-[10px] px-1.5 py-0.5 rounded border ${
                isSoloed
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                  : 'bg-stone-800 text-stone-500 border-stone-700 hover:text-stone-300'
              }`}
            >
              S
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-stone-500">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.972 7.972 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
            </svg>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => onVolumeChange(trackId, parseFloat(e.target.value))}
                className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
        </div>
      </div>

      {/* Waveform Area */}
      <div className="flex-grow relative h-full overflow-hidden" ref={containerRef}>
         {chunks.map((chunkIndex) => (
            <WaveformChunk 
                key={chunkIndex}
                chunkIndex={chunkIndex}
                buffer={buffer}
                color={color}
                height={height}
                zoom={zoom}
            />
         ))}
      </div>
    </div>
  );
};

interface WaveformChunkProps {
    chunkIndex: number;
    buffer: AudioBuffer | undefined;
    color: string;
    height: number;
    zoom: number;
}

const WaveformChunk: React.FC<WaveformChunkProps> = ({ chunkIndex, buffer, color, height, zoom }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !buffer) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Calculate dimensions for this chunk
        const startPixel = chunkIndex * CHUNK_WIDTH;
        const totalWidth = Math.ceil(buffer.duration * zoom);
        const width = Math.min(CHUNK_WIDTH, totalWidth - startPixel);
        
        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, width, height);

        // Draw waveform for this chunk
        const data = buffer.getChannelData(0);
        // Calculate sample range
        // total samples = data.length
        // total pixels = totalWidth
        // samples per pixel = data.length / totalWidth
        const samplesPerPixel = data.length / totalWidth;
        
        const startSample = Math.floor(startPixel * samplesPerPixel);
        // We iterate 'width' pixels
        
        const amp = height / 2;
        ctx.fillStyle = color;
        ctx.beginPath();

        for (let i = 0; i < width; i++) {
            let min = 1.0;
            let max = -1.0;
            
            const pixelStartSample = Math.floor((startPixel + i) * samplesPerPixel);
            const pixelEndSample = Math.floor((startPixel + i + 1) * samplesPerPixel);
            
            // Optimization: Don't iterate too many samples if zoomed out a lot
            // Just take a stride if samplesPerPixel is huge
            const step = Math.max(1, Math.ceil((pixelEndSample - pixelStartSample) / 10)); // Check at most 10 points per pixel if very dense? No, we need peaks.
            // Actually, for accuracy we should check all, but for performance we might skip.
            // Let's check all for now, but be careful.
            
            for (let j = pixelStartSample; j < pixelEndSample; j++) {
                const datum = data[j];
                if (datum < min) min = datum;
                if (datum > max) max = datum;
            }
            
            // If no samples found (e.g. very high zoom), just draw 0
            if (min > max) {
                min = 0;
                max = 0;
            }

            ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
        }

    }, [chunkIndex, buffer, color, height, zoom]);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute top-0 h-full" 
            style={{ left: chunkIndex * CHUNK_WIDTH }}
        />
    );
};
