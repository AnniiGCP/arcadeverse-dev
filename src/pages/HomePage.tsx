import { HeroSection } from "@/components/HeroSection";
import { PointsCalculator } from "@/components/PointsCalculator";
import { apiPath } from "@/lib/api";
import { Suspense, lazy, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
const FeaturesSection = lazy(() =>
  import("@/components/FeaturesSection").then((module) => ({
    default: module.FeaturesSection,
  })),
);
const HowToJoinSection = lazy(() =>
  import("@/components/HowToJoinSection").then((module) => ({
    default: module.HowToJoinSection,
  })),
);
const TopPerformersSection = lazy(() =>
  import("@/components/TopPerformersSection").then((module) => ({
    default: module.TopPerformersSection,
  })),
);
const WhatsChangingSection = lazy(() =>
  import("@/components/WhatsChangingSection").then((module) => ({
    default: module.WhatsChangingSection,
  })),
);
const ContactSection = lazy(() =>
  import("@/components/ContactSection").then((module) => ({
    default: module.ContactSection,
  })),
);

const INITIAL_VISITORS = 3731;
const INITIAL_ACCOUNTS_ANALYZED = 3361;

// Fallback keeps layout height stable while lazy sections load.
const LazyLoadFallback = () => (
  <div className="container flex h-64 items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent-purple" />
  </div>
);

export function HomePage() {
  const [visitorCount, setVisitorCount] = useState<number>(INITIAL_VISITORS);
  const [accountsAnalyzed, setAccountsAnalyzed] = useState<number>(
    INITIAL_ACCOUNTS_ANALYZED,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Listen for global visitor & calculation tracking updates from across the site
    const handleStatsUpdate = (event: Event) => {
      const data = (event as CustomEvent).detail;
      if (isMounted && data) {
        if (typeof data.visitors === "number") setVisitorCount(data.visitors);
        if (typeof data.profilesAnalyzed === "number")
          setAccountsAnalyzed(data.profilesAnalyzed);
        setIsLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("arcadeverse_stats_updated", handleStatsUpdate);
    }

    // Fetch verified stats for instant display
    fetch(apiPath("/api/stats"))
      .then((res) => (res.ok ? res.json() : null))
      .then((sData) => {
        if (isMounted && sData) {
          if (typeof sData?.visitors === "number") {
            setVisitorCount(sData.visitors);
          }
          if (typeof sData?.profilesAnalyzed === "number") {
            setAccountsAnalyzed(sData.profilesAnalyzed);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "arcadeverse_stats_updated",
          handleStatsUpdate,
        );
      }
    };
  }, []);

  const incrementAccountsAnalyzed = () => {
    // badgeService.calculatePoints already increments /api/profile-analyzed atomically on success.
    // Fetch latest verified stats from MongoDB to avoid duplicate counter increment.
    fetch(apiPath("/api/stats"))
      .then((res) => res.json())
      .then((data) => {
        if (typeof data?.profilesAnalyzed === "number") {
          setAccountsAnalyzed(data.profilesAnalyzed);
        }
      })
      .catch(() => {
        // Retain current count on network failure
      });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>
          Google Cloud Arcade Points Calculator & Progress Tracker | ArcadeVerse
        </title>
        <meta
          name="description"
          content="ArcadeVerse is an independent Google Cloud Arcade points calculator and progress tracker. Calculate points from public profiles, track badges, monitor Facilitator milestones, and plan prize tier rewards."
        />
        <link rel="canonical" href="https://arcadeverse.vercel.app/" />
      </Helmet>

      <HeroSection />
      <PointsCalculator onProfileScanned={incrementAccountsAnalyzed} />
      <Suspense fallback={<LazyLoadFallback />}>
        <FeaturesSection />
        <HowToJoinSection />
        <WhatsChangingSection />
        <TopPerformersSection />
        <ContactSection
          visitorCount={visitorCount}
          accountsAnalyzed={accountsAnalyzed}
          isLoadingStats={isLoading}
        />
      </Suspense>
    </div>
  );
}
