import { useRef, useEffect } from 'react'

interface MultiplicationCanvasProps {
  rows: number
  cols: number
  isPlaying: boolean
}

export default function MultiplicationCanvas({ rows, cols, isPlaying }: MultiplicationCanvasProps) {
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

      // Grid
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)'
      ctx.lineWidth = 1
      for (let x = 0; x < w; x += 20) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += 20) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      const total = rows * cols
      const cellSize = Math.min(40, (w - 80) / cols, (h - 120) / rows)
      const gridWidth = cols * cellSize
      const gridHeight = rows * cellSize
      const startX = (w - gridWidth) / 2
      const startY = (h - gridHeight) / 2 + 10

      // Draw cells
      let count = 0
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * cellSize
          const y = startY + r * cellSize

          // Animate cells appearing
          const delay = count * 30
          const elapsed = isPlaying ? Date.now() % (total * 30 + 1000) : total * 30
          const visible = elapsed > delay

          if (visible) {
            const alpha = Math.min(1, (elapsed - delay) / 200)
            ctx.fillStyle = `rgba(139, 92, 246, ${alpha * 0.3})`
            ctx.beginPath()
            ctx.roundRect(x + 2, y + 2, cellSize - 4, cellSize - 4, 4)
            ctx.fill()

            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.roundRect(x + 2, y + 2, cellSize - 4, cellSize - 4, 4)
            ctx.stroke()

            // Dot
            ctx.beginPath()
            ctx.arc(x + cellSize / 2, y + cellSize / 2, 4, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`
            ctx.fill()
          }

          count++
        }
      }

      // Row labels
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillStyle = '#7c3aed'
      for (let r = 0; r < rows; r++) {
        ctx.fillText(`${r + 1}`, startX - 10, startY + r * cellSize + cellSize / 2 + 4)
      }

      // Column labels
      ctx.textAlign = 'center'
      for (let c = 0; c < cols; c++) {
        ctx.fillText(`${c + 1}`, startX + c * cellSize + cellSize / 2, startY - 10)
      }

      // Result
      ctx.font = 'bold 28px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#5b21b6'
      ctx.fillText(`${rows} × ${cols} = ${total}`, w / 2, h - 30)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [rows, cols, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
