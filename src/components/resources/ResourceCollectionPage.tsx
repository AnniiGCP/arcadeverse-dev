import { BadgeCard } from "@/components/BadgeCard";
import { type CatalogBadge, allAvailableBadges } from "@/data/badgeCatalog";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const PAGE_SIZE = 24;
const SKILL_DIFFICULTIES = ["All", "Introductory", "Intermediate"] as const;

interface ResourceCollectionPageProps {
  title: string;
  description: string;
  category?: "skill-badge";
  searchPlaceholder: string;
}

export function ResourceCollectionPage({
  title,
  description,
  category = "skill-badge",
  searchPlaceholder,
}: ResourceCollectionPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const reduce = useReducedMotion();

  const isSkill = true;

  const rawBadges: CatalogBadge[] = useMemo(() => {
    return allAvailableBadges;
  }, []);

  const difficultyCounts = useMemo(() => {
    const counts: Record<string, number> = { All: rawBadges.length };
    for (const badge of rawBadges) {
      const diff = badge.difficulty || "Introductory";
      counts[diff] = (counts[diff] || 0) + 1;
    }
    return counts;
  }, [rawBadges]);

  const filteredBadges = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return rawBadges.filter((badge) => {
      if (isSkill && selectedDifficulty !== "All") {
        const badgeDiff = badge.difficulty || "Introductory";
        if (badgeDiff.toLowerCase() !== selectedDifficulty.toLowerCase()) {
          return false;
        }
      }

      if (!query) return true;
      return (
        badge.title.toLowerCase().includes(query) ||
        (badge.difficulty && badge.difficulty.toLowerCase().includes(query))
      );
    });
  }, [rawBadges, searchQuery, selectedDifficulty, isSkill]);

  const shownBadges = filteredBadges.slice(0, visible);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Helmet>
        <title>{title} | ArcadeVerse</title>
        <meta name="description" content={description} />
      </Helmet>

      {/* Back button & Breadcrumbs */}
      <div className="mb-4">
        <Link
          to="/resources"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Resources</span>
        </Link>
      </div>

      {/* Header section matching Badge Explorer */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-3xl">
          {description}
        </p>
      </div>

      {/* Search & Filter bar matching Badge Explorer layout */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="relative w-full sm:max-w-xs md:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-full rounded-lg border border-border bg-surface-hover/40 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent-purple/60 focus:outline-none transition-colors"
          />
        </div>

        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filters"
        >
          {isSkill ? (
            SKILL_DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => {
                  setSelectedDifficulty(diff);
                  setVisible(PAGE_SIZE);
                }}
                aria-pressed={selectedDifficulty === diff}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedDifficulty === diff
                    ? "border-accent-purple/60 bg-accent-purple/15 text-foreground"
                    : "border-border bg-surface-hover/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {diff} {difficultyCounts[diff] ?? 0}
              </button>
            ))
          ) : (
            <span className="rounded-full border border-border bg-surface-hover/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {filteredBadges.length} items
            </span>
          )}
        </div>
      </div>

      {/* Grid of badges matching Badge Explorer card layout */}
      {shownBadges.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          No badges match "{searchQuery}". Try a different search term.
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {shownBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </motion.div>
      )}

      {/* Show more button */}
      {filteredBadges.length > visible && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-lg border border-border bg-surface-hover/60 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover"
          >
            Show more ({filteredBadges.length - visible} remaining)
          </button>
        </div>
      )}

      {/* Disclaimer footer matching Badge Explorer */}
      <p className="mt-8 text-xs text-muted-foreground">
        Badge names, artwork, and points are provided for identification and
        learning purposes. ArcadeVerse is not affiliated with Google — official
        challenge details live on Google Cloud Skills Boost.
      </p>
    </div>
  );
}

export default ResourceCollectionPage;
