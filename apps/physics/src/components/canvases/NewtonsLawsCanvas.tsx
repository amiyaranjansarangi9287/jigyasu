import { useRef, useEffect } from 'react'

interface NewtonsLawsCanvasProps {
  law: number
  force: number
  mass: number
  isPlaying: boolean
}

export default function NewtonsLawsCanvas({ law, force, mass, isPlaying }: NewtonsLawsCanvasProps) {
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
    const groundY = h * 0.7

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#fef3c7')
      bg.addColorStop(1, '#fde68a')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Ground
      ctx.fillStyle = '#92400e'
      ctx.fillRect(0, groundY, w, h - groundY)

      // Ground texture
      ctx.strokeStyle = '#78350f'
      ctx.lineWidth = 1
      for (let x = 0; x < w; x += 10) {
        ctx.beginPath()
        ctx.moveTo(x, groundY)
        ctx.lineTo(x + 5, groundY + 5)
        ctx.stroke()
      }

      if (law === 0) {
        // First Law: Inertia
        const boxX = w * 0.3
        const boxSize = 40 + mass * 20

        // Box
        ctx.fillStyle = '#3b82f6'
        ctx.beginPath()
        ctx.roundRect(boxX, groundY - boxSize, boxSize, boxSize, 5)
        ctx.fill()
        ctx.strokeStyle = '#2563eb'
        ctx.lineWidth = 2
        ctx.stroke()

        // Force arrow
        if (force > 0) {
          ctx.strokeStyle = '#ef4444'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(boxX - 10, groundY - boxSize / 2)
          ctx.lineTo(boxX - 10 - force * 50, groundY - boxSize / 2)
          ctx.stroke()
          // Arrow head
          ctx.beginPath()
          ctx.moveTo(boxX - 15 - force * 50, groundY - boxSize / 2 - 5)
          ctx.lineTo(boxX - 10 - force * 50, groundY - boxSize / 2)
          ctx.lineTo(boxX - 15 - force * 50, groundY - boxSize / 2 + 5)
          ctx.stroke()
        }

        ctx.font = 'bold 12px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#1e293b'
        ctx.fillText('First Law: Inertia', w / 2, 30)
        ctx.fillText('Object at rest stays at rest unless acted upon', w / 2, 50)

      } else if (law === 1) {
        // Second Law: F = ma
        const acceleration = force / mass
        const boxX = w * 0.3 + (isPlaying ? (Date.now() * 0.01 * acceleration) % (w * 0.5) : 0)
        const boxSize = 30 + mass * 15

        // Box
        ctx.fillStyle = '#3b82f6'
        ctx.beginPath()
        ctx.roundRect(boxX, groundY - boxSize, boxSize, boxSize, 5)
        ctx.fill()
        ctx.strokeStyle = '#2563eb'
        ctx.lineWidth = 2
        ctx.stroke()

        // Force arrow
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(boxX - 10, groundY - boxSize / 2)
        ctx.lineTo(boxX - 10 - force * 40, groundY - boxSize / 2)
        ctx.stroke()

        ctx.font = 'bold 12px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#1e293b'
        ctx.fillText('Second Law: F = ma', w / 2, 30)
        ctx.fillText(`a = F/m = ${force}/${mass} = ${acceleration.toFixed(2)} m/s²`, w / 2, 50)

      } else {
        // Third Law: Action-Reaction
        const box1X = w * 0.35
        const box2X = w * 0.65
        const boxSize = 50

        // Box 1
        ctx.fillStyle = '#3b82f6'
        ctx.beginPath()
        ctx.roundRect(box1X, groundY - boxSize, boxSize, boxSize, 5)
        ctx.fill()
        ctx.strokeStyle = '#2563eb'
        ctx.lineWidth = 2
        ctx.stroke()

        // Box 2
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.roundRect(box2X, groundY - boxSize, boxSize, boxSize, 5)
        ctx.fill()
        ctx.strokeStyle = '#dc2626'
        ctx.lineWidth = 2
        ctx.stroke()

        // Action arrow
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(box1X + boxSize, groundY - boxSize / 2)
        ctx.lineTo(box2X, groundY - boxSize / 2)
        ctx.stroke()

        // Reaction arrow
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(box2X, groundY - boxSize / 2 + 15)
        ctx.lineTo(box1X + boxSize, groundY - boxSize / 2 + 15)
        ctx.stroke()

        ctx.font = 'bold 12px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#1e293b'
        ctx.fillText('Third Law: Action = Reaction', w / 2, 30)
        ctx.fillText('For every action, equal and opposite reaction', w / 2, 50)
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [law, force, mass, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
