/**
 * Hook for managing CSP nonce in React components
 * Use this to add inline scripts/styles that comply with CSP
 */

import { useState, useEffect } from 'react';
import { generateNonce } from '../utils/security';

export function useCSPNonce() {
  const [nonce, setNonce] = useState<string>('');

  useEffect(() => {
    // Generate nonce on mount
    const newNonce = generateNonce();
    setNonce(newNonce);

    // Add nonce to document head for inline scripts
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Security-Policy');
    meta.setAttribute('content', `script-src 'self' 'nonce-${newNonce}' https://plausible.io`);
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return nonce;
}
