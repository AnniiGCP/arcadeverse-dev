import {
  IconBell,
  IconMail,
  IconMedal,
  IconSparkles,
  IconStar,
  IconTarget,
  IconTrophy,
} from "@tabler/icons-react";
import type React from "react";
import { createContext, useContext } from "react";
import { Toaster, toast } from "sonner";

type ToastProps = {
  title?: string;
  description?: React.ReactNode;
  duration?: number;
  position?:
    | "top-right"
    | "top-center"
    | "top-left"
    | "bottom-right"
    | "bottom-center"
    | "bottom-left";
  action?: {
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  };
  cancel?: {
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  };
  onDismiss?: () => void;
  onAutoClose?: () => void;
};

interface NotificationContextType {
  success: (title: string, props?: Omit<ToastProps, "title">) => void;
  error: (title: string, props?: Omit<ToastProps, "title">) => void;
  info: (title: string, props?: Omit<ToastProps, "title">) => void;
  warning: (title: string, props?: Omit<ToastProps, "title">) => void;
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
    opts?: Omit<ToastProps, "title">,
  ) => Promise<T>;
  dismiss: (toastId?: string) => void;
  notifyNewUpdate: (
    updateTitle: string,
    updateDescription?: string,
    link?: string,
  ) => void;
  notifyNewBadge: (
    badgeName: string,
    badgeType: string,
    points: number,
  ) => void;
  notifyMilestone: (milestone: string, points: number) => void;
  notifySwagTier: (tierName: string, rewards: string[]) => void;
  notifyLeaderboardRank: (
    rank: number,
    totalUsers: number,
    change?: "up" | "down" | "same",
  ) => void;
  notifySupportMessage: (message: string, from?: string) => void;
  notifyFeature: (title: string, description: string, link?: string) => void;
  notifyLegendCard: (points: number) => void;
  notifyExtensionAvailable: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({
  children,
}: { children: React.ReactNode }) {
  const success = (title: string, props?: Omit<ToastProps, "title">) => {
    toast.success(title, {
      ...props,
      className: "toast-success",
    });
  };

  const error = (title: string, props?: Omit<ToastProps, "title">) => {
    toast.error(title, {
      ...props,
      className: "toast-error",
    });
  };

  const info = (title: string, props?: Omit<ToastProps, "title">) => {
    toast.info(title, {
      ...props,
      className: "toast-info",
    });
  };

  const warning = (title: string, props?: Omit<ToastProps, "title">) => {
    toast.warning(title, {
      ...props,
      className: "toast-warning",
    });
  };

  const promise = <T,>(
    promiseObj: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
    opts?: Omit<ToastProps, "title">,
  ): Promise<T> => {
    // Combine options with opts when calling toast.promise
    toast.promise(promiseObj, {
      ...opts,
      loading: options.loading,
      success: options.success,
      error: options.error,
    });
    return promiseObj;
  };

  const dismiss = (toastId?: string) => {
    toast.dismiss(toastId);
  };

  // New notification for updates
  const notifyNewUpdate = (
    updateTitle: string,
    updateDescription?: string,
    link = "/updates",
  ) => {
    const notification = {
      id: `update-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: "update" as const,
      title: updateTitle,
      subtitle: "Official Arcade Update",
      description:
        updateDescription ||
        "Check out the latest news and announcements on ArcadeVerse.",
      timestamp: new Date().toISOString(),
      read: false,
      link,
    };

    // Dispatch to NotificationPanel only (no toast overlay)
    window.dispatchEvent(
      new CustomEvent("new-notification", { detail: notification }),
    );
  };

  // New notification for badges
  const notifyNewBadge = (
    badgeName: string,
    badgeType: string,
    points: number,
  ) => {
    const notification = {
      id: `badge-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: "badge" as const,
      title: `🎉 New ${badgeType} Badge!`,
      subtitle: `+${points} Arcade Points`,
      description: `Earned ${badgeName}. Keep stacking badges toward your prize tiers!`,
      timestamp: new Date().toISOString(),
      read: false,
      link: "/dashboard",
    };

    // Dispatch to NotificationPanel only (no toast overlay)
    window.dispatchEvent(
      new CustomEvent("new-notification", { detail: notification }),
    );
  };

  // New notification for milestones
  const notifyMilestone = (milestone: string, points: number) => {
    const notification = {
      id: `milestone-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: "milestone" as const,
      title: `🎯 Milestone Reached!`,
      subtitle: `${points} Total Arcade Points`,
      description: `Congratulations! You unlocked the ${milestone} milestone.`,
      timestamp: new Date().toISOString(),
      read: false,
      link: "/arcade-facilitator",
    };

    // Dispatch to NotificationPanel only (no toast overlay)
    window.dispatchEvent(
      new CustomEvent("new-notification", { detail: notification }),
    );
  };

  // New notification for swag tiers
  const notifySwagTier = (tierName: string, rewards: string[]) => {
    const notification = {
      id: `swag-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: "swag" as const,
      title: `🏆 ${tierName} Unlocked!`,
      subtitle: "Prize Tier Eligible",
      description: `You've unlocked ${tierName}! Available rewards: ${rewards.slice(0, 2).join(", ")}${rewards.length > 2 ? ` and +${rewards.length - 2} more` : ""}.`,
      timestamp: new Date().toISOString(),
      read: false,
      link: "/resources/swag-tiers",
    };

    // Dispatch to NotificationPanel only (no toast overlay)
    window.dispatchEvent(
      new CustomEvent("new-notification", { detail: notification }),
    );
  };

  // New notification for leaderboard position
  const notifyLeaderboardRank = (
    rank: number,
    totalUsers: number,
    change?: "up" | "down" | "same",
  ) => {
    // Never notify when rank has not changed
    if (change === "same") return;

    const changeText =
      change === "up"
        ? "📈 Rank Improved!"
        : change === "down"
          ? "📉 Rank Update"
          : "📊 Leaderboard Position";

    const notification = {
      id: "leaderboard-user-rank",
      type: "leaderboard" as const,
      title: `${changeText}: #${rank}`,
      subtitle: "Google Cloud Arcade Standings",
      description:
        totalUsers > 0
          ? `You're currently in the top ${Math.max(1, Math.round((rank / totalUsers) * 100))}% of ${totalUsers.toLocaleString()} players.`
          : `Your profile is ranked #${rank} on the global Arcade leaderboard.`,
      timestamp: new Date().toISOString(),
      read: false,
      link: "/google-cloud-arcade-leaderboard",
    };

    // Dispatch to NotificationPanel only (no toast overlay)
    window.dispatchEvent(
      new CustomEvent("new-notification", { detail: notification }),
    );
  };

  // New notification for support messages
  const notifySupportMessage = (message: string, from?: string) => {
    const notification = {
      id: `support-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: "support" as const,
      title: from ? `Message from ${from}` : "Support Message",
      subtitle: "ArcadeVerse Support Team",
      description: message,
      timestamp: new Date().toISOString(),
      read: false,
      link: "/support",
    };

    // Dispatch to NotificationPanel only (no toast overlay)
    window.dispatchEvent(
      new CustomEvent("new-notification", { detail: notification }),
    );
  };

  // New notification for website feature announcements
  const notifyFeature = (title: string, description: string, link = "/") => {
    const notification = {
      id: `feature-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: "feature" as const,
      title,
      subtitle: "New Platform Feature",
      description,
      timestamp: new Date().toISOString(),
      read: false,
      link,
    };

    // Dispatch to NotificationPanel only (no toast overlay)
    window.dispatchEvent(
      new CustomEvent("new-notification", { detail: notification }),
    );
  };

  // New notification for Legend Card Unlock
  const notifyLegendCard = (points: number) => {
    const notification = {
      id: "legend-card-unlocked",
      type: "milestone" as const,
      title: "👑 Legend Achievement Card Unlocked!",
      subtitle: `${points} Arcade Points`,
      description:
        "Congratulations! You've reached 120+ points and unlocked the official 4K Legend Tier achievement card.",
      timestamp: new Date().toISOString(),
      read: false,
      link: "/dashboard#legend-card",
    };

    window.dispatchEvent(
      new CustomEvent("new-notification", { detail: notification }),
    );

    toast.success("👑 Legend Tier Card Unlocked!", {
      description: `You've reached ${points} points! Your 4K Legend Card is ready to view & download.`,
      duration: 6000,
    });
  };

  // New notification for Chrome Extension Available
  const notifyExtensionAvailable = () => {
    const notification = {
      id: "extension-available-announcement",
      type: "feature" as const,
      title: "🧩 ArcadeVerse Chrome Extension is Available!",
      subtitle: "Official Browser Companion",
      description:
        "Calculate and monitor your Google Cloud Arcade points directly in Chrome, Brave, Edge & Firefox.",
      timestamp: new Date().toISOString(),
      read: false,
      link: "/resources/chrome-extension",
    };

    window.dispatchEvent(
      new CustomEvent("new-notification", { detail: notification }),
    );

    toast.info("🧩 ArcadeVerse Browser Extension Available", {
      description:
        "Install the extension to track Arcade points directly in your browser!",
      duration: 6000,
    });
  };

  const value = {
    success,
    error,
    info,
    warning,
    promise,
    dismiss,
    notifyNewUpdate,
    notifyNewBadge,
    notifyMilestone,
    notifySwagTier,
    notifyLeaderboardRank,
    notifySupportMessage,
    notifyFeature,
    notifyLegendCard,
    notifyExtensionAvailable,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: "toast-container",
        }}
        theme="system"
        closeButton
      />
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }

  return context;
};
