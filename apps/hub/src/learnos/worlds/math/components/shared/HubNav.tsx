import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../../lib/soundEngine';
import { Trans } from "react-i18next";
import { useTranslation } from 'react-i18next';

export interface HubItem {
  id: string;
  emoji: string;
  label: string;
  labelKey?: string;
  color: string;
  category?: string;
  categoryKey?: string;
}

interface HubNavProps {
  items: HubItem[];
  active: string;
  onSelect: (id: string) => void;
  layoutId: string;
}

/**
 * Responsive hub navigation that:
 * - Groups items by category on mobile with collapsible sections
 * - Shows as a scrollable pill bar on desktop
 * - Plays click sounds
 * - Highlights active item with animated indicator
 */
export default function HubNav({ items, active, onSelect, layoutId }: HubNavProps) {
  const { t } = useTranslation();
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  // Group by category
  const categories = new Map<string, HubItem[]>();
  items.forEach(item => {
    const cat = item.category || 'General';
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(item);
  });
  const hasCats = categories.size > 1;

  const handleSelect = (id: string) => {
    sfx.click();
    onSelect(id);
  };

  // Desktop: horizontal scrollable pills
  // Mobile: if categories exist and >8 items, show grouped accordion
  const useAccordion = hasCats && items.length > 8;

  return (
    <div className="mb-6">
      {/* Desktop / small list: scrollable pills */}
      <div className={`${useAccordion ? 'hidden sm:flex' : 'flex'} flex-wrap justify-center gap-1.5`}>
        {items.map(m => (
          <motion.button
            key={m.id}
            className={`relative px-2.5 sm:px-3.5 py-2 rounded-xl font-medium text-sm sm:text-sm transition-all whitespace-nowrap ${
              active === m.id ? 'text-white' : 'text-gray-400 hover:text-gray-300 bg-white/5'
            }`}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(m.id)}
          >
            {active === m.id && (
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${m.color} opacity-30 rounded-xl border border-white/20`}
                layoutId={layoutId}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <span>{m.emoji}</span>
              <span className="hidden sm:inline">{t(m.labelKey || m.label, m.label)}</span>
            </span>
          </motion.button>
        ))}
      </div>

      {/* Mobile accordion (only when useAccordion) */}
      {useAccordion && (
        <div className="sm:hidden space-y-2">
          {/* Active item quick display */}
          <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2 border border-white/10">
            <span className="text-white font-bold text-sm flex items-center gap-2">
              <span>{items.find(i => i.id === active)?.emoji}</span>
              {t(items.find(i => i.id === active)?.labelKey || items.find(i => i.id === active)?.label || '', items.find(i => i.id === active)?.label || '')}
            </span>
            <span className="text-gray-500 text-sm"><Trans i18nKey="auto.hubnav.tap_below_to_switch">tap below to switch</Trans></span>
          </div>

          {/* Category groups */}
          {[...categories.entries()].map(([cat, catItems]) => (
            <div key={cat} className="rounded-xl border border-white/10 overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 text-left"
                onClick={() => setExpandedCat(expandedCat === cat ? null : cat)}
              >
                <span className="text-gray-300 text-sm font-bold">{t(catItems[0]?.categoryKey || cat, cat)}</span>
                <span className="text-gray-500 text-sm">
                  {catItems.length} · {expandedCat === cat ? '▼' : '▶'}
                </span>
              </button>
              <AnimatePresence>
                {expandedCat === cat && (
                  <motion.div
                    className="grid grid-cols-3 gap-1 p-2 bg-white/3"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {catItems.map(item => (
                      <motion.button
                        key={item.id}
                        className={`p-2 rounded-lg text-center text-sm font-bold ${
                          active === item.id
                            ? 'bg-purple-500/30 text-white border border-purple-400/50'
                            : 'bg-white/5 text-gray-400'
                        }`}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelect(item.id)}
                      >
                        <span className="text-lg block">{item.emoji}</span>
                        {t(item.labelKey || item.label, item.label)}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
