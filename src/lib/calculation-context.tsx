import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

export interface CalculationResult {
  success: boolean;
  user: {
    points: number;
    badges: Array<{
      name: string;
      type: string;
      points: number;
      category: string;
      completed: boolean;
      earnedDate?: string;
    }>;
  };
  profileData?: {
    name: string;
    memberSince: string;
    photoUrl?: string;
    league?: string;
    skillsPoints?: number;
  };
  breakdown: {
    skill: { count: number; points: number; pointsPerBadge: number };
    level: { count: number; points: number; pointsPerBadge: number };
    trivia: { count: number; points: number; pointsPerBadge: number };
    completion: { count: number; points: number; pointsPerBadge: number };
  };
  summary: {
    skillBadges: number;
    levelBadges: number;
    triviaBadges: number;
    completionBadges: number;
    totalPoints: number;
    milestonePoints?: number;
  };
}

interface CalculationContextType {
  calculationResult: CalculationResult | null;
  setCalculationResult: (result: CalculationResult | null) => void;
  profileUrl: string;
  setProfileUrl: (url: string) => void;
  isCalculating: boolean;
  setIsCalculating: (calculating: boolean) => void;
}

const CalculationContext = createContext<CalculationContextType | undefined>(
  undefined,
);

export function CalculationProvider({ children }: { children: ReactNode }) {
  // Initialize with safe defaults for SSR
  const [calculationResult, setCalculationResult] =
    useState<CalculationResult | null>(null);
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client-side mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCalc = localStorage.getItem("arcadeverseData");
        if (savedCalc) {
          setCalculationResult(JSON.parse(savedCalc));
        }
      } catch (error) {
        // Silent error handling
      }

      try {
        const savedUrl = localStorage.getItem("arcadeProfileUrl");
        if (savedUrl) {
          setProfileUrl(savedUrl);
        }
      } catch (error) {
        // Silent error handling
      }

      setIsHydrated(true);
    }
  }, []);

  // Wrapper function to save data when setting calculation result
  const saveCalculationResult = useCallback(
    (result: CalculationResult | null) => {
      setCalculationResult(result);
      if (typeof window !== "undefined") {
        try {
          if (result) {
            localStorage.setItem("arcadeverseData", JSON.stringify(result));
          } else {
            localStorage.removeItem("arcadeverseData");
          }
        } catch (error) {
          // Silent error handling
        }
      }
    },
    [],
  );

  // Wrapper function to save profile URL
  const saveProfileUrl = useCallback((url: string) => {
    setProfileUrl(url);
    if (typeof window !== "undefined") {
      try {
        if (url) {
          localStorage.setItem("arcadeProfileUrl", url);
        } else {
          localStorage.removeItem("arcadeProfileUrl");
        }
      } catch (error) {
        // Silent error handling
      }
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      calculationResult,
      setCalculationResult: saveCalculationResult,
      profileUrl,
      setProfileUrl: saveProfileUrl,
      isCalculating,
      setIsCalculating,
    }),
    [
      calculationResult,
      saveCalculationResult,
      profileUrl,
      saveProfileUrl,
      isCalculating,
      setIsCalculating,
    ],
  );

  return (
    <CalculationContext.Provider value={contextValue}>
      {children}
    </CalculationContext.Provider>
  );
}

export function useCalculation() {
  const context = useContext(CalculationContext);
  if (context === undefined) {
    throw new Error("useCalculation must be used within a CalculationProvider");
  }
  return context;
}
