import type React from "react";

interface ArcadeJoystickIconProps {
  className?: string;
  hasSparkles?: boolean;
}

export const ArcadeJoystickIcon: React.FC<ArcadeJoystickIconProps> = ({
  className = "w-10 h-10",
  hasSparkles = false,
}) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(239,68,68,0.25)]"
      >
        {/* Joystick Ball (Red gradient sphere) */}
        <circle cx="32" cy="18" r="10" fill="url(#ballGradient)" />
        <circle cx="30" cy="15" r="3" fill="#ffffff" opacity="0.6" />

        {/* Joystick Shaft (Metallic Chrome) */}
        <rect
          x="29.5"
          y="27"
          width="5"
          height="13"
          rx="1.5"
          fill="url(#shaftGradient)"
        />

        {/* Shaft Base Ring */}
        <ellipse cx="32" cy="40" rx="9" ry="3.5" fill="#1e293b" />
        <ellipse cx="32" cy="39" rx="7" ry="2.5" fill="#475569" />

        {/* Console Base Box (Retro Off-White / Gray Arcade Base) */}
        <rect
          x="12"
          y="38"
          width="40"
          height="20"
          rx="6"
          fill="url(#baseGradient)"
        />
        <rect
          x="12"
          y="38"
          width="40"
          height="20"
          rx="6"
          stroke="#94a3b8"
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Console Bevel Front Shadow */}
        <path
          d="M12 50 H52 V54 C52 56.5 49.5 58 46 58 H18 C14.5 58 12 56.5 12 54 V50 Z"
          fill="#cbd5e1"
          opacity="0.5"
        />

        {/* Action Buttons */}
        <circle cx="21" cy="47" r="3.5" fill="#ef4444" />
        <circle cx="21" cy="46" r="1.5" fill="#fca5a5" opacity="0.8" />

        <circle cx="43" cy="47" r="3.5" fill="#3b82f6" />
        <circle cx="43" cy="46" r="1.5" fill="#93c5fd" opacity="0.8" />

        {/* Gradients */}
        <defs>
          <radialGradient
            id="ballGradient"
            cx="29"
            cy="14"
            r="12"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="60%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>
          <linearGradient
            id="shaftGradient"
            x1="29"
            y1="27"
            x2="35"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          <linearGradient
            id="baseGradient"
            x1="32"
            y1="38"
            x2="32"
            y2="58"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Sparkles for Legend Tier */}
      {hasSparkles && (
        <>
          <span className="absolute -top-1 -right-1 text-xs text-amber-300 animate-pulse">
            ✦
          </span>
          <span className="absolute bottom-0 -left-1 text-[10px] text-amber-300 animate-pulse delay-150">
            ✦
          </span>
        </>
      )}
    </div>
  );
};
