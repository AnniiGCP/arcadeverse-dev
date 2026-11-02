import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  Copy,
  ExternalLink,
  Eye,
  HelpCircle,
  Link as LinkIcon,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export function FindProfileUrlPage() {
  const [copied, setCopied] = useState(false);

  const sampleUrl =
    "https://www.cloudskillsboost.google/public_profiles/1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d";

  const handleCopySample = async () => {
    try {
      await navigator.clipboard.writeText(sampleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const steps = [
    {
      step: "01",
      title: "Access Profile Settings",
      description:
        "Sign in to your account at Google Cloud Skills Boost. Click your profile avatar in the top-right corner and select Settings from the dropdown menu.",
      action: {
        label: "Go to Profile Settings",
        url: "https://www.skills.google/my_account/profile",
        isExternal: true,
      },
      icon: Settings,
      color: "from-blue-500/20 to-indigo-500/20 text-blue-400",
    },
    {
      step: "02",
      title: "Enable Public Visibility",
      description:
        'Scroll down to the Public visibility section. Check the checkbox labeled "Make profile public" and click the "Update settings" button to save your changes.',
      action: null,
      icon: Eye,
      color: "from-amber-500/20 to-orange-500/20 text-amber-400",
    },
    {
      step: "03",
      title: "Copy Unique Public URL",
      description:
        "Once saved, your unique public profile link will be displayed under your setting details. Copy the complete URL string to track your live progress on ArcadeVerse.",
      action: {
        label: "Calculate Your Points",
        url: "/#calculator",
        isExternal: false,
      },
      icon: LinkIcon,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <Helmet>
        <title>
          How to Find Your Google Cloud Skills Boost Public Profile URL |
          ArcadeVerse
        </title>
        <meta
          name="description"
          content="Step-by-step walkthrough to make your Google Cloud Skills Boost profile public and copy your unique URL to calculate Arcade points on ArcadeVerse."
        />
        <link
          rel="canonical"
          href="https://arcadeverse.vercel.app/resources/find-your-public-url"
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
          <span className="text-accent-purple">Step-by-Step Walkthrough</span>
        </div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3 py-1 text-xs font-medium text-accent-purple">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Official Profile Setup Walkthrough</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-display">
            How to Find Your Google Cloud Skills Public Profile URL
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Follow this step-by-step guide to make your Google Cloud Skills
            Boost profile public and find your public profile URL to calculate
            your Arcade Points and track your progress.
          </p>
        </motion.div>

        {/* Why Making Your Profile Public is Mandatory Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-card-premium relative overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-blue-400 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                Why Making Your Profile Public is Mandatory
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Making your profile public allows the official Google Cloud
                Arcade team to verify your completed labs, calculate eligible
                badges, and confirm your swag tier qualification during prize
                distribution. It also enables ArcadeVerse to parse your public
                badges in real-time, compute total Arcade points, and track
                milestone rewards automatically.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Enables official Google Cloud reward verification</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Instant live calculation on ArcadeVerse</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Tracks Facilitator milestone bonus points</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Zero passwords or credentials required</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3 Step Walkthrough */}
        <div className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              3-Step Profile Setup Walkthrough
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Complete these steps in under two minutes to get your official
              tracking link:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 + idx * 0.1 }}
                  className="rounded-2xl border border-border bg-surface-card p-6 shadow-card-premium flex flex-col justify-between hover:border-border-strong transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-accent-purple bg-accent-purple/10 px-2.5 py-1 rounded-md border border-accent-purple/20">
                        Step {step.step}
                      </span>
                      <div
                        className={`p-2.5 rounded-xl border border-border/50 bg-gradient-to-br ${step.color}`}
                      >
                        <IconComp className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {step.action && (
                    <div className="pt-5 mt-auto">
                      {step.action.isExternal ? (
                        <a
                          href={step.action.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-surface-hover/80 hover:bg-surface-hover border border-border px-3.5 py-2 text-xs font-semibold text-foreground transition-colors shadow-sm"
                        >
                          <span>{step.action.label}</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <a
                          href={step.action.url}
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-3.5 py-2 text-xs font-semibold transition-colors shadow-sm"
                        >
                          <span>{step.action.label}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Visual Reference Annotated Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-card-premium space-y-6"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-300">
              <Eye className="h-3.5 w-3.5" />
              <span>Visual Reference Guide</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              It Will Now Look Like This — Copy Your Public Profile Link
            </h2>
            <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
              Once your settings are saved, your profile settings page will show
              your verified public URL. Copy your complete public profile URL
              and paste it into ArcadeVerse to calculate your points and track
              completed badges:
            </p>
          </div>

          {/* Annotated Screenshot Display */}
          <div className="rounded-xl border border-border/80 bg-surface-hover/40 dark:bg-[#080c16] p-2 sm:p-4 overflow-hidden shadow-inner flex flex-col items-center justify-center">
            <img
              src="https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host/ArcadeCalc/how-to-find-publicUrl.png"
              alt="Annotated Google Cloud Skills Boost Profile Settings walkthrough showing Public Profile URL location"
              className="rounded-lg max-w-full h-auto object-contain border border-border/40 shadow-lg"
              loading="lazy"
            />
            <p className="text-xs text-muted-foreground text-center mt-3">
              Official Google Cloud Skills Boost Profile Settings page showing
              the public profile link field.
            </p>
          </div>

          {/* URL Example Box with Copy Button */}
          <div className="rounded-xl border border-border/60 bg-surface-hover/30 p-4 sm:p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-blue-400" />
                Example of a valid public profile URL format:
              </span>
              <button
                onClick={handleCopySample}
                className="inline-flex items-center gap-1 text-xs font-medium text-accent-purple hover:text-accent-purple/80 transition-colors"
                title="Copy sample URL"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Sample</span>
                  </>
                )}
              </button>
            </div>
            <div className="rounded-lg border border-border/80 bg-background/90 px-3.5 py-2.5 text-xs sm:text-sm font-mono text-muted-foreground break-all select-all">
              {sampleUrl}
            </div>
          </div>
        </motion.div>

        {/* Action CTAs Bottom Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-2xl border border-border bg-gradient-to-r from-accent-purple/10 via-surface-card to-blue-500/10 p-6 sm:p-8 shadow-card-premium flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-accent-purple bg-accent-purple/10 px-2.5 py-1 rounded border border-accent-purple/20">
              TRACK YOUR ARCADE PROGRESS
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-2">
              Ready to calculate your total points?
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              Paste your newly copied Google Cloud Skills Boost public profile
              URL into our instant calculator to view completed badges, points
              breakdown, and prize tier standings.
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
              <Link to="/resources/syllabus">
                <span>View Badge Catalog</span>
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default FindProfileUrlPage;
