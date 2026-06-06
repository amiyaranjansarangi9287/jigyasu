import { useRef, useEffect } from 'react'

interface SensesCanvasProps {
  selectedSense: number
  isPlaying: boolean
}

export default function SensesCanvas({ selectedSense, isPlaying }: SensesCanvasProps) {
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

      // Body silhouette
      const cx = w / 2
      const cy = h / 2

      const pulse = isPlaying ? Math.sin(Date.now() * 0.003) * 0.1 + 0.3 : 0.3

      // Head
      ctx.beginPath()
      ctx.arc(cx, cy - 80, 40, 0, Math.PI * 2)
      ctx.fillStyle = selectedSense === 0 || selectedSense === 3 ? `rgba(139, 92, 246, ${pulse + 0.1})` : `rgba(148, 163, 184, ${pulse})`
      ctx.fill()
      ctx.strokeStyle = selectedSense === 0 || selectedSense === 3 ? '#7c3aed' : '#94a3b8'
      ctx.lineWidth = 2
      ctx.stroke()

      // Eyes
      ctx.beginPath()
      ctx.arc(cx - 12, cy - 85, 5, 0, Math.PI * 2)
      ctx.arc(cx + 12, cy - 85, 5, 0, Math.PI * 2)
      ctx.fillStyle = selectedSense === 0 ? '#7c3aed' : '#64748b'
      ctx.fill()

      // Nose
      ctx.beginPath()
      ctx.moveTo(cx, cy - 75)
      ctx.lineTo(cx - 3, cy - 65)
      ctx.lineTo(cx + 3, cy - 65)
      ctx.closePath()
      ctx.fillStyle = selectedSense === 3 ? '#7c3aed' : '#64748b'
      ctx.fill()

      // Mouth
      ctx.beginPath()
      ctx.arc(cx, cy - 55, 8, 0, Math.PI)
      ctx.strokeStyle = selectedSense === 4 ? '#7c3aed' : '#64748b'
      ctx.lineWidth = 2
      ctx.stroke()

      // Ears
      ctx.beginPath()
      ctx.ellipse(cx - 40, cy - 80, 8, 12, 0, 0, Math.PI * 2)
      ctx.ellipse(cx + 40, cy - 80, 8, 12, 0, 0, Math.PI * 2)
      ctx.fillStyle = selectedSense === 1 ? '#7c3aed' : '#64748b'
      ctx.fill()

      // Body
      ctx.beginPath()
      ctx.moveTo(cx - 25, cy - 40)
      ctx.lineTo(cx - 30, cy + 40)
      ctx.lineTo(cx + 30, cy + 40)
      ctx.lineTo(cx + 25, cy - 40)
      ctx.closePath()
      ctx.fillStyle = selectedSense === 2 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(148, 163, 184, 0.2)'
      ctx.fill()
      ctx.strokeStyle = selectedSense === 2 ? '#7c3aed' : '#94a3b8'
      ctx.lineWidth = 2
      ctx.stroke()

      // Hands
      ctx.beginPath()
      ctx.arc(cx - 45, cy + 20, 10, 0, Math.PI * 2)
      ctx.arc(cx + 45, cy + 20, 10, 0, Math.PI * 2)
      ctx.fillStyle = selectedSense === 2 ? '#7c3aed' : '#64748b'
      ctx.fill()

      // Senses labels
      const senses = [
        { emoji: '👁️', label: 'Sight', x: cx - 80, y: cy - 100, color: '#7c3aed' },
        { emoji: '👂', label: 'Hearing', x: cx + 80, y: cy - 100, color: '#7c3aed' },
        { emoji: '✋', label: 'Touch', x: cx - 80, y: cy + 20, color: '#7c3aed' },
        { emoji: '👃', label: 'Smell', x: cx + 80, y: cy - 60, color: '#7c3aed' },
        { emoji: '👅', label: 'Taste', x: cx + 80, y: cy - 40, color: '#7c3aed' },
      ]

      senses.forEach((s, i) => {
        const isActive = i === selectedSense
        ctx.font = '20px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(s.emoji, s.x, s.y)

        ctx.font = `bold 11px Inter, sans-serif`
        ctx.fillStyle = isActive ? '#7c3aed' : '#94a3b8'
        ctx.fillText(s.label, s.x, s.y + 20)
      })

      // Title
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#065f46'
      ctx.fillText('👁️ Five Senses', 15, 25)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [selectedSense, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
