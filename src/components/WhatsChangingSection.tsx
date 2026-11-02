import { IconClock, IconCoins, IconSun, IconUsers } from "@tabler/icons-react";
import { motion } from "framer-motion";

const updates = [
  {
    badge: "UPDATE 01",
    badgeClass:
      "bg-indigo-600/15 border-indigo-500/40 text-indigo-700 dark:text-indigo-300",
    icon: IconUsers,
    iconContainerClass:
      "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
    title: "Arcade Facilitators Are Here",
    renderDescription: () => (
      <>
        <span className="text-purple-700 dark:text-purple-300 underline decoration-purple-400 font-semibold">
          Google Skills Arcade Facilitators
        </span>{" "}
        provide additional guidance and support for learners participating in
        the program. The goal is to help participants navigate challenges, get
        unstuck, and make better progress through their hands-on learning
        journey.
      </>
    ),
  },
  {
    badge: "UPDATE 02",
    badgeClass:
      "bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300",
    icon: IconClock,
    iconContainerClass:
      "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
    title: "Longer Season, New Tiers & Prize Counter Changes",
    renderDescription: () => (
      <>
        The 2026 Arcade is now a year-long program running throughout 2026 with
        a new tier structure. Google has confirmed a{" "}
        <span className="border border-amber-400/80 rounded px-1.5 py-0.5 text-amber-800 dark:text-amber-300 font-semibold bg-amber-400/10 inline-block my-0.5">
          single unified Prize Counter opening later in the year
        </span>
        , meaning points earned during 2026 will be carried forward until
        redemption opens.
      </>
    ),
  },
  {
    badge: "UPDATE 03",
    badgeClass:
      "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300",
    icon: IconCoins,
    iconContainerClass:
      "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    title: "Fewer Labs & 1 Point Per Arcade Game",
    renderDescription: () => (
      <>
        The number of labs per Arcade game is reduced so learners get more room
        to explore, while every qualifying Arcade game awards{" "}
        <span className="border border-emerald-400/80 rounded px-1.5 py-0.5 text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-400/10 inline-block my-0.5">
          1 Arcade Point for a balanced point system
        </span>{" "}
        across cloud, data, and AI tracks.
      </>
    ),
  },
  {
    badge: "UPDATE 04",
    badgeClass:
      "bg-orange-500/15 border-orange-500/40 text-orange-700 dark:text-orange-300",
    icon: IconSun,
    iconContainerClass:
      "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400",
    title: "Sprints & Certification Zone Are Being Retired",
    renderDescription: () => (
      <>
        <span className="border border-amber-600/70 rounded px-1.5 py-0.5 text-amber-800 dark:text-amber-200/90 font-semibold bg-amber-600/10 inline-block my-0.5">
          Google Skills Arcade Sprints and Certification Zone have been sunset
        </span>{" "}
        as part of the 2026 program changes. The Arcade is shifting its focus
        toward deeper, hands-on activities that help learners build practical
        Google Cloud skills.
      </>
    ),
  },
];

export function WhatsChangingSection() {
  return (
    <section
      id="whats-changing-section"
      className="relative py-24 overflow-hidden"
    >
      <div className="container max-w-6xl relative z-10">
        {/* Header Block matching Image 2 */}
        <div className="text-left mb-12">
          {/* Eyebrow Pill */}
          <div className="mb-4">
            <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-600/20 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 shadow-sm">
              2026 PROGRAM UPDATES
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Google Cloud Arcade 2026:{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              What&apos;s Changing?
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            The{" "}
            <strong className="text-slate-900 dark:text-white font-semibold">
              Google Skills Arcade 2026
            </strong>{" "}
            program introduces key updates including removal of specific badge
            types, updated lab counts, and a refined points structure, with a
            stronger focus on{" "}
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
              hands-on Google Cloud learning
            </span>
            .
          </p>
        </div>

        {/* 2x2 Grid of 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {updates.map((update, index) => {
            const Icon = update.icon;
            return (
              <motion.div
                key={update.badge}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex flex-col justify-between rounded-3xl border border-border dark:border-slate-800/90 bg-surface-card dark:bg-[#0e1424]/90 p-7 sm:p-8 backdrop-blur-md shadow-card-premium transition-all duration-300 hover:border-border-strong dark:hover:border-slate-700 hover:-translate-y-1"
              >
                <div>
                  {/* Top Bar: Icon + Badge Pill */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`grid h-11 w-11 place-items-center rounded-xl border ${update.iconContainerClass}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`rounded-full border px-3 py-0.5 text-[11px] font-mono font-bold tracking-wider ${update.badgeClass}`}
                    >
                      {update.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-6 font-display text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {update.title}
                  </h3>

                  {/* Body Content */}
                  <p className="mt-3.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {update.renderDescription()}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhatsChangingSection;
