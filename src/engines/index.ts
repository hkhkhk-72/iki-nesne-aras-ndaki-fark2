import { registerEngine } from '../core/engine-registry';
import { matchingEngine } from './matching';
import { dragDropEngine } from './drag-drop';
import { comparisonEngine } from './comparison';

let initialized = false;

export function initializeEngines(): void {
  if (initialized) return;
  registerEngine(matchingEngine);
  registerEngine(dragDropEngine);
  registerEngine(comparisonEngine);
  initialized = true;
}
