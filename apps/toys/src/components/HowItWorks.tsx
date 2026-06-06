import { useReveal } from '../hooks/useReveal';

const steps = [
  {
    number: '01',
    icon: '🔍',
    title: 'Choose a Project',
    description:
      'Browse our collection and pick a toy that matches your skill level and interests. Each project has clear difficulty ratings, time estimates, and community ratings.',
    color: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50',
    borderColor: 'border-violet-100',
  },
  {
    number: '02',
    icon: '🛒',
    title: 'Gather Materials',
    description:
      'Every project includes a detailed materials list. Most supplies can be found at your local craft store or ordered online with one click.',
    color: 'from-blue-500 to-cyan-600',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-100',
  },
  {
    number: '03',
    icon: '🔨',
    title: 'Build & Create',
    description:
      'Follow our step-by-step visual instructions at your own pace. Each guide includes helpful tips, tricks, and safety notes from experienced builders.',
    color: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
  },
  {
    number: '04',
    icon: '🎉',
    title: 'Play & Share',
    description:
      'Enjoy your handcrafted creation! Share photos of your finished toy with our community, rate your experience, and inspire others.',
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-100',
  },
];

export default function HowItWorks() {
  const sectionRef = useReveal();

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative bg elements */}
      <div className="absolute top-10 right-0 w-72 h-72 bg-violet-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />

      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-20 reveal">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Simple Steps
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Building your own toys is easier than you think. Follow these four simple steps to get started.
          </p>
        </div>

        {/* Steps - Timeline layout */}
        <div className="relative">
          {/* Vertical center line (desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-200 via-blue-200 via-emerald-200 to-amber-200 -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={step.number} className="reveal relative">
                  {/* Center dot (desktop) */}
                  <div className="hidden lg:flex absolute left-1/2 top-8 -translate-x-1/2 z-10">
                    <div className={`w-14 min-h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {step.number}
                    </div>
                  </div>

                  <div className={`lg:grid lg:grid-cols-2 lg:gap-16 items-center ${isEven ? '' : 'direction-rtl'}`}>
                    {/* Content side */}
                    <div className={`${isEven ? 'lg:text-right lg:pr-16' : 'lg:order-2 lg:pl-16'}`}>
                      {/* Mobile number badge */}
                      <div className={`lg:hidden w-12 min-h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-lg mb-4`}>
                        {step.number}
                      </div>

                      <div className={`${step.bgLight} w-16 min-h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 ${isEven ? 'lg:ml-auto' : ''}`}>
                        {step.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-500 leading-relaxed max-w-md">{step.description}</p>
                    </div>

                    {/* Visual side - decorative card */}
                    <div className={`hidden lg:block ${isEven ? 'lg:order-2 lg:pl-16' : 'lg:pr-16'}`}>
                      <div className={`bg-white rounded-3xl p-8 border ${step.borderColor} shadow-lg hover:shadow-xl transition-shadow`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-lg`}>
                            {step.icon}
                          </div>
                          <div className="flex-1">
                            <div className="h-2.5 bg-gray-100 rounded-full w-2/3 mb-2" />
                            <div className="h-2 bg-gray-100 rounded-full w-1/3" />
                          </div>
                        </div>
                        <div className="space-y-2.5">
                          <div className="h-2 bg-gray-100 rounded-full w-full" />
                          <div className="h-2 bg-gray-100 rounded-full w-5/6" />
                          <div className="h-2 bg-gray-100 rounded-full w-4/6" />
                        </div>
                        <div className="mt-5 flex gap-2">
                          <div className={`h-8 rounded-lg bg-gradient-to-r ${step.color} w-24 opacity-20`} />
                          <div className="h-8 rounded-lg bg-gray-100 w-16" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
