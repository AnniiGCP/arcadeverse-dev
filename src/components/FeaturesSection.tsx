import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/motion/SectionHeading";
import {
  IconBadge,
  IconBell,
  IconChartBar,
  IconDeviceAnalytics,
  IconLayoutDashboard,
  IconTrophy,
} from "@tabler/icons-react";

const features = [
  {
    icon: IconChartBar,
    title: "Progress Tracking",
    description:
      "Automatically calculate your Google Cloud Arcade points from completed challenges, so you always know where you stand.",
    tone: "text-accent-purple",
  },
  {
    icon: IconBadge,
    title: "Incomplete Badge Tracking",
    description:
      "Efficiently track incomplete badges and focus on unfinished tasks, ensuring you never miss a challenge.",
    tone: "text-accent-blue",
  },
  {
    icon: IconDeviceAnalytics,
    title: "Multiple Account Management",
    description:
      "Track progress across multiple Google Cloud Arcade accounts and switch between profiles in a click.",
    tone: "text-accent-green",
  },
  {
    icon: IconBell,
    title: "Real-Time Event Updates",
    description:
      "Stay informed with real-time updates about Arcade events, challenges and announcements as they land.",
    tone: "text-accent-yellow",
  },
  {
    icon: IconLayoutDashboard,
    title: "Intuitive Interface",
    description:
      "A clear, focused dashboard that simplifies navigation and makes your progress easy to read at a glance.",
    tone: "text-accent-cyan",
  },
  {
    icon: IconTrophy,
    title: "Leaderboard Competition",
    description:
      "Compete with others and climb the leaderboard to reach the top of your Arcade team goals.",
    tone: "text-accent-orange",
  },
];

export function FeaturesSection() {
  return (
    <section id="features-section" className="relative py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Features"
          title={
            <>
              Everything you need to master
              <br className="hidden sm:block" /> your{" "}
              <span className="text-gradient">Arcade journey</span>
            </>
          }
          description="ArcadeVerse brings your points, badges and milestones into one polished workspace built for Cloud learners and facilitators."
          align="center"
        />

        <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.title}>
                <article className="card-hover group h-full rounded-2xl border border-border bg-surface/60 p-7 backdrop-blur-sm">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-xl border border-border bg-background-secondary transition-transform duration-300 group-hover:scale-105 ${feature.tone}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 font-display text-lg font-semibold tracking-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
