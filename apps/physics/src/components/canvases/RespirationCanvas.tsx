import { useRef, useEffect } from 'react'

interface RespirationCanvasProps {
  stage: number
  isPlaying: boolean
}

export default function RespirationCanvas({ stage, isPlaying }: RespirationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    let time = 0

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio
      const h = canvas.height / window.devicePixelRatio
      ctx.clearRect(0, 0, w, h)

      if (isPlaying) time += 0.03

      const cx = w / 2
      const cy = h / 2

      ctx.fillStyle = '#fef3c7'
      ctx.beginPath()
      ctx.ellipse(cx, cy, w * 0.4, h * 0.35, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = '#fde68a'
      ctx.beginPath()
      ctx.ellipse(cx, cy, w * 0.3, h * 0.25, 0, 0, Math.PI * 2)
      ctx.fill()

      const folds = 6
      for (let i = 0; i < folds; i++) {
        const angle = (i / folds) * Math.PI * 2 + time * 0.2
        const fx = cx + Math.cos(angle) * w * 0.2
        const fy = cy + Math.sin(angle) * h * 0.15
        ctx.strokeStyle = '#fbbf24'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.quadraticCurveTo(fx + Math.cos(angle + 0.5) * 20, fy + Math.sin(angle + 0.5) * 20, fx, fy)
        ctx.stroke()
      }

      const molecules = [
        { label: 'C₆H₁₂O₆', color: '#22c55e', x: cx - w * 0.35, y: cy - h * 0.2 },
        { label: 'O₂', color: '#3b82f6', x: cx + w * 0.35, y: cy - h * 0.2 },
        { label: 'CO₂', color: '#ef4444', x: cx - w * 0.35, y: cy + h * 0.2 },
        { label: 'H₂O', color: '#06b6d4', x: cx + w * 0.35, y: cy + h * 0.2 },
        { label: 'ATP ⚡', color: '#f59e0b', x: cx, y: cy + h * 0.4 },
      ]

      molecules.forEach((m, i) => {
        const show = i <= stage
        if (!show) return

        const pulse = isPlaying ? Math.sin(time * 2 + i) * 3 : 0
        ctx.fillStyle = m.color
        ctx.beginPath()
        ctx.arc(m.x, m.y + pulse, 22, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#fff'
        ctx.font = 'bold 11px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(m.label, m.x, m.y + pulse + 4)
      })

      if (stage >= 2) {
        ctx.strokeStyle = '#94a3b8'
        ctx.lineWidth = 1.5
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.moveTo(cx - w * 0.35 + 25, cy - h * 0.2)
        ctx.lineTo(cx - 30, cy)
        ctx.moveTo(cx + w * 0.35 - 25, cy - h * 0.2)
        ctx.lineTo(cx + 30, cy)
        ctx.moveTo(cx, cy + 25)
        ctx.lineTo(cx, cy + h * 0.4 - 25)
        ctx.stroke()
        ctx.setLineDash([])
      }

      ctx.fillStyle = '#1e293b'
      ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'center'
      const labels = ['Glucose enters', 'Oxygen enters', 'CO₂ produced', 'Water produced', 'ATP energy released']
      ctx.fillText(labels[stage] || 'Cellular Respiration', w / 2, 30)

      ctx.fillStyle = '#64748b'
      ctx.font = '12px sans-serif'
      ctx.fillText('C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP', w / 2, h - 20)

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [stage, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
