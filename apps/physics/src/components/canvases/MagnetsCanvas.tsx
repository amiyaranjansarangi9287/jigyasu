import { useRef, useEffect } from 'react'

interface MagnetsCanvasProps {
  poleConfig: 'attract' | 'repel'
  isPlaying: boolean
}

export default function MagnetsCanvas({ poleConfig, isPlaying }: MagnetsCanvasProps) {
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
    const cy = h / 2

    const magnetWidth = 100
    const magnetHeight = 40
    const magnetY = cy - magnetHeight / 2

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#fef2f2')
      bg.addColorStop(1, '#eff6ff')
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

      // Magnetic field lines
      const magnet1X = w * 0.3
      const magnet2X = w * 0.7
      const fieldStrength = poleConfig === 'attract' ? 1 : -1
      const fieldPulse = isPlaying ? Math.sin(Date.now() * 0.003) * 0.1 + 0.3 : 0.3

      ctx.strokeStyle = `rgba(148, 163, 184, ${fieldPulse})`
      ctx.lineWidth = 1
      for (let i = 0; i < 12; i++) {
        const startY = magnetY + (i / 11) * magnetHeight
        const offset = (i - 5.5) * 15

        ctx.beginPath()
        ctx.moveTo(magnet1X + magnetWidth, startY)

        // Field line curves
        const midX = (magnet1X + magnetWidth + magnet2X) / 2
        const curveY = cy + offset * fieldStrength
        ctx.quadraticCurveTo(midX, curveY, magnet2X, startY)
        ctx.stroke()
      }

      // Magnet 1
      // North pole (red)
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.roundRect(magnet1X, magnetY, magnetWidth / 2, magnetHeight, [8, 0, 0, 8])
      ctx.fill()
      ctx.strokeStyle = '#dc2626'
      ctx.lineWidth = 2
      ctx.stroke()

      // South pole (blue)
      ctx.fillStyle = '#3b82f6'
      ctx.beginPath()
      ctx.roundRect(magnet1X + magnetWidth / 2, magnetY, magnetWidth / 2, magnetHeight, [0, 8, 8, 0])
      ctx.fill()
      ctx.strokeStyle = '#2563eb'
      ctx.lineWidth = 2
      ctx.stroke()

      // Labels
      ctx.font = 'bold 18px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#fff'
      ctx.fillText('N', magnet1X + magnetWidth / 4, magnetY + magnetHeight / 2 + 6)
      ctx.fillText('S', magnet1X + magnetWidth * 3 / 4, magnetY + magnetHeight / 2 + 6)

      // Magnet 2
      const m2NorthX = poleConfig === 'attract' ? magnet2X : magnet2X + magnetWidth / 2
      const m2SouthX = poleConfig === 'attract' ? magnet2X + magnetWidth / 2 : magnet2X

      // North pole
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.roundRect(m2NorthX, magnetY, magnetWidth / 2, magnetHeight, poleConfig === 'attract' ? [8, 0, 0, 8] : [0, 8, 8, 0])
      ctx.fill()
      ctx.strokeStyle = '#dc2626'
      ctx.lineWidth = 2
      ctx.stroke()

      // South pole
      ctx.fillStyle = '#3b82f6'
      ctx.beginPath()
      ctx.roundRect(m2SouthX, magnetY, magnetWidth / 2, magnetHeight, poleConfig === 'attract' ? [0, 8, 8, 0] : [8, 0, 0, 8])
      ctx.fill()
      ctx.strokeStyle = '#2563eb'
      ctx.lineWidth = 2
      ctx.stroke()

      // Labels
      ctx.fillStyle = '#fff'
      ctx.fillText('N', m2NorthX + magnetWidth / 4, magnetY + magnetHeight / 2 + 6)
      ctx.fillText('S', m2SouthX + magnetWidth / 4, magnetY + magnetHeight / 2 + 6)

      // Force arrows
      const arrowY = magnetY - 20
      ctx.lineWidth = 3
      if (poleConfig === 'attract') {
        // Arrows pointing toward each other
        ctx.strokeStyle = '#22c55e'
        ctx.beginPath()
        ctx.moveTo(magnet1X + magnetWidth + 10, arrowY)
        ctx.lineTo(magnet2X - 10, arrowY)
        ctx.stroke()
        // Arrow heads
        ctx.beginPath()
        ctx.moveTo(magnet2X - 15, arrowY - 5)
        ctx.lineTo(magnet2X - 10, arrowY)
        ctx.lineTo(magnet2X - 15, arrowY + 5)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(magnet1X + magnetWidth + 15, arrowY - 5)
        ctx.lineTo(magnet1X + magnetWidth + 10, arrowY)
        ctx.lineTo(magnet1X + magnetWidth + 15, arrowY + 5)
        ctx.stroke()

        ctx.font = 'bold 12px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#22c55e'
        ctx.fillText('✅ ATTRACT', w / 2, arrowY - 10)
      } else {
        // Arrows pointing away
        ctx.strokeStyle = '#ef4444'
        ctx.beginPath()
        ctx.moveTo(magnet1X + magnetWidth / 2 + 10, arrowY)
        ctx.lineTo(magnet1X + magnetWidth / 2 - 30, arrowY)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(magnet2X + magnetWidth / 2 - 10, arrowY)
        ctx.lineTo(magnet2X + magnetWidth / 2 + 30, arrowY)
        ctx.stroke()
        // Arrow heads
        ctx.beginPath()
        ctx.moveTo(magnet1X + magnetWidth / 2 - 35, arrowY - 5)
        ctx.lineTo(magnet1X + magnetWidth / 2 - 30, arrowY)
        ctx.lineTo(magnet1X + magnetWidth / 2 - 35, arrowY + 5)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(magnet2X + magnetWidth / 2 + 35, arrowY - 5)
        ctx.lineTo(magnet2X + magnetWidth / 2 + 30, arrowY)
        ctx.lineTo(magnet2X + magnetWidth / 2 + 35, arrowY + 5)
        ctx.stroke()

        ctx.font = 'bold 12px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#ef4444'
        ctx.fillText('❌ REPEL', w / 2, arrowY - 10)
      }

      // Iron filings visualization
      ctx.fillStyle = 'rgba(100, 116, 139, 0.3)'
      for (let i = 0; i < 40; i++) {
        const fx = (i * 17.3) % w
        const fy = h * 0.7 + (i * 11.7) % (h * 0.25)
        const dist1 = Math.sqrt((fx - magnet1X - magnetWidth / 2) ** 2 + (fy - cy) ** 2)
        const dist2 = Math.sqrt((fx - magnet2X - magnetWidth / 2) ** 2 + (fy - cy) ** 2)
        const field = 1 / (dist1 + 10) + 1 / (dist2 + 10)
        const size = Math.min(3, field * 10)
        const angle = Math.atan2(fy - cy, fx - (magnet1X + magnetWidth / 2))

        ctx.save()
        ctx.translate(fx, fy)
        ctx.rotate(angle)
        ctx.fillRect(-size / 2, -0.5, size, 1)
        ctx.restore()
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [poleConfig, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
