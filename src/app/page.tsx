import HeroSection from '@/components/home/HeroSection'
import AboutSection from '@/components/home/AboutSection'
import SkillConstellation from '@/components/home/SkillConstellation'
import ContactSection from '@/components/home/ContactSection'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SkillConstellation />
      <ContactSection />
    </main>
  )
}
