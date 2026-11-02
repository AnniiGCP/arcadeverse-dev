import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updatesData } from "@/data/updates";
import {
  IconArrowRight,
  IconAward,
  IconBell,
  IconMail,
  IconRocket,
  IconSparkles,
  IconStar,
  IconTarget,
  IconTrash,
  IconTrophy,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface NotificationItem {
  id: string;
  type:
    | "update"
    | "badge"
    | "milestone"
    | "swag"
    | "leaderboard"
    | "support"
    | "feature";
  title: string;
  subtitle?: string;
  description: string;
  timestamp: Date | string;
  timeAgo?: string;
  read: boolean;
  link?: string;
}

const STORAGE_KEY = "app_notifications";
const DISMISSED_KEY = "app_dismissed_notifications";
const MAX_NOTIFICATIONS = 50;

/**
 * Generates genuine initial notifications derived from real site features,
 * live updates from updatesData, official communities, and the leaderboard.
 */
export function getGenuineInitialNotifications(): NotificationItem[] {
  const items: NotificationItem[] = [];

  // 1. Genuine latest update from official updates data
  if (updatesData.length > 0) {
    const topUpdate = updatesData[0];
    items.push({
      id: `genuine-update-${topUpdate.id}`,
      type: "update",
      title: topUpdate.title,
      subtitle: `Official Announcement • ${topUpdate.date}`,
      description: topUpdate.description,
      timestamp: new Date(topUpdate.date).toISOString(),
      read: false,
      link: "/updates",
    });
  }

  // 2. Genuine website feature: Facilitator 2026 Milestone Tracker
  items.push({
    id: "genuine-feature-facilitator-2026",
    type: "milestone",
    title: "Arcade Facilitator 2026 Milestone Tracker",
    subtitle: "New Platform Feature",
    description:
      "Track official Facilitator milestones, bonus point calculations (+5 to +45 Pts), and GEAR syllabus badges.",
    timestamp: new Date("July 31, 2026 10:00:00 GMT+530").toISOString(),
    read: false,
    link: "/arcade-facilitator",
  });

  // 3. Genuine feature: Global Leaderboard & Tier Standings
  items.push({
    id: "genuine-leaderboard-tracker",
    type: "leaderboard",
    title: "Global Leaderboard & Rank Tracking",
    subtitle: "Competitive Standings Live",
    description:
      "Monitor top performers, track percentile ranks, and see live tier distribution across Google Cloud learners.",
    timestamp: new Date("June 10, 2026 10:00:00 GMT+530").toISOString(),
    read: false,
    link: "/google-cloud-arcade-leaderboard",
  });

  // 4. Genuine feature: Official Community Groups
  items.push({
    id: "genuine-community-channels",
    type: "support",
    title: "Official Community Groups Are Live",
    subtitle: "WhatsApp & Telegram Channels",
    description:
      "Connect with fellow Google Cloud learners on WhatsApp and Telegram to discuss labs, share milestones, and get real-time help.",
    timestamp: new Date().toISOString(),
    read: false,
    link: "/support",
  });

  return items;
}

export function NotificationPanel() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load notifications from localStorage on mount (respecting empty/cleared states)
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Purge any legacy stale mock notification IDs and deduplicate any repeated notifications
          const seenKeys = new Set<string>();
          const cleaned: NotificationItem[] = [];

          for (const n of parsed) {
            if (
              n.id === "notif-swag-drop-jacket" ||
              n.id === "notif-swag-drops-coming"
            ) {
              continue;
            }
            // Collapse duplicate notifications (e.g. repeated rank notifications)
            const isRankNotif =
              n.type === "leaderboard" &&
              (n.title?.includes("Leaderboard Position") ||
                n.title?.includes("Rank"));
            const dedupKey = isRankNotif
              ? "leaderboard-user-rank-status"
              : `${n.type}-${n.title}`;

            if (!seenKeys.has(dedupKey)) {
              seenKeys.add(dedupKey);
              cleaned.push(n);
            }
          }

          setNotifications(cleaned);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
          return;
        }
      } catch {
        // Fall through to initial generation if parsing failed
      }
    }

    // Only if never initialized before, generate genuine initial notifications
    const initial = getGenuineInitialNotifications();
    setNotifications(initial);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  }, []);

  // Sync latest update from updatesData if new and not dismissed
  useEffect(() => {
    if (updatesData.length > 0) {
      const latest = updatesData[0];
      const updateId = `genuine-update-${latest.id}`;

      setNotifications((prev) => {
        const alreadyExists = prev.some(
          (n) => n.id === updateId || n.title === latest.title,
        );
        let dismissed: string[] = [];
        try {
          dismissed = JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]");
        } catch {
          dismissed = [];
        }

        if (!alreadyExists && !dismissed.includes(updateId)) {
          const newNotif: NotificationItem = {
            id: updateId,
            type: "update",
            title: latest.title,
            subtitle: `Official Announcement • ${latest.date}`,
            description: latest.description,
            timestamp: new Date(latest.date).toISOString(),
            read: false,
            link: "/updates",
          };
          const updated = [newNotif, ...prev].slice(0, MAX_NOTIFICATIONS);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
  }, []);

  // Listen for dynamic new notifications dispatched across the app
  useEffect(() => {
    const handleNewNotification = (event: CustomEvent<any>) => {
      const detail = event.detail;
      if (!detail) return;

      const notifId =
        detail.id ||
        `notif-${detail.title ? detail.title.toLowerCase().replace(/[^a-z0-9]/g, "-") : Date.now()}`;

      // Check if this notification was dismissed by user
      let dismissed: string[] = [];
      try {
        dismissed = JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]");
      } catch {
        dismissed = [];
      }
      if (dismissed.includes(notifId)) return;

      const newNotification: NotificationItem = {
        id: notifId,
        type: detail.type || "update",
        title: detail.title || "New Notification",
        subtitle: detail.subtitle,
        description: detail.description || "",
        timestamp: detail.timestamp
          ? new Date(detail.timestamp).toISOString()
          : new Date().toISOString(),
        timeAgo: "Just now",
        read: false,
        link: detail.link,
      };

      setNotifications((prev) => {
        const isRankNotif =
          newNotification.type === "leaderboard" &&
          (newNotification.title?.includes("Leaderboard Position") ||
            newNotification.title?.includes("Rank"));

        // If identical notification already exists, skip
        const exactMatch = prev.some(
          (n) =>
            n.id === newNotification.id ||
            (n.title === newNotification.title &&
              n.description === newNotification.description),
        );
        if (exactMatch) return prev;

        // If it's a leaderboard rank notification, replace any existing rank notification
        const filtered = isRankNotif
          ? prev.filter(
              (n) =>
                n.id !== newNotification.id &&
                !(
                  n.type === "leaderboard" &&
                  (n.title?.includes("Leaderboard Position") ||
                    n.title?.includes("Rank"))
                ),
            )
          : prev.filter((n) => n.id !== newNotification.id);

        const updated = [newNotification, ...filtered].slice(
          0,
          MAX_NOTIFICATIONS,
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener("new-notification" as any, handleNewNotification);
    return () => {
      window.removeEventListener(
        "new-notification" as any,
        handleNewNotification,
      );
    };
  }, []);

  // Mark all as read when panel is opened
  useEffect(() => {
    if (isOpen && notifications.some((n) => !n.read)) {
      const updated = notifications.map((n) => ({ ...n, read: true }));
      setNotifications(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const removeNotification = (id: string) => {
    // Add to dismissed list so it won't be resurrected
    try {
      const dismissed: string[] = JSON.parse(
        localStorage.getItem(DISMISSED_KEY) || "[]",
      );
      if (!dismissed.includes(id)) {
        dismissed.push(id);
        localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));
      }
    } catch {
      // Ignore
    }

    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearAll = () => {
    // Record dismissed IDs
    try {
      const dismissed: string[] = JSON.parse(
        localStorage.getItem(DISMISSED_KEY) || "[]",
      );
      const newDismissed = Array.from(
        new Set([...dismissed, ...notifications.map((n) => n.id)]),
      );
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(newDismissed));
    } catch {
      // Ignore
    }

    setNotifications([]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    // Mark as read
    if (!notif.read) {
      setNotifications((prev) => {
        const updated = prev.map((n) =>
          n.id === notif.id ? { ...n, read: true } : n,
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }

    if (notif.link) {
      setIsOpen(false);
      navigate(notif.link);
    }
  };

  const formatTimestamp = (
    dateInput: Date | string | undefined,
    fallbackAgo?: string,
  ) => {
    if (!dateInput && fallbackAgo) return fallbackAgo;
    if (!dateInput) return "Just now";
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return fallbackAgo || "Recently";

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 0) return "Just now";

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderBadgeIcon = (notif: NotificationItem) => {
    switch (notif.type) {
      case "update":
        return (
          <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-500/10 dark:bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
            <IconSparkles className="h-5 w-5" />
          </div>
        );
      case "leaderboard":
        return (
          <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-500/10 dark:bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs">
            <IconTrophy className="h-5 w-5" />
          </div>
        );
      case "milestone":
        return (
          <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
            <IconTarget className="h-5 w-5" />
          </div>
        );
      case "feature":
        return (
          <div className="h-10 w-10 shrink-0 rounded-xl bg-purple-500/10 dark:bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-xs">
            <IconRocket className="h-5 w-5" />
          </div>
        );
      case "badge":
        return (
          <div className="h-10 w-10 shrink-0 rounded-xl bg-yellow-500/10 dark:bg-yellow-950/60 border border-yellow-500/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 shadow-xs">
            <IconAward className="h-5 w-5" />
          </div>
        );
      case "swag":
        return (
          <div className="h-10 w-10 shrink-0 rounded-xl bg-pink-500/10 dark:bg-pink-950/60 border border-pink-500/30 flex items-center justify-center text-pink-600 dark:text-pink-400 shadow-xs">
            <IconBell className="h-5 w-5" />
          </div>
        );
      case "support":
        return (
          <div className="h-10 w-10 shrink-0 rounded-xl bg-sky-500/10 dark:bg-sky-950/60 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-xs">
            <IconMail className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-500/10 dark:bg-slate-800 border border-slate-500/30 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-xs">
            <IconBell className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 focus-visible:ring-1 focus-visible:ring-indigo-500 cursor-pointer"
          aria-label="Open notifications"
        >
          <IconBell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-indigo-600 border border-indigo-400/40 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-lg"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[380px] sm:w-[460px] max-w-[95vw] rounded-2xl border border-border dark:border-slate-800/90 bg-surface-card/95 dark:bg-[#0a0f1d]/95 p-4 shadow-2xl backdrop-blur-xl text-left focus:outline-none"
      >
        {/* Monospace Header matching ArcadeVerse design + Clear all option */}
        <div className="mb-3 px-1 flex items-center justify-between border-b border-border/60 pb-2.5">
          <div className="flex items-center gap-2">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              NOTIFICATIONS
            </h3>
            {notifications.length > 0 && (
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-md bg-muted text-muted-foreground font-semibold">
                {notifications.length}
              </span>
            )}
          </div>
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-[11px] text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors flex items-center gap-1 font-medium cursor-pointer"
            >
              <IconTrash className="h-3 w-3" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Notifications list */}
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center mx-auto mb-3 text-slate-400 dark:text-slate-500">
              <IconBell className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No notifications
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-[260px] mx-auto">
              You're all caught up with new updates, feature drops, and
              leaderboard standings.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-0.5 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  onClick={() => handleNotificationClick(notif)}
                  className={`group relative rounded-xl border p-3.5 shadow-xs transition-all duration-200 cursor-pointer ${
                    notif.read
                      ? "border-border/60 bg-surface/50 dark:bg-[#0c1220]/60 hover:border-slate-300 dark:hover:border-slate-700/80 hover:bg-surface-hover/60"
                      : "border-indigo-500/30 bg-indigo-50/40 dark:bg-indigo-950/20 hover:border-indigo-500/50"
                  }`}
                >
                  {/* Remove notification button on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notif.id);
                    }}
                    className="absolute top-2.5 right-2.5 text-slate-400 hover:text-rose-500 dark:text-slate-500 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/50"
                    aria-label="Dismiss notification"
                  >
                    <IconX className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex items-start gap-3">
                    {/* Visual Icon badge */}
                    {renderBadgeIcon(notif)}

                    {/* Text Body */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-foreground leading-snug tracking-tight">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                        )}
                      </div>

                      {notif.subtitle && (
                        <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                          {notif.subtitle}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                        {notif.description}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/40 text-[11px] text-slate-400 dark:text-slate-500">
                        <span className="font-mono">
                          {formatTimestamp(notif.timestamp, notif.timeAgo)}
                        </span>
                        {notif.link && (
                          <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:underline">
                            <span>View</span>
                            <IconArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificationPanel;
