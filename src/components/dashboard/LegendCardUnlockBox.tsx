import { Lock } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface LegendCardUnlockBoxProps {
  isUnlocked: boolean;
  onOpen: () => void;
  requiredPoints?: number;
  className?: string;
}

export function LegendCardUnlockBox({
  isUnlocked,
  onOpen,
  requiredPoints = 120,
  className = "",
}: LegendCardUnlockBoxProps) {
  if (!isUnlocked) {
    return (
      <button
        type="button"
        aria-disabled="true"
        aria-label={`Legend Achievement Card Locked: Reach ${requiredPoints} points to unlock`}
        onClick={() => {
          toast.info(
            `Reach ${requiredPoints} Arcade Points to unlock your Legend Achievement Card.`,
            { id: "legend-card-locked-info" },
          );
        }}
        className={`group flex flex-col items-start justify-center rounded-xl border border-border/70 bg-surface-elevated/40 dark:bg-slate-900/60 px-3 py-1.5 text-left transition-all duration-200 hover:border-border hover:bg-surface-elevated/60 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 shrink-0 ${className}`}
      >
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
          <Lock className="h-3 w-3 text-muted-foreground/80 shrink-0" />
          <span>LEGEND CARD LOCKED</span>
        </div>
        <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 leading-tight mt-0.5">
          Reach {requiredPoints} points
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label="Legend Achievement Card Unlocked: Click to view"
      onClick={onOpen}
      className={`group flex flex-col items-start justify-center rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 hover:from-amber-500/20 hover:via-purple-500/20 hover:to-indigo-500/20 px-3 py-1.5 text-left cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-amber-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 shrink-0 ${className}`}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-500 dark:text-amber-400">
        <span className="text-xs leading-none">🏆</span>
        <span>LEGEND CARD UNLOCKED</span>
      </div>
      <div className="text-[11px] font-bold text-foreground dark:text-white group-hover:text-amber-300 dark:group-hover:text-amber-200 leading-tight mt-0.5 flex items-center gap-1 transition-colors">
        <span>View Achievement Card</span>
        <span className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </div>
    </button>
  );
}
