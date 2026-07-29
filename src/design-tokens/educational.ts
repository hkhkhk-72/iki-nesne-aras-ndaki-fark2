/**
 * Educational Tokens — perde arkası öğrenme hedefleri.
 * Çocuğa gösterilmez; sahne/AI/PDF köprüsüdür.
 */

export type EduTokenId =
  | 'edu.compare'
  | 'edu.count'
  | 'edu.pair'
  | 'edu.more'
  | 'edu.less'
  | 'edu.equal'
  | 'edu.bond'
  | 'edu.subitize';

export interface EduToken {
  id: EduTokenId;
  concept: string;
  /** Önce sezgi, sonra sayı */
  phase: 'intuition' | 'count' | 'bond';
  mebHint: string;
}

export const eduTokens: Record<EduTokenId, EduToken> = {
  'edu.bond': {
    id: 'edu.bond',
    concept: 'duygusal_bag',
    phase: 'bond',
    mebHint: 'Matematik kelimesi yok; güven ve merak',
  },
  'edu.subitize': {
    id: 'edu.subitize',
    concept: 'anlik_miktar',
    phase: 'intuition',
    mebHint: 'Saymadan miktarı görme',
  },
  'edu.compare': {
    id: 'edu.compare',
    concept: 'karsilastirma',
    phase: 'intuition',
    mebHint: 'Az / çok / eşit sezgisi',
  },
  'edu.count': {
    id: 'edu.count',
    concept: 'birebir_sayma',
    phase: 'count',
    mebHint: 'Dokunarak birebir sayma',
  },
  'edu.pair': {
    id: 'edu.pair',
    concept: 'birebir_eslestirme',
    phase: 'intuition',
    mebHint: 'Artan taraf sezdirir',
  },
  'edu.more': {
    id: 'edu.more',
    concept: 'daha_cok',
    phase: 'intuition',
    mebHint: 'Daha fazla / daha çok',
  },
  'edu.less': {
    id: 'edu.less',
    concept: 'daha_az',
    phase: 'intuition',
    mebHint: 'Daha az',
  },
  'edu.equal': {
    id: 'edu.equal',
    concept: 'esit',
    phase: 'intuition',
    mebHint: 'Eşit — artan yok',
  },
};
