import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useEffect } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  canonicalPath?: string;
  noIndex?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
  ogType?: "website" | "article";
  ogImage?: string;
}

const SITE_URL = "https://arcadeverse.vercel.app";
const DEFAULT_OG_IMAGE = "https://arcadeverse.vercel.app/images/og-preview.png";

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    if (attrs.name) tag.setAttribute("name", attrs.name);
    if (attrs.property) tag.setAttribute("property", attrs.property);
    document.head.appendChild(tag);
  }
  Object.entries(attrs).forEach(([key, value]) =>
    tag?.setAttribute(key, value),
  );
}

export function MainLayout({
  children,
  title = "ArcadeVerse",
  description = "Calculate your Google Cloud Skills Boost Arcade points",
  canonicalPath,
  noIndex = false,
  structuredData,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
}: MainLayoutProps) {
  useEffect(() => {
    document.title = title;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:type"]', {
      property: "og:type",
      content: ogType,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: ogImage,
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: "ArcadeVerse",
    });
    upsertMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: "en_US",
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:site"]', {
      name: "twitter:site",
      content: "@ArcadeVerse",
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: ogImage,
    });

    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noIndex ? "noindex, nofollow" : "index, follow",
    });

    // Canonical & og:url management
    const canonicalTag = document.head.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (noIndex) {
      if (canonicalTag) canonicalTag.remove();
    } else {
      const rawPath = canonicalPath || window.location.pathname;
      const cleanPath = rawPath.replace(/\/+$/, "") || "/";
      const canonicalHref =
        cleanPath === "/" ? `${SITE_URL}/` : `${SITE_URL}${cleanPath}`;

      let activeCanonical = canonicalTag;
      if (!activeCanonical) {
        activeCanonical = document.createElement("link");
        activeCanonical.rel = "canonical";
        document.head.appendChild(activeCanonical);
      }
      activeCanonical.href = canonicalHref;

      upsertMeta('meta[property="og:url"]', {
        property: "og:url",
        content: canonicalHref,
      });
    }
  }, [title, description, canonicalPath, noIndex, ogType, ogImage]);

  useEffect(() => {
    const existing = document.getElementById("layout-structured-data");
    if (existing) existing.remove();
    if (!structuredData) return;

    const script = document.createElement("script");
    script.id = "layout-structured-data";
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById("layout-structured-data");
      if (el) el.remove();
    };
  }, [structuredData]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased w-full max-w-full min-w-0 overflow-x-clip">
      <Header />
      <main
        id="main-content"
        className="flex-1 w-full max-w-full min-w-0 bg-background text-foreground"
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
