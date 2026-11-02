import { useToast } from "@/components/ui/use-toast";
import {
  generateLegendCardFile,
  renderAndDownloadLegendCard,
} from "@/lib/legendCardCanvas";
import {
  CANONICAL_SITE_URL,
  type LegendCardData,
  generateSocialShareMessage,
  validateLegendCardData,
} from "@/lib/legendCardLogic";
import {
  IconAlertTriangle,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconBrandX,
  IconCheck,
  IconCopy,
  IconDownload,
  IconExternalLink,
  IconShare,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import React, { useState, useEffect, useId } from "react";
import { LegendAchievementCard } from "./LegendAchievementCard";
import { PartyBomberCelebration } from "./PartyBomberCelebration";

interface LegendAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LegendCardData | null;
}

export function LegendAchievementModal({
  isOpen,
  onClose,
  data,
}: LegendAchievementModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharingFile, setIsSharingFile] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [canShareFile, setCanShareFile] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState(0);

  // Fire celebratory confetti every time modal is opened
  useEffect(() => {
    if (isOpen) {
      setBurstTrigger((prev) => prev + 1);
    }
  }, [isOpen]);

  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();
  const titleId = useId();
  const descId = useId();

  // Validate data if present
  const validation = data
    ? validateLegendCardData(data)
    : { isValid: false, errors: ["No data provided"] };

  // Detect Web Share API file support
  useEffect(() => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.canShare === "function"
    ) {
      try {
        const dummyFile = new File(["test"], "test.png", { type: "image/png" });
        setCanShareFile(navigator.canShare({ files: [dummyFile] }));
      } catch {
        setCanShareFile(false);
      }
    }
  }, []);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Handle Download PNG
  const handleDownload = async () => {
    if (!data) return;
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors[0] || "Incomplete card data.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDownloading(true);
      const res = await renderAndDownloadLegendCard(data);
      if (res.success) {
        toast({
          title: "Download Started",
          description: `Saved as ${res.fileName}`,
        });
      } else {
        toast({
          title: "Download Failed",
          description: res.error || "Could not generate card image.",
          variant: "destructive",
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to download image.";
      toast({
        title: "Download Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle Primary Share (Native Web Share API with file or text fallback)
  const [isSharing, setIsSharing] = useState(false);
  const handlePrimaryShare = async () => {
    if (!data || !validation.isValid) return;
    const title = "ArcadeVerse Legend Tier Achievement";
    const text =
      "I've reached Legend Tier on ArcadeVerse! 🏆\n\nTrack and calculate your Google Cloud Arcade progress:\n\nhttps://arcadeverse.vercel.app/";
    const url = CANONICAL_SITE_URL;

    try {
      setIsSharing(true);
      if (typeof navigator !== "undefined" && navigator.share) {
        let sharedWithFile = false;
        if (canShareFile) {
          try {
            const res = await generateLegendCardFile(data);
            if (
              res.file &&
              navigator.canShare &&
              navigator.canShare({ files: [res.file] })
            ) {
              await navigator.share({
                title,
                text,
                files: [res.file],
              });
              sharedWithFile = true;
              toast({ title: "Shared successfully!" });
              return;
            }
          } catch {
            // Fallback to text + URL sharing
          }
        }

        if (!sharedWithFile) {
          await navigator.share({
            title,
            text,
            url,
          });
          toast({ title: "Shared successfully!" });
        }
      } else {
        await handleCopyLink();
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== "AbortError") {
        await handleCopyLink();
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Handle Web Share API with image file
  const handleWebShareFile = async () => {
    if (!data || !validation.isValid) return;

    try {
      setIsSharingFile(true);
      const res = await generateLegendCardFile(data);
      if (!res.file) {
        throw new Error(res.error || "Failed to generate card file.");
      }

      const text = generateSocialShareMessage(data);

      if (navigator.share) {
        await navigator.share({
          title: "ArcadeVerse Legend Tier Achievement",
          text,
          files: [res.file],
        });
        toast({
          title: "Shared successfully!",
        });
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== "AbortError") {
        toast({
          title: "Share Error",
          description:
            err instanceof Error ? err.message : "Failed to share file.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSharingFile(false);
    }
  };

  // Copy share message
  const handleCopyMessage = async () => {
    if (!data) return;
    try {
      const msg = generateSocialShareMessage(data);
      await navigator.clipboard.writeText(msg);
      setCopiedMessage(true);
      toast({
        title: "Message Copied!",
        description:
          "Personalized Legend Tier announcement copied to clipboard.",
      });
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to access clipboard.",
        variant: "destructive",
      });
    }
  };

  // Copy link
  const handleCopyLink = async () => {
    const url = data?.siteUrl || CANONICAL_SITE_URL;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      toast({
        title: "Link Copied!",
        description: url,
      });
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to access clipboard.",
        variant: "destructive",
      });
    }
  };

  // External share intents
  const openShareWindow = (
    platform: "twitter" | "linkedin" | "whatsapp" | "telegram",
  ) => {
    if (!data) return;
    const url = encodeURIComponent(data.siteUrl || CANONICAL_SITE_URL);
    const message = encodeURIComponent(
      generateSocialShareMessage(data, platform),
    );

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${message}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${message}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${url}&text=${message}`;
        break;
    }

    if (shareUrl) {
      window.open(
        shareUrl,
        "_blank",
        "noopener,noreferrer,width=650,height=550",
      );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
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
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Dual Side Confetti Celebration (100% Transparent Lottie SVG + Side Cannons) */}
        {!shouldReduceMotion && (
          <PartyBomberCelebration triggerKey={burstTrigger} />
        )}

        {/* Modal Dialog Card (Crystal Clear Dark Theme - Zero White Overlay) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
          className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-indigo-500/30 bg-[#0c1228] p-5 sm:p-7 shadow-2xl text-white"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors z-50"
            aria-label="Close modal"
          >
            <IconX className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="mb-4 pr-10 relative z-30">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
                <IconSparkles className="h-3.5 w-3.5" />
                <span>LEGEND TIER UNLOCKED!</span>
                <span>•</span>
                <span className="text-amber-200/90 font-mono">
                  120+ Arcade Points
                </span>
              </div>

              {/* Replay Confetti Button */}
              <button
                type="button"
                onClick={() => {
                  setBurstTrigger((p) => p + 1);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/15 hover:bg-purple-500/25 px-2.5 py-0.5 text-xs font-semibold text-purple-200 transition-colors cursor-pointer select-none"
                title="Replay Celebration Confetti"
              >
                <span>🎉 Replay Confetti</span>
              </button>
            </div>
            <h2
              id={titleId}
              className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2"
            >
              🏆 Legend Achievement Card
            </h2>
            <p id={descId} className="text-sm text-slate-300 mt-1">
              You've reached 120+ Arcade Points. Here is your official
              4K-quality ArcadeVerse Legend Tier Achievement Card.
            </p>
          </div>

          {/* Validation Warning / Error if data is incomplete */}
          {!validation.isValid && (
            <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-950/40 p-4 text-red-200">
              <div className="flex items-center gap-2 text-sm font-bold">
                <IconAlertTriangle className="h-5 w-5 text-red-400" />
                <span>
                  Unable to generate card because profile data is incomplete
                </span>
              </div>
              <ul className="mt-2 list-inside list-disc text-xs text-red-300 space-y-1">
                {validation.errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Live Card Preview (High-DPI Preview) - Click triggers party celebration */}
          {data && validation.isValid && (
            <div
              className="mb-6 rounded-2xl border border-indigo-500/30 bg-black/50 p-2 sm:p-3 shadow-2xl relative z-10 cursor-pointer transition-all hover:scale-[1.008] hover:border-amber-400/50 active:scale-[0.995]"
              onClick={() => setBurstTrigger((c) => c + 1)}
              title="Click card to launch celebration! 🎉"
            >
              <LegendAchievementCard data={data} />
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-6 relative z-20">
            {/* Download Card Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || !validation.isValid}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <IconDownload
                className={`h-4 w-4 ${isDownloading ? "animate-bounce" : ""}`}
              />
              <span>{isDownloading ? "Generating PNG..." : "DOWNLOAD"}</span>
            </button>

            {/* Primary Share Button */}
            <button
              type="button"
              onClick={handlePrimaryShare}
              disabled={isSharing || !validation.isValid}
              className="flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-xl border border-indigo-400/50 bg-indigo-950/80 hover:bg-indigo-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-900/30 transition-all active:scale-98 disabled:opacity-50"
            >
              <IconShare className="h-4 w-4" />
              <span>{isSharing ? "Sharing..." : "SHARE"}</span>
            </button>

            {/* Visit ArcadeVerse Canonical Production Link */}
            <a
              href={data?.siteUrl || CANONICAL_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition-all"
              title="Visit ArcadeVerse"
            >
              <span>🌐 Visit ArcadeVerse</span>
              <IconExternalLink className="h-4 w-4 text-slate-400" />
            </a>
          </div>

          {/* Social Platforms Share Bar */}
          <div className="border-t border-slate-800/80 pt-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Share with your network
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* LinkedIn */}
              <button
                type="button"
                onClick={() => openShareWindow("linkedin")}
                disabled={!validation.isValid}
                className="flex items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-[#0077b5]/15 hover:bg-[#0077b5]/25 p-2.5 text-xs font-semibold text-blue-300 transition-colors disabled:opacity-50"
              >
                <IconBrandLinkedin className="h-4 w-4 text-[#0077b5]" />
                <span>LinkedIn</span>
              </button>

              {/* X / Twitter */}
              <button
                type="button"
                onClick={() => openShareWindow("twitter")}
                disabled={!validation.isValid}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 p-2.5 text-xs font-semibold text-slate-200 transition-colors disabled:opacity-50"
              >
                <IconBrandX className="h-4 w-4 text-white" />
                <span>X (Twitter)</span>
              </button>

              {/* WhatsApp */}
              <button
                type="button"
                onClick={() => openShareWindow("whatsapp")}
                disabled={!validation.isValid}
                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-[#25d366]/15 hover:bg-[#25d366]/25 p-2.5 text-xs font-semibold text-emerald-300 transition-colors disabled:opacity-50"
              >
                <IconBrandWhatsapp className="h-4 w-4 text-[#25d366]" />
                <span>WhatsApp</span>
              </button>

              {/* Telegram */}
              <button
                type="button"
                onClick={() => openShareWindow("telegram")}
                disabled={!validation.isValid}
                className="flex items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-[#229ed9]/15 hover:bg-[#229ed9]/25 p-2.5 text-xs font-semibold text-sky-300 transition-colors disabled:opacity-50"
              >
                <IconBrandTelegram className="h-4 w-4 text-[#229ed9]" />
                <span>Telegram</span>
              </button>
            </div>

            {/* Quick Copy Helpers */}
            <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-800/50">
              <button
                type="button"
                onClick={handleCopyMessage}
                disabled={!validation.isValid}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                {copiedMessage ? (
                  <>
                    <IconCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Message Copied!</span>
                  </>
                ) : (
                  <>
                    <IconCopy className="h-3.5 w-3.5 text-slate-400" />
                    <span>Copy Share Text</span>
                  </>
                )}
              </button>

              <span className="text-slate-600">•</span>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                {copiedLink ? (
                  <>
                    <IconCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <IconCopy className="h-3.5 w-3.5 text-slate-400" />
                    <span>Copy ArcadeVerse Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
