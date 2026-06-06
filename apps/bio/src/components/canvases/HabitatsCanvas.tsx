import { useRef, useEffect } from 'react'

interface HabitatsCanvasProps {
  habitat: number
  isPlaying: boolean
}

export default function HabitatsCanvas({ habitat, isPlaying }: HabitatsCanvasProps) {
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

      const habitats = [
        { name: '🌲 Forest', bg: ['#ecfdf5', '#d1fae5'], animals: ['🦌', '🐻', '🦉', '🐿️'] },
        { name: '🌊 Ocean', bg: ['#e0f2fe', '#bae6fd'], animals: ['🐟', '🐋', '🦈', '🐙'] },
        { name: '🏜️ Desert', bg: ['#fef3c7', '#fde68a'], animals: ['🐪', '🦎', '🦂', '🐍'] },
        { name: '❄️ Arctic', bg: ['#f1f5f9', '#e2e8f0'], animals: ['🐻‍❄️', '🐧', '🦭', '🦊'] },
      ]

      const hab = habitats[habitat]

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, hab.bg[0])
      bg.addColorStop(1, hab.bg[1])
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Habitat-specific elements
      if (habitat === 0) {
        // Trees
        for (let i = 0; i < 5; i++) {
          const x = w * 0.1 + i * w * 0.2
          ctx.fillStyle = '#92400e'
          ctx.fillRect(x - 5, h * 0.5, 10, h * 0.3)
          ctx.fillStyle = '#16a34a'
          ctx.beginPath()
          ctx.moveTo(x, h * 0.2)
          ctx.lineTo(x - 25, h * 0.5)
          ctx.lineTo(x + 25, h * 0.5)
          ctx.closePath()
          ctx.fill()
        }
      } else if (habitat === 1) {
        // Waves
        ctx.strokeStyle = '#0284c7'
        ctx.lineWidth = 2
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          for (let x = 0; x < w; x += 5) {
            const y = h * 0.6 + i * 20 + Math.sin(x * 0.02 + (isPlaying ? Date.now() * 0.002 : 0) + i) * 5
            if (x === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
      } else if (habitat === 2) {
        // Sand dunes
        ctx.fillStyle = '#d97706'
        ctx.beginPath()
        ctx.moveTo(0, h * 0.7)
        for (let x = 0; x < w; x += 5) {
          ctx.lineTo(x, h * 0.6 + Math.sin(x * 0.01) * 20)
        }
        ctx.lineTo(w, h)
        ctx.lineTo(0, h)
        ctx.closePath()
        ctx.fill()
      } else {
        // Ice
        ctx.fillStyle = '#e2e8f0'
        ctx.fillRect(0, h * 0.7, w, h * 0.3)
        ctx.fillStyle = '#cbd5e1'
        for (let i = 0; i < 5; i++) {
          ctx.beginPath()
          ctx.moveTo(w * 0.1 + i * w * 0.2, h * 0.7)
          ctx.lineTo(w * 0.15 + i * w * 0.2, h * 0.5)
          ctx.lineTo(w * 0.2 + i * w * 0.2, h * 0.7)
          ctx.closePath()
          ctx.fill()
        }
      }

      // Animals
      hab.animals.forEach((animal, i) => {
        const x = w * 0.2 + i * w * 0.2
        const y = h * 0.4 + Math.sin((isPlaying ? Date.now() * 0.002 : 0) + i) * 10
        ctx.font = '32px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(animal, x, y)
      })

      // Title
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#1e293b'
      ctx.fillText(hab.name, w / 2, 30)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [habitat, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
