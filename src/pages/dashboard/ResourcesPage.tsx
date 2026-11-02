import { Badge } from "@/components/ui/badge";
import { articles } from "@/data/articles";
import {
  IconArrowRight,
  IconBook,
  IconBookmark,
  IconCertificate,
  IconClock,
  IconCompass,
  IconExternalLink,
  IconSparkles,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 + i * 0.05,
      duration: 0.3,
    },
  }),
};

const coreResourcesList = [
  {
    title: "Google Cloud Arcade Complete Guide 2026",
    description:
      "The definitive master guide: program structure, points calculation rules, Game vs. Skill badges, Facilitator bonus milestones, and prize redemption roadmap.",
    image: "/images/resources/cloud-computing.gif",
    imageAlt:
      "Cloud computing infrastructure and master guide animation by Asad Hussain on LottieFiles",
    href: "/resources/google-cloud-arcade-complete-guide",
    category: "Master Blueprint",
    cta: "Read Complete Guide",
  },
  {
    title: "ArcadeVerse Chrome Extension",
    description:
      "Install the official browser extension to track your Arcade points and Facilitator milestones directly on Google Skills Boost with 100% calculation parity.",
    image: "/images/resources/chrome-extension-cover.gif",
    href: "/resources/chrome-extension",
    category: "Official Extension",
    cta: "View Extension Guide",
  },
  {
    title: "Find Your Public Profile URL",
    description:
      "Struggling to locate your profile link? Follow this visual walkthrough to make your Google Skills profile public and retrieve your unique URL for instant points tracking.",
    image:
      "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/gifs/Find-Your-Public-Profile-URL-image.gif",
    href: "/resources/find-your-public-url",
    category: "Profile Setup",
    cta: "Read Profile URL Guide",
  },
  {
    title: "Google Cloud Arcade Points & Badge System Explained",
    description:
      "Complete breakdown of how Arcade points are earned, how Skill Badges & Game Badges are calculated, and how Facilitator Bonus Milestones boost your total score.",
    image:
      "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/gifs/Arcade-Points-Badge-System-Explained-Image.gif",
    href: "/resources/point-system",
    category: "Point System",
    cta: "Read Points System Guide",
  },
  {
    title: "Arcade Facilitator Program 2026",
    description:
      "Learn how the Google Cloud Arcade Facilitator Program works: official milestone breakdowns, guided lab support, and how to unlock up to +45 bonus points through milestone badges.",
    image:
      "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/gifs/Arcade-Facilitator-Program-2026-Image.gif",
    href: "/arcade-facilitator",
    category: "Facilitator Cohort",
    cta: "Explore Facilitator Bonus Rules",
  },
  {
    title: "Arcade Syllabus & Full Badge Guide",
    description:
      "Complete collection of all active Game Badges and Skill Badges. Track what labs you can complete next to maximize points.",
    image:
      "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/gifs/Arcade-Syllabus-Image.gif",
    href: "/resources/syllabus",
    category: "Syllabus & Badges",
    cta: "View Arcade Syllabus",
  },
  {
    title: "Lab-Free Courses Catalog (24 Free Courses)",
    description:
      "Explore all 24 verified zero-credit Google Cloud courses. Master Generative AI, cloud infrastructure, and Workspace essentials without consuming lab quota.",
    image:
      "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/gifs/Arcade-Syllabus-Image.gif",
    href: "/resources/lab-free-courses",
    category: "Zero-Credit Catalog",
    cta: "Explore Free Courses",
  },
  {
    title: "How to Claim GEAR Badges (Gemini Enterprise Agent Ready)",
    description:
      "Learn how to earn the Arcade-GEAR badge and GEAR badge on your Google Developer Profile for the Facilitator Program to unlock bonus milestone points.",
    image:
      "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/gifs/Guide-Image-on-how-to-Claim-GEAR-Badges.gif",
    href: "/resources/gear-badges",
    category: "Developer Profile",
    cta: "Read GEAR Claiming Guide",
  },
  {
    title: "Swag Tiers & Winner Showcase Gallery",
    description:
      "Explore official 2026 Arcade prize tiers, view past year swag collections (2023–2025), and browse the community winner showcase gallery.",
    image:
      "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/gifs/Swag-Tiers-Winner-Showcase-Gallery-Image.gif",
    href: "/resources/swag-tiers",
    category: "Prizes & Showcase",
    cta: "View Swag Showcase",
  },
  {
    title: "Prize Redemption & Claim Code Guide",
    description:
      "Everything about claim code timelines, the Waterfall Distribution System, international shipping rules, and mandatory registration prerequisites.",
    image:
      "https://cdn.jsdelivr.net/gh/deepanshu-prajapati01/image-host@main/ArcadeCalc/version-2/gifs/Prize-Redemption-Guide-Image.gif",
    href: "/resources/prize-redemption",
    category: "Redemption Protocol",
    cta: "Read Redemption Guide",
  },
  {
    title: "What Is Google Cloud Arcade? A Complete Beginner Guide",
    description:
      "A complete zero-knowledge onboarding guide: understand how gamified cloud learning works, navigate Google Skills Boost, master point rules, and follow a practical first-week study plan.",
    image: "/images/resources/cloud-computing.gif",
    imageAlt:
      "Cloud computing infrastructure and data flow animation by Asad Hussain on LottieFiles",
    href: "/resources/what-is-google-cloud-arcade",
    category: "Beginner Guide",
    cta: "Read Beginner Guide",
  },
  {
    title: "How to Earn Arcade Points Faster Without Burning Out",
    description:
      "A strategic guide to maximizing your Arcade point velocity through smart prioritization, batching, and sustainable study habits — without rushing or repeating non-credit labs.",
    image: "/images/resources/study-checklist.gif",
    imageAlt:
      "Structured study schedule and task checklist animation by Shahariar Arifin Imran on LottieFiles",
    href: "/resources/how-to-earn-arcade-points-faster",
    category: "Strategy & Planning",
    cta: "Read Strategy Guide",
  },
  {
    title: "Best Google Cloud Skill Badges for Beginners",
    description:
      "A curated, catalog-verified roadmap of beginner-friendly Google Cloud skill badges covering Cloud Storage, IAM, Compute Engine, Networking, and Generative AI.",
    image: "/images/resources/badge-achievement.gif",
    imageAlt:
      "Skill badge achievement and certification celebration animation by Parimal Chahande on LottieFiles",
    href: "/resources/best-google-cloud-skill-badges-for-beginners",
    category: "Learning Pathways",
    cta: "Explore Starter Badges",
  },
  {
    title: "Google Cloud Arcade vs Cloud Skills Boost: What Is the Difference?",
    description:
      "Demystifying the Google Cloud learning ecosystem: understand the distinct roles of the Cloud Skills Boost training platform versus the gamified Arcade motivation program.",
    image: "/images/resources/cloud-sync.gif",
    imageAlt:
      "Cloud data synchronization and connected platform services animation by Felipe Da Silva Pinho on LottieFiles",
    href: "/resources/google-cloud-arcade-vs-cloud-skills-boost",
    category: "Ecosystem Comparison",
    cta: "Read Comparison Guide",
  },
  {
    title: "How to Redeem Google Cloud Arcade Prizes",
    description:
      "A complete, authoritative guide to the Google Cloud Arcade Prize Counter: 2026 Waterfall distribution updates, preparation checklists, tier thresholds, and anti-scam warnings.",
    image: "/images/resources/prize-redemption.gif",
    imageAlt:
      "Gift prize reward and swag unboxing animation by Dilpreet Singh on LottieFiles",
    href: "/resources/how-to-redeem-google-cloud-arcade-prizes",
    category: "Prizes & Redemption",
    cta: "Read Redemption Guide",
  },
];

export function ResourcesPage() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div
      className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 pb-16"
      ref={ref}
    >
      <Helmet>
        <title>
          Google Cloud Arcade Resources, Guides & Catalogs | ArcadeVerse
        </title>
        <meta
          name="description"
          content="Comprehensive guides, rules, point system breakdowns, complete 2026 roadmap, lab-free courses, and badge explorer for Google Cloud Arcade."
        />
        <link rel="canonical" href="https://arcadeverse.vercel.app/resources" />
      </Helmet>

      {/* Hero Header */}
      <header
        aria-label="Resources Hero Header"
        className="flex flex-col space-y-4 sm:space-y-5 justify-center items-center relative z-10 pt-4 pb-4 sm:pt-6 sm:pb-8 text-center"
      >
        {/* Eyebrow Label */}
        <div className="font-bold items-center font-mono text-xs tracking-wider flex items-center justify-center gap-x-2 text-slate-500 dark:text-slate-400 uppercase">
          <span>ARCADEVERSE</span>
          <span>•</span>
          <span>RESOURCES</span>
        </div>

        {/* Main Title */}
        <h1 className="font-heading max-w-4xl mx-auto text-center text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-foreground leading-tight tracking-tight">
          Google Cloud Arcade Resources
        </h1>

        {/* Supporting Description */}
        <div className="max-w-2xl sm:max-w-3xl mx-auto text-center">
          <p className="font-sans text-center text-base sm:text-[18px] text-muted-foreground leading-relaxed font-normal">
            Essential guides, complete syllabus, zero-credit courses, point
            calculation rules, and reward showcases for your Arcade journey.
          </p>
        </div>

        {/* Quick Badge Catalogs Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to="/resources/google-cloud-arcade-complete-guide"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-card px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:border-accent-purple/60 hover:bg-surface-hover transition-colors shadow-xs"
          >
            <IconCompass size={16} className="text-amber-500" />
            <span>Complete Guide 2026</span>
          </Link>
          <Link
            to="/resources/syllabus"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-card px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:border-accent-purple/60 hover:bg-surface-hover transition-colors shadow-xs"
          >
            <IconBook size={16} className="text-indigo-500" />
            <span>2026 Badge Syllabus</span>
          </Link>
          <Link
            to="/resources/skillbadge"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-card px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:border-accent-purple/60 hover:bg-surface-hover transition-colors shadow-xs"
          >
            <IconCertificate size={16} className="text-emerald-500" />
            <span>Skill Badges Catalog</span>
          </Link>
          <Link
            to="/resources/lab-free-courses"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-card px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:border-accent-purple/60 hover:bg-surface-hover transition-colors shadow-xs"
          >
            <IconBookmark size={16} className="text-purple-500" />
            <span>Lab-Free Courses (24)</span>
          </Link>
        </div>
      </header>

      {/* Core Resources Section */}
      <section aria-label="Core Arcade Resources" className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
            Core Guides & Roadmaps
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Official instructions, blueprints, and catalogs for Google Cloud
            Arcade learners.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {coreResourcesList.map((card, index) => {
            const cardBody = (
              <>
                <div className="relative h-52 overflow-hidden bg-surface-hover/40 border-b border-border dark:bg-[#080c16] dark:border-white/5">
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={card.imageAlt || card.title}
                      title={card.imageAlt || card.title}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                      width="400"
                      height="208"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.opacity = "0";
                      }}
                    />
                  ) : null}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-primary/95 text-primary-foreground font-semibold shadow-md backdrop-blur-xs">
                      {card.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 flex h-[calc(100%-13rem)] flex-col gap-3">
                  <h3 className="text-lg font-bold text-foreground dark:text-white leading-tight line-clamp-2 min-h-[56px]">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-slate-300 line-clamp-3 min-h-[60px] leading-relaxed">
                    {card.description}
                  </p>
                  <div className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 shadow-sm">
                    <span>{card.cta}</span>
                    <IconExternalLink size={14} />
                  </div>
                </div>
              </>
            );

            return (
              <motion.div
                key={card.title}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="h-full"
              >
                <Link
                  to={card.href}
                  className="block h-full overflow-hidden rounded-2xl border border-border bg-surface-card transition-all hover:-translate-y-1 hover:border-accent-purple/50 shadow-card-premium dark:border-white/10 dark:bg-[#171d2d]"
                >
                  {cardBody}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default ResourcesPage;
