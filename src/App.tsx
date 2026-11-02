import { CookieConsent } from "@/components/CookieConsent";
import { CrispChat } from "@/components/CrispChat";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MainLayout } from "@/components/layout/MainLayout";
import { RootLayout } from "@/components/layout/RootLayout";
import { articles } from "@/data/articles";
import { AuthProvider } from "@/lib/auth-context";
import { CalculationProvider } from "@/lib/calculation-context";
import { DashboardProvider } from "@/lib/dashboard-context";
import { LeaderboardProvider } from "@/lib/leaderboard-context";
import { NotificationProvider } from "@/lib/notification-provider";
import { ProfileProvider } from "@/lib/profile-context";
import { HomePage } from "@/pages/HomePage";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, lazy, useEffect } from "react";
import { apiPath } from "@/lib/api";
import { HelmetProvider } from "react-helmet-async";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";

// Route-level code splitting: keep HomePage synchronous for zero-delay FCP, lazy-load all other pages
const ArcadeVerseDashboard = lazy(
  () => import("@/components/ArcadeVerseDashboard"),
);
const ArticlePage = lazy(() => import("@/pages/ArticlePage"));
const LeaderboardPage = lazy(() =>
  import("@/pages/dashboard/LeaderboardPage").then((m) => ({
    default: m.LeaderboardPage,
  })),
);
const ResourcesPage = lazy(() =>
  import("@/pages/dashboard/ResourcesPage").then((m) => ({
    default: m.ResourcesPage,
  })),
);
const SkillBadgesPage = lazy(() =>
  import("@/pages/dashboard/SkillBadgesPage").then((m) => ({
    default: m.SkillBadgesPage,
  })),
);
const AboutPage = lazy(() =>
  import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const DisclaimerPage = lazy(() =>
  import("@/pages/DisclaimerPage").then((m) => ({ default: m.DisclaimerPage })),
);
const FAQPage = lazy(() =>
  import("@/pages/FAQPage").then((m) => ({ default: m.FAQPage })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);
const PrivacyPolicyPage = lazy(() =>
  import("@/pages/PrivacyPolicyPage").then((m) => ({
    default: m.PrivacyPolicyPage,
  })),
);
const SupportPage = lazy(() =>
  import("@/pages/SupportPage").then((m) => ({ default: m.SupportPage })),
);
const TermsPage = lazy(() =>
  import("@/pages/TermsPage").then((m) => ({ default: m.TermsPage })),
);
const UnsubscribePage = lazy(() =>
  import("@/pages/UnsubscribePage").then((m) => ({
    default: m.UnsubscribePage,
  })),
);
const UpdatesPage = lazy(() =>
  import("@/pages/UpdatesPage").then((m) => ({ default: m.UpdatesPage })),
);
const ChromeExtensionPage = lazy(() =>
  import("@/pages/resources/ChromeExtensionPage").then((m) => ({
    default: m.ChromeExtensionPage,
  })),
);
const CompleteGuidePage = lazy(() =>
  import("@/pages/resources/CompleteGuidePage").then((m) => ({
    default: m.CompleteGuidePage,
  })),
);
const FacilitatorPage = lazy(() =>
  import("@/pages/resources/FacilitatorPage").then((m) => ({
    default: m.FacilitatorPage,
  })),
);
const FindProfileUrlPage = lazy(() =>
  import("@/pages/resources/FindProfileUrlPage").then((m) => ({
    default: m.FindProfileUrlPage,
  })),
);
const GearBadgesPage = lazy(() =>
  import("@/pages/resources/GearBadgesPage").then((m) => ({
    default: m.GearBadgesPage,
  })),
);
const LabFreeCoursesPage = lazy(() =>
  import("@/pages/resources/LabFreeCoursesPage").then((m) => ({
    default: m.LabFreeCoursesPage,
  })),
);
const PointSystemPage = lazy(() =>
  import("@/pages/resources/PointSystemPage").then((m) => ({
    default: m.PointSystemPage,
  })),
);
const PrizeRedemptionPage = lazy(() =>
  import("@/pages/resources/PrizeRedemptionPage").then((m) => ({
    default: m.PrizeRedemptionPage,
  })),
);
const SwagTiersPage = lazy(() =>
  import("@/pages/resources/SwagTiersPage").then((m) => ({
    default: m.SwagTiersPage,
  })),
);
const SyllabusPage = lazy(() =>
  import("@/pages/resources/SyllabusPage").then((m) => ({
    default: m.SyllabusPage,
  })),
);

const RouteLoadingFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent-purple" />
  </div>
);

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -10,
  },
};

const pageTransition = {
  type: "tween" as const,
  ease: "anticipate" as const,
  duration: 0.3,
};

const createBreadcrumbSchema = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item:
      item.path === "/"
        ? "https://arcadeverse.vercel.app/"
        : `https://arcadeverse.vercel.app${item.path}`,
  })),
});

function ArticlePageRoute() {
  const { slug } = useParams();
  const article = articles.find((entry) => entry.slug === slug);

  if (!article) {
    return (
      <MainLayout
        title="Article Not Found | ArcadeVerse"
        description="The requested ArcadeVerse article could not be found. Browse all guides from the resources hub."
        noIndex={true}
      >
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <ArticlePage />
        </motion.div>
      </MainLayout>
    );
  }

  const canonicalPath = `/resources/${article.slug}`;
  const articleStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      datePublished: article.publishedDate,
      dateModified: article.publishedDate,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://arcadeverse.vercel.app${canonicalPath}`,
      },
      author: {
        "@type": "Organization",
        name: "ArcadeVerse",
        url: "https://arcadeverse.vercel.app",
      },
      publisher: {
        "@type": "Organization",
        name: "ArcadeVerse",
        logo: {
          "@type": "ImageObject",
          url: "https://arcadeverse.vercel.app/images/arcadeverse-logo.png",
        },
      },
    },
    createBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Resources", path: "/resources" },
      { name: article.title, path: canonicalPath },
    ]),
  ];

  return (
    <MainLayout
      title={`${article.title} | ArcadeVerse`}
      description={article.description}
      canonicalPath={canonicalPath}
      structuredData={articleStructuredData}
      ogType="article"
    >
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <ArticlePage />
      </motion.div>
    </MainLayout>
  );
}

// Global visitor tracker: increments visitor counter on every page visit, navigation, or reload across the entire website
function GlobalPageVisitTracker() {
  const location = useLocation();

  useEffect(() => {
    fetch(apiPath("/api/visitor"), { method: "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("arcadeverse_stats_updated", { detail: data }),
          );
        }
      })
      .catch(() => {});
  }, [location.pathname]);

  return null;
}

// Animated routes wrapper
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes location={location} key={location.pathname}>
          {/* Home route */}
          <Route
            path="/"
            element={
              <DashboardProvider>
                <MainLayout
                  title="Google Cloud Arcade Points Calculator & Progress Tracker | ArcadeVerse"
                  description="ArcadeVerse is an independent Google Cloud Arcade points calculator and progress tracker. Calculate points from public profiles, track badges, monitor Facilitator milestones, and plan prize tier rewards."
                  canonicalPath="/"
                >
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <HomePage />
                  </motion.div>
                </MainLayout>
              </DashboardProvider>
            }
          />

          {/* Progress Tracker route redirects to canonical home URL */}
          <Route
            path="/google-cloud-arcade-progress-tracker"
            element={<Navigate to="/" replace />}
          />

          {/* Dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardProvider>
                  <DashboardLayout>
                    <motion.div
                      initial="initial"
                      animate="in"
                      exit="out"
                      variants={pageVariants}
                      transition={pageTransition}
                    >
                      <ArcadeVerseDashboard />
                    </motion.div>
                  </DashboardLayout>
                </DashboardProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/google-cloud-arcade-leaderboard"
            element={
              <DashboardProvider>
                <MainLayout
                  title="Google Cloud Arcade Leaderboard & Global Rankings | ArcadeVerse"
                  description="View global leaderboard rankings, track top point earners, and compare Google Cloud Arcade community progress."
                  canonicalPath="/google-cloud-arcade-leaderboard"
                  structuredData={createBreadcrumbSchema([
                    { name: "Home", path: "/" },
                    {
                      name: "Leaderboard",
                      path: "/google-cloud-arcade-leaderboard",
                    },
                  ])}
                >
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <LeaderboardPage />
                  </motion.div>
                </MainLayout>
              </DashboardProvider>
            }
          />

          <Route
            path="/leaderboard"
            element={<Navigate to="/google-cloud-arcade-leaderboard" replace />}
          />

          <Route
            path="/resources"
            element={
              <DashboardProvider>
                <MainLayout
                  title="Google Cloud Arcade Resources, Guides & Tutorials | ArcadeVerse"
                  description="Comprehensive guides, rules, point system breakdowns, and badge explorer for Google Cloud Arcade learners and facilitators."
                  canonicalPath="/resources"
                  structuredData={createBreadcrumbSchema([
                    { name: "Home", path: "/" },
                    { name: "Resources", path: "/resources" },
                  ])}
                >
                  <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <ResourcesPage />
                  </motion.div>
                </MainLayout>
              </DashboardProvider>
            }
          />

          <Route
            path="/resources/skillbadge"
            element={
              <DashboardProvider>
                <MainLayout
                  title="Google Cloud Arcade Skill Badges Syllabus | ArcadeVerse"
                  description="Explore all eligible skill badges counted toward the Google Cloud Arcade."
                  canonicalPath="/resources/skillbadge"
                  structuredData={createBreadcrumbSchema([
                    { name: "Home", path: "/" },
                    { name: "Resources", path: "/resources" },
                    { name: "Skill Badges", path: "/resources/skillbadge" },
                  ])}
                >
                  <SkillBadgesPage />
                </MainLayout>
              </DashboardProvider>
            }
          />

          {/* 7 Core Resources Routes */}
          <Route
            path="/resources/find-your-public-url"
            element={
              <MainLayout
                title="How to Find Your Google Cloud Skills Boost Public Profile URL | ArcadeVerse"
                description="Step-by-step walkthrough to make your Google Cloud Skills Boost profile public and copy your unique URL to calculate Arcade points on ArcadeVerse."
                canonicalPath="/resources/find-your-public-url"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Resources", path: "/resources" },
                  {
                    name: "Find Profile URL",
                    path: "/resources/find-your-public-url",
                  },
                ])}
              >
                <FindProfileUrlPage />
              </MainLayout>
            }
          />
          <Route
            path="/resources/find-your-google-cloud-skills-public-profile-url"
            element={<Navigate to="/resources/find-your-public-url" replace />}
          />

          <Route
            path="/resources/point-system"
            element={
              <MainLayout
                title="Google Cloud Arcade Points & Badge System Explained | ArcadeVerse"
                description="Complete breakdown of Google Cloud Arcade 2026 point calculation rules: monthly game badges (1 Pt), skill badges (0.5 Pts), Work Meets Play (7 Pts), and Facilitator bonus milestones (+45 Pts)."
                canonicalPath="/resources/point-system"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Resources", path: "/resources" },
                  { name: "Points System", path: "/resources/point-system" },
                ])}
              >
                <PointSystemPage />
              </MainLayout>
            }
          />
          <Route
            path="/resources/points-system"
            element={<Navigate to="/resources/point-system" replace />}
          />
          <Route
            path="/resources/google-cloud-arcade-points-and-eligibility"
            element={<Navigate to="/resources/point-system" replace />}
          />

          <Route
            path="/arcade-facilitator"
            element={
              <MainLayout
                title="Google Cloud Arcade Facilitator Program 2026 & Bonus Points Tracker | ArcadeVerse"
                description="Master the Google Cloud Arcade Facilitator Program 2026. Track official cohort milestones, calculate bonus points (+5 to +45 Pts), check leaderboard ranks, and view program FAQs."
                canonicalPath="/arcade-facilitator"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Arcade Facilitator", path: "/arcade-facilitator" },
                ])}
              >
                <FacilitatorPage />
              </MainLayout>
            }
          />
          <Route
            path="/resources/arcade-facilitator"
            element={<Navigate to="/arcade-facilitator" replace />}
          />
          <Route
            path="/resources/google-cloud-arcade-facilitator-program"
            element={<Navigate to="/arcade-facilitator" replace />}
          />

          <Route
            path="/resources/syllabus"
            element={
              <MainLayout
                title="Google Cloud Arcade 2026 Badge Syllabus & Catalog | ArcadeVerse"
                description="Complete, up-to-date catalog of all active Google Cloud Arcade 2026 Game Badges (1.0 Pt) and Skill Badges (0.5 Pt) with direct access codes and lab links."
                canonicalPath="/resources/syllabus"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Resources", path: "/resources" },
                  { name: "Arcade Syllabus", path: "/resources/syllabus" },
                ])}
              >
                <SyllabusPage />
              </MainLayout>
            }
          />

          <Route
            path="/resources/gear-badges"
            element={
              <MainLayout
                title="How to Claim GEAR Badges on Google Developer Profile | ArcadeVerse"
                description="Step-by-step walkthrough to claim your Arcade GEAR Badge and GEAR Program Enrollment Badges on your Google Developer Profile for Facilitator eligibility."
                canonicalPath="/resources/gear-badges"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Resources", path: "/resources" },
                  { name: "GEAR Badges", path: "/resources/gear-badges" },
                ])}
              >
                <GearBadgesPage />
              </MainLayout>
            }
          />

          <Route
            path="/resources/swag-tiers"
            element={
              <MainLayout
                title="Google Cloud Arcade Swag Tiers & Winner Showcase Gallery | ArcadeVerse"
                description="Explore Google Cloud Arcade 2026 prize swag tiers, view past year swag collections (2023-2025), and browse our community winner showcase gallery."
                canonicalPath="/resources/swag-tiers"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Resources", path: "/resources" },
                  { name: "Swag Tiers", path: "/resources/swag-tiers" },
                ])}
              >
                <SwagTiersPage />
              </MainLayout>
            }
          />
          <Route
            path="/resources/swag-prize-tiers"
            element={<Navigate to="/resources/swag-tiers" replace />}
          />

          <Route
            path="/resources/prize-redemption"
            element={
              <MainLayout
                title="Google Cloud Arcade Prize Redemption Guide 2026 | Swag Claiming & Waterfall System | ArcadeVerse"
                description="Everything you need to know about claiming Google Cloud Arcade 2026 swags after reaching a tier, the Waterfall Distribution System, estimated prize counter opening dates, and mandatory registration prerequisites."
                canonicalPath="/resources/prize-redemption"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Resources", path: "/resources" },
                  {
                    name: "Prize Redemption",
                    path: "/resources/prize-redemption",
                  },
                ])}
              >
                <PrizeRedemptionPage />
              </MainLayout>
            }
          />

          <Route
            path="/resources/chrome-extension"
            element={
              <MainLayout
                title="ArcadeVerse Chrome Extension | Official Installation & Parity Guide"
                description="Official guide to installing and using the ArcadeVerse Chrome Extension. Instant Google Cloud Arcade points calculation with 100% Dashboard parity and zero drift."
                canonicalPath="/resources/chrome-extension"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Resources", path: "/resources" },
                  {
                    name: "Chrome Extension",
                    path: "/resources/chrome-extension",
                  },
                ])}
              >
                <ChromeExtensionPage />
              </MainLayout>
            }
          />
          <Route
            path="/resources/extension"
            element={<Navigate to="/resources/chrome-extension" replace />}
          />
          <Route
            path="/resources/google-cloud-arcade-complete-guide"
            element={
              <MainLayout
                title="Google Cloud Arcade Complete Guide 2026 | Points, Badges & Rewards | ArcadeVerse"
                description="The comprehensive 2026 guide to Google Cloud Arcade. Master point calculation rules, Game vs Skill badges, Facilitator milestones (+45 Pts), prize swag tiers, and tracking roadmap."
                canonicalPath="/resources/google-cloud-arcade-complete-guide"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Resources", path: "/resources" },
                  {
                    name: "Complete Guide 2026",
                    path: "/resources/google-cloud-arcade-complete-guide",
                  },
                ])}
              >
                <CompleteGuidePage />
              </MainLayout>
            }
          />

          <Route
            path="/resources/lab-free-courses"
            element={
              <MainLayout
                title="Google Cloud Lab-Free Courses Catalog (24 Free Courses) | ArcadeVerse"
                description="Explore all 24 official zero-credit Google Cloud lab-free courses. Learn Generative AI, cloud infrastructure, and Workspace essentials without consuming lab credits."
                canonicalPath="/resources/lab-free-courses"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Resources", path: "/resources" },
                  {
                    name: "Lab-Free Courses",
                    path: "/resources/lab-free-courses",
                  },
                ])}
              >
                <LabFreeCoursesPage />
              </MainLayout>
            }
          />
          <Route
            path="/resources/lab-free"
            element={<Navigate to="/resources/lab-free-courses" replace />}
          />

          <Route path="/resources/:slug" element={<ArticlePageRoute />} />

          <Route
            path="/updates"
            element={
              <MainLayout
                title="Latest Updates | ArcadeVerse"
                description="Latest Google Cloud Arcade announcements, updates, and community highlights."
                canonicalPath="/updates"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Updates", path: "/updates" },
                ])}
              >
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <UpdatesPage />
                </motion.div>
              </MainLayout>
            }
          />

          {/* Support Page route */}
          <Route
            path="/support"
            element={
              <MainLayout
                title="ArcadeVerse Support Center & Community Help | ArcadeVerse"
                description="Get help with ArcadeVerse, point calculation questions, profile troubleshooting, and common Google Cloud Arcade FAQs."
                canonicalPath="/support"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Support", path: "/support" },
                ])}
              >
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <SupportPage />
                </motion.div>
              </MainLayout>
            }
          />

          <Route
            path="/about"
            element={
              <MainLayout
                title="About ArcadeVerse | Independent Google Cloud Arcade Community Tracker"
                description="Learn about ArcadeVerse, our mission, and how we maintain accurate Arcade tracking logic."
                canonicalPath="/about"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "About", path: "/about" },
                ])}
              >
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <AboutPage />
                </motion.div>
              </MainLayout>
            }
          />

          <Route
            path="/privacy"
            element={
              <MainLayout
                title="Privacy Policy | ArcadeVerse"
                description="Read how ArcadeVerse collects, uses, and protects public profile data with privacy-first standards."
                canonicalPath="/privacy"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Privacy Policy", path: "/privacy" },
                ])}
              >
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <PrivacyPolicyPage />
                </motion.div>
              </MainLayout>
            }
          />

          <Route
            path="/privacy-policy"
            element={<Navigate to="/privacy" replace />}
          />

          <Route
            path="/terms"
            element={
              <MainLayout
                title="Terms of Service | ArcadeVerse"
                description="Read the terms and conditions for using the ArcadeVerse points calculator and community tools."
                canonicalPath="/terms"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Terms of Use", path: "/terms" },
                ])}
              >
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <TermsPage />
                </motion.div>
              </MainLayout>
            }
          />

          <Route
            path="/faq"
            element={
              <MainLayout
                title="Frequently Asked Questions | ArcadeVerse"
                description="Common questions and answers regarding Google Cloud Arcade point calculations, public profiles, milestones, and swag tiers."
                canonicalPath="/faq"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "FAQ", path: "/faq" },
                ])}
              >
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <FAQPage />
                </motion.div>
              </MainLayout>
            }
          />

          {/* Achievement Card is private to each user on their dashboard - no separate public route */}
          <Route
            path="/achievement/*"
            element={<Navigate to="/dashboard" replace />}
          />

          {/* Unsubscribe Route - private transactional page, excluded from indexing */}
          <Route
            path="/unsubscribe"
            element={
              <MainLayout
                title="Unsubscribe - ArcadeVerse"
                description="Manage your ArcadeVerse email subscription preferences."
                canonicalPath="/unsubscribe"
                noIndex={true}
              >
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <UnsubscribePage />
                </motion.div>
              </MainLayout>
            }
          />

          <Route
            path="/disclaimer"
            element={
              <MainLayout
                title="Disclaimer & Non-Affiliation Statement | ArcadeVerse"
                description="Official disclaimer regarding Google LLC trademarks and independent operation of the ArcadeVerse community project."
                canonicalPath="/disclaimer"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Disclaimer", path: "/disclaimer" },
                ])}
              >
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <DisclaimerPage />
                </motion.div>
              </MainLayout>
            }
          />

          <Route
            path="/contact"
            element={
              <MainLayout
                title="Contact Us & Support | ArcadeVerse"
                description="Contact the ArcadeVerse team, report issues, and access official Google Cloud Arcade support."
                canonicalPath="/contact"
                structuredData={createBreadcrumbSchema([
                  { name: "Home", path: "/" },
                  { name: "Contact", path: "/contact" },
                ])}
              >
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <SupportPage />
                </motion.div>
              </MainLayout>
            }
          />

          {/* Fallback route - Redirect unknown dashboard routes to main dashboard */}
          <Route
            path="/dashboard/*"
            element={<Navigate to="/dashboard" replace />}
          />

          {/* 404 Route - must be noindexed */}
          <Route
            path="/404"
            element={
              <MainLayout
                title="404 — Page Not Found | ArcadeVerse"
                description="The page you are looking for is not available."
                noIndex={true}
              >
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <NotFoundPage />
                </motion.div>
              </MainLayout>
            }
          />

          {/* Fallback route - All other unmatched URLs display 404 with noindex */}
          <Route
            path="*"
            element={
              <MainLayout
                title="404 — Page Not Found | ArcadeVerse"
                description="The page you are looking for is not available."
                noIndex={true}
              >
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <NotFoundPage />
                </motion.div>
              </MainLayout>
            }
          />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <LeaderboardProvider>
          {" "}
          {/* LeaderboardProvider must wrap ProfileProvider */}
          <ProfileProvider>
            <CalculationProvider>
              <HelmetProvider>
                <RootLayout>
                  <Router>
                    <GlobalPageVisitTracker />
                    <AnimatedRoutes />
                    <CrispChat />
                    <CookieConsent />
                  </Router>
                </RootLayout>
              </HelmetProvider>
            </CalculationProvider>
          </ProfileProvider>
        </LeaderboardProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
