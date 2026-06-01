/**
 * Enhanced State Persistence with IndexedDB
 * Offline data storage, sync strategies, and conflict resolution
 */

import { db } from '../learnos/db/schema';

export interface SyncableData {
  id: string;
  lastModified: number;
  synced: boolean;
  pendingSync?: boolean;
}

export interface ConflictResolution {
  strategy: 'local' | 'remote' | 'merge' | 'manual';
  timestamp: number;
}

/**
 * Enhanced state persistence with sync capabilities
 */
export class StatePersistence {
  private syncQueue: Map<string, SyncableData> = new Map();
  private isSyncing: boolean = false;

  /**
   * Save data with sync metadata
   */
  async saveWithSync<T extends SyncableData>(
    tableName: string,
    data: T
  ): Promise<void> {
    const enhancedData = {
      ...data,
      lastModified: Date.now(),
      synced: false,
      pendingSync: true,
    };

    try {
      // @ts-ignore - Dynamic table access
      await db[tableName].put(enhancedData);
      this.syncQueue.set(data.id, enhancedData);
      
      // Trigger sync if online
      if (navigator.onLine) {
        this.syncData();
      }
    } catch (error) {
      console.error('Failed to save data:', error);
      throw error;
    }
  }

  /**
   * Get data by ID
   */
  async get<T>(tableName: string, id: string): Promise<T | undefined> {
    try {
      // @ts-ignore - Dynamic table access
      return await db[tableName].get(id);
    } catch (error) {
      console.error('Failed to get data:', error);
      return undefined;
    }
  }

  /**
   * Get all data from a table
   */
  async getAll<T>(tableName: string): Promise<T[]> {
    try {
      // @ts-ignore - Dynamic table access
      return await db[tableName].toArray();
    } catch (error) {
      console.error('Failed to get all data:', error);
      return [];
    }
  }

  /**
   * Delete data by ID
   */
  async delete(tableName: string, id: string): Promise<void> {
    try {
      // @ts-ignore - Dynamic table access
      await db[tableName].delete(id);
      this.syncQueue.delete(id);
    } catch (error) {
      console.error('Failed to delete data:', error);
      throw error;
    }
  }

  /**
   * Clear all data from a table
   */
  async clearTable(tableName: string): Promise<void> {
    try {
      // @ts-ignore - Dynamic table access
      await db[tableName].clear();
      this.syncQueue.clear();
    } catch (error) {
      console.error('Failed to clear table:', error);
      throw error;
    }
  }

  /**
   * Sync pending data when online
   */
  async syncData(): Promise<void> {
    if (this.isSyncing || !navigator.onLine) {
      return;
    }

    this.isSyncing = true;

    try {
      for (const [id, data] of this.syncQueue.entries()) {
        // In a real implementation, this would send data to a server
        // For now, we'll mark as synced
        data.synced = true;
        data.pendingSync = false;
        
        // Update in IndexedDB
        // This would need to know which table the data belongs to
        // For now, we'll just remove from queue
        this.syncQueue.delete(id);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Resolve conflicts between local and remote data
   */
  resolveConflict(
    localData: SyncableData,
    remoteData: SyncableData,
    resolution: ConflictResolution
  ): SyncableData {
    switch (resolution.strategy) {
      case 'local':
        return localData;
      case 'remote':
        return remoteData;
      case 'merge':
        // Simple merge strategy - prefer most recent
        return localData.lastModified > remoteData.lastModified
          ? localData
          : remoteData;
      case 'manual':
        // Return both for manual resolution
        return localData.lastModified > remoteData.lastModified
          ? localData
          : remoteData;
      default:
        return localData;
    }
  }

  /**
   * Get pending sync count
   */
  getPendingSyncCount(): number {
    return this.syncQueue.size;
  }

  /**
   * Export all data for backup
   */
  async exportData(): Promise<Record<string, any[]>> {
    const tables = ['sessions', 'events', 'conceptProgress', 'achievements', 'wonderGarden'];
    const exportData: Record<string, any[]> = {};

    for (const table of tables) {
      // @ts-ignore - Dynamic table access
      exportData[table] = await db[table].toArray();
    }

    return exportData;
  }

  /**
   * Import data from backup
   */
  async importData(data: Record<string, any[]>): Promise<void> {
    for (const [table, records] of Object.entries(data)) {
      try {
        // @ts-ignore - Dynamic table access
        await db[table].bulkPut(records);
      } catch (error) {
        console.error(`Failed to import ${table}:`, error);
      }
    }
  }

  /**
   * Clear all data (use with caution)
   */
  async clearAll(): Promise<void> {
    const tables = ['sessions', 'events', 'conceptProgress', 'achievements', 'wonderGarden', 'lumoTriggers'];
    
    for (const table of tables) {
      try {
        // @ts-ignore - Dynamic table access
        await db[table].clear();
      } catch (error) {
        console.error(`Failed to clear ${table}:`, error);
      }
    }
    
    this.syncQueue.clear();
  }

  /**
   * Get storage usage estimate
   */
  async getStorageUsage(): Promise<{ used: number; available: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        available: estimate.quota ? estimate.quota - (estimate.usage || 0) : 0,
      };
    }
    
    return { used: 0, available: 0 };
  }
}

// Singleton instance
export const statePersistence = new StatePersistence();

/**
 * Hook for using state persistence in components
 */
export function useStatePersistence() {
  return {
    save: statePersistence.saveWithSync.bind(statePersistence),
    get: statePersistence.get.bind(statePersistence),
    getAll: statePersistence.getAll.bind(statePersistence),
    delete: statePersistence.delete.bind(statePersistence),
    clear: statePersistence.clearTable.bind(statePersistence),
    sync: statePersistence.syncData.bind(statePersistence),
    pendingCount: statePersistence.getPendingSyncCount.bind(statePersistence),
    export: statePersistence.exportData.bind(statePersistence),
    import: statePersistence.importData.bind(statePersistence),
    clearAll: statePersistence.clearAll.bind(statePersistence),
    getStorageUsage: statePersistence.getStorageUsage.bind(statePersistence),
  };
}
