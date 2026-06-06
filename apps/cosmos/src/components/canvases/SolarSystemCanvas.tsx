import { useRef, useEffect } from 'react'

interface SolarSystemCanvasProps {
  speed: number
  isPlaying: boolean
}

interface Planet {
  name: string
  distance: number
  size: number
  speed: number
  color: string
  ring?: boolean
  angle: number
}

export default function SolarSystemCanvas({ speed, isPlaying }: SolarSystemCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const planetsRef = useRef<Planet[]>([
    { name: 'Mercury', distance: 45, size: 3, speed: 4.1, color: '#94a3b8', angle: 0 },
    { name: 'Venus', distance: 65, size: 5, speed: 1.6, color: '#f59e0b', angle: Math.PI * 0.5 },
    { name: 'Earth', distance: 90, size: 6, speed: 1, color: '#3b82f6', angle: Math.PI },
    { name: 'Mars', distance: 115, size: 4, speed: 0.53, color: '#ef4444', angle: Math.PI * 1.5 },
    { name: 'Jupiter', distance: 155, size: 14, speed: 0.084, color: '#f97316', angle: Math.PI * 0.3 },
    { name: 'Saturn', distance: 195, size: 12, speed: 0.034, color: '#eab308', angle: Math.PI * 0.8, ring: true },
    { name: 'Uranus', distance: 230, size: 8, speed: 0.012, color: '#06b6d4', angle: Math.PI * 1.2 },
    { name: 'Neptune', distance: 260, size: 7, speed: 0.006, color: '#6366f1', angle: Math.PI * 1.7 },
  ])
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

      // Space background
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6)
      bg.addColorStop(0, '#0f172a')
      bg.addColorStop(1, '#020617')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Stars
      for (let i = 0; i < 80; i++) {
        const sx = (i * 137.508) % w
        const sy = (i * 97.31) % h
        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin((isPlaying ? Date.now() * 0.001 : 0) + i))
        ctx.beginPath()
        ctx.arc(sx, sy, 0.5 + (i % 3) * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`
        ctx.fill()
      }

      // Orbit paths
      planetsRef.current.forEach(planet => {
        ctx.beginPath()
        ctx.arc(cx, cy, planet.distance, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)'
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Sun glow
      const sunGlow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 50)
      sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.6)')
      sunGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.1)')
      sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)')
      ctx.fillStyle = sunGlow
      ctx.fillRect(cx - 50, cy - 50, 100, 100)

      // Sun
      ctx.beginPath()
      ctx.arc(cx, cy, 18, 0, Math.PI * 2)
      const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18)
      sunGrad.addColorStop(0, '#fef08a')
      sunGrad.addColorStop(0.7, '#f59e0b')
      sunGrad.addColorStop(1, '#d97706')
      ctx.fillStyle = sunGrad
      ctx.fill()

      // Planets
      planetsRef.current.forEach(planet => {
        if (isPlaying) {
          planet.angle += planet.speed * speed * 0.005
        }

        const px = cx + Math.cos(planet.angle) * planet.distance
        const py = cy + Math.sin(planet.angle) * planet.distance

        // Planet shadow
        ctx.beginPath()
        ctx.arc(px + 2, py + 2, planet.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
        ctx.fill()

        // Planet body
        ctx.beginPath()
        ctx.arc(px, py, planet.size, 0, Math.PI * 2)
        const planetGrad = ctx.createRadialGradient(px - planet.size * 0.3, py - planet.size * 0.3, 0, px, py, planet.size)
        planetGrad.addColorStop(0, planet.color)
        planetGrad.addColorStop(1, `${planet.color}80`)
        ctx.fillStyle = planetGrad
        ctx.fill()

        // Saturn ring
        if (planet.ring) {
          ctx.beginPath()
          ctx.ellipse(px, py, planet.size * 2, planet.size * 0.5, 0.3, 0, Math.PI * 2)
          ctx.strokeStyle = `${planet.color}60`
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // Label
        ctx.font = '9px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = 'rgba(148, 163, 184, 0.7)'
        ctx.fillText(planet.name, px, py + planet.size + 12)
      })

      // Title
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('🪐 Solar System', 15, 25)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [speed, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
