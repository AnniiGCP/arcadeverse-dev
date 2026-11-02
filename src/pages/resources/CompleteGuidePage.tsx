import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  ExternalLink,
  FileText,
  Flame,
  Gamepad2,
  Gift,
  HelpCircle,
  Layers,
  Puzzle,
  Search,
  ShieldAlert,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const SWAG_TIERS = [
  {
    name: "Trooper Tier",
    tier: "Tier #01",
    points: 50,
    slots: "6,000 slots",
    image: "/images/swag/trooper.png",
    color: "border-blue-500/40 bg-blue-500/5",
    badgeColor:
      "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
    description:
      "The foundation tier featuring official Google Cloud collectibles, stickers, badges, and essentials.",
  },
  {
    name: "Ranger Tier",
    tier: "Tier #02",
    points: 75,
    slots: "4,000 slots",
    image: "/images/swag/ranger.png",
    color: "border-emerald-500/40 bg-emerald-500/5",
    badgeColor:
      "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    description:
      "Mid-level milestone tier featuring premium drinkware, tech accessories, and limited-edition swag.",
  },
  {
    name: "Champion Tier",
    tier: "Tier #03",
    points: 95,
    slots: "3,000 slots",
    image: "/images/swag/champion.png",
    color: "border-purple-500/40 bg-purple-500/5",
    badgeColor:
      "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30",
    description:
      "Advanced tier packed with Google Cloud branded apparel, premium backpack, and specialty gadgets.",
  },
  {
    name: "Legend Tier",
    tier: "Top Tier #04",
    points: 120,
    slots: "2,500 slots",
    image: "/images/swag/legend.png",
    color: "border-amber-500/40 bg-amber-500/5",
    badgeColor:
      "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
    description:
      "Top-tier master pack with the full executive swag bundle, heavy-duty hoodie, exclusive jacket, and collectibles.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is Google Cloud Arcade completely free to join?",
    answer:
      "Yes. Joining Google Cloud Arcade is 100% free. You can earn badges through free monthly game codes, lab-free courses, and special campaign events without paying for subscriptions.",
  },
  {
    question: "How do I ensure my completed badges are counted by ArcadeVerse?",
    answer:
      "Your Google Cloud Skills Boost profile MUST be set to public. If your profile is private, external tools and Arcade verification systems cannot inspect your earned badges. Navigate to Settings -> Make Profile Public and copy your unique public profile URL into the ArcadeVerse calculator.",
  },
  {
    question: "Do Facilitator Program milestone bonuses stack?",
    answer:
      "No. In the Google Cloud Arcade Facilitator Program, milestone bonus points are awarded for your single highest achieved milestone only (e.g., reaching Milestone 3 awards +25 bonus points, not +5 + +15 + +25).",
  },
  {
    question:
      "When does the 2026 Arcade season end and prize redemption begin?",
    answer:
      "Google Cloud Arcade runs in two semi-annual seasons (Season 1 typically Jan–June and Season 2 July–December). At the conclusion of each season, points freeze and the official Prize Counter opens where participants redeem their points for eligible swag kits via the Waterfall claim system.",
  },
  {
    question: "What is the difference between a Game Badge and a Skill Badge?",
    answer:
      "Game Badges are time-limited challenges (usually 6 released per month) worth 1.0 point each that expire at month-end. Skill Badges are hands-on lab credentials worth 0.5 points each (2 badges = 1 point) available all season long with an assessment challenge at the end.",
  },
];

export function CompleteGuidePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    // If a hash is present on initial load, scroll smoothly to the target section
    if (window.location.hash) {
      const targetId = window.location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          const yOffset = -90;
          const y =
            el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 150);
    }
  }, []);

  const canonicalUrl =
    "https://arcadeverse.vercel.app/resources/google-cloud-arcade-complete-guide";

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <Helmet>
        <title>
          Google Cloud Arcade Complete Guide 2026 | Points, Badges & Rewards |
          ArcadeVerse
        </title>
        <meta
          name="description"
          content="The comprehensive 2026 guide to Google Cloud Arcade. Master point calculation rules, Game vs Skill badges, Facilitator milestones (+45 Pts), prize swag tiers, and tracking roadmap."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content="Google Cloud Arcade Complete Guide 2026 | ArcadeVerse"
        />
        <meta
          property="og:description"
          content="Master the Google Cloud Arcade 2026 points system, Facilitator milestones, Game vs Skill badges, and prize redemption."
        />
        <meta property="og:url" content={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Google Cloud Arcade Complete Guide 2026",
            description:
              "Complete master guide explaining Google Cloud Arcade point calculations, Facilitator milestones, badge catalogs, and prize tiers.",
            author: {
              "@type": "Organization",
              name: "ArcadeVerse",
              url: "https://arcadeverse.vercel.app",
            },
            publisher: {
              "@type": "Organization",
              name: "ArcadeVerse",
            },
            mainEntityOfPage: canonicalUrl,
          })}
        </script>
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
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
          <span className="text-accent-purple">Complete Guide 2026</span>
        </div>

        {/* Section 1: Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3 py-1 text-xs font-medium text-accent-purple">
            <Zap className="h-3.5 w-3.5" />
            <span>THE DEFINITIVE 2026 ROADMAP</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-display leading-tight">
              Google Cloud Arcade Complete Guide 2026
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Everything you need to master Google Cloud Arcade in one place:
              program structure, points calculation rules, Game vs. Skill
              badges, Facilitator cohort milestones, swag tier unlocks, and
              common pitfalls.
            </p>
          </div>

          {/* CTAs Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 shadow-md"
            >
              <Link to="/">
                <span>Calculate My Points</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border bg-surface-card hover:bg-surface-hover"
            >
              <Link to="/resources">
                <Compass className="mr-1.5 h-4 w-4" />
                <span>Explore Resources Hub</span>
              </Link>
            </Button>
          </div>

          {/* Quick Stats Grid Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/60">
            <div className="rounded-xl border border-border/80 bg-surface-card p-4 space-y-1">
              <span className="text-xs font-mono text-muted-foreground uppercase">
                Game Badges
              </span>
              <p className="text-xl font-bold text-amber-500">1.0 Pt Each</p>
              <p className="text-[11px] text-muted-foreground">
                Monthly released games
              </p>
            </div>
            <div className="rounded-xl border border-border/80 bg-surface-card p-4 space-y-1">
              <span className="text-xs font-mono text-muted-foreground uppercase">
                Skill Badges
              </span>
              <p className="text-xl font-bold text-blue-500">0.5 Pt Each</p>
              <p className="text-[11px] text-muted-foreground">
                2 Skill Badges = 1 Pt
              </p>
            </div>
            <div className="rounded-xl border border-border/80 bg-surface-card p-4 space-y-1">
              <span className="text-xs font-mono text-muted-foreground uppercase">
                Facilitator
              </span>
              <p className="text-xl font-bold text-purple-500">Up to +45 Pts</p>
              <p className="text-[11px] text-muted-foreground">
                Cohort milestone bonuses
              </p>
            </div>
            <div className="rounded-xl border border-border/80 bg-surface-card p-4 space-y-1">
              <span className="text-xs font-mono text-muted-foreground uppercase">
                Swag Tiers
              </span>
              <p className="text-xl font-bold text-emerald-500">4 Tiers</p>
              <p className="text-[11px] text-muted-foreground">
                Trooper to Legend (50–120 Pts)
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section 3: Getting Started */}
        <section id="getting-started" className="space-y-6 pt-4 scroll-mt-28">
          <div className="border-b border-border/60 pb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-display flex items-center gap-2">
              <Compass className="h-6 w-6 text-accent-purple" />
              <span>1. Getting Started with Google Cloud Arcade</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Follow these four essential onboarding steps to properly set up
              your Google Cloud Skills profile and begin tracking progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-card-premium space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 font-mono font-bold text-sm border border-blue-500/30">
                  01
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  Create Your Google Account
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ensure you have an active personal Google Account. We recommend
                using a personal email rather than a corporate or school account
                to avoid permission restrictions or organization policy
                firewalls on labs.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-card-premium space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 font-mono font-bold text-sm border border-emerald-500/30">
                  02
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  Make Your Skills Profile Public
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sign in to{" "}
                <span className="font-semibold text-foreground">
                  skills.google.com
                </span>{" "}
                or{" "}
                <span className="font-semibold text-foreground">
                  cloudskillsboost.google
                </span>
                , navigate to Settings, and toggle{" "}
                <strong>Make Profile Public</strong>. Without this step, neither
                Arcade nor ArcadeVerse can calculate your points.
              </p>
              <Link
                to="/resources/find-your-public-url"
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent-purple hover:underline"
              >
                <span>Read Profile URL Guide</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-card-premium space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 font-mono font-bold text-sm border border-purple-500/30">
                  03
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  Subscribe to Arcade Cohort Updates
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Subscribe to official Arcade updates at{" "}
                <span className="font-semibold text-foreground">
                  go.cloudskillsboost.google/arcade
                </span>
                . This ensures you receive monthly game release codes, trivia
                alerts, and prize redemption notifications.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-card-premium space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 font-mono font-bold text-sm border border-amber-500/30">
                  04
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  Pick Your Learning Track
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Start with monthly Game Badges (1 Pt each) since they expire at
                the end of the month. Then tackle evergreen Skill Badges (0.5 Pt
                each) to steadily accumulate points toward your target prize
                tier.
              </p>
              <Link
                to="/resources/syllabus"
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent-purple hover:underline"
              >
                <span>Explore Active 2026 Syllabus</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 4: Understanding the Program */}
        <section
          id="understanding-program"
          className="space-y-6 pt-4 scroll-mt-28"
        >
          <div className="border-b border-border/60 pb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-display flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-500" />
              <span>2. Understanding the Arcade Program Structure</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              How Google Cloud Arcade operates, how seasons work, and what makes
              it different from standard certification learning.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-card-premium space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-foreground">
                The Gamified Cloud Learning Ecosystem
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Google Cloud Arcade is a free, gamified learning campaign
                powered by Google Cloud Skills Boost. Instead of dry textbook
                study, participants launch real Google Cloud temporary sandboxes
                to build, deploy, and configure cloud infrastructure, AI models,
                BigQuery data pipelines, and Kubernetes clusters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-base">
                  <Clock className="h-4 w-4" />
                  <span>Season 1 (Jan – June)</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  The first 6-month seasonal cohort. Features monthly game
                  badges (Jan–June), special Work Meets Play series, and opens
                  the mid-year Prize Counter in June/July for accumulated
                  points.
                </p>
              </div>

              <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-5 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-base">
                  <Clock className="h-4 w-4" />
                  <span>Season 2 (July – Dec)</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  The second 6-month cohort running from July through December.
                  Points reset between seasons so all participants start on a
                  level playing field. Features the annual Facilitator Program
                  cohort.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/80 p-5 space-y-2">
              <p className="text-xs font-mono font-bold uppercase text-accent-purple">
                KEY PROGRAM RULE
              </p>
              <p className="text-sm text-foreground/90 leading-relaxed">
                <strong>Points are seasonal:</strong> Points earned in Season 1
                cannot be carried over to Season 2. Always redeem your points
                when the official Prize Counter opens at the end of each season.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Arcade Points Explained */}
        <section id="points-explained" className="space-y-6 pt-4 scroll-mt-28">
          <div className="border-b border-border/60 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-display flex items-center gap-2">
                <Zap className="h-6 w-6 text-amber-500" />
                <span>3. Arcade Points System Explained</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                How every badge type converts into Arcade Points and how total
                scores are determined.
              </p>
            </div>
            <Link
              to="/resources/point-system"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent-purple hover:underline"
            >
              <span>View Full Points Breakdown</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-amber-500/30 bg-surface-card p-6 shadow-card-premium space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                  1.0 PT / BADGE
                </span>
                <Gamepad2 className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Game & Trivia Badges
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                6 new game badges and themed trivia challenges are published
                each month. Every completion grants 1 full Arcade point.
              </p>
              <p className="text-xs text-amber-400 font-semibold">
                ⚠️ Time-sensitive: Monthly expiry.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-500/30 bg-surface-card p-6 shadow-card-premium space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                  0.5 PTS / BADGE
                </span>
                <Award className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Skill Badges
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hands-on lab badges ending in an assessment challenge. Each
                badge awards 0.5 points (2 Skill Badges = 1 Arcade Point).
              </p>
              <p className="text-xs text-blue-400 font-semibold">
                ✅ Evergreen: 95+ badges available anytime.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-500/30 bg-surface-card p-6 shadow-card-premium space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-purple-400 bg-purple-400/10 px-2.5 py-1 rounded-md border border-purple-400/20">
                  UP TO +45 BONUS
                </span>
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Facilitator Milestones
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Learners enrolled in the official Facilitator cohort earn up to
                +35 milestone bonus points plus +10 for the bonus task.
              </p>
              <p className="text-xs text-purple-400 font-semibold">
                ⭐ Highest single milestone awards bonus.
              </p>
            </div>
          </div>

          {/* Quick Points Formula Card */}
          <div className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-card-premium space-y-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent-purple" />
              <span>Standard Arcade Points Formula</span>
            </h3>
            <div className="rounded-xl border border-border/80 bg-background/90 p-4 font-mono text-xs sm:text-sm text-foreground/90 space-y-2">
              <p>
                <strong>Total Score</strong> = (Game Badges × 1.0) + (Trivia
                Badges × 1.0) + (Skill Badges × 0.5) + (Work Meets Play Badges ×
                1.0) + (Facilitator Bonus)
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Game vs Skill Badges */}
        <section id="badges-breakdown" className="space-y-6 pt-4 scroll-mt-28">
          <div className="border-b border-border/60 pb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-display flex items-center gap-2">
              <Layers className="h-6 w-6 text-emerald-500" />
              <span>4. Game Badges vs. Skill Badges</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Understanding the key structural and scoring differences between
              badge categories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Game Badges */}
            <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-card-premium space-y-4">
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-amber-400" />
                <h3 className="text-lg font-bold text-foreground">
                  Game Badges (1.0 Point Each)
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Format:</strong> Guided interactive labs with
                    specific storytelling or scenario themes.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Availability:</strong> Released in monthly batches
                    (6 per month).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Expiry:</strong> Must be completed before the end of
                    the designated month.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Access Codes:</strong> Usually unlocked via official
                    monthly promotional codes.
                  </span>
                </li>
              </ul>
            </div>

            {/* Skill Badges */}
            <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-card-premium space-y-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-bold text-foreground">
                  Skill Badges (0.5 Points Each)
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Format:</strong> Curriculum of 3–5 instructional
                    labs ending in an unguided Challenge Lab.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Availability:</strong> Over 95+ skill badges
                    available continuously in the catalog.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Expiry:</strong> No monthly deadline; can be
                    completed anytime within the season.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Credential:</strong> Awards official Google Cloud
                    verifiable credential on Credly / Skills Boost.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 7: Facilitator Program & Bonus Milestones */}
        <section
          id="facilitator-milestones"
          className="space-y-6 pt-4 scroll-mt-28"
        >
          <div className="border-b border-border/60 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-display flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-400" />
                <span>5. Arcade Facilitator Program & Bonus Milestones</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Official milestone criteria, bonus point mechanics, and
                eligibility guidelines.
              </p>
            </div>
            <Link
              to="/arcade-facilitator"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent-purple hover:underline"
            >
              <span>Explore Facilitator Hub</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-purple-500/30 bg-surface-card p-6 sm:p-8 shadow-card-premium space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-foreground">
                Cohort Milestone Breakdown
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Arcade Facilitator Program is a special mentored cohort.
                Enrolled participants complete designated combinations of Game
                Badges and Skill Badges within the cohort window to unlock
                significant bonus points toward swag tiers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-2">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase">
                  Milestone 1
                </span>
                <p className="text-xl font-extrabold text-foreground font-display">
                  +5 Bonus Pts
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Requires <strong>6 Game Badges</strong> +{" "}
                  <strong>18 Skill Badges</strong>.
                </p>
              </div>

              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-2">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase">
                  Milestone 2
                </span>
                <p className="text-xl font-extrabold text-foreground font-display">
                  +15 Bonus Pts
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Requires <strong>8 Game Badges</strong> +{" "}
                  <strong>34 Skill Badges</strong>.
                </p>
              </div>

              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-2">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase">
                  Milestone 3
                </span>
                <p className="text-xl font-extrabold text-foreground font-display">
                  +25 Bonus Pts
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Requires <strong>10 Game Badges</strong> +{" "}
                  <strong>50 Skill Badges</strong>.
                </p>
              </div>

              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-2">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase">
                  Milestone 4 (Max)
                </span>
                <p className="text-xl font-extrabold text-foreground font-display">
                  +35 Bonus Pts
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Requires <strong>12 Game Badges</strong> +{" "}
                  <strong>66 Skill Badges</strong>.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 space-y-1">
              <p className="text-xs font-bold text-purple-300">
                🚀 Bonus Task (+10 Points):
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Completing the hands-on Vertex AI Bonus Task adds an extra{" "}
                <strong>+10 Bonus Points</strong> to any achieved milestone,
                bringing the maximum possible Facilitator bonus to{" "}
                <strong>+45 Points</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Section 8: Tracking Progress with ArcadeVerse */}
        <section id="tracking-progress" className="space-y-6 pt-4 scroll-mt-28">
          <div className="border-b border-border/60 pb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-display flex items-center gap-2">
              <Search className="h-6 w-6 text-blue-500" />
              <span>6. Tracking Your Progress with ArcadeVerse</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Stop maintaining manual spreadsheets. Let ArcadeVerse parse and
              calculate your standing in seconds.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-card-premium space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase">
                  AUTOMATED PARSING
                </span>
                <h3 className="text-base font-bold text-foreground">
                  Zero Manual Entry
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Simply paste your public Google Cloud Skills Boost profile
                  URL. ArcadeVerse fetches and analyzes your complete badge
                  catalog automatically.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase">
                  PARITY AUDITING
                </span>
                <h3 className="text-base font-bold text-foreground">
                  Exact Milestone Math
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Calculates your exact points across Monthly Games, Skill
                  Badges, Work Meets Play series, and Facilitator milestone
                  tiers.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  TIER PREDICTOR
                </span>
                <h3 className="text-base font-bold text-foreground">
                  Swag Tier Unlocks
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Visual progress bars indicate exactly how many points and
                  badges you still need to reach Trooper, Ranger, Champion, or
                  Legend tiers.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                Ready to check your standings? Launch the live calculator now.
              </p>
              <Button
                asChild
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Link to="/">Launch Points Calculator</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Section 9: Prize Tiers & Rewards */}
        <section id="prize-tiers" className="space-y-6 pt-4 scroll-mt-28">
          <div className="border-b border-border/60 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-display flex items-center gap-2">
                <Trophy className="h-6 w-6 text-amber-500" />
                <span>7. Arcade Prize Tiers & Reward Thresholds</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Reach these cumulative point milestones during the season to
                unlock official Google Cloud swag kits.
              </p>
            </div>
            <Link
              to="/resources/swag-tiers"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent-purple hover:underline"
            >
              <span>View Past Swag Showcase</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SWAG_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border ${tier.color} p-5 shadow-card-premium flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="w-full h-40 rounded-xl bg-surface-hover/50 dark:bg-[#080c16] border border-border/50 p-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={tier.image}
                      alt={tier.name}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      {tier.tier}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full border ${tier.badgeColor}`}
                    >
                      {tier.slots}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground">
                    {tier.name}
                  </h3>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-foreground font-display">
                      {tier.points}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground uppercase">
                      PTS REQUIRED
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tier.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border/50">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full text-xs font-semibold"
                  >
                    <Link to="/#calculator">Check Eligibility</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 10: Common Mistakes & Troubleshooting */}
        <section id="troubleshooting" className="space-y-6 pt-4 scroll-mt-28">
          <div className="border-b border-border/60 pb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-display flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-rose-500" />
              <span>8. Common Mistakes and Troubleshooting</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Avoid these frequent errors that cause missing points or profile
              parsing failures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-rose-500/20 bg-surface-card p-6 shadow-card-premium space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <ShieldAlert className="h-5 w-5" />
                <span>Mistake #1: Private Profile Setting</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                If your profile is set to private, the Google Cloud Skills Boost
                API blocks external access. Always go to Skills Boost Settings
                and set your profile to <strong>Public</strong>.
              </p>
            </div>

            <div className="rounded-2xl border border-rose-500/20 bg-surface-card p-6 shadow-card-premium space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <ShieldAlert className="h-5 w-5" />
                <span>Mistake #2: Wrong Profile URL</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Ensure your URL matches{" "}
                <code className="bg-background px-1.5 py-0.5 rounded text-foreground font-mono text-xs">
                  cloudskillsboost.google/public_profiles/YOUR-UUID
                </code>{" "}
                or{" "}
                <code className="bg-background px-1.5 py-0.5 rounded text-foreground font-mono text-xs">
                  skills.google/public_profiles/...
                </code>
                . Do not paste your Google Developer Profile or general account
                settings link.
              </p>
            </div>

            <div className="rounded-2xl border border-rose-500/20 bg-surface-card p-6 shadow-card-premium space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <ShieldAlert className="h-5 w-5" />
                <span>Mistake #3: Profile Sync Latency</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                When you finish a lab or pass a challenge, it can take up to
                24–48 hours for Google Cloud to index the badge onto your public
                profile page. If points do not appear immediately, allow time
                for sync.
              </p>
            </div>

            <div className="rounded-2xl border border-rose-500/20 bg-surface-card p-6 shadow-card-premium space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <ShieldAlert className="h-5 w-5" />
                <span>Mistake #4: Doing Non-Eligible Labs</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Only official 2026 Game Badges and eligible Skill Badges award
                Arcade points. Non-skill quest completions do not carry point
                weight. Always consult the active syllabus before starting a lab
                track.
              </p>
            </div>
          </div>
        </section>

        {/* Section 11: Frequently Asked Questions */}
        <section id="faqs" className="space-y-6 pt-4 scroll-mt-28">
          <div className="border-b border-border/60 pb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-display flex items-center gap-2">
              <HelpCircle className="h-6 w-6 text-accent-purple" />
              <span>9. Frequently Asked Questions</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Quick answers to the most common questions asked by new and
              returning Arcade participants.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.question}
                  className="rounded-xl border border-border/70 bg-surface-card overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm sm:text-base text-foreground hover:text-accent-purple transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-accent-purple" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 12: Related Resources & Final CTA */}
        <section id="related-resources" className="space-y-6 pt-4 scroll-mt-28">
          <div className="border-b border-border/60 pb-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-display flex items-center gap-2">
              <Compass className="h-6 w-6 text-emerald-500" />
              <span>10. Related ArcadeVerse Guides & Tools</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Continue your learning journey with our suite of dedicated Arcade
              resources.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/resources/point-system"
              className="rounded-2xl border border-border bg-surface-card p-5 transition-all hover:-translate-y-1 hover:border-accent-purple/50 shadow-card-premium block space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-500 uppercase">
                  RULES
                </span>
                <Zap className="h-4 w-4 text-amber-500" />
              </div>
              <h3 className="font-bold text-foreground">Point System</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                Detailed points conversion and scoring rules breakdown.
              </p>
            </Link>

            <Link
              to="/resources/syllabus"
              className="rounded-2xl border border-border bg-surface-card p-5 transition-all hover:-translate-y-1 hover:border-accent-purple/50 shadow-card-premium block space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-500 uppercase">
                  CATALOG
                </span>
                <BookOpen className="h-4 w-4 text-blue-500" />
              </div>
              <h3 className="font-bold text-foreground">Badge Syllabus</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                Complete active Game and Skill Badge catalog with access codes.
              </p>
            </Link>

            <Link
              to="/resources/lab-free-courses"
              className="rounded-2xl border border-border bg-surface-card p-5 transition-all hover:-translate-y-1 hover:border-accent-purple/50 shadow-card-premium block space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-500 uppercase">
                  FREE COURSES
                </span>
                <Sparkles className="h-4 w-4 text-emerald-500" />
              </div>
              <h3 className="font-bold text-foreground">Lab-Free Courses</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                24 verified zero-credit cloud and Gen AI foundational courses.
              </p>
            </Link>

            <Link
              to="/resources/chrome-extension"
              className="rounded-2xl border border-border bg-surface-card p-5 transition-all hover:-translate-y-1 hover:border-accent-purple/50 shadow-card-premium block space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-500 uppercase">
                  EXTENSION
                </span>
                <Puzzle className="h-4 w-4 text-purple-500" />
              </div>
              <h3 className="font-bold text-foreground">Chrome Extension</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                Track points directly on Skills Boost with zero drift.
              </p>
            </Link>
          </div>

          {/* Action Bottom Card */}
          <div className="rounded-2xl border border-border bg-gradient-to-r from-accent-purple/10 via-surface-card to-amber-500/10 p-6 sm:p-8 shadow-card-premium flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-accent-purple bg-accent-purple/10 px-2.5 py-1 rounded border border-accent-purple/20">
                TAKE ACTION NOW
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-2">
                Calculate your exact Arcade standing
              </h3>
              <p className="text-sm text-muted-foreground max-w-xl">
                Ready to find out your exact points, milestone unlocks, and swag
                tier eligibility? Paste your public profile URL into
                ArcadeVerse.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-md"
              >
                <Link to="/">
                  <span>Go to Calculator</span>
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-border bg-surface-card"
              >
                <Link to="/resources">
                  <span>Resources Index</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CompleteGuidePage;
