'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import content from '@/content/site-content.json'

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Particle system
    const particles: { x: number; y: number; dx: number; dy: number; size: number; color: string }[] = []
    const particleCount = 80
    const colors = ['#4F46E5', '#7C3AED', '#EC4899']

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.dx
        particle.y += particle.dy

        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Draw connecting lines
        particles.forEach((p2) => {
          const dx = particle.x - p2.x
          const dy = particle.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(100, 100, 255, ${0.2 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-10"
        style={{ filter: 'blur(1px)' }}
      />
      <div className="text-center z-10 p-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="gradient-text">{content.hero.name}</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">
          {content.hero.tagline}
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href={content.metadata.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-corners bg-blue-600 hover:bg-blue-700 px-6 py-2 transition-colors"
          >
            {content.hero.cta.linkedin}
          </Link>
          <Link
            href={content.metadata.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-corners bg-gray-800 hover:bg-gray-700 px-6 py-2 transition-colors"
          >
            {content.hero.cta.twitter}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeroSection 