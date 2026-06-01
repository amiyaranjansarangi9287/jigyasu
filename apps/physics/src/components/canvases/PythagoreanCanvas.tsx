import { useRef, useEffect } from 'react'

interface PythagoreanCanvasProps {
  sideA: number
  sideB: number
  isPlaying: boolean
}

export default function PythagoreanCanvas({ sideA: a, sideB: b, isPlaying }: PythagoreanCanvasProps) {
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

      // Grid
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.1)'
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

      const c = Math.sqrt(a * a + b * b)
      const scale = Math.min(w * 0.3, h * 0.4) / Math.max(a, b, c)

      const offsetX = w * 0.35
      const offsetY = h * 0.65

      // Triangle vertices
      const p1 = { x: offsetX, y: offsetY }
      const p2 = { x: offsetX + a * scale, y: offsetY }
      const p3 = { x: offsetX, y: offsetY - b * scale }

      const pulse = isPlaying ? Math.sin(Date.now() * 0.002) * 0.05 + 0.2 : 0.2

      // Square on side a (bottom)
      ctx.fillStyle = `rgba(59, 130, 246, ${pulse})`
      ctx.beginPath()
      ctx.rect(p1.x, p1.y, a * scale, a * scale)
      ctx.fill()
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.stroke()

      // Square on side b (left)
      ctx.fillStyle = `rgba(16, 185, 129, ${pulse})`
      ctx.beginPath()
      ctx.rect(p1.x - b * scale, p3.y, b * scale, b * scale)
      ctx.fill()
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2
      ctx.stroke()

      // Square on side c (hypotenuse)
      const angle = Math.atan2(p3.y - p2.y, p3.x - p2.x)
      ctx.save()
      ctx.translate(p2.x, p2.y)
      ctx.rotate(angle)
      ctx.fillStyle = `rgba(239, 68, 68, ${pulse})`
      ctx.beginPath()
      ctx.rect(0, 0, c * scale, c * scale)
      ctx.fill()
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()

      // Triangle
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.lineTo(p3.x, p3.y)
      ctx.closePath()
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.fill()
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 3
      ctx.stroke()

      // Right angle marker
      const markerSize = 15
      ctx.beginPath()
      ctx.moveTo(p1.x + markerSize, p1.y)
      ctx.lineTo(p1.x + markerSize, p1.y - markerSize)
      ctx.lineTo(p1.x, p1.y - markerSize)
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 2
      ctx.stroke()

      // Labels
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#3b82f6'
      ctx.fillText(`a = ${a}`, p1.x + (a * scale) / 2, p1.y + 25)

      ctx.fillStyle = '#10b981'
      ctx.textAlign = 'right'
      ctx.fillText(`b = ${b}`, p1.x - 10, p1.y - (b * scale) / 2)

      ctx.fillStyle = '#ef4444'
      ctx.textAlign = 'left'
      const midX = (p2.x + p3.x) / 2
      const midY = (p2.y + p3.y) / 2
      ctx.fillText(`c = ${c.toFixed(1)}`, midX + 15, midY)

      // Formula
      ctx.font = 'bold 18px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#1e293b'
      ctx.fillText(`a² + b² = c²`, w * 0.75, h * 0.3)
      ctx.fillText(`${a}² + ${b}² = ${c.toFixed(1)}²`, w * 0.75, h * 0.4)
      ctx.fillText(`${a * a} + ${b * b} = ${(c * c).toFixed(1)}`, w * 0.75, h * 0.5)

      // Verification
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.fillStyle = a * a + b * b === Math.round(c * c) ? '#059669' : '#d97706'
      ctx.fillText(`✓ ${a * a} + ${b * b} = ${a * a + b * b}`, w * 0.75, h * 0.65)

      // Area comparison
      ctx.font = '12px Inter, sans-serif'
      ctx.fillStyle = '#64748b'
      ctx.fillText(`Area a²: ${a * a}`, w * 0.75, h * 0.75)
      ctx.fillText(`Area b²: ${b * b}`, w * 0.75, h * 0.8)
      ctx.fillText(`Area c²: ${(c * c).toFixed(1)}`, w * 0.75, h * 0.85)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [a, b, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
