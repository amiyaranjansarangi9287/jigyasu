import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CRISIS_RESOURCES = [
  {
    name: 'Childline India',
    number: '1098',
    description: '24/7 emergency helpline for children in distress',
    emoji: '📞',
    available: '24/7',
  },
  {
    name: 'National Mental Health Helpline',
    number: '14416',
    description: 'Free mental health support and counseling',
    emoji: '🧠',
    available: '24/7',
  },
  {
    name: 'Women Helpline',
    number: '181',
    description: 'Support for women and children facing violence or abuse',
    emoji: '🛡️',
    available: '24/7',
  },
  {
    name: 'KIRAN Mental Health Helpline',
    number: '1800-599-0019',
    description: 'Psychological support and crisis counseling',
    emoji: '💚',
    available: '24/7',
  },
];

export default function CrisisResources() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-3 rounded-2xl shadow-lg transition-all duration-200 flex items-center gap-2 text-sm"
        aria-label="Get help - crisis resources"
        role="button"
        tabIndex={0}
      >
        <span className="text-lg" aria-hidden="true">🆘</span>
        <span>Get Help</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              🆘 Help & Support
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
            <p className="text-sm text-amber-800 font-semibold mb-2">
              If you or someone you know is in immediate danger, please call emergency services:
            </p>
            <p className="text-2xl font-bold text-amber-900">112</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Crisis Helplines (India)
            </h3>
            <p className="text-sm text-slate-600">
              These services are free, confidential, and available 24/7. You can call anytime.
            </p>

            {CRISIS_RESOURCES.map((resource) => (
              <div
                key={resource.name}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:bg-slate-100 transition"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{resource.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900">{resource.name}</h4>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                        {resource.available}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{resource.description}</p>
                    <a
                      href={`tel:${resource.number}`}
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl transition"
                    >
                      <span>📞</span>
                      <span>{resource.number}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Need to talk to someone?
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              It's okay to ask for help. Speaking with a trusted adult, counselor, or helpline can make a big difference.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Remember:</strong> You are not alone. There are people who care and want to help.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="mt-6 w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
