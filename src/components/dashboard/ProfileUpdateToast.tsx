import React from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export function ProfileUpdateToast() {
  const { refreshStatus, refreshError, refreshDiff, dismissToast } =
    useDashboard();
  const reduce = useReducedMotion();

  return (
    <div
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-24 z-50 pointer-events-auto"
      style={{ isolation: "isolate" }}
    >
      <AnimatePresence mode="wait">
        {refreshStatus === "refreshing" && (
          <motion.div
            key="refreshing"
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="status"
            aria-live="polite"
            className="flex items-center gap-2.5 rounded-full bg-[#f5b838] px-4 py-2.5 sm:px-4.5 sm:py-2.5 text-xs sm:text-[13px] font-bold text-black shadow-xl border border-amber-600/20 select-none"
          >
            <span
              className="flex items-center gap-1 shrink-0"
              aria-hidden="true"
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-black animate-pulse"
                style={{ animationDuration: "1s" }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full bg-black animate-pulse"
                style={{ animationDuration: "1s", animationDelay: "200ms" }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full bg-black animate-pulse"
                style={{ animationDuration: "1s", animationDelay: "400ms" }}
              />
            </span>
            <span>Updating Profile Data...</span>
          </motion.div>
        )}

        {refreshStatus === "success" &&
          refreshDiff &&
          (refreshDiff.pointsEarned > 0 || refreshDiff.badgesEarned > 0) && (
            <motion.div
              key="success"
              initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              role="status"
              aria-live="polite"
              className="rounded-2xl border border-white/10 bg-[#13151b]/95 p-4 shadow-2xl backdrop-blur-md min-w-[280px] sm:min-w-[320px] max-w-[calc(100vw-2.5rem)] text-left"
            >
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  Profile Progress Updated
                </h4>
                <button
                  type="button"
                  onClick={dismissToast}
                  className="text-zinc-400 hover:text-white transition-colors p-0.5 rounded-md focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-accent-purple"
                  aria-label="Close notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
                <CheckCircle2
                  className="h-3.5 w-3.5 text-zinc-400 shrink-0 stroke-[2]"
                  aria-hidden="true"
                />
                <span>
                  {formatProgressDiff(
                    refreshDiff.pointsEarned,
                    refreshDiff.badgesEarned,
                  )}
                </span>
              </div>
            </motion.div>
          )}

        {refreshStatus === "error" && (
          <motion.div
            key="error"
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="alert"
            className="rounded-2xl border border-rose-500/30 bg-[#13151b]/95 p-4 shadow-2xl backdrop-blur-md min-w-[280px] sm:min-w-[320px] max-w-[calc(100vw-2.5rem)] text-left"
          >
            <div className="flex items-center justify-between gap-3 mb-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0 stroke-[2]" />
                <h4 className="text-xs sm:text-sm font-bold text-rose-400 tracking-tight">
                  Profile Sync Notice
                </h4>
              </div>
              <button
                type="button"
                onClick={dismissToast}
                className="text-zinc-400 hover:text-white transition-colors p-0.5 rounded-md focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-accent-purple"
                aria-label="Close notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-xs text-zinc-400 pl-5.5">
              {refreshError ||
                "Unable to reach Google Cloud • Preserving cached points"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatProgressDiff(
  pointsEarned: number,
  badgesEarned: number,
): string {
  const pointsPart =
    pointsEarned > 0
      ? `+${pointsEarned} Arcade Point${pointsEarned === 1 ? "" : "s"}`
      : "";
  const badgesPart =
    badgesEarned > 0
      ? `${badgesEarned} new badge${badgesEarned === 1 ? "" : "s"}`
      : "";

  if (pointsPart && badgesPart) {
    return `${pointsPart} and ${badgesPart} earned.`;
  }
  if (pointsPart) {
    return `${pointsPart} earned.`;
  }
  if (badgesPart) {
    return `+${badgesPart} earned.`;
  }
  return "Profile details updated.";
}

export default ProfileUpdateToast;
