/**
 * ArcadeVerse — Sanitized Public Showcase Calculation Interface
 *
 * NOTE: This is a public architectural demonstration stub for the frontend UI.
 * Proprietary backend badge scraping, regex normalizers, cohort date boundary validators,
 * and internal pair-matching scoring formulas have been scrubbed for confidentiality.
 *
 * For the live, operational production platform, visit: https://arcadeverse.vercel.app
 */

export const CANONICAL_CALCULATION_VERSION = "2.1.0-showcase";

export const START_DATE = "2026-01-01";
export const END_DATE = "2026-12-31";

export const FACILITATOR_START_DATE = "2026-07-13T17:00:00+05:30";
export const FACILITATOR_END_DATE = "2026-09-14T23:59:59.999+05:30";

export type BadgeType = "game" | "trivia" | "skill" | "lab-free" | "unknown";

export interface FacilitatorMilestone {
  name: string;
  gameBadges: number;
  skillBadges: number;
  bonusPoints: number;
}

export const FACILITATOR_MILESTONES: FacilitatorMilestone[] = [
  { name: "Milestone 1", gameBadges: 6, skillBadges: 18, bonusPoints: 5 },
  { name: "Milestone 2", gameBadges: 8, skillBadges: 34, bonusPoints: 15 },
  { name: "Milestone 3", gameBadges: 10, skillBadges: 50, bonusPoints: 25 },
  { name: "Ultimate Milestone", gameBadges: 12, skillBadges: 66, bonusPoints: 35 },
];

/**
 * High-level badge category classifier (Presentation Stub)
 */
export function determineBadgeType(badgeName: string): BadgeType {
  const normalized = (badgeName || "").toLowerCase();
  if (normalized.includes("trivia")) return "trivia";
  if (normalized.includes("game") || normalized.includes("level")) return "game";
  if (normalized.includes("skill") || normalized.includes("challenge")) return "skill";
  return "unknown";
}

export default {
  CANONICAL_CALCULATION_VERSION,
  START_DATE,
  END_DATE,
  FACILITATOR_START_DATE,
  FACILITATOR_END_DATE,
  FACILITATOR_MILESTONES,
  determineBadgeType,
};
