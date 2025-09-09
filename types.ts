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

// FIX: Define RhythmNoteType and RhythmNote for the Alfaia trainer visualizer.
export type RhythmNoteType = 'ataque' | 'rebate' | 'flam';

export interface RhythmNote {
  type: RhythmNoteType;
  /** Absolute time in seconds from pattern start. If not provided, bar and beat must be. */
  time?: number;
  /** Bar number (1-indexed). Used if time is not provided. */
  bar?: number;
  /** Beat within the bar (1-indexed). Used if time is not provided. */
  beat?: number;
}
