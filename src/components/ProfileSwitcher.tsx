import {
  AddProfileModal,
  type SavedProfile,
} from "@/components/profile/AddProfileModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCalculation } from "@/lib/calculation-context";
import { useOptionalDashboard } from "@/lib/dashboard-context";
import { cn } from "@/lib/utils";
import { badgeService } from "@/services/badgeService";
import { Check, ChevronDown, Plus, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ProfileSwitcher() {
  const navigate = useNavigate();
  const { calculationResult, setCalculationResult, profileUrl, setProfileUrl } =
    useCalculation();
  const dashboard = useOptionalDashboard();
  const user = dashboard?.user ?? {
    name: "",
    avatar: "",
    photoUrl: "",
    memberSince: "",
    league: "",
    arcadePoints: 0,
    leaderboardRank: 0,
    totalBadges: 0,
  };

  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);

  // Load profiles from localStorage on mount and sync
  useEffect(() => {
    const loadProfiles = () => {
      const savedProfiles = localStorage.getItem("arcadeverse_profiles");

      if (savedProfiles) {
        try {
          const parsed: SavedProfile[] = JSON.parse(savedProfiles);
          setProfiles(parsed);

          if (parsed.length > 0) {
            const savedCurrentId = localStorage.getItem(
              "arcadeverse_current_profile_id",
            );
            const matchingById = savedCurrentId
              ? parsed.find((p) => p.id === savedCurrentId)
              : null;
            const matchingByUrl = profileUrl
              ? parsed.find((p) => p.url === profileUrl)
              : null;

            const active = matchingById || matchingByUrl || parsed[0];
            setCurrentProfileId(active.id);
            localStorage.setItem("arcadeverse_current_profile_id", active.id);

            // If context calculationResult is empty, populate from active profile
            if (!calculationResult && active.calculationData) {
              setCalculationResult(active.calculationData);
              setProfileUrl(active.url);
            }
          } else {
            setCurrentProfileId(null);
          }
        } catch {
          setProfiles([]);
          setCurrentProfileId(null);
        }
      } else {
        setProfiles([]);
        setCurrentProfileId(null);
      }
    };

    loadProfiles();

    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "arcadeverse_profiles" ||
        e.key === "arcadeverse_current_profile_id"
      ) {
        loadProfiles();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const handleProfileUpdate = () => {
      loadProfiles();
    };

    window.addEventListener("profilesUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profilesUpdated", handleProfileUpdate);
    };
  }, [profileUrl]);

  // Helper to extract initials
  const getInitials = (name: string): string => {
    if (!name) return "U";
    return name
      .split(/[\s-]/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Switch to a profile
  const switchProfile = (profile: SavedProfile) => {
    if (profile.calculationData) {
      setCalculationResult(profile.calculationData);
      setProfileUrl(profile.url);
      setCurrentProfileId(profile.id);
      localStorage.setItem("arcadeverse_current_profile_id", profile.id);
      localStorage.setItem(
        "arcadeverseData",
        JSON.stringify(profile.calculationData),
      );
      localStorage.setItem("arcadeProfileUrl", profile.url);

      // Update photoUrl if calculationData has a newer one
      const cachedPhotoUrl = (profile.calculationData as any)?.profileData
        ?.photoUrl;
      if (cachedPhotoUrl && cachedPhotoUrl !== profile.photoUrl) {
        setProfiles((prev) =>
          prev.map((p) =>
            p.id === profile.id ? { ...p, photoUrl: cachedPhotoUrl } : p,
          ),
        );
      }

      setIsOpen(false);
    } else {
      fetchAndSwitchProfile(profile);
    }
  };

  // Fetch fresh profile data if calculationData wasn't cached
  const fetchAndSwitchProfile = async (profile: SavedProfile) => {
    setIsLoading(true);
    try {
      const result = await badgeService.calculatePoints(profile.url, true);

      // Extract badges safely
      const rawBadges: any[] = Array.isArray(result?.badges)
        ? result.badges
        : Array.isArray((result as any)?.user?.badges)
          ? (result as any).user.badges
          : [];
      const totalPoints =
        result?.points?.total ??
        (result as any)?.summary?.totalPoints ??
        (result as any)?.user?.points ??
        0;
      const skillBadgesPts =
        result?.points?.skillBadges ??
        (result as any)?.breakdown?.skill?.points ??
        0;
      const gameBadgesPts =
        result?.points?.gameBadges ??
        (result as any)?.breakdown?.level?.points ??
        0;
      const triviaBadgesPts =
        result?.points?.triviaBadges ??
        (result as any)?.breakdown?.trivia?.points ??
        0;

      const transformedResult = {
        success: true,
        points: result.points || {
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
        profileData: result.profileData || (result as any).user,
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
          milestonePoints: result.points?.milestonePoints || 0,
        },
        milestoneProgress: result.milestoneProgress,
      };

      setCalculationResult(transformedResult as any);
      setProfileUrl(profile.url);
      setCurrentProfileId(profile.id);
      localStorage.setItem("arcadeverse_current_profile_id", profile.id);
      localStorage.setItem(
        "arcadeverseData",
        JSON.stringify(transformedResult),
      );
      localStorage.setItem("arcadeProfileUrl", profile.url);

      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profile.id
            ? {
                ...p,
                calculationData: transformedResult,
                name: result.profileData?.name || p.name,
                memberSince: result.profileData?.memberSince || p.memberSince,
                photoUrl: result.profileData?.photoUrl || p.photoUrl,
                points: result.points?.total || p.points,
                bonusPoints: result.points?.milestonePoints || p.bonusPoints,
              }
            : p,
        ),
      );
      setIsOpen(false);
    } catch {
      alert("Failed to load profile data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a profile
  const removeProfile = (profileId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    const remaining = profiles.filter((p) => p.id !== profileId);
    setProfiles(remaining);
    localStorage.setItem("arcadeverse_profiles", JSON.stringify(remaining));
    window.dispatchEvent(new Event("profilesUpdated"));

    // If removing the currently active profile
    if (currentProfileId === profileId) {
      if (remaining.length > 0) {
        switchProfile(remaining[0]);
      } else {
        // No profiles remain: cleanly return to Add Profile state
        setCurrentProfileId(null);
        setCalculationResult(null);
        setProfileUrl("");
        localStorage.removeItem("arcadeverse_current_profile_id");
        localStorage.removeItem("arcadeverseData");
        localStorage.removeItem("arcadeProfileUrl");
      }
    }
  };

  const hasProfiles = profiles.length > 0;
  const currentProfile =
    profiles.find((p) => p.id === currentProfileId) ||
    (hasProfiles ? profiles[0] : null);

  const displayName = currentProfile
    ? currentProfile.name
    : user.name && user.name !== "Profile"
      ? user.name
      : "";
  const livePoints =
    user.arcadePoints || (calculationResult as any)?.points?.total || 0;
  const displayPoints =
    livePoints > 0 ? livePoints : currentProfile ? currentProfile.points : 0;
  const displayPhotoUrl = currentProfile
    ? currentProfile.photoUrl ||
      (currentProfile.calculationData as any)?.profileData?.photoUrl ||
      user.photoUrl
    : "";

  return (
    <>
      {/* STATE 1: NO PROFILE EXISTS -> Show Add Profile button */}
      {!hasProfiles ? (
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="h-9 rounded-2xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-semibold text-xs sm:text-sm px-3 sm:px-3.5 py-1 flex items-center gap-1.5 sm:gap-2 shadow-sm transition-all shrink-0 cursor-pointer active:scale-95"
          aria-label="Add Profile"
        >
          <UserPlus className="h-4 w-4 shrink-0 stroke-[2.2]" />
          <span className="whitespace-nowrap font-medium">Add Profile</span>
        </button>
      ) : (
        /* STATE 2: PROFILE EXISTS -> Show compact profile selector with dropdown */
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative h-9 rounded-2xl border border-border/80 dark:border-slate-700/60 bg-surface-card hover:bg-surface-hover dark:bg-[#0e1628]/90 dark:hover:bg-[#131d35] px-2 sm:px-3 py-1 text-left flex items-center gap-2 shadow-xs transition-colors cursor-pointer select-none"
              aria-label="Manage profiles"
              aria-expanded={isOpen}
            >
              {/* Avatar / Initial circle */}
              {displayPhotoUrl ? (
                <img
                  src={displayPhotoUrl}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  loading="eager"
                  decoding="sync"
                  className="h-6 w-6 rounded-full object-cover shrink-0"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("ui-avatars.com")) {
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || "User")}&background=B7632E&color=fff&size=80&bold=true&font-size=0.4`;
                    }
                  }}
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-[#B7632E] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  {getInitials(displayName || "User")}
                </div>
              )}

              {/* Name & Points */}
              <div className="hidden sm:flex items-center gap-2 min-w-0">
                <span className="font-bold text-xs text-foreground dark:text-white truncate max-w-[120px] uppercase tracking-wide">
                  {displayName}
                </span>
                <span className="rounded-full bg-indigo-500/15 dark:bg-indigo-500/20 border border-indigo-500/30 dark:border-indigo-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
                  {displayPoints} PTS
                </span>
              </div>

              {/* Chevron */}
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-muted-foreground dark:text-slate-400 shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-[300px] sm:w-[320px] p-2.5 rounded-2xl border border-border dark:border-slate-800 bg-surface-card dark:bg-[#0c1424] shadow-2xl z-50 animate-in fade-in-50 zoom-in-95 duration-150"
          >
            {/* Header: MANAGE PROFILES (N) */}
            <div className="px-2 pt-1 pb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground dark:text-slate-400 font-bold">
                MANAGE PROFILES ({profiles.length})
              </span>
            </div>

            <div className="border-b border-border/80 dark:border-slate-800/80 mb-2" />

            {/* Profiles list */}
            <div className="max-h-64 overflow-y-auto space-y-1.5 no-scrollbar py-0.5">
              {profiles.map((profile) => {
                const isSelected = profile.id === currentProfileId;
                const initials = getInitials(profile.name);
                const photo =
                  profile.photoUrl ||
                  (profile.calculationData as any)?.profileData?.photoUrl;

                return (
                  <div
                    key={profile.id}
                    onClick={() => switchProfile(profile)}
                    className={cn(
                      "group flex items-center justify-between gap-2.5 p-2 rounded-xl cursor-pointer transition-all",
                      isSelected
                        ? "border border-indigo-500/50 bg-indigo-500/10 dark:bg-indigo-950/40 shadow-xs"
                        : "border border-transparent hover:border-border dark:hover:border-slate-800 hover:bg-surface-hover/70 dark:hover:bg-slate-800/50",
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {photo ? (
                        <img
                          src={photo}
                          alt={profile.name}
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          loading="eager"
                          decoding="sync"
                          className="h-9 w-9 rounded-full object-cover shrink-0 border border-border/60"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.src.includes("ui-avatars.com")) {
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "User")}&background=B7632E&color=fff&size=80&bold=true&font-size=0.4`;
                            }
                          }}
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-[#B7632E] flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-xs">
                          {initials}
                        </div>
                      )}

                      <div className="min-w-0 flex-1 text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-foreground dark:text-white truncate">
                            {profile.name}
                          </span>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400 shrink-0 stroke-[3]" />
                          )}
                        </div>
                        <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {isSelected && livePoints > 0
                            ? livePoints
                            : profile.points}{" "}
                          PTS
                        </div>
                      </div>
                    </div>

                    {/* Delete action */}
                    <button
                      type="button"
                      onClick={(e) => removeProfile(profile.id, e)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
                      title="Delete profile"
                      aria-label={`Delete profile ${profile.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border/80 dark:border-slate-800/80 my-2" />

            {/* + Add New Profile Button */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsAddModalOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-[0.98]"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Add New Profile</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Reusable Profile Input Modal */}
      <AddProfileModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProfileAdded={(newProfile) => {
          switchProfile(newProfile);
        }}
      />
    </>
  );
}
