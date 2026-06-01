import { useRef, useEffect } from 'react'

interface PlateTectonicsCanvasProps {
  interaction: number
  isPlaying: boolean
}

export default function PlateTectonicsCanvas({ interaction, isPlaying }: PlateTectonicsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    let time = 0

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

      if (isPlaying) time += 0.01

      const mantleY = h * 0.5
      const crustY = h * 0.35

      ctx.fillStyle = '#dc2626'
      ctx.fillRect(0, mantleY, w, h - mantleY)

      for (let i = 0; i < 30; i++) {
        const mx = (Math.sin(time + i * 0.5) * 0.5 + 0.5) * w
        const my = mantleY + 20 + Math.sin(time * 0.5 + i) * 30
        ctx.fillStyle = `rgba(251, 146, 60, ${0.3 + Math.random() * 0.3})`
        ctx.beginPath()
        ctx.arc(mx, my, 8 + Math.sin(time + i) * 4, 0, Math.PI * 2)
        ctx.fill()
      }

      const plateOffset = Math.sin(time * 0.3) * 20

      ctx.fillStyle = '#92400e'
      ctx.fillRect(0, crustY, w / 2 + plateOffset, mantleY - crustY)
      ctx.fillStyle = '#78350f'
      ctx.fillRect(w / 2 - plateOffset, crustY, w / 2 + plateOffset, mantleY - crustY)

      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 3
      ctx.setLineDash([8, 4])
      ctx.beginPath()
      ctx.moveTo(w / 2, crustY)
      ctx.lineTo(w / 2, mantleY)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = '#3b82f6'
      ctx.fillRect(0, 0, w, crustY)

      if (interaction === 0) {
        ctx.fillStyle = '#fbbf24'
        ctx.beginPath()
        ctx.moveTo(w / 2 - 30, crustY)
        ctx.lineTo(w / 2, crustY - 60)
        ctx.lineTo(w / 2 + 30, crustY)
        ctx.fill()

        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(w / 2, crustY - 70, 8, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#1e293b'
        ctx.font = 'bold 14px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('🌋 Divergent — Plates Pulling Apart', w / 2, 25)
      } else if (interaction === 1) {
        ctx.fillStyle = '#6b7280'
        ctx.beginPath()
        ctx.moveTo(w / 2 - 50, crustY)
        ctx.lineTo(w / 2 - 20, crustY - 80)
        ctx.lineTo(w / 2 + 20, crustY - 80)
        ctx.lineTo(w / 2 + 50, crustY)
        ctx.fill()

        ctx.fillStyle = '#1e293b'
        ctx.font = 'bold 14px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('⛰️ Convergent — Plates Colliding', w / 2, 25)
      } else {
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(w / 2 - 40, crustY + 20)
        ctx.lineTo(w / 2 + 40, crustY + 20)
        ctx.stroke()

        ctx.fillStyle = '#f59e0b'
        ctx.font = 'bold 16px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('⚡', w / 2 - 50, crustY + 30)
        ctx.fillText('⚡', w / 2 + 50, crustY + 30)

        ctx.fillStyle = '#1e293b'
        ctx.font = 'bold 14px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('🌍 Transform — Plates Sliding Past', w / 2, 25)
      }

      ctx.fillStyle = '#94a3b8'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Magma', w / 4, mantleY + 40)
      ctx.fillText('Crust', w / 4, crustY + 20)

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [interaction, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
