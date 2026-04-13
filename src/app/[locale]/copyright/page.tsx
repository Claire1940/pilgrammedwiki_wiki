import Link from 'next/link'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'
import {
  HERO_IMAGE_PATH,
  SITE_DOMAIN,
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
  const path = '/copyright'
  const heroImageUrl = absoluteUrl(HERO_IMAGE_PATH, siteUrl)

  return {
    title: `Copyright Notice | ${SITE_NAME}`,
    description:
      'Review copyright, trademark, fair use, and DMCA information for Pilgrammed Wiki, including how to report infringement related to this unofficial Pilgrammed resource.',
    keywords: [
      'Pilgrammed Wiki copyright',
      'Pilgrammed DMCA',
      'fair use policy',
      'copyright notice',
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
      title: `Copyright Notice | ${SITE_NAME}`,
      description: 'Copyright and trademark information for Pilgrammed Wiki.',
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
      title: `Copyright Notice | ${SITE_NAME}`,
      description: 'Copyright and trademark information for Pilgrammed Wiki.',
      images: [heroImageUrl],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function Copyright() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Copyright Notice
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            Copyright, trademark, and fair use information for Pilgrammed Wiki
          </p>
          <p className="text-slate-400 text-sm">
            Last Updated: April 13, 2026
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Site Content Ownership</h2>
            <p>
              © 2026 Pilgrammed Wiki. Unless otherwise noted, the original text, editorial notes,
              site structure, and wiki presentation created for this website are owned by
              Pilgrammed Wiki.
            </p>

            <h2>2. Game Assets and Third-Party Marks</h2>
            <p>
              Pilgrammed, related game assets, the Roblox platform, and associated trademarks remain
              the property of their respective owners, including Phexonia Studios and Roblox
              Corporation where applicable.
            </p>
            <p>
              Pilgrammed Wiki is unofficial and does not claim ownership over official game names,
              logos, screenshots, or other protected assets.
            </p>

            <h2>3. Fair Use Statement</h2>
            <p>
              We may reference game names, interface elements, screenshots, and other limited media
              for commentary, indexing, educational explanation, and community documentation. We
              believe this use is transformative and informational in nature.
            </p>

            <h2>4. User Submissions</h2>
            <p>
              If you send us suggestions, corrections, screenshots, or other material, you confirm
              that you have the right to share it and that your submission does not infringe the
              rights of others.
            </p>

            <h2>5. Attribution Rules</h2>
            <p>
              If you quote or reference original Pilgrammed Wiki content, please provide clear
              attribution and link back to the relevant page when possible.
            </p>
            <p>
              Example attribution: <em>&quot;Source: Pilgrammed Wiki ({SITE_DOMAIN})&quot;</em>
            </p>

            <h2>6. Trademark Notice</h2>
            <ul>
              <li><strong>Pilgrammed</strong> and related branding belong to their respective owners.</li>
              <li><strong>Roblox</strong> is a trademark of Roblox Corporation.</li>
              <li><strong>Pilgrammed Wiki</strong> identifies this independent fan resource only.</li>
            </ul>

            <h2>7. DMCA and Infringement Reports</h2>
            <p>
              If you believe material on Pilgrammed Wiki infringes your copyright, send a detailed
              notice that identifies the protected work, the allegedly infringing material, your
              contact details, and a statement of good-faith belief.
            </p>
            <p>
              <strong>General Copyright Inquiries:</strong>{' '}
              <a
                href={`mailto:${SITE_EMAILS.copyright}`}
                className="text-[hsl(var(--nav-theme-light))] hover:underline"
              >
                {SITE_EMAILS.copyright}
              </a>
              <br />
              <strong>DMCA Notices:</strong>{' '}
              <a
                href={`mailto:${SITE_EMAILS.dmca}`}
                className="text-[hsl(var(--nav-theme-light))] hover:underline"
              >
                {SITE_EMAILS.dmca}
              </a>
            </p>

            <h2>8. Counter-Notice Process</h2>
            <p>
              If you believe content was removed or restricted in error, you may send a
              counter-notice with the information required by applicable law. We reserve the right
              to review each request and act in accordance with legal obligations.
            </p>

            <h2>9. Policy Changes</h2>
            <p>
              We may revise this Copyright Notice as the site evolves. The updated date at the top
              of this page reflects the latest revision.
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
