import { useState, useEffect, useRef, useCallback } from 'react';
import type { Song, Track, TrackState } from '../types';

// Web Audio API is only available in the browser
const audioContext = typeof window !== 'undefined' ? new window.AudioContext() : null;

export const useAudioPlayer = (song: Song) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackLoadErrors, setTrackLoadErrors] = useState<Map<number, string>>(new Map());
  const [masterVolume, setMasterVolume] = useState(1.0);
  const [songDuration, setSongDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const audioBuffers = useRef<Map<number, AudioBuffer>>(new Map());
  const sources = useRef<Map<number, AudioBufferSourceNode>>(new Map());
  const gainNodes = useRef<Map<number, GainNode>>(new Map());
  const masterGainNode = useRef<GainNode | null>(null);
  
  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const [trackStates, setTrackStates] = useState<TrackState[]>([]);

  const initializeTrackStates = useCallback((tracks: Track[]) => {
    const initialStates = tracks.map(track => ({
      id: track.id,
      instrument: track.instrument,
      volume: 1.0,
      isMuted: false,
      isSoloed: false,
    }));
    setTrackStates(initialStates);
    setTrackLoadErrors(new Map()); // Reset errors on song change
    setCurrentTime(0); // Reset time on song change
    setSongDuration(0); // Reset duration on song change

    // Initialize Gain Nodes
    if (audioContext) {
      if (!masterGainNode.current) {
        masterGainNode.current = audioContext.createGain();
        masterGainNode.current.connect(audioContext.destination);
      }
      
      gainNodes.current.clear();
      tracks.forEach(track => {
        const gainNode = audioContext.createGain();
        gainNode.connect(masterGainNode.current as GainNode);
        gainNodes.current.set(track.id, gainNode);
      });
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    initializeTrackStates(song.tracks);

    const loadTracks = async () => {
      if (!audioContext) return;
      
      const promises = song.tracks.map(track => {
        if (!track.path) {
          return Promise.resolve(null);
        }

        return fetch(track.path)
          .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${track.path}`);
            }
            return response.arrayBuffer();
          })
          .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
          .catch(error => {
              console.error(`Failed to load or decode audio for ${track.instrument}:`, error);
              setTrackLoadErrors(prev => new Map(prev).set(track.id, error.message));
              return null;
          })
      });

      const loadedBuffers = await Promise.all(promises);
      audioBuffers.current.clear();
      let maxDuration = 0;
      loadedBuffers.forEach((buffer, index) => {
        if(buffer) {
            const track = song.tracks[index];
            audioBuffers.current.set(track.id, buffer);
            if (buffer.duration > maxDuration) {
                maxDuration = buffer.duration;
            }
        }
      });
      setSongDuration(maxDuration);
      setIsLoading(false);
    };

    loadTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song]);

  const updateGains = useCallback(() => {
    const soloedTracks = trackStates.filter(t => t.isSoloed);
    const hasSolo = soloedTracks.length > 0;

    trackStates.forEach(track => {
      const gainNode = gainNodes.current.get(track.id);
      if (gainNode) {
        let newVolume = track.volume;
        if (track.isMuted) {
          newVolume = 0;
        }
        if (hasSolo && !track.isSoloed) {
          newVolume = 0;
        }
        gainNode.gain.setValueAtTime(newVolume, audioContext?.currentTime || 0);
      }
    });

    if (masterGainNode.current) {
        masterGainNode.current.gain.setValueAtTime(masterVolume, audioContext?.currentTime || 0);
    }

  }, [trackStates, masterVolume]);

  useEffect(() => {
    updateGains();
  }, [trackStates, updateGains]);

  const stop = useCallback(() => {
    sources.current.forEach(source => {
        try {
            source.stop();
        } catch(e) {
            // Ignore error if already stopped
        }
        source.disconnect();
    });
    sources.current.clear();
    
    if(audioContext?.state === 'running') {
       audioContext.suspend(); 
    }
    setIsPlaying(false);
    setCurrentTime(0);
    pauseTimeRef.current = 0;
  }, []);
  
  const stopRef = useRef(stop);
  useEffect(() => {
      stopRef.current = stop;
  });

    // Animation loop for current time display
  const animate = useCallback(() => {
      if (!audioContext || !isPlaying) return;
      const realTimeElapsed = audioContext.currentTime - startTimeRef.current;
      const newCurrentTime = (realTimeElapsed * playbackRate) + pauseTimeRef.current;

      if (songDuration > 0 && newCurrentTime >= songDuration) {
          stopRef.current();
          return;
      }

      setCurrentTime(newCurrentTime);
      animationFrameRef.current = requestAnimationFrame(animate);
  }, [audioContext, isPlaying, playbackRate, songDuration]);

  useEffect(() => {
      if(isPlaying) {
          animationFrameRef.current = requestAnimationFrame(animate);
      } else {
          if(animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
      }

      return () => {
          if(animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
      };
  }, [isPlaying, animate])

  const stopSources = useCallback(() => {
     sources.current.forEach(source => {
        try {
            source.stop();
        } catch(e) {
            // Ignore error if already stopped
        }
        source.disconnect();
    });
    sources.current.clear();
  }, []);

  const createAndConnectSources = useCallback(() => {
    song.tracks.forEach(track => {
      const buffer = audioBuffers.current.get(track.id);
      const gainNode = gainNodes.current.get(track.id);
      if (buffer && gainNode && audioContext) {
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.playbackRate.value = playbackRate;
        source.connect(gainNode);
        sources.current.set(track.id, source);
      }
    });
  }, [song.tracks, playbackRate]);

  // Update playback rate on the fly for active sources
  useEffect(() => {
    sources.current.forEach(source => {
      if (source.playbackRate) {
        source.playbackRate.value = playbackRate;
      }
    });
  }, [playbackRate]);

  const play = async () => {
    if (isLoading || !audioContext) return;
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    stopSources();
    createAndConnectSources();
    
    const offset = pauseTimeRef.current % songDuration;
    
    sources.current.forEach(source => source.start(audioContext.currentTime, offset));
    setIsPlaying(true);
    
    startTimeRef.current = audioContext.currentTime;
  };

  const pause = async () => {
    if (audioContext && isPlaying) {
      const realTimeElapsed = audioContext.currentTime - startTimeRef.current;
      pauseTimeRef.current += realTimeElapsed * playbackRate;
      await audioContext.suspend();
      setIsPlaying(false);
    }
  };

  const returnToZero = () => {
      stop();
  }

  const seek = useCallback((time: number) => {
    if (!audioContext || isNaN(time) || songDuration === 0) return;

    const newTime = Math.max(0, Math.min(time, songDuration));
    
    setCurrentTime(newTime);
    pauseTimeRef.current = newTime;

    if (isPlaying) {
        stopSources();
        createAndConnectSources();
        
        const offset = newTime % songDuration;
        sources.current.forEach(source => {
            source.start(audioContext.currentTime, offset)
        });

        startTimeRef.current = audioContext.currentTime;
    }
  }, [audioContext, isPlaying, songDuration, stopSources, createAndConnectSources]);

  const setVolume = (trackId: number, volume: number) => {
    setTrackStates(prev => prev.map(t => t.id === trackId ? { ...t, volume } : t));
  };
  
  const toggleMute = (trackId: number) => {
    setTrackStates(prev => prev.map(t => t.id === trackId ? { ...t, isMuted: !t.isMuted } : t));
  };
  
  const toggleSolo = (trackId: number) => {
    setTrackStates(prev => prev.map(t => t.id === trackId ? { ...t, isSoloed: !t.isSoloed } : t));
  };

  const resetMixer = useCallback(() => {
    setTrackStates(prev => 
      prev.map(track => ({
        ...track,
        volume: 1.0,
        isMuted: false,
        isSoloed: false,
      }))
    );
  }, []);

  useEffect(() => {
    const resumeAudio = async () => {
        if (audioContext && audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        window.removeEventListener('click', resumeAudio);
        window.removeEventListener('keydown', resumeAudio);
    };

    window.addEventListener('click', resumeAudio);
    window.addEventListener('keydown', resumeAudio);

    return () => {
        window.removeEventListener('click', resumeAudio);
        window.removeEventListener('keydown', resumeAudio);
        stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return {
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
  };
};
