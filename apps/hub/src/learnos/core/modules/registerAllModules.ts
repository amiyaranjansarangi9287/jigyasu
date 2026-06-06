// src/core/modules/registerAllModules.ts
import { moduleRegistry } from '../ModuleRegistry';
import { biologyModules } from './biology';
import { physicsModules } from './physics';
import { labModules } from './lab';
import { mathModules } from './math';

/**
 * Register all modules from all worlds into the ModuleRegistry.
 * Call this once at app startup (in main.tsx or App.tsx).
 */
export function registerAllModules(): void {
  moduleRegistry.registerBatch(biologyModules);
  moduleRegistry.registerBatch(physicsModules);
  moduleRegistry.registerBatch(labModules);
  moduleRegistry.registerBatch(mathModules);
}

/**
 * Get all modules for a specific world.
 */
export function getModulesByWorld(worldId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return moduleRegistry.getByWorld(worldId as any);
}

/**
 * Get a specific module by ID.
 */
export function getModuleById(id: string) {
  return moduleRegistry.get(id);
}

/**
 * Get registry stats for debugging.
 */
export function getRegistryStats() {
  return moduleRegistry.getStats();
}
