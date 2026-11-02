import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { apiPath } from "@/lib/api";
import {
  IconEye,
  IconLockOpen,
  IconRefresh,
  IconUsers,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface StatsSectionProps {
  accountsAnalyzed: number;
  isLoadingStats?: boolean;
}

export function StatsSection({
  accountsAnalyzed,
  isLoadingStats = false,
}: StatsSectionProps) {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [isLoadingVisitors, setIsLoadingVisitors] = useState(true);

  useEffect(() => {
    // Try cached value first for instant display
    const cachedVisitors = sessionStorage.getItem("visitorsCache");
    if (cachedVisitors) {
      try {
        const parsed = JSON.parse(cachedVisitors);
        if (parsed.visitors) {
          setVisitorCount(parsed.visitors);
          setIsLoadingVisitors(false);
        }
      } catch {
        // ignore invalid cache
      }
    }

    const loadVisitorStats = async () => {
      try {
        const response = await fetch(apiPath("/api/stats"));
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data && typeof data.visitors === "number") {
          setVisitorCount(data.visitors);
          sessionStorage.setItem("visitorsCache", JSON.stringify(data));
        }
      } catch {
        // keep loading state; empty state renders below
      } finally {
        setIsLoadingVisitors(false);
      }
    };

    loadVisitorStats();
  }, []);

  const numericStats = [
    {
      icon: <IconUsers className="h-5 w-5" />,
      label: "Accounts analyzed",
      value: accountsAnalyzed,
      isLoading: isLoadingStats || accountsAnalyzed === 0,
      tone: "text-accent-purple",
    },
    {
      icon: <IconEye className="h-5 w-5" />,
      label: "Unique visitors",
      value: visitorCount ?? 0,
      isLoading: isLoadingVisitors || visitorCount === null,
      tone: "text-accent-blue",
    },
  ];

  const capabilities = [
    {
      icon: <IconRefresh className="h-5 w-5" />,
      title: "Real-time analysis",
      description: "Points and badges recalculate from your live profile URL.",
      tone: "text-accent-green",
    },
    {
      icon: <IconLockOpen className="h-5 w-5" />,
      title: "No sign-up required",
      description:
        "Paste a profile URL and explore — nothing personal is stored.",
      tone: "text-accent-yellow",
    },
  ];

  return (
    <section className="relative py-20 md:py-24">
      <div className="container">
        <Reveal direction="up">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/60 p-8 backdrop-blur-sm sm:p-12">
            <div
              className="bg-grid pointer-events-none absolute inset-0 opacity-[0.15]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent-purple/15 blur-3xl"
              aria-hidden
            />

            <div className="relative mb-10 max-w-2xl">
              <span className="section-label">
                <span className="section-label-index">--</span>
                By the numbers
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                A growing community of Arcade learners
              </h2>
              <p className="mt-3 text-muted-foreground">
                Live figures from the platform — updated as profiles are
                analyzed.
              </p>
            </div>

            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {numericStats.map((stat) => (
                <StaggerItem key={stat.label}>
                  <div className="h-full rounded-2xl border border-border bg-background-secondary/70 p-6 transition-colors hover:border-border-active/40">
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface ${stat.tone}`}
                    >
                      {stat.icon}
                    </span>
                    <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {stat.label}
                    </p>
                    <div className="mt-1.5 font-display text-4xl font-extrabold text-foreground">
                      {stat.isLoading ? (
                        <span className="inline-block h-9 w-24 animate-pulse rounded-md bg-surface-hover align-middle" />
                      ) : (
                        <AnimatedCounter value={stat.value} />
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}

              {capabilities.map((cap) => (
                <StaggerItem key={cap.title}>
                  <div className="h-full rounded-2xl border border-border bg-background-secondary/70 p-6 transition-colors hover:border-border-active/40">
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface ${cap.tone}`}
                    >
                      {cap.icon}
                    </span>
                    <p className="mt-5 font-display text-base font-semibold text-foreground">
                      {cap.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {cap.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default StatsSection;
