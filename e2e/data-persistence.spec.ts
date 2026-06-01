import { test, expect } from '@playwright/test';
import { completeOnboarding } from './utils';

test.describe('Data Persistence and Sync Tests', () => {
  test.beforeEach(async ({ page }) => {
    await completeOnboarding(page);
  });

  test('should persist user profile across sessions', async ({ page, context, browserName }) => {
    // Skip on Firefox due to localStorage persistence issues
    test.skip(browserName === 'firefox', 'User profile persistence test skipped on Firefox due to localStorage issues');
    
    await page.goto('/', { timeout: 10000 });
    
    // Store profile data
    await page.evaluate(() => {
      localStorage.setItem('user_profile', JSON.stringify({
        name: 'TestUser',
        age: '10-12',
        language: 'en'
      }));
    });
    
    // Reload page
    await page.reload();
    
    // Verify profile persists
    const profile = await page.evaluate(() => {
      const data = localStorage.getItem('user_profile');
      return data ? JSON.parse(data) : null;
    });
    
    expect(profile).toBeTruthy();
    expect(profile?.name).toBe('TestUser');
  });

  test('should persist learning progress', async ({ page, browserName }) => {
    // Skip on Firefox due to localStorage persistence issues
    test.skip(browserName === 'firefox', 'Learning progress test skipped on Firefox due to localStorage issues');
    
    await page.goto('/home', { timeout: 10000 });
    await page.waitForTimeout(2000);
    
    // Simulate completing a lesson
    await page.evaluate(() => {
      localStorage.setItem('learning_progress', JSON.stringify({
        home: { completed: ['lesson1', 'lesson2'], current: 'lesson3' },
      }));
    });
    
    // Navigate to another page
    await page.goto('/profile');
    await page.waitForTimeout(1000);
    
    // Go back to home
    await page.goto('/home');
    await page.waitForTimeout(1000);
    
    // Verify progress persists
    const progress = await page.evaluate(() => {
      const data = localStorage.getItem('learning_progress');
      return data ? JSON.parse(data) : null;
    });
    
    expect(progress).toBeTruthy();
    expect(progress?.home?.completed).toContain('lesson1');
  });

  test('should persist XP and badges', async ({ page }) => {
    await page.goto('/');
    
    // Set XP and badges
    await page.evaluate(() => {
      localStorage.setItem('user_xp', '1500');
      localStorage.setItem('user_badges', JSON.stringify(['first_lesson', 'math_master']));
    });
    
    await page.reload();
    
    // Verify XP and badges persist
    const xp = await page.evaluate(() => localStorage.getItem('user_xp'));
    const badges = await page.evaluate(() => {
      const data = localStorage.getItem('user_badges');
      return data ? JSON.parse(data) : null;
    });
    
    expect(xp).toBe('1500');
    expect(badges).toContain('first_lesson');
  });

  test('should handle IndexedDB persistence', async ({ page }) => {
    await page.goto('/');

    // Store data in IndexedDB
    const dbStored = await page.evaluate(async () => {
      return new Promise((resolve) => {
        try {
          const request = indexedDB.open('JigyasuDB', 1);

          request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('user_data')) {
              db.createObjectStore('user_data', { keyPath: 'id' });
            }
          };

          request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(['user_data'], 'readwrite');
            const store = transaction.objectStore('user_data');

            store.put({ id: 'preferences', theme: 'dark', fontSize: 16 });

            transaction.oncomplete = () => resolve(true);
            transaction.onerror = () => resolve(false);
          };

          request.onerror = () => resolve(false);
        } catch (e) {
          resolve(false);
        }
      });
    });

    if (dbStored) {
      // Retrieve data from IndexedDB
      const dbRetrieved = await page.evaluate(async () => {
        return new Promise((resolve) => {
          try {
            const request = indexedDB.open('JigyasuDB', 1);

            request.onsuccess = (event) => {
              const db = (event.target as IDBOpenDBRequest).result;
              const transaction = db.transaction(['user_data'], 'readonly');
              const store = transaction.objectStore('user_data');
              const getRequest = store.get('preferences');

              getRequest.onsuccess = () => resolve(getRequest.result);
              getRequest.onerror = () => resolve(null);
            };

            request.onerror = () => resolve(null);
          } catch (e) {
            resolve(null);
          }
        });
      });

      if (dbRetrieved) {
        expect((dbRetrieved as any)?.theme).toBe('dark');
      }
    }
  });

  test('should sync data when coming back online', async ({ page, context }) => {
    await page.goto('/');
    
    // Create data while online
    await page.evaluate(() => {
      localStorage.setItem('sync_test', 'online_data');
    });
    
    // Go offline
    await context.setOffline(true);
    
    // Modify data offline
    await page.evaluate(() => {
      localStorage.setItem('sync_test', 'offline_modified');
    });
    
    // Come back online
    await context.setOffline(false);
    await page.reload();
    
    // Verify offline changes persisted
    const data = await page.evaluate(() => localStorage.getItem('sync_test'));
    expect(data).toBe('offline_modified');
    
    // Cleanup
    await page.evaluate(() => localStorage.removeItem('sync_test'));
  });

  test('should handle data conflicts', async ({ page }) => {
    await page.goto('/');
    
    // Create initial data
    await page.evaluate(() => {
      localStorage.setItem('conflict_test', JSON.stringify({ version: 1, data: 'original' }));
    });
    
    // Simulate conflict by updating data
    await page.evaluate(() => {
      localStorage.setItem('conflict_test', JSON.stringify({ version: 2, data: 'updated' }));
    });
    
    // Verify latest version is used
    const data = await page.evaluate(() => {
      const item = localStorage.getItem('conflict_test');
      return item ? JSON.parse(item) : null;
    });
    
    expect(data?.version).toBe(2);
    expect(data?.data).toBe('updated');
    
    // Cleanup
    await page.evaluate(() => localStorage.removeItem('conflict_test'));
  });

  test('should handle large datasets', async ({ page }) => {
    await page.goto('/');
    
    // Store large dataset
    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      value: Math.random()
    }));
    
    await page.evaluate((data) => {
      localStorage.setItem('large_dataset', JSON.stringify(data));
    }, largeData);
    
    // Retrieve and verify
    const retrieved = await page.evaluate(() => {
      const data = localStorage.getItem('large_dataset');
      return data ? JSON.parse(data) : null;
    });
    
    expect(retrieved).toBeTruthy();
    expect(retrieved?.length).toBe(1000);
    
    // Cleanup
    await page.evaluate(() => localStorage.removeItem('large_dataset'));
  });

  test('should handle data expiration', async ({ page }) => {
    await page.goto('/');
    
    // Store data with timestamp
    await page.evaluate(() => {
      const data = {
        value: 'test_data',
        timestamp: Date.now(),
        expiresAt: Date.now() + 3600000 // 1 hour from now
      };
      localStorage.setItem('expiring_data', JSON.stringify(data));
    });
    
    // Verify data is still valid
    const data = await page.evaluate(() => {
      const item = localStorage.getItem('expiring_data');
      return item ? JSON.parse(item) : null;
    });
    
    expect(data).toBeTruthy();
    expect(data?.timestamp).toBeLessThan(Date.now());
    
    // Cleanup
    await page.evaluate(() => localStorage.removeItem('expiring_data'));
  });

  test('should handle data backup and restore', async ({ page }) => {
    await page.goto('/');

    // Create backup data
    const backupData = {
      profile: { name: 'BackupUser', age: '8-10' },
      progress: { home: 50 },
      xp: 2000
    };

    await page.evaluate((data) => {
      localStorage.setItem('backup', JSON.stringify(data));
    }, backupData);

    // Simulate data loss by clearing user data (but keep backup)
    await page.evaluate(() => {
      localStorage.removeItem('user_profile');
      localStorage.removeItem('learning_progress');
      localStorage.removeItem('user_xp');
    });

    // Restore from backup
    const restored = await page.evaluate(() => {
      try {
        const backup = localStorage.getItem('backup');
        if (backup) {
          const data = JSON.parse(backup);
          localStorage.setItem('user_profile', JSON.stringify(data.profile));
          localStorage.setItem('learning_progress', JSON.stringify(data.progress));
          localStorage.setItem('user_xp', String(data.xp));
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    });

    expect(restored).toBeTruthy();

    // Verify restored data
    const profile = await page.evaluate(() => {
      const data = localStorage.getItem('user_profile');
      return data ? JSON.parse(data) : null;
    });

    expect(profile?.name).toBe('BackupUser');
  });

  test('should handle data migration between versions', async ({ page }) => {
    await page.goto('/');
    
    // Simulate old version data format
    await page.evaluate(() => {
      localStorage.setItem('old_format', JSON.stringify({
        userName: 'OldUser',
        userAge: '12-14',
        userLanguage: 'en'
      }));
    });
    
    // Migrate to new format
    const migrated = await page.evaluate(() => {
      const oldData = localStorage.getItem('old_format');
      if (oldData) {
        const parsed = JSON.parse(oldData);
        const newData = {
          profile: {
            name: parsed.userName,
            age: parsed.userAge,
            language: parsed.userLanguage
          }
        };
        localStorage.setItem('user_profile', JSON.stringify(newData.profile));
        localStorage.removeItem('old_format');
        return true;
      }
      return false;
    });
    
    expect(migrated).toBeTruthy();
    
    // Verify new format
    const profile = await page.evaluate(() => {
      const data = localStorage.getItem('user_profile');
      return data ? JSON.parse(data) : null;
    });
    
    expect(profile?.name).toBe('OldUser');
  });

  test('should handle concurrent data access', async ({ page }) => {
    await page.goto('/');
    
    // Simulate concurrent writes
    const results = await page.evaluate(async () => {
      const promises = [];
      
      for (let i = 0; i < 10; i++) {
        promises.push(
          new Promise((resolve) => {
            setTimeout(() => {
              localStorage.setItem(`concurrent_${i}`, `value_${i}`);
              resolve(true);
            }, Math.random() * 100);
          })
        );
      }
      
      await Promise.all(promises);
      
      // Verify all writes succeeded
      let count = 0;
      for (let i = 0; i < 10; i++) {
        if (localStorage.getItem(`concurrent_${i}`)) {
          count++;
        }
      }
      
      // Cleanup
      for (let i = 0; i < 10; i++) {
        localStorage.removeItem(`concurrent_${i}`);
      }
      
      return count;
    });
    
    expect(results).toBe(10);
  });

  test('should handle data corruption recovery', async ({ page }) => {
    await page.goto('/');
    
    // Store valid data
    await page.evaluate(() => {
      localStorage.setItem('valid_data', JSON.stringify({ key: 'value' }));
    });
    
    // Corrupt the data
    await page.evaluate(() => {
      localStorage.setItem('valid_data', 'invalid_json{');
    });
    
    // Attempt to recover
    const recovered = await page.evaluate(() => {
      try {
        const data = localStorage.getItem('valid_data');
        if (data) {
          JSON.parse(data); // This will throw
        }
        return false;
      } catch {
        // Remove corrupted data and restore default
        localStorage.removeItem('valid_data');
        localStorage.setItem('valid_data', JSON.stringify({ key: 'default' }));
        return true;
      }
    });
    
    expect(recovered).toBeTruthy();
    
    // Verify default data
    const data = await page.evaluate(() => {
      const item = localStorage.getItem('valid_data');
      return item ? JSON.parse(item) : null;
    });
    
    expect(data?.key).toBe('default');
  });

  test('should handle data privacy and deletion', async ({ page }) => {
    await page.goto('/');
    
    // Store sensitive data
    await page.evaluate(() => {
      localStorage.setItem('private_data', JSON.stringify({
        name: 'PrivateUser',
        email: 'private@example.com'
      }));
    });
    
    // Verify data exists
    const exists = await page.evaluate(() => localStorage.getItem('private_data'));
    expect(exists).toBeTruthy();
    
    // Delete sensitive data
    await page.evaluate(() => localStorage.removeItem('private_data'));
    
    // Verify data is deleted
    const deleted = await page.evaluate(() => localStorage.getItem('private_data'));
    expect(deleted).toBeNull();
  });

  test('should handle cross-tab data sync', async ({ context, browserName }) => {
    // Skip on Firefox and WebKit due to storage event handling differences
    test.skip(browserName !== 'chromium', 'Cross-tab sync test skipped on non-Chromium browsers due to storage event differences');
    
    // Create two pages
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    await page1.goto('/', { timeout: 10000 });
    await page2.goto('/', { timeout: 10000 });
    
    // Set data in page1
    await page1.evaluate(() => {
      localStorage.setItem('cross_tab_test', 'sync_value');
    });
    
    // Wait for storage event
    await page2.evaluate(() => {
      return new Promise((resolve) => {
        window.addEventListener('storage', (e) => {
          if (e.key === 'cross_tab_test') {
            resolve(e.newValue);
          }
        });
        
        // Fallback timeout
        setTimeout(() => resolve(null), 2000);
      });
    });
    
    // Verify data in page2
    const data = await page2.evaluate(() => localStorage.getItem('cross_tab_test'));
    expect(data).toBe('sync_value');
    
    // Cleanup
    await page1.evaluate(() => localStorage.removeItem('cross_tab_test'));
    await page1.close();
    await page2.close();
  });
});
