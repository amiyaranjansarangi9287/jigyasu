import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
            aria-label="Back to Home"
          >
            ←
          </button>
          <h1 className="font-display text-xl font-bold text-slate-800">Contact Us</h1>
        </div>
      </header>
      
      <main className="mx-auto max-w-4xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <iframe aria-label='Jigyasu Feedback & Support' frameBorder="0" style={{ height: '700px', width: '100%', border: 'none' }} src='https://forms.zohopublic.in/arsjobs2019gm1/form/JigyasuFeedbackSupport/formperma/WLidd2lYcJF7F35E8PvPQVfaBL8OMgCC9yMcSokcQCc' ></iframe>
          </div>
        </motion.div>
      </main>
    </div>
  );
}