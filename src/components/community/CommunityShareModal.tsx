import { useToast } from "@/components/ui/use-toast";
import {
  IconArrowRight,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconBrandX,
  IconCheck,
  IconClock,
  IconCopy,
  IconDice,
  IconShare,
  IconSparkles,
  IconUsers,
} from "@tabler/icons-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useState } from "react";

const STORAGE_KEY_ACKNOWLEDGED = "arcadeverse_community_acknowledged";
const STORAGE_KEY_REMIND_TIME = "arcadeverse_community_remind_time";
const COOLDOWN_DAYS = 7;
const INITIAL_AUTO_OPEN_DELAY_MS = 45 * 1000; // 45 seconds

const SITE_URL = "https://arcadeverse.vercel.app";

const DEFAULT_SHARE_MESSAGE = `Working on Google Cloud Arcade? Check out ArcadeVerse to calculate your points, track completed and incomplete badges, and monitor Facilitator milestones in one place:
${SITE_URL}

#GoogleCloud #ArcadeVerse #GoogleCloudArcade #CloudSkills`;

// Configurable tips matching the screenshot with dynamic Next Tip cycle
const FEATURED_TIPS = [
  {
    badge: "FACILITATOR PROGRAM",
    title: "Complete GEAR Badges on Developer Profile",
    body: "If you are registered in the Facilitator program, don't forget to complete the GEAR badges on your Google Developer profile. Earning both of these badges is mandatory to unlock your bonus points.",
    callout: "Earning both GEAR badges is mandatory to earn bonus points.",
    actionText: "Read GEAR Badges Guide →",
    actionHref: "/resources/gear-badges",
  },
  {
    badge: "ARCADE SCORING",
    title: "Understand the 2026 Arcade Points System",
    body: "Every Arcade Game & Trivia badge awards 1.0 point, while Skill badges contribute 0.5 points each. Plan your badges strategically to reach the next prize tier.",
    callout: "2 completed Skill Badges equal 1 full Arcade Point.",
    actionText: "Read Point System Guide →",
    actionHref: "/resources/point-system",
  },
  {
    badge: "PROFILE SETUP",
    title: "Keep Your Skills Boost Profile Public",
    body: "Ensure your Google Cloud Skills Boost profile visibility is toggled to Public under account settings so your badges and Arcade points can be parsed correctly.",
    callout:
      "Private profiles cannot be calculated by ArcadeVerse or Google automated scoring.",
    actionText: "Find Profile URL Guide →",
    actionHref: "/resources/find-your-public-url",
  },
];

export function openCommunityModal(tab: "community" | "share" = "community") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-community-modal", { detail: { tab } }),
    );
  }
}

export function CommunityShareModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"community" | "share">(
    "community",
  );
  const [tipIndex, setTipIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();
  const titleId = useId();
  const descId = useId();

  // Check if popup is allowed to auto-trigger
  const isAutoPopupAllowed = useCallback(() => {
    try {
      const acknowledged = localStorage.getItem(STORAGE_KEY_ACKNOWLEDGED);
      if (acknowledged === "true") return false;

      const remindTimeStr = localStorage.getItem(STORAGE_KEY_REMIND_TIME);
      if (remindTimeStr) {
        const remindTime = Number.parseInt(remindTimeStr, 10);
        if (Date.now() < remindTime) return false;
      }

      return true;
    } catch {
      return false;
    }
  }, []);

  // Listen for programmatic open events from header/footer/other triggers
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab?: "community" | "share" }>;
      if (customEvent.detail?.tab) {
        setActiveTab(customEvent.detail.tab);
      }
      setIsOpen(true);
    };

    window.addEventListener("open-community-modal", handleOpen);
    return () => window.removeEventListener("open-community-modal", handleOpen);
  }, []);

  // Automatic delay trigger (45s on site, postponed if user is typing)
  useEffect(() => {
    if (!isAutoPopupAllowed()) return;

    let timerId: ReturnType<typeof setTimeout>;

    const scheduleCheck = (delayMs: number) => {
      timerId = setTimeout(() => {
        const activeEl = document.activeElement;
        const isUserTyping =
          activeEl &&
          (activeEl.tagName === "INPUT" ||
            activeEl.tagName === "TEXTAREA" ||
            activeEl.getAttribute("contenteditable") === "true");

        if (isUserTyping) {
          scheduleCheck(20 * 1000);
          return;
        }

        if (isAutoPopupAllowed()) {
          setActiveTab("community");
          setIsOpen(true);
        }
      }, delayMs);
    };

    scheduleCheck(INITIAL_AUTO_OPEN_DELAY_MS);

    return () => clearTimeout(timerId);
  }, [isAutoPopupAllowed]);

  // Listen for calculation completion event
  useEffect(() => {
    const handleCalc = () => {
      if (isAutoPopupAllowed()) {
        setTimeout(() => {
          if (isAutoPopupAllowed()) {
            setActiveTab("community");
            setIsOpen(true);
          }
        }, 3000);
      }
    };

    window.addEventListener("arcadeverse:calculation_complete", handleCalc);
    return () =>
      window.removeEventListener(
        "arcadeverse:calculation_complete",
        handleCalc,
      );
  }, [isAutoPopupAllowed]);

  // Handle ESC key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Action: "Got It" -> Dismiss permanently
  const handleGotIt = () => {
    try {
      localStorage.setItem(STORAGE_KEY_ACKNOWLEDGED, "true");
    } catch {}
    setIsOpen(false);
  };

  // Action: "Remind Me Later" -> Dismiss for 7 days
  const handleRemindLater = () => {
    try {
      const cooldownMs = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
      localStorage.setItem(
        STORAGE_KEY_REMIND_TIME,
        String(Date.now() + cooldownMs),
      );
    } catch {}
    setIsOpen(false);
    toast({
      title: "Reminder Scheduled",
      description: "We will check back with you in a week. Happy learning!",
    });
  };

  // Cycle through tips
  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % FEATURED_TIPS.length);
  };

  // Copy site URL
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(SITE_URL);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = SITE_URL;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      toast({
        title: "Link Copied!",
        description: "ArcadeVerse link copied to clipboard.",
      });
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Please manually copy https://arcadeverse.vercel.app",
        variant: "destructive",
      });
    }
  };

  // Platform share handlers
  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Working on Google Cloud Arcade? Check out ArcadeVerse to calculate points, track badges, and monitor milestones: ${SITE_URL}`,
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      "Calculate your Google Cloud Arcade points and track milestone badges with ArcadeVerse:",
    );
    const url = encodeURIComponent(SITE_URL);
    window.open(
      `https://t.me/share/url?url=${url}&text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleShareX = () => {
    const text = encodeURIComponent(
      "Working on Google Cloud Arcade? Check out ArcadeVerse to calculate points, track badges, and monitor milestones:",
    );
    const url = encodeURIComponent(SITE_URL);
    const hashtags = "GoogleCloud,ArcadeVerse,GoogleCloudArcade";
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`,
      "_blank",
      "noopener,noreferrer,width=600,height=500",
    );
  };

  const currentTip = FEATURED_TIPS[tipIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container — Matching Screenshot Style */}
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, y: 16 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.95, y: 16 }
            }
            transition={{
              duration: shouldReduceMotion ? 0 : 0.25,
              ease: "easeOut",
            }}
            className="relative z-10 w-full max-w-[510px] overflow-hidden rounded-[26px] border border-slate-800 bg-[#0d1322] p-5 sm:p-7 text-slate-100 shadow-2xl shadow-indigo-950/60"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Badges Row */}
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6366f1] px-3.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase shadow-sm">
                <IconSparkles className="h-3.5 w-3.5" />
                COMMUNITY & GUIDES
              </span>

              {/* Right Badge (without 7,000+ count per user instructions) */}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/90 px-3.5 py-1 text-[11px] font-semibold text-slate-300">
                <IconUsers className="h-3.5 w-3.5 text-purple-400" />
                COMMUNITY MEMBERS
              </span>
            </div>

            {/* Heading & Subtitle */}
            <div className="mt-4">
              <h2
                id={titleId}
                className="font-display text-2xl sm:text-[28px] font-extrabold tracking-tight text-white leading-tight"
              >
                Join Our{" "}
                <span className="text-[#818cf8]">Arcade Community</span>
              </h2>
              <p
                id={descId}
                className="mt-2 text-xs sm:text-[13.5px] text-slate-400 leading-relaxed"
              >
                Get instant lab help, track your points, and stay updated with
                the latest Google Cloud Arcade guides.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="mt-5 rounded-2xl bg-[#131b2e] p-1.5 border border-slate-800/80">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("community")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === "community"
                      ? "bg-[#6366f1] text-white shadow-md shadow-indigo-950"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <IconUsers className="h-4 w-4" />
                  Community & Guides
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("share")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === "share"
                      ? "bg-[#6366f1] text-white shadow-md shadow-indigo-950"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <IconShare className="h-4 w-4" />
                  Share ArcadeVerse
                </button>
              </div>
            </div>

            {/* Tab 1: Community & Guides Content */}
            {activeTab === "community" && (
              <div className="mt-4 space-y-4">
                {/* 2-Column Grid: Telegram & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Telegram Card (Bright Blue) */}
                  <a
                    href="https://t.me/ArcadeVerse"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between rounded-2xl bg-[#2563eb] hover:bg-[#1d4ed8] p-3.5 px-4 text-white shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/20 text-white">
                        <IconBrandTelegram className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          Telegram Group
                        </h4>
                        <span className="text-[11px] text-blue-100 font-medium">
                          Instant Lab Support
                        </span>
                      </div>
                    </div>
                    <IconArrowRight className="h-5 w-5 text-white/90 group-hover:translate-x-1 transition-transform shrink-0" />
                  </a>

                  {/* WhatsApp Card (Bright Green) */}
                  <a
                    href="https://chat.whatsapp.com/LVC3Jdrx3VYB5JIKYCUpZo?s=sw&p=i&mlu=4&ilr=4"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between rounded-2xl bg-[#16a34a] hover:bg-[#15803d] p-3.5 px-4 text-white shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/20 text-white">
                        <IconBrandWhatsapp className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          WhatsApp Group
                        </h4>
                        <span className="text-[11px] text-green-100 font-medium">
                          Community Updates
                        </span>
                      </div>
                    </div>
                    <IconArrowRight className="h-5 w-5 text-white/90 group-hover:translate-x-1 transition-transform shrink-0" />
                  </a>
                </div>

                {/* Featured Tip Box with Dashed Border */}
                <div className="rounded-2xl border border-dashed border-slate-700/80 bg-[#0a0f1d]/50 p-4 sm:p-5 space-y-3">
                  {/* Top Tip Row */}
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-[#1e1b4b] border border-indigo-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-indigo-300 uppercase">
                      {currentTip.badge}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextTip}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#12192c] px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <IconDice className="h-3.5 w-3.5 text-purple-400" />
                      Next Tip
                    </button>
                  </div>

                  {/* Title & Body */}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {currentTip.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-[13px] text-slate-400 leading-relaxed">
                      {currentTip.body}
                    </p>
                  </div>

                  {/* Amber Callout Box */}
                  <div className="rounded-xl border border-amber-900/60 bg-[#22170f] p-3 flex items-center gap-2.5 text-amber-200 text-xs sm:text-[13px] font-medium leading-snug">
                    <span className="text-base select-none">💡</span>
                    <span>{currentTip.callout}</span>
                  </div>

                  {/* Action Link Button */}
                  <div className="flex justify-end pt-1">
                    <a
                      href={currentTip.actionHref}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#6366f1] hover:bg-[#5252e6] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-950 transition-colors"
                    >
                      {currentTip.actionText}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Share ArcadeVerse Content */}
            {activeTab === "share" && (
              <div className="mt-4 space-y-4">
                {/* Share Info Box with Heart Icon */}
                <div className="rounded-2xl border border-indigo-900/40 bg-[#121933] p-4 sm:p-5">
                  <div className="flex items-center gap-2">
                    <span className="text-base select-none">❤️</span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      Share ArcadeVerse with Friends
                    </h3>
                  </div>
                  <p className="mt-1 text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                    Help friends and classmates calculate their points and track
                    incomplete Google Cloud Arcade badges.
                  </p>
                </div>

                {/* 4 Social Platform Cards Grid */}
                <div className="grid grid-cols-4 gap-2.5">
                  {/* LinkedIn */}
                  <button
                    type="button"
                    onClick={handleShareLinkedIn}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-[#10172c] p-3.5 text-center hover:border-sky-500/60 hover:bg-[#131d38] transition-all group"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500/15 text-sky-400 group-hover:scale-105 transition-transform">
                      <IconBrandLinkedin className="h-5 w-5" />
                    </div>
                    <span className="text-[11.5px] font-semibold text-slate-200">
                      LinkedIn
                    </span>
                  </button>

                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-[#10172c] p-3.5 text-center hover:border-emerald-500/60 hover:bg-[#131d38] transition-all group"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-105 transition-transform">
                      <IconBrandWhatsapp className="h-5 w-5" />
                    </div>
                    <span className="text-[11.5px] font-semibold text-slate-200">
                      WhatsApp
                    </span>
                  </button>

                  {/* Telegram */}
                  <button
                    type="button"
                    onClick={handleShareTelegram}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-[#10172c] p-3.5 text-center hover:border-sky-500/60 hover:bg-[#131d38] transition-all group"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500/15 text-sky-400 group-hover:scale-105 transition-transform">
                      <IconBrandTelegram className="h-5 w-5" />
                    </div>
                    <span className="text-[11.5px] font-semibold text-slate-200">
                      Telegram
                    </span>
                  </button>

                  {/* X / Twitter */}
                  <button
                    type="button"
                    onClick={handleShareX}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-[#10172c] p-3.5 text-center hover:border-slate-500/60 hover:bg-[#131d38] transition-all group"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white group-hover:scale-105 transition-transform">
                      <IconBrandX className="h-5 w-5" />
                    </div>
                    <span className="text-[11.5px] font-semibold text-slate-200">
                      X / Twitter
                    </span>
                  </button>
                </div>

                {/* Copy ArcadeVerse Link (Dashed Pill Button) */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-700 bg-[#0e1628] hover:bg-[#121c33] hover:border-indigo-400/60 py-3.5 px-4 text-xs sm:text-sm font-semibold text-slate-200 transition-all cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <IconCheck className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">
                        Link Copied to Clipboard!
                      </span>
                    </>
                  ) : (
                    <>
                      <IconCopy className="h-4 w-4 text-purple-400" />
                      <span>Copy ArcadeVerse Link</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Modal Footer with Remind Me Later & Got It */}
            <div className="mt-5 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleRemindLater}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-[#131b2e] px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <IconClock className="h-3.5 w-3.5" />
                Remind Me Later
              </button>

              <button
                type="button"
                onClick={handleGotIt}
                className="rounded-xl bg-[#6366f1] hover:bg-[#5252e6] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-950 transition-colors"
              >
                Got It
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
