import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconBooks,
  IconCalculator,
  IconCompass,
  IconHelp,
  IconHome,
  IconSparkles,
  IconTrophy,
  IconUsers,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";

const CAVEMAN_404_GIF =
  "https://cdn.svgator.com/images/2024/04/electrocuted-caveman-animation-404-error-page.gif";

export function NotFoundPage() {
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: "Points Calculator",
      desc: "Calculate points & milestone swags",
      to: "/",
      icon: IconCalculator,
      color: "from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30",
    },
    {
      title: "Leaderboard",
      desc: "Check live community rankings",
      to: "/google-cloud-arcade-leaderboard",
      icon: IconTrophy,
      color:
        "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
    },
    {
      title: "Arcade Facilitator",
      desc: "Milestones & cohort leaderboard",
      to: "/arcade-facilitator",
      icon: IconUsers,
      color:
        "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30",
    },
    {
      title: "Resources & Syllabus",
      desc: "Badges syllabus & prize guides",
      to: "/resources",
      icon: IconBooks,
      color:
        "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      title: "AI Support & FAQ",
      desc: "Chat with Groq AI or read FAQs",
      to: "/support",
      icon: IconHelp,
      color: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30",
    },
  ];

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 overflow-hidden">
      <Helmet>
        <title>404 — Page Not Found | ArcadeVerse</title>
        <meta
          name="description"
          content="The page you are looking for is not available."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Ambient Cosmic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/15 via-indigo-600/15 to-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[280px] h-[280px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
        {/* Animated Badge & Hero 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-4"
        >
          {/* Status Chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-medium backdrop-blur-md shadow-sm">
            <IconCompass
              className="w-3.5 h-3.5 animate-spin"
              style={{ animationDuration: "8s" }}
            />
            <span>Lost in the Arcadeverse</span>
          </div>

          {/* Glowing 404 Display */}
          <div className="relative my-2">
            <h1 className="text-8xl sm:text-9xl font-black tracking-tight bg-gradient-to-b from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-500 bg-clip-text text-transparent select-none drop-shadow-2xl">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center opacity-30 blur-2xl -z-10 pointer-events-none">
              <span className="text-8xl sm:text-9xl font-black text-purple-500">
                404
              </span>
            </div>
          </div>

          {/* Animated Caveman Illustration GIF */}
          <div className="my-4 flex items-center justify-center">
            <div className="relative rounded-2xl bg-white p-2 sm:p-3 shadow-2xl shadow-purple-950/20 dark:shadow-purple-950/50 border border-slate-200 dark:border-white/20 overflow-hidden max-w-[360px] sm:max-w-[420px] w-full">
              <img
                src={CAVEMAN_404_GIF}
                alt="Animated caveman illustration for page not found"
                width={800}
                height={600}
                loading="eager"
                className="w-full h-auto aspect-[4/3] object-contain mx-auto select-none pointer-events-none"
              />
            </div>
          </div>

          {/* Exact Headings */}
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Look like you're lost
          </h2>
          <p className="max-w-lg mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            The page you are looking for is not available!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium px-6 py-2.5 h-11 shadow-lg shadow-purple-900/30 rounded-xl"
            >
              <Link to="/">
                <IconHome className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="border-slate-200 dark:border-white/15 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white px-5 py-2.5 h-11 rounded-xl shadow-xs"
            >
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </motion.div>

        {/* Quick Access Portal Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <IconSparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Popular Arcade Destinations
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.to}
                  className="group relative flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#141b2c]/80 hover:bg-slate-50 dark:hover:bg-[#182136] hover:border-purple-500/40 transition-all duration-200 text-left backdrop-blur-sm shadow-xs dark:shadow-card-premium"
                >
                  <div
                    className={`p-2.5 rounded-lg border ${item.color} flex-shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                        {item.title}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 text-xs transition-colors">
                        →
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default NotFoundPage;
