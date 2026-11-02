import { Award, Beaker, Check, ChevronRight, Copy } from "lucide-react";
import type React from "react";
import { useState } from "react";

export interface BadgeCardData {
  id: string | number;
  title: string;
  category?: string;
  difficulty?: string;
  labsRequired?: number;
  points?: number;
  image?: string;
  level?: string;
  url?: string;
  accessCode?: string;
  deadline?: string;
}

export interface BadgeCardProps {
  badge: BadgeCardData;
  copiedCode?: string | null;
  onCopyAccessCode?: (code: string, e: React.MouseEvent) => void;
  className?: string;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  copiedCode,
  onCopyAccessCode,
  className = "",
}) => {
  const [internalCopiedCode, setInternalCopiedCode] = useState<string | null>(
    null,
  );
  const [idCopied, setIdCopied] = useState(false);

  const hasAccessCode = Boolean(badge.accessCode);
  const isCopied =
    copiedCode !== undefined
      ? copiedCode === badge.accessCode
      : internalCopiedCode === badge.accessCode;

  const handleCopyAccessCode = async (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCopyAccessCode) {
      onCopyAccessCode(code, e);
    } else {
      try {
        await navigator.clipboard.writeText(code);
        setInternalCopiedCode(code);
        setTimeout(() => setInternalCopiedCode(null), 2000);
      } catch (err) {
        console.error("Failed to copy access code", err);
      }
    }
  };

  const handleCopyId = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(String(badge.id));
      setIdCopied(true);
      setTimeout(() => setIdCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border border-border bg-surface-card p-4 shadow-card-premium transition-all duration-300 hover:border-border-strong hover:-translate-y-[1px] ${className}`}
    >
      <div>
        {/* Badge Image Container */}
        <div className="w-full h-36 rounded-xl bg-surface-hover/50 dark:bg-[#080c16] border border-border/60 dark:border-border/40 p-3 flex items-center justify-center relative overflow-hidden">
          {badge.image ? (
            <img
              src={badge.image}
              alt={badge.title}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
            />
          ) : (
            <Award className="h-12 w-12 text-muted-foreground/40" />
          )}
        </div>

        {/* Badge Title */}
        <h4 className="mt-3 text-xs font-bold text-foreground line-clamp-2 min-h-[32px] leading-tight">
          {badge.title}
        </h4>

        {/* Access Code or Category / Level Pill */}
        <div className="mt-2 flex items-center gap-1.5">
          {hasAccessCode ? (
            <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-400 px-2.5 py-0.5 text-xs font-mono font-bold text-black shadow-sm">
              <span>{badge.accessCode}</span>
              <button
                onClick={(e) => handleCopyAccessCode(badge.accessCode!, e)}
                title="Copy Access Code"
                aria-label={`Copy access code ${badge.accessCode}`}
                className="rounded p-0.5 hover:bg-black/10 transition-colors focus:outline-none flex items-center"
              >
                {isCopied ? (
                  <Check className="h-3 w-3 text-emerald-900 stroke-[3]" />
                ) : (
                  <Copy className="h-3 w-3 text-black/80" />
                )}
              </button>
            </div>
          ) : (
            <span
              onClick={handleCopyId}
              title={`Badge ID: ${badge.id} (Click to copy)`}
              className="inline-block rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-300 cursor-pointer hover:bg-amber-500/20 transition-colors"
            >
              {idCopied
                ? "ID COPIED!"
                : badge.category === "Skill"
                  ? `SKILL BADGE · ${(badge.difficulty || "Introductory").toUpperCase()}`
                  : badge.category === "Lab-Free"
                    ? `LAB-FREE · ${(badge.difficulty || "Introductory").toUpperCase()}`
                    : badge.difficulty || "BADGE"}
            </span>
          )}
        </div>

        {/* Labs Count & Points Information */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-muted-foreground text-[11px] font-medium">
            <Beaker className="h-3 w-3 text-blue-400" />
            {badge.labsRequired !== undefined
              ? badge.labsRequired
              : badge.category === "Lab-Free"
                ? 0
                : 8}{" "}
            Labs
          </span>
          <span className="text-[11px] font-extrabold text-emerald-400">
            {badge.category === "Skill"
              ? "+0.5 Pts"
              : badge.category === "Lab-Free"
                ? "+0 Pts"
                : badge.points
                  ? `+${badge.points} Pt`
                  : "+0 Pts"}
          </span>
        </div>
      </div>

      {/* Start Challenge Button */}
      <div className="mt-3.5 pt-1">
        <a
          href={badge.url || "https://www.cloudskillsboost.google/"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-1 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white py-2 px-3 text-xs font-semibold shadow-sm transition-colors"
        >
          <span>Start Challenge</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
};

export default BadgeCard;
