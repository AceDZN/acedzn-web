export type Social = {
  linkedin: string
  twitter: string
  twitter_handle: string
}

export type Metadata = {
  title: string
  description: string
  keywords: string[]
  author: string
  social: Social
}

export type Hero = {
  name: string
  tagline: string
  cta: {
    linkedin: string
    twitter: string
  }
}

export type Skill = {
  name: string
  level: number
  startYear: number
  size: 'large' | 'medium' | 'small'
}

export type SkillCategory = {
  name: string
  skills: Skill[]
}

export type About = {
  title: string
  description: string[]
  skills: {
    [key: string]: {
      title: string
      technologies: string
    }
  }
  pixelGame: {
    title: string
    subtitle: string
  }
}

export type SkillConstellation = {
  title: string
  subtitle: string
  categories: {
    [key: string]: SkillCategory
  }
}

export type SiteContent = {
  metadata: Metadata
  hero: Hero
  about: About
  skillConstellation: SkillConstellation
} 