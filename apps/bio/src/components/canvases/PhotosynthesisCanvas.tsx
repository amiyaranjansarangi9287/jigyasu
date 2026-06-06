import { useRef, useEffect } from 'react'

interface PhotosynthesisCanvasProps {
  sunIntensity: number
  isPlaying: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  type: 'photon' | 'co2' | 'o2' | 'glucose' | 'water'
  alpha: number
  scale: number
  absorbed?: boolean
}

export default function PhotosynthesisCanvas({ sunIntensity, isPlaying }: PhotosynthesisCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const sunIntensityRef = useRef(sunIntensity)
  const isPlayingRef = useRef(isPlaying)
  const lastSpawnRef = useRef(0)
  const glucoseCountRef = useRef(0)
  const o2CountRef = useRef(0)

  useEffect(() => {
    sunIntensityRef.current = sunIntensity
  }, [sunIntensity])

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

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

    const leafCenterX = w * 0.5
    const leafCenterY = h * 0.55
    const leafWidth = w * 0.5
    const leafHeight = h * 0.35

    const chloroplasts = [
      { x: leafCenterX - leafWidth * 0.25, y: leafCenterY - leafHeight * 0.1 },
      { x: leafCenterX + leafWidth * 0.1, y: leafCenterY - leafHeight * 0.15 },
      { x: leafCenterX - leafWidth * 0.1, y: leafCenterY + leafHeight * 0.15 },
      { x: leafCenterX + leafWidth * 0.25, y: leafCenterY + leafHeight * 0.1 },
      { x: leafCenterX, y: leafCenterY },
    ]

    const spawnPhoton = () => {
      const startX = Math.random() * w * 0.6 + w * 0.2
      particlesRef.current.push({
        x: startX, y: -10,
        vx: (Math.random() - 0.5) * 0.5, vy: 2 + Math.random() * 2,
        type: 'photon', alpha: 1, scale: 0.8 + Math.random() * 0.4,
      })
    }

    const spawnCO2 = () => {
      particlesRef.current.push({
        x: -20, y: leafCenterY + (Math.random() - 0.5) * leafHeight * 0.5,
        vx: 1 + Math.random() * 0.5, vy: (Math.random() - 0.5) * 0.3,
        type: 'co2', alpha: 1, scale: 1,
      })
    }

    const spawnWater = () => {
      particlesRef.current.push({
        x: leafCenterX + (Math.random() - 0.5) * leafWidth * 0.3, y: h + 10,
        vx: (Math.random() - 0.5) * 0.2, vy: -1.5 - Math.random() * 0.5,
        type: 'water', alpha: 1, scale: 0.8,
      })
    }

    const drawLeaf = () => {
      ctx.save()
      // Leaf shape
      ctx.beginPath()
      ctx.ellipse(leafCenterX, leafCenterY, leafWidth / 2, leafHeight / 2, 0, 0, Math.PI * 2)
      const leafGrad = ctx.createRadialGradient(leafCenterX, leafCenterY, 0, leafCenterX, leafCenterY, leafWidth / 2)
      leafGrad.addColorStop(0, '#4ade80')
      leafGrad.addColorStop(0.7, '#22c55e')
      leafGrad.addColorStop(1, '#16a34a')
      ctx.fillStyle = leafGrad
      ctx.fill()
      ctx.strokeStyle = '#15803d'
      ctx.lineWidth = 2
      ctx.stroke()

      // Veins
      ctx.strokeStyle = '#166534'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(leafCenterX - leafWidth * 0.4, leafCenterY)
      ctx.lineTo(leafCenterX + leafWidth * 0.4, leafCenterY)
      ctx.stroke()

      for (let i = -2; i <= 2; i++) {
        ctx.beginPath()
        ctx.moveTo(leafCenterX + i * leafWidth * 0.12, leafCenterY)
        ctx.lineTo(leafCenterX + i * leafWidth * 0.2, leafCenterY - leafHeight * 0.3)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(leafCenterX + i * leafWidth * 0.12, leafCenterY)
        ctx.lineTo(leafCenterX + i * leafWidth * 0.2, leafCenterY + leafHeight * 0.3)
        ctx.stroke()
      }

      // Chloroplasts
      chloroplasts.forEach(cp => {
        ctx.beginPath()
        ctx.ellipse(cp.x, cp.y, 8, 5, 0, 0, Math.PI * 2)
        ctx.fillStyle = '#16a34a'
        ctx.fill()
        ctx.strokeStyle = '#15803d'
        ctx.lineWidth = 1
        ctx.stroke()
      })
      ctx.restore()
    }

    const drawSun = () => {
      const sunX = w * 0.8
      const sunY = h * 0.15
      const sunRadius = 30 + sunIntensity * 10

      // Glow
      const glowGrad = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.5, sunX, sunY, sunRadius * 2)
      glowGrad.addColorStop(0, `rgba(250, 204, 21, ${0.3 * sunIntensity})`)
      glowGrad.addColorStop(1, 'rgba(250, 204, 21, 0)')
      ctx.fillStyle = glowGrad
      ctx.fillRect(sunX - sunRadius * 2, sunY - sunRadius * 2, sunRadius * 4, sunRadius * 4)

      // Sun body
      ctx.beginPath()
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2)
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius)
      sunGrad.addColorStop(0, '#fef08a')
      sunGrad.addColorStop(0.5, '#facc15')
      sunGrad.addColorStop(1, '#eab308')
      ctx.fillStyle = sunGrad
      ctx.fill()

      // Rays
      ctx.strokeStyle = `rgba(234, 179, 8, ${sunIntensity})`
      ctx.lineWidth = 2
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + (isPlaying ? Date.now() * 0.0003 : 0)
        ctx.beginPath()
        ctx.moveTo(sunX + Math.cos(angle) * (sunRadius + 5), sunY + Math.sin(angle) * (sunRadius + 5))
        ctx.lineTo(sunX + Math.cos(angle) * (sunRadius + 15 + sunIntensity * 10), sunY + Math.sin(angle) * (sunRadius + 15 + sunIntensity * 10))
        ctx.stroke()
      }
    }

    const drawGround = () => {
      ctx.fillStyle = '#92400e'
      ctx.fillRect(0, h * 0.85, w, h * 0.15)

      // Soil texture
      ctx.fillStyle = '#78350f'
      for (let i = 0; i < 20; i++) {
        ctx.beginPath()
        ctx.arc(Math.random() * w, h * 0.85 + Math.random() * h * 0.15, 2, 0, Math.PI * 2)
        ctx.fill()
      }

      // Roots
      ctx.strokeStyle = '#b45309'
      ctx.lineWidth = 2
      const rootX = leafCenterX
      const rootY = h * 0.85
      ctx.beginPath()
      ctx.moveTo(rootX, rootY)
      ctx.quadraticCurveTo(rootX - 20, rootY + 20, rootX - 30, rootY + 40)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(rootX, rootY)
      ctx.quadraticCurveTo(rootX + 15, rootY + 25, rootX + 25, rootY + 45)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(rootX, rootY)
      ctx.lineTo(rootX, rootY + 35)
      ctx.stroke()
    }

    const drawParticle = (p: Particle) => {
      ctx.save()
      ctx.globalAlpha = p.alpha

      switch (p.type) {
        case 'photon':
          ctx.beginPath()
          ctx.arc(p.x, p.y, 4 * p.scale, 0, Math.PI * 2)
          ctx.fillStyle = '#facc15'
          ctx.fill()
          ctx.shadowColor = '#facc15'
          ctx.shadowBlur = 8
          ctx.fill()
          break
        case 'co2':
          ctx.beginPath()
          ctx.arc(p.x, p.y, 5 * p.scale, 0, Math.PI * 2)
          ctx.fillStyle = '#94a3b8'
          ctx.fill()
          ctx.fillStyle = '#fff'
          ctx.font = '7px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('CO₂', p.x, p.y)
          break
        case 'water':
          ctx.beginPath()
          ctx.arc(p.x, p.y, 4 * p.scale, 0, Math.PI * 2)
          ctx.fillStyle = '#3b82f6'
          ctx.fill()
          break
        case 'o2':
          ctx.beginPath()
          ctx.arc(p.x, p.y, 5 * p.scale, 0, Math.PI * 2)
          ctx.fillStyle = '#60a5fa'
          ctx.fill()
          ctx.fillStyle = '#fff'
          ctx.font = '7px sans-serif'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('O₂', p.x, p.y)
          break
        case 'glucose':
          ctx.beginPath()
          // Hexagon
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 2
            const hx = p.x + Math.cos(angle) * 7 * p.scale
            const hy = p.y + Math.sin(angle) * 7 * p.scale
            if (i === 0) ctx.moveTo(hx, hy)
            else ctx.lineTo(hx, hy)
          }
          ctx.closePath()
          ctx.fillStyle = '#fbbf24'
          ctx.fill()
          ctx.strokeStyle = '#f59e0b'
          ctx.lineWidth = 1
          ctx.stroke()
          break
      }
      ctx.restore()
    }

    const drawLabels = () => {
      ctx.font = 'bold 11px Inter, sans-serif'
      ctx.textAlign = 'center'

      // Sunlight label
      ctx.fillStyle = '#ca8a04'
      ctx.fillText('☀️ Sunlight', w * 0.8, h * 0.08)

      // CO2 label
      ctx.fillStyle = '#64748b'
      ctx.fillText('CO₂ from air', w * 0.15, leafCenterY - leafHeight * 0.6)

      // Water label
      ctx.fillStyle = '#2563eb'
      ctx.fillText('💧 Water from roots', leafCenterX, h * 0.95)

      // O2 label
      ctx.fillStyle = '#3b82f6'
      ctx.fillText('O₂ released', w * 0.85, leafCenterY - leafHeight * 0.3)

      // Glucose label
      ctx.fillStyle = '#d97706'
      ctx.fillText('Glucose (food)', leafCenterX, leafCenterY + leafHeight * 0.7)
    }

    const drawCounters = () => {
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#1e293b'

      // Background
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      ctx.roundRect(10, 10, 140, 50, 8)
      ctx.fill()

      ctx.fillStyle = '#1e293b'
      ctx.fillText(`🍬 Glucose made: ${glucoseCountRef.current}`, 20, 30)
      ctx.fillText(`💨 O₂ released: ${o2CountRef.current}`, 20, 50)
    }

    const updateParticles = () => {
      const particles = particlesRef.current
      const intensity = sunIntensityRef.current

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        if (!isPlayingRef.current) continue

        switch (p.type) {
          case 'photon':
            p.x += p.vx
            p.y += p.vy * intensity
            if (p.y > leafCenterY - leafHeight * 0.3 && !p.absorbed) {
              p.absorbed = true
              p.alpha = 0
            }
            break
          case 'co2':
            p.x += p.vx * intensity
            p.y += p.vy
            if (p.x > leafCenterX - leafWidth * 0.3 && !p.absorbed) {
              p.absorbed = true
              p.alpha = 0
            }
            break
          case 'water':
            p.x += p.vx
            p.y += p.vy
            if (p.y < h * 0.85 && !p.absorbed) {
              p.absorbed = true
              p.alpha = 0
            }
            break
          case 'o2':
            p.x += p.vx
            p.y += p.vy
            break
          case 'glucose':
            p.x += p.vx
            p.y += p.vy
            break
        }

        // Remove off-screen or fully transparent
        if (p.alpha <= 0 || p.x < -50 || p.x > w + 50 || p.y < -50 || p.y > h + 50) {
          particles.splice(i, 1)
        }
      }

      // Spawn new particles based on intensity
      if (isPlayingRef.current && intensity > 0.1) {
        const now = Date.now()
        if (now - lastSpawnRef.current > 200 / intensity) {
          lastSpawnRef.current = now
          spawnPhoton()
          if (Math.random() < 0.5) spawnCO2()
          if (Math.random() < 0.3) spawnWater()

          // Reaction: create glucose and O2
          if (Math.random() < intensity * 0.4) {
            glucoseCountRef.current++
            particles.push({
              x: leafCenterX + (Math.random() - 0.5) * 20,
              y: leafCenterY + (Math.random() - 0.5) * 20,
              vx: (Math.random() - 0.5) * 0.5, vy: 0.5,
              type: 'glucose', alpha: 1, scale: 1,
            })
          }
          if (Math.random() < intensity * 0.6) {
            o2CountRef.current++
            particles.push({
              x: leafCenterX + (Math.random() - 0.5) * 30,
              y: leafCenterY - leafHeight * 0.2,
              vx: (Math.random() - 0.5) * 1, vy: -1.5 - Math.random(),
              type: 'o2', alpha: 1, scale: 1,
            })
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.85)
      skyGrad.addColorStop(0, '#dbeafe')
      skyGrad.addColorStop(1, '#f0f9ff')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, w, h * 0.85)

      drawSun()
      drawGround()
      drawLeaf()
      updateParticles()
      particlesRef.current.forEach(drawParticle)
      drawLabels()
      drawCounters()

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  )
}
