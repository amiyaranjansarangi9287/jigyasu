import { motion } from 'framer-motion';
import type { HeritageStory } from '../types';
import { BookOpen, MapPin, Calendar } from 'lucide-react';

interface StoryCardProps {
  story: HeritageStory;
  index: number;
  onClick: () => void;
}

export default function StoryCard({ story, index, onClick }: StoryCardProps) {
  const hasImage = story.coverImage && story.coverImage.length >0;

  return (<motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Cover */}
      <div className="h-40 relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {hasImage ? (
          <img
            src={story.coverImage}
            alt={story.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />) : (<div className={`w-full h-full bg-gradient-to-br ${story.gradient} flex items-center justify-center`}>
            <span className="text-5xl">{story.emoji || story.icon || '📖'}</span>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-slate-700 shadow-sm">
            {story.categoryIcon}
            {story.category}
          </span>
        </div>
        {/* Age badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-slate-600 shadow-sm">
            {story.ageRange}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-slate-800 text-base mb-1 line-clamp-1">
          {story.title}
        </h3>
        <p className="text-sm text-amber-600 font-medium mb-2">
          {story.subtitle}
        </p>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">
          {story.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {story.pages.length} pages
          </span>
          {story.region && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {story.region}
            </span>
          )}
          {story.period && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {story.period}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
