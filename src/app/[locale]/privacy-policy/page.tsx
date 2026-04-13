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
  const path = '/privacy-policy'
  const heroImageUrl = absoluteUrl(HERO_IMAGE_PATH, siteUrl)

  return {
    title: `Privacy Policy | ${SITE_NAME}`,
    description:
      'Read the Privacy Policy for Pilgrammed Wiki and learn how we handle analytics, cookies, and basic site preferences on our unofficial Pilgrammed resource site.',
    keywords: [
      'Pilgrammed Wiki privacy policy',
      'Pilgrammed privacy',
      'cookie policy',
      'analytics disclosure',
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
      title: `Privacy Policy | ${SITE_NAME}`,
      description: 'Learn how Pilgrammed Wiki collects, uses, and protects limited visitor data.',
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
      title: `Privacy Policy | ${SITE_NAME}`,
      description: 'Learn how Pilgrammed Wiki collects, uses, and protects limited visitor data.',
      images: [heroImageUrl],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            How Pilgrammed Wiki collects, uses, and safeguards limited visitor data
          </p>
          <p className="text-slate-400 text-sm">
            Last Updated: April 13, 2026
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Overview</h2>
            <p>
              Pilgrammed Wiki is an unofficial fan-made resource site for the Roblox game
              Pilgrammed. We aim to collect only the limited technical data needed to operate,
              improve, and secure the site.
            </p>

            <h2>2. Information We Collect</h2>
            <ul>
              <li>
                <strong>Usage analytics:</strong> basic traffic and page interaction data such as
                page views, approximate device type, browser, and referral source.
              </li>
              <li>
                <strong>Local preferences:</strong> language and theme settings stored in your
                browser so the site loads with your preferred experience.
              </li>
              <li>
                <strong>Technical logs:</strong> limited server and performance data used to
                monitor uptime, debug rendering issues, and reduce abuse.
              </li>
            </ul>

            <h2>3. How We Use This Information</h2>
            <ul>
              <li>To keep Pilgrammed Wiki available, stable, and performant.</li>
              <li>To understand which guides and wiki sections are most useful to visitors.</li>
              <li>To improve page structure, search visibility, and accessibility.</li>
              <li>To detect spam, misuse, or security issues affecting the site.</li>
            </ul>

            <h2>4. Cookies and Similar Technologies</h2>
            <p>
              We may use cookies, browser storage, and analytics tags to remember preferences and
              measure site usage. Disabling cookies may affect theme persistence, language memory,
              or other convenience features.
            </p>
            <p>
              Where available, you can limit tracking through your browser settings or privacy
              extensions. You can also clear local storage to remove saved on-site preferences.
            </p>

            <h2>5. Third-Party Services and Links</h2>
            <p>
              Pilgrammed Wiki links to third-party services such as Roblox, Discord, Reddit,
              YouTube, analytics vendors, and hosting providers. Those third parties control their
              own privacy practices and policies.
            </p>
            <p>
              We encourage you to review the privacy policies of Roblox and any external platform
              before sharing account information or personal data there.
            </p>

            <h2>6. Children&apos;s Privacy</h2>
            <p>
              Pilgrammed is available on Roblox, which includes younger players. Pilgrammed Wiki
              is intended as a general informational site and does not knowingly request personal
              information from children. If you believe a child submitted personal information to
              us directly, contact us and we will review the request promptly.
            </p>

            <h2>7. Data Retention and Security</h2>
            <p>
              We retain analytics and technical records only as long as reasonably necessary for
              operations, reporting, and abuse prevention. We use standard administrative and
              technical safeguards, but no internet service can guarantee absolute security.
            </p>

            <h2>8. Your Choices</h2>
            <ul>
              <li>You may disable cookies or clear stored site preferences in your browser.</li>
              <li>You may use browser tools that block analytics or similar scripts.</li>
              <li>You may contact us if you have a privacy question related to this site.</li>
            </ul>

            <h2>9. Policy Updates</h2>
            <p>
              We may update this Privacy Policy when our tooling, analytics setup, or legal
              disclosures change. When that happens, we will revise the date shown at the top of
              this page.
            </p>

            <h2>10. Disclaimer</h2>
            <p>
              Pilgrammed Wiki is unofficial and is not affiliated with, endorsed by, or sponsored
              by Phexonia Studios, Roblox, or their respective partners.
            </p>

            <h2>11. Contact</h2>
            <p>
              Questions about this Privacy Policy can be sent to:
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a
                href={`mailto:${SITE_EMAILS.privacy}`}
                className="text-[hsl(var(--nav-theme-light))] hover:underline"
              >
                {SITE_EMAILS.privacy}
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
