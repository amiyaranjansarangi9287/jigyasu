import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BookOpen, Globe, Users, X } from 'lucide-react';
import {
  allHeritageStories,
  collections,
  getStoriesByCollection,
  getCategories,
  getAgeRanges,
} from './data';
import type { HeritageStory } from './types';
import StoryCard from './components/StoryCard';
import StoryReader from './components/StoryReader';

export default function HeritageWorld() {
  const { t } = useTranslation();
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [readingStory, setReadingStory] = useState<HeritageStory | null>(null);

  const categories = useMemo(() => ['all', ...getCategories()], []);
  const ageRanges = useMemo(() => ['all', ...getAgeRanges()], []);

  const displayedStories = useMemo(() => {
    let stories = selectedCollection
      ? getStoriesByCollection(selectedCollection)
      : allHeritageStories;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      stories = stories.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.subtitle.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.coreValue.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      stories = stories.filter(s => s.category === selectedCategory);
    }

    if (selectedAge !== 'all') {
      stories = stories.filter(s => s.ageRange === selectedAge);
    }

    return stories;
  }, [selectedCollection, searchQuery, selectedCategory, selectedAge]);

  const totalStories = allHeritageStories.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Background decoration */}
      <div className="fixed inset-0 opacity-30 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full blur-3xl translate-x-1/2" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-violet-200 to-purple-200 rounded-full blur-3xl translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl"
            >
              📿
            </motion.span>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">{t('auto.learning.s053_heritageworld', 'HeritageWorld')}</h1>
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl"
            >
              🙏
            </motion.span>
          </div>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto">
            Stories of wisdom, courage, and love from India's greatest traditions
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span className="font-medium text-amber-800">{totalStories} Stories</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span className="font-medium text-emerald-800">{collections.length} Collections</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full">
              <Users className="w-4 h-4 text-violet-500" />
              <span className="font-medium text-violet-800">{t('auto.learning.s054_all_ages', 'All Ages')}</span>
            </div>
          </div>
        </motion.header>

        {/* Collection Selector */}
        {!selectedCollection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {collections.map(col => (
              <motion.button
                key={col.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCollection(col.id)}
                className={`relative overflow-hidden rounded-2xl p-5 text-left transition-shadow hover:shadow-lg bg-white border border-slate-100`}
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${col.gradient}`} />
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{col.icon}</span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                    {col.count}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{col.name}</h3>
                <p className="text-sm text-slate-500">{col.description}</p>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Collection Header (when selected) */}
        {selectedCollection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <button
              onClick={() => {
                setSelectedCollection(null);
                setSelectedCategory('all');
                setSelectedAge('all');
                setSearchQuery('');
              }}
              className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 font-medium mb-4"
            >
              <X className="w-4 h-4" />{t('auto.learning.s055_back_to_collections', 'Back to Collections')}</button>
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {collections.find(c => c.id === selectedCollection)?.icon}
              </span>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {collections.find(c => c.id === selectedCollection)?.name}
                </h2>
                <p className="text-sm text-slate-500">
                  {displayedStories.length} stories
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-slate-100"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
              />
            </div>

            {/* Category filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="pl-9 pr-8 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 appearance-none cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Age filter */}
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedAge}
                onChange={e => setSelectedAge(e.target.value)}
                className="pl-9 pr-8 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 appearance-none cursor-pointer"
              >
                {ageRanges.map(a => (
                  <option key={a} value={a}>
                    {a === 'all' ? 'All Ages' : `Ages ${a}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <div className="mb-4 text-center">
          <span className="text-amber-600 font-medium text-sm">
            Showing {displayedStories.length} of {totalStories} stories
          </span>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedStories.map((story, i) => (
            <StoryCard
              key={story.id}
              story={story}
              index={i}
              onClick={() => setReadingStory(story)}
            />
          ))}
        </div>

        {/* Empty state */}
        {displayedStories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold text-slate-600">{t('auto.learning.s056_no_stories_found', 'No stories found')}</h3>
            <p className="text-slate-400 text-sm mt-1">{t('auto.learning.s057_try_adjusting_your_filters_or_search_ter', 'Try adjusting your filters or search terms')}</p>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center py-8 border-t border-amber-200">
          <p className="text-amber-600">
            Made with love for children who love stories of wisdom and courage
          </p>
          <p className="text-sm text-amber-400 mt-2">
            Every story has a lesson, and every lesson has a story
          </p>
        </footer>
      </div>

      {/* Story Reader Modal */}
      <AnimatePresence>
        {readingStory && (
          <StoryReader
            story={readingStory}
            onClose={() => setReadingStory(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
