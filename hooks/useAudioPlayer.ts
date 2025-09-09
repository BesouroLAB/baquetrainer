import { useState, useEffect, useRef, useCallback } from 'react';
import type { Song, Track, TrackState } from '../types';

// Web Audio API is only available in the browser
const audioContext = typeof window !== 'undefined' ? new window.AudioContext() : null;

export const useAudioPlayer = (song: Song) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [trackLoadErrors, setTrackLoadErrors] = useState<Map<number, string>>(new Map());
  const [masterVolume, setMasterVolume] = useState(1.0);
  const [songDuration, setSongDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioBuffers = useRef<Map<number, AudioBuffer>>(new Map());
  const sources = useRef<Map<number, AudioBufferSourceNode>>(new Map());
  const gainNodes = useRef<Map<number, GainNode>>(new Map());
  const masterGainNode = useRef<GainNode | null>(null);

  const schedulerTimer = useRef<number | null>(null);
  const nextNoteTime = useRef(0.0);
  const beatCountRef = useRef(0); // For internal beat counting
  const isMetronomeOnRef = useRef(isMetronomeOn); // For stable scheduler closure
  const lookahead = 25.0; // ms
  const scheduleAheadTime = 0.1; // sec
  
  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const [trackStates, setTrackStates] = useState<TrackState[]>([]);

  // Keep ref in sync with state for scheduler
  useEffect(() => {
    isMetronomeOnRef.current = isMetronomeOn;
  }, [isMetronomeOn]);

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

    // Animation loop for current time display
  const animate = useCallback(() => {
      if (!audioContext || !isPlaying) return;
      const newCurrentTime = (audioContext.currentTime - startTimeRef.current) + pauseTimeRef.current;
      setCurrentTime(newCurrentTime);
      animationFrameRef.current = requestAnimationFrame(animate);
  }, [audioContext, isPlaying]);

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
        source.connect(gainNode);
        sources.current.set(track.id, source);
      }
    });
  }, [song.tracks]);


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

    if (isMetronomeOn) {
      startScheduler();
    }
  };

  const pause = async () => {
    if (audioContext && isPlaying) {
      pauseTimeRef.current += audioContext.currentTime - startTimeRef.current;
      await audioContext.suspend();
      setIsPlaying(false);
      stopScheduler();
    }
  };

  const stop = () => {
    stopSources();
    if(audioContext?.state === 'running') {
       audioContext.suspend(); 
    }
    setIsPlaying(false);
    stopScheduler();
    setCurrentBeat(0);
    beatCountRef.current = 0;
    setCurrentTime(0);
    pauseTimeRef.current = 0;
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

  const toggleMetronome = () => {
      setIsMetronomeOn(prev => {
        const newState = !prev;
        if(isPlaying){
            if(newState) startScheduler();
            else stopScheduler();
        }
        return newState;
      });
  }

  const scheduleNote = useCallback((beatNumber: number, time: number) => {
    if (!audioContext || !masterGainNode.current) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.frequency.setValueAtTime((beatNumber - 1) % song.timeSignature[0] === 0 ? 880 : 440, time);
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.connect(gain);
    // Metronome sound should also go through master gain to be controlled
    gain.connect(masterGainNode.current);

    osc.start(time);
    osc.stop(time + 0.05);
  }, [song.timeSignature]);

  const scheduler = useCallback(() => {
    if(!audioContext) return;
    
    while (nextNoteTime.current < audioContext.currentTime + scheduleAheadTime) {
      beatCountRef.current = (beatCountRef.current % song.timeSignature[0]) + 1;
      const newBeat = beatCountRef.current;
      
      if(isMetronomeOnRef.current) {
          scheduleNote(newBeat, nextNoteTime.current);
      }
      
      const secondsPerBeat = 60.0 / song.bpm;
      nextNoteTime.current += secondsPerBeat;

      setCurrentBeat(newBeat);
    }
  }, [audioContext, song.bpm, song.timeSignature, scheduleNote]);


  const startScheduler = () => {
      if(!audioContext || schedulerTimer.current) return;
      
      nextNoteTime.current = audioContext.currentTime;
      scheduler();
      schedulerTimer.current = window.setInterval(scheduler, lookahead);
  };

  const stopScheduler = () => {
      if (schedulerTimer.current) {
          window.clearInterval(schedulerTimer.current);
          schedulerTimer.current = null;
      }
      if(!isPlaying) {
          setCurrentBeat(0);
          beatCountRef.current = 0;
      }
  };

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
    };
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
    isMetronomeOn,
    toggleMetronome,
    currentBeat,
    trackLoadErrors,
    masterVolume,
    setMasterVolume,
    currentTime,
    songDuration,
    seek,
  };
};