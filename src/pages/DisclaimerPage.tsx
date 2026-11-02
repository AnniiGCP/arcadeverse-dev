export function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
        Disclaimer
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: October 2026
      </p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Independent tool
          </h2>
          <p className="mt-2">
            ArcadeVerse is an independent, community-built tool for learners
            participating in the Google Cloud Arcade program. ArcadeVerse is not
            affiliated with, endorsed by, sponsored by, or officially connected
            to Google LLC or Google Cloud in any way. ArcadeVerse is not an
            official Google product or service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Trademarks</h2>
          <p className="mt-2">
            "Google", "Google Cloud", "Google Cloud Skills Boost", "Google Cloud
            Arcade", and related names, logos, and badges are trademarks of
            Google LLC. All badge artwork, tier imagery, and product names
            referenced on ArcadeVerse belong to their respective owners and are
            used here for identification and informational purposes only. No
            trademark infringement is intended.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            Accuracy of information
          </h2>
          <p className="mt-2">
            ArcadeVerse calculates points and progress based on the information
            publicly visible on your Google Cloud Skills Boost profile at the
            time of calculation. While we work to keep points rules and badge
            data current, Arcade rules, point values, milestone requirements,
            and reward eligibility change over time and are defined solely by
            Google. ArcadeVerse makes no guarantee that calculated results,
            points, or milestone status will match Google's official records or
            determine your eligibility for any reward.
          </p>
          <p className="mt-2">
            For official Arcade rules, eligibility, and rewards information,
            always refer to Google's official Arcade announcements and terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            No rewards guarantee
          </h2>
          <p className="mt-2">
            Nothing shown on ArcadeVerse — points, milestone progress, swag tier
            status, or leaderboard position — constitutes a promise or
            confirmation of reward eligibility. Swag and milestone fulfillment
            is administered exclusively by Google, and any dispute about
            eligibility must be resolved with Google directly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">
            External links
          </h2>
          <p className="mt-2">
            ArcadeVerse links to third-party websites, including Google Cloud
            Skills Boost challenges and official Arcade pages. We are not
            responsible for the content, availability, or policies of external
            sites.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground">Contact</h2>
          <p className="mt-2">
            If you have questions about this disclaimer, reach us via the{" "}
            <a href="/support" className="text-accent-purple hover:underline">
              support page
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

export default DisclaimerPage;
