export const CANONICAL_SITE_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    (import.meta.env.VITE_SITE_URL as string)) ||
  "https://arcadeverse.vercel.app";

// Official ArcadeVerse Legend Tier points threshold (Single source of truth)
export const LEGEND_TIER_POINTS_REQUIRED = 120;

export interface LegendCardData {
  name: string;
  memberSince: string;
  league: string;
  arcadePoints: number;
  bonusPoints: number;
  totalBadges: number;
  skillBadges: number;
  gameBadges: number;
  highestMilestone: string;
  siteUrl: string;
  avatar?: string;
  photoUrl?: string;
}

export interface CardValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Check if the current calculation result or user profile qualifies for Legend Tier.
 * Strictly checks user's Arcade points against the official Legend Tier threshold (>= 120 PTS).
 */
export function isLegendTier(
  calculationResult: any,
  userFallback?: {
    arcadePoints?: number;
    points?: number;
    milestonePoints?: number;
    bonusPoints?: number;
  },
): boolean {
  if (!calculationResult && !userFallback) return false;

  const rawPoints =
    userFallback?.arcadePoints ??
    userFallback?.points ??
    calculationResult?.summary?.totalPoints ??
    calculationResult?.points?.total ??
    calculationResult?.user?.points ??
    0;

  const points = Number(rawPoints);
  if (Number.isNaN(points)) return false;

  return points >= LEGEND_TIER_POINTS_REQUIRED;
}

/**
 * Extract normalized card data from the ArcadeVerse calculation result and user profile.
 */
export function extractLegendCardData(
  calculationResult: any,
  userFallback?: any,
  customSiteUrl: string = CANONICAL_SITE_URL,
): LegendCardData | null {
  if (!calculationResult && !userFallback) return null;

  const profileData =
    calculationResult?.profileData || calculationResult?.user || {};
  const fallback = userFallback || {};

  const rawName = (profileData.name || fallback.name || "").trim();

  const rawMemberSince = (
    profileData.memberSince ||
    fallback.memberSince ||
    ""
  ).trim();

  // Extract clean 4-digit year from memberSince
  let memberSinceYear = "";
  const yearMatch = rawMemberSince.match(/(\d{4})/);
  if (yearMatch) {
    memberSinceYear = yearMatch[1];
  } else if (/^\d{4}$/.test(rawMemberSince)) {
    memberSinceYear = rawMemberSince;
  } else {
    // Current year fallback
    memberSinceYear = "2026";
  }

  const rawPoints =
    fallback.arcadePoints ??
    fallback.points ??
    calculationResult?.summary?.totalPoints ??
    calculationResult?.points?.total ??
    profileData.points ??
    0;

  // Format arcade points smoothly (keep integer if whole, or up to 2 decimal places)
  const parsedPoints = Number(rawPoints);
  const arcadePoints = Number.isNaN(parsedPoints)
    ? 0
    : Math.round(parsedPoints * 100) / 100;

  // Bonus points if applicable
  const rawBonus =
    fallback.bonusPoints ??
    calculationResult?.summary?.milestonePoints ??
    calculationResult?.points?.milestonePoints ??
    fallback.milestonePoints ??
    0;
  const bonusPoints = Number(rawBonus) || 0;

  // Dynamic league
  let league = (profileData.league || fallback.league || "").trim();
  if (!league) {
    if (arcadePoints >= 95) league = "Diamond League";
    else if (arcadePoints >= 75) league = "Gold League";
    else if (arcadePoints >= 65) league = "Silver League";
    else if (arcadePoints >= 45) league = "Bronze League";
    else league = "Novice League";
  }

  // Badges: MUST come from whole-year earned badge dataset
  const badgesList: any[] =
    calculationResult?.user?.badges ||
    calculationResult?.badges ||
    fallback.badges ||
    [];

  let totalBadges = 0;
  let skillBadges = 0;
  let gameBadges = 0;

  if (badgesList.length > 0) {
    skillBadges = badgesList.filter((b) => b.type === "skill").length;
    gameBadges = badgesList.filter(
      (b) => b.type === "game" || b.type === "trivia",
    ).length;
    totalBadges = skillBadges + gameBadges;
  } else {
    skillBadges = calculationResult?.summary?.skillBadges ?? 0;
    gameBadges =
      (calculationResult?.summary?.levelBadges ?? 0) +
      (calculationResult?.summary?.triviaBadges ?? 0);
    totalBadges =
      calculationResult?.user?.badges?.length ?? skillBadges + gameBadges;
  }

  const avatar = rawName ? rawName.charAt(0).toUpperCase() : "A";

  return {
    name: rawName,
    memberSince: `Member since ${memberSinceYear}`,
    league,
    arcadePoints,
    bonusPoints,
    totalBadges,
    skillBadges,
    gameBadges,
    highestMilestone: "Legend Tier",
    siteUrl: customSiteUrl,
    avatar,
    photoUrl: profileData.photoUrl || fallback.photoUrl,
  };
}

/**
 * Strict validator for generated card data.
 * Verifies that all required fields exist and ensures ZERO unresolved placeholders exist.
 */
export function validateLegendCardData(
  data: Partial<LegendCardData> | null | undefined,
): CardValidationResult {
  const errors: string[] = [];

  if (!data) {
    return {
      isValid: false,
      errors: ["No achievement card data provided."],
    };
  }

  // 1. Completeness checks
  if (!data.name || !data.name.trim()) {
    errors.push("User name is missing or incomplete.");
  }
  if (!data.memberSince || !data.memberSince.trim()) {
    errors.push("Member since information is missing or incomplete.");
  }
  if (!data.league || !data.league.trim()) {
    errors.push("User league is missing or incomplete.");
  }
  if (
    data.arcadePoints === undefined ||
    data.arcadePoints === null ||
    Number.isNaN(data.arcadePoints)
  ) {
    errors.push("Arcade points value is missing or invalid.");
  }
  if (
    data.bonusPoints === undefined ||
    data.bonusPoints === null ||
    Number.isNaN(data.bonusPoints)
  ) {
    errors.push("Bonus points value is missing or invalid.");
  }
  if (
    data.totalBadges === undefined ||
    data.totalBadges === null ||
    Number.isNaN(data.totalBadges)
  ) {
    errors.push("Total badges count is missing or invalid.");
  }
  if (
    data.skillBadges === undefined ||
    data.skillBadges === null ||
    Number.isNaN(data.skillBadges)
  ) {
    errors.push("Skill badges count is missing or invalid.");
  }
  if (
    data.gameBadges === undefined ||
    data.gameBadges === null ||
    Number.isNaN(data.gameBadges)
  ) {
    errors.push("Game badges count is missing or invalid.");
  }

  // 2. Strict Placeholder Check
  const bannedPlaceholders = [
    "XXX",
    "XX",
    "YYYY",
    "Your Name Here",
    "Your League Here",
    "placeholder",
  ];

  const inspectTargets: Array<{ field: string; value: string }> = [
    { field: "name", value: data.name || "" },
    { field: "memberSince", value: data.memberSince || "" },
    { field: "league", value: data.league || "" },
    { field: "arcadePoints", value: String(data.arcadePoints ?? "") },
    { field: "bonusPoints", value: String(data.bonusPoints ?? "") },
    { field: "totalBadges", value: String(data.totalBadges ?? "") },
    { field: "skillBadges", value: String(data.skillBadges ?? "") },
    { field: "gameBadges", value: String(data.gameBadges ?? "") },
    { field: "highestMilestone", value: data.highestMilestone || "" },
    { field: "siteUrl", value: data.siteUrl || "" },
  ];

  for (const target of inspectTargets) {
    const valLower = target.value.toLowerCase();
    for (const placeholder of bannedPlaceholders) {
      if (valLower.includes(placeholder.toLowerCase())) {
        errors.push(
          `Unresolved placeholder detected: "${placeholder}" in ${target.field}.`,
        );
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitizes a user name for the download PNG filename:
 * e.g. "Nihal Vimal" -> "nihal-vimal"
 * Resulting filename format: arcadeverse-legend-[sanitized-user-name].png
 */
export function getSanitizedDownloadFileName(name: string): string {
  const sanitized =
    name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "user";
  return `arcadeverse-legend-${sanitized}.png`;
}

/**
 * Formats points for display:
 * 125 -> "125"
 * 125.5 -> "125.5"
 * 125.25 -> "125.25"
 */
export function formatPoints(points: number): string {
  if (Number.isInteger(points)) {
    return points.toString();
  }
  return (Math.round(points * 100) / 100).toString();
}

/**
 * Generates personalized social share text with dynamic points and canonical URL for Legend Tier.
 */
export function generateSocialShareMessage(
  data: LegendCardData,
  platform?: "twitter" | "linkedin" | "whatsapp" | "telegram",
): string {
  const pointsStr = formatPoints(data.arcadePoints);
  const bonusStr =
    data.bonusPoints > 0 ? ` (including ${data.bonusPoints} bonus points)` : "";

  if (platform === "twitter") {
    return `🎮 I reached the Legend Tier on @ArcadeVerse!

🏆 ${pointsStr} Arcade Points${bonusStr} • ${data.totalBadges} Badges earned!

ArcadeVerse helps Google Cloud Arcade participants track points, badges, and milestones.

Check it out:
${data.siteUrl}

#GoogleCloud #GoogleCloudArcade #ArcadeVerse #CloudSkills`;
  }

  return `🎮 I reached the Legend Tier on ArcadeVerse!

🏆 ${pointsStr} Arcade Points${bonusStr}

📊 Journey Summary:
• Total Earned Badges: ${data.totalBadges} (${data.skillBadges} Skill Badges, ${data.gameBadges} Game Badges)
• League: ${data.league}

ArcadeVerse helps Google Cloud Arcade participants track their points, badges and progress.

Check it out:
${data.siteUrl}

#GoogleCloud #GoogleCloudArcade #ArcadeVerse #LegendTier #CloudSkillsBoost`;
}
