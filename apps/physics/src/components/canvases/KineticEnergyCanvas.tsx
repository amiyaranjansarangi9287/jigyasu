import { useRef, useEffect } from 'react'

interface KineticEnergyCanvasProps {
  position: number
  isPlaying: boolean
}

export default function KineticEnergyCanvas({ position, isPlaying }: KineticEnergyCanvasProps) {
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
      bg.addColorStop(0, '#fef3c7')
      bg.addColorStop(1, '#fde68a')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Roller coaster track
      const trackPoints = [
        { x: w * 0.1, y: h * 0.2 },    // Top of hill
        { x: w * 0.3, y: h * 0.2 },    // Flat top
        { x: w * 0.5, y: h * 0.7 },    // Bottom of drop
        { x: w * 0.7, y: h * 0.4 },    // Second hill
        { x: w * 0.9, y: h * 0.6 },    // End
      ]

      // Draw track
      ctx.beginPath()
      ctx.moveTo(trackPoints[0].x, trackPoints[0].y)
      for (let i = 1; i < trackPoints.length; i++) {
        const prev = trackPoints[i - 1]
        const curr = trackPoints[i]
        const cpx = (prev.x + curr.x) / 2
        ctx.quadraticCurveTo(cpx, prev.y, curr.x, curr.y)
      }
      ctx.strokeStyle = '#92400e'
      ctx.lineWidth = 6
      ctx.stroke()

      // Track supports
      ctx.strokeStyle = '#78350f'
      ctx.lineWidth = 2
      trackPoints.forEach(p => {
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x, h * 0.85)
        ctx.stroke()
      })

      // Cart position with auto-animation
      const autoPosition = isPlaying ? (Date.now() * 0.0003) % 1 : position
      const cartIndex = Math.floor(autoPosition * (trackPoints.length - 1))
      const cartT = (autoPosition * (trackPoints.length - 1)) - cartIndex
      const cartP1 = trackPoints[Math.min(cartIndex, trackPoints.length - 2)]
      const cartP2 = trackPoints[Math.min(cartIndex + 1, trackPoints.length - 1)]
      const cartX = cartP1.x + (cartP2.x - cartP1.x) * cartT
      const cartY = cartP1.y + (cartP2.y - cartP1.y) * cartT

      // Cart
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.roundRect(cartX - 15, cartY - 10, 30, 15, 5)
      ctx.fill()
      ctx.strokeStyle = '#dc2626'
      ctx.lineWidth = 2
      ctx.stroke()

      // Wheels
      ctx.beginPath()
      ctx.arc(cartX - 8, cartY + 8, 4, 0, Math.PI * 2)
      ctx.arc(cartX + 8, cartY + 8, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#1e293b'
      ctx.fill()

      // Energy bars
      const height = cartY / (h * 0.85)
      const potentialEnergy = height * 100
      const kineticEnergy = 100 - potentialEnergy

      const barX = w * 0.75
      const barY = h * 0.15
      const barWidth = 30
      const barHeight = h * 0.5

      // PE bar
      ctx.fillStyle = '#f0f9ff'
      ctx.beginPath()
      ctx.roundRect(barX - 40, barY, barWidth, barHeight, 5)
      ctx.fill()
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 2
      ctx.stroke()

      const peHeight = (potentialEnergy / 100) * barHeight
      ctx.fillStyle = '#0284c7'
      ctx.beginPath()
      ctx.roundRect(barX - 40, barY + barHeight - peHeight, barWidth, peHeight, 5)
      ctx.fill()

      ctx.font = 'bold 10px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#0369a1'
      ctx.fillText('PE', barX - 25, barY - 10)
      ctx.fillText(`${Math.round(potentialEnergy)}%`, barX - 25, barY + barHeight + 15)

      // KE bar
      ctx.fillStyle = '#f0fdf4'
      ctx.beginPath()
      ctx.roundRect(barX + 10, barY, barWidth, barHeight, 5)
      ctx.fill()
      ctx.strokeStyle = '#16a34a'
      ctx.lineWidth = 2
      ctx.stroke()

      const keHeight = (kineticEnergy / 100) * barHeight
      ctx.fillStyle = '#16a34a'
      ctx.beginPath()
      ctx.roundRect(barX + 10, barY + barHeight - keHeight, barWidth, keHeight, 5)
      ctx.fill()

      ctx.fillStyle = '#15803d'
      ctx.fillText('KE', barX + 25, barY - 10)
      ctx.fillText(`${Math.round(kineticEnergy)}%`, barX + 25, barY + barHeight + 15)

      // Total energy
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#7c3aed'
      ctx.fillText('Total: 100%', barX + 25, barY + barHeight + 35)

      // Labels
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#92400e'
      ctx.fillText('🎢 Kinetic & Potential Energy', 15, 25)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [position, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
