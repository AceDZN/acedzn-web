'use client'

import { useState, useRef, useEffect } from 'react'
import { animate, spring } from 'motion'

interface FormData {
  name: string
  email: string
  message: string
}

const INITIAL_FORM_STATE: FormData = {
  name: '',
  email: '',
  message: '',
}

const ContactSection = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState<keyof FormData | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const formFieldsRef = {
    name: useRef<HTMLDivElement>(null),
    email: useRef<HTMLDivElement>(null),
    message: useRef<HTMLDivElement>(null),
  }
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number }>>([])

  const initParticles = () => {
    if (!canvasRef.current) return
    const width = canvasRef.current.width / window.devicePixelRatio
    const height = canvasRef.current.height / window.devicePixelRatio
    particlesRef.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }))
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateCanvasSize = () => {
      const section = sectionRef.current
      if (!section) return

      const { width, height } = section.getBoundingClientRect()
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
    }

    const resizeObserver = new ResizeObserver(updateCanvasSize)
    if (sectionRef.current) {
      resizeObserver.observe(sectionRef.current)
    }

    updateCanvasSize()
    initParticles()

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      if (!ctx || !canvas) return

      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, width, height)

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > width) particle.vx *= -1
        if (particle.y < 0 || particle.y > height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(100, 100, 255, 0.5)'
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  useEffect(() => {
    // Handle field focus animations
    if (focusedField && formFieldsRef[focusedField]?.current) {
      animate(
        formFieldsRef[focusedField].current,
        { scale: 1.02 },
        { 
          type: spring,
          stiffness: 300,
          damping: 15
        }
      )
    } else {
      Object.values(formFieldsRef).forEach(ref => {
        if (ref.current) {
          animate(
            ref.current,
            { scale: 1 },
            { 
              type: spring,
              stiffness: 300,
              damping: 15
            }
          )
        }
      })
    }
  }, [focusedField])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (submitButtonRef.current) {
      animate(
        submitButtonRef.current,
        { scale: 0.95 },
        { duration: 0.1 }
      ).then(() => {
        animate(
          submitButtonRef.current!,
          { scale: 1 },
          { 
            type: spring,
            stiffness: 400,
            damping: 10
          }
        )
      })
    }

    // Here you would typically send the form data to your backend
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Reset form
    setFormData(INITIAL_FORM_STATE)
    setIsSubmitting(false)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <section ref={sectionRef} className="min-h-screen py-20 px-4 relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-10"
      />
      <div className="max-w-4xl mx-auto">
        <div ref={titleRef} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Let's Connect</span>
          </h2>
          <p className="text-xl text-gray-400">
            Have a project in mind? Let's create something amazing together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="pixel-corners bg-gray-800/50 backdrop-blur-sm p-6">
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <div className="space-y-4">
                <a
                  href="https://linkedin.com/in/alexsindalovsky"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    in
                  </div>
                  <span>Connect on LinkedIn</span>
                </a>
                <a
                  href="https://x.com/acedzn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                    𝕏
                  </div>
                  <span>Follow on X/Twitter</span>
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div
              ref={formFieldsRef.name}
              className={`relative pixel-corners ${
                focusedField === 'name' ? 'bg-gray-800/80' : 'bg-gray-800/50'
              } backdrop-blur-sm`}
            >
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="Your Name"
                className="w-full bg-transparent p-4 outline-none text-white"
                required
              />
            </div>

            <div
              ref={formFieldsRef.email}
              className={`relative pixel-corners ${
                focusedField === 'email' ? 'bg-gray-800/80' : 'bg-gray-800/50'
              } backdrop-blur-sm`}
            >
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="Your Email"
                className="w-full bg-transparent p-4 outline-none text-white"
                required
              />
            </div>

            <div
              ref={formFieldsRef.message}
              className={`relative pixel-corners ${
                focusedField === 'message' ? 'bg-gray-800/80' : 'bg-gray-800/50'
              } backdrop-blur-sm`}
            >
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                placeholder="Your Message"
                className="w-full bg-transparent p-4 outline-none text-white min-h-[150px] resize-none"
                required
              />
            </div>

            <button
              ref={submitButtonRef}
              type="submit"
              disabled={isSubmitting}
              className="w-full pixel-corners bg-blue-600 hover:bg-blue-700 p-4 text-white transition-colors relative overflow-hidden"
              onMouseEnter={() => {
                if (submitButtonRef.current) {
                  animate(
                    submitButtonRef.current,
                    { scale: 1.02 },
                    { type: spring, stiffness: 300, damping: 15 }
                  )
                }
              }}
              onMouseLeave={() => {
                if (submitButtonRef.current) {
                  animate(
                    submitButtonRef.current,
                    { scale: 1 },
                    { type: spring, stiffness: 300, damping: 15 }
                  )
                }
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⟳</span> Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ContactSection 