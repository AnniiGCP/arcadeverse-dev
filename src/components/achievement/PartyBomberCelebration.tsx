import lottie, { type AnimationItem } from "lottie-web";
import React, { useEffect, useRef } from "react";

interface PartyBomberCelebrationProps {
  /** Changing this key triggers a new celebration burst from the sides */
  triggerKey?: number | string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  color: string;
  shape: "triangle" | "circle" | "ribbon" | "rect";
  rotation: number;
  rotationSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
  gravity: number;
  drag: number;
  decay: number;
}

// Colors from official Lottie Confetti Animation (confetti-3ofTs67sBx)
const LOTTIE_CONFETTI_COLORS = [
  "#19b1ff", // Vibrant Sky Blue
  "#ff4848", // Vivid Coral Red
  "#45e8a3", // Bright Mint Green
  "#ffb400", // Warm Sunny Yellow
  "#7d3bc0", // Electric Purple
  "#4af3f7", // Shimmering Cyan
  "#f59e0b", // Radiant Amber
  "#ffffff", // Crisp White Accent
];

export function PartyBomberCelebration({
  triggerKey = 0,
}: PartyBomberCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lottieContainerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<AnimationItem | null>(null);

  // 1. Mount official Lottie Animation in 100% transparent SVG mode
  useEffect(() => {
    if (!lottieContainerRef.current) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Clean up previous instance
    if (animRef.current) {
      animRef.current.destroy();
      animRef.current = null;
    }

    try {
      const anim = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "/animations/confetti-legend.json",
      });

      animRef.current = anim;
    } catch {
      // Fallback gracefully to canvas cannon
    }

    return () => {
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [triggerKey]);

  // 2. High-performance dual-side cannon launch (bursting from the left and right edges)
  useEffect(() => {
    if (triggerKey === undefined) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isActive = true;
    const particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // Creates cannon particles launching from a side edge
    const shootSideCannon = (
      originX: number,
      originY: number,
      angleMinDeg: number,
      angleMaxDeg: number,
      count: number,
      baseSpeed: number,
    ) => {
      for (let i = 0; i < count; i++) {
        const angleRad =
          ((angleMinDeg + Math.random() * (angleMaxDeg - angleMinDeg)) *
            Math.PI) /
          180;
        const speed = baseSpeed * (0.7 + Math.random() * 0.65);
        const vx = Math.cos(angleRad) * speed;
        const vy = Math.sin(angleRad) * speed;

        const rand = Math.random();
        const shape =
          rand < 0.28
            ? "triangle"
            : rand < 0.52
              ? "ribbon"
              : rand < 0.76
                ? "circle"
                : "rect";

        const baseSize = 9 + Math.random() * 7;

        particles.push({
          x: originX,
          y: originY,
          vx,
          vy,
          w: shape === "ribbon" ? baseSize * 0.45 : baseSize,
          h:
            shape === "ribbon"
              ? baseSize * 2.4
              : baseSize * (0.7 + Math.random() * 0.5),
          color:
            LOTTIE_CONFETTI_COLORS[
              Math.floor(Math.random() * LOTTIE_CONFETTI_COLORS.length)
            ],
          shape,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.28,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.09 + Math.random() * 0.08,
          opacity: 1,
          gravity: 0.36 + Math.random() * 0.12,
          drag: 0.984,
          decay: 0.003 + Math.random() * 0.0025,
        });
      }
    };

    // Dual-side cannon launch: Left & Right sides of the screen shooting inward
    const fireSideCannons = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const leftX = 0;
      const rightX = w;
      const cannonY = h * 0.72; // Shoot upwards from lower sides

      // Wave 1: Immediate massive launch from left and right sides
      shootSideCannon(leftX, cannonY, -62, -22, 85, 27);
      shootSideCannon(rightX, cannonY, -158, -118, 85, 27);

      // Wave 2: Secondary pop 200ms later for real party cannon pop effect
      setTimeout(() => {
        if (!isActive) return;
        shootSideCannon(leftX, cannonY - 35, -55, -18, 55, 24);
        shootSideCannon(rightX, cannonY - 35, -162, -125, 55, 24);
      }, 200);

      // Wave 3: Top side shower 400ms later
      setTimeout(() => {
        if (!isActive) return;
        shootSideCannon(leftX + 25, cannonY - 90, -48, -12, 35, 21);
        shootSideCannon(rightX - 25, cannonY - 90, -168, -132, 35, 21);
      }, 400);
    };

    fireSideCannons();

    // Render loop with 100% transparent canvas
    const loop = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;

        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.y > window.innerHeight + 60) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        const wobbleScale = Math.sin(p.wobble);

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "triangle") {
          const s = p.w * 0.7;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.866, s * 0.5);
          ctx.lineTo(-s * 0.866, s * 0.5);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === "ribbon") {
          ctx.scale(wobbleScale, 1);
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.scale(1, wobbleScale);
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }

        ctx.restore();
      }

      if (particles.length > 0 && isActive) {
        animId = requestAnimationFrame(loop);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      isActive = false;
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [triggerKey]);

  return (
    <>
      {/* 100% Transparent Full-Screen Lottie SVG Layer */}
      <div
        ref={lottieContainerRef}
        className="pointer-events-none fixed inset-0 z-50 h-full w-full overflow-hidden select-none"
        aria-hidden="true"
      />

      {/* 100% Transparent Dual-Side Canvas Cannon Layer */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50 h-full w-full select-none"
        aria-hidden="true"
      />
    </>
  );
}

export default PartyBomberCelebration;
