import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CANONICAL_CALCULATION_VERSION } from "@/lib/calculationLogic";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  Copy,
  Download,
  FolderArchive,
  Laptop,
  Puzzle,
  ShieldCheck,
  SlidersHorizontal,
  Terminal,
} from "lucide-react";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

function FAQAccordionItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-background/50 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-hover/50"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-foreground">{q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-border px-5 py-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          {a}
        </div>
      )}
    </div>
  );
}

export function ChromeExtensionPage() {
  const [copiedBrowser, setCopiedBrowser] = useState<string | null>(null);

  const handleCopyBrowserUrl = async (url: string, browserName: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedBrowser(browserName);
      setTimeout(() => setCopiedBrowser(null), 2000);
    } catch {
      // ignore
    }
  };

  const installationSteps = [
    {
      step: "01",
      title: "Download Extension Archive",
      badge: "ZIP Archive",
      description:
        "Download the official ArcadeVerse Extension ZIP package directly to your computer. The archive contains the lightweight Manifest V3 popup interface ready to install.",
      code: null,
      browserUrls: null,
      action: {
        label: "Download Extension (.ZIP)",
        url: "/downloads/arcadeverse-extension.zip",
        isDownload: true,
      },
      icon: Download,
      gradient:
        "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30",
    },
    {
      step: "02",
      title: "Extract the Downloaded ZIP",
      badge: "Local Folder",
      description:
        "Locate the downloaded `arcadeverse-extension.zip` in your Downloads folder and extract it. Ensure the extracted folder contains `manifest.json` and `popup.html` at its top level.",
      code: null,
      browserUrls: null,
      action: null,
      icon: FolderArchive,
      gradient:
        "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30",
    },
    {
      step: "03",
      title: "Open Browser Extensions Page",
      badge: "Chrome, Brave, Edge & Firefox",
      description:
        "Open your browser and paste the corresponding management address below into your URL address bar:",
      code: null,
      browserUrls: [
        { name: "Chrome", url: "chrome://extensions/" },
        { name: "Brave", url: "brave://extensions/" },
        { name: "Edge", url: "edge://extensions/" },
        { name: "Firefox", url: "about:debugging#/runtime/this-firefox" },
      ],
      action: null,
      icon: Laptop,
      gradient:
        "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      step: "04",
      title: "Enable Developer Mode",
      badge: "Developer Toggle",
      description:
        "Chrome, Brave & Edge: Toggle the 'Developer mode' switch in the top-right corner to ON. Firefox: Click 'This Firefox' on the left navigation sidebar.",
      code: null,
      browserUrls: null,
      action: null,
      icon: SlidersHorizontal,
      gradient:
        "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
    },
    {
      step: "05",
      title: "Load Unpacked Extension",
      badge: "Load Unpacked",
      description:
        "Chrome, Brave & Edge: Click 'Load unpacked' in the top-left toolbar and select the extracted folder. Firefox: Click 'Load Temporary Add-on...' and select the `manifest.json` file inside the folder.",
      code: null,
      browserUrls: null,
      action: null,
      icon: FolderArchive,
      gradient:
        "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30",
    },
    {
      step: "06",
      title: "Pin ArcadeVerse to Your Toolbar",
      badge: "Toolbar Access",
      description:
        "Click the puzzle piece icon (Extensions) in your browser toolbar, find 'ArcadeVerse — Arcade Points Calculator', and pin it for instant 1-click access anytime.",
      code: null,
      browserUrls: null,
      action: null,
      icon: Puzzle,
      gradient:
        "from-purple-500/20 to-fuchsia-500/20 text-purple-400 border-purple-500/30",
    },
  ];

  const faqs = [
    {
      q: "Does the Extension calculate the exact same points as the ArcadeVerse Dashboard?",
      a: "Yes, 100%. The ArcadeVerse Dashboard and the Extension both execute the exact same Canonical Calculation Engine (Engine v2026.1). Badge parsing, game multipliers, skill point halves, and Facilitator milestone bonuses are identical across both interfaces.",
    },
    {
      q: "Do I need to enter my Google account password or login?",
      a: "Never. The extension only uses your publicly accessible Google Cloud Skills Boost profile URL (e.g. skills.google/public_profiles/...). It never requests Google logins, passwords, session tokens, or private browsing data.",
    },
    {
      q: "Does the extension automatically detect my profile URL?",
      a: "Yes! If you open the ArcadeVerse popup while viewing your Google Cloud Skills Boost public profile in your active browser tab, the extension will automatically detect your URL and show a 1-click 'Use This URL' button.",
    },
    {
      q: "Why do I need to enable Developer Mode to install?",
      a: "Because the extension is distributed as an open-source unpacked package. Developer Mode is the built-in browser mechanism to load unpacked extensions directly from your local drive with full security and zero third-party telemetry.",
    },
    {
      q: "Can I use the extension on Brave, Microsoft Edge, or Firefox?",
      a: "Yes! The extension is fully compatible with Chrome, Brave (brave://extensions/), Microsoft Edge (edge://extensions/), and Firefox (about:debugging#/runtime/this-firefox). Follow Step 3 to navigate to your browser's extensions page and load the extracted folder.",
    },
    {
      q: "What should I do if my points don't match or look outdated?",
      a: "Google Cloud Skills Boost public profiles typically take a few minutes to index freshly completed lab badges. Click the 'Refresh' button in the extension popup to fetch the latest public profile state.",
    },
  ];

  const structuredFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <Helmet>
        <title>
          ArcadeVerse Chrome Extension | Official Installation & Parity Guide
        </title>
        <meta
          name="description"
          content="Official guide to installing and using the ArcadeVerse Chrome Extension. Calculate Google Cloud Arcade points and Facilitator milestones with 100% Dashboard parity."
        />
        <link
          rel="canonical"
          href="https://arcadeverse.vercel.app/resources/chrome-extension"
        />
        <meta
          property="og:title"
          content="ArcadeVerse Chrome Extension | Official Installation Guide"
        />
        <meta
          property="og:description"
          content="Calculate Google Cloud Arcade points and Facilitator milestones directly inside your browser with 100% calculation parity."
        />
        <meta
          property="og:url"
          content="https://arcadeverse.vercel.app/resources/chrome-extension"
        />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify(structuredFaqSchema)}
        </script>
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Link
            to="/resources"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Resources</span>
          </Link>
          <span>/</span>
          <span className="text-foreground">Chrome Extension Guide</span>
        </div>

        {/* HERO SECTION */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-purple-950/20 via-surface-card to-background p-6 sm:p-10 lg:p-12 shadow-xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-medium text-purple-400">
                <Puzzle className="h-3.5 w-3.5 text-purple-400" />
                <span>
                  Official Chrome Extension &bull; Engine v
                  {CANONICAL_CALCULATION_VERSION}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading">
                ArcadeVerse{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                  Chrome Extension
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Use the official ArcadeVerse Chrome Extension to calculate and
                monitor your Google Cloud Arcade Points, Game & Skill badges,
                and Facilitator Cohort milestones directly inside your
                browser—with guaranteed 100% parity with the ArcadeVerse
                Dashboard.
              </p>

              {/* Parity Guarantee Callout */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5 text-emerald-400" />
                <div>
                  <strong className="font-semibold text-emerald-200">
                    Single Source of Truth:
                  </strong>{" "}
                  The ArcadeVerse Chrome Extension uses the exact same
                  calculation engine as the ArcadeVerse Dashboard, so your
                  Arcade Points, swag tier, and Facilitator progress remain 100%
                  consistent across both.
                </div>
              </div>

              {/* Download & Actions CTA */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="/downloads/arcadeverse-extension.zip"
                  download="arcadeverse-extension.zip"
                >
                  <Button className="h-11 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-900/30 gap-2">
                    <Download className="h-4 w-4" />
                    <span>Download Extension (.ZIP)</span>
                  </Button>
                </a>

                <Link to="/#calculator">
                  <Button
                    variant="ghost"
                    className="h-11 px-4 text-muted-foreground hover:text-foreground gap-1.5"
                  >
                    <span>Open Web Calculator</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Extension Animated GIF Cover */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl border border-purple-500/30 bg-surface-card/60 p-2.5 shadow-2xl backdrop-blur-sm group">
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-black/40">
                  <picture>
                    <source
                      srcSet="/images/resources/chrome-extension-cover.webp"
                      type="image/webp"
                    />
                    <img
                      src="/images/resources/chrome-extension-cover.gif"
                      alt="ArcadeVerse Chrome Extension Animated Cover"
                      className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      loading="eager"
                      decoding="async"
                    />
                  </picture>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-white drop-shadow">
                      Arcade Companion
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-600/90 text-white text-[10px] font-mono">
                      v2026.1
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INSTALLATION GUIDE SECTION (MANUAL ZIP ONLY) */}
        <section className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-border pb-5">
            <h2 className="text-xl sm:text-2xl font-bold font-heading">
              Installation Guide
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Follow this step-by-step walkthrough to install the unpacked
              extension in under 60 seconds.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs sm:text-sm flex items-start gap-3">
            <Terminal className="h-5 w-5 shrink-0 text-blue-400 mt-0.5" />
            <div>
              <strong className="font-semibold text-blue-200">
                Manual Installation via Developer Mode:
              </strong>{" "}
              The extension runs directly on your computer from the downloaded
              source folder with full transparency and zero third-party
              tracking.
            </div>
          </div>

          {/* Step By Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {installationSteps.map((stepItem) => (
              <div
                key={stepItem.step}
                className="relative rounded-xl border border-border bg-background/50 p-6 flex flex-col justify-between space-y-4 shadow-sm hover:border-purple-500/30 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-purple-400/80 font-mono">
                      {stepItem.step}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      {stepItem.badge}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-lg border bg-surface-card ${stepItem.gradient}`}
                    >
                      <stepItem.icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground font-heading">
                      {stepItem.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {stepItem.description}
                  </p>

                  {stepItem.browserUrls && (
                    <div className="mt-3 space-y-2">
                      {stepItem.browserUrls.map((b) => (
                        <div
                          key={b.name}
                          className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface-card border border-border text-xs"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-semibold text-foreground text-[11px] shrink-0">
                              {b.name}:
                            </span>
                            <code className="text-purple-300 font-mono text-[11px] truncate">
                              {b.url}
                            </code>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyBrowserUrl(b.url, b.name)}
                            className="p-1 rounded hover:bg-surface-hover text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                            title={`Copy ${b.name} URL`}
                          >
                            {copiedBrowser === b.name ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {stepItem.action && (
                  <div className="pt-2">
                    <a
                      href={stepItem.action.url}
                      download={
                        stepItem.action.isDownload
                          ? "arcadeverse-extension.zip"
                          : undefined
                      }
                    >
                      <Button
                        size="sm"
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs gap-1.5"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>{stepItem.action.label}</span>
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FAQS SECTION */}
        <section className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-heading">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Everything you need to know about security, updates, and
              compatibility.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQAccordionItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* RELATED GUIDES & TOOLS */}
        <section className="rounded-2xl border border-border bg-gradient-to-r from-accent-purple/10 via-surface-card to-blue-500/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card-premium">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-accent-purple bg-accent-purple/10 px-2.5 py-1 rounded border border-accent-purple/20">
              RELATED GUIDES & TOOLS
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-2 font-heading">
              Explore More ArcadeVerse Tools
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              Prefer using our browser-based points calculator or need help
              finding your Skills Boost profile URL? Check out our step-by-step
              guides.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-md"
            >
              <Link to="/">
                <span>Open Points Calculator</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-border bg-surface-card"
            >
              <Link to="/resources/find-your-public-url">
                <span>Find Profile URL Guide</span>
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
