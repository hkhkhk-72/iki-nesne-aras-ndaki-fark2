import { registerEngine } from '../core/engine-registry';
import { lessonEngine } from './lesson';
import { matchingEngine } from './matching';
import { dragDropEngine } from './drag-drop';
import { comparisonEngine } from './comparison';

let initialized = false;

export function initializeEngines(): void {
  if (initialized) return;
  registerEngine(lessonEngine);
  registerEngine(matchingEngine);
  registerEngine(dragDropEngine);
  registerEngine(comparisonEngine);
  initialized = true;
}
