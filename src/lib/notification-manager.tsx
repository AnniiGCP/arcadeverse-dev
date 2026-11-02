import { useEffect, useRef } from "react";
import { useDashboard } from "./dashboard-context";
import { useLeaderboard } from "./leaderboard-context";
import { useNotification } from "./notification-provider";

/**
 * NotificationManager - Automatically triggers notifications based on state changes
 * Place this component inside your App or Dashboard layout
 */
export const NotificationManager = () => {
  const {
    notifyNewBadge,
    notifyMilestone,
    notifySwagTier,
    notifyLeaderboardRank,
    notifyLegendCard,
    notifyExtensionAvailable,
  } = useNotification();

  const { user, badgeCategories, swagTiers } = useDashboard();
  const { leaderboard } = useLeaderboard();

  // Store previous values to detect changes
  const prevTotalBadges = useRef(user.totalBadges);
  const prevPoints = useRef(user.arcadePoints);
  const prevSwagTiers = useRef(swagTiers.filter((t) => t.isUnlocked).length);
  const prevRank = useRef(user.leaderboardRank);
  const notifiedBadges = useRef(new Set<string>());
  const notifiedMilestones = useRef(new Set<number>());
  const notifiedTiers = useRef(new Set<string>());

  // Detect new badges and notify
  useEffect(() => {
    if (
      user.totalBadges > prevTotalBadges.current &&
      prevTotalBadges.current > 0
    ) {
      // Find which category has new badges
      badgeCategories.forEach((category) => {
        if (category.completedBadges && category.completedBadges.length > 0) {
          category.completedBadges.forEach((badge) => {
            const badgeKey = `${badge.id}-${badge.title}`;
            if (!notifiedBadges.current.has(badgeKey)) {
              notifiedBadges.current.add(badgeKey);

              // Only notify if it's a genuinely new badge (after initial load)
              if (prevTotalBadges.current > 0) {
                notifyNewBadge(badge.title, category.name, badge.points);
              }
            }
          });
        }
      });
    }
    prevTotalBadges.current = user.totalBadges;
  }, [user.totalBadges, badgeCategories, notifyNewBadge]);

  // Detect milestone achievements (25, 45, 65, 75, 95 points)
  useEffect(() => {
    const milestones = [25, 45, 65, 75, 95];
    const currentPoints = user.arcadePoints;
    const previousPoints = prevPoints.current;

    // Find the highest milestone that was just crossed (not previously notified)
    let newMilestone: number | null = null;

    for (let i = milestones.length - 1; i >= 0; i--) {
      const milestone = milestones[i];
      if (
        currentPoints >= milestone &&
        !notifiedMilestones.current.has(milestone)
      ) {
        newMilestone = milestone;
        break; // Only get the highest unnotified milestone
      }
    }

    // Only notify for the current milestone reached
    if (newMilestone !== null && previousPoints < newMilestone) {
      notifiedMilestones.current.add(newMilestone);

      const milestoneNames: Record<number, string> = {
        25: "Arcade Novice",
        45: "Arcade Trooper",
        65: "Arcade Ranger",
        75: "Arcade Champion",
        95: "Arcade Legend",
      };

      notifyMilestone(
        milestoneNames[newMilestone] || `${newMilestone} Points`,
        currentPoints,
      );
    }

    prevPoints.current = currentPoints;
  }, [user.arcadePoints, notifyMilestone]);

  // Detect new swag tier unlocks
  useEffect(() => {
    const unlockedTiers = swagTiers.filter((tier) => tier.isUnlocked);

    unlockedTiers.forEach((tier) => {
      if (!notifiedTiers.current.has(tier.name) && prevSwagTiers.current > 0) {
        notifiedTiers.current.add(tier.name);
        notifySwagTier(tier.name, tier.rewards);
      }
    });

    prevSwagTiers.current = unlockedTiers.length;
  }, [swagTiers, notifySwagTier]);

  // Detect Legend Card unlock (120+ Arcade Points)
  useEffect(() => {
    if (user.arcadePoints >= 120) {
      const alreadyNotified = localStorage.getItem(
        "arcadeverse_notified_legend_card",
      );
      if (!alreadyNotified) {
        localStorage.setItem("arcadeverse_notified_legend_card", "true");
        notifyLegendCard(user.arcadePoints);
      }
    }
  }, [user.arcadePoints, notifyLegendCard]);

  // One-time announcement for official ArcadeVerse Chrome Extension
  useEffect(() => {
    const hasNotified = localStorage.getItem(
      "arcadeverse_notified_extension_v2026",
    );
    if (!hasNotified) {
      const timer = setTimeout(() => {
        localStorage.setItem("arcadeverse_notified_extension_v2026", "true");
        notifyExtensionAvailable();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [notifyExtensionAvailable]);

  return null; // This component doesn't render anything
};
