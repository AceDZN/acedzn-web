import PixelArtGame from './PixelArtGame'
import { Suspense } from 'react'
import { getAboutContent } from '@/utils/content'

const AboutSection = async () => {
  const aboutContent = await getAboutContent()
  
  return (
    <section className="min-h-screen py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="gradient-text">{aboutContent.title}</span>
            </h2>
            <div className="space-y-4 text-gray-300">
              {aboutContent.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {Object.entries(aboutContent.skills).map(([key, skill]) => (
                  <div key={key} className="pixel-corners bg-gray-800 p-4">
                    <h3 className="font-bold mb-2">{skill.title}</h3>
                    <p className="text-sm text-gray-400">{skill.technologies}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Suspense fallback={<div className="animate-pulse bg-gray-800 w-full h-96 rounded-lg" />}>
              <PixelArtGame pixelGameContent={aboutContent.pixelGame} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection 