// src/core/ModuleRegistry.ts
// Central registry for all modules across worlds
// Enables dynamic feature flags, A/B testing, and runtime module management

import type { AgeGroup } from '../types/shared';

export interface ModuleDef {
  id: string;
  worldId: AgeGroup;
  title: string;
  description: string;
  emoji: string;
  color: string;
  bgColor: string;
  path: string;
  minAge?: number;
  maxAge?: number;
  prerequisites?: string[];
  estimatedMinutes?: number;
  featureFlag?: string;
  enabled?: boolean;
  contentVersion?: string;
  hidden?: boolean; // Hide from UI (e.g., incomplete modules)
  comingSoon?: boolean; // Show as "coming soon" in UI
}

class ModuleRegistry {
  // Use composite key `${worldId}:${id}` to avoid conflicts between worlds
  private modules: Map<string, ModuleDef> = new Map();
  private featureFlags: Map<string, boolean> = new Map();

  private makeKey(worldId: string, id: string): string {
    return `${worldId}:${id}`;
  }

  register(module: ModuleDef): void {
    const key = this.makeKey(module.worldId, module.id);
    if (this.modules.has(key)) {
      console.warn(`[ModuleRegistry] Module ${key} already registered, overwriting`);
    }
    this.modules.set(key, {
      ...module,
      enabled: module.enabled ?? true,
      contentVersion: module.contentVersion ?? '1.0.0',
    });
  }

  registerBatch(modules: ModuleDef[]): void {
    for (const mod of modules) {
      this.register(mod);
    }
  }

  get(id: string): ModuleDef | undefined {
    // First try direct lookup (for backward compatibility)
    if (this.modules.has(id)) {
      return this.modules.get(id);
    }
    // Search all modules for matching id
    for (const mod of this.modules.values()) {
      if (mod.id === id) {
        return mod;
      }
    }
    return undefined;
  }

  getByWorld(worldId: AgeGroup): ModuleDef[] {
    return Array.from(this.modules.values()).filter(
      (m) => m.worldId === worldId && this.isModuleEnabled(m),
    );
  }

  /**
   * Get modules that should be visible in the UI (not hidden)
   */
  getVisibleByWorld(worldId: AgeGroup): ModuleDef[] {
    return this.getByWorld(worldId).filter((m) => !m.hidden);
  }

  /**
   * Get modules that are marked as "coming soon"
   */
  getComingSoonByWorld(worldId: AgeGroup): ModuleDef[] {
    return this.getByWorld(worldId).filter((m) => m.comingSoon);
  }

  getAll(): ModuleDef[] {
    return Array.from(this.modules.values()).filter((m) => this.isModuleEnabled(m));
  }

  /**
   * Get all visible modules (not hidden)
   */
  getAllVisible(): ModuleDef[] {
    return this.getAll().filter((m) => !m.hidden);
  }

  setFeatureFlag(flagName: string, enabled: boolean): void {
    this.featureFlags.set(flagName, enabled);
  }

  getFeatureFlag(flagName: string): boolean {
    return this.featureFlags.get(flagName) ?? false;
  }

  private isModuleEnabled(module: ModuleDef): boolean {
    if (module.enabled === false) return false;
    if (module.featureFlag) {
      return this.featureFlags.get(module.featureFlag) ?? true;
    }
    return true;
  }

  hasPrerequisites(moduleId: string, completedModules: string[]): boolean {
    const mod = this.get(moduleId);
    if (!mod || !mod.prerequisites) return true;
    return mod.prerequisites.every((p) => completedModules.includes(p));
  }

  getNextModule(
    currentModuleId: string,
    completedModules: string[],
  ): ModuleDef | undefined {
    const current = this.get(currentModuleId);
    if (!current) return undefined;

    const worldModules = this.getByWorld(current.worldId);
    const currentIndex = worldModules.findIndex((m) => m.id === currentModuleId);
    if (currentIndex === -1 || currentIndex === worldModules.length - 1) return undefined;

    // Find next module with satisfied prerequisites
    for (let i = currentIndex + 1; i < worldModules.length; i++) {
      const next = worldModules[i];
      if (this.hasPrerequisites(next.id, completedModules)) {
        return next;
      }
    }

    return undefined;
  }

  getStats(): { total: number; enabled: number; byWorld: Record<string, number> } {
    const all = Array.from(this.modules.values());
    const enabled = all.filter((m) => this.isModuleEnabled(m));
    const byWorld: Record<string, number> = {};

    for (const mod of enabled) {
      byWorld[mod.worldId] = (byWorld[mod.worldId] ?? 0) + 1;
    }

    return {
      total: all.length,
      enabled: enabled.length,
      byWorld,
    };
  }
}

export const moduleRegistry = new ModuleRegistry();
