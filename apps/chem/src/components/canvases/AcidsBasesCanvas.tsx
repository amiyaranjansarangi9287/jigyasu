import { useRef, useEffect } from 'react'

interface AcidsBasesCanvasProps {
  pH: number
  isPlaying: boolean
}

export default function AcidsBasesCanvas({ pH, isPlaying }: AcidsBasesCanvasProps) {
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

    const pHToColor = (ph: number) => {
      if (ph < 3) return '#ef4444'
      if (ph < 5) return '#f97316'
      if (ph < 6.5) return '#eab308'
      if (ph < 7.5) return '#22c55e'
      if (ph < 9) return '#3b82f6'
      if (ph < 11) return '#6366f1'
      return '#8b5cf6'
    }

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio
      const h = canvas.height / window.devicePixelRatio
      ctx.clearRect(0, 0, w, h)

      if (isPlaying) time += 0.03

      const color = pHToColor(pH)
      const beakerX = w / 2 - 80
      const beakerY = h * 0.15
      const beakerW = 160
      const beakerH = h * 0.6

      ctx.strokeStyle = '#94a3b8'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(beakerX, beakerY)
      ctx.lineTo(beakerX, beakerY + beakerH)
      ctx.quadraticCurveTo(beakerX, beakerY + beakerH + 15, beakerX + 15, beakerY + beakerH + 15)
      ctx.lineTo(beakerX + beakerW - 15, beakerY + beakerH + 15)
      ctx.quadraticCurveTo(beakerX + beakerW, beakerY + beakerH + 15, beakerX + beakerW, beakerY + beakerH)
      ctx.lineTo(beakerX + beakerW, beakerY)
      ctx.stroke()

      const liquidH = beakerH * 0.7
      const liquidY = beakerY + beakerH - liquidH

      ctx.fillStyle = `${color}88`
      ctx.beginPath()
      ctx.moveTo(beakerX + 3, liquidY)
      ctx.lineTo(beakerX + 3, beakerY + beakerH)
      ctx.quadraticCurveTo(beakerX + 3, beakerY + beakerH + 12, beakerX + 15, beakerY + beakerH + 12)
      ctx.lineTo(beakerX + beakerW - 15, beakerY + beakerH + 12)
      ctx.quadraticCurveTo(beakerX + beakerW - 3, beakerY + beakerH + 12, beakerX + beakerW - 3, beakerY + beakerH)
      ctx.lineTo(beakerX + beakerW - 3, liquidY)
      ctx.quadraticCurveTo(w / 2, liquidY - 5, beakerX + 3, liquidY)
      ctx.fill()

      for (let i = 0; i < 15; i++) {
        const bx = beakerX + 15 + Math.random() * (beakerW - 30)
        const by = liquidY + 10 + Math.random() * (liquidH - 20)
        const bubbleR = 2 + Math.random() * 4
        ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + Math.random() * 0.3})`
        ctx.beginPath()
        ctx.arc(bx, by - (isPlaying ? (time * 20 + i * 30) % liquidH : 0), bubbleR, 0, Math.PI * 2)
        ctx.fill()
      }

      if (pH < 4) {
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = `rgba(239, 68, 68, ${0.3 + Math.random() * 0.3})`
          ctx.font = '16px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('H⁺', beakerX + 20 + Math.random() * (beakerW - 40), liquidY + 20 + Math.random() * (liquidH - 40))
        }
      } else if (pH > 10) {
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = `rgba(139, 92, 246, ${0.3 + Math.random() * 0.3})`
          ctx.font = '16px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('OH⁻', beakerX + 20 + Math.random() * (beakerW - 40), liquidY + 20 + Math.random() * (liquidH - 40))
        }
      }

      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(w / 2, h * 0.9, 30, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowColor = color
      ctx.shadowBlur = 15
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.fillStyle = '#1e293b'
      ctx.font = 'bold 20px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`pH ${pH.toFixed(1)}`, w / 2, 30)

      ctx.fillStyle = pH < 7 ? '#ef4444' : pH > 7 ? '#3b82f6' : '#22c55e'
      ctx.font = 'bold 16px sans-serif'
      ctx.fillText(pH < 7 ? 'ACIDIC' : pH > 7 ? 'BASIC' : 'NEUTRAL', w / 2, 55)

      const scaleW = w * 0.8
      const scaleX = (w - scaleW) / 2
      const scaleY = h * 0.82

      const gradient = ctx.createLinearGradient(scaleX, 0, scaleX + scaleW, 0)
      gradient.addColorStop(0, '#ef4444')
      gradient.addColorStop(0.35, '#eab308')
      gradient.addColorStop(0.5, '#22c55e')
      gradient.addColorStop(0.65, '#3b82f6')
      gradient.addColorStop(1, '#8b5cf6')
      ctx.fillStyle = gradient
      ctx.fillRect(scaleX, scaleY, scaleW, 8)

      const markerX = scaleX + (pH / 14) * scaleW
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(markerX, scaleY + 4, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#1e293b'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = '#94a3b8'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('0', scaleX, scaleY + 22)
      ctx.textAlign = 'center'
      ctx.fillText('7', scaleX + scaleW / 2, scaleY + 22)
      ctx.textAlign = 'right'
      ctx.fillText('14', scaleX + scaleW, scaleY + 22)

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [pH, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
