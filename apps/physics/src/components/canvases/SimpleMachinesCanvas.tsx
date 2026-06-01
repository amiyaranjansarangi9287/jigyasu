import { useRef, useEffect } from 'react'

interface SimpleMachinesCanvasProps {
  machine: number
  isPlaying: boolean
}

export default function SimpleMachinesCanvas({ machine, isPlaying }: SimpleMachinesCanvasProps) {
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

      // Ground
      ctx.fillStyle = '#92400e'
      ctx.fillRect(0, h * 0.8, w, h * 0.2)

      if (machine === 0) {
        // Lever
        const fulcrumX = w / 2
        const fulcrumY = h * 0.7
        const leverLength = w * 0.6
        const angle = Math.sin(isPlaying ? Date.now() * 0.002 : 0) * 0.2

        // Fulcrum
        ctx.beginPath()
        ctx.moveTo(fulcrumX, fulcrumY)
        ctx.lineTo(fulcrumX - 15, h * 0.8)
        ctx.lineTo(fulcrumX + 15, h * 0.8)
        ctx.closePath()
        ctx.fillStyle = '#78350f'
        ctx.fill()

        // Lever
        ctx.save()
        ctx.translate(fulcrumX, fulcrumY)
        ctx.rotate(angle)
        ctx.fillStyle = '#92400e'
        ctx.beginPath()
        ctx.roundRect(-leverLength / 2, -5, leverLength, 10, 5)
        ctx.fill()

        // Load
        ctx.fillStyle = '#3b82f6'
        ctx.beginPath()
        ctx.roundRect(-leverLength / 2 + 10, -25, 30, 20, 5)
        ctx.fill()
        ctx.font = '10px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#fff'
        ctx.fillText('Load', -leverLength / 2 + 25, -10)

        // Force
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.roundRect(leverLength / 2 - 40, -25, 30, 20, 5)
        ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.fillText('Force', leverLength / 2 - 25, -10)

        ctx.restore()

        ctx.font = 'bold 12px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#92400e'
        ctx.fillText('⚙️ Lever', w / 2, 30)

      } else if (machine === 1) {
        // Pulley
        const pulleyX = w / 2
        const pulleyY = h * 0.2
        const ropeLength = h * 0.6
        const loadY = pulleyY + ropeLength * 0.5 + Math.sin(isPlaying ? Date.now() * 0.002 : 0) * 20

        // Pulley wheel
        ctx.beginPath()
        ctx.arc(pulleyX, pulleyY, 20, 0, Math.PI * 2)
        ctx.fillStyle = '#92400e'
        ctx.fill()
        ctx.strokeStyle = '#78350f'
        ctx.lineWidth = 3
        ctx.stroke()

        // Rope
        ctx.beginPath()
        ctx.moveTo(pulleyX - 20, pulleyY)
        ctx.lineTo(pulleyX - 20, loadY)
        ctx.moveTo(pulleyX + 20, pulleyY)
        ctx.lineTo(pulleyX + 20, pulleyY + ropeLength - (loadY - pulleyY))
        ctx.strokeStyle = '#64748b'
        ctx.lineWidth = 3
        ctx.stroke()

        // Load
        ctx.fillStyle = '#3b82f6'
        ctx.beginPath()
        ctx.roundRect(pulleyX - 35, loadY, 30, 25, 5)
        ctx.fill()
        ctx.font = '10px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#fff'
        ctx.fillText('Load', pulleyX - 20, loadY + 17)

        // Force
        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.roundRect(pulleyX + 5, pulleyY + ropeLength - (loadY - pulleyY), 30, 25, 5)
        ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.fillText('Force', pulleyX + 20, pulleyY + ropeLength - (loadY - pulleyY) + 17)

        ctx.font = 'bold 12px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#92400e'
        ctx.fillText('🔄 Pulley', w / 2, 30)

      } else {
        // Inclined Plane
        const rampStartX = w * 0.2
        const rampEndX = w * 0.8
        const rampStartY = h * 0.8
        const rampEndY = h * 0.3
        const boxProgress = (Math.sin(isPlaying ? Date.now() * 0.002 : 0) + 1) / 2

        // Ramp
        ctx.beginPath()
        ctx.moveTo(rampStartX, rampStartY)
        ctx.lineTo(rampEndX, rampEndY)
        ctx.lineTo(rampEndX, rampStartY)
        ctx.closePath()
        ctx.fillStyle = '#92400e'
        ctx.fill()

        // Box on ramp
        const boxX = rampStartX + (rampEndX - rampStartX) * boxProgress
        const boxY = rampStartY + (rampEndY - rampStartY) * boxProgress
        const angle = Math.atan2(rampEndY - rampStartY, rampEndX - rampStartX)

        ctx.save()
        ctx.translate(boxX, boxY)
        ctx.rotate(angle)
        ctx.fillStyle = '#3b82f6'
        ctx.beginPath()
        ctx.roundRect(-15, -15, 30, 30, 5)
        ctx.fill()
        ctx.restore()

        // Force arrow
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(boxX - 30, boxY)
        ctx.lineTo(boxX - 10, boxY)
        ctx.stroke()

        ctx.font = 'bold 12px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#92400e'
        ctx.fillText('📐 Inclined Plane', w / 2, 30)
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [machine, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
