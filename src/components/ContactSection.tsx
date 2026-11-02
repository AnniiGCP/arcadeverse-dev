import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { Button } from "@/components/ui/button";
import { apiPath } from "@/lib/api";
import {
  IconArrowUpRight,
  IconBrandDiscord,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconSend,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const socialLinks = [
  {
    icon: IconBrandDiscord,
    name: "Discord",
    description: "Join the community server for live help and events.",
    href: "https://discord.com/channels/1434257602652536936/1434257603453779970",
    tone: "text-[#8b9cff]",
    ring: "group-hover:border-[#5865F2]/50",
  },
  {
    icon: IconBrandWhatsapp,
    name: "WhatsApp",
    description: "Connect with members in our WhatsApp community.",
    href: "https://chat.whatsapp.com/LVC3Jdrx3VYB5JIKYCUpZo?s=sw&p=i&mlu=4&ilr=4",
    tone: "text-emerald-500",
    ring: "group-hover:border-emerald-500/50",
  },
  {
    icon: IconBrandTelegram,
    name: "Telegram",
    description: "Follow announcements and Arcade updates.",
    href: "https://t.me/ArcadeVerse",
    tone: "text-accent-cyan",
    ring: "group-hover:border-accent-cyan/50",
  },
];

interface ContactSectionProps {
  visitorCount?: number;
  accountsAnalyzed?: number;
  isLoadingStats?: boolean;
}

const DEFAULT_VISITOR_COUNT = 3731;
const DEFAULT_ACCOUNTS_ANALYZED = 3361;

export function ContactSection({
  visitorCount,
  accountsAnalyzed,
  isLoadingStats = false,
}: ContactSectionProps) {
  const displayVisitorCount = visitorCount ?? DEFAULT_VISITOR_COUNT;
  const displayAccountsAnalyzed = accountsAnalyzed ?? DEFAULT_ACCOUNTS_ANALYZED;

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (subscribing) return;
    setSubscribing(true);

    try {
      let res: Response;
      const primaryUrl = apiPath("/api/newsletter/subscribe");
      const postBody = JSON.stringify({
        email: trimmedEmail,
        source: "homepage_connect",
      });

      try {
        res = await fetch(primaryUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: postBody,
        });
      } catch (networkErr) {
        if (
          typeof window !== "undefined" &&
          (window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1") &&
          !primaryUrl.includes(":3001")
        ) {
          res = await fetch("http://localhost:3001/api/newsletter/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: postBody,
          });
        } else {
          throw networkErr;
        }
      }
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        const errorMsg =
          data?.error ||
          data?.message ||
          "Failed to subscribe. Please try again.";
        toast.error(errorMsg);
        return;
      }

      if (data.alreadySubscribed) {
        toast.info(
          data.message || "You're already subscribed to ArcadeVerse updates!",
        );
        setSubscribed(true);
      } else {
        setSubscribed(true);
        toast.success(
          data.message || "Successfully subscribed to ArcadeVerse updates!",
        );
      }

      setEmail("");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Network error while subscribing. Please try again.";
      toast.error(message);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <section className="relative py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Community"
          title={
            <>
              Let&apos;s <span className="text-gradient">connect</span>
            </>
          }
          description="Have a question or just want to say hi? Reach out to the ArcadeVerse community on any platform below."
          align="center"
        />

        <Stagger className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <StaggerItem key={link.name}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex h-full flex-col rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${link.ring}`}
                >
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-xl border border-border bg-background-secondary ${link.tone}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="mt-5 flex items-center gap-1.5">
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {link.name}
                    </h3>
                    <IconArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {link.description}
                  </p>
                </a>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Never Miss An Update Card (Above the Counters) */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-surface-card/90 p-7 sm:p-9 shadow-card-premium backdrop-blur-md mx-auto mt-12 max-w-4xl transition-all duration-300 hover:border-border-strong">
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                Never miss an update 🚀
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                Stay in the loop with milestone dates, lab releases, and bonus
                point drops. Zero spam, unsubscribe anytime.
              </p>
            </div>

            {/* Email form on the next line with comfortable spacing from edges */}
            <form onSubmit={handleSubscribe} className="w-full max-w-2xl">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="email"
                  required
                  disabled={subscribing}
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full flex-1 rounded-xl border border-border bg-background-secondary px-4 py-3 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none transition-colors disabled:opacity-60"
                />
                <Button
                  type="submit"
                  disabled={subscribing || subscribed}
                  className="w-full sm:w-auto rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold text-sm sm:text-base px-7 py-3 shadow-md flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer disabled:opacity-75"
                >
                  <IconSend className="h-4 w-4" />
                  {subscribing
                    ? "Subscribing..."
                    : subscribed
                      ? "Subscribed!"
                      : "Subscribe"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Two Live Stats Counter Cards (Total Website Visitors & Accounts Analyzed) */}
        <div className="mx-auto mt-8 grid max-w-4xl gap-6 sm:grid-cols-2">
          {/* Card 1: Total Website Visitors */}
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-surface-card/90 p-7 sm:p-8 shadow-card-premium transition-all duration-300 hover:border-border-strong hover:-translate-y-1">
            {/* Top-right curved dark blue accent blob matching reference image */}
            <div className="pointer-events-none absolute -top-6 -right-6 h-36 w-36 rounded-bl-full bg-blue-500/10 border-b border-l border-blue-500/20" />
            <div className="relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                  Total Website Visitors
                </h3>
              </div>
              <div className="mt-4 font-display text-4xl sm:text-5xl font-extrabold text-blue-500 tabular-nums">
                {displayVisitorCount.toLocaleString()}
              </div>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-medium">
                Unique visitors tracked
              </p>
            </div>
          </div>

          {/* Card 2: Accounts Analyzed */}
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-surface-card/90 p-7 sm:p-8 shadow-card-premium transition-all duration-300 hover:border-border-strong hover:-translate-y-1">
            {/* Top-left curved dark green accent blob matching reference image */}
            <div className="pointer-events-none absolute -top-6 -left-6 h-36 w-36 rounded-br-full bg-emerald-500/10 border-b border-r border-emerald-500/20" />
            <div className="relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                  Accounts Analyzed
                </h3>
              </div>
              <div className="mt-4 font-display text-4xl sm:text-5xl font-extrabold text-emerald-500 tabular-nums">
                {displayAccountsAnalyzed.toLocaleString()}
              </div>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-medium">
                Total profiles processed
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
