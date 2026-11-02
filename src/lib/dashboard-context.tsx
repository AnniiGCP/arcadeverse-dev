import { allAvailableBadges } from "@/data/badgeCatalog";
import { badgeService } from "@/services/badgeService";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  type CalculationResult as CalcResult,
  useCalculation,
} from "./calculation-context";
import { END_DATE, START_DATE, determineBadgeType } from "./calculationLogic";
import { useLeaderboard } from "./leaderboard-context";

interface User {
  name: string;
  avatar: string;
  photoUrl?: string;
  memberSince: string;
  league: string;
  arcadePoints: number;
  leaderboardRank: number;
  totalBadges: number;
  milestonePoints?: number;
  skillsPoints?: number;
}

interface SwagTier {
  name: string;
  pointsRequired: number;
  currentPoints: number;
  rewards: string[];
  isUnlocked: boolean;
  image?: string;
}

interface BadgeCategory {
  name: string;
  icon: React.ComponentType<any>;
  badges: number;
  points: number;
  color: string;
  completedBadges?: IncompleteBadge[]; // Array of completed badge details
}

interface IncompleteBadge {
  id: string;
  title: string;
  category: string;
  difficulty:
    | "Introductory"
    | "Intermediate"
    | "Advanced"
    | "Special"
    | "Base Camp"
    | "Certification"
    | "Level 1"
    | "Level 2"
    | "Level 3"
    | "Trivia"
    | "Adventure"
    | "Voyage"
    | "Trail"
    | "Sprint"
    | "Sprint 1"
    | "Sprint 2"
    | "Sprint 3"
    | "Sprint 4";
  labsRequired: number;
  points: number;
  image: string;
  level?: string;
  url?: string;
  accessCode?: string;
  deadline?: string;
}

interface WeeklyData {
  day: string;
  points: number;
}

export interface RefreshDiff {
  pointsEarned: number;
  badgesEarned: number;
}

export type DashboardRefreshStatus =
  | "idle"
  | "refreshing"
  | "success"
  | "error";

interface DashboardContextType {
  user: User;
  swagTiers: SwagTier[];
  badgeCategories: BadgeCategory[];
  incompleteBadges: IncompleteBadge[];
  weeklyProgress: WeeklyData[];
  lastCalculations: CalcResult[];
  totalPointsThisSeason: number;
  isLoading: boolean;
  refreshData: () => void;
  onStartChallenge: (badgeId: string) => void;
  onCategoryClick: (category: string) => void;
  onViewFullReport: () => void;
  isFacilitator: boolean;
  setIsFacilitator: (isFacilitator: boolean) => void;
  updateUserPoints?: (points: number) => void;
  // Session & Freshness State
  refreshStatus: DashboardRefreshStatus;
  refreshMessage: string;
  refreshError: string | null;
  refreshDiff: RefreshDiff | null;
  dismissToast: () => void;
  lastScannedAt: Date | null;
  triggerManualRefresh: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    // Return a safe default instead of throwing to avoid runtime crashes
    // when components that expect the dashboard render outside the provider
    // (e.g. header on non-dashboard routes).

    const defaultUser: User = {
      name: "Guest",
      avatar: "G",
      photoUrl: "",
      memberSince: "",
      league: "",
      arcadePoints: 0,
      leaderboardRank: 0,
      totalBadges: 0,
      milestonePoints: 0,
    };

    const defaultValue: DashboardContextType = {
      user: defaultUser,
      swagTiers: [],
      badgeCategories: [],
      incompleteBadges: [],
      weeklyProgress: [],
      lastCalculations: [],
      totalPointsThisSeason: 0,
      isLoading: false,
      refreshData: () => {},
      onStartChallenge: () => {},
      onCategoryClick: () => {},
      onViewFullReport: () => {},
      isFacilitator: true,
      setIsFacilitator: () => {},
      updateUserPoints: () => {},
      refreshStatus: "idle",
      refreshMessage: "",
      refreshError: null,
      refreshDiff: null,
      dismissToast: () => {},
      lastScannedAt: null,
      triggerManualRefresh: async () => {},
    };

    return defaultValue;
  }
  return context;
};

// Optional hook that returns the dashboard context or undefined when used
// outside of a DashboardProvider. This is useful for UI components that
// may be rendered both inside and outside the dashboard (eg. header).
export const useOptionalDashboard = () => {
  return useContext(DashboardContext);
};

interface DashboardProviderProps {
  children: React.ReactNode;
}

const getBadgeCategories = (
  calculationResponse: CalcResult | null,
  allBadges: IncompleteBadge[],
): BadgeCategory[] => {
  const allCategories: BadgeCategory[] = [
    {
      name: "Skill Badges",
      icon: () => null,
      badges: 0,
      points: 0,
      color: "bg-blue-500",
      completedBadges: [],
    },
    {
      name: "Base Camp Badges",
      icon: () => null,
      badges: 0,
      points: 0,
      color: "bg-purple-500",
      completedBadges: [],
    },
    {
      name: "Level Badges",
      icon: () => null,
      badges: 0,
      points: 0,
      color: "bg-purple-500",
      completedBadges: [],
    },
    {
      name: "Certification Badges",
      icon: () => null,
      badges: 0,
      points: 0,
      color: "bg-purple-500",
      completedBadges: [],
    },
    {
      name: "Special Badges",
      icon: () => null,
      badges: 0,
      points: 0,
      color: "bg-purple-500",
      completedBadges: [],
    },
    {
      name: "Trivia Badges",
      icon: () => null,
      badges: 0,
      points: 0,
      color: "bg-indigo-500",
      completedBadges: [],
    },
    {
      name: "Work Meets Play",
      icon: () => null,
      badges: 0,
      points: 0,
      color: "bg-yellow-500",
      completedBadges: [],
    },
    {
      name: "Unknown Badges",
      icon: () => null,
      badges: 0,
      points: 0,
      color: "bg-gray-500",
      completedBadges: [],
    },
  ];

  if (!calculationResponse) {
    return allCategories;
  }

  // Handle both old and new response formats
  // Old format: { badges: [], points: {} }
  // New format: { user: { badges: [] }, breakdown: {}, summary: {} }
  const badgesArray =
    (calculationResponse as any).user?.badges ||
    (calculationResponse as any).badges;

  if (!badgesArray || badgesArray.length === 0) {
    return allCategories;
  }

  const categoryMap = new Map<string, BadgeCategory>();
  allCategories.forEach((cat) => categoryMap.set(cat.name, { ...cat }));

  // Helper months array used for parsing month names and for earnedDate fallback
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  // Filter badges strictly within 2026 event timeframe (6 Jan 2026 to tentative 31 Dec 2026)
  const filteredBadges = badgesArray.filter((badge: any) => {
    if (!badge.earnedDate) return false;
    try {
      const earnedDate = new Date(badge.earnedDate);
      return (
        !Number.isNaN(earnedDate.getTime()) &&
        earnedDate >= START_DATE &&
        earnedDate <= END_DATE
      );
    } catch (e) {
      return false;
    }
  });

  filteredBadges.forEach((badge: any, index: number) => {
    // Derive month from earnedDate if available so we can match month-specific badges
    let earnedMonthName: string | undefined = undefined;
    try {
      if (badge.earnedDate) {
        const d = new Date(badge.earnedDate);
        if (!isNaN(d.getTime())) {
          earnedMonthName = months[d.getMonth()];
        }
      }
    } catch (e) {
      // ignore parse errors
    }
    // Use the server's classification instead of re-determining it
    const type = badge.type || "completion";

    let categoryName = "";
    switch (type) {
      case "skill":
        // Check if this is actually a special badge misclassified as skill
        const lowerBadgeName = badge.name.toLowerCase();

        if (
          lowerBadgeName.includes("extraskillestrial") ||
          lowerBadgeName.includes("extraskillestrail") ||
          lowerBadgeName.includes("skills scribble") ||
          lowerBadgeName.includes("futureready skills") ||
          lowerBadgeName.includes("arcade futureready") ||
          lowerBadgeName.includes("diwali dialogues") ||
          lowerBadgeName.includes("lights & logic") ||
          lowerBadgeName.includes("lights and logic")
        ) {
          // These are special game badges, handle them separately
          const matchingBadge = allBadges.find((b) => {
            if (b.category !== "Game" || b.difficulty !== "Special")
              return false;
            const cleanTitle = b.title.toLowerCase().trim();
            const cleanBadge = lowerBadgeName.trim();

            // Check for various patterns
            if (
              cleanBadge.includes("extraskillestrial") ||
              cleanBadge.includes("extraskillestrail")
            ) {
              return (
                cleanTitle.includes("extraskillestrial") ||
                cleanTitle.includes("extraskillestrail")
              );
            }
            if (cleanBadge.includes("skills scribble")) {
              return cleanTitle.includes("skills scribble");
            }
            if (
              cleanBadge.includes("futureready") ||
              cleanBadge.includes("future ready")
            ) {
              return (
                cleanTitle.includes("futureready") ||
                cleanTitle.includes("future ready")
              );
            }
            if (cleanBadge.includes("diwali dialogues")) {
              return cleanTitle.includes("diwali dialogues");
            }
            if (
              cleanBadge.includes("lights & logic") ||
              cleanBadge.includes("lights and logic")
            ) {
              return (
                cleanTitle.includes("lights & logic") ||
                cleanTitle.includes("lights and logic")
              );
            }
            return false;
          });

          if (matchingBadge) {
            const specialCategory = categoryMap.get("Special Badges");
            if (specialCategory) {
              specialCategory.badges += 1;
              if (specialCategory.completedBadges) {
                specialCategory.completedBadges.push(matchingBadge);
              }
            }
          } else {
          }
          return; // Skip rest of processing
        }
        categoryName = "Skill Badges";
        break;
      case "trivia":
        categoryName = "Trivia Badges";
        break;
      case "completion":
        // Check if this is actually a special badge misclassified as completion
        const lowerCompletionName = badge.name.toLowerCase();
        if (
          lowerCompletionName.includes("extraskillestrial") ||
          lowerCompletionName.includes("extraskillestrail") ||
          lowerCompletionName.includes("skills scribble") ||
          lowerCompletionName.includes("futureready skills") ||
          lowerCompletionName.includes("future ready skills") ||
          lowerCompletionName.includes("diwali dialogues") ||
          lowerCompletionName.includes("lights & logic") ||
          lowerCompletionName.includes("lights and logic")
        ) {
          // These are special game badges, handle them separately
          const matchingBadge = allBadges.find((b) => {
            if (b.category !== "Game" || b.difficulty !== "Special")
              return false;
            const cleanTitle = b.title.toLowerCase().trim();

            if (
              lowerCompletionName.includes("extraskillestrial") ||
              lowerCompletionName.includes("extraskillestrail")
            ) {
              return (
                cleanTitle.includes("extraskillestrial") ||
                cleanTitle.includes("extraskillestrail")
              );
            }
            if (lowerCompletionName.includes("skills scribble")) {
              return cleanTitle.includes("skills scribble");
            }
            if (
              lowerCompletionName.includes("futureready") ||
              lowerCompletionName.includes("future ready")
            ) {
              return (
                cleanTitle.includes("futureready") ||
                cleanTitle.includes("future ready")
              );
            }
            if (lowerCompletionName.includes("diwali dialogues")) {
              return cleanTitle.includes("diwali dialogues");
            }
            if (
              lowerCompletionName.includes("lights & logic") ||
              lowerCompletionName.includes("lights and logic")
            ) {
              return (
                cleanTitle.includes("lights & logic") ||
                cleanTitle.includes("lights and logic")
              );
            }
            return false;
          });

          if (matchingBadge) {
            const specialCategory = categoryMap.get("Special Badges");
            if (specialCategory) {
              specialCategory.badges += 1;
              if (specialCategory.completedBadges) {
                specialCategory.completedBadges.push(matchingBadge);
              }
            }
          } else {
          }
          return; // Skip rest of processing
        }
        categoryName = "Unknown Badges";
        break;
      case "game":
        // Game badges need to be categorized based on their name
        // We'll handle them below after matching with allBadges
        categoryName = "";
        break;
      default:
        categoryName = "Unknown Badges";
        break;
    }

    // For game badges, we need to find the matching badge first to determine category
    if (type === "game") {
      const cleanBadgeName = badge.name
        .toLowerCase()
        .trim()
        .replace(/^skills boost\s+/i, "");

      // Try to match by keywords first (more flexible)
      const matchingBadge = allBadges.find((b) => {
        if (b.category !== "Game") return false;
        const cleanTitle = b.title.toLowerCase().trim();

        // Special badge matching - look for specific keywords
        if (b.difficulty === "Special") {
          // Check for specific special badge patterns
          if (
            cleanBadgeName.includes("ai assured") &&
            cleanTitle.includes("ai assured")
          )
            return true;
          if (
            cleanBadgeName.includes("scaling success") &&
            cleanTitle.includes("scaling success")
          )
            return true;
          if (
            cleanBadgeName.includes("faster finance") &&
            cleanTitle.includes("faster finance")
          )
            return true;
          if (
            cleanBadgeName.includes("banking with empathy") &&
            cleanTitle.includes("banking with empathy")
          )
            return true;
          if (
            cleanBadgeName.includes("skills scribble") &&
            cleanTitle.includes("skills scribble")
          )
            return true;
          if (
            cleanBadgeName.includes("work meets play") &&
            cleanTitle.includes("work meets play")
          )
            return true;
          if (
            (cleanBadgeName.includes("futureready") ||
              cleanBadgeName.includes("future ready")) &&
            (cleanTitle.includes("futureready") ||
              cleanTitle.includes("future ready"))
          )
            return true;
          if (
            cleanBadgeName.includes("diwali") &&
            cleanTitle.includes("diwali")
          )
            return true;
          if (
            cleanBadgeName.includes("lights") &&
            cleanBadgeName.includes("logic") &&
            cleanTitle.includes("lights") &&
            cleanTitle.includes("logic")
          )
            return true;
        }

        // Extract month/year if present
        const badgeMonth = months.find((m) => cleanBadgeName.includes(m));
        const titleMonth = months.find((m) => cleanTitle.includes(m));
        // If the badge name does not include a month, prefer the earnedDate month (if available)
        const effectiveBadgeMonth = badgeMonth || earnedMonthName;

        // Check for Level badges (Level 1, Level 2, Level 3)
        if (
          cleanBadgeName.includes("level 1") &&
          cleanTitle.includes("level 1")
        ) {
          if (
            !effectiveBadgeMonth ||
            !titleMonth ||
            effectiveBadgeMonth === titleMonth
          ) {
            return true;
          }
        }
        if (
          cleanBadgeName.includes("level 2") &&
          cleanTitle.includes("level 2")
        ) {
          if (
            !effectiveBadgeMonth ||
            !titleMonth ||
            effectiveBadgeMonth === titleMonth
          ) {
            return true;
          }
        }
        if (
          cleanBadgeName.includes("level 3") &&
          cleanTitle.includes("level 3")
        ) {
          if (
            !effectiveBadgeMonth ||
            !titleMonth ||
            effectiveBadgeMonth === titleMonth
          ) {
            return true;
          }
        }

        // Check for Base Camp
        if (
          cleanBadgeName.includes("base camp") &&
          cleanTitle.includes("base camp")
        ) {
          if (
            !effectiveBadgeMonth ||
            !titleMonth ||
            effectiveBadgeMonth === titleMonth
          ) {
            return true;
          }
        }

        // Check for Certification Zone
        if (
          cleanBadgeName.includes("certification") &&
          cleanTitle.includes("certification")
        ) {
          if (
            !effectiveBadgeMonth ||
            !titleMonth ||
            effectiveBadgeMonth === titleMonth
          ) {
            return true;
          }
        }

        // Check for Trivia (weekly)
        if (cleanBadgeName.includes("trivia")) {
          const weekMatch = cleanBadgeName.match(/week\s*(\d)/i);
          const titleWeekMatch = cleanTitle.match(/week\s*(\d)/i);
          if (
            weekMatch &&
            titleWeekMatch &&
            weekMatch[1] === titleWeekMatch[1]
          ) {
            if (
              !effectiveBadgeMonth ||
              !titleMonth ||
              effectiveBadgeMonth === titleMonth
            ) {
              return true;
            }
          }
        }

        // Fallback: try exact or contains match
        if (
          cleanTitle === cleanBadgeName ||
          cleanBadgeName.includes(cleanTitle) ||
          cleanTitle.includes(cleanBadgeName)
        ) {
          return true;
        }

        return false;
      });

      if (matchingBadge) {
        // Determine category based on level/difficulty
        if (matchingBadge.level && matchingBadge.level.includes("Level")) {
          categoryName = "Level Badges";
        } else if (
          matchingBadge.level &&
          matchingBadge.level.includes("Base Camp")
        ) {
          categoryName = "Base Camp Badges";
        } else if (
          matchingBadge.level &&
          matchingBadge.level.includes("Certification")
        ) {
          categoryName = "Certification Badges";
        } else if (matchingBadge.difficulty === "Special") {
          categoryName = "Special Badges";
        }

        if (categoryName) {
          const category = categoryMap.get(categoryName);
          if (category) {
            category.badges += 1;
            if (category.completedBadges) {
              category.completedBadges.push(matchingBadge);
            }
          }
        }
      }
      return; // Skip rest of the processing for game badges
    }

    if (!categoryName) return;

    const category = categoryMap.get(categoryName);

    if (category) {
      category.badges += 1;

      // Match badges from allBadges and add to completedBadges
      if (
        categoryName === "Skill Badges" ||
        categoryName === "Trivia Badges" ||
        categoryName === "Lab Free Badges"
      ) {
        // Find matching badge from allBadges and add to completedBadges
        // Clean the badge name for better matching
        const cleanBadgeName = badge.name.toLowerCase().trim();

        const matchingBadge = allBadges.find((b) => {
          // For lab-free, check if category matches
          if (categoryName === "Lab Free Badges" && b.category !== "Lab-Free")
            return false;
          if (categoryName === "Skill Badges" && b.category !== "Skill")
            return false;
          if (categoryName === "Trivia Badges" && b.category !== "Trivia")
            return false;

          const cleanTitle = b.title.toLowerCase().trim();
          // Try exact match first
          if (cleanTitle === cleanBadgeName) return true;
          // Try if one contains the other
          if (
            cleanBadgeName.includes(cleanTitle) ||
            cleanTitle.includes(cleanBadgeName)
          )
            return true;
          // Try without common prefixes
          const badgeNameWithoutPrefix = cleanBadgeName.replace(
            /^(skills boost\s+|skill badge\s+)/i,
            "",
          );
          if (
            cleanTitle === badgeNameWithoutPrefix ||
            badgeNameWithoutPrefix.includes(cleanTitle)
          )
            return true;
          return false;
        });

        if (matchingBadge && category.completedBadges) {
          category.completedBadges.push(matchingBadge);
        } else {
        }
      }
    }
  });

  // Calculate points based on actual badge points values
  // Skill badges: Always 0.5 points each (fixed)
  const skillCategory = categoryMap.get("Skill Badges");
  if (skillCategory) {
    skillCategory.points = skillCategory.badges * 0.5;
  }

  // Game/Trivia badges: Sum up the actual points from completed badges
  const baseCampCategory = categoryMap.get("Base Camp Badges");
  if (baseCampCategory && baseCampCategory.completedBadges) {
    baseCampCategory.points = baseCampCategory.completedBadges.reduce(
      (sum, badge) => sum + (badge.points || 0),
      0,
    );
  }

  const levelCategory = categoryMap.get("Level Badges");
  if (levelCategory && levelCategory.completedBadges) {
    levelCategory.points = levelCategory.completedBadges.reduce(
      (sum, badge) => sum + (badge.points || 0),
      0,
    );
  }

  const certificationCategory = categoryMap.get("Certification Badges");
  if (certificationCategory && certificationCategory.completedBadges) {
    certificationCategory.points = certificationCategory.completedBadges.reduce(
      (sum, badge) => sum + (badge.points || 0),
      0,
    );
  }

  const specialCategory = categoryMap.get("Special Badges");
  if (specialCategory && specialCategory.completedBadges) {
    specialCategory.points = specialCategory.completedBadges.reduce(
      (sum, badge) => sum + (badge.points || 0),
      0,
    );
  }

  const triviaCategory = categoryMap.get("Trivia Badges");
  if (triviaCategory && triviaCategory.completedBadges) {
    triviaCategory.points = triviaCategory.completedBadges.reduce(
      (sum, badge) => sum + (badge.points || 0),
      0,
    );
  }

  const workMeetsPlayCategory = categoryMap.get("Work Meets Play");
  if (workMeetsPlayCategory) {
    workMeetsPlayCategory.points = 0; // Will show as "NaN" per screenshot
  }

  const unknownCategory = categoryMap.get("Unknown Badges");
  if (unknownCategory) {
    unknownCategory.points = 0; // Will show as "—" per screenshot
  }

  return Array.from(categoryMap.values());

  return Array.from(categoryMap.values());
};

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
}) => {
  const { calculationResult, setCalculationResult, profileUrl } =
    useCalculation();
  const { leaderboard, updateLeaderboardEntry } = useLeaderboard();

  const [isFacilitator, setIsFacilitator] = useState(true); // Default to true (Yes)

  // Don't recalculate - just toggle the display
  const handleSetIsFacilitator = (facilitator: boolean) => {
    setIsFacilitator(facilitator);
  };

  const [isLoading, setIsLoading] = useState(true);

  // Use ref to store calculation data so it never resets
  const calculationDataRef = useRef<{
    totalPoints: number;
    milestonePoints: number;
    totalBadges: number;
  }>({
    totalPoints: 0,
    milestonePoints: 0,
    totalBadges: 0,
  });

  // Track the signature of the last leaderboard sync to prevent infinite loops and duplicate writes
  const lastLeaderboardSyncRef = useRef<string>("");

  // Helper function to determine league based on points
  const getLeagueFromPoints = (points: number): string => {
    if (points >= 95) return "Diamond League";
    if (points >= 75) return "Gold League";
    if (points >= 65) return "Silver League";
    if (points >= 45) return "Bronze League";
    if (points >= 25) return "Novice League";
    return "Unknown League";
  };

  // Initialize user immediately from active profile in localStorage to eliminate load lag
  const [user, setUser] = useState<User>(() => {
    try {
      if (typeof window !== "undefined") {
        const activeId = localStorage.getItem("arcadeverse_current_profile_id");
        const raw = localStorage.getItem("arcadeverse_profiles");
        if (raw) {
          const profiles = JSON.parse(raw);
          const active =
            profiles.find((p: any) => p.id === activeId) || profiles[0];
          if (active) {
            const league =
              active.league ||
              active.calculationData?.profileData?.league ||
              (active.points
                ? getLeagueFromPoints(active.points)
                : "Silver League");
            return {
              name: active.name || "",
              avatar:
                active.avatar || (active.name ? active.name.charAt(0) : "U"),
              photoUrl: active.photoUrl || "",
              memberSince: active.memberSince || "",
              league: league || "Silver",
              arcadePoints: active.points || 0,
              leaderboardRank: active.rank || 0,
              totalBadges: active.totalBadges || active.badges || 0,
              milestonePoints: active.bonusPoints || 0,
            };
          }
        }
      }
    } catch {}
    return {
      name: "",
      avatar: "",
      photoUrl: "",
      memberSince: "",
      league: "",
      arcadePoints: 0,
      leaderboardRank: 0,
      totalBadges: 0,
      milestonePoints: 0,
    };
  });

  const [swagTiers, setSwagTiers] = useState<SwagTier[]>([
    {
      name: "Arcade Novice",
      pointsRequired: 25,
      currentPoints: 0,
      rewards: ["Arcade Controller"],
      isUnlocked: false,
      image: "/images/swag/novice.png",
    },
    {
      name: "Arcade Trooper",
      pointsRequired: 50,
      currentPoints: 0,
      rewards: ["Premium Arcade Controller"],
      isUnlocked: false,
      image: "/images/swag/trooper.png",
    },
    {
      name: "Arcade Ranger",
      pointsRequired: 75,
      currentPoints: 0,
      rewards: ["Google Cloud Pen", "Colorful Pen"],
      isUnlocked: false,
      image: "/images/swag/ranger.png",
    },
    {
      name: "Arcade Champion",
      pointsRequired: 95,
      currentPoints: 0,
      rewards: [
        "Google Cloud Hoodie",
        "Black Pen",
        "Colorful Pen",
        "USB Cable",
      ],
      isUnlocked: false,
      image: "/images/swag/champion.png",
    },
    {
      name: "Arcade Legend",
      pointsRequired: 120,
      currentPoints: 0,
      rewards: [
        "Google Cloud Hoodie",
        "Black Pen",
        "Colorful Pen",
        "USB Cable",
      ],
      isUnlocked: false,
      image: "/images/swag/legend.png",
    },
  ]);
  const [badgeCategories, setBadgeCategories] = useState<BadgeCategory[]>(
    getBadgeCategories(null, []),
  );

  // Set initial loading to false after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Separate effect for initial data loading
  useEffect(() => {
    if (calculationResult) {
      const totalPoints =
        calculationResult.summary?.totalPoints ||
        calculationResult.user?.points ||
        0;
      const milestonePoints = calculationResult.summary?.milestonePoints || 0;
      const totalBadges = calculationResult.user?.badges?.length || 0;

      // Store in ref so it never resets
      calculationDataRef.current = {
        totalPoints,
        milestonePoints,
        totalBadges,
      };

      const profileData =
        (calculationResult.profileData as
          | {
              name?: string;
              memberSince?: string;
              photoUrl?: string;
              league?: string;
              skillsPoints?: number;
            }
          | undefined) || (calculationResult.user as any);

      // Prefer dynamic league scraped from Google Skills profile
      const league =
        profileData?.league ||
        (totalPoints > 0 ? getLeagueFromPoints(totalPoints) : "");

      // Find user's rank from leaderboard
      const targetUrl =
        profileUrl ||
        (calculationResult as any)?.profileUrl ||
        (calculationResult as any)?.url ||
        "";
      const userEntry = leaderboard.find(
        (entry) => targetUrl && entry.profileUrl === targetUrl,
      );
      const rank = userEntry?.rank || 0;

      setUser((prevUser) => ({
        ...prevUser,
        name: profileData?.name || prevUser.name,
        memberSince: profileData?.memberSince || prevUser.memberSince,
        photoUrl: profileData?.photoUrl || prevUser.photoUrl,
        avatar: profileData?.name?.charAt(0).toUpperCase() || prevUser.avatar,
        league: league || prevUser.league,
        arcadePoints: totalPoints,
        totalBadges: totalBadges,
        milestonePoints: milestonePoints,
        leaderboardRank: rank,
        skillsPoints: profileData?.skillsPoints,
      }));

      // Get all available badges (defined below in component)
      setWeeklyProgress(calculateWeeklyProgress(calculationResult as any));
    }
  }, [profileUrl, calculationResult, leaderboard]);

  // Dedicated leaderboard synchronization effect:
  // Runs ONLY when profileUrl or calculationResult points change.
  // CRITICAL: Does NOT depend on `leaderboard` to prevent circular re-trigger loops!
  useEffect(() => {
    if (!calculationResult || !profileUrl) return;

    const profileData =
      (calculationResult.profileData as
        | {
            name?: string;
            photoUrl?: string;
          }
        | undefined) || (calculationResult.user as any);

    const name = profileData?.name?.trim();
    if (!name) return;

    const totalPoints =
      calculationResult.summary?.totalPoints ||
      calculationResult.user?.points ||
      0;
    const totalBadges = calculationResult.user?.badges?.length || 0;
    const photoUrl = profileData?.photoUrl || "";

    const syncSignature = `${profileUrl.toLowerCase()}:${name.toLowerCase()}:${totalPoints}:${totalBadges}:${photoUrl}`;
    const storedLastSync =
      typeof window !== "undefined"
        ? sessionStorage.getItem("arcadeverse_last_leaderboard_sync")
        : null;

    if (
      storedLastSync === syncSignature ||
      lastLeaderboardSyncRef.current === syncSignature
    ) {
      return; // Already synced this exact calculation state
    }
    lastLeaderboardSyncRef.current = syncSignature;
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "arcadeverse_last_leaderboard_sync",
          syncSignature,
        );
      }
    } catch {}

    updateLeaderboardEntry({
      profileUrl: profileUrl,
      name: name,
      calculationResponse: calculationResult as any,
    } as any);
  }, [profileUrl, calculationResult, updateLeaderboardEntry]);

  // Update swag tiers when facilitator toggle changes
  useEffect(() => {
    const { totalPoints, milestonePoints } = calculationDataRef.current;

    if (totalPoints > 0) {
      const basePoints = totalPoints - milestonePoints;
      const pointsForTiers = isFacilitator ? totalPoints : basePoints;

      // Calculate league based on points
      const league = getLeagueFromPoints(pointsForTiers);

      setSwagTiers([
        {
          name: "Arcade Novice",
          pointsRequired: 25,
          currentPoints: pointsForTiers,
          rewards: ["Arcade Controller"],
          isUnlocked: pointsForTiers >= 25,
          image: "/images/swag/novice.png",
        },
        {
          name: "Arcade Trooper",
          pointsRequired: 50,
          currentPoints: pointsForTiers,
          rewards: ["Premium Arcade Controller"],
          isUnlocked: pointsForTiers >= 50,
          image: "/images/swag/trooper.png",
        },
        {
          name: "Arcade Ranger",
          pointsRequired: 75,
          currentPoints: pointsForTiers,
          rewards: ["Google Cloud Pen", "Colorful Pen"],
          isUnlocked: pointsForTiers >= 75,
          image: "/images/swag/ranger.png",
        },
        {
          name: "Arcade Champion",
          pointsRequired: 95,
          currentPoints: pointsForTiers,
          rewards: [
            "Google Cloud Hoodie",
            "Black Pen",
            "Colorful Pen",
            "USB Cable",
          ],
          isUnlocked: pointsForTiers >= 95,
          image: "/images/swag/champion.png",
        },
        {
          name: "Arcade Legend",
          pointsRequired: 120,
          currentPoints: pointsForTiers,
          rewards: [
            "Google Cloud Hoodie",
            "Black Pen",
            "Colorful Pen",
            "USB Cable",
          ],
          isUnlocked: pointsForTiers >= 120,
          image: "/images/swag/legend.png",
        },
      ]);

      // Also update user state to reflect current view
      setUser((prevUser) => ({
        ...prevUser,
        league: prevUser.league || league,
        arcadePoints: totalPoints,
        milestonePoints: milestonePoints,
        totalBadges: calculationDataRef.current.totalBadges,
      }));
    }
  }, [isFacilitator]);

  // Skill badges imported from @/data/badgeCatalog

  // Lab-Free Courses removed
  const allLabFreeCourses: IncompleteBadge[] = [];

  // Trivia and Game badges data
  const allTriviaAndGameBadges: IncompleteBadge[] = [
    // January 2026
    {
      id: "g1-jan",
      title: "Arcade Work- Life Refresh",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 2,
      image: "https://services.google.com/fh/files/misc/arcade-wlr-26.png",
      level: "Special",
    },
    {
      id: "g2-jan",
      title: "Arcade A Cloud That Cares",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 0,
      image: "https://services.google.com/fh/files/misc/arcade-wmp-26.png",
      level: "Special",
    },
    {
      id: "g3-jan",
      title: "Arcade Base Camp January 2026",
      category: "Game",
      difficulty: "Base Camp",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-bc-26.png",
      level: "Base Camp",
    },
    {
      id: "g4-jan",
      title: "Arcade Certification Zone January 2026",
      category: "Game",
      difficulty: "Certification",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-cert-26.png",
      level: "Certification",
    },
    {
      id: "g5-jan",
      title: "Level 1: January 2026",
      category: "Game",
      difficulty: "Level 1",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-l1-26.png",
      level: "Level 1",
    },
    {
      id: "g6-jan",
      title: "Level 2: January 2026",
      category: "Game",
      difficulty: "Level 2",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-l2.png",
      level: "Level 2",
    },
    {
      id: "g7-jan",
      title: "Level 3: January 2026",
      category: "Game",
      difficulty: "Level 3",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-l3-26.png",
      level: "Level 3",
    },
    {
      id: "t1-jan",
      title: "Week 1: January 2026",
      category: "Trivia",
      difficulty: "Trivia",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-week1.png",
      level: "Weekly",
    },
    {
      id: "t2-jan",
      title: "Week 2: January 2026",
      category: "Trivia",
      difficulty: "Trivia",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-week2.png",
      level: "Weekly",
    },
    {
      id: "t3-jan",
      title: "Week 3: January 2026",
      category: "Trivia",
      difficulty: "Trivia",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-w3-26.png",
      level: "Weekly",
    },
    {
      id: "t4-jan",
      title: "Week 4: January 2026",
      category: "Trivia",
      difficulty: "Trivia",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-trivia-w4.png",
      level: "Weekly",
    },
    {
      id: "g8-jan",
      title: "Arcade From Foundation to Wonders",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 3,
      image: "https://services.google.com/fh/files/misc/valbadge1.png",
      level: "Special",
    },
    {
      id: "g9-jan",
      title: "Arcade Skills At the Pitch",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 3,
      image: "https://services.google.com/fh/files/misc/valbadge2.png",
      level: "Special",
    },

    // February 2026
    {
      id: "g1-feb",
      title: "Arcade Journey Made Easy",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 0,
      image:
        "https://services.google.com/fh/files/misc/arcade-wmp-febbadge.png",
      level: "Special",
    },
    {
      id: "g2-feb",
      title: "Arcade Base Camp February 2026",
      category: "Game",
      difficulty: "Base Camp",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/ard-bc-febbadge.png",
      level: "Base Camp",
    },
    {
      id: "g3-feb",
      title: "Arcade Certification Zone February 2026",
      category: "Game",
      difficulty: "Certification",
      labsRequired: 0,
      points: 1,
      image:
        "https://services.google.com/fh/files/misc/arcade-cert-febbadge.png",
      level: "Certification",
    },
    {
      id: "g4-feb",
      title: "Arcade Adventure: February 2026",
      category: "Game",
      difficulty: "Adventure",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcadvfebbadge.png",
      level: "Adventure",
    },
    {
      id: "g5-feb",
      title: "Arcade Voyage: February 2026",
      category: "Game",
      difficulty: "Voyage",
      labsRequired: 0,
      points: 1,
      image:
        "https://services.google.com/fh/files/misc/arcade-voyge-febbadge.png",
      level: "Voyage",
    },
    {
      id: "g6-feb",
      title: "Arcade Trail: February 2026",
      category: "Game",
      difficulty: "Trail",
      labsRequired: 0,
      points: 1,
      image:
        "https://services.google.com/fh/files/misc/arcade-feb-trail-badge.png",
      level: "Trail",
    },
    {
      id: "g7-feb",
      title: "Sprint 1: February 2026",
      category: "Game",
      difficulty: "Sprint 1",
      labsRequired: 0,
      points: 1,
      image:
        "https://services.google.com/fh/files/misc/arcade-sprint1badge.png",
      level: "Sprint 1",
    },
    {
      id: "g8-feb",
      title: "Sprint 2: February 2026",
      category: "Game",
      difficulty: "Sprint 2",
      labsRequired: 0,
      points: 1,
      image:
        "https://services.google.com/fh/files/misc/arcade-feb-sprint2badge.png",
      level: "Sprint 2",
    },
    {
      id: "g9-feb",
      title: "Sprint 3: February 2026",
      category: "Game",
      difficulty: "Sprint 3",
      labsRequired: 0,
      points: 1,
      image:
        "https://services.google.com/fh/files/misc/arcade-feb-sprintbadge3.png",
      level: "Sprint 3",
    },
    {
      id: "g10-feb",
      title: "Sprint 4: February 2026",
      category: "Game",
      difficulty: "Sprint 4",
      labsRequired: 0,
      points: 1,
      image:
        "https://services.google.com/fh/files/misc/arcade-sprint4-febbadge.png",
      level: "Sprint 4",
    },

    // March 2026
    {
      id: "g1-mar",
      title: "Arcade Holi-Istic Infrastrectures",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 2,
      image: "https://services.google.com/fh/files/misc/arcade_spe_mar.png",
      level: "Special",
    },
    {
      id: "g2-mar",
      title: "Arcade Matrics in Motion",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 0,
      image: "https://services.google.com/fh/files/misc/wmp_mar.png",
      level: "Special",
    },
    {
      id: "g3-mar",
      title: "Arcade Base Camp March 2026",
      category: "Game",
      difficulty: "Base Camp",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade_bc_mar.png",
      level: "Base Camp",
    },
    {
      id: "g4-mar",
      title: "Arcade Adventure: March 2026",
      category: "Game",
      difficulty: "Adventure",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade_adv_mar.png",
      level: "Adventure",
    },
    {
      id: "g5-mar",
      title: "Arcade Voyage: March 2026",
      category: "Game",
      difficulty: "Voyage",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade_voy_mar.png",
      level: "Voyage",
    },
    {
      id: "g6-mar",
      title: "Arcade Trail: March 2026",
      category: "Game",
      difficulty: "Trail",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade_trail_mar.png",
      level: "Trail",
    },
    {
      id: "g7-mar",
      title: "Sprint 1: March 2026",
      category: "Game",
      difficulty: "Sprint 1",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade_sprint1_mar.png",
      level: "Sprint 1",
    },
    {
      id: "g8-mar",
      title: "Sprint 2: March 2026",
      category: "Game",
      difficulty: "Sprint 2",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade_sprint_2.png",
      level: "Sprint 2",
    },
    {
      id: "g9-mar",
      title: "Sprint 3: March 2026",
      category: "Game",
      difficulty: "Sprint 3",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade_sprint_3.png",
      level: "Sprint 3",
    },
    {
      id: "g10-mar",
      title: "Sprint 4: March 2026",
      category: "Game",
      difficulty: "Sprint 4",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade_sprint_4.png",
      level: "Sprint 4",
    },

    // April 2026
    {
      id: "g1-apr",
      title: "Arcade Dialogue Design",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/special-game.png",
      level: "Special",
    },
    {
      id: "g2-apr",
      title: "Arcade Skills Spawn",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 0,
      image: "https://services.google.com/fh/files/misc/arc-wmp.png",
      level: "Special",
    },
    {
      id: "g3-apr",
      title: "Arcade Base Camp April 2026",
      category: "Game",
      difficulty: "Base Camp",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arc-bc.png",
      level: "Base Camp",
    },
    {
      id: "g4-apr",
      title: "Arcade Adventure: April 2026",
      category: "Game",
      difficulty: "Adventure",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arc-adv.png",
      level: "Adventure",
    },
    {
      id: "g5-apr",
      title: "Arcade Voyage: April 2026",
      category: "Game",
      difficulty: "Voyage",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arc-voyage.png",
      level: "Voyage",
    },
    {
      id: "g6-apr",
      title: "Arcade Trail: April 2026",
      category: "Game",
      difficulty: "Trail",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arc-trail.png",
      level: "Trail",
    },

    // May 2026
    {
      id: "g1-may",
      title: "Arcade Skill Up Summer",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/special_may.png",
      level: "Special",
    },
    {
      id: "g2-may",
      title: "Arcade Expressive Efficiency",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 0,
      image: "https://services.google.com/fh/files/misc/arcade_maywmp.png",
      level: "Special",
    },
    {
      id: "g3-may",
      title: "Arcade Base Camp May 2026",
      category: "Game",
      difficulty: "Base Camp",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade_maybc.png",
      level: "Base Camp",
    },
    {
      id: "g4-may",
      title: "Arcade Adventure: May 2026",
      category: "Game",
      difficulty: "Adventure",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-advmay.png",
      level: "Adventure",
    },
    {
      id: "g5-may",
      title: "Arcade Voyage: May 2026",
      category: "Game",
      difficulty: "Voyage",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-voygemay.png",
      level: "Voyage",
    },
    {
      id: "g6-may",
      title: "Arcade Trail: May 2026",
      category: "Game",
      difficulty: "Trail",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade_trailmay.png",
      level: "Trail",
    },

    // June 2026
    {
      id: "g1-jun",
      title: "Arcade Skill Up Summer June",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-spe-jun.png",
      level: "Special",
    },
    {
      id: "g2-jun",
      title: "Arcade Expressive Efficiency June",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 0,
      image: "https://services.google.com/fh/files/misc/arcade-wmp-june.png",
      level: "Special",
    },
    {
      id: "g3-jun",
      title: "Arcade Base Camp June 2026",
      category: "Game",
      difficulty: "Base Camp",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-bc-june.png",
      level: "Base Camp",
    },
    {
      id: "g4-jun",
      title: "Arcade Adventure: June 2026",
      category: "Game",
      difficulty: "Adventure",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-adv-june.png",
      level: "Adventure",
    },
    {
      id: "g5-jun",
      title: "Arcade Voyage: June 2026",
      category: "Game",
      difficulty: "Voyage",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-vyo-june.png",
      level: "Voyage",
    },
    {
      id: "g6-jun",
      title: "Arcade Trail: June 2026",
      category: "Game",
      difficulty: "Trail",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-trail.png",
      level: "Trail",
    },

    // July 2026
    {
      id: "g1-jul",
      title: "Arcade Safe Spaces",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arc-spe-jul.png",
      level: "Special",
    },
    {
      id: "g2-jul",
      title: "Arcade Simulator: Data Mesh Architect",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arc-stimu-july.png",
      level: "Special",
    },
    {
      id: "g3-jul",
      title: "Arcade Base Camp July 2026",
      category: "Game",
      difficulty: "Base Camp",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arc-bc-jul.png",
      level: "Base Camp",
    },
    {
      id: "g4-jul",
      title: "Arcade Adventure: July 2026",
      category: "Game",
      difficulty: "Adventure",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arc-ard-july.png",
      level: "Adventure",
    },
    {
      id: "g5-jul",
      title: "Arcade Voyage: July 2026",
      category: "Game",
      difficulty: "Voyage",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arc-voy-july.png",
      level: "Voyage",
    },
    {
      id: "g6-jul",
      title: "Arcade Trail: July 2026",
      category: "Game",
      difficulty: "Trail",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arc-voy-ju.png",
      level: "Trail",
    },

    // August 2026
    {
      id: "g1-aug",
      title: "Arcade Spans and plans",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcadespecialaug.png",
      level: "Special",
    },
    {
      id: "g2-aug",
      title: "Arcade Simulator: Network Security Engineer",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcade-stimulator.png",
      level: "Special",
    },
    {
      id: "g3-aug",
      title: "Arcade Base Camp August 2026",
      category: "Game",
      difficulty: "Base Camp",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcadebcaug.png",
      level: "Base Camp",
    },
    {
      id: "g4-aug",
      title: "Arcade Adventure: August 2026",
      category: "Game",
      difficulty: "Adventure",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcadeadvaug.png",
      level: "Adventure",
    },
    {
      id: "g5-aug",
      title: "Arcade Voyage: August 2026",
      category: "Game",
      difficulty: "Voyage",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcadevougaug.png",
      level: "Voyage",
    },
    {
      id: "g6-aug",
      title: "Arcade Trail: August 2026",
      category: "Game",
      difficulty: "Trail",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcadetrailaug.png",
      level: "Trail",
    },
    {
      id: "g7-aug",
      title: "Arcade RE-Trail: August 2026",
      category: "Game",
      difficulty: "Trail",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/retrailaug.png",
      level: "Trail",
    },

    // September 2026
    {
      id: "g1-sep",
      title: "Arcade Voyage: September 2026",
      category: "Game",
      difficulty: "Voyage",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/sepvoy.png",
      level: "Voyage",
      url: "https://www.skills.google/games/7442",
      accessCode: "1q-microservice-9210",
    },
    {
      id: "g2-sep",
      title: "Arcade Base Camp September 2026",
      category: "Game",
      difficulty: "Base Camp",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/bcsep.png",
      level: "Base Camp",
      url: "https://www.skills.google/games/7444",
      accessCode: "1q-basecamp-09304",
    },
    {
      id: "g3-sep",
      title: "Arcade Adventure: September 2026",
      category: "Game",
      difficulty: "Adventure",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/advsep.png",
      level: "Adventure",
      url: "https://www.skills.google/games/7441",
      accessCode: "1q-architecture-01381",
    },
    {
      id: "g4-sep",
      title: "Arcade Trail: September 2026",
      category: "Game",
      difficulty: "Trail",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/septrail.png",
      level: "Trail",
      url: "https://www.skills.google/games/7443",
      accessCode: "1q-vpcpeering-3469",
    },
    {
      id: "g5-sep",
      title: "Arcade Simulator: DevOps Engineer",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/simulatorsep.png",
      level: "Special",
      url: "https://www.skills.google/games/7445",
      accessCode: "1q-devops-065131",
    },
    {
      id: "g6-sep",
      title: "Pitch Perfect",
      category: "Game",
      difficulty: "Special",
      labsRequired: 0,
      points: 1,
      image: "https://services.google.com/fh/files/misc/specialsepo.png",
      level: "Special",
      url: "https://www.skills.google/games/7446",
      accessCode: "1q-analysis-5026",
    },

    // October 2026
    {
      id: "g1-oct",
      title: "Arcade Adventure: October 2026",
      category: "Game",
      difficulty: "Adventure",
      labsRequired: 8,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcadv-oct.png",
      level: "Adventure",
      url: "https://www.skills.google/games/7496?utm_source=googleskills&utm_medium=lp&utm_campaign=adv-oct-arcade26",
      accessCode: "1q-endpoint-01297",
    },
    {
      id: "g2-oct",
      title: "Arcade Trail: October 2026",
      category: "Game",
      difficulty: "Trail",
      labsRequired: 8,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arctrail-oct.png",
      level: "Trail",
      url: "https://www.skills.google/games/7498?utm_source=googleskills&utm_medium=lp&utm_campaign=trail-oct-arcade26",
      accessCode: "1q-package-53921",
    },
    {
      id: "g3-oct",
      title: "Arcade Voyage: October 2026",
      category: "Game",
      difficulty: "Voyage",
      labsRequired: 8,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcvoyoct.png",
      level: "Voyage",
      url: "https://www.skills.google/games/7497?utm_source=googleskills&utm_medium=lp&utm_campaign=voyage-oct-arcade26",
      accessCode: "1q-synthesis-10713",
    },
    {
      id: "g4-oct",
      title: "Arcade Base Camp October 2026",
      category: "Game",
      difficulty: "Base Camp",
      labsRequired: 8,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcbc-oct.png",
      level: "Base Camp",
      url: "https://www.skills.google/games/7499?utm_source=googleskills&utm_medium=lp&utm_campaign=basecamp-oct-arcade26",
      accessCode: "1q-basecamp-61332",
    },
    {
      id: "g5-oct",
      title: "Arcade Simulator: Site Reliability Engineer",
      category: "Game",
      difficulty: "Special",
      labsRequired: 8,
      points: 1,
      image: "https://services.google.com/fh/files/misc/simul-oct.png",
      level: "Special",
      url: "https://www.skills.google/games/7500?utm_source=googleskills&utm_medium=lp&utm_campaign=specgame-oct-arcade26",
      accessCode: "1q-reliability-21924",
    },
    {
      id: "g6-oct",
      title: "Trick-or-Metric",
      category: "Game",
      difficulty: "Special",
      labsRequired: 8,
      points: 1,
      image: "https://services.google.com/fh/files/misc/arcspec-oct.png",
      level: "Special",
      url: "https://www.skills.google/games/7501?utm_source=googleskills&utm_medium=lp&utm_campaign=special-oct-arcade26",
      accessCode: "1q-spooky-33057",
    },
  ];

  // Combine all available badges (skill + lab-free + trivia + game)
  const allCombinedBadges = [...allAvailableBadges, ...allTriviaAndGameBadges];

  // Update badge categories when calculation result changes
  useEffect(() => {
    if (calculationResult) {
      const categories = getBadgeCategories(
        calculationResult,
        allCombinedBadges,
      );

      setBadgeCategories(categories);

      // Update weekly progress with actual badge data
      const weeklyData = calculateWeeklyProgress(calculationResult);

      setWeeklyProgress(weeklyData);
    } else {
    }
  }, [calculationResult]);

  // Filter out completed badges from incomplete badges
  const incompleteBadges = React.useMemo(() => {
    if (!calculationResult) {
      // Show all badges when no calculation result (first time user)
      return allCombinedBadges;
    }

    // Handle both old and new response formats
    const badgesArray =
      (calculationResult as any).user?.badges ||
      (calculationResult as any).badges;
    if (!badgesArray || badgesArray.length === 0) {
      // Show all badges when user has no badges completed
      return allCombinedBadges;
    }

    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    // Get current month and year
    const now = new Date();
    const currentMonth = months[now.getMonth()];
    const currentYear = now.getFullYear();

    // Build richer completed entries (consume them one-by-one when matching)
    type CompletedEntry = {
      rawName: string;
      earnedMonth?: string;
      type: string;
      levelToken?: string | undefined;
      week?: string | undefined;
    };

    const completedEntries: CompletedEntry[] = badgesArray.map((b: any) => {
      const rawName = (b.name || "").toLowerCase().trim();
      let earnedMonth: string | undefined;
      try {
        if (b.earnedDate) {
          const d = new Date(b.earnedDate);
          if (!isNaN(d.getTime())) earnedMonth = months[d.getMonth()];
        }
      } catch (e) {
        // ignore
      }
      if (!earnedMonth) {
        earnedMonth = months.find((m) => rawName.includes(m));
      }

      const levelMatch = rawName.match(/level\s*(1|2|3)/i);
      const levelToken = levelMatch ? `level ${levelMatch[1]}` : undefined;
      const weekMatch = rawName.match(/week\s*(\d+)/i);
      const week = weekMatch ? weekMatch[1] : undefined;

      return {
        rawName,
        earnedMonth,
        type: (b.type || "").toLowerCase(),
        levelToken,
        week,
      };
    });

    // Work against a mutable copy so each completed entry consumes at most one matching badge
    const remaining = [...allCombinedBadges];

    completedEntries.forEach((entry) => {
      const idx = remaining.findIndex((badge) => {
        const badgeTitle = badge.title.toLowerCase().trim();
        const titleMonth = months.find((m) => badgeTitle.includes(m));

        // Game badges (levels, base camp, certification, specials)
        if (badge.category === "Game") {
          // Match Level tokens (Level 1/2/3)
          if (entry.levelToken) {
            if (!badgeTitle.includes(entry.levelToken)) return false;
            if (
              entry.earnedMonth &&
              titleMonth &&
              entry.earnedMonth !== titleMonth
            )
              return false;
            return true;
          }

          // Match weekly trivia by week number
          if (entry.week) {
            const titleWeekMatch = badgeTitle.match(/week\s*(\d+)/i);
            if (titleWeekMatch && titleWeekMatch[1] === entry.week) {
              if (
                entry.earnedMonth &&
                titleMonth &&
                entry.earnedMonth !== titleMonth
              )
                return false;
              return true;
            }
          }

          // Match special game badges by keywords
          const specialKeywords = [
            "extraskillestrial",
            "extraskillestrail",
            "skills scribble",
            "futureready",
            "future ready",
            "diwali dialogues",
            "lights & logic",
            "lights and logic",
            "banking with empathy",
            "ai assured",
            "faster finance",
            "scaling success",
            "work meets play",
          ];
          for (const kw of specialKeywords) {
            if (entry.rawName.includes(kw) && badgeTitle.includes(kw)) {
              if (
                entry.earnedMonth &&
                titleMonth &&
                entry.earnedMonth !== titleMonth
              )
                return false;
              return true;
            }
          }

          // Fallback: strict contains match with month check
          if (
            entry.rawName === badgeTitle ||
            entry.rawName.includes(badgeTitle) ||
            badgeTitle.includes(entry.rawName)
          ) {
            if (
              entry.earnedMonth &&
              titleMonth &&
              entry.earnedMonth !== titleMonth
            )
              return false;
            return true;
          }

          return false;
        }

        // Skill / Trivia / Lab-Free badges
        if (
          badge.category === "Skill" ||
          badge.category === "Trivia" ||
          badge.category === "Lab-Free"
        ) {
          const cleanBadgeTitle = badgeTitle;
          if (entry.rawName === cleanBadgeTitle) return true;
          if (
            entry.rawName.includes(cleanBadgeTitle) ||
            cleanBadgeTitle.includes(entry.rawName)
          )
            return true;
          const cleanedCompleted = entry.rawName.replace(
            /^(skills boost\s+|skill badge\s+|arcade\s+)/gi,
            "",
          );
          const cleanedBadge = cleanBadgeTitle.replace(
            /^(skills boost\s+|skill badge\s+|arcade\s+)/gi,
            "",
          );
          if (
            cleanedCompleted === cleanedBadge ||
            cleanedCompleted.includes(cleanedBadge) ||
            cleanedBadge.includes(cleanedCompleted)
          )
            return true;
        }

        return false;
      });

      if (idx !== -1) {
        // Remove the matched badge so we don't match it again for another completed entry
        remaining.splice(idx, 1);
      } else {
        // Not matched — leave it (we could log for debugging)
      }
    });

    // Filter out expired game badges (those from past months)
    // ONLY SHOW CURRENT MONTH GAME/TRIVIA BADGES
    // Month suffix mapping for badge IDs (e.g., '-sep', '-jan')
    const monthSuffixes = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    const currentMonthSuffix = monthSuffixes[now.getMonth()];

    const availableRemaining = remaining.filter((badge) => {
      // Only filter game badges and trivia badges (they have time limits)
      if (badge.category === "Game" || badge.category === "Trivia") {
        // Use badge ID suffix to determine which month it belongs to
        const badgeId = badge.id.toLowerCase();
        const idMonthSuffix = monthSuffixes.find((s) =>
          badgeId.endsWith("-" + s),
        );

        if (idMonthSuffix) {
          // Only show badges whose ID month matches the current month
          return idMonthSuffix === currentMonthSuffix;
        }

        // Fallback: check month name in title
        const badgeTitle = badge.title.toLowerCase();
        const badgeMonth = months.find((m) => badgeTitle.includes(m));
        if (badgeMonth) {
          const yearMatch = badgeTitle.match(/20\d{2}/);
          const badgeYear = yearMatch
            ? Number.parseInt(yearMatch[0])
            : currentYear;
          const badgeMonthIndex = months.indexOf(badgeMonth);
          const currentMonthIndex = months.indexOf(currentMonth);
          return (
            badgeYear === currentYear && badgeMonthIndex === currentMonthIndex
          );
        }

        // If no month can be determined, hide it
        return false;
      }

      // Keep all non-game/trivia badges (skill badges, lab-free)
      return true;
    });

    return availableRemaining;
  }, [calculationResult]);

  // Calculate weekly progress from actual badges
  const calculateWeeklyProgress = (
    calculationResult: CalcResult | null,
  ): WeeklyData[] => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    // Get the last 7 days including today
    const last7Days: WeeklyData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayName = dayNames[date.getDay()];

      last7Days.push({ day: dayName, points: 0 });
    }

    if (
      !calculationResult ||
      !calculationResult.user ||
      !calculationResult.user.badges
    ) {
      return last7Days;
    }

    // Calculate start date (7 days ago from today at start of day)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Count badges earned in the last 7 days
    calculationResult.user.badges.forEach((badge: any) => {
      const earnedDate = new Date(badge.earnedDate);

      // Check if badge was earned in the last 7 days
      if (earnedDate >= sevenDaysAgo && earnedDate <= today) {
        // Calculate which day index (0-6) this badge belongs to
        const daysDiff = Math.floor(
          (earnedDate.getTime() - sevenDaysAgo.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        if (daysDiff >= 0 && daysDiff < 7) {
          last7Days[daysDiff].points += 1;
        }
      }
    });

    return last7Days;
  };

  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyData[]>(
    calculateWeeklyProgress(null),
  );

  // Mock calculation results
  const [lastCalculations] = useState<CalcResult[]>([
    {
      success: true,
      user: {
        points: 9,
        badges: [],
      },
      breakdown: {
        skill: { count: 0, points: 2, pointsPerBadge: 0.5 },
        level: { count: 0, points: 3, pointsPerBadge: 1 },
        trivia: { count: 0, points: 4, pointsPerBadge: 1 },
        completion: { count: 0, points: 0, pointsPerBadge: 0 },
      },
      summary: {
        skillBadges: 0,
        levelBadges: 0,
        triviaBadges: 0,
        completionBadges: 0,
        totalPoints: 9,
      },
    },
  ]);

  const totalPointsThisSeason = 9;

  // Freshness & Session-aware profile update states
  const [refreshStatus, setRefreshStatus] =
    useState<DashboardRefreshStatus>("idle");
  const [refreshMessage, setRefreshMessage] = useState<string>("");
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [refreshDiff, setRefreshDiff] = useState<RefreshDiff | null>(null);
  const successDismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  const dismissToast = useCallback(() => {
    if (successDismissTimerRef.current)
      clearTimeout(successDismissTimerRef.current);
    setRefreshStatus("idle");
    setRefreshDiff(null);
    setRefreshError(null);
  }, []);

  const [lastScannedAt, setLastScannedAt] = useState<Date | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedProfileUrl = localStorage.getItem("arcadeProfileUrl") || "";
        const ts = localStorage.getItem(
          `arcadeverse_last_scan_ts_${savedProfileUrl}`,
        );
        if (ts) return new Date(Number(ts));
      } catch {}
    }
    return null;
  });

  const activeScanPromiseRef = useRef<Promise<any> | null>(null);
  const isFacilitatorRef = useRef(isFacilitator);
  isFacilitatorRef.current = isFacilitator;
  const setCalculationResultRef = useRef(setCalculationResult);
  setCalculationResultRef.current = setCalculationResult;
  const initialRefreshTriggeredRef = useRef<string | null>(null);

  // Tab-scoped visit identifier generated in sessionStorage
  const getTabSessionId = useCallback((): string => {
    if (typeof window === "undefined") return "ssr";
    try {
      let sid = sessionStorage.getItem("arcadeverse_tab_session_id");
      if (!sid) {
        sid = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem("arcadeverse_tab_session_id", sid);
      }
      return sid;
    } catch {
      return "fallback_session";
    }
  }, []);

  // Resolved active profile URL from context or saved profiles
  const resolvedProfileUrl = useMemo(() => {
    if (profileUrl && profileUrl.trim()) return profileUrl.trim();
    if (typeof window !== "undefined") {
      try {
        const activeId = localStorage.getItem("arcadeverse_current_profile_id");
        const raw = localStorage.getItem("arcadeverse_profiles");
        if (raw) {
          const profiles = JSON.parse(raw);
          const active =
            profiles.find((p: any) => p.id === activeId) || profiles[0];
          if (active?.url) return active.url.trim();
        }
        return (localStorage.getItem("arcadeProfileUrl") || "").trim();
      } catch {}
    }
    return "";
  }, [profileUrl]);

  // Robust scan execution function with stage-by-stage messages, deduplication, and failure isolation
  const performProfileRefresh = useCallback(
    async (force = false): Promise<void> => {
      const targetUrl = resolvedProfileUrl;
      if (!targetUrl) return;

      // Scan deduplication: reuse active in-flight scan
      if (activeScanPromiseRef.current) {
        return activeScanPromiseRef.current;
      }

      setRefreshStatus("refreshing");
      setRefreshMessage("Updating Profile Data...");
      setRefreshError(null);

      // Capture baseline points and badge count before scan completes
      const baselinePoints =
        calculationDataRef.current.totalPoints || user.arcadePoints || 0;
      const baselineBadges =
        calculationDataRef.current.totalBadges || user.totalBadges || 0;

      const promise = (async () => {
        try {
          const response = await badgeService.calculatePoints(
            targetUrl,
            isFacilitatorRef.current,
            false,
          );

          // Result validation
          if (
            !response ||
            typeof response !== "object" ||
            (!("user" in response) &&
              !("badges" in response) &&
              !("summary" in response))
          ) {
            throw new Error(
              "Received malformed calculation payload from Google Cloud.",
            );
          }

          // Atomic update of context calculation result
          setCalculationResultRef.current(response as any);

          const newPoints = Number(
            (response as any).summary?.totalPoints ??
              (response as any).user?.points ??
              0,
          );
          const newBadges = Number(
            (response as any).user?.badges?.length ??
              (response as any).badges?.length ??
              0,
          );

          const pointDiff = Math.max(
            0,
            Number((newPoints - baselinePoints).toFixed(1)),
          );
          const badgeDiff = Math.max(0, newBadges - baselineBadges);

          // Persist freshness metadata
          const now = Date.now();
          const sid = getTabSessionId();
          try {
            sessionStorage.setItem(
              `arcadeverse_tab_scanned_${targetUrl}_${sid}`,
              "true",
            );
            localStorage.setItem(
              `arcadeverse_last_scan_ts_${targetUrl}`,
              String(now),
            );
          } catch {}

          setLastScannedAt(new Date(now));

          // Only show success toast if verified changes were earned and baseline was valid
          if (baselinePoints > 0 && (pointDiff > 0 || badgeDiff > 0)) {
            setRefreshDiff({
              pointsEarned: pointDiff,
              badgesEarned: badgeDiff,
            });
            setRefreshStatus("success");
            setRefreshMessage("Profile Progress Updated");

            if (successDismissTimerRef.current)
              clearTimeout(successDismissTimerRef.current);
            successDismissTimerRef.current = setTimeout(() => {
              setRefreshStatus("idle");
              setRefreshDiff(null);
            }, 6000);
          } else {
            // Profile unchanged or initial load: smoothly dismiss progress notification
            setRefreshStatus("idle");
            setRefreshDiff(null);
          }
        } catch (err: any) {
          console.warn(
            "Dashboard profile refresh failed (preserving cached points):",
            err,
          );
          // Preserve valid cached data, never replace with 0
          setRefreshStatus("error");
          setRefreshError(
            err.message || "Unable to reach Google Cloud Skills Boost.",
          );
          setRefreshMessage("Profile Sync Notice");

          if (successDismissTimerRef.current)
            clearTimeout(successDismissTimerRef.current);
          successDismissTimerRef.current = setTimeout(() => {
            setRefreshStatus("idle");
            setRefreshError(null);
          }, 5000);
        } finally {
          activeScanPromiseRef.current = null;
        }
      })();

      activeScanPromiseRef.current = promise;
      return promise;
    },
    [resolvedProfileUrl, getTabSessionId, user.arcadePoints, user.totalBadges],
  );

  // Automatic freshness evaluation on new visit / component mount
  useEffect(() => {
    if (!resolvedProfileUrl) return;
    if (initialRefreshTriggeredRef.current === resolvedProfileUrl) return;
    initialRefreshTriggeredRef.current = resolvedProfileUrl;

    const sid = getTabSessionId();
    let alreadyScannedInSession = false;
    let lastScanTs = 0;

    try {
      alreadyScannedInSession =
        sessionStorage.getItem(
          `arcadeverse_tab_scanned_${resolvedProfileUrl}_${sid}`,
        ) === "true";
      const storedTs = localStorage.getItem(
        `arcadeverse_last_scan_ts_${resolvedProfileUrl}`,
      );
      if (storedTs) lastScanTs = Number(storedTs);
    } catch {}

    const isStale = Date.now() - lastScanTs > 30 * 1000; // 30-second cooldown

    // Automatically trigger scan if fresh session or stale
    if (!alreadyScannedInSession || isStale) {
      performProfileRefresh(false);
    }
  }, [resolvedProfileUrl, getTabSessionId, performProfileRefresh]);

  const refreshData = () => {
    performProfileRefresh(true);
  };

  const onStartChallenge = (badgeId: string) => {
    // Navigate to challenge or open modal
  };

  const onCategoryClick = (category: string) => {
    // Filter badges by category
  };

  const onViewFullReport = () => {
    // Navigate to full report page
  };

  const value: DashboardContextType = {
    user,
    swagTiers,
    badgeCategories,
    incompleteBadges,
    weeklyProgress,
    lastCalculations,
    totalPointsThisSeason,
    isLoading,
    refreshData,
    onStartChallenge,
    onCategoryClick,
    onViewFullReport,
    isFacilitator,
    setIsFacilitator: handleSetIsFacilitator,
    updateUserPoints: (pts: number) => {
      setUser((prev) =>
        prev.arcadePoints === pts ? prev : { ...prev, arcadePoints: pts },
      );
    },
    refreshStatus,
    refreshMessage,
    refreshError,
    refreshDiff,
    dismissToast,
    lastScannedAt,
    triggerManualRefresh: () => performProfileRefresh(true),
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
