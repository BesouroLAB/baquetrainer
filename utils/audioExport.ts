import { TrackState } from '../types';

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

  // 6. Converter para WAV
  const wavBlob = audioBufferToWav(renderedBuffer);

  // 7. Disparar o download
  const url = URL.createObjectURL(wavBlob);
  const a = document.createElement('a');
  a.href = url;
  
  // Formatar o nome do arquivo
  const safeName = songName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  a.download = `${safeName}_mix.wav`;
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  
  const dataSize = buffer.length * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;
  
  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);
  
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, totalSize - 8, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);
  
  const channelData = [];
  for (let i = 0; i < numChannels; i++) {
    channelData.push(buffer.getChannelData(i));
  }
  
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      let sample = channelData[channel][i];
      // Clamp
      sample = Math.max(-1, Math.min(1, sample));
      // Scale to 16-bit integer
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, sample, true);
      offset += 2;
    }
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' });
}
