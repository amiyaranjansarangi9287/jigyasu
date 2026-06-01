import { useRef, useEffect } from 'react'

interface BloodCirculationCanvasProps {
  heartRate: number
  isPlaying: boolean
}

export default function BloodCirculationCanvas({ heartRate, isPlaying }: BloodCirculationCanvasProps) {
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

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#fef2f2')
      bg.addColorStop(1, '#fee2e2')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Heart
      const heartSize = 40 + Math.sin((isPlaying ? Date.now() * 0.005 : 0) * heartRate) * 5
      ctx.beginPath()
      ctx.moveTo(cx, cy + heartSize / 2)
      ctx.bezierCurveTo(cx - heartSize, cy, cx - heartSize / 2, cy - heartSize, cx, cy - heartSize / 2)
      ctx.bezierCurveTo(cx + heartSize / 2, cy - heartSize, cx + heartSize, cy, cx, cy + heartSize / 2)
      ctx.fillStyle = '#ef4444'
      ctx.fill()
      ctx.strokeStyle = '#dc2626'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#fff'
      ctx.fillText('❤️', cx, cy + 5)

      // Blood vessels
      const vesselColor = (t: number) => {
        const pulse = Math.sin((isPlaying ? Date.now() * 0.003 : 0) * heartRate + t * Math.PI * 2)
        return pulse > 0 ? '#ef4444' : '#3b82f6'
      }

      // Arteries (red, away from heart)
      const paths = [
        { start: { x: cx, y: cy - heartSize / 2 }, end: { x: w * 0.2, y: h * 0.2 }, type: 'artery' },
        { start: { x: cx, y: cy - heartSize / 2 }, end: { x: w * 0.8, y: h * 0.2 }, type: 'artery' },
        { start: { x: cx, y: cy + heartSize / 2 }, end: { x: w * 0.2, y: h * 0.8 }, type: 'vein' },
        { start: { x: cx, y: cy + heartSize / 2 }, end: { x: w * 0.8, y: h * 0.8 }, type: 'vein' },
      ]

      paths.forEach((path, i) => {
        // Vessel
        ctx.beginPath()
        ctx.moveTo(path.start.x, path.start.y)
        ctx.lineTo(path.end.x, path.end.y)
        ctx.strokeStyle = path.type === 'artery' ? '#ef4444' : '#3b82f6'
        ctx.lineWidth = 6
        ctx.stroke()

        // Blood cells
        if (isPlaying) {
          const cellCount = 5
          for (let j = 0; j < cellCount; j++) {
            const t = ((isPlaying ? Date.now() * 0.001 : 0) * heartRate + j / cellCount + i * 0.25) % 1
            const cellX = path.start.x + (path.end.x - path.start.x) * t
            const cellY = path.start.y + (path.end.y - path.start.y) * t

            ctx.beginPath()
            ctx.arc(cellX, cellY, 4, 0, Math.PI * 2)
            ctx.fillStyle = path.type === 'artery' ? '#ef4444' : '#3b82f6'
            ctx.fill()
          }
        }
      })

      // Lungs (top)
      ctx.beginPath()
      ctx.ellipse(w * 0.3, h * 0.15, 25, 20, 0, 0, Math.PI * 2)
      ctx.fillStyle = '#f9a8d4'
      ctx.fill()
      ctx.strokeStyle = '#ec4899'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.ellipse(w * 0.7, h * 0.15, 25, 20, 0, 0, Math.PI * 2)
      ctx.fillStyle = '#f9a8d4'
      ctx.fill()
      ctx.strokeStyle = '#ec4899'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.font = '10px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#ec4899'
      ctx.fillText('🫁 Lungs', w * 0.3, h * 0.15 + 30)
      ctx.fillText('🫁 Lungs', w * 0.7, h * 0.15 + 30)

      // Body (bottom)
      ctx.beginPath()
      ctx.ellipse(w * 0.3, h * 0.85, 30, 20, 0, 0, Math.PI * 2)
      ctx.fillStyle = '#fde68a'
      ctx.fill()
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.ellipse(w * 0.7, h * 0.85, 30, 20, 0, 0, Math.PI * 2)
      ctx.fillStyle = '#fde68a'
      ctx.fill()
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.font = '10px Inter, sans-serif'
      ctx.fillStyle = '#f59e0b'
      ctx.fillText('🦴 Body', w * 0.3, h * 0.85 + 30)
      ctx.fillText('🦴 Body', w * 0.7, h * 0.85 + 30)

      // Labels
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#991b1b'
      ctx.fillText('❤️ Blood Circulation', 15, 25)
      ctx.fillText(`Heart Rate: ${Math.round(heartRate * 60)} BPM`, 15, 45)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [heartRate, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
