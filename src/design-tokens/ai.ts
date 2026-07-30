/**
 * AI Tokens — gözlem noktaları (puan üretmez).
 * MB-AI-001 ile hizalı.
 */

export type AiTokenId =
  | 'ai.first_touch'
  | 'ai.hesitation'
  | 'ai.wait'
  | 'ai.retry'
  | 'ai.help_request'
  | 'ai.effort'
  | 'ai.screen_dwell'
  | 'ai.audio_listen'
  | 'ai.first_success'
  | 'ai.decision_confidence'
  | 'ai.observe_pattern'
  | 'ai.subitize_attempt'
  | 'ai.grouping_strategy'
  | 'ai.visual_focus'
  | 'ai.reflection_time'
  /** LS-011 prep — karşılaştırma gözlemi v2 (anonim). */
  | 'ai.observe_compare_v2';

export interface AiToken {
  id: AiTokenId;
  signal: string;
  purpose: string;
}

export const aiTokens: Record<AiTokenId, AiToken> = {
  'ai.first_touch': {
    id: 'ai.first_touch',
    signal: 'touch_latency',
    purpose: 'İlk dokunuş gecikmesi — bağ / karar ritmi',
  },
  'ai.hesitation': {
    id: 'ai.hesitation',
    signal: 'hesitation',
    purpose: 'Kararsızlık — sessizlik veya bakış (Karar 237)',
  },
  'ai.wait': {
    id: 'ai.wait',
    signal: 'wait_time',
    purpose: 'Bekleme süresi',
  },
  'ai.retry': {
    id: 'ai.retry',
    signal: 'retry_count',
    purpose: 'Tekrar — yardım basamağı',
  },
  'ai.help_request': {
    id: 'ai.help_request',
    signal: 'help_request',
    purpose: 'Açık yardım isteği',
  },
  'ai.effort': {
    id: 'ai.effort',
    signal: 'success_trend',
    purpose: 'Çaba / süreç övgüsü (Karar 239)',
  },
  'ai.screen_dwell': {
    id: 'ai.screen_dwell',
    signal: 'screen_dwell',
    purpose: 'Ekranı inceleme — İlk Bakış',
  },
  'ai.audio_listen': {
    id: 'ai.audio_listen',
    signal: 'audio_listen',
    purpose: 'Ses dinleme süresi',
  },
  'ai.first_success': {
    id: 'ai.first_success',
    signal: 'first_success',
    purpose: 'Modüldeki ilk anlamlı başarı — güven anı (puan yok)',
  },
  'ai.decision_confidence': {
    id: 'ai.decision_confidence',
    signal: 'decision_confidence',
    purpose: 'Karar güveni — tereddüt vs akıcı seçim',
  },
  'ai.observe_pattern': {
    id: 'ai.observe_pattern',
    signal: 'observe_pattern',
    purpose: 'Gözlem örüntüsü — nereye / ne kadar bakıldı',
  },
  'ai.subitize_attempt': {
    id: 'ai.subitize_attempt',
    signal: 'subitize_attempt',
    purpose: 'Saymadan miktar hissi denemesi (1–4)',
  },
  'ai.grouping_strategy': {
    id: 'ai.grouping_strategy',
    signal: 'grouping_strategy',
    purpose: '5+ alt grup stratejisi (3+2, 4+1…)',
  },
  'ai.visual_focus': {
    id: 'ai.visual_focus',
    signal: 'visual_focus',
    purpose: 'Görsel odak — hangi kümeye bakıldı',
  },
  'ai.reflection_time': {
    id: 'ai.reflection_time',
    signal: 'reflection_time',
    purpose: 'Düşünme süresi — hızdan değerli (Karar 273)',
  },
  'ai.observe_compare_v2': {
    id: 'ai.observe_compare_v2',
    signal: 'observe_compare_v2',
    purpose:
      'Karşılaştırma v2 — ilk bakılan / ilk dokunulan grup, karar süresi, ' +
      'yanlış dokunma sayısı, bekleme süresi (anonim)',
  },
};
