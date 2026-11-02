import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconAward,
  IconDiamond,
  IconRocket,
  IconStar,
  IconTrophy,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import React from "react";

interface ProfileCardProps {
  name: string;
  secondaryName?: string;
  memberSince: string;
  league: string;
  leagueImage?: string;
  photoUrl?: string;
}

// Official Google Cloud Skills Boost league medal assets (cached locally for instant 0ms load)
const OFFICIAL_LEAGUE_MEDALS: Record<string, string> = {
  silver: "/images/leagues/silver.png",
};

// Helper function to get initials from name
const getInitials = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Helper function to get league icon and accent color based on league name
const getLeagueInfo = (league: string, leagueImage?: string) => {
  const lowerLeague = league.toLowerCase();

  let medalUrl = leagueImage || "";
  if (!medalUrl) {
    if (lowerLeague.includes("silver")) {
      medalUrl = OFFICIAL_LEAGUE_MEDALS.silver;
    }
  }

  if (lowerLeague.includes("diamond")) {
    return {
      icon: IconDiamond,
      medalUrl,
      accent: "text-cyan-400",
      ring: "border-cyan-400/40",
      glow: "shadow-glow-purple",
    };
  }
  if (lowerLeague.includes("gold") || lowerLeague.includes("champion")) {
    return {
      icon: IconTrophy,
      medalUrl,
      accent: "text-accent-yellow",
      ring: "border-accent-yellow/40",
      glow: "",
    };
  }
  if (lowerLeague.includes("silver") || lowerLeague.includes("ranger")) {
    return {
      icon: IconStar,
      medalUrl: medalUrl || OFFICIAL_LEAGUE_MEDALS.silver,
      accent: "text-slate-300",
      ring: "border-slate-300/40",
      glow: "",
    };
  }
  if (lowerLeague.includes("bronze") || lowerLeague.includes("trooper")) {
    return {
      icon: IconAward,
      medalUrl,
      accent: "text-orange-400",
      ring: "border-orange-400/40",
      glow: "",
    };
  }
  return {
    icon: IconRocket,
    medalUrl,
    accent: "text-emerald-400",
    ring: "border-emerald-400/40",
    glow: "",
  };
};

export default function ProfileCard({
  name,
  secondaryName,
  memberSince,
  league,
  leagueImage,
  photoUrl,
}: ProfileCardProps) {
  const [imageError, setImageError] = React.useState(false);
  const {
    icon: LeagueIcon,
    medalUrl,
    accent: leagueAccent,
    ring: leagueRing,
  } = getLeagueInfo(league, leagueImage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-2xl border border-border bg-surface-card p-4 sm:p-4.5 shadow-card-premium transition-all duration-300 hover:border-border-strong hover:-translate-y-[1px]"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative h-16 w-16 sm:h-[72px] sm:w-[72px] flex-shrink-0 rounded-2xl border border-border/80 shadow-sm overflow-hidden bg-[#7c3aed]/10 flex items-center justify-center">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              className="h-full w-full object-cover rounded-2xl"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("ui-avatars.com")) {
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=B7632E&color=fff&size=200&bold=true&font-size=0.4`;
                }
              }}
            />
          ) : (
            <div className="h-full w-full rounded-2xl bg-[#B7632E] text-white flex items-center justify-center font-bold text-xl select-none">
              {getInitials(name)}
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-lg sm:text-xl font-bold leading-tight text-foreground truncate">
            {name || "Arcade User"}
          </h2>
          {secondaryName && (
            <p className="text-xs truncate text-muted-foreground mt-0.5">
              {secondaryName}
            </p>
          )}
          {memberSince && (
            <p className="text-xs mt-1 text-muted-foreground">
              Member since{" "}
              <span className="text-foreground/80 font-medium">
                {memberSince}
              </span>
            </p>
          )}

          {/* League Badge */}
          {league && (
            <div
              className={`mt-2.5 inline-flex items-center gap-1.5 rounded-md border bg-surface-hover/60 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${leagueRing}`}
            >
              {medalUrl && !imageError ? (
                <img
                  src={medalUrl}
                  alt={league}
                  loading="eager"
                  decoding="async"
                  className="h-3.5 w-3.5 object-contain shrink-0"
                  onError={() => setImageError(true)}
                />
              ) : (
                <LeagueIcon size={13} className={leagueAccent} />
              )}
              <span className={`text-[10px] font-bold ${leagueAccent}`}>
                {league}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
