import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronLeft,
  Clock,
  ExternalLink,
  Info,
  KeyRound,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export function GearBadgesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <Helmet>
        <title>
          How to Claim GEAR Badges on Your Google Developer Profile |
          ArcadeVerse
        </title>
        <meta
          name="description"
          content="Step-by-step instructions to claim the Arcade - GEAR badge and complete GEAR program enrollment on Google Developer Profile for Facilitator eligibility."
        />
        <link
          rel="canonical"
          href="https://arcadeverse.vercel.app/resources/gear-badges"
        />
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
          <span>·</span>
          <span>Facilitator Badges</span>
          <span>·</span>
          <span className="text-accent-purple font-mono font-bold">
            Google Developer Profile Guide
          </span>
        </div>

        {/* Hero Header */}
        <motion.header
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-display">
            How to Claim GEAR Badges on Your Google Developer Profile
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            When participating in the Arcade Facilitator Program, these 2
            essential badges must be completed on your Google Developer Profile.
          </p>
        </motion.header>

        {/* Incognito Warning Alert */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 sm:p-6 flex items-start gap-4 shadow-card-premium"
        >
          <KeyRound className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="font-bold text-amber-300 uppercase tracking-wider">
              PRO-TIP: USE AN INCOGNITO WINDOW
            </p>
            <p className="text-muted-foreground leading-relaxed">
              To avoid automatic sign-ins with personal Google accounts or
              broken badge redirects, always perform these steps in an{" "}
              <strong>Incognito / Private Window</strong> using your official
              Facilitator email.
            </p>
          </div>
        </motion.div>

        {/* The 2 Essential Facilitator Badges Overview */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            The 2 Essential Facilitator Badges
          </h2>
          <p className="text-sm text-muted-foreground">
            Make sure both of these distinct badges appear on your Google
            Developer Profile:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Badge 1: Arcade - GEAR Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="rounded-2xl border border-border bg-surface-card p-6 shadow-card-premium flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-full h-40 rounded-xl bg-surface-hover/50 dark:bg-[#080c16] border border-border/50 p-4 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://developers.google.com/static/profile/badges/community/gear/arcade/badge.png"
                    alt="Arcade - GEAR Badge"
                    className="max-h-full max-w-full object-contain drop-shadow-md"
                    loading="lazy"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded border border-accent-purple/20">
                    Badge 1 · Instant Claim
                  </span>
                  <h3 className="text-lg font-bold text-foreground mt-2">
                    Arcade - GEAR Badge
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                    An instant digital badge earned directly via Google
                    Developer Profile page award link in under a minute.
                  </p>
                </div>
              </div>

              <a
                href="https://developers.google.com/profile/badges/community/gear/arcade/award"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 px-4 text-xs font-semibold shadow-sm transition-colors"
              >
                <span>Claim Badge 1 Directly</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </motion.div>

            {/* Badge 2: GEAR Program Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="rounded-2xl border border-border bg-surface-card p-6 shadow-card-premium flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-full h-40 rounded-xl bg-surface-hover/50 dark:bg-[#080c16] border border-border/50 p-4 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://developers.google.com/static/profile/badges/community/gear/badge.svg"
                    alt="GEAR Program Enrollment Badge"
                    className="max-h-full max-w-full object-contain drop-shadow-md"
                    loading="lazy"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Badge 2 · Program Enrollment
                  </span>
                  <h3 className="text-lg font-bold text-foreground mt-2">
                    GEAR Badge (Gemini Enterprise Agent Ready)
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                    Gemini Enterprise Agent Ready program badge earned by
                    registering and completing the GEAR program enrollment.
                  </p>
                </div>
              </div>

              <a
                href="https://developers.google.com/program/gear/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 text-xs font-semibold shadow-sm transition-colors"
              >
                <span>Claim Badge 2 (Enroll in GEAR)</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </motion.div>
          </div>
        </div>

        {/* PART 1: INSTRUCTIONS TO EARN ARCADE - GEAR BADGE */}
        <section className="space-y-6 pt-2">
          <div className="space-y-2">
            <span className="inline-block font-mono text-xs font-bold bg-accent-purple/20 text-accent-purple border border-accent-purple/40 px-3 py-1 rounded-lg uppercase tracking-wider">
              BADGE 1 · CLAIMING GUIDE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
              Instructions to Earn the Arcade – GEAR Badge
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Follow these 4 steps in sequence to claim your digital award:
            </p>
          </div>

          {/* 3 Step Boxes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* STEP 01 */}
            <article className="relative bg-surface-card border-2 border-border rounded-2xl p-6 sm:p-7 flex flex-col justify-between pt-10 shadow-card-premium group hover:border-indigo-500 transition-colors duration-300 h-full">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <div className="px-4 py-1 rounded-md font-mono font-black tracking-wider flex items-center justify-center text-xs bg-slate-900 text-white border border-slate-700 shadow-sm">
                  <span className="uppercase">STEP 01</span>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-foreground">
                  Sign In to Account
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Make sure you are signed in to your Google Developer Program
                  account using your Facilitator email.
                </p>
              </div>
              <div className="pt-6 mt-auto">
                <a
                  href="https://me.developers.google.com/u/me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 font-bold text-sm px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm"
                >
                  <span>Sign In to Google Developer</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </article>

            {/* STEP 02 */}
            <article className="relative bg-surface-card border-2 border-border rounded-2xl p-6 sm:p-7 flex flex-col justify-between pt-10 shadow-card-premium group hover:border-emerald-500 transition-colors duration-300 h-full">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <div className="px-4 py-1 rounded-md font-mono font-black tracking-wider flex items-center justify-center text-xs bg-emerald-400 text-slate-950 border border-emerald-500 shadow-sm">
                  <span className="uppercase">STEP 02</span>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-foreground">
                  Navigate to Award Page
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Once signed in, click below to open the official direct badge
                  award page:
                </p>
              </div>
              <div className="pt-6 mt-auto">
                <a
                  href="https://developers.google.com/profile/badges/community/gear/arcade/award"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 font-bold text-sm px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-all shadow-sm"
                >
                  <span>Open Award Page</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </article>

            {/* STEP 03 */}
            <article className="relative bg-surface-card border-2 border-border rounded-2xl p-6 sm:p-7 flex flex-col justify-between pt-10 shadow-card-premium group hover:border-amber-500 transition-colors duration-300 h-full">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <div className="px-4 py-1 rounded-md font-mono font-black tracking-wider flex items-center justify-center text-xs bg-amber-400 text-slate-950 border border-amber-500 shadow-sm">
                  <span className="uppercase">STEP 03</span>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-foreground">
                  Wait 10 – 15 Seconds
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Once there, wait for{" "}
                  <strong className="text-foreground font-extrabold">
                    10–15 seconds
                  </strong>
                  .{" "}
                  <strong className="text-foreground font-extrabold underline">
                    DO NOT
                  </strong>{" "}
                  navigate away from the page and do not click anything.
                </p>
              </div>
              <div className="pt-6 mt-auto">
                <div className="border border-amber-500/40 bg-amber-500/10 text-amber-300 font-bold text-xs px-4 py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 shadow-sm">
                  <span>⏱️</span>
                  <span>Stay on Page for 10-15s</span>
                </div>
              </div>
            </article>
          </div>

          {/* STEP 04 Full-Width Box */}
          <article className="relative bg-surface-card border-2 border-border rounded-2xl p-6 sm:p-8 space-y-5 shadow-card-premium">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black font-heading text-foreground">
                Step 04 · Confirmation Toast &amp; Profile Verification
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                You should now see a notification toast at the bottom of the
                screen indicating that you have successfully earned the badge.
                Click on{" "}
                <strong className="text-foreground font-extrabold">
                  &quot;View Profile&quot;
                </strong>{" "}
                to confirm that the badge has been added to your Google
                Developer Profile.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="overflow-hidden rounded-xl border border-border/80 bg-slate-950 p-2 sm:p-4 shadow-inner">
                <img
                  src="https://services.google.com/fh/files/misc/arcade_gear_badge_toast.png"
                  alt="Arcade GEAR Badge Toast Notification screenshot confirmation"
                  className="w-full h-auto object-contain mx-auto rounded-lg border border-border/40"
                  loading="lazy"
                />
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground font-medium">
                  Verify your earned digital badge on your official developer
                  profile dashboard:
                </p>
                <a
                  href="https://me.developers.google.com/u/me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-slate-900 dark:border-amber-400 font-bold text-sm px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-sm shrink-0"
                >
                  <span>View Google Developer Profile</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </article>
        </section>

        {/* PART 2: GEAR PROGRAM ENROLLMENT */}
        <section className="space-y-6 pt-2">
          <div className="space-y-2">
            <span className="inline-block font-mono text-xs font-bold bg-emerald-400 text-slate-950 border border-emerald-500 px-3 py-1 rounded-lg uppercase tracking-wider">
              PART 2 · GEAR PROGRAM ENROLLMENT
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground">
              Steps for the GEAR Badge (Gemini Enterprise Agent Ready)
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
              You must have signed up for the GEAR program while enrolling and
              earned the GEAR badge on your Google Developer profile. Follow the
              steps below or watch the video guide:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left Card: Enroll in the GEAR Program */}
            <article className="bg-surface-card border-2 border-border rounded-2xl p-6 sm:p-7 space-y-6 flex flex-col justify-between shadow-card-premium hover:border-indigo-500 transition-colors h-full">
              <div className="space-y-5">
                {/* Header Graphic Banner */}
                <div className="relative h-44 w-full rounded-xl border border-emerald-500/30 bg-emerald-950/40 flex items-center justify-center p-4 overflow-hidden shadow-inner">
                  <div className="flex items-center gap-4 z-10">
                    <div className="w-20 h-20 relative shrink-0 flex items-center justify-center">
                      <img
                        src="https://developers.google.com/static/profile/badges/community/gear/badge.svg"
                        alt="GEAR Program Badge"
                        className="w-full h-full object-contain drop-shadow-md"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-left space-y-1">
                      <span className="font-mono text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                        GOOGLE DEVELOPER PROGRAM
                      </span>
                      <h4 className="font-heading font-extrabold text-xl text-foreground leading-tight">
                        Gemini Enterprise Agent Ready
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-left">
                  <h3 className="font-heading font-black text-2xl text-foreground">
                    Enroll in the GEAR Program
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Register for the Gemini Enterprise Agent Ready initiative on
                    the official Google Developer platform to earn your GEAR
                    badge and satisfy Facilitator program eligibility.
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/90 pt-1">
                  <li className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>
                      <strong>Official Google Initiative</strong> — Gemini
                      Enterprise Agent Ready enrollment
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-400 shrink-0" />
                    <span>
                      <strong>100% Free Developer Badge</strong> — Added to your
                      Google Developer profile
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                    <span>
                      <strong>Facilitator Mandatory</strong> — Required for
                      milestone bonus point validation
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 mt-auto">
                <a
                  href="https://developers.google.com/program/gear/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-bold text-sm sm:text-base px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md w-full"
                >
                  <span>Sign Up for GEAR Program</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </article>

            {/* Right Card: Video Walkthrough */}
            <article className="bg-surface-card border-2 border-border rounded-2xl p-6 sm:p-7 space-y-5 flex flex-col justify-between shadow-card-premium hover:border-indigo-500 transition-colors h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-md uppercase">
                    VIDEO WALKTHROUGH
                  </span>
                  <a
                    href="https://www.youtube.com/watch?v=_vTVDxbVlhQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono font-bold text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading font-black text-xl sm:text-2xl text-foreground">
                    Video Guide: How to Earn the GEAR Badge
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Watch this step-by-step video guide to see how to enroll in
                    GEAR and claim the badge on your developer profile.
                  </p>
                </div>

                <div className="aspect-video w-full rounded-xl border-2 border-border overflow-hidden bg-slate-950 shadow-inner">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube-nocookie.com/embed/_vTVDxbVlhQ"
                    title="Instructional video guide on how to claim GEAR badges on Google Developer Profile"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="pt-2 mt-auto">
                <a
                  href="https://www.youtube.com/watch?v=_vTVDxbVlhQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border-2 border-slate-700 font-bold text-sm sm:text-base px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm w-full"
                >
                  <Play className="h-4 w-4 fill-current text-rose-500" />
                  <span>Open Video in Full Screen</span>
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* Action CTAs Bottom Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-2xl border border-border bg-gradient-to-r from-accent-purple/10 via-surface-card to-blue-500/10 p-6 sm:p-8 shadow-card-premium flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              Check your Facilitator bonus points
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              Once you've claimed your GEAR badges, track your milestone
              completion and verify that your +5 to +45 bonus points are
              accurately credited.
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
                <span>Facilitator Milestones</span>
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default GearBadgesPage;
