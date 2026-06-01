import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'
import { getConceptById } from '../../data/concepts'

interface ConceptPlaceholderProps {
  id: string
}

export default function ConceptPlaceholder({ id }: ConceptPlaceholderProps) {
  const concept = getConceptById(id)

  if (!concept) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-700">Concept not found</h2>
        <Link to="/" className="text-sky-500 hover:underline mt-4 inline-block">Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-600 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to all concepts
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">{concept.emoji}</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{concept.title}</h1>
        <p className="text-slate-500 mb-6">{concept.shortDesc}</p>

        <div className="inline-flex items-center gap-3 px-6 py-4 bg-amber-50 rounded-xl border border-amber-100">
          <Construction size={24} className="text-amber-500" />
          <div className="text-left">
            <p className="font-semibold text-amber-700">Coming Soon</p>
            <p className="text-sm text-amber-600">This concept is being built and will be available shortly.</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-slate-50 rounded-xl text-left">
          <h3 className="font-semibold text-slate-700 mb-3">What you'll learn:</h3>
          <p className="text-slate-600">{concept.longDesc}</p>
        </div>
      </div>
    </div>
  )
}
