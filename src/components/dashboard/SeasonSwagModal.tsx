import type { SwagTierConfig } from "@/config/tierAvailability";
import { Check, ExternalLink, Gift, X } from "lucide-react";
import type React from "react";
import { useEffect, useRef } from "react";

interface SeasonSwagModalProps {
  tier: SwagTierConfig | null;
  isUnlocked: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const SeasonSwagModal: React.FC<SeasonSwagModalProps> = ({
  tier,
  isUnlocked,
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Handle Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Prevent background scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !tier) return null;

  return (
    <dialog
      open
      aria-modal="true"
      aria-labelledby="season-swag-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 m-0 max-w-none max-h-none w-screen h-screen border-none"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-[#0b101d] border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching Reference (Image 3 & 4) */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <Gift className="w-5 h-5 text-blue-500 shrink-0" />
              <h3
                id="season-swag-modal-title"
                className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug truncate"
              >
                {tier.name} Swags
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {tier.description}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 pt-0.5">
            {/* Required Points Pill */}
            <span className="rounded-full bg-[#2563eb] text-white px-3 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
              {tier.pointsRequired} PTS REQUIRED
            </span>

            {/* Unlocked green check icon */}
            {isUnlocked && (
              <span
                className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-2 ring-[#0b101d]"
                title="Tier Unlocked"
                aria-label="Tier Unlocked"
              >
                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[3]" />
              </span>
            )}

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px w-full bg-slate-800/80" />

        {/* Enlarged Merchandise Artwork Container matching Reference */}
        <div className="relative w-full rounded-2xl bg-[#070b14] border border-slate-800/80 p-5 sm:p-7 flex items-center justify-center min-h-[280px] sm:min-h-[360px] overflow-hidden">
          {/* Subtle diagonal stripe texture */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0px, rgba(255, 255, 255, 0.05) 1px, transparent 1px, transparent 12px)",
            }}
          />

          {/* Optional Ps badge inside modal image for Champion/Legend matching reference */}
          {(tier.id === "champion" || tier.id === "legend") && (
            <div className="absolute top-4 left-4 z-20 flex items-center justify-center rounded bg-blue-500/20 border border-blue-400/30 px-2 py-0.5 text-xs font-bold text-blue-400 select-none">
              Ps
            </div>
          )}

          <img
            src={tier.image}
            alt={`${tier.name} Merchandise Preview`}
            className="relative z-10 max-h-72 sm:max-h-88 w-auto max-w-full object-contain drop-shadow-2xl select-none transition-transform duration-300 hover:scale-105"
            loading="eager"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* Revealed Items Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-2 mb-3.5">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              REVEALED ITEMS ({tier.revealedItems.length})
            </h4>
            <span className="rounded-full bg-amber-500/10 border border-amber-500/40 px-3 py-1 text-[11px] font-semibold text-amber-400">
              More swags to come
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3.5">
            {tier.revealedItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-800/90 bg-[#0d1424] p-4 flex flex-col items-center text-center justify-between min-h-[160px] transition-all hover:border-slate-700 hover:bg-[#11192e]"
              >
                {/* Product Thumbnail with enlarged image */}
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-[#141d30] border border-slate-700/60 p-2.5 flex items-center justify-center overflow-hidden mb-2.5 shadow-inner">
                  <img
                    src={item.imageUrl || tier.image}
                    alt={item.name}
                    className="h-full w-full object-contain drop-shadow"
                    loading="lazy"
                  />
                </div>

                <div className="w-full">
                  <p className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2">
                    {item.name}
                  </p>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 mt-1.5 transition-colors"
                    >
                      <span>View Details</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="inline-block text-[11px] text-slate-500 mt-1 font-medium">
                      Google Cloud Arcade
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </dialog>
  );
};
