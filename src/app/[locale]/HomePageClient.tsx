"use client";

import { Suspense, lazy, useEffect, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Eye,
  Fish,
  Hammer,
  Home,
  MessageCircle,
  Package,
  Settings,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { SidebarAd } from "@/components/ads/SidebarAd";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { VideoFeature } from "@/components/home/VideoFeature";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import { scrollToSection } from "@/lib/scrollToSection";
import {
  HERO_IMAGE_PATH,
  HOME_METADATA,
  LOGO_PATH,
  SITE_NAME,
  SITE_SHORT_NAME,
  absoluteUrl,
  getSiteUrl,
} from "@/lib/site-config";

const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

const homepageLinks = {
  game: "https://www.roblox.com/games/6735572261/Pilgrammed",
  group: "https://www.roblox.com/communities/3573124/Phexonia-Studios",
  discord: "https://discord.gg/pilgrammed",
  reddit: "https://www.reddit.com/r/RobloxPilgrammed/",
  trailer: "https://www.youtube.com/watch?v=ENdAdX0QgWc",
};

const toolCardClassName =
  "group rounded-2xl border border-border bg-card p-6 text-left transition-all duration-300 hover:border-[hsl(var(--nav-theme)/0.45)] hover:shadow-[0_18px_50px_-28px_hsl(var(--nav-theme)/0.45)] scroll-reveal";
const toolCardIconWrapClassName =
  "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--nav-theme)/0.1)] transition-colors group-hover:bg-[hsl(var(--nav-theme)/0.2)]";
const toolCardIconClassName = "h-6 w-6 text-[hsl(var(--nav-theme-light))]";

const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} rounded-2xl border border-border bg-white/5 animate-pulse`}
  />
);

function AccentPill({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.35)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs font-medium text-[hsl(var(--nav-theme-light))] ${className}`}
    >
      {children}
    </span>
  );
}

function SurfaceCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-white/5 p-6 transition-colors hover:border-[hsl(var(--nav-theme)/0.45)] ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
}) {
  return (
    <div className="mb-10 text-center scroll-reveal">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-4 py-2">
        <span className="text-[hsl(var(--nav-theme-light))]">{icon}</span>
        <span className="text-sm font-medium text-[hsl(var(--nav-theme-light))]">
          {eyebrow}
        </span>
      </div>
      <h2 className="mb-4 text-4xl font-bold md:text-5xl">{title}</h2>
      <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}

function SectionIntro({ children }: { children: ReactNode }) {
  return (
    <p className="mx-auto mb-8 max-w-4xl text-center leading-7 text-muted-foreground scroll-reveal">
      {children}
    </p>
  );
}

function AccordionToggle({
  title,
  subtitle,
  expanded,
  onClick,
}: {
  title: string;
  subtitle: string;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-white/5 px-5 py-4 text-left transition-colors hover:border-[hsl(var(--nav-theme)/0.45)]"
    >
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronDown
        className={`h-5 w-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))] transition-transform ${expanded ? "rotate-180" : ""}`}
      />
    </button>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const modules = t.modules as any;
  const toolCards = t.tools.cards as any[];
  const siteUrl = getSiteUrl();
  const heroImageUrl = absoluteUrl(HERO_IMAGE_PATH, siteUrl);
  const logoUrl = absoluteUrl(LOGO_PATH, siteUrl);

  const footerLinks = [
    { label: t.footer.discord, href: homepageLinks.discord },
    { label: t.footer.reddit, href: homepageLinks.reddit },
    { label: t.footer.trailer, href: homepageLinks.trailer },
    { label: t.footer.robloxGroup, href: homepageLinks.group },
    { label: t.footer.playOnRoblox, href: homepageLinks.game },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_NAME,
        description: HOME_METADATA.description,
        image: {
          "@type": "ImageObject",
          url: heroImageUrl,
          width: 1920,
          height: 1080,
          caption: "Pilgrammed gameplay hero image",
        },
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
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: heroImageUrl,
          width: 1920,
          height: 1080,
          caption: "Pilgrammed Wiki hero image",
        },
        sameAs: [
          homepageLinks.game,
          homepageLinks.group,
          homepageLinks.discord,
          homepageLinks.reddit,
          homepageLinks.trailer,
        ],
      },
      {
        "@type": "VideoGame",
        name: SITE_SHORT_NAME,
        gamePlatform: ["Roblox"],
        applicationCategory: "Game",
        genre: ["Action RPG", "Open World", "Adventure", "Fantasy"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 12,
        },
        publisher: {
          "@type": "Organization",
          name: "Phexonia Studios",
          url: homepageLinks.group,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: homepageLinks.game,
        },
      },
    ],
  };

  const [expandedPanels, setExpandedPanels] = useState<
    Record<string, number | null>
  >({
    wind: 0,
    skills: 0,
    bosses: 0,
  });

  const togglePanel = (group: string, index: number) => {
    setExpandedPanels((current) => ({
      ...current,
      [group]: current[group] === index ? null : index,
    }));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-reveal-visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".scroll-reveal").forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <aside
        className="fixed top-20 z-10 hidden w-40 xl:block"
        style={{ left: "calc((100vw - 896px) / 2 - 180px)" }}
      >
        <SidebarAd
          type="sidebar-160x300"
          adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300}
        />
      </aside>

      <aside
        className="fixed top-20 z-10 hidden w-40 xl:block"
        style={{ right: "calc((100vw - 896px) / 2 - 180px)" }}
      >
        <SidebarAd
          type="sidebar-160x600"
          adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600}
        />
      </aside>

      <section className="relative overflow-hidden px-4 pb-24 pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--nav-theme)/0.18),transparent_46%)]" />
        <div className="absolute -left-16 top-20 h-52 w-52 rounded-full bg-[hsl(var(--nav-theme-light)/0.08)] blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[hsl(var(--nav-theme)/0.1)] blur-3xl" />

        <div className="container relative mx-auto max-w-6xl">
          <div className="mb-8 text-center scroll-reveal">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-4 py-2">
              <Sparkles className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
              {t.hero.title}
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-xl text-muted-foreground md:text-2xl">
              {t.hero.description}
            </p>

            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href={homepageLinks.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--nav-theme))] px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-[hsl(var(--nav-theme)/0.9)]"
              >
                <MessageCircle className="h-5 w-5" />
                {t.hero.getFreeCodesCTA}
              </a>
              <a
                href={homepageLinks.game}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-8 py-4 text-lg font-semibold transition-colors hover:border-[hsl(var(--nav-theme)/0.4)] hover:bg-white/10"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      <section className="px-4 py-12">
        <div className="container mx-auto max-w-4xl scroll-reveal">
          <div className="mb-6 text-center">
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">
              {t.gameFeature.title}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t.gameFeature.description}
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <VideoFeature
              videoId="ENdAdX0QgWc"
              title="Pilgrammed - Gameplay Trailer"
              posterImage={HERO_IMAGE_PATH}
            />
          </div>
        </div>
      </section>

      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={30}
      />

      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
      />

      <section className="bg-white/[0.02] px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12 text-center scroll-reveal">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="#pilgrammed-codes"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pilgrammed-codes");
              }}
              className={toolCardClassName}
              style={{ animationDelay: "0ms" }}
            >
              <div className={toolCardIconWrapClassName}>
                <DynamicIcon
                  name={toolCards[0].icon}
                  className={toolCardIconClassName}
                />
              </div>
              <h3 className="mb-2 font-semibold">{toolCards[0].title}</h3>
              <p className="text-sm text-muted-foreground">
                {toolCards[0].description}
              </p>
            </a>

            <a
              href="#pilgrammed-beginner-guide"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pilgrammed-beginner-guide");
              }}
              className={toolCardClassName}
              style={{ animationDelay: "50ms" }}
            >
              <div className={toolCardIconWrapClassName}>
                <DynamicIcon
                  name={toolCards[1].icon}
                  className={toolCardIconClassName}
                />
              </div>
              <h3 className="mb-2 font-semibold">{toolCards[1].title}</h3>
              <p className="text-sm text-muted-foreground">
                {toolCards[1].description}
              </p>
            </a>

            <a
              href="#pilgrammed-best-builds"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pilgrammed-best-builds");
              }}
              className={toolCardClassName}
              style={{ animationDelay: "100ms" }}
            >
              <div className={toolCardIconWrapClassName}>
                <DynamicIcon
                  name={toolCards[2].icon}
                  className={toolCardIconClassName}
                />
              </div>
              <h3 className="mb-2 font-semibold">{toolCards[2].title}</h3>
              <p className="text-sm text-muted-foreground">
                {toolCards[2].description}
              </p>
            </a>

            <a
              href="#pilgrammed-weapon-tier-list"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pilgrammed-weapon-tier-list");
              }}
              className={toolCardClassName}
              style={{ animationDelay: "150ms" }}
            >
              <div className={toolCardIconWrapClassName}>
                <DynamicIcon
                  name={toolCards[3].icon}
                  className={toolCardIconClassName}
                />
              </div>
              <h3 className="mb-2 font-semibold">{toolCards[3].title}</h3>
              <p className="text-sm text-muted-foreground">
                {toolCards[3].description}
              </p>
            </a>

            <a
              href="#pilgrammed-best-weapons"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pilgrammed-best-weapons");
              }}
              className={toolCardClassName}
              style={{ animationDelay: "200ms" }}
            >
              <div className={toolCardIconWrapClassName}>
                <DynamicIcon
                  name={toolCards[4].icon}
                  className={toolCardIconClassName}
                />
              </div>
              <h3 className="mb-2 font-semibold">{toolCards[4].title}</h3>
              <p className="text-sm text-muted-foreground">
                {toolCards[4].description}
              </p>
            </a>

            <a
              href="#pilgrammed-wind-update-notes"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pilgrammed-wind-update-notes");
              }}
              className={toolCardClassName}
              style={{ animationDelay: "250ms" }}
            >
              <div className={toolCardIconWrapClassName}>
                <DynamicIcon
                  name={toolCards[5].icon}
                  className={toolCardIconClassName}
                />
              </div>
              <h3 className="mb-2 font-semibold">{toolCards[5].title}</h3>
              <p className="text-sm text-muted-foreground">
                {toolCards[5].description}
              </p>
            </a>

            <a
              href="#pilgrammed-reforge-guide"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pilgrammed-reforge-guide");
              }}
              className={toolCardClassName}
              style={{ animationDelay: "300ms" }}
            >
              <div className={toolCardIconWrapClassName}>
                <DynamicIcon
                  name={toolCards[6].icon}
                  className={toolCardIconClassName}
                />
              </div>
              <h3 className="mb-2 font-semibold">{toolCards[6].title}</h3>
              <p className="text-sm text-muted-foreground">
                {toolCards[6].description}
              </p>
            </a>

            <a
              href="#pilgrammed-soul-level-guide"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pilgrammed-soul-level-guide");
              }}
              className={toolCardClassName}
              style={{ animationDelay: "350ms" }}
            >
              <div className={toolCardIconWrapClassName}>
                <DynamicIcon
                  name={toolCards[7].icon}
                  className={toolCardIconClassName}
                />
              </div>
              <h3 className="mb-2 font-semibold">{toolCards[7].title}</h3>
              <p className="text-sm text-muted-foreground">
                {toolCards[7].description}
              </p>
            </a>

            <a
              href="#pilgrammed-skill-tree-guide"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pilgrammed-skill-tree-guide");
              }}
              className={toolCardClassName}
              style={{ animationDelay: "400ms" }}
            >
              <div className={toolCardIconWrapClassName}>
                <DynamicIcon
                  name={toolCards[8].icon}
                  className={toolCardIconClassName}
                />
              </div>
              <h3 className="mb-2 font-semibold">{toolCards[8].title}</h3>
              <p className="text-sm text-muted-foreground">
                {toolCards[8].description}
              </p>
            </a>

            <a
              href="#pilgrammed-stats-guide"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pilgrammed-stats-guide");
              }}
              className={toolCardClassName}
              style={{ animationDelay: "450ms" }}
            >
              <div className={toolCardIconWrapClassName}>
                <DynamicIcon
                  name={toolCards[9].icon}
                  className={toolCardIconClassName}
                />
              </div>
              <h3 className="mb-2 font-semibold">{toolCards[9].title}</h3>
              <p className="text-sm text-muted-foreground">
                {toolCards[9].description}
              </p>
            </a>

            <a
              href="#pilgrammed-boss-guide"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pilgrammed-boss-guide");
              }}
              className={toolCardClassName}
              style={{ animationDelay: "500ms" }}
            >
              <div className={toolCardIconWrapClassName}>
                <DynamicIcon
                  name={toolCards[10].icon}
                  className={toolCardIconClassName}
                />
              </div>
              <h3 className="mb-2 font-semibold">{toolCards[10].title}</h3>
              <p className="text-sm text-muted-foreground">
                {toolCards[10].description}
              </p>
            </a>

            <a
              href="#pilgrammed-boss-locations"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pilgrammed-boss-locations");
              }}
              className={toolCardClassName}
              style={{ animationDelay: "550ms" }}
            >
              <div className={toolCardIconWrapClassName}>
                <DynamicIcon
                  name={toolCards[11].icon}
                  className={toolCardIconClassName}
                />
              </div>
              <h3 className="mb-2 font-semibold">{toolCards[11].title}</h3>
              <p className="text-sm text-muted-foreground">
                {toolCards[11].description}
              </p>
            </a>

            <a
              href="#pilgrammed-upgrades-guide"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pilgrammed-upgrades-guide");
              }}
              className={toolCardClassName}
              style={{ animationDelay: "600ms" }}
            >
              <div className={toolCardIconWrapClassName}>
                <DynamicIcon
                  name={toolCards[12].icon}
                  className={toolCardIconClassName}
                />
              </div>
              <h3 className="mb-2 font-semibold">{toolCards[12].title}</h3>
              <p className="text-sm text-muted-foreground">
                {toolCards[12].description}
              </p>
            </a>

            <a
              href="#pilgrammed-progression-guide"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pilgrammed-progression-guide");
              }}
              className={toolCardClassName}
              style={{ animationDelay: "650ms" }}
            >
              <div className={toolCardIconWrapClassName}>
                <DynamicIcon
                  name={toolCards[13].icon}
                  className={toolCardIconClassName}
                />
              </div>
              <h3 className="mb-2 font-semibold">{toolCards[13].title}</h3>
              <p className="text-sm text-muted-foreground">
                {toolCards[13].description}
              </p>
            </a>

            <a
              href="#pilgrammed-fishing-guide"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pilgrammed-fishing-guide");
              }}
              className={toolCardClassName}
              style={{ animationDelay: "700ms" }}
            >
              <div className={toolCardIconWrapClassName}>
                <DynamicIcon
                  name={toolCards[14].icon}
                  className={toolCardIconClassName}
                />
              </div>
              <h3 className="mb-2 font-semibold">{toolCards[14].title}</h3>
              <p className="text-sm text-muted-foreground">
                {toolCards[14].description}
              </p>
            </a>

            <a
              href="#pilgrammed-armor-guide"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("pilgrammed-armor-guide");
              }}
              className={toolCardClassName}
              style={{ animationDelay: "750ms" }}
            >
              <div className={toolCardIconWrapClassName}>
                <DynamicIcon
                  name={toolCards[15].icon}
                  className={toolCardIconClassName}
                />
              </div>
              <h3 className="mb-2 font-semibold">{toolCards[15].title}</h3>
              <p className="text-sm text-muted-foreground">
                {toolCards[15].description}
              </p>
            </a>
          </div>
        </div>
      </section>

      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
      />

      <section id="pilgrammed-codes" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={modules.pilgrammedCodes.eyebrow}
            title={modules.pilgrammedCodes.title}
            subtitle={modules.pilgrammedCodes.subtitle}
            icon={<ClipboardCheck className="h-5 w-5" />}
          />
          <SectionIntro>{modules.pilgrammedCodes.intro}</SectionIntro>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {modules.pilgrammedCodes.items.map((item: any) => (
              <SurfaceCard key={item.name} className="scroll-reveal">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <AccentPill>{item.badge}</AccentPill>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  {item.summary}
                </p>
                <div className="rounded-xl border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] p-4">
                  <p className="text-sm leading-6">{item.action}</p>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
      />

      <section id="pilgrammed-beginner-guide" className="scroll-mt-24 bg-white/[0.02] px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={modules.pilgrammedBeginnerGuide.eyebrow}
            title={modules.pilgrammedBeginnerGuide.title}
            subtitle={modules.pilgrammedBeginnerGuide.subtitle}
            icon={<BookOpen className="h-5 w-5" />}
          />
          <SectionIntro>{modules.pilgrammedBeginnerGuide.intro}</SectionIntro>
          <div className="space-y-4">
            {modules.pilgrammedBeginnerGuide.items.map((item: any) => (
              <div
                key={item.step}
                className="flex gap-4 rounded-2xl border border-border bg-white/5 p-6 transition-colors hover:border-[hsl(var(--nav-theme)/0.45)] scroll-reveal"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.45)] bg-[hsl(var(--nav-theme)/0.12)] text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                  {item.step}
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                  <p className="leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pilgrammed-best-builds" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={modules.pilgrammedBestBuilds.eyebrow}
            title={modules.pilgrammedBestBuilds.title}
            subtitle={modules.pilgrammedBestBuilds.subtitle}
            icon={<Sparkles className="h-5 w-5" />}
          />
          <SectionIntro>{modules.pilgrammedBestBuilds.intro}</SectionIntro>
          <div className="grid gap-6 lg:grid-cols-2">
            {modules.pilgrammedBestBuilds.items.map((item: any) => (
              <SurfaceCard key={item.name} className="scroll-reveal">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {item.name}
                  </h3>
                  <AccentPill>{item.role}</AccentPill>
                </div>
                <div className="space-y-4 text-sm leading-6 text-muted-foreground">
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.24em] text-[hsl(var(--nav-theme-light))]">
                      Setup
                    </p>
                    <p>{item.setup}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.24em] text-[hsl(var(--nav-theme-light))]">
                      Core Sequence
                    </p>
                    <p>{item.core_sequence}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.24em] text-[hsl(var(--nav-theme-light))]">
                      Why It Works
                    </p>
                    <p>{item.why_it_works}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.24em] text-[hsl(var(--nav-theme-light))]">
                      Best For
                    </p>
                    <p>{item.best_for}</p>
                  </div>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <section id="pilgrammed-weapon-tier-list" className="scroll-mt-24 bg-white/[0.02] px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={modules.pilgrammedWeaponTierList.eyebrow}
            title={modules.pilgrammedWeaponTierList.title}
            subtitle={modules.pilgrammedWeaponTierList.subtitle}
            icon={<Hammer className="h-5 w-5" />}
          />
          <SectionIntro>{modules.pilgrammedWeaponTierList.intro}</SectionIntro>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {modules.pilgrammedWeaponTierList.items.map((tier: any) => (
              <SurfaceCard key={tier.tier} className="scroll-reveal">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{tier.tier} Tier</h3>
                  <AccentPill>{tier.title}</AccentPill>
                </div>
                <div className="space-y-3">
                  {tier.entries.map((entry: string) => (
                    <div
                      key={entry}
                      className="rounded-xl border border-border bg-black/10 p-4 text-sm leading-6 text-muted-foreground"
                    >
                      {entry}
                    </div>
                  ))}
                </div>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <section id="pilgrammed-best-weapons" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={modules.pilgrammedBestWeapons.eyebrow}
            title={modules.pilgrammedBestWeapons.title}
            subtitle={modules.pilgrammedBestWeapons.subtitle}
            icon={<Star className="h-5 w-5" />}
          />
          <SectionIntro>{modules.pilgrammedBestWeapons.intro}</SectionIntro>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.pilgrammedBestWeapons.items.map((item: any) => (
              <SurfaceCard
                key={item.weapon}
                className="scroll-reveal overflow-hidden"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[hsl(var(--nav-theme-light))]">
                      {item.stage}
                    </p>
                    <h3 className="mb-2 text-2xl font-bold">{item.weapon}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.class} • {item.scaling} scaling
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.12)] px-4 py-3 text-center">
                    <p className="text-xs uppercase tracking-[0.24em] text-[hsl(var(--nav-theme-light))]">
                      Tier
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {item.tier}
                    </p>
                  </div>
                </div>

                <div className="mb-4 grid gap-3 text-sm sm:grid-cols-3">
                  <div className="rounded-2xl border border-border bg-black/10 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--nav-theme-light))]">
                      Damage
                    </p>
                    <p className="mt-1 font-semibold">{item.base_damage}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-black/10 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--nav-theme-light))]">
                      Speed
                    </p>
                    <p className="mt-1 font-semibold">{item.attack_speed}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-black/10 p-3 sm:col-span-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-[hsl(var(--nav-theme-light))]">
                      Best For
                    </p>
                    <p className="mt-1 font-semibold">{item.best_for}</p>
                  </div>
                </div>

                <div className="mb-4 rounded-2xl border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] p-4">
                  <p className="mb-1 text-xs uppercase tracking-[0.24em] text-[hsl(var(--nav-theme-light))]">
                    Acquisition
                  </p>
                  <p className="text-sm leading-6">{item.acquisition}</p>
                </div>

                <div className="rounded-2xl border border-border bg-black/10 p-4">
                  <p className="mb-1 text-xs uppercase tracking-[0.24em] text-[hsl(var(--nav-theme-light))]">
                    Why It Matters
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.why_it_matters}
                  </p>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <section id="pilgrammed-wind-update-notes" className="scroll-mt-24 bg-white/[0.02] px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={modules.pilgrammedWindUpdateNotes.eyebrow}
            title={modules.pilgrammedWindUpdateNotes.title}
            subtitle={modules.pilgrammedWindUpdateNotes.subtitle}
            icon={<Clock className="h-5 w-5" />}
          />
          <SectionIntro>{modules.pilgrammedWindUpdateNotes.intro}</SectionIntro>
          <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            {modules.pilgrammedWindUpdateNotes.items.map(
              (item: any, index: number) => {
                const expanded = expandedPanels.wind === index;
                return (
                  <div key={item.section} className="self-start scroll-reveal">
                    <AccordionToggle
                      title={item.section}
                      subtitle={item.summary}
                      expanded={expanded}
                      onClick={() => togglePanel("wind", index)}
                    />
                    {expanded && (
                      <SurfaceCard className="mt-3 border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.06)]">
                        <ul className="space-y-3">
                          {item.bullets.map((bullet: string) => (
                            <li
                              key={bullet}
                              className="flex gap-3 text-sm leading-6 text-muted-foreground"
                            >
                              <Check className="mt-1 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </SurfaceCard>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      <section id="pilgrammed-reforge-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={modules.pilgrammedReforgeGuide.eyebrow}
            title={modules.pilgrammedReforgeGuide.title}
            subtitle={modules.pilgrammedReforgeGuide.subtitle}
            icon={<Settings className="h-5 w-5" />}
          />
          <SectionIntro>{modules.pilgrammedReforgeGuide.intro}</SectionIntro>

          <div className="mb-6 grid gap-4 scroll-reveal md:grid-cols-3">
            <div className="rounded-2xl border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[hsl(var(--nav-theme-light))]">
                Wind Baseline
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                Legendary is gone, so modifier synergy matters more than rarity
                color.
              </p>
            </div>
            <div className="rounded-2xl border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[hsl(var(--nav-theme-light))]">
                Talvern Value
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                Guild rank discounts now scale all the way to 75% at Legend.
              </p>
            </div>
            <div className="rounded-2xl border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] p-4">
              <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[hsl(var(--nav-theme-light))]">
                Gem Removal
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                Legend rank drops gem removal to 25 Gold, which changes reroll
                planning.
              </p>
            </div>
          </div>

          <div className="hidden overflow-x-auto rounded-2xl border border-border scroll-reveal md:block">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.12)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Target</th>
                  <th className="px-4 py-3 font-semibold">
                    Recommended Reforge
                  </th>
                  <th className="px-4 py-3 font-semibold">Effect</th>
                  <th className="px-4 py-3 font-semibold">Best For</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {modules.pilgrammedReforgeGuide.items.map(
                  (item: any, index: number) => (
                    <tr
                      key={item.target}
                      className={`border-t border-border align-top ${
                        index % 2 === 0 ? "bg-black/10" : "bg-transparent"
                      }`}
                    >
                      <td className="px-4 py-4 font-semibold">{item.target}</td>
                      <td className="px-4 py-4 text-[hsl(var(--nav-theme-light))]">
                        {item.recommended_reforge}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {item.effect}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {item.best_for}
                      </td>
                      <td className="px-4 py-4 leading-6 text-muted-foreground">
                        {item.notes}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 md:hidden">
            {modules.pilgrammedReforgeGuide.items.map((item: any) => (
              <SurfaceCard key={item.target} className="scroll-reveal">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold">{item.target}</h3>
                  <AccentPill>{item.recommended_reforge}</AccentPill>
                </div>
                <p className="mb-2 text-sm text-muted-foreground">
                  {item.effect}
                </p>
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Best For:
                  </span>{" "}
                  {item.best_for}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.notes}
                </p>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <section id="pilgrammed-soul-level-guide" className="scroll-mt-24 bg-white/[0.02] px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={modules.pilgrammedSoulLevelGuide.eyebrow}
            title={modules.pilgrammedSoulLevelGuide.title}
            subtitle={modules.pilgrammedSoulLevelGuide.subtitle}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <SectionIntro>{modules.pilgrammedSoulLevelGuide.intro}</SectionIntro>
          <div className="grid gap-4 md:grid-cols-2">
            {modules.pilgrammedSoulLevelGuide.items.map((item: any) => (
              <SurfaceCard
                key={item.step}
                className="scroll-reveal relative overflow-hidden"
              >
                <div className="pointer-events-none absolute right-4 top-2 text-7xl font-bold text-[hsl(var(--nav-theme)/0.08)]">
                  {item.step}
                </div>
                <div className="relative">
                  <AccentPill className="mb-4">
                    Soul Level Step {item.step}
                  </AccentPill>
                </div>
                <h3 className="mb-3 text-xl font-bold">{item.heading}</h3>
                <div className="mb-4 grid gap-2 sm:grid-cols-2">
                  {item.key_numbers.map((entry: string) => (
                    <div
                      key={entry}
                      className="rounded-2xl border border-[hsl(var(--nav-theme)/0.22)] bg-[hsl(var(--nav-theme)/0.08)] px-4 py-3 text-sm font-medium"
                    >
                      {entry}
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  {item.body}
                </p>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <AdBanner
        type="banner-320x50"
        adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50}
      />

      <section id="pilgrammed-skill-tree-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={modules.pilgrammedSkillTreeGuide.eyebrow}
            title={modules.pilgrammedSkillTreeGuide.title}
            subtitle={modules.pilgrammedSkillTreeGuide.subtitle}
            icon={<Users className="h-5 w-5" />}
          />
          <SectionIntro>{modules.pilgrammedSkillTreeGuide.intro}</SectionIntro>
          <div className="space-y-4">
            {modules.pilgrammedSkillTreeGuide.items.map(
              (item: any, index: number) => {
                const expanded = expandedPanels.skills === index;
                return (
                  <div key={item.title} className="scroll-reveal">
                    <AccordionToggle
                      title={item.title}
                      subtitle={item.summary}
                      expanded={expanded}
                      onClick={() => togglePanel("skills", index)}
                    />
                    {expanded && (
                      <SurfaceCard className="mt-3">
                        <div className="mb-4 flex flex-wrap gap-2">
                          {item.best_for.map((entry: string) => (
                            <AccentPill key={entry}>{entry}</AccentPill>
                          ))}
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                          <div>
                            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[hsl(var(--nav-theme-light))]">
                              Main Nodes
                            </p>
                            <div className="space-y-3">
                              {item.main_nodes.map((node: any) => (
                                <div
                                  key={node.name}
                                  className="rounded-xl border border-border bg-black/10 p-4"
                                >
                                  <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <p className="font-semibold">{node.name}</p>
                                    <AccentPill>{node.type}</AccentPill>
                                  </div>
                                  <p className="mb-2 text-sm leading-6 text-muted-foreground">
                                    {node.base}
                                  </p>
                                  <p className="text-sm leading-6 text-muted-foreground">
                                    {node.aced}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[hsl(var(--nav-theme-light))]">
                              Optional Nodes
                            </p>
                            <div className="space-y-3">
                              {item.optional_nodes.map((node: any) => (
                                <div
                                  key={node.name}
                                  className="rounded-xl border border-border bg-black/10 p-4"
                                >
                                  <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <p className="font-semibold">{node.name}</p>
                                    <AccentPill>{node.type}</AccentPill>
                                  </div>
                                  <p className="mb-2 text-sm leading-6 text-muted-foreground">
                                    {node.base}
                                  </p>
                                  <p className="text-sm leading-6 text-muted-foreground">
                                    {node.aced}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 rounded-xl border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] p-4">
                          <p className="text-sm leading-6">{item.takeaway}</p>
                        </div>
                      </SurfaceCard>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      <section id="pilgrammed-stats-guide" className="scroll-mt-24 bg-white/[0.02] px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={modules.pilgrammedStatsGuide.eyebrow}
            title={modules.pilgrammedStatsGuide.title}
            subtitle={modules.pilgrammedStatsGuide.subtitle}
            icon={<Eye className="h-5 w-5" />}
          />
          <SectionIntro>{modules.pilgrammedStatsGuide.intro}</SectionIntro>

          <div className="hidden overflow-x-auto rounded-2xl border border-border scroll-reveal md:block">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.12)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Stat</th>
                  <th className="px-4 py-3 font-semibold">Primary Role</th>
                  <th className="px-4 py-3 font-semibold">Exact Effect</th>
                  <th className="px-4 py-3 font-semibold">Secondary Effects</th>
                  <th className="px-4 py-3 font-semibold">Best For</th>
                  <th className="px-4 py-3 font-semibold">Practical Pick</th>
                </tr>
              </thead>
              <tbody>
                {modules.pilgrammedStatsGuide.items.map((item: any) => (
                  <tr
                    key={item.stat}
                    className="border-t border-border align-top"
                  >
                    <td className="px-4 py-4">
                      <p className="font-semibold">{item.stat}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.full_name}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {item.primary_role}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {item.exact_effect}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {item.secondary_effects}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {item.best_for}
                    </td>
                    <td className="px-4 py-4 leading-6 text-muted-foreground">
                      {item.practical_pick}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 md:hidden">
            {modules.pilgrammedStatsGuide.items.map((item: any) => (
              <SurfaceCard key={item.stat} className="scroll-reveal">
                <div className="mb-3 flex items-center gap-3">
                  <h3 className="text-xl font-bold">{item.stat}</h3>
                  <AccentPill>{item.full_name}</AccentPill>
                </div>
                <p className="mb-2 text-sm text-muted-foreground">
                  {item.primary_role}
                </p>
                <p className="mb-2 text-sm text-muted-foreground">
                  {item.exact_effect}
                </p>
                <p className="mb-2 text-sm text-muted-foreground">
                  {item.secondary_effects}
                </p>
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Best For:
                  </span>{" "}
                  {item.best_for}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.practical_pick}
                </p>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <section id="pilgrammed-boss-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={modules.pilgrammedBossGuide.eyebrow}
            title={modules.pilgrammedBossGuide.title}
            subtitle={modules.pilgrammedBossGuide.subtitle}
            icon={<AlertTriangle className="h-5 w-5" />}
          />
          <SectionIntro>{modules.pilgrammedBossGuide.intro}</SectionIntro>
          <div className="space-y-4">
            {modules.pilgrammedBossGuide.items.map(
              (item: any, index: number) => {
                const expanded = expandedPanels.bosses === index;
                return (
                  <div key={item.title} className="scroll-reveal">
                    <AccordionToggle
                      title={item.title}
                      subtitle={item.summary}
                      expanded={expanded}
                      onClick={() => togglePanel("bosses", index)}
                    />
                    {expanded && (
                      <SurfaceCard className="mt-3">
                        <div className="mb-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
                          <AccentPill>Region: {item.region}</AccentPill>
                          <AccentPill>HP: {item.stats.hp}</AccentPill>
                          <AccentPill>DEF: {item.stats.def}</AccentPill>
                          <AccentPill>
                            Damage Taken: {item.stats.damage_taken}
                          </AccentPill>
                          <AccentPill>Gold: {item.stats.gold}</AccentPill>
                          <AccentPill>XP: {item.stats.xp}</AccentPill>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-3">
                          <div className="rounded-xl border border-border bg-black/10 p-4">
                            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[hsl(var(--nav-theme-light))]">
                              Drops
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {item.drops.map((entry: string) => (
                                <li key={entry} className="flex gap-2">
                                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                                  <span>{entry}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-xl border border-border bg-black/10 p-4">
                            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[hsl(var(--nav-theme-light))]">
                              Worth It For
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {item.worth_it_for.map((entry: string) => (
                                <li key={entry} className="flex gap-2">
                                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                                  <span>{entry}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-xl border border-border bg-black/10 p-4">
                            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[hsl(var(--nav-theme-light))]">
                              Watch For
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {item.watch_for.map((entry: string) => (
                                <li key={entry} className="flex gap-2">
                                  <AlertTriangle className="mt-1 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                                  <span>{entry}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-4 rounded-xl border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] p-4">
                          <p className="text-sm leading-6">{item.fight_note}</p>
                        </div>
                      </SurfaceCard>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      <section id="pilgrammed-boss-locations" className="scroll-mt-24 bg-white/[0.02] px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={modules.pilgrammedBossLocations.eyebrow}
            title={modules.pilgrammedBossLocations.title}
            subtitle={modules.pilgrammedBossLocations.subtitle}
            icon={<Home className="h-5 w-5" />}
          />
          <SectionIntro>{modules.pilgrammedBossLocations.intro}</SectionIntro>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.pilgrammedBossLocations.items.map((item: any) => (
              <SurfaceCard key={item.boss} className="scroll-reveal">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold">{item.boss}</h3>
                  <AccentPill>{item.region}</AccentPill>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Arena:</span>{" "}
                  {item.arena}
                </p>
                <p className="mb-4 text-sm leading-6 text-muted-foreground">
                  {item.fast_route}
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {item.landmarks.map((entry: string) => (
                    <AccentPill key={entry}>{entry}</AccentPill>
                  ))}
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Spawn Method:
                  </span>{" "}
                  {item.spawn_method}
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {item.notes.map((entry: string) => (
                    <li key={entry} className="flex gap-2">
                      <Check className="mt-1 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                      <span>{entry}</span>
                    </li>
                  ))}
                </ul>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <section id="pilgrammed-upgrades-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            eyebrow={modules.pilgrammedUpgradesGuide.eyebrow}
            title={modules.pilgrammedUpgradesGuide.title}
            subtitle={modules.pilgrammedUpgradesGuide.subtitle}
            icon={<ArrowRight className="h-5 w-5" />}
          />
          <SectionIntro>{modules.pilgrammedUpgradesGuide.intro}</SectionIntro>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {modules.pilgrammedUpgradesGuide.items.map((item: any) => (
              <SurfaceCard key={item.step} className="scroll-reveal">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-4xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {item.step}
                  </span>
                  <AccentPill>{item.location}</AccentPill>
                </div>
                <h3 className="mb-2 text-xl font-bold">{item.upgrade}</h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Unlock:</span>{" "}
                  {item.unlock}
                </p>
                <p className="mb-2 text-sm leading-6 text-muted-foreground">
                  {item.effect}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.why_get_it_early}
                </p>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <section id="pilgrammed-progression-guide" className="scroll-mt-24 bg-white/[0.02] px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={modules.pilgrammedProgressionGuide.eyebrow}
            title={modules.pilgrammedProgressionGuide.title}
            subtitle={modules.pilgrammedProgressionGuide.subtitle}
            icon={<Package className="h-5 w-5" />}
          />
          <SectionIntro>
            {modules.pilgrammedProgressionGuide.intro}
          </SectionIntro>
          <div className="grid gap-4 lg:grid-cols-2">
            {modules.pilgrammedProgressionGuide.items.map((item: any) => (
              <SurfaceCard key={item.phase} className="scroll-reveal">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <AccentPill>{item.phase}</AccentPill>
                  <AccentPill>{item.route}</AccentPill>
                </div>
                <h3 className="mb-2 text-xl font-bold">{item.focus}</h3>
                <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
                  {item.checklist.map((entry: string) => (
                    <li key={entry} className="flex gap-2">
                      <Check className="mt-1 h-4 w-4 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                      <span>{entry}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-xl border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.08)] p-4">
                  <p className="text-sm leading-6">{item.payoff}</p>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <section id="pilgrammed-fishing-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={modules.pilgrammedFishingGuide.eyebrow}
            title={modules.pilgrammedFishingGuide.title}
            subtitle={modules.pilgrammedFishingGuide.subtitle}
            icon={<Fish className="h-5 w-5" />}
          />
          <SectionIntro>{modules.pilgrammedFishingGuide.intro}</SectionIntro>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.pilgrammedFishingGuide.items.map((item: any) => (
              <SurfaceCard key={item.name} className="scroll-reveal">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <AccentPill>{item.focus}</AccentPill>
                </div>
                <p className="mb-3 text-sm leading-6 text-muted-foreground">
                  {item.details}
                </p>
                {"best_for" in item && (
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Best For:
                    </span>{" "}
                    {item.best_for}
                  </p>
                )}
                {"watch_out_for" in item && (
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Watch Out For:
                    </span>{" "}
                    {item.watch_out_for}
                  </p>
                )}
                {"stat_line" in item && (
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Stat Line:
                    </span>{" "}
                    {item.stat_line}
                  </p>
                )}
                {"how_to_unlock" in item && (
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      How To Unlock:
                    </span>{" "}
                    {item.how_to_unlock}
                  </p>
                )}
                {"upgrade_path" in item && (
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Upgrade Path:
                    </span>{" "}
                    {item.upgrade_path}
                  </p>
                )}
                {"top_picks" in item && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.top_picks.map((entry: string) => (
                      <AccentPill key={entry}>{entry}</AccentPill>
                    ))}
                  </div>
                )}
                {"notable_rewards" in item && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.notable_rewards.map((entry: string) => (
                      <AccentPill key={entry}>{entry}</AccentPill>
                    ))}
                  </div>
                )}
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <section id="pilgrammed-armor-guide" className="scroll-mt-24 bg-white/[0.02] px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <SectionHeading
            eyebrow={modules.pilgrammedArmorGuide.eyebrow}
            title={modules.pilgrammedArmorGuide.title}
            subtitle={modules.pilgrammedArmorGuide.subtitle}
            icon={<Shield className="h-5 w-5" />}
          />
          <SectionIntro>{modules.pilgrammedArmorGuide.intro}</SectionIntro>

          <div className="hidden overflow-x-auto rounded-2xl border border-border scroll-reveal md:block">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.12)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Playstyle</th>
                  <th className="px-4 py-3 font-semibold">Armor</th>
                  <th className="px-4 py-3 font-semibold">How To Get</th>
                  <th className="px-4 py-3 font-semibold">Signature Effect</th>
                  <th className="px-4 py-3 font-semibold">Notable Stats</th>
                  <th className="px-4 py-3 font-semibold">Why Use It</th>
                </tr>
              </thead>
              <tbody>
                {modules.pilgrammedArmorGuide.items.map((item: any) => (
                  <tr
                    key={item.armor}
                    className="border-t border-border align-top"
                  >
                    <td className="px-4 py-4 font-semibold">
                      {item.playstyle}
                    </td>
                    <td className="px-4 py-4 text-[hsl(var(--nav-theme-light))]">
                      {item.armor}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {item.how_to_get}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {item.signature_effect}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {item.notable_stats}
                    </td>
                    <td className="px-4 py-4 leading-6 text-muted-foreground">
                      {item.why_use_it}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 md:hidden">
            {modules.pilgrammedArmorGuide.items.map((item: any) => (
              <SurfaceCard key={item.armor} className="scroll-reveal">
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold">{item.armor}</h3>
                  <AccentPill>{item.playstyle}</AccentPill>
                </div>
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    How To Get:
                  </span>{" "}
                  {item.how_to_get}
                </p>
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Signature Effect:
                  </span>{" "}
                  {item.signature_effect}
                </p>
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Notable Stats:
                  </span>{" "}
                  {item.notable_stats}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.why_use_it}
                </p>
              </SurfaceCard>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
          communityUrl={homepageLinks.discord}
          gameUrl={homepageLinks.game}
        />
      </Suspense>

      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
      />

      <footer className="border-t border-border bg-white/[0.02]">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="mb-2 text-sm text-muted-foreground">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
