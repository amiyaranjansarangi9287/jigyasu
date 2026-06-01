import { useRef, useEffect } from 'react'

interface PlantGrowthCanvasProps {
  growth: number
  isPlaying: boolean
}

export default function PlantGrowthCanvas({ growth, isPlaying }: PlantGrowthCanvasProps) {
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
    const groundY = h * 0.75
    const centerX = w / 2

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY)
      skyGrad.addColorStop(0, '#bae6fd')
      skyGrad.addColorStop(1, '#e0f2fe')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, w, groundY)

      // Ground
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, h)
      groundGrad.addColorStop(0, '#92400e')
      groundGrad.addColorStop(1, '#78350f')
      ctx.fillStyle = groundGrad
      ctx.fillRect(0, groundY, w, h - groundY)

      // Sun
      const sunX = w * 0.8
      const sunY = h * 0.15
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 60)
      sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.6)')
      sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)')
      ctx.fillStyle = sunGlow
      ctx.fillRect(sunX - 60, sunY - 60, 120, 120)

      ctx.beginPath()
      ctx.arc(sunX, sunY, 20, 0, Math.PI * 2)
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 20)
      sunGrad.addColorStop(0, '#fef08a')
      sunGrad.addColorStop(1, '#f59e0b')
      ctx.fillStyle = sunGrad
      ctx.fill()

      // Rain drops
      if (growth > 0.2 && growth < 0.8) {
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)'
        ctx.lineWidth = 2
        for (let i = 0; i < 10; i++) {
          const rx = w * 0.2 + (i * 37) % (w * 0.6)
          const ry = (isPlaying ? Date.now() * 0.1 : 0 + i * 50) % (groundY - 50)
          ctx.beginPath()
          ctx.moveTo(rx, ry)
          ctx.lineTo(rx - 2, ry + 8)
          ctx.stroke()
        }
      }

      // Plant growth stages
      const plantHeight = growth * (groundY - 80)
      const stemWidth = 4 + growth * 6

      if (growth > 0) {
        // Seed/Root
        ctx.fillStyle = '#92400e'
        ctx.beginPath()
        ctx.ellipse(centerX, groundY + 10, 8, 5, 0, 0, Math.PI * 2)
        ctx.fill()

        // Roots
        ctx.strokeStyle = '#b45309'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(centerX, groundY + 10)
        ctx.quadraticCurveTo(centerX - 20, groundY + 30, centerX - 30, groundY + 40)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(centerX, groundY + 10)
        ctx.quadraticCurveTo(centerX + 15, groundY + 35, centerX + 25, groundY + 45)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(centerX, groundY + 10)
        ctx.lineTo(centerX, groundY + 35)
        ctx.stroke()
      }

      if (growth > 0.1) {
        // Stem
        ctx.strokeStyle = '#16a34a'
        ctx.lineWidth = stemWidth
        ctx.beginPath()
        ctx.moveTo(centerX, groundY)
        ctx.quadraticCurveTo(centerX + Math.sin(isPlaying ? Date.now() * 0.001 : 0) * 5, groundY - plantHeight / 2, centerX, groundY - plantHeight)
        ctx.stroke()
      }

      if (growth > 0.3) {
        // Leaves
        const leafCount = Math.floor(growth * 6)
        for (let i = 0; i < leafCount; i++) {
          const leafY = groundY - (i / 6) * plantHeight
          const leafSize = 15 + growth * 10
          const side = i % 2 === 0 ? -1 : 1

          ctx.save()
          ctx.translate(centerX, leafY)
          ctx.rotate(side * 0.3 + Math.sin(isPlaying ? Date.now() * 0.002 : 0 + i) * 0.1)

          ctx.beginPath()
          ctx.ellipse(side * leafSize / 2, 0, leafSize, leafSize / 3, side * 0.3, 0, Math.PI * 2)
          ctx.fillStyle = '#22c55e'
          ctx.fill()
          ctx.strokeStyle = '#16a34a'
          ctx.lineWidth = 1
          ctx.stroke()

          ctx.restore()
        }
      }

      if (growth > 0.7) {
        // Flower
        const flowerY = groundY - plantHeight
        const petalCount = 5
        const petalSize = 12 + (growth - 0.7) * 20

        for (let i = 0; i < petalCount; i++) {
          const angle = (i / petalCount) * Math.PI * 2 + (isPlaying ? Date.now() * 0.0005 : 0)
          const px = centerX + Math.cos(angle) * petalSize
          const py = flowerY + Math.sin(angle) * petalSize

          ctx.beginPath()
          ctx.ellipse(px, py, petalSize * 0.6, petalSize * 0.3, angle, 0, Math.PI * 2)
          ctx.fillStyle = '#f472b6'
          ctx.fill()
          ctx.strokeStyle = '#ec4899'
          ctx.lineWidth = 1
          ctx.stroke()
        }

        // Flower center
        ctx.beginPath()
        ctx.arc(centerX, flowerY, petalSize * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = '#fbbf24'
        ctx.fill()
      }

      // Growth stage label
      const stages = ['🌱 Seed', '🌱 Sprouting', '🌿 Growing', '🌿 Developing', '🌿 Mature', '🌸 Flowering']
      const stageIndex = Math.min(5, Math.floor(growth * 6))
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#065f46'
      ctx.fillText(stages[stageIndex], centerX, 30)

      // Growth percentage
      ctx.font = '12px Inter, sans-serif'
      ctx.fillStyle = '#64748b'
      ctx.fillText(`${Math.round(growth * 100)}% grown`, centerX, 50)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [growth, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
