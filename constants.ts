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
    artist: "Malungos do Interior",
    bpm: 120,
    timeSignature: [4, 4],
    tracks: [
      { id: 1, instrument: "Alfaia", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/baoba-ancestral/%5Bbaoba-ancestral%5Dalfaia.mp3' },
      { id: 2, instrument: "Backing Vocals", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/baoba-ancestral/%5Bbaoba-ancestral%5Dbacking%20vocals.mp3' },
      { id: 3, instrument: "Baixo", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/baoba-ancestral/%5Bbaoba-ancestral%5Dbaixo.mp3' },
      { id: 4, instrument: "Berimbau", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/baoba-ancestral/%5Bbaoba-ancestral%5Dberimbau.mp3' },
      { id: 5, instrument: "Caixas", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/baoba-ancestral/%5Bbaoba-ancestral%5Dcaixas.mp3' },
      { id: 6, instrument: "Caxixi", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/baoba-ancestral/%5Bbaoba-ancestral%5Dcaxixi.mp3' },
      { id: 7, instrument: "Conga", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/baoba-ancestral/%5Bbaoba-ancestral%5Dconga.mp3' },
      { id: 8, instrument: "Cowbell", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/baoba-ancestral/%5Bbaoba-ancestral%5Dcowbell.mp3' },
      { id: 9, instrument: "Guitarra Clean", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/baoba-ancestral/%5Bbaoba-ancestral%5Dguitas%20clean.mp3' },
      { id: 10, instrument: "Guitarra Distorcida", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/baoba-ancestral/%5Bbaoba-ancestral%5Dguitas%20dist.mp3' },
      { id: 11, instrument: "Participação", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/baoba-ancestral/%5Bbaoba-ancestral%5Dparticipa%C3%A7%C3%A3o.mp3' },
      { id: 12, instrument: "Pratos", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/baoba-ancestral/%5Bbaoba-ancestral%5Dpratos.mp3' },
      { id: 13, instrument: "Triângulo", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/baoba-ancestral/%5Bbaoba-ancestral%5Dtri%C3%A2ngulo.mp3' },
      { id: 14, instrument: "Violões", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/baoba-ancestral/%5Bbaoba-ancestral%5Dviol%C3%B5es.mp3' },
      { id: 15, instrument: "Xequerê 1", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/baoba-ancestral/%5Bbaoba-ancestral%5Dxequere-1.mp3' },
      { id: 16, instrument: "Xequerê 2", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/baoba-ancestral/%5Bbaoba-ancestral%5Dxequere-2.mp3' },
    ],
  },
  {
    id: 2,
    name: "Batuque de Malungo",
    artist: "Malungos do Interior",
    bpm: 135,
    timeSignature: [4, 4],
    tracks: [
        { id: 1, instrument: "Agogô", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dagogo.mp3' },
        { id: 2, instrument: "Alfaia", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dalfaia.mp3' },
        { id: 3, instrument: "Backing Vocals", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dbacking%20vocals.mp3' },
        { id: 4, instrument: "Baixo", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dbaixo.mp3' },
        { id: 5, instrument: "Berimbau", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dberimbau.mp3' },
        { id: 6, instrument: "Bomb", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dbomb.mp3' },
        { id: 7, instrument: "Caixa", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dcaixa.mp3' },
        { id: 8, instrument: "Conga", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dconga.mp3' },
        { id: 9, instrument: "Guitarra Distorcida", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dguitas%20%20dist.mp3' },
        { id: 10, instrument: "Guitarra Clean", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dguitas%20clean.mp3' },
        { id: 11, instrument: "Nzila", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dnzila.mp3' },
        { id: 12, instrument: "Palmas", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dpalmas.mp3' },
        { id: 13, instrument: "Pandeiro", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dpandeiro.mp3' },
        { id: 14, instrument: "Violões", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dviol%C3%B5es.mp3' },
        { id: 15, instrument: "Woosh", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dwoosh.mp3' },
        { id: 16, instrument: "Xequerê 1", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dxequer%C3%AA%201.mp3' },
        { id: 17, instrument: "Xequerê 2", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/batuque-de-malungo/%5Bbatuque-de-malungo%5Dxequer%C3%AA%202.mp3' },
    ],
  },
  {
    id: 3,
    name: "Pé de Coco",
    artist: "Malungos do Interior",
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
    artist: "Malungos do Interior",
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
    artist: "Malungos do Interior",
    bpm: 80,
    timeSignature: [3, 4],
    tracks: [
        { id: 1, instrument: "Alfaia", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dalfaia.mp3' },
        { id: 2, instrument: "Backing Vocals", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dbackings%20vocals.mp3' },
        { id: 3, instrument: "Baixo", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dbaixo.mp3' },
        { id: 4, instrument: "Caixa", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dcaixa.mp3' },
        { id: 5, instrument: "Conga", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dconga.mp3' },
        { id: 6, instrument: "Cowbell", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dcowbell.mp3' },
        { id: 7, instrument: "Guitarra Clean", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dguitas%20clean.mp3' },
        { id: 8, instrument: "Guitarra Distorcida", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dguitas%20dist.mp3' },
        { id: 9, instrument: "Sintetizador", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dsinth.mp3' },
        { id: 10, instrument: "Triângulo", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dtriangulo.mp3' },
        { id: 11, instrument: "Violões", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dvioloes.mp3' },
        { id: 12, instrument: "Xequerê 1", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dxequere%201.mp3' },
        { id: 13, instrument: "Xequerê 2", path: 'https://raw.githubusercontent.com/BesouroLAB/albumsankofa/main/a-escolha-e-nossa/%5Ba-escolha-e-nossa%5Dxequere%202.mp3' },
    ],
  },
];