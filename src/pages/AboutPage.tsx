import { Helmet } from "react-helmet-async";

export function AboutPage() {
  return (
    <section className="container max-w-4xl py-10 sm:py-14 space-y-6">
      <Helmet>
        <title>
          About ArcadeVerse | Independent Google Cloud Arcade Community Tracker
        </title>
        <meta
          name="description"
          content="Learn about ArcadeVerse, our mission, how we maintain accurate Arcade tracking logic, and our commitment to transparency."
        />
        <link rel="canonical" href="https://arcadeverse.vercel.app/about" />
      </Helmet>

      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold">About ArcadeVerse</h1>
        <p className="text-muted-foreground">
          ArcadeVerse is an independent progress tracking companion designed for
          Google Cloud Arcade participants who want clarity, consistency, and
          better planning throughout each cohort.
        </p>
      </header>

      <div className="space-y-4 text-sm sm:text-base leading-7 text-muted-foreground">
        <p>
          ArcadeVerse was built to solve a practical problem: many learners
          complete a lot of work but still struggle to understand where they
          stand until late in the cohort. Official platforms provide the source
          of truth, but users often need a faster way to estimate points,
          compare milestone progress, and identify what to do next. ArcadeVerse
          turns that uncertainty into a clear daily workflow.
        </p>
        <p>
          The project focuses on usability and transparency. Instead of
          presenting a black-box score, ArcadeVerse shows structured progress
          views, badge tracking context, and practical indicators that help
          participants make better decisions. Whether you are aiming for a first
          milestone or a top-tier finish, the goal is to help you move with a
          repeatable strategy rather than guesswork.
        </p>
        <p>
          ArcadeVerse is especially useful for learners who are balancing
          studies, work, or multiple certifications. By giving you a quick
          estimate of progress and remaining effort, it becomes easier to plan
          weekly targets and reduce last-minute stress. Consistency usually
          beats intensity in long cohorts, and the platform is designed around
          that principle.
        </p>
        <p>
          We continuously review and improve data mappings, event
          interpretations, and UI flows to keep the experience useful as cohort
          structures evolve. When possible, updates are designed to be additive
          so returning users can keep familiar workflows while benefiting from
          clearer insights.
        </p>
        <p>
          Who is ArcadeVerse for? It is for beginners who need guidance,
          intermediate learners who need speed, and advanced participants who
          want cleaner visibility into completion patterns. It is also for
          facilitators and community members who support other learners and need
          a practical way to monitor progress over time.
        </p>
        <p>
          What makes ArcadeVerse different is its focus on practical decision
          support. The platform is not trying to replace official systems. It is
          a utility layer that helps participants understand momentum, spot gaps
          early, and stay on track throughout the cohort.
        </p>
        <p>
          ArcadeVerse is an independent project and is not affiliated with,
          endorsed by, or sponsored by Google LLC. Google Cloud and Google Cloud
          Arcade are trademarks of Google LLC. Third-party names, logos, and
          product marks remain the property of their respective owners.
        </p>
        <p>
          If you notice a discrepancy in point estimation, badge interpretation,
          or page behavior, please contact us through the Support page so we can
          investigate and improve quickly. User feedback is central to how
          ArcadeVerse evolves.
        </p>
        <p>
          Disclaimer: ArcadeVerse provides informational estimates and analytics
          only. Official point totals, eligibility, reward decisions, and policy
          enforcement are determined by the respective official platforms and
          published program rules.
        </p>
      </div>
    </section>
  );
}
