export const SITE_NAME = 'Pilgrammed Wiki'
export const SITE_SHORT_NAME = 'Pilgrammed'
export const SITE_DOMAIN = 'pilgrammedwiki.wiki'
export const HERO_IMAGE_PATH = '/images/hero.webp'
export const LOGO_PATH = '/android-chrome-512x512.png'

export const HOME_METADATA = {
  title: 'Pilgrammed Wiki - Bosses, Weapons & Quests',
  description:
    'Pilgrammed Wiki covers beginner guides, weapons, builds, bosses, quests, maps, secrets, and upgrades for the Roblox open-world RPG by Phexonia Studios.',
  keywords: [
    'Pilgrammed',
    'Pilgrammed Wiki',
    'Roblox RPG',
    'Pilgrammed weapons',
    'Pilgrammed bosses',
    'Pilgrammed quests',
    'Pilgrammed builds',
  ],
} as const

export const PILGRAMMED_LINKS = {
  game: 'https://www.roblox.com/games/6735572261/Pilgrammed',
  group: 'https://www.roblox.com/communities/3573124/Phexonia-Studios',
  discord: 'https://discord.gg/pilgrammed',
  reddit: 'https://www.reddit.com/r/RobloxPilgrammed/',
  trailer: 'https://www.youtube.com/watch?v=ENdAdX0QgWc',
} as const

export const SITE_EMAILS = {
  contact: `contact@${SITE_DOMAIN}`,
  support: `support@${SITE_DOMAIN}`,
  contribute: `contribute@${SITE_DOMAIN}`,
  partnerships: `partnerships@${SITE_DOMAIN}`,
  privacy: `privacy@${SITE_DOMAIN}`,
  legal: `legal@${SITE_DOMAIN}`,
  copyright: `copyright@${SITE_DOMAIN}`,
  dmca: `dmca@${SITE_DOMAIN}`,
} as const

const CONTENT_TYPE_METADATA: Record<string, { title: string; description: string }> = {
  guides: {
    title: 'Pilgrammed Guides',
    description:
      'Browse Pilgrammed guides covering beginner progression, leveling routes, quest flow, and early-game survival.',
  },
  crafting: {
    title: 'Pilgrammed Builds',
    description:
      'Explore Pilgrammed build ideas, stat priorities, combat loadouts, and progression paths for different playstyles.',
  },
  items: {
    title: 'Pilgrammed Weapons & Items',
    description:
      'Find Pilgrammed weapons, utility items, equipment notes, and combat gear references for every stage of progression.',
  },
  biomes: {
    title: 'Pilgrammed Map & Locations',
    description:
      'Track Pilgrammed regions, landmarks, boss areas, and location-specific tips for exploration and farming.',
  },
  building: {
    title: 'Pilgrammed Quests & Progression',
    description:
      'Follow Pilgrammed progression checkpoints, unlock routes, and quest-related reference material in one place.',
  },
  support: {
    title: 'Pilgrammed Help & FAQ',
    description:
      'Get Pilgrammed troubleshooting tips, platform answers, and community help resources for common questions.',
  },
}

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${SITE_DOMAIN}`
  return siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl
}

export function absoluteUrl(path: string, baseUrl = getSiteUrl()) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return new URL(normalizedPath, `${baseUrl}/`).toString()
}

export function getContentTypeMetadata(contentType: string) {
  return (
    CONTENT_TYPE_METADATA[contentType] || {
      title: `${SITE_SHORT_NAME} ${toTitleCase(contentType)}`,
      description: `Browse ${SITE_SHORT_NAME} ${contentType} content on ${SITE_NAME}.`,
    }
  )
}

export function sanitizeArticleHeading(value: string | undefined, fallback: string) {
  if (!value) {
    return fallback
  }

  const sanitized = value
    .replace(/lucid blocks wiki/gi, SITE_NAME)
    .replace(/lucid blocks/gi, SITE_SHORT_NAME)
    .replace(/lucidblocks\.wiki/gi, SITE_DOMAIN)
    .trim()

  return sanitized || fallback
}

export function buildArticleFallbackTitle(slug: string, contentType: string) {
  const lastSegment = slug.split('/').pop() || ''
  const cleaned = lastSegment
    .replace(/^(lucid-blocks-|pilgrammed-)/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!cleaned) {
    return getContentTypeMetadata(contentType).title
  }

  return toTitleCase(cleaned)
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase())
}
