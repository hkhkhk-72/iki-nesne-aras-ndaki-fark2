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
  | 'edu.subitize'
  | 'edu.partWhole'
  | 'edu.visualCompare'
  | 'edu.grouping';

export interface EduToken {
  id: EduTokenId;
  concept: string;
  /** Önce sezgi, sonra sayı */
  phase: 'intuition' | 'count' | 'bond';
  mebHint: string;
  /** MB-LAB-001 kural köprüsü */
  labRule?: 'MB-268' | 'MB-269' | 'MB-270' | 'MB-271' | 'MB-272';
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
    mebHint: 'Perceptual subitizing — 1–4 saymadan',
    labRule: 'MB-269',
  },
  'edu.partWhole': {
    id: 'edu.partWhole',
    concept: 'parca_butun',
    phase: 'intuition',
    mebHint: 'Conceptual subitizing — parçadan bütüne',
    labRule: 'MB-270',
  },
  'edu.visualCompare': {
    id: 'edu.visualCompare',
    concept: 'gorsel_karsilastirma',
    phase: 'intuition',
    mebHint: 'Görerek karşılaştır — saymadan',
    labRule: 'MB-268',
  },
  'edu.grouping': {
    id: 'edu.grouping',
    concept: 'alt_grup',
    phase: 'intuition',
    mebHint: '5+ doğal kümeler (3+2, 4+1…)',
    labRule: 'MB-270',
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
