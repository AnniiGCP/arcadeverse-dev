import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NotificationManager } from "@/lib/notification-manager";
import { useProfile } from "@/lib/profile-context";
import { cn } from "@/lib/utils";
import {
  IconAward,
  IconBadge,
  IconBell,
  IconChevronRight,
  IconHelp,
  IconLayoutDashboard,
  IconMenu2,
  IconSettings,
  IconTrophy,
  IconUser,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbSegment {
  name: string;
  href: string;
  current?: boolean;
}

const dashboardNavItems = [
  {
    name: "Overview",
    icon: <IconLayoutDashboard size={20} />,
    href: "/dashboard",
    description: "Your personal dashboard summary",
  },
  {
    name: "Leaderboard",
    icon: <IconTrophy size={20} />,
    href: "/google-cloud-arcade-leaderboard",
    description: "Global and personal rankings",
  },
  {
    name: "Resources",
    icon: <IconHelp size={20} />,
    href: "/resources",
    description: "Learning materials and guides",
  },
  {
    name: "Settings",
    icon: <IconSettings size={20} />,
    href: "/dashboard/settings",
    description: "Manage your account details",
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { selectedProfile } = useProfile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbSegment[]>([]);

  const currentPage = dashboardNavItems.find(
    (item) =>
      location.pathname === item.href ||
      (item.href !== "/dashboard" && location.pathname.startsWith(item.href)),
  );

  useEffect(() => {
    const paths = location.pathname.split("/").filter(Boolean);
    const breadcrumbItems: BreadcrumbSegment[] = [{ name: "Home", href: "/" }];
    if (paths.length > 0) {
      let currentPath = "";
      paths.forEach((path: string, index: number) => {
        currentPath += `/${path}`;
        const navItem = dashboardNavItems.find(
          (item) => item.href === currentPath,
        );
        const name = navItem
          ? navItem.name
          : path.charAt(0).toUpperCase() + path.slice(1);
        breadcrumbItems.push({
          name,
          href: currentPath,
          current: index === paths.length - 1,
        });
      });
    }
    setBreadcrumbs(breadcrumbItems);
  }, [location.pathname]);

  // Keep the private dashboard out of search indexes (client-side; SPA meta robots)
  useEffect(() => {
    let tag = document.head.querySelector(
      'meta[name="robots"]',
    ) as HTMLMetaElement | null;
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "robots";
      document.head.appendChild(tag);
    }
    tag.content = "noindex, nofollow";

    return () => {
      if (tag) {
        tag.content = "index, follow";
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground w-full max-w-full min-w-0 overflow-x-clip">
      <NotificationManager />
      <Header />
      <main
        id="main-content"
        className="flex-1 w-full max-w-full min-w-0 bg-background text-foreground"
      >
        <div className="h-full w-full min-w-0 bg-background text-foreground">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full min-w-0"
          >
            {children}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
