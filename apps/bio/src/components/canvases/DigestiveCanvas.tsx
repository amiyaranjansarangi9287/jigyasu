import { useRef, useEffect } from 'react'

interface DigestiveCanvasProps {
  stage: number
  isPlaying: boolean
}

export default function DigestiveCanvas({ stage, isPlaying }: DigestiveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#fef2f2')
      bg.addColorStop(1, '#fee2e2')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Body outline
      ctx.strokeStyle = '#f9a8d4'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.ellipse(w / 2, h / 2, w * 0.3, h * 0.4, 0, 0, Math.PI * 2)
      ctx.stroke()

      // Digestive tract stages
      const stages = [
        { emoji: '👄', label: 'Mouth', x: w * 0.5, y: h * 0.15, color: '#f472b6' },
        { emoji: '📏', label: 'Esophagus', x: w * 0.5, y: h * 0.25, color: '#fb7185' },
        { emoji: '🫗', label: 'Stomach', x: w * 0.45, y: h * 0.38, color: '#ef4444' },
        { emoji: '🔄', label: 'Small Intestine', x: w * 0.5, y: h * 0.55, color: '#f97316' },
        { emoji: '💧', label: 'Large Intestine', x: w * 0.5, y: h * 0.7, color: '#a855f7' },
        { emoji: '🚪', label: 'Exit', x: w * 0.5, y: h * 0.85, color: '#64748b' },
      ]

      // Draw connections
      for (let i = 0; i < stages.length - 1; i++) {
        const current = stages[i]
        const next = stages[i + 1]
        ctx.beginPath()
        ctx.moveTo(current.x, current.y + 15)
        ctx.lineTo(next.x, next.y - 15)
        ctx.strokeStyle = i <= stage ? `${current.color}60` : '#cbd5e1'
        ctx.lineWidth = 4
        ctx.setLineDash([5, 5])
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Draw stages
      stages.forEach((s, i) => {
        const isActive = i <= stage
        const isCurrent = i === stage

        // Circle
        ctx.beginPath()
        ctx.arc(s.x, s.y, 25, 0, Math.PI * 2)
        ctx.fillStyle = isActive ? `${s.color}20` : '#f1f5f9'
        ctx.fill()
        ctx.strokeStyle = isActive ? s.color : '#cbd5e1'
        ctx.lineWidth = isCurrent ? 4 : 2
        ctx.stroke()

        // Emoji
        ctx.font = '20px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(s.emoji, s.x, s.y + 7)

        // Label
        ctx.font = `bold 10px Inter, sans-serif`
        ctx.fillStyle = isActive ? s.color : '#94a3b8'
        ctx.fillText(s.label, s.x, s.y + 40)
      })

      // Food particle animation
      if (isPlaying && stage < stages.length - 1) {
        const currentStage = stages[stage]
        const nextStage = stages[stage + 1]
        const progress = isPlaying ? (Date.now() % 2000) / 2000 : 0
        const foodX = currentStage.x + (nextStage.x - currentStage.x) * progress
        const foodY = currentStage.y + (nextStage.y - currentStage.y) * progress

        ctx.beginPath()
        ctx.arc(foodX, foodY, 6, 0, Math.PI * 2)
        ctx.fillStyle = '#fbbf24'
        ctx.fill()
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Title
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#991b1b'
      ctx.fillText('🫁 Digestive System', 15, 25)

      // Stage info
      ctx.font = '11px Inter, sans-serif'
      ctx.fillStyle = '#64748b'
      ctx.fillText(`Stage ${stage + 1} of ${stages.length}: ${stages[stage].label}`, 15, h - 20)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [stage, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
