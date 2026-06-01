import { describe, it, expect, beforeEach } from 'vitest';
import { useLearnerStore } from '../store/learnerStore';

describe('continue learning', () => {
  beforeEach(() => {
    const store = useLearnerStore.getState();
    store.resetProgress();
    useLearnerStore.setState({
      language: 'en',
      currentWorld: null,
      visitedWorlds: [],
      lastModule: null,
      lastModulePath: null,
      lastModuleWorld: null,
    });
  });

  it('should return null when no last module', () => {
    const store = useLearnerStore.getState();
    expect(store.getLastModule()).toBeNull();
  });

  it('should store and retrieve last module', () => {
    const store = useLearnerStore.getState();
    store.enterModule('states-of-matter', 'states-of-matter', 'lab');
    const last = store.getLastModule();
    expect(last).not.toBeNull();
    expect(last?.moduleId).toBe('states-of-matter');
    expect(last?.path).toBe('states-of-matter');
    expect(last?.world).toBe('lab');
  });

  it('should update last module on new entry', () => {
    const store = useLearnerStore.getState();
    store.enterModule('states-of-matter', 'states-of-matter', 'lab');
    store.enterModule('gravity', 'gravity', 'lab');
    const last = store.getLastModule();
    expect(last?.moduleId).toBe('gravity');
  });

  it('should clear last module on reset', () => {
    const store = useLearnerStore.getState();
    store.enterModule('solar-system', 'solar-system', 'lab');
    store.resetProgress();
    expect(store.getLastModule()).toBeNull();
  });
});
