import { useState, useEffect, useRef, useCallback } from 'react';
import type { Song, Track, TrackState } from '../types';

// Web Audio API is only available in the browser
const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

export const useAudioPlayer = (song: Song) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState({ loaded: 0, total: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackLoadErrors, setTrackLoadErrors] = useState<Map<number, string>>(new Map());
  const [masterVolume, setMasterVolume] = useState(1.0);
  const [songDuration, setSongDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isBassBoostEnabled, setIsBassBoostEnabled] = useState(false);
  const [loopRegion, setLoopRegion] = useState<{ start: number | null, end: number | null }>({ start: null, end: null });

  const audioBuffers = useRef<Map<number, AudioBuffer>>(new Map());
  const sources = useRef<Map<number, AudioBufferSourceNode>>(new Map());
  const gainNodes = useRef<Map<number, GainNode>>(new Map());
  const masterGainNode = useRef<GainNode | null>(null);
  const bassBoostFilter = useRef<BiquadFilterNode | null>(null);
  const bassPunchFilter = useRef<BiquadFilterNode | null>(null);
  
  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const playbackRateRef = useRef(playbackRate);

  const [trackStates, setTrackStates] = useState<TrackState[]>([]);
  const loopRegionRef = useRef(loopRegion);
  const songDurationRef = useRef(songDuration);

  // Keep refs in sync with state
  useEffect(() => { loopRegionRef.current = loopRegion; }, [loopRegion]);
  useEffect(() => { songDurationRef.current = songDuration; }, [songDuration]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { playbackRateRef.current = playbackRate; }, [playbackRate]);

  const initializeTrackStates = useCallback((tracks: Track[]) => {
    const initialStates = tracks.map(track => ({
      id: track.id,
      instrument: track.instrument,
      volume: 1.0,
      isMuted: false,
      isSoloed: false,
    }));
    setTrackStates(initialStates);
    setTrackLoadErrors(new Map());
    setCurrentTime(0);
    setSongDuration(0);
    setLoopRegion({ start: null, end: null });
    pauseTimeRef.current = 0;

    if (audioContext) {
      if (!masterGainNode.current) {
        masterGainNode.current = audioContext.createGain();
        
        bassBoostFilter.current = audioContext.createBiquadFilter();
        bassBoostFilter.current.type = 'lowshelf';
        bassBoostFilter.current.frequency.value = 120;
        // Softened from 10 to 6
        bassBoostFilter.current.gain.value = isBassBoostEnabled ? 6 : 0; 

        bassPunchFilter.current = audioContext.createBiquadFilter();
        bassPunchFilter.current.type = 'peaking';
        bassPunchFilter.current.frequency.value = 65; 
        bassPunchFilter.current.Q.value = 1.5;
        // Softened from 14 to 8
        bassPunchFilter.current.gain.value = isBassBoostEnabled ? 8 : 0;

        masterGainNode.current.connect(bassBoostFilter.current);
        bassBoostFilter.current.connect(bassPunchFilter.current);
        bassPunchFilter.current.connect(audioContext.destination);
      }
      
      gainNodes.current.clear();
      tracks.forEach(track => {
        const gainNode = audioContext.createGain();
        gainNode.connect(masterGainNode.current as GainNode);
        gainNodes.current.set(track.id, gainNode);
      });
    }
  }, [isBassBoostEnabled]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setIsLoading(true);
    setLoadingProgress({ loaded: 0, total: song.tracks.length });
    initializeTrackStates(song.tracks);

    const loadTracks = async () => {
      if (!audioContext) {
        setIsLoading(false);
        return;
      }
      
      let loadedCount = 0;
      const promises = song.tracks.map(async (track) => {
        if (!track.path) {
          loadedCount++;
          setLoadingProgress(prev => ({ ...prev, loaded: loadedCount }));
          return null;
        }

        try {
          const response = await fetch(track.path, { mode: 'cors', signal });
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const arrayBuffer = await response.arrayBuffer();
          const buffer = await audioContext.decodeAudioData(arrayBuffer);
          
          loadedCount++;
          setLoadingProgress(prev => ({ ...prev, loaded: loadedCount }));
          return buffer;
        } catch (error: any) {
          if (error.name === 'AbortError') return null;
          console.error(`Failed to load ${track.instrument}:`, error);
          setTrackLoadErrors(prev => new Map(prev).set(track.id, error.message));
          loadedCount++;
          setLoadingProgress(prev => ({ ...prev, loaded: loadedCount }));
          return null;
        }
      });

      const loadedBuffers = await Promise.all(promises);
      if (signal.aborted) return;

      audioBuffers.current.clear();
      let maxDuration = 0;
      loadedBuffers.forEach((buffer, index) => {
        if(buffer) {
            const track = song.tracks[index];
            audioBuffers.current.set(track.id, buffer);
            if (buffer.duration > maxDuration) maxDuration = buffer.duration;
        }
      });
      
      setSongDuration(maxDuration);
      setIsLoading(false);
    };

    loadTracks();
    return () => controller.abort();
  }, [song, initializeTrackStates]);

  const updateGains = useCallback(() => {
    const soloedTracks = trackStates.filter(t => t.isSoloed);
    const hasSolo = soloedTracks.length > 0;

    trackStates.forEach(track => {
      const gainNode = gainNodes.current.get(track.id);
      if (gainNode) {
        let newVolume = track.volume;
        if (track.isMuted || (hasSolo && !track.isSoloed)) {
          newVolume = 0;
        }

        // Softened Alfaia boost from 1.2 to 1.1
        if (isBassBoostEnabled && track.instrument.includes('Alfaia')) {
          newVolume *= 1.1;
        }

        gainNode.gain.setValueAtTime(newVolume, audioContext?.currentTime || 0);
      }
    });

    if (masterGainNode.current) {
        masterGainNode.current.gain.setValueAtTime(masterVolume, audioContext?.currentTime || 0);
    }
  }, [trackStates, masterVolume, isBassBoostEnabled]);

  useEffect(() => updateGains(), [trackStates, updateGains]);

  useEffect(() => {
    if (bassBoostFilter.current && bassPunchFilter.current && audioContext) {
      // Softened from 10 to 6
      bassBoostFilter.current.gain.setTargetAtTime(isBassBoostEnabled ? 6 : 0, audioContext.currentTime, 0.05);
      // Softened from 14 to 8
      bassPunchFilter.current.gain.setTargetAtTime(isBassBoostEnabled ? 8 : 0, audioContext.currentTime, 0.05);
    }
  }, [isBassBoostEnabled]);

  const stopSources = useCallback(() => {
     sources.current.forEach(source => {
        try { source.stop(); } catch(e) {}
        source.disconnect();
    });
    sources.current.clear();
  }, []);

  const stop = useCallback(() => {
    stopSources();
    setIsPlaying(false);
    setCurrentTime(0);
    pauseTimeRef.current = 0;
  }, [stopSources]);

  const createAndConnectSources = useCallback(() => {
    song.tracks.forEach(track => {
      const buffer = audioBuffers.current.get(track.id);
      const gainNode = gainNodes.current.get(track.id);
      if (buffer && gainNode && audioContext) {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = playbackRate;
        source.connect(gainNode);
        sources.current.set(track.id, source);
      }
    });
  }, [song.tracks, playbackRate]);

  const play = async () => {
    if (isLoading || !audioContext || isPlaying) return;
    if (audioContext.state === 'suspended') await audioContext.resume();
    
    stopSources();
    createAndConnectSources();
    
    const offset = pauseTimeRef.current;
    const startTime = audioContext.currentTime + 0.05;
    startTimeRef.current = startTime;
    
    sources.current.forEach((source, trackId) => {
      const buffer = audioBuffers.current.get(trackId);
      if (source && buffer && offset < buffer.duration) {
        source.start(startTime, offset);
      }
    });

    setIsPlaying(true);
  };

  const pause = async () => {
    if (audioContext && isPlaying) {
      setIsPlaying(false);
      const realTimeElapsed = audioContext.currentTime - startTimeRef.current;
      pauseTimeRef.current += realTimeElapsed * playbackRate;
      stopSources();
    }
  };

  const seek = useCallback((time: number) => {
    if (!audioContext || isNaN(time) || songDuration === 0) return;
    const newTime = Math.max(0, Math.min(time, songDuration));
    
    setCurrentTime(newTime);
    pauseTimeRef.current = newTime;

    if (isPlaying) {
        stopSources();
        createAndConnectSources();
        const startTime = audioContext.currentTime + 0.05;
        sources.current.forEach((source, trackId) => {
            const buffer = audioBuffers.current.get(trackId);
            if (buffer && newTime < buffer.duration) source.start(startTime, newTime);
        });
        startTimeRef.current = startTime;
    }
  }, [isPlaying, songDuration, createAndConnectSources, stopSources]);

  const animate = useCallback(() => {
      if (!audioContext || !isPlayingRef.current) return;
      const realTimeElapsed = audioContext.currentTime - startTimeRef.current;
      const newCurrentTime = (realTimeElapsed * playbackRateRef.current) + pauseTimeRef.current;

      const loop = loopRegionRef.current;
      if (loop.start !== null && loop.end !== null && newCurrentTime >= loop.end) {
          seek(loop.start);
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
      }

      const duration = songDurationRef.current;
      if (duration > 0 && newCurrentTime >= duration) {
          stop();
          return;
      }

      setCurrentTime(newCurrentTime);
      animationFrameRef.current = requestAnimationFrame(animate);
  }, [seek, stop]);

  useEffect(() => {
      if(isPlaying) animationFrameRef.current = requestAnimationFrame(animate);
      return () => { if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [isPlaying, animate]);

  useEffect(() => {
      return () => {
          stopSources();
      };
  }, [stopSources]);

  const returnToZero = () => {
      seek(0);
  };

  const getAudioBuffer = useCallback((trackId: number) => {
      return audioBuffers.current.get(trackId);
  }, []);

  return {
    isLoading, loadingProgress, isPlaying, play, pause, stop, returnToZero, getAudioBuffer,
    trackStates, setVolume: (id: number, vol: number) => setTrackStates(prev => prev.map(t => t.id === id ? { ...t, volume: vol } : t)),
    toggleMute: (id: number) => setTrackStates(prev => prev.map(t => t.id === id ? { ...t, isMuted: !t.isMuted } : t)),
    toggleSolo: (id: number) => setTrackStates(prev => prev.map(t => t.id === id ? { ...t, isSoloed: !t.isSoloed } : t)),
    resetMixer: () => setTrackStates(prev => prev.map(t => ({ ...t, volume: 1.0, isMuted: false, isSoloed: false }))),
    trackLoadErrors, masterVolume, setMasterVolume, currentTime, songDuration, seek, loopRegion, setLoopRegion,
    playbackRate, setPlaybackRate, isBassBoostEnabled, setIsBassBoostEnabled
  };
};
