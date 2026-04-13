import type { Metadata } from "next";
import { getLatestArticles } from "@/lib/getLatestArticles";
import type { Language } from "@/lib/content";
import { type Locale } from "@/i18n/routing";
import { buildLanguageAlternates } from "@/lib/i18n-utils";
import {
  HERO_IMAGE_PATH,
  HOME_METADATA,
  SITE_NAME,
  absoluteUrl,
  getSiteUrl,
} from "@/lib/site-config";
// HomePageClient owns the lucide-react icons and hsl(var(--nav-theme)) homepage styling.
import HomePageClient from "./HomePageClient";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = getSiteUrl();
  const path = "/";
  const heroImageUrl = absoluteUrl(HERO_IMAGE_PATH, siteUrl);

  return {
    title: HOME_METADATA.title,
    description: HOME_METADATA.description,
    keywords: [...HOME_METADATA.keywords],
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
    openGraph: {
      type: "website",
      locale,
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
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  const latestArticles = await getLatestArticles(locale as Language, 30);

  return <HomePageClient latestArticles={latestArticles} locale={locale} />;
}
