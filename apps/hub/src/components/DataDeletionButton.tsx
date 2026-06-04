import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@jigyasu/ui';
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
          {t('clear_browser_data', 'How to Clear Browser Data')}
        </h3>
        <div className="space-y-3 text-sm text-amber-800">
          <p><strong>{t('chrome_edge', 'Chrome/Edge')}:</strong> {t('clear_chrome', 'Settings → Privacy → Clear browsing data')}</p>
          <p><strong>{t('firefox', 'Firefox')}:</strong> {t('clear_firefox', 'Options → Privacy → Clear Data')}</p>
          <p><strong>{t('safari', 'Safari')}:</strong> {t('clear_safari', 'Preferences → Privacy → Manage Website Data')}</p>
          <p className="mt-4 text-amber-700">
            {t('clear_instructions_step', 'Select "Cookies and site data" and "Cached images and files" then click Clear.')}
          </p>
        </div>
        <Button
          onClick={() => setShowInstructions(false)}
          fullWidth
          className="mt-4"
          aria-label={t('close_browser_data_instructions', 'Close browser data instructions')}
        >
          {t('got_it', 'Got it')}
        </Button>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-lg mx-auto" role="alertdialog" aria-labelledby="confirm-title" aria-describedby="confirm-desc">
        <h3 id="confirm-title" className="text-lg font-bold text-red-900 mb-3">
          <span aria-hidden="true">⚠️</span> {t('are_you_sure', 'Are you sure?')}
        </h3>
        <p id="confirm-desc" className="text-sm text-red-800 mb-4">
          {t('delete_warning', 'This will permanently delete all your learning progress, profile, and settings. This action cannot be undone.')}
        </p>
        <div className="space-y-2">
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="danger"
            fullWidth
            aria-label={t('confirm_delete_all_data', 'Confirm delete all data')}
          >
            {isDeleting ? t('deleting', 'Deleting...') : t('yes_delete_all_data', 'Yes, Delete All My Data')}
          </Button>
          <Button
            onClick={() => setShowConfirm(false)}
            variant="outline-danger"
            fullWidth
            aria-label={t('cancel_data_deletion', 'Cancel data deletion')}
          >
            {t('cancel', 'Cancel')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-lg mx-auto" role="region" aria-labelledby="delete-title">
      <h3 id="delete-title" className="text-lg font-bold text-slate-900 mb-2">
        <span aria-hidden="true">🗑️</span> {t('delete_my_data', 'Delete My Data')}
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        {t('delete_data_desc', 'Permanently delete all your learning progress, profile, and settings from this device.')}
      </p>
      <div className="space-y-2">
        <Button
          onClick={() => setShowConfirm(true)}
          variant="danger"
          fullWidth
          aria-label={t('delete_all_my_data', 'Delete all my data')}
        >
          {t('delete_all_data', 'Delete All Data')}
        </Button>
        <Button
          onClick={handleClearBrowserData}
          variant="secondary"
          fullWidth
          aria-label={t('learn_clear_browser_data', 'Learn how to clear browser data manually')}
        >
          {t('learn_clear_browser_data', 'Learn how to clear browser data manually')}
        </Button>
      </div>
    </div>
  );
}
