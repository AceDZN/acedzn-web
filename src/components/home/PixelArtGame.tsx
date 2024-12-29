'use client'

import { useEffect, useRef, useState } from 'react'

type PixelGameContent = {
  title: string
  subtitle: string
}

interface PixelArtGameProps {
  pixelGameContent: PixelGameContent
}

const GRID_SIZE = 16
const PIXEL_SIZE = 20
const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#ffffff', '#000000']

const PixelArtGame = ({ pixelGameContent }: PixelArtGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [isDrawing, setIsDrawing] = useState(false)
  const [grid, setGrid] = useState<string[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('#000000'))
  )

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, GRID_SIZE * PIXEL_SIZE, GRID_SIZE * PIXEL_SIZE)

    // Draw pixels
    grid.forEach((row, y) => {
      row.forEach((color, x) => {
        ctx.fillStyle = color
        ctx.fillRect(
          x * PIXEL_SIZE,
          y * PIXEL_SIZE,
          PIXEL_SIZE - 1,
          PIXEL_SIZE - 1
        )
      })
    })
  }

  const getPixelCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE)
    const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE)

    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
      return { x, y }
    }
    return null
  }

  const drawPixel = (x: number, y: number) => {
    const newGrid = [...grid]
    newGrid[y][x] = selectedColor
    setGrid(newGrid)

    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) drawGrid(ctx)
  }

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const coords = getPixelCoords(e)
    if (coords) {
      drawPixel(coords.x, coords.y)
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getPixelCoords(e)
    if (coords) {
      drawPixel(coords.x, coords.y)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    drawGrid(ctx)
  }, [grid])

  return (
    <div className="pixel-corners bg-gray-900 p-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold mb-2">{pixelGameContent.title}</h3>
        <p className="text-sm text-gray-400">{pixelGameContent.subtitle}</p>
      </div>
      <div className="flex gap-2 mb-4">
        {COLORS.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full ${
              selectedColor === color ? 'ring-2 ring-white' : ''
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          />
        ))}
      </div>
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * PIXEL_SIZE}
        height={GRID_SIZE * PIXEL_SIZE}
        className="pixel-corners bg-gray-800"
        onMouseDown={(e) => {
          setIsDrawing(true)
          handleClick(e)
        }}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
        onMouseMove={handleDraw}
        onClick={handleClick}
      />
    </div>
  )
}

export default PixelArtGame 