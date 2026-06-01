/**
 * Offline Status Banner Component
 * Shows a friendly banner when the user is offline
 * Critical for offline-first Jigyasu experience
 */

import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { motion, AnimatePresence } from 'framer-motion';

export function OfflineStatusBanner() {
  const { isOnline, wasOffline } = useOnlineStatus();

  // Don't show banner if online and never went offline
  if (isOnline && !wasOffline) {
    return null;
  }

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 bg-amber-50 border-b border-amber-200"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
            <span className="text-2xl">📴</span>
            <p className="text-amber-900 font-medium text-sm">
              You're offline. Don't worry — Jigyasu works without internet!
            </p>
          </div>
        </motion.div>
      )}
      {isOnline && wasOffline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 bg-green-50 border-b border-green-200"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
            <span className="text-2xl">📶</span>
            <p className="text-green-900 font-medium text-sm">
              You're back online! Your progress will sync when ready.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
