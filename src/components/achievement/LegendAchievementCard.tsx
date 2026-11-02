import {
  CANONICAL_SITE_URL,
  type LegendCardData,
  formatPoints,
  validateLegendCardData,
} from "@/lib/legendCardLogic";
import React from "react";

interface LegendAchievementCardProps {
  data: LegendCardData;
  className?: string;
}

export function LegendAchievementCard({
  data,
  className = "",
}: LegendAchievementCardProps) {
  // 1. Strict validation check
  const validation = validateLegendCardData(data);
  if (!validation.isValid) {
    return (
      <div className="w-full rounded-2xl border border-red-500/40 bg-red-950/40 p-6 text-center text-red-200 backdrop-blur-md">
        <div className="mb-2 text-2xl font-bold">⚠️ Generation Error</div>
        <p className="text-sm font-medium">
          Unable to generate achievement card because profile data is
          incomplete.
        </p>
        <ul className="mt-3 list-inside list-disc text-xs text-red-300">
          {validation.errors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      </div>
    );
  }

  const pointsText = formatPoints(data.arcadePoints);
  const memberYearMatch = data.memberSince?.match(/(\d{4})/);
  const memberSinceYear = memberYearMatch ? memberYearMatch[1] : "2026";
  const cleanLeague = data.league?.replace(/league/i, "").trim() || "Silver";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-indigo-500/30 bg-[#060914] shadow-2xl select-none aspect-[1024/577] ${className}`}
      style={{
        containerType: "inline-size",
      }}
    >
      {/* 1. MASTER DEFAULT TEMPLATE AS THE FOUNDATIONAL DESIGN LAYER */}
      <img
        src="/images/achievement/legend-card-master-template.jpg"
        alt="ArcadeVerse Legend Tier Master Template"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        loading="eager"
        decoding="sync"
        fetchPriority="high"
      />

      {/* 2. DYNAMIC DATA LAYER (INJECTED PRECISELY INSIDE DESIGNATED VALUE BOXES) */}
      <div className="absolute inset-0 select-none text-white font-sans pointer-events-auto">
        {/* --- LEFT SIDE: 3 BADGE STATISTICS VALUE BOXES --- */}
        {/* Total Badges Value (Centered strictly inside box at cx=160, cy=250) */}
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            left: "11.52%",
            top: "41.25%",
            width: "8.20%",
            height: "4.16%",
          }}
        >
          <span className="font-heading font-black text-white text-[clamp(10px,1.65cqi,18px)] tracking-tight leading-none drop-shadow-sm select-none">
            {data.totalBadges}
          </span>
        </div>

        {/* Skill Badges Value (Centered strictly inside box at cx=160, cy=318) */}
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            left: "11.52%",
            top: "53.03%",
            width: "8.20%",
            height: "4.16%",
          }}
        >
          <span className="font-heading font-black text-white text-[clamp(10px,1.65cqi,18px)] tracking-tight leading-none drop-shadow-sm select-none">
            {data.skillBadges}
          </span>
        </div>

        {/* Game Badges Value (Centered strictly inside box at cx=160, cy=386) */}
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            left: "11.52%",
            top: "64.82%",
            width: "8.20%",
            height: "4.16%",
          }}
        >
          <span className="font-heading font-black text-white text-[clamp(10px,1.65cqi,18px)] tracking-tight leading-none drop-shadow-sm select-none">
            {data.gameBadges}
          </span>
        </div>

        {/* --- CENTER: USER PROFILE SECTION --- */}
        {/* Avatar Circle (Centered at cx=320, cy=252, r=38 — non-overlapping with arcade points box) */}
        <div
          className="absolute flex items-center justify-center overflow-hidden rounded-full border-2 border-indigo-400/80 bg-gradient-to-br from-indigo-500 to-indigo-800 shadow-[0_0_12px_rgba(99,102,241,0.4)] pointer-events-none"
          style={{
            left: "27.54%",
            top: "37.09%",
            width: "7.42%",
            height: "13.17%",
          }}
        >
          {data.photoUrl ? (
            <img
              src={data.photoUrl}
              alt={data.name}
              className="w-full h-full object-cover rounded-full"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes("ui-avatars.com")) {
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "User")}&background=B7632E&color=fff&size=200&bold=true&font-size=0.4`;
                }
              }}
            />
          ) : (
            <span className="font-heading font-black text-white text-[clamp(10px,1.6cqi,20px)] leading-none select-none">
              {data.name
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "AV"}
            </span>
          )}
        </div>

        {/* User Name Pill (Centered inside the main name pill at cx=500, cy=238 — pure white font) */}
        <div
          className="absolute flex items-center justify-center px-[3%] pointer-events-none"
          style={{
            left: "36.91%",
            top: "38.13%",
            width: "23.83%",
            height: "6.24%",
          }}
        >
          <span
            className="font-heading font-extrabold text-white text-[clamp(11px,1.9cqi,20px)] truncate leading-tight select-none drop-shadow-md text-center"
            title={data.name}
          >
            {data.name}
          </span>
        </div>

        {/* Member Since Year (Centered strictly inside empty year box at cx=478, cy=274 — pure white font) */}
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            left: "43.95%",
            top: "45.75%",
            width: "5.47%",
            height: "3.47%",
          }}
        >
          <span className="font-sans font-bold text-white text-[clamp(8px,1.15cqi,13px)] tracking-wide leading-none select-none drop-shadow">
            {memberSinceYear}
          </span>
        </div>

        {/* Current League (Centered strictly inside empty league box at cx=591, cy=274 — pure white font) */}
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            left: "54.88%",
            top: "45.75%",
            width: "5.66%",
            height: "3.47%",
          }}
        >
          <span
            className="font-sans font-bold text-white text-[clamp(8px,1.15cqi,13px)] tracking-wide leading-none select-none truncate drop-shadow"
            title={data.league}
          >
            {cleanLeague}
          </span>
        </div>

        {/* --- CENTER: ARCADE POINTS DISPLAY --- */}
        {/* Large Arcade Points Number (Centered in points area between chevrons at cx=450, cy=328 — pure white font with glow) */}
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            left: "33.20%",
            top: "51.65%",
            width: "21.48%",
            height: "10.40%",
          }}
        >
          <span className="font-heading font-black text-white text-[clamp(20px,4.5cqi,46px)] tracking-tight leading-none select-none drop-shadow-[0_0_16px_rgba(255,255,255,0.7)]">
            {pointsText}
          </span>
        </div>

        {/* Bonus Points Number (Centered strictly inside empty bonus box at cx=445, cy=412 — pure white font) */}
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            left: "41.02%",
            top: "69.67%",
            width: "4.88%",
            height: "3.47%",
          }}
        >
          <span className="font-sans font-black text-white text-[clamp(8px,1.25cqi,14px)] leading-none select-none drop-shadow-sm">
            {data.bonusPoints}
          </span>
        </div>

        {/* --- BOTTOM: CLICKABLE CANONICAL CTA OVERLAY --- */}
        <a
          href={data.siteUrl || CANONICAL_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute rounded-full transition-all duration-200 hover:ring-2 hover:ring-sky-400/50 hover:bg-sky-400/10 active:scale-[0.99] cursor-pointer"
          style={{
            left: "32.23%",
            top: "91.16%",
            width: "37.11%",
            height: "6.59%",
          }}
          title="Visit ArcadeVerse (opens in new tab)"
          aria-label="Track your Arcade journey on ArcadeVerse"
        >
          <span className="sr-only">
            Track your Arcade journey on ArcadeVerse
          </span>
        </a>
      </div>
    </div>
  );
}
