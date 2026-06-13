import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, FileText, Mail } from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = t('contact.page_title', 'Contact Us — Jigyasu');
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', t('contact.meta_description', 'Get in touch with the Jigyasu team. We would love to hear from you.'));
    }
  }, [t]);

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
          <h1 className="font-display text-xl font-bold text-slate-800">{t('contact.title', 'Contact Us')}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-10 text-center space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('contact.heading', "We'd love to hear from you")}</h2>
            <p className="text-slate-600 dark:text-slate-300">
              {t('contact.body', 'Have questions, feedback, or want to support Jigyasu? Please fill out our contact form and we will get back to you as soon as possible.')}
            </p>
            <div className="pt-4 flex flex-col gap-4">
              <a
                href={t('contact.form_url', 'https://forms.zohopublic.in/arsjobs2019gm1/form/JigyasuFeedbackSupport/formperma/WLidd2lYcJF7F35E8PvPQVfaBL8OMgCC9yMcSokcQCc')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white dark:text-white font-bold px-8 py-4 rounded-2xl text-lg w-full"
                aria-label={t('contact.open_form_aria', 'Open contact form in new tab')}
              >
                <FileText className="w-5 h-5" aria-hidden="true" />
                <span>{t('contact.open_form', 'Open Contact Form')}</span>
              </a>
              <a
                href="mailto:contact@jigyasu.app"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-100 font-bold px-8 py-4 rounded-2xl text-lg w-full"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
                <span>{t('contact.email_us', 'Email Us Directly')}</span>
              </a>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}