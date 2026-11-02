import type React from "react";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Profile } from "./profile-context";

export interface LeaderboardEntry {
  profileUrl: string;
  name: string;
  photoUrl?: string;
  points: number;
  badges: number;
  lastUpdated: string;
  rank?: number; // Rank will be calculated by backend
  isDemo?: boolean;
}

interface LeaderboardContextType {
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  userRank?: number;
  totalParticipants?: number;
  updateLeaderboardEntry: (profile: Profile) => Promise<void>;
  getLeaderboard: () => LeaderboardEntry[];
  refreshLeaderboard: (force?: boolean) => Promise<void>;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(
  undefined,
);

interface LeaderboardProviderProps {
  children: ReactNode;
}

import { INITIAL_LEADERBOARD_DATA } from "@/data/leaderboardData";
import { apiPath } from "@/lib/api";

export const LeaderboardProvider: React.FC<LeaderboardProviderProps> = ({
  children,
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = sessionStorage.getItem("arcadeverse_leaderboard_cache");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_LEADERBOARD_DATA;
  });
  const [userRank, setUserRank] = useState<number | undefined>(() => {
    try {
      const saved = sessionStorage.getItem("arcadeverse_user_rank");
      if (saved) return Number(saved);
    } catch {}
    return undefined;
  });
  const [totalParticipants, setTotalParticipants] = useState<
    number | undefined
  >(() => {
    try {
      const saved = sessionStorage.getItem("arcadeverse_total_participants");
      if (saved) return Number(saved);
    } catch {}
    return undefined;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const inFlightFetchMapRef = useRef<Map<string, Promise<void>>>(new Map());
  const lastFetchTimeMapRef = useRef<Map<string, number>>(new Map());

  const fetchGlobalLeaderboard = useCallback(
    async (force = false, profileUrl?: string) => {
      const now = Date.now();
      const throttleKey = profileUrl
        ? profileUrl.trim().toLowerCase()
        : "__global__";
      const lastFetch = lastFetchTimeMapRef.current.get(throttleKey) || 0;

      // Throttle: don't re-fetch if fetched within the last 60 seconds unless forced by user click
      if (!force && now - lastFetch < 60000) {
        return;
      }

      // Coalesce: if a fetch is already in flight for this key, reuse that existing promise
      if (inFlightFetchMapRef.current.has(throttleKey)) {
        return inFlightFetchMapRef.current.get(throttleKey);
      }

      const fetchPromise = (async () => {
        setIsLoading(true);
        setError(null);
        try {
          const query = profileUrl
            ? `?profileUrl=${encodeURIComponent(profileUrl)}`
            : "";
          const response = await fetch(apiPath(`/api/leaderboard${query}`), {
            cache: "default",
          });

          if (!response.ok) {
            throw new Error(
              `Failed to load leaderboard: ${response.statusText}`,
            );
          }

          const rawData = await response.json();
          const data = Array.isArray(rawData)
            ? rawData
            : rawData.leaderboard || [];

          if (!Array.isArray(rawData)) {
            if (typeof rawData.userRank === "number" && rawData.userRank > 0) {
              setUserRank(rawData.userRank);
              try {
                sessionStorage.setItem(
                  "arcadeverse_user_rank",
                  String(rawData.userRank),
                );
              } catch {}
            }
            if (
              typeof rawData.totalParticipants === "number" &&
              rawData.totalParticipants > 0
            ) {
              setTotalParticipants(rawData.totalParticipants);
              try {
                sessionStorage.setItem(
                  "arcadeverse_total_participants",
                  String(rawData.totalParticipants),
                );
              } catch {}
            }
          }

          if (Array.isArray(data) && data.length > 0) {
            const mappedData = data.map((entry: LeaderboardEntry) => {
              const isMock =
                entry.isDemo ??
                entry.profileUrl?.includes("/public_profiles/user");
              return {
                ...entry,
                isDemo: isMock,
                photoUrl: isMock ? undefined : entry.photoUrl,
              };
            });
            setLeaderboard(mappedData);
            try {
              sessionStorage.setItem(
                "arcadeverse_leaderboard_cache",
                JSON.stringify(mappedData),
              );
            } catch {}
          }
          lastFetchTimeMapRef.current.set(throttleKey, Date.now());
        } catch {
          // Keep current data or fallback
        } finally {
          setIsLoading(false);
          inFlightFetchMapRef.current.delete(throttleKey);
        }
      })();

      inFlightFetchMapRef.current.set(throttleKey, fetchPromise);
      return fetchPromise;
    },
    [],
  );

  // Fetch global leaderboard once on mount
  useEffect(() => {
    fetchGlobalLeaderboard();
  }, [fetchGlobalLeaderboard]);

  const inFlightUpdateMapRef = useRef<Map<string, Promise<void>>>(new Map());
  const lastSubmittedHashRef = useRef<
    Map<string, { signature: string; timestamp: number }>
  >(new Map());

  const updateLeaderboardEntry = useCallback(async (profile: Profile) => {
    if (!profile || !profile.calculationResponse) return;

    const cResp = profile.calculationResponse as any;
    const newPoints = Number(
      cResp?.points?.total ??
        cResp?.summary?.totalPoints ??
        cResp?.user?.points ??
        (profile as any).points ??
        0,
    );
    const newBadges = Number(
      cResp?.badges?.length ??
        cResp?.user?.badges?.length ??
        (profile as any).badges ??
        0,
    );
    const newName = (
      profile.name ||
      cResp?.profileData?.name ||
      cResp?.user?.name ||
      "Arcade Participant"
    ).trim();
    const newPhoto =
      cResp?.profileData?.photoUrl ||
      cResp?.user?.photoUrl ||
      (profile as any).photoUrl;
    const normalizedUrl = (profile.profileUrl || "").trim();
    if (!normalizedUrl) return;
    const lowerUrl = normalizedUrl.toLowerCase();

    // Optimistic local update so user immediately appears in rankings without delay
    setLeaderboard((prev) => {
      const existing = prev.filter(
        (e) =>
          e.profileUrl.toLowerCase() !== lowerUrl &&
          e.name.toLowerCase() !== newName.toLowerCase(),
      );
      const updated = [
        ...existing,
        {
          profileUrl: normalizedUrl,
          name: newName,
          photoUrl: newPhoto,
          points: newPoints,
          badges: newBadges,
          lastUpdated: new Date().toISOString(),
          isDemo: false,
        },
      ];

      const realUsers = updated.filter(
        (e) => !e.isDemo && !e.profileUrl.includes("/public_profiles/user"),
      );
      const demoUsers = updated.filter(
        (e) => e.isDemo || e.profileUrl.includes("/public_profiles/user"),
      );

      // If we have 50 or more real users, completely wipe out all demo users
      let combined: LeaderboardEntry[];
      if (realUsers.length >= 50) {
        combined = realUsers;
      } else {
        combined = [...realUsers, ...demoUsers];
      }

      const ranked = combined
        .sort((a, b) => b.points - a.points)
        .slice(0, 50)
        .map((entry, idx) => ({
          ...entry,
          rank: idx + 1,
        }));

      try {
        sessionStorage.setItem(
          "arcadeverse_leaderboard_cache",
          JSON.stringify(ranked),
        );
      } catch {}

      return ranked;
    });

    // Idempotency check: if this profile was already submitted with identical points/badges within 60s, skip network write
    const currentSignature = `${lowerUrl}:${newPoints}:${newBadges}:${newName.toLowerCase()}:${newPhoto || ""}`;
    const previous = lastSubmittedHashRef.current.get(lowerUrl);
    const now = Date.now();
    if (
      previous &&
      previous.signature === currentSignature &&
      now - previous.timestamp < 60000
    ) {
      return;
    }

    // In-flight deduplication: if an HTTP POST is already underway for this profile, reuse that promise
    if (inFlightUpdateMapRef.current.has(lowerUrl)) {
      return inFlightUpdateMapRef.current.get(lowerUrl);
    }

    const updatePromise = (async () => {
      try {
        const response = await fetch(apiPath("/api/leaderboard"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profileUrl: normalizedUrl,
            name: newName,
            photoUrl: newPhoto,
            points: newPoints,
            badges: newBadges,
          }),
        });

        if (!response.ok) {
          return;
        }

        const rawData = await response.json();
        const list = Array.isArray(rawData)
          ? rawData
          : rawData.leaderboard || [];

        if (!Array.isArray(rawData)) {
          if (typeof rawData.userRank === "number" && rawData.userRank > 0) {
            setUserRank(rawData.userRank);
            try {
              sessionStorage.setItem(
                "arcadeverse_user_rank",
                String(rawData.userRank),
              );
            } catch {}
          }
          if (
            typeof rawData.totalParticipants === "number" &&
            rawData.totalParticipants > 0
          ) {
            setTotalParticipants(rawData.totalParticipants);
            try {
              sessionStorage.setItem(
                "arcadeverse_total_participants",
                String(rawData.totalParticipants),
              );
            } catch {}
          }
        }

        if (Array.isArray(list) && list.length > 0) {
          const mappedUpdated = list.map((entry: LeaderboardEntry) => ({
            ...entry,
            photoUrl:
              entry.photoUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name || "User")}&background=B7632E&color=fff&size=200&bold=true&font-size=0.4`,
          }));
          setLeaderboard(mappedUpdated);
          try {
            sessionStorage.setItem(
              "arcadeverse_leaderboard_cache",
              JSON.stringify(mappedUpdated),
            );
          } catch {}
          lastFetchTimeMapRef.current.set("__global__", Date.now());
        }

        lastSubmittedHashRef.current.set(lowerUrl, {
          signature: currentSignature,
          timestamp: Date.now(),
        });
      } catch {
        // Silent error handling: preserve optimistic state
      } finally {
        inFlightUpdateMapRef.current.delete(lowerUrl);
      }
    })();

    inFlightUpdateMapRef.current.set(lowerUrl, updatePromise);
    return updatePromise;
  }, []);

  const getLeaderboardSorted = useCallback((): LeaderboardEntry[] => {
    return leaderboard;
  }, [leaderboard]);

  const contextValue = useMemo(
    () => ({
      leaderboard,
      isLoading,
      error,
      userRank,
      totalParticipants,
      updateLeaderboardEntry,
      getLeaderboard: getLeaderboardSorted,
      refreshLeaderboard: fetchGlobalLeaderboard,
    }),
    [
      leaderboard,
      isLoading,
      error,
      userRank,
      totalParticipants,
      updateLeaderboardEntry,
      getLeaderboardSorted,
      fetchGlobalLeaderboard,
    ],
  );

  return (
    <LeaderboardContext.Provider value={contextValue}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error("useLeaderboard must be used within a LeaderboardProvider");
  }
  return context;
};
