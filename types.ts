
export enum InstrumentType {
  ALFAIA = 'Alfaia',
  CAIXA = 'Caixa',
  GONGUE = 'Gonguê',
  AGBE = 'Agbê',
  TIMBAU = 'Timbau',
  VOICE = 'Voz',
}

export interface Track {
  id: number;
  instrument: InstrumentType | string;
  path: string;
}

export interface Song {
  id: number;
  name: string;
  artist: string;
  bpm: number;
  timeSignature: [number, number];
  tracks: Track[];
}

export interface TrackState {
  id: number;
  instrument: InstrumentType | string;
  volume: number;
  isMuted: boolean;
  isSoloed: boolean;
}
