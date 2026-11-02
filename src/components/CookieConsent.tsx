import { Button } from "@/components/ui/button";
import { IconCheck, IconCookie, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const COOKIE_CONSENT_KEY = "arcadeverse_cookie_consent";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        // Delay slightly for smooth page entrance
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // If localStorage is unavailable, do nothing
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    } catch {}
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "essential");
    } catch {}
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="region"
          aria-label="Cookie preferences"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-[#0c1322]/95 backdrop-blur-xl p-4 sm:p-5 shadow-2xl shadow-indigo-950/20 text-slate-800 dark:text-slate-200"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
              <IconCookie className="h-5 w-5" />
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                We value your privacy
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                ArcadeVerse uses cookies and local storage to remember your
                profile progress, analyze site traffic, and support advertising.
                You can review details in our{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-500"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="text-xs font-semibold h-8 rounded-xl border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300"
            >
              <IconX className="h-3.5 w-3.5 mr-1" />
              Essential Only
            </Button>

            <Button
              size="sm"
              onClick={handleAccept}
              className="text-xs font-semibold h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
            >
              <IconCheck className="h-3.5 w-3.5 mr-1 stroke-[2.5]" />
              Accept All
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CookieConsent;
