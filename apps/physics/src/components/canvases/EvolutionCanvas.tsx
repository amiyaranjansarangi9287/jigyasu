import { useRef, useEffect } from 'react'

interface EvolutionCanvasProps {
  generation: number
  isPlaying: boolean
}

export default function EvolutionCanvas({ generation, isPlaying }: EvolutionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    let time = 0

    interface Creature {
      x: number
      y: number
      size: number
      speed: number
      color: string
      camouflage: number
    }

    const creatures: Creature[] = []
    for (let i = 0; i < 30; i++) {
      creatures.push({
        x: Math.random() * 800,
        y: Math.random() * 400,
        size: 5 + Math.random() * 15,
        speed: 0.5 + Math.random() * 2,
        color: Math.random() > 0.5 ? '#22c55e' : '#84cc16',
        camouflage: Math.random(),
      })
    }

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio
      const h = canvas.height / window.devicePixelRatio
      ctx.clearRect(0, 0, w, h)

      if (isPlaying) time += 0.02

      const bgGreen = Math.min(0.3 + generation * 0.02, 0.8)
      ctx.fillStyle = `rgba(34, 197, 94, ${bgGreen})`
      ctx.fillRect(0, 0, w, h)

      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = `rgba(21, 128, 61, ${0.3 + Math.random() * 0.3})`
        ctx.beginPath()
        ctx.ellipse(Math.random() * w, h * 0.7 + Math.random() * h * 0.3, 15 + Math.random() * 20, 5 + Math.random() * 10, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      const avgCamouflage = creatures.reduce((s, c) => s + c.camouflage, 0) / creatures.length
      const survivalRate = Math.min(0.5 + generation * 0.03, 0.95)

      creatures.forEach((c, i) => {
        if (isPlaying) {
          c.x += (Math.random() - 0.5) * c.speed
          c.y += (Math.random() - 0.5) * c.speed
          if (c.x < 0) c.x = w
          if (c.x > w) c.x = 0
          if (c.y < 0) c.y = h * 0.6
          if (c.y > h * 0.6) c.y = 0
        }

        const alive = Math.random() < survivalRate
        if (!alive) return

        const greenness = c.camouflage * bgGreen
        ctx.fillStyle = `rgb(${Math.round(34 + (1 - c.camouflage) * 100)}, ${Math.round(197 - (1 - c.camouflage) * 50)}, ${Math.round(94 - (1 - c.camouflage) * 50)})`
        ctx.beginPath()
        ctx.arc(c.x, c.y, c.size * (0.8 + generation * 0.02), 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.arc(c.x + c.size * 0.3, c.y - c.size * 0.2, c.size * 0.15, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.fillStyle = '#1e293b'
      ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`Generation ${generation}`, w / 2, 30)

      ctx.fillStyle = '#64748b'
      ctx.font = '14px sans-serif'
      ctx.fillText(`Avg Camouflage: ${(avgCamouflage * 100).toFixed(0)}% | Survival: ${(survivalRate * 100).toFixed(0)}%`, w / 2, 50)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '12px sans-serif'
      ctx.fillText('Green creatures blend with background — more likely to survive', w / 2, h - 20)

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [generation, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
