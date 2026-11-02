import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type CardsSection,
  type ChecklistSection,
  type FaqSection,
  type FlowchartSection,
  type Section,
  type SourcesSection,
  type TableSection,
  articles,
} from "@/data/articles";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Clock,
  Compass,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  ListChecks,
  Sparkles,
} from "lucide-react";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

function renderTextWithLinks(text?: string) {
  if (!text) return null;

  const parts = text.split(/(https?:\/\/[^\s)]+|www\.[^\s)]+)/g);

  return parts.map((part, index) => {
    const isUrl = /^(https?:\/\/|www\.)/.test(part);
    const partKey = `${part.slice(0, 15)}-${part.length}-${index}`;
    if (!isUrl) {
      // Check for bold markdown text **foo**
      if (part.includes("**")) {
        const subparts = part.split(/\*\*(.*?)\*\*/g);
        return (
          <span key={partKey}>
            {subparts.map((sub, i) =>
              i % 2 === 1 ? (
                <strong
                  key={`${sub.slice(0, 15)}-${sub.length}-${i}`}
                  className="font-bold text-foreground dark:text-white"
                >
                  {sub}
                </strong>
              ) : (
                sub
              ),
            )}
          </span>
        );
      }
      return <span key={partKey}>{part}</span>;
    }

    const href = part.startsWith("www.") ? `https://${part}` : part;
    return (
      <a
        key={partKey}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-accent-purple hover:text-accent-purple/80 underline underline-offset-4 break-all transition-colors inline-flex items-center gap-0.5"
      >
        <span>{part}</span>
        <ExternalLink className="h-3 w-3 inline shrink-0" />
      </a>
    );
  });
}

function renderTable(section: TableSection, key: string | number) {
  return (
    <div key={key} className="space-y-3 my-8">
      {section.title && (
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent-purple shrink-0" />
          <h4 className="text-base sm:text-lg font-bold text-foreground font-display">
            {section.title}
          </h4>
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface-card shadow-card-premium">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border/80 bg-surface-hover/50 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              {section.headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 sm:px-6 sm:py-3.5 whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {section.rows.map((row, rIdx) => {
              const rowKey =
                typeof row[0] === "string"
                  ? `${row[0]}-${rIdx}`
                  : `${row[0]?.text || "row"}-${rIdx}`;
              return (
                <tr
                  key={rowKey}
                  className="hover:bg-surface-hover/30 transition-colors"
                >
                  {row.map((cell, cIdx) => {
                    const cellKey =
                      typeof cell === "string"
                        ? `${cell.slice(0, 20)}-${cIdx}`
                        : `${cell.text.slice(0, 20)}-${cIdx}`;
                    if (typeof cell === "string") {
                      return (
                        <td
                          key={cellKey}
                          className="px-4 py-3.5 sm:px-6 text-foreground/90 leading-relaxed align-top"
                        >
                          {renderTextWithLinks(cell)}
                        </td>
                      );
                    }

                    return (
                      <td
                        key={cellKey}
                        className="px-4 py-3.5 sm:px-6 leading-relaxed align-top"
                      >
                        <div className="flex flex-col gap-1 items-start">
                          {cell.badge && (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-md border-accent-purple/40 text-accent-purple bg-accent-purple/10"
                            >
                              {cell.badge}
                            </Badge>
                          )}
                          <span className="text-foreground/90 font-medium">
                            {renderTextWithLinks(cell.text)}
                          </span>
                          {cell.link && (
                            <a
                              href={cell.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-accent-purple hover:underline inline-flex items-center gap-1 mt-1"
                            >
                              <span>Official Learning Link</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {section.caption && (
        <p className="text-xs text-muted-foreground italic px-2">
          Note: {section.caption}
        </p>
      )}
    </div>
  );
}

function renderCards(section: CardsSection, key: string | number) {
  const colClass =
    section.columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : section.columns === 4
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div key={key} className="space-y-4 my-8">
      {section.title && (
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent-purple shrink-0" />
          <h4 className="text-base sm:text-lg font-bold text-foreground font-display">
            {section.title}
          </h4>
        </div>
      )}
      {section.description && (
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {section.description}
        </p>
      )}
      <div className={`grid ${colClass} gap-4 sm:gap-6`}>
        {section.items.map((card, idx) => (
          <div
            key={`${card.title}-${idx}`}
            className="flex flex-col justify-between rounded-2xl border border-border bg-surface-card p-5 sm:p-6 shadow-card-premium hover:border-accent-purple/50 transition-colors space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                {card.stepNumber ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-purple/15 text-accent-purple font-mono font-bold text-xs border border-accent-purple/30">
                    {card.stepNumber}
                  </span>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-accent-purple" />
                )}
                {card.badge && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono uppercase bg-accent-purple/10 text-accent-purple border-accent-purple/30"
                  >
                    {card.badge}
                  </Badge>
                )}
              </div>
              <h5 className="font-bold text-sm sm:text-base text-foreground font-display">
                {card.title}
              </h5>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {renderTextWithLinks(card.description)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqAccordion({
  section,
  sectionKey,
}: { section: FaqSection; sectionKey: string | number }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div key={sectionKey} className="space-y-4 my-8">
      {section.title && (
        <div className="border-b border-border/60 pb-3">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground font-display flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-accent-purple" />
            <span>{section.title}</span>
          </h3>
          {section.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {section.description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-3">
        {section.items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={`${item.question.slice(0, 30)}-${idx}`}
              className="rounded-2xl border border-border/80 bg-surface-card overflow-hidden shadow-card-premium transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm sm:text-base text-foreground hover:text-accent-purple transition-colors gap-3"
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
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
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                      {renderTextWithLinks(item.answer)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function renderDiagram(section: FlowchartSection, key: string | number) {
  return (
    <div
      key={key}
      className="my-8 rounded-2xl border border-accent-purple/30 bg-surface-card p-6 sm:p-8 shadow-card-premium space-y-6"
    >
      <div className="space-y-1.5 border-b border-border/60 pb-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-accent-purple uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>EDUCATIONAL FLOWCHART</span>
        </div>
        {section.title && (
          <h4 className="text-xl font-bold text-foreground font-display">
            {section.title}
          </h4>
        )}
        {section.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {section.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
        {section.steps.map((step, idx) => (
          <div
            key={`${step.step || "step"}-${step.title}-${idx}`}
            className="flex flex-col justify-between rounded-xl border border-border/80 bg-background/80 p-5 space-y-3 relative hover:border-accent-purple/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-purple/15 text-accent-purple font-mono font-bold text-xs border border-accent-purple/30">
                {step.step || `0${idx + 1}`}
              </span>
              {step.badge && (
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono uppercase bg-surface-card text-muted-foreground"
                >
                  {step.badge}
                </Badge>
              )}
            </div>
            <h5 className="font-bold text-sm text-foreground">{step.title}</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderSources(section: SourcesSection, key: string | number) {
  return (
    <div
      key={key}
      className="my-10 rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-card-premium space-y-4"
    >
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <BookOpen className="h-5 w-5 text-accent-purple" />
        <h3 className="text-lg sm:text-xl font-bold text-foreground font-display">
          {section.title || "Sources and Further Reading"}
        </h3>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground">
        All claims in this guide are directly cited from official Google Cloud
        documentation, verified Google Skills Boost announcements, and Developer
        Community program updates.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {section.items.map((item, idx) => (
          <a
            key={`${item.url || item.title}-${idx}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between rounded-xl border border-border/80 bg-background/70 p-4 hover:border-accent-purple/60 hover:bg-surface-hover transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-semibold text-accent-purple">
                  {item.publisher}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent-purple transition-colors" />
              </div>
              <h5 className="text-sm font-semibold text-foreground group-hover:text-accent-purple transition-colors line-clamp-2">
                {item.title}
              </h5>
              {item.note && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.note}
                </p>
              )}
            </div>
            {item.date && (
              <span className="text-[11px] font-mono text-muted-foreground/80 mt-2 block">
                Verified: {item.date}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

function renderChecklist(section: ChecklistSection, key: string | number) {
  return (
    <div
      key={key}
      className="my-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8 shadow-card-premium space-y-4"
    >
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <ListChecks className="h-5 w-5 text-emerald-500" />
        <h4 className="text-base sm:text-lg font-bold text-foreground font-display">
          {section.title || "Actionable Verification Checklist"}
        </h4>
      </div>
      {section.description && (
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {section.description}
        </p>
      )}
      <div className="space-y-3 pt-2">
        {section.items.map((item, idx) => (
          <div
            key={`${item.task}-${idx}`}
            className="flex items-start gap-3 rounded-xl border border-border/80 bg-background/80 p-4 hover:border-emerald-500/50 transition-colors"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-500 font-bold text-xs shrink-0 mt-0.5 border border-emerald-500/40">
              ✓
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-foreground">
                  {renderTextWithLinks(item.task)}
                </span>
                {item.badge && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              {item.detail && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {renderTextWithLinks(item.detail)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderSection(section: Section, index: number) {
  switch (section.type) {
    case "h2": {
      const headingId = section.text
        ? section.text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
        : `section-${index}`;
      return (
        <div
          key={index}
          className="border-b border-border/60 pb-3 mt-12 mb-6 scroll-mt-24"
        >
          <h2
            id={headingId}
            className="text-2xl sm:text-3xl font-bold text-foreground font-display flex items-center gap-2.5"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-accent-purple shrink-0 inline-block" />
            <span>{section.text}</span>
          </h2>
        </div>
      );
    }
    case "h3":
      return (
        <h3
          key={index}
          className="text-lg sm:text-xl font-bold text-foreground font-display mt-8 mb-3"
        >
          {section.text}
        </h3>
      );
    case "p":
      return (
        <p
          key={index}
          className="text-foreground/90 text-sm sm:text-base leading-relaxed my-3"
        >
          {renderTextWithLinks(section.text)}
        </p>
      );
    case "ul":
      return (
        <ul key={index} className="space-y-2.5 my-4 pl-2">
          {section.items?.map((item, i) => (
            <li
              key={`${item.slice(0, 25)}-${i}`}
              className="flex items-start gap-2.5 text-sm sm:text-base text-foreground/90 leading-relaxed"
            >
              <CheckCircle2 className="h-4 w-4 text-accent-purple shrink-0 mt-1" />
              <span>{renderTextWithLinks(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={index} className="space-y-3 my-4 pl-2">
          {section.items?.map((item, i) => (
            <li
              key={`${item.slice(0, 25)}-${i}`}
              className="flex items-start gap-3 text-sm sm:text-base text-foreground/90 leading-relaxed"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-purple/10 text-accent-purple font-mono font-bold text-xs shrink-0 mt-0.5 border border-accent-purple/30">
                {i + 1}
              </span>
              <span>{renderTextWithLinks(item)}</span>
            </li>
          ))}
        </ol>
      );
    case "tip":
      return (
        <div
          key={index}
          className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 sm:p-6 my-6 text-foreground shadow-sm space-y-1.5"
        >
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <Lightbulb className="h-4 w-4" />
            <span>PRACTICAL PRO TIP</span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {renderTextWithLinks(section.text)}
          </p>
        </div>
      );
    case "callout":
      return (
        <div
          key={index}
          className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 sm:p-6 my-6 text-foreground shadow-sm space-y-1.5"
        >
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>CRITICAL ADVICE & VERIFICATION NOTE</span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {renderTextWithLinks(section.text)}
          </p>
        </div>
      );
    case "image":
      return (
        <figure
          key={index}
          className="my-8 rounded-2xl overflow-hidden border border-border bg-surface-card shadow-card-premium max-w-2xl mx-auto"
        >
          {section.src ? (
            <div className="flex items-center justify-center p-4 sm:p-6 bg-[#080d1a]/60">
              <img
                src={section.src}
                alt={section.alt || "Resource animation"}
                className="h-auto max-h-[380px] w-auto max-w-full rounded-xl object-contain shadow-xs"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : null}
          {section.caption ? (
            <figcaption className="border-t border-border/60 px-5 py-3 text-xs text-muted-foreground bg-surface-hover/30 flex items-center justify-between gap-2">
              <span>{section.caption}</span>
              <span className="text-[10px] font-mono text-accent-purple/80 shrink-0">
                LottieFiles Free License
              </span>
            </figcaption>
          ) : null}
        </figure>
      );
    case "table":
      return renderTable(section as TableSection, index);
    case "cards":
      return renderCards(section as CardsSection, index);
    case "faq":
      return (
        <FaqAccordion
          key={index}
          section={section as FaqSection}
          sectionKey={index}
        />
      );
    case "diagram":
      return renderDiagram(section as FlowchartSection, index);
    case "checklist":
      return renderChecklist(section as ChecklistSection, index);
    case "sources":
      return renderSources(section as SourcesSection, index);
    default:
      return null;
  }
}

export default function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((entry) => entry.slug === slug);

  if (!article) {
    return (
      <section className="container max-w-5xl py-12 sm:py-16 text-foreground">
        <Helmet>
          <title>Article Not Found | ArcadeVerse</title>
          <meta
            name="description"
            content="The requested ArcadeVerse article could not be found. Browse all guides from the resources hub."
          />
        </Helmet>
        <div className="rounded-2xl border border-border bg-surface-card p-8 text-center space-y-4 shadow-card-premium">
          <h1 className="text-3xl font-bold">Article Not Found</h1>
          <p className="text-muted-foreground">
            This guide may have been updated or relocated. Return to the
            Resources Hub to explore our active guides.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/resources">Return to Resources Hub</Link>
          </Button>
        </div>
      </section>
    );
  }

  const moreArticles = articles
    .filter((entry) => entry.slug !== article.slug)
    .slice(0, 3);
  const canonicalUrl = `https://arcadeverse.vercel.app/resources/${article.slug}`;

  return (
    <div className="min-h-screen bg-background text-foreground py-8 sm:py-12">
      <Helmet>
        <title>{`${article.title} | ArcadeVerse`}</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${article.title} | ArcadeVerse`} />
        <meta property="og:description" content={article.description} />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
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
          <span className="text-accent-purple truncate max-w-[200px] sm:max-w-none">
            {article.category}
          </span>
        </div>

        {/* Hero Section */}
        <motion.header
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-5"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-purple/30 bg-accent-purple/10 px-3 py-1 text-xs font-medium text-accent-purple">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-mono uppercase font-bold tracking-wider">
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-display leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground pt-2 border-t border-border/60">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-accent-purple" />
              <span>{article.readTime}</span>
            </span>
            <span>•</span>
            <span>Published: {article.publishedDate}</span>
            <span>•</span>
            <span className="text-emerald-500 font-semibold">
              Research-Backed & Verified
            </span>
          </div>

          {/* Quick Stats Grid Banner (Matches Reference Design) */}
          {article.quickStats && article.quickStats.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/60">
              {article.quickStats.map((stat, i) => (
                <div
                  key={`${stat.label}-${i}`}
                  className="rounded-xl border border-border/80 bg-surface-card p-4 space-y-1 shadow-card-premium"
                >
                  <span className="text-xs font-mono text-muted-foreground uppercase">
                    {stat.label}
                  </span>
                  <p
                    className={`text-xl font-bold ${stat.color || "text-accent-purple"}`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {stat.detail}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.header>

        {/* Main Article Content Sections - Sitting directly on background */}
        <article className="space-y-10 sm:space-y-12">
          {article.content.map((section, index) =>
            renderSection(section, index),
          )}
        </article>

        {/* Interactive Progress CTA Banner */}
        <div className="rounded-2xl border border-accent-purple/30 bg-gradient-to-r from-accent-purple/10 via-surface-card to-background p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-card-premium">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent-purple uppercase">
              <Sparkles className="h-4 w-4" />
              <span>ARCADEVERSE PROGRESS CALCULATOR</span>
            </div>
            <h3 className="text-xl font-bold text-foreground font-display">
              Ready to check your points standing?
            </h3>
            <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
              Paste your public Google Cloud Skills Boost profile into our
              parity-verified calculator to track badges, milestones, and prize
              tiers.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 shrink-0 shadow-md"
          >
            <Link to="/">
              <span>Launch Calculator</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* More Articles Section */}
        <section aria-label="Related Guides" className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-xl font-bold text-foreground font-display flex items-center gap-2">
              <Compass className="h-5 w-5 text-accent-purple" />
              <span>Related ArcadeVerse Guides</span>
            </h3>
            <Link
              to="/resources"
              className="text-xs font-semibold text-accent-purple hover:underline"
            >
              Browse All Resources →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {moreArticles.map((item) => (
              <Link
                key={item.slug}
                to={`/resources/${item.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-border bg-surface-card p-5 hover:border-accent-purple/60 hover:bg-surface-hover transition-colors shadow-card-premium space-y-3"
              >
                <div className="space-y-2">
                  <span className="text-xs font-mono text-accent-purple uppercase font-semibold">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-accent-purple transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground/80 pt-2 border-t border-border/40">
                  <span>{item.readTime}</span>
                  <ArrowRight className="h-3 w-3 text-accent-purple group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
