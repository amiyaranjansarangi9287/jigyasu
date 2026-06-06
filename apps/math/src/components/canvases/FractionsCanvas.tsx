import { useRef, useEffect } from 'react'

interface FractionsCanvasProps {
  numerator: number
  denominator: number
  isPlaying: boolean
}

export default function FractionsCanvas({ numerator, denominator, isPlaying }: FractionsCanvasProps) {
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

      // Grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)'
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

      const cx = w / 2
      const cy = h / 2
      const radius = Math.min(w, h) * 0.3
      const rotation = isPlaying ? Date.now() * 0.0002 : 0

      // Circle background
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rotation)
      ctx.translate(-cx, -cy)

      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fillStyle = '#f0fdf4'
      ctx.fill()
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 3
      ctx.stroke()

      // Filled segments
      const startAngle = -Math.PI / 2
      for (let i = 0; i < numerator; i++) {
        const angle = startAngle + (i / denominator) * Math.PI * 2
        const nextAngle = startAngle + ((i + 1) / denominator) * Math.PI * 2

        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, radius, angle, nextAngle)
        ctx.closePath()

        const fillGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        fillGrad.addColorStop(0, '#34d399')
        fillGrad.addColorStop(1, '#10b981')
        ctx.fillStyle = fillGrad
        ctx.fill()
      }

      // Segment lines
      for (let i = 0; i < denominator; i++) {
        const angle = startAngle + (i / denominator) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius)
        ctx.strokeStyle = '#059669'
        ctx.lineWidth = 2
        ctx.stroke()
      }

      ctx.restore()

      // Fraction display (not rotated)
      ctx.font = 'bold 48px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#065f46'
      ctx.fillText(numerator.toString(), cx, cy - 10)

      // Fraction line
      ctx.beginPath()
      ctx.moveTo(cx - 30, cy + 5)
      ctx.lineTo(cx + 30, cy + 5)
      ctx.strokeStyle = '#065f46'
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.fillText(denominator.toString(), cx, cy + 45)

      // Percentage
      const percentage = ((numerator / denominator) * 100).toFixed(1)
      ctx.font = 'bold 16px Inter, sans-serif'
      ctx.fillStyle = '#059669'
      ctx.fillText(`= ${percentage}%`, cx, cy + 75)

      // Bar representation
      const barY = h * 0.85
      const barWidth = w * 0.6
      const barHeight = 20
      const barX = (w - barWidth) / 2

      // Bar background
      ctx.fillStyle = '#f0fdf4'
      ctx.beginPath()
      ctx.roundRect(barX, barY, barWidth, barHeight, 10)
      ctx.fill()
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2
      ctx.stroke()

      // Bar fill
      const fillWidth = (numerator / denominator) * barWidth
      ctx.fillStyle = '#10b981'
      ctx.beginPath()
      ctx.roundRect(barX, barY, fillWidth, barHeight, 10)
      ctx.fill()

      // Bar segments
      for (let i = 1; i < denominator; i++) {
        const segX = barX + (i / denominator) * barWidth
        ctx.beginPath()
        ctx.moveTo(segX, barY)
        ctx.lineTo(segX, barY + barHeight)
        ctx.strokeStyle = '#059669'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [numerator, denominator, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
