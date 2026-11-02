import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { memo, useState } from "react";
import { Helmet } from "react-helmet-async";

const faqs: Array<{ q: string; a: string }> = [
  {
    q: "What is ArcadeVerse?",
    a: "ArcadeVerse is an independent community tool for Google Cloud Arcade learners. It calculates your Arcade points from your public Google Cloud Skills Boost profile, tracks badge and milestone progress, surfaces incomplete badges, and maintains a public leaderboard. It is not affiliated with or endorsed by Google.",
  },
  {
    q: "How does ArcadeVerse calculate Arcade points?",
    a: "When you paste your public Google Cloud Skills Boost profile URL, ArcadeVerse reads the badges visible on that profile and applies the Arcade points rules — such as points per skill badge, trivia badge, or game badge — to produce a total. The calculation runs server-side, and only the resulting summary is stored to power your dashboard and leaderboard entry.",
  },
  {
    q: "How do I use ArcadeVerse?",
    a: "Open the homepage, paste your Google Cloud Skills Boost public profile URL into the calculator, and press Calculate. You will be taken to your dashboard showing your points, badge distribution, milestone progress, and incomplete badges. You can switch between saved profiles from the navbar at any time.",
  },
  {
    q: "How do I find my Google Skills profile URL?",
    a: "Sign in to Google Cloud Skills Boost, open your account profile page, and copy the browser URL — it looks like a public profile link containing your unique profile ID. Make sure your profile visibility is set to public, otherwise ArcadeVerse cannot read your badges. See our detailed guide in Resources for step-by-step instructions.",
  },
  {
    q: "How do I find incomplete badges?",
    a: "Your dashboard includes an Incomplete Badges section listing Arcade challenges you have not yet completed, with filters for game and skill badges plus a search box. Each card links directly to the official challenge so you can start it immediately.",
  },
  {
    q: "What are Game Badges?",
    a: "Game badges are earned by completing Arcade games — timed, story-driven challenges on Google Cloud Arcade. They typically award more points than other badge types and count toward Arcade facilitator milestone requirements.",
  },
  {
    q: "What are Skill Badges?",
    a: "Skill badges are earned by completing structured learning paths on Google Cloud Skills Boost, usually a series of hands-on labs ending with an assessment. Each completed skill badge contributes to your Arcade points total.",
  },
  {
    q: "How does the ArcadeVerse leaderboard work?",
    a: "The leaderboard ranks ArcadeVerse profiles by their calculated Arcade points for the current season. When you calculate a profile, it is included in the ranking. Rankings update as profiles are recalculated after you earn new badges.",
  },
  {
    q: "Can I use ArcadeVerse without an account?",
    a: "Yes. ArcadeVerse requires no sign-up or password. You only need a public Google Cloud Skills Boost profile URL. Profiles you calculate are saved locally in your browser so you can switch between them quickly.",
  },
  {
    q: "Why is a badge missing from my results?",
    a: "ArcadeVerse can only read badges that are visible on your public profile. If your profile is private, if a badge was earned outside the current Arcade season window, or if Google has not yet reflected the completion on Skills Boost, it will not appear. Recalculate after your profile updates.",
  },
  {
    q: "Why has my progress not updated?",
    a: "Badge completions can take time to appear on your public Google Cloud Skills Boost profile. ArcadeVerse reads the profile live each time you calculate, so once Google reflects the change, press Calculate again and your dashboard and leaderboard entry will update.",
  },
  {
    q: "Is ArcadeVerse affiliated with Google?",
    a: 'No. ArcadeVerse is an independent community tool built for Arcade learners. It is not owned by, operated by, or endorsed by Google. "Google Cloud" and related marks are trademarks of Google LLC, and official Arcade information always comes from Google\'s own channels.',
  },
];

const FAQItem = memo(
  ({ q, a, index }: { q: string; a: string; index: number }) => {
    const [open, setOpen] = useState(false);
    const itemId = `faq-answer-${index}`;
    const buttonId = `faq-question-${index}`;
    return (
      <div className="rounded-xl border border-border bg-surface-elevated overflow-hidden">
        <button
          id={buttonId}
          aria-expanded={open}
          aria-controls={itemId}
          onClick={() => setOpen((o) => !o)}
          type="button"
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-hover/50"
        >
          <span className="text-sm font-semibold text-foreground">{q}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        <section
          id={itemId}
          aria-labelledby={buttonId}
          className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="overflow-hidden">
            <p className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
              {a}
            </p>
          </div>
        </section>
      </div>
    );
  },
);
FAQItem.displayName = "FAQItem";

export function FAQPage() {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
      </Helmet>
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-muted-foreground">
            Everything you need to know about using ArcadeVerse to track your
            Google Cloud Arcade progress.
          </p>
        </motion.div>

        <div className="mt-8 space-y-3">
          {faqs.map((f, i) => (
            <FAQItem key={f.q} q={f.q} a={f.a} index={i} />
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Still have questions? Visit the{" "}
          <a href="/support" className="text-accent-purple hover:underline">
            support page
          </a>{" "}
          or read the{" "}
          <a
            href="/resources/what-is-google-cloud-arcade"
            className="text-accent-purple hover:underline"
          >
            Arcade beginner guide
          </a>
          .
        </p>
      </div>
    </>
  );
}

export default FAQPage;
