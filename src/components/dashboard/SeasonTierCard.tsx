import type { SwagTierConfig } from "@/config/tierAvailability";
import { Check } from "lucide-react";
import type React from "react";

interface SeasonTierCardProps {
  tier: SwagTierConfig;
  isUnlocked: boolean;
  onClick: () => void;
}

export const SeasonTierCard: React.FC<SeasonTierCardProps> = ({
  tier,
  isUnlocked,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View ${tier.name} swags and rewards`}
      className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-300 overflow-hidden text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple focus-visible:ring-offset-2 w-full ${
        isUnlocked
          ? "border-emerald-500/50 bg-[#0c1220] shadow-[0_0_15px_rgba(16,185,129,0.12)] hover:border-emerald-400/80"
          : "border-border/80 dark:border-slate-800/80 bg-surface-card dark:bg-[#0c1220] hover:border-border-strong dark:hover:border-slate-700 hover:shadow-lg"
      } hover:-translate-y-1`}
    >
      {/* Upper-right circular green check icon when unlocked/eligible */}
      {isUnlocked && (
        <div
          className="absolute top-3.5 right-3.5 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-[#0c1220]"
          title="Tier Unlocked"
          aria-label="Tier Unlocked"
        >
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        </div>
      )}

      {/* Subtle tier badge on top-left if Champion / Legend (matching reference Ps badge) */}
      {(tier.id === "champion" || tier.id === "legend") && (
        <div className="absolute top-3.5 left-3.5 z-20 flex items-center justify-center rounded bg-blue-500/20 border border-blue-400/30 px-1.5 py-0.5 text-[10px] font-bold text-blue-400 select-none">
          Ps
        </div>
      )}

      {/* Enlarged Product Artwork Area with subtle diagonal stripes matching reference */}
      <div className="relative w-full h-56 sm:h-64 flex items-center justify-center p-4 sm:p-5 overflow-hidden bg-[#070b14]/80">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.04) 0px, rgba(255, 255, 255, 0.04) 1px, transparent 1px, transparent 12px)",
          }}
        />

        <img
          src={tier.image}
          alt={`${tier.name} merchandise artwork`}
          className="relative z-10 max-h-full max-w-full object-contain drop-shadow-xl select-none transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Tier Details Section */}
      <div className="p-4 sm:p-5 pt-3.5 flex flex-col gap-2.5 border-t border-slate-800/80 bg-[#0c1220]">
        <h4 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug truncate">
          {tier.name}
        </h4>

        {/* Required Points Pill */}
        <div>
          <span className="inline-block rounded-full bg-[#2563eb] text-white px-3 py-1 text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-sm">
            {tier.pointsRequired} PTS REQUIRED
          </span>
        </div>

        {/* Bottom Pills Row: Revealed Count + More to come */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold whitespace-nowrap">
            {tier.revealedCount} Items Revealed
          </span>
          <span className="rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold whitespace-nowrap">
            + More to come
          </span>
        </div>
      </div>
    </button>
  );
};
