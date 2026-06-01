import React from 'react'
import { BookOpen } from 'lucide-react'

interface GradeSelectorProps {
  selectedGrade: '2-6' | '6-10' | 'all'
  onSelect: (grade: '2-6' | '6-10' | 'all') => void
  stats: {
    '2-6': { total: number; live: number; status: string }
    '6-10': { total: number; live: number; status: string }
  }
}

export default function GradeSelector({ selectedGrade, onSelect, stats }: GradeSelectorProps) {
  const grades: { id: '2-6' | '6-10' | 'all'; label: string; subtitle: string; color: string }[] = [
    { id: 'all', label: 'All Grades', subtitle: `${stats['2-6'].live + stats['6-10'].live} concepts`, color: 'from-sky-400 to-indigo-500' },
    { id: '2-6', label: 'Class 2-6', subtitle: `${stats['2-6'].live} concepts`, color: 'from-emerald-400 to-teal-500' },
    { id: '6-10', label: 'Class 6-10', subtitle: `${stats['6-10'].live} concepts`, color: 'from-amber-400 to-orange-500' },
  ]

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {grades.map((grade) => (
        <button
          key={grade.id}
          onClick={() => onSelect(grade.id)}
          className={`relative px-6 py-4 rounded-2xl font-semibold transition-all duration-200 min-w-[160px] ${
            selectedGrade === grade.id
              ? `bg-gradient-to-r ${grade.color} text-white shadow-lg scale-105`
              : 'bg-white text-slate-700 border border-slate-200 hover:border-sky-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center gap-2 justify-center">
            <BookOpen size={18} />
            <span>{grade.label}</span>
          </div>
          <p className={`text-xs mt-1 ${selectedGrade === grade.id ? 'text-white/80' : 'text-slate-400'}`}>
            {grade.subtitle}
          </p>
          {grade.id === '6-10' && selectedGrade !== grade.id && (
            <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
              65%
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
