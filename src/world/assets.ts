/**
 * Asset Bible kimlikleri — LS-006 Trust paketi.
 * Gerçek bitmap/Lottie dosyaları Scene Kit’te bağlanır; burada ID sözleşmesi.
 */

export type AssetId =
  | 'AN006'
  | 'AN007'
  | 'FX010'
  | 'SFX006';

export interface AssetRef {
  id: AssetId;
  name: string;
  kind: 'animation' | 'fx' | 'sfx';
  /** LS / sahne kullanımı */
  usedBy: string[];
}

export const ASSETS: Record<AssetId, AssetRef> = {
  AN006: {
    id: 'AN006',
    name: 'Small Smile',
    kind: 'animation',
    usedBy: ['LS-006', 'FindikSmile'],
  },
  AN007: {
    id: 'AN007',
    name: 'Small Nod',
    kind: 'animation',
    usedBy: ['LS-006', 'TrustReaction'],
  },
  FX010: {
    id: 'FX010',
    name: 'Warm Glow',
    kind: 'fx',
    usedBy: ['LS-006', 'TrustReaction', 'DecisionRipple'],
  },
  SFX006: {
    id: 'SFX006',
    name: 'Soft Bell',
    kind: 'sfx',
    usedBy: ['LS-006'],
  },
};

export const LS006_ASSETS = [ASSETS.AN006, ASSETS.AN007, ASSETS.FX010, ASSETS.SFX006] as const;
