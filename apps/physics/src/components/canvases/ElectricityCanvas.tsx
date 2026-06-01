import { useRef, useEffect } from 'react'

interface ElectricityCanvasProps {
  circuitComplete: boolean
  bulbs: number
  isPlaying: boolean
}

export default function ElectricityCanvas({ circuitComplete, bulbs, isPlaying }: ElectricityCanvasProps) {
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

      // Circuit path
      const path = [
        { x: w * 0.2, y: h * 0.3 },  // Battery +
        { x: w * 0.8, y: h * 0.3 },  // Top right
        { x: w * 0.8, y: h * 0.7 },  // Bottom right
        { x: w * 0.2, y: h * 0.7 },  // Bottom left
        { x: w * 0.2, y: h * 0.3 },  // Battery -
      ]

      // Draw wire
      ctx.beginPath()
      ctx.moveTo(path[0].x, path[0].y)
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y)
      }
      ctx.strokeStyle = circuitComplete ? '#64748b' : '#cbd5e1'
      ctx.lineWidth = 4
      ctx.stroke()

      // Battery
      ctx.fillStyle = '#1e293b'
      ctx.beginPath()
      ctx.roundRect(path[0].x - 15, path[0].y - 20, 30, 40, 5)
      ctx.fill()
      ctx.fillStyle = '#ef4444'
      ctx.fillRect(path[0].x - 10, path[0].y - 15, 20, 10)
      ctx.fillStyle = '#3b82f6'
      ctx.fillRect(path[0].x - 10, path[0].y + 5, 20, 10)
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#fff'
      ctx.fillText('+', path[0].x, path[0].y - 5)
      ctx.fillText('−', path[0].x, path[0].y + 15)

      // Bulbs
      const bulbPositions = [
        { x: w * 0.5, y: h * 0.3 },
        { x: w * 0.8, y: h * 0.5 },
        { x: w * 0.5, y: h * 0.7 },
      ]

      for (let i = 0; i < Math.min(bulbs, 3); i++) {
        const bulb = bulbPositions[i]
        const isLit = circuitComplete

        // Bulb glow
        if (isLit) {
          const glow = ctx.createRadialGradient(bulb.x, bulb.y, 5, bulb.x, bulb.y, 30)
          glow.addColorStop(0, 'rgba(251, 191, 36, 0.6)')
          glow.addColorStop(1, 'rgba(251, 191, 36, 0)')
          ctx.fillStyle = glow
          ctx.fillRect(bulb.x - 30, bulb.y - 30, 60, 60)
        }

        // Bulb body
        ctx.beginPath()
        ctx.arc(bulb.x, bulb.y, 15, 0, Math.PI * 2)
        ctx.fillStyle = isLit ? '#fbbf24' : '#94a3b8'
        ctx.fill()
        ctx.strokeStyle = isLit ? '#f59e0b' : '#64748b'
        ctx.lineWidth = 2
        ctx.stroke()

        // Filament
        ctx.beginPath()
        ctx.moveTo(bulb.x - 5, bulb.y + 5)
        ctx.lineTo(bulb.x, bulb.y - 5)
        ctx.lineTo(bulb.x + 5, bulb.y + 5)
        ctx.strokeStyle = isLit ? '#f59e0b' : '#64748b'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Electron flow animation
      if (circuitComplete && isPlaying) {
        const time = isPlaying ? Date.now() * 0.003 : 0
        const electronCount = 8
        for (let i = 0; i < electronCount; i++) {
          const t = ((time + i / electronCount) % 1)
          let ex: number, ey: number

          // Position along circuit path
          if (t < 0.25) {
            ex = path[0].x + (path[1].x - path[0].x) * (t / 0.25)
            ey = path[0].y
          } else if (t < 0.5) {
            ex = path[1].x
            ey = path[1].y + (path[2].y - path[1].y) * ((t - 0.25) / 0.25)
          } else if (t < 0.75) {
            ex = path[2].x + (path[3].x - path[2].x) * ((t - 0.5) / 0.25)
            ey = path[2].y
          } else {
            ex = path[3].x
            ey = path[3].y + (path[0].y - path[3].y) * ((t - 0.75) / 0.25)
          }

          ctx.beginPath()
          ctx.arc(ex, ey, 3, 0, Math.PI * 2)
          ctx.fillStyle = '#3b82f6'
          ctx.fill()
        }
      }

      // Switch
      const switchX = w * 0.2
      const switchY = h * 0.5
      ctx.fillStyle = circuitComplete ? '#22c55e' : '#ef4444'
      ctx.beginPath()
      ctx.arc(switchX - 30, switchY, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(switchX + 30, switchY, 8, 0, Math.PI * 2)
      ctx.fill()

      // Switch arm
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(switchX - 30, switchY)
      if (circuitComplete) {
        ctx.lineTo(switchX + 30, switchY)
      } else {
        ctx.lineTo(switchX + 20, switchY - 20)
      }
      ctx.stroke()

      // Labels
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#1e293b'
      ctx.fillText('⚡ Electric Circuit', w / 2, 30)
      ctx.fillText(circuitComplete ? '✅ Circuit Complete - Current Flowing!' : '❌ Circuit Open - No Current', w / 2, h - 20)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [circuitComplete, bulbs, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
