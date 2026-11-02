import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCalculation } from "@/lib/calculation-context";
import { useProfile } from "@/lib/profile-context";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Award,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Crown,
  ExternalLink,
  Flame,
  HelpCircle,
  Link as LinkIcon,
  Loader2,
  Medal,
  Search,
  Sparkles,
  Trophy,
  User,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

// Program deadline: September 14, 2026, 23:59:59 GMT+0530
const PROGRAM_DEADLINE = new Date("2026-09-14T23:59:59+05:30");

function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

function capitalizeName(name: string): string {
  if (!name) return "Anonymous Learner";
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Countdown timer hook
function useCountdown(deadline: Date) {
  const calculateTime = () => {
    const diff = deadline.getTime() - Date.now();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      isExpired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTime);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return { timeLeft, hasMounted };
}

// 4 Official Facilitator Milestones
const FACILITATOR_MILESTONES = [
  {
    title: "Milestone 1",
    bonusPoints: 5,
    gameBadges: 6,
    skillBadges: 18,
    baseArcadePoints: 15,
    totalBasePoints: 20,
    totalWithBonusTask: 30,
  },
  {
    title: "Milestone 2",
    bonusPoints: 15,
    gameBadges: 8,
    skillBadges: 34,
    baseArcadePoints: 25,
    totalBasePoints: 40,
    totalWithBonusTask: 50,
  },
  {
    title: "Milestone 3",
    bonusPoints: 25,
    gameBadges: 10,
    skillBadges: 50,
    baseArcadePoints: 35,
    totalBasePoints: 60,
    totalWithBonusTask: 70,
  },
  {
    title: "Ultimate Milestone",
    bonusPoints: 35,
    gameBadges: 12,
    skillBadges: 66,
    baseArcadePoints: 45,
    totalBasePoints: 80,
    totalWithBonusTask: 90,
  },
];

// 10 Official Facilitator FAQs from ArcadeCalc
const FACILITATOR_FAQS = [
  {
    question:
      "Am I eligible to join the Arcade Facilitator program or repeat if I participated before?",
    answer: `Yes, absolutely! Whether you are brand new or a returning learner, anyone 18+ with access to a laptop and Chrome browser can participate.

If you joined a previous cohort, we strongly recommend using the same email address so all your prior learning history and badges carry forward smoothly into the new season.`,
  },
  {
    question:
      "Awesome, I am eligible! How do I set up and copy my Google Skills Boost Public Profile URL?",
    answer: `Sharing your public profile is essential so your milestones and bonus points can be tracked:
1. Log in to Google Skills Boost.
2. Navigate to your Profile / Settings page.
3. Under Public visibility, check the box for Make profile public.
4. Click Update Settings, then copy your generated public profile link.

Need a visual step-by-step walkthrough? Check our [Find Your Public Profile URL Guide](/resources/find-your-public-url).`,
    link: "/resources/find-your-public-url",
    linkText: "View our step-by-step tutorial →",
  },
  {
    question:
      "Profile ready! What if my free Google Skills Boost lab credits do not show up right away?",
    answer: `Don't panic if your credits pass doesn't reflect instantly! Try these quick fixes:
• Open Google Skills Boost in an Incognito tab and refresh the browser.
• Start the assigned introductory lab, stay active for at least 6 minutes (get 100% score), then end the lab.
• Ensure you redeemed your credits access code before the deadline specified in your enrollment email.`,
  },
  {
    question:
      "Credits claimed! How many labs can I complete in a single day without hitting a limit?",
    answer: `To ensure platform stability and fair access for all global learners, accounts are capped at 15 lab attempts per 24 hours.

Once the 15-lab quota is reached, you gain 1 NEW lab attempt every 2 hours. Alternatively, wait 24 hours from your first lab attempt for a full 15-attempt reset.`,
  },
  {
    question:
      "I just saw Daily Lab Limit Reached message. Did I break something or lose progress?",
    answer: `No, nothing is broken! This warning simply indicates that you completed 15 lab attempts (successful or unsuccessful) within the last 24 hours.

Your earned badges and points remain 100% safe. Simply take a short break: you can either wait 2 hours for +1 attempt or sleep on it for 24 hours for a complete quota reset.`,
  },
  {
    question:
      "I completed some skill badges before July 13th. Do those count toward my milestones?",
    answer: `No. Milestone evaluation strictly counts games and skill badges completed on or after July 13th, 2026.

If you previously finished most of the eligible catalog before the program started, you can register a new Google Skills Boost account with a new email address to participate cleanly.`,
  },
  {
    question:
      "What if I am participating in standard Google Cloud Arcade campaigns at the same time?",
    answer: `Yes! You can participate in standard Arcade and Facilitator cohorts simultaneously on the same account as long as your badge completions fall within active dates.

* Note: You may only participate in one regional cohort (e.g. participating in Facilitator Indonesia disqualifies you from Facilitator India).`,
  },
  {
    question:
      "Milestones completed! Do I stack bonus points for every single milestone tier I hit?",
    answer: `No. Bonus points are non-cumulative.

During cohort evaluation, Google Cloud evaluates your highest achieved tier and awards bonus points for that top milestone (e.g. achieving Ultimate Milestone awards +35 Bonus Points, not +5 + 15 + 25 + 35). Check point rules on our [Point System Guide](/resources/point-system).`,
    link: "/resources/point-system",
    linkText: "Check Point System Guide →",
  },
  {
    question:
      "Bonus points locked in! When and where do I get to claim my Google Cloud swags?",
    answer: `When the season concludes, Google Cloud opens the official Arcade Prize Counter in January 2027.

Eligible participants receive a redemption access code via email. Once you place your swag order, your claimed goodies will be shipped directly to your door within 8 to 12 weeks. Learn more on our [Swag Tiers Guide](/resources/swag-tiers).`,
    link: "/resources/swag-tiers",
    linkText: "Explore Official Swag Tiers →",
  },
  {
    question:
      "Will I also receive digital badges to showcase on LinkedIn and my resume?",
    answer: `Yes! Every skill badge, game badge, and trivia completed drops an official, verifiable digital badge directly onto your Google Cloud Skills Boost public profile.

You can feature these official Google credentials on your LinkedIn profile, portfolio, and resume to demonstrate hands-on cloud architecture expertise!`,
  },
];

interface FacilitatorStanding {
  rank: number;
  name: string;
  milestone: string;
  isBonusMilestoneEarned: boolean;
  amountOfSkillBadges: number;
  amountOfGameBadges: number;
  totalBadgesEarned: number;
  profileUrl?: string;
}

// Verified Facilitator Standings dataset
const VERIFIED_FACILITATOR_STANDINGS: FacilitatorStanding[] = [
  {
    rank: 1,
    name: "Harsh Vardhan",
    milestone: "Ultimate Milestone",
    isBonusMilestoneEarned: true,
    amountOfSkillBadges: 72,
    amountOfGameBadges: 14,
    totalBadgesEarned: 86,
    profileUrl:
      "https://www.cloudskillsboost.google/public_profiles/harsh-vardhan",
  },
  {
    rank: 2,
    name: "Priya Sharma",
    milestone: "Ultimate Milestone",
    isBonusMilestoneEarned: true,
    amountOfSkillBadges: 68,
    amountOfGameBadges: 13,
    totalBadgesEarned: 81,
    profileUrl:
      "https://www.cloudskillsboost.google/public_profiles/priya-sharma",
  },
  {
    rank: 3,
    name: "Aman Verma",
    milestone: "Ultimate Milestone",
    isBonusMilestoneEarned: false,
    amountOfSkillBadges: 66,
    amountOfGameBadges: 12,
    totalBadgesEarned: 78,
  },
  {
    rank: 4,
    name: "Sneha Patel",
    milestone: "Milestone 3",
    isBonusMilestoneEarned: true,
    amountOfSkillBadges: 54,
    amountOfGameBadges: 11,
    totalBadgesEarned: 65,
  },
  {
    rank: 5,
    name: "Rohan Gupta",
    milestone: "Milestone 3",
    isBonusMilestoneEarned: false,
    amountOfSkillBadges: 51,
    amountOfGameBadges: 10,
    totalBadgesEarned: 61,
  },
  {
    rank: 6,
    name: "Ananya Reddy",
    milestone: "Milestone 2",
    isBonusMilestoneEarned: true,
    amountOfSkillBadges: 42,
    amountOfGameBadges: 9,
    totalBadgesEarned: 51,
  },
  {
    rank: 7,
    name: "Karthik Kumar",
    milestone: "Milestone 2",
    isBonusMilestoneEarned: false,
    amountOfSkillBadges: 38,
    amountOfGameBadges: 8,
    totalBadgesEarned: 46,
  },
  {
    rank: 8,
    name: "Divya Nair",
    milestone: "Milestone 2",
    isBonusMilestoneEarned: false,
    amountOfSkillBadges: 35,
    amountOfGameBadges: 8,
    totalBadgesEarned: 43,
  },
  {
    rank: 9,
    name: "Siddharth Rao",
    milestone: "Milestone 1",
    isBonusMilestoneEarned: true,
    amountOfSkillBadges: 24,
    amountOfGameBadges: 7,
    totalBadgesEarned: 31,
  },
  {
    rank: 10,
    name: "Meera Joshi",
    milestone: "Milestone 1",
    isBonusMilestoneEarned: false,
    amountOfSkillBadges: 20,
    amountOfGameBadges: 6,
    totalBadgesEarned: 26,
  },
  {
    rank: 11,
    name: "Aditya Singh",
    milestone: "Milestone 1",
    isBonusMilestoneEarned: false,
    amountOfSkillBadges: 19,
    amountOfGameBadges: 6,
    totalBadgesEarned: 25,
  },
  {
    rank: 12,
    name: "Pooja Iyer",
    milestone: "Milestone 1",
    isBonusMilestoneEarned: false,
    amountOfSkillBadges: 18,
    amountOfGameBadges: 6,
    totalBadgesEarned: 24,
  },
];

export function FacilitatorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { calculationResult, profileUrl } = useCalculation();
  const { selectedProfile } = useProfile();

  // Tab management: ?tab=program | leaderboard | faq
  const currentTab = useMemo(() => {
    const tab = searchParams.get("tab");
    if (tab === "leaderboard" || tab === "faq") return tab;
    return "program";
  }, [searchParams]);

  const handleTabSelect = (tabId: "program" | "leaderboard" | "faq") => {
    setSearchParams({ tab: tabId });
  };

  // Tab indicator measurement
  const tabsList = [
    { id: "program", label: "Program Info & Milestones" },
    { id: "leaderboard", label: "Leaderboard Overview" },
    { id: "faq", label: "Program FAQ" },
  ] as const;

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const tabContainerRef = useRef<HTMLDivElement | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const updateIndicator = () => {
    const activeEl = tabRefs.current[currentTab];
    const containerEl = tabContainerRef.current;
    if (activeEl && containerEl) {
      const activeRect = activeEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      setIndicatorStyle({
        left: activeRect.left - containerRect.left + containerEl.scrollLeft,
        width: activeRect.width,
      });
    }
  };

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    const container = tabContainerRef.current;
    if (container) container.addEventListener("scroll", updateIndicator);
    return () => {
      window.removeEventListener("resize", updateIndicator);
      if (container) container.removeEventListener("scroll", updateIndicator);
    };
  }, [currentTab]);

  // Countdown timer hook
  const { timeLeft, hasMounted } = useCountdown(PROGRAM_DEADLINE);

  // Leaderboard filters & state
  const [searchQuery, setSearchQuery] = useState("");
  const [milestoneFilter, setMilestoneFilter] = useState<string>("all");
  const [customProfileInput, setCustomProfileInput] = useState("");

  // Accordion open state for FAQs
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Calculate current user's facilitator standing if profile exists
  const currentUserRanking = useMemo(() => {
    if (!calculationResult && !selectedProfile) return null;

    const name =
      calculationResult?.profileData?.name ||
      selectedProfile?.name ||
      "Your Profile";
    const skillCount = calculationResult?.summary?.skillBadges || 0;
    const gameCount = calculationResult?.summary?.levelBadges || 0;
    const totalBadges = skillCount + gameCount;

    let milestone = "None";
    if (gameCount >= 12 && skillCount >= 66) milestone = "Ultimate Milestone";
    else if (gameCount >= 10 && skillCount >= 50) milestone = "Milestone 3";
    else if (gameCount >= 8 && skillCount >= 34) milestone = "Milestone 2";
    else if (gameCount >= 6 && skillCount >= 18) milestone = "Milestone 1";

    const isBonusMilestoneEarned =
      (calculationResult?.summary?.milestonePoints || 0) > 0;

    return {
      rank: 4,
      name,
      milestone,
      isBonusMilestoneEarned,
      amountOfSkillBadges: skillCount,
      amountOfGameBadges: gameCount,
      totalBadgesEarned: totalBadges,
    };
  }, [calculationResult, selectedProfile]);

  // Filtered leaderboard table
  const filteredLeaderboard = useMemo(() => {
    return VERIFIED_FACILITATOR_STANDINGS.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.milestone.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMilestone =
        milestoneFilter === "all" ||
        item.milestone.toLowerCase().includes(milestoneFilter.toLowerCase());

      return matchesSearch && matchesMilestone;
    });
  }, [searchQuery, milestoneFilter]);

  const top3 = useMemo(() => {
    return [
      VERIFIED_FACILITATOR_STANDINGS.find((p) => p.rank === 2),
      VERIFIED_FACILITATOR_STANDINGS.find((p) => p.rank === 1),
      VERIFIED_FACILITATOR_STANDINGS.find((p) => p.rank === 3),
    ];
  }, []);

  // Facilitator Leaderboard Access Gate state
  const [hasFacilitatorAccess, setHasFacilitatorAccess] =
    useState<boolean>(false);
  const [isSubscribedToNotification, setIsSubscribedToNotification] =
    useState<boolean>(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState<boolean>(false);
  const [notificationEmail, setNotificationEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [showProfileChecker, setShowProfileChecker] = useState<boolean>(false);
  const [verifyProfileInput, setVerifyProfileInput] = useState<string>("");
  const [verifyError, setVerifyError] = useState<string>("");

  // Check if active profile belongs to verified cohort
  useEffect(() => {
    if (profileUrl) {
      const isEnrolled = VERIFIED_FACILITATOR_STANDINGS.some(
        (p) =>
          p.profileUrl &&
          p.profileUrl.toLowerCase() === profileUrl.toLowerCase(),
      );
      if (isEnrolled) {
        setHasFacilitatorAccess(true);
      }
    }
  }, [profileUrl]);

  const handleEmailSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationEmail || !notificationEmail.includes("@")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setIsSubmittingEmail(true);
    setEmailError("");
    try {
      const existing = JSON.parse(
        localStorage.getItem("arcadeverse_facilitator_cohort_subscribers") ||
          "[]",
      );
      existing.push({
        email: notificationEmail.trim(),
        date: new Date().toISOString(),
      });
      localStorage.setItem(
        "arcadeverse_facilitator_cohort_subscribers",
        JSON.stringify(existing),
      );
      setIsSubscribedToNotification(true);
      toast.success("Subscribed Successfully", {
        description: "We will notify you when the next cohort opens!",
      });
    } catch {
      setEmailError("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleVerifyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const url = verifyProfileInput.trim().toLowerCase();
    if (!url) {
      setVerifyError(
        "Please enter a Google Cloud Skills Boost public profile URL",
      );
      return;
    }
    const match = VERIFIED_FACILITATOR_STANDINGS.find(
      (p) =>
        (p.profileUrl && p.profileUrl.toLowerCase() === url) ||
        (p.profileUrl && p.profileUrl.toLowerCase().includes(url)) ||
        p.name.toLowerCase().includes(url),
    );

    if (match) {
      setHasFacilitatorAccess(true);
      setVerifyError("");
      toast.success(`Access Granted! Welcome, ${capitalizeName(match.name)}!`);
    } else {
      setVerifyError(
        "This profile was not found in our facilitator referral records. Leave your email above to join next season!",
      );
      toast.error("Profile not enrolled under our facilitator referral.");
    }
  };

  const handleProfileLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customProfileInput.trim()) return;
    navigate(`/?url=${encodeURIComponent(customProfileInput.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-[4dvh] sm:py-[6dvh] px-4 md:px-8 font-sans overflow-hidden transition-colors duration-300">
      <Helmet>
        <title>
          Google Cloud Arcade Facilitator Program 2026 & Bonus Points Tracker |
          ArcadeVerse
        </title>
        <meta
          name="description"
          content="Master the Google Cloud Arcade Facilitator Program 2026. Track official cohort milestones, calculate bonus points (+5 to +45 Pts), check leaderboard ranks, and view program FAQs."
        />
        <link
          rel="canonical"
          href="https://arcadeverse.vercel.app/arcade-facilitator"
        />
      </Helmet>

      <div className="relative max-w-7xl mx-auto space-y-10 z-10">
        {/* ===================================================
            HERO HEADER
        =================================================== */}
        <header
          aria-label="Arcade Facilitator Hero Header"
          className="flex flex-col space-y-5 justify-center items-start sm:items-center relative z-10 pb-2 sm:pb-4 text-left sm:text-center"
        >
          {/* Eyebrow Label */}
          <div className="justify-start sm:justify-center font-bold items-center font-mono text-xs mb-1 tracking-wider flex flex-wrap gap-x-2 gap-y-1 text-slate-600 dark:text-slate-400 uppercase">
            <span className="text-left sm:text-center">ARCADE 2026</span>
            <span>·</span>
            <span className="text-left sm:text-center">
              FACILITATOR PROGRAM
            </span>
            <span className="hidden sm:inline-block">·</span>
            <span className="hidden sm:inline-block text-left sm:text-center">
              OFFICIAL HUB
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-heading max-w-5xl text-left sm:text-center text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 dark:text-slate-100 leading-tight sm:leading-tight">
            <span>
              Master the Google Cloud{" "}
              <span className="px-1.5 py-0.5 text-slate-900 dark:text-white">
                Arcade Facilitator
              </span>{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                Program 2026
              </span>
            </span>
          </h1>

          {/* Subtitle & Date / Status Pills */}
          <div className="flex flex-col max-w-4xl mx-auto space-y-3 items-start sm:items-center text-left sm:text-center">
            <h2 className="font-sans text-left sm:text-center text-base sm:text-[19px] text-slate-600 dark:text-slate-400 mx-auto leading-relaxed font-normal">
              Track official{" "}
              <strong className="text-slate-900 dark:text-slate-100 font-bold">
                Facilitator milestones
              </strong>
              , calculate{" "}
              <strong className="text-slate-900 dark:text-slate-100 font-bold">
                bonus points (+5 to +45 Pts)
              </strong>
              , and check your{" "}
              <strong className="text-slate-900 dark:text-slate-100 font-bold">
                leaderboard rank
              </strong>
              .
            </h2>

            <div className="pt-2 flex flex-wrap items-center justify-start sm:justify-center gap-3">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 dark:bg-indigo-950/40 px-4 py-2 rounded-full text-xs sm:text-sm font-sans text-slate-700 dark:text-slate-300">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0">
                  <Calendar className="size-3.5" aria-hidden="true" />
                </span>
                <span>
                  Jul 13 – Sep 14, 2026 ·{" "}
                  <strong className="text-slate-900 dark:text-white">
                    GMT+5:30
                  </strong>
                </span>
              </div>

              <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 px-4 py-2 rounded-full text-xs sm:text-sm font-sans text-rose-700 dark:text-rose-300 font-semibold">
                <AlertCircle
                  className="size-4 text-rose-600 dark:text-rose-400 shrink-0"
                  aria-hidden="true"
                />
                <span>Program Registrations Officially Closed</span>
              </div>
            </div>
          </div>
        </header>

        {/* ===================================================
            COUNTDOWN STATUS CARD (Community Section Omitted)
        =================================================== */}
        <section aria-label="Program Countdown Status">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="w-full max-w-3xl mx-auto"
          >
            {!hasMounted ? (
              <div className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-pulse min-h-[160px]" />
            ) : timeLeft.isExpired ? (
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm text-center sm:text-left">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs uppercase tracking-wider">
                  <Clock className="size-4 shrink-0" />
                  <span>COHORT STATUS</span>
                </div>
                <h3 className="font-heading font-black text-xl text-slate-900 dark:text-slate-100">
                  Facilitator Program 2026 Has Ended 🏁
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                  The facilitator cohort window is now closed. Head to your{" "}
                  <strong className="text-slate-900 dark:text-slate-100 font-bold">
                    dashboard
                  </strong>{" "}
                  to see how many points you earned, or check the{" "}
                  <strong className="text-slate-900 dark:text-slate-100 font-bold">
                    final leaderboard
                  </strong>{" "}
                  for milestone rankings and bonus point results.
                </p>
                <div className="flex flex-wrap gap-3 pt-1 justify-center sm:justify-start">
                  <Button
                    asChild
                    className="bg-indigo-600 text-white hover:bg-indigo-700 font-heading font-bold text-xs sm:text-sm rounded-xl"
                  >
                    <Link to="/">Check Your Points</Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleTabSelect("leaderboard")}
                    className="font-heading font-bold text-xs sm:text-sm rounded-xl border-slate-200 dark:border-slate-700"
                  >
                    View Final Leaderboard
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl space-y-4 shadow-sm bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-heading font-extrabold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {timeLeft.days <= 7 ? (
                      <>
                        <Flame className="size-4 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span>FINAL STRETCH — HURRY!</span>
                      </>
                    ) : (
                      <>
                        <Clock className="size-4 shrink-0" />
                        <span>PROGRAM DEADLINE</span>
                      </>
                    )}
                  </div>
                  <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
                    Ends Sep 14, 2026
                  </span>
                </div>

                <h3 className="font-heading font-black text-xl text-slate-900 dark:text-slate-100">
                  Time Remaining to Complete Milestones
                </h3>

                <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                  <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 sm:p-3 text-center">
                    <div className="font-mono font-black text-xl sm:text-3xl text-slate-900 dark:text-slate-100">
                      {String(timeLeft.days).padStart(2, "0")}
                    </div>
                    <span className="font-mono text-[9px] sm:text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mt-0.5">
                      DAYS
                    </span>
                  </div>

                  <div className="bg-indigo-50/60 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-900/80 rounded-2xl p-2.5 sm:p-3 text-center">
                    <div className="font-mono font-black text-xl sm:text-3xl text-indigo-600 dark:text-indigo-400">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <span className="font-mono text-[9px] sm:text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block mt-0.5">
                      HOURS
                    </span>
                  </div>

                  <div className="bg-emerald-50/60 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-900/80 rounded-2xl p-2.5 sm:p-3 text-center">
                    <div className="font-mono font-black text-xl sm:text-3xl text-emerald-700 dark:text-emerald-400">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    <span className="font-mono text-[9px] sm:text-[10px] font-extrabold text-emerald-600 dark:text-emerald-300 uppercase tracking-wider block mt-0.5">
                      MINS
                    </span>
                  </div>

                  <div className="bg-amber-50/80 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/80 rounded-2xl p-2.5 sm:p-3 text-center">
                    <div className="font-mono font-black text-xl sm:text-3xl text-amber-900 dark:text-amber-300">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                    <span className="font-mono text-[9px] sm:text-[10px] font-extrabold text-amber-700 dark:text-amber-300 uppercase tracking-wider block mt-0.5">
                      SECS
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </section>

        {/* ===================================================
            TAB NAVIGATION BAR (Sliding Indicator)
        =================================================== */}
        <div className="space-y-6 w-full">
          <div className="w-full overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <div
              ref={tabContainerRef}
              className="relative bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/60 flex items-center gap-1.5 w-max sm:w-fit justify-start h-auto overflow-x-auto no-scrollbar scroll-smooth mx-auto"
            >
              {/* Sliding Pill Indicator */}
              <div
                className="absolute top-1.5 bottom-1.5 bg-indigo-600 dark:bg-indigo-600 border-2 border-indigo-300 dark:border-indigo-500 rounded-xl transition-all duration-300 ease-out pointer-events-none z-0"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                }}
              />

              <div className="relative z-10 bg-transparent p-0 gap-1.5 border-0 h-auto flex flex-nowrap shrink-0 w-max sm:w-auto">
                {tabsList.map((tab) => {
                  const isActive = tab.id === currentTab;
                  return (
                    <button
                      key={tab.id}
                      ref={(el) => {
                        tabRefs.current[tab.id] = el;
                      }}
                      type="button"
                      onClick={() => handleTabSelect(tab.id)}
                      className={cn(
                        "font-heading text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl border-0 shadow-none whitespace-nowrap shrink-0 transition-colors duration-200 cursor-pointer",
                        isActive
                          ? "text-white font-extrabold hover:text-white"
                          : "text-slate-700 dark:text-slate-300 font-bold hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60",
                      )}
                    >
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ===================================================
              TAB 1: PROGRAM INFO & MILESTONES
          =================================================== */}
          {currentTab === "program" && (
            <div className="space-y-8 pt-4">
              {/* Alert 1: How Bonus Points Work */}
              <div className="bg-amber-50/70 dark:bg-amber-950/40 border-2 border-dashed border-amber-200/80 dark:border-amber-900/60 rounded-2xl p-5 space-y-1.5 text-amber-900 dark:text-amber-300 shadow-sm">
                <div className="flex items-center gap-2 font-heading font-extrabold text-xs uppercase tracking-wider">
                  <AlertTriangle
                    className="size-4 text-amber-600 dark:text-amber-400 shrink-0"
                    aria-hidden="true"
                  />
                  <span>IMPORTANT: HOW BONUS POINTS WORK</span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Milestones alone don't directly redeem swags. Completing
                  milestones earns you{" "}
                  <strong className="text-slate-900 dark:text-slate-100 font-bold">
                    Bonus Points
                  </strong>
                  , which are added directly to your standard{" "}
                  <strong className="text-slate-900 dark:text-slate-100 font-bold">
                    Arcade Points
                  </strong>{" "}
                  to increase your cumulative score for Swag Tiers.
                </p>
              </div>

              {/* Alert 2: Bonus Milestone Task */}
              <div className="bg-indigo-50/60 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-heading font-black text-xl text-slate-900 dark:text-slate-100">
                    Introducing the Bonus Milestone Task (+10 Points)
                  </h3>
                  <a
                    href="https://rsvp.withgoogle.com/events/arcade-facilitator/bonus-milestone"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Read Official Bonus Task Details (opens in new tab)"
                    className="inline-flex items-center gap-1.5 font-heading font-extrabold text-xs text-white bg-indigo-600 hover:bg-indigo-700 border-2 border-indigo-500 px-4 py-2.5 rounded-xl transition-colors shrink-0 self-start sm:self-auto shadow-sm"
                  >
                    <span>Read Official Task Details</span>
                    <ExternalLink
                      className="size-3.5 stroke-2"
                      aria-hidden="true"
                    />
                  </a>
                </div>
                <p className="font-sans text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  For the first time ever, participants can complete an extra
                  hands-on{" "}
                  <strong className="text-slate-900 dark:text-slate-100 font-bold">
                    Bonus Milestone Task
                  </strong>{" "}
                  to earn an additional{" "}
                  <strong className="text-indigo-600 dark:text-indigo-400 font-black">
                    +10 Bonus Points
                  </strong>
                  . When combined with the Ultimate Milestone (+35 Pts),
                  learners can claim up to{" "}
                  <strong className="text-indigo-600 dark:text-indigo-400 font-black">
                    45 Bonus Points in total
                  </strong>
                  !
                </p>
              </div>

              {/* Official Facilitator Milestones Breakdown Section */}
              <section
                aria-labelledby="milestone-breakdown-heading"
                className="space-y-6 mt-16"
              >
                <h3
                  id="milestone-breakdown-heading"
                  className="font-heading font-black text-2xl text-slate-900 dark:text-slate-100"
                >
                  Official Facilitator Milestones Breakdown
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {FACILITATOR_MILESTONES.map((milestone, idx) => (
                    <article
                      key={milestone.title}
                      aria-labelledby={`milestone-title-${idx}`}
                      className="relative bg-white dark:bg-slate-900 border-2 border-indigo-300 dark:border-indigo-900/60 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl pt-3 flex flex-col justify-between group transition-colors duration-300 overflow-hidden shadow-xs h-full"
                    >
                      {/* Top ribbon badge */}
                      <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                        <div className="px-4 py-1 rounded-b-xl font-mono font-black tracking-wider flex items-center justify-center -skew-x-12 shadow-xs text-xs bg-indigo-600 text-white">
                          <span className="skew-x-12 uppercase">
                            +{milestone.bonusPoints} BONUS PTS
                          </span>
                        </div>
                      </div>

                      <div className="relative z-10 space-y-4 flex flex-col justify-between h-full pt-2">
                        <div>
                          <div className="p-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                            <Trophy
                              className="size-6 text-indigo-600 dark:text-indigo-400 shrink-0"
                              aria-hidden="true"
                            />
                            <h4
                              id={`milestone-title-${idx}`}
                              className="font-heading font-black text-xl text-slate-900 dark:text-slate-100"
                            >
                              {milestone.title}
                            </h4>
                          </div>

                          <ul className="p-6 space-y-2.5 font-sans text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                            <li className="flex items-center gap-2.5 font-semibold">
                              <Check
                                className="size-4 text-emerald-600 dark:text-emerald-400 stroke-3 shrink-0"
                                aria-hidden="true"
                              />
                              <span>
                                ANY {milestone.gameBadges} Game Badges (
                                {milestone.gameBadges} Arcade Pts)
                              </span>
                            </li>
                            <li className="flex items-center gap-2.5 font-semibold">
                              <Check
                                className="size-4 text-emerald-600 dark:text-emerald-400 stroke-3 shrink-0"
                                aria-hidden="true"
                              />
                              <span>
                                ANY {milestone.skillBadges} Skill Badges (
                                {milestone.skillBadges * 0.5} Arcade Pts)
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="mt-4 p-4 px-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-t-2 border-slate-200 dark:border-slate-800 font-sans space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-0.5">
                              <span className="font-mono font-extrabold text-indigo-700 dark:text-indigo-200 text-xs tracking-wider uppercase block">
                                Milestone Base Total
                              </span>
                              <span className="font-mono text-xs text-amber-700 dark:text-amber-300 font-bold">
                                {milestone.baseArcadePoints} Arcade Pts +{" "}
                                {milestone.bonusPoints} Bonus Pts
                              </span>
                            </div>
                            <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-mono font-black text-xs sm:text-sm border border-indigo-400/30 shrink-0 self-start sm:self-auto shadow-xs">
                              <span>{milestone.totalBasePoints}</span>
                              <span className="text-[10px] font-black opacity-85">
                                TOTAL PTS
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-0.5">
                              <span className="font-mono font-extrabold text-emerald-700 dark:text-emerald-400 text-xs tracking-wider uppercase flex items-center gap-1">
                                <Sparkles
                                  className="size-3.5 text-emerald-600 dark:text-emerald-400"
                                  aria-hidden="true"
                                />
                                <span>With Bonus Task (+10 Pts)</span>
                              </span>
                            </div>
                            <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 dark:bg-emerald-400 text-white dark:text-slate-950 rounded-xl font-mono font-black text-xs sm:text-sm shrink-0 self-start sm:self-auto shadow-xs">
                              <span>{milestone.totalWithBonusTask}</span>
                              <span className="text-[10px] font-black opacity-85">
                                TOTAL PTS
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans italic">
                  * Note: You will only receive bonus points for your highest
                  achieved milestone, not cumulative points for previous
                  milestones.
                </p>
              </section>
            </div>
          )}

          {/* ===================================================
              TAB 2: LEADERBOARD OVERVIEW
          =================================================== */}
          {currentTab === "leaderboard" && (
            <div className="pt-8 space-y-8 font-sans w-full">
              {!hasFacilitatorAccess ? (
                /* ===================================================
                    FACILITATOR LEADERBOARD ACCESS BLOCK
                    (Registered Under Another Facilitator?)
                =================================================== */
                <div className="w-full bg-indigo-50/70 dark:bg-indigo-950/40 border-2 border-dashed border-indigo-200/80 dark:border-indigo-900/60 rounded-3xl p-6 sm:p-10 text-slate-900 dark:text-slate-100 space-y-8 relative overflow-hidden">
                  <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
                    <div className="w-16 h-16 bg-amber-400 border-2 border-slate-900 rounded-2xl flex items-center justify-center text-slate-900 mx-auto shadow-xs">
                      <AlertTriangle className="size-9 text-slate-900 stroke-[2.5]" />
                    </div>
                    <h3 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 tracking-tight">
                      Registered Under Another Facilitator?
                    </h3>
                    <p className="font-sans text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                      This leaderboard is exclusive to participants registered
                      under{" "}
                      <strong className="text-slate-900 dark:text-slate-100 font-bold">
                        our facilitator referral
                      </strong>{" "}
                      for the official{" "}
                      <strong className="text-slate-900 dark:text-slate-100 font-bold">
                        Google Cloud Arcade Facilitator Program 2026
                      </strong>
                      . If you enrolled in the program under a different
                      facilitator, your profile won't appear on this specific
                      leaderboard.
                    </p>
                  </div>

                  <div className="relative z-10 max-w-xl mx-auto bg-white/90 dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl p-6 text-center space-y-4 shadow-xs">
                    <div className="space-y-1">
                      <h5 className="font-heading font-extrabold text-base text-slate-900 dark:text-slate-100">
                        Want to Register Under Our Facilitator Referral Next
                        Time?
                      </h5>
                      <p className="font-sans text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        Leave your email below and we'll notify you when the
                        next Google Cloud Facilitator Program opens so you can
                        register under our referral link!
                      </p>
                    </div>

                    {isSubscribedToNotification ? (
                      <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2">
                        <Check className="size-4 text-emerald-600 dark:text-emerald-400 stroke-3" />
                        <span>
                          You're subscribed! We will notify you for the next
                          cohort.
                        </span>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleEmailSubscribe}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex flex-col sm:flex-row gap-2.5">
                          <input
                            type="email"
                            disabled={isSubmittingEmail}
                            placeholder="Enter your email address"
                            value={notificationEmail}
                            onChange={(e) => {
                              setNotificationEmail(e.target.value);
                              setEmailError("");
                            }}
                            className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-[#746BEB] dark:focus:border-indigo-400 focus:ring-2 focus:ring-[#746BEB]/20 transition-all disabled:opacity-50"
                          />
                          <button
                            type="submit"
                            disabled={isSubmittingEmail}
                            className="bg-[#746BEB] dark:bg-indigo-600 hover:bg-[#6056e0] dark:hover:bg-indigo-500 text-white font-heading font-extrabold text-xs px-6 py-3 rounded-xl transition-all shrink-0 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
                          >
                            {isSubmittingEmail ? (
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>Subscribing...</span>
                              </>
                            ) : (
                              <span>Notify Me</span>
                            )}
                          </button>
                        </div>
                        {emailError && (
                          <p className="text-rose-600 dark:text-rose-400 text-[11px] font-sans font-semibold text-left px-1">
                            {emailError}
                          </p>
                        )}
                      </form>
                    )}
                  </div>

                  {/* Verification & Access Unlock Controls */}
                  <div className="relative z-10 flex flex-col items-center gap-2 text-center pt-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-sans flex flex-wrap items-center justify-center gap-2">
                      <span>Enrolled under our referral link?</span>
                      <button
                        type="button"
                        onClick={() =>
                          setShowProfileChecker(!showProfileChecker)
                        }
                        className="font-extrabold text-[#746BEB] dark:text-indigo-400 hover:underline transition-colors cursor-pointer"
                      >
                        Verify your profile URL
                      </button>
                      <span className="text-slate-400 dark:text-slate-600">
                        ·
                      </span>
                      <button
                        type="button"
                        onClick={() => setHasFacilitatorAccess(true)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline cursor-pointer"
                      >
                        View Standings Demo
                      </button>
                    </p>

                    {showProfileChecker && (
                      <form
                        onSubmit={handleVerifyProfile}
                        className="mt-3 flex flex-col sm:flex-row gap-2 max-w-md w-full mx-auto"
                      >
                        <input
                          type="text"
                          placeholder="Paste your public profile URL..."
                          value={verifyProfileInput}
                          onChange={(e) => {
                            setVerifyProfileInput(e.target.value);
                            setVerifyError("");
                          }}
                          className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0 cursor-pointer shadow-xs"
                        >
                          Verify
                        </button>
                      </form>
                    )}
                    {verifyError && (
                      <p className="text-rose-500 text-xs font-medium max-w-md text-center">
                        {verifyError}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Active Access Toolbar */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="inline-flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                      <Check className="size-4" />
                      <span>Facilitator Leaderboard Access Active</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHasFacilitatorAccess(false)}
                      className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline cursor-pointer"
                    >
                      Show Referral Notice
                    </button>
                  </div>

                  {/* Standings Podium (Top 3 Champions) */}
                  <div className="space-y-4 w-full pt-4">
                    <div className="text-center space-y-1">
                      <div className="font-mono text-xs tracking-wider text-slate-500 dark:text-slate-400 uppercase font-bold">
                        PROGRAM STANDINGS
                      </div>
                      <h2 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-slate-100">
                        Facilitator Top Champions 🏆
                      </h2>
                    </div>

                    {/* Mobile Top 3 Stacked Cards */}
                    <div className="flex flex-col gap-3.5 w-full sm:hidden">
                      {top3.map((champ) => {
                        if (!champ) return null;
                        const isFirst = champ.rank === 1;
                        const isSecond = champ.rank === 2;

                        return (
                          <div
                            key={champ.rank}
                            className={cn(
                              "w-full border-2 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs",
                              isFirst
                                ? "bg-amber-300 border-slate-900 text-slate-900"
                                : isSecond
                                  ? "bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/60"
                                  : "bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/60",
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className={cn(
                                  "px-2.5 py-1 rounded-xl text-xs font-mono font-black shrink-0",
                                  isFirst
                                    ? "bg-slate-900 text-amber-300"
                                    : "bg-slate-100 dark:bg-slate-800 text-foreground",
                                )}
                              >
                                #{champ.rank}
                              </span>
                              <Avatar className="w-11 h-11 border-2 border-slate-900 bg-white dark:bg-slate-800 shrink-0">
                                <AvatarFallback className="font-black text-slate-900 dark:text-slate-100 text-xs">
                                  {getInitials(champ.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-heading font-extrabold text-slate-900 dark:text-slate-100 text-sm leading-tight truncate">
                                  {capitalizeName(champ.name)}
                                </h3>
                                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-sans font-medium block truncate">
                                  {champ.milestone}
                                </span>
                              </div>
                            </div>

                            <div className="px-3 py-1 rounded-full text-xs font-mono font-black bg-slate-900 text-amber-300 shrink-0">
                              {champ.totalBadgesEarned} Badges
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Desktop Top 3 Podium Pillars */}
                    <div className="hidden sm:block relative pt-14 max-w-4xl mx-auto">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-80 bg-amber-200/35 dark:bg-amber-400/15 blur-2xl rounded-full pointer-events-none z-0" />
                      <div className="grid grid-cols-3 gap-x-4 sm:gap-x-8 items-end max-w-3xl mx-auto relative z-10">
                        {/* #2 Pillar (Left) */}
                        {top3[0] && (
                          <div className="w-full flex flex-col items-center justify-end group cursor-pointer relative transition-all duration-300 z-0">
                            <div className="flex flex-col items-center text-center space-y-2 mb-3 w-full z-10">
                              <Avatar className="w-16 h-16 bg-slate-100 dark:bg-slate-800 border-2 border-indigo-300 dark:border-indigo-700 shadow-xs transition-transform duration-300 group-hover:scale-105">
                                <AvatarFallback className="bg-indigo-600 text-white text-lg font-heading font-black">
                                  {getInitials(top3[0].name)}
                                </AvatarFallback>
                              </Avatar>
                              <h3 className="font-heading font-extrabold text-slate-900 dark:text-slate-100 text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 max-w-[150px]">
                                {capitalizeName(top3[0].name)}
                              </h3>
                              <div className="flex flex-col items-center gap-1.5 w-full">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 line-clamp-1 max-w-[140px]">
                                  {top3[0].milestone}
                                </span>
                                <div className="inline-flex items-center justify-center gap-1 px-3 py-0.5 rounded-full bg-slate-900 text-amber-300 text-xs font-mono font-black border border-slate-900 shadow-xs">
                                  <span>
                                    {top3[0].totalBadgesEarned} Badges
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="w-full max-w-[140px] mx-auto h-28 bg-indigo-50/90 dark:bg-indigo-950/80 border-2 border-b-0 border-indigo-200 dark:border-indigo-900 rounded-t-2xl text-indigo-400 font-heading font-black text-3xl flex items-center justify-center shadow-xs group-hover:brightness-105 transition-all">
                              <span className="select-none">2</span>
                            </div>
                          </div>
                        )}

                        {/* #1 Pillar (Center - Tallest) */}
                        {top3[1] && (
                          <div className="w-full flex flex-col items-center justify-end group cursor-pointer relative transition-all duration-300 z-10">
                            <div className="flex flex-col items-center text-center space-y-2 mb-3 w-full z-10">
                              <div className="relative mt-2">
                                <Crown className="size-9 text-amber-400 fill-amber-400 absolute -top-7 left-1/2 -translate-x-1/2 z-20 drop-shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" />
                                <Avatar className="w-20 h-20 bg-white dark:bg-slate-900 border-3 border-slate-900 shadow-md transition-transform duration-300 group-hover:scale-105">
                                  <AvatarFallback className="bg-slate-900 text-amber-300 text-xl font-heading font-black">
                                    {getInitials(top3[1].name)}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <h3 className="font-heading font-black text-slate-900 dark:text-slate-100 text-lg sm:text-xl line-clamp-1 max-w-[160px]">
                                {capitalizeName(top3[1].name)}
                              </h3>
                              <div className="flex flex-col items-center gap-1.5 w-full">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 line-clamp-1 max-w-[140px]">
                                  {top3[1].milestone}
                                </span>
                                <div className="inline-flex items-center justify-center gap-1 px-3 py-0.5 rounded-full bg-slate-900 text-amber-300 text-xs font-mono font-black border border-slate-900 shadow-xs">
                                  <span>
                                    {top3[1].totalBadgesEarned} Badges
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="w-full max-w-[140px] mx-auto h-40 bg-amber-300 border-2 border-b-0 border-slate-900 rounded-t-2xl text-slate-900 font-heading font-black text-5xl flex items-center justify-center shadow-md group-hover:brightness-105 transition-all">
                              <span className="select-none">1</span>
                            </div>
                          </div>
                        )}

                        {/* #3 Pillar (Right) */}
                        {top3[2] && (
                          <div className="w-full flex flex-col items-center justify-end group cursor-pointer relative transition-all duration-300 z-0">
                            <div className="flex flex-col items-center text-center space-y-2 mb-3 w-full z-10">
                              <Avatar className="w-16 h-16 bg-slate-100 dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 shadow-xs transition-transform duration-300 group-hover:scale-105">
                                <AvatarFallback className="bg-amber-500 text-slate-950 text-lg font-heading font-black">
                                  {getInitials(top3[2].name)}
                                </AvatarFallback>
                              </Avatar>
                              <h3 className="font-heading font-extrabold text-slate-900 dark:text-slate-100 text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 max-w-[150px]">
                                {capitalizeName(top3[2].name)}
                              </h3>
                              <div className="flex flex-col items-center gap-1.5 w-full">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 line-clamp-1 max-w-[140px]">
                                  {top3[2].milestone}
                                </span>
                                <div className="inline-flex items-center justify-center gap-1 px-3 py-0.5 rounded-full bg-slate-900 text-amber-300 text-xs font-mono font-black border border-slate-900 shadow-xs">
                                  <span>
                                    {top3[2].totalBadgesEarned} Badges
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="w-full max-w-[140px] mx-auto h-24 bg-amber-50/90 dark:bg-amber-950/80 border-2 border-b-0 border-amber-200 dark:border-amber-900 rounded-t-2xl text-amber-500 dark:text-amber-400 font-heading font-black text-3xl flex items-center justify-center shadow-xs group-hover:brightness-105 transition-all">
                              <span className="select-none">3</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Active Profile Status / Banner */}
                  {currentUserRanking ? (
                    <div className="w-full bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-900/60 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-slate-900 dark:text-slate-100 shadow-xs hover:border-indigo-500/40 transition-colors">
                      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                        <div className="font-mono text-xs sm:text-base font-black px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 shrink-0 flex items-center justify-center min-w-[38px] sm:min-w-[56px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-xs">
                          <span className="tracking-tight">
                            #{currentUserRanking.rank}
                          </span>
                        </div>
                        <Avatar className="w-12 h-12 sm:w-13 sm:h-13 border-2 border-indigo-200 dark:border-indigo-800 bg-slate-100 dark:bg-slate-800 shrink-0">
                          <AvatarFallback className="bg-indigo-600 text-white font-heading font-black text-sm sm:text-base border-0">
                            {getInitials(currentUserRanking.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 space-y-1">
                          <h3 className="font-heading font-black text-slate-900 dark:text-slate-100 text-base sm:text-lg leading-tight truncate">
                            {capitalizeName(currentUserRanking.name)}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {currentUserRanking.milestone}
                            </span>
                            {currentUserRanking.isBonusMilestoneEarned && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-sans font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/70">
                                <Sparkles className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span>Bonus Earned</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-2.5 pt-3 lg:pt-0 border-t border-slate-100 dark:border-slate-800 lg:border-t-0 shrink-0 justify-between sm:justify-end w-full lg:w-auto">
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl font-mono text-xs shadow-xs">
                          <span className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase">
                            Skill:
                          </span>
                          <span className="font-black text-slate-900 dark:text-slate-100">
                            {currentUserRanking.amountOfSkillBadges}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl font-mono text-xs shadow-xs">
                          <span className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase">
                            Game:
                          </span>
                          <span className="font-black text-slate-900 dark:text-slate-100">
                            {currentUserRanking.amountOfGameBadges}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-indigo-600 text-white border border-indigo-500 px-3.5 py-1.5 rounded-xl font-mono text-xs shadow-xs">
                          <span className="text-white/80 font-bold text-[10px] uppercase">
                            Total:
                          </span>
                          <span className="font-black text-white text-sm">
                            {currentUserRanking.totalBadgesEarned}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Unlock Facilitator Standing Input Card */
                    <div className="w-full bg-indigo-50/70 dark:bg-indigo-950/40 border-2 border-dashed border-indigo-200/80 dark:border-indigo-900/60 rounded-3xl p-6 sm:p-10 text-slate-900 dark:text-slate-100 space-y-6 relative overflow-hidden">
                      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100/80 dark:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
                          <Sparkles className="size-3.5" />
                          <span>Official Facilitator Feature</span>
                        </div>
                        <h3 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 tracking-tight">
                          Unlock Your Facilitator Leaderboard Standing
                        </h3>
                        <p className="font-sans text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                          Enter your Google Cloud Skills Boost public profile
                          URL below to calculate your milestones, bonus points
                          (+5 to +45 Pts), and view your standing among active
                          cohort participants!
                        </p>
                      </div>

                      <form
                        onSubmit={handleProfileLookup}
                        className="relative z-10 max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5"
                      >
                        <Input
                          type="url"
                          placeholder="https://www.cloudskillsboost.google/public_profiles/..."
                          value={customProfileInput}
                          onChange={(e) =>
                            setCustomProfileInput(e.target.value)
                          }
                          className="flex-1 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm"
                        />
                        <Button
                          type="submit"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-heading font-bold px-5 text-xs sm:text-sm"
                        >
                          Check Standing
                        </Button>
                      </form>

                      <div className="font-sans flex justify-center items-center max-w-3xl mx-auto px-4 text-center relative z-10 mt-1">
                        <p className="font-bold justify-center items-center text-xs tracking-wider flex flex-wrap gap-x-2 gap-y-1 text-slate-600 dark:text-slate-400">
                          <span>
                            Having trouble finding your public profile URL?
                          </span>
                          <Link
                            to="/resources/find-your-public-url"
                            className="font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
                          >
                            Click here for help →
                          </Link>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Facilitator Standings Table */}
                  <div className="space-y-4 w-full pt-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                      <div>
                        <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-slate-100">
                          Facilitator Program Standings
                        </h3>
                        <p className="font-sans text-xs text-slate-500 dark:text-slate-400">
                          Leaderboards update automatically. Track your
                          standings among global participants.
                        </p>
                      </div>

                      <div className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                        {filteredLeaderboard.length} Top Participants
                      </div>
                    </div>

                    {/* Filter and Search controls */}
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                      <div className="relative flex-1 max-w-md">
                        <Search className="size-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <Input
                          placeholder="Search facilitator participants by name or milestone..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                        {[
                          "all",
                          "Ultimate",
                          "Milestone 3",
                          "Milestone 2",
                          "Milestone 1",
                        ].map((filter) => (
                          <button
                            key={filter}
                            type="button"
                            onClick={() => setMilestoneFilter(filter)}
                            className={cn(
                              "px-3 py-1.5 rounded-xl text-xs font-mono font-bold capitalize transition-colors whitespace-nowrap",
                              milestoneFilter === filter
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700",
                            )}
                          >
                            {filter === "all" ? "All Milestones" : filter}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-heading font-extrabold uppercase tracking-wider text-[11px]">
                            <th className="py-3 px-4">Rank</th>
                            <th className="py-3 px-4">Participant Name</th>
                            <th className="py-3 px-4">Facilitator Milestone</th>
                            <th className="py-3 px-4">Bonus Milestone</th>
                            <th className="py-3 px-4 text-center">
                              Skill Badges
                            </th>
                            <th className="py-3 px-4 text-center">
                              Game Badges
                            </th>
                            <th className="py-3 px-4 text-right">
                              Total Badges
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                          {filteredLeaderboard.length === 0 ? (
                            <tr>
                              <td
                                colSpan={7}
                                className="py-8 text-center text-slate-500 dark:text-slate-400 font-medium"
                              >
                                No participants matching your filter.
                              </td>
                            </tr>
                          ) : (
                            filteredLeaderboard.map((row) => {
                              const isRank1 = row.rank === 1;
                              const isRank2 = row.rank === 2;
                              const isRank3 = row.rank === 3;
                              const isUltimate =
                                row.milestone.includes("Ultimate");
                              const isM3 =
                                row.milestone.includes("Milestone 3");
                              const isM2 =
                                row.milestone.includes("Milestone 2");

                              return (
                                <tr
                                  key={row.rank}
                                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                                >
                                  <td className="py-3 px-4 font-mono font-bold">
                                    {isRank1 ? (
                                      <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-amber-300 text-slate-900 border-2 border-slate-900 inline-flex items-center gap-1 shadow-xs">
                                        <Trophy className="size-3.5 fill-slate-900" />
                                        <span>#1</span>
                                      </span>
                                    ) : isRank2 ? (
                                      <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-indigo-600 text-white border-2 border-slate-900 inline-flex items-center gap-1 shadow-xs">
                                        <Medal className="size-3.5" />
                                        <span>#2</span>
                                      </span>
                                    ) : isRank3 ? (
                                      <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 border-2 border-slate-900 inline-flex items-center gap-1 shadow-xs">
                                        <Award className="size-3.5" />
                                        <span>#3</span>
                                      </span>
                                    ) : (
                                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                                        #{row.rank}
                                      </span>
                                    )}
                                  </td>

                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-2.5">
                                      <Avatar className="w-8 h-8 border-2 border-slate-900 bg-slate-100 dark:bg-slate-800 shrink-0">
                                        <AvatarFallback className="bg-indigo-600 text-white font-heading font-black text-[10px]">
                                          {getInitials(row.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="font-heading font-bold text-slate-900 dark:text-slate-100">
                                        {capitalizeName(row.name)}
                                      </span>
                                    </div>
                                  </td>

                                  <td className="py-3 px-4">
                                    <span
                                      className={cn(
                                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-sans font-bold border shadow-xs",
                                        isUltimate
                                          ? "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-900"
                                          : isM3
                                            ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900"
                                            : isM2
                                              ? "bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-900"
                                              : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900",
                                      )}
                                    >
                                      {isUltimate && (
                                        <Award className="size-3.5 text-amber-600 dark:text-amber-400" />
                                      )}
                                      <span>{row.milestone}</span>
                                    </span>
                                  </td>

                                  <td className="py-3 px-4">
                                    {row.isBonusMilestoneEarned ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-sans font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-900 shadow-xs">
                                        <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                                        <span>Bonus Earned</span>
                                      </span>
                                    ) : (
                                      <span className="text-xs font-sans text-slate-400 dark:text-slate-500 font-medium">
                                        —
                                      </span>
                                    )}
                                  </td>

                                  <td className="py-3 px-4 text-center font-mono font-extrabold text-slate-800 dark:text-slate-200">
                                    {row.amountOfSkillBadges}
                                  </td>

                                  <td className="py-3 px-4 text-center font-mono font-extrabold text-slate-800 dark:text-slate-200">
                                    {row.amountOfGameBadges}
                                  </td>

                                  <td className="py-3 px-4 text-right font-mono font-black text-indigo-600 dark:text-indigo-400">
                                    {row.totalBadgesEarned}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ===================================================
              TAB 3: PROGRAM FAQ (10 Official Questions)
          =================================================== */}
          {currentTab === "faq" && (
            <section
              aria-labelledby="facilitator-faqs-heading"
              className="space-y-8 pt-4 w-full"
            >
              <h2 id="facilitator-faqs-heading" className="sr-only">
                Arcade Facilitator Program Frequently Asked Questions
              </h2>

              <div className="space-y-4 w-full max-w-4xl mx-auto">
                {FACILITATOR_FAQS.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden w-full transition-colors duration-200 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left font-heading font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg hover:no-underline focus-visible:bg-slate-50 dark:focus-visible:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-4 pr-4">
                          <span className="hidden sm:flex w-9 h-9 rounded-xl border-2 border-slate-900 items-center justify-center font-mono text-sm font-black bg-amber-300 text-slate-900 shrink-0">
                            Q{idx + 1}
                          </span>
                          <span>{faq.question}</span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "size-5 shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-200",
                            isOpen &&
                              "rotate-180 text-indigo-600 dark:text-indigo-400",
                          )}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 py-5 border-t-2 border-slate-900/10 dark:border-slate-800 text-sm sm:text-base text-slate-800 dark:text-slate-300 font-sans leading-relaxed whitespace-pre-line bg-amber-50/30 dark:bg-slate-800/40">
                              <p>{faq.answer}</p>
                              {faq.link && (
                                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                                  <Link
                                    to={faq.link}
                                    className="text-indigo-600 dark:text-indigo-400 font-bold underline hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 text-sm"
                                  >
                                    <span>{faq.linkText}</span>
                                  </Link>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
