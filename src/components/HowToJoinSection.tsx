import { GdscLottieAnimation } from "@/components/GdscLottieAnimation";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconChartBar,
  IconCloud,
  IconNumber1,
  IconNumber2,
  IconNumber3,
  IconNumber4,
  IconSchool,
  IconUserPlus,
} from "@tabler/icons-react";
import { motion, useReducedMotion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Create Account",
    description:
      "Sign up on Cloud Skills Boost with a public profile so your achievements can be read.",
    icon: IconUserPlus,
    numberIcon: IconNumber1,
    link: "https://www.skills.google/users/sign_up",
    tone: "text-accent-purple",
  },
  {
    id: 2,
    title: "Subscribe",
    description:
      "Subscribe to the Google Cloud Arcade program to unlock the current season.",
    icon: IconCloud,
    numberIcon: IconNumber2,
    link: "https://docs.google.com/forms/d/e/1FAIpQLSd3lpkeM1LCUOm5sioRI2K8BpAENeynh-A2PBS_cI9Tyizq2w/viewform",
    tone: "text-accent-blue",
  },
  {
    id: 3,
    title: "Start Learning",
    description:
      "Begin your journey through labs, games and trivia on Google Cloud Arcade.",
    icon: IconSchool,
    numberIcon: IconNumber3,
    link: "https://go.cloudskillsboost.google/arcade",
    tone: "text-accent-green",
  },
  {
    id: 4,
    title: "Track Progress",
    description:
      "Paste your profile URL into ArcadeVerse and watch your points, badges and milestones update.",
    icon: IconChartBar,
    numberIcon: IconNumber4,
    tone: "text-accent-yellow",
  },
];

export function HowToJoinSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="how-to-join-section"
      className="relative overflow-hidden py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-aurora opacity-50"
        aria-hidden
      />
      <div className="container relative">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Left: heading + visual */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Get started"
              title={
                <>
                  How to join{" "}
                  <span className="text-gradient">Google Cloud Arcade</span>
                </>
              }
              description="Four steps from a fresh account to tracked, competing progress."
            />

            <Reveal direction="up" delay={0.15} className="mt-8">
              <div className="relative mx-auto w-full max-w-md lg:max-w-lg flex items-center justify-center">
                {/* GDSC Modules Lottie Animation */}
                <GdscLottieAnimation className="w-full h-auto min-h-[340px] sm:min-h-[420px] max-h-[520px] relative z-10" />
              </div>
            </Reveal>
          </div>

          {/* Right: steps */}
          <Stagger className="relative" stagger={0.12}>
            {/* Connector line */}
            <div
              className="absolute bottom-6 left-6 top-6 w-px bg-gradient-to-b from-accent-purple/50 via-border to-transparent"
              aria-hidden
            />

            <div className="space-y-6">
              {steps.map((step) => {
                const Icon = step.icon;
                const NumberIcon = step.numberIcon;
                return (
                  <StaggerItem key={step.id}>
                    <article className="group relative flex gap-5 rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border-active/50">
                      <div className="relative flex-shrink-0">
                        <span
                          className={`grid h-12 w-12 place-items-center rounded-xl border border-border bg-background-secondary ${step.tone}`}
                        >
                          <Icon className="h-6 w-6" />
                        </span>
                        <span className="absolute -left-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full border border-border bg-surface-elevated text-foreground shadow-surface">
                          <NumberIcon className="h-3.5 w-3.5" />
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                          {step.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>

                        {step.link && (
                          <Button
                            variant="link"
                            className="mt-3 h-auto gap-1 p-0 text-sm font-medium text-accent-purple"
                            asChild
                          >
                            <a
                              href={step.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Get started
                              <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </article>
                  </StaggerItem>
                );
              })}
            </div>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
