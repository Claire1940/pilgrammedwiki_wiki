import Link from 'next/link'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'
import {
  HERO_IMAGE_PATH,
  HOME_METADATA,
  PILGRAMMED_LINKS,
  SITE_EMAILS,
  SITE_NAME,
  SITE_SHORT_NAME,
  absoluteUrl,
  getSiteUrl,
} from '@/lib/site-config'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = getSiteUrl()
  const path = '/about'
  const heroImageUrl = absoluteUrl(HERO_IMAGE_PATH, siteUrl)

  return {
    title: `About ${SITE_NAME}`,
    description:
      'Learn about Pilgrammed Wiki, an unofficial fan-made resource focused on Pilgrammed weapons, bosses, quests, maps, builds, and progression guides.',
    keywords: [
      'about Pilgrammed Wiki',
      'Pilgrammed community wiki',
      'Pilgrammed guides',
      'Roblox game resource',
    ],
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale,
      url: locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`,
      siteName: SITE_NAME,
      title: `About ${SITE_NAME}`,
      description: HOME_METADATA.description,
      images: [
        {
          url: heroImageUrl,
          width: 1920,
          height: 1080,
          alt: 'Pilgrammed Wiki hero image',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `About ${SITE_NAME}`,
      description: HOME_METADATA.description,
      images: [heroImageUrl],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About {SITE_NAME}
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            An unofficial fan-made knowledge base for {SITE_SHORT_NAME}
          </p>
          <p className="text-slate-400 text-sm">
            Updated for Pilgrammed players on April 13, 2026
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>What This Site Is</h2>
            <p>
              Pilgrammed Wiki is an independent resource hub built to help players understand the
              Roblox RPG Pilgrammed. The site focuses on the search intent players actually have:
              weapons, builds, bosses, quests, maps, secrets, progression routes, and community
              discoveries.
            </p>
            <p>
              We are not the official game team. This site is maintained as a fan project for
              players who want a faster way to find high-signal reference material.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>What We Cover</h2>
            <p>
              Our editorial goal is simple: publish concise, searchable pages that help players get
              back into the game faster. That includes:
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-xl font-semibold text-white mb-2">Weapons and Builds</h3>
              <p className="text-slate-300">
                Loadout ideas, stat priorities, and practical equipment recommendations for
                different Pilgrammed playstyles.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-xl font-semibold text-white mb-2">Bosses and Drops</h3>
              <p className="text-slate-300">
                Boss locations, encounter notes, reward tracking, and prep information before major
                fights.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-xl font-semibold text-white mb-2">Quests and NPCs</h3>
              <p className="text-slate-300">
                Quest steps, trigger requirements, and route planning for players who want steady
                progression without dead ends.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-xl font-semibold text-white mb-2">Maps and Secrets</h3>
              <p className="text-slate-300">
                Location overviews, exploration notes, and hidden-content references drawn from
                public community research.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-xl font-semibold text-white mb-2">Progression Guides</h3>
              <p className="text-slate-300">
                Beginner routes, mid-game priorities, and upgrade planning built for fast lookup.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <h3 className="text-xl font-semibold text-white mb-2">Community Resources</h3>
              <p className="text-slate-300">
                Links to the official Roblox entry, Discord, Reddit, and other public channels that
                matter to active Pilgrammed players.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>How We Source Information</h2>
            <p>
              We combine official platform references, public community channels, and in-game
              player research. When the game changes, our goal is to update high-impact pages first:
              bosses, progression blockers, map discoveries, and popular build questions.
            </p>
            <p>
              Because Pilgrammed evolves through updates and community discoveries, some entries may
              lag behind live gameplay. When in doubt, verify against the official Roblox page or
              active community channels.
            </p>

            <h2>Important Disclaimer</h2>
            <p className="text-yellow-400/90">
              <strong>{SITE_NAME} is unofficial.</strong> We are not affiliated with, endorsed by,
              or sponsored by Phexonia Studios or Roblox.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-slate-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Get in Touch</h2>
            <p>
              Questions, corrections, and content suggestions are welcome:
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-2">General Inquiries</h3>
              <a
                href={`mailto:${SITE_EMAILS.contact}`}
                className="text-[hsl(var(--nav-theme-light))] hover:underline"
              >
                {SITE_EMAILS.contact}
              </a>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-2">Bug Reports</h3>
              <a
                href={`mailto:${SITE_EMAILS.support}`}
                className="text-[hsl(var(--nav-theme-light))] hover:underline"
              >
                {SITE_EMAILS.support}
              </a>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-2">Content Submissions</h3>
              <a
                href={`mailto:${SITE_EMAILS.contribute}`}
                className="text-[hsl(var(--nav-theme-light))] hover:underline"
              >
                {SITE_EMAILS.contribute}
              </a>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
              <h3 className="text-lg font-semibold text-white mb-2">Partnerships</h3>
              <a
                href={`mailto:${SITE_EMAILS.partnerships}`}
                className="text-[hsl(var(--nav-theme-light))] hover:underline"
              >
                {SITE_EMAILS.partnerships}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 border-y border-border bg-[hsl(var(--nav-theme)/0.08)]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Official Pilgrammed Links</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Start with the official Roblox game page, then use Discord and Reddit to track live
            discoveries and community discussion.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={PILGRAMMED_LINKS.game}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[hsl(var(--nav-theme))] text-white font-semibold hover:opacity-90 transition"
            >
              Play on Roblox
            </a>
            <a
              href={PILGRAMMED_LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-border text-white font-semibold hover:bg-white/10 transition"
            >
              Join Discord
            </a>
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Link href="/" className="text-[hsl(var(--nav-theme-light))] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}
