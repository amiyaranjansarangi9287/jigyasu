import { useRef, useEffect } from 'react'

interface WaterCycleCanvasProps {
  stage: number // 0-3 (evaporation, condensation, precipitation, collection)
  isPlaying: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  type: 'water' | 'vapor' | 'cloud' | 'rain'
  alpha: number
  size: number
}

export default function WaterCycleCanvas({ stage, isPlaying }: WaterCycleCanvasProps) {
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
      for (let i = 0; i < 30; i++) {
        particlesRef.current.push({
          x: Math.random() * w * 0.6,
          y: h * 0.7 + Math.random() * h * 0.2,
          vx: 0, vy: 0,
          type: 'water',
          alpha: 1,
          size: 3 + Math.random() * 2,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h)
      skyGrad.addColorStop(0, '#bae6fd')
      skyGrad.addColorStop(0.6, '#e0f2fe')
      skyGrad.addColorStop(1, '#f0f9ff')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, w, h)

      // Sun
      const sunX = w * 0.8
      const sunY = h * 0.15
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 80)
      sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.6)')
      sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)')
      ctx.fillStyle = sunGlow
      ctx.fillRect(sunX - 80, sunY - 80, 160, 160)

      ctx.beginPath()
      ctx.arc(sunX, sunY, 25, 0, Math.PI * 2)
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 25)
      sunGrad.addColorStop(0, '#fef08a')
      sunGrad.addColorStop(1, '#f59e0b')
      ctx.fillStyle = sunGrad
      ctx.fill()

      // Mountains
      ctx.fillStyle = '#64748b'
      ctx.beginPath()
      ctx.moveTo(0, h * 0.6)
      ctx.lineTo(w * 0.15, h * 0.35)
      ctx.lineTo(w * 0.3, h * 0.55)
      ctx.lineTo(w * 0.45, h * 0.3)
      ctx.lineTo(w * 0.6, h * 0.5)
      ctx.lineTo(w * 0.7, h * 0.4)
      ctx.lineTo(w, h * 0.55)
      ctx.lineTo(w, h * 0.7)
      ctx.lineTo(0, h * 0.7)
      ctx.closePath()
      ctx.fill()

      // Snow caps
      ctx.fillStyle = '#f1f5f9'
      ctx.beginPath()
      ctx.moveTo(w * 0.12, h * 0.38)
      ctx.lineTo(w * 0.15, h * 0.35)
      ctx.lineTo(w * 0.18, h * 0.38)
      ctx.closePath()
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(w * 0.42, h * 0.33)
      ctx.lineTo(w * 0.45, h * 0.3)
      ctx.lineTo(w * 0.48, h * 0.33)
      ctx.closePath()
      ctx.fill()

      // Ocean
      ctx.fillStyle = '#0284c7'
      ctx.fillRect(0, h * 0.7, w, h * 0.3)

      // Ocean waves
      ctx.strokeStyle = '#0369a1'
      ctx.lineWidth = 2
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        for (let x = 0; x < w; x += 5) {
          const y = h * 0.7 + i * 15 + Math.sin(x * 0.02 + (isPlaying ? Date.now() * 0.002 : 0) + i) * 3
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // Update and draw particles based on stage
      const particles = particlesRef.current
      particles.forEach((p, i) => {
        if (isPlaying) {
          switch (stage) {
            case 0: // Evaporation
              if (p.type === 'water') {
                p.vy = -1 - Math.random() * 0.5
                p.type = 'vapor'
                p.alpha = 0.8
                p.size = 2
              }
              p.y += p.vy
              p.x += (Math.random() - 0.5) * 0.5
              if (p.y < h * 0.2) {
                p.type = 'cloud'
                p.alpha = 0.6
                p.size = 4 + Math.random() * 3
              }
              break
            case 1: // Condensation
              p.type = 'cloud'
              p.x += (Math.random() - 0.5) * 0.3
              p.y += (Math.random() - 0.5) * 0.2
              p.alpha = 0.5 + Math.random() * 0.3
              break
            case 2: // Precipitation
              if (p.type === 'cloud') {
                p.type = 'rain'
                p.alpha = 1
                p.size = 2
                p.vy = 3 + Math.random() * 2
              }
              p.y += p.vy
              if (p.y > h * 0.7) {
                p.type = 'water'
                p.alpha = 1
                p.size = 3 + Math.random() * 2
                p.y = h * 0.7 + Math.random() * h * 0.2
              }
              break
            case 3: // Collection
              p.type = 'water'
              p.x += Math.sin((isPlaying ? Date.now() * 0.001 : 0) + i) * 0.3
              p.y = h * 0.75 + Math.random() * h * 0.15
              break
          }
        }

        // Draw particle
        ctx.beginPath()
        switch (p.type) {
          case 'water':
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(2, 132, 199, ${p.alpha})`
            ctx.fill()
            break
          case 'vapor':
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(147, 197, 253, ${p.alpha})`
            ctx.fill()
            break
          case 'cloud':
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
            ctx.fill()
            break
          case 'rain':
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(59, 130, 246, ${p.alpha})`
            ctx.fill()
            break
        }
      })

      // Clouds
      const cloudPositions = [
        { x: w * 0.2, y: h * 0.15 },
        { x: w * 0.5, y: h * 0.12 },
        { x: w * 0.75, y: h * 0.18 },
      ]
      cloudPositions.forEach((cloud, i) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + stage * 0.1})`
        ctx.beginPath()
        ctx.arc(cloud.x, cloud.y, 20, 0, Math.PI * 2)
        ctx.arc(cloud.x + 15, cloud.y - 5, 15, 0, Math.PI * 2)
        ctx.arc(cloud.x + 25, cloud.y, 18, 0, Math.PI * 2)
        ctx.arc(cloud.x - 10, cloud.y + 3, 12, 0, Math.PI * 2)
        ctx.fill()
      })

      // Stage labels
      const stageLabels = ['☀️ Evaporation', '☁️ Condensation', '🌧️ Precipitation', '🌊 Collection']
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#0369a1'
      ctx.fillText(stageLabels[stage], w / 2, h - 20)

      // Arrows showing cycle
      if (stage < 3) {
        ctx.strokeStyle = 'rgba(3, 105, 161, 0.3)'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        const arrowStarts = [
          { x: w * 0.3, y: h * 0.65 },
          { x: w * 0.5, y: h * 0.15 },
          { x: w * 0.6, y: h * 0.5 },
        ]
        const arrowEnds = [
          { x: w * 0.5, y: h * 0.15 },
          { x: w * 0.6, y: h * 0.5 },
          { x: w * 0.3, y: h * 0.65 },
        ]
        ctx.moveTo(arrowStarts[stage].x, arrowStarts[stage].y)
        ctx.lineTo(arrowEnds[stage].x, arrowEnds[stage].y)
        ctx.stroke()
        ctx.setLineDash([])
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [stage, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
