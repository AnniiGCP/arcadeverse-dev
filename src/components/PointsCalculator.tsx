import { Button } from "@/components/ui/button";
import { useCalculation } from "@/lib/calculation-context";
import { useDashboard } from "@/lib/dashboard-context";
import { useLeaderboard } from "@/lib/leaderboard-context";
import { useProfile } from "@/lib/profile-context";
import {
  type CalculationResponse,
  badgeService,
} from "@/services/badgeService";
import { IconArrowRight, IconLink } from "@tabler/icons-react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface PointsCalculatorProps {
  onProfileScanned: () => void;
}

export function PointsCalculator({ onProfileScanned }: PointsCalculatorProps) {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const {
    setProfileUrl: setGlobalProfileUrl,
    setIsCalculating,
    setCalculationResult,
  } = useCalculation();
  const {
    profiles,
    selectedProfile,
    addProfile,
    selectProfile,
    updateProfileCalculation,
    updateProfileName,
  } = useProfile();
  const { updateLeaderboardEntry } = useLeaderboard();

  const [inputProfileUrl, setInputProfileUrl] = useState<string>(
    selectedProfile?.profileUrl || "",
  );
  const [calculationResponse, setCalculationResponse] =
    useState<CalculationResponse | null>(
      selectedProfile?.calculationResponse || null,
    );
  const [points, setPoints] = useState<number | null>(
    selectedProfile?.calculationResponse?.points.total || null,
  );
  const [calculatingPoints, setCalculatingPoints] = useState(false);
  const [errorToast, setErrorToast] = useState<{
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (selectedProfile) {
      setInputProfileUrl(selectedProfile.profileUrl);
      setPoints(selectedProfile.calculationResponse?.points.total || null);
      setCalculationResponse(selectedProfile.calculationResponse || null);
      setGlobalProfileUrl(selectedProfile.profileUrl);
    }
  }, [selectedProfile, setGlobalProfileUrl]);

  // Auto dismiss error toast after 6 seconds
  useEffect(() => {
    if (errorToast) {
      const timer = setTimeout(() => setErrorToast(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [errorToast]);

  const validateProfileUrl = (url: string): boolean => {
    const trimmed = url.trim();
    if (!trimmed) return false;
    const isCloudSkillsBoost = trimmed.includes(
      "cloudskillsboost.google/public_profiles/",
    );
    const isSkillsGoogle = trimmed.includes("skills.google/public_profiles/");
    if (!isCloudSkillsBoost && !isSkillsGoogle) return false;
    const idPart = trimmed.split("public_profiles/")[1]?.split("?")[0]?.trim();
    return Boolean(idPart && idPart.length >= 4);
  };

  const handleCalculatePoints = async () => {
    const trimmed = inputProfileUrl.trim();
    if (!trimmed || !validateProfileUrl(trimmed)) {
      setErrorToast({
        title: "Wrong profile URL",
        message: "Please add correct profile url.",
      });
      return;
    }

    setCalculatingPoints(true);
    setErrorToast(null);

    try {
      setIsCalculating(true);
      setGlobalProfileUrl(trimmed);

      // Always calculate with facilitator mode to get complete data (including milestone points)
      const response = await badgeService.calculatePoints(trimmed, true);

      if (response.points) {
        setPoints(response.points.total);
        setCalculationResponse(response);
        setGlobalProfileUrl(trimmed);

        // Transform response to match dashboard context format
        const transformedResult = {
          success: true,
          points: response.points,
          user: {
            name: response.profileData.name,
            photoUrl: response.profileData.photoUrl,
            memberSince: response.profileData.memberSince,
            points: response.points.total,
            badges: response.badges,
          },
          profileData: response.profileData,
          breakdown: {
            skill: {
              count: response.badges.filter((b) => b.type === "skill").length,
              points: response.points.skillBadges,
              pointsPerBadge: 0.5,
            },
            level: {
              count: response.badges.filter(
                (b) => b.type === "game" || b.type === "trivia",
              ).length,
              points: response.points.gameBadges,
              pointsPerBadge: 1,
            },
            trivia: {
              count: response.badges.filter((b) => b.type === "trivia").length,
              points: response.points.triviaBadges,
              pointsPerBadge: 1,
            },
            completion: {
              count: response.badges.filter((b) => b.type === "completion")
                .length,
              points: 0,
              pointsPerBadge: 0,
            },
          },
          summary: {
            skillBadges: response.badges.filter((b) => b.type === "skill")
              .length,
            levelBadges: response.badges.filter(
              (b) => b.type === "game" || b.type === "trivia",
            ).length,
            triviaBadges: response.badges.filter((b) => b.type === "trivia")
              .length,
            completionBadges: response.badges.filter(
              (b) => b.type === "completion",
            ).length,
            totalPoints: response.points.total,
            milestonePoints: response.points.milestonePoints || 0,
          },
          milestoneProgress: response.milestoneProgress,
        };

        // Store transformed calculation result in context for dashboard
        setCalculationResult(transformedResult as any);

        // Dispatch genuine notification for profile calculation
        window.dispatchEvent(
          new CustomEvent("arcadeverse:calculation_complete", {
            detail: { points: response.points.total },
          }),
        );
        window.dispatchEvent(
          new CustomEvent("new-notification", {
            detail: {
              id: `calc-${Date.now()}`,
              type: "badge",
              title: `Profile Analyzed: ${response.points.total} Points`,
              subtitle: `${response.profileData.name || "Your Profile"} • Arcade Standings`,
              description: `Calculated ${response.badges.length} badges (${response.badges.filter((b) => b.type === "skill").length} Skill Badges, ${response.badges.filter((b) => b.type === "game").length} Game Badges). Check your dashboard for tier eligibility!`,
              timestamp: new Date().toISOString(),
              read: false,
              link: "/dashboard",
            },
          }),
        );

        const existingProfile = profiles.find((p) => p.profileUrl === trimmed);
        if (existingProfile) {
          if (
            response.profileData.name &&
            existingProfile.name !== response.profileData.name
          ) {
            updateProfileName(existingProfile.id, response.profileData.name);
          }
          updateProfileCalculation(existingProfile.id, response);
          selectProfile(existingProfile.id);
        } else {
          const newProfileName =
            response.profileData.name || `Profile ${profiles.length + 1}`;
          const newProfileId = await addProfile(trimmed, newProfileName);
          updateProfileCalculation(newProfileId, response);
          selectProfile(newProfileId);
        }

        // Save to ProfileSwitcher's localStorage
        const savedProfiles = localStorage.getItem("arcadeverse_profiles");
        const existingSavedProfiles = savedProfiles
          ? JSON.parse(savedProfiles)
          : [];
        const existingProfileIndex = existingSavedProfiles.findIndex(
          (p: any) => p.url === trimmed,
        );

        let activeProfileId = "";
        if (existingProfileIndex >= 0) {
          activeProfileId = existingSavedProfiles[existingProfileIndex].id;
          existingSavedProfiles[existingProfileIndex] = {
            ...existingSavedProfiles[existingProfileIndex],
            name: response.profileData.name,
            memberSince: response.profileData.memberSince,
            photoUrl: response.profileData.photoUrl,
            league: response.profileData.league,
            skillsPoints: response.profileData.skillsPoints,
            points:
              response.points.total - (response.points.milestonePoints || 0),
            bonusPoints: response.points.milestonePoints || 0,
            calculationData: transformedResult,
          };
        } else {
          activeProfileId = Date.now().toString();
          const newProfile = {
            id: activeProfileId,
            name: response.profileData.name,
            url: trimmed,
            memberSince: response.profileData.memberSince,
            photoUrl: response.profileData.photoUrl,
            league: response.profileData.league,
            skillsPoints: response.profileData.skillsPoints,
            points:
              response.points.total - (response.points.milestonePoints || 0),
            bonusPoints: response.points.milestonePoints || 0,
            addedAt: new Date().toISOString(),
            calculationData: transformedResult,
          };
          existingSavedProfiles.push(newProfile);
        }

        localStorage.setItem(
          "arcadeverse_profiles",
          JSON.stringify(existingSavedProfiles),
        );
        localStorage.setItem("arcadeverse_current_profile_id", activeProfileId);
        window.dispatchEvent(new Event("profilesUpdated"));

        const profileForLeaderboard = profiles.find(
          (p) => p.profileUrl === trimmed,
        );
        if (
          profileForLeaderboard &&
          profileForLeaderboard.calculationResponse
        ) {
          updateLeaderboardEntry(profileForLeaderboard);
        }

        onProfileScanned();
        navigate("/dashboard");
      } else {
        setErrorToast({
          title: "Calculation Failed",
          message:
            "Could not retrieve badge data. Please ensure your profile is public.",
        });
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to calculate points. Please check that your profile URL is correct and public.";
      setErrorToast({
        title: "Calculation Error",
        message: errorMessage,
      });
    } finally {
      setCalculatingPoints(false);
      setIsCalculating(false);
    }
  };

  return (
    <section
      id="calculator-section"
      className="relative scroll-mt-24 py-16 md:py-24 overflow-hidden"
    >
      {/* Subtle ambient glow behind calculator */}
      <div
        className="pointer-events-none absolute inset-0 bg-aurora opacity-30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl"
        aria-hidden
      />

      <div className="container max-w-3xl relative z-10 text-center">
        {/* Minimal Eyebrow Badge */}
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-purple">
            <IconLink className="h-3.5 w-3.5" />
            Points Calculator
          </span>
        </div>

        {/* Minimal Clean Heading */}
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
          Instant <span className="text-gradient">Points Calculator</span>
        </h2>

        {/* Subtitle */}
        <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Paste your Google Cloud Skills Boost public profile URL below to get
          real-time points, badge analysis, and milestone progress.
        </p>

        {/* Big Minimalistic Input Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center rounded-2xl sm:rounded-full border border-border/80 bg-surface/90 p-1.5 sm:p-2 shadow-card-premium backdrop-blur-md focus-within:border-accent-purple focus-within:ring-2 focus-within:ring-accent-purple/20 transition-all">
            <input
              type="url"
              placeholder="https://www.skills.google/public_profiles/..."
              value={inputProfileUrl}
              onChange={(e) => setInputProfileUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCalculatePoints();
              }}
              className="w-full bg-transparent px-5 py-3 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={handleCalculatePoints}
              disabled={calculatingPoints}
              className="w-full sm:w-auto rounded-xl sm:rounded-full bg-accent-purple hover:bg-accent-purple/90 text-white font-semibold text-sm sm:text-base px-7 py-3 sm:py-3.5 shadow-lg transition-all shrink-0 flex items-center justify-center gap-2"
            >
              {calculatingPoints ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Calculating…
                </>
              ) : (
                "Calculate points"
              )}
            </button>
          </div>

          {/* Having trouble link */}
          <p className="mt-3.5 text-xs sm:text-sm text-muted-foreground text-center">
            Having trouble finding your public profile URL?{" "}
            <a
              href="/resources/find-your-google-cloud-skills-public-profile-url"
              className="text-accent-purple hover:underline font-medium transition-colors"
            >
              Click here for help
            </a>
          </p>
        </div>

        {/* Points Display when calculated */}
        {points !== null && (
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-xl mx-auto rounded-3xl border border-border dark:border-slate-700/80 bg-surface-card/90 p-7 sm:p-8 shadow-card-premium text-center backdrop-blur-md relative overflow-hidden"
          >
            <div className="pointer-events-none absolute -top-10 -right-10 w-36 h-36 bg-accent-purple/10 rounded-full blur-2xl" />
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">
              Total Arcade points
            </p>
            <p className="mt-2 font-display text-5xl sm:text-6xl font-black text-gradient">
              {points}{" "}
              <span className="text-2xl sm:text-3xl text-foreground font-bold">
                Pts
              </span>
            </p>

            {calculationResponse && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-700 dark:text-blue-400">
                  {
                    (
                      (calculationResponse as any).badges ||
                      (calculationResponse as any).user?.badges ||
                      []
                    ).filter((b: any) => b.type === "skill").length
                  }{" "}
                  Skill Badges
                </span>
                <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-bold text-purple-700 dark:text-purple-300">
                  {
                    (
                      (calculationResponse as any).badges ||
                      (calculationResponse as any).user?.badges ||
                      []
                    ).filter(
                      (b: any) => b.type === "game" || b.type === "trivia",
                    ).length
                  }{" "}
                  Game Badges
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  +
                  {calculationResponse.points?.total ??
                    (calculationResponse as any).summary?.totalPoints ??
                    (calculationResponse as any).user?.points ??
                    0}{" "}
                  Total Pts
                </span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Floating Bottom-Right Toast on Wrong Profile URL matching Image 1 */}
      {errorToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#131926]/95 p-4 shadow-2xl backdrop-blur-md max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
          <div className="rounded-full bg-red-500/15 p-1 text-red-500 shrink-0 mt-0.5">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {errorToast.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {errorToast.message}
            </p>
          </div>
          <button
            onClick={() => setErrorToast(null)}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}
