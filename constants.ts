import type { Song } from './types';
import { InstrumentType } from './types';

// ====================================================================================
// ESTRATÉGIA DE ÁUDIO ATUALIZADA:
// Conforme solicitado, todos os links de demonstração foram removidos.
// O aplicativo agora só tentará carregar áudios com links diretos fornecidos pelo usuário.
// Instrumentos sem um 'path' serão silenciosos e não causarão erros.
// ====================================================================================

export const SONGS: Song[] = [
  {
    id: 1,
    name: "Baobá Ancestral",
    artist: "BaqueTrainer Demo",
    bpm: 120,
    timeSignature: [4, 4],
    tracks: [
      // ATENÇÃO: Forneça um link de áudio direto (hospedado no GitHub, Vercel, etc.)
      // O link do Google Drive não funciona por restrições de segurança (CORS).
      { id: 1, instrument: InstrumentType.ALFAIA, path: '' },
      { id: 2, instrument: InstrumentType.CAIXA, path: '' },
      { id: 3, instrument: InstrumentType.GONGUE, path: '' },
      { id: 4, instrument: InstrumentType.AGBE, path: '' },
    ],
  },
  {
    id: 2,
    name: "Batuque de Malungo",
    artist: "BaqueTrainer Demo",
    bpm: 135,
    timeSignature: [4, 4],
    tracks: [
      { id: 1, instrument: InstrumentType.ALFAIA, path: '' },
      { id: 2, instrument: InstrumentType.CAIXA, path: '' },
      { id: 3, instrument: InstrumentType.GONGUE, path: '' },
      { id: 4, instrument: InstrumentType.AGBE, path: '' },
      { id: 5, instrument: InstrumentType.TIMBAU, path: '' },
      { id: 6, instrument: InstrumentType.VOICE, path: '' },
    ],
  },
  {
    id: 3,
    name: "Pé de Coco",
    artist: "BaqueTrainer Demo",
    bpm: 110,
    timeSignature: [4, 4],
    tracks: [
      { id: 1, instrument: "Alfaia Marcante", path: '' },
      { id: 2, instrument: "Alfaia Repique", path: '' },
      { id: 3, instrument: InstrumentType.CAIXA, path: '' },
      { id: 4, instrument: InstrumentType.GONGUE, path: '' },
    ],
  },
  {
    id: 4,
    name: "Boia Fria",
    artist: "BaqueTrainer Demo",
    bpm: 95,
    timeSignature: [4, 4],
    tracks: [
        { id: 1, instrument: InstrumentType.ALFAIA, path: '' },
        { id: 2, instrument: InstrumentType.CAIXA, path: '' },
        { id: 3, instrument: InstrumentType.VOICE, path: '' },
    ],
  },
  {
    id: 5,
    name: "A Escolha é Nossa",
    artist: "Maracatu Aroeira",
    bpm: 80,
    timeSignature: [3, 4],
    tracks: [
        { id: 1, instrument: "Alfaia", path: 'https://raw.githubusercontent.com/BesouroLAB/baquetrainer/67b17b5e29b900623ef143275b1866c52e0adb77/audio/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dalfaia.mp3' },
        { id: 2, instrument: "Backing Vocals", path: 'https://raw.githubusercontent.com/BesouroLAB/baquetrainer/67b17b5e29b900623ef143275b1866c52e0adb77/audio/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dbackings-vocals.mp3' },
        { id: 3, instrument: "Baixo", path: 'https://raw.githubusercontent.com/BesouroLAB/baquetrainer/67b17b5e29b900623ef143275b1866c52e0adb77/audio/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dbaixo.mp3' },
        { id: 4, instrument: "Caixa", path: 'https://raw.githubusercontent.com/BesouroLAB/baquetrainer/67b17b5e29b900623ef143275b1866c52e0adb77/audio/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dcaixa.mp3' },
        { id: 5, instrument: "Conga", path: 'https://raw.githubusercontent.com/BesouroLAB/baquetrainer/67b17b5e29b900623ef143275b1866c52e0adb77/audio/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dconga.mp3' },
        { id: 6, instrument: "Cowbell", path: 'https://raw.githubusercontent.com/BesouroLAB/baquetrainer/67b17b5e29b900623ef143275b1866c52e0adb77/audio/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dcowbell.mp3' },
        { id: 7, instrument: "Guitarra Clean", path: 'https://raw.githubusercontent.com/BesouroLAB/baquetrainer/67b17b5e29b900623ef143275b1866c52e0adb77/audio/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dguitas-clean.mp3' },
        { id: 8, instrument: "Guitarra Distorcida", path: 'https://raw.githubusercontent.com/BesouroLAB/baquetrainer/67b17b5e29b900623ef143275b1866c52e0adb77/audio/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dguitas-dist.mp3' },
        { id: 9, instrument: "Sintetizador", path: 'https://raw.githubusercontent.com/BesouroLAB/baquetrainer/67b17b5e29b900623ef143275b1866c52e0adb77/audio/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dsinth.mp3' },
        { id: 10, instrument: "Triângulo", path: 'https://raw.githubusercontent.com/BesouroLAB/baquetrainer/67b17b5e29b900623ef143275b1866c52e0adb77/audio/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dtriangulo.mp3' },
        { id: 11, instrument: "Violões", path: 'https://raw.githubusercontent.com/BesouroLAB/baquetrainer/67b17b5e29b900623ef143275b1866c52e0adb77/audio/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dvioloes.mp3' },
        { id: 12, instrument: "Xequerê 1", path: 'https://raw.githubusercontent.com/BesouroLAB/baquetrainer/67b17b5e29b900623ef143275b1866c52e0adb77/audio/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dxequere-1.mp3' },
        { id: 13, instrument: "Xequerê 2", path: 'https://raw.githubusercontent.com/BesouroLAB/baquetrainer/67b17b5e29b900623ef143275b1866c52e0adb77/audio/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dxequere-2.mp3' },
    ],
  },
];