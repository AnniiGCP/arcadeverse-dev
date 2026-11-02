import { Button } from "@/components/ui/button";
import { apiPath } from "@/lib/api";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCheck,
  IconHome,
  IconLoader2,
  IconMailOff,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";

export function UnsubscribePage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "already" | "error"
  >(token ? "loading" : "error");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(
        "No unsubscribe token was provided. Please use the link provided in your email.",
      );
      return;
    }

    let isMounted = true;

    async function handleUnsubscribe() {
      try {
        const res = await fetch(apiPath("/api/newsletter/unsubscribe"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token?.trim() }),
        });

        const data = await res.json().catch(() => null);

        if (!isMounted) return;

        if (res.ok && data?.success) {
          if (data.alreadyUnsubscribed) {
            setStatus("already");
            setMessage(
              "You are already unsubscribed from ArcadeVerse updates.",
            );
          } else {
            setStatus("success");
            setMessage("You have been unsubscribed from ArcadeVerse updates.");
          }
        } else {
          setStatus("error");
          setMessage(
            data?.error ||
              data?.message ||
              "Invalid or expired unsubscribe link. If you need help, please contact support.",
          );
        }
      } catch (err: any) {
        if (!isMounted) return;
        setStatus("error");
        setMessage(
          err?.message ||
            "Network error while attempting to unsubscribe. Please try again.",
        );
      }
    }

    handleUnsubscribe();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 sm:py-24">
      <Helmet>
        <title>Unsubscribe from ArcadeVerse Updates | ArcadeVerse</title>
        <meta
          name="description"
          content="Manage your email subscription preferences for ArcadeVerse Google Cloud Arcade updates."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg bg-white/95 dark:bg-[#0c1222]/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 text-center shadow-lg dark:shadow-2xl backdrop-blur-md relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-indigo-500/10 blur-2xl rounded-full pointer-events-none" />

        {/* Loading State */}
        {status === "loading" && (
          <div className="space-y-4 py-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
              <IconLoader2 className="w-8 h-8 animate-spin" />
            </div>
            <h1 className="font-heading font-black text-2xl text-slate-900 dark:text-white">
              Processing Unsubscribe...
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm mx-auto">
              Please wait while we update your email preferences in our records.
            </p>
          </div>
        )}

        {/* Success State */}
        {(status === "success" || status === "already") && (
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <IconCheck className="w-8 h-8 stroke-3" />
            </div>

            <div className="space-y-2">
              <h1 className="font-heading font-black text-2xl text-slate-900 dark:text-white">
                Unsubscribed Successfully
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-md mx-auto">
                {message ||
                  "You have been unsubscribed from ArcadeVerse updates."}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs text-slate-600 dark:text-slate-400 text-left space-y-1.5">
              <p className="font-semibold text-slate-800 dark:text-slate-300">
                Changed your mind?
              </p>
              <p>
                You can resubscribe anytime in the future simply by entering
                your email in the footer of our homepage.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/" className="w-full sm:w-auto">
                <Button className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white font-semibold text-xs px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                  <IconHome className="w-4 h-4" />
                  Return to ArcadeVerse
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-sm">
              <IconAlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="font-heading font-black text-2xl text-slate-900 dark:text-white">
                Unable to Unsubscribe
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-md mx-auto">
                {message}
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs px-5 py-2.5 flex items-center justify-center gap-2"
                >
                  <IconArrowLeft className="w-4 h-4" />
                  Back to Homepage
                </Button>
              </Link>
              <Link to="/support" className="w-full sm:w-auto">
                <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
export default UnsubscribePage;
