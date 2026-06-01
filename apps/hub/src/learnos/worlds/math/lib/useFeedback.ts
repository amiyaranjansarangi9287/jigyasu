import { useState, useCallback } from 'react';
import { sfx } from './soundEngine';
import { recordAnswer } from './difficultyEngine';

/**
 * Drop-in replacement for the pattern used in every module:
 *   const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
 *
 * Instead, use:
 *   const { feedback, onCorrect, onWrong, clearFeedback } = useFeedback('topic-id');
 *
 * This auto-plays sounds, tracks difficulty, and works with the global XP system
 * even if the module doesn't import MathContext (for modules that can't use hooks
 * from context due to their structure).
 */
export function useFeedback(topicId: string) {
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const onCorrect = useCallback(() => {
    setFeedback('correct');
    sfx.correct();
    recordAnswer(topicId, true);
  }, [topicId]);

  const onWrong = useCallback(() => {
    setFeedback('wrong');
    sfx.wrong();
    recordAnswer(topicId, false);
  }, [topicId]);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  return { feedback, onCorrect, onWrong, clearFeedback, setFeedback };
}
