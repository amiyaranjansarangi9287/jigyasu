import { useRef, useEffect } from 'react'

interface LightWavesCanvasProps {
  wavelength: number
  isPlaying: boolean
}

export default function LightWavesCanvas({ wavelength, isPlaying }: LightWavesCanvasProps) {
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

    const wavelengthToColor = (wl: number) => {
      if (wl < 380) return '#8b5cf6'
      if (wl < 450) return `hsl(${270 - (wl - 380) * 0.43}, 80%, 55%)`
      if (wl < 495) return `hsl(${240 - (wl - 450) * 2.25}, 80%, 55%)`
      if (wl < 570) return `hsl(${150 - (wl - 495) * 1.67}, 80%, 50%)`
      if (wl < 590) return `hsl(${50 - (wl - 570) * 1.5}, 90%, 55%)`
      if (wl < 620) return `hsl(${30 - (wl - 590) * 0.33}, 90%, 55%)`
      if (wl < 750) return `hsl(${15 - (wl - 620) * 0.12}, 90%, 50%)`
      return '#ef4444'
    }

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio
      const h = canvas.height / window.devicePixelRatio
      ctx.clearRect(0, 0, w, h)

      if (isPlaying) time += 0.05

      const color = wavelengthToColor(wavelength)
      const freq = 0.02 + (750 - wavelength) * 0.0001
      const amplitude = h * 0.25

      for (let wave = 0; wave < 3; wave++) {
        const yOff = h * 0.25 + wave * h * 0.2
        ctx.beginPath()
        ctx.strokeStyle = wave === 1 ? color : `${color}44`
        ctx.lineWidth = wave === 1 ? 3 : 1.5

        for (let x = 0; x < w; x++) {
          const y = yOff + Math.sin(x * freq + time * 2 + wave * 0.5) * amplitude
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      ctx.fillStyle = '#1e293b'
      ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`Wavelength: ${Math.round(wavelength)} nm`, w / 2, 30)

      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(w / 2, h * 0.85, 25, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowColor = color
      ctx.shadowBlur = 20
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.fillStyle = '#94a3b8'
      ctx.font = '14px sans-serif'
      ctx.fillText(wavelength < 400 ? 'Ultraviolet' : wavelength < 495 ? 'Blue/Violet' : wavelength < 570 ? 'Green' : wavelength < 590 ? 'Yellow' : wavelength < 620 ? 'Orange' : 'Red', w / 2, h * 0.85 + 45)

      ctx.strokeStyle = `${color}33`
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      const peakX = w / 2
      const peakY = h * 0.25 - amplitude
      const nextPeakX = peakX + (Math.PI * 2) / freq
      ctx.moveTo(peakX, peakY - 10)
      ctx.lineTo(peakX, peakY + 10)
      ctx.moveTo(nextPeakX, peakY - 10)
      ctx.lineTo(nextPeakX, peakY + 10)
      ctx.moveTo(peakX, peakY)
      ctx.lineTo(nextPeakX, peakY)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = color
      ctx.font = '12px sans-serif'
      ctx.fillText('λ', (peakX + nextPeakX) / 2, peakY - 5)

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [wavelength, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
