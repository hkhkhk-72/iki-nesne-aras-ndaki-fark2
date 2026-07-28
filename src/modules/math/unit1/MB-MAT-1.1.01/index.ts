import type { MicroExperience } from '@/mes/types';
import { scenes } from './scenes';

/**
 * MB-MAT-1.1.01 — Fındık Sincap'ın Kış Hazırlığı
 *
 * MiniBilge'nin referans mikro deneyimidir. Sonraki tüm dersler bu kalite
 * çıtasına göre üretilir.
 *
 * Mikro Deneyim 01 "İlk Bakış" — bağ (matematik yok).
 * Mikro Deneyim 02 "İki Ağaç" — sezgisel "daha fazla" (Karar 231).
 *
 * Kazanım köprüsü: MAT.1.1.1 — Nesne gruplarını azlık-çokluk ve eşitlik
 * bakımından karşılaştırır (out-1-1-1).
 */
export const MB_MAT_1_1_01: MicroExperience = {
  code: 'MB-MAT-1.1.01',
  title: "Fındık Sincap'ın Kış Hazırlığı",
  subject: 'math',
  grade: 1,
  unitId: 'unit-1-1',
  outcomeId: 'out-1-1-1',

  storyGoal: "Fındık'ın kışa hazırlanmasına yardım etmek",
  learningGoal: 'Az, çok ve eşit kavramlarını birebir eşleştirme üzerinden kazandırmak',

  location: 'kesif_ormani',
  characters: ['findik', 'bilge'],
  scenes,

  pdfOutputs: [
    { kind: 'etkinlik', title: 'Palamutları Karşılaştır', difficulty: 'kolay', concept: 'az_cok_esit' },
    { kind: 'boyama', title: 'Fındık ve Kovaları Boya', difficulty: 'kolay', concept: 'az_cok_esit' },
    { kind: 'kes_yapistir', title: 'Palamutları Eşleştir ve Yapıştır', difficulty: 'orta', concept: 'birebir_eslestirme' },
    { kind: 'coktan_secmeli', title: 'Hangi Kovada Daha Çok?', difficulty: 'orta', concept: 'daha_cok' },
    { kind: 'bosluk_doldurma', title: 'Az mı Çok mu Eşit mi?', difficulty: 'orta', concept: 'az_cok_esit' },
    { kind: 'dogru_yanlis', title: 'Kovalar Eşit mi?', difficulty: 'kolay', concept: 'esit' },
    { kind: 'cizgi_calismasi', title: 'Palamutları Çizgiyle Eşle', difficulty: 'kolay', concept: 'birebir_eslestirme' },
    { kind: 'ev_etkinligi', title: 'Mutfakta Az-Çok Oyunu', difficulty: 'kolay', concept: 'az_cok_esit' },
    { kind: 'veli_etkinligi', title: 'Veli Rehberi: Karşılaştırma Sohbeti', difficulty: 'kolay', concept: 'az_cok_esit' },
    { kind: 'ogretmen_etkinligi', title: 'Sınıf İçi Birebir Eşleştirme Atölyesi', difficulty: 'orta', concept: 'birebir_eslestirme' },
  ],

  totalSeconds: scenes.reduce((sum, s) => sum + s.estimatedSeconds, 0),
};
