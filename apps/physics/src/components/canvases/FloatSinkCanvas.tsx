import { useRef, useEffect } from 'react'

interface FloatSinkCanvasProps {
  density: number
  isPlaying: boolean
}

export default function FloatSinkCanvas({ density, isPlaying }: FloatSinkCanvasProps) {
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
    const waterY = h * 0.5

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, waterY)
      skyGrad.addColorStop(0, '#bae6fd')
      skyGrad.addColorStop(1, '#e0f2fe')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, w, waterY)

      // Water
      const waterGrad = ctx.createLinearGradient(0, waterY, 0, h)
      waterGrad.addColorStop(0, '#0284c7')
      waterGrad.addColorStop(1, '#0369a1')
      ctx.fillStyle = waterGrad
      ctx.fillRect(0, waterY, w, h - waterY)

      // Water waves
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 2
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        for (let x = 0; x < w; x += 5) {
          const y = waterY + i * 15 + Math.sin(x * 0.03 + (isPlaying ? Date.now() * 0.002 : 0) + i) * 3
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // Object position based on density
      const waterDensity = 1.0
      let objectY: number
      let objectLabel: string
      let objectColor: string
      let objectEmoji: string

      if (density < waterDensity) {
        // Floats - partially submerged
        const submersion = density / waterDensity
        objectY = waterY - 40 + submersion * 40
        objectLabel = 'Floats!'
        objectColor = '#22c55e'
        objectEmoji = density < 0.3 ? '🪶' : density < 0.7 ? '🪵' : '🍎'
      } else if (density === waterDensity) {
        // Neutral buoyancy
        objectY = waterY + 20
        objectLabel = 'Neutral'
        objectColor = '#f59e0b'
        objectEmoji = '🥚'
      } else {
        // Sinks
        objectY = h - 60
        objectLabel = 'Sinks!'
        objectColor = '#ef4444'
        objectEmoji = density < 3 ? '🪨' : '⚓'
      }

      const objectX = w / 2
      const objectSize = 50

      // Object shadow in water
      if (density >= waterDensity) {
        ctx.beginPath()
        ctx.arc(objectX, waterY + 10, objectSize * 0.8, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
        ctx.fill()
      }

      // Object body
      ctx.beginPath()
      ctx.arc(objectX, objectY, objectSize / 2, 0, Math.PI * 2)
      const objGrad = ctx.createRadialGradient(objectX - 5, objectY - 5, 0, objectX, objectY, objectSize / 2)
      objGrad.addColorStop(0, objectColor)
      objGrad.addColorStop(1, `${objectColor}80`)
      ctx.fillStyle = objGrad
      ctx.fill()
      ctx.strokeStyle = objectColor
      ctx.lineWidth = 2
      ctx.stroke()

      // Emoji
      ctx.font = '24px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(objectEmoji, objectX, objectY + 8)

      // Label
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.fillStyle = objectColor
      ctx.fillText(objectLabel, objectX, objectY - objectSize / 2 - 10)

      // Density scale
      const scaleX = w - 60
      const scaleTop = h * 0.1
      const scaleBottom = h * 0.9
      const scaleHeight = scaleBottom - scaleTop

      // Scale background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.beginPath()
      ctx.roundRect(scaleX - 20, scaleTop - 10, 40, scaleHeight + 20, 10)
      ctx.fill()

      // Scale gradient (low to high density)
      const scaleGrad = ctx.createLinearGradient(0, scaleTop, 0, scaleBottom)
      scaleGrad.addColorStop(0, '#22c55e')
      scaleGrad.addColorStop(0.5, '#f59e0b')
      scaleGrad.addColorStop(1, '#ef4444')
      ctx.fillStyle = scaleGrad
      ctx.beginPath()
      ctx.roundRect(scaleX - 8, scaleTop, 16, scaleHeight, 8)
      ctx.fill()

      // Density marker
      const markerY = scaleTop + density * scaleHeight
      ctx.beginPath()
      ctx.arc(scaleX, markerY, 8, 0, Math.PI * 2)
      ctx.fillStyle = '#1e293b'
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.font = '10px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#64748b'
      ctx.fillText('Low', scaleX + 15, scaleTop + 5)
      ctx.fillText('High', scaleX + 15, scaleBottom + 5)
      ctx.fillText(`ρ = ${density.toFixed(2)}`, scaleX + 15, markerY + 4)

      // Water density line
      const waterLineY = scaleTop + waterDensity * scaleHeight
      ctx.beginPath()
      ctx.moveTo(scaleX - 15, waterLineY)
      ctx.lineTo(scaleX + 15, waterLineY)
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.font = '9px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#0284c7'
      ctx.fillText('Water', scaleX + 15, waterLineY + 3)

      // Title
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#0369a1'
      ctx.fillText('🚢 Float or Sink?', 15, 25)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [density, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
