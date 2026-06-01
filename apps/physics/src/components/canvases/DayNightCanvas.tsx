import { useRef, useEffect } from 'react'

interface DayNightCanvasProps {
  rotation: number
  isPlaying: boolean
}

export default function DayNightCanvas({ rotation, isPlaying }: DayNightCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const autoRotationRef = useRef<number>(rotation)

  useEffect(() => {
    autoRotationRef.current = rotation
  }, [rotation])

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
      if (isPlaying) {
        autoRotationRef.current = (autoRotationRef.current + 0.3) % 360
      }
      const currentRotation = autoRotationRef.current

      ctx.clearRect(0, 0, w, h)

      // Space background
      const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.6)
      bg.addColorStop(0, '#1e293b')
      bg.addColorStop(1, '#0f172a')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Stars
      for (let i = 0; i < 80; i++) {
        const sx = (i * 137.5) % w
        const sy = (i * 97.3) % h
        ctx.beginPath()
        ctx.arc(sx, sy, 0.5 + (i % 2) * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.3})`
        ctx.fill()
      }

      // Sun (stationary)
      const sunX = w * 0.15
      const sunY = h / 2
      const sunRadius = 35

      // Sun glow
      const sunGlow = ctx.createRadialGradient(sunX, sunY, sunRadius, sunX, sunY, sunRadius * 3)
      sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.6)')
      sunGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.1)')
      sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)')
      ctx.fillStyle = sunGlow
      ctx.fillRect(sunX - sunRadius * 3, sunY - sunRadius * 3, sunRadius * 6, sunRadius * 6)

      // Sun body
      ctx.beginPath()
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2)
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius)
      sunGrad.addColorStop(0, '#fef08a')
      sunGrad.addColorStop(0.7, '#f59e0b')
      sunGrad.addColorStop(1, '#d97706')
      ctx.fillStyle = sunGrad
      ctx.fill()

      // Sun rays (gentle pulse, not rotation)
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)'
      ctx.lineWidth = 2
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2
        const rayLen = 15 + Math.sin((isPlaying ? Date.now() * 0.003 : 0) + i) * 5
        ctx.beginPath()
        ctx.moveTo(sunX + Math.cos(angle) * (sunRadius + 5), sunY + Math.sin(angle) * (sunRadius + 5))
        ctx.lineTo(sunX + Math.cos(angle) * (sunRadius + rayLen), sunY + Math.sin(angle) * (sunRadius + rayLen))
        ctx.stroke()
      }

      // Earth
      const earthX = w * 0.65
      const earthY = h / 2
      const earthRadius = 60

      // Earth body
      ctx.beginPath()
      ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2)
      ctx.fillStyle = '#1e293b'
      ctx.fill()

      // Day side (facing sun)
      ctx.save()
      ctx.beginPath()
      ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2)
      ctx.clip()

      // Ocean
      ctx.fillStyle = '#3b82f6'
      ctx.fillRect(earthX - earthRadius, earthY - earthRadius, earthRadius * 2, earthRadius * 2)

      // Continents (rotate with Earth)
      const earthRot = (currentRotation / 360) * Math.PI * 2
      ctx.fillStyle = '#22c55e'
      ctx.beginPath()
      ctx.ellipse(earthX - 15 + Math.cos(earthRot) * 10, earthY - 20, 20, 15, 0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(earthX + 20 + Math.cos(earthRot) * 10, earthY + 10, 15, 20, -0.2, 0, Math.PI * 2)
      ctx.fill()

      // Night overlay (side away from sun)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)'
      ctx.beginPath()
      ctx.arc(earthX - earthRadius * 0.5, earthY, earthRadius * 1.2, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()

      // Earth atmosphere glow
      ctx.beginPath()
      ctx.arc(earthX, earthY, earthRadius + 3, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'
      ctx.lineWidth = 3
      ctx.stroke()

      // Light rays from sun to earth
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.15)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(sunX + sunRadius, sunY - 20)
      ctx.lineTo(earthX - earthRadius, earthY - 20)
      ctx.moveTo(sunX + sunRadius, sunY)
      ctx.lineTo(earthX - earthRadius, earthY)
      ctx.moveTo(sunX + sunRadius, sunY + 20)
      ctx.lineTo(earthX - earthRadius, earthY + 20)
      ctx.stroke()
      ctx.setLineDash([])

      // Labels
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#fbbf24'
      ctx.fillText('☀️ Sun', sunX, sunY + sunRadius + 20)

      ctx.fillStyle = '#94a3b8'
      ctx.fillText('🌍 Earth', earthX, earthY + earthRadius + 20)

      // Rotation info
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#f1f5f9'
      ctx.fillText(`Rotation: ${Math.round(currentRotation)}°`, w / 2, 30)

      const timeOfDay = currentRotation < 90 ? '🌅 Morning' : currentRotation < 180 ? '☀️ Afternoon' : currentRotation < 270 ? '🌇 Evening' : '🌙 Night'
      ctx.font = '12px Inter, sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText(timeOfDay, w / 2, 50)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
