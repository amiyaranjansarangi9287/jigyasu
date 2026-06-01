// src/shared/ui/CookieConsent.tsx
// Privacy-first cookie consent banner

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CONSENT_KEY = 'learnos-consent';

function needsConsent() {
  try {
    return !localStorage.getItem(CONSENT_KEY);
  } catch {
    return false;
  }
}

export function CookieConsent() {
  const [show, setShow] = useState(needsConsent);
  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted');
    } catch {
      // Ignore
    }
    setShow(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'declined');
    } catch {
      // Ignore
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <p className="text-sm text-gray-700 mb-4">
              <strong>🦉 LearnOS respects your privacy.</strong>
              <br />
              We store your progress locally on this device only.
              No personal data is collected or sent to any server.
              Anonymous usage stats (views, time spent) help us improve the app.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 py-2.5 bg-orange-500 text-white font-bold rounded-xl
                           hover:bg-orange-600 transition-colors min-h-[44px] text-sm"
              >
                Got it!
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl
                           hover:bg-gray-200 transition-colors min-h-[44px] text-sm"
              >
                No stats
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
