import { AccessRequired } from "@/components/AccessRequired";
import { useCalculation } from "@/lib/calculation-context";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { profileUrl, calculationResult } = useCalculation();
  const [isLoading, setIsLoading] = useState(true);

  // Give time for localStorage to be read on mount
  useEffect(() => {
    // Small delay to ensure localStorage has been read
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Check if user has entered a profile URL or has calculation result
  const hasAccess = profileUrl || calculationResult;

  // Show nothing while checking localStorage
  if (isLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
        <div
          className="pointer-events-none absolute inset-0 bg-aurora"
          aria-hidden
        />
        <div className="relative text-center">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    // Show AccessRequired screen if no profile URL is set
    return <AccessRequired />;
  }

  return <>{children}</>;
}
