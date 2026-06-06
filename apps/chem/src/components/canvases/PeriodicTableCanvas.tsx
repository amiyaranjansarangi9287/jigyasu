import { useRef, useEffect } from 'react'

interface PeriodicTableCanvasProps {
  selectedElement?: number
  isPlaying: boolean
}

export default function PeriodicTableCanvas({ selectedElement = 1, isPlaying }: PeriodicTableCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    let time = 0

    const elements = [
      { n: 1, sym: 'H', name: 'Hydrogen', mass: 1.008, cat: 'nonmetal', col: 1, row: 1 },
      { n: 2, sym: 'He', name: 'Helium', mass: 4.003, cat: 'noble', col: 18, row: 1 },
      { n: 3, sym: 'Li', name: 'Lithium', mass: 6.941, cat: 'metal', col: 1, row: 2 },
      { n: 4, sym: 'Be', name: 'Beryllium', mass: 9.012, cat: 'metal', col: 2, row: 2 },
      { n: 5, sym: 'B', name: 'Boron', mass: 10.81, cat: 'metalloid', col: 13, row: 2 },
      { n: 6, sym: 'C', name: 'Carbon', mass: 12.01, cat: 'nonmetal', col: 14, row: 2 },
      { n: 7, sym: 'N', name: 'Nitrogen', mass: 14.01, cat: 'nonmetal', col: 15, row: 2 },
      { n: 8, sym: 'O', name: 'Oxygen', mass: 16.00, cat: 'nonmetal', col: 16, row: 2 },
      { n: 9, sym: 'F', name: 'Fluorine', mass: 19.00, cat: 'nonmetal', col: 17, row: 2 },
      { n: 10, sym: 'Ne', name: 'Neon', mass: 20.18, cat: 'noble', col: 18, row: 2 },
      { n: 11, sym: 'Na', name: 'Sodium', mass: 22.99, cat: 'metal', col: 1, row: 3 },
      { n: 12, sym: 'Mg', name: 'Magnesium', mass: 24.31, cat: 'metal', col: 2, row: 3 },
      { n: 13, sym: 'Al', name: 'Aluminum', mass: 26.98, cat: 'metal', col: 13, row: 3 },
      { n: 14, sym: 'Si', name: 'Silicon', mass: 28.09, cat: 'metalloid', col: 14, row: 3 },
      { n: 15, sym: 'P', name: 'Phosphorus', mass: 30.97, cat: 'nonmetal', col: 15, row: 3 },
      { n: 16, sym: 'S', name: 'Sulfur', mass: 32.07, cat: 'nonmetal', col: 16, row: 3 },
      { n: 17, sym: 'Cl', name: 'Chlorine', mass: 35.45, cat: 'nonmetal', col: 17, row: 3 },
      { n: 18, sym: 'Ar', name: 'Argon', mass: 39.95, cat: 'noble', col: 18, row: 3 },
      { n: 19, sym: 'K', name: 'Potassium', mass: 39.10, cat: 'metal', col: 1, row: 4 },
      { n: 20, sym: 'Ca', name: 'Calcium', mass: 40.08, cat: 'metal', col: 2, row: 4 },
      { n: 26, sym: 'Fe', name: 'Iron', mass: 55.85, cat: 'metal', col: 8, row: 4 },
      { n: 29, sym: 'Cu', name: 'Copper', mass: 63.55, cat: 'metal', col: 11, row: 4 },
      { n: 30, sym: 'Zn', name: 'Zinc', mass: 65.38, cat: 'metal', col: 12, row: 4 },
      { n: 35, sym: 'Br', name: 'Bromine', mass: 79.90, cat: 'nonmetal', col: 17, row: 4 },
      { n: 36, sym: 'Kr', name: 'Krypton', mass: 83.80, cat: 'noble', col: 18, row: 4 },
      { n: 47, sym: 'Ag', name: 'Silver', mass: 107.9, cat: 'metal', col: 11, row: 5 },
      { n: 53, sym: 'I', name: 'Iodine', mass: 126.9, cat: 'nonmetal', col: 17, row: 5 },
      { n: 54, sym: 'Xe', name: 'Xenon', mass: 131.3, cat: 'noble', col: 18, row: 5 },
      { n: 79, sym: 'Au', name: 'Gold', mass: 197.0, cat: 'metal', col: 11, row: 6 },
      { n: 80, sym: 'Hg', name: 'Mercury', mass: 200.6, cat: 'metal', col: 12, row: 6 },
    ]

    const catColors: Record<string, string> = {
      metal: '#3b82f6',
      nonmetal: '#10b981',
      metalloid: '#f59e0b',
      noble: '#8b5cf6',
    }

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

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio
      const h = canvas.height / window.devicePixelRatio
      ctx.clearRect(0, 0, w, h)

      if (isPlaying) time += 0.02

      const cellW = Math.min(w / 20, 40)
      const cellH = Math.min(h / 8, 50)
      const offsetX = (w - cellW * 18) / 2
      const offsetY = (h - cellH * 7) / 2

      elements.forEach(el => {
        const x = offsetX + (el.col - 1) * cellW
        const y = offsetY + (el.row - 1) * cellH
        const isSelected = el.n === selectedElement
        const color = catColors[el.cat] || '#64748b'

        ctx.fillStyle = isSelected ? color : `${color}22`
        ctx.strokeStyle = isSelected ? '#fff' : `${color}66`
        ctx.lineWidth = isSelected ? 2 : 1

        const pulse = isSelected ? Math.sin(time * 3) * 0.15 + 0.85 : 1
        const cw = cellW * 0.9 * pulse
        const ch = cellH * 0.9 * pulse
        const cx = x + (cellW - cw) / 2
        const cy = y + (cellH - ch) / 2

        ctx.beginPath()
        ctx.roundRect(cx, cy, cw, ch, 4)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = isSelected ? '#fff' : color
        ctx.font = `bold ${Math.min(cellW * 0.4, 16)}px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(el.sym, x + cellW / 2, y + cellH / 2 + 4)

        ctx.fillStyle = isSelected ? '#ffffffcc' : '#94a3b8'
        ctx.font = `${Math.min(cellW * 0.25, 10)}px sans-serif`
        ctx.fillText(el.n.toString(), x + cellW / 2, y + cellH * 0.3)
      })

      const sel = elements.find(e => e.n === selectedElement)
      if (sel) {
        const infoY = offsetY + 7 * cellH + 10
        ctx.fillStyle = '#1e293b'
        ctx.font = 'bold 18px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`${sel.n}. ${sel.name} (${sel.sym})`, w / 2, infoY + 20)
        ctx.fillStyle = '#64748b'
        ctx.font = '14px sans-serif'
        ctx.fillText(`Atomic Mass: ${sel.mass} | Category: ${sel.cat}`, w / 2, infoY + 42)
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [selectedElement, isPlaying])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
