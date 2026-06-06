import { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import WonderFirstTemplate, { WonderFirstModule } from './WonderFirstTemplate';
import { getModuleById } from './registerAllModules';

export default function withWonderFirst<P extends object>(
  WrappedComponent: ComponentType<P>,
  worldId: string,
  moduleId: string
) {
  return function WithWonderFirst(props: P) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const moduleDef = getModuleById(moduleId);

    // Provide safe fallbacks if module registry definition is missing
    const defaultTitle = moduleDef?.title || moduleId;
    const defaultEmoji = moduleDef?.emoji || '✨';

    const wonderModule: WonderFirstModule = {
      id: moduleId,
      mystery: {
        question: t(
          `worlds.${worldId}.modules.${moduleId}.wonder.mystery.question`,
          `What happens when we explore ${defaultTitle}?`
        ),
        visual: defaultEmoji,
        hook: t(
          `worlds.${worldId}.modules.${moduleId}.wonder.mystery.hook`,
          'There is a hidden pattern here waiting to be discovered.'
        ),
      },
      exploration: {
        instructions: t(
          `worlds.${worldId}.modules.${moduleId}.wonder.exploration.instruction`,
          'Use the interactive tools below to experiment and observe what changes.'
        ),
        hints: [
          t(`worlds.${worldId}.modules.${moduleId}.wonder.exploration.hints.0`, 'Try changing one variable at a time.'),
          t(`worlds.${worldId}.modules.${moduleId}.wonder.exploration.hints.1`, 'Notice any patterns?'),
          t(`worlds.${worldId}.modules.${moduleId}.wonder.exploration.hints.2`, 'What happens if you take it to the extreme?')
        ],
        component: <WrappedComponent {...props} />
      },
      insight: {
        revelation: t(
          `worlds.${worldId}.modules.${moduleId}.wonder.insight.revelation`,
          `You've just uncovered the fundamental principles of ${defaultTitle}!`
        ),
        connection: t(
          `worlds.${worldId}.modules.${moduleId}.wonder.insight.connection`,
          'This matches the mystery we started with.'
        ),
        ahaMoment: t(
          `worlds.${worldId}.modules.${moduleId}.wonder.insight.ahaMoment`,
          `Ah! So that is how ${defaultTitle} works!`
        ),
      },
      application: {
        realWorld: t(
          `worlds.${worldId}.modules.${moduleId}.wonder.application.realWorld`,
          'These rules govern everything from microscopic cells to massive galaxies.'
        ),
        indianContext: t(
          `worlds.${worldId}.modules.${moduleId}.wonder.application.indianContext`,
          'In India, engineers and scientists use these exact principles every day to solve local challenges.'
        ),
        tryIt: t(
          `worlds.${worldId}.modules.${moduleId}.wonder.application.activity`,
          'Next time you are outside, see if you can spot this in action!'
        ),
      }
    };

    return (
      <WonderFirstTemplate
        module={wonderModule}
        onComplete={() => navigate('/')}
      />
    );
  };
}
