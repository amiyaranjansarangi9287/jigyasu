import { describe, it, expect, beforeEach } from 'vitest';
import { useLearnerStore } from '../store/learnerStore';

describe('learnerStore', () => {
  beforeEach(() => {
    const store = useLearnerStore.getState();
    store.resetProgress();
    useLearnerStore.setState({ language: 'en', currentWorld: null, visitedWorlds: [] });
  });

  it('should initialize with English language', () => {
    const store = useLearnerStore.getState();
    expect(store.language).toBe('en');
  });

  it('should set language', () => {
    const store = useLearnerStore.getState();
    store.setLanguage('hi');
    expect(useLearnerStore.getState().language).toBe('hi');
  });

  it('should enter world and track visited worlds', () => {
    const store = useLearnerStore.getState();
    store.enterWorld('lab');
    const state = useLearnerStore.getState();
    expect(state.currentWorld).toBe('lab');
    expect(state.visitedWorlds).toContain('lab');
  });

  it('should not duplicate visited worlds', () => {
    const store = useLearnerStore.getState();
    store.enterWorld('lab');
    store.enterWorld('lab');
    const state = useLearnerStore.getState();
    expect(state.visitedWorlds.filter(w => w === 'lab')).toHaveLength(1);
  });

  it('should track module progress', () => {
    const store = useLearnerStore.getState();
    store.updateModuleProgress('states-of-matter', {
      status: 'completed',
      attemptsCount: 3,
      timeSpentSeconds: 120,
    });
    const state = useLearnerStore.getState();
    expect(state.moduleProgress['states-of-matter'].status).toBe('completed');
    expect(state.moduleProgress['states-of-matter'].attemptsCount).toBe(3);
  });

  it('should increment sessions', () => {
    const store = useLearnerStore.getState();
    store.incrementSession();
    expect(useLearnerStore.getState().totalSessions).toBe(1);
  });

  it('should add time', () => {
    const store = useLearnerStore.getState();
    store.addTime(5);
    expect(useLearnerStore.getState().totalMinutes).toBe(5);
  });

  it('should reset progress', () => {
    const store = useLearnerStore.getState();
    store.updateModuleProgress('test-module', { status: 'completed' });
    store.incrementSession();
    store.addTime(10);
    store.resetProgress();
    const state = useLearnerStore.getState();
    expect(state.moduleProgress).toEqual({});
    expect(state.totalSessions).toBe(0);
    expect(state.totalMinutes).toBe(0);
  });
});
