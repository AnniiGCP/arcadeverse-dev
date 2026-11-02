import { motion, useReducedMotion } from "framer-motion";
import { Check, Send, Star } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  "Points Calculator",
  "Dashboard",
  "Badge Explorer",
  "Leaderboard",
  "Resources",
  "Overall Experience",
] as const;

const RATING_LABELS = ["Very Poor", "Poor", "Okay", "Good", "Excellent"];

interface FeedbackPayload {
  rating: number;
  categories: string[];
  feedbackText?: string;
  pageContext: string;
  createdAt: string;
}

export function RateArcadeVerse({ context = "footer" }: { context?: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const reduce = useReducedMotion();

  const toggleCategory = (c: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please choose a star rating first.");
      return;
    }
    setSubmitting(true);
    setError("");
    const payload: FeedbackPayload = {
      rating,
      categories: Array.from(selected),
      feedbackText: text.trim() || undefined,
      pageContext: context,
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
    } catch {
      // Graceful local fallback so feedback is never lost
      try {
        const existing = JSON.parse(
          localStorage.getItem("arcadeverse_feedback_outbox") || "[]",
        );
        existing.push(payload);
        localStorage.setItem(
          "arcadeverse_feedback_outbox",
          JSON.stringify(existing),
        );
        setSubmitted(true);
      } catch {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-border bg-surface-elevated p-6 text-center shadow-surface"
      >
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent-green/10">
          <Check className="h-5 w-5 text-accent-green" aria-hidden />
        </div>
        <p className="mt-3 text-sm font-semibold text-foreground">
          Thanks for helping us improve ArcadeVerse.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Your feedback was received
          {rating ? ` — you rated us ${rating}/5` : ""}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-surface">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        Rate ArcadeVerse
      </h3>
      <p className="mt-2 text-sm text-foreground">
        How would you rate your experience?
      </p>

      {/* Star rating — keyboard accessible radio group */}
      <div
        className="mt-3 flex items-center gap-1"
        role="radiogroup"
        aria-label="Rating from 1 (Very Poor) to 5 (Excellent)"
      >
        {[1, 2, 3, 4, 5].map((value) => {
          const active = (hoverRating || rating) >= value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value > 1 ? "s" : ""} — ${RATING_LABELS[value - 1]}`}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(value)}
              className="rounded p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-accent-purple"
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  active
                    ? "fill-accent-yellow text-accent-yellow"
                    : "text-muted-foreground"
                }`}
                aria-hidden
              />
            </button>
          );
        })}
        <span className="ml-2 text-xs text-muted-foreground" aria-hidden>
          {hoverRating || rating
            ? RATING_LABELS[(hoverRating || rating) - 1]
            : "1 = Very Poor · 5 = Excellent"}
        </span>
      </div>

      {rating > 0 && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <fieldset className="mt-5">
            <legend className="text-sm font-medium text-foreground">
              What did you like?
            </legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCategory(c)}
                  aria-pressed={selected.has(c)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    selected.has(c)
                      ? "border-accent-purple/60 bg-accent-purple/15 text-foreground"
                      : "border-border bg-surface-hover/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-5">
            <label
              htmlFor="feedback-text"
              className="text-sm font-medium text-foreground"
            >
              What could we improve?{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <textarea
              id="feedback-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="Tell us what would make ArcadeVerse better…"
              className="mt-2 w-full resize-none rounded-lg border border-border bg-surface-hover/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent-purple/60 focus:outline-none"
            />
          </div>

          {error && (
            <p role="alert" className="mt-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent-purple px-5 py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                aria-hidden
              />
            ) : (
              <Send className="h-4 w-4" aria-hidden />
            )}
            Submit Feedback
          </button>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Anonymous — no account or personal data required.
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default RateArcadeVerse;
