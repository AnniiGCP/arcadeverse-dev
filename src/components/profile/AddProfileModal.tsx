import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCalculation } from "@/lib/calculation-context";
import { badgeService } from "@/services/badgeService";
import { IconLink } from "@tabler/icons-react";
import { AlertCircle, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface SavedProfile {
  id: string;
  name: string;
  url: string;
  memberSince?: string;
  photoUrl?: string;
  league?: string;
  skillsPoints?: number;
  points: number;
  bonusPoints: number;
  addedAt: string;
  calculationData?: any;
}

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileAdded?: (profile: SavedProfile) => void;
}

export function AddProfileModal({
  isOpen,
  onClose,
  onProfileAdded,
}: AddProfileModalProps) {
  const navigate = useNavigate();
  const { setCalculationResult, setProfileUrl } = useCalculation();
  const [inputUrl, setInputUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setInputUrl("");
      setIsLoading(false);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

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
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setErrorMessage("Please enter your Google Skills Profile URL.");
      return;
    }

    if (!validateProfileUrl(trimmed)) {
      setErrorMessage(
        "Please enter a valid Google Cloud Skills Boost public profile URL (e.g., https://www.skills.google/public_profiles/...).",
      );
      return;
    }

    // Check for duplicate profile
    const savedProfilesRaw = localStorage.getItem("arcadeverse_profiles");
    let savedProfiles: SavedProfile[] = [];
    if (savedProfilesRaw) {
      try {
        savedProfiles = JSON.parse(savedProfilesRaw);
      } catch {
        savedProfiles = [];
      }
    }

    const existingProfile = savedProfiles.find(
      (p) => p.url.trim().toLowerCase() === trimmed.toLowerCase(),
    );

    if (existingProfile) {
      setSuccessMessage("This profile is already added. Switching to it...");
      setTimeout(() => {
        localStorage.setItem(
          "arcadeverse_current_profile_id",
          existingProfile.id,
        );
        if (existingProfile.calculationData) {
          setCalculationResult(existingProfile.calculationData);
          setProfileUrl(existingProfile.url);
        }
        window.dispatchEvent(new Event("profilesUpdated"));
        onProfileAdded?.(existingProfile);
        onClose();
      }, 700);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Calculate points using existing badgeService
      const response = await badgeService.calculatePoints(trimmed, true);

      // Extract badges safely
      const rawBadges: any[] = Array.isArray(response?.badges)
        ? response.badges
        : Array.isArray((response as any)?.user?.badges)
          ? (response as any).user.badges
          : [];
      const totalPoints =
        response?.points?.total ??
        (response as any)?.summary?.totalPoints ??
        (response as any)?.user?.points ??
        0;
      const skillBadgesPts =
        response?.points?.skillBadges ??
        (response as any)?.breakdown?.skill?.points ??
        0;
      const gameBadgesPts =
        response?.points?.gameBadges ??
        (response as any)?.breakdown?.level?.points ??
        0;
      const triviaBadgesPts =
        response?.points?.triviaBadges ??
        (response as any)?.breakdown?.trivia?.points ??
        0;

      // Transform to match dashboard format
      const transformedResult = {
        success: true,
        points: response.points || {
          total: totalPoints,
          skillBadges: skillBadgesPts,
          gameBadges: gameBadgesPts,
          triviaBadges: triviaBadgesPts,
          milestonePoints: 0,
        },
        user: {
          points: totalPoints,
          badges: rawBadges,
        },
        profileData: response.profileData || (response as any).user,
        breakdown: {
          skill: {
            count: rawBadges.filter((b) => b.type === "skill").length,
            points: skillBadgesPts,
            pointsPerBadge: 0.5,
          },
          level: {
            count: rawBadges.filter(
              (b) => b.type === "game" || b.type === "trivia",
            ).length,
            points: gameBadgesPts,
            pointsPerBadge: 1,
          },
          trivia: {
            count: rawBadges.filter((b) => b.type === "trivia").length,
            points: triviaBadgesPts,
            pointsPerBadge: 1,
          },
          completion: {
            count: rawBadges.filter((b) => b.type === "completion").length,
            points: 0,
            pointsPerBadge: 0,
          },
        },
        summary: {
          skillBadges: rawBadges.filter((b) => b.type === "skill").length,
          levelBadges: rawBadges.filter(
            (b) => b.type === "game" || b.type === "trivia",
          ).length,
          triviaBadges: rawBadges.filter((b) => b.type === "trivia").length,
          completionBadges: rawBadges.filter((b) => b.type === "completion")
            .length,
          totalPoints: totalPoints,
          milestonePoints: response.points?.milestonePoints || 0,
        },
        milestoneProgress: response.milestoneProgress,
      };

      const newProfile: SavedProfile = {
        id: Date.now().toString(),
        name: response.profileData?.name || "Arcade User",
        url: trimmed,
        memberSince: response.profileData?.memberSince,
        photoUrl: response.profileData?.photoUrl,
        league: response.profileData?.league,
        skillsPoints: response.profileData?.skillsPoints,
        points: response.points?.total || 0,
        bonusPoints: response.points?.milestonePoints || 0,
        addedAt: new Date().toISOString(),
        calculationData: transformedResult,
      };

      const updated = [...savedProfiles, newProfile];
      localStorage.setItem("arcadeverse_profiles", JSON.stringify(updated));
      localStorage.setItem("arcadeverse_current_profile_id", newProfile.id);
      localStorage.setItem(
        "arcadeverseData",
        JSON.stringify(transformedResult),
      );
      localStorage.setItem("arcadeProfileUrl", trimmed);

      setCalculationResult(transformedResult as any);
      setProfileUrl(trimmed);

      window.dispatchEvent(new Event("profilesUpdated"));
      onProfileAdded?.(newProfile);

      setSuccessMessage("Profile added successfully!");
      setTimeout(() => {
        onClose();
        navigate("/dashboard");
      }, 500);
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          "Failed to calculate points. Please ensure your profile is public and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl w-[92vw] sm:w-full rounded-3xl border border-border/80 dark:border-slate-800 bg-surface-card dark:bg-[#0c1424] p-6 sm:p-8 shadow-2xl overflow-hidden focus:outline-none">
        {/* Ambient background glow */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"
          aria-hidden
        />

        <div className="relative z-10 text-center">
          {/* Eyebrow Label matching Reference 2 */}
          <p className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground dark:text-slate-400 mb-2.5">
            ARCADE 2026 • FACILITATOR BONUS POINTS • PRIZE TIER CALCULATOR
          </p>

          {/* Heading matching Reference 2 */}
          <DialogTitle className="font-display text-2xl sm:text-3xl font-black text-foreground dark:text-white tracking-tight">
            Add Your{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Google Skills
            </span>{" "}
            Profile to
          </DialogTitle>

          {/* Subtitle matching Reference 2 */}
          <DialogDescription className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Instantly calculate{" "}
            <strong className="text-foreground dark:text-white font-semibold">
              Arcade points
            </strong>
            , track lab milestones, and unlock your{" "}
            <strong className="text-foreground dark:text-white font-semibold">
              prize tiers
            </strong>
            .
          </DialogDescription>

          {/* Input container matching Reference 2 */}
          <div className="mt-6 rounded-2xl border border-border dark:border-slate-800/90 bg-surface-hover/30 dark:bg-[#070b14]/90 p-3 sm:p-4 space-y-3 text-left">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-mono">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0">
                <IconLink className="h-3.5 w-3.5" />
              </div>
              <span>
                Paste your{" "}
                <strong className="text-foreground dark:text-white font-semibold not-italic">
                  Google Cloud Skills Boost
                </strong>{" "}
                public profile URL below ↓
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center rounded-xl sm:rounded-full border border-border dark:border-slate-700/80 bg-background dark:bg-[#0c1424] p-1.5 shadow-inner focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all gap-2">
              <input
                type="url"
                placeholder="Enter your Google Skills Profile Link"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setErrorMessage(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleCalculatePoints();
                  }
                }}
                disabled={isLoading}
                className="w-full bg-transparent px-4 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={handleCalculatePoints}
                disabled={isLoading || !inputUrl.trim()}
                className="w-full sm:w-auto rounded-lg sm:rounded-full bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-6 py-2.5 shadow-md transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {isLoading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Calculating...</span>
                  </>
                ) : (
                  "Calculate points"
                )}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center gap-2 text-xs text-red-500 dark:text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success / Duplicate Message */}
            {successMessage && (
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 animate-in fade-in duration-200">
                <Check className="h-4 w-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {/* Help link matching Reference 2 */}
          <p className="mt-5 text-xs text-muted-foreground text-center">
            Having trouble finding your public profile URL?{" "}
            <a
              href="/resources/find-your-google-cloud-skills-public-profile-url"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold transition-colors"
            >
              Click here for help
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
