import { BadgeCard } from "@/components/BadgeCard";
import { LegendAchievementModal } from "@/components/achievement/LegendAchievementModal";
import { ArcadeJoystickIcon } from "@/components/dashboard/ArcadeJoystickIcon";
import { ProfileUpdateToast } from "@/components/dashboard/ProfileUpdateToast";
import { LegendCardUnlockBox } from "@/components/dashboard/LegendCardUnlockBox";
import ProfileCard from "@/components/dashboard/ProfileCard";
import { SeasonPrizesSection } from "@/components/dashboard/SeasonPrizesSection";
import { TIER_AVAILABILITY_CONFIG } from "@/config/tierAvailability";
import { useCalculation } from "@/lib/calculation-context";
import {
  BONUS_MILESTONE_POINTS,
  FACILITATOR_END_DATE,
  FACILITATOR_MILESTONES,
  FACILITATOR_START_DATE,
} from "@/lib/calculationLogic";
import { useDashboard } from "@/lib/dashboard-context";
import {
  CANONICAL_SITE_URL,
  extractLegendCardData,
  isLegendTier,
} from "@/lib/legendCardLogic";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  Award,
  Beaker,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Flame,
  Lock,
  Search,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

// --- Viewport Hook for Intentional Responsive Layout States ---
function useDashboardViewport() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440,
  );

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Desktop layout (>= 1280px): 3-column / 2x2 aligned grid matching Screenshot 3
  const isLargeDesktop = width >= 1280;
  // Windowed Desktop (768px - 1279px): 2-column layout with horizontal Swags matching Screenshot 1
  const isReducedDesktop = width >= 768 && width < 1280;
  // Mobile (< 768px): Clean responsive stack
  const isMobile = width < 768;

  return { width, isLargeDesktop, isReducedDesktop, isMobile };
}

// --- Reusable Animation Primitives ---

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();
  const isFloat = target % 1 !== 0;
  useEffect(() => {
    if (reduce) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = target * eased;
      setValue(isFloat ? Math.round(current * 10) / 10 : Math.round(current));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduce, isFloat]);
  return value;
}

// Safely parse date strings into year, month, day in local context
function parseBadgeDate(earnedDateStr: string): {
  year: number;
  month: number;
  day: number;
  dateObj: Date;
} {
  if (!earnedDateStr) {
    const d = new Date();
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      day: d.getDate(),
      dateObj: d,
    };
  }
  const d = new Date(earnedDateStr);
  if (!isNaN(d.getTime())) {
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      day: d.getDate(),
      dateObj: d,
    };
  }
  const isoMatch = earnedDateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const year = Number.parseInt(isoMatch[1], 10);
    const month = Number.parseInt(isoMatch[2], 10) - 1; // 0-indexed (0 = Jan, 7 = Aug)
    const day = Number.parseInt(isoMatch[3], 10);
    return { year, month, day, dateObj: new Date(year, month, day) };
  }
  const fallback = new Date();
  return {
    year: fallback.getFullYear(),
    month: fallback.getMonth(),
    day: fallback.getDate(),
    dateObj: fallback,
  };
}

function ProgressReveal({
  value,
  className = "bg-accent-green",
  height = "h-1.5",
}: {
  value: number;
  className?: string;
  height?: string;
}) {
  const reduce = useReducedMotion();
  const clamped = Math.max(0, Math.min(value, 100));
  return (
    <div
      className={`w-full bg-surface-hover/80 rounded-full ${height} overflow-hidden`}
    >
      <motion.div
        className={`${height} rounded-full ${className}`}
        initial={reduce ? { width: `${clamped}%` } : { width: 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
    </div>
  );
}

export default function ArcadeVerseDashboard() {
  const {
    user,
    swagTiers,
    badgeCategories,
    incompleteBadges,
    weeklyProgress,
    isLoading,
    isFacilitator,
    setIsFacilitator,
    updateUserPoints,
  } = useDashboard();

  const { calculationResult, profileUrl } = useCalculation();
  const { isLargeDesktop, isReducedDesktop, isMobile } = useDashboardViewport();

  // Controls & Filters State
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<
    "all" | "game" | "skill"
  >("all");
  const [labsQtyFilter, setLabsQtyFilter] = useState<
    "all" | "1-3" | "4-6" | "7+"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBonusMilestone, setShowBonusMilestone] = useState(false);
  const [hasConfirmedBonusMilestone, setHasConfirmedBonusMilestone] = useState(
    () => {
      return (
        localStorage.getItem("arcadeverse_bonus_milestone_confirmed") === "true"
      );
    },
  );
  const [isBonusMilestoneModalOpen, setIsBonusMilestoneModalOpen] =
    useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleToggleBonusMilestone = () => {
    if (!showBonusMilestone) {
      if (hasConfirmedBonusMilestone) {
        setShowBonusMilestone(true);
      } else {
        setIsBonusMilestoneModalOpen(true);
      }
    } else {
      setShowBonusMilestone(false);
    }
  };

  const activeUser = user;
  const [showLegendModal, setShowLegendModal] = useState(false);

  // Active badges source: live calculation badges
  const activeBadges = useMemo(() => {
    const calcAny = calculationResult as any;
    if (calcAny?.user?.badges && Array.isArray(calcAny.user.badges)) {
      return calcAny.user.badges;
    }
    if (calcAny?.badges && Array.isArray(calcAny.badges)) {
      return calcAny.badges;
    }
    return [];
  }, [calculationResult]);

  // Activity Month Navigation - strictly restricted to 12 months of current program year (Jan - Dec 2026)
  const ARCADE_PROGRAM_YEAR = 2026;
  const [selectedMonthDate, setSelectedMonthDate] = useState<Date>(
    () => new Date(ARCADE_PROGRAM_YEAR, 7, 1),
  ); // Defaults to August 2026

  useEffect(() => {
    if (activeBadges && activeBadges.length > 0) {
      let latest = new Date(0);
      activeBadges.forEach((b: any) => {
        if (!b.earnedDate) return;
        const { dateObj } = parseBadgeDate(b.earnedDate);
        if (dateObj > latest) latest = dateObj;
      });
      if (latest.getTime() > 0) {
        // Bound month between 0 (Jan) and 11 (Dec) of ARCADE_PROGRAM_YEAR
        const clampedMonth = Math.max(0, Math.min(11, latest.getMonth()));
        setSelectedMonthDate(new Date(ARCADE_PROGRAM_YEAR, clampedMonth, 1));
      }
    }
  }, [activeBadges]);

  const activityMonthLabel = selectedMonthDate.toLocaleDateString("en-US", {
    month: "long",
  });
  const daysInActivityMonth = new Date(
    ARCADE_PROGRAM_YEAR,
    selectedMonthDate.getMonth() + 1,
    0,
  ).getDate();
  const firstWeekday = new Date(
    ARCADE_PROGRAM_YEAR,
    selectedMonthDate.getMonth(),
    1,
  ).getDay();

  const canPrevMonth = selectedMonthDate.getMonth() > 0;
  const canNextMonth = selectedMonthDate.getMonth() < 11;

  const handlePrevMonth = () => {
    if (!canPrevMonth) return;
    setSelectedMonthDate(
      (d) => new Date(ARCADE_PROGRAM_YEAR, d.getMonth() - 1, 1),
    );
  };
  const handleNextMonth = () => {
    if (!canNextMonth) return;
    setSelectedMonthDate(
      (d) => new Date(ARCADE_PROGRAM_YEAR, d.getMonth() + 1, 1),
    );
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Copy Access Code handler with feedback
  const handleCopyAccessCode = async (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy access code", err);
    }
  };

  // Milestone definitions matching official Facilitator program
  const milestones = useMemo(
    () =>
      FACILITATOR_MILESTONES.map((m) => ({
        id: m.id,
        name: m.name,
        bonusPoints: m.milestoneBonus,
        requirements: { game: m.gamesRequired, skill: m.skillsRequired },
      })),
    [],
  );

  // 1. Whole-year badge counts from complete profile history (Primary Dashboard)
  const wholeYearBadgeCounts = useMemo(() => {
    const list =
      activeBadges && activeBadges.length > 0
        ? activeBadges
        : (calculationResult?.user?.badges as any[]) || [];

    if (list.length > 0) {
      const skillBadges = list.filter((b: any) => b.type === "skill").length;
      const gameBadges = list.filter(
        (b: any) => b.type === "game" || b.type === "trivia",
      ).length;
      return { gameBadges, skillBadges, total: skillBadges + gameBadges };
    }

    // Fallback from badgeCategories
    const baseCamp =
      badgeCategories.find((cat) => cat.name === "Base Camp Badges")?.badges ||
      0;
    const level =
      badgeCategories.find((cat) => cat.name === "Level Badges")?.badges || 0;
    const cert =
      badgeCategories.find((cat) => cat.name === "Certification Badges")
        ?.badges || 0;
    const special =
      badgeCategories.find((cat) => cat.name === "Special Badges")?.badges || 0;
    const trivia =
      badgeCategories.find((cat) => cat.name === "Trivia Badges")?.badges || 0;
    const game =
      badgeCategories.find((cat) => cat.name === "Game Badges")?.badges || 0;
    const gameBadges =
      game > 0 ? game : baseCamp + level + cert + special + trivia;

    const skillBadges =
      badgeCategories.find((cat) => cat.name === "Skill Badges")?.badges || 0;

    return { gameBadges, skillBadges, total: skillBadges + gameBadges };
  }, [activeBadges, calculationResult, badgeCategories]);

  // 2. Facilitator Milestone badge counts (strictly within July 13 - Sep 14 cohort window)
  const facilitatorMilestoneCounts = useMemo(() => {
    const list =
      activeBadges && activeBadges.length > 0
        ? activeBadges
        : (calculationResult?.user?.badges as any[]) || [];

    const milestoneBadges = list.filter((badge: any) => {
      if (!badge.earnedDate) return false;
      const earnedDate = new Date(badge.earnedDate);
      return (
        !isNaN(earnedDate.getTime()) &&
        earnedDate >= FACILITATOR_START_DATE &&
        earnedDate <= FACILITATOR_END_DATE
      );
    });

    const gameBadges = milestoneBadges.filter(
      (b: any) => b.type === "game" || b.type === "trivia",
    ).length;
    const skillBadges = milestoneBadges.filter(
      (b: any) => b.type === "skill",
    ).length;
    return { gameBadges, skillBadges };
  }, [activeBadges, calculationResult]);

  // Main dashboard distribution counts represent WHOLE-YEAR data
  const distributionCounts = wholeYearBadgeCounts;

  const totalDistributionBadges =
    distributionCounts.skillBadges + distributionCounts.gameBadges;

  // Check milestone completion using Facilitator cohort dataset
  const isMilestoneCompleted = (m: (typeof milestones)[0]) => {
    return (
      facilitatorMilestoneCounts.gameBadges >= m.requirements.game &&
      facilitatorMilestoneCounts.skillBadges >= m.requirements.skill
    );
  };

  // Highest completed milestone bonus (0, 5, 15, 25, 35)
  const milestoneCompletionBonus = useMemo(() => {
    const completed = milestones.filter(isMilestoneCompleted);
    if (completed.length === 0) return 0;
    return completed[completed.length - 1].bonusPoints;
  }, [milestones, facilitatorMilestoneCounts]);

  // Separate +10 Bonus Milestone challenge (toggled manually)
  const separateBonusPoints = showBonusMilestone ? BONUS_MILESTONE_POINTS : 0;

  // Total bonus points awarded from Facilitator program
  const totalBonusPoints = isFacilitator
    ? milestoneCompletionBonus + separateBonusPoints
    : 0;

  // Base arcade points (games + skills + trivia without facilitator bonuses)
  const basePoints = useMemo(() => {
    const calcAny = calculationResult as any;
    if (calcAny?.points) {
      const g = calcAny.points.gameBadges || 0;
      const t = calcAny.points.triviaBadges || 0;
      const s = calcAny.points.skillBadges || 0;
      return g + t + s;
    }
    if (calculationResult?.summary) {
      return (
        (calculationResult.summary.totalPoints || 0) -
        (calculationResult.summary.milestonePoints || 0)
      );
    }
    return distributionCounts.gameBadges + distributionCounts.skillBadges * 0.5;
  }, [calculationResult, distributionCounts]);

  // Final display points: base points + facilitator bonuses if enrolled
  const displayPoints = isFacilitator
    ? basePoints + totalBonusPoints
    : basePoints;
  const totalPoints = displayPoints;
  const animatedDisplayPoints = useCountUp(displayPoints);

  // Legend Tier eligibility strictly according to existing milestone configuration (>= 120 PTS)
  // Takes into account active displayPoints (including facilitator bonus points + bonus milestone when active)
  const userIsLegend = useMemo(() => {
    return isLegendTier(calculationResult, {
      ...activeUser,
      arcadePoints: displayPoints,
      points: displayPoints,
      bonusPoints: totalBonusPoints,
    });
  }, [calculationResult, activeUser, displayPoints, totalBonusPoints]);

  const effectivePhotoUrl = useMemo(() => {
    if (activeUser.photoUrl) return activeUser.photoUrl;
    const calcAny = calculationResult as any;
    if (calcAny?.profileData?.photoUrl) return calcAny.profileData.photoUrl;
    try {
      const activeId = localStorage.getItem("arcadeverse_current_profile_id");
      const savedProfiles = JSON.parse(
        localStorage.getItem("arcadeverse_profiles") || "[]",
      );
      const active = savedProfiles.find((p: any) => p.id === activeId);
      if (active?.photoUrl) return active.photoUrl;
      if (savedProfiles[0]?.photoUrl) return savedProfiles[0].photoUrl;
    } catch (e) {}
    return "";
  }, [activeUser.photoUrl, calculationResult]);

  const effectiveLeagueImage = useMemo(() => {
    const calcAny = calculationResult as any;
    if (calcAny?.profileData?.leagueImage)
      return calcAny.profileData.leagueImage;
    try {
      const activeId = localStorage.getItem("arcadeverse_current_profile_id");
      const savedProfiles = JSON.parse(
        localStorage.getItem("arcadeverse_profiles") || "[]",
      );
      const active = savedProfiles.find((p: any) => p.id === activeId);
      if (active?.leagueImage) return active.leagueImage;
      if (active?.calculationData?.profileData?.leagueImage)
        return active.calculationData.profileData.leagueImage;
    } catch (e) {}
    return "";
  }, [calculationResult]);

  // Sync live display points with dashboard context and saved profiles
  useEffect(() => {
    if (!displayPoints || displayPoints <= 0) return;
    updateUserPoints?.(displayPoints);

    try {
      const activeId = localStorage.getItem("arcadeverse_current_profile_id");
      const savedProfilesRaw = localStorage.getItem("arcadeverse_profiles");
      if (!savedProfilesRaw) return;
      const savedProfiles: any[] = JSON.parse(savedProfilesRaw);
      let updated = false;
      const newProfiles = savedProfiles.map((p) => {
        const isMatch = activeId ? p.id === activeId : p.url === profileUrl;
        if (
          isMatch &&
          (p.points !== displayPoints || p.bonusPoints !== totalBonusPoints)
        ) {
          updated = true;
          return {
            ...p,
            points: displayPoints,
            bonusPoints: totalBonusPoints,
          };
        }
        return p;
      });
      if (updated) {
        localStorage.setItem(
          "arcadeverse_profiles",
          JSON.stringify(newProfiles),
        );
        window.dispatchEvent(new Event("profilesUpdated"));
      }
    } catch (e) {}
  }, [displayPoints, totalBonusPoints, profileUrl, updateUserPoints]);

  // Normalized dynamic card data extracted from calculation result
  const legendCardData = useMemo(() => {
    if (!userIsLegend) return null;
    return extractLegendCardData(
      calculationResult,
      {
        ...activeUser,
        arcadePoints: displayPoints,
        bonusPoints: totalBonusPoints,
        photoUrl: effectivePhotoUrl,
      },
      CANONICAL_SITE_URL,
    );
  }, [
    calculationResult,
    activeUser,
    userIsLegend,
    displayPoints,
    totalBonusPoints,
    effectivePhotoUrl,
  ]);

  // --- Badge Distribution 2-Color Gauge Math ---
  const gaugeCircumference = Math.PI * 70; // semicircle with R = 70 => ~219.91
  const hasSkillBadges = distributionCounts.skillBadges > 0;
  const hasGameBadges = distributionCounts.gameBadges > 0;
  const totalBadgesCount =
    distributionCounts.skillBadges + distributionCounts.gameBadges;

  const skillRatio =
    totalBadgesCount > 0
      ? hasSkillBadges && !hasGameBadges
        ? 1
        : distributionCounts.skillBadges / totalBadgesCount
      : 0;
  const gameRatio =
    totalBadgesCount > 0
      ? hasGameBadges && !hasSkillBadges
        ? 1
        : distributionCounts.gameBadges / totalBadgesCount
      : 0;

  const skillStrokeLength = skillRatio * gaugeCircumference;
  const gameStrokeLength = gameRatio * gaugeCircumference;

  // --- Activity Month Heatmap ---
  const dayActivityMap = useMemo(() => {
    const map = new Map<
      number,
      { count: number; points: number; badges: any[] }
    >();
    activeBadges.forEach((badge: any) => {
      if (!badge.earnedDate) return;
      const { year, month, day } = parseBadgeDate(badge.earnedDate);
      if (
        year === selectedMonthDate.getFullYear() &&
        month === selectedMonthDate.getMonth()
      ) {
        const existing = map.get(day) || { count: 0, points: 0, badges: [] };
        const pts =
          badge.type === "skill"
            ? 0.5
            : badge.type === "game" || badge.type === "trivia"
              ? 1
              : 0;
        map.set(day, {
          count: existing.count + 1,
          points: Math.round((existing.points + pts) * 10) / 10,
          badges: [...existing.badges, badge],
        });
      }
    });
    return map;
  }, [activeBadges, selectedMonthDate]);

  const activeDaysCount = dayActivityMap.size;
  const activityCells: Array<number | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInActivityMonth }, (_, i) => i + 1),
  ];

  // --- Activity Timeline Data ---
  const timelineDateRange = useMemo(() => {
    if (!activeBadges || activeBadges.length === 0) return "No data";
    let minDate: Date | null = null;
    let maxDate: Date | null = null;
    activeBadges.forEach((b: any) => {
      if (!b.earnedDate) return;
      const { dateObj } = parseBadgeDate(b.earnedDate);
      if (!minDate || dateObj < minDate) minDate = dateObj;
      if (!maxDate || dateObj > maxDate) maxDate = dateObj;
    });
    if (!minDate || !maxDate) return "No data";
    const formatD = (d: Date) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${formatD(minDate)} - ${formatD(maxDate)}`;
  }, [activeBadges]);

  const activityTimelineData = useMemo(() => {
    if (!activeBadges || activeBadges.length === 0) return [];

    const map = new Map<
      string,
      { label: string; badges: number; points: number; time: number }
    >();

    activeBadges.forEach((b: any) => {
      if (!b.earnedDate) return;
      const { year, month, day, dateObj } = parseBadgeDate(b.earnedDate);
      if (isNaN(dateObj.getTime())) return;

      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const label = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const pts =
        b.type === "skill"
          ? 0.5
          : b.type === "game" || b.type === "trivia"
            ? 1
            : 0;

      const existing = map.get(key);
      if (existing) {
        existing.badges += 1;
        existing.points = Math.round((existing.points + pts) * 10) / 10;
      } else {
        const dayTime = new Date(year, month, day).getTime();
        map.set(key, {
          label,
          badges: 1,
          points: pts,
          time: dayTime,
        });
      }
    });

    if (map.size === 0) return [];

    // Strictly only present days with at least 1 badge earned (no zero badge days)
    const sorted = Array.from(map.values())
      .filter((item) => item.badges > 0)
      .sort((a, b) => a.time - b.time);

    return sorted.map(({ label, badges, points }) => ({
      date: label,
      badges,
      points,
    }));
  }, [activeBadges]);

  const hasActivityData = activityTimelineData.length > 0;

  const maxBadgesInTimeline = useMemo(() => {
    if (!activityTimelineData || activityTimelineData.length === 0) return 4;
    const m = Math.max(...activityTimelineData.map((d) => d.badges));
    return Math.max(m, 4);
  }, [activityTimelineData]);

  const yAxisTicks = useMemo(() => {
    if (maxBadgesInTimeline <= 5) {
      return Array.from({ length: maxBadgesInTimeline + 1 }, (_, i) => i);
    }
    const step = Math.ceil(maxBadgesInTimeline / 4);
    return [0, step, step * 2, step * 3, step * 4];
  }, [maxBadgesInTimeline]);

  // Strictly present only days that have badges earned, without artificial zero-badge days
  const chartTimelineData = useMemo(() => {
    return activityTimelineData.filter((d) => d.badges > 0);
  }, [activityTimelineData]);

  // --- Badges Overview 3-Rows Data ---
  const badgesOverviewRows = useMemo(() => {
    const gamePoints = distributionCounts.gameBadges * 1;
    const skillPoints =
      Math.round(distributionCounts.skillBadges * 0.5 * 10) / 10;
    const wmpCategory = badgeCategories.find(
      (cat) => cat.name === "Work Meets Play",
    );
    const wmpBadges = wmpCategory?.badges || 0;
    const wmpPoints = 0;

    return [
      {
        category: "Skill Badges",
        badges: distributionCounts.skillBadges,
        points: skillPoints,
      },
      {
        category: "Game Badges",
        badges: distributionCounts.gameBadges,
        points: gamePoints,
      },
      {
        category: "Work Meets Play Badges",
        badges: wmpBadges,
        points: wmpPoints,
      },
    ];
  }, [distributionCounts, badgeCategories]);

  // --- Swags Tier Progress Configuration ---
  const tiersConfig = useMemo(
    () => [
      { name: "Trooper", required: 50, slots: "3,716 / 6,000 spots left" },
      { name: "Ranger", required: 75, slots: "1,890 / 4,000 spots left" },
      { name: "Champion", required: 95, slots: "447 / 3,000 spots left" },
      { name: "Legend", required: 120, slots: "1,151 / 2,500 spots left" },
    ],
    [],
  );

  const tierProgressList = useMemo(() => {
    return tiersConfig.map((tier) => {
      const isUnlocked = displayPoints >= tier.required;
      const remaining = Math.max(0, tier.required - displayPoints);
      const progressPercent = Math.min(
        100,
        Math.round((displayPoints / tier.required) * 100),
      );
      return {
        ...tier,
        isUnlocked,
        remaining,
        progressPercent,
      };
    });
  }, [tiersConfig, displayPoints]);

  const unlockedLineWidth = useMemo(() => {
    const unlockedCount = tierProgressList.filter((t) => t.isUnlocked).length;
    return (unlockedCount / tierProgressList.length) * 100;
  }, [tierProgressList]);

  // Measure exact vertical line heights for Swags Tier Progress
  const swagsContainerRef = useRef<HTMLDivElement>(null);
  const swagsStartRef = useRef<HTMLDivElement>(null);
  const swagsNodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [swagsLineCoords, setSwagsLineCoords] = useState<{
    top: number;
    totalHeight: number;
    activeHeight: number;
  }>({ top: 24, totalHeight: 0, activeHeight: 0 });

  const activeSwagsIndex = useMemo(() => {
    let highest = 0;
    tierProgressList.forEach((t, i) => {
      if (t.isUnlocked) highest = i + 1;
    });
    return highest;
  }, [tierProgressList]);

  useEffect(() => {
    const updateSwagsCoords = () => {
      if (!swagsContainerRef.current || !swagsStartRef.current) return;
      const cRect = swagsContainerRef.current.getBoundingClientRect();
      const sRect = swagsStartRef.current.getBoundingClientRect();
      const startCenter = sRect.top + sRect.height / 2 - cRect.top;

      const lastNode = swagsNodeRefs.current[tierProgressList.length - 1];
      let totalH = 0;
      if (lastNode) {
        const lRect = lastNode.getBoundingClientRect();
        const lastCenter = lRect.top + lRect.height / 2 - cRect.top;
        totalH = Math.max(0, lastCenter - startCenter);
      }

      let activeH = 0;
      if (activeSwagsIndex > 0) {
        const activeNode = swagsNodeRefs.current[activeSwagsIndex - 1];
        if (activeNode) {
          const aRect = activeNode.getBoundingClientRect();
          const activeCenter = aRect.top + aRect.height / 2 - cRect.top;
          activeH = Math.max(0, activeCenter - startCenter);
        }
      }

      setSwagsLineCoords({
        top: Math.round(startCenter),
        totalHeight: Math.round(totalH),
        activeHeight: Math.round(activeH),
      });
    };

    updateSwagsCoords();
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateSwagsCoords)
        : null;
    if (ro && swagsContainerRef.current) {
      ro.observe(swagsContainerRef.current);
    }
    window.addEventListener("resize", updateSwagsCoords);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", updateSwagsCoords);
    };
  }, [activeSwagsIndex, tierProgressList]);

  // Measure exact vertical line heights for Facilitator Milestones
  const facilitatorContainerRef = useRef<HTMLDivElement>(null);
  const facilitatorNodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [facilitatorLineCoords, setFacilitatorLineCoords] = useState<{
    top: number;
    totalHeight: number;
    activeHeight: number;
  }>({ top: 20, totalHeight: 0, activeHeight: 0 });

  const activeFacilitatorIndex = useMemo(() => {
    let highestIdx = -1;
    milestones.forEach((m, i) => {
      if (isMilestoneCompleted(m)) highestIdx = i;
    });
    return highestIdx;
  }, [milestones, facilitatorMilestoneCounts]);

  useEffect(() => {
    const updateFacilitatorCoords = () => {
      if (!facilitatorContainerRef.current) return;
      const cRect = facilitatorContainerRef.current.getBoundingClientRect();
      const firstNode = facilitatorNodeRefs.current[0];
      const lastNode = facilitatorNodeRefs.current[milestones.length - 1];

      if (!firstNode || !lastNode) return;
      const fRect = firstNode.getBoundingClientRect();
      const lRect = lastNode.getBoundingClientRect();

      const startCenter = fRect.top + fRect.height / 2 - cRect.top;
      const lastCenter = lRect.top + lRect.height / 2 - cRect.top;
      const totalH = Math.max(0, lastCenter - startCenter);

      let activeH = 0;
      if (activeFacilitatorIndex > 0) {
        const activeNode = facilitatorNodeRefs.current[activeFacilitatorIndex];
        if (activeNode) {
          const aRect = activeNode.getBoundingClientRect();
          const activeCenter = aRect.top + aRect.height / 2 - cRect.top;
          activeH = Math.max(0, activeCenter - startCenter);
        }
      }

      setFacilitatorLineCoords({
        top: Math.round(startCenter),
        totalHeight: Math.round(totalH),
        activeHeight: Math.round(activeH),
      });
    };

    updateFacilitatorCoords();
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateFacilitatorCoords)
        : null;
    if (ro && facilitatorContainerRef.current) {
      ro.observe(facilitatorContainerRef.current);
    }
    window.addEventListener("resize", updateFacilitatorCoords);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", updateFacilitatorCoords);
    };
  }, [activeFacilitatorIndex, milestones, facilitatorMilestoneCounts]);

  // --- Season Prizes & Swags 4-Tier Cards ---
  const seasonPrizesTiers = useMemo(
    () => [
      {
        id: "trooper",
        name: "Trooper Tier",
        pointsRequired: 50,
        swagData: swagTiers.find((t) =>
          t.name.toLowerCase().includes("trooper"),
        ),
        hasSparkles: false,
      },
      {
        id: "ranger",
        name: "Ranger Tier",
        pointsRequired: 75,
        swagData: swagTiers.find((t) =>
          t.name.toLowerCase().includes("ranger"),
        ),
        hasSparkles: false,
      },
      {
        id: "champion",
        name: "Champion Tier",
        pointsRequired: 95,
        swagData: swagTiers.find((t) =>
          t.name.toLowerCase().includes("champion"),
        ),
        hasSparkles: false,
      },
      {
        id: "legend",
        name: "Legend Tier",
        pointsRequired: 120,
        swagData: swagTiers.find((t) =>
          t.name.toLowerCase().includes("legend"),
        ),
        hasSparkles: true,
      },
    ],
    [swagTiers],
  );

  // --- Incomplete Badges Filtering (ONLY All / Game / Skill + Labs Qty + Search) ---
  const filteredIncompleteBadges = useMemo(() => {
    const list = incompleteBadges.filter((badge) => {
      // Category filter (strictly All / Game / Skill)
      if (selectedBadgeFilter === "game") {
        if (badge.category !== "Game" && badge.category !== "Trivia")
          return false;
      } else if (selectedBadgeFilter === "skill") {
        if (badge.category !== "Skill") return false;
      }

      // Labs Quantity filter
      const labs = badge.labsRequired || 0;
      if (labsQtyFilter === "1-3" && (labs < 1 || labs > 3)) return false;
      if (labsQtyFilter === "4-6" && (labs < 4 || labs > 6)) return false;
      if (labsQtyFilter === "7+" && labs < 7) return false;

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = badge.title.toLowerCase().includes(q);
        const matchCode = badge.accessCode
          ? badge.accessCode.toLowerCase().includes(q)
          : false;
        if (!matchTitle && !matchCode) return false;
      }

      return true;
    });

    // Sort badges with access codes first (active season), followed by title
    return list.sort((a, b) => {
      if (a.accessCode && !b.accessCode) return -1;
      if (!a.accessCode && b.accessCode) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [incompleteBadges, selectedBadgeFilter, labsQtyFilter, searchQuery]);

  // 1. Profile Block
  const profileBlock = (
    <ProfileCard
      name={activeUser.name || (calculationResult as any)?.profileData?.name}
      memberSince={
        activeUser.memberSince ||
        (calculationResult as any)?.profileData?.memberSince
      }
      league={
        activeUser.league ||
        (calculationResult as any)?.profileData?.league ||
        (calculationResult as any)?.league ||
        "Silver"
      }
      leagueImage={effectiveLeagueImage}
      photoUrl={effectivePhotoUrl}
    />
  );

  // 2. Total Points Block
  const totalPointsBlock = (
    <FadeUp delay={0.04}>
      <div className="rounded-2xl border border-border bg-surface-card p-4 sm:p-4.5 shadow-card-premium transition-all duration-300 hover:border-border-strong hover:-translate-y-[1px]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
          Total Points
        </p>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-4xl sm:text-5xl font-extrabold text-foreground tabular-nums leading-none">
            {animatedDisplayPoints.toLocaleString(undefined, {
              minimumFractionDigits: displayPoints % 1 !== 0 ? 1 : 0,
              maximumFractionDigits: 1,
            })}
          </span>
          <span className="text-sm font-bold text-muted-foreground">Pts</span>
        </div>
        {totalBonusPoints > 0 && (
          <div className="mt-2.5 inline-flex items-center rounded-md border border-accent-blue/30 bg-accent-blue/[0.08] px-2.5 py-0.5 text-[11px] font-medium text-accent-blue">
            included {totalBonusPoints} bonus pts
          </div>
        )}
      </div>
    </FadeUp>
  );

  // 3. Badges Distribution Block
  const badgesDistributionBlock = (
    <FadeUp delay={0.08}>
      <div className="rounded-2xl border border-border/80 bg-surface-card p-5 sm:p-5.5 shadow-card-premium transition-all duration-300 hover:border-border-strong hover:-translate-y-[1px]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            BADGES DISTRIBUTION
          </h3>
          <span className="rounded-full border border-border bg-surface-hover/60 px-3 py-1 text-xs font-semibold tabular-nums text-foreground">
            {totalDistributionBadges} Total
          </span>
        </div>

        {/* Semicircular Gauge (Skill = Blue, Game = Orange) - Larger Arc */}
        <div className="relative mx-auto w-full max-w-[240px] py-2">
          <svg viewBox="0 0 160 88" className="w-full overflow-visible">
            <path
              d="M 10 80 A 70 70 0 0 1 150 80"
              fill="none"
              stroke="hsl(var(--surface-hover))"
              strokeWidth="15"
              strokeLinecap="round"
            />
            {hasSkillBadges && (
              <motion.path
                d="M 10 80 A 70 70 0 0 1 150 80"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="15"
                strokeLinecap="round"
                strokeDasharray={`${skillStrokeLength} ${gaugeCircumference}`}
                strokeDashoffset={0}
                initial={{ strokeDasharray: `0 ${gaugeCircumference}` }}
                animate={{
                  strokeDasharray: `${skillStrokeLength} ${gaugeCircumference}`,
                }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            )}
            {hasGameBadges && (
              <motion.path
                d="M 10 80 A 70 70 0 0 1 150 80"
                fill="none"
                stroke="#f97316"
                strokeWidth="15"
                strokeLinecap="round"
                strokeDasharray={`${gameStrokeLength} ${gaugeCircumference}`}
                strokeDashoffset={hasSkillBadges ? -skillStrokeLength : 0}
                initial={{
                  strokeDashoffset: hasSkillBadges ? -skillStrokeLength : 0,
                  strokeDasharray: `0 ${gaugeCircumference}`,
                }}
                animate={{
                  strokeDashoffset: hasSkillBadges ? -skillStrokeLength : 0,
                  strokeDasharray: `${gameStrokeLength} ${gaugeCircumference}`,
                }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
              />
            )}
          </svg>
          <div className="absolute inset-x-0 bottom-0 text-center">
            <p className="font-display text-4xl font-extrabold text-foreground tabular-nums leading-none">
              {totalDistributionBadges}
            </p>
            <p className="text-xs font-semibold text-muted-foreground mt-1.5">
              Total Badges
            </p>
          </div>
        </div>

        {/* Skill Badges & Game Badges Enlarged Blocks */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/[0.07] p-3 sm:p-3.5 transition-colors">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
              <span className="text-xs font-semibold text-muted-foreground">
                Skill Badges
              </span>
            </div>
            <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-foreground tabular-nums">
              {distributionCounts.skillBadges}
            </p>
          </div>

          <div className="rounded-xl border border-orange-500/30 bg-orange-500/[0.07] p-3 sm:p-3.5 transition-colors">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.5)]" />
              <span className="text-xs font-semibold text-muted-foreground">
                Game Badges
              </span>
            </div>
            <p className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-foreground tabular-nums">
              {distributionCounts.gameBadges}
            </p>
          </div>
        </div>
      </div>
    </FadeUp>
  );

  // 4. Activity Month Block - Enlarged matching Reference
  const activityMonthBlock = (
    <FadeUp delay={0.12} className="flex-1 flex flex-col min-h-0">
      <div className="rounded-2xl border border-border/80 bg-surface-card p-5 sm:p-6 shadow-card-premium transition-all duration-300 hover:border-border-strong hover:-translate-y-[1px] flex-1 flex flex-col justify-between min-h-[260px]">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            ACTIVITY MONTH
          </h3>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface-hover/50 px-2.5 py-1 text-xs text-foreground font-medium">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{activityMonthLabel}</span>
            </div>
            <button
              onClick={handlePrevMonth}
              disabled={!canPrevMonth}
              className={`flex h-6 w-6 items-center justify-center rounded border border-border bg-surface-hover/50 transition-colors ${
                canPrevMonth
                  ? "text-muted-foreground hover:text-foreground cursor-pointer"
                  : "text-muted-foreground/30 opacity-40 cursor-not-allowed border-border/40"
              }`}
              aria-label="Previous Month"
              title={
                canPrevMonth
                  ? "Previous Month"
                  : "Start of 2026 Arcade Cycle (January)"
              }
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleNextMonth}
              disabled={!canNextMonth}
              className={`flex h-6 w-6 items-center justify-center rounded border border-border bg-surface-hover/50 transition-colors ${
                canNextMonth
                  ? "text-muted-foreground hover:text-foreground cursor-pointer"
                  : "text-muted-foreground/30 opacity-40 cursor-not-allowed border-border/40"
              }`}
              aria-label="Next Month"
              title={
                canNextMonth
                  ? "Next Month"
                  : "End of 2026 Arcade Cycle (December)"
              }
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col xs:flex-row items-center justify-between gap-3.5 my-auto py-2 w-full">
          {/* Active Days Card matching image */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-gradient-to-b from-rose-50/80 to-orange-50/80 dark:from-[#201015]/80 dark:to-[#120b12]/80 p-3 sm:p-4 w-full xs:w-auto min-w-[95px] sm:min-w-[115px] text-center shadow-inner shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/30 via-orange-500/20 to-amber-500/10 border border-red-500/40 shadow-sm">
              <span
                className="text-2xl select-none"
                role="img"
                aria-label="fire"
              >
                🔥
              </span>
            </div>
            <p className="mt-2.5 font-display text-3xl sm:text-4xl font-black text-foreground tabular-nums leading-none">
              {activeDaysCount}
            </p>
            <p className="mt-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              {activeDaysCount === 1 ? "ACTIVE DAY" : "ACTIVE DAYS"}
            </p>
          </div>

          {/* Calendar Heatmap */}
          <div className="w-full xs:w-[210px] sm:w-[230px] max-w-full">
            <div className="grid grid-cols-7 gap-1.5">
              {activityCells.map((day, i) => {
                if (day === null) {
                  return (
                    <div key={i} className="aspect-square bg-transparent" />
                  );
                }
                const dayData = dayActivityMap.get(day);
                const isActive = Boolean(dayData && dayData.count > 0);
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-[4px] transition-all duration-200 ${
                      isActive
                        ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] border border-emerald-400/60 hover:scale-110"
                        : "bg-surface-hover/60 border border-transparent hover:border-border"
                    }`}
                    title={
                      isActive
                        ? `Day ${day}: ${dayData?.count} badge${dayData!.count > 1 ? "s" : ""} (+${dayData?.points} pts)`
                        : `Day ${day}: No activity`
                    }
                  />
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground font-semibold">
              <span>LESS</span>
              <span className="h-2.5 w-2.5 rounded-[2px] bg-surface-hover/60" />
              <span className="h-2.5 w-2.5 rounded-[2px] bg-blue-500/60" />
              <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-500" />
              <span>MORE</span>
            </div>
          </div>
        </div>
      </div>
    </FadeUp>
  );

  // 5. Season Prizes & Swags Block - Enlarged 4-Card Responsive Grid with Merchandise Artwork and Modal
  const seasonPrizesBlock = (
    <SeasonPrizesSection currentPoints={displayPoints} />
  );

  // 6. Facilitator Milestones Block
  const facilitatorMilestonesBlock = (
    <FadeUp delay={0.06} className="h-full flex flex-col">
      <div className="rounded-2xl border border-border/80 bg-surface-card p-5 sm:p-6 shadow-card-premium transition-all duration-300 hover:border-border-strong h-full flex flex-col justify-between">
        {/* Header matching Image 1: Title on left, Enrolled & Bonus Milestone toggles on right */}
        <div className="mb-4 sm:mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            FACILITATOR MILESTONES
          </h3>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Enrolled toggle */}
            <button
              onClick={() => setIsFacilitator(!isFacilitator)}
              className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-border bg-surface-hover/80 text-foreground dark:border-slate-700/60 dark:bg-[#12192a] dark:text-slate-200 px-2.5 sm:px-3 py-1 text-xs font-medium transition-all hover:border-slate-400 dark:hover:border-slate-600"
            >
              <span>Enrolled</span>
              <div
                className={`h-4.5 w-8 sm:h-5 sm:w-9 rounded-full transition-colors relative flex items-center px-0.5 ${
                  isFacilitator
                    ? "bg-indigo-600"
                    : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-white shadow-sm ${
                    isFacilitator ? "ml-auto" : "mr-auto"
                  }`}
                />
              </div>
            </button>

            {/* Bonus Milestone toggle */}
            <button
              onClick={handleToggleBonusMilestone}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-full border px-2.5 sm:px-3 py-1 text-xs font-medium transition-all ${
                showBonusMilestone
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:bg-[#1e1710] dark:text-amber-200 hover:border-amber-500/60"
                  : "border-border bg-surface-hover/80 text-muted-foreground hover:text-foreground dark:border-slate-700/60 dark:bg-[#12192a] dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600"
              }`}
            >
              <Sparkles
                className={`h-3.5 w-3.5 ${showBonusMilestone ? "text-amber-500 dark:text-amber-400" : "text-muted-foreground dark:text-slate-400"}`}
              />
              <span>Bonus Milestone</span>
              <div
                className={`h-4.5 w-8 sm:h-5 sm:w-9 rounded-full transition-colors relative flex items-center px-0.5 ${
                  showBonusMilestone
                    ? "bg-amber-500"
                    : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-white shadow-sm ${
                    showBonusMilestone ? "ml-auto" : "mr-auto"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Milestone Rows Timeline */}
        <div
          ref={facilitatorContainerRef}
          className="relative flex-1 flex flex-col justify-between"
        >
          {/* Vertical Connecting Line centered through nodes */}
          <div
            aria-hidden
            className="absolute left-[17px] sm:left-[19px] w-[2px] rounded-full bg-border dark:bg-slate-700/60 transition-all duration-300"
            style={
              facilitatorLineCoords.totalHeight > 0
                ? {
                    top: `${facilitatorLineCoords.top}px`,
                    height: `${facilitatorLineCoords.totalHeight}px`,
                  }
                : { top: "20px", bottom: "20px" }
            }
          />
          {facilitatorLineCoords.activeHeight > 0 && (
            <div
              aria-hidden
              className="absolute left-[17px] sm:left-[19px] w-[2px] rounded-full bg-emerald-500 transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              style={{
                top: `${facilitatorLineCoords.top}px`,
                height: `${facilitatorLineCoords.activeHeight}px`,
              }}
            />
          )}

          <div className="flex-1 flex flex-col justify-between gap-2.5 sm:gap-3">
            {milestones.map((milestone, index) => {
              const isCompleted = isMilestoneCompleted(milestone);
              const gamesMet =
                facilitatorMilestoneCounts.gameBadges >=
                milestone.requirements.game;
              const skillsMet =
                facilitatorMilestoneCounts.skillBadges >=
                milestone.requirements.skill;

              return (
                <div key={milestone.id} className="relative pl-13 sm:pl-16">
                  {/* Node Circle (M1, M2, M3, M4) - w-9 sm:w-10 vertically centered */}
                  <div
                    ref={(el) => {
                      facilitatorNodeRefs.current[index] = el;
                    }}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 transition-all z-10 ${
                      isCompleted
                        ? "border-emerald-500 bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                        : "border-border bg-surface-hover/80 text-foreground text-xs font-bold shadow-sm dark:border-slate-700/80 dark:bg-[#0d1424] dark:text-slate-300"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[2.5]" />
                    ) : (
                      `M${milestone.id}`
                    )}
                  </div>

                  {/* Milestone Card Container */}
                  <div
                    className={`rounded-2xl border px-3.5 py-2.5 sm:px-5 sm:py-3 transition-all duration-200 ${
                      isCompleted
                        ? "border-emerald-500/40 bg-emerald-500/10 dark:bg-[#071916]/50 shadow-sm"
                        : "border-border bg-surface-card hover:bg-surface-hover/50 hover:border-border-strong dark:border-slate-800/90 dark:bg-[#090e1a]/90 dark:hover:border-slate-700/90 shadow-sm"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {/* Left: Title & Bonus Pill */}
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base font-bold text-foreground dark:text-white tracking-tight leading-tight">
                          {milestone.name}
                        </p>
                        <span className="mt-1.5 inline-block rounded-full bg-[#2563eb] px-3.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
                          +{milestone.bonusPoints} BONUS PTS
                        </span>
                      </div>

                      {/* Right: Games & Skills Stat Boxes - generous width, never tiny cubes */}
                      <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0">
                        {/* Games Box */}
                        <div className="rounded-xl border border-border bg-surface-hover/50 dark:border-slate-800/90 dark:bg-[#050811] px-3 py-1.5 sm:px-3.5 sm:py-2 flex-1 sm:flex-initial min-w-[125px] sm:w-36 md:w-38 shadow-inner">
                          <div className="flex items-baseline justify-between gap-1.5">
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                              Games{" "}
                              {gamesMet && (
                                <Check className="h-3 w-3 text-accent-green stroke-[2.5]" />
                              )}
                            </span>
                            <span
                              className={`text-xs sm:text-sm font-bold tabular-nums ${
                                gamesMet
                                  ? "text-accent-green"
                                  : "text-foreground dark:text-white"
                              }`}
                            >
                              {facilitatorMilestoneCounts.gameBadges}/
                              {milestone.requirements.game}
                            </span>
                          </div>
                          <div className="mt-1.5">
                            <ProgressReveal
                              value={
                                (facilitatorMilestoneCounts.gameBadges /
                                  milestone.requirements.game) *
                                100
                              }
                              className={
                                gamesMet ? "bg-accent-green" : "bg-accent-blue"
                              }
                              height="h-1.5"
                            />
                          </div>
                        </div>

                        {/* Skills Box */}
                        <div className="rounded-xl border border-border bg-surface-hover/50 dark:border-slate-800/90 dark:bg-[#050811] px-3 py-1.5 sm:px-3.5 sm:py-2 flex-1 sm:flex-initial min-w-[125px] sm:w-36 md:w-38 shadow-inner">
                          <div className="flex items-baseline justify-between gap-1.5">
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                              Skills{" "}
                              {skillsMet && (
                                <Check className="h-3 w-3 text-accent-green stroke-[2.5]" />
                              )}
                            </span>
                            <span
                              className={`text-xs sm:text-sm font-bold tabular-nums ${
                                skillsMet
                                  ? "text-accent-green"
                                  : "text-foreground dark:text-white"
                              }`}
                            >
                              {facilitatorMilestoneCounts.skillBadges}/
                              {milestone.requirements.skill}
                            </span>
                          </div>
                          <div className="mt-1.5">
                            <ProgressReveal
                              value={
                                (facilitatorMilestoneCounts.skillBadges /
                                  milestone.requirements.skill) *
                                100
                              }
                              className={
                                skillsMet ? "bg-accent-green" : "bg-accent-blue"
                              }
                              height="h-1.5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </FadeUp>
  );

  // 7. HORIZONTAL Swags Tier Progress (for State B: Reduced Desktop / Resized Window)
  const horizontalSwagsBlock = (
    <FadeUp delay={0.1}>
      <div className="rounded-2xl border border-border/80 bg-surface-card p-4 sm:p-7 shadow-card-premium transition-all duration-300 hover:border-border-strong w-full max-w-full min-w-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            SWAGS TIER PROGRESS
          </h3>
          <LegendCardUnlockBox
            isUnlocked={userIsLegend}
            onOpen={() => setShowLegendModal(true)}
          />
        </div>

        <div className="overflow-x-auto no-scrollbar pb-1 w-full max-w-full">
          <div className="relative min-w-[480px] sm:min-w-full">
            {/* Horizontal Line passing through center of nodes */}
            <div
              aria-hidden
              className="absolute top-6 left-[10%] right-[10%] h-[2px] bg-border dark:bg-slate-700/80 -z-0"
            >
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${unlockedLineWidth}%` }}
              />
            </div>

            {/* 5 Evenly Distributed Tier Nodes */}
            <div className="relative z-10 grid grid-cols-5 gap-3 text-center">
              {/* Start */}
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-black shadow-[0_0_14px_rgba(251,191,36,0.35)]">
                  <Star className="h-5 w-5 fill-black stroke-black" />
                </div>
                <p className="mt-3 text-sm font-bold text-foreground dark:text-white">
                  Start
                </p>
              </div>

              {/* 4 Tiers */}
              {tierProgressList.map((tier) => (
                <div key={tier.name} className="flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                      tier.isUnlocked
                        ? "border-emerald-500 bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                        : "border-border bg-surface-hover/80 text-muted-foreground shadow-sm dark:border-slate-700/80 dark:bg-[#0d1424] dark:text-slate-400"
                    }`}
                  >
                    {tier.isUnlocked ? (
                      <Check className="h-5 w-5 stroke-[2.5]" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>

                  <p className="mt-3 text-sm font-bold text-foreground dark:text-white">
                    {tier.name}
                  </p>
                  <p className="text-xs font-bold text-blue-500 dark:text-blue-400 mt-0.5">
                    {tier.required} pts
                  </p>

                  <div className="mt-2 rounded-full bg-surface-hover/80 border border-border text-foreground dark:bg-[#12192a] dark:border-slate-700/60 dark:text-slate-300 px-3 py-1 text-[11px] font-semibold whitespace-nowrap">
                    {tier.slots}
                  </div>

                  <div className="mt-1.5">
                    {tier.isUnlocked ? (
                      <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap uppercase tracking-wider">
                        ACHIEVED
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 whitespace-nowrap">
                        {tier.remaining} pts needed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FadeUp>
  );

  // 8. VERTICAL Swags Tier Progress (for State A: Full-Screen / Large Desktop) matching IMAGE 1
  const verticalSwagsBlock = (
    <FadeUp delay={0.08} className="h-full flex flex-col">
      <div className="rounded-2xl border border-border/80 bg-surface-card p-6 sm:p-7 shadow-card-premium transition-all duration-300 hover:border-border-strong h-full flex flex-col justify-between">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            SWAGS TIER PROGRESS
          </h3>
          <LegendCardUnlockBox
            isUnlocked={userIsLegend}
            onOpen={() => setShowLegendModal(true)}
          />
        </div>

        <div ref={swagsContainerRef} className="relative">
          {/* Vertical Connecting Line centered through nodes */}
          <div
            aria-hidden
            className="absolute left-[23px] w-[2px] rounded-full bg-border dark:bg-slate-700/60 transition-all duration-300"
            style={
              swagsLineCoords.totalHeight > 0
                ? {
                    top: `${swagsLineCoords.top}px`,
                    height: `${swagsLineCoords.totalHeight}px`,
                  }
                : { top: "24px", bottom: "32px" }
            }
          />
          {swagsLineCoords.activeHeight > 0 && (
            <div
              aria-hidden
              className="absolute left-[23px] w-[2px] rounded-full bg-emerald-500 transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              style={{
                top: `${swagsLineCoords.top}px`,
                height: `${swagsLineCoords.activeHeight}px`,
              }}
            />
          )}

          <div className="space-y-6">
            {/* Start Node matching Image 1: Yellow Star Circle + Start Label */}
            <div className="relative pl-20 flex items-center min-h-[48px]">
              <div
                ref={swagsStartRef}
                className="absolute left-0 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-black shadow-[0_0_14px_rgba(251,191,36,0.35)] z-10"
              >
                <Star className="h-5 w-5 fill-black stroke-black" />
              </div>
              <p className="text-base sm:text-lg font-bold text-foreground dark:text-white">
                Start
              </p>
            </div>

            {/* 4 Tiers matching Image 1: Trooper, Ranger, Champion, Legend */}
            {tierProgressList.map((tier, index) => (
              <div key={tier.name} className="relative pl-20">
                {/* Node Circle - w-12 h-12 vertically centered */}
                <div
                  ref={(el) => {
                    swagsNodeRefs.current[index] = el;
                  }}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all z-10 ${
                    tier.isUnlocked
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                      : "border-border bg-surface-hover/80 text-muted-foreground shadow-sm dark:border-slate-700/80 dark:bg-[#0d1424] dark:text-slate-400"
                  }`}
                >
                  {tier.isUnlocked ? (
                    <Check className="h-5 w-5 stroke-[2.5]" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </div>

                {/* Tier Card Container matching Image 1 */}
                <div
                  className={`rounded-2xl border px-6 py-5 sm:px-7 sm:py-5.5 transition-all duration-200 ${
                    tier.isUnlocked
                      ? "border-emerald-500/40 bg-emerald-500/10 dark:bg-[#071916]/50 shadow-sm"
                      : "border-border bg-surface-card hover:bg-surface-hover/50 hover:border-border-strong dark:border-slate-800/90 dark:bg-[#090e1a]/90 dark:hover:border-slate-700/90 shadow-sm"
                  }`}
                >
                  <div className="flex flex-col gap-2.5 min-w-0">
                    {/* Top Row: Tier Title on left, Slots Pill on right */}
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <p className="text-base sm:text-[18px] font-bold text-foreground dark:text-white tracking-tight leading-tight truncate">
                        {tier.name}
                      </p>
                      <span className="rounded-full bg-surface-hover/80 border border-border text-foreground dark:bg-[#12192a] dark:border-slate-700/60 dark:text-slate-300 px-3 py-0.5 sm:px-3.5 sm:py-1 text-xs font-semibold tabular-nums whitespace-nowrap shrink-0">
                        {tier.slots}
                      </span>
                    </div>

                    {/* Bottom Row: Required Pts Pill on left, Pts Needed / Unlocked Pill on right */}
                    <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 pt-0.5">
                      <span
                        className={`inline-block rounded-full px-3.5 py-0.5 sm:px-4 sm:py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm whitespace-nowrap shrink-0 ${
                          tier.isUnlocked ? "bg-emerald-600" : "bg-[#2563eb]"
                        }`}
                      >
                        {tier.required} PTS REQUIRED
                      </span>
                      <div className="shrink-0">
                        {tier.isUnlocked ? (
                          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap uppercase tracking-wider">
                            ACHIEVED
                          </span>
                        ) : tier.remaining > 0 ? (
                          <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 sm:px-3.5 sm:py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 tabular-nums whitespace-nowrap">
                            {tier.remaining} pts needed
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeUp>
  );

  // 9. Activity Timeline Block - Enlarged matching Reference
  const activityTimelineBlock = (
    <FadeUp delay={0.12} className="h-full flex flex-col min-h-0">
      <div className="rounded-2xl border border-border/80 bg-surface-card p-6 sm:p-7 shadow-card-premium transition-all duration-300 hover:border-border-strong h-[300px] flex flex-col justify-between relative">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            ACTIVITY TIMELINE
          </h3>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-hover/50 px-2.5 py-1 text-xs font-medium text-foreground">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{timelineDateRange}</span>
          </span>
        </div>

        {hasActivityData ? (
          <div className="h-[200px] w-full min-w-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartTimelineData}
                margin={{ top: 12, right: 20, left: -24, bottom: 4 }}
              >
                <defs>
                  <linearGradient
                    id="neonGreenGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255, 255, 255, 0.15)" }}
                  minTickGap={24}
                  interval={
                    chartTimelineData.length > 12
                      ? Math.max(1, Math.floor(chartTimelineData.length / 13))
                      : 0
                  }
                  tick={(props: any): any => {
                    const val = String(props.payload?.value || "").trim();
                    if (!val) return <g />;
                    return (
                      <text
                        x={props.x}
                        y={props.y + 12}
                        fill="hsl(var(--muted-foreground))"
                        textAnchor="middle"
                        fontSize={11}
                        fontWeight={600}
                      >
                        {val}
                      </text>
                    );
                  }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, maxBadgesInTimeline]}
                  ticks={yAxisTicks}
                />
                <Tooltip
                  cursor={{
                    stroke: "rgba(16, 185, 129, 0.4)",
                    strokeWidth: 1.5,
                    strokeDasharray: "4 4",
                  }}
                  content={({ active, payload }) => {
                    if (!active) return null;
                    const item =
                      activityTimelineData.length === 1
                        ? activityTimelineData[0]
                        : payload && payload.length
                          ? payload[0].payload
                          : null;
                    if (!item || !item.date || !item.date.trim()) return null;
                    return (
                      <div className="rounded-xl border border-border bg-surface-card/95 backdrop-blur-md p-3.5 shadow-2xl min-w-[170px] dark:border-slate-700/80 dark:bg-[#0c1424]/95">
                        <p className="text-xs font-bold text-foreground dark:text-white mb-2">
                          {item.date.trim()}
                        </p>
                        <div className="flex items-center justify-between gap-3 text-xs">
                          <span className="text-muted-foreground dark:text-slate-400 font-medium">
                            Badges Earned
                          </span>
                          <span className="rounded-md bg-blue-600/20 border border-blue-500/30 px-2 py-0.5 text-[11px] font-bold text-blue-500 dark:text-blue-400">
                            +{item.badges} badge{item.badges > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-xs mt-2">
                          <span className="text-muted-foreground dark:text-slate-400 font-medium">
                            Points Earned
                          </span>
                          <span className="rounded-md bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            +{item.points} pts
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />
                {activityTimelineData.length === 1 && (
                  <ReferenceLine
                    x={activityTimelineData[0].date}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                  />
                )}
                <Area
                  type={
                    activityTimelineData.length === 1 ? "linear" : "monotone"
                  }
                  dataKey="badges"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fillOpacity={1}
                  fill="url(#neonGreenGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#10b981",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                    style: {
                      filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.9))",
                    },
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <Calendar className="h-10 w-10 text-muted-foreground/30 mb-2.5" />
            <p className="text-sm text-muted-foreground font-medium">
              No activity data available
            </p>
          </div>
        )}
      </div>
    </FadeUp>
  );

  // 10. Badges Overview Block - Exactly Equal to Activity Timeline Card Size
  const badgesOverviewBlock = (
    <FadeUp delay={0.14} className="h-full flex flex-col min-h-0">
      <div className="rounded-2xl border border-border/80 bg-surface-card p-6 sm:p-7 shadow-card-premium transition-all duration-300 hover:border-border-strong h-[300px] flex flex-col justify-between">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            BADGES OVERVIEW
          </h3>
          <span className="rounded-full border border-border bg-surface-hover/80 text-foreground dark:border-slate-700/60 dark:bg-[#161d2d] dark:text-slate-200 px-3.5 py-1 text-xs font-bold tabular-nums shadow-sm">
            {totalDistributionBadges} Total Badges
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-surface-hover/30 dark:border-slate-800/80 dark:bg-[#0d1424]/70 flex-1 flex flex-col justify-between">
          <table className="w-full text-left h-full border-collapse">
            <thead>
              <tr className="border-b border-border dark:border-slate-800/80 text-sm">
                <th className="px-5 py-3 font-bold text-foreground dark:text-slate-200">
                  Category
                </th>
                <th className="px-4 py-3 text-center font-bold text-blue-500">
                  Badges
                </th>
                <th className="px-6 py-3 text-right font-bold text-blue-500">
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-800/60">
              {badgesOverviewRows.map((row, idx) => {
                const isZero = row.badges === 0;
                return (
                  <tr
                    key={idx}
                    className={`transition-all duration-300 ${
                      isZero
                        ? "opacity-40 hover:opacity-60 text-muted-foreground"
                        : "opacity-100 text-foreground dark:text-white hover:bg-surface-hover/40"
                    }`}
                  >
                    <td className="px-5 py-3.5 text-sm sm:text-base font-bold">
                      <span
                        className={
                          isZero
                            ? "text-muted-foreground font-semibold"
                            : "text-foreground dark:text-white font-bold"
                        }
                      >
                        {row.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center text-sm sm:text-base font-bold tabular-nums">
                      <span
                        className={
                          isZero
                            ? "text-muted-foreground font-semibold"
                            : "text-foreground dark:text-slate-100 font-bold"
                        }
                      >
                        {row.badges}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right text-sm sm:text-base font-bold tabular-nums">
                      <span
                        className={
                          isZero
                            ? "text-muted-foreground font-semibold"
                            : "text-blue-500 font-bold"
                        }
                      >
                        {row.points}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </FadeUp>
  );

  // 11. Incomplete Badges Block
  const incompleteBadgesBlock = (
    <div className="w-full">
      <FadeUp delay={0.18}>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-foreground">
              INCOMPLETE BADGES ({filteredIncompleteBadges.length})
            </h3>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search incomplete badge..."
                className="w-full rounded-xl border border-border bg-surface-card pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent-blue focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border pb-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedBadgeFilter("all")}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  selectedBadgeFilter === "all"
                    ? "border border-border bg-surface-hover text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-hover/40"
                }`}
              >
                All Badges
              </button>
              <button
                onClick={() => setSelectedBadgeFilter("game")}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  selectedBadgeFilter === "game"
                    ? "border border-border bg-surface-hover text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-hover/40"
                }`}
              >
                Game Badges
              </button>
              <button
                onClick={() => setSelectedBadgeFilter("skill")}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  selectedBadgeFilter === "skill"
                    ? "border border-border bg-surface-hover text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-hover/40"
                }`}
              >
                Skill Badges
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 text-[11px] font-medium mr-1">
                <Beaker className="h-3 w-3" /> Labs Qty:
              </span>
              {(["all", "1-3", "4-6", "7+"] as const).map((qty) => (
                <button
                  key={qty}
                  onClick={() => setLabsQtyFilter(qty)}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                    labsQtyFilter === qty
                      ? "border border-border bg-surface-hover text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-hover/40"
                  }`}
                >
                  {qty === "all" ? "All Labs" : `${qty} Labs`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredIncompleteBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                copiedCode={copiedCode}
                onCopyAccessCode={handleCopyAccessCode}
              />
            ))}
          </div>

          {filteredIncompleteBadges.length === 0 && (
            <div className="rounded-2xl border border-border bg-surface-card p-12 text-center">
              <Award className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-foreground">
                No badges match your filters
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Try selecting another category or clear your search query.
              </p>
            </div>
          )}
        </div>
      </FadeUp>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted-foreground">
            Loading your ArcadeVerse dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground w-full max-w-full min-w-0 overflow-x-clip pb-12">
      {/* Semantic H1 for accessibility and SEO compliance */}
      <h1 className="sr-only">
        ArcadeVerse Dashboard — Google Cloud Arcade Analytics & Progress
      </h1>

      {/* ======================================================== */}
      {/* RESPONSIVE LAYOUT SWITCHING                              */}
      {/* ======================================================== */}

      {/* -------------------------------------------------------- */}
      {/* STATE A: LARGE / FULL-SCREEN DESKTOP (>= 1280px)         */}
      {/* Matches SCREENSHOT 3: 3-column / 2x2 aligned grid        */}
      {/* Swags Tier Progress MUST be VERTICAL                     */}
      {/* -------------------------------------------------------- */}
      {isLargeDesktop && (
        <div className="grid grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] 2xl:grid-cols-[24%_1fr] items-start gap-3.5 p-4 sm:p-5 w-full">
          {/* LEFT COLUMN: Profile, Points, Badges Distribution, Activity Month, Season Prizes */}
          <div className="flex flex-col gap-3.5 min-w-0">
            {profileBlock}
            {totalPointsBlock}
            {badgesDistributionBlock}
            {activityMonthBlock}
            {seasonPrizesBlock}
          </div>

          {/* RIGHT AREA: 2x2 Aligned Grid & Incomplete Badges */}
          <div className="flex flex-col gap-3.5 min-w-0">
            {/* ROW 1 & ROW 2 2x2 GRID */}
            <div className="grid grid-cols-[56.6%_1fr] grid-rows-[auto_auto] items-stretch gap-3.5 min-w-0">
              {/* ROW 1: Facilitator Milestones = Swags Tier Progress */}
              <div className="min-w-0 h-full">{facilitatorMilestonesBlock}</div>
              <div className="min-w-0 h-full">{verticalSwagsBlock}</div>

              {/* ROW 2: Activity Timeline = Badges Overview */}
              <div className="min-w-0 h-full">{activityTimelineBlock}</div>
              <div className="min-w-0 h-full">{badgesOverviewBlock}</div>
            </div>

            {/* Incomplete Badges full width below the 2x2 grid */}
            <div className="min-w-0 w-full">{incompleteBadgesBlock}</div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* STATE B: REDUCED / WINDOWED DESKTOP (768px - 1279px)     */}
      {/* Matches SCREENSHOT 1: 2-column layout with HORIZONTAL    */}
      {/* Swags Tier Progress spanning below Facilitator Milestones */}
      {/* -------------------------------------------------------- */}
      {isReducedDesktop && (
        <div className="grid grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] items-start gap-3.5 p-4 sm:p-5 w-full">
          {/* LEFT COLUMN: Profile, Points, Badges Distribution, Activity Month, Season Prizes */}
          <div className="flex flex-col gap-3.5 min-w-0">
            {profileBlock}
            {totalPointsBlock}
            {badgesDistributionBlock}
            {activityMonthBlock}
            {seasonPrizesBlock}
          </div>

          {/* RIGHT AREA: Full-width Facilitator Milestones + Horizontal Swags + Timeline & Overview + Incomplete Badges */}
          <div className="flex flex-col gap-3.5 min-w-0">
            {/* 1. Facilitator Milestones (spans full width of right column, spacious) */}
            <div className="min-w-0 w-full">{facilitatorMilestonesBlock}</div>

            {/* 2. Swags Tier Progress (Horizontal timeline matching Screenshot 1) */}
            <div className="min-w-0 w-full">{horizontalSwagsBlock}</div>

            {/* 3. Activity Timeline + Badges Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 min-w-0">
              <div className="min-w-0 h-full">{activityTimelineBlock}</div>
              <div className="min-w-0 h-full">{badgesOverviewBlock}</div>
            </div>

            {/* 4. Incomplete Badges */}
            <div className="min-w-0 w-full">{incompleteBadgesBlock}</div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* STATE C: MOBILE (< 768px)                                */}
      {/* Single column clean stack without overflow              */}
      {/* -------------------------------------------------------- */}
      {isMobile && (
        <div className="flex flex-col gap-3.5 p-3 sm:p-5 w-full max-w-full min-w-0">
          {profileBlock}
          {totalPointsBlock}
          {badgesDistributionBlock}
          {activityMonthBlock}
          {seasonPrizesBlock}
          {facilitatorMilestonesBlock}
          {horizontalSwagsBlock}
          {activityTimelineBlock}
          {badgesOverviewBlock}
          {incompleteBadgesBlock}
        </div>
      )}

      {/* Legend Tier Achievement Modal */}
      {legendCardData && (
        <LegendAchievementModal
          isOpen={showLegendModal}
          onClose={() => setShowLegendModal(false)}
          data={legendCardData}
        />
      )}

      {/* Bonus Milestone Verification Modal */}
      {isBonusMilestoneModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsBonusMilestoneModalOpen(false)}
        >
          <div
            className="relative max-w-2xl sm:max-w-[620px] w-full rounded-3xl border border-border bg-surface-card dark:border-slate-800 dark:bg-[#0c1424] p-8 sm:p-10 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Tag Row */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-300">
                +10 BONUS POINTS VERIFICATION
              </span>
            </div>

            {/* Title */}
            <h2 className="mt-5 text-2xl sm:text-[26px] font-bold text-foreground dark:text-white tracking-tight">
              Confirm Facilitator Bonus Milestone
            </h2>

            {/* Description */}
            <p className="mt-3 text-sm text-muted-foreground dark:text-slate-300 leading-relaxed">
              By enabling this option, you claim that you have successfully
              completed the{" "}
              <strong className="font-bold text-foreground dark:text-white">
                Bonus Milestone
              </strong>{" "}
              of the Google Cloud Arcade Facilitator Program.
            </p>

            {/* Critical Verification Notice Box */}
            <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:border-amber-900/60 dark:bg-[#1e1515]/90 p-5 text-left">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400 shrink-0" />
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  CRITICAL VERIFICATION NOTICE
                </h4>
              </div>
              <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-muted-foreground dark:text-slate-300">
                Important: Only enable this toggle after receiving official
                email confirmation from the Google Cloud Arcade Facilitator team
                for completing the AI Agent Bonus Milestone. We cannot track
                bonus milestone completion automatically.
              </p>
            </div>

            {/* External Link */}
            <div className="mt-5">
              <a
                href="https://rsvp.withgoogle.com/events/arcade-facilitator/bonus-milestone"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
              >
                <span>
                  View Official Bonus Milestone Guide on Google Portal
                </span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-5 border-t border-border dark:border-slate-800/80 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setHasConfirmedBonusMilestone(true);
                  localStorage.setItem(
                    "arcadeverse_bonus_milestone_confirmed",
                    "true",
                  );
                  setShowBonusMilestone(true);
                  setIsBonusMilestoneModalOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 dark:bg-[#0c1f1d] px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-sm"
              >
                <Check className="h-4 w-4 stroke-[2.5]" />
                <span>I Verify I Completed Bonus Milestone</span>
              </button>
              <button
                type="button"
                onClick={() => setIsBonusMilestoneModalOpen(false)}
                className="rounded-xl border border-border bg-surface-hover px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-foreground hover:bg-surface-hover/80 transition-all shadow-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Floating profile sync notification pill & toast */}
      <ProfileUpdateToast />
    </div>
  );
}
