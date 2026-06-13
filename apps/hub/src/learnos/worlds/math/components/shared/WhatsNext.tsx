import { motion } from 'framer-motion';
import { getLinksFor } from '../../lib/crossLinks';
import { Trans } from "react-i18next";
import { useTranslation } from 'react-i18next';

export default function WhatsNext({ moduleId }: { moduleId: string }) {
  const { t } = useTranslation();
  const links = getLinksFor(moduleId);
  if (links.length === 0) return null;

  return (
    <motion.div
      className="mt-6 bg-gradient-to-r from-purple-500/8 via-pink-500/8 to-amber-500/8 rounded-2xl border border-purple-500/20 p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h4 className="text-white font-bold mb-3 flex items-center gap-2">
        <span className="text-lg">🔗</span> <Trans i18nKey="auto.whatsnext.what_s_next">What's Next?</Trans>
                    </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link) => (
          <motion.div
            key={link.id}
            className="bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl group-hover:scale-110 transition-transform">{link.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{link.name}</p>
                <p className="text-gray-500 text-sm leading-snug">{link.reason}</p>
              </div>
              <span className="text-gray-600 group-hover:text-purple-400 transition-colors">→</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
