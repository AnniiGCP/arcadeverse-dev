import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  /** Two-digit section index, e.g. "01". Rendered as a subtle marker. */
  index?: string;
  /** Uppercase eyebrow label shown next to the index. */
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleClassName,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col",
        centered ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow && (
        <Reveal direction="up" amount={0.4}>
          <div
            className={cn(
              "mb-5 flex items-center",
              centered && "justify-center",
            )}
          >
            <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-600/20 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 shadow-sm">
              {eyebrow}
            </span>
          </div>
        </Reveal>
      )}

      <Reveal direction="up" delay={0.05} amount={0.4}>
        <h2
          className={cn(
            "font-display text-3xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl md:text-5xl",
            centered && "max-w-3xl",
            titleClassName,
          )}
        >
          {title}
        </h2>
      </Reveal>

      {description && (
        <Reveal direction="up" delay={0.12} amount={0.4}>
          <p
            className={cn(
              "mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg",
              centered && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
