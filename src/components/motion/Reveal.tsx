import { cn } from "@/lib/utils";
import { type Variants, motion, useReducedMotion } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "scale" | "fade";

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Animation delay in seconds (used for staggering groups). */
  delay?: number;
  /** Animation duration in seconds. */
  duration?: number;
  direction?: Direction;
  /** How much of the element must be visible before animating (0 - 1). */
  amount?: number;
  once?: boolean;
  as?: "div" | "section" | "li" | "span" | "article";
}

const EASE = [0.22, 1, 0.36, 1] as const;

function getOffsets(direction: Direction) {
  switch (direction) {
    case "up":
      return { y: 28 };
    case "down":
      return { y: -28 };
    case "left":
      return { x: 36 };
    case "right":
      return { x: -36 };
    case "scale":
      return { scale: 0.94 };
    case "fade":
    default:
      return {};
  }
}

/**
 * Scroll-triggered reveal wrapper.
 *
 * Content is always rendered (never hidden behind JS) and animations are
 * disabled entirely when the user prefers reduced motion, so nothing is ever
 * dependent on an animation completing.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = "up",
  amount = 0.2,
  once = true,
  as = "div",
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (prefersReducedMotion) {
    const Tag = as as "div";
    return <Tag className={className}>{children}</Tag>;
  }

  const variants: Variants = {
    hidden: { opacity: 0, ...getOffsets(direction) },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration, delay, ease: EASE },
    },
  };

  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Container that staggers its `Reveal`-like children. Pair with
 * `StaggerItem` for grouped card entrances.
 */
export function Stagger({
  children,
  className,
  stagger = 0.09,
  delay = 0,
  amount = 0.15,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
  once?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  direction = "up",
  duration = 0.6,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  duration?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...getOffsets(direction) },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: { duration, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
