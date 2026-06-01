import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  onDeleteComplete?: () => void;
};

export default function DataDeletionButton({ onDeleteComplete }: Props) {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    try {
      // Clear all localStorage data
      localStorage.clear();
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Optional: Clear IndexedDB if used
      if (typeof indexedDB !== 'undefined') {
        indexedDB.deleteDatabase('jigyasu-db');
      }

      setIsDeleting(false);
      setShowConfirm(false);
      if (onDeleteComplete) {
        onDeleteComplete();
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      setIsDeleting(false);
    }
  };

  const handleClearBrowserData = () => {
    setShowInstructions(true);
  };

  if (showInstructions) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 max-w-lg mx-auto" role="dialog" aria-labelledby="instructions-title">
        <h3 id="instructions-title" className="text-lg font-bold text-amber-900 mb-3">
          How to Clear Browser Data
        </h3>
        <div className="space-y-3 text-sm text-amber-800">
          <p><strong>Chrome/Edge:</strong> Settings → Privacy → Clear browsing data</p>
          <p><strong>Firefox:</strong> Options → Privacy → Clear Data</p>
          <p><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</p>
          <p className="mt-4 text-amber-700">
            Select "Cookies and site data" and "Cached images and files" then click Clear.
          </p>
        </div>
        <button
          onClick={() => setShowInstructions(false)}
          className="mt-4 w-full bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition"
          aria-label="Close browser data instructions"
          role="button"
        >
          Got it
        </button>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-lg mx-auto" role="alertdialog" aria-labelledby="confirm-title" aria-describedby="confirm-desc">
        <h3 id="confirm-title" className="text-lg font-bold text-red-900 mb-3">
          <span aria-hidden="true">⚠️</span> Are you sure?
        </h3>
        <p id="confirm-desc" className="text-sm text-red-800 mb-4">
          This will permanently delete all your learning progress, profile, and settings. 
          This action cannot be undone.
        </p>
        <div className="space-y-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Confirm delete all data"
            role="button"
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete All My Data'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="w-full bg-white text-red-700 font-bold py-3 rounded-xl border border-red-300 hover:bg-red-50 transition"
            aria-label="Cancel data deletion"
            role="button"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-lg mx-auto" role="region" aria-labelledby="delete-title">
      <h3 id="delete-title" className="text-lg font-bold text-slate-900 mb-2">
        <span aria-hidden="true">🗑️</span> Delete My Data
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        Permanently delete all your learning progress, profile, and settings from this device.
      </p>
      <div className="space-y-2">
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition"
          aria-label="Delete all my data"
          role="button"
        >
          Delete All Data
        </button>
        <button
          aria-label="Learn how to clear browser data manually"
          role="button"
          onClick={handleClearBrowserData}
          className="w-full bg-white text-slate-700 font-bold py-3 rounded-xl border border-slate-300 hover:bg-slate-50 transition text-sm"
        >
          Learn how to clear browser data manually
        </button>
      </div>
    </div>
  );
}
