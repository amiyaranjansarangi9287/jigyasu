import { useRef, useEffect } from 'react'

interface AtomsCanvasProps {
  protons: number
  electrons: number
  isPlaying: boolean
}

export default function AtomsCanvas({ protons, electrons, isPlaying }: AtomsCanvasProps) {
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
    const cx = w / 2
    const cy = h / 2

    const elementNames = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar']
    const elementName = elementNames[protons - 1] || '?'

    // Calculate electron shells
    const shells: number[] = []
    let remaining = electrons
    const maxPerShell = [2, 8, 8, 18]
    for (const max of maxPerShell) {
      if (remaining <= 0) break
      shells.push(Math.min(remaining, max))
      remaining -= max
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Background
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.5)
      bg.addColorStop(0, '#1e293b')
      bg.addColorStop(1, '#0f172a')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Electron shells (orbits)
      shells.forEach((count, shellIndex) => {
        const radius = 50 + shellIndex * 45

        // Orbit path
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Electrons
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + (isPlaying ? Date.now() * 0.001 * (1 + shellIndex * 0.3) : 0)
          const ex = cx + Math.cos(angle) * radius
          const ey = cy + Math.sin(angle) * radius

          // Electron glow
          ctx.beginPath()
          ctx.arc(ex, ey, 6, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(56, 189, 248, 0.3)'
          ctx.fill()

          // Electron
          ctx.beginPath()
          ctx.arc(ex, ey, 3, 0, Math.PI * 2)
          ctx.fillStyle = '#38bdf8'
          ctx.fill()
        }
      })

      // Nucleus
      const nucleusRadius = 12 + protons * 0.5
      const nucleusGlow = ctx.createRadialGradient(cx, cy, nucleusRadius * 0.5, cx, cy, nucleusRadius * 2)
      nucleusGlow.addColorStop(0, 'rgba(239, 68, 68, 0.4)')
      nucleusGlow.addColorStop(1, 'rgba(239, 68, 68, 0)')
      ctx.fillStyle = nucleusGlow
      ctx.fillRect(cx - nucleusRadius * 2, cy - nucleusRadius * 2, nucleusRadius * 4, nucleusRadius * 4)

      // Protons (red) and neutrons (gray) in nucleus
      const neutrons = Math.max(protons, Math.round(protons * 1.2))
      const totalNucleons = protons + neutrons
      const nucleonRadius = Math.max(2, nucleusRadius / Math.sqrt(totalNucleons) * 1.5)

      for (let i = 0; i < totalNucleons; i++) {
        const angle = (i / totalNucleons) * Math.PI * 2
        const dist = Math.sqrt(i / totalNucleons) * nucleusRadius * 0.7
        const nx = cx + Math.cos(angle + i * 0.5) * dist
        const ny = cy + Math.sin(angle + i * 0.5) * dist

        ctx.beginPath()
        ctx.arc(nx, ny, nucleonRadius, 0, Math.PI * 2)
        ctx.fillStyle = i < protons ? '#ef4444' : '#64748b'
        ctx.fill()
        ctx.strokeStyle = i < protons ? '#dc2626' : '#475569'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Labels
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#f8fafc'
      ctx.fillText(elementName, cx, cy + 5)

      // Info panel
      ctx.font = '11px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText(`Protons: ${protons}`, 15, 25)
      ctx.fillText(`Neutrons: ${neutrons}`, 15, 40)
      ctx.fillText(`Electrons: ${electrons}`, 15, 55)
      ctx.fillText(`Shells: ${shells.length}`, 15, 70)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [protons, electrons, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
