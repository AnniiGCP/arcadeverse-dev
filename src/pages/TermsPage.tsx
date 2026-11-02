import { Helmet } from "react-helmet-async";

const CONTACT_EMAIL = "contact@arcadeverse.app";

export function TermsPage() {
  return (
    <section className="container max-w-4xl py-10 sm:py-14 space-y-6">
      <Helmet>
        <title>Terms of Service | ArcadeVerse</title>
        <meta
          name="description"
          content="Read the terms governing use of ArcadeVerse, the free Google Cloud Arcade points calculator."
        />
      </Helmet>

      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: April 5, 2026</p>
      </header>

      <div className="space-y-4 text-sm sm:text-base leading-7 text-muted-foreground">
        <p>
          These Terms of Service govern your access to and use of ArcadeVerse.
          By using the service, you agree to these terms. If you do not agree,
          please discontinue use of the website.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          1. Acceptance of Terms
        </h2>
        <p>
          You confirm that you are legally capable of entering into these terms
          and that you will use ArcadeVerse in compliance with applicable laws
          and regulations.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          2. Description of Service
        </h2>
        <p>
          ArcadeVerse provides informational tools, calculators, and content for
          learning progress estimation related to Google Cloud Arcade and
          associated learning paths. ArcadeVerse is an independent project and
          is not affiliated with or endorsed by Google LLC.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          3. Accuracy Disclaimer
        </h2>
        <p>
          Calculations and analytics displayed by ArcadeVerse are estimates and
          informational aids. Official scores, eligibility decisions, rewards,
          and policy outcomes are determined by official program providers.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          4. Acceptable Use
        </h2>
        <p>
          You agree not to misuse the service, attempt unauthorized access,
          distribute malicious code, automate abusive requests, violate
          third-party rights, or disrupt service stability for other users.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          5. Intellectual Property
        </h2>
        <p>
          Unless otherwise noted, ArcadeVerse content, branding, and site
          presentation are protected by applicable intellectual property laws.
          Third-party marks remain property of their owners.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          6. Third-Party Links and Services
        </h2>
        <p>
          ArcadeVerse may include links to third-party websites and services. We
          are not responsible for their content, availability, policies, or data
          practices.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          7. Disclaimers
        </h2>
        <p>
          ArcadeVerse is provided on an as-is and as-available basis without
          warranties of any kind, whether express or implied, including fitness
          for a particular purpose, non-infringement, and uninterrupted
          availability.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          8. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by law, ArcadeVerse and its operators
          will not be liable for indirect, incidental, special, consequential,
          or punitive damages, or for any loss of data, revenue, or
          opportunities arising from use of the service.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          9. Advertising Disclosure
        </h2>
        <p>
          ArcadeVerse may display advertising, including third-party ads. Ad
          content is provided by partners and networks, which may use cookies
          and related technologies as described in our Privacy Policy.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          10. Governing Law
        </h2>
        <p>
          These terms are governed by applicable laws in the jurisdiction where
          the service operator resides, without regard to conflict-of-law
          principles.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          11. Changes to Terms
        </h2>
        <p>
          We may revise these terms at any time. Updated terms are effective
          when posted on this page. Continued use after updates constitutes
          acceptance of the revised terms.
        </p>

        <h2 className="text-xl font-semibold text-foreground">12. Contact</h2>
        <p>For terms-related questions, contact {CONTACT_EMAIL}.</p>
      </div>
    </section>
  );
}
