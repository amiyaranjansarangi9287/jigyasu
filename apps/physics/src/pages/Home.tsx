import React, { lazy, Suspense, useState, useMemo } from 'react'
import { Search, Sparkles, BookOpen, Users } from 'lucide-react'
const GradeSelector = lazy(() => import('../components/GradeSelector'));
import { trackEvent } from '@jigyasu/storage';
import { ConceptCard } from '@jigyasu/ui';
import { concepts, getStats, categories } from '../data/concepts'

export default function Home() {
  React.useEffect(() => {
    trackEvent('page_view', { app: 'learn', page: 'home' });
  }, []);

  const [selectedGrade, setSelectedGrade] = useState<'2-6' | '6-10' | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const stats = getStats()

  const filteredConcepts = useMemo(() => {
    return concepts.filter(c => {
      const gradeMatch = selectedGrade === 'all' || c.grade === selectedGrade
      const searchMatch = !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
      const categoryMatch = selectedCategory === 'all' || c.category === selectedCategory
      return gradeMatch && searchMatch && categoryMatch
    })
  }, [selectedGrade, searchQuery, selectedCategory])

  return (
    <div>
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-100 text-sky-600 text-sm font-medium mb-6">
          <Sparkles size={16} />
          Interactive Science Visualizations
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Fun with Science
          </span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
          See science come alive with animations and friendly narration.
          Perfect for students, parents, and curious minds of any age.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <BookOpen size={18} className="text-sky-500" />
            <span className="text-sm font-semibold text-slate-700">{concepts.length} Concepts</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <Users size={18} className="text-emerald-500" />
            <span className="text-sm font-semibold text-slate-700">Class 2-10</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
            <Sparkles size={18} className="text-amber-500" />
            <span className="text-sm font-semibold text-slate-700">Free Forever</span>
          </div>
        </div>
      </div>

      {/* Grade Selector */}
      <div className="mb-8">
        <GradeSelector selectedGrade={selectedGrade} onSelect={setSelectedGrade} stats={stats} />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search concepts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-sky-300 focus:ring-2 focus:ring-sky-100 outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-sky-500 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Concept Grid */}
      {filteredConcepts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConcepts.map(concept => (
            <ConceptCard 
              key={concept.id} 
              title={concept.title} 
              emoji={concept.emoji} 
              category={concept.category} 
              description={concept.shortDesc} 
              onClick={() => {}} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No concepts found</h3>
          <p className="text-slate-500">Try a different search term or filter</p>
        </div>
      )}

      {/* Grade Status Table */}
      <div className="mt-16 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-sky-100">
          <h3 className="font-semibold text-slate-800">Implementation Status</h3>
        </div>
        <div className="p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 text-slate-500 font-medium">Grade</th>
                <th className="text-center py-2 text-slate-500 font-medium">Total</th>
                <th className="text-center py-2 text-slate-500 font-medium">Live</th>
                <th className="text-center py-2 text-slate-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-50">
                <td className="py-3 font-medium text-slate-700">Class 2-6</td>
                <td className="py-3 text-center text-slate-600">{stats['2-6'].total}</td>
                <td className="py-3 text-center font-semibold text-emerald-600">{stats['2-6'].live}</td>
                <td className="py-3 text-center">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    ✅ COMPLETE
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-slate-700">Class 6-10</td>
                <td className="py-3 text-center text-slate-600">20</td>
                <td className="py-3 text-center font-semibold text-emerald-600">20</td>
                <td className="py-3 text-center">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    ✅ COMPLETE
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
