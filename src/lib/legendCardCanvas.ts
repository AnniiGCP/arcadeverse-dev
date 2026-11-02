import {
  type LegendCardData,
  formatPoints,
  getSanitizedDownloadFileName,
  validateLegendCardData,
} from "./legendCardLogic";

/**
 * 4K High-Resolution Canvas Dimensions:
 * Preserves the exact 1024 / 577 aspect ratio (1.774697) of the Master Template
 * 3840 x 2164 delivers true 4K-class export quality with crisp text and zero upscaling blur.
 */
export const CANVAS_4K_WIDTH = 3840;
export const CANVAS_4K_HEIGHT = 2164;

/**
 * Draws the 4K master template and injects dynamic user data
 * with sub-pixel coordinate precision into an HTML5 Canvas 2D context.
 */
export async function drawLegendCardToCanvas(
  ctx: CanvasRenderingContext2D,
  data: LegendCardData,
): Promise<void> {
  const W = CANVAS_4K_WIDTH;
  const H = CANVAS_4K_HEIGHT;

  // Set canvas dimensions to 4K resolution
  ctx.canvas.width = W;
  ctx.canvas.height = H;

  // 1. Load and draw 4K Master Template Background (Layer 1)
  let templateImg: HTMLImageElement;
  try {
    templateImg = await loadImageElement(
      "/images/achievement/legend-card-master-template-4k.jpg",
    );
  } catch {
    templateImg = await loadImageElement(
      "/images/achievement/legend-card-master-template.jpg",
    );
  }
  ctx.drawImage(templateImg, 0, 0, W, H);

  // 2. Avatar Circle (Positioned at cx=1200, cy=945, radius=143 — non-overlapping with arcade points box)
  ctx.save();
  const avatarCx = 1200;
  const avatarCy = 945;
  const avatarRadius = 143;

  let avatarDrawn = false;
  if (data.photoUrl) {
    try {
      const avatarImg = await loadImageElement(data.photoUrl);
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarCx, avatarCy, avatarRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(
        avatarImg,
        avatarCx - avatarRadius,
        avatarCy - avatarRadius,
        avatarRadius * 2,
        avatarRadius * 2,
      );
      ctx.restore();
      avatarDrawn = true;
    } catch {
      avatarDrawn = false;
    }
  }

  if (!avatarDrawn) {
    // Elegant initials fallback
    const grad = ctx.createRadialGradient(
      avatarCx,
      avatarCy,
      0,
      avatarCx,
      avatarCy,
      avatarRadius,
    );
    grad.addColorStop(0, "#4f46e5");
    grad.addColorStop(1, "#1e1b4b");
    ctx.beginPath();
    ctx.arc(avatarCx, avatarCy, avatarRadius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    const initials =
      data.name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "AV";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 96px 'Sora', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initials, avatarCx, avatarCy);
  }

  // Avatar Border Ring
  ctx.beginPath();
  ctx.arc(avatarCx, avatarCy, avatarRadius, 0, Math.PI * 2);
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#818cf8";
  ctx.stroke();
  ctx.restore();

  // 3. User Name (Positioned centered inside the Master Template Name Pill slot at cx=1875, cy=893 — pure white font)
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
  ctx.shadowBlur = 12;

  const namePillCenterX = 1875;
  const namePillCenterY = 893;
  const maxNameWidth = 915;

  let fontSize = 68;
  ctx.font = `bold ${fontSize}px 'Sora', sans-serif`;
  while (ctx.measureText(data.name).width > maxNameWidth && fontSize > 36) {
    fontSize -= 4;
    ctx.font = `bold ${fontSize}px 'Sora', sans-serif`;
  }
  const fittedName = truncateText(ctx, data.name, maxNameWidth);
  ctx.fillText(fittedName, namePillCenterX, namePillCenterY);
  ctx.restore();

  // 4. Member Since Year (Positioned strictly inside the empty year value box at cx=1793, cy=1028 — pure white font)
  const memberYearMatch = data.memberSince?.match(/(\d{4})/);
  const memberSinceYear = memberYearMatch ? memberYearMatch[1] : "2026";
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px 'Sora', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = 8;
  ctx.fillText(memberSinceYear, 1793, 1028);
  ctx.restore();

  // 5. League Name (Positioned strictly inside the empty league value box at cx=2216, cy=1028 — pure white font)
  const cleanLeague = data.league?.replace(/league/i, "").trim() || "Silver";
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px 'Sora', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = 8;
  const fittedLeague = truncateText(ctx, cleanLeague, 210);
  ctx.fillText(fittedLeague, 2216, 1028);
  ctx.restore();

  // 6. Left Badge Slots (Positioned strictly inside each empty value box at cx=600 — pure white font)
  const badgeCenterX = 600;

  // Total Badges Value (cy=938 is centered inside box)
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 66px 'Sora', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
  ctx.shadowBlur = 8;
  ctx.fillText(data.totalBadges.toString(), badgeCenterX, 938);

  // Skill Badges Value (cy=1193 is centered inside box)
  ctx.fillText(data.skillBadges.toString(), badgeCenterX, 1193);

  // Game Badges Value (cy=1448 is centered inside box)
  ctx.fillText(data.gameBadges.toString(), badgeCenterX, 1448);
  ctx.restore();

  // 7. Large Arcade Points (Positioned centered inside points area between chevrons at cx=1688, cy=1230 — pure white font with glow)
  const pointsCenterX = 1688;
  const pointsCenterY = 1230;
  const pointsText = formatPoints(data.arcadePoints);

  ctx.save();
  ctx.font = "900 175px 'Sora', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(255, 255, 255, 0.75)";
  ctx.shadowBlur = 35;
  ctx.fillText(pointsText, pointsCenterX, pointsCenterY);
  ctx.restore();

  // 8. Bonus Points inside "including [ ] bonus points" box at cx=1669, cy=1545 — pure white font
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 48px 'Sora', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
  ctx.shadowBlur = 8;
  ctx.fillText(data.bonusPoints.toString(), 1669, 1545);
  ctx.restore();
}

/**
 * Loads an image from URL into an HTMLImageElement with CORS enabled.
 */
function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Truncates text with ellipsis if it exceeds maxWidth.
 */
function truncateText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let len = text.length;
  while (
    len > 0 &&
    ctx.measureText(`${text.slice(0, len)}…`).width > maxWidth
  ) {
    len--;
  }
  return `${text.slice(0, len)}…`;
}

/**
 * Main export function:
 * Validates data, renders card to 4K resolution canvas, exports as PNG, and triggers browser download.
 */
export async function renderAndDownloadLegendCard(
  data: LegendCardData,
): Promise<{ success: boolean; fileName?: string; error?: string }> {
  // 1. Strict Validation
  const validation = validateLegendCardData(data);
  if (!validation.isValid) {
    return {
      success: false,
      error: `Unable to generate achievement card because profile data is incomplete:\n${validation.errors.join("\n")}`,
    };
  }

  // 2. Wait for fonts to load
  if (typeof document !== "undefined" && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Continue safely
    }
  }

  // 3. Create 4K Canvas
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_4K_WIDTH;
  canvas.height = CANVAS_4K_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return {
      success: false,
      error: "Canvas 2D context is not supported in this browser.",
    };
  }

  // 4. Draw card with 4K assets & vector typography
  await drawLegendCardToCanvas(ctx, data);

  // 5. Convert to Blob & Download
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve({
            success: false,
            error: "Failed to create image blob from canvas.",
          });
          return;
        }

        const fileName = getSanitizedDownloadFileName(data.name);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        resolve({
          success: true,
          fileName,
        });
      },
      "image/png",
      1.0,
    );
  });
}

/**
 * Creates a PNG File object from the 4K canvas for use with the Web Share API.
 */
export async function generateLegendCardFile(
  data: LegendCardData,
): Promise<{ file?: File; error?: string }> {
  const validation = validateLegendCardData(data);
  if (!validation.isValid) {
    return {
      error: `Validation failed: ${validation.errors.join("; ")}`,
    };
  }

  if (typeof document !== "undefined" && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Continue
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_4K_WIDTH;
  canvas.height = CANVAS_4K_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { error: "Canvas 2D not supported." };
  }

  await drawLegendCardToCanvas(ctx, data);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve({ error: "Failed to generate blob." });
        return;
      }
      const fileName = getSanitizedDownloadFileName(data.name);
      const file = new File([blob], fileName, { type: "image/png" });
      resolve({ file });
    }, "image/png");
  });
}
