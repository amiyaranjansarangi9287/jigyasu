import { useRef, useEffect } from 'react'

interface NumberLineCanvasProps {
  start: number
  operation: 'add' | 'subtract'
  value: number
  isPlaying: boolean
}

export default function NumberLineCanvas({ start, operation, value, isPlaying }: NumberLineCanvasProps) {
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

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#ede9fe')
      bg.addColorStop(1, '#ddd6fe')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      const lineY = h * 0.5
      const startX = w * 0.1
      const endX = w * 0.9
      const range = 20
      const step = (endX - startX) / range

      // Number line
      ctx.beginPath()
      ctx.moveTo(startX, lineY)
      ctx.lineTo(endX, lineY)
      ctx.strokeStyle = '#7c3aed'
      ctx.lineWidth = 3
      ctx.stroke()

      // Numbers and ticks
      for (let i = 0; i <= range; i++) {
        const x = startX + i * step
        const num = i - 10

        // Tick
        ctx.beginPath()
        ctx.moveTo(x, lineY - 10)
        ctx.lineTo(x, lineY + 10)
        ctx.strokeStyle = '#7c3aed'
        ctx.lineWidth = 2
        ctx.stroke()

        // Number
        ctx.font = '12px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#5b21b6'
        ctx.fillText(num.toString(), x, lineY + 30)
      }

      // Start position
      const startPixel = startX + (start + 10) * step
      ctx.beginPath()
      ctx.arc(startPixel, lineY, 8, 0, Math.PI * 2)
      ctx.fillStyle = '#7c3aed'
      ctx.fill()

      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#5b21b6'
      ctx.fillText(`Start: ${start}`, startPixel, lineY - 20)

      // Animated movement
      if (isPlaying) {
        const progress = Math.min(1, (Date.now() % 3000) / 2000)
        const currentX = startPixel + (operation === 'add' ? 1 : -1) * value * step * progress

        // Movement arrow
        ctx.beginPath()
        ctx.moveTo(startPixel, lineY - 40)
        ctx.lineTo(currentX, lineY - 40)
        ctx.strokeStyle = operation === 'add' ? '#22c55e' : '#ef4444'
        ctx.lineWidth = 3
        ctx.stroke()

        // Arrow head
        ctx.beginPath()
        ctx.moveTo(currentX, lineY - 45)
        ctx.lineTo(currentX + (operation === 'add' ? -8 : 8), lineY - 40)
        ctx.lineTo(currentX, lineY - 35)
        ctx.fillStyle = operation === 'add' ? '#22c55e' : '#ef4444'
        ctx.fill()

        // Current position marker
        ctx.beginPath()
        ctx.arc(currentX, lineY, 6, 0, Math.PI * 2)
        ctx.fillStyle = operation === 'add' ? '#22c55e' : '#ef4444'
        ctx.fill()
      }

      // Result
      const result = operation === 'add' ? start + value : start - value
      const resultPixel = startX + (result + 10) * step
      ctx.beginPath()
      ctx.arc(resultPixel, lineY, 10, 0, Math.PI * 2)
      ctx.fillStyle = '#f59e0b'
      ctx.fill()
      ctx.strokeStyle = '#d97706'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#92400e'
      ctx.fillText(`Result: ${result}`, resultPixel, lineY - 50)

      // Equation
      ctx.font = 'bold 18px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#5b21b6'
      ctx.fillText(`${start} ${operation === 'add' ? '+' : '-'} ${value} = ${result}`, w / 2, 30)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [start, operation, value, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
