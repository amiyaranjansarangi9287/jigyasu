import { useRef, useEffect } from 'react'

interface GravityCanvasProps {
  mass: number
  isPlaying: boolean
}

interface OrbitBody {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  trail: { x: number; y: number }[]
}

export default function GravityCanvas({ mass, isPlaying }: GravityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bodiesRef = useRef<OrbitBody[]>([])
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

    // Initialize orbiting bodies
    if (bodiesRef.current.length === 0) {
      const planets = [
        { dist: 60, speed: 2.5, radius: 4, color: '#94a3b8', name: 'Mercury' },
        { dist: 90, speed: 2, radius: 6, color: '#f59e0b', name: 'Venus' },
        { dist: 125, speed: 1.6, radius: 7, color: '#3b82f6', name: 'Earth' },
        { dist: 160, speed: 1.3, radius: 5, color: '#ef4444', name: 'Mars' },
        { dist: 210, speed: 0.9, radius: 12, color: '#f97316', name: 'Jupiter' },
        { dist: 260, speed: 0.7, radius: 10, color: '#eab308', name: 'Saturn' },
      ]
      planets.forEach(p => {
        const angle = Math.random() * Math.PI * 2
        bodiesRef.current.push({
          x: cx + Math.cos(angle) * p.dist,
          y: cy + Math.sin(angle) * p.dist,
          vx: -Math.sin(angle) * p.speed,
          vy: Math.cos(angle) * p.speed,
          radius: p.radius,
          color: p.color,
          trail: [],
        })
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Space background
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7)
      bgGrad.addColorStop(0, '#0f172a')
      bgGrad.addColorStop(1, '#020617')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, w, h)

      // Stars
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      for (let i = 0; i < 50; i++) {
        const sx = (i * 137.5) % w
        const sy = (i * 97.3) % h
        ctx.beginPath()
        ctx.arc(sx, sy, 0.5 + (i % 3) * 0.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Gravity well visualization
      const gravityStrength = mass * 0.5
      const rings = 5
      for (let i = 1; i <= rings; i++) {
        ctx.beginPath()
        ctx.arc(cx, cy, i * 50, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 - i * 0.025})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Grid distortion
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)'
      ctx.lineWidth = 0.5
      const gridSize = 40
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath()
        for (let y = 0; y < h; y += 5) {
          const dx = x - cx
          const dy = y - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const warp = gravityStrength * 20 / (dist + 20)
          const offsetX = dx * warp / dist
          const offsetY = dy * warp / dist
          if (y === 0) ctx.moveTo(x + offsetX, y + offsetY)
          else ctx.lineTo(x + offsetX, y + offsetY)
        }
        ctx.stroke()
      }

      // Sun
      const sunRadius = 15 + gravityStrength * 0.3
      const sunGlow = ctx.createRadialGradient(cx, cy, sunRadius * 0.3, cx, cy, sunRadius * 3)
      sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.4)')
      sunGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.1)')
      sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)')
      ctx.fillStyle = sunGlow
      ctx.fillRect(cx - sunRadius * 3, cy - sunRadius * 3, sunRadius * 6, sunRadius * 6)

      ctx.beginPath()
      ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2)
      const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunRadius)
      sunGrad.addColorStop(0, '#fef08a')
      sunGrad.addColorStop(0.7, '#f59e0b')
      sunGrad.addColorStop(1, '#d97706')
      ctx.fillStyle = sunGrad
      ctx.fill()

      // Update and draw planets
      bodiesRef.current.forEach(body => {
        if (isPlaying) {
          const dx = cx - body.x
          const dy = cy - body.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const force = gravityStrength / (dist * 0.1 + 10)
          body.vx += (dx / dist) * force * 0.02
          body.vy += (dy / dist) * force * 0.02
          body.x += body.vx
          body.y += body.vy

          // Trail
          body.trail.push({ x: body.x, y: body.y })
          if (body.trail.length > 60) body.trail.shift()
        }

        // Draw trail
        if (body.trail.length > 1) {
          ctx.beginPath()
          ctx.moveTo(body.trail[0].x, body.trail[0].y)
          body.trail.forEach(p => ctx.lineTo(p.x, p.y))
          ctx.strokeStyle = `${body.color}40`
          ctx.lineWidth = 1
          ctx.stroke()
        }

        // Draw planet
        ctx.beginPath()
        ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2)
        ctx.fillStyle = body.color
        ctx.fill()
        ctx.strokeStyle = `${body.color}80`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Labels
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#fbbf24'
      ctx.fillText('☀️ Sun', cx, cy + sunRadius + 18)

      ctx.font = '11px Inter, sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText(`Mass: ${Math.round(mass * 100)}%`, cx, 25)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [mass, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
