import { useRef, useEffect } from 'react'

interface MoonPhasesCanvasProps {
  orbitPos: number // 0-360 degrees
  isPlaying: boolean
}

export default function MoonPhasesCanvas({ orbitPos, isPlaying }: MoonPhasesCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const autoPosRef = useRef<number>(orbitPos)

  useEffect(() => {
    autoPosRef.current = orbitPos
  }, [orbitPos])

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
      if (isPlaying) {
        autoPosRef.current = (autoPosRef.current + 0.5) % 360
      }
      const currentPos = autoPosRef.current
      const phase = currentPos / 360

      ctx.clearRect(0, 0, w, h)

      // Space background
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6)
      bg.addColorStop(0, '#1e293b')
      bg.addColorStop(1, '#0f172a')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Stars
      for (let i = 0; i < 60; i++) {
        const sx = (i * 137.5) % w
        const sy = (i * 97.3) % h
        ctx.beginPath()
        ctx.arc(sx, sy, 0.5 + (i % 2) * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.3})`
        ctx.fill()
      }

      // Earth (bottom left)
      const earthX = w * 0.15
      const earthY = h * 0.7
      const earthR = 25

      // Earth glow
      const earthGlow = ctx.createRadialGradient(earthX, earthY, earthR, earthX, earthY, earthR * 2)
      earthGlow.addColorStop(0, 'rgba(59, 130, 246, 0.3)')
      earthGlow.addColorStop(1, 'rgba(59, 130, 246, 0)')
      ctx.fillStyle = earthGlow
      ctx.fillRect(earthX - earthR * 2, earthY - earthR * 2, earthR * 4, earthR * 4)

      // Earth body
      ctx.beginPath()
      ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2)
      const earthGrad = ctx.createRadialGradient(earthX - 5, earthY - 5, 0, earthX, earthY, earthR)
      earthGrad.addColorStop(0, '#60a5fa')
      earthGrad.addColorStop(0.5, '#3b82f6')
      earthGrad.addColorStop(1, '#1d4ed8')
      ctx.fillStyle = earthGrad
      ctx.fill()

      // Earth continents hint
      ctx.fillStyle = '#22c55e'
      ctx.beginPath()
      ctx.ellipse(earthX - 5, earthY - 5, 8, 6, 0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(earthX + 8, earthY + 8, 5, 4, -0.2, 0, Math.PI * 2)
      ctx.fill()

      ctx.font = 'bold 10px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('🌍 Earth', earthX, earthY + earthR + 15)

      // Sun (right side, off-screen glow)
      const sunX = w + 50
      const sunY = cy
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 200)
      sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.4)')
      sunGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.1)')
      sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)')
      ctx.fillStyle = sunGlow
      ctx.fillRect(sunX - 200, sunY - 200, 400, 400)

      // Sun rays
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.1)'
      ctx.lineWidth = 1
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(sunX + Math.cos(angle) * 30, sunY + Math.sin(angle) * 30)
        ctx.lineTo(sunX + Math.cos(angle) * 150, sunY + Math.sin(angle) * 150)
        ctx.stroke()
      }

      // Moon orbit path
      const orbitRadius = 120
      ctx.beginPath()
      ctx.arc(earthX, earthY, orbitRadius, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])

      // Moon position based on phase
      const moonAngle = phase * Math.PI * 2
      const moonX = earthX + Math.cos(moonAngle) * orbitRadius
      const moonY = earthY + Math.sin(moonAngle) * orbitRadius
      const moonR = 18

      // Moon shadow (dark side)
      ctx.beginPath()
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2)
      ctx.fillStyle = '#1e293b'
      ctx.fill()

      // Moon lit side (facing sun)
      ctx.save()
      ctx.beginPath()
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2)
      ctx.clip()

      // Calculate lit portion based on phase
      const litX = moonX + Math.cos(moonAngle + Math.PI) * moonR * (1 - Math.abs(phase - 0.5) * 2)
      ctx.beginPath()
      ctx.arc(litX, moonY, moonR, 0, Math.PI * 2)
      const moonGrad = ctx.createRadialGradient(litX - 3, moonY - 3, 0, litX, moonY, moonR)
      moonGrad.addColorStop(0, '#f1f5f9')
      moonGrad.addColorStop(0.7, '#cbd5e1')
      moonGrad.addColorStop(1, '#94a3b8')
      ctx.fillStyle = moonGrad
      ctx.fill()
      ctx.restore()

      // Moon craters
      ctx.save()
      ctx.beginPath()
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2)
      ctx.clip()
      ctx.fillStyle = 'rgba(100, 116, 139, 0.3)'
      ctx.beginPath()
      ctx.arc(moonX - 5, moonY - 3, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(moonX + 4, moonY + 5, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Phase name
      const phaseNames = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent']
      const phaseIndex = Math.floor(phase * 8) % 8
      const phaseName = phaseNames[phaseIndex]

      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#f1f5f9'
      ctx.fillText(`🌙 ${phaseName}`, w / 2, 30)

      ctx.font = '11px Inter, sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText(`Phase: ${Math.round(phase * 100)}%`, w / 2, 50)

      // Phase indicators around orbit
      const phases = [
        { angle: 0, emoji: '🌑', label: 'New' },
        { angle: Math.PI * 0.25, emoji: '🌒', label: 'Crescent' },
        { angle: Math.PI * 0.5, emoji: '🌓', label: 'First Q' },
        { angle: Math.PI * 0.75, emoji: '🌔', label: 'Gibbous' },
        { angle: Math.PI, emoji: '🌕', label: 'Full' },
        { angle: Math.PI * 1.25, emoji: '🌖', label: 'Gibbous' },
        { angle: Math.PI * 1.5, emoji: '🌗', label: 'Last Q' },
        { angle: Math.PI * 1.75, emoji: '🌘', label: 'Crescent' },
      ]

      phases.forEach(p => {
        const px = earthX + Math.cos(p.angle) * (orbitRadius + 30)
        const py = earthY + Math.sin(p.angle) * (orbitRadius + 30)
        ctx.font = '12px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(p.emoji, px, py + 4)
      })

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
