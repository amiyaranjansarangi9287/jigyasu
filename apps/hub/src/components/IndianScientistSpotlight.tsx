// src/components/IndianScientistSpotlight.tsx
// Indian Scientist Spotlight Component
// Mission Alignment: Identity Value - "Indian scientists, Indian examples, Indian languages, Indian realities"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { INDIAN_SCIENTISTS, getScientistsByConcept, IndianScientist } from '../data/IndianScientists';

interface IndianScientistSpotlightProps {
  concept?: string;
  scientistId?: string;
  language?: string;
}

export default function IndianScientistSpotlight({ concept, scientistId, language = 'en' }: IndianScientistSpotlightProps) {
  const [expanded, setExpanded] = useState(false);
  
  let scientists: IndianScientist[] = [];
  
  if (scientistId) {
    const scientist = INDIAN_SCIENTISTS.find(s => s.id === scientistId);
    if (scientist) scientists = [scientist];
  } else if (concept) {
    scientists = getScientistsByConcept(concept);
  } else {
    // Show a random scientist if no concept specified
    scientists = [INDIAN_SCIENTISTS[Math.floor(Math.random() * INDIAN_SCIENTISTS.length)]];
  }

  if (scientists.length === 0) return null;

  const scientist = scientists[0];

  const getNameInLanguage = (s: IndianScientist) => {
    switch (language) {
      case 'hi': return s.nameHindi || s.name;
      case 'ta': return s.nameTamil || s.name;
      case 'te': return s.nameTelugu || s.name;
      case 'kn': return s.nameKannada || s.name;
      case 'or': return s.nameOdia || s.name;
      default: return s.name;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-200"
    >
      <div className="flex items-start gap-4">
        {/* Scientist Avatar/Icon */}
        <div className="flex-shrink-0">
          <div className="w-16 min-h-16 rounded-full bg-orange-200 flex items-center justify-center text-3xl">
            {scientist.gender === 'female' ? '👩‍🔬' : '👨‍🔬'}
          </div>
        </div>

        {/* Scientist Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🇮🇳</span>
            <h3 className="font-bold text-orange-900 text-lg">{getNameInLanguage(scientist)}</h3>
            {scientist.year && (
              <span className="text-sm text-orange-600">
                ({scientist.year > 0 ? scientist.year : `${Math.abs(scientist.year)} BCE`})
              </span>
            )}
          </div>

          <div className="text-sm text-orange-700 font-semibold mb-2">
            {scientist.field}
          </div>

          <div className="text-sm text-slate-700 leading-relaxed mb-3">
            {scientist.contribution}
          </div>

          {/* Expandable Story */}
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white rounded-xl p-4 border border-orange-200 mb-3"
            >
              <h4 className="font-bold text-orange-900 mb-2">Their Story</h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {scientist.story}
              </p>
              {scientist.region && (
                <div className="mt-2 text-xs text-orange-600">
                  📍 {scientist.region}
                </div>
              )}
            </motion.div>
          )}

          {/* Related Concepts */}
          <div className="flex flex-wrap gap-2">
            {scientist.relatedConcepts.map((concept: string) => (
              <span
                key={concept}
                className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 w-full text-center text-sm text-orange-600 hover:text-orange-800 font-semibold transition-colors"
      >
        {expanded ? 'Show Less' : 'Read Their Story ↓'}
      </button>
    </motion.div>
  );
}

// Compact version for inline use
export function CompactScientistReference({ scientistId, language = 'en' }: { scientistId: string; language?: string }) {
  const scientist = INDIAN_SCIENTISTS.find(s => s.id === scientistId);
  if (!scientist) return null;

  const getNameInLanguage = (s: IndianScientist) => {
    switch (language) {
      case 'hi': return s.nameHindi || s.name;
      case 'ta': return s.nameTamil || s.name;
      case 'te': return s.nameTelugu || s.name;
      case 'kn': return s.nameKannada || s.name;
      case 'or': return s.nameOdia || s.name;
      default: return s.name;
    }
  };

  return (
    <span className="text-orange-700 font-semibold">
      {getNameInLanguage(scientist)}
    </span>
  );
}
