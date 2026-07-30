/**
 * Asset Bible kimlikleri — LS-006 Trust + LS-011 prep.
 * Gerçek bitmap/Lottie dosyaları Scene Kit’te bağlanır; burada ID sözleşmesi.
 */

export type AssetId =
  | 'AN006'
  | 'AN007'
  | 'AN008'
  | 'FX010'
  | 'FX011'
  | 'SFX006';

export interface AssetRef {
  id: AssetId;
  name: string;
  kind: 'animation' | 'fx' | 'sfx';
  /** LS / sahne kullanımı */
  usedBy: string[];
  /** Ürün adı / alias (ör. FX_soft_bounce). */
  alias?: string;
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
  /** LS-011 prep — idle derin nefes (5 sn hareketsizlik). */
  AN008: {
    id: 'AN008',
    name: 'Deep Breath',
    kind: 'animation',
    usedBy: ['LS-011-prep', 'FindikDeepBreath', 'anim.deep_breath'],
    alias: 'anim.deep_breath',
  },
  FX010: {
    id: 'FX010',
    name: 'Warm Glow',
    kind: 'fx',
    usedBy: ['LS-006', 'TrustReaction', 'DecisionRipple'],
  },
  /** LS-011 prep — palamut dokunuşunda hafif yaylanma. */
  FX011: {
    id: 'FX011',
    name: 'Soft Bounce',
    kind: 'fx',
    usedBy: ['LS-011-prep', 'SoftBounce'],
    alias: 'FX_soft_bounce',
  },
  SFX006: {
    id: 'SFX006',
    name: 'Soft Bell',
    kind: 'sfx',
    usedBy: ['LS-006'],
  },
};

export const LS006_ASSETS = [ASSETS.AN006, ASSETS.AN007, ASSETS.FX010, ASSETS.SFX006] as const;

/** LS-011 hazırlık varlıkları (gameplay yok). */
export const LS011_PREP_ASSETS = [ASSETS.AN008, ASSETS.FX011] as const;

/** Ürün adı → asset (FX_soft_bounce). */
export const FX_soft_bounce = ASSETS.FX011;

/** Soft bounce ölçek eğrisi — ürün spesifikasyonu. */
export const FX_SOFT_BOUNCE_SPEC = {
  scaleFrom: 1.0,
  scalePeak: 1.04,
  scaleTo: 1.0,
  durationMs: 200,
  /** Ürün: easeOutQuad */
  easing: 'easeOutQuad' as const,
  trigger: 'touch_object' as const,
} as const;

/** Idle derin nefes — 5 sn hareketsizlik sonrası. */
export const DEEP_BREATH_IDLE_AFTER_MS = 5000;

/** anim.deep_breath davranış sözleşmesi. */
export const DEEP_BREATH_SPEC = {
  idleAfterMs: DEEP_BREATH_IDLE_AFTER_MS,
  inhaleMs: 1100,
  exhaleMs: 1100,
  /** Çok küçük omuz / göğüs hareketi (GPU-dostu scale). */
  shoulderLift: 2,
  chestScalePeak: 1.035,
  bodyScalePeak: 1.02,
} as const;
