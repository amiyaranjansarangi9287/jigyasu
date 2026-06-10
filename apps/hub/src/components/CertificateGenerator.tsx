// src/components/CertificateGenerator.tsx
// Printable Completion Certificates
// Purpose: Generate printable certificates for completed modules
// Mission Alignment: Joy Value - Celebrate learning achievements

import { useState, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';

interface CertificateProps {
  learnerName: string;
  moduleName: string;
  completionDate: Date;
  language?: string;
}

export default function CertificateGenerator({ 
  learnerName, 
  moduleName, 
  completionDate,
  language = 'en'
}: CertificateProps) {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    setIsGenerating(true);
    setTimeout(() => {
      window.print();
      setIsGenerating(false);
    }, 100);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === 'en' ? 'en-US' : language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handlePrint}
        disabled={isGenerating}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Print certificate"
      >
        {isGenerating ? 'Generating...' : '📜 Print Certificate'}
      </button>

      {/* Hidden certificate for printing */}
      <div 
        ref={certificateRef}
        className="hidden print:block"
        style={{ display: isGenerating ? 'block' : 'none' }}
      >
        <div className="w-[210mm] h-[297mm] p-8 bg-white border-4 border-double border-indigo-600">
          {/* Certificate Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🦚</div>
            <h1 className="text-4xl font-bold text-indigo-900 mb-2"><Trans i18nKey="auto.certificategenerator.jigyasu">Jigyasu</Trans></h1>
            <p className="text-lg text-slate-600 italic"><Trans i18nKey="auto.certificategenerator.install_wonder">Install Wonder</Trans></p>
          </div>

          {/* Certificate Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-800 mb-4">
              <Trans i18nKey="auto.certificategenerator.certificate_of_completion">Certificate of Completion</Trans>
                                      </h2>
            <div className="w-32 h-1 bg-indigo-600 mx-auto"></div>
          </div>

          {/* Certificate Content */}
          <div className="text-center mb-12">
            <p className="text-xl text-slate-700 mb-6">
              <Trans i18nKey="auto.certificategenerator.this_is_to_certify_that">This is to certify that</Trans>
                                      </p>
            <h3 className="text-4xl font-bold text-indigo-900 mb-6">
              {learnerName}
            </h3>
            <p className="text-xl text-slate-700 mb-6">
              <Trans i18nKey="auto.certificategenerator.has_successfully_completed_the">has successfully completed the module</Trans>
                                      </p>
            <h4 className="text-3xl font-bold text-green-700 mb-6">
              {moduleName}
            </h4>
            <p className="text-lg text-slate-600">
              <Trans i18nKey="auto.certificategenerator.on">on</Trans> {formatDate(completionDate)}
            </p>
          </div>

          {/* Certificate Footer */}
          <div className="flex justify-between items-end mt-16 px-12">
            <div className="text-center">
              <div className="w-32 h-1 border-b-2 border-slate-400 mb-2"></div>
              <p className="text-sm text-slate-600"><Trans i18nKey="auto.certificategenerator.jigyasu_team">Jigyasu Team</Trans></p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-sm text-slate-600"><Trans i18nKey="auto.certificategenerator.achievement_unlocked">Achievement Unlocked</Trans></p>
            </div>
            <div className="text-center">
              <div className="w-32 h-1 border-b-2 border-slate-400 mb-2"></div>
              <p className="text-sm text-slate-600"><Trans i18nKey="auto.certificategenerator.date">Date</Trans></p>
            </div>
          </div>

          {/* Certificate Decorative Elements */}
          <div className="absolute top-8 left-8 text-4xl opacity-20">✨</div>
          <div className="absolute top-8 right-8 text-4xl opacity-20">✨</div>
          <div className="absolute bottom-8 left-8 text-4xl opacity-20">🌟</div>
          <div className="absolute bottom-8 right-8 text-4xl opacity-20">🌟</div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-block {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}
