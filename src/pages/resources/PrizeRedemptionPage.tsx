import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Gift,
  Globe2,
  HelpCircle,
  Info,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trophy,
  Truck,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export function PrizeRedemptionPage() {
  // Countdown Timer targeting Estimated Prize Counter Opening (Approx Jan 7th)
  const getTargetTime = () => {
    const now = new Date();
    const targetYear = now.getFullYear();
    let target = new Date(targetYear, 0, 7, 0, 0, 0);
    if (now.getTime() >= target.getTime()) {
      target = new Date(targetYear + 1, 0, 7, 0, 0, 0);
    }
    return target.getTime();
  };

  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = Math.max(0, getTargetTime() - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.max(0, getTargetTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const waterfallTiers = [
    {
      tier: "LEGEND TIER",
      points: "120+ PTS",
      totalSlots: "2,500 Slots",
      available: "1,361",
      desc: "First 2,500 claims. If filled, eligibility moves to Champion Tier.",
      color: "bg-amber-500/10 border-amber-500/40 text-amber-300",
      badgeColor: "bg-amber-400 text-slate-950 border-amber-400",
      textColor: "text-amber-300",
      highlightColor: "text-amber-400",
    },
    {
      tier: "CHAMPION TIER",
      points: "95+ PTS",
      totalSlots: "3,000 Slots",
      available: "671",
      desc: "First 3,000 claims. If filled, eligibility moves to Ranger Tier.",
      color: "bg-indigo-500/10 border-indigo-500/40 text-indigo-300",
      badgeColor: "bg-indigo-600 text-white border-indigo-500",
      textColor: "text-indigo-300",
      highlightColor: "text-indigo-400",
    },
    {
      tier: "RANGER TIER",
      points: "75+ PTS",
      totalSlots: "4,000 Slots",
      available: "1,684",
      desc: "First 4,000 claims. If filled, eligibility moves to Trooper Tier.",
      color: "bg-emerald-500/10 border-emerald-500/40 text-emerald-300",
      badgeColor: "bg-emerald-600 text-white border-emerald-500",
      textColor: "text-emerald-300",
      highlightColor: "text-emerald-400",
    },
    {
      tier: "TROOPER TIER",
      points: "50+ PTS",
      totalSlots: "6,000 Slots",
      available: "3,719",
      desc: "First 6,000 claims across the program season.",
      color: "bg-sky-500/10 border-sky-500/40 text-sky-300",
      badgeColor: "bg-sky-600 text-white border-sky-500",
      textColor: "text-sky-300",
      highlightColor: "text-sky-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <Helmet>
        <title>
          Google Cloud Arcade 2026 Prize Redemption Guide | ArcadeVerse
        </title>
        <meta
          name="description"
          content="Complete guide on how to claim your official Arcade swags once you reach your target prize tier, mandatory eligibility prerequisites, and a quick overview of the new Waterfall Distribution System."
        />
        <link
          rel="canonical"
          href="https://arcadeverse.vercel.app/resources/prize-redemption"
        />
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <header
          aria-label="Prize Redemption Hero Header"
          className="flex flex-col space-y-5 justify-center items-start sm:items-center relative z-10 text-left sm:text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="justify-start sm:justify-center font-bold items-center font-mono text-xs mb-1 tracking-wider flex flex-wrap gap-x-2 gap-y-1 text-muted-foreground uppercase"
          >
            <Link
              to="/resources"
              className="hover:text-accent-purple flex items-center gap-1 font-bold transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>RESOURCES</span>
            </Link>
            <span>·</span>
            <span>PRIZE REDEMPTION</span>
            <span className="hidden sm:inline">·</span>
            <span className="text-accent-purple font-extrabold font-mono hidden sm:inline">
              CLAIM PROCESS GUIDE
            </span>
          </motion.div>

          {/* Hero Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            <h1 className="font-heading max-w-5xl text-left sm:text-center text-3xl sm:text-4xl lg:text-[46px] font-black text-foreground leading-tight sm:leading-tight">
              <span className="text-indigo-400 dark:text-indigo-400">
                Google Cloud Arcade
              </span>{" "}
              2026{" "}
              <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-md inline-block">
                Prize Redemption Guide
              </span>
            </h1>
            <div className="max-w-4xl mx-auto px-0 sm:px-4">
              <h2 className="font-sans text-left sm:text-center text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
                Complete guide on{" "}
                <strong className="text-foreground font-extrabold">
                  how to claim your official Arcade swags
                </strong>{" "}
                once you reach your target prize tier, mandatory eligibility
                prerequisites, and a quick overview of the new{" "}
                <strong className="text-indigo-400 font-extrabold">
                  Waterfall Distribution System
                </strong>
                .
              </h2>
            </div>
          </motion.div>
        </header>

        {/* SECTION 1: MANDATORY PREREQUISITES & TIMELINE */}
        <section
          aria-labelledby="prerequisites-timeline-heading"
          className="space-y-8 text-left pt-2"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-1"
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300 uppercase">
              <CheckCircle2 className="h-4 w-4 text-amber-400" />
              <span>MUST BE COMPLETED BEFOREHAND</span>
            </div>
            <h2
              id="prerequisites-timeline-heading"
              className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground"
            >
              Mandatory Program Prerequisites &amp; Timeline
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-sans">
              Complete these mandatory prerequisites beforehand to ensure your
              account is officially enrolled and eligible when the Prize Counter
              opens.
            </p>
          </motion.div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* STEP 01 */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="bg-surface-card border-2 border-border rounded-3xl p-6 flex flex-col justify-between space-y-5 shadow-card-premium group hover:border-indigo-500 transition-colors h-full"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black bg-indigo-600 text-white px-3 py-1 rounded-lg">
                    STEP 01
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-md">
                    MANDATORY
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-extrabold font-heading text-foreground group-hover:text-indigo-400 transition-colors duration-200">
                    Use 1 Email &amp; Complete Registration
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                    Make sure your Google Cloud Skills Boost account, the
                    official Arcade Registration Form, and any Facilitator
                    registrations use the{" "}
                    <strong className="text-foreground font-extrabold underline decoration-indigo-400 decoration-2">
                      exact same email address
                    </strong>
                    .
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <a
                  href="https://forms.gle/2h6xCvY3sW29pw4p7"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Fill Official Arcade Registration Form (opens in new tab)"
                  className="inline-flex items-center justify-center gap-2 font-heading font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all cursor-pointer w-full text-center shadow-sm"
                >
                  <span>Fill Registration Form</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </motion.article>

            {/* STEP 02 */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="bg-surface-card border-2 border-border rounded-3xl p-6 flex flex-col justify-between space-y-5 shadow-card-premium group hover:border-indigo-500 transition-colors h-full"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black bg-amber-400 text-slate-950 px-3 py-1 rounded-lg">
                    STEP 02
                  </span>
                  <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-md">
                    PUBLIC SETTING
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-extrabold font-heading text-foreground group-hover:text-indigo-400 transition-colors duration-200">
                    Keep Profile Settings Public
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                    Your Skills Boost profile must be set to{" "}
                    <strong className="text-foreground font-extrabold">
                      Public
                    </strong>{" "}
                    so Google Cloud automated verification scripts can index
                    your completed badges and record your points.
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/resources/find-your-public-url"
                  className="inline-flex items-center justify-center gap-2 font-heading font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer w-full text-center shadow-sm"
                >
                  <span>Public Profile Guide</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>

            {/* STEP 03: COUNTDOWN TIMER */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="bg-surface-card border-2 border-border rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-card-premium group hover:border-indigo-500 transition-colors h-full"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black bg-indigo-600 text-white px-3 py-1 rounded-lg">
                    STEP 03
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-md tracking-wider">
                    ESTIMATED TIMELINE
                  </span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold font-heading text-foreground">
                    Prize Counter Opens In:
                  </h3>
                </div>

                {/* 4 Countdown Boxes */}
                <div className="grid grid-cols-4 gap-2 sm:gap-2.5 pt-1">
                  {/* Days */}
                  <div className="bg-slate-900/90 dark:bg-slate-900/90 border border-slate-800 rounded-2xl py-3 px-1 sm:px-2 flex flex-col items-center justify-center text-center shadow-inner">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-foreground leading-none">
                      {timeLeft.days}
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-muted-foreground uppercase mt-1.5">
                      DAYS
                    </span>
                  </div>

                  {/* Hours */}
                  <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-2xl py-3 px-1 sm:px-2 flex flex-col items-center justify-center text-center shadow-inner">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-indigo-400 leading-none">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-indigo-300/80 uppercase mt-1.5">
                      HOURS
                    </span>
                  </div>

                  {/* Mins */}
                  <div className="bg-slate-900/90 dark:bg-slate-900/90 border border-slate-800 rounded-2xl py-3 px-1 sm:px-2 flex flex-col items-center justify-center text-center shadow-inner">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-foreground leading-none">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-muted-foreground uppercase mt-1.5">
                      MINS
                    </span>
                  </div>

                  {/* Secs */}
                  <div className="bg-amber-950/20 border border-amber-500/40 rounded-2xl py-3 px-1 sm:px-2 flex flex-col items-center justify-center text-center shadow-inner">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 leading-none">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-amber-400 uppercase mt-1.5">
                      SECS
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Note */}
              <div className="pt-3 border-t border-border/60 flex items-start gap-2 text-xs text-muted-foreground font-sans">
                <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-foreground font-extrabold">
                    Estimated Date:
                  </strong>{" "}
                  Approx. Jan 7th based on past program cycles. May vary by ±2–3
                  days.
                </p>
              </div>
            </motion.article>
          </div>

          {/* CRITICAL ALERT BOX */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 sm:p-7 space-y-4 shadow-card-premium text-left"
          >
            <div className="flex items-center gap-2 font-heading font-extrabold text-amber-300 text-base sm:text-lg">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
              <span>CRITICAL EMAIL &amp; REGISTRATION REQUIREMENTS</span>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground font-sans leading-relaxed font-normal">
              <p>
                Make sure to complete all program registrations—your{" "}
                <strong className="text-foreground font-extrabold">
                  Skills Boost account
                </strong>
                , the{" "}
                <strong className="text-foreground font-extrabold">
                  Official Arcade Form
                </strong>
                , and any{" "}
                <strong className="text-foreground font-extrabold">
                  Facilitator Program
                </strong>
                —using the{" "}
                <span className="text-indigo-400 font-extrabold underline decoration-2">
                  EXACT SAME EMAIL ADDRESS
                </span>
                . Never unsubscribe from official Arcade emails or{" "}
                <strong className="text-foreground font-extrabold">
                  Arcade Insider
                </strong>{" "}
                monthly newsletters, as unsubscribing will cause automated
                tracking failures and prevent receiving prize claim codes.
              </p>
              <div className="bg-surface-card border border-amber-500/30 rounded-xl p-4 text-xs sm:text-sm space-y-1">
                <p className="font-bold text-foreground">
                  💡 What is the Arcade Insider Email?
                </p>
                <p className="text-muted-foreground">
                  <strong>Arcade Insider</strong> is Google's official monthly
                  email report showing accumulated points earned from the start
                  to a specific cutoff date. While it is Google's official
                  source, for{" "}
                  <strong>101% up-to-date, real-time results</strong> at any
                  moment, calculate your latest points on ArcadeVerse!
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 2: WATERFALL SYSTEM & TIER CAPS */}
        <section
          aria-labelledby="waterfall-system-heading"
          className="space-y-8 text-left pt-2"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-2"
          >
            <div className="inline-flex items-center gap-2 font-mono text-xs font-extrabold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1.5 rounded-full shadow-sm">
              <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
              <span>WATERFALL SYSTEM &amp; TIER CAPS</span>
            </div>
            <h2
              id="waterfall-system-heading"
              className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground"
            >
              Waterfall Distribution System &amp; Tier Slot Capacities
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-sans max-w-3xl leading-relaxed">
              Google Cloud uses a protected &quot;Waterfall System&quot; to
              distribute rewards fairly on a first-come, first-served basis
              starting at Legend Tier. If a higher tier reaches its cap, your
              prize eligibility automatically moves to secure your spot in the
              next lower tier.
            </p>
          </motion.div>

          {/* 4 Waterfall Tier Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {waterfallTiers.map((tier, idx) => (
              <motion.article
                key={tier.tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + idx * 0.08 }}
                className={`border-2 border-dashed rounded-3xl p-5 sm:p-6 flex flex-col justify-between space-y-5 shadow-card-premium hover:border-solid transition-all duration-300 h-full text-left ${tier.color}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                    <h3 className="font-heading font-black text-lg uppercase text-foreground">
                      {tier.tier}
                    </h3>
                    <span
                      className={`font-mono text-xs font-black border px-2.5 py-1 rounded-lg shrink-0 ${tier.badgeColor}`}
                    >
                      {tier.points}
                    </span>
                  </div>
                  <div className="border rounded-2xl p-3.5 space-y-1.5 font-mono text-xs bg-surface-card border-border/80">
                    <div className="flex items-baseline justify-between text-muted-foreground">
                      <span className="font-bold uppercase text-[11px]">
                        Total Capacity:
                      </span>
                      <span className="font-black text-foreground">
                        {tier.totalSlots}
                      </span>
                    </div>
                    <div
                      className={`flex items-baseline justify-between ${tier.textColor}`}
                    >
                      <span className="font-bold uppercase text-[11px] text-muted-foreground">
                        Available Now:
                      </span>
                      <span className="font-black">{tier.available}</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                    {tier.desc}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>

          {/* NO NEED TO WORRY Callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 sm:p-7 space-y-3 shadow-card-premium text-left"
          >
            <div className="flex items-center gap-2 font-heading font-extrabold text-emerald-300 text-base sm:text-lg">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>NO NEED TO WORRY: SLOTS ARE PLENTIFUL!</span>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed font-normal">
              Please don't worry when seeing tier slot caps! Google Cloud
              carefully reviewed last season's data and set these new 2026
              limits{" "}
              <strong className="text-foreground font-extrabold">
                significantly higher than the total number of players who
                actually claimed prizes last year
              </strong>
              . As long as you play fair, build skills, and earn your points,
              there is plenty of room for you to receive your rewards!
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs font-mono text-emerald-300 font-bold">
              <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                Slot counts update weekly on the official Arcade Page as claims
                progress.
              </span>
            </div>
          </motion.div>
        </section>

        {/* BOTTOM CTA: SWAG TIER STATUS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-10 text-white space-y-4 shadow-card-premium mt-12 text-left"
        >
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span>SWAG TIER STATUS</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Ready to See Which Swag Tier You've Earned? 🏆
          </h2>
          <p className="text-slate-300 max-w-3xl text-sm sm:text-base font-sans leading-relaxed font-normal">
            Calculate your live Arcade points in seconds to see exactly where
            you stand on the Waterfall tier ladder and verify your prize
            eligibility.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all w-full sm:w-auto text-center cursor-pointer shadow-md"
            >
              <span>Check My Swag Tier</span>
              <ChevronRight className="h-4 w-4 text-slate-950" />
            </Link>
            <Link
              to="/resources/swag-tiers"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-heading font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all cursor-pointer w-full sm:w-auto text-center"
            >
              <span>View Swag Tiers Showcase</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PrizeRedemptionPage;
