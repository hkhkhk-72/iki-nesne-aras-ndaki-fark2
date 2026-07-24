import type { EngineId, GameEngine } from './types';

const registry = new Map<EngineId, GameEngine>();

export function registerEngine<TPayload>(engine: GameEngine<TPayload>): void {
  registry.set(engine.id, engine as GameEngine);
}

export function getEngine(id: EngineId): GameEngine | undefined {
  return registry.get(id);
}

export function getAllEngines(): GameEngine[] {
  return Array.from(registry.values());
}

export function hasEngine(id: EngineId): boolean {
  return registry.has(id);
}
