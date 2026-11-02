import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronLeft,
  Flame,
  Gamepad2,
  Gift,
  Info,
  Layers,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export function PointSystemPage() {
  const swagTiers = [
    {
      name: "Trooper Tier",
      tier: "Tier #01",
      points: 50,
      slots: "6,000 slots",
      tag: "Arcade 2026",
      image: "/images/swag/trooper.png",
      color: "border-blue-500/40 bg-blue-500/5",
      badgeColor:
        "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
      description:
        "The foundation tier. Features official Google Cloud collectibles, stickers, badges, and essentials.",
    },
    {
      name: "Ranger Tier",
      tier: "Tier #02",
      points: 75,
      slots: "4,000 slots",
      tag: "Arcade 2026",
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
      tag: "Arcade 2026",
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
      tag: "Arcade 2026",
      image: "/images/swag/legend.png",
      color: "border-amber-500/40 bg-amber-500/5",
      badgeColor:
        "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
      description:
        "Top-tier master pack with the full executive swag bundle, heavy-duty hoodie, exclusive jacket, and collectibles.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <Helmet>
        <title>
          Google Cloud Arcade Points & Badge System Explained | ArcadeVerse
        </title>
        <meta
          name="description"
          content="Complete breakdown of Google Cloud Arcade 2026 point calculation rules: monthly game badges (1 Pt), skill badges (0.5 Pts), Work Meets Play (7 Pts), and Facilitator bonus milestones (+45 Pts)."
        />
        <link
          rel="canonical"
          href="https://arcadeverse.vercel.app/resources/point-system"
        />
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
          <span className="text-accent-purple">Arcade 2026</span>
        </div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3 py-1 text-xs font-medium text-accent-purple">
            <Zap className="h-3.5 w-3.5" />
            <span>ARCADE 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-display">
            Google Cloud Arcade Points & Badge System Explained
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Understand exactly how every Game Badge, Skill Badge, Work Meets
            Play series, and Facilitator Bonus Milestone converts into points to
            maximize your final score.
          </p>
        </motion.div>

        {/* Core Calculation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Game Badges Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-card-premium flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                  1.0 Pt / Badge
                </span>
                <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
                  <Gamepad2 className="h-5 w-5" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Monthly Game Badges (1 Point Each)
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Google Cloud releases 6 new Game Badges in total each month.
                Every completed monthly Game Badge awards 1 Arcade Point
                directly to your account.
              </p>
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>6 Badges Monthly:</strong> 6 unique game badges
                    released monthly.
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>1 Arcade Pt / Badge:</strong> Each completed game
                    badge gives 1 full point.
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Up to 6 Pts / Month:</strong> Earn up to 6 Pts
                    monthly from game badges.
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-border/60">
              <p className="text-xs text-muted-foreground">
                Tip: Game badges have specific cohort monthly expiry dates.
                Complete them before the monthly reset.
              </p>
            </div>
          </motion.div>

          {/* Skill Badges Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-card-premium flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                  0.5 Pts / Badge
                </span>
                <div className="p-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
                  <Award className="h-5 w-5" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Skill Badges (0.5 Points Each)
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Skill Badges test hands-on lab expertise on Google Cloud Skills
                Boost. Each completed Skill Badge is worth 0.5 Arcade Points (2
                Skill Badges = 1 Point).
              </p>
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>0.5 Pts / Badge:</strong> Earn 0.5 points per badge
                    (2 Badges = 1 Pt).
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>95+ Unlocked Badges:</strong> Available to earn
                    anytime right from day one.
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Facilitator Timing:</strong> Complete after
                    Facilitator launch for bonus milestones.
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-border/60">
              <p className="text-xs text-muted-foreground">
                Always ensure the badge carries the official Google Cloud "Skill
                Badge" assessment challenge.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Special Series & Facilitator Bonuses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Work Meets Play Series */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-card-premium space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-rose-400 bg-rose-400/10 px-2.5 py-1 rounded-md border border-rose-400/20">
                Special Series
              </span>
              <div className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
                <Flame className="h-5 w-5" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Work Meets Play Series (Jan – June)
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The special Work Meets Play series ran from January to June. Each
              month during this period, 1 Work Meets Play badge awarded 1 Arcade
              Point to the first 50 completing users.
            </p>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-1">
              <p className="text-xs font-bold text-rose-300">
                ⭐ 7-Point Completion Bonus:
              </p>
              <p className="text-xs text-muted-foreground">
                Completing the entire 6-badge Work Meets Play series (Jan –
                June) guarantees you <strong>7 total Arcade Points</strong> at
                the end of the program!
              </p>
            </div>
          </motion.div>

          {/* Facilitator Program Bonuses */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-card-premium space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-purple-400 bg-purple-400/10 px-2.5 py-1 rounded-md border border-purple-400/20">
                Up to +45 Bonus
              </span>
              <div className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Arcade Facilitator Program (Up to +45 Bonus Pts)
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Arcade Facilitator Program is the main seasonal event where
              learners enrolled under an official Facilitator earn milestone
              bonus points (+5 to +35 Pts) by completing designated combinations
              of Game and Skill Badges.
            </p>
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-1">
              <p className="text-xs font-bold text-purple-300">
                🚀 +10 Bonus Milestone Task:
              </p>
              <p className="text-xs text-muted-foreground">
                Participants can also complete an extra hands-on Bonus Milestone
                Task (+10 Pts) on Vertex AI, bringing your total potential bonus
                to <strong>+45 Bonus Points</strong>!
              </p>
            </div>
          </motion.div>
        </div>

        {/* Arcade Prize Swag Tiers Section */}
        <div className="space-y-6">
          <div className="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Arcade Prize Swag Tiers
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Reach these cumulative point thresholds to unlock official
                Google Cloud swag kits:
              </p>
            </div>
            <Link
              to="/resources/swag-tiers"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent-purple hover:underline"
            >
              <span>View Swag Showcase</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {swagTiers.map((tier, idx) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 + idx * 0.08 }}
                className={`rounded-2xl border ${tier.color} p-5 shadow-card-premium flex flex-col justify-between transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="space-y-3">
                  {/* Swag Image */}
                  <div className="w-full h-40 rounded-xl bg-surface-hover/50 dark:bg-[#080c16] border border-border/50 p-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={tier.image}
                      alt={`${tier.name} Arcade Prize`}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* Header info */}
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
                    <Link to="/#calculator">Calculate Eligibility</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Conversion Formula Quick Guide */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-card-premium space-y-4"
        >
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-bold text-foreground">
              Quick Points Summary Formula
            </h3>
          </div>
          <div className="rounded-xl border border-border/80 bg-background/90 p-4 font-mono text-xs sm:text-sm text-foreground/90 space-y-2">
            <p>
              <strong>Total Arcade Points</strong> = (Game Badges × 1.0) +
              (Skill Badges × 0.5) + (Work Meets Play Badges × 1.0) +
              (Facilitator Milestone Bonus: +5 to +35) + (Bonus Task: +10)
            </p>
            <p className="text-muted-foreground text-xs font-sans">
              * Note: Facilitator bonus points are awarded for your single
              highest achieved milestone only, not cumulatively for prior
              milestones.
            </p>
          </div>
        </motion.div>

        {/* Action CTAs Bottom Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-2xl border border-border bg-gradient-to-r from-accent-purple/10 via-surface-card to-amber-500/10 p-6 sm:p-8 shadow-card-premium flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-accent-purple bg-accent-purple/10 px-2.5 py-1 rounded border border-accent-purple/20">
              AUTOMATED ARCADE POINTS CALCULATOR
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-2">
              Track your exact points in real-time
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              Why waste time manually counting game badges, skill badges, and
              milestone bonuses? ArcadeVerse automatically parses your public
              Google Skills Boost profile, calculates your exact points, and
              predicts your swag tier.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-md"
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
              className="w-full sm:w-auto border-border bg-surface-card"
            >
              <Link to="/arcade-facilitator">
                <span>View Facilitator Guide</span>
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PointSystemPage;
