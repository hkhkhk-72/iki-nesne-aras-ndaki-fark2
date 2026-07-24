/**
 * MiniBilge Matematik – Çekirdek Tip Tanımları
 * Oyun motorları ve içerik sistemi arasındaki sözleşmeler.
 */

import type React from 'react';

export type Grade = 1 | 2 | 3 | 4;

export type ActivityMode =
  | 'learn'
  | 'play'
  | 'explore'
  | 'experiment'
  | 'real_life'
  | 'home'
  | 'classroom'
  | 'smartboard'
  | 'teacher'
  | 'ai_reinforcement'
  | 'pdf'
  | 'challenge'
  | 'collection';

export type EngineId =
  | 'lesson'
  | 'matching'
  | 'drag_drop'
  | 'comparison'
  | 'balloon_pop'
  | 'memory_card'
  | 'puzzle'
  | 'story'
  | 'mission';

export interface EngineResult {
  correct: number;
  total: number;
  score: number;
  timeSpentMs: number;
  mistakes: string[];
  completed: boolean;
}

export interface EngineProps<TPayload = unknown> {
  payload: TPayload;
  mode: ActivityMode;
  onComplete: (result: EngineResult) => void;
  onProgress?: (progress: number) => void;
}

export interface GameEngine<TPayload = unknown> {
  id: EngineId;
  name: string;
  description: string;
  Component: React.ComponentType<EngineProps<TPayload>>;
}

export interface ActivityConfig {
  id: string;
  mode: ActivityMode;
  engineId: EngineId;
  title: string;
  description: string;
  icon: string;
  estimatedMinutes: number;
  payload: unknown;
  unlocked: boolean;
}

export interface LessonSlide {
  title: string;
  body: string;
  visual: string;
  tip?: string;
}

export interface LessonPayload {
  title: string;
  code: string;
  grade: Grade;
  durationMinutes: number;
  slides: LessonSlide[];
  keyPoints: string[];
  realLifeExample: string;
  practicePrompt: string;
}

export interface LearningOutcome {
  id: string;
  code: string;
  title: string;
  description: string;
  grade: Grade;
  unitId: string;
  order: number;
  icon: string;
  color: string;
  realLifeContexts: string[];
  activities: ActivityConfig[];
  prerequisites: string[];
  lesson: LessonPayload;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  grade: Grade;
  order: number;
  icon: string;
  color: string;
  outcomeIds: string[];
}

export interface GradeCurriculum {
  grade: Grade;
  title: string;
  units: Unit[];
  outcomes: LearningOutcome[];
}

export interface StudentProgress {
  outcomeId: string;
  activityId: string;
  completed: boolean;
  score: number;
  attempts: number;
  lastPlayedAt: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  grade: Grade;
  avatar: string;
  progress: StudentProgress[];
  collections: string[];
  totalStars: number;
}

export interface SmartboardDuelConfig {
  questionCount: number;
  timePerQuestion?: number;
  teamMode: boolean;
}

export type ComparisonSymbol = 'more' | 'less' | 'equal';

export interface ComparisonItem {
  id?: string;
  label?: string;
  count: number;
  image?: string;
  emoji?: string;
}

export interface ComparisonPayload {
  instruction: string;
  left: ComparisonItem;
  right: ComparisonItem;
  correctAnswer: ComparisonSymbol;
  hint?: string;
  celebration?: string;
}

export interface MatchingPair {
  id: string;
  left: { text?: string; emoji?: string; image?: string };
  right: { text?: string; emoji?: string; image?: string };
}

export interface MatchingPayload {
  instruction: string;
  pairs: MatchingPair[];
  hint?: string;
}

export interface DragDropItem {
  id: string;
  content: string;
  emoji?: string;
}

export interface DragDropZone {
  id: string;
  label: string;
  accepts: string[];
}

export interface DragDropPayload {
  instruction: string;
  items: DragDropItem[];
  zones: DragDropZone[];
  correctMapping: Record<string, string>;
  hint?: string;
}
