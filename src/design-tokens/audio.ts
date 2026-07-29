/**
 * Audio Tokens — sahne başına en fazla 4 katman.
 */

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
