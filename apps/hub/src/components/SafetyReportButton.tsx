import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';

type ReportType = 'inappropriate' | 'bug' | 'safety' | 'other';

const REPORT_TYPES: { id: ReportType; label: string; emoji: string; description: string }[] = [
  { id: 'inappropriate', label: 'Inappropriate Content', emoji: '🚫', description: 'Content that is not suitable for children' },
  { id: 'bug', label: 'Bug or Error', emoji: '🐛', description: 'Something is not working correctly' },
  { id: 'safety', label: 'Safety Concern', emoji: '⚠️', description: 'Something that could be harmful' },
  { id: 'other', label: 'Other Issue', emoji: '💬', description: 'Any other concern or feedback' },
];

export default function SafetyReportButton() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedType || !description.trim()) return;
    
    setIsSubmitting(true);
    
    // In a real implementation, this would send to a backend
    // For now, we'll simulate the submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setDescription('');
      setSelectedType(null);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 3000);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 flex items-center gap-2 text-sm"
        aria-label="Report a concern or issue"
        role="button"
        tabIndex={0}
      >
        <span className="text-lg" aria-hidden="true">📢</span>
        <span>{t('report', 'Report')}</span>
      </button>
    );
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center" role="alert" aria-live="polite">
          <span className="text-6xl block mb-4" aria-hidden="true">✅</span>
          <h2 className="text-2xl font-bold text-slate-900 mb-2"><Trans i18nKey="auto.safetyreportbutton.thank_you">Thank You!</Trans></h2>
          <p className="text-slate-600">
            <Trans i18nKey="auto.safetyreportbutton.your_report_has_been_submitted">Your report has been submitted. We will review it and take appropriate action.</Trans>
                              </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" role="dialog" aria-labelledby="report-title">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 id="report-title" className="text-2xl font-bold text-slate-900">
              <Trans i18nKey="auto.safetyreportbutton.report_a_concern">📢 Report a Concern</Trans>
                                      </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              aria-label="Close report form"
              role="button"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                <Trans i18nKey="auto.safetyreportbutton.what_type_of_concern">What type of concern?</Trans>
                                            </label>
              <div className="grid grid-cols-2 gap-3">
                {REPORT_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-xl border-2 transition ${
                      selectedType === type.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                    aria-pressed={selectedType === type.id}
                    role="button"
                  >
                    <span className="text-2xl block mb-1" aria-hidden="true">{type.emoji}</span>
                    <span className="text-sm font-bold text-slate-800 block">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedType && (
              <div>
                <label htmlFor="report-description" className="block text-sm font-bold text-slate-700 mb-2">
                  <Trans i18nKey="auto.safetyreportbutton.please_describe_the_issue">Please describe the issue</Trans>
                                                  </label>
                <textarea
                  id="report-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('auto.attr.safetyreportbutton.tell_us_more_about_what_happen')}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl min-h-[120px] resize-none"
                  aria-describedby="report-desc-hint"
                />
                <p id="report-desc-hint" className="text-xs text-slate-500 mt-1">
                  <Trans i18nKey="auto.safetyreportbutton.your_report_will_be_reviewed_b">Your report will be reviewed by our team. You can remain anonymous.</Trans>
                                                  </p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong><Trans i18nKey="auto.safetyreportbutton.for_emergencies">For emergencies:</Trans></strong> <Trans i18nKey="auto.safetyreportbutton.if_you_or_someone_else_is_in_i">If you or someone else is in immediate danger, please call emergency services at 112 or use the "Get Help" button for crisis resources.</Trans>
                                            </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition"
                aria-label="Cancel report"
                role="button"
              >
                <Trans i18nKey="auto.safetyreportbutton.cancel">Cancel</Trans>
                                            </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedType || !description.trim() || isSubmitting}
                className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Submit report"
                role="button"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
