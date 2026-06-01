import { useRef, useEffect } from 'react'

interface LightShadowsCanvasProps {
  lightX: number
  objectX: number
  isPlaying: boolean
}

export default function LightShadowsCanvas({ lightX, objectX, isPlaying }: LightShadowsCanvasProps) {
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
    const groundY = h * 0.75
    const objectHeight = h * 0.4
    const objectWidth = 30

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY)
      skyGrad.addColorStop(0, '#fef3c7')
      skyGrad.addColorStop(1, '#fde68a')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, w, groundY)

      // Ground
      ctx.fillStyle = '#92400e'
      ctx.fillRect(0, groundY, w, h - groundY)

      // Light source (flashlight/sun)
      const lightY = h * 0.2
      const lightRadius = 20

      // Light glow
      const lightGlow = ctx.createRadialGradient(lightX, lightY, lightRadius, lightX, lightY, lightRadius * 4)
      lightGlow.addColorStop(0, 'rgba(251, 191, 36, 0.6)')
      lightGlow.addColorStop(0.5, 'rgba(251, 191, 36, 0.1)')
      lightGlow.addColorStop(1, 'rgba(251, 191, 36, 0)')
      ctx.fillStyle = lightGlow
      ctx.fillRect(lightX - lightRadius * 4, lightY - lightRadius * 4, lightRadius * 8, lightRadius * 8)

      // Light body
      ctx.beginPath()
      ctx.arc(lightX, lightY, lightRadius, 0, Math.PI * 2)
      const lightGrad = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, lightRadius)
      lightGrad.addColorStop(0, '#fef08a')
      lightGrad.addColorStop(1, '#f59e0b')
      ctx.fillStyle = lightGrad
      ctx.fill()

      ctx.font = 'bold 10px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#92400e'
      ctx.fillText('💡', lightX, lightY + 4)

      // Light rays
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)'
      ctx.lineWidth = 1
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + (isPlaying ? Date.now() * 0.001 : 0)
        ctx.beginPath()
        ctx.moveTo(lightX + Math.cos(angle) * lightRadius, lightY + Math.sin(angle) * lightRadius)
        ctx.lineTo(lightX + Math.cos(angle) * lightRadius * 3, lightY + Math.sin(angle) * lightRadius * 3)
        ctx.stroke()
      }

      // Object (person/tree)
      const objBottomY = groundY
      const objTopY = groundY - objectHeight

      // Object body
      ctx.fillStyle = '#1e293b'
      ctx.beginPath()
      ctx.roundRect(objectX - objectWidth / 2, objTopY, objectWidth, objectHeight, [8, 8, 0, 0])
      ctx.fill()

      // Object head
      ctx.beginPath()
      ctx.arc(objectX, objTopY - 10, 12, 0, Math.PI * 2)
      ctx.fillStyle = '#1e293b'
      ctx.fill()

      ctx.font = '10px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#475569'
      ctx.fillText('Object', objectX, objTopY - 25)

      // Shadow calculation
      const dx = objectX - lightX
      const dy = objBottomY - lightY
      const shadowLength = (objectHeight / dy) * dx
      const shadowEndX = objectX + shadowLength

      // Shadow
      ctx.beginPath()
      ctx.moveTo(objectX - objectWidth / 2, objBottomY)
      ctx.lineTo(shadowEndX, objBottomY)
      ctx.lineTo(shadowEndX + objectWidth / 2, objBottomY)
      ctx.lineTo(objectX + objectWidth / 2, objBottomY)
      ctx.closePath()
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fill()

      // Shadow gradient
      const shadowGrad = ctx.createLinearGradient(objectX, 0, shadowEndX, 0)
      shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.4)')
      shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.1)')
      ctx.fillStyle = shadowGrad
      ctx.fillRect(objectX - objectWidth / 2, objBottomY, Math.abs(shadowEndX - objectX) + objectWidth, 15)

      // Light rays to object edges
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])

      // Top ray
      ctx.beginPath()
      ctx.moveTo(lightX, lightY)
      ctx.lineTo(objectX, objTopY - 10)
      // Continue to shadow end
      const topRayDx = objectX - lightX
      const topRayDy = (objTopY - 10) - lightY
      const shadowTopEndX = objectX + (objectHeight / Math.abs(topRayDy)) * topRayDx
      ctx.lineTo(shadowTopEndX, groundY)
      ctx.stroke()

      ctx.setLineDash([])

      // Shadow length indicator
      const shadowIndicatorY = groundY + 25
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(objectX, shadowIndicatorY)
      ctx.lineTo(shadowEndX, shadowIndicatorY)
      ctx.stroke()

      // Arrow heads
      ctx.beginPath()
      ctx.moveTo(objectX, shadowIndicatorY - 5)
      ctx.lineTo(objectX, shadowIndicatorY + 5)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(shadowEndX, shadowIndicatorY - 5)
      ctx.lineTo(shadowEndX, shadowIndicatorY + 5)
      ctx.stroke()

      ctx.font = 'bold 11px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#ef4444'
      ctx.fillText(`Shadow: ${Math.round(Math.abs(shadowEndX - objectX))}px`, (objectX + shadowEndX) / 2, shadowIndicatorY + 18)

      // Info
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#92400e'
      ctx.fillText('🔦 Light & Shadows', 15, 25)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [lightX, objectX, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
