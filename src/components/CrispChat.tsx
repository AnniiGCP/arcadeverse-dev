import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    $crisp?: unknown[];
    CRISP_WEBSITE_ID?: string;
  }
}

interface CrispChatProps {
  websiteId?: string;
}

const DEFAULT_CRISP_ID =
  import.meta.env.VITE_CRISP_WEBSITE_ID ||
  "16066bde-e20b-4db0-babd-da130126908b";

export function CrispChat({ websiteId = DEFAULT_CRISP_ID }: CrispChatProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptBlocked, setScriptBlocked] = useState(false);
  const isPendingOpenRef = useRef(false);
  const navigate = useNavigate();

  // Load Crisp script immediately and asynchronously
  const ensureScriptLoaded = useCallback(() => {
    if (typeof window === "undefined") return;

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://client.crisp.chat/l.js"]',
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
        if (isPendingOpenRef.current) {
          isPendingOpenRef.current = false;
          crispHelpers.open();
          setIsOpening(false);
          setIsChatOpen(true);
        }
      };
      script.onerror = () => {
        setScriptBlocked(true);
        setIsOpening(false);
        isPendingOpenRef.current = false;
      };
      document.head.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!websiteId || typeof window === "undefined") return;

    // Initialize Crisp command queue
    window.$crisp = window.$crisp || [];
    window.CRISP_WEBSITE_ID = websiteId;

    // Load Crisp asynchronously immediately without delay for fast first-time opening
    ensureScriptLoaded();

    // Default configuration: hide Crisp's default launcher bubble
    // Our custom ArcadeVerse launcher acts as the permanent primary trigger
    window.$crisp.push(["safe", true]);
    window.$crisp.push(["do", "chat:hide"]);

    // Track Crisp open/close events safely
    const handleOpened = () => {
      setIsChatOpen(true);
      setIsOpening(false);
      isPendingOpenRef.current = false;
    };

    const handleClosed = () => {
      setIsChatOpen(false);
      setIsOpening(false);
      isPendingOpenRef.current = false;
      // Ensure native launcher stays hidden when chat is closed
      window.$crisp?.push(["do", "chat:hide"]);
    };

    window.$crisp.push(["on", "chat:opened", handleOpened]);
    window.$crisp.push(["on", "chat:closed", handleClosed]);
    window.$crisp.push([
      "on",
      "session:loaded",
      () => {
        setScriptLoaded(true);
        if (isPendingOpenRef.current) {
          isPendingOpenRef.current = false;
          crispHelpers.open();
          setIsOpening(false);
          setIsChatOpen(true);
        }
      },
    ]);
  }, [websiteId, ensureScriptLoaded]);

  const handleToggleChat = useCallback(() => {
    if (isChatOpen) {
      crispHelpers.close();
      setIsChatOpen(false);
      setIsOpening(false);
      isPendingOpenRef.current = false;
      return;
    }

    // Prevent multiple rapid clicks while opening
    if (isOpening) return;

    // If script is blocked by adblocker/browser extension, redirect cleanly to Support Center
    if (scriptBlocked) {
      navigate("/support");
      return;
    }

    // If Crisp is already available, open immediately
    if (crispHelpers.isAvailable() || scriptLoaded) {
      const success = crispHelpers.open();
      if (success) {
        setIsChatOpen(true);
        return;
      }
    }

    // If still initializing, indicate opening state and queue open
    setIsOpening(true);
    isPendingOpenRef.current = true;
    ensureScriptLoaded();

    // Timeout safety: if Crisp does not respond within 4.5s, fallback cleanly to Support page
    setTimeout(() => {
      if (isPendingOpenRef.current) {
        isPendingOpenRef.current = false;
        setIsOpening(false);
        navigate("/support");
      }
    }, 4500);
  }, [
    isChatOpen,
    isOpening,
    scriptBlocked,
    scriptLoaded,
    navigate,
    ensureScriptLoaded,
  ]);

  return (
    <button
      type="button"
      onClick={handleToggleChat}
      aria-label="Talk to ArcadeVerse Support"
      title="Talk to Support"
      className={cn(
        "group fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[999] flex items-center justify-center",
        "h-14 w-14 sm:h-15 sm:w-15 rounded-full p-0.5",
        "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500",
        "shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50",
        "hover:scale-105 active:scale-95 transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple focus-visible:ring-offset-2",
        // When chat is open, cleanly hide launcher button so it never covers Crisp's send or text area
        isChatOpen
          ? "opacity-0 pointer-events-none scale-90"
          : "opacity-100 pointer-events-auto scale-100",
      )}
    >
      {/* Inner round container with dark backdrop */}
      <div className="relative flex h-full w-full items-center justify-center rounded-full bg-[#0c1222] p-1 overflow-hidden">
        {isOpening ? (
          <Loader2 className="h-6 w-6 text-white animate-spin" />
        ) : (
          <img
            src="/icon-192.png"
            alt="ArcadeVerse Support"
            className="h-full w-full rounded-full object-cover select-none transition-transform duration-300 group-hover:scale-110"
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = "/apple-touch-icon.png";
            }}
          />
        )}
      </div>

      {/* Online live presence indicator pulse (visible when closed and not loading) */}
      {!isChatOpen && !isOpening && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-[#0c1222] bg-emerald-500 shadow-xs" />
        </span>
      )}

      {/* Floating tooltip label on hover for desktop */}
      <div className="pointer-events-none absolute right-16 hidden sm:flex items-center gap-1.5 rounded-xl border border-border/80 bg-surface-elevated/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {isOpening ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin text-indigo-400" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Talk to Support</span>
          </>
        )}
      </div>
    </button>
  );
}

// Robust helper functions to control Crisp programmatically across any page
export const crispHelpers = {
  isAvailable: (): boolean => {
    return (
      typeof window !== "undefined" &&
      Array.isArray(window.$crisp) &&
      typeof (window.$crisp as unknown as { is?: unknown })?.is === "function"
    );
  },
  show: () => {
    if (typeof window !== "undefined" && window.$crisp) {
      window.$crisp.push(["do", "chat:show"]);
    }
  },
  hide: () => {
    if (typeof window !== "undefined" && window.$crisp) {
      window.$crisp.push(["do", "chat:hide"]);
    }
  },
  open: (): boolean => {
    if (typeof window !== "undefined" && window.$crisp) {
      window.$crisp.push(["do", "chat:show"]);
      window.$crisp.push(["do", "chat:open"]);
      return true;
    }
    return false;
  },
  close: () => {
    if (typeof window !== "undefined" && window.$crisp) {
      window.$crisp.push(["do", "chat:close"]);
      window.$crisp.push(["do", "chat:hide"]);
    }
  },
  setMessage: (message: string) => {
    if (typeof window !== "undefined" && window.$crisp) {
      window.$crisp.push(["set", "message:text", [message]]);
    }
  },
  sendMessage: (message: string) => {
    if (typeof window !== "undefined" && window.$crisp) {
      window.$crisp.push(["do", "message:send", ["text", message]]);
    }
  },
  setUserEmail: (email: string) => {
    if (typeof window !== "undefined" && window.$crisp) {
      window.$crisp.push(["set", "user:email", [email]]);
    }
  },
  setUserNickname: (nickname: string) => {
    if (typeof window !== "undefined" && window.$crisp) {
      window.$crisp.push(["set", "user:nickname", [nickname]]);
    }
  },
};
