export const SITE_NAME = "Pilgrammed Wiki";
export const SITE_SHORT_NAME = "Pilgrammed";
export const SITE_DOMAIN = "pilgrammedwiki.wiki";
export const HERO_IMAGE_PATH = "/images/hero.webp";
export const LOGO_PATH = "/android-chrome-512x512.png";

export const HOME_METADATA = {
  title: "Pilgrammed Wiki - Bosses, Weapons & Quests",
  description:
    "Pilgrammed Wiki covers beginner guides, weapons, builds, bosses, quests, maps, secrets, and upgrades for the Roblox open-world RPG by Phexonia Studios.",
  keywords: [
    "Pilgrammed",
    "Pilgrammed Wiki",
    "Roblox RPG",
    "Pilgrammed weapons",
    "Pilgrammed bosses",
    "Pilgrammed quests",
    "Pilgrammed builds",
  ],
} as const;

export const PILGRAMMED_LINKS = {
  game: "https://www.roblox.com/games/6735572261/Pilgrammed",
  group: "https://www.roblox.com/communities/3573124/Phexonia-Studios",
  discord: "https://discord.gg/pilgrammed",
  reddit: "https://www.reddit.com/r/RobloxPilgrammed/",
  trailer: "https://www.youtube.com/watch?v=ENdAdX0QgWc",
} as const;

export const SITE_EMAILS = {
  contact: `contact@${SITE_DOMAIN}`,
  support: `support@${SITE_DOMAIN}`,
  contribute: `contribute@${SITE_DOMAIN}`,
  partnerships: `partnerships@${SITE_DOMAIN}`,
  privacy: `privacy@${SITE_DOMAIN}`,
  legal: `legal@${SITE_DOMAIN}`,
  copyright: `copyright@${SITE_DOMAIN}`,
  dmca: `dmca@${SITE_DOMAIN}`,
} as const;

const CONTENT_TYPE_METADATA: Record<
  string,
  { title: string; description: string }
> = {
  guide: {
    title: "Pilgrammed Guides",
    description:
      "Browse Pilgrammed guides for beginner routing, progression checkpoints, fishing, quests, upgrades, and survival habits.",
  },
  build: {
    title: "Pilgrammed Builds",
    description:
      "Explore Pilgrammed builds, stat priorities, classes, reforges, techniques, and role-based loadouts for every playstyle.",
  },
  weapons: {
    title: "Pilgrammed Weapons",
    description:
      "Track Pilgrammed weapon rankings, early-game picks, signature gear, and damage options for melee, ranged, and magic setups.",
  },
  bosses: {
    title: "Pilgrammed Bosses",
    description:
      "Find Pilgrammed boss guides with arena routes, key mechanics, farming reasons, and reward-focused progression notes.",
  },
  items: {
    title: "Pilgrammed Items",
    description:
      "Review Pilgrammed armor, accessories, gems, utility items, and equipment upgrades that shape real combat and exploration choices.",
  },
  locations: {
    title: "Pilgrammed Locations",
    description:
      "Navigate Pilgrammed locations with region overviews, waypoint routes, farming landmarks, and travel shortcuts across the world map.",
  },
  codes: {
    title: "Pilgrammed Codes",
    description:
      "Check the Pilgrammed codes status page for redemption availability, watchlist notes, and the official places where new drops would appear first.",
  },
};

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${SITE_DOMAIN}`;
  return siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
}

export function absoluteUrl(path: string, baseUrl = getSiteUrl()) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${baseUrl}/`).toString();
}

export function getContentTypeMetadata(contentType: string) {
  return (
    CONTENT_TYPE_METADATA[contentType] || {
      title: `${SITE_SHORT_NAME} ${toTitleCase(contentType)}`,
      description: `Browse ${SITE_SHORT_NAME} ${contentType} content on ${SITE_NAME}.`,
    }
  );
}

export function sanitizeArticleHeading(
  value: string | undefined,
  fallback: string,
) {
  if (!value) {
    return fallback;
  }

  const sanitized = value
    .replace(/lucid blocks wiki/gi, SITE_NAME)
    .replace(/lucid blocks/gi, SITE_SHORT_NAME)
    .replace(/lucidblocks\.wiki/gi, SITE_DOMAIN)
    .trim();

  return sanitized || fallback;
}

export function buildArticleFallbackTitle(slug: string, contentType: string) {
  const lastSegment = slug.split("/").pop() || "";
  const cleaned = lastSegment
    .replace(/^(lucid-blocks-|pilgrammed-)/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return getContentTypeMetadata(contentType).title;
  }

  return toTitleCase(cleaned);
}

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}
