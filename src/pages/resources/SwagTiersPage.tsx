import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ExternalLink,
  Gift,
  History,
  Maximize2,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export function SwagTiersPage() {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    caption: string;
  } | null>(null);

  const official2026Tiers = [
    {
      name: "Trooper Tier",
      tier: "Tier #01",
      points: "50 PTS",
      slots: "6,000 slots",
      image: "/images/swag/trooper.png",
      color: "border-blue-500/40 bg-blue-500/5",
      badgeColor:
        "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
      description:
        "Official Google Cloud starter kit featuring high-grade enamel badges, stickers, customized pen, and collectibles.",
    },
    {
      name: "Ranger Tier",
      tier: "Tier #02",
      points: "75 PTS",
      slots: "4,000 slots",
      image: "/images/swag/ranger.png",
      color: "border-emerald-500/40 bg-emerald-500/5",
      badgeColor:
        "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
      description:
        "Mid-tier bundle including premium insulated stainless water bottle, desk tech accessories, and limited edition items.",
    },
    {
      name: "Champion Tier",
      tier: "Tier #03",
      points: "95 PTS",
      slots: "3,000 slots",
      image: "/images/swag/champion.png",
      color: "border-purple-500/40 bg-purple-500/5",
      badgeColor:
        "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
      description:
        "Advanced bundle featuring official Google Cloud apparel, branded backpack, and executive desktop accessories.",
    },
    {
      name: "Legend Tier",
      tier: "Top Tier #04",
      points: "120 PTS",
      slots: "2,500 slots",
      image: "/images/swag/legend.png",
      color: "border-amber-500/40 bg-amber-500/5",
      badgeColor:
        "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
      description:
        "The pinnacle prize pack with full executive swag collection, heavy pullover hoodie, tech pack, and exclusive trophies.",
    },
  ];

  const pastSwagCollections = [
    {
      title: "Google Cloud Arcade 2025 Season 2 Swag Collection",
      description:
        "Official Season 2 prize collection featuring Google Cloud t-shirts, water bottles, backpacks (2 designs), stickers, magnets, DIY Google Cloud lego, upright lamp, pens, multi-port USB hub, laptop sleeves, and much more.",
      image:
        "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/past-swags-collection/arcade-season-2-2025-swags.jpg",
      year: "2025 · Season 2",
    },
    {
      title: "Google Cloud Arcade 2025 Season 1 Swag Collection",
      description:
        "Official Season 1 prize collection featuring Google Cloud t-shirts, laptop stand, ceramic mug, desk lamp, magnets, diary, pens, backpacks (3 designs), mini desk vacuum cleaner, 3D printer, and much more.",
      image:
        "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/past-swags-collection/arcade-season-1-2025-swags.jpg",
      year: "2025 · Season 1",
    },
    {
      title: "Google Cloud Arcade 2024 Season 2 Swag Collection",
      description:
        "Official 2024 Season 2 prize collection featuring Google Cloud backpacks (3-4 designs), t-shirts, black & white hoodies, water bottles, laptop stand, mug, digital alarm clock, 5-in-1 desk cleaner, auto-stir coffee mug, laptop sleeve, 3D printer pen, foldable bottle, screen cleaner, and much more.",
      image:
        "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/past-swags-collection/arcade-season-2-2024-swags.jpg",
      year: "2024 · Season 2",
    },
    {
      title: "Google Cloud Arcade 2024 Season 1 Swag Collection",
      description:
        "Official 2024 Season 1 prize collection featuring Google Cloud backpacks (5 designs), t-shirts (5 designs), digital alarm clock, pens, 3D printer pen, camping lantern, mini vacuum cleaner, study lamps, desk lights, and much more.",
      image:
        "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/past-swags-collection/arcade-season-1-2024-swags.png",
      year: "2024 · Season 1",
    },
    {
      title: "Google Cloud Arcade 2023 Season 2 Swag Collection",
      description:
        "Official 2023 Season 2 prize collection featuring Google Cloud backpacks, t-shirts, caps, multi-port USB connectors, high-grade water bottles, hoodies, milestone swags, and much more.",
      image:
        "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/past-swags-collection/arcade-season-2-2023-swags.png",
      year: "2023 · Season 2",
    },
    {
      title: "Google Cloud Arcade 2023 Season 1 Swag Collection",
      description:
        "Official 2023 Season 1 prize collection featuring Google Cloud backpacks, t-shirts, caps, multi-port USB connectors, water bottles, hoodies, milestone swags, and much more.",
      image:
        "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/past-swags-collection/arcade-season-1-2023-swags.png",
      year: "2023 · Season 1",
    },
  ];

  const winnerShowcase = [
    {
      caption:
        "Delivered Arcade Champion Bundle with Google Cloud apparel, backpack, and accessories.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-swags-showcase.jpg",
    },
    {
      caption:
        "Unboxing official Google Cloud Arcade kit with commemorative swag stickers and notebook.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-swags-showcase-2.jpg",
    },
    {
      caption:
        "Arcade merchandise unboxed by a community winner including water bottle and desk cleaner.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-swags-showcase-3.jpg",
    },
    {
      caption:
        "Full swag tier package delivered to global participant doorstep.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-swags-showcase-4.jpg",
    },
    {
      caption:
        "Arcade 2025 Season 2 swag collection with customized t-shirt and accessories.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-2025-season-2-swags.jpg",
    },
    {
      caption:
        "Arcade Season 2 2025 Legend Pack unboxed with heavy hoodie and backpack.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-season-2-2025-legend-pack.jpg",
    },
    {
      caption:
        "Arcade Season 2 2025 Champion Pack delivered with full official gear set.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-season-2-2025-champion-pack.jpg",
    },
    {
      caption: "Arcade Season 2 2025 Legend Swags unboxing overview.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-season-2-2025-legend-swags.jpg",
    },
    {
      caption: "Arcade Season 2 2025 Champion Swags displayed by winner.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-season-2-2025-champion-swags.jpg",
    },
    {
      caption: "Arcade Season 2 2025 Cloud Lego Ranger edition unboxing.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-season-2-2025-cloud-lego-ranger.jpg",
    },
    {
      caption: "Arcade Season 2 2025 Trooper Swags package unboxed.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-season-2-2025-trooper-swags.jpg",
    },
    {
      caption:
        "Arcade Season 2 2025 Trooper kit with official Google Cloud branded items.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-season-2-2025-trooper.jpg",
    },
    {
      caption: "Arcade Season 2 2025 Trooper unboxing showcase.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-season-2-2025-trooper-2.jpg",
    },
    {
      caption:
        "Arcade Season 2 2025 Facilitator Swags kit with mentor certificate and gifts.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-season-2-2025-facilitator-swags.jpg",
    },
    {
      caption: "Arcade 2025 Facilitator Special Recognition package.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-2025-facilitator-swags.jpg",
    },
    {
      caption: "Arcade Season 1 2025 Champion Swags bundle display.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-season-1-2025-champion-swags.jpg",
    },
    {
      caption: "Arcade Season 1 2025 Ranger kit unboxed by participant.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-season-1-2025-ranger.jpg",
    },
    {
      caption: "Arcade 2025 Season 1 Trooper LED Lamp unboxing.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-2025-season-1-trooper-lamp.jpg",
    },
    {
      caption: "Arcade Season 1 2025 Trooper Swags collection photo.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-season-1-2025-trooper-swags.jpg",
    },
    {
      caption: "Arcade Season 1 2025 Trooper package unboxing.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-season-1-2025-trooper-swags-2.jpg",
    },
    {
      caption: "Arcade Season 1 2025 Trooper merchandise showcase.",
      src: "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/swags-gallery/arcade-season-1-2025-trooper-swags-3.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <Helmet>
        <title>
          Google Cloud Arcade Swag Tiers & Winner Showcase Gallery | ArcadeVerse
        </title>
        <meta
          name="description"
          content="Explore Google Cloud Arcade 2026 prize swag tiers, view past year swag collections (2023-2025), and browse our community winner showcase gallery."
        />
        <link
          rel="canonical"
          href="https://arcadeverse.vercel.app/resources/swag-tiers"
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
          <span>/</span>
          <span className="text-accent-purple">
            Swag Tiers & Prize Showcase
          </span>
        </div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3 py-1 text-xs font-medium text-accent-purple">
            <Gift className="h-3.5 w-3.5" />
            <span>Official Swag Tiers & Winner Gallery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-display">
            Google Cloud Arcade Swag Tiers & Winner Showcase
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Explore the official 2026 Arcade prize tiers, take a nostalgic look
            at past seasons (2023–2025), and see real delivered swag kits shared
            by participants from around the world.
          </p>
        </motion.div>

        {/* SECTION 1: 2026 PRIZE SWAG TIERS */}
        <div className="space-y-6">
          <div className="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Official 2026 Arcade Swag Tiers
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Accumulate points across skill badges, monthly game badges, and
                facilitator bonuses to reach your target prize tier:
              </p>
            </div>
            <Link
              to="/resources/prize-redemption"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent-purple hover:underline"
            >
              <span>Prize Redemption Guide</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {official2026Tiers.map((tier, idx) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + idx * 0.08 }}
                className={`rounded-2xl border ${tier.color} p-5 shadow-card-premium flex flex-col justify-between transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="space-y-3">
                  <div className="w-full h-44 rounded-xl bg-surface-hover/50 dark:bg-[#080c16] border border-border/50 p-3 flex items-center justify-center overflow-hidden">
                    <img
                      src={tier.image}
                      alt={`${tier.name} Arcade Prize`}
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

                  <h3 className="text-lg font-bold text-foreground">
                    {tier.name}
                  </h3>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-foreground font-display">
                      {tier.points}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground uppercase">
                      REQUIRED
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

        {/* SECTION 2: PAST COHORTS ARCADE SWAGS (2023 - 2025) */}
        <div className="space-y-6">
          <div className="border-b border-border pb-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-purple mb-1">
              <History className="h-3.5 w-3.5" />
              <span>Historic Archives</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Past Cohorts Arcade Swags
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Take a look back at the official merchandise delivered to Arcade
              champions in previous seasons:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastSwagCollections.map((col, idx) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + idx * 0.06 }}
                className="rounded-2xl border border-border bg-surface-card overflow-hidden shadow-card-premium flex flex-col justify-between hover:border-border-strong transition-all duration-300 group cursor-pointer"
                onClick={() =>
                  setSelectedImage({ src: col.image, caption: col.title })
                }
              >
                <div className="relative aspect-video w-full overflow-hidden bg-surface-hover/50 dark:bg-[#080c16]">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md bg-black/80 px-2.5 py-1 text-[10px] font-mono font-bold text-white border border-white/20 backdrop-blur-sm">
                      {col.year}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-1.5 rounded-lg bg-black/70 text-white border border-white/20">
                      <Maximize2 className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-foreground line-clamp-2">
                    {col.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {col.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 3: HALL OF SWAG WINNERS GALLERY */}
        <div className="space-y-6">
          <div className="border-b border-border pb-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-300 mb-1">
              <Camera className="h-3.5 w-3.5" />
              <span>Real Winner Deliveries</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Hall of Swag Winners 🏆
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Real Google Cloud Arcade participants showcasing their delivered
              swag kits and reward boxes around the world (Click any photo to
              enlarge):
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {winnerShowcase.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.05 + idx * 0.02 }}
                onClick={() => setSelectedImage(item)}
                className="group relative rounded-xl border border-border bg-surface-card overflow-hidden cursor-pointer aspect-square shadow-sm hover:border-accent-purple transition-all duration-300"
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                  <p className="text-[10px] text-white/90 line-clamp-2 leading-tight">
                    {item.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Modal Lightbox for Image Preview */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl max-h-[90vh] rounded-2xl border border-border/60 bg-surface-card dark:bg-[#080c16] p-4 flex flex-col items-center shadow-2xl"
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-3 right-3 rounded-full bg-black/60 hover:bg-black/90 p-2 text-white/80 hover:text-white border border-white/20 transition-colors z-10"
                  aria-label="Close image preview"
                >
                  <X className="h-5 w-5" />
                </button>
                <img
                  src={selectedImage.src}
                  alt={selectedImage.caption}
                  className="max-h-[75vh] max-w-full rounded-xl object-contain"
                />
                <p className="mt-3 text-xs sm:text-sm text-muted-foreground text-center max-w-2xl px-2">
                  {selectedImage.caption}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action CTAs Bottom Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-2xl border border-border bg-gradient-to-r from-accent-purple/10 via-surface-card to-amber-500/10 p-6 sm:p-8 shadow-card-premium flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              See Which Arcade Swag Tier You've Unlocked!
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              Enter your Google Skills Boost profile URL on ArcadeVerse to
              automatically calculate your points and see exactly which swag
              prize tier you are eligible to claim.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-md"
            >
              <Link to="/">
                <span>Check My Swag Tier</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-border bg-surface-card"
            >
              <Link to="/resources/prize-redemption">
                <span>Prize Redemption Guide</span>
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SwagTiersPage;
