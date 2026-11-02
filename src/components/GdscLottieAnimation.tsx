import gdscAnimationData from "@/assets/animations/gdsc-modules.json";
import { useReducedMotion } from "framer-motion";
import lottie, { type AnimationItem } from "lottie-web";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface GdscLottieAnimationProps {
  className?: string;
}

export const GdscLottieAnimation: React.FC<GdscLottieAnimationProps> = ({
  className = "w-full h-full",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let anim: AnimationItem | null = null;

    try {
      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: !prefersReducedMotion,
        autoplay: !prefersReducedMotion,
        animationData: gdscAnimationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
          progressiveLoad: true,
        },
      });

      if (prefersReducedMotion && anim) {
        anim.goToAndStop(0, true);
      }
    } catch (err) {
      console.warn("Failed to load Lottie animation", err);
      setHasError(true);
    }

    return () => {
      if (anim) {
        anim.destroy();
      }
    };
  }, [prefersReducedMotion]);

  if (hasError) {
    // Graceful fallback to static illustration if animation engine fails
    return (
      <div className="flex h-full w-full items-center justify-center p-6 text-center">
        <div className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-surface">
          <p className="font-display text-lg font-extrabold text-foreground">
            Arcade
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            ready
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      aria-label="Google Cloud Arcade GDSC Modules Animation"
    />
  );
};
