import Link from 'next/link'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'
import {
  HERO_IMAGE_PATH,
  SITE_EMAILS,
  SITE_NAME,
  absoluteUrl,
  getSiteUrl,
} from '@/lib/site-config'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = getSiteUrl()
  const path = '/terms-of-service'
  const heroImageUrl = absoluteUrl(HERO_IMAGE_PATH, siteUrl)

  return {
    title: `Terms of Service | ${SITE_NAME}`,
    description:
      'Review the Terms of Service for Pilgrammed Wiki, including acceptable use, intellectual property, third-party links, and legal disclaimers for this unofficial Roblox game resource.',
    keywords: [
      'Pilgrammed Wiki terms of service',
      'Pilgrammed terms',
      'acceptable use policy',
      'fan site legal terms',
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
      title: `Terms of Service | ${SITE_NAME}`,
      description: 'Terms and conditions for using Pilgrammed Wiki.',
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
      title: `Terms of Service | ${SITE_NAME}`,
      description: 'Terms and conditions for using Pilgrammed Wiki.',
      images: [heroImageUrl],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            Terms and conditions for using Pilgrammed Wiki
          </p>
          <p className="text-slate-400 text-sm">
            Last Updated: April 13, 2026
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Pilgrammed Wiki, you agree to these Terms of Service. If you do
              not agree, please stop using the site.
            </p>

            <h2>2. Site Purpose</h2>
            <p>
              Pilgrammed Wiki is an unofficial informational resource focused on the Roblox game
              Pilgrammed. The site may include guides, boss information, quest notes, maps,
              progression summaries, and community reference material.
            </p>
            <p>
              Pilgrammed Wiki is independent and is not operated by Phexonia Studios or Roblox.
            </p>

            <h2>3. Acceptable Use</h2>
            <p>You agree not to use the site to:</p>
            <ul>
              <li>Break applicable laws or regulations.</li>
              <li>Attempt unauthorized access to our systems or infrastructure.</li>
              <li>Scrape, overload, or disrupt the site in a way that harms availability.</li>
              <li>Post, transmit, or submit malicious code or abusive content.</li>
              <li>Misrepresent our content as official Pilgrammed or Roblox communications.</li>
            </ul>

            <h2>4. Content Accuracy</h2>
            <p>
              We try to keep content accurate and current, but game updates, balance changes, and
              community discoveries can make guides outdated. Use the information on this site at
              your own discretion.
            </p>

            <h2>5. Intellectual Property</h2>
            <p>
              The original site layout, written copy, and editorial materials on Pilgrammed Wiki
              are owned by the site operators unless stated otherwise. Game names, logos,
              screenshots, and related assets remain the property of their respective owners.
            </p>

            <h2>6. Fan Site Disclaimer</h2>
            <p>
              Pilgrammed Wiki is a fan project. References to Pilgrammed, Roblox, or Phexonia
              Studios are used for identification and informational purposes only.
            </p>

            <h2>7. Third-Party Links</h2>
            <p>
              The site may link to Roblox, Discord, Reddit, YouTube, and other external services.
              We do not control those websites and are not responsible for their content,
              availability, or privacy practices.
            </p>

            <h2>8. No Warranties</h2>
            <p>
              Pilgrammed Wiki is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not
              guarantee uninterrupted access, absolute accuracy, or fitness for any particular use.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Pilgrammed Wiki and its operators are not
              liable for indirect, incidental, or consequential damages arising from the use of the
              site, reliance on its content, or issues caused by third-party platforms.
            </p>

            <h2>10. Changes to These Terms</h2>
            <p>
              We may revise these Terms of Service from time to time. Continued use of the site
              after an update means you accept the revised terms.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These terms are governed by applicable laws of the United States, without regard to
              conflict-of-law principles.
            </p>

            <h2>12. Contact</h2>
            <p>
              Questions regarding these Terms of Service can be sent to:
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a
                href={`mailto:${SITE_EMAILS.legal}`}
                className="text-[hsl(var(--nav-theme-light))] hover:underline"
              >
                {SITE_EMAILS.legal}
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <Link href="/" className="text-[hsl(var(--nav-theme-light))] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}
