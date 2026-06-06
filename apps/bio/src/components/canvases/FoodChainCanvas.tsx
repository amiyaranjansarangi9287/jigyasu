import { useRef, useEffect } from 'react'

interface FoodChainCanvasProps {
  stage: number
  isPlaying: boolean
}

export default function FoodChainCanvas({ stage, isPlaying }: FoodChainCanvasProps) {
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
      bg.addColorStop(0, '#ecfdf5')
      bg.addColorStop(1, '#d1fae5')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Food chain stages
      const stages = [
        { emoji: '☀️', label: 'Sun', y: h * 0.15, color: '#f59e0b' },
        { emoji: '🌿', label: 'Producer', y: h * 0.3, color: '#22c55e' },
        { emoji: '🐇', label: 'Herbivore', y: h * 0.45, color: '#3b82f6' },
        { emoji: '🦊', label: 'Carnivore', y: h * 0.6, color: '#ef4444' },
        { emoji: '🍄', label: 'Decomposer', y: h * 0.75, color: '#8b5cf6' },
      ]

      const centerX = w / 2

      stages.forEach((s, i) => {
        const isActive = i <= stage
        const isCurrent = i === stage
        const pulse = isCurrent && isPlaying ? Math.sin(Date.now() * 0.004) * 5 : 0

        // Arrow from previous stage
        if (i > 0 && i <= stage) {
          const prevY = stages[i - 1].y
          ctx.strokeStyle = isActive ? `${s.color}60` : '#cbd5e1'
          ctx.lineWidth = 3
          ctx.setLineDash([5, 5])
          ctx.beginPath()
          ctx.moveTo(centerX, prevY + 25)
          ctx.lineTo(centerX, s.y - 25)
          ctx.stroke()
          ctx.setLineDash([])

          // Arrow head
          ctx.fillStyle = isActive ? s.color : '#cbd5e1'
          ctx.beginPath()
          ctx.moveTo(centerX, s.y - 20)
          ctx.lineTo(centerX - 8, s.y - 30)
          ctx.lineTo(centerX + 8, s.y - 30)
          ctx.closePath()
          ctx.fill()
        }

        // Stage circle with pulse
        ctx.beginPath()
        ctx.arc(centerX, s.y, 30 + pulse, 0, Math.PI * 2)
        ctx.fillStyle = isActive ? `${s.color}20` : '#f1f5f9'
        ctx.fill()
        ctx.strokeStyle = isActive ? s.color : '#cbd5e1'
        ctx.lineWidth = isCurrent ? 4 : 2
        ctx.stroke()

        // Emoji
        ctx.font = '24px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(s.emoji, centerX, s.y + 8)

        // Label
        ctx.font = `bold 12px Inter, sans-serif`
        ctx.fillStyle = isActive ? s.color : '#94a3b8'
        ctx.fillText(s.label, centerX, s.y + 50)

        // Energy level
        const energy = 100 - i * 20
        ctx.font = '10px Inter, sans-serif'
        ctx.fillStyle = isActive ? '#64748b' : '#cbd5e1'
        ctx.fillText(`${energy}% energy`, centerX, s.y + 65)
      })

      // Energy loss note
      ctx.font = '11px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#64748b'
      ctx.fillText('💡 90% energy lost at each level', 15, h - 30)
      ctx.fillText('Only 10% passes to next level', 15, h - 15)

      // Title
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#065f46'
      ctx.fillText('🌾 Food Chain', 15, 25)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [stage, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
