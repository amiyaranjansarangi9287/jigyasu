import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Mail } from 'lucide-react';

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
            <ArrowLeft className="w-5 h-5" />
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
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-slate-200 p-10 text-center space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">We'd love to hear from you</h2>
            <p className="text-slate-600">
              Have questions, feedback, or want to support Jigyasu? Please fill out our contact form and we'll get back to you as soon as possible.
            </p>
            <div className="pt-4 flex flex-col gap-4">
              <a 
                href="https://forms.zohopublic.in/arsjobs2019gm1/form/JigyasuFeedbackSupport/formperma/WLidd2lYcJF7F35E8PvPQVfaBL8OMgCC9yMcSokcQCc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold px-8 py-4 rounded-2xl text-lg w-full"
              >
                <FileText className="w-5 h-5" />
                <span>Open Contact Form</span>
              </a>
              <a 
                href="mailto:contact@jigyasu.app" 
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 font-bold px-8 py-4 rounded-2xl text-lg w-full"
              >
                <Mail className="w-5 h-5" />
                <span>Email Us Directly</span>
              </a>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}