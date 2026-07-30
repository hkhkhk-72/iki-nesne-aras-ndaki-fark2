/**
 * Audio Tokens — sahne başına en fazla 4 katman.
 * MBA-BENCHMARK-001: ambient doğa; buzzer / error alarm / loud rewards yasak.
 */

import {
  ALLOWED_AMBIENT_NATURE,
  FORBIDDEN_AUDIO,
} from '@/benchmark/standards';

export type AudioLayer = 'ambient' | 'character' | 'interaction' | 'success';

export interface AudioBudget {
  ambient: string;
  character: string;
  interaction: string;
  success: string;
}

/** GRS-001 / LS-001 — İlk Bakış varsayılan ses bütçesi. */
export const audioGrs001: AudioBudget = {
  ambient: 'ruzgar_yaprak',
  character: 'findik_nefes_selam',
  interaction: 'yardim_dokunus',
  success: 'yaprak_yildiz',
};

export const audioLayerLimit = 4 as const;

/** Benchmark — izinli doğa ambient kategorileri. */
export const audioAmbientNature = ALLOWED_AMBIENT_NATURE;

/** Benchmark — yasaklı ses kalıpları. */
export const audioForbidden = FORBIDDEN_AUDIO;

/** Soft success — yüksek sesli ödül değil; yaprak/zil düzeyinde. */
export const softSuccessSounds = [
  'yaprak_yildiz',
  'hafif_yildiz',
  'SFX006_soft_bell',
  'basari_yildiz',
  'esit_isik',
  'artan_isik',
  'gozlem_tik',
  'sepet_doluyor',
  'kutlama_yildiz',
] as const;
