'use client'

import { useEffect, useRef, useState } from 'react'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight
      const scrolled = window.scrollY > heroHeight * 0.8
      
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isScrolled])

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/25 backdrop-blur-md border-b border-blue-500/20 opacity-100 translate-y-0'
          : 'bg-transparent border-b border-transparent opacity-0 -translate-y-5'
      }`}
      style={{
        boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className={`transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-xl font-bold gradient-text">Alex Sindalovsky</span>
        </div>
        
        <nav className="hidden md:block">
          {/* Future navigation links will go here */}
          <div className="space-x-6">
            {/* Placeholder for future links */}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header 