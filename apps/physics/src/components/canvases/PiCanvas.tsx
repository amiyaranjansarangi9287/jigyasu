import { useRef, useEffect } from 'react'

interface PiCanvasProps {
  segments: number
  isPlaying: boolean
}

export default function PiCanvas({ segments, isPlaying }: PiCanvasProps) {
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
    const cx = w * 0.35
    const cy = h / 2
    const radius = Math.min(w * 0.25, h * 0.35)

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#fef3c7')
      bg.addColorStop(1, '#fde68a')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)'
      ctx.lineWidth = 1
      for (let x = 0; x < w; x += 20) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // Circle
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.strokeStyle = '#0369a1'
      ctx.lineWidth = 3
      ctx.stroke()

      // Fill circle
      ctx.fillStyle = 'rgba(14, 165, 233, 0.1)'
      ctx.fill()

      // Diameter line
      ctx.beginPath()
      ctx.moveTo(cx - radius, cy)
      ctx.lineTo(cx + radius, cy)
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 3
      ctx.stroke()

      // Diameter label
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#ef4444'
      ctx.fillText('d (diameter)', cx, cy - 10)

      // Unrolled circumference
      const circumference = 2 * Math.PI * radius
      const unrollX = w * 0.65
      const unrollY = cy

      // Unrolled line (3.14 times diameter)
      ctx.beginPath()
      ctx.moveTo(unrollX - circumference / 2, unrollY)
      ctx.lineTo(unrollX + circumference / 2, unrollY)
      ctx.strokeStyle = '#059669'
      ctx.lineWidth = 3
      ctx.stroke()

      // Mark diameter lengths on unrolled line
      for (let i = 0; i <= 3; i++) {
        const markX = unrollX - circumference / 2 + i * (circumference / 3.14)
        ctx.beginPath()
        ctx.moveTo(markX, unrollY - 8)
        ctx.lineTo(markX, unrollY + 8)
        ctx.strokeStyle = '#059669'
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.font = '10px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#059669'
        ctx.fillText(i === 0 ? '0' : i === 3 ? '3d' : `${i}d`, markX, unrollY + 20)
      }

      // Pi label
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#059669'
      ctx.fillText('π × d = circumference', unrollX, unrollY - 15)
      ctx.fillText('π ≈ 3.14159...', unrollX, unrollY + 40)

      // Polygon approximation with rotation
      if (segments >= 3) {
        const rotation = isPlaying ? Date.now() * 0.0003 : 0
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rotation)
        ctx.translate(-cx, -cy)

        ctx.beginPath()
        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2 - Math.PI / 2
          const px = cx + Math.cos(angle) * radius
          const py = cy + Math.sin(angle) * radius
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)'
        ctx.fill()

        ctx.restore()
      }

      // Pi value display
      ctx.font = 'bold 24px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#0369a1'
      ctx.fillText('π = 3.14159265...', w / 2, 30)

      // Ratio visualization
      ctx.font = '12px Inter, sans-serif'
      ctx.fillStyle = '#64748b'
      ctx.fillText(`Circumference ÷ Diameter = π`, w / 2, h - 20)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [segments, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
