import { cache } from 'react'
import content from '@/content/site-content.json'
import { SiteContent } from '@/types/content'

// Using React cache to memoize content loading
export const getContent = cache((): SiteContent => {
  return content
})

// Specific content getters for different sections
export const getAboutContent = cache(() => {
  return getContent().about
})

export const getHeroContent = cache(() => {
  return getContent().hero
})

export const getSkillsContent = cache(() => {
  return getContent().skillConstellation
}) 