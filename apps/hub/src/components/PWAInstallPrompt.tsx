/**
 * PWA Install Prompt Component
 * Shows a friendly install prompt when the app is installable
 */

import { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { motion, AnimatePresence } from 'framer-motion';

export function PWAInstallPrompt() {
  const { isInstallable, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 p-5">
          <div className="flex items-start gap-4">
            <div className="text-4xl flex-shrink-0">🦉</div>
            <div className="flex-1">
              <h3 className="font-bold text-indigo-900 text-lg mb-1">
                Install Jigyasu
              </h3>
              <p className="text-slate-600 text-sm mb-3">
                Get the full experience with offline access and faster loading.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2.5 text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
