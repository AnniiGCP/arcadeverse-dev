import { SeasonSwagModal } from "@/components/dashboard/SeasonSwagModal";
import { SeasonTierCard } from "@/components/dashboard/SeasonTierCard";
import {
  type SwagTierConfig,
  TIER_AVAILABILITY_CONFIG,
} from "@/config/tierAvailability";
import type React from "react";
import { useState } from "react";

interface SeasonPrizesSectionProps {
  currentPoints: number;
}

export const SeasonPrizesSection: React.FC<SeasonPrizesSectionProps> = ({
  currentPoints,
}) => {
  const [selectedTier, setSelectedTier] = useState<SwagTierConfig | null>(null);

  return (
    <div className="rounded-2xl border border-border/80 bg-surface-card dark:bg-[#090d18] p-4 sm:p-5 shadow-card-premium transition-all duration-300 hover:border-border-strong w-full">
      {/* Section Header matching Screenshot */}
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
        SEASON PRIZES & SWAGS
      </h3>

      {/* 4 Cards vertically stacked in sidebar */}
      <div className="flex flex-col gap-3.5">
        {TIER_AVAILABILITY_CONFIG.map((tier) => {
          const isUnlocked = currentPoints >= tier.pointsRequired;
          return (
            <SeasonTierCard
              key={tier.id}
              tier={tier}
              isUnlocked={isUnlocked}
              onClick={() => setSelectedTier(tier)}
            />
          );
        })}
      </div>

      {/* Detail Modal */}
      <SeasonSwagModal
        tier={selectedTier}
        isUnlocked={
          selectedTier ? currentPoints >= selectedTier.pointsRequired : false
        }
        isOpen={Boolean(selectedTier)}
        onClose={() => setSelectedTier(null)}
      />
    </div>
  );
};
