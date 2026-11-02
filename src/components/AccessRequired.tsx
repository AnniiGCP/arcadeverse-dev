import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useCalculation } from "@/lib/calculation-context";
import { badgeService } from "@/services/badgeService";
import { motion } from "framer-motion";
import { Lock, Shield, Star } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function AccessRequired() {
  const [profileUrl, setProfileUrl] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState("");
  const { setCalculationResult, setProfileUrl: setContextProfileUrl } =
    useCalculation();
  const navigate = useNavigate();

  const handleCalculate = async () => {
    if (!profileUrl.trim()) {
      setError("Please enter your SkillBoost profile URL");
      return;
    }

    setIsCalculating(true);
    setError("");

    try {
      const result = await badgeService.calculatePoints(profileUrl, true);

      // Transform to match dashboard context format
      const transformedResult = {
        success: true,
        user: {
          points: result.points.total,
          badges: result.badges,
        },
        profileData: result.profileData,
        breakdown: {
          skill: {
            count: 0,
            points: result.points.skillBadges,
            pointsPerBadge: 0.5,
          },
          level: {
            count: 0,
            points: result.points.gameBadges,
            pointsPerBadge: 1,
          },
          trivia: {
            count: 0,
            points: result.points.triviaBadges,
            pointsPerBadge: 1,
          },
          completion: { count: 0, points: 0, pointsPerBadge: 0 },
        },
        summary: {
          skillBadges: result.badges.filter((b) => b.type === "skill").length,
          levelBadges: result.badges.filter(
            (b) => b.type === "game" || b.type === "trivia",
          ).length,
          triviaBadges: result.badges.filter((b) => b.type === "trivia").length,
          completionBadges: result.badges.filter((b) => b.type === "completion")
            .length,
          totalPoints: result.points.total,
          milestonePoints: result.points.milestonePoints || 0,
        },
        milestoneProgress: result.milestoneProgress,
      };

      setCalculationResult(transformedResult as any);
      setContextProfileUrl(profileUrl);

      // Save to profiles list
      const existingSavedProfiles = JSON.parse(
        localStorage.getItem("arcadeverse_profiles") || "[]",
      );
      const profileExists = existingSavedProfiles.some(
        (p: any) => p.url === profileUrl,
      );

      if (!profileExists) {
        const newProfile = {
          id: Date.now().toString(),
          name: result.profileData?.name || "User",
          url: profileUrl,
          memberSince: result.profileData?.memberSince,
          photoUrl: result.profileData?.photoUrl,
          points: result.points?.total || 0,
          bonusPoints: result.points?.milestonePoints || 0,
          addedAt: new Date().toISOString(),
          calculationData: transformedResult,
        };

        existingSavedProfiles.push(newProfile);
        localStorage.setItem(
          "arcadeverse_profiles",
          JSON.stringify(existingSavedProfiles),
        );
        window.dispatchEvent(new Event("profilesUpdated"));
      }

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to calculate points",
      );
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <>
      <Header />
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 pt-20">
        <div
          className="pointer-events-none absolute inset-0 bg-aurora"
          aria-hidden
        />
        {/* Animated background stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 right-20"
            animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            <Star className="text-purple-400/30" size={24} />
          </motion.div>
          <motion.div
            className="absolute top-40 left-32"
            animate={{ y: [0, 20, 0], rotate: [0, -180, -360] }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: 0.5,
            }}
          >
            <Star className="text-purple-300/20" size={16} />
          </motion.div>
          <motion.div
            className="absolute bottom-32 right-40"
            animate={{ y: [0, -15, 0], rotate: [0, 90, 180] }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: 1,
            }}
          >
            <Star className="text-yellow-400/30" size={20} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-2xl w-full"
        >
          <div className="bg-surface-elevated/80 backdrop-blur-xl rounded-2xl border border-border/50 p-8 md:p-12 shadow-2xl">
            {/* Lock Icon with animation */}
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Lock className="text-purple-400" size={48} />
                </motion.div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Star className="text-purple-300" size={16} />
                </motion.div>
                <motion.div
                  className="absolute -bottom-1 -left-2"
                  animate={{ y: [0, 5, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.5,
                  }}
                >
                  <Star className="text-yellow-400" size={14} />
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Access Required
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-foreground text-center mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              To track your Arcade Points, enter your{" "}
              <span className="text-purple-400 font-semibold">
                Google Cloud SkillBoost
              </span>{" "}
              profile URL below. Once added, you can switch profiles seamlessly
              anytime from the navbar.
            </motion.p>

            {/* Input Section */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your SkillBoost profile URL"
                  value={profileUrl}
                  onChange={(e) => {
                    setProfileUrl(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isCalculating) {
                      handleCalculate();
                    }
                  }}
                  disabled={isCalculating}
                  className="w-full px-4 py-4 bg-background/50 border border-border/50 rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-400 text-sm flex items-center gap-2"
                >
                  <span className="text-lg">⚠️</span>
                  {error}
                </motion.p>
              )}

              <Button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-6 rounded-lg transition-all shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Calculating...</span>
                  </div>
                ) : (
                  "Calculate Points"
                )}
              </Button>

              <Link
                to="/resources/find-your-public-url"
                className="w-full text-purple-400 hover:text-purple-300 text-sm py-2 transition-colors flex items-center justify-center gap-2"
              >
                Need help finding your URL? →
              </Link>
            </motion.div>

            {/* Security Note */}
            <motion.div
              className="mt-8 flex items-center justify-center gap-2 text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Shield size={16} />
              <span>Your data remains private and secure</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
