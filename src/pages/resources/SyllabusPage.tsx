import { BadgeCard } from "@/components/BadgeCard";
import { Button } from "@/components/ui/button";
import type { CatalogBadge } from "@/data/badgeCatalog";
import { referenceSyllabusBadges } from "@/data/syllabusBadges";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  ChevronLeft,
  Gamepad2,
  Search,
  Sparkles,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const PAGE_SIZE = 32;

export function SyllabusPage() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "All" | "Game" | "Skill"
  >("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const reduce = useReducedMotion();

  const gameBadges = useMemo(() => {
    return referenceSyllabusBadges.filter((b) => b.category === "Game");
  }, []);

  const skillBadges = useMemo(() => {
    return referenceSyllabusBadges.filter((b) => b.category === "Skill");
  }, []);

  const counts = useMemo(() => {
    return {
      All: referenceSyllabusBadges.length,
      Game: gameBadges.length,
      Skill: skillBadges.length,
    };
  }, [gameBadges, skillBadges]);

  const filteredBadges = useMemo(() => {
    const q = query.trim().toLowerCase();
    return referenceSyllabusBadges.filter((b) => {
      if (categoryFilter === "Game" && b.category !== "Game") return false;
      if (categoryFilter === "Skill" && b.category !== "Skill") return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        (b.difficulty && b.difficulty.toLowerCase().includes(q)) ||
        (b.accessCode && b.accessCode.toLowerCase().includes(q))
      );
    });
  }, [query, categoryFilter]);

  const shownBadges = filteredBadges.slice(0, visible);

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <Helmet>
        <title>
          Google Cloud Arcade 2026 Badge Syllabus & Catalog | ArcadeVerse
        </title>
        <meta
          name="description"
          content="Complete, up-to-date catalog of all 98 active Google Cloud Arcade 2026 Game Badges (6 badges, 1.0 Pt) and Skill Badges (92 badges, 0.5 Pt) with direct access codes and lab links."
        />
        <link
          rel="canonical"
          href="https://arcadeverse.vercel.app/resources/syllabus"
        />
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <Link
            to="/resources"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Resources</span>
          </Link>
          <span>/</span>
          <span className="text-accent-purple">Arcade 2026 Syllabus</span>
        </div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3 py-1 text-xs font-medium text-accent-purple">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Official 2026 Syllabus & Badge Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-display">
            Google Cloud Arcade 2026 Badge Syllabus
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Explore every active Game Badge (1.0 Pt) and Skill Badge (0.5 Pt)
            tracked for the Google Cloud Arcade. Search by title, copy access
            codes, or jump directly into the official challenge on Google Cloud
            Skills Boost.
          </p>
        </motion.div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
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
              placeholder="Search badges by name, access code, or category…"
              aria-label="Search badges"
              className="w-full rounded-xl border border-border bg-surface-hover/40 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent-purple/60 focus:outline-none transition-colors shadow-sm"
            />
          </div>

          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter badges by type"
          >
            <button
              onClick={() => {
                setCategoryFilter("All");
                setVisible(PAGE_SIZE);
              }}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                categoryFilter === "All"
                  ? "border-accent-purple/60 bg-accent-purple/15 text-foreground font-bold shadow-sm"
                  : "border-border bg-surface-hover/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              All Badges ({counts.All})
            </button>
            <button
              onClick={() => {
                setCategoryFilter("Game");
                setVisible(PAGE_SIZE);
              }}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                categoryFilter === "Game"
                  ? "border-amber-500/60 bg-amber-500/15 text-amber-300 font-bold shadow-sm"
                  : "border-border bg-surface-hover/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              Game Badges ({counts.Game})
            </button>
            <button
              onClick={() => {
                setCategoryFilter("Skill");
                setVisible(PAGE_SIZE);
              }}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                categoryFilter === "Skill"
                  ? "border-blue-500/60 bg-blue-500/15 text-blue-300 font-bold shadow-sm"
                  : "border-border bg-surface-hover/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              Skill Badges ({counts.Skill})
            </button>
          </div>
        </div>

        {/* Distinct Sections when filter is All and no search query */}
        {categoryFilter === "All" && !query ? (
          <div className="space-y-12">
            {/* Monthly Game Badges Section */}
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Gamepad2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      Monthly Game Badges
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      6 active game badges for October 2026 · 1.0 Arcade Point
                      each
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                  1.0 Pt / Badge
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5">
                {gameBadges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </div>

            {/* Skill Badges Section */}
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      Skill Badges
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      88 official hands-on skill badges · 0.5 Arcade Point each
                      (2 Skill Badges = 1 Point)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-md border border-blue-400/20">
                  0.5 Pt / Badge
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {skillBadges.slice(0, visible).map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>

              {skillBadges.length > visible && (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="rounded-xl border border-border bg-surface-hover/60 hover:bg-surface-hover px-6 py-2.5 text-sm font-semibold text-foreground transition-all shadow-sm"
                  >
                    Show more skill badges ({skillBadges.length - visible}{" "}
                    remaining)
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Filtered or Searched Badges Grid */
          <div className="space-y-6">
            <div className="text-xs text-muted-foreground font-mono">
              Showing {shownBadges.length} of {filteredBadges.length} matching
              badges
            </div>

            {shownBadges.length === 0 ? (
              <div className="py-20 text-center text-sm text-muted-foreground">
                No badges match "{query}". Try searching with a different term
                or clear your filters.
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

            {filteredBadges.length > visible && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="rounded-xl border border-border bg-surface-hover/60 hover:bg-surface-hover px-6 py-2.5 text-sm font-semibold text-foreground transition-all shadow-sm"
                >
                  Show more ({filteredBadges.length - visible} remaining)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action CTAs Bottom Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-2xl border border-border bg-gradient-to-r from-accent-purple/10 via-surface-card to-blue-500/10 p-6 sm:p-8 shadow-card-premium flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              Verify your completed syllabus badges
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              Paste your public profile link to automatically analyze which
              badges you've finished, calculate remaining points, and plan your
              next learning sprint.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-md"
            >
              <Link to="/">
                <span>Calculate My Points</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-border bg-surface-card"
            >
              <Link to="/resources/point-system">
                <span>Point System Guide</span>
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Disclaimer Footer */}
        <p className="text-xs text-muted-foreground">
          Badge names, artwork, and points are provided for identification and
          learning purposes. ArcadeVerse is not affiliated with Google —
          official challenge details live on Google Cloud Skills Boost.
        </p>
      </div>
    </div>
  );
}

export default SyllabusPage;
