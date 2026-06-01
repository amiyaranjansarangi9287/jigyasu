// src/test/moduleRegistry.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { moduleRegistry } from '../core/ModuleRegistry';
import { registerAllModules, getModulesByWorld, getModuleById, getRegistryStats } from '../core/modules';

describe('ModuleRegistry', () => {
  beforeEach(() => {
    // Clear and re-register before each test
    registerAllModules();
  });

  it('should register all modules', () => {
    const stats = getRegistryStats();
    expect(stats.total).toBeGreaterThan(100);
    expect(stats.enabled).toBe(stats.total);
  });

  it('should return modules by world', () => {
    const biologyModules = getModulesByWorld('biology');
    const physicsModules = getModulesByWorld('physics');
    const labModules = getModulesByWorld('lab');
    const mathModules = getModulesByWorld('math');

    expect(biologyModules.length).toBe(26);
    expect(physicsModules.length).toBe(39);
    expect(labModules.length).toBe(41);
    expect(mathModules.length).toBe(9);
  });

  it('should get a specific module by ID', () => {
    const module = getModuleById('cell-map');
    expect(module).toBeDefined();
    expect(module?.id).toBe('cell-map');
    expect(module?.worldId).toBe('biology');
    expect(module?.title).toBe('Cell Explorer');
  });

  it('should return undefined for non-existent module', () => {
    const module = getModuleById('non-existent-module');
    expect(module).toBeUndefined();
  });

  it('should have correct paths for all modules', () => {
    const allModules = moduleRegistry.getAll();
    for (const mod of allModules) {
      expect(mod.path).toBeTruthy();
      expect(mod.path.startsWith('/')).toBe(true);
    }
  });

  it('should have unique IDs within each world', () => {
    const worlds = ['biology', 'physics', 'lab', 'math'];
    for (const world of worlds) {
      const modules = getModulesByWorld(world);
      const ids = modules.map(m => m.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    }
  });

  it('should have estimated minutes for all modules', () => {
    const allModules = moduleRegistry.getAll();
    for (const mod of allModules) {
      expect(mod.estimatedMinutes).toBeGreaterThan(0);
    }
  });

  it('should have valid emoji for all modules', () => {
    const allModules = moduleRegistry.getAll();
    for (const mod of allModules) {
      expect(mod.emoji).toBeTruthy();
      expect(mod.emoji.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('should support feature flags', () => {
    moduleRegistry.setFeatureFlag('test-flag', true);
    expect(moduleRegistry.getFeatureFlag('test-flag')).toBe(true);
    expect(moduleRegistry.getFeatureFlag('non-existent-flag')).toBe(false);
  });

  it('should check prerequisites correctly', () => {
    // Module without prerequisites should always pass
    expect(moduleRegistry.hasPrerequisites('cell-map', [])).toBe(true);
    // Module with prerequisites
    expect(moduleRegistry.hasPrerequisites('cell-map', ['some-prereq'])).toBe(true);
  });

  it('should get next module in sequence', () => {
    const biologyModules = getModulesByWorld('biology');
    if (biologyModules.length > 1) {
      const first = biologyModules[0];
      const next = moduleRegistry.getNextModule(first.id, []);
      // Next module should exist if there are more modules
      if (biologyModules.length > 1) {
        expect(next).toBeDefined();
      }
    }
  });

  it('should return stats by world', () => {
    const stats = getRegistryStats();
    expect(stats.byWorld.biology).toBe(26);
    expect(stats.byWorld.physics).toBe(39);
    expect(stats.byWorld.lab).toBe(41);
    expect(stats.byWorld.math).toBe(9);
  });

  it('should hide modules marked as hidden', () => {
    // Register a test module with hidden: true
    moduleRegistry.register({
      id: 'hidden-test',
      worldId: 'lab',
      title: 'Hidden Module',
      description: 'This should be hidden',
      emoji: '🙈',
      color: 'from-gray-500 to-slate-500',
      bgColor: 'bg-gray-50',
      path: '/lab/hidden-test',
      hidden: true,
    });

    // Should not appear in visible list
    const visibleModules = moduleRegistry.getVisibleByWorld('lab');
    expect(visibleModules.find(m => m.id === 'hidden-test')).toBeUndefined();

    // Should still appear in full list
    const allModules = moduleRegistry.getByWorld('lab');
    expect(allModules.find(m => m.id === 'hidden-test')).toBeDefined();
  });

  it('should surface coming soon modules separately', () => {
    // Register a test module with comingSoon: true
    moduleRegistry.register({
      id: 'coming-soon-test',
      worldId: 'physics',
      title: 'Coming Soon Module',
      description: 'This is coming soon',
      emoji: '🚀',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      path: '/physics/coming-soon-test',
      comingSoon: true,
    });

    const comingSoonModules = moduleRegistry.getComingSoonByWorld('physics');
    expect(comingSoonModules.find(m => m.id === 'coming-soon-test')).toBeDefined();

    // Should still appear in visible list (comingSoon doesn't hide)
    const visibleModules = moduleRegistry.getVisibleByWorld('physics');
    expect(visibleModules.find(m => m.id === 'coming-soon-test')).toBeDefined();
  });

  it('should return all visible modules across worlds', () => {
    const allVisible = moduleRegistry.getAllVisible();
    const allEnabled = moduleRegistry.getAll();

    // Visible should be <= enabled (hidden modules are excluded)
    expect(allVisible.length).toBeLessThanOrEqual(allEnabled.length);
  });
});
