import { useRef, useEffect } from 'react'

interface DnaReplicationCanvasProps {
  unzipProgress: number
  isPlaying: boolean
}

export default function DnaReplicationCanvas({ unzipProgress, isPlaying }: DnaReplicationCanvasProps) {
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
    const centerX = w / 2
    const centerY = h / 2

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#ecfdf5')
      bg.addColorStop(1, '#d1fae5')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // DNA double helix
      const helixLength = w * 0.7
      const startX = centerX - helixLength / 2
      const endX = centerX + helixLength / 2
      const autoUnzip = isPlaying ? (Date.now() * 0.0002) % 1 : unzipProgress
      const unzipX = startX + helixLength * autoUnzip

      // Draw unzipped portion
      const amplitude = 30
      const frequency = 0.05

      // Strand 1 (top)
      ctx.beginPath()
      ctx.moveTo(startX, centerY - amplitude)
      for (let x = startX; x <= unzipX; x += 2) {
        const y = centerY - amplitude * Math.cos((x - startX) * frequency)
        ctx.lineTo(x, y)
      }
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 3
      ctx.stroke()

      // Strand 2 (bottom)
      ctx.beginPath()
      ctx.moveTo(startX, centerY + amplitude)
      for (let x = startX; x <= unzipX; x += 2) {
        const y = centerY + amplitude * Math.cos((x - startX) * frequency)
        ctx.lineTo(x, y)
      }
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 3
      ctx.stroke()

      // Base pairs (rungs)
      for (let x = startX; x <= unzipX; x += 20) {
        const y1 = centerY - amplitude * Math.cos((x - startX) * frequency)
        const y2 = centerY + amplitude * Math.cos((x - startX) * frequency)
        ctx.beginPath()
        ctx.moveTo(x, y1)
        ctx.lineTo(x, y2)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Unzipped strands separating
      if (unzipProgress > 0) {
        // Top strand continuing
        ctx.beginPath()
        ctx.moveTo(unzipX, centerY - amplitude * Math.cos((unzipX - startX) * frequency))
        ctx.lineTo(endX, centerY - amplitude * 0.5)
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 3
        ctx.stroke()

        // Bottom strand continuing
        ctx.beginPath()
        ctx.moveTo(unzipX, centerY + amplitude * Math.cos((unzipX - startX) * frequency))
        ctx.lineTo(endX, centerY + amplitude * 0.5)
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 3
        ctx.stroke()

        // New complementary strands forming
        const newStrandAlpha = unzipProgress
        ctx.beginPath()
        ctx.moveTo(unzipX, centerY + amplitude * 0.5)
        for (let x = unzipX; x <= endX; x += 2) {
          const progress = (x - unzipX) / (endX - unzipX)
          const y = centerY + amplitude * 0.5 * (1 - progress) + amplitude * Math.cos((x - startX) * frequency) * progress
          ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(16, 185, 129, ${newStrandAlpha})`
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(unzipX, centerY - amplitude * 0.5)
        for (let x = unzipX; x <= endX; x += 2) {
          const progress = (x - unzipX) / (endX - unzipX)
          const y = centerY - amplitude * 0.5 * (1 - progress) - amplitude * Math.cos((x - startX) * frequency) * progress
          ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(245, 158, 11, ${newStrandAlpha})`
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Helicase enzyme at unzip point
      if (unzipProgress > 0 && unzipProgress < 1) {
        ctx.beginPath()
        ctx.arc(unzipX, centerY, 15, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(139, 92, 246, 0.3)'
        ctx.fill()
        ctx.strokeStyle = '#7c3aed'
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.font = '10px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#7c3aed'
        ctx.fillText('🔓', unzipX, centerY + 4)
      }

      // Labels
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#065f46'
      ctx.fillText('🧬 DNA Replication', centerX, 30)

      ctx.font = '11px Inter, sans-serif'
      ctx.fillStyle = '#64748b'
      ctx.fillText(`Unzip: ${Math.round(unzipProgress * 100)}%`, centerX, 50)

      // Base pair labels
      ctx.font = '10px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#ef4444'
      ctx.fillText('A-T', startX - 40, centerY - amplitude * Math.cos(0) - 5)
      ctx.fillStyle = '#3b82f6'
      ctx.fillText('C-G', startX - 40, centerY + amplitude * Math.cos(0) + 15)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [unzipProgress, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
