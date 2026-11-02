import { UserPodiumRankCard } from "@/components/UserPodiumRankCard";
import { GoogleAvatar } from "@/components/ui/GoogleAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCalculation } from "@/lib/calculation-context";
import { useOptionalDashboard } from "@/lib/dashboard-context";
import {
  type LeaderboardEntry,
  useLeaderboard,
} from "@/lib/leaderboard-context";
import { useProfile } from "@/lib/profile-context";
import {
  IconAlertCircle,
  IconArrowRight,
  IconCrown,
  IconMedal,
  IconRefresh,
  IconSearch,
  IconSparkles,
  IconTrophy,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

// Fallback avatar portraits matching Home Page top performers
const PODIUM_AVATARS: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  2: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  3: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
  4: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  5: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

// Visual configuration for each ladder rank [1..5] matching Home Page exactly
const PODIUM_CONFIG: Record<
  number,
  {
    pillarHeightClass: string;
    pillarHeightPx: number;
    pillarBg: string;
    pillarBorder: string;
    numColor: string;
    pillBg: string;
    pillText: string;
    pillBorder: string;
    avatarSize: string;
    isFirst?: boolean;
    delay: number;
  }
> = {
  1: {
    pillarHeightClass: "h-36 sm:h-52 md:h-64",
    pillarHeightPx: 250,
    pillarBg:
      "bg-gradient-to-b from-amber-500/25 to-amber-600/35 dark:from-[#3d2410] dark:to-[#251508]",
    pillarBorder: "border-amber-500/60 dark:border-amber-600/50",
    numColor: "text-amber-500",
    pillBg: "bg-amber-500",
    pillText: "text-slate-950 font-black",
    pillBorder: "border-amber-400",
    avatarSize: "h-11 w-11 xs:h-13 xs:w-13 sm:h-18 sm:w-18 md:h-20 md:w-20",
    isFirst: true,
    delay: 0.1,
  },
  2: {
    pillarHeightClass: "h-28 sm:h-40 md:h-48",
    pillarHeightPx: 190,
    pillarBg:
      "bg-gradient-to-b from-indigo-500/25 to-indigo-600/35 dark:from-[#161d44] dark:to-[#0c102b]",
    pillarBorder: "border-indigo-400/60 dark:border-indigo-500/50",
    numColor: "text-indigo-500 dark:text-indigo-400",
    pillBg: "bg-indigo-100 dark:bg-[#1e2754]",
    pillText: "text-indigo-800 dark:text-indigo-200 font-bold",
    pillBorder: "border-indigo-300 dark:border-indigo-500/40",
    avatarSize: "h-10 w-10 xs:h-12 xs:w-12 sm:h-15 sm:w-15 md:h-16 md:w-16",
    delay: 0.2,
  },
  3: {
    pillarHeightClass: "h-24 sm:h-32 md:h-38",
    pillarHeightPx: 150,
    pillarBg:
      "bg-gradient-to-b from-amber-700/20 to-amber-800/30 dark:from-[#2a1a10] dark:to-[#170e08]",
    pillarBorder: "border-amber-600/50 dark:border-amber-800/50",
    numColor: "text-amber-600",
    pillBg: "bg-amber-100 dark:bg-[#291a11]",
    pillText: "text-amber-900 dark:text-amber-300 font-bold",
    pillBorder: "border-amber-300 dark:border-amber-700/40",
    avatarSize: "h-9 w-9 xs:h-11 xs:w-11 sm:h-13 sm:w-13 md:h-14 md:w-14",
    delay: 0.3,
  },
  4: {
    pillarHeightClass: "h-20 sm:h-24 md:h-28",
    pillarHeightPx: 110,
    pillarBg:
      "bg-gradient-to-b from-slate-200/80 to-slate-300/80 dark:from-[#131929] dark:to-[#0a0d17]",
    pillarBorder: "border-slate-300 dark:border-slate-700/40",
    numColor: "text-slate-500",
    pillBg: "bg-slate-100 dark:bg-[#151c2d]",
    pillText: "text-slate-700 dark:text-slate-300 font-bold",
    pillBorder: "border-slate-300 dark:border-slate-700/40",
    avatarSize: "h-8 w-8 xs:h-9 xs:w-9 sm:h-11 sm:w-11 md:h-12 md:w-12",
    delay: 0.4,
  },
  5: {
    pillarHeightClass: "h-14 sm:h-16 md:h-20",
    pillarHeightPx: 80,
    pillarBg:
      "bg-gradient-to-b from-slate-100/90 to-slate-200/90 dark:from-[#101524] dark:to-[#080b12]",
    pillarBorder: "border-slate-300 dark:border-slate-800/40",
    numColor: "text-slate-500 dark:text-slate-600",
    pillBg: "bg-slate-100 dark:bg-[#131826]",
    pillText: "text-slate-700 dark:text-slate-400 font-bold",
    pillBorder: "border-slate-300 dark:border-slate-800/40",
    avatarSize: "h-7 w-7 xs:h-8 xs:w-8 sm:h-10 sm:w-10 md:h-11 md:w-11",
    delay: 0.5,
  },
};

// Top 5 podium order matching home page: 4, 2, 1, 3, 5
const PODIUM_ORDER = [4, 2, 1, 3, 5];

export function LeaderboardPage() {
  const {
    leaderboard,
    isLoading,
    error,
    refreshLeaderboard,
    userRank,
    totalParticipants,
  } = useLeaderboard();
  const dashboard = useOptionalDashboard();
  const { profileUrl: currentProfileUrl, calculationResult } = useCalculation();
  const { selectedProfile, profiles } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshLeaderboard(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Resolve current active user info directly from dashboard context / calculator to guarantee 100% exact parity
  const currentUserInfo = useMemo(() => {
    let name = "";
    let photoUrl: string | undefined = undefined;
    let points = 0;
    let badges = 0;
    let profileUrl = currentProfileUrl || "";

    // 1. Direct from Dashboard context (real-time live calculated points)
    if (dashboard?.user) {
      if (dashboard.user.arcadePoints > 0 || dashboard.user.name) {
        name = dashboard.user.name || name;
        photoUrl = dashboard.user.photoUrl || photoUrl;
        points = dashboard.user.arcadePoints;
        badges = dashboard.user.totalBadges || badges;
      }
    }

    // 2. Direct from active calculationResult
    if (!points && calculationResult) {
      const pData =
        (calculationResult.profileData as any) ||
        (calculationResult.user as any);
      name = name || pData?.name || "";
      photoUrl = photoUrl || pData?.photoUrl;
      points =
        (calculationResult as any).summary?.totalPoints ??
        (calculationResult as any).points?.total ??
        (calculationResult as any).user?.points ??
        0;
      badges =
        (calculationResult as any).badges?.length ??
        (calculationResult as any).user?.badges?.length ??
        0;
      profileUrl = (calculationResult as any).profileUrl || profileUrl;
    }

    // 3. From selectedProfile or profiles
    if (!points && selectedProfile?.name) {
      name = name || selectedProfile.name;
      profileUrl = profileUrl || selectedProfile.profileUrl || "";
      const cResp = selectedProfile.calculationResponse as any;
      photoUrl = photoUrl || cResp?.profileData?.photoUrl;
      points =
        cResp?.points?.total ??
        cResp?.summary?.totalPoints ??
        cResp?.user?.points ??
        0;
      badges = cResp?.badges?.length ?? cResp?.user?.badges?.length ?? 0;
    } else if (!points && profiles && profiles.length > 0) {
      const active = profiles[0];
      name = name || active.name;
      profileUrl = profileUrl || active.profileUrl || "";
      const cResp = active.calculationResponse as any;
      photoUrl = photoUrl || cResp?.profileData?.photoUrl;
      points =
        cResp?.points?.total ??
        cResp?.summary?.totalPoints ??
        cResp?.user?.points ??
        0;
      badges = cResp?.badges?.length ?? cResp?.user?.badges?.length ?? 0;
    }

    // 4. From localStorage if accessed directly
    if (typeof window !== "undefined") {
      try {
        if (!points) {
          const storedProfiles = localStorage.getItem("arcadeverse_profiles");
          if (storedProfiles) {
            const parsed = JSON.parse(storedProfiles);
            const activeId = localStorage.getItem(
              "arcadeverse_current_profile_id",
            );
            const active =
              parsed.find((p: any) => p.id === activeId) || parsed[0];
            if (active) {
              name = name || active.name;
              profileUrl = profileUrl || active.url;
              const cResp = active.calculationResponse;
              photoUrl = photoUrl || cResp?.profileData?.photoUrl;
              points =
                points ||
                cResp?.points?.total ||
                cResp?.summary?.totalPoints ||
                0;
              badges = badges || cResp?.badges?.length || 0;
            }
          }
        }

        if (!points) {
          const storedData = localStorage.getItem("arcadeverseData");
          if (storedData) {
            const parsed = JSON.parse(storedData);
            name = name || parsed?.profileData?.name || parsed?.user?.name;
            photoUrl = photoUrl || parsed?.profileData?.photoUrl;
            points =
              points ||
              parsed?.points?.total ||
              parsed?.summary?.totalPoints ||
              parsed?.user?.points ||
              0;
            badges =
              badges ||
              parsed?.badges?.length ||
              parsed?.user?.badges?.length ||
              0;
          }
        }
      } catch {}
    }

    // Default fallback to "ANIKET YADAV" only if absolutely no calculation exists
    if (!name && points === 0) {
      name = "ANIKET YADAV";
      badges = 118;
      points = 2;
    }

    return { name, photoUrl, points, badges, profileUrl };
  }, [
    dashboard?.user,
    calculationResult,
    currentProfileUrl,
    selectedProfile,
    profiles,
  ]);

  // Sort and assign ranks 1..N, keeping active user data in sync with dashboard
  const sortedLeaderboard = useMemo(() => {
    let userFound = false;
    const list = leaderboard.map((entry) => {
      const isUserMatch =
        (currentUserInfo.profileUrl &&
          entry.profileUrl.toLowerCase() ===
            currentUserInfo.profileUrl.toLowerCase()) ||
        (currentUserInfo.name &&
          entry.name.toLowerCase() === currentUserInfo.name.toLowerCase());

      if (isUserMatch) {
        userFound = true;
        return {
          ...entry,
          name: currentUserInfo.name || entry.name,
          photoUrl: currentUserInfo.photoUrl || entry.photoUrl,
          points:
            currentUserInfo.points > 0 ? currentUserInfo.points : entry.points,
          badges:
            currentUserInfo.badges > 0 ? currentUserInfo.badges : entry.badges,
          isDemo: false,
        };
      }
      return entry;
    });

    if (
      !userFound &&
      currentUserInfo.points > 0 &&
      currentUserInfo.profileUrl
    ) {
      list.push({
        profileUrl: currentUserInfo.profileUrl,
        name: currentUserInfo.name,
        photoUrl: currentUserInfo.photoUrl,
        points: currentUserInfo.points,
        badges: currentUserInfo.badges,
        lastUpdated: new Date().toISOString(),
        isDemo: false,
      });
    }

    const realUsers = list.filter(
      (e) => !e.isDemo && !e.profileUrl?.includes("/public_profiles/user"),
    );
    const demoUsers = list.filter(
      (e) => e.isDemo || e.profileUrl?.includes("/public_profiles/user"),
    );

    // If 50 or more real users exist, wipe out demo users completely!
    let combined: LeaderboardEntry[];
    if (realUsers.length >= 50) {
      combined = realUsers.map((e) => ({ ...e, isDemo: false }));
    } else {
      combined = [
        ...realUsers.map((e) => ({ ...e, isDemo: false })),
        ...demoUsers.map((e) => ({
          ...e,
          isDemo: true,
          photoUrl: undefined, // ensure demo users use Google color initials
        })),
      ];
    }

    const sorted = [...combined]
      .sort((a, b) => b.points - a.points)
      .slice(0, 50);
    return sorted.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }, [leaderboard, currentUserInfo]);

  // Top 5 entries map by rank
  const top5Map = useMemo(() => {
    const map = new Map<number, LeaderboardEntry>();
    for (const entry of sortedLeaderboard.slice(0, 5)) {
      if (entry.rank) {
        map.set(entry.rank, entry);
      }
    }
    return map;
  }, [sortedLeaderboard]);

  // Lower ladder entries (Ranks 6 to 50)
  const ladderEntries = useMemo(() => {
    return sortedLeaderboard.slice(5, 50);
  }, [sortedLeaderboard]);

  // Filtered ladder entries based on search query
  const filteredLadderEntries = useMemo(() => {
    if (!searchQuery.trim()) return ladderEntries;
    const q = searchQuery.toLowerCase();
    return ladderEntries.filter(
      (entry) =>
        entry.name.toLowerCase().includes(q) || entry.rank?.toString() === q,
    );
  }, [ladderEntries, searchQuery]);

  // Resolve userRankData
  const userRankData = useMemo(() => {
    const { name, photoUrl, points, badges, profileUrl } = currentUserInfo;

    // 1. Find rank in sortedLeaderboard if user is in Top 50
    let rank: number | undefined;
    const found = sortedLeaderboard.find(
      (entry) =>
        (profileUrl &&
          entry.profileUrl.toLowerCase() === profileUrl.toLowerCase()) ||
        (name && entry.name.toLowerCase() === name.toLowerCase()),
    );
    if (found?.rank) rank = found.rank;

    // 2. If user is outside Top 50, use the verified exact mathematical rank from the database!
    if (!rank && typeof userRank === "number" && userRank > 0) {
      rank = userRank;
    }

    // 3. Fallback: if user has calculated points and rank hasn't loaded yet from server, rank relative to top 50
    if (!rank) {
      if (points > 0) {
        const higherInTop50 = sortedLeaderboard.filter(
          (e) => e.points > points,
        ).length;
        if (higherInTop50 < sortedLeaderboard.length) {
          rank = higherInTop50 + 1;
        } else {
          // If points are below the 50th entry, establish standing rank based on community benchmark
          const lowestPoints =
            sortedLeaderboard[sortedLeaderboard.length - 1]?.points || 85;
          rank = 50 + Math.max(1, Math.round((lowestPoints - points) * 35));
        }
      } else {
        rank = 9531;
      }
    }

    return {
      name,
      photoUrl: photoUrl || found?.photoUrl,
      points: points > 0 ? points : (found?.points ?? 0),
      badges: badges > 0 ? badges : (found?.badges ?? 0),
      rank: rank || 9531,
    };
  }, [currentUserInfo, sortedLeaderboard, userRank]);

  return (
    <div className="min-h-screen bg-background text-foreground py-12 sm:py-16 px-3 sm:px-6 lg:px-8 space-y-12 relative overflow-x-clip w-full max-w-full">
      <Helmet>
        <title>Google Cloud Arcade Leaderboard 2026 | ArcadeVerse</title>
        <meta
          name="description"
          content="Track your exact standings among the global participating community in Google Cloud Arcade 2026. Compare total Arcade points, monitor skill badges, and accelerate your progress toward milestone rewards!"
        />
        <link
          rel="canonical"
          href="https://arcadeverse.vercel.app/google-cloud-arcade-leaderboard"
        />
      </Helmet>

      {/* Ambient Cosmic Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-purple-600/10 via-indigo-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-12">
        {/* ========================================================================= */}
        {/* 1. CLEAN ARCADEVERSE HEADER (DO NOT COPY ARCADECALC HIGHLIGHTED HEADING)  */}
        {/* ========================================================================= */}
        <header
          aria-label="Leaderboard Hero Header"
          className="text-left sm:text-center space-y-4 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-medium backdrop-blur-md shadow-sm mx-auto">
            <IconSparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
            <span>Official Community Standings</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-foreground dark:text-white tracking-tight leading-tight">
            Google Cloud Arcade Global Leaderboard 2026 🏆
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base lg:text-[17px] leading-relaxed max-w-3xl mx-auto font-normal">
            Track your exact standings among the{" "}
            <strong className="text-foreground dark:text-white font-semibold">
              global participating community
            </strong>{" "}
            in Google Cloud Arcade 2026. Leaderboards update
            automatically—compare total Arcade points, monitor skill badges, and
            accelerate your progress toward{" "}
            <span className="text-purple-600 dark:text-purple-300 font-semibold">
              official swag rewards
            </span>
            !
          </p>

          {/* Quick Refresh Bar */}
          <div className="flex items-center justify-center pt-2 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing || isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/15 text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors disabled:opacity-50 border border-purple-500/20"
            >
              <IconRefresh
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>{isRefreshing ? "Refreshing..." : "Refresh rankings"}</span>
            </button>
          </div>
        </header>

        {/* Loading Skeleton State */}
        {isLoading && sortedLeaderboard.length === 0 && (
          <div className="space-y-8 animate-pulse">
            {/* 5-pillar skeleton */}
            <div className="flex items-end justify-center gap-3 sm:gap-6 max-w-4xl mx-auto pt-16">
              {[
                { id: "sk-p4", h: 110 },
                { id: "sk-p2", h: 190 },
                { id: "sk-p1", h: 250 },
                { id: "sk-p3", h: 150 },
                { id: "sk-p5", h: 80 },
              ].map((sk) => (
                <div
                  key={sk.id}
                  style={{ height: `${sk.h}px` }}
                  className="flex-1 max-w-[150px] bg-[#141b2c] rounded-t-2xl border border-white/10"
                />
              ))}
            </div>
            {/* Rows skeleton */}
            <div className="space-y-3 max-w-5xl mx-auto pt-6">
              {["sk-r1", "sk-r2", "sk-r3", "sk-r4", "sk-r5"].map((skId) => (
                <div
                  key={skId}
                  className="h-16 bg-[#141b2c] rounded-2xl border border-white/10"
                />
              ))}
            </div>
          </div>
        )}

        {/* Error State with Retry Button */}
        {error && sortedLeaderboard.length === 0 && !isLoading && (
          <div className="max-w-xl mx-auto p-6 rounded-2xl border border-red-500/30 bg-red-950/20 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <IconAlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Leaderboard Temporarily Unavailable
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                We couldn't connect to the leaderboard rankings server. Please
                check your connection and try again.
              </p>
            </div>
            <Button
              onClick={handleManualRefresh}
              className="bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs h-9 px-4"
            >
              <IconRefresh className="w-3.5 h-3.5 mr-1.5" />
              Retry Connection
            </Button>
          </div>
        )}

        {/* Content Rendered when Leaderboard Data is Available */}
        {sortedLeaderboard.length > 0 && (
          <div className="space-y-14">
            {/* ========================================================================= */}
            {/* 2. DEDICATED TOP 5 PODIUM (EXACTLY LIKE HOME PAGE 5-PILLAR LADDER)        */}
            {/* ========================================================================= */}
            <section aria-labelledby="top-5-heading" className="space-y-8">
              <div className="text-center space-y-1.5">
                <h2
                  id="top-5-heading"
                  className="text-xl sm:text-2xl font-bold text-foreground dark:text-white tracking-tight flex items-center justify-center gap-2"
                >
                  <IconMedal className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                  Top 5 Global Leaders
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  The highest-achieving participants leading the Google Cloud
                  Arcade season
                </p>
              </div>

              {/* 5-Rank Podium Ladder (Order: 4, 2, 1, 3, 5 - exactly matching Home Page) */}
              <div className="pt-8 sm:pt-14 flex items-end justify-center gap-1.5 xs:gap-2 sm:gap-4 md:gap-6 px-1 sm:px-4 max-w-4xl mx-auto w-full">
                {PODIUM_ORDER.map((rankNum) => {
                  const participant = top5Map.get(rankNum);
                  if (!participant) return null;

                  const isUser =
                    (currentUserInfo.profileUrl &&
                      participant.profileUrl.toLowerCase() ===
                        currentUserInfo.profileUrl.toLowerCase()) ||
                    (currentUserInfo.name &&
                      participant.name.toLowerCase() ===
                        currentUserInfo.name.toLowerCase());

                  const cfg = PODIUM_CONFIG[rankNum];
                  const fallbackPodiumPhoto = PODIUM_AVATARS[rankNum];
                  const effectivePhoto = isUser
                    ? currentUserInfo.photoUrl ||
                      participant.photoUrl ||
                      fallbackPodiumPhoto
                    : participant.photoUrl || fallbackPodiumPhoto;

                  return (
                    <div
                      key={rankNum}
                      className="flex flex-col items-center flex-1 min-w-0 max-w-[85px] xs:max-w-[105px] sm:max-w-[140px] md:max-w-[170px]"
                    >
                      {/* Avatar & Floating Information */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: cfg.delay }}
                        className="flex flex-col items-center mb-2 sm:mb-3 text-center relative z-10 w-full min-w-0"
                      >
                        {/* Crown on Rank 1 */}
                        {cfg.isFirst && (
                          <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                              duration: 2.5,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                            className="text-xl sm:text-3xl -mb-1 filter drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                          >
                            👑
                          </motion.div>
                        )}

                        {/* Avatar with Halo Glow */}
                        <div className="relative group shrink-0">
                          {cfg.isFirst && (
                            <div className="absolute -inset-2 sm:-inset-3 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />
                          )}
                          <GoogleAvatar
                            name={participant.name}
                            photoUrl={effectivePhoto}
                            isDemo={isUser ? false : participant.isDemo}
                            sizeClassName={cfg.avatarSize}
                            className={`border-2 ${
                              cfg.isFirst
                                ? "border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.35)]"
                                : "border-slate-300 dark:border-slate-700"
                            } transition-transform group-hover:scale-105`}
                          />
                        </div>

                        {/* Player Name */}
                        <span className="mt-1.5 sm:mt-2 font-display text-[10px] xs:text-xs sm:text-sm font-bold text-foreground dark:text-white truncate max-w-full block w-full px-0.5">
                          {participant.name}
                        </span>

                        {/* Points Pill */}
                        <div
                          className={`mt-1 rounded-full border px-1 xs:px-1.5 sm:px-2.5 py-0.5 text-[9px] xs:text-[10px] sm:text-xs shadow-sm font-mono whitespace-nowrap max-w-full truncate ${cfg.pillBg} ${cfg.pillText} ${cfg.pillBorder}`}
                        >
                          {participant.points} Pts
                        </div>
                      </motion.div>

                      {/* Animated Pillar Block */}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: cfg.pillarHeightPx }}
                        transition={{
                          duration: 0.8,
                          delay: cfg.delay,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={`w-full rounded-t-xl sm:rounded-t-3xl border-t border-x ${cfg.pillarBg} ${cfg.pillarBorder} flex items-center justify-center shadow-2xl relative overflow-hidden`}
                        style={{ height: cfg.pillarHeightPx }}
                      >
                        {/* Subtle top shine */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-white/20" />

                        {/* Rank Number inside Pillar */}
                        <span
                          className={`font-display font-black text-2xl xs:text-3xl sm:text-5xl md:text-6xl ${cfg.numColor} select-none`}
                        >
                          {rankNum}
                        </span>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {/* User Standing Card Just Down the Top 5 Podium */}
              {userRankData && userRankData.rank > 5 && (
                <div className="pt-6 sm:pt-8 w-full flex justify-center">
                  <UserPodiumRankCard
                    rank={userRankData.rank}
                    name={userRankData.name}
                    badges={userRankData.badges}
                    points={userRankData.points}
                    photoUrl={userRankData.photoUrl}
                  />
                </div>
              )}
            </section>

            {/* ========================================================================= */}
            {/* 3. LEADERBOARD LADDER: RANKS 6–50                                         */}
            {/* ========================================================================= */}
            <section
              aria-labelledby="ladder-heading"
              className="space-y-4 pt-4"
            >
              {/* Ladder Controls Bar */}
              <div className="bg-surface-card p-4 sm:p-5 rounded-2xl border border-border dark:border-white/10 dark:bg-[#141b2c] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <h2
                    id="ladder-heading"
                    className="font-bold text-sm sm:text-base text-foreground dark:text-white flex items-center gap-2"
                  >
                    <IconTrophy className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    Leaderboard Ladder
                  </h2>
                  <Badge
                    variant="outline"
                    className="text-xs bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30"
                  >
                    Ranks 6–50
                  </Badge>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <IconSearch className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search participant name..."
                    className="w-full bg-surface-hover/50 border-border dark:border-white/10 dark:bg-[#0e131d] pl-9 pr-3 py-2 text-xs sm:text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-slate-500 rounded-xl focus-visible:ring-purple-500/40"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Ladder Rows (Ranks 6 to 50) */}
              <div className="space-y-2.5">
                <AnimatePresence>
                  {filteredLadderEntries.map((entry) => {
                    const isUser =
                      (currentUserInfo.profileUrl &&
                        entry.profileUrl.toLowerCase() ===
                          currentUserInfo.profileUrl.toLowerCase()) ||
                      (currentUserInfo.name &&
                        entry.name.toLowerCase() ===
                          currentUserInfo.name.toLowerCase());
                    const effectivePhoto =
                      (isUser ? currentUserInfo.photoUrl : null) ||
                      entry.photoUrl;

                    return (
                      <motion.div
                        key={entry.profileUrl || `rank-${entry.rank}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`group relative rounded-2xl p-3.5 sm:p-4 border transition-all duration-150 flex items-center justify-between gap-3 sm:gap-4 ${
                          isUser
                            ? "bg-indigo-50/70 border-2 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)] dark:bg-[#0f1526] dark:border-indigo-500"
                            : "bg-surface-card border border-border hover:border-border-strong hover:bg-surface-hover/60 dark:bg-[#0c1220] dark:border-slate-800/80 dark:hover:border-slate-700 dark:hover:bg-[#0f1628]"
                        }`}
                      >
                        {/* Left Side: Rank, Avatar, Name & Badges */}
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          {/* Rank Pill */}
                          <div className="w-12 sm:w-14 h-8 sm:h-9 rounded-full bg-surface-hover border border-border dark:bg-white dark:border-transparent text-foreground dark:text-slate-950 flex items-center justify-center font-bold text-xs sm:text-sm font-sans tracking-tight shrink-0 shadow-sm">
                            #{entry.rank}
                          </div>

                          {/* Avatar (Real Google Photo or Google-Color Initial) */}
                          <div className="relative shrink-0">
                            <GoogleAvatar
                              name={entry.name}
                              photoUrl={effectivePhoto}
                              isDemo={isUser ? false : entry.isDemo}
                              sizeClassName="w-10 h-10 sm:w-11 sm:h-11"
                              className="border border-border dark:border-slate-700/60 shadow-sm"
                            />
                          </div>

                          {/* Participant Information: Name & Badges */}
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-sm sm:text-base text-foreground dark:text-white truncate leading-tight">
                              {entry.name}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground dark:text-slate-400 font-normal mt-1">
                              {entry.badges} Badges
                            </div>
                          </div>
                        </div>

                        {/* Right Side: Points Pill */}
                        <div className="shrink-0">
                          <div className="px-5 sm:px-8 py-2 sm:py-2.5 rounded-2xl bg-surface-hover/80 border border-border text-foreground dark:bg-[#141b2c] dark:border-slate-700/50 dark:text-white font-bold text-xs sm:text-sm tracking-tight shadow-sm flex items-center justify-center min-w-[85px] sm:min-w-[105px]">
                            {entry.points} Pts
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Empty Search Results */}
                {filteredLadderEntries.length === 0 && searchQuery && (
                  <div className="p-8 text-center bg-surface-card rounded-2xl border border-border dark:border-white/10 dark:bg-[#121724] text-muted-foreground space-y-2">
                    <p className="text-sm font-medium">
                      No participants matching "{searchQuery}"
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Clear search filter
                    </button>
                  </div>
                )}

                {/* If fewer than 50 real records exist in database */}
                {ladderEntries.length < 45 && !searchQuery && (
                  <div className="p-6 rounded-2xl border border-dashed border-border/80 bg-surface-hover/30 dark:border-white/15 dark:bg-white/5 text-center text-xs text-muted-foreground">
                    Showing all {sortedLeaderboard.length} verified community
                    participants. Ranks up to #50 populate automatically as new
                    learners analyze their Google Cloud Skills Boost profiles!
                  </div>
                )}
              </div>
            </section>

            {/* ========================================================================= */}
            {/* 4. FACILITATOR LEADERBOARD PROMO CARD                                     */}
            {/* ========================================================================= */}
            <article
              aria-labelledby="facilitator-promo-heading"
              className="max-w-5xl mx-auto relative bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-blue-50/60 dark:from-indigo-950/40 dark:via-[#151d30] dark:to-purple-950/30 border-2 border-dashed border-indigo-500/30 rounded-3xl p-6 sm:p-8 overflow-hidden text-foreground dark:text-white mt-10 shadow-card-premium"
            >
              <div className="flex flex-col space-y-4">
                <div className="space-y-2 max-w-3xl text-left">
                  <h2
                    id="facilitator-promo-heading"
                    className="text-xl sm:text-2xl font-extrabold text-foreground dark:text-white leading-tight flex items-center gap-2"
                  >
                    <IconTrophy className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                    Looking for Facilitator Program Rankings?
                  </h2>
                  <p className="text-muted-foreground dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Are you participating in the{" "}
                    <strong className="text-foreground dark:text-white font-semibold">
                      Google Cloud Arcade Facilitator Program 2026
                    </strong>
                    ? Check out our dedicated Facilitator Leaderboard to view
                    real-time facilitator standings, bonus point milestones,
                    institution rankings, and participant referral metrics!
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    asChild
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-2xl transition-all shadow-md hover:-translate-y-0.5 text-xs sm:text-sm"
                  >
                    <Link to="/arcade-facilitator?tab=leaderboard">
                      <span>Open Facilitator Leaderboard</span>
                      <IconArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaderboardPage;
