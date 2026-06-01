// src/components/WhatsAppShare.tsx
// WhatsApp Share Feature
// Purpose: Allow learners to share their progress with family via WhatsApp
// Mission Alignment: Joy Value - Learning should be celebrated with family

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface WhatsAppShareProps {
  moduleName?: string;
  progress?: number;
  completed?: boolean;
  language?: string;
}

export default function WhatsAppShare({ 
  moduleName = 'a module', 
  progress = 0,
  completed = false,
  language = 'en'
}: WhatsAppShareProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const generateMessage = () => {
    const messages: Record<string, string> = {
      en: `🦚 *Jigyasu Update!*\n\nI just completed ${completed ? '✅' : `${progress}% of`} ${moduleName} on Jigyasu!\n\nIt's a free learning platform that works offline. Check it out: https://jigyasu.app\n\n#Learning #Jigyasu`,
      hi: `🦚 *जिज्ञासु अपडेट!*\n\nमैंने जिज्ञासु पर ${completed ? '✅' : `${progress}%`} ${moduleName} पूरा किया!\n\nयह एक मुफ्त लर्निंग प्लेटफॉर्म है जो ऑफलाइन काम करता है। देखें: https://jigyasu.app\n\n#सीखना #जिज्ञासु`,
      ta: `🦚 *ஜிக்யாசு புதுப்பிப்பு!*\n\nநான் ஜிக்யாசுவில் ${completed ? '✅' : `${progress}%`} ${moduleName} முடித்தேன்!\n\nஇது இலவச கற்றல் தளம், ஆஃப்லைனில் வேலை செய்கிறது. பாருங்கள்: https://jigyasu.app\n\n#கற்றல் #ஜிக்யாசு`,
      te: `🦚 *జిగ్యాసు అప్‌డేట్!*\n\nనేను జిగ్యాసులో ${completed ? '✅' : `${progress}%`} ${moduleName} పూర్తి చేశాను!\n\nఇది ఉచిత లెర్నింగ్ ప్లాట్‌ఫారమ్, ఆఫ్‌లైన్‌లో పని చేస్తుంది. చూడండి: https://jigyasu.app\n\n#నేర్చుకోవడం #జిగ్యాసు`,
      kn: `🦚 *ಜಿಜ್ಞಾಸು ಅಪ್‌ಡೇಟ್!*\n\nನಾನು ಜಿಜ್ಞಾಸುವಿನಲ್ಲಿ ${completed ? '✅' : `${progress}%`} ${moduleName} ಪೂರ್ಣಗೊಳಿಸಿದ್ದೇನೆ!\n\nಇದು ಉಚಿತ ಕಲಿಕಾ ವೇದಿಕೆ, ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ. ನೋಡಿ: https://jigyasu.app\n\n#ಕಲಿಕೆ #ಜಿಜ್ಞಾಸು`,
      or: `🦚 *ଜିଜ୍ଞାସୁ ଅପଡେଟ!*\n\nମୁଁ ଜିଜ୍ଞାସୁରେ ${completed ? '✅' : `${progress}%`} ${moduleName} ସମ୍ପୂର୍ଣ କଲି!\n\nଏହା ଏକ ମାଗଣା ଶିକ୍ଷା ପ୍ଲାଟଫର୍ମ, ଅଫଲାଇନରେ କାମ କରେ। ଦେଖନ୍ତୁ: https://jigyasu.app\n\n#ଶିକ୍ଷା #ଜିଜ୍ଞାସୁ`,
    };
    
    return messages[language] || messages.en;
  };

  const handleShare = () => {
    const message = encodeURIComponent(generateMessage());
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-bold transition-colors shadow-lg shadow-green-500/30"
        aria-label="Share progress on WhatsApp"
      >
        <span className="text-xl">📱</span>
        <span className="hidden sm:inline">{t('share_whatsapp', 'Share with Family')}</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🦚</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {t('share_title', 'Share Your Progress')}
          </h2>
          <p className="text-slate-600">
            {t('share_description', 'Celebrate your learning with family on WhatsApp!')}
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-4 border-2 border-green-100">
          <p className="text-sm font-bold text-green-800 mb-2">
            {t('preview', 'Preview:')}
          </p>
          <p className="text-sm text-slate-700 whitespace-pre-line">
            {generateMessage()}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-xl">📱</span>
            {t('send_whatsapp', 'Send on WhatsApp')}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-bold transition-colors"
          >
            {t('cancel', 'Cancel')}
          </button>
        </div>

        <p className="text-xs text-slate-500 text-center">
          {t('share_note', 'This opens WhatsApp in a new tab. No data is collected.')}
        </p>
      </div>
    </div>
  );
}
