// src/shared/ui/OfflineIndicator.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function OfflineIndicator() {
  const { t } = useTranslation();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                    bg-gray-800 text-white px-4 py-2 rounded-full
                    text-sm flex items-center gap-2 shadow-lg"
        >
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          {t('common.offline_message')}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
