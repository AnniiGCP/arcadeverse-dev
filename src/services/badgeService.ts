import { apiPath } from "@/lib/api";
import type { BadgeType } from "../lib/calculationLogic";

export interface Badge {
  name: string;
  type: BadgeType;
  earnedDate: string;
}

export interface CalculationResponse {
  points: {
    total: number;
    gameBadges: number;
    triviaBadges: number;
    skillBadges: number;
    milestonePoints: number;
  };
  badges: Badge[];
  profileData: {
    name: string;
    memberSince: string;
    photoUrl?: string;
    league?: string;
    skillsPoints?: number;
  };
  milestoneProgress?: {
    currentMilestone: number;
    progress: number;
  };
}

class BadgeService {
  async calculatePoints(
    profileUrl: string,
    isFacilitator = false,
    bonusMilestone = false,
  ): Promise<CalculationResponse> {
    const query = `profileUrl=${encodeURIComponent(profileUrl)}&isFacilitator=${encodeURIComponent(String(isFacilitator))}&bonusMilestone=${encodeURIComponent(String(bonusMilestone))}`;
    const primaryUrl = `${apiPath("/api/calculate-points")}?${query}`;

    // Helper to fetch and parse calculation endpoint
    const tryFetch = async (endpoint: string): Promise<CalculationResponse> => {
      const response = await fetch(endpoint);
      if (!response.ok) {
        const text = await response.text();
        try {
          const errorData = JSON.parse(text);
          throw new Error(
            errorData.error ||
              errorData.message ||
              `HTTP error ${response.status}`,
          );
        } catch (e: any) {
          if (e.message && !e.message.startsWith("Unexpected")) throw e;
          throw new Error(`Server returned HTTP ${response.status}`);
        }
      }
      return await response.json();
    };

    try {
      const result = await tryFetch(primaryUrl);
      // Whenever an account is analyzed from anywhere in the website, increment the global counter
      fetch(apiPath("/api/profile-analyzed"), { method: "POST" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("arcadeverse_stats_updated", { detail: data }),
            );
          }
        })
        .catch(() => {});
      return result;
    } catch (primaryErr: any) {
      // If running on localhost and proxy or relative route failed with network error, try direct port 3001
      if (
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1") &&
        !primaryUrl.includes(":3001")
      ) {
        try {
          const directUrl = `http://localhost:3001/api/calculate-points?${query}`;
          const directResult = await tryFetch(directUrl);
          fetch(apiPath("/api/profile-analyzed"), { method: "POST" })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
              if (data && typeof window !== "undefined") {
                window.dispatchEvent(
                  new CustomEvent("arcadeverse_stats_updated", {
                    detail: data,
                  }),
                );
              }
            })
            .catch(() => {});
          return directResult;
        } catch {
          // Continue to throw primary error below
        }
      }

      if (primaryErr instanceof Error) {
        throw primaryErr;
      }
      throw new Error(
        "Failed to calculate points. Please check that your profile URL is correct and public.",
      );
    }
  }

  async getProfileBadges(profileUrl: string): Promise<Badge[]> {
    // This function can be updated to fetch badges from the backend if needed
    // For now, it will rely on the calculatePoints endpoint
    const result = await this.calculatePoints(profileUrl);
    return result.badges;
  }

  async getProfilePointsSummary(
    profileUrl: string,
    isFacilitator = false,
    bonusMilestone = false,
  ): Promise<CalculationResponse> {
    return this.calculatePoints(profileUrl, isFacilitator, bonusMilestone);
  }
}

export const badgeService = new BadgeService();
