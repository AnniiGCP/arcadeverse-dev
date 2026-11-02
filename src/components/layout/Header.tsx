import { NotificationPanel } from "@/components/NotificationPanel";
import { ProfileSwitcher } from "@/components/ProfileSwitcher";
import { openCommunityModal } from "@/components/community/CommunityShareModal";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import {
  IconAward,
  IconBell,
  IconHeadset,
  IconHelp,
  IconHome,
  IconLayoutDashboard,
  IconMenu2,
  IconTrophy,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Home", href: "/", icon: IconHome },
  { name: "Dashboard", href: "/dashboard", icon: IconLayoutDashboard },
  { name: "Arcade Facilitator", href: "/arcade-facilitator", icon: IconAward },
  {
    name: "Leaderboard",
    href: "/google-cloud-arcade-leaderboard",
    icon: IconTrophy,
  },
  { name: "Resources", href: "/resources", icon: IconHelp },
  { name: "Updates", href: "/updates", icon: IconBell },
  { name: "Support", href: "/support", icon: IconHeadset },
];

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className="group flex items-center shrink-0"
      aria-label="ArcadeVerse home"
    >
      <img
        src="/images/arcadeverse-logo-clean.png"
        alt="ArcadeVerse"
        width={97}
        height={40}
        style={{ aspectRatio: "1114 / 460" }}
        className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        loading="eager"
        decoding="async"
      />
    </Link>
  );
}

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  // Prevent body scroll and layout shift when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      const scrollY = window.scrollY;
      setScrollPosition(scrollY);

      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.paddingRight = "";
      window.scrollTo(0, scrollPosition);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.paddingRight = "";
    };
  }, [isMenuOpen, scrollPosition]);

  // Shrink / solidify the header once the user scrolls down
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const handleCloseMenu = () => setIsMenuOpen(false);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-border/80 bg-background/80 backdrop-blur-xl"
          : "border-transparent bg-background/40 backdrop-blur-md",
      )}
    >
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface-elevated focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-surface"
      >
        Skip to main content
      </a>
      <div
        className={cn(
          "w-full max-w-full flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 transition-[height] duration-300 ease-out-expo",
          scrolled ? "h-14" : "h-16",
        )}
      >
        {/* Left Side: Mobile Menu Button + Wordmark Logo together on top-left */}
        <div className="flex items-center gap-2 sm:gap-3 xl:flex-1 shrink-0">
          {/* Mobile menu button */}
          <div className="xl:hidden shrink-0">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <IconX className="h-5 w-5" />
                  ) : (
                    <IconMenu2 className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[290px] border-r border-border bg-background-secondary p-0 sm:w-[320px]"
              >
                <div className="flex h-full flex-col overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-border px-6 py-5 pr-12">
                    <Wordmark />
                  </div>

                  <nav className="flex-1 space-y-1 px-3 py-4">
                    {navItems.map((item, index) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.04 * index + 0.05 }}
                        >
                          <Link
                            to={item.href}
                            onClick={handleCloseMenu}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                              active
                                ? "border border-accent-purple/30 bg-accent-purple/15 text-foreground"
                                : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5",
                                active && "text-accent-purple",
                              )}
                            />
                            <span>{item.name}</span>
                          </Link>
                        </motion.div>
                      );
                    })}

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleCloseMenu();
                          openCommunityModal("community");
                        }}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 w-full text-left"
                      >
                        <IconUsers className="h-5 w-5 text-purple-500" />
                        <span>Community & Share</span>
                      </button>
                    </div>
                  </nav>

                  <div className="border-t border-border px-6 py-5">
                    <p className="text-xs text-muted-foreground">
                      Google Cloud Arcade points, badges & progress — all in one
                      place.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Wordmark />
          </div>
        </div>

        {/* Desktop navigation matching Image 3 */}
        <nav className="hidden items-center gap-1 xl:flex shrink-0">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-xl px-3 py-1.5 text-sm font-semibold transition-all whitespace-nowrap",
                  active
                    ? "bg-slate-200/80 dark:bg-slate-800/90 text-slate-900 dark:text-white shadow-xs border border-slate-300/80 dark:border-slate-700/60"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40",
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions matching Image 3: Community -> Profile -> Bell -> ThemeToggle */}
        <div className="hidden items-center gap-2.5 xl:flex xl:flex-1 xl:justify-end shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openCommunityModal("community")}
            className="hidden sm:inline-flex items-center gap-1.5 h-9 rounded-xl border-slate-300 dark:border-slate-700 bg-background/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold px-2.5 text-foreground"
            title="Join Community & Share ArcadeVerse"
            aria-label="Community & Guides"
          >
            <IconUsers className="h-4 w-4 text-purple-500" />
            <span>Community</span>
          </Button>
          <ProfileSwitcher />
          <NotificationPanel />
          <ThemeToggle />
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 xl:hidden shrink-0">
          <ProfileSwitcher />
          <NotificationPanel />
          <ThemeToggle />
        </div>
      </div>

      {/* Progress accent line */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-transparent via-accent-purple/60 to-transparent"
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}
