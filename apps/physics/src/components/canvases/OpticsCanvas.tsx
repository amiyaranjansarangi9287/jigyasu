import { useRef, useEffect } from 'react'

interface OpticsCanvasProps {
  lensType: number
  isPlaying: boolean
}

export default function OpticsCanvas({ lensType, isPlaying }: OpticsCanvasProps) {
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

      if (isPlaying) time += 0.02

      const cx = w / 2
      const cy = h / 2

      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(0, cy)
      ctx.lineTo(w, cy)
      ctx.stroke()
      ctx.setLineDash([])

      if (lensType === 0) {
        ctx.fillStyle = '#bfdbfe'
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(cx - 15, cy - 120)
        ctx.quadraticCurveTo(cx + 25, cy - 60, cx + 15, cy)
        ctx.quadraticCurveTo(cx + 25, cy + 60, cx - 15, cy + 120)
        ctx.quadraticCurveTo(cx - 25, cy + 60, cx - 15, cy)
        ctx.quadraticCurveTo(cx - 25, cy - 60, cx - 15, cy - 120)
        ctx.fill()
        ctx.stroke()

        const rays = [-60, -30, 0, 30, 60]
        rays.forEach(offset => {
          const rayY = cy + offset
          ctx.strokeStyle = '#fbbf24'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(30, rayY)
          ctx.lineTo(cx - 15, rayY)
          ctx.stroke()

          const focalX = cx + 120
          ctx.beginPath()
          ctx.moveTo(cx - 15, rayY)
          ctx.lineTo(focalX, cy)
          ctx.stroke()

          ctx.strokeStyle = '#fbbf2488'
          ctx.beginPath()
          ctx.moveTo(focalX, cy)
          ctx.lineTo(w - 30, cy + (offset * (w - 30 - focalX)) / (focalX - cx + 15))
          ctx.stroke()
        })

        ctx.fillStyle = '#ef4444'
        ctx.beginPath()
        ctx.arc(cx + 120, cy, 5, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#1e293b'
        ctx.font = 'bold 14px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('Convex Lens — Converges Light', w / 2, 25)
      } else {
        ctx.fillStyle = '#bfdbfe'
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(cx - 10, cy - 120)
        ctx.quadraticCurveTo(cx - 25, cy - 60, cx - 15, cy)
        ctx.quadraticCurveTo(cx - 25, cy + 60, cx - 10, cy + 120)
        ctx.quadraticCurveTo(cx + 10, cy + 60, cx + 15, cy)
        ctx.quadraticCurveTo(cx + 10, cy - 60, cx - 10, cy - 120)
        ctx.fill()
        ctx.stroke()

        const rays = [-60, -30, 0, 30, 60]
        rays.forEach(offset => {
          const rayY = cy + offset
          ctx.strokeStyle = '#fbbf24'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(30, rayY)
          ctx.lineTo(cx - 10, rayY)
          ctx.stroke()

          const endX = w - 30
          const spreadY = rayY + (rayY - cy) * 0.5
          ctx.beginPath()
          ctx.moveTo(cx - 10, rayY)
          ctx.lineTo(endX, spreadY)
          ctx.stroke()

          ctx.strokeStyle = '#fbbf2444'
          ctx.setLineDash([4, 4])
          ctx.beginPath()
          ctx.moveTo(cx - 10, rayY)
          ctx.lineTo(cx - 80, cy + (rayY - cy) * 0.3)
          ctx.stroke()
          ctx.setLineDash([])
        })

        ctx.fillStyle = '#1e293b'
        ctx.font = 'bold 14px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('Concave Lens — Diverges Light', w / 2, 25)
      }

      ctx.fillStyle = '#94a3b8'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Yellow = light rays | Red = focal point', w / 2, h - 15)

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [lensType, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
