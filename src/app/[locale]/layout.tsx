import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { buildLanguageAlternates } from "@/lib/i18n-utils";
import { getNavPreviewData } from "@/lib/nav-preview";
import type { Language } from "@/lib/content";
import { getWikiLinks } from "@/lib/wiki-links";
import {
  HERO_IMAGE_PATH,
  HOME_METADATA,
  LOGO_PATH,
  PILGRAMMED_LINKS,
  SITE_NAME,
  SITE_SHORT_NAME,
  getSiteUrl,
  absoluteUrl,
} from "@/lib/site-config";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import ClientBody from "../ClientBody";
import Analytics from "@/components/Analytics";
import { SocialBarAd } from "@/components/ads";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// 生成静态参数
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// 生成元数据
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = getSiteUrl();
  const heroImageUrl = absoluteUrl(HERO_IMAGE_PATH, siteUrl);

  return {
    metadataBase: new URL(siteUrl),
    title: HOME_METADATA.title,
    description: HOME_METADATA.description,
    keywords: [...HOME_METADATA.keywords],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: locale,
      url: locale === "en" ? siteUrl : `${siteUrl}/${locale}`,
      siteName: SITE_NAME,
      title: HOME_METADATA.title,
      description: HOME_METADATA.description,
      images: [
        {
          url: heroImageUrl,
          width: 1920,
          height: 1080,
          alt: "Pilgrammed Wiki hero image",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: HOME_METADATA.title,
      description: HOME_METADATA.description,
      images: [heroImageUrl],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/manifest.json",
    alternates: buildLanguageAlternates("/", locale as Locale, siteUrl),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // 验证 locale
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // 获取翻译消息（不需要 setRequestLocale！）
  const messages = await getMessages();
  const navPreviewData = await getNavPreviewData(locale as Language);
  const wikiLinks = getWikiLinks();
  const siteUrl = getSiteUrl();
  const heroImageUrl = absoluteUrl(HERO_IMAGE_PATH, siteUrl);
  const logoUrl = absoluteUrl(LOGO_PATH, siteUrl);
  const siteStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_NAME,
        alternateName: SITE_SHORT_NAME,
        description: HOME_METADATA.description,
        inLanguage: locale,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: SITE_NAME,
        alternateName: SITE_SHORT_NAME,
        url: siteUrl,
        description: HOME_METADATA.description,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
        image: {
          "@type": "ImageObject",
          url: heroImageUrl,
        },
        sameAs: [
          PILGRAMMED_LINKS.game,
          PILGRAMMED_LINKS.group,
          PILGRAMMED_LINKS.discord,
          PILGRAMMED_LINKS.reddit,
          PILGRAMMED_LINKS.trailer,
        ],
      },
    ],
  };

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="google-adsense-account" content="ca-pub-7733402184034568" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteStructuredData),
          }}
        />
        <Script
          crossOrigin="anonymous"
          src="https://unpkg.com/same-runtime@0.0.1/dist/index.global.js"
          strategy="beforeInteractive"
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7733402184034568"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <Analytics />
        <NextIntlClientProvider messages={messages}>
          <ClientBody navPreviewData={navPreviewData} wikiLinks={wikiLinks}>
            {children}
          </ClientBody>
        </NextIntlClientProvider>
        {/* 社交栏广告 */}
        <SocialBarAd adKey={process.env.NEXT_PUBLIC_AD_SOCIAL_BAR || ""} />
      </body>
    </html>
  );
}
