import { Helmet } from "react-helmet-async";

const CONTACT_EMAIL = "contact@arcadeverse.app";

export function PrivacyPolicyPage() {
  return (
    <section className="container max-w-4xl py-10 sm:py-14 space-y-6">
      <Helmet>
        <title>Privacy Policy | ArcadeVerse</title>
        <meta
          name="description"
          content="Read ArcadeVerse privacy policy covering data collection, cookies, Google AdSense, and your rights."
        />
      </Helmet>

      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: April 5, 2026</p>
      </header>

      <div className="space-y-4 text-sm sm:text-base leading-7 text-muted-foreground">
        <p>
          This Privacy Policy explains how ArcadeVerse collects, uses, stores,
          and protects information when you use our website and related
          services. By accessing ArcadeVerse, you agree to the practices
          described in this policy.
        </p>

        <h2 className="text-xl font-semibold text-foreground">1. Scope</h2>
        <p>
          This policy applies to information collected through ArcadeVerse
          pages, tools, forms, and analytics integrations. It does not cover
          external websites linked from ArcadeVerse.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          2. Information We Collect
        </h2>
        <p>
          We may process profile-related inputs you submit, such as public
          learning profile URLs and badge data needed for progress estimation.
          We may also collect technical information including browser type,
          device type, IP-derived location, page interactions, and performance
          diagnostics. If you contact us, we may store your email address and
          message history to provide support.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          3. Cookies and Tracking Technologies
        </h2>
        <p>
          ArcadeVerse and its service providers may use cookies, local storage,
          and similar technologies to remember preferences, measure performance,
          and support analytics or advertising features. You can control cookies
          through your browser settings, but disabling certain cookies may
          affect site functionality.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          4. How We Use Information
        </h2>
        <p>
          We use information to deliver requested calculations, improve product
          reliability, diagnose issues, monitor security, and understand
          aggregate usage trends. We do not sell personal data.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          5. Google AdSense Disclosure
        </h2>
        <p>
          ArcadeVerse may display advertisements served by Google AdSense or
          similar ad networks. Third-party vendors, including Google, may use
          cookies to serve ads based on a user's prior visits to this and other
          websites. Users may opt out of personalized advertising by visiting
          Google Ads Settings and related provider opt-out pages.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          6. Third-Party Services
        </h2>
        <p>
          We may rely on hosting, analytics, and delivery providers such as
          Vercel, Google Analytics, and ad platforms. These services may process
          data according to their own privacy terms. We encourage users to
          review those policies directly.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          7. Children's Privacy
        </h2>
        <p>
          ArcadeVerse is not directed to children under 13. We do not knowingly
          collect personal data from children under 13. If you believe a child
          has provided personal data, contact us and we will take appropriate
          action.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          8. Data Security
        </h2>
        <p>
          We implement reasonable administrative and technical safeguards
          designed to protect data. No system is completely secure, and we
          cannot guarantee absolute security of data transmitted over the
          internet.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          9. Your Rights and Choices
        </h2>
        <p>
          Depending on your jurisdiction, you may have rights to request access,
          correction, deletion, or restriction of personal information we
          maintain. You may also request information about data usage or object
          to certain processing activities where applicable.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          10. Policy Changes
        </h2>
        <p>
          We may update this policy from time to time to reflect legal,
          operational, or product changes. Updated versions will be posted on
          this page with a revised effective date.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          11. Contact Information
        </h2>
        <p>
          For privacy-related questions, requests, or concerns, contact us at{" "}
          {CONTACT_EMAIL}.
        </p>
      </div>
    </section>
  );
}
