import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type CatalogBadge, allLabFreeCourses } from "@/data/badgeCatalog";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ExternalLink,
  Filter,
  GraduationCap,
  HelpCircle,
  Layers,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const TOPIC_CATEGORIES = [
  "All",
  "Generative AI",
  "Cloud Foundations",
  "Workspace",
  "Security & Ops",
] as const;

type TopicCategory = (typeof TOPIC_CATEGORIES)[number];

function categorizeCourse(title: string): TopicCategory {
  const lower = title.toLowerCase();
  if (
    lower.includes("gen ai") ||
    lower.includes("large language") ||
    lower.includes("artificial intelligence") ||
    lower.includes("mlops") ||
    lower.includes("conversational ai") ||
    lower.includes("dialogflow") ||
    lower.includes("ai infrastructure")
  ) {
    return "Generative AI";
  }
  if (
    lower.includes("drive") ||
    lower.includes("docs") ||
    lower.includes("slides") ||
    lower.includes("meet") ||
    lower.includes("sheets") ||
    lower.includes("calendar")
  ) {
    return "Workspace";
  }
  if (
    lower.includes("security") ||
    lower.includes("trust") ||
    lower.includes("operations") ||
    lower.includes("responsible ai")
  ) {
    return "Security & Ops";
  }
  return "Cloud Foundations";
}

const FAQ_ITEMS = [
  {
    question: "What are Google Cloud Lab-Free Courses?",
    answer:
      "Lab-free courses are self-paced learning paths hosted on Google Cloud Skills Boost that consist of video lectures, reading modules, and quizzes. Unlike challenge labs, they do not require starting a virtual cloud sandbox or consuming monthly lab credits.",
  },
  {
    question: "Do lab-free courses require Google Cloud Skills Boost credits?",
    answer:
      "No! All 24 verified courses listed in this catalog are 100% free of charge. You do not need any credits, subscriptions, or credit card information to enroll and complete them.",
  },
  {
    question: "Do lab-free courses earn Arcade Points?",
    answer:
      "In the standard Google Cloud Arcade, base points are awarded for Game Badges (1.0 Pt) and Skill Badges (0.5 Pt). Lab-free courses award completion badges on your Skills Boost profile. They are designed as fundamental preparation for harder challenge labs and historically served as Facilitator cohort bonus prerequisites.",
  },
  {
    question: "Can I display lab-free course completions on my public profile?",
    answer:
      "Yes! Upon passing the course quiz and reviewing all modules, the official course completion badge automatically displays on your public Google Cloud Skills Boost profile badge showcase.",
  },
];

export function LabFreeCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedTopic, setSelectedTopic] = useState<TopicCategory>("All");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const coursesWithTopic = useMemo(() => {
    return allLabFreeCourses.map((course) => ({
      ...course,
      topic: categorizeCourse(course.title),
    }));
  }, []);

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return coursesWithTopic.filter((course) => {
      // Difficulty filter
      if (selectedDifficulty !== "All") {
        if (
          course.difficulty?.toLowerCase() !== selectedDifficulty.toLowerCase()
        ) {
          return false;
        }
      }
      // Topic filter
      if (selectedTopic !== "All") {
        if (course.topic !== selectedTopic) {
          return false;
        }
      }
      // Search query
      if (!query) return true;
      return (
        course.title.toLowerCase().includes(query) ||
        course.topic.toLowerCase().includes(query) ||
        course.difficulty?.toLowerCase().includes(query)
      );
    });
  }, [coursesWithTopic, searchQuery, selectedDifficulty, selectedTopic]);

  const difficultyCounts = useMemo(() => {
    const counts: Record<string, number> = { All: allLabFreeCourses.length };
    for (const c of allLabFreeCourses) {
      const diff = c.difficulty || "Introductory";
      counts[diff] = (counts[diff] || 0) + 1;
    }
    return counts;
  }, []);

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = { All: coursesWithTopic.length };
    for (const c of coursesWithTopic) {
      counts[c.topic] = (counts[c.topic] || 0) + 1;
    }
    return counts;
  }, [coursesWithTopic]);

  const canonicalUrl =
    "https://arcadeverse.vercel.app/resources/lab-free-courses";

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <Helmet>
        <title>
          Google Cloud Lab-Free Courses Catalog (24 Free Courses) | ArcadeVerse
        </title>
        <meta
          name="description"
          content="Explore all 24 official zero-credit Google Cloud lab-free courses. Learn Generative AI, cloud infrastructure, and Workspace essentials without consuming lab credits."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content="Google Cloud Lab-Free Courses Catalog | ArcadeVerse"
        />
        <meta
          property="og:description"
          content="Explore 24 verified lab-free courses on Google Cloud Skills Boost with zero credit cost."
        />
        <meta property="og:url" content={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Google Cloud Lab-Free Courses",
            description:
              "Verified catalog of 24 lab-free, zero-credit courses on Google Cloud Skills Boost.",
            numberOfItems: allLabFreeCourses.length,
            itemListElement: allLabFreeCourses.map((c, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              name: c.title,
              url: c.url,
            })),
          })}
        </script>
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
          <span className="text-accent-purple">Lab-Free Courses</span>
        </div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>ZERO LAB CREDITS REQUIRED • 24 VERIFIED COURSES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-display">
            Google Cloud Lab-Free Courses Catalog
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Master cloud fundamentals, Generative AI architecture, Google
            Workspace, and Responsible AI principles. These courses require zero
            lab credits and feature self-paced videos, readings, and knowledge
            checks on Google Skills.
          </p>
        </motion.div>

        {/* Quick Value Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-card-premium space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
                CREDIT COST
              </span>
              <span className="p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            <p className="text-2xl font-extrabold text-foreground font-display">
              0 Credits
            </p>
            <p className="text-xs text-muted-foreground">
              100% free to enroll and complete anytime.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-card-premium space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
                CATALOG SIZE
              </span>
              <span className="p-2 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-500">
                <BookOpen className="h-4 w-4" />
              </span>
            </div>
            <p className="text-2xl font-extrabold text-foreground font-display">
              24 Courses
            </p>
            <p className="text-xs text-muted-foreground">
              Introductory & Intermediate tracks available.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-card-premium space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
                GEN AI CONTENT
              </span>
              <span className="p-2 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-500">
                <Sparkles className="h-4 w-4" />
              </span>
            </div>
            <p className="text-2xl font-extrabold text-foreground font-display">
              10+ AI Courses
            </p>
            <p className="text-xs text-muted-foreground">
              Vertex AI, LLMs, Agents, and Prompting.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-card-premium space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
                CREDENTIALS
              </span>
              <span className="p-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500">
                <Award className="h-4 w-4" />
              </span>
            </div>
            <p className="text-2xl font-extrabold text-foreground font-display">
              Digital Badges
            </p>
            <p className="text-xs text-muted-foreground">
              Published to your public Google Skills profile.
            </p>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by course title or topic..."
                className="w-full rounded-xl border border-border bg-surface-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent-purple/60 focus:outline-none transition-colors shadow-xs"
              />
            </div>

            {/* Difficulty Toggle */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-semibold text-muted-foreground mr-1 hidden sm:inline">
                Difficulty:
              </span>
              {["All", "Introductory", "Intermediate"].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedDifficulty === diff
                      ? "border border-accent-purple/60 bg-accent-purple/15 text-foreground font-semibold shadow-xs"
                      : "border border-border bg-surface-card text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  {diff} ({difficultyCounts[diff] ?? 0})
                </button>
              ))}
            </div>
          </div>

          {/* Topic Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
            <span className="text-xs font-mono font-semibold text-muted-foreground mr-1">
              Category:
            </span>
            {TOPIC_CATEGORIES.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  selectedTopic === topic
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "border border-border/70 bg-surface-card/70 text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                {topic} ({topicCounts[topic] ?? 0})
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/40 pb-3">
          <span>
            Showing <strong>{filteredCourses.length}</strong> of{" "}
            {allLabFreeCourses.length} verified courses
          </span>
          {(searchQuery ||
            selectedDifficulty !== "All" ||
            selectedTopic !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedDifficulty("All");
                setSelectedTopic("All");
              }}
              className="text-accent-purple hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface-card p-12 text-center space-y-3">
            <p className="text-lg font-semibold text-foreground">
              No matching courses found
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search terms or clearing difficulty filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedDifficulty("All");
                setSelectedTopic("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                className="flex flex-col justify-between rounded-2xl border border-border bg-surface-card overflow-hidden shadow-card-premium transition-all hover:-translate-y-1 hover:border-accent-purple/50 group"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative h-44 bg-surface-hover/40 dark:bg-[#080c16] border-b border-border flex items-center justify-center p-4 overflow-hidden">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <BookOpen className="h-12 w-12 text-muted-foreground/40" />
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] font-mono">
                        0 Credits
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-background/80 backdrop-blur-xs font-mono"
                      >
                        {course.difficulty || "Introductory"}
                      </Badge>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-accent-purple">
                      <span>{course.topic}</span>
                      <span>•</span>
                      <span>{course.level || "Course"}</span>
                    </div>
                    <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2 min-h-[44px]">
                      {course.title}
                    </h3>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <a
                    href={course.url || "https://www.cloudskillsboost.google"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
                  >
                    <span>Start Course</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Educational Callout Panel */}
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <GraduationCap className="h-6 w-6" />
            <h2 className="text-xl font-bold font-display">
              How to Make the Most of Lab-Free Courses
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="rounded-xl border border-blue-500/20 bg-background/60 p-4 space-y-1.5">
              <p className="font-bold text-foreground">
                1. Zero Pressure Learning
              </p>
              <p className="text-xs leading-relaxed">
                No lab countdown timers or credit deductions. Take your time to
                review architecture diagrams and concepts before taking the
                quiz.
              </p>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-background/60 p-4 space-y-1.5">
              <p className="font-bold text-foreground">
                2. Build Prerequisite Knowledge
              </p>
              <p className="text-xs leading-relaxed">
                Take the Gen AI and Vertex AI lab-free courses first before
                tackling the timed hands-on Skill Badge challenge labs.
              </p>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-background/60 p-4 space-y-1.5">
              <p className="font-bold text-foreground">
                3. Public Profile Credibility
              </p>
              <p className="text-xs leading-relaxed">
                Every completed course permanently posts to your public Google
                Skills profile badge reel, demonstrating consistent cloud study
                habits.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-card-premium space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-accent-purple" />
            <h2 className="text-xl font-bold text-foreground font-display">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.question}
                  className="rounded-xl border border-border/70 bg-background/60 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm sm:text-base text-foreground hover:text-accent-purple transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-accent-purple" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action CTAs Bottom Card */}
        <div className="rounded-2xl border border-border bg-gradient-to-r from-accent-purple/10 via-surface-card to-emerald-500/10 p-6 sm:p-8 shadow-card-premium flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              NEXT STEPS FOR ARCADE LEARNERS
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-2">
              Ready to earn points on hands-on challenges?
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              Check out the active 2026 Badge Syllabus to find point-earning
              Game Badges (1 Pt) and Skill Badges (0.5 Pt), or calculate your
              current standing.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-md"
            >
              <Link to="/resources/syllabus">
                <span>View 2026 Syllabus</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-border bg-surface-card"
            >
              <Link to="/">
                <span>Points Calculator</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabFreeCoursesPage;
