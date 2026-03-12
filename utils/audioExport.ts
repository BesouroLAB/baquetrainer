import { TrackState } from '../types';
// @ts-ignore
import lamejs from 'lamejs';

export async function exportMix(
  songName: string,
  trackStates: TrackState[],
  getAudioBuffer: (id: number) => AudioBuffer | undefined,
  masterVolume: number,
  startTime: number = 0,
  endTime?: number
): Promise<void> {
  // 1. Determinar quais faixas estão ativas (respeitando SOLO e MUTE)
  const hasSolo = trackStates.some(t => t.isSoloed);
  const activeTracks = trackStates.filter(t => {
    if (hasSolo) return t.isSoloed;
    return !t.isMuted;
  });

  if (activeTracks.length === 0) {
    throw new Error("Nenhuma faixa ativa para exportar. Desmute ou coloque em solo as faixas que deseja baixar.");
  }

  // 2. Encontrar a duração máxima e a taxa de amostragem
  let maxDuration = 0;
  let sampleRate = 44100;
  const buffersToMix: { buffer: AudioBuffer, volume: number }[] = [];

  activeTracks.forEach(track => {
    const buffer = getAudioBuffer(track.id);
    if (buffer) {
      if (buffer.duration > maxDuration) maxDuration = buffer.duration;
      sampleRate = buffer.sampleRate;
      buffersToMix.push({ buffer, volume: track.volume });
    }
  });

  if (buffersToMix.length === 0) {
    throw new Error("Os áudios ainda não foram totalmente carregados.");
  }

  const safeStartTime = Math.max(0, startTime);
  const safeEndTime = endTime && endTime > safeStartTime ? Math.min(endTime, maxDuration) : maxDuration;
  const renderDuration = safeEndTime - safeStartTime;

  if (renderDuration <= 0) {
    throw new Error("Tempo de exportação inválido. Verifique o início e o fim.");
  }

  // 3. Criar o OfflineAudioContext para renderizar a mixagem
  const offlineCtx = new OfflineAudioContext(2, sampleRate * renderDuration, sampleRate);

  // 4. Conectar as faixas com seus respectivos volumes
  buffersToMix.forEach(({ buffer, volume }) => {
    const source = offlineCtx.createBufferSource();
    source.buffer = buffer;
    
    const gainNode = offlineCtx.createGain();
    gainNode.gain.value = volume * masterVolume;

    source.connect(gainNode);
    gainNode.connect(offlineCtx.destination);
    
    // Inicia no tempo 0 do contexto offline, mas lendo a partir do safeStartTime do buffer original
    source.start(0, safeStartTime, renderDuration);
  });

  // 5. Renderizar o áudio
  const renderedBuffer = await offlineCtx.startRendering();

  // 6. Converter para MP3
  const mp3Blob = audioBufferToMp3(renderedBuffer);

  // 7. Disparar o download
  const url = URL.createObjectURL(mp3Blob);
  const a = document.createElement('a');
  a.href = url;
  
  // Formatar o nome do arquivo
  const safeName = songName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  a.download = `${safeName}_mix.mp3`;
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function audioBufferToMp3(buffer: AudioBuffer): Blob {
  const channels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  // @ts-ignore
  const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128); // 128kbps
  const mp3Data: Int8Array[] = [];

  const left = buffer.getChannelData(0);
  const right = channels > 1 ? buffer.getChannelData(1) : left;

  const sampleBlockSize = 1152; // multiple of 576
  const leftInt16 = new Int16Array(left.length);
  const rightInt16 = new Int16Array(right.length);

  for (let i = 0; i < left.length; i++) {
    // Clamp and convert to Int16
    let l = Math.max(-1, Math.min(1, left[i]));
    leftInt16[i] = l < 0 ? l * 0x8000 : l * 0x7FFF;
    
    let r = Math.max(-1, Math.min(1, right[i]));
    rightInt16[i] = r < 0 ? r * 0x8000 : r * 0x7FFF;
  }

  for (let i = 0; i < left.length; i += sampleBlockSize) {
    const leftChunk = leftInt16.subarray(i, i + sampleBlockSize);
    const rightChunk = rightInt16.subarray(i, i + sampleBlockSize);
    let mp3buf;
    if (channels === 2) {
      mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
    } else {
      mp3buf = mp3encoder.encodeBuffer(leftChunk);
    }
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
  }

  const mp3buf = mp3encoder.flush();
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf);
  }

  return new Blob(mp3Data, { type: 'audio/mp3' });
}

export function analyzeTrackActivity(buffer: AudioBuffer, threshold: number = 0.005): { start: number, end: number } {
  const channelData = buffer.getChannelData(0);
  let startIdx = -1;
  let endIdx = -1;

  // Find first sample above threshold
  for (let i = 0; i < channelData.length; i++) {
    if (Math.abs(channelData[i]) > threshold) {
      startIdx = i;
      break;
    }
  }

  // If completely silent
  if (startIdx === -1) {
    return { start: 0, end: 0 };
  }

  // Find last sample above threshold
  for (let i = channelData.length - 1; i >= 0; i--) {
    if (Math.abs(channelData[i]) > threshold) {
      endIdx = i;
      break;
    }
  }

  return {
    start: startIdx / buffer.sampleRate,
    end: endIdx / buffer.sampleRate
  };
}
