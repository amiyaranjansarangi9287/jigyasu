import React, { useState, ReactNode } from 'react'
import NarratorCharacter from './NarratorCharacter'

interface CanvasWithNarratorProps {
  children: ReactNode
  headerContent: ReactNode
  currentNarration: string
  isNarrating: boolean
  headerClassName?: string
}

export default function CanvasWithNarrator({ children, headerContent, currentNarration, isNarrating, headerClassName = '' }: CanvasWithNarratorProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-6 shadow-lg relative">
      <div className={`px-5 py-4 border-b ${headerClassName}`}>
        <div className="flex items-center justify-between">
          {headerContent}
        </div>
      </div>
      <div className="aspect-video relative">
        {children}
        <NarratorCharacter currentText={currentNarration} isSpeaking={isNarrating} />
      </div>
    </div>
  )
}
