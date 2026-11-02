import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLeaderboard } from "@/lib/leaderboard-context";
import { IconArrowRight } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Performer {
  id: number;
  rank: number;
  name: string;
  points: number;
  avatarUrl?: string;
  initials: string;
  badges?: number;
  profileUrl?: string;
}

// Fallback champions matching Google Cloud Arcade top performers
const FALLBACK_PERFORMERS: Performer[] = [
  {
    id: 1,
    rank: 1,
    name: "Irwansyah",
    points: 128,
    initials: "IR",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    rank: 2,
    name: "Ranith Reddy",
    points: 126,
    initials: "RR",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    rank: 3,
    name: "Janakiram N",
    points: 124.5,
    initials: "JN",
    avatarUrl:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    rank: 4,
    name: "Nandan R",
    points: 123,
    initials: "NR",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    rank: 5,
    name: "TËJÃSSVÎ",
    points: 121,
    initials: "TJ",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
];

// Visual configuration for each ladder rank [1..5]
const RANK_CONFIG: Record<
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

export function TopPerformersSection() {
  const navigate = useNavigate();
  const { leaderboard } = useLeaderboard();
  const [performers, setPerformers] =
    useState<Performer[]>(FALLBACK_PERFORMERS);

  useEffect(() => {
    if (leaderboard && leaderboard.length >= 3) {
      const top5: Performer[] = leaderboard.slice(0, 5).map((entry, index) => {
        const nameParts = entry.name.split(" ");
        const initials = nameParts
          .map((part) => part[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        let avatarUrl = "";
        if (entry.profileUrl?.includes("skills.google")) {
          const profileId = entry.profileUrl.split("/").pop();
          avatarUrl = `https://ext.same-assets.com/1544848213/${profileId}.png`;
        }

        return {
          id: index + 1,
          rank: index + 1,
          name: entry.name,
          points: entry.points,
          avatarUrl: avatarUrl || FALLBACK_PERFORMERS[index]?.avatarUrl,
          initials: initials || FALLBACK_PERFORMERS[index]?.initials || "AC",
          badges: entry.badges,
          profileUrl: entry.profileUrl,
        };
      });

      // Pad with fallback if fewer than 5
      while (top5.length < 5) {
        const idx = top5.length;
        const fb = FALLBACK_PERFORMERS[idx];
        top5.push({ ...fb, rank: idx + 1, id: idx + 1 });
      }

      setPerformers(top5);
    }
  }, [leaderboard]);

  // Order for the podium ladder: 4, 2, 1, 3, 5
  const rankMap = new Map(performers.map((p) => [p.rank, p]));
  const ladderOrder = [4, 2, 1, 3, 5];

  return (
    <section
      id="leaderboard-section"
      className="relative py-24 overflow-hidden"
    >
      {/* Subtle ambient lighting */}
      <div
        className="pointer-events-none absolute inset-0 bg-aurora opacity-25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl"
        aria-hidden
      />

      <div className="container max-w-5xl relative z-10">
        {/* Header matching Image 1 */}
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-600/20 px-4 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-purple-700 dark:text-purple-300 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 dark:bg-purple-400 animate-pulse" />
              LIVE LEADERBOARD
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground dark:text-white">
            Google Cloud Arcade 2026:{" "}
            <span className="text-purple-600 dark:text-purple-400">
              Track the Top Players
            </span>{" "}
            🏆
          </h2>

          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stay updated with real-time rankings on the official{" "}
            <strong className="text-foreground dark:text-white font-semibold">
              Google Cloud Arcade 2026 leaderboard
            </strong>
            . Compare your verified Arcade Points with top-performing
            participants, monitor live milestone bonuses across{" "}
            <strong className="text-foreground dark:text-white font-semibold">
              Arcade Games
            </strong>
            ,{" "}
            <strong className="text-foreground dark:text-white font-semibold">
              Trivia Challenges
            </strong>
            , and{" "}
            <strong className="text-foreground dark:text-white font-semibold">
              Skill Badges
            </strong>
            , and track how close you are to unlocking the next{" "}
            <span className="text-purple-600 dark:text-purple-400 font-semibold">
              Arcade Swag Prize Tier
            </span>
            .
          </p>
        </div>

        {/* 5-Rank Podium Ladder Animation (matching Image 1) */}
        <div className="mt-16 sm:mt-24 flex items-end justify-center gap-1.5 xs:gap-2 sm:gap-4 md:gap-6 px-1 sm:px-4 w-full">
          {ladderOrder.map((rankNum) => {
            const performer =
              rankMap.get(rankNum) || FALLBACK_PERFORMERS[rankNum - 1];
            const cfg = RANK_CONFIG[rankNum];

            return (
              <div
                key={rankNum}
                className="flex flex-col items-center flex-1 min-w-0 max-w-[85px] xs:max-w-[105px] sm:max-w-[140px] md:max-w-[170px]"
              >
                {/* Avatar & Floating Information */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
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
                  <div
                    className="relative group cursor-pointer shrink-0"
                    onClick={() => navigate("/google-cloud-arcade-leaderboard")}
                  >
                    {cfg.isFirst && (
                      <div className="absolute -inset-2 sm:-inset-3 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />
                    )}
                    <Avatar
                      className={`${cfg.avatarSize} border-2 ${cfg.isFirst ? "border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.35)]" : "border-slate-300 dark:border-slate-700"} transition-transform group-hover:scale-105`}
                    >
                      <AvatarImage
                        src={performer.avatarUrl}
                        alt={performer.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-surface-hover text-foreground font-bold text-[10px] sm:text-xs md:text-sm">
                        {performer.initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Player Name */}
                  <span className="mt-1.5 sm:mt-2 font-display text-[10px] xs:text-xs sm:text-sm font-bold text-foreground dark:text-white truncate max-w-full block w-full px-0.5">
                    {performer.name}
                  </span>

                  {/* Points Pill */}
                  <div
                    className={`mt-1 rounded-full border px-1 xs:px-1.5 sm:px-2.5 py-0.5 text-[9px] xs:text-[10px] sm:text-xs shadow-sm font-mono whitespace-nowrap max-w-full truncate ${cfg.pillBg} ${cfg.pillText} ${cfg.pillBorder}`}
                  >
                    {performer.points} Pts
                  </div>
                </motion.div>

                {/* Animated Pillar Block */}
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: cfg.pillarHeightPx }}
                  viewport={{ once: true }}
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

                  {/* Rank Number */}
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

        {/* View Full Leaderboard Button */}
        <div className="mt-12 flex justify-center">
          <Button
            size="lg"
            className="rounded-full bg-indigo-600 hover:bg-indigo-500 font-bold px-8 shadow-lg gap-2 text-white"
            onClick={() => navigate("/google-cloud-arcade-leaderboard")}
          >
            View full live leaderboard
            <IconArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default TopPerformersSection;
