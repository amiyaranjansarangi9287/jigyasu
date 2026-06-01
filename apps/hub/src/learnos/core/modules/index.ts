// src/core/modules/index.ts
export { moduleRegistry } from '../ModuleRegistry';
export type { ModuleDef } from '../ModuleRegistry';
export { registerAllModules, getModulesByWorld, getModuleById, getRegistryStats } from './registerAllModules';
export { WorldRoutes, AllDynamicRoutes } from './DynamicRoutes';
export { biologyModules } from './biology';
export { physicsModules } from './physics';
export { labModules } from './lab';
export { mathModules } from './math';
