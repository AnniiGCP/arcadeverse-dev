import React, { useState } from "react";

export const GOOGLE_COLORS = [
  {
    bg: "bg-[#4285F4]",
    text: "text-white",
    hex: "#4285F4",
    border: "border-[#4285F4]/30",
  }, // Google Blue
  {
    bg: "bg-[#EA4335]",
    text: "text-white",
    hex: "#EA4335",
    border: "border-[#EA4335]/30",
  }, // Google Red
  {
    bg: "bg-[#FBBC05]",
    text: "text-slate-900 font-black",
    hex: "#FBBC05",
    border: "border-[#FBBC05]/30",
  }, // Google Yellow
  {
    bg: "bg-[#34A853]",
    text: "text-white",
    hex: "#34A853",
    border: "border-[#34A853]/30",
  }, // Google Green
] as const;

export function getGoogleAvatarStyle(name: string) {
  let hash = 0;
  const cleanName = (name || "User").trim();
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GOOGLE_COLORS.length;
  return GOOGLE_COLORS[index];
}

export interface GoogleAvatarProps {
  name: string;
  photoUrl?: string | null;
  isDemo?: boolean;
  sizeClassName?: string;
  className?: string;
  alt?: string;
}

export function GoogleAvatar({
  name,
  photoUrl,
  isDemo = false,
  sizeClassName = "w-10 h-10",
  className = "",
  alt,
}: GoogleAvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const initial = (name || "U").trim().charAt(0).toUpperCase();
  const colorStyle = getGoogleAvatarStyle(name);

  const hasPhotoUrl =
    typeof photoUrl === "string" && photoUrl.trim().length > 0;
  const isPlaceholderUrl = !hasPhotoUrl || photoUrl.includes("ui-avatars.com");

  // Render the photo whenever a valid URL is provided; fall back to Google Brand colored initials on error or when photo is omitted
  const shouldRenderPhoto = hasPhotoUrl && !imgFailed && !isPlaceholderUrl;

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 flex items-center justify-center select-none shadow-sm ${sizeClassName} ${colorStyle.bg} ${colorStyle.text} ${className}`}
      title={name}
      aria-label={`${name}'s avatar`}
    >
      {shouldRenderPhoto && photoUrl ? (
        <img
          src={photoUrl}
          alt={alt || name}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          loading="lazy"
          className="w-full h-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="font-display font-bold text-[90%] leading-none flex items-center justify-center">
          {initial}
        </span>
      )}
    </div>
  );
}

export default GoogleAvatar;
