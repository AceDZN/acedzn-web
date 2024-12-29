'use client'

import { useEffect, useRef, useState } from 'react'
import content from '@/content/site-content.json'
import { Skill } from '@/types/content'

interface Star {
  x: number
  y: number
  skill: Skill
  category: string
  vx: number
  vy: number
  radius: number
  glowRadius: number
  glowIntensity: number
  angle: number
  orbitRadius: number
  orbitSpeed: number
}

const COLORS = {
  modernFrontend: '#4F46E5', // Indigo
  aiIntegration: '#9333EA', // Purple
  web3Development: '#EC4899', // Pink
  modernTooling: '#06B6D4', // Cyan
}

const MAX_CONNECTION_DISTANCE = 200
const GLOW_ANIMATION_SPEED = 0.05
const MIN_STAR_DISTANCE = 20
const MOUSE_INFLUENCE_RADIUS = 150
const MOUSE_INFLUENCE_STRENGTH = 0.2
const ORBIT_SPEED_RANGE = { min: 0.0002, max: 0.001 }

const calculateYearsOfExperience = (startYear: number): number => {
  const currentYear = new Date().getFullYear()
  return currentYear - startYear
}

const formatCategoryName = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim()
}

const SkillConstellation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const [hoveredStar, setHoveredStar] = useState<Star | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const animationFrameRef = useRef<number | null>(null)
  const mousePos = useRef({ x: 0, y: 0 })

  const initStars = () => {
    const newStars: Star[] = []
    // const centerX = dimensions.width / 2
    // const centerY = dimensions.height / 2

    Object.entries(content.skillConstellation.categories).forEach(([category, data], categoryIndex) => {
      const categoryAngleOffset = (categoryIndex / 4) * Math.PI * 2
      
      data.skills.forEach((skill, index) => {
        const radius = skill.size === 'large' ? 4 : skill.size === 'medium' ? 3 : 2
        const angle = categoryAngleOffset + (index / data.skills.length) * (Math.PI / 2)
        const orbitRadius = 100 + Math.random() * 150
        //const x = centerX + Math.cos(angle) * orbitRadius
        //const y = centerY + Math.sin(angle) * orbitRadius

        newStars.push({
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
            skill: skill as Skill,
            category,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            radius,
            glowRadius: radius + 4,
            glowIntensity: 0,
            angle,
            orbitRadius,
            orbitSpeed: ORBIT_SPEED_RANGE.min + Math.random() * (ORBIT_SPEED_RANGE.max - ORBIT_SPEED_RANGE.min),
        })
      })
    })
    starsRef.current = newStars
  }

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect()
        setDimensions({ width, height })
        canvasRef.current.width = width
        canvasRef.current.height = height
        initStars()
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [dimensions.width, dimensions.height])

  useEffect(() => {
    if (!canvasRef.current || starsRef.current.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const drawGlow = (star: Star, color: string) => {
      const gradient = ctx.createRadialGradient(
        star.x, star.y, star.radius,
        star.x, star.y, star.glowRadius + star.glowIntensity
      )
      gradient.addColorStop(0, `${color}99`)
      gradient.addColorStop(1, `${color}00`)
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.glowRadius + star.glowIntensity, 0, Math.PI * 2)
      ctx.fill()
    }

    const keepStarsApart = (stars: Star[]) => {
      stars.forEach((star1, i) => {
        stars.slice(i + 1).forEach(star2 => {
          const dx = star2.x - star1.x
          const dy = star2.y - star1.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < MIN_STAR_DISTANCE) {
            const angle = Math.atan2(dy, dx)
            const pushDistance = (MIN_STAR_DISTANCE - distance) / 2
            
            star1.x -= Math.cos(angle) * pushDistance
            star1.y -= Math.sin(angle) * pushDistance
            star2.x += Math.cos(angle) * pushDistance
            star2.y += Math.sin(angle) * pushDistance
          }
        })
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      const centerX = dimensions.width / 2
      const centerY = dimensions.height / 2

      // Update star positions and glow
      starsRef.current = starsRef.current.map((star) => {
        let { x, y, angle, orbitRadius, orbitSpeed, glowIntensity } = star

        // Natural orbital movement
        angle += orbitSpeed
        x = centerX + Math.cos(angle) * orbitRadius
        y = centerY + Math.sin(angle) * orbitRadius

        // Mouse influence
        const dx = mousePos.current.x - x
        const dy = mousePos.current.y - y
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy)

        if (distanceToMouse < MOUSE_INFLUENCE_RADIUS) {
          const influence = (1 - distanceToMouse / MOUSE_INFLUENCE_RADIUS) * MOUSE_INFLUENCE_STRENGTH
          orbitRadius += Math.sin(angle * 5) * influence
          orbitSpeed += (Math.random() - 0.5) * influence * 0.0001
        }

        // Keep within bounds
        orbitRadius = Math.max(50, Math.min(orbitRadius, Math.min(dimensions.width, dimensions.height) / 2 - 20))
        
        // Update glow
        const targetGlow = (hoveredStar === star || 
          (selectedCategory && selectedCategory === star.category)) ? 8 : 0
        glowIntensity += (targetGlow - glowIntensity) * GLOW_ANIMATION_SPEED

        return { ...star, x, y, angle, orbitRadius, orbitSpeed, glowIntensity }
      })

      // Keep stars apart
      keepStarsApart(starsRef.current)

      // Draw connections
      ctx.lineWidth = 0.5
      starsRef.current.forEach((star1) => {
        starsRef.current.forEach((star2) => {
          if (star1 === star2) return
          if (selectedCategory && (star1.category !== selectedCategory || star2.category !== selectedCategory)) return
          if (!selectedCategory && star1.category !== star2.category) return

          const dx = star1.x - star2.x
          const dy = star1.y - star2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < MAX_CONNECTION_DISTANCE) {
            const opacity = Math.pow(1 - distance / MAX_CONNECTION_DISTANCE, 2)
            ctx.beginPath()
            ctx.strokeStyle = `${COLORS[star1.category as keyof typeof COLORS]}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
            ctx.moveTo(star1.x, star1.y)
            ctx.lineTo(star2.x, star2.y)
            ctx.stroke()
          }
        })
      })

      // Draw stars and glows
      starsRef.current.forEach((star) => {
        const color = COLORS[star.category as keyof typeof COLORS]
        
        // Draw glow
        if (star.glowIntensity > 0.1) {
          drawGlow(star, color)
        }

        // Draw star
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [dimensions, hoveredStar, selectedCategory])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }

    const hoveredStar = starsRef.current.find((star) => {
      const dx = star.x - mousePos.current.x
      const dy = star.y - mousePos.current.y
      return Math.sqrt(dx * dx + dy * dy) < star.radius + 5
    })

    setHoveredStar(hoveredStar || null)
  }

  return (
    <section className="min-h-screen py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">{content.skillConstellation.title}</span>
          </h2>
          <p className="text-xl text-gray-400">{content.skillConstellation.subtitle}</p>
        </div>
        <div className="relative h-[600px] pixel-corners bg-gray-900/50 backdrop-blur-sm">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredStar(null)}
          />
          {hoveredStar && (
            <div
              className="absolute pointer-events-none bg-gray-900/90 text-white p-4 rounded-lg pixel-corners"
              style={{
                left: Math.min(dimensions.width - 200, hoveredStar.x + 20),
                top: Math.min(dimensions.height - 100, hoveredStar.y + 20),
              }}
            >
              <div className="font-bold">{hoveredStar.skill.name}</div>
              <div className="text-sm text-gray-400">
                Experience: {calculateYearsOfExperience(hoveredStar.skill.startYear)} years
              </div>
              <div className="text-sm text-gray-400">
                Proficiency: {hoveredStar.skill.level}%
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-8 mt-8">
          {Object.entries(COLORS).map(([category, color]) => (
            <button
              key={category}
              className={`flex items-center gap-2 transition-opacity duration-200 ${
                selectedCategory && selectedCategory !== category ? 'opacity-40' : 'opacity-100'
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-400">{formatCategoryName(category)}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SkillConstellation 