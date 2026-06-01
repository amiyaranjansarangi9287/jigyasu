import { useRef, useEffect } from 'react'

interface StatesOfMatterCanvasProps {
  temperature: number // 0-100
  isPlaying: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export default function StatesOfMatterCanvas({ temperature, isPlaying }: StatesOfMatterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
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

    // Initialize particles
    if (particlesRef.current.length === 0) {
      for (let i = 0; i < 80; i++) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: 4 + Math.random() * 2,
        })
      }
    }

    const getState = (temp: number): 'solid' | 'liquid' | 'gas' => {
      if (temp < 33) return 'solid'
      if (temp < 66) return 'liquid'
      return 'gas'
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h)
      const state = getState(temperature)
      const speed = 0.5 + (temperature / 100) * 4
      const jitter = state === 'solid' ? 0.5 : state === 'liquid' ? 2 : 4

      // Background based on state
      const bgColors = {
        solid: ['#e0f2fe', '#bae6fd'],
        liquid: ['#dbeafe', '#bfdbfe'],
        gas: ['#fef3c7', '#fde68a'],
      }
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, bgColors[state][0])
      bg.addColorStop(1, bgColors[state][1])
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Container
      if (state === 'solid') {
        // Grid pattern for solid
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.15)'
        ctx.lineWidth = 1
        const gridSize = 30
        for (let x = 0; x < w; x += gridSize) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, h)
          ctx.stroke()
        }
        for (let y = 0; y < h; y += gridSize) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(w, y)
          ctx.stroke()
        }
      }

      // Update and draw particles
      const particles = particlesRef.current
      particles.forEach((p, i) => {
        if (isPlaying) {
          if (state === 'solid') {
            // Vibrate in place
            p.x += (Math.random() - 0.5) * jitter * 0.3
            p.y += (Math.random() - 0.5) * jitter * 0.3
            // Return to grid position
            const gridX = ((i % 10) + 0.5) * (w / 10)
            const gridY = (Math.floor(i / 10) + 0.5) * (h / 8)
            p.x += (gridX - p.x) * 0.1
            p.y += (gridY - p.y) * 0.1
          } else if (state === 'liquid') {
            p.x += p.vx * speed * 0.5 + (Math.random() - 0.5) * jitter
            p.y += p.vy * speed * 0.5 + (Math.random() - 0.5) * jitter
            // Keep in bottom half
            if (p.y < h * 0.3) p.vy += 0.2
            if (p.y > h - 10) p.vy = -Math.abs(p.vy)
          } else {
            p.x += p.vx * speed + (Math.random() - 0.5) * jitter
            p.y += p.vy * speed + (Math.random() - 0.5) * jitter
          }

          // Wrap around
          if (p.x < -10) p.x = w + 10
          if (p.x > w + 10) p.x = -10
          if (state !== 'solid') {
            if (p.y < -10) p.y = h + 10
            if (p.y > h + 10) p.y = -10
          }
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)

        const colors = {
          solid: { fill: '#0284c7', stroke: '#0369a1' },
          liquid: { fill: '#3b82f6', stroke: '#2563eb' },
          gas: { fill: '#f59e0b', stroke: '#d97706' },
        }
        ctx.fillStyle = colors[state].fill
        ctx.fill()
        ctx.strokeStyle = colors[state].stroke
        ctx.lineWidth = 1
        ctx.stroke()

        // Glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2)
        ctx.fillStyle = `${colors[state].fill}20`
        ctx.fill()
      })

      // State label
      ctx.font = 'bold 16px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = state === 'solid' ? '#0369a1' : state === 'liquid' ? '#1d4ed8' : '#b45309'
      const labels = { solid: '🧊 SOLID', liquid: '💧 LIQUID', gas: '💨 GAS' }
      ctx.fillText(labels[state], w / 2, 30)

      // Temperature display
      ctx.font = '12px Inter, sans-serif'
      ctx.fillStyle = '#64748b'
      ctx.fillText(`${Math.round(temperature)}°C`, w / 2, 50)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(frameRef.current)
  }, [temperature, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
