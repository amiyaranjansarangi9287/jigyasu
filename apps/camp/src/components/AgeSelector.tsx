// CampCraft - Age Tier Selector

import { ageTiers, AgeTier } from '../data/categories';

interface AgeSelectorProps {
  selectedAge: AgeTier | null;
  onSelectAge: (age: AgeTier) => void;
  variant?: 'full' | 'compact' | 'modal';
  onClose?: () => void;
}

export default function AgeSelector({
  selectedAge,
  onSelectAge,
  variant = 'full',
  onClose
}: AgeSelectorProps) {
  const tierDetails = {
    '3-5': {
      title: 'Little Explorers',
      description: 'Simple, sensory activities with parent guidance. Perfect for curious toddlers!',
      features: ['Parent-guided activities', 'Sensory exploration', 'Big, colorful steps', 'Extra safety tips'],
      image: '🐣',
      bgGradient: 'from-pink-400 to-purple-400',
      borderColor: 'border-pink-300',
      hoverBg: 'hover:bg-pink-50 dark:hover:bg-pink-900/20'
    },
    '6-8': {
      title: 'Junior Creators',
      description: 'Fun projects with clear step-by-step instructions. Building confidence through making!',
      features: ['Semi-independent', 'Achievement badges', 'Skill building', 'Creative freedom'],
      image: '🌟',
      bgGradient: 'from-blue-400 to-indigo-400',
      borderColor: 'border-blue-300',
      hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    '9-12': {
      title: 'Adventure Builders',
      description: 'Complex projects for independent makers ready for real challenges!',
      features: ['Independent work', 'Advanced techniques', 'STEM concepts', 'Real tools'],
      image: '🚀',
      bgGradient: 'from-orange-400 to-red-400',
      borderColor: 'border-orange-300',
      hoverBg: 'hover:bg-orange-50 dark:hover:bg-orange-900/20'
    }
  };

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-3xl w-full p-6 animate-modal-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Who's making today?
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid gap-4">
            {ageTiers.map((tier) => {
              const details = tierDetails[tier.id as keyof typeof tierDetails];
              const isSelected = selectedAge === tier.id;

              return (
                <button
                  key={tier.id}
                  onClick={() => {
                    onSelectAge(tier.id as AgeTier);
                    onClose?.();
                  }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    isSelected
                      ? `${details.borderColor} bg-gradient-to-r ${details.bgGradient} bg-opacity-10`
                      : `border-gray-200 dark:border-gray-700 ${details.hoverBg}`
                  }`}
                >
                  <span className="text-5xl">{details.image}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        {details.title}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Ages {tier.id}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                      {details.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {selectedAge && (
            <button
              onClick={() => {
                onSelectAge(null as unknown as AgeTier);
              }}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
            >
              Clear selection (show all ages)
            </button>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex gap-2">
        {ageTiers.map((tier) => {
          const details = tierDetails[tier.id as keyof typeof tierDetails];
          const isSelected = selectedAge === tier.id;

          return (
            <button
              key={tier.id}
              onClick={() => onSelectAge(tier.id as AgeTier)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                isSelected
                  ? `${details.borderColor} bg-gradient-to-r ${details.bgGradient} text-white`
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span>{details.image}</span>
              <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                {tier.id}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Full variant - used on landing page
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Who's making today? 🎨
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Select an age group for personalized activities that match your child's skill level
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {ageTiers.map((tier) => {
            const details = tierDetails[tier.id as keyof typeof tierDetails];
            const isSelected = selectedAge === tier.id;

            return (
              <button
                key={tier.id}
                onClick={() => onSelectAge(tier.id as AgeTier)}
                className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 text-left overflow-hidden ${
                  isSelected
                    ? `${details.borderColor} shadow-xl scale-[1.02]`
                    : `border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg hover:-translate-y-1`
                }`}
              >
                {/* Background gradient on hover/select */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${details.bgGradient} transition-opacity duration-300 ${
                    isSelected ? 'opacity-10' : 'opacity-0 group-hover:opacity-5'
                  }`}
                />

                <div className="relative">
                  {/* Icon */}
                  <div className="text-6xl mb-4 group-hover:animate-bounce-slow">
                    {details.image}
                  </div>

                  {/* Title & Age */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {details.title}
                  </h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${details.bgGradient} text-white mb-3`}>
                    Ages {tier.id}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {details.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-1">
                    {details.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center animate-pop-in">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {selectedAge && (
          <div className="text-center mt-6">
            <button
              onClick={() => onSelectAge(null as unknown as AgeTier)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
            >
              Clear selection (show all ages)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
