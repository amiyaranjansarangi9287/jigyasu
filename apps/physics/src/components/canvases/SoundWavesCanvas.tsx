import { useRef, useEffect } from 'react'

interface SoundWavesCanvasProps {
  frequency: number
  amplitude: number
  isPlaying: boolean
}

export default function SoundWavesCanvas({ frequency, amplitude, isPlaying }: SoundWavesCanvasProps) {
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
    const cy = h / 2

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#f0f9ff')
      bg.addColorStop(1, '#e0f2fe')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)'
      ctx.lineWidth = 1
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }

      // Center line
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(0, cy)
      ctx.lineTo(w, cy)
      ctx.stroke()
      ctx.setLineDash([])

      // Wave
      const time = isPlaying ? Date.now() * 0.003 : 0
      const wavelength = 200 / frequency
      const waveHeight = amplitude * (h * 0.35)

      // Main wave
      ctx.beginPath()
      ctx.moveTo(0, cy)
      for (let x = 0; x < w; x++) {
        const y = cy + Math.sin((x / wavelength) * Math.PI * 2 - time) * waveHeight
        ctx.lineTo(x, y)
      }
      ctx.strokeStyle = '#0ea5e9'
      ctx.lineWidth = 3
      ctx.stroke()

      // Wave fill
      ctx.lineTo(w, cy)
      ctx.lineTo(0, cy)
      ctx.closePath()
      const waveFill = ctx.createLinearGradient(0, cy - waveHeight, 0, cy + waveHeight)
      waveFill.addColorStop(0, 'rgba(14, 165, 233, 0.1)')
      waveFill.addColorStop(0.5, 'rgba(14, 165, 233, 0.05)')
      waveFill.addColorStop(1, 'rgba(14, 165, 233, 0.1)')
      ctx.fillStyle = waveFill
      ctx.fill()

      // Compression/rarefaction visualization
      const particleY = h * 0.85
      ctx.fillStyle = '#64748b'
      ctx.font = '10px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Air Molecules', w / 2, particleY - 15)

      for (let x = 0; x < w; x += 8) {
        const waveValue = Math.sin((x / wavelength) * Math.PI * 2 - time)
        const compression = waveValue * amplitude * 3
        const spacing = 8 + compression
        const size = 2 + Math.abs(compression) * 0.3

        ctx.beginPath()
        ctx.arc(x + compression, particleY, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(14, 165, 233, ${0.3 + Math.abs(compression) * 0.1})`
        ctx.fill()
      }

      // Labels
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#0369a1'
      ctx.fillText('🔊 Sound Wave', 15, 25)

      // Wavelength indicator
      const wlStart = 50
      const wlEnd = wlStart + wavelength
      if (wlEnd < w) {
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])
        ctx.beginPath()
        ctx.moveTo(wlStart, cy - waveHeight - 15)
        ctx.lineTo(wlStart, cy + waveHeight + 15)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(wlEnd, cy - waveHeight - 15)
        ctx.lineTo(wlEnd, cy + waveHeight + 15)
        ctx.stroke()
        ctx.setLineDash([])

        ctx.beginPath()
        ctx.moveTo(wlStart, cy - waveHeight - 10)
        ctx.lineTo(wlEnd, cy - waveHeight - 10)
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 2
        ctx.stroke()
        // Arrow heads
        ctx.beginPath()
        ctx.moveTo(wlStart, cy - waveHeight - 13)
        ctx.lineTo(wlStart, cy - waveHeight - 7)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(wlEnd, cy - waveHeight - 13)
        ctx.lineTo(wlEnd, cy - waveHeight - 7)
        ctx.stroke()

        ctx.font = '10px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#ef4444'
        ctx.fillText('λ (wavelength)', (wlStart + wlEnd) / 2, cy - waveHeight - 18)
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [frequency, amplitude, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
