import { useRef, useEffect } from 'react'

interface CellStructureCanvasProps {
  selectedPart: string
  isPlaying: boolean
}

export default function CellStructureCanvas({ selectedPart, isPlaying }: CellStructureCanvasProps) {
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

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h)
      bg.addColorStop(0, '#ecfdf5')
      bg.addColorStop(1, '#d1fae5')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      const pulse = isPlaying ? Math.sin(Date.now() * 0.002) * 3 : 0

      // Cell membrane
      const cellRadius = Math.min(w, h) * 0.4 + pulse
      ctx.beginPath()
      ctx.arc(cx, cy, cellRadius, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)'
      ctx.fill()
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 4
      ctx.stroke()

      // Cytoplasm
      ctx.beginPath()
      ctx.arc(cx, cy, cellRadius - 5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.05)'
      ctx.fill()

      // Nucleus
      const nucleusRadius = cellRadius * 0.25
      ctx.beginPath()
      ctx.arc(cx, cy, nucleusRadius, 0, Math.PI * 2)
      ctx.fillStyle = selectedPart === 'nucleus' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.15)'
      ctx.fill()
      ctx.strokeStyle = '#7c3aed'
      ctx.lineWidth = 2
      ctx.stroke()

      // Nucleolus
      ctx.beginPath()
      ctx.arc(cx + 5, cy - 5, nucleusRadius * 0.3, 0, Math.PI * 2)
      ctx.fillStyle = '#7c3aed'
      ctx.fill()

      // Mitochondria
      const mitochondria = [
        { x: cx - cellRadius * 0.5, y: cy - cellRadius * 0.3, angle: 0.5 },
        { x: cx + cellRadius * 0.4, y: cy + cellRadius * 0.2, angle: -0.3 },
        { x: cx - cellRadius * 0.2, y: cy + cellRadius * 0.5, angle: 1.2 },
      ]
      mitochondria.forEach((m, i) => {
        ctx.save()
        ctx.translate(m.x, m.y)
        ctx.rotate(m.angle)
        ctx.beginPath()
        ctx.ellipse(0, 0, 15, 8, 0, 0, Math.PI * 2)
        ctx.fillStyle = selectedPart === 'mitochondria' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.2)'
        ctx.fill()
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 1
        ctx.stroke()
        // Inner folds
        ctx.beginPath()
        ctx.moveTo(-8, -3)
        ctx.lineTo(-8, 3)
        ctx.moveTo(0, -3)
        ctx.lineTo(0, 3)
        ctx.moveTo(8, -3)
        ctx.lineTo(8, 3)
        ctx.strokeStyle = '#dc2626'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.restore()
      })

      // Endoplasmic reticulum
      ctx.strokeStyle = selectedPart === 'er' ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.3)'
      ctx.lineWidth = 2
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2
        const startX = cx + Math.cos(angle) * (nucleusRadius + 10)
        const startY = cy + Math.sin(angle) * (nucleusRadius + 10)
        const endX = cx + Math.cos(angle) * (nucleusRadius + 40)
        const endY = cy + Math.sin(angle) * (nucleusRadius + 40)
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.quadraticCurveTo((startX + endX) / 2 + 10, (startY + endY) / 2, endX, endY)
        ctx.stroke()
      }

      // Ribosomes (small dots)
      ctx.fillStyle = '#f59e0b'
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2
        const dist = nucleusRadius + 20 + (i % 3) * 15
        const rx = cx + Math.cos(angle) * dist
        const ry = cy + Math.sin(angle) * dist
        ctx.beginPath()
        ctx.arc(rx, ry, 2, 0, Math.PI * 2)
        ctx.fill()
      }

      // Vacuole
      ctx.beginPath()
      ctx.arc(cx + cellRadius * 0.3, cy - cellRadius * 0.4, 20, 0, Math.PI * 2)
      ctx.fillStyle = selectedPart === 'vacuole' ? 'rgba(6, 182, 212, 0.4)' : 'rgba(6, 182, 212, 0.2)'
      ctx.fill()
      ctx.strokeStyle = '#0891b2'
      ctx.lineWidth = 1
      ctx.stroke()

      // Labels
      const labels = [
        { text: 'Nucleus', x: cx, y: cy, part: 'nucleus' },
        { text: 'Mitochondria', x: mitochondria[0].x, y: mitochondria[0].y - 15, part: 'mitochondria' },
        { text: 'ER', x: cx + nucleusRadius + 30, y: cy - 10, part: 'er' },
        { text: 'Vacuole', x: cx + cellRadius * 0.3, y: cy - cellRadius * 0.4 - 25, part: 'vacuole' },
        { text: 'Membrane', x: cx + cellRadius + 10, y: cy, part: 'membrane' },
      ]

      ctx.font = '10px Inter, sans-serif'
      ctx.textAlign = 'center'
      labels.forEach(label => {
        ctx.fillStyle = selectedPart === label.part ? '#1e293b' : '#64748b'
        ctx.fillText(label.text, label.x, label.y)
      })

      // Title
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillStyle = '#065f46'
      ctx.fillText('🔬 Animal Cell', 15, 25)

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(frameRef.current)
  }, [selectedPart, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
}
