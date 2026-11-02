import { BadgeCard } from "@/components/BadgeCard";
import { allCombinedBadges } from "@/data/badgeCatalog";
import { motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

const CATEGORIES = ["All", "Skill", "Game", "Trivia", "Lab-Free"] as const;
const PAGE_SIZE = 24;

export function BadgeExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const reduce = useReducedMotion();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allCombinedBadges.filter((b) => {
      if (category !== "All" && b.category !== category) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.difficulty.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: allCombinedBadges.length };
    for (const b of allCombinedBadges) c[b.category] = (c[b.category] || 0) + 1;
    return c;
  }, []);

  const shown = filtered.slice(0, visible);

  return (
    <div>
      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="Search badges…"
            aria-label="Search badges by name or difficulty"
            className="w-full rounded-lg border border-border bg-surface-hover/40 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent-purple/60 focus:outline-none"
          />
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter badges by category"
        >
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCategory(c);
                setVisible(PAGE_SIZE);
              }}
              aria-pressed={category === c}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                category === c
                  ? "border-accent-purple/60 bg-accent-purple/15 text-foreground"
                  : "border-border bg-surface-hover/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c} {counts[c] || 0}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {shown.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No badges match "{query}". Try a different search or category.
        </p>
      ) : (
        <motion.div
          className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {shown.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </motion.div>
      )}

      {/* Show more */}
      {filtered.length > visible && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-lg border border-border bg-surface-hover/60 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
          >
            Show more ({filtered.length - visible} remaining)
          </button>
        </div>
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Badge names, artwork, and points are provided for identification and
        learning purposes. ArcadeVerse is not affiliated with Google — official
        challenge details live on Google Cloud Skills Boost.
      </p>
    </div>
  );
}

export default BadgeExplorer;
