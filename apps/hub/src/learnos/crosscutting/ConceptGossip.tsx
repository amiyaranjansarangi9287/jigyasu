// src/crosscutting/ConceptGossip.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../constants/routes';
import { ParentCorner } from '../shared/layout';
import { Button, Card } from '@jigyasu/ui';
import { CONCEPT_GOSSIPS, ConceptConversation } from './data/conceptGossipContent';

export default function ConceptGossip() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedGossip, setSelectedGossip] = useState<ConceptConversation | null>(null);
  const [currentLine, setCurrentLine] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSelect = (gossip: ConceptConversation) => {
    setSelectedGossip(gossip);
    setCurrentLine(0);
    setIsPlaying(false);
  };

  const handleNextLine = () => {
    if (!selectedGossip) return;
    if (currentLine < selectedGossip.dialogue.length - 1) {
      setCurrentLine(currentLine + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handleAutoPlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && selectedGossip) {
      if (currentLine < selectedGossip.dialogue.length - 1) {
        timerRef.current = setTimeout(() => {
          setCurrentLine((prev) => prev + 1);
        }, 2000);
      } else {
        setIsPlaying(false);
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentLine, selectedGossip]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-50 relative">
      <ParentCorner />

      <div className="max-w-lg mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(ROUTES.FAMILY_HOME)}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ←
          </button>
          <span className="text-sm text-gray-400">
            {CONCEPT_GOSSIPS.length} conversations
          </span>
        </div>

        <AnimatePresence mode="wait">
          {!selectedGossip ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">💬</div>
                <h1 className="text-3xl font-bold text-rose-700 mb-2">
                  {t('crosscutting.concept_gossip.title')}
                </h1>
                <p className="text-gray-500">
                  {t('crosscutting.concept_gossip.subtitle')}
                </p>
              </div>

              <div className="space-y-3">
                {CONCEPT_GOSSIPS.map((gossip, i) => (
                  <motion.div
                    key={gossip.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card
                      hoverable
                      onClick={() => handleSelect(gossip)}
                      className="w-full p-4 text-left min-h-[72px] border-transparent hover:border-rose-200 hover:bg-rose-50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{gossip.emojiA}</span>
                        <span className="text-gray-300">↔</span>
                        <span className="text-3xl">{gossip.emojiB}</span>
                        <div className="flex-1 ml-2">
                          <p className="font-bold text-gray-800 text-sm">
                            {t(`crosscutting.data.concept_gossip.${gossip.id}.concept1`, { defaultValue: gossip.conceptA })} & {t(`crosscutting.data.concept_gossip.${gossip.id}.concept2`, { defaultValue: gossip.conceptB })}
                          </p>
                          <p className="text-sm text-gray-400">{gossip.unlocksWhen}</p>
                        </div>
                        <span className="text-gray-300">→</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="conversation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => {
                  setSelectedGossip(null);
                  setIsPlaying(false);
                  if (timerRef.current) clearTimeout(timerRef.current);
                }}
                className="text-gray-400 hover:text-gray-600 mb-4"
              >
                ← {t('crosscutting.concept_gossip.next_conv')}
              </button>

              <Card className="p-6 mb-4 border-rose-100/50">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-4xl">{selectedGossip.emojiA}</span>
                  <span className="text-2xl text-rose-400">💬</span>
                  <span className="text-4xl">{selectedGossip.emojiB}</span>
                </div>

                <div className="space-y-3 min-h-[200px]">
                  {selectedGossip.dialogue.map((line, i) => {
                    const speaker = line.split(':')[0];
                    const isA = speaker === selectedGossip.conceptA;
                    const visible = i <= currentLine;
                    const defaultText = line.includes(':') ? line.split(':')[1].trim() : line;
                    const messageObj = t(`crosscutting.data.concept_gossip.${selectedGossip.id}.messages.${i}`, { returnObjects: true }) as any;
                    const messageText = messageObj?.text || defaultText;

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 10 }}
                        className={`flex ${isA ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            isA
                              ? 'bg-rose-100 text-rose-800 rounded-bl-md'
                              : 'bg-blue-100 text-blue-800 rounded-br-md'
                          } ${!visible ? 'invisible' : ''}`}
                        >
                          {messageText}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>

              <div className="flex gap-3">
                <Button
                  onClick={handleNextLine}
                  variant="secondary"
                  disabled={currentLine >= selectedGossip.dialogue.length - 1}
                  className="flex-1"
                >
                  {t('crosscutting.concept_gossip.next')} →
                </Button>
                <Button
                  onClick={handleAutoPlay}
                  className="flex-1"
                >
                  {isPlaying ? '⏸ Pause' : '▶ Auto-play'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
