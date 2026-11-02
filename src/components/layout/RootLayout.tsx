import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
import { CalculationProvider } from "@/lib/calculation-context";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useEffect } from "react";

import { CommunityShareModal } from "@/components/community/CommunityShareModal";

interface RootLayoutProps {
  children: React.ReactNode;
}

// Font loading (similar to Next.js font optimization)
const loadFonts = () => {
  // Load Google Fonts
  const link = document.createElement("link");
  link.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};

export function RootLayout({ children }: RootLayoutProps) {
  useEffect(() => {
    // Load fonts on mount
    loadFonts();

    // Set up CSS variables for fonts (similar to Next.js font variables)
    document.documentElement.style.setProperty(
      "--font-geist-sans",
      "Inter, system-ui, sans-serif",
    );
    document.documentElement.style.setProperty(
      "--font-geist-mono",
      'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    );

    // Add antialiased class to body
    document.body.classList.add("antialiased");
  }, []);

  return (
    <div className={`font-sans antialiased`}>
      <AuthProvider>
        <CalculationProvider>
          {children}
          <CommunityShareModal />
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </CalculationProvider>
      </AuthProvider>
    </div>
  );
}
