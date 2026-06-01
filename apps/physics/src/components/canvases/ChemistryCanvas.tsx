import { useRef, useEffect } from 'react'

interface ChemistryCanvasProps {
  reaction: number
  isPlaying: boolean
}

export default function ChemistryCanvas({ reaction, isPlaying }: ChemistryCanvasProps) {
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
      bg.addColorStop(0, '#fef3c7')
      bg.addColorStop(1, '#fde68a')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      // Reaction stages
      const stages = [
        { label: 'Reactants', emoji: '🧪', x: w * 0.25, color: '#3b82f6' },
        { label: 'Breaking Bonds', emoji: '💥', x: w * 0.5, color: '#ef4444' },
        { label: 'Products', emoji: '✨', x: w * 0.75, color: '#22c55e' },
      ]

      // Draw connections
      for (let i = 0; i < stages.length - 1; i++) {
        const current = stages[i]
        const next = stages[i + 1]
        ctx.beginPath()
        ctx.moveTo(current.x + 30, h * 0.4)
        ctx.lineTo(next.x - 30, h * 0.4)
        ctx.strokeStyle = i <= reaction ? `${current.color}60` : '#cbd5e1'
        ctx.lineWidth = 4
        ctx.setLineDash([5, 5])
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Draw stages
      stages.forEach((s, i) => {
        const isActive = i <= reaction
        const isCurrent = i === reaction

        // Circle
        ctx.beginPath()
        ctx.arc(s.x, h * 0.4, 35, 0, Math.PI * 2)
        ctx.fillStyle = isActive ? `${s.color}20` : '#f1f5f9'
        ctx.fill()
        ctx.strokeStyle = isActive ? s.color : '#cbd5e1'
        ctx.lineWidth = isCurrent ? 4 : 2
        ctx.stroke()

        // Emoji
        ctx.font = '28px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(s.emoji, s.x, h * 0.4 + 10)

        // Label
        ctx.font = `bold 12px Inter, sans-serif`
        ctx.fillStyle = isActive ? s.color : '#94a3b8'
        ctx.fillText(s.label, s.x, h * 0.4 + 55)
      })

      // Atoms visualization
      const atoms = [
        { symbol: 'H', color: '#ef4444', x: w * 0.2, y: h * 0.6 },
        { symbol: 'H', color: '#ef4444', x: w * 0.25, y: h * 0.6 },
        { symbol: 'O', color: '#3b82f6', x: w * 0.35, y: h * 0.6 },
      ]

      if (reaction === 0) {
        // Reactants: H2 + O
        atoms.forEach((atom, i) => {
          ctx.beginPath()
          ctx.arc(atom.x, atom.y, 15, 0, Math.PI * 2)
          ctx.fillStyle = `${atom.color}30`
          ctx.fill()
          ctx.strokeStyle = atom.color
          ctx.lineWidth = 2
          ctx.stroke()

          ctx.font = 'bold 12px Inter, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillStyle = atom.color
          ctx.fillText(atom.symbol, atom.x, atom.y + 4)
        })

        // Bond between H atoms
        ctx.beginPath()
        ctx.moveTo(atoms[0].x + 15, atoms[0].y)
        ctx.lineTo(atoms[1].x - 15, atoms[1].y)
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.font = '11px Inter, sans-serif'
        ctx.fillStyle = '#64748b'
        ctx.fillText('H₂ + O → ?', w / 2, h * 0.8)
      } else if (reaction === 1) {
        // Breaking bonds
        const time = isPlaying ? Date.now() * 0.003 : 0
        atoms.forEach((atom, i) => {
          const offsetX = Math.sin(time + i) * 20
          const offsetY = Math.cos(time + i) * 15
          ctx.beginPath()
          ctx.arc(atom.x + offsetX, atom.y + offsetY, 15, 0, Math.PI * 2)
          ctx.fillStyle = `${atom.color}30`
          ctx.fill()
          ctx.strokeStyle = atom.color
          ctx.lineWidth = 2
          ctx.stroke()

          ctx.font = 'bold 12px Inter, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillStyle = atom.color
          ctx.fillText(atom.symbol, atom.x + offsetX, atom.y + offsetY + 4)
        })

        ctx.font = '11px Inter, sans-serif'
        ctx.fillStyle = '#ef4444'
        ctx.fillText('Bonds breaking...', w / 2, h * 0.8)
      } else {
        // Products: H2O
        const h1 = { x: w * 0.45, y: h * 0.55 }
        const o = { x: w * 0.5, y: h * 0.5 }
        const h2 = { x: w * 0.55, y: h * 0.55 }

        // Bonds
        ctx.beginPath()
        ctx.moveTo(h1.x, h1.y)
        ctx.lineTo(o.x, o.y)
        ctx.moveTo(h2.x, h2.y)
        ctx.lineTo(o.x, o.y)
        ctx.strokeStyle = '#64748b'
        ctx.lineWidth = 2
        ctx.stroke();
        [h1, o, h2].forEach((atom, i) => {
          const symbol = i === 1 ? 'O' : 'H'
          const color = i === 1 ? '#3b82f6' : '#ef4444'
          ctx.beginPath()
          ctx.arc(atom.x, atom.y, 15, 0, Math.PI * 2)
          ctx.fillStyle = `${color}30`
          ctx.fill()
          ctx.strokeStyle = color
          ctx.lineWidth = 2
          ctx.stroke()

          ctx.font = 'bold 12px Inter, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillStyle = color
          ctx.fillText(symbol, atom.x, atom.y + 4)
        })

        ctx.font = '11px Inter, sans-serif'
        ctx.fillStyle = '#22c55e'
        ctx.fillText('2H₂ + O₂ → 2H₂O ✓', w / 2, h * 0.8)
      }

      // Title
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#92400e'
      ctx.fillText('🧪 Chemical Reaction', 15, 25)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [reaction, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
