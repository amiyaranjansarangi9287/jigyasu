import { useRef, useEffect } from 'react'

interface ShapesCanvasProps {
  sides: number
  isPlaying: boolean
}

export default function ShapesCanvas({ sides, isPlaying }: ShapesCanvasProps) {
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
    const cx = w / 2
    const cy = h / 2
    const radius = Math.min(w, h) * 0.35

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

      const rotation = isPlaying ? Date.now() * 0.0003 : 0

      if (sides < 3) {
        // Circle
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.strokeStyle = '#059669'
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)'
        ctx.fill()

        ctx.font = 'bold 14px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#065f46'
        ctx.fillText('Circle (∞ sides)', cx, cy + radius + 30)
      } else {
        // Polygon with rotation
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rotation)
        ctx.translate(-cx, -cy)

        ctx.beginPath()
        for (let i = 0; i <= sides; i++) {
          const angle = (i / sides) * Math.PI * 2 - Math.PI / 2
          const px = cx + Math.cos(angle) * radius
          const py = cy + Math.sin(angle) * radius
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()

        const shapeGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        shapeGrad.addColorStop(0, 'rgba(16, 185, 129, 0.2)')
        shapeGrad.addColorStop(1, 'rgba(16, 185, 129, 0.05)')
        ctx.fillStyle = shapeGrad
        ctx.fill()
        ctx.strokeStyle = '#059669'
        ctx.lineWidth = 3
        ctx.stroke()

        // Vertices
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2 - Math.PI / 2
          const px = cx + Math.cos(angle) * radius
          const py = cy + Math.sin(angle) * radius

          ctx.beginPath()
          ctx.arc(px, py, 5, 0, Math.PI * 2)
          ctx.fillStyle = '#ef4444'
          ctx.fill()
          ctx.strokeStyle = '#dc2626'
          ctx.lineWidth = 1
          ctx.stroke()
        }

        ctx.restore()

        // Shape name (not rotated)
        const names: Record<number, string> = {
          3: 'Triangle', 4: 'Square', 5: 'Pentagon', 6: 'Hexagon',
          7: 'Heptagon', 8: 'Octagon', 9: 'Nonagon', 10: 'Decagon',
          11: 'Hendecagon', 12: 'Dodecagon',
        }
        const name = names[sides] || `${sides}-gon`

        ctx.font = 'bold 16px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#065f46'
        ctx.fillText(`${name} (${sides} sides)`, cx, cy + radius + 30)

        ctx.font = '11px Inter, sans-serif'
        ctx.fillStyle = '#64748b'
        ctx.fillText(`Corners: ${sides} | Diagonals: ${(sides * (sides - 3)) / 2}`, cx, cy + radius + 50)
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [sides, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
