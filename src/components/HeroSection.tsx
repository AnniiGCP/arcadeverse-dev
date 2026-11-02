import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconBolt,
  IconChartBar,
  IconShieldCheck,
  IconSparkles,
  IconTrophy,
} from "@tabler/icons-react";
import { type Variants, motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const floatChip = (delay: number, y: number) => ({
  animate: { y: [0, y, 0] },
  transition: {
    duration: 6,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut" as const,
    delay,
  },
});

export function HeroSection() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const handleCalculateClick = () => {
    const calculatorSection = document.getElementById("calculator-section");
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    // Not on the home page — go home, then scroll once mounted.
    navigate("/");
    setTimeout(() => {
      document
        .getElementById("calculator-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const handleLearnMore = () => {
    document
      .getElementById("how-to-join-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0 bg-aurora"
        aria-hidden
      />
      <div
        className="bg-grid bg-grid-fade pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden
      />

      <div className="container relative z-10 grid items-center gap-14 py-20 md:py-28 lg:grid-cols-[1.05fr_1fr] lg:py-32">
        {/* Copy */}
        <motion.div
          variants={container}
          initial={prefersReducedMotion ? undefined : "hidden"}
          animate={prefersReducedMotion ? undefined : "visible"}
          className="flex flex-col items-start"
        >
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-purple">
              <IconSparkles className="h-3.5 w-3.5" />
              Your Arcade Partner
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-[4rem]"
          >
            Google Cloud Arcade{" "}
            <span className="text-gradient">
              Points Calculator & Progress Tracker
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            ArcadeVerse turns your Cloud Skills Boost profile into clean,
            real-time analytics. Calculate points, surface incomplete badges,
            follow your milestones and see exactly where your next{" "}
            <span className="font-semibold text-highlight">swag tier</span>{" "}
            begins.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button size="lg" onClick={handleCalculateClick} className="group">
              Calculate Arcade Points
              <IconArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
            <Button size="lg" variant="outline" onClick={handleLearnMore}>
              See how it works
            </Button>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-3 text-sm text-muted-foreground"
          >
            Need help finding your profile?{" "}
            <a
              href="/resources/find-your-public-url"
              className="font-medium text-accent-purple underline-offset-4 hover:underline"
            >
              Read the public profile URL guide
            </a>
            .
          </motion.p>

          <motion.ul
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
          >
            <li className="inline-flex items-center gap-2">
              <IconBolt className="h-4 w-4 text-accent-yellow" />
              Instant profile analysis
            </li>
            <li className="inline-flex items-center gap-2">
              <IconShieldCheck className="h-4 w-4 text-accent-green" />
              No data stored
            </li>
            <li className="inline-flex items-center gap-2">
              <IconChartBar className="h-4 w-4 text-accent-blue" />
              Milestone tracking
            </li>
          </motion.ul>
        </motion.div>

        {/* Product preview */}
        <motion.div
          initial={
            prefersReducedMotion
              ? undefined
              : { opacity: 0, y: 36, scale: 0.96 }
          }
          animate={
            prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
          }
          transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
          className="relative"
        >
          <HeroPreview />

          {/* Floating chips */}
          {!prefersReducedMotion && (
            <>
              <motion.div
                {...floatChip(0.2, -12)}
                className="absolute -left-4 top-16 hidden rounded-xl border border-border bg-surface-elevated/90 px-3 py-2 shadow-surface backdrop-blur md:flex md:items-center md:gap-2"
              >
                <IconTrophy className="h-4 w-4 text-accent-yellow" />
                <div className="leading-tight">
                  <p className="text-[11px] font-semibold text-foreground">
                    Milestone reached
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Bonus points added
                  </p>
                </div>
              </motion.div>

              <motion.div
                {...floatChip(1.1, 12)}
                className="absolute -right-3 bottom-10 hidden rounded-xl border border-border bg-surface-elevated/90 px-3 py-2 shadow-surface backdrop-blur md:flex md:items-center md:gap-2"
              >
                <span className="grid h-6 w-6 place-items-center rounded-md bg-accent-purple/15 text-accent-purple">
                  <IconChartBar className="h-3.5 w-3.5" />
                </span>
                <div className="leading-tight">
                  <p className="text-[11px] font-semibold text-foreground">
                    Skill badges
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Progress synced
                  </p>
                </div>
              </motion.div>
            </>
          )}

          {/* Glow */}
          <div
            className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-accent-purple/10 blur-3xl"
            aria-hidden
          />
        </motion.div>
      </div>
    </section>
  );
}

function HeroPreview() {
  const categories = [
    { label: "Skill badges", value: 72, color: "hsl(var(--accent-purple))" },
    { label: "Game badges", value: 54, color: "hsl(var(--accent-blue))" },
    { label: "Milestones", value: 88, color: "hsl(var(--accent-yellow))" },
  ];

  return (
    <div className="relative rounded-2xl border border-border bg-surface/80 p-2 shadow-surface backdrop-blur-sm">
      <div className="rounded-xl border border-border/70 bg-background-secondary/80">
        {/* Window bar */}
        <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-accent-orange/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-yellow/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-green/70" />
          <div className="ml-3 flex-1 rounded-md border border-border/60 bg-surface/60 px-3 py-1 text-center font-mono text-[10px] text-muted-foreground">
            arcadeverse.app/dashboard
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Arcade points
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-foreground">
                  42
                </span>
                <span className="rounded-full bg-accent-green/15 px-2 py-0.5 text-[10px] font-semibold text-accent-green">
                  +8 bonus
                </span>
              </div>
            </div>
            <PointsRing value={76} />
          </div>

          <div className="mt-6 space-y-4">
            {categories.map((cat) => (
              <div key={cat.label}>
                <div className="mb-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">{cat.label}</span>
                  <span className="font-mono text-foreground/80">
                    {cat.value}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${cat.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, delay: 0.8, ease: EASE }}
                    className="h-full rounded-full"
                    style={{ background: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2.5">
            {[
              { label: "Badges", value: "18" },
              { label: "Streak", value: "6d" },
              { label: "Rank", value: "Top 5%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/70 bg-surface/50 px-3 py-2.5"
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-0.5 font-display text-base font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PointsRing({ value }: { value: number }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative grid h-[76px] w-[76px] place-items-center">
      <svg viewBox="0 0 76 76" className="h-full w-full -rotate-90">
        <circle
          cx="38"
          cy="38"
          r={radius}
          strokeWidth="6"
          fill="none"
          className="text-surface-hover"
          stroke="currentColor"
        />
        <motion.circle
          cx="38"
          cy="38"
          r={radius}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          stroke="hsl(var(--accent-purple))"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, delay: 0.7, ease: EASE }}
        />
      </svg>
      <span className="absolute font-mono text-xs font-semibold text-foreground">
        {value}%
      </span>
    </div>
  );
}
