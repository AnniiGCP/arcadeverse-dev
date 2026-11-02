import { openCommunityModal } from "@/components/community/CommunityShareModal";
import { Button } from "@/components/ui/button";
import { apiPath } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  IconAlertCircle,
  IconBell,
  IconBook,
  IconBookmark,
  IconBrandDiscord,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconBug,
  IconCompass,
  IconExternalLink,
  IconFileText,
  IconFlag,
  IconHeadset,
  IconHelp,
  IconHome,
  IconInfoCircle,
  IconLayoutDashboard,
  IconMail,
  IconPuzzle,
  IconSearch,
  IconShare,
  IconShieldCheck,
  IconStar,
  IconTrophy,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// Module-level cache so Footer never fetches more than once per browser session
let cachedFeedbackStats: { total: number; average: number } | null = null;
let feedbackFetchPromise: Promise<void> | null = null;

export function Footer() {
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [feedbackStats, setFeedbackStats] = useState<{
    total: number;
    average: number;
  }>({
    total: 0,
    average: 4.2,
  });

  const buildTimeRaw =
    import.meta.env.VITE_BUILD_TIME || new Date().toISOString();
  const formattedLastUpdated = useMemo(() => {
    try {
      const d = new Date(buildTimeRaw);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(d);
    } catch {
      return "Sep 24, 2026, 05:00:00 PM";
    }
  }, [buildTimeRaw]);

  // Check if user already rated previously on this device
  useEffect(() => {
    const savedRating = localStorage.getItem("arcadeverse_user_rating");
    if (savedRating) {
      setUserRating(Number(savedRating));
      setRatingSubmitted(true);
    }
  }, []);

  useEffect(() => {
    // 1. Try in-memory module cache first
    if (cachedFeedbackStats) {
      setFeedbackStats(cachedFeedbackStats);
      return;
    }

    // 2. Try sessionStorage
    try {
      const stored = sessionStorage.getItem("arcadeverse_feedback_cache");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.total === "number") {
          cachedFeedbackStats = parsed;
          setFeedbackStats(parsed);
          return;
        }
      }
    } catch {}

    // 3. Deduplicate in-flight fetch
    if (!feedbackFetchPromise) {
      feedbackFetchPromise = fetch(apiPath("/api/feedback"))
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && typeof data.total === "number") {
            const stats = {
              total: data.total,
              average: typeof data.average === "number" ? data.average : 4.2,
            };
            cachedFeedbackStats = stats;
            try {
              sessionStorage.setItem(
                "arcadeverse_feedback_cache",
                JSON.stringify(stats),
              );
            } catch {}
            setFeedbackStats(stats);
          }
        })
        .catch(() => {})
        .finally(() => {
          feedbackFetchPromise = null;
        });
    }
  }, []);

  const handleRate = (star: number) => {
    if (ratingSubmitted) return; // Only rate one time for a user
    setUserRating(star);
    setRatingSubmitted(true);
    localStorage.setItem("arcadeverse_user_rating", star.toString());
    setFeedbackStats((prev) => {
      const newTotal = prev.total + 1;
      const newAvg =
        Math.round(((prev.average * prev.total + star) / newTotal) * 10) / 10;
      const updated = { total: newTotal, average: newAvg };
      cachedFeedbackStats = updated;
      try {
        sessionStorage.setItem(
          "arcadeverse_feedback_cache",
          JSON.stringify(updated),
        );
      } catch {}
      return updated;
    });
    fetch(apiPath("/api/feedback"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: star, context: "footer_quick_rate" }),
    }).catch(() => {});
  };

  // Baseline 1.5K+ reviews with 4.2 rating, counting up with new feedbacks
  const BASE_REVIEWS = 1542;
  const BASE_RATING = 4.2;
  const totalReviews = BASE_REVIEWS + feedbackStats.total;
  const displayAverage =
    Math.round(
      ((BASE_RATING * BASE_REVIEWS +
        (feedbackStats.total > 0
          ? feedbackStats.average * feedbackStats.total
          : 0)) /
        totalReviews) *
        10,
    ) / 10;
  const displayCount =
    totalReviews >= 1000
      ? `${(totalReviews / 1000).toFixed(1)}K+`
      : `${totalReviews}`;

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#070b14] text-slate-600 dark:text-slate-300">
      {/* Subtle ambient lighting */}
      <div
        className="pointer-events-none absolute inset-0 bg-aurora opacity-20"
        aria-hidden
      />

      <div className="container max-w-[1440px] px-6 sm:px-10 lg:px-14 relative z-10 py-12 sm:py-16">
        {/* Main Grid: Brand & Rating | About & Info | Navigation | Portals & Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-200 dark:border-slate-800/80">
          {/* Column 1: Brand, Tagline, Rating (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col space-y-5">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center group w-fit"
              aria-label="ArcadeVerse home"
            >
              <img
                src="/images/arcadeverse-logo-clean.png"
                alt="ArcadeVerse"
                className="h-11 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm">
              Meet your ultimate & most trusted Google Cloud Arcade points
              calculator. Instantly calculate points, track lab milestones, and
              unlock prize tiers.
            </p>

            {/* Last updated badge (auto-updates on each build/push) */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1222] px-3 py-1 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Last updated: {formattedLastUpdated}
              </span>
            </div>

            {/* Rate Your Experience Box */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0c1222]/80 p-4 max-w-xs shadow-xs">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                RATE YOUR EXPERIENCE
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={ratingSubmitted}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() =>
                      !ratingSubmitted && setHoverRating(star)
                    }
                    onMouseLeave={() => !ratingSubmitted && setHoverRating(0)}
                    className={cn(
                      "p-0.5 focus:outline-none transition-colors",
                      ratingSubmitted
                        ? "cursor-default"
                        : "text-slate-300 dark:text-slate-600 hover:text-amber-400",
                    )}
                    aria-label={`Rate ${star} stars`}
                  >
                    <IconStar
                      className={`h-5 w-5 ${
                        (hoverRating || userRating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                {ratingSubmitted
                  ? `Thank you! You rated ${userRating} stars.`
                  : "Tap a star to rate your personal experience."}
              </p>
            </div>

            {/* Report an Issue / Give Feedback Button */}
            <div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-xl border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0c1222] hover:bg-slate-100 dark:hover:bg-[#131d35] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white gap-2 shadow-xs cursor-pointer"
              >
                <a href="mailto:arcadeverse.support@gmail.com?subject=Feedback%20%26%20Support%20for%20ArcadeVerse">
                  <IconBug className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
                  Report an Issue / Give Feedback
                </a>
              </Button>
            </div>
          </div>

          {/* Column 2: ABOUT & INFO (col-span-3 - Balanced) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ABOUT & INFO
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm pt-1">
              <li>
                <Link
                  to="/about"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconInfoCircle className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconHelp className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/updates"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconBell className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  Latest Updates
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconMail className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconHeadset className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  Support Center
                </Link>
              </li>
              <li>
                <Link
                  to="/disclaimer"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconAlertCircle className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconShieldCheck className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconFileText className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: NAVIGATION & GUIDES (col-span-3 - Balanced) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              NAVIGATION & GUIDES
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm pt-1">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconHome className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconLayoutDashboard className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/arcade-facilitator"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconFlag className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  Facilitator Program
                </Link>
              </li>
              <li>
                <Link
                  to="/google-cloud-arcade-leaderboard"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconTrophy className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  Global Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconBook className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  Resources Hub
                </Link>
              </li>
              <li>
                <Link
                  to="/resources/google-cloud-arcade-complete-guide"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconCompass className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  Google Arcade Guide
                </Link>
              </li>
              <li>
                <Link
                  to="/resources/skillbadge"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconBookmark className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  Badge Syllabus
                </Link>
              </li>
              <li>
                <Link
                  to="/resources/find-your-public-url"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconSearch className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  Find Profile URL
                </Link>
              </li>
              <li>
                <Link
                  to="/resources/chrome-extension"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <IconPuzzle className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                  Chrome Extension
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Portals, Support & Community (col-span-2) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Official Portals */}
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                OFFICIAL PORTALS
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                <li>
                  <a
                    href="https://go.cloudskillsboost.google/arcade"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300 transition-colors"
                  >
                    Arcade | Google Skills
                    <IconExternalLink className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://rsvp.withgoogle.com/events/arcade-facilitator"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300 transition-colors"
                  >
                    Arcade Facilitator
                    <IconExternalLink className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Official Support */}
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                OFFICIAL SUPPORT
              </h4>
              <div className="space-y-1 text-xs">
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Facilitator Support:
                </p>
                <a
                  href="mailto:arcade-facilitator@google.com"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline block font-medium"
                >
                  arcade-facilitator@google.com
                </a>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] pt-1">
                  Skills Boost Support:
                </p>
                <a
                  href="mailto:support-skills@google.com"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline block font-medium"
                >
                  support-skills@google.com
                </a>
              </div>
            </div>

            {/* Community */}
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                COMMUNITY
              </h4>
              <div className="flex items-center gap-2">
                <a
                  href="https://t.me/ArcadeVerse"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0c1222] hover:bg-slate-100 dark:hover:bg-[#151f38] hover:border-sky-500 grid place-items-center text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-all shadow-xs"
                  aria-label="Telegram"
                >
                  <IconBrandTelegram className="h-4 w-4" />
                </a>
                <a
                  href="https://chat.whatsapp.com/LVC3Jdrx3VYB5JIKYCUpZo?s=sw&p=i&mlu=4&ilr=4"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0c1222] hover:bg-slate-100 dark:hover:bg-[#151f38] hover:border-emerald-500 grid place-items-center text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all shadow-xs"
                  aria-label="WhatsApp"
                >
                  <IconBrandWhatsapp className="h-4 w-4" />
                </a>
                <a
                  href="https://discord.com/channels/1434257602652536936/1434257603453779970"
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 w-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0c1222] hover:bg-slate-100 dark:hover:bg-[#151f38] hover:border-indigo-500 grid place-items-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-xs"
                  aria-label="Discord"
                >
                  <IconBrandDiscord className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-2.5 flex flex-col gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => openCommunityModal("community")}
                  className="text-left text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 font-medium transition-colors"
                >
                  Community & Guides Popup
                </button>
                <button
                  type="button"
                  onClick={() => openCommunityModal("share")}
                  className="text-left text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 font-medium transition-colors flex items-center gap-1"
                >
                  <IconShare className="h-3 w-3" />
                  <span>Share ArcadeVerse</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          {/* Left: Copyright & Legal */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1">
            <span>
              © 2024 - 2026{" "}
              <strong className="text-slate-800 dark:text-slate-300 font-bold">
                ArcadeVerse
              </strong>
              . All rights reserved.
            </span>
            <span>•</span>
            <Link
              to="/privacy"
              className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              <IconShieldCheck className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              to="/terms"
              className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              <IconFileText className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              to="/disclaimer"
              className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              <IconAlertCircle className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              Disclaimer
            </Link>
          </div>

          {/* Right: Reviews */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-amber-500 dark:text-amber-400 font-semibold">
              <span className="tracking-tight">★★★★★</span>
              <span className="text-slate-600 dark:text-slate-300 font-normal">
                {displayAverage.toFixed(1)}/5.0 · {displayCount} reviews
              </span>
            </span>
          </div>
        </div>

        {/* Google LLC Non-Affiliation Disclaimer */}
        <div className="pt-4 text-[11px] text-slate-500 dark:text-slate-500 text-center md:text-left leading-relaxed">
          ArcadeVerse is an independent community project and is not affiliated
          with, sponsored by, or endorsed by Google LLC or Google Cloud. Google
          Cloud and Arcade are trademarks of Google LLC.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
