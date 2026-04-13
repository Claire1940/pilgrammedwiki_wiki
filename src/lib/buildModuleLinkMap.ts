import { getAllContent, CONTENT_TYPES } from "@/lib/content";
import type { Language, ContentItem } from "@/lib/content";

export interface ArticleLink {
  url: string;
  title: string;
}

export type ModuleLinkMap = Record<string, ArticleLink | null>;

interface ArticleWithType extends ContentItem {
  contentType: string;
}

const MODULE_PREFERRED_MATCHES: Record<
  string,
  { contentType: string; slug: string }
> = {
  pilgrammedBeginnerGuide: { contentType: "guide", slug: "pilgrammed-guide" },
};

// Module sub-field mapping: moduleKey -> { field, nameKey }
const MODULE_FIELDS: Record<string, { field: string; nameKey: string }> = {
  pilgrammedCodes: { field: "items", nameKey: "name" },
  pilgrammedBeginnerGuide: { field: "items", nameKey: "title" },
  pilgrammedBestBuilds: { field: "items", nameKey: "name" },
  pilgrammedWeaponTierList: { field: "items", nameKey: "title" },
  pilgrammedBestWeapons: { field: "items", nameKey: "weapon" },
  pilgrammedWindUpdateNotes: { field: "items", nameKey: "section" },
  pilgrammedReforgeGuide: { field: "items", nameKey: "target" },
  pilgrammedSoulLevelGuide: { field: "items", nameKey: "heading" },
  pilgrammedSkillTreeGuide: { field: "items", nameKey: "title" },
  pilgrammedStatsGuide: { field: "items", nameKey: "stat" },
  pilgrammedBossGuide: { field: "items", nameKey: "title" },
  pilgrammedBossLocations: { field: "items", nameKey: "boss" },
  pilgrammedUpgradesGuide: { field: "items", nameKey: "upgrade" },
  pilgrammedProgressionGuide: { field: "items", nameKey: "focus" },
  pilgrammedFishingGuide: { field: "items", nameKey: "name" },
  pilgrammedArmorGuide: { field: "items", nameKey: "armor" },
};

// Extra semantic keywords per module to boost matching for h2 titles
// These supplement the module title text when matching against articles
const MODULE_EXTRA_KEYWORDS: Record<string, string[]> = {
  pilgrammedCodes: [
    "redeem code",
    "active code",
    "expired code",
    "gift reward",
  ],
  pilgrammedBeginnerGuide: [
    "beginner walkthrough",
    "combat basics",
    "crafting bronze",
    "old sword",
    "thief king",
    "skill points",
  ],
  pilgrammedBestBuilds: [
    "loadout",
    "meta",
    "scythe",
    "artillery",
    "gear",
    "classes",
  ],
  pilgrammedWeaponTierList: [
    "weapon tier list",
    "gear ranked",
    "s tier",
    "a tier",
    "meta",
    "ranked",
  ],
  pilgrammedBestWeapons: [
    "best weapons",
    "scrap lance",
    "bone claws",
    "black stiletto",
    "air gun",
    "haunted scythe",
  ],
  pilgrammedWindUpdateNotes: [
    "new update",
    "latest update",
    "latest patch",
    "update guide",
    "patch notes",
    "version",
  ],
  pilgrammedReforgeGuide: [
    "reforge",
    "legendary",
    "wonderful",
    "magic token",
    "gear stats",
    "gems",
  ],
  pilgrammedSoulLevelGuide: [
    "leveling",
    "max level",
    "rebirth",
    "fragments",
    "progression",
    "soul levels",
  ],
  pilgrammedSkillTreeGuide: [
    "classes",
    "archetype",
    "build packages",
    "melee",
    "mage",
    "techniques",
  ],
  pilgrammedStatsGuide: [
    "stats",
    "damage reduction",
    "strength",
    "dexterity",
    "intellect",
    "agility",
  ],
  pilgrammedBossGuide: [
    "major encounters",
    "danger points",
    "progression checks",
    "loot loops",
    "fight notes",
  ],
  pilgrammedBossLocations: [
    "waypoint",
    "mirror",
    "landmark route",
    "fast travel",
    "travel hints",
    "spawn method",
  ],
  pilgrammedUpgradesGuide: [
    "upgrades",
    "dash",
    "climb",
    "jump enhancement",
    "lets fly",
    "movement",
  ],
  pilgrammedProgressionGuide: [
    "progression",
    "quest guide",
    "quests in order",
    "leveling",
    "roadmap",
    "midgame",
  ],
  pilgrammedFishingGuide: [
    "fishing",
    "jared",
    "rod",
    "gold",
    "bait",
    "tailfish",
  ],
  pilgrammedArmorGuide: [
    "armor",
    "gear guide",
    "viking",
    "patchwork",
    "pirate captain",
    "night count",
  ],
};

const FILLER_WORDS = [
  "pilgrammed",
  "2026",
  "2025",
  "complete",
  "the",
  "and",
  "for",
  "how",
  "with",
  "our",
  "this",
  "your",
  "all",
  "from",
  "learn",
  "master",
  "guide",
  "best",
  "current",
  "update",
  "notes",
  "status",
  "start",
  "after",
  "wind",
  "right",
  "now",
  "boss",
  "locations",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSignificantTokens(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((w) => w.length > 2 && !FILLER_WORDS.includes(w));
}

function buildArticleUrl(article: ArticleWithType, locale: Language): string {
  const path = `/${article.contentType}/${article.slug}`;
  return locale === "en" ? path : `/${locale}${path}`;
}

function findPreferredMatch(
  moduleKey: string,
  articles: ArticleWithType[],
  locale: Language,
): ArticleLink | null {
  const preferred = MODULE_PREFERRED_MATCHES[moduleKey];
  if (!preferred) {
    return null;
  }

  const article = articles.find(
    (item) =>
      item.contentType === preferred.contentType &&
      item.slug === preferred.slug,
  );

  if (!article) {
    return null;
  }

  return {
    url: buildArticleUrl(article, locale),
    title: article.frontmatter.title,
  };
}

function matchScore(
  queryText: string,
  article: ArticleWithType,
  extraKeywords?: string[],
): number {
  const normalizedQuery = normalize(queryText);
  const normalizedTitle = normalize(article.frontmatter.title);
  const normalizedDesc = normalize(article.frontmatter.description || "");
  const normalizedSlug = article.slug.replace(/-/g, " ").toLowerCase();

  let score = 0;

  // Exact phrase match in title (stripped of the theme name)
  const strippedQuery = normalizedQuery.replace(/pilgrammed\s*/g, "").trim();
  const strippedTitle = normalizedTitle.replace(/pilgrammed\s*/g, "").trim();
  if (strippedQuery.length > 3 && strippedTitle.includes(strippedQuery)) {
    score += 100;
  }

  // Token overlap from query text
  const queryTokens = getSignificantTokens(queryText);
  for (const token of queryTokens) {
    if (normalizedTitle.includes(token)) score += 20;
    if (normalizedDesc.includes(token)) score += 5;
    if (normalizedSlug.includes(token)) score += 15;
  }

  // Extra keywords scoring (for module h2 titles)
  if (extraKeywords) {
    for (const kw of extraKeywords) {
      const normalizedKw = normalize(kw);
      if (normalizedTitle.includes(normalizedKw)) score += 15;
      if (normalizedDesc.includes(normalizedKw)) score += 5;
      if (normalizedSlug.includes(normalizedKw)) score += 10;
    }
  }

  return score;
}

function findBestMatch(
  queryText: string,
  articles: ArticleWithType[],
  locale: Language,
  extraKeywords?: string[],
  threshold = 20,
): ArticleLink | null {
  let bestScore = 0;
  let bestArticle: ArticleWithType | null = null;

  for (const article of articles) {
    const score = matchScore(queryText, article, extraKeywords);
    if (score > bestScore) {
      bestScore = score;
      bestArticle = article;
    }
  }

  if (bestScore >= threshold && bestArticle) {
    return {
      url: buildArticleUrl(bestArticle, locale),
      title: bestArticle.frontmatter.title,
    };
  }

  return null;
}

export async function buildModuleLinkMap(
  locale: Language,
): Promise<ModuleLinkMap> {
  // 1. Load all articles across all content types
  const allArticles: ArticleWithType[] = [];
  for (const contentType of CONTENT_TYPES) {
    const items = await getAllContent(contentType, locale);
    for (const item of items) {
      allArticles.push({ ...item, contentType });
    }
  }

  // 2. Load module data from en.json (use English for keyword matching)
  const enMessages = (await import("../locales/en.json")).default as any;

  const linkMap: ModuleLinkMap = {};

  // 3. For each module, match h2 title and sub-items
  for (const [moduleKey, fieldConfig] of Object.entries(MODULE_FIELDS)) {
    const moduleData = enMessages.modules?.[moduleKey];
    if (!moduleData) continue;

    // Match module h2 title (use extra keywords + lower threshold for broader matching)
    const moduleTitle = moduleData.title as string;
    const preferredMatch = findPreferredMatch(moduleKey, allArticles, locale);
    if (preferredMatch) {
      linkMap[moduleKey] = preferredMatch;
    } else if (moduleTitle) {
      const extraKw = MODULE_EXTRA_KEYWORDS[moduleKey] || [];
      linkMap[moduleKey] = findBestMatch(
        moduleTitle,
        allArticles,
        locale,
        extraKw,
        15,
      );
    }

    // Match sub-items
    const subItems = moduleData[fieldConfig.field] as any[];
    if (Array.isArray(subItems)) {
      for (let i = 0; i < subItems.length; i++) {
        const itemName = subItems[i]?.[fieldConfig.nameKey] as string;
        if (itemName) {
          const key = `${moduleKey}::${fieldConfig.field}::${i}`;
          linkMap[key] = findBestMatch(itemName, allArticles, locale);
        }
      }
    }
  }

  return linkMap;
}
