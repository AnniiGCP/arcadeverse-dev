import { GoogleAvatar } from "@/components/ui/GoogleAvatar";
import { motion } from "framer-motion";

export interface UserPodiumRankCardProps {
  rank: number;
  name: string;
  badges: number;
  points: number;
  photoUrl?: string;
  className?: string;
}

export function UserPodiumRankCard({
  rank,
  name,
  badges,
  points,
  photoUrl,
  className = "",
}: UserPodiumRankCardProps) {
  // If user is in top 5, they are already on the podium
  if (rank <= 5) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`relative w-full max-w-4xl mx-auto px-2 sm:px-4 ${className}`}
      aria-label="Your Current Leaderboard Ranking"
    >
      {/* Floating "YOU" Pill Tag perched on top-left border */}
      <div className="absolute -top-3 left-6 sm:left-10 z-20">
        <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full bg-[#0f4435] text-[#34d399] border border-[#1b6b55] text-[10px] sm:text-[11px] font-black tracking-widest uppercase shadow-sm">
          YOU
        </span>
      </div>

      {/* Main Dark Emerald Card */}
      <div className="relative rounded-[20px] sm:rounded-[24px] bg-[#03150f] border border-[#0d4a37] p-3.5 sm:p-4 md:p-5 flex items-center justify-between gap-3 sm:gap-6 shadow-[0_10px_35px_rgba(2,21,15,0.7)] overflow-hidden">
        {/* Ambient interior lighting */}
        <div className="pointer-events-none absolute -right-24 -top-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />

        {/* Left Section: Rank, Avatar, Name & Badges */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 min-w-0 flex-1 relative z-10">
          {/* Rank Badge */}
          <div className="rounded-lg sm:rounded-xl px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-[#0b3b2c] border border-[#175d46] text-[#34d399] font-mono font-bold text-xs sm:text-sm tracking-tight shrink-0 shadow-inner flex items-center justify-center min-w-[56px] sm:min-w-[68px]">
            #{rank.toLocaleString()}
          </div>

          {/* Avatar (Real Google Photo or Google-Color Initial) */}
          <GoogleAvatar
            name={name}
            photoUrl={photoUrl}
            isDemo={false}
            sizeClassName="w-10 h-10 sm:w-11 sm:h-11"
            className="border border-white/10"
          />

          {/* User Name & Badges */}
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-extrabold text-white text-sm sm:text-base tracking-wide uppercase truncate leading-tight">
              {name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5 sm:mt-1 truncate">
              {badges} Badges
            </p>
          </div>
        </div>

        {/* Right Section: Points Badge */}
        <div className="shrink-0 relative z-10">
          <div className="rounded-full px-4 sm:px-6 py-1.5 sm:py-2 bg-[#09261e] border border-[#125341] text-[#34d399] font-mono font-bold text-xs sm:text-sm tracking-tight shadow-inner flex items-center justify-center whitespace-nowrap">
            {points} Pts
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UserPodiumRankCard;
