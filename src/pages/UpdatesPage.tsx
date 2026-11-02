import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type UpdateItem, updatesData } from "@/data/updates";
import { useNotification } from "@/lib/notification-provider";
import {
  IconCalendar,
  IconExternalLink,
  IconSparkles,
  IconUser,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 + i * 0.04,
      duration: 0.3,
    },
  }),
};

export function UpdatesPage() {
  const { notifyNewUpdate } = useNotification();
  const [selectedUpdate, setSelectedUpdate] = useState<UpdateItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const lastSeenUpdate = localStorage.getItem("lastSeenUpdate");
    const lastSeenDate = lastSeenUpdate ? new Date(lastSeenUpdate) : null;

    const hasNewUpdates = updatesData.some((update) => {
      const updateDate = new Date(update.date);
      return !lastSeenDate || updateDate > lastSeenDate;
    });

    if (hasNewUpdates && updatesData.length > 0) {
      const latestUpdate = updatesData[0];
      notifyNewUpdate(latestUpdate.title, latestUpdate.description);
    }

    if (updatesData.length > 0) {
      localStorage.setItem(
        "lastSeenUpdate",
        new Date(updatesData[0].date).toISOString(),
      );
    }
  }, [notifyNewUpdate]);

  const handleReadMore = (update: UpdateItem) => {
    setSelectedUpdate(update);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
      <Helmet>
        <title>Latest Updates | ArcadeVerse</title>
        <meta
          name="description"
          content="Latest Google Cloud Arcade announcements, updates, official swag drops, and tier blueprints."
        />
      </Helmet>

      {/* Hero Header matching Facilitator style */}
      <header
        aria-label="Updates Hero Header"
        className="flex flex-col space-y-4 sm:space-y-5 justify-center items-center relative z-10 pt-4 pb-8 sm:pt-6 sm:pb-12 text-center"
      >
        {/* Eyebrow Label */}
        <div className="font-bold items-center font-mono text-xs tracking-wider flex items-center justify-center gap-x-2 text-slate-500 dark:text-slate-400 uppercase">
          <span>ARCADEVERSE</span>
          <span>•</span>
          <span>UPDATES</span>
        </div>

        {/* Main Title */}
        <h1 className="font-heading max-w-4xl mx-auto text-center text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-foreground leading-tight tracking-tight">
          Latest Updates
        </h1>

        {/* Supporting Description */}
        <div className="max-w-2xl sm:max-w-3xl mx-auto text-center">
          <p className="font-sans text-center text-base sm:text-[18px] text-muted-foreground leading-relaxed font-normal">
            Official announcements, swag drops, facilitator bonus milestones,
            and seasonal updates directly from Google Skills Arcade.
          </p>
        </div>
      </header>

      <section aria-label="Official Updates List">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {updatesData.map((update, index) => (
            <motion.div
              key={update.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="flex"
            >
              <Card className="google-card overflow-hidden h-full flex flex-col justify-between hover:shadow-xl transition-all duration-200 border border-border/80 hover:border-indigo-500/40 w-full group">
                <div>
                  <div className="relative h-52 overflow-hidden bg-slate-900/5 dark:bg-slate-950/60 flex items-center justify-center border-b border-border/60">
                    <img
                      src={update.image}
                      alt={update.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      width="400"
                      height="208"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <Badge
                        className={`text-white shadow-sm font-medium ${
                          update.category === "Google Skills Arcade"
                            ? "bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        <IconSparkles size={13} className="mr-1 shrink-0" />
                        <span>{update.category}</span>
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center text-xs text-muted-foreground mb-2.5">
                      <div className="flex items-center gap-1 font-mono">
                        <IconCalendar
                          size={13}
                          className="shrink-0 text-slate-400"
                        />
                        <span>{update.date}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold leading-snug tracking-tight text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {update.title}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                      {update.description}
                    </CardDescription>
                  </CardHeader>
                </div>

                <CardFooter className="p-5 pt-2 flex flex-col gap-2.5">
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium shadow-sm transition-colors text-xs sm:text-sm py-2"
                    onClick={() => handleReadMore(update)}
                  >
                    Read More
                  </Button>
                  {update.sourceUrl && (
                    <a
                      href={update.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-0.5 group/link"
                    >
                      <span>Read original post</span>
                      <IconExternalLink
                        size={12}
                        className="shrink-0 transition-transform group-hover/link:translate-x-0.5"
                      />
                    </a>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detailed Post Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col rounded-2xl border border-border shadow-2xl bg-card">
            {selectedUpdate && (
              <>
                <div className="relative w-full shrink-0 bg-slate-900/10 dark:bg-slate-950/80 max-h-64 sm:max-h-72 overflow-hidden flex items-center justify-center border-b border-border">
                  <img
                    src={selectedUpdate.image}
                    alt={selectedUpdate.title}
                    className="w-full h-full max-h-64 sm:max-h-72 object-contain mx-auto"
                    loading="lazy"
                    width="600"
                    height="300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={`text-white shadow-sm text-xs ${
                        selectedUpdate.category === "Google Skills Arcade"
                          ? "bg-indigo-600 dark:bg-indigo-500"
                          : "bg-blue-600"
                      }`}
                    >
                      {selectedUpdate.category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto">
                  <DialogHeader className="space-y-2 text-left">
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1 font-mono">
                        <IconCalendar size={14} className="shrink-0" />
                        <span>{selectedUpdate.date}</span>
                      </div>
                      {selectedUpdate.author && (
                        <div className="flex items-center gap-1">
                          <IconUser size={14} className="shrink-0" />
                          <span>
                            By{" "}
                            <strong className="font-semibold text-foreground">
                              {selectedUpdate.author}
                            </strong>
                          </span>
                        </div>
                      )}
                      {selectedUpdate.attribution && (
                        <span className="text-[11px] font-medium bg-muted px-2 py-0.5 rounded text-muted-foreground">
                          {selectedUpdate.attribution}
                        </span>
                      )}
                    </div>
                    <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
                      {selectedUpdate.title}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground hidden">
                      {selectedUpdate.description}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-foreground/90 space-y-2.5 font-sans pt-1">
                    {selectedUpdate.fullContent}
                  </div>

                  {selectedUpdate.sourceUrl && (
                    <div className="pt-4 mt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <span className="text-muted-foreground">
                        Originally posted by {selectedUpdate.author || "Yugali"}{" "}
                        on{" "}
                        <span className="font-medium text-foreground">
                          {selectedUpdate.attribution ||
                            "Google Developer forums"}
                        </span>
                      </span>
                      <a
                        href={selectedUpdate.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors shrink-0"
                      >
                        <span>Read original post</span>
                        <IconExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
